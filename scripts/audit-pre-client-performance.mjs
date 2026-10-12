import fs from 'node:fs/promises';
import {chromium} from '../presentation/.build/node_modules/playwright/index.mjs';
const out='D:/fr_sayt/beauty-me/test-results/pre-client-audit';const data=JSON.parse(await fs.readFile(out+'/technical.json','utf8'));data.samples=[{...data.lab.vitals,...data.lab.navigation[0]}];
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
for(let i=0;i<2;i++){
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const p=await ctx.newPage();await p.addInitScript(()=>{window.auditVitals={lcp:0,cls:0};new PerformanceObserver(l=>{for(const e of l.getEntries())window.auditVitals.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.auditVitals.cls+=e.value;}).observe({type:'layout-shift',buffered:true});});
 const cdp=await ctx.newCDPSession(p);await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1600000/8,uploadThroughput:750000/8});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await p.goto('https://beauty-me-tashkent-demo.netlify.app/uz/',{waitUntil:'networkidle'});await p.waitForTimeout(1400);const sample=await p.evaluate(()=>({...window.auditVitals,ttfb:performance.getEntriesByType('navigation')[0].responseStart,domLoaded:performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd}));data.samples.push(sample);console.log(JSON.stringify(sample));await ctx.close();
}
await fs.writeFile(out+'/technical.json',JSON.stringify(data,null,2));await browser.close();
