begin;
create or replace function public.site_analytics(p_site uuid,p_from date,p_to date) returns jsonb language sql stable security invoker set search_path='' as $$
with e as(select * from public.analytics_events where site_id=p_site and "createdAt">=p_from::timestamp at time zone 'Asia/Tashkent' and "createdAt"<(p_to+1)::timestamp at time zone 'Asia/Tashkent'),
l as(select * from public.leads where site_id=p_site and status<>'spam' and "createdAt">=p_from::timestamp at time zone 'Asia/Tashkent' and "createdAt"<(p_to+1)::timestamp at time zone 'Asia/Tashkent'),
d as(select to_char("createdAt" at time zone 'Asia/Tashkent','YYYY-MM-DD') key,count(*) n from e where name='page_view' group by 1),
p as(select path key,count(*) n from e where name='page_view' group by 1),
s as(select coalesce(nullif(utm->>'utm_source',''),nullif(referrer,''),'To‘g‘ridan-to‘g‘ri / noma’lum') key,count(*) n from e where name='page_view' group by 1)
select jsonb_build_object(
 'pageViews',(select count(*) from e where name='page_view'),'sessions',(select count(distinct "sessionId") from e),
 'telegram',(select count(*) from e where name='telegram_click'),'phone',(select count(*) from e where name='phone_click'),
 'starts',(select count(distinct "sessionId") from e where name='booking_start'),'leads',(select count(*) from l),
 'confirmed',(select count(*) from l where status in ('confirmed','completed')),'newLeads',(select count(*) from public.leads where site_id=p_site and status='new'),
 'conversion',coalesce(round(100.0*(select count(distinct "sessionId") from l where "sessionId" in(select "sessionId" from e))/nullif((select count(distinct "sessionId") from e),0),1),0),
 'byDay',coalesce((select jsonb_object_agg(key,n) from d),'{}'::jsonb),'pages',coalesce((select jsonb_object_agg(key,n) from p),'{}'::jsonb),'sources',coalesce((select jsonb_object_agg(key,n) from s),'{}'::jsonb),
 'device',jsonb_build_object('mobile',(select count(*) from e where name='page_view' and device='mobile'),'desktop',(select count(*) from e where name='page_view' and device='desktop')))
where private.site_role(p_site) in ('owner','manager');
$$;
revoke all on function public.site_analytics(uuid,date,date) from public,anon;
grant execute on function public.site_analytics(uuid,date,date) to authenticated;
commit;
