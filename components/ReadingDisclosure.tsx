'use client';
import {Children,isValidElement,useId,useState,useEffect,useRef,type HTMLAttributes,type ReactElement} from 'react';
/** A button has no native DOM toggle before hydration. React event replay owns
 * expansion; this avoids the native <details open> race without hiding warnings. */
export default function ReadingDisclosure({children,className='',initiallyOpen=false,persistKey,...props}:HTMLAttributes<HTMLDivElement>&{initiallyOpen?:boolean;persistKey?:string}){
 const container=useRef<HTMLDivElement>(null),toggle=useRef<HTMLButtonElement>(null);
 const [open,setOpen]=useState(initiallyOpen),id=useId(),items=Children.toArray(children);
 const summary=items.find(child=>isValidElement(child)&&child.type==='summary') as ReactElement<{children:React.ReactNode}>|undefined;
 useEffect(()=>{if(persistKey){try{const saved=localStorage.getItem('tinhluan:open:'+persistKey);if(saved!==null)setOpen(saved==='true');}catch{}}const el=container.current;const show=()=>setOpen(true);el?.addEventListener('reading-reveal',show);return()=>el?.removeEventListener('reading-reveal',show);},[persistKey]);
 const change=(next:boolean)=>{setOpen(next);if(persistKey)try{localStorage.setItem('tinhluan:open:'+persistKey,String(next));}catch{}};
 const evidence='data-customer-evidence' in props;
 const close=()=>{change(false);toggle.current?.focus({preventScroll:true});if(evidence)container.current?.closest('article')?.scrollIntoView({block:'start'});};
 return <div ref={container} {...props} className={'reading-disclosure '+className} data-open={open?'true':'false'}>
 <button ref={toggle} type="button" className="disclosure-toggle" aria-expanded={open} aria-controls={id} onClick={()=>open?close():change(true)}>{summary?.props.children}</button>
 <div id={id} hidden={!open}>{items.filter(child=>child!==summary)}{evidence&&<button type="button" className="close-evidence" onClick={close}>Đóng căn cứ · trở lại đoạn đọc</button>}</div>
 </div>;
}
