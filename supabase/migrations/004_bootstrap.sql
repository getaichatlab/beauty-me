begin;
create or replace function public.initialize_site(p_site uuid,p_owner uuid,p_content jsonb) returns void language plpgsql security definer set search_path='' as $$
declare owner_email text;begin
 select email into owner_email from auth.users where id=p_owner;if owner_email is null then raise exception 'owner missing';end if;
 if exists(select 1 from public.site_content where site_id=p_site) then raise exception 'site exists';end if;
 insert into public.site_content(site_id,draft,published) values(p_site,p_content,p_content);
 insert into public.published_sites(site_id,content) values(p_site,p_content);
 insert into public.memberships(site_id,user_id,email,role) values(p_site,p_owner,owner_email,'owner');
end;$$;
revoke all on function public.initialize_site(uuid,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.initialize_site(uuid,uuid,jsonb) to service_role;
commit;
