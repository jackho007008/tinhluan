'use client';
import {useEffect} from 'react';
/** Per-edition UI state only; never stores report prose or access credentials. */
export default function ReadingPosition({edition}:{edition:string}){
 useEffect(()=>{
  const key='tinhluan:position:'+edition;let ready=false,timer:ReturnType<typeof setTimeout>|undefined;
  const reveal=(id:string,offset=0,focus=false)=>{const el=document.getElementById(id);if(!el)return;
   // Wait until sibling disclosure effects have registered before revealing a saved anchor.
   requestAnimationFrame(()=>{el.dispatchEvent(new CustomEvent('reading-reveal',{bubbles:true}));
   requestAnimationFrame(()=>{window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top+offset,behavior:'instant'});if(focus){el.tabIndex=-1;el.focus({preventScroll:true});}ready=true;});});
  };
  const save=()=>{if(!ready)return;const els=Array.from(document.querySelectorAll<HTMLElement>('[data-reading-position][id]')).filter(e=>e.getClientRects().length&&(e.closest('#reading')||e.id==='reading-options'));
   const anchor=els.filter(e=>e.getBoundingClientRect().top<=120).at(-1);if(!anchor)return;
   history.replaceState(null,'','#'+anchor.id);
   try{localStorage.setItem(key,JSON.stringify({id:anchor.id,offset:-anchor.getBoundingClientRect().top,hash:location.hash}));}catch{}
  };
  const click=(e:MouseEvent)=>{const a=(e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');if(!a)return;let id='';try{id=decodeURIComponent(a.hash.slice(1));}catch{return;}if(!document.getElementById(id))return;e.preventDefault();history.replaceState(null,'',a.hash);reveal(id,-80,true);};
  const hash=()=>{try{reveal(decodeURIComponent(location.hash.slice(1)),-80);}catch{}};
  let restored=false;try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved&&(!location.hash||saved.hash===location.hash)&&typeof saved.id==='string'&&Number.isFinite(saved.offset)&&document.getElementById(saved.id)){reveal(saved.id,Math.max(-500,Math.min(20000,saved.offset)));restored=true;}}catch{}
  if(!restored&&location.hash)hash();
  requestAnimationFrame(()=>{ready=true;});
  const scroll=()=>{clearTimeout(timer);timer=setTimeout(save,120);};
  document.addEventListener('click',click);window.addEventListener('hashchange',hash);window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('pagehide',save);
  return ()=>{save();clearTimeout(timer);document.removeEventListener('click',click);window.removeEventListener('hashchange',hash);window.removeEventListener('scroll',scroll);window.removeEventListener('pagehide',save);};
 },[edition]);
 return null;
}
