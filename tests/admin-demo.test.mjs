import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSync} from 'esbuild';
const code=buildSync({entryPoints:['src/admin/demo.ts'],bundle:true,write:false,platform:'node',format:'cjs'}).outputFiles[0].text;
const module={exports:{}};new Function('module','exports',code)(module,module.exports);
const {createDemoTransport}=module.exports;
const storage=()=>{const data=new Map();return{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};};
test('Same-tab demo bookings import once as synthetic leads and can be confirmed',async()=>{
 const tab=storage(),choice={id:'demo-request-'+crypto.randomUUID(),service:'nails',date:'2026-10-20',time:'afternoon',createdAt:new Date().toISOString(),name:'PRIVATE',phone:'PRIVATE',note:'PRIVATE'};
 tab.setItem('beauty-me-demo-bookings-v1',JSON.stringify([choice]));const demo=createDemoTransport(tab);const result=await demo.api('admin/leads');assert.equal(result.total,9);const lead=result.items.find(l=>l.id===choice.id);assert.ok(lead);assert.equal(lead.phone,'+998000000000');assert.equal(lead.name,'Saytdan demo so‘rov');assert.ok(!JSON.stringify(lead).includes('PRIVATE'));assert.equal(tab.getItem('beauty-me-demo-bookings-v1'),null);
 assert.equal((await createDemoTransport(tab).api('admin/leads')).total,9);
 const confirmed=await demo.api('admin/leads','PATCH',{id:lead.id,status:'confirmed'});assert.equal(confirmed.item.status,'confirmed');
 tab.setItem('beauty-me-demo-bookings-v1',JSON.stringify([choice,{...choice,id:'demo-request-'+crypto.randomUUID(),service:'unknown'}]));assert.equal((await createDemoTransport(tab).api('admin/leads')).total,9);
});
test('Public demo edits, publish, rollback and reset stay isolated to one tab; real APIs are never called',async()=>{
 const original=globalThis.fetch;globalThis.fetch=()=>{throw new Error('Demo must never contact an API');};
 try{
  const tab=storage(),first=createDemoTransport(tab),second=createDemoTransport(storage());
  assert.equal((await first.api('auth/session')).mode,'demo');
  const initial=await first.api('admin/content');initial.draft.heroWords.uz[0]='Demo o‘zgartirish';
  const saved=await first.api('admin/content','PUT',{content:initial.draft,revision:0});assert.equal(saved.revision,1);
  await assert.rejects(first.api('admin/content','PUT',{content:initial.draft,revision:0}),/yangilangan/);
  await first.api('admin/publish','POST',{revision:1});
  assert.equal((await first.api('admin/content')).publishedRevision,1);
  assert.notEqual((await second.api('admin/content')).draft.heroWords.uz[0],'Demo o‘zgartirish');
  assert.equal((await createDemoTransport(tab).api('admin/content')).draft.heroWords.uz[0],'Demo o‘zgartirish');
  const release=(await first.api('admin/releases')).items[0];await first.api('admin/publish','POST',{revision:1,rollbackId:release.id});
  assert.notEqual((await first.api('admin/content')).draft.heroWords.uz[0],'Demo o‘zgartirish');
  first.reset();assert.equal((await first.api('admin/content')).revision,0);
  await first.api('auth/logout','POST');assert.equal((await first.api('auth/session')).user,null);
  await assert.rejects(first.api('admin/content'),/qayta/);await first.api('auth/login','POST');assert.ok((await first.api('auth/session')).user);
 }finally{globalThis.fetch=original;}
});
test('Demo sample leads filter/update/export, date-limited stats and sample member management work',async()=>{
 const demo=createDemoTransport(storage());const page=await demo.api('admin/leads');assert.equal(page.total,8);assert.ok(page.items.every(l=>l.name.startsWith('Demo mijoz')));
 const onlyNew=await demo.api('admin/leads?status=new');assert.equal(onlyNew.total,2);
 const updated=await demo.api('admin/leads','PATCH',{id:onlyNew.items[0].id,status:'confirmed',internalNote:'Demo test'});assert.equal(updated.item.status,'confirmed');assert.equal(updated.item.internalNote,'Demo test');
 assert.equal((await demo.api('admin/export')).items.length,8);
 const stats=await demo.api('admin/analytics?from=2000-01-01&to=2000-01-02');assert.equal(stats.stats.sessions,0);
 await demo.api('admin/members','POST',{email:'sample@example.test',role:'editor'});const member=(await demo.api('admin/members')).items.find(m=>m.role==='editor');assert.ok(member);
 await demo.api('admin/members','DELETE',{userId:member.user_id});assert.equal((await demo.api('admin/members')).items.length,1);
 await assert.rejects(demo.api('auth/mfa/enroll','POST'),/Supabase/);
});
test('Demo saves are transactional on storage quota failures and reject unsafe imported media',async()=>{
 const demo=createDemoTransport({getItem:()=>null,removeItem(){},setItem(){throw new Error('quota');}}),content=await demo.api('admin/content');
 await assert.rejects(demo.api('admin/content','PUT',{content:content.draft,revision:0}),/xotirasi/);assert.equal((await demo.api('admin/content')).revision,0);
 const safe=createDemoTransport(storage());content.draft.media[0].src='javascript:alert(1)';await assert.rejects(safe.api('admin/content','PUT',{content:content.draft,revision:0}));assert.equal((await safe.api('admin/content')).revision,0);
});
