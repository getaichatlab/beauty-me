export function dayKey(value:string|Date){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tashkent',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value));}
export function summarize(events:any[],leads:any[],from:string,to:string){
 const between=(r:any)=>{const day=dayKey(r.createdAt);return day>=from&&day<=to;};
 const selected=events.filter(between),requests=leads.filter(between).filter(l=>l.status!=='spam');
 const sessions=new Set(selected.map(e=>e.sessionId));const converted=new Set(requests.filter(l=>l.sessionId&&sessions.has(l.sessionId)).map(l=>l.sessionId));
 const byDay:Record<string,number>={},pages:Record<string,number>={},sources:Record<string,number>={};
 for(const e of selected.filter(e=>e.name==='page_view')){const d=dayKey(e.createdAt);byDay[d]=(byDay[d]||0)+1;pages[e.path]=(pages[e.path]||0)+1;const source=e.utm?.utm_source||e.referrer||'To‘g‘ridan-to‘g‘ri / noma’lum';sources[source]=(sources[source]||0)+1;}
 return{pageViews:selected.filter(e=>e.name==='page_view').length,sessions:sessions.size,telegram:selected.filter(e=>e.name==='telegram_click').length,phone:selected.filter(e=>e.name==='phone_click').length,starts:new Set(selected.filter(e=>e.name==='booking_start').map(e=>e.sessionId)).size,leads:requests.length,confirmed:requests.filter(l=>l.status==='confirmed'||l.status==='completed').length,conversion:sessions.size?Math.round(converted.size/sessions.size*1000)/10:0,byDay,pages,sources,device:{mobile:selected.filter(e=>e.name==='page_view'&&e.device==='mobile').length,desktop:selected.filter(e=>e.name==='page_view'&&e.device==='desktop').length}};
}
