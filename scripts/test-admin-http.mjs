import assert from 'node:assert/strict';
import {readFile,writeFile,unlink} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
const base='http://localhost:4322';
const stateFile=new URL('../.local-admin/state.json',import.meta.url);
let previous;try{previous=await readFile(stateFile);}catch(e){if(e.code!=='ENOENT')throw e;}
const access=await readFile(new URL('../LOCAL_ADMIN_ACCESS.md',import.meta.url),'utf8');
const password=access.match(/Parol: ([^\n]+)/)[1];
let cookie='';const passed=[];
async function request(path,{method='GET',data,auth=true,origin=base}={}){
 const r=await fetch(base+'/api/'+path+'/',{method,headers:{Origin:origin,...(auth&&cookie?{Cookie:cookie}:{}),...(data instanceof FormData?{}:{'Content-Type':'application/json'})},body:data?data instanceof FormData?data:JSON.stringify(data):undefined});
 return {response:r,status:r.status,body:await r.json()};
}
try{
 assert.equal((await request('admin/content',{auth:false})).status,401);passed.push('Anonymous admin access denied');
 assert.equal((await request('auth/login',{method:'POST',origin:'https://evil.example',data:{email:'owner@beautyme.local',password}})).status,403);passed.push('Cross-origin write denied');
 const signed=await request('auth/login',{method:'POST',data:{email:'owner@beautyme.local',password}});assert.equal(signed.status,200);
 cookie=signed.response.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');assert.ok(cookie);passed.push('Local login and HttpOnly session');
 assert.ok(signed.response.headers.getSetCookie().some(c=>c.includes('HttpOnly')&&c.includes('SameSite=Strict')));
 let state=(await request('admin/content')).body;const originalRevision=state.revision;
 state.draft.heroWords.uz[0]='HTTP tekshiruv sarlavhasi';
 state.draft.services.push({...state.draft.services[0],id:'http-test-service',label:{uz:'HTTP yangi xizmat',ru:'HTTP новая услуга'}});
 const saved=await request('admin/content',{method:'PUT',data:{content:state.draft,revision:state.revision}});assert.equal(saved.status,200);
 assert.equal((await request('admin/content',{method:'PUT',data:{content:state.draft,revision:originalRevision}})).status,409);passed.push('Optimistic revision conflict rejected');
 let html=await (await fetch(base+'/uz/')).text();assert.ok(!html.includes('HTTP tekshiruv sarlavhasi'));passed.push('Draft hidden on public website');
 let publish=await request('admin/publish',{method:'POST',data:{revision:saved.body.revision}});assert.equal(publish.status,200);
 html=await (await fetch(base+'/uz/')).text();assert.ok(html.includes('HTTP tekshiruv sarlavhasi'));passed.push('Published content rendered on public website');
 assert.equal((await fetch(base+'/uz/services/http-test-service/')).status,200);passed.push('New service dynamic route works after publication');
 const releases=(await request('admin/releases')).body.items;assert.ok(releases.length);
 assert.equal((await request('admin/publish',{method:'POST',data:{revision:saved.body.revision,rollbackId:releases[0].id}})).status,200);
 html=await (await fetch(base+'/uz/')).text();assert.ok(!html.includes('HTTP tekshiruv sarlavhasi'));passed.push('Content rollback restored previous hero');
 state=(await request('admin/content')).body;state.draft.brand.bookingMode='request';state.draft.trackingEnabled=false;
 const changed=await request('admin/content',{method:'PUT',data:{content:state.draft,revision:state.revision}});
 await request('admin/publish',{method:'POST',data:{revision:changed.body.revision}});
 const sessionId=randomUUID();const event={id:randomUUID(),sessionId,pageId:randomUUID(),name:'page_view',path:'/uz/',lang:'uz',placement:'page',device:'mobile',referrer:'',utm:{}};
 assert.equal((await request('analytics/events',{method:'POST',data:event,auth:false})).body.ignored,true);passed.push('Disabled analytics ignored by server');
 state=(await request('admin/content')).body;state.draft.trackingEnabled=true;
 const tracking=await request('admin/content',{method:'PUT',data:{content:state.draft,revision:state.revision}});await request('admin/publish',{method:'POST',data:{revision:tracking.body.revision}});
 assert.equal((await request('analytics/events',{method:'POST',data:event,auth:false})).status,202);
 assert.equal((await request('analytics/events',{method:'POST',data:event,auth:false})).status,202);
 const lead={requestId:randomUUID(),name:'Test Mijoz',phone:'+998 90 000 00 00',service:'hair',date:'2099-01-01',time:'morning',note:'HTTP integration test',lang:'uz',consent:true,sessionId,utm:{}};
 assert.equal((await request('leads',{method:'POST',data:{...lead,date:'2000-01-01'},auth:false})).status,422);
 assert.equal((await request('leads',{method:'POST',data:lead,auth:false})).status,201);
 assert.equal((await request('leads',{method:'POST',data:lead,auth:false})).status,201);
 const leads=(await request('admin/leads')).body.items;assert.equal(leads.filter(l=>l.id===lead.requestId).length,1);passed.push('Lead validation and duplicate submission idempotency');
 assert.equal((await request('admin/leads',{method:'PATCH',data:{id:lead.requestId,status:'confirmed',internalNote:'Test confirmed',assignedTo:'Test owner'}})).status,200);passed.push('Lead status/history update');
 const csv=await fetch(base+'/api/admin/export/',{headers:{Cookie:cookie}});assert.equal(csv.status,200);assert.ok((await csv.text()).includes('"\'+998 90 000 00 00"'));passed.push('CSV export escapes spreadsheet formulas');
 const template=(await request('admin/template')).body;assert.equal(template.schemaVersion,1);assert.ok(template.content);assert.equal(template.leads,undefined);assert.equal(template.content.leads,undefined);passed.push('Template export contains content without customer records');
 const analytics=(await request('admin/analytics')).body;assert.equal(analytics.stats.pageViews,1);passed.push('Analytics event deduplication');
 const form=new FormData();form.set('title','HTTP rasm tekshiruvi');form.set('category','nails');form.set('file',new Blob([await readFile(new URL('../public/media/nude-manicure.webp',import.meta.url))],{type:'image/webp'}),'test.webp');
 const uploaded=await request('admin/media',{method:'POST',data:form});assert.equal(uploaded.status,201);assert.ok(uploaded.body.item.src480);
 const image=await fetch(base+uploaded.body.item.src,{headers:{Cookie:cookie}});assert.equal(image.status,200);assert.equal(image.headers.get('content-type'),'image/webp');
 assert.equal((await fetch(base+uploaded.body.item.src)).status,401);passed.push('Upload optimization and unpublished image access control');
 assert.equal((await request('auth/logout',{method:'POST',data:{}})).status,200);passed.push('Logout cookie removal');
 await writeFile(new URL('../test-results/admin-http-verification.json',import.meta.url),JSON.stringify({at:new Date().toISOString(),passed,environment:'local file persistence; no hosted Supabase claimed'},null,2));
 console.log(`${passed.length} admin HTTP integration checks passed. Test state restored.`);
}finally{
 if(previous)await writeFile(stateFile,previous);else await unlink(stateFile).catch(e=>{if(e.code!=='ENOENT')throw e;});
}
