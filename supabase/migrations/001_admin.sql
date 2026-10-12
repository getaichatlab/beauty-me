begin;
create schema if not exists private;
create table public.memberships(site_id uuid not null,user_id uuid not null references auth.users(id) on delete cascade,email text not null,role text not null check(role in ('owner','manager','editor')),primary key(site_id,user_id));
create or replace function private.site_role(s uuid) returns text language sql stable security definer set search_path='' as $$ select role from public.memberships where site_id=s and user_id=(select auth.uid()) $$;
revoke all on function private.site_role(uuid) from public;grant usage on schema private to authenticated;grant execute on function private.site_role(uuid) to authenticated;
create table public.site_content(site_id uuid primary key,draft jsonb not null,published jsonb not null,revision integer not null default 0,published_revision integer not null default 0);
create table public.published_sites(site_id uuid primary key,content jsonb not null);
create table public.content_releases(id uuid primary key default gen_random_uuid(),site_id uuid not null,content jsonb not null,"createdAt" timestamptz not null default now(),author text not null);
create table public.leads(site_id uuid not null,id uuid not null,name text not null,phone text not null,service text not null,"serviceLabel" text not null,date text not null,time text not null,note text not null default '',lang text not null,consent boolean not null,"sessionId" uuid,utm jsonb not null default '{}',status text not null default 'new' check(status in ('new','contacted','confirmed','completed','cancelled','no_answer','spam')),"internalNote" text not null default '',"assignedTo" text not null default '',history jsonb not null default '[]',"createdAt" timestamptz not null default now(),primary key(site_id,id));
create table public.analytics_events(site_id uuid not null,id uuid not null,"sessionId" uuid not null,"pageId" uuid not null,name text not null check(name in ('page_view','service_view','telegram_click','phone_click','instagram_click','map_click','booking_start','booking_step')),path text not null,lang text not null,placement text not null,device text not null,referrer text not null default '',utm jsonb not null default '{}',"createdAt" timestamptz not null default now(),primary key(site_id,id));
create table public.audit_log(id uuid primary key default gen_random_uuid(),site_id uuid not null,actor text not null,action text not null,"createdAt" timestamptz not null default now());
create table public.notification_outbox(id uuid primary key default gen_random_uuid(),site_id uuid not null,lead_id uuid not null,status text not null default 'pending',attempts integer not null default 0,"createdAt" timestamptz not null default now(),unique(site_id,lead_id));
create table private.rate_limits(key text primary key,count integer not null,expires timestamptz not null);
create index on public.leads(site_id,"createdAt" desc);create index on public.analytics_events(site_id,"createdAt" desc);create index on public.content_releases(site_id,"createdAt" desc);

alter table public.memberships enable row level security;
alter table public.site_content enable row level security;
alter table public.published_sites enable row level security;
alter table public.content_releases enable row level security;
alter table public.leads enable row level security;
alter table public.analytics_events enable row level security;
alter table public.audit_log enable row level security;
alter table public.notification_outbox enable row level security;
revoke all on public.memberships,public.site_content,public.published_sites,public.content_releases,public.leads,public.analytics_events,public.audit_log,public.notification_outbox from anon,authenticated;
grant select on public.published_sites to anon,authenticated;
grant select on public.memberships,public.site_content,public.content_releases,public.leads,public.analytics_events,public.audit_log,public.notification_outbox to authenticated;
grant insert on public.audit_log to authenticated;
grant all on public.memberships,public.site_content,public.published_sites,public.content_releases,public.leads,public.analytics_events,public.audit_log,public.notification_outbox to service_role;
create policy membership_read on public.memberships for select to authenticated using(user_id=(select auth.uid()) or private.site_role(site_id)='owner');
create policy content_read on public.site_content for select to authenticated using(private.site_role(site_id) in ('owner','editor'));
create policy published_read on public.published_sites for select to anon,authenticated using(true);
create policy releases_read on public.content_releases for select to authenticated using(private.site_role(site_id) in ('owner','editor'));
create policy leads_read on public.leads for select to authenticated using(private.site_role(site_id) in ('owner','manager'));
create policy analytics_read on public.analytics_events for select to authenticated using(private.site_role(site_id) in ('owner','manager'));
create policy outbox_read on public.notification_outbox for select to authenticated using(private.site_role(site_id) in ('owner','manager'));
create policy audit_read on public.audit_log for select to authenticated using(private.site_role(site_id)='owner');
create policy audit_insert on public.audit_log for insert to authenticated with check(private.site_role(site_id) in ('owner','editor') and actor=(select auth.jwt()->>'email'));

