import {z} from 'zod';
import {seed,contentSchema,mediaSchema,validatePublish,statuses,type SiteContent} from './model';
import {dayKey,summarize} from './metrics';
import {readDemoBookings,clearDemoBookings} from '../lib/demo-journey';

export type AdminTransport=(path:string,method?:string,data?:any)=>Promise<any>;
type Storage=Pick<globalThis.Storage,'getItem'|'setItem'|'removeItem'>;
const key='beauty-me-admin-demo-v1';
const image=z.string().refine(v=>/^\/(media|api\/media)\//.test(v)||/^https:\/\//.test(v)||/^data:image\/webp;base64,[a-zA-Z0-9+/=]+$/.test(v),'Rasm manzili noto‘g‘ri.');
const demoContent=contentSchema.extend({media:z.array(mediaSchema.extend({src:image,src480:image.optional()})).max(200)});
type State={draft:SiteContent;published:SiteContent;revision:number;publishedRevision:number;releases:any[];leads:any[];members:any[];audit:any[]};
const owner={email:'demo@beautyme.example',role:'owner' as const};
function initial():State{
 const content=seed();
 const leads=Array.from({length:8},(_,i)=>({id:'demo-lead-'+i,name:'Demo mijoz '+(i+1),phone:'+998000000000',serviceLabel:content.services[i%content.services.length].label.uz,date:dayKey(new Date(Date.now()+i*86400000)),time:'afternoon',note:'Bu haqiqiy mijoz emas. Panelni sinash uchun namuna.',status:['new','contacted','confirmed','completed'][i%4],createdAt:new Date(Date.now()-i*86400000).toISOString(),sessionId:'demo-session-'+i,internalNote:'',assignedTo:'',history:[]}));
 return {draft:content,published:structuredClone(content),revision:0,publishedRevision:0,releases:[],leads,members:[{user_id:'demo-owner',...owner}],audit:[]};
}
// This transport never calls fetch or any production API. Each tab has its own sandbox.
export function createDemoTransport(storage?:Storage){
 let state=initial(),signedIn=true;
 try{const saved=storage?.getItem(key);if(saved){const parsed=JSON.parse(saved);const draft=demoContent.parse(parsed.draft),published=demoContent.parse(parsed.published);if(Array.isArray(parsed.leads)&&Array.isArray(parsed.audit)&&Array.isArray(parsed.releases)&&Array.isArray(parsed.members)&&Number.isInteger(parsed.revision)&&Number.isInteger(parsed.publishedRevision))state={...parsed,draft,published};}}catch{storage?.removeItem(key);}
 function commit(next:State){try{storage?.setItem(key,JSON.stringify(next));}catch{throw new Error('Demo xotirasi to‘ldi. Rasmlarni kamaytiring yoki namunani tiklang.');}state=next;}
 const choices=readDemoBookings(storage).filter(item=>!state.leads.some(l=>l.id===item.id));
 if(choices.length){const next=structuredClone(state);for(const choice of choices){const service=next.published.services.find(s=>s.id===choice.service&&s.active);if(!service&&choice.service!=='consultation')continue;next.leads.unshift({id:choice.id,name:'Saytdan demo so‘rov',phone:'+998000000000',serviceLabel:service?.label.uz||'Konsultatsiya',date:choice.date,time:choice.time,note:'Faqat xizmat va vaqt bilan yaratilgan namuna. Ism, telefon va izoh saqlanmagan.',status:'new',createdAt:choice.createdAt,sessionId:null,internalNote:'',assignedTo:'',history:[]});}try{commit(next);clearDemoBookings(storage);}catch{}}
 function audit(next:State,action:string){next.audit.unshift({id:crypto.randomUUID(),action,actor:owner.email,createdAt:new Date().toISOString()});next.audit=next.audit.slice(0,100);}
 const api:AdminTransport=async(path,method='GET',data)=>{
  const url=new URL(path,'https://demo.example/'),route=url.pathname.slice(1);
  if(route==='auth/session')return{user:signedIn?owner:null,mode:'demo'};
  if(route==='auth/login'){signedIn=true;return{ok:true};}
  if(route==='auth/logout'){signedIn=false;return{ok:true};}
  if(!signedIn)throw new Error('Demo panelni qayta oching.');
  if(route==='admin/content'){
   if(method==='GET')return structuredClone({draft:state.draft,revision:state.revision,publishedRevision:state.publishedRevision});
   if(data.revision!==state.revision)throw new Error('Qoralama yangilangan. Panelni qayta oching.');
   const next=structuredClone(state);next.draft=demoContent.parse(data.content);next.revision++;audit(next,'draft_saved');commit(next);return{revision:next.revision};
  }
  if(route==='admin/publish'){
   if(data.revision!==state.revision)throw new Error('Avval qoralamani saqlang.');
   const next=structuredClone(state),content=data.rollbackId?next.releases.find(r=>r.id===data.rollbackId)?.content:next.draft;
   if(!content)throw new Error('Nashr topilmadi.');
   const errors=validatePublish(content);if(errors.length)throw new Error(errors.join(' '));
   next.releases.unshift({id:crypto.randomUUID(),createdAt:new Date().toISOString(),author:owner.email,content:next.published});next.releases=next.releases.slice(0,5);
   if(data.rollbackId){next.draft=structuredClone(content);next.revision++;}
   next.published=structuredClone(content);next.publishedRevision=next.revision;audit(next,data.rollbackId?'rollback':'published');commit(next);return{ok:true};
  }
  if(route==='admin/releases')return{items:structuredClone(state.releases)};
  if(route==='admin/audit')return{items:structuredClone(state.audit)};
  if(route==='admin/analytics'){
   const events=Array.from({length:120},(_,i)=>({sessionId:'demo-session-'+i%40,name:i<80?'page_view':i<104?'telegram_click':'booking_start',path:i%3?'/uz/':'/uz/services/nails/',device:i%4?'mobile':'desktop',utm:{utm_source:i%2?'instagram':'demo'},createdAt:new Date(Date.now()-i%10*86400000).toISOString()}));
   return{stats:{...summarize(events,state.leads,url.searchParams.get('from')||'0000',url.searchParams.get('to')||'9999'),newLeads:state.leads.filter(l=>l.status==='new').length},outbox:[]};
  }
  if(route==='admin/leads'){
   if(method==='PATCH'){if(!statuses.includes(data.status))throw new Error('Holat noto‘g‘ri.');const next=structuredClone(state),item=next.leads.find(l=>l.id===data.id);if(!item)throw new Error('Namuna topilmadi.');Object.assign(item,{status:data.status,internalNote:String(data.internalNote||'').slice(0,500),assignedTo:String(data.assignedTo||'').slice(0,80)});item.history.unshift({status:item.status,by:owner.email,at:new Date().toISOString()});audit(next,'lead_updated');commit(next);return{item:structuredClone(item)};}
   const search=(url.searchParams.get('search')||'').toLowerCase(),status=url.searchParams.get('status'),offset=Math.max(0,Number(url.searchParams.get('offset'))||0);
   const items=state.leads.filter(l=>(!status||l.status===status)&&`${l.name} ${l.phone} ${l.serviceLabel}`.toLowerCase().includes(search));return{items:structuredClone(items.slice(offset,offset+50)),total:items.length};
  }
  if(route==='admin/members'){
   if(method==='GET')return{items:structuredClone(state.members)};
   const next=structuredClone(state);
   if(method==='POST'){if(!z.email().safeParse(data.email).success||!['manager','editor'].includes(data.role))throw new Error('Email va rolni tekshiring.');next.members.push({user_id:crypto.randomUUID(),email:data.email,role:data.role});audit(next,'member_invited');}
   if(method==='DELETE'){next.members=next.members.filter(m=>m.role==='owner'||m.user_id!==data.userId);audit(next,'member_revoked');}commit(next);return{ok:true};
  }
  if(route==='admin/media'){
   const file=data.get('file') as File;if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024)throw new Error('JPG, PNG yoki WebP tanlang (5 MB gacha).');
   const bitmap=await createImageBitmap(file);try{const scale=Math.min(1,1000/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Rasmni qayta ishlash imkonsiz.');ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);const src=canvas.toDataURL('image/webp',0.78),title=String(data.get('title')||'Demo rasm').slice(0,100);return{item:{id:'demo-'+crypto.randomUUID(),src,src480:src,sourceUrl:'Faqat ushbu brauzerdagi demo rasm',category:String(data.get('category')||'hair'),title:{uz:title,ru:title},alt:{uz:title,ru:title},width:canvas.width,height:canvas.height,focus:'50% 50%',active:true}};}finally{bitmap.close();}
  }
  if(route==='admin/template')return{content:structuredClone(state.draft),mode:'demo'};
  if(route==='admin/export')return{items:structuredClone(state.leads)};
  throw new Error('Bu amal haqiqiy boshqaruv uchun Supabase ulanishini talab qiladi.');
 };
 return{api,reset(){storage?.removeItem(key);clearDemoBookings(storage);state=initial();signedIn=true;}};
}
