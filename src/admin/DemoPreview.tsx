import {useEffect,useRef} from 'react';
import type {SiteContent} from './model';
export default function DemoPreview({content,lang,onClose}:{content:SiteContent;lang:'uz'|'ru';onClose:()=>void}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{ref.current?.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow;};},[]);
 const active=content.media.filter(m=>m.active!==false);
 const photo=active.find(m=>m.id===content.brand.heroMediaId);
 const services=content.services.filter(s=>s.active);
 return <dialog ref={ref} className="a-demo-preview" aria-label="Qoralama ko‘rinishi" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
  <div className="a-preview-header"><strong>Qoralama ko‘rinishi · {lang.toUpperCase()}</strong><button autoFocus onClick={onClose} aria-label="Namunani yopish">×</button></div>
  <p>Suratlar, xizmatlar va aloqa — hozirgi qoralamangizdan. Demo o‘zgarishlar faqat ushbu tabda ko‘rinadi.</p>
  <div className="a-preview-site" style={{background:content.theme.paper,color:content.theme.wine}}>
   <div className="a-preview-brand">{content.brand.name}<small>{content.ui[lang].salon}</small></div>
   <section className="a-preview-hero"><div><span>{content.brand.city[lang]} / {content.brand.district[lang]}</span><h2>{content.heroWords[lang].map((line,i)=><span key={i}>{line}</span>)}</h2><p>{content.ui[lang].heroText}</p><span className="a-preview-cta">{content.ui[lang].book} ↗</span></div>{photo&&<img src={photo.src480||photo.src} alt={photo.alt[lang]} style={{objectPosition:photo.focus}}/>}</section>
   <section className="a-preview-services"><h3>{content.ui[lang].navServices}</h3><div>{services.map(s=><article key={s.id}><h4>{s.label[lang]}</h4><p>{s.intro[lang]}</p><small>{s.price?.[lang]|| (lang==='uz'?'Narxni salon bilan aniqlashtiring':'Стоимость уточните у салона')}</small></article>)}</div></section>
   <section className="a-preview-gallery"><h3>{content.ui[lang].galleryTitle}</h3><div>{active.slice(0,6).map(m=><figure key={m.id}><img src={m.src480||m.src} alt={m.alt[lang]} style={{objectPosition:m.focus}} loading="lazy"/><figcaption>{m.title[lang]}</figcaption></figure>)}</div></section>
   {content.team.some(m=>m.active)&&<section className="a-preview-team"><h3>{content.ui[lang].navTeam}</h3>{content.team.filter(m=>m.active).map(m=><p key={m.id}>{m.name} · {m.specialty[lang]}</p>)}</section>}
   <section className="a-preview-contact"><h3>{content.ui[lang].navContact}</h3><p>{content.brand.address[lang]}</p><p>{content.brand.addressNote[lang]}</p><strong>{content.brand.phone}</strong>{content.hours[lang]&&<p>{content.hours[lang]}</p>}</section>
  </div>
 </dialog>;
}
