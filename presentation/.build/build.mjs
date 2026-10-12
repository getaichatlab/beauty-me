import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
const workspaceDir='D:/fr_sayt/beauty-me/presentation';
const build=workspaceDir+'/.build',assets=build+'/assets';
const SKILL_DIR='C:/Users/Administrator/.codex/plugins/cache/openai-primary-runtime/presentations/26.1007.11041/skills/presentations';
const RUNTIME_PYTHON='C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
process.env.RUNTIME_NODE_MODULES='C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
process.env.RUNTIME_NODE=process.execPath;
const {finalizePresentation}=await import(pathToFileURL(SKILL_DIR+'/container_tools/artifact_tool_utils.mjs').href);
const p=Presentation.create({slideSize:{width:1280,height:720}});
const c={wine:'#4B182A',paper:'#F4EEE6',ink:'#2B2025',muted:'#75656D',rose:'#DDBCAF'};
function slide(bg){const s=p.slides.add();s.background.fill=bg;return s;}
function text(s,content,x,y,w,h,size=24,color=c.ink,font='Arial',bold=false,align='left'){
 const shape=s.shapes.add({geometry:'textbox',name:content.slice(0,50),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 shape.text=content;shape.text.style={typeface:font,fontSize:size,color,bold,alignment:align,verticalAlignment:'top',autoFit:'none',insets:0,wrap:'square'};return shape;
}
async function image(s,file,x,y,w,h,alt,fit='cover'){
 const bytes=await fs.readFile(file);return s.images.add({blob:bytes,contentType:file.endsWith('.webp')?'image/webp':'image/png',alt,fit,position:{left:x,top:y,width:w,height:h}});
}
function notes(s,content){s.speakerNotes.text=content;}
function link(s,label,url,x,y,w){const t=text(s,label,x,y,w,36,21,c.wine,'Arial',true);t.text.get(label).link={uri:url,isExternal:true};return t;}

// 1. Editorial cover, real salon work instead of a stock beauty scene.
{
 const s=slide(c.wine);
 await image(s,'D:/fr_sayt/beauty-me/public/media/classic-makeup.webp',720,0,560,720,'Beauty Me profilidagi makiyaj ishi');
 text(s,'Beauty Me',68,65,620,115,84,c.paper,'Georgia');
 text(s,'Salonning\nonlayn manzili',68,262,625,170,62,c.paper,'Georgia');
 text(s,'Xizmatlarni ko‘rsatish va\nmijozga bog‘lanishni osonlashtirish',72,485,580,86,27,c.rose);
 text(s,'Veb sayt va admin panel taqdimoti',72,634,595,34,20,c.paper);
 notes(s,'Beauty Me uchun tayyorlangan mustaqil demo konsepti. Haqiqiy surat salonning Instagram postidan: '+
 'https://www.instagram.com/beautyme_uz/p/CZya3dgt4T8/ . Sayt: https://beauty-me-tashkent-demo.netlify.app/uz/ .');
}
// 2. Tangible business benefits, no invented revenue forecast.
{
 const s=slide(c.paper);
 text(s,'Biznesga foydasi',64,45,820,70,52,c.wine,'Georgia');
 const rows=[['Ko‘proq ishonch','Salonning haqiqiy ishlari va xizmatlari\nmijozga tanlashda yordam beradi.'],['Yozilish osonroq','Xizmatni tanlash, Telegram yoki\ntelefon orqali bog‘lanish bir joyda.'],['Kamroq takroriy savol','Xizmatlar, manzil va aloqa ma’lumotini\nmijoz saytning o‘zida ko‘radi.'],['Reklama uchun bitta havola','Instagram bio, QR va reklama\nmijozni bir manzilga olib keladi.']];
 rows.forEach(([title,body],i)=>{const y=160+i*128;text(s,String(i+1).padStart(2,'0'),64,y,58,48,29,c.wine,'Georgia');text(s,title,135,y,440,35,25,c.wine,'Arial',true);text(s,body,135,y+42,454,65,21,c.muted);});
 await image(s,assets+'/home-desktop.png',627,169,609,403,'Sayt bosh sahifasining haqiqiy desktop ko‘rinishi','contain');
 text(s,'Beauty Me uslubiga mos ranglar,\nyirik suratlar va aniq yozilish tugmasi',648,600,548,65,23,c.wine);
 notes(s,'Skrinshot: https://beauty-me-tashkent-demo.netlify.app/uz/ . Ko‘rsatilgan foydalar interfeys vazifalaridan kelib chiqadigan imkoniyatlar, savdo yoki konversiya natijasiga kafolat berilmaydi. Hozirgi yozilish forma rejimi demo.');
}
// 3. Mobile browsing and the actual site contents.
{
 const s=slide(c.wine);
 text(s,'Mijoz uchun qulay ko‘rinish',64,40,1140,76,50,c.paper,'Georgia');
 await image(s,assets+'/home-mobile.png',64,154,231,500,'Beauty Me saytining telefon ekranidagi bosh sahifasi','contain');
 await image(s,assets+'/gallery-mobile.png',322,154,231,500,'Telefon ekranidagi galereya va xizmat filtrlarining haqiqiy ko‘rinishi','contain');
 text(s,'6 xizmat yo‘nalishi',620,164,586,48,31,c.paper,'Georgia');
 text(s,'Soch, tirnoq, kosmetologiya, qosh va\nkiprik, makiyaj hamda massaj',620,222,570,76,25,c.rose);
 text(s,'Haqiqiy ishlar galereyasi',620,326,578,43,29,c.paper,'Georgia');
 text(s,'Filtrlar, suratni kattalashtirish,\nsalon haqida va aloqa sahifalari',620,382,574,72,25,c.rose);
 text(s,'Telefon va kompyuter uchun',620,479,580,44,29,c.paper,'Georgia');
 text(s,'UZ/RU tillari, ijodiy o‘tishlar,\nyozilish formasi va Telegram havolasi',620,536,571,80,25,c.rose);
 notes(s,'Haqiqiy mobil skrinshotlar: https://beauty-me-tashkent-demo.netlify.app/uz/ va https://beauty-me-tashkent-demo.netlify.app/uz/gallery/ . Funksiyalar loyiha src/data/content.ts, Gallery va Booking komponentlari orqali tekshirilgan. Yozilish demo bosqichlarini ko‘rsatadi, haqiqiy ariza yubormaydi.');
}
// 4. Admin, with visible sample-data disclosure.
{
 const s=slide(c.paper);
 text(s,'Boshqaruv o‘z qo‘lingizda',64,43,1150,75,50,c.wine,'Georgia');
 await image(s,assets+'/admin-desktop.png',62,169,768,508,'Beauty Me demo admin paneli, statistik raqamlar namuna','contain');
 text(s,'Matn va rasmlar',870,166,350,43,28,c.wine,'Georgia');
 text(s,'Rasm yuklash, kesimini tanlash,\nxizmat va ma’lumotni yangilash',870,220,348,80,22,c.muted);
 text(s,'Mijoz so‘rovlari',870,315,350,43,28,c.wine,'Georgia');
 text(s,'Holat, izoh, mas’ul xodim\nva CSV eksport',870,367,344,75,22,c.muted);
 text(s,'Statistika va nazorat',870,455,350,44,28,c.wine,'Georgia');
 text(s,'Tashriflar, Telegram bosishlari,\nxodimlar va nashrlar tarixi',870,509,346,75,22,c.muted);
 text(s,'Demo: raqamlar namuna, tahrirlar brauzerda. Haqiqiy boshqaruv uchun baza ulanishi kerak.',866,610,350,83,18,c.wine);
 notes(s,'Admin screenshot and link: https://beauty-me-tashkent-demo.netlify.app/admin/demo/ . Dashboard statistics and leads are synthetic demo data, not salon performance. Demo transport stores only per-tab sessionStorage. Real publishing, customer requests and visit collection require Supabase deployment per ADMIN_SETUP.md. Source: ADMIN_DEMO_QA.md and src/admin/demo.ts.');
}
// 5. Two QR codes and clickable backup links.
{
 const s=slide(c.paper);
 text(s,'Sayt va panelni sinab ko‘rish',64,45,1150,80,51,c.wine,'Georgia');
 text(s,'QR kodni kamera bilan oching yoki havolani bosing',68,140,1110,40,25,c.muted);
 await image(s,assets+'/qr-site.png',150,225,260,260,'Sayt demo havolasi uchun QR kod','contain');
 await image(s,assets+'/qr-admin.png',782,225,260,260,'Parolsiz admin demo havolasi uchun QR kod','contain');
 text(s,'Mijoz uchun sayt',84,510,390,45,31,c.wine,'Georgia',false,'center');
 text(s,'Admin demo',716,510,390,45,31,c.wine,'Georgia',false,'center');
 link(s,'beauty-me-tashkent-demo.netlify.app/uz/','https://beauty-me-tashkent-demo.netlify.app/uz/',54,570,558);
 link(s,'beauty-me-tashkent-demo.netlify.app/admin/demo/','https://beauty-me-tashkent-demo.netlify.app/admin/demo/',678,570,590);
 text(s,'Admin parolsiz ochiladi. Namuna ma’lumotlarini tahrirlab ko‘rishingiz mumkin.',68,646,1120,35,21,c.muted);
 notes(s,'QR payloads are the exact HTTPS URLs printed on this slide. Standard QR codes use medium error correction and a four-module quiet zone. Public live URLs verified without a Netlify account.');
}

await fs.mkdir(build+'/renders',{recursive:true});
for(const [i,s]of p.slides.items.entries()){
 const png=await p.export({slide:s,format:'png',scale:1.5});await fs.writeFile(build+'/renders/slide-'+(i+1)+'.png',new Uint8Array(await png.arrayBuffer()));
 const layout=await s.export({format:'layout'});await fs.writeFile(build+'/renders/slide-'+(i+1)+'.json',await layout.text());
}
await fs.writeFile(build+'/deck.proto.json',JSON.stringify(p.toProto()));
await (await PresentationFile.exportPptx(p)).save(build+'/candidate.pptx');
await finalizePresentation({workspaceDir,candidatePath:build+'/candidate.pptx',finalPath:workspaceDir+'/output/Beauty-Me-Taqdimot-Final.pptx',pythonExecutable:RUNTIME_PYTHON,integrityValidatorPath:SKILL_DIR+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:SKILL_DIR+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],explicitTotalSlideCount:5,fontPolicy:{basis:'design',families:['Georgia','Arial']},verifyArtifactToolImport:true,receiptPath:build+'/validation-final.json'});
console.log('5-slide editable PPTX exported. PDF assembled separately from verified renders.');
