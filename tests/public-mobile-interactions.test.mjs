import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {buildSync} from 'esbuild';
import {JSDOM} from 'jsdom';
const root=resolve(import.meta.dirname,'..');
function componentCode(name){const source=readFileSync(join(root,'src/components',name+'.astro'),'utf8').split('<script>')[1].split('</script>')[0];return buildSync({stdin:{contents:source,loader:'ts',resolveDir:join(root,'src/components')},bundle:true,write:false,format:'iife',platform:'browser'}).outputFiles[0].text;}
const nativeCode=buildSync({entryPoints:[join(root,'src/lib/interactions.ts')],bundle:true,write:false,format:'iife',platform:'browser'}).outputFiles[0].text;
const galleryCode=componentCode('Gallery'),bookingCode=componentCode('Booking');
function page(path=''){
  const dom=new JSDOM(readFileSync(join(root,'dist/uz',path,'index.html'),'utf8'),{url:'http://localhost/uz/'+path+'/',runScripts:'outside-only',pretendToBeVisual:true});
  dom.window.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
  dom.window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  dom.window.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new dom.window.Event('close'));};
  return dom;
}
function load(dom,code){dom.window.eval(code);dom.window.document.dispatchEvent(new dom.window.Event('astro:page-load'));}
const tick=()=>new Promise(r=>setTimeout(r,0));

test('Essential mobile menu and service controls work without GSAP and clean up across navigation',async()=>{
  const dom=page(),d=dom.window.document;load(dom,nativeCode);
  for(let i=0;i<10;i++)d.dispatchEvent(new dom.window.Event('astro:page-load'));
  let openings=0,changes=0;d.addEventListener('beautyme:menu-open',()=>openings++);d.addEventListener('beautyme:layout-change',()=>changes++);
  d.querySelector('.menu-button').click();assert.equal(openings,1);assert.equal(d.querySelector('.menu-dialog').open,true);
  d.querySelector('.menu-close').click();assert.equal(d.activeElement,d.querySelector('.menu-button'));assert.equal(d.documentElement.classList.contains('menu-open'),false);
  const first=d.querySelector('[data-service=hair]');first.focus();first.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
  const selected=d.querySelector('[data-service][aria-pressed=true]');assert.equal(d.activeElement,selected);assert.notEqual(selected,first);assert.equal(changes,1);
  assert.equal(d.querySelector('[data-service-status]').textContent,selected.querySelector('.explorer-label').firstChild.textContent);
  d.querySelector('.menu-button').click();d.dispatchEvent(new dom.window.Event('astro:before-swap'));assert.equal(d.querySelector('.menu-dialog').open,false);assert.equal(d.documentElement.classList.contains('menu-open'),false);
  await tick();dom.window.close();
});

test('Mobile gallery paginates without losing images from the lightbox or selected filter',async()=>{
  const dom=page('gallery'),d=dom.window.document;load(dom,galleryCode);
  const figures=[...d.querySelectorAll('figure[data-category]')],visible=()=>figures.filter(f=>!f.hidden);
  assert.equal(visible().length,6);assert.ok(figures.length>12);
  visible()[5].querySelector('button').click();d.querySelector('.lightbox-next').click();
  assert.equal(d.querySelector('.lightbox img').src,figures[6].querySelector('button img').src,'Lightbox immediately shows a thumbnail beyond the first grid page');
  d.querySelector('.lightbox-close').click();
  for(let i=0;i<10;i++)d.dispatchEvent(new dom.window.Event('astro:page-load'));
  d.querySelector('[data-gallery-more]').click();assert.equal(visible().length,12);assert.equal(d.activeElement,figures[6].querySelector('button'));
  d.querySelector('[data-filter=nails]').click();assert.equal(visible().length,3);assert.ok(visible().every(f=>f.dataset.category==='nails'));assert.equal(d.querySelector('[data-gallery-more]').hidden,true);
  d.querySelector('[data-filter=all]').click();assert.equal(visible().length,6);assert.equal(d.querySelector('[data-gallery-more]').hidden,false);
  d.querySelector('.photo-button').click();d.dispatchEvent(new dom.window.Event('astro:before-swap'));assert.equal(d.querySelector('.lightbox').open,false);assert.equal(d.documentElement.classList.contains('lightbox-open'),false);
  await tick();dom.window.close();
});

