import {createClient} from '@supabase/supabase-js';
import {existsSync} from 'node:fs';
import {mkdir,readFile,writeFile,copyFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {buildSync} from 'esbuild';
if(existsSync('.env'))process.loadEnvFile('.env');
const dest=resolve('.local-admin','backups',new Date().toISOString().replaceAll(':','-'));
await mkdir(dest,{recursive:true});
const {SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,ADMIN_SITE_ID='11111111-1111-4111-8111-111111111111'}=process.env;
if(!SUPABASE_URL){
 let state;try{state=await readFile('.local-admin/state.json');}catch(e){if(e.code!=='ENOENT')throw e;const code=buildSync({entryPoints:['src/admin/model.ts'],bundle:true,platform:'node',format:'esm',write:false}).outputFiles[0].text;const {seed}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));const content=seed();state=JSON.stringify({draft:content,published:content,revision:0,publishedRevision:0,releases:[],leads:[],events:[],audit:[],outbox:[]});}await writeFile(resolve(dest,'state.json'),state,{mode:0o600});await mkdir(resolve(dest,'media'),{recursive:true});
 for(const name of await readdir('.local-admin/media').catch(()=>[]))if(/^[a-f0-9-]+-(480|960|1440)\.webp$/.test(name))await copyFile(resolve('.local-admin','media',name),resolve(dest,'media',name));
}else{
 if(!SUPABASE_SERVICE_ROLE_KEY)throw new Error('Server key is required for a private backup.');
 const db=createClient(SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});const backup={siteId:ADMIN_SITE_ID,createdAt:new Date().toISOString(),tables:{}};
 for(const table of ['site_content','published_sites','content_releases','memberships','leads','analytics_events','audit_log','notification_outbox']){
  const rows=[];for(let offset=0;;offset+=1000){const {data,error}=await db.from(table).select('*').eq('site_id',ADMIN_SITE_ID).range(offset,offset+999);if(error)throw new Error(`Backup query failed: ${table}`);rows.push(...data);if(data.length<1000)break;}backup.tables[table]=rows;
 }
 await writeFile(resolve(dest,'database.json'),JSON.stringify(backup),{mode:0o600});await mkdir(resolve(dest,'media'),{recursive:true});
 const names=[];for(let offset=0;;offset+=1000){const {data,error}=await db.storage.from('salon-media').list(ADMIN_SITE_ID,{limit:1000,offset,sortBy:{column:'name',order:'asc'}});if(error)throw new Error('Storage listing failed.');names.push(...data.map(x=>x.name));if(data.length<1000)break;}
 for(const name of names){if(!/^[a-f0-9-]+-(480|960|1440)\.webp$/.test(name))continue;const {data,error}=await db.storage.from('salon-media').download(`${ADMIN_SITE_ID}/${name}`);if(error||!data)throw new Error('A media file could not be backed up.');await writeFile(resolve(dest,'media',name),Buffer.from(await data.arrayBuffer()));}
}
await writeFile(resolve(dest,'COMPLETE.txt'),'Backup finished. Keep this folder private; it contains customer data. Auth passwords/tokens are not included.');
console.log('Private backup completed inside .local-admin/backups. Restore must be tested separately; auth users are managed by Supabase.');
