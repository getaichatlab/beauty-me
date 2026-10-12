import type {APIRoute} from 'astro';
import {randomUUID} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {z} from 'zod';
import {contentSchema,leadSchema,eventSchema,statuses,validatePublish,mediaSchema} from '../../admin/model';
import {actor,permit,login,logout,sameOrigin,configured,localMode,assertLocal,rate,contentState,saveDraft,publish,rows,addPublic,updateLead,publicContent,db,siteId,HttpError,audit,notification,report,leadPage,mfaState,exportLeads} from '../../admin/server';
export const prerender=false;
const response=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
const parse=async(request:Request)=>{const reader=request.body?.getReader();if(!reader)throw new HttpError(422,'So‘rov bo‘sh.');const chunks:Uint8Array[]=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>2*1024*1024){await reader.cancel();throw new HttpError(413,'So‘rov juda katta.');}chunks.push(value);}try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new HttpError(422,'So‘rov formati noto‘g‘ri.');}};
const allowedUtm=(utm:Record<string,string>)=>Object.fromEntries(Object.entries(utm).filter(([key])=>['utm_source','utm_medium','utm_campaign','utm_content'].includes(key)));
export const ALL:APIRoute=async ctx=>{
 try{
  const action=ctx.params.action||'',method=ctx.request.method;
  if(method==='OPTIONS')return response({},405);
  if(!['GET','HEAD'].includes(method))sameOrigin(ctx);
  if(localMode())assertLocal(ctx);
  if(action==='auth/session'&&method==='GET'){if(!localMode()&&!configured())return response({user:null,mode:'unconfigured'});try{const user=await actor(ctx,true);const mfa=await mfaState(user);return response({user:mfa.required?null:{email:user.email,role:user.role},mfaRequired:mfa.required,factorId:mfa.factorId,mode:localMode()?'local':'supabase'});}catch(e){if(e instanceof HttpError&&e.status===401)return response({user:null,mode:localMode()?'local':configured()?'supabase':'unconfigured'});throw e;}}
  if(action==='auth/mfa/enroll'&&method==='POST'){
   const user=await actor(ctx);permit(user,['owner']);if(localMode())throw new HttpError(409,'2FA Supabase hisobida ishlaydi.');const client=db();const session=await client.auth.setSession({access_token:user.token!,refresh_token:ctx.cookies.get('bm_refresh')?.value||''});if(session.error)throw new HttpError(401,'Sessiya tugagan.');const {data,error}=await client.auth.mfa.enroll({factorType:'totp',friendlyName:'Beauty Me owner'});if(error)throw new HttpError(422,'2FA qo‘shilmadi. Mavjud faktorlarni tekshiring.');return response({factorId:data.id,qr:data.totp.qr_code});
  }
  if(action==='auth/mfa/verify'&&method==='POST'){
   await rate(ctx,'mfa',6,300);const user=await actor(ctx,true);permit(user,['owner']);if(localMode())throw new HttpError(409,'2FA Supabase hisobida ishlaydi.');const {factorId,code}=z.object({factorId:z.uuid(),code:z.string().regex(/^\d{6}$/)}).parse(await parse(ctx.request));const client=db();await client.auth.setSession({access_token:user.token!,refresh_token:ctx.cookies.get('bm_refresh')?.value||''});const {data,error}=await client.auth.mfa.challengeAndVerify({factorId,code});if(error)throw new HttpError(401,'2FA kodi noto‘g‘ri yoki eskirgan.');const options={httpOnly:true,secure:ctx.url.protocol==='https:',sameSite:'strict' as const,path:'/',maxAge:3600};ctx.cookies.set('bm_access',data.access_token,options);ctx.cookies.set('bm_refresh',data.refresh_token,{...options,maxAge:604800});return response({ok:true});
  }
  if(action==='auth/login'&&method==='POST'){await rate(ctx,'login',6,300);const b=z.object({email:z.email().max(120),password:z.string().min(1).max(200)}).parse(await parse(ctx.request));await login(ctx,b.email,b.password);return response({ok:true});}
  if(action==='auth/logout'&&method==='POST'){logout(ctx.cookies);return response({ok:true});}
  if(action==='auth/exchange'&&method==='POST'){
   if(localMode())throw new HttpError(409,'Bu oqim Supabase uchun.');await rate(ctx,'exchange',10);
   const b=z.object({accessToken:z.string().max(5000),refreshToken:z.string().max(5000)}).parse(await parse(ctx.request));
   const {data,error}=await db().auth.getUser(b.accessToken);if(error||!data.user)throw new HttpError(401,'Taklif yoki tiklash havolasi yaroqsiz.');
   const membership=await db(b.accessToken).from('memberships').select('role').eq('site_id',siteId()).eq('user_id',data.user.id).maybeSingle();if(!membership.data)throw new HttpError(403,'Salon uchun ruxsat yo‘q.');
   const options={httpOnly:true,secure:ctx.url.protocol==='https:',sameSite:'strict' as const,path:'/',maxAge:3600};ctx.cookies.set('bm_access',b.accessToken,options);ctx.cookies.set('bm_refresh',b.refreshToken,{...options,maxAge:604800});return response({ok:true});
  }
  if(action==='auth/password'&&method==='POST'){
   const user=await actor(ctx);if(localMode())throw new HttpError(409,'Lokal hisob boshqa sozlash oqimida.');
   const {password}=z.object({password:z.string().min(12).max(200)}).parse(await parse(ctx.request));const client=db();const access=ctx.cookies.get('bm_access')?.value||'',refresh=ctx.cookies.get('bm_refresh')?.value||'';const r=await client.auth.setSession({access_token:access,refresh_token:refresh});if(r.error)throw new HttpError(401,'Sessiya tugagan.');const changed=await client.auth.updateUser({password});if(changed.error)throw new HttpError(422,'Parol yangilanmadi.');await audit(user,'password_changed');return response({ok:true});
  }
  if(action==='auth/reset'&&method==='POST'){await rate(ctx,'reset',3,600);const {email}=z.object({email:z.email()}).parse(await parse(ctx.request));if(localMode())throw new HttpError(422,'Lokal parolni LOCAL_ADMIN_ACCESS.md orqali ko‘ring.');await db().auth.resetPasswordForEmail(email,{redirectTo:ctx.url.origin+'/admin/'});return response({ok:true,message:'Hisob mavjud bo‘lsa tiklash xati yuboriladi.'});}
  if(action==='leads'&&method==='POST'){
   await rate(ctx,'lead',5,300);const body=leadSchema.parse(await parse(ctx.request));if(body.website)throw new HttpError(422,'So‘rov qabul qilinmadi.');
   const content=await publicContent();if(content.brand.bookingMode!=='request')throw new HttpError(409,'Forma hozir demo rejimida.');
   if(body.service!=='consultation'&&!content.services.some(s=>s.id===body.service&&s.active))throw new HttpError(422,'Xizmat mavjud emas.');
   const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tashkent',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());if(body.date<today||!Number.isFinite(Date.parse(body.date))||new Date(body.date).toISOString().slice(0,10)!==body.date)throw new HttpError(422,'Kelajakdagi to‘g‘ri sanani tanlang.');
   const {requestId,website,...data}=body;const row={...data,utm:allowedUtm(data.utm),id:requestId,status:'new',createdAt:new Date().toISOString(),serviceLabel:content.services.find(s=>s.id===body.service)?.label[body.lang]||'Konsultatsiya',internalNote:'',assignedTo:'',history:[]};
   await addPublic('leads',row);await notification(row).catch(()=>{});return response({ok:true,id:requestId},201);
  }
  if(action==='analytics/events'&&method==='POST'){
   await rate(ctx,'analytics',120);try{await actor(ctx);return response({ignored:true},202);}catch(e){if(e instanceof HttpError&&![401,403].includes(e.status))throw e;}
   if(!(await publicContent()).trackingEnabled)return response({ignored:true},202);
   const event=eventSchema.parse(await parse(ctx.request));if(/bot|crawl|spider/i.test(ctx.request.headers.get('user-agent')||''))return response({ignored:true},202);
   const utm=allowedUtm(event.utm);
   await addPublic('analytics_events',{...event,utm,createdAt:new Date().toISOString()});return response({ok:true},202);
  }
  if(action.startsWith('media/')&&method==='GET'){
   const parts=action.split('/').filter(Boolean);const [,id,size]=parts;if(!z.uuid().safeParse(id).success||!['480','960','1440'].includes(size))throw new HttpError(404,'Rasm topilmadi.');
   const content=await publicContent();if(!content.media.some(m=>m.id===id&&m.active))await actor(ctx);
   let buffer:Buffer;if(localMode())buffer=await readFile(resolve('.local-admin','media',`${id}-${size}.webp`));else{const {data,error}=await db(undefined,true).storage.from('salon-media').download(`${siteId()}/${id}-${size}.webp`);if(error||!data)throw new HttpError(404,'Rasm topilmadi.');buffer=Buffer.from(await data.arrayBuffer());}
   return new Response(new Uint8Array(buffer),{headers:{'Content-Type':'image/webp','Cache-Control':'private, max-age=300','X-Content-Type-Options':'nosniff'}});
  }
  const user=await actor(ctx);
  if(action==='admin/template'&&method==='GET'){permit(user,['owner','editor']);const state=await contentState(user);return new Response(JSON.stringify({schemaVersion:1,content:state.draft},null,2),{headers:{'Content-Type':'application/json','Content-Disposition':'attachment; filename="salon-content.json"','Cache-Control':'no-store'}});}
  if(action==='admin/content'&&method==='GET'){permit(user,['owner','editor']);return response(await contentState(user));}
  if(action==='admin/content'&&method==='PUT'){const b=await parse(ctx.request);const content=contentSchema.parse(b.content);const revision=z.number().int().nonnegative().parse(b.revision);return response({revision:await saveDraft(user,content,revision)});}
  if(action==='admin/publish'&&method==='POST'){const b=z.object({revision:z.number().int(),rollbackId:z.uuid().optional()}).parse(await parse(ctx.request));const state=await contentState(user);if(!b.rollbackId){const errors=validatePublish(state.draft);if(errors.length)throw new HttpError(422,errors.join(' '));}return response({publishedRevision:await publish(user,b.revision,b.rollbackId)});}
  if(action==='admin/releases'&&method==='GET'){permit(user,['owner','editor']);return response({items:(await rows(user,'content_releases')).map(({content,...rest})=>rest)});}
  if(action==='admin/audit'&&method==='GET'){permit(user,['owner']);return response({items:await rows(user,'audit_log')});}
  if(action==='admin/leads'&&method==='GET'){const offset=z.coerce.number().int().min(0).max(1000000).parse(ctx.url.searchParams.get('offset')||0);const status=ctx.url.searchParams.get('status')||'';if(status&&!statuses.includes(status as any))throw new HttpError(422,'Holat noto‘g‘ri.');return response(await leadPage(user,offset,status,ctx.url.searchParams.get('search')||''));}
  if(action==='admin/leads'&&method==='PATCH'){const b=z.object({id:z.uuid(),status:z.enum(statuses),internalNote:z.string().max(2000),assignedTo:z.string().max(100)}).parse(await parse(ctx.request));const {id,...patch}=b;return response({item:await updateLead(user,id,patch)});}
  if(action==='admin/export'&&method==='GET'){
   permit(user,['owner']);const items=await exportLeads(user);await audit(user,'leads_exported');const cell=(v:unknown)=>{let value=String(v??'');if(/^[=+@\-\t\r]/.test(value))value="'"+value;return '"'+value.replaceAll('"','""')+'"';};const keys=['createdAt','name','phone','serviceLabel','date','time','status'];return new Response('\uFEFF'+[keys.join(','),...items.map(r=>keys.map(k=>cell(r[k])).join(','))].join('\r\n'),{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="beauty-me-leads.csv"','Cache-Control':'no-store'}});
  }
  if(action==='admin/analytics'&&method==='GET'){const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/);const from=date.parse(ctx.url.searchParams.get('from')||'2000-01-01'),to=date.parse(ctx.url.searchParams.get('to')||'2099-12-31');if(to<from)throw new HttpError(422,'Sana oralig‘ini tekshiring.');return response({stats:await report(user,from,to),outbox:await rows(user,'notification_outbox')});}
  if(action==='admin/media'&&method==='POST'){
   permit(user,['owner','editor']);await rate(ctx,'upload',15);if(Number(ctx.request.headers.get('content-length')||0)>11*1024*1024)throw new HttpError(413,'Rasm 10 MiB dan katta.');
   // Native image processing is needed only after an authorized upload, not for login/session.
   const {default:sharp}=await import('sharp');
   const form=await ctx.request.formData();const file=form.get('file');if(!(file instanceof File)||file.size>10*1024*1024)throw new HttpError(422,'10 MiB gacha JPG/PNG/WebP rasm tanlang.');
   const buffer=Buffer.from(await file.arrayBuffer());const meta=await sharp(buffer,{limitInputPixels:40000000}).metadata();if(!['jpeg','png','webp'].includes(meta.format||''))throw new HttpError(422,'JPG/PNG/WebP format kerak.');
   const id=randomUUID();let width=0,height=0;for(const size of [480,960,1440]){const {data,info}=await sharp(buffer,{limitInputPixels:40000000}).rotate().resize({width:size,withoutEnlargement:true}).webp({quality:84}).toBuffer({resolveWithObject:true});if(size===1440){width=info.width;height=info.height;}if(localMode()){await mkdir(resolve('.local-admin','media'),{recursive:true});await writeFile(resolve('.local-admin','media',`${id}-${size}.webp`),data);}else{const {error}=await db(user.token).storage.from('salon-media').upload(`${siteId()}/${id}-${size}.webp`,data,{contentType:'image/webp',upsert:false});if(error)throw new HttpError(503,'Rasm yuklanmadi.');}}
   const title=String(form.get('title')||file.name.replace(/\.[^.]+$/,''));const item=mediaSchema.parse({id,src:`/api/media/${id}/1440/`,src480:`/api/media/${id}/480/`,sourceUrl:'Admin orqali yuklangan',category:String(form.get('category')||'hair'),title:{uz:title,ru:title},alt:{uz:title,ru:title},width,height,focus:'50% 50%',active:true});await audit(user,'media_uploaded');return response({item},201);
  }
  if(action==='admin/members'&&method==='GET'){permit(user,['owner']);if(localMode())return response({items:[{user_id:user.id,email:user.email,role:'owner'}],local:true});const {data,error}=await db(user.token).from('memberships').select('user_id,email,role').eq('site_id',siteId());if(error)throw new HttpError(503,'Xodimlar yuklanmadi.');return response({items:data});}
  if(action==='admin/members'&&method==='DELETE'){permit(user,['owner']);if(localMode())throw new HttpError(409,'Lokal owner o‘chirilmaydi.');const {userId}=z.object({userId:z.uuid()}).parse(await parse(ctx.request));if(userId===user.id)throw new HttpError(422,'O‘z ruxsatingizni bekor qilmang.');const result=await db(undefined,true).from('memberships').delete().eq('site_id',siteId()).eq('user_id',userId).neq('role','owner');if(result.error)throw new HttpError(503,'Ruxsat bekor qilinmadi.');await audit(user,'member_revoked');return response({ok:true});}
  if(action==='admin/members'&&method==='POST'){permit(user,['owner']);if(localMode())throw new HttpError(409,'Xodim taklifi Supabase ulanmaguncha mavjud emas.');const b=z.object({email:z.email(),role:z.enum(['editor','manager'])}).parse(await parse(ctx.request));const {data,error}=await db(undefined,true).auth.admin.inviteUserByEmail(b.email,{redirectTo:ctx.url.origin+'/admin/'});if(error)throw new HttpError(422,'Taklif yuborilmadi. Emailni tekshiring.');const r=await db(undefined,true).from('memberships').insert({site_id:siteId(),user_id:data.user.id,email:b.email,role:b.role});if(r.error)throw new HttpError(503,'Hisob yaratildi, lekin ruxsat saqlanmadi. Owner tekshirishi kerak.');await audit(user,'member_invited');return response({ok:true},201);}
  throw new HttpError(404,'Endpoint yoki method mavjud emas.');
 }catch(error){if(error instanceof z.ZodError)return response({error:error.issues.map(e=>`${e.path.join('.')}: ${e.message}`).join('; ')},422);if(error instanceof HttpError)return response({error:error.message},error.status);console.error('Admin API failed',error instanceof Error?error.name:'unknown');return response({error:'Amal bajarilmadi. Qayta urinib ko‘ring.'},500);}
};
