'use client';
import {useEffect,useId,useState,type ReactNode,type KeyboardEvent} from 'react';
const tabs=[['overview','Tổng quan'],['palaces','12 cung'],['transformations','Tứ Hóa'],['periods','Vận hạn']] as const;
export default function ResultTabs({children}:{children:ReactNode[]}){
 const [active,setActive]=useState(0),prefix=useId();
 useEffect(()=>{
  const reveal=()=>{
   let id='';try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
   const target=id?document.getElementById(id):null;
   const panel=target?.closest<HTMLElement>('[data-result-panel]');
   const index=tabs.findIndex(([key])=>key===panel?.dataset.resultPanel);
   if(index<0)return;
   setActive(index);
   target?.closest('.palace-chapter')?.dispatchEvent(new Event('reading-reveal'));
   requestAnimationFrame(()=>target?.scrollIntoView({block:'start'}));
  };
  const revealTarget=(e:Event)=>{
   const panel=(e.target as HTMLElement)?.closest<HTMLElement>('[data-result-panel]');
   const index=tabs.findIndex(([key])=>key===panel?.dataset.resultPanel);
   if(index>=0)setActive(index);
  };
  reveal();window.addEventListener('hashchange',reveal);
  document.addEventListener('reading-reveal',revealTarget,true);
  return()=>{window.removeEventListener('hashchange',reveal);document.removeEventListener('reading-reveal',revealTarget,true);};
 },[]);
 function select(i:number){setActive(i);document.getElementById(`${prefix}-tab-${i}`)?.focus();}
 function navigate(e:KeyboardEvent<HTMLButtonElement>,i:number){
  const next=e.key==='ArrowRight'?(i+1)%4:e.key==='ArrowLeft'?(i+3)%4:e.key==='Home'?0:e.key==='End'?3:undefined;
  if(next!==undefined){e.preventDefault();select(next);}
 }
 return <><div className="result-tabs" role="tablist" aria-label="Nội dung kết quả">{tabs.map(([key,label],i)=><button type="button" key={key} role="tab" id={`${prefix}-tab-${i}`} aria-controls={`${prefix}-panel-${i}`} aria-selected={active===i} tabIndex={active===i?0:-1} onClick={()=>setActive(i)} onKeyDown={e=>navigate(e,i)}>{label}</button>)}</div>
 {tabs.map(([key],i)=><div key={key} role="tabpanel" id={`${prefix}-panel-${i}`} aria-labelledby={`${prefix}-tab-${i}`} hidden={active!==i} tabIndex={0} data-result-panel={key}>{children[i]}</div>)}</>;
}
