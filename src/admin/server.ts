import {createClient} from '@supabase/supabase-js';
import {createHmac,randomUUID,scryptSync,timingSafeEqual,createHash} from 'node:crypto';
import {readFile,mkdir,writeFile,rename} from 'node:fs/promises';
import {resolve} from 'node:path';
import type {APIContext,AstroCookies} from 'astro';
import {seed,contentSchema,type SiteContent,type Role} from './model';
import {summarize} from './metrics';

export class HttpError extends Error{constructor(public status:number,message:string){super(message);}}
const env=(key:string)=>process.env[key]||String(import.meta.env[key]||'');
export const siteId=()=>env('ADMIN_SITE_ID')||'11111111-1111-4111-8111-111111111111';
export const configured=()=>!!(env('SUPABASE_URL')&&env('SUPABASE_ANON_KEY')&&env('SUPABASE_SERVICE_ROLE_KEY'));
export const localMode=()=>import.meta.env.DEV&&!env('SUPABASE_URL');
const dir=resolve('.local-admin');
export const db=(token?:string,privileged=false)=>{if(!configured())throw new HttpError(503,'Supabase hali ulanmagan. Sozlash yo‘riqnomasini oching.');return createClient(env('SUPABASE_URL'),env(privileged?'SUPABASE_SERVICE_ROLE_KEY':'SUPABASE_ANON_KEY'),{auth:{persistSession:false,autoRefreshToken:false},global:token?{headers:{Authorization:`Bearer ${token}`}}:undefined});};
export type Actor={id:string;email:string;role:Role;token?:string};
const cookieOptions=(ctx:APIContext)=>({httpOnly:true,secure:ctx.url.protocol==='https:',sameSite:'strict' as const,path:'/',maxAge:3600});
async function credentials(){try{return JSON.parse(await readFile(resolve(dir,'credentials.json'),'utf8'));}catch{throw new HttpError(503,'Lokal kirishni yoqish uchun node scripts/setup-local-admin.mjs ishlating.');}}
export function assertLocal(ctx:APIContext){if(!localMode()||!['127.0.0.1','localhost','[::1]'].includes(ctx.url.hostname))throw new HttpError(403,'Lokal rejim faqat localhost uchun.');}
export async function login(ctx:APIContext,email:string,password:string){
 if(localMode()){
  assertLocal(ctx);const c=await credentials();const expected=Buffer.from(c.hash,'hex'),actual=scryptSync(password,c.salt,64);
  if(email!==c.email||!timingSafeEqual(actual,expected))throw new HttpError(401,'Email yoki parol noto‘g‘ri.');
  const payload=Buffer.from(JSON.stringify({exp:Date.now()+3600000,nonce:randomUUID()})).toString('base64url');
  ctx.cookies.set('bm_local',`${payload}.${createHmac('sha256',c.secret).update(payload).digest('base64url')}`,cookieOptions(ctx));return;
 }
 const {data,error}=await db().auth.signInWithPassword({email,password});
 if(error||!data.session)throw new HttpError(401,'Email yoki parol noto‘g‘ri.');
 const client=db(data.session.access_token);const {data:membership}=await client.from('memberships').select('role').eq('site_id',siteId()).eq('user_id',data.user.id).maybeSingle();
 if(!membership)throw new HttpError(403,'Bu salon uchun ruxsat berilmagan.');
 ctx.cookies.set('bm_access',data.session.access_token,cookieOptions(ctx));ctx.cookies.set('bm_refresh',data.session.refresh_token,{...cookieOptions(ctx),maxAge:604800});
}
export async function actor(ctx:APIContext,allowAal1=false):Promise<Actor>{
 if(localMode()){
  assertLocal(ctx);const raw=ctx.cookies.get('bm_local')?.value||'';const [payload,signature]=raw.split('.');if(!payload||!signature)throw new HttpError(401,'Admin hisobiga kiring.');
  const c=await credentials();const a=Buffer.from(signature),b=Buffer.from(createHmac('sha256',c.secret).update(payload).digest('base64url'));
  if(a.length!==b.length||!timingSafeEqual(a,b))throw new HttpError(401,'Sessiya tugagan.');
  try{if(JSON.parse(Buffer.from(payload,'base64url').toString()).exp<Date.now())throw new Error();}catch{throw new HttpError(401,'Sessiya tugagan.');}
  return{id:'local-owner',email:c.email,role:'owner'};
 }
 let token=ctx.cookies.get('bm_access')?.value||'';let result=await db().auth.getUser(token);
 if(result.error){const refresh=ctx.cookies.get('bm_refresh')?.value;if(refresh){const {data,error}=await db().auth.refreshSession({refresh_token:refresh});if(!error&&data.session){token=data.session.access_token;ctx.cookies.set('bm_access',token,cookieOptions(ctx));ctx.cookies.set('bm_refresh',data.session.refresh_token,{...cookieOptions(ctx),maxAge:604800});result=await db().auth.getUser(token);}}}
 if(result.error||!result.data.user)throw new HttpError(401,'Admin hisobiga kiring.');
 const {data,error}=await db(token).from('memberships').select('role').eq('site_id',siteId()).eq('user_id',result.data.user.id).maybeSingle();
 if(error||!data)throw new HttpError(403,'Salon uchun ruxsat yo‘q.');
 const user:Actor={id:result.data.user.id,email:result.data.user.email||'',role:data.role,token};
 if(!allowAal1&&(await mfaState(user)).required)throw new HttpError(403,'Ikki bosqichli tasdiqlash talab qilinadi. Admin hisobiga qayta kiring.');
 return user;
}
export async function mfaState(user:Actor){
 if(localMode()||user.role!=='owner')return{required:false,factorId:null};
 const {data}=await db().auth.getUser(user.token);const factor=data.user?.factors?.find(f=>f.factor_type==='totp'&&f.status==='verified');
 let aal='aal1';try{aal=JSON.parse(Buffer.from(user.token!.split('.')[1],'base64url').toString()).aal;}catch{}
 return{required:!!factor&&aal!=='aal2',factorId:factor?.id||null};
}
export function permit(user:Actor,roles:Role[]){if(!roles.includes(user.role))throw new HttpError(403,'Bu amal uchun ruxsat yo‘q.');}
export function sameOrigin(ctx:APIContext){if(ctx.request.headers.get('origin')!==ctx.url.origin)throw new HttpError(403,'So‘rov manbasi rad etildi.');}
export function logout(cookies:AstroCookies){for(const name of ['bm_local','bm_access','bm_refresh'])cookies.delete(name,{path:'/'});}
type Release={id:string;createdAt:string;author:string;content:SiteContent};
export type RecordRow=Record<string,any>;
type State={draft:SiteContent;published:SiteContent;revision:number;publishedRevision:number;releases:Release[];leads:RecordRow[];events:RecordRow[];audit:RecordRow[];outbox:RecordRow[]};
export async function localState():Promise<State>{try{const state=JSON.parse(await readFile(resolve(dir,'state.json'),'utf8'));state.draft=contentSchema.parse(state.draft);state.published=contentSchema.parse(state.published);return state;}catch(error:any){if(error.code!=='ENOENT')throw error;const content=seed();return{draft:content,published:content,revision:0,publishedRevision:0,releases:[],leads:[],events:[],audit:[],outbox:[]};}}
let queue:Promise<any>=Promise.resolve();
export async function mutateLocal<T>(operation:(state:State)=>T|Promise<T>):Promise<T>{
 const task=queue.then(async()=>{await mkdir(dir,{recursive:true});const state=await localState();const result=await operation(state);const tmp=resolve(dir,`${randomUUID()}.tmp`);await writeFile(tmp,JSON.stringify(state),{mode:0o600});await rename(tmp,resolve(dir,'state.json'));return result;});queue=task.catch(()=>{});return task;
}
export async function contentState(user:Actor){
 if(localMode()){const s=await localState();return{draft:s.draft,published:s.published,revision:s.revision,publishedRevision:s.publishedRevision};}
 const {data,error}=await db(user.token).from('site_content').select('draft,published,revision,published_revision').eq('site_id',siteId()).single();if(error)throw new HttpError(503,'Kontent bazasi mavjud emas. Migratsiya va importni tekshiring.');return{draft:data.draft as SiteContent,published:data.published as SiteContent,revision:data.revision,publishedRevision:data.published_revision};
}
export async function publicContent(){
 if(localMode())return (await localState()).published;
 if(!configured())return seed();
 const {data,error}=await db().from('published_sites').select('content').eq('site_id',siteId()).single();if(error||!data)throw new HttpError(503,'Sayt ma’lumotlari vaqtincha yuklanmadi.');return contentSchema.parse(data.content);
}
export async function saveDraft(user:Actor,content:SiteContent,revision:number){
 permit(user,['owner','editor']);
 if(localMode())return mutateLocal(s=>{if(s.revision!==revision)throw new HttpError(409,'Boshqa oynada o‘zgarish bor. Qayta yuklang.');s.draft=content;s.revision++;s.audit.unshift({id:randomUUID(),action:'draft_saved',actor:user.email,createdAt:new Date().toISOString()});return s.revision;});
 const {data,error}=await db(user.token).rpc('save_site_draft',{p_site:siteId(),p_content:content,p_revision:revision});if(error)throw new HttpError(error.message.includes('conflict')?409:503,'Qoralama saqlanmadi. Versiyani tekshiring.');return data as number;
}
export async function publish(user:Actor,revision:number,rollbackId?:string){
 permit(user,['owner']);
 if(localMode())return mutateLocal(s=>{if(s.revision!==revision)throw new HttpError(409,'Kontent versiyasi o‘zgargan.');const selected=rollbackId?s.releases.find(r=>r.id===rollbackId):null;if(rollbackId&&!selected)throw new HttpError(404,'Versiya topilmadi.');s.releases.unshift({id:randomUUID(),createdAt:new Date().toISOString(),author:user.email,content:s.published});s.published=structuredClone(selected?.content||s.draft);s.publishedRevision++;s.audit.unshift({id:randomUUID(),action:rollbackId?'rollback':'published',actor:user.email,createdAt:new Date().toISOString()});return s.publishedRevision;});
 const {data,error}=await db(user.token).rpc('publish_site',{p_site:siteId(),p_revision:revision,p_rollback:rollbackId||null});if(error)throw new HttpError(error.message.includes('conflict')?409:503,'Nashr qilish bajarilmadi.');return data as number;
}
export async function rows(user:Actor,table:'leads'|'analytics_events'|'audit_log'|'content_releases'|'notification_outbox'):Promise<RecordRow[]>{
 if(localMode()){const s=await localState();return ({leads:s.leads,analytics_events:s.events,audit_log:s.audit,content_releases:s.releases,notification_outbox:s.outbox})[table];}
 const {data,error}=await db(user.token).from(table).select('*').eq('site_id',siteId()).order('createdAt',{ascending:false}).limit(table==='analytics_events'?20000:1000);if(error)throw new HttpError(503,'Ma’lumotlar yuklanmadi.');return data||[];
}
export async function addPublic(table:'leads'|'analytics_events',row:RecordRow){
 if(localMode())return mutateLocal(s=>{const list=table==='leads'?s.leads:s.events;const existing=list.find(r=>r.id===row.id);if(existing)return existing;list.unshift(row);return row;});
 const {data,error}=await db(undefined,true).from(table).upsert({...row,site_id:siteId()},{onConflict:'site_id,id',ignoreDuplicates:true}).select().maybeSingle();if(error)throw new HttpError(503,'Ma’lumot saqlanmadi. Qayta urinib ko‘ring.');return data||row;
}
export async function updateLead(user:Actor,id:string,patch:RecordRow){
 permit(user,['owner','manager']);
 if(localMode())return mutateLocal(s=>{const row=s.leads.find(l=>l.id===id);if(!row)throw new HttpError(404,'Zayavka topilmadi.');row.history??=[];row.history.push({at:new Date().toISOString(),by:user.email,status:patch.status});Object.assign(row,patch);s.audit.unshift({id:randomUUID(),action:'lead_updated',actor:user.email,createdAt:new Date().toISOString()});return row;});
 const {data,error}=await db(user.token).rpc('update_site_lead',{p_site:siteId(),p_id:id,p_patch:patch});if(error)throw new HttpError(503,'Zayavka yangilanmadi.');return data;
}
const buckets=new Map<string,{n:number;expires:number}>();
export async function rate(ctx:APIContext,category:string,limit:number,windowSeconds=60){
 let address='unknown';try{address=ctx.clientAddress||'unknown';}catch{}
 const key=createHash('sha256').update(`${category}:${address}`).digest('hex');
 if(!localMode()&&configured()){const {data,error}=await db(undefined,true).rpc('consume_rate_limit',{p_key:key,p_limit:limit,p_window:windowSeconds});if(error)throw new HttpError(503,'Himoya xizmati vaqtincha mavjud emas.');if(!data)throw new HttpError(429,'Ko‘p urinish. Birozdan so‘ng qayta urinib ko‘ring.');return;}
 if(buckets.size>10000)for(const [k,v]of buckets)if(v.expires<Date.now())buckets.delete(k);
 const old=buckets.get(key);if(!old||old.expires<Date.now())buckets.set(key,{n:1,expires:Date.now()+windowSeconds*1000});else{old.n++;if(old.n>limit)throw new HttpError(429,'Ko‘p urinish. Biroz kuting.');}
}
export async function audit(user:Actor,action:string){if(localMode())return mutateLocal(s=>{s.audit.unshift({id:randomUUID(),action,actor:user.email,createdAt:new Date().toISOString()});});const {error}=await db(user.token).from('audit_log').insert({site_id:siteId(),action,actor:user.email});if(error)throw new HttpError(503,'Amal tarixini saqlash bajarilmadi.');}
export async function notification(lead:RecordRow){
 if(localMode())return;
 const client=db(undefined,true);await client.from('notification_outbox').upsert({site_id:siteId(),lead_id:lead.id,status:'pending'},{onConflict:'site_id,lead_id',ignoreDuplicates:true});
}
export function serverEnv(key:string){return env(key);}
export async function report(user:Actor,from:string,to:string){
 permit(user,['owner','manager']);if(localMode()){const s=await localState();return{...summarize(s.events,s.leads,from,to),newLeads:s.leads.filter(l=>l.status==='new').length};}
 const {data,error}=await db(user.token).rpc('site_analytics',{p_site:siteId(),p_from:from,p_to:to});if(error||!data)throw new HttpError(503,'Hisobot yuklanmadi. 002_reports.sql migratsiyasini tekshiring.');return data;
}
export async function leadPage(user:Actor,offset:number,status:string,search:string){
 permit(user,['owner','manager']);const limit=50;
 if(localMode()){const all=(await localState()).leads.filter(l=>(!status||l.status===status)&&`${l.name} ${l.phone} ${l.serviceLabel}`.toLowerCase().includes(search.toLowerCase()));return{items:all.slice(offset,offset+limit),total:all.length,offset,limit};}
 let q=db(user.token).from('leads').select('*',{count:'exact'}).eq('site_id',siteId());if(status)q=q.eq('status',status);
 const term=search.replace(/[^\p{L}\p{N}\s+]/gu,'').slice(0,60);if(term)q=q.or(`name.ilike.%${term}%,phone.ilike.%${term}%,serviceLabel.ilike.%${term}%`);
 const {data,error,count}=await q.order('createdAt',{ascending:false}).range(offset,offset+limit-1);if(error)throw new HttpError(503,'Zayavkalar yuklanmadi.');return{items:data||[],total:count||0,offset,limit};
}
export async function exportLeads(user:Actor):Promise<RecordRow[]>{
 permit(user,['owner']);if(localMode())return (await localState()).leads;
 const client=db(user.token),items:RecordRow[]=[],cutoff=new Date().toISOString();
 for(let offset=0;;offset+=1000){
  const {data,error}=await client.from('leads').select('id,createdAt,name,phone,serviceLabel,date,time,status').eq('site_id',siteId()).lte('createdAt',cutoff).order('createdAt',{ascending:true}).order('id',{ascending:true}).range(offset,offset+999);
  if(error)throw new HttpError(503,'Eksport to‘liq yuklanmadi. Qayta urinib ko‘ring.');items.push(...(data||[]));if(!data||data.length<1000)break;
 }
 return items;
}
