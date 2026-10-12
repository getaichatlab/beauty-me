import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {JSDOM} from 'jsdom';
import {buildSync} from 'esbuild';

const require=createRequire(import.meta.url);
const code=buildSync({stdin:{contents:"import AdminApp from './src/admin/AdminApp';window.__AdminApp=AdminApp;",resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,platform:'browser',format:'iife',jsx:'automatic',external:['react']}).outputFiles[0].text;
const modelCode=buildSync({entryPoints:['src/admin/model.ts'],bundle:true,write:false,platform:'node',format:'esm'}).outputFiles[0].text;
const {seed}=await import('data:text/javascript;base64,'+Buffer.from(modelCode).toString('base64'));
const stats={pageViews:0,sessions:0,telegram:0,phone:0,starts:0,leads:0,confirmed:0,conversion:0,newLeads:0,byDay:{},pages:{},sources:{},device:{mobile:0,desktop:0}};

async function mount(){
 const dom=new JSDOM('<!doctype html><body class="admin-body"><div id="root"></div></body>',{url:'http://localhost/admin/',runScripts:'outside-only',pretendToBeVisual:true});
 const originals=new Map();for(const key of ['window','document','HTMLElement','IS_REACT_ACT_ENVIRONMENT']){originals.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{value:key==='IS_REACT_ACT_ENVIRONMENT'?true:key==='window'?dom.window:dom.window[key],configurable:true,writable:true});}
 const media={matches:true,listeners:new Set(),addEventListener(_type,fn){this.listeners.add(fn);},removeEventListener(_type,fn){this.listeners.delete(fn);}};
 dom.window.matchMedia=()=>media;dom.window.structuredClone=structuredClone;dom.window.require=name=>require(name);
 const draft=seed();draft.services[0].label.uz='Juda uzun xizmat nomi va soch parvarishi bo‘yicha konsultatsiya';
 let saves=0;
 dom.window.fetch=async url=>{
  let body;const path=String(url).split('?')[0];
  if(path==='/api/auth/session/')body={user:{email:'long.administrator.address@example.test',role:'owner'},mode:'local'};
  else if(path==='/api/admin/content/'){body={draft,published:draft,revision:0,publishedRevision:0};saves++;}
  else if(path==='/api/admin/analytics/')body={stats,outbox:[]};
  else if(path==='/api/admin/leads/')body={items:[],total:0,offset:0,limit:50};
  else if(path==='/api/admin/members/')body={items:[{user_id:'test-owner',email:'long.administrator.address@example.test',role:'owner'}]};
  else if(['/api/admin/releases/','/api/admin/audit/'].includes(path))body={items:[]};
  else throw new Error('Unexpected fixture request: '+path);
  return{ok:true,json:async()=>structuredClone(body)};
 };
 dom.window.eval(code);const root=createRoot(dom.window.document.getElementById('root'));
 await act(async()=>{root.render(React.createElement(dom.window.__AdminApp));});
 const click=async el=>{await act(async()=>el.click());await act(async()=>{await new Promise(resolve=>dom.window.requestAnimationFrame(resolve));});};
 return{dom,media,click,saves:()=>saves,async cleanup(){await act(async()=>root.unmount());dom.window.close();for(const [key,value]of originals){if(value)Object.defineProperty(globalThis,key,value);else delete globalThis[key];}}};
}

test('Admin drawer hides closed navigation, traps focus, closes with Escape and releases background',async()=>{
 const page=await mount();try{
  const {document:d}=page.dom.window,trigger=d.querySelector('.a-menu'),sidebar=d.querySelector('.a-sidebar'),workspace=d.querySelector('.a-workspace');
  assert.equal(sidebar.inert,true);assert.equal(sidebar.getAttribute('aria-hidden'),'true');
  trigger.focus();await page.click(trigger);assert.equal(trigger.getAttribute('aria-expanded'),'true');assert.equal(workspace.inert,true);assert.equal(d.body.style.overflow,'hidden');assert.equal(d.activeElement,d.querySelector('.a-sidebar-close'));
  const first=sidebar.querySelector('a'),last=sidebar.querySelector('.a-logout');last.focus();
  await act(async()=>d.dispatchEvent(new page.dom.window.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true})));assert.equal(d.activeElement,first);
  await act(async()=>d.dispatchEvent(new page.dom.window.KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true,cancelable:true})));assert.equal(d.activeElement,last);
  await act(async()=>d.dispatchEvent(new page.dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true})));
  assert.equal(workspace.inert,false);assert.equal(sidebar.inert,true);assert.equal(d.body.style.overflow,'');assert.equal(d.activeElement,trigger);
  await page.click(trigger);await page.click(d.querySelector('.a-drawer-backdrop'));assert.equal(trigger.getAttribute('aria-expanded'),'false');
  await page.click(trigger);await act(async()=>{page.media.matches=false;for(const listener of page.media.listeners)listener();});
  assert.equal(sidebar.inert,false);assert.equal(workspace.inert,false);assert.equal(d.body.style.overflow,'');assert.equal(d.querySelector('.a-drawer-backdrop'),null);
 }finally{await page.cleanup();}
});

test('All ten admin views remain reachable; checkbox labels and empty pagination retain meaning',async()=>{
 const page=await mount();try{
  const d=page.dom.window.document,trigger=d.querySelector('.a-menu');
  const nav=[...d.querySelectorAll('.a-sidebar nav button')];assert.equal(nav.length,10);
  for(const button of nav){await page.click(trigger);await page.click(button);assert.equal(d.querySelector('.a-page-heading h1').textContent,button.querySelector('span').textContent+'.');assert.equal(trigger.getAttribute('aria-expanded'),'false');assert.equal(d.querySelector('.a-workspace').inert,false);}
  const settings=nav.find(b=>b.textContent.includes('Sozlamalar'));await page.click(settings);
  for(const label of d.querySelectorAll('.a-check')){assert.ok(label.querySelector('input[type=checkbox]'));assert.ok(label.querySelector('span').textContent.trim());}
  const leads=nav.find(b=>b.textContent.includes('Zayavkalar'));await page.click(leads);assert.match(d.querySelector('.a-pagination span').textContent,/0 ta so‘rov · 0–0/);
  assert.equal(page.saves(),1,'Navigating responsive views must not save or publish content');
 }finally{await page.cleanup();}
});
