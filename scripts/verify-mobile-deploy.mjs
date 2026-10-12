import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=(process.argv[2]||'https://beauty-me-tashkent-demo.netlify.app').replace(/\/$/,'');
// Keep CDN requests bounded and retry transient connection timeouts.
const nativeFetch=globalThis.fetch;let active=0;const waiting=[];
globalThis.fetch=async(...args)=>{if(active>=4)await new Promise(resolve=>waiting.push(resolve));active++;try{for(let attempt=0;attempt<3;attempt++){try{return await nativeFetch(...args);}catch(error){if(attempt===2)throw error;await new Promise(resolve=>setTimeout(resolve,500));}}}finally{active--;waiting.shift()?.();}};
const paths=['','services/','gallery/','about/','contact/','booking/','privacy/','services/hair/','services/nails/','services/skin/','services/brows/','services/makeup/','services/massage/'];
const checks=[],assets=new Set();
await Promise.all(['uz','ru'].flatMap(lang=>paths.map(async path=>{
  const url='/'+lang+'/'+path,response=await fetch(base+url),html=await response.text();
  assert.equal(response.status,200,url);assert.match(html,/<meta name="robots" content="noindex/);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,url);
  if(!path){assert.match(html,/gallery-preview/);assert.match(html,/data-service-explorer/);}
  for(const match of html.matchAll(/(?:href|src)="(\/(?:_astro|media)\/[^"?]+)"/g))assets.add(match[1]);
  for(const match of html.matchAll(/srcset="([^"]+)"/g))for(const candidate of match[1].split(',')){const url=candidate.trim().split(/\s+/)[0];if(url.startsWith('/media/'))assets.add(url);}
  checks.push({path:url,status:response.status});
})));
const queue=[...assets];let fontCount=0;
// Bounded concurrency avoids a burst against the demo CDN.
for(let start=0;start<queue.length;start+=8)await Promise.all(queue.slice(start,start+8).map(async path=>{
  const response=await fetch(base+path);assert.equal(response.status,200,path);
  if(path.endsWith('.css')){
    assert.match(response.headers.get('cache-control')||'',/immutable/);
    const css=await response.text();const fonts=new Set([...css.matchAll(/url\(["']?([^\)"']+\.woff2?)["']?\)/g)].map(m=>new URL(m[1],base+path).href));
    await Promise.all([...fonts].map(async url=>{assert.equal((await fetch(url)).status,200,url);fontCount++;}));
  }
  checks.push({path,status:response.status});
}));
const root=await fetch(base+'/',{redirect:'manual'});assert.equal(root.status,302);assert.match(root.headers.get('location')||'',/\/uz\/$/);
checks.push({path:'/',status:root.status,location:root.headers.get('location')});
const missing=await fetch(base+'/does-not-exist-mobile/');assert.equal(missing.status,404);checks.push({path:'custom-404',status:missing.status});
const admin=await fetch(base+'/admin/',{redirect:'manual'});assert.equal(admin.status,302);assert.equal(admin.headers.get('location'),'/admin/demo/');checks.push({path:'/admin/',status:admin.status,location:admin.headers.get('location')});
const demo=await fetch(base+'/admin/demo/');assert.equal(demo.status,200);assert.match(await demo.text(),/Admin demo/);checks.push({path:'/admin/demo/',status:demo.status});
const session=await fetch(base+'/api/auth/session/');assert.equal(session.status,200);const body=await session.json();assert.equal(body.user,null);assert.equal(body.mode,'unconfigured');checks.push({path:'/api/auth/session/',status:session.status,mode:body.mode});
const protectedContent=await fetch(base+'/api/admin/content/');assert.equal(protectedContent.status,503);assert.match((await protectedContent.json()).error,/Supabase/);checks.push({path:'/api/admin/content/',status:protectedContent.status,expected:'Cloud backend not configured; no content access'});
mkdirSync('test-results',{recursive:true});
writeFileSync('test-results/live-mobile-deployment.json',JSON.stringify({verifiedAt:new Date().toISOString(),base,checks,fontCount,scope:'Public site and admin sandbox open without login. Real APIs remain protected/unconfigured; no real lead submitted.'},null,2));
console.log('Verified '+checks.length+' routes/assets and '+fontCount+' font files. Public bilingual pages, root/404, admin sandbox route and protected API passed.');
