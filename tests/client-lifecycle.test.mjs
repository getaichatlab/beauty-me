import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {buildSync} from 'esbuild';
import {JSDOM} from 'jsdom';
const root=resolve(import.meta.dirname,'..');
function componentCode(name){const source=readFileSync(join(root,'src/components',`${name}.astro`),'utf8').split('<script>')[1].split('</script>')[0];return buildSync({stdin:{contents:source,loader:'ts',resolveDir:join(root,'src/components')},bundle:true,write:false,format:'iife',platform:'browser'}).outputFiles[0].text;}
const bookingCode=componentCode('Booking');const galleryCode=componentCode('Gallery');
const motionCode=buildSync({entryPoints:[join(root,'src/lib/motion.ts')],bundle:true,write:false,format:'iife',platform:'browser'}).outputFiles[0].text;
function page(path,query=''){
 const html=readFileSync(join(root,'dist/uz',path,'index.html'),'utf8');
 const dom=new JSDOM(html,{url:`http://localhost/uz/${path}/${query}`,runScripts:'outside-only',pretendToBeVisual:true});
 dom.window.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
 // Native browser boundaries only; these DOM tests do not claim layout/focus-trap QA.
 dom.window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
 dom.window.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new dom.window.Event('close'));};
 return dom;
}
function load(dom,code){dom.window.eval(code);dom.window.document.dispatchEvent(new dom.window.Event('astro:page-load'));}
function step(document,index){return document.querySelector(`[data-step="${index}"]`);}

test('Booking initializes after client navigation and keeps service query selection',()=>{
 const dom=page('booking','?service=nails');load(dom,bookingCode);const d=dom.window.document;
 assert.equal(d.querySelector('input[name=service]:checked').value,'nails');
 d.dispatchEvent(new dom.window.Event('astro:page-load'));
 d.querySelector('.next-button').click();assert.equal(step(d,1).hidden,false);assert.equal(step(d,2).hidden,true,'Repeated page-load must not duplicate click handlers');
 const fresh=page('booking').window.document.body.innerHTML;d.body.innerHTML=fresh;
 d.dispatchEvent(new dom.window.Event('astro:page-load'));d.querySelector('input[value=hair]').checked=true;d.querySelector('.next-button').click();assert.equal(step(d,1).hidden,false);
 dom.window.close();
});
test('Booking rejects missing dates and malformed phone; completion clears personal data',()=>{
 const dom=page('booking');load(dom,bookingCode);const d=dom.window.document;
 dom.window.fetch=()=>{throw new Error('Demo must not transmit customer input');};
 d.querySelector('input[value=hair]').checked=true;d.querySelector('.next-button').click();d.querySelector('.next-button').click();
 assert.equal(step(d,1).hidden,false);assert.ok(d.querySelector('.form-error').textContent.length);
 d.querySelector('.test-data').click();d.querySelector('.next-button').click();
 d.querySelector('input[name=phone]').value='123';d.querySelector('.submit-button').click();assert.equal(d.querySelector('.booking-result').hidden,true);
 d.querySelector('.test-data').click();d.querySelector('.submit-button').click();
 assert.equal(d.querySelector('.booking-result').hidden,false);assert.equal(d.querySelector('input[name=name]').value,'');assert.equal(d.querySelector('input[name=phone]').value,'');assert.equal(d.querySelector('form').hidden,true);
 dom.window.close();
});
test('Gallery filters, advances within visible results and restores focus/scroll lock',()=>{
 const dom=page('gallery');load(dom,galleryCode);const d=dom.window.document;
 d.querySelector('[data-filter=nails]').click();const visible=Array.from(d.querySelectorAll('figure[data-category]')).filter(f=>!f.hidden);
 assert.equal(visible.length,3);assert.ok(visible.every(f=>f.dataset.category==='nails'));assert.match(d.querySelector('[data-count]').textContent,/3/);
 const button=visible[0].querySelector('.photo-button');button.click();assert.ok(d.querySelector('.lightbox').open);assert.ok(d.documentElement.classList.contains('lightbox-open'));
 d.querySelector('.lightbox-next').click();assert.equal(d.querySelector('.lightbox img').src,visible[1].querySelector('.photo-button img').src);
 d.querySelector('.lightbox-close').click();assert.equal(d.activeElement,button);assert.equal(d.documentElement.classList.contains('lightbox-open'),false);
 dom.window.close();
});
test('Gallery route cleanup closes overlays and new DOM initializes again',()=>{
 const dom=page('gallery');load(dom,galleryCode);const d=dom.window.document;d.querySelector('.photo-button').click();
 d.dispatchEvent(new dom.window.Event('astro:before-swap'));assert.equal(d.querySelector('.lightbox').open,false);assert.equal(d.documentElement.classList.contains('lightbox-open'),false);
 const fresh=page('gallery').window.document.body.innerHTML;d.body.innerHTML=fresh;d.dispatchEvent(new dom.window.Event('astro:page-load'));d.querySelector('[data-filter=makeup]').click();
 assert.ok(Array.from(d.querySelectorAll('figure[data-category]')).filter(f=>!f.hidden).every(f=>f.dataset.category==='makeup'));
 dom.window.close();
});
test('Motion runtime initializes service selection and menu; route cleanup restores the document',()=>{
 const dom=page('');const d=dom.window.document;
 dom.window.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}});
 load(dom,motionCode);
 const button=d.querySelector('[data-service=nails]');button.click();
 assert.equal(button.getAttribute('aria-pressed'),'true');assert.equal(d.querySelector('[data-panel=nails]').hidden,false);assert.equal(d.querySelector('[data-panel=hair]').hidden,true);
 d.querySelector('.menu-button').click();assert.equal(d.querySelector('.menu-dialog').open,true);assert.equal(d.querySelector('.menu-button').getAttribute('aria-expanded'),'true');
 d.dispatchEvent(new dom.window.Event('astro:before-swap'));assert.equal(d.querySelector('.menu-dialog').open,false);assert.equal(d.documentElement.classList.contains('menu-open'),false);
 d.dispatchEvent(new dom.window.Event('astro:page-load'));d.querySelector('[data-service=makeup]').click();assert.equal(d.querySelector('[data-panel=makeup]').hidden,false);
 d.dispatchEvent(new dom.window.Event('astro:before-swap'));dom.window.close();
});
