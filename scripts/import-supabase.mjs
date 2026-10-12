import {buildSync} from 'esbuild';
import {createClient} from '@supabase/supabase-js';
import {existsSync} from 'node:fs';
if(existsSync('.env'))process.loadEnvFile('.env');
const {SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,ADMIN_OWNER_EMAIL,ADMIN_SITE_ID='11111111-1111-4111-8111-111111111111'}=process.env;
if(!SUPABASE_URL||!SUPABASE_SERVICE_ROLE_KEY||!ADMIN_OWNER_EMAIL)throw new Error('Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and ADMIN_OWNER_EMAIL in .env. No keys should be sent in chat.');
const code=buildSync({entryPoints:['src/admin/model.ts'],bundle:true,platform:'node',format:'esm',write:false}).outputFiles[0].text;
const {seed}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const db=createClient(SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
let owner;for(let page=1;page<=100&&!owner;page++){const r=await db.auth.admin.listUsers({page,perPage:100});if(r.error)throw new Error('Auth users could not be read.');owner=r.data.users.find(u=>u.email?.toLowerCase()===ADMIN_OWNER_EMAIL.toLowerCase());if(r.data.users.length<100)break;}
if(!owner)throw new Error('Create the owner account in Supabase Authentication first.');
const {data:existing,error}=await db.from('site_content').select('site_id').eq('site_id',ADMIN_SITE_ID).maybeSingle();if(error)throw new Error('Run 001_admin.sql before import.');
if(existing)throw new Error('Content already exists. Import refuses to overwrite drafts or published content.');
const content=seed();
const initialized=await db.rpc('initialize_site',{p_site:ADMIN_SITE_ID,p_owner:owner.id,p_content:content});if(initialized.error)throw new Error('Atomic import failed. Run all migrations and confirm owner. Existing content was not overwritten.');
console.log('Initial content and owner membership imported. Privileged keys were not printed.');
