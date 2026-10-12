import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage();await page.goto('https://beauty-me-tashkent-demo.netlify.app/uz/');
const result=await page.evaluate(()=>typeof BarcodeDetector);console.log('Browser QR decoder: '+result);await browser.close();
