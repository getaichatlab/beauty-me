import {useEffect,useRef,useState} from 'react';

export const drawerQuery='(max-width: 980px)';
const focusable='a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]';

export function useAdminDrawer(open:boolean,setOpen:(open:boolean)=>void,enabled:boolean){
 const [compact,setCompact]=useState(false);
 const sidebarRef=useRef<HTMLElement>(null),workspaceRef=useRef<HTMLDivElement>(null),menuButtonRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  const media=window.matchMedia(drawerQuery);
  const update=()=>{setCompact(media.matches);if(!media.matches)setOpen(false);};
  update();media.addEventListener('change',update);
  return()=>media.removeEventListener('change',update);
 },[setOpen]);
 useEffect(()=>{
  const sidebar=sidebarRef.current,workspace=workspaceRef.current;
  if(!sidebar||!workspace||!enabled)return;
  const previousFocus=document.activeElement instanceof HTMLElement?document.activeElement:menuButtonRef.current;
  sidebar.inert=compact&&!open;workspace.inert=compact&&open;
  if(!compact||!open)return()=>{sidebar.inert=false;workspace.inert=false;};
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const controls=()=>Array.from(sidebar.querySelectorAll<HTMLElement>(focusable)).filter(el=>!el.hidden&&!el.closest('[hidden]'));
  // Wait for the drawer's visibility transition before focusing its controls.
  const focusFrame=requestAnimationFrame(()=>{(sidebar.querySelector<HTMLButtonElement>('.a-sidebar-close')||controls()[0])?.focus();});
  const onKey=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();setOpen(false);return;}
   if(event.key!=='Tab')return;
   const items=controls(),first=items[0],last=items.at(-1);
   if(!first||!last)return;
   if(!sidebar.contains(document.activeElement)){event.preventDefault();(event.shiftKey?last:first).focus();}
   else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  };
  document.addEventListener('keydown',onKey);
  return()=>{
   cancelAnimationFrame(focusFrame);document.removeEventListener('keydown',onKey);document.body.style.overflow=previousOverflow;workspace.inert=false;sidebar.inert=false;
   if(previousFocus?.isConnected&&(previousFocus!==menuButtonRef.current||window.matchMedia(drawerQuery).matches))previousFocus.focus();
   else sidebar.querySelector<HTMLElement>('nav button.active')?.focus();
  };
 },[compact,open,enabled,setOpen]);
 return{compact,sidebarRef,workspaceRef,menuButtonRef};
}
