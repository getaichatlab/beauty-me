type EventName='page_view'|'service_view'|'telegram_click'|'phone_click'|'instagram_click'|'map_click'|'booking_start'|'booking_step';
let cleanup=()=>{};
export function trackedSession(){try{if(localStorage.getItem('bm_analytics')!=='yes')return null;const data=JSON.parse(sessionStorage.getItem('bm_session')||'null');return data?.id||null;}catch{return null;}}
export function track(name:EventName,placement='page'){
 if(document.body.dataset.tracking!=='on'||document.body.dataset.preview==='on'||navigator.doNotTrack==='1')return;
 try{
  if(localStorage.getItem('bm_analytics')!=='yes')return;
  let session=JSON.parse(sessionStorage.getItem('bm_session')||'null');if(!session||Date.now()-session.at>1800000)session={id:crypto.randomUUID(),at:Date.now()};session.at=Date.now();sessionStorage.setItem('bm_session',JSON.stringify(session));
  const params=new URLSearchParams(location.search);const utm=Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content'].map(k=>[k,(params.get(k)||'').slice(0,120)]).filter(([,v])=>v));
  let referrer='';try{referrer=new URL(document.referrer).hostname;}catch{}
  const event={id:crypto.randomUUID(),sessionId:session.id,pageId:document.body.dataset.pageId,name,path:location.pathname,lang:document.documentElement.lang==='ru'?'ru':'uz',placement,device:innerWidth<768?'mobile':'desktop',referrer,utm};
  void fetch('/api/analytics/events/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(event),keepalive:true}).catch(()=>{});
 }catch{}
}
document.addEventListener('astro:page-load',()=>{
 cleanup();const controller=new AbortController();cleanup=()=>controller.abort();document.body.dataset.pageId=crypto.randomUUID();
 if(document.body.dataset.tracking!=='on'||document.body.dataset.preview==='on'||navigator.doNotTrack==='1')return;
 try{
 if(!localStorage.getItem('bm_analytics')){
  const banner=document.createElement('aside');banner.className='analytics-consent';banner.setAttribute('aria-label','Statistika tanlovi');const ru=document.documentElement.lang==='ru';
  const text=document.createElement('p');text.textContent=ru?'Разрешить обезличенную статистику посещений?':'Shaxsiy ma’lumotsiz tashrif statistikasiga ruxsat berasizmi?';banner.append(text);
  for(const [value,label]of [['yes',ru?'Разрешить':'Ruxsat berish'],['no',ru?'Отклонить':'Rad etish']]){const button=document.createElement('button');button.textContent=label;button.addEventListener('click',()=>{localStorage.setItem('bm_analytics',value);banner.remove();if(value==='yes')track('page_view');},{signal:controller.signal});banner.append(button);}
  (document.body.dataset.page==='booking'?document.querySelector('main')||document.body:document.body).append(banner);controller.signal.addEventListener('abort',()=>banner.remove(),{once:true});
 }
 track('page_view');if(location.pathname.includes('/services/'))track('service_view');
 document.addEventListener('click',e=>{const a=(e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');if(!a)return;const href=a.href;let name:EventName|undefined;if(href.startsWith('tel:'))name='phone_click';else if(href.includes('t.me/'))name='telegram_click';else if(href.includes('instagram.com/'))name='instagram_click';else if(href.includes('yandex.')||href.includes('maps.google.'))name='map_click';if(name)track(name,a.closest('footer')?'footer':a.closest('header')?'header':a.closest('.mobile-bottom')?'mobile':'page');},{signal:controller.signal});
 }catch{}
});
document.addEventListener('astro:before-swap',()=>cleanup());
