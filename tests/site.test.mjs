import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {services,ui,route} from '../src/data/content.ts';
import {media} from '../src/data/media.ts';
import {localDate,validPhone,formatDate} from '../src/lib/booking.ts';
const root=resolve(import.meta.dirname,'..');
test('Phone validation accepts complete numbers and rejects malformed input',()=>{
 for(const value of ['+998 98 125 68 86','998981256886','98 125 68 86','+44 20 7946 0958'])assert.ok(validPhone(value),value);
 for(const value of ['','99898125','+998 98 125 68 866','+998hello981256886','++998981256886','000','<script>'])assert.equal(validPhone(value),false,value);
});
test('Date minimum uses the local calendar rather than a UTC day',()=>{assert.equal(localDate(new Date(2026,9,7,0,5)),'2026-10-07');assert.equal(localDate(new Date(2026,0,2,23,59)),'2026-01-02');});
test('Booking dates are readable even when a browser lacks Uzbek locale data',()=>{assert.equal(formatDate('2026-10-07','uz'),'7-oktabr 2026');assert.equal(formatDate('2026-01-02','ru'),'2 января 2026 г.');});
test('Both languages have complete dictionaries and each service has unique routes',()=>{
 assert.deepEqual(Object.keys(ui.uz).sort(),Object.keys(ui.ru).sort());
 assert.equal(new Set(services.map(s=>s.id)).size,services.length);
 for(const lang of ['uz','ru']){for(const value of Object.values(ui[lang]))assert.ok(value.trim()); for(const service of services){assert.ok(service.label[lang]);assert.ok(service.intro[lang]);assert.ok(service.items[lang].length);assert.equal(route(lang,`/services/${service.id}/`),`/${lang}/services/${service.id}/`);}}
});
test('Published media is local and has provenance and accessible text',()=>{
 for(const item of media){assert.match(item.src,/^\/media\/[a-z0-9-]+\.webp$/);assert.ok(existsSync(join(root,'public',item.src)));assert.ok(existsSync(join(root,'public',item.src.replace('.webp','-480.webp'))));assert.match(item.sourceUrl,/^https:\/\/www\.instagram\.com\/[\w.]+\/(p|reel)\//);assert.equal(item.viaProfile,'https://www.instagram.com/beautyme_uz/');assert.ok(item.width>0&&item.height>0);assert.ok(item.alt.uz&&item.alt.ru);}
});
const pages=[];
function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const file=join(dir,entry.name);if(entry.isDirectory())walk(file);else if(file.endsWith('.html'))pages.push(file);}}
test('Built bilingual pages and service details are all present',()=>{
 assert.ok(existsSync(join(root,'dist')),'Run npm run build before testing');walk(join(root,'dist'));
 for(const lang of ['uz','ru'])for(const path of ['', 'services','gallery','about','contact','booking','privacy',...services.map(s=>`services/${s.id}`)])assert.ok(existsSync(join(root,'dist',lang,path,'index.html')),`${lang}/${path}`);
 assert.ok(existsSync(join(root,'dist','404.html')));
});
test('Built pages have no broken internal links or images, and are marked as demos',()=>{
 assert.ok(pages.length>20);
 for(const page of pages){const html=readFileSync(page,'utf8');assert.match(html,/<meta name="robots" content="noindex(?:,nofollow)?"/);if(!html.includes('http-equiv="refresh"')){assert.match(html,/<html lang="(uz|ru)"/);if(page.includes(join('admin','demo')))assert.match(html,/Beauty Me boshqaruvi yuklanmoqda/);else assert.equal((html.match(/<h1\b/g)||[]).length,1,page);}
 for(const match of html.matchAll(/(?:href|src)="(\/[^" ]*)"/g)){const raw=match[1].split(/[?#]/)[0];if(!raw)continue;const target=join(root,'dist',decodeURIComponent(raw));assert.ok(existsSync(target)||existsSync(join(target,'index.html')),`${page}: ${raw}`);}
 for(const match of html.matchAll(/srcset="([^"]+)"/g))for(const candidate of match[1].split(',')){const url=candidate.trim().split(/\s+/)[0];if(url.startsWith('/'))assert.ok(existsSync(join(root,'dist',decodeURIComponent(url))),`${page}: responsive image ${url}`);}
 }
});
test('Booking never persists customer input in browser storage',()=>{
 const source=readFileSync(join(root,'src/components/Booking.astro'),'utf8');
 for(const forbidden of ['localStorage','sessionStorage','data-netlify','XMLHttpRequest'])assert.ok(!source.includes(forbidden),forbidden);
 assert.ok(source.includes('e.preventDefault()'));assert.ok(source.includes('form.reset()'));assert.ok(source.includes('textContent='));
});
