from pathlib import Path
p=Path('src/components/Booking.astro');s=p.read_text(encoding='utf-8');s=s.replace("back.hidden=step===0;next.hidden=step===2;submit.hidden=step!==2;error.textContent='';", "back.hidden=step===0;next.hidden=step===2;submit.hidden=step!==2;error.textContent='';updateSelection();")
s=s.replace("form.reset();form.hidden=true;", "if(panel.dataset.requestMode!=='true'){const saved=writeDemoBooking({service:selected.value,date:date.value,time:time.value});const demoLink=panel.querySelector<HTMLElement>('[data-admin-demo]');if(demoLink)demoLink.hidden=!saved;}if(selection)selection.hidden=true;form.reset();form.hidden=true;")
p.write_text(s,encoding='utf-8')
p=Path('src/admin/demo.ts');s=p.read_text(encoding='utf-8');s=s.replace("import {dayKey,summarize} from './metrics';", "import {dayKey,summarize} from './metrics';\nimport {readDemoBookings,clearDemoBookings} from '../lib/demo-journey';")
needle=" function audit(next:State,action:string)"
insert=""" const choices=readDemoBookings(storage).filter(item=>!state.leads.some(l=>l.id===item.id));
 if(choices.length){const next=structuredClone(state);for(const choice of choices){const service=next.published.services.find(s=>s.id===choice.service&&s.active);if(!service&&choice.service!=='consultation')continue;next.leads.unshift({id:choice.id,name:'Saytdan demo so‘rov',phone:'+998000000000',serviceLabel:service?.label.uz||'Konsultatsiya',date:choice.date,time:choice.time,note:'Faqat xizmat va vaqt bilan yaratilgan namuna. Ism, telefon va izoh saqlanmagan.',status:'new',createdAt:choice.createdAt,sessionId:null,internalNote:'',assignedTo:'',history:[]});}try{commit(next);clearDemoBookings(storage);}catch{}}
"""
assert needle in s;s=s.replace(needle,insert+needle)
s=s.replace("return{api,reset(){storage?.removeItem(key);state=initial();signedIn=true;}};", "return{api,reset(){storage?.removeItem(key);clearDemoBookings(storage);state=initial();signedIn=true;}};")
p.write_text(s,encoding='utf-8')
p=Path('src/admin/AdminApp.tsx');s=p.read_text(encoding='utf-8');needle="useState<View>('dashboard')";assert needle in s;s=s.replace(needle,"useState<View>(()=>demo&&typeof location!=='undefined'&&new URLSearchParams(location.search).get('view')==='leads'?'leads':'dashboard')")
s=s.replace("<strong>DEMO PANEL · Namuna ma’lumotlar</strong>","<strong>DEMO PANEL · Namuna ma’lumotlar</strong>")
needle="{mode==='local'&&<div className=\"a-notice a-local\">"
insert="""{demo&&<section className="a-demo-tour"><div><span className="a-kicker">BIR DAQIQADA SINAB KO‘RING</span><h2>Sayt qanday ishlashini ko‘ring.</h2><p>Yozilishdan so‘rov boshqaruvigacha — faqat ushbu tabdagi namuna.</p></div><div className="a-tour-actions"><a href="/uz/booking/?service=nails">01 · Saytdan yozilish ↗</a><button onClick={()=>switchView('leads')}>02 · So‘rovni tasdiqlash ↗</button><button onClick={()=>switchView('media')}>03 · Suratni almashtirish ↗</button>{draft&&<button onClick={()=>setPreview(true)}>04 · Natijani ko‘rish ↗</button>}</div></section>}"""
assert needle in s;s=s.replace(needle,insert+needle)
p.write_text(s,encoding='utf-8')
