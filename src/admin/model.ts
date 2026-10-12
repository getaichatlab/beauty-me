import {z} from 'zod';
import {brand} from '../config/brand';
import {ui,services,faq} from '../data/content';
import {media} from '../data/media';
const text=z.string().trim().max(5000);
const pair=z.object({uz:text,ru:text});
const url=z.string().refine(v=>{try{return ['https:','http:'].includes(new URL(v).protocol);}catch{return false;}},'To‘g‘ri http/https havola kiriting');
const id=z.string().regex(/^[a-z0-9][a-z0-9-]{0,59}$/);
export const mediaSchema=z.object({id,src:z.string().regex(/^(\/media\/|\/api\/media\/|https:\/\/)/),src480:z.string().optional(),sourceUrl:z.string().max(1000),viaProfile:z.string().optional(),category:id,title:pair,alt:pair,width:z.number().int().positive().max(20000),height:z.number().int().positive().max(20000),focus:z.string().regex(/^\d{1,3}% \d{1,3}%$/).optional(),active:z.boolean().default(true)});
const serviceSchema=z.object({id,number:z.string().max(4),label:pair,headline:pair,intro:pair,price:pair.optional(),items:z.object({uz:z.array(text).max(30),ru:z.array(text).max(30)}),faq:z.array(z.object({q:pair,a:pair})).max(30),active:z.boolean().default(true)});
export const contentSchema=z.object({
 trackingEnabled:z.boolean().default(false),
 hours:pair.default({uz:'',ru:''}),logoMediaId:z.string().default(''),
 seo:z.record(z.string().max(100),z.object({title:pair,description:pair})).default({}),
 team:z.array(z.object({id,name:z.string().max(80),specialty:pair,mediaId:z.string().default(''),active:z.boolean().default(false)})).max(30).default([]),
 brand:z.object({name:z.string().trim().min(2).max(60),monogram:z.string().max(5),monogramSuffix:z.string().max(10),instagramHandle:z.string().max(80),district:pair,city:pair,heroMediaId:id,phone:z.string().max(30),phoneHref:z.string().regex(/^\+\d{9,15}$/),instagram:url,telegram:url,map:url,address:pair,addressNote:pair,mode:z.enum(['demo','production']),bookingMode:z.enum(['demo','request']),verifiedAt:z.string().max(30)}),
 ui:z.object({uz:z.record(z.string(),text),ru:z.record(z.string(),text)}),
 faq:z.object({uz:z.array(z.object({q:text,a:text})).max(40),ru:z.array(z.object({q:text,a:text})).max(40)}),
 services:z.array(serviceSchema).min(1).max(40),media:z.array(mediaSchema).max(200),
 heroWords:z.object({uz:z.tuple([text,text]),ru:z.tuple([text,text])}),heroAccents:z.array(id).max(2),
 theme:z.object({wine:z.string().regex(/^#[a-fA-F0-9]{6}$/),paper:z.string().regex(/^#[a-fA-F0-9]{6}$/)}),
});
export type SiteContent=z.infer<typeof contentSchema>;
export type Role='owner'|'manager'|'editor';
export const seed=()=>contentSchema.parse({brand,ui,services,media,faq,heroWords:{uz:['Sizga mos obraz.','Bir salonda.'],ru:['Ваш образ.','В одном салоне.']},heroAccents:['nude-manicure'],theme:{wine:'#4B182A',paper:'#F4EEE6'}});
export const statuses=['new','contacted','confirmed','completed','cancelled','no_answer','spam'] as const;
export const leadSchema=z.object({requestId:z.uuid(),name:z.string().trim().min(2).max(70),phone:z.string().regex(/^\+?\d[\d\s()-]{8,24}$/),service:id,date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),time:z.enum(['anytime','morning','afternoon','evening']),note:z.string().max(500).default(''),lang:z.enum(['uz','ru']),consent:z.literal(true),website:z.string().max(200).default(''),sessionId:z.uuid().nullable().default(null),utm:z.record(z.string(),z.string().max(120)).default({})});
export const eventSchema=z.object({id:z.uuid(),sessionId:z.uuid(),pageId:z.uuid(),name:z.enum(['page_view','service_view','telegram_click','phone_click','instagram_click','map_click','booking_start','booking_step']),path:z.string().regex(/^\/(uz|ru)(\/[^?]*)?$/).max(200),lang:z.enum(['uz','ru']),placement:z.string().max(40).default('page'),device:z.enum(['mobile','desktop']),referrer:z.string().max(100).default(''),utm:z.record(z.string(),z.string().max(120)).default({})});
export function validatePublish(content:SiteContent){
 const errors:string[]=[];
 if(!content.media.some(m=>m.id===content.brand.heroMediaId&&m.active))errors.push('Hero uchun faol rasm tanlang.');
 if(new Set(content.services.map(s=>s.id)).size!==content.services.length)errors.push('Xizmat ID takrorlangan.');
 if(new Set(content.media.map(m=>m.id)).size!==content.media.length)errors.push('Rasm ID takrorlangan.');
 for(const s of content.services.filter(s=>s.active))for(const lang of ['uz','ru'] as const)if(!s.label[lang]||!s.headline[lang]||!s.intro[lang])errors.push(`${s.id}: ${lang} matnlarini to‘ldiring.`);
 for(const m of content.media.filter(m=>m.active))if(!m.alt.uz||!m.alt.ru)errors.push(`${m.id}: ikki tilda alt kiriting.`);
 for(const p of content.team.filter(p=>p.active))if(!p.name||!p.specialty.uz||!p.specialty.ru)errors.push('Faol usta uchun ism va ikki tilda mutaxassislik kiriting.');
 if(content.logoMediaId&&!content.media.some(m=>m.id===content.logoMediaId&&m.active))errors.push('Logo uchun faol surat tanlang.');
 if(content.brand.bookingMode==='request'&&(!content.ui.uz.privacyText||!content.ui.ru.privacyText))errors.push('Maxfiylik matni kerak.');
 return errors;
}
