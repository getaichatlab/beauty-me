import fs from 'node:fs/promises';
import {chromium} from '../presentation/.build/node_modules/playwright/index.mjs';
const base='https://beauty-me-tashkent-demo.netlify.app';
const out='D:/fr_sayt/beauty-me/test-results/pre-client-audit';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const report={base,at:new Date().toISOString(),viewports:[],interaction:{},networkErrors:[],consoleErrors:[]};
const paths=['','services','gallery','about','contact','booking','privacy','services/hair','services/nails','services/skin','services/brows','services/makeup','services/massage'];
async function visible(page){await page.evaluate(async()=>{const root=document.scrollingElement; for(let y=0;y<root.scrollHeight;y+=window.innerHeight*.8){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,130));}window.scrollTo({top:0,behavior:'instant'});});await page.waitForTimeout(800);}
for(const width of [390,1440,320,768]){
 const ctx=await browser.newContext({viewport:{width,height:width<500?844:900},deviceScaleFactor:1,isMobile:width<500,hasTouch:width<500});
 const p=await ctx.newPage();
 p.on('pageerror',e=>report.consoleErrors.push({width,message:e.message}));
 p.on('response',r=>{if(r.status()>=400)report.networkErrors.push({width,url:r.url(),status:r.status()});});
 p.on('requestfailed',r=>{if(!r.failure()?.errorText.includes('ERR_ABORTED'))report.networkErrors.push({width,url:r.url(),error:r.failure()?.errorText});});
 for(const lang of ['uz','ru'])for(const path of paths){
  const url=base+'/'+lang+'/'+(path?path+'/':'');
  const response=await p.goto(url,{waitUntil:'networkidle',timeout:45000});await p.evaluate(()=>document.fonts.ready);await visible(p);
  const info=await p.evaluate(()=>({title:document.title,height:document.documentElement.scrollHeight,width:window.innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelector('h1')?.innerText,sections:[...document.querySelectorAll('main>section')].map(s=>({name:s.className,y:Math.round(s.getBoundingClientRect().top+scrollY),height:Math.round(s.getBoundingClientRect().height)})),images:[...document.querySelectorAll('main img')].filter(i=>i.offsetWidth>0).map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0,width:i.offsetWidth,height:i.offsetHeight,fit:getComputedStyle(i).objectFit})),headings:[...document.querySelectorAll('main h1,main h2')].map(h=>({text:h.textContent,font:getComputedStyle(h).fontFamily,fontSize:getComputedStyle(h).fontSize,lines:Math.round(h.getBoundingClientRect().height/parseFloat(getComputedStyle(h).lineHeight))})),external:[...document.querySelectorAll('main a[target="_blank"]')].map(a=>({text:a.innerText,href:a.href})),ogImage:document.querySelector('meta[property="og:image"]')?.content||null,hero:[...document.querySelectorAll('.hero-stage .button-row>a,.hero-main-frame')].map(el=>({name:el.className,top:Math.round(el.getBoundingClientRect().top),bottom:Math.round(el.getBoundingClientRect().bottom)}))}));
  report.viewports.push({width,lang,path,status:response.status(),...info});await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));
  if(lang==='uz'&&[390,1440].includes(width)&&['','services','gallery','about','contact','booking','services/skin','services/nails'].includes(path)){
   const name=(path||'home').replaceAll('/','-');await p.screenshot({path:out+'/'+width+'-'+name+'-full.png',fullPage:true});
   if(!path)await p.screenshot({path:out+'/'+width+'-home-fold.png'});
  }
 }
 if(width===390){
  await p.goto(base+'/uz/',{waitUntil:'networkidle'});await p.locator('.menu-button').click();report.interaction.menuOpen=await p.locator('#mobile-menu').evaluate(e=>e.open);await p.screenshot({path:out+'/390-menu.png'});await p.locator('.menu-close').click();report.interaction.menuClose=await p.locator('#mobile-menu').evaluate(e=>!e.open);
  await p.locator('[data-service="nails"]').click();report.interaction.serviceNails=await p.locator('[data-panel="nails"]').isVisible();
  await p.goto(base+'/uz/gallery/',{waitUntil:'networkidle'});await p.locator('[data-filter="nails"]').click();report.interaction.nailsCount=await p.locator('[data-count]').innerText();await p.locator('.photo-button:visible').first().click();report.interaction.lightboxOpen=await p.locator('.lightbox').evaluate(e=>e.open);await p.screenshot({path:out+'/390-lightbox.png'});await p.locator('.lightbox-next').click();report.interaction.lightboxNext=await p.locator('.lightbox figcaption').innerText();await p.locator('.lightbox-close').click();
  await p.goto(base+'/uz/booking/?service=nails',{waitUntil:'networkidle'});report.interaction.bookingSelected=await p.locator('input[name=service]:checked').inputValue();await p.locator('.test-data').click();await p.locator('.next-button').click();await p.screenshot({path:out+'/390-booking-step2.png'});await p.locator('.next-button').click();await p.screenshot({path:out+'/390-booking-step3.png'});await p.locator('button[type=submit]').click();report.interaction.bookingResult=await p.locator('.booking-result').innerText();
  await p.goto(base+'/admin/demo/',{waitUntil:'networkidle'});await p.screenshot({path:out+'/390-admin-fold.png'});report.interaction.adminDemoNotice=await p.locator('.a-demo-notice').innerText();
 }
 await ctx.close();console.log('Audited viewport '+width+'; '+report.viewports.length+' route/viewports complete.');
 await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));
}
await browser.close();console.log(JSON.stringify({views:report.viewports.length,overflow:report.viewports.filter(v=>v.scrollWidth>v.width).map(v=>({width:v.width,lang:v.lang,path:v.path,scrollWidth:v.scrollWidth})),badImages:report.viewports.flatMap(v=>v.images.filter(i=>!i.ok).map(i=>({width:v.width,path:v.path,...i}))),networkErrors:report.networkErrors,consoleErrors:report.consoleErrors,interaction:report.interaction},null,2));

