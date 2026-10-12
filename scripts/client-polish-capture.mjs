import fs from 'node:fs/promises';
import {chromium} from '../presentation/.build/node_modules/playwright/index.mjs';
const out='test-results/client-polish';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:900},isMobile:width===390,hasTouch:width===390});
 for(const path of ['uz/','ru/','uz/services/skin/','uz/about/','admin/demo/']){
 await page.goto('http://127.0.0.1:4325/'+path,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(900);
 if(path==='admin/demo/')await page.waitForSelector('.a-demo-notice');
 await page.screenshot({path:`${out}/${width}-${path.replaceAll('/','-')}fold.png`});
 if(path==='uz/'){await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,180));}window.scrollTo({top:0,behavior:'instant'});});await page.waitForTimeout(500);await page.screenshot({path:`${out}/${width}-home-full.png`,fullPage:true});console.log(width,await page.evaluate(()=>({height:document.documentElement.scrollHeight,scrollWidth:document.documentElement.scrollWidth})));}
 }await page.close();
}await browser.close();