create or replace function public.save_site_draft(p_site uuid,p_content jsonb,p_revision integer) returns integer language plpgsql security definer set search_path='' as $$
declare n integer;begin
 if private.site_role(p_site) not in ('owner','editor') or private.site_role(p_site) is null then raise exception 'forbidden';end if;
 update public.site_content set draft=p_content,revision=revision+1 where site_id=p_site and revision=p_revision returning revision into n;
 if n is null then raise exception 'conflict';end if;
 insert into public.audit_log(site_id,actor,action) values(p_site,(select email from auth.users where id=auth.uid()),'draft_saved');return n;
end;$$;
create or replace function public.publish_site(p_site uuid,p_revision integer,p_rollback uuid default null) returns integer language plpgsql security definer set search_path='' as $$
declare s public.site_content;n integer;c jsonb;begin
 if private.site_role(p_site) is distinct from 'owner' then raise exception 'forbidden';end if;
 select * into s from public.site_content where site_id=p_site for update;
 if s.revision is distinct from p_revision then raise exception 'conflict';end if;
 c:=s.draft;
 if p_rollback is not null then select content into c from public.content_releases where id=p_rollback and site_id=p_site;if c is null then raise exception 'missing release';end if;end if;
 insert into public.content_releases(site_id,content,author) values(p_site,s.published,(select email from auth.users where id=auth.uid()));
 update public.site_content set published=c,published_revision=published_revision+1 where site_id=p_site returning published_revision into n;
 insert into public.published_sites(site_id,content) values(p_site,c) on conflict(site_id) do update set content=excluded.content;
 insert into public.audit_log(site_id,actor,action) values(p_site,(select email from auth.users where id=auth.uid()),case when p_rollback is null then 'published' else 'rollback' end);return n;
end;$$;
create or replace function public.update_site_lead(p_site uuid,p_id uuid,p_patch jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare r public.leads;begin
 if private.site_role(p_site) not in ('owner','manager') or private.site_role(p_site) is null then raise exception 'forbidden';end if;
 update public.leads set status=p_patch->>'status',"internalNote"=left(p_patch->>'internalNote',2000),"assignedTo"=left(p_patch->>'assignedTo',100),history=history||jsonb_build_array(jsonb_build_object('at',now(),'by',auth.uid(),'status',p_patch->>'status')) where site_id=p_site and id=p_id returning * into r;
 if r.id is null then raise exception 'missing lead';end if;
 insert into public.audit_log(site_id,actor,action) values(p_site,(select email from auth.users where id=auth.uid()),'lead_updated');return to_jsonb(r);
end;$$;
create or replace function public.consume_rate_limit(p_key text,p_limit integer,p_window integer) returns boolean language plpgsql security definer set search_path='' as $$
declare n integer;begin
 delete from private.rate_limits where expires<now()-interval '1 day';
 insert into private.rate_limits(key,count,expires) values(p_key,1,now()+make_interval(secs=>p_window)) on conflict(key) do update set count=case when private.rate_limits.expires<now() then 1 else private.rate_limits.count+1 end,expires=case when private.rate_limits.expires<now() then now()+make_interval(secs=>p_window) else private.rate_limits.expires end returning count into n;return n<=p_limit;
end;$$;
revoke all on function public.save_site_draft(uuid,jsonb,integer),public.publish_site(uuid,integer,uuid),public.update_site_lead(uuid,uuid,jsonb),public.consume_rate_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.save_site_draft(uuid,jsonb,integer),public.publish_site(uuid,integer,uuid),public.update_site_lead(uuid,uuid,jsonb) to authenticated;
grant execute on function public.consume_rate_limit(text,integer,integer) to service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('salon-media','salon-media',false,10485760,array['image/webp']) on conflict(id) do nothing;
create policy salon_media_insert on storage.objects for insert to authenticated with check(bucket_id='salon-media' and private.site_role((storage.foldername(name))[1]::uuid) in ('owner','editor'));
create policy salon_media_read on storage.objects for select to authenticated using(bucket_id='salon-media' and private.site_role((storage.foldername(name))[1]::uuid) in ('owner','editor'));
commit;
