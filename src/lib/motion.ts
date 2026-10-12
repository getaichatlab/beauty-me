import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import {design} from '../config/design';
import {initInteractions} from './interactions';

gsap.registerPlugin(ScrollTrigger,SplitText);
let dispose:()=>void=()=>{};
let generation=0;
let entered=false;
let activeBody:HTMLElement|undefined;

export async function initMotion(){
  initInteractions();if(activeBody===document.body)return;activeBody=document.body;
  dispose();const current=++generation;
  const controller=new AbortController();const {signal}=controller;
  const splits:SplitText[]=[];
  const media=gsap.matchMedia();
  let context:gsap.Context|undefined;
  const closeOverlays=()=>{document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach(d=>d.close());document.documentElement.classList.remove('menu-open','lightbox-open');};
  dispose=()=>{controller.abort();gsap.killTweensOf(document.querySelectorAll('.explorer-panel,.explorer-image,.menu-dialog,.mobile-menu a'));media.revert();context?.revert();splits.forEach(split=>split.revert());closeOverlays();};
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const animate=(el:Element,options:gsap.TweenVars)=>{if(!reduced.matches)gsap.fromTo(el,{opacity:.5,y:10},{opacity:1,y:0,duration:.35,clearProps:'opacity,transform',...options});};

  document.addEventListener('beautyme:menu-open',()=>{
    const menu=document.querySelector('.menu-dialog');if(!menu)return;
    animate(menu,{duration:.25});
    if(!reduced.matches)gsap.fromTo(menu.querySelectorAll('.mobile-menu a'),{x:12,opacity:.4},{x:0,opacity:1,duration:.25,stagger:.025,clearProps:'all'});
  },{signal});
  let refreshFrame=0;
  document.addEventListener('beautyme:layout-change',()=>{cancelAnimationFrame(refreshFrame);refreshFrame=requestAnimationFrame(()=>{if(!signal.aborted)ScrollTrigger.refresh();});},{signal});
  signal.addEventListener('abort',()=>cancelAnimationFrame(refreshFrame),{once:true});
  const compact=window.matchMedia('(max-width:650px)').matches;
  const serviceImage=document.querySelector<HTMLElement>('[data-service-feature]');
  if(serviceImage)serviceImage.style.viewTransitionName=`service-${serviceImage.dataset.serviceFeature}`;
  reduced.addEventListener('change',()=>{media.revert();context?.revert();splits.forEach(s=>s.revert());},{signal});
  if(reduced.matches)return;

  // Local fonts may already be cached. No waiting overlay is created.
  await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,650))]);
  if(current!==generation||signal.aborted)return;
  try{
    context=gsap.context(()=>{
      const hero=document.querySelector('[data-hero]');
      if(hero){
        const short=entered;entered=true;
        hero.querySelectorAll<HTMLElement>('.hero-line').forEach((line,i)=>{
          const split=SplitText.create(line,{type:'lines',mask:'lines',linesClass:'split-line',autoSplit:true,onSplit(self){return gsap.from(self.lines,{yPercent:115,duration:compact?.45:short?.55:.85,delay:.08+i*design.stagger,ease:'power3.out'});}});splits.push(split);
        });
        const curtain=hero.querySelector<HTMLElement>('.image-curtain');
        const intro=gsap.timeline({defaults:{ease:'power3.out'}});
        if(curtain){gsap.set(curtain,{display:'block',scaleY:1,opacity:.12});intro.to(curtain,{scaleY:0,duration:compact?.45:short?.5:.7,onComplete:()=>gsap.set(curtain,{display:'none'})},.1);}
        intro.from(hero.querySelector('.hero-main-frame>img'),{scale:1.06,duration:compact?.55:.8},.1)
          .from(hero.querySelectorAll('[data-hero-accent]'),{y:20,opacity:0,duration:.4,stagger:.08},.25)
          .from(hero.querySelector('.hero-description'),{y:10,opacity:0,duration:compact?.3:.5},compact?.15:.25)
          .from(hero.querySelector('.hero-art-note'),{opacity:0,duration:.3},.5);
      }
      document.querySelectorAll<HTMLElement>('h1[data-split],h2[data-split],.booking-intro h1,.contact-section h2,.contact-section h1').forEach(heading=>{
        splits.push(SplitText.create(heading,{type:'lines',mask:'lines',linesClass:'split-line',autoSplit:true,onSplit(self){return gsap.from(self.lines,{yPercent:105,duration:compact?.4:.75,stagger:.055,ease:'power3.out',scrollTrigger:{trigger:heading,start:'top 92%',once:true}});}}));
      });
      document.querySelectorAll<HTMLElement>('.gallery-grid figure,.about-visual,.contact-details,.booking-panel,.service-feature-image').forEach((element,i)=>{
        gsap.from(element,{y:compact?12:22,opacity:0,duration:compact?.35:.65,delay:(i%3)*.045,ease:'power2.out',scrollTrigger:{trigger:element,start:'top 94%',once:true}});
      });
    });
    media.add('(min-width: 851px) and (prefers-reduced-motion: no-preference)',()=>{
      const heroArt=document.querySelector('.hero-art');
      if(heroArt)gsap.to(heroArt,{y:-25,ease:'none',scrollTrigger:{trigger:'[data-hero]',start:'top top',end:'bottom top',scrub:1}});
      const about=document.querySelector('.about-feature:not(.about-page) .about-copy');
      if(about&&window.innerHeight>650)ScrollTrigger.create({trigger:about,start:'top 24%',end:'+=100',pin:true,pinSpacing:false});
      const cleanups:Array<()=>void>=[];
      document.querySelectorAll<HTMLElement>('[data-magnet]').forEach(button=>{
        const move=(event:PointerEvent)=>{if(event.pointerType!=='mouse')return;const box=button.getBoundingClientRect();gsap.to(button,{x:Math.max(-5,Math.min(5,(event.clientX-box.left-box.width/2)*.05)),y:Math.max(-5,Math.min(5,(event.clientY-box.top-box.height/2)*.08)),duration:.3});};
        const leave=()=>gsap.to(button,{x:0,y:0,duration:.4});
        button.addEventListener('pointermove',move);button.addEventListener('pointerleave',leave);
        cleanups.push(()=>{button.removeEventListener('pointermove',move);button.removeEventListener('pointerleave',leave);gsap.set(button,{clearProps:'transform'});});
      });
      return()=>cleanups.forEach(cleanup=>cleanup());
    });
    ScrollTrigger.refresh();
  }catch(error){context?.revert();splits.forEach(s=>s.revert());document.querySelectorAll<HTMLElement>('.image-curtain').forEach(e=>e.style.display='none');console.warn('Motion fallback: content remains visible.',error);}
}

document.addEventListener('astro:page-load',()=>void initMotion());
document.addEventListener('astro:before-swap',()=>{generation++;dispose();activeBody=undefined;});
if(document.readyState!=='loading')void initMotion();
