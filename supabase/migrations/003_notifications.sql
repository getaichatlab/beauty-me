begin;
alter table public.notification_outbox add column last_attempt timestamptz;
create or replace function public.claim_notifications(p_site uuid) returns setof public.notification_outbox language sql security definer set search_path='' as $$
with selected as(select id from public.notification_outbox where site_id=p_site and attempts<5 and (status='pending' or (status='processing' and last_attempt<now()-interval '10 minutes')) order by "createdAt" for update skip locked limit 20)
update public.notification_outbox o set status='processing',attempts=attempts+1,last_attempt=now() from selected s where o.id=s.id returning o.*;
$$;
revoke all on function public.claim_notifications(uuid) from public,anon,authenticated;
grant execute on function public.claim_notifications(uuid) to service_role;
commit;
