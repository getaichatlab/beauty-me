begin;
-- Keep the owner membership readable for the login/MFA challenge. Content,
-- customer records, Storage and privileged RPCs all use this role helper.
create or replace function private.site_role(s uuid) returns text
language sql stable security definer set search_path='' as $$
 select case when m.role='owner'
   and exists(select 1 from auth.mfa_factors f where f.user_id=m.user_id and f.factor_type='totp' and f.status='verified')
   and coalesce((select auth.jwt()->>'aal'),'aal1')<>'aal2'
 then null else m.role end
 from public.memberships m where m.site_id=s and m.user_id=(select auth.uid())
$$;
commit;
