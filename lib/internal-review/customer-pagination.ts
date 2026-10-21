/** Browser-only print layout. It consumes the saved report DOM; never calls rules or edits prose. */
export function paginateCustomerReport(){
 const source=document.querySelector<HTMLElement>('.customer-report');
 if(!source)throw Error('PRINT_REPORT_MISSING');
 const css=document.createElement('style');
 css.textContent=`.pdf-output{width:174mm!important;margin:0!important;padding:0!important}.pdf-page{height:255mm;width:174mm;display:flow-root;margin:0!important;padding:1px 0;box-sizing:border-box;overflow:visible;break-after:page;page-break-after:always;position:relative}.pdf-page:last-child{break-after:auto;page-break-after:auto}.pdf-page>*{max-width:100%;box-sizing:border-box}.pdf-page h2{margin:0 0 12px!important;padding-top:5px}.pdf-page h3,.pdf-page h4{margin:12px 0 5px}.pdf-page p,.pdf-page li{font-size:10.5pt;line-height:1.6;margin:0 0 12px;orphans:2;widows:2}.pdf-page .appendix-block{font-size:9.5pt;line-height:1.5}.pdf-page .toc-row{display:flex;justify-content:space-between;gap:16px;border-bottom:1px dotted #bda27c;margin-bottom:9px}.pdf-page .toc-row a{color:#5d202c;text-decoration:none}.pdf-page .toc-row span{flex:none}.pdf-page .chart-page{break-after:auto!important}.pdf-page .pdf-only{display:block!important}`;
 for(const style of Array.from(source.querySelectorAll(':scope > style')))document.head.appendChild(style.cloneNode(true));
 document.head.appendChild(css);
 const output=document.createElement('main');output.className='customer-report pdf-output';
 output.dataset.customerVersion=source.dataset.customerVersion;
 source.after(output);
 const pages:HTMLElement[]=[],entries:{title:string;page:HTMLElement;anchor:string}[]=[];
 let page!:HTMLElement;
 const newPage=()=>{page=document.createElement('section');page.className='pdf-page';output.appendChild(page);pages.push(page);return page;};
 const fits=()=>page.scrollHeight<=page.clientHeight+1;
 const hasContent=()=>page.childNodes.length>0;
 const place=(node:HTMLElement)=>{
  page.appendChild(node);
  if(fits())return;
  page.removeChild(node);
  if(hasContent()){
   const carry:HTMLElement[]=[];
   while(page.lastElementChild&&(/^H[234]$/.test(page.lastElementChild.tagName)||page.lastElementChild.matches('[data-customer-intro],.read-context'))){const h=page.lastElementChild as HTMLElement;h.remove();carry.unshift(h);}
   newPage();
   for(const h of carry){page.appendChild(h);const entry=entries.find(e=>e.anchor===h.id);if(entry)entry.page=page;}
   page.appendChild(node);if(fits())return;page.removeChild(node);
  }
  // Long paragraphs/conditions can exceed one page. Split only at word boundaries,
  // using measured layout; text sequence is preserved exactly after whitespace normalization.
  if(!['P','LI','UL','DIV'].includes(node.tagName)||node.querySelector('svg,img'))throw Error('PRINT_UNSPLITTABLE_OVERFLOW');
  const words=(node.textContent||'').trim().split(/\s+/u);let start=0;
  while(start<words.length){
   const part=document.createElement('p');part.className=node.className;page.appendChild(part);
   let low=1,high=words.length-start,best=0;
   while(low<=high){const n=Math.floor((low+high)/2);part.textContent=words.slice(start,start+n).join(' ');if(fits()){best=n;low=n+1;}else high=n-1;}
   if(!best)throw Error('PRINT_TEXT_OVERFLOW');
   part.textContent=words.slice(start,start+best).join(' ');start+=best;
   if(start<words.length)newPage();
  }
 };
 newPage();
 const cover=source.querySelector('.cover');
 if(cover)for(const node of Array.from(cover.children)){if(node instanceof HTMLElement&&!node.classList.contains('no-print'))place(node.cloneNode(true) as HTMLElement);}
 const toc=newPage();const tocTitle=document.createElement('h2');tocTitle.textContent='Mục lục';toc.appendChild(tocTitle);
 newPage();
 const chart=source.querySelector<HTMLElement>('.chart-page');
 if(chart){const clone=chart.cloneNode(true) as HTMLElement;clone.id='pdf-chart';place(clone);entries.push({title:'Lá số bản mệnh',page,anchor:clone.id});newPage();}
 const sections=Array.from(source.querySelectorAll<HTMLElement>(':scope > .chapter, :scope > #palaces, :scope > #transformations, :scope > #source-list, :scope > #source-appendix'));
 for(const section of sections){
  const title=section.dataset.pdfHeading||section.querySelector('h2')?.textContent||'';
  const nodes=Array.from(section.querySelectorAll<HTMLElement>('h2,h3,h4,p,ul')).filter(n=>!n.closest('details,.reading-disclosure,.no-print')&&!n.parentElement?.closest('p,ul'));
  // Short interpretation groups stay together; a whole topic never forces a page break.
  // Long groups flow at paragraph boundaries. No prose or claim is recomputed here.
  const prepared=new Set<Element>();
  for(const node of nodes){
   const group=node.closest('[data-customer-paragraph]');
   if(group&&!prepared.has(group)){
    prepared.add(group);
    const groupNodes=nodes.filter(n=>n.closest('[data-customer-paragraph]')===group);
    const probe=document.createElement('div');probe.style.display='flow-root';
    for(const n of groupNodes)probe.appendChild(n.cloneNode(true));
    page.appendChild(probe);const height=probe.getBoundingClientRect().height,here=fits();probe.remove();
    // Only short base/qualification units (at most 28% of a page) are kept intact.
    if(height<=page.clientHeight*.28&&!here&&hasContent()){
     const carry:HTMLElement[]=[];
     while(page.lastElementChild&&(/^H[234]$/.test(page.lastElementChild.tagName)||page.lastElementChild.matches('[data-customer-intro],.read-context'))){const n=page.lastElementChild as HTMLElement;n.remove();carry.unshift(n);}
     newPage();for(const n of carry){page.appendChild(n);const entry=entries.find(e=>e.anchor===n.id);if(entry)entry.page=page;}
    }
   }
   const clone=node.cloneNode(true) as HTMLElement;
   if(section.id==='source-appendix')clone.classList.add('appendix-block');
   // scrollHeight is at least clientHeight; use last child bounds for remaining space.
   if(/^H[234]$/.test(clone.tagName)&&hasContent()){
    const last=page.lastElementChild!.getBoundingClientRect();
    if(page.getBoundingClientRect().bottom-last.bottom<115){
     const carry:HTMLElement[]=[];
     while(page.lastElementChild&&(/^H[234]$/.test(page.lastElementChild.tagName)||page.lastElementChild.matches('[data-customer-intro],.read-context'))){const h=page.lastElementChild as HTMLElement;h.remove();carry.unshift(h);}
     newPage();
     for(const h of carry){page.appendChild(h);const entry=entries.find(e=>e.anchor===h.id);if(entry)entry.page=page;}
    }
   }
   if(node.tagName==='H2'){clone.id='pdf-section-'+entries.length;place(clone);entries.push({title,page,anchor:clone.id});}
   else place(clone);
  }
 }
 // Remove an unused trailing page, without manufacturing a blank page in a short report.
 if(!hasContent()){page.remove();pages.pop();}
 for(const entry of entries){const row=document.createElement('p');row.className='toc-row';const a=document.createElement('a');a.href='#'+entry.anchor;a.textContent=entry.title;const number=document.createElement('span');number.textContent=String(pages.indexOf(entry.page)+1);row.append(a,number);toc.appendChild(row);}
 if(toc.scrollHeight>toc.clientHeight+1)throw Error('PRINT_TOC_OVERFLOW');
 source.remove();
 const result={pages:pages.length,toc:entries.map(e=>({title:e.title,page:pages.indexOf(e.page)+1})),overflow:pages.filter(p=>p.scrollHeight>p.clientHeight+1).length};
 if(result.overflow)throw Error('PRINT_PAGE_OVERFLOW');
 if(pages.some(p=>p.lastElementChild&&/^H[234]$/.test(p.lastElementChild.tagName)))throw Error('PRINT_ORPHAN_HEADING');
 return result;
}
