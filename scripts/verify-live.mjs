import {writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';

const base='https://beauty-me-tashkent-demo.netlify.app';
const paths=['/uz/','/ru/','/uz/gallery/','/ru/gallery/','/uz/services/hair/','/uz/booking/','/uz/contact/','/does-not-exist-v3/'];
const checks=[];
await Promise.all(paths.map(async path=>{
  const response=await fetch(base+path);
  const html=await response.text();
  assert.equal(response.status,path.includes('does-not-exist')?404:200,path);
  assert.match(response.headers.get('x-robots-tag')||'',/noindex/,path);
  if(path==='/uz/'||path==='/ru/'){
    assert.match(html,/data-hero/);
    assert.match(html,/data-service-explorer/);
  }
  checks.push({path,status:response.status,noindex:response.headers.get('x-robots-tag')});
}));
const root=await fetch(base+'/',{redirect:'manual'});
assert.equal(root.status,302);
assert.match(root.headers.get('location')||'',/\/uz\/$/);
checks.push({path:'/',status:root.status,location:root.headers.get('location')});
const html=await (await fetch(base+'/uz/')).text();
const assets=new Set(Array.from(html.matchAll(/(?:src|href)="(\/(?:_astro|media)\/[^"?]+)"/g),match=>match[1]));
let fonts=0;
for(const path of assets){
  const response=await fetch(base+path);
  assert.equal(response.status,200,path);
  if(path.endsWith('.css')){
    assert.match(response.headers.get('cache-control')||'',/immutable/);
    const css=await response.text();
    for(const match of css.matchAll(/url\((?:["']?)([^)"']+\.woff2?)(?:["']?)\)/g)){
      const fontUrl=new URL(match[1],base+path);
      assert.equal((await fetch(fontUrl)).status,200,fontUrl.href);
      fonts++;
    }
  }
  checks.push({path,status:response.status});
}
mkdirSync('test-results',{recursive:true});
writeFileSync('test-results/live-v3-verification.json',JSON.stringify({verifiedAt:new Date().toISOString(),base,checks,fontAssets:fonts,visualQA:'Not performed: browser tool sandbox unavailable.'},null,2));
console.log(`Live v3 verified: ${checks.length} routes/assets and ${fonts} font references. Root redirect, custom 404, noindex headers and immutable CSS cache passed.`);
