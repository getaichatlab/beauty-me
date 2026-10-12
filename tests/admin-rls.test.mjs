import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import {buildSync} from 'esbuild';
const code=buildSync({entryPoints:['src/admin/model.ts'],bundle:true,platform:'node',format:'esm',write:false}).outputFiles[0].text;
const {seed}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
test('Postgres migration and role policies enforce publish, leads and cross-site boundaries',async()=>{
 const db=new PGlite();
 try{
 await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create schema storage;
 create table auth.users(id uuid primary key,email text);
 create table auth.mfa_factors(id uuid primary key default gen_random_uuid(),user_id uuid,factor_type text,status text);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 create function auth.jwt() returns jsonb language sql stable as $$ select jsonb_build_object('email',current_setting('request.jwt.claim.email',true),'aal',coalesce(nullif(current_setting('request.jwt.claim.aal',true),''),'aal1')) $$;
 grant usage on schema auth to authenticated;grant execute on function auth.uid(),auth.jwt() to authenticated;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;
 create function storage.foldername(text) returns text[] language sql as $$ select string_to_array($1,'/') $$;
 grant usage on schema storage to authenticated;grant select,insert on storage.objects to authenticated;`);
 await db.exec(readFileSync('supabase/migrations/001_admin.sql','utf8'));
 await db.exec(readFileSync('supabase/migrations/002_reports.sql','utf8'));
 await db.exec(readFileSync('supabase/migrations/003_notifications.sql','utf8'));
 await db.exec(readFileSync('supabase/migrations/004_bootstrap.sql','utf8'));
 await db.exec(readFileSync('supabase/migrations/005_owner_mfa.sql','utf8'));
 const site='11111111-1111-4111-8111-111111111111',other='22222222-2222-4222-8222-222222222222';
 const users={owner:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',editor:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',manager:'cccccccc-cccc-4ccc-8ccc-cccccccccccc'};
 for(const [role,id]of Object.entries(users)){await db.query('insert into auth.users values($1,$2)',[id,role+'@test.local']);await db.query('insert into memberships values($1,$2,$3,$4)',[site,id,role+'@test.local',role]);}
 await db.query('insert into site_content(site_id,draft,published) values($1,$2,$2),($3,$2,$2)',[site,seed(),other]);await db.query('insert into published_sites values($1,$2)',[site,seed()]);
 await db.exec('set role anon');assert.equal((await db.query('select * from published_sites')).rows.length,1);await assert.rejects(()=>db.query('select * from leads'));await assert.rejects(()=>db.query('select * from site_content'));await assert.rejects(()=>db.query('select save_site_draft($1,$2,0)',[site,seed()]));
 async function as(role){await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.email',$2,false)",[users[role],role+'@test.local']);await db.exec('set role authenticated');}
 await as('editor');assert.equal((await db.query('select * from site_content')).rows.length,1);assert.equal((await db.query('select * from leads')).rows.length,0);assert.equal((await db.query('select save_site_draft($1,$2,0) as revision',[site,seed()])).rows[0].revision,1);await assert.rejects(()=>db.query('select save_site_draft($1,$2,0)',[site,seed()]));await assert.rejects(()=>db.query('select publish_site($1,1,null)',[site]));await assert.rejects(()=>db.query('select save_site_draft($1,$2,0)',[other,seed()]));
 await db.query("insert into storage.objects(bucket_id,name) values('salon-media',$1)",[site+'/image.webp']);await assert.rejects(()=>db.query("insert into storage.objects(bucket_id,name) values('salon-media',$1)",[other+'/image.webp']));
 await as('manager');assert.equal((await db.query('select * from site_content')).rows.length,0);await assert.rejects(()=>db.query('select save_site_draft($1,$2,1)',[site,seed()]));
 await as('owner');assert.equal((await db.query('select publish_site($1,1,null) as revision',[site])).rows[0].revision,1);assert.equal((await db.query('select * from content_releases')).rows.length,1);assert.equal((await db.query('select site_analytics($1,$2,$3) as report',[site,'2026-01-01','2026-12-31'])).rows[0].report.sessions,0);
 await db.exec('reset role');await db.query("insert into auth.mfa_factors(user_id,factor_type,status) values($1,'totp','verified')",[users.owner]);
 await as('owner');assert.equal((await db.query('select * from memberships')).rows.length,1);assert.equal((await db.query('select * from site_content')).rows.length,0);await assert.rejects(()=>db.query('select publish_site($1,1,null)',[site]));
 await db.query("select set_config('request.jwt.claim.aal','aal2',false)");assert.equal((await db.query('select * from site_content')).rows.length,1);assert.equal((await db.query('select publish_site($1,1,null) as revision',[site])).rows[0].revision,2);
 await db.exec('reset role');console.log('PostgreSQL RLS tests use local PGlite and mocked Supabase auth/storage schema; hosted Supabase is not claimed.');
 }finally{await db.close();}
});