test('Lightbox keeps the current thumbnail on failure and ignores stale full-size loads',async()=>{
 const dom=page('gallery'),d=dom.window.document,loads=[];
 dom.window.Image=class{set src(value){this.url=value;loads.push(this);}get src(){return this.url;}async decode(){}};
 load(dom,galleryCode);d.querySelector('[data-filter=nails]').click();const buttons=[...d.querySelectorAll('figure[data-category=nails] button')];
 buttons[0].click();const first=loads.at(-1);assert.equal(d.querySelector('.lightbox img').src,buttons[0].querySelector('img').src);
 d.querySelector('.lightbox-next').click();const second=loads.at(-1);second.onerror();
 assert.equal(d.querySelector('.lightbox-retry').hidden,false);assert.match(d.querySelector('[data-image-status]').textContent,/yuklanmadi/);
 first.onload();await tick();assert.equal(d.querySelector('.lightbox img').src,buttons[1].querySelector('img').src,'A stale image never replaces the selected image');
 assert.match(d.querySelector('.lightbox-book').href,/booking\/\?service=nails/);
 d.querySelector('.lightbox-retry').click();const retry=loads.at(-1);retry.onload();await tick();assert.equal(d.querySelector('.lightbox img').getAttribute('src'),retry.url);assert.equal(d.querySelector('[data-image-status]').textContent,'');
 d.querySelector('.lightbox-next').click();const pending=loads.at(-1);d.querySelector('.lightbox-close').click();pending.onload();await tick();assert.equal(d.querySelector('.lightbox').open,false);
 dom.window.close();
});

test('Demo booking carries only service, date and time to the same-tab admin preview',async()=>{
 const dom=page('booking'),d=dom.window.document;dom.window.fetch=()=>{throw new Error('Demo cannot send requests');};load(dom,bookingCode);
 d.querySelector('.test-data').click();d.querySelector('.next-button').click();d.querySelector('.next-button').click();
 d.querySelector('input[name=name]').value='Private customer';d.querySelector('input[name=phone]').value='+998981256886';d.querySelector('textarea').value='Private note';d.querySelector('.submit-button').click();await tick();
 const saved=dom.window.sessionStorage.getItem('beauty-me-demo-bookings-v1');assert.ok(saved);assert.ok(!saved.includes('Private'));assert.ok(!saved.includes('998981256886'));const choice=JSON.parse(saved)[0];assert.deepEqual(Object.keys(choice).sort(),['createdAt','date','id','service','time']);
 const link=d.querySelector('[data-admin-demo] a');assert.equal(link.getAttribute('href'),'/admin/demo/?view=leads');assert.equal(link.hasAttribute('target'),false);assert.equal(d.querySelector('[data-admin-demo]').hidden,false);dom.window.close();
});

test('Request booking keeps entered data on failure, reuses request ID, and prevents duplicate retry',async()=>{
  const dom=page('booking'),d=dom.window.document,panel=d.querySelector('[data-booking]');panel.dataset.requestMode='true';
  const consent=d.createElement('input');consent.type='checkbox';consent.name='consent';d.querySelector('[data-step="2"]').append(consent);
  const calls=[];let finish;
  dom.window.fetch=async(url,options)=>{assert.equal(url,'/api/leads/');calls.push(JSON.parse(options.body));if(calls.length===1)return{ok:false,json:async()=>({error:'Test retry'})};return new Promise(r=>{finish=r;});};
  load(dom,bookingCode);d.querySelector('.test-data').click();d.querySelector('.next-button').click();d.querySelector('.next-button').click();
  d.querySelector('.submit-button').click();await tick();assert.equal(calls.length,0,'Consent is required before transmission');
  consent.checked=true;d.querySelector('.submit-button').click();await tick();assert.equal(calls.length,1);assert.equal(d.querySelector('.form-error').textContent,'Test retry');assert.equal(d.querySelector('.submit-button').disabled,false);assert.equal(d.querySelector('input[name=name]').value,'Demo');
  d.querySelector('.submit-button').click();d.querySelector('form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));await tick();
  assert.equal(calls.length,2);assert.equal(calls[0].requestId,calls[1].requestId);assert.equal(d.querySelector('.submit-button').disabled,true);
  finish({ok:true,json:async()=>({ok:true})});await tick();assert.equal(d.querySelector('.booking-result').hidden,false);assert.equal(d.querySelector('input[name=name]').value,'');assert.equal(d.querySelector('input[name=phone]').value,'');
  dom.window.close();
});
