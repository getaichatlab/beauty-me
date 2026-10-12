import {createClient} from '@supabase/supabase-js';
export const config={schedule:'*/5 * * * *'};
export default async()=>{
 const {SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,TELEGRAM_BOT_TOKEN,TELEGRAM_CHAT_ID}=process.env;
 if(!SUPABASE_URL||!SUPABASE_SERVICE_ROLE_KEY||!TELEGRAM_BOT_TOKEN||!TELEGRAM_CHAT_ID)return new Response('Notification integration is not configured.');
 const db=createClient(SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 const site=process.env.ADMIN_SITE_ID||'11111111-1111-4111-8111-111111111111';
 const {data,error}=await db.rpc('claim_notifications',{p_site:site});if(error)return new Response('Outbox unavailable.',{status:503});
 let sent=0;
 for(const job of data||[]){
  try{
   const {data:lead,error}=await db.from('leads').select('id,name,phone,serviceLabel,date,time').eq('site_id',job.site_id).eq('id',job.lead_id).single();if(error||!lead)throw new Error('missing lead');
   const text=`Yangi sayt zayavkasi\n${lead.name}\n${lead.phone}\n${lead.serviceLabel}\n${lead.date} · ${lead.time}\nSo‘rov: ${lead.id}`;
   const r=await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:TELEGRAM_CHAT_ID,text}),signal:AbortSignal.timeout(10000)});const payload=await r.json();if(!r.ok||!payload.ok)throw new Error('delivery failed');
   await db.from('notification_outbox').update({status:'sent'}).eq('id',job.id);sent++;
  }catch{await db.from('notification_outbox').update({status:job.attempts>=5?'failed':'pending'}).eq('id',job.id);}
 }
 return new Response(JSON.stringify({processed:data?.length||0,sent}),{headers:{'Content-Type':'application/json'}});
};
