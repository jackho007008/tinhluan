import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import CustomerReading from '../components/CustomerReading';
import {freezeReading} from '../lib/internal-review/dynamic-reading';
const samples=JSON.parse(fs.readFileSync('fixtures/customer-reading-samples.json','utf8'));
const paragraphBodies=(html:string)=>[...html.matchAll(/<p data-customer-text="[^"]*">([\s\S]*?)<\/p>/g)].map(m=>m[1]);
describe('Approved customer shell preserves saved semantics and original chart',()=>{
 it('keeps complete prose and original SVG for every existing structure in both modes',()=>{
  for(const x of samples){const report=freezeReading(x.snapshot,x.receipt).customerReport!;const before=JSON.stringify(report);
   for(const basic of [false,true]){const props={report,snapshot:x.snapshot,id:'test',basic};const old=renderToStaticMarkup(React.createElement(CustomerReading,props)),current=renderToStaticMarkup(React.createElement(CustomerReading,{...props,experience:true}));
    expect(paragraphBodies(current)).toEqual(paragraphBodies(old));expect(paragraphBodies(current)).toHaveLength(report.sections.filter(s=>!basic||report.basicSectionIds.includes(s.id)).flatMap(s=>s.paragraphs).length);
    const svg=(html:string)=>html.match(/<svg[^>]*data-chart-sheet[\s\S]*?<\/svg>/)?.[0];expect(svg(old)).toBeTruthy();expect(svg(current)).toBe(svg(old));
    expect(current).toContain('experience=1');expect(current).toContain('aria-label="Nội dung kết quả"');
   }expect(JSON.stringify(report)).toBe(before);
  }
 });
 it('PDF and classic route never opt into new web navigation',()=>{const x=samples[0],report=freezeReading(x.snapshot,x.receipt).customerReport!;
  const html=renderToStaticMarkup(React.createElement(CustomerReading,{report,snapshot:x.snapshot,print:true}));expect(html).not.toContain('experience-reading-tabs');expect(html).toContain('data-pdf-toc');
  const classic=renderToStaticMarkup(React.createElement(CustomerReading,{report,id:"test"}));expect(classic).not.toContain('experience=1');expect(classic).not.toContain('experience-reading-tabs');
 });
});
it('order view reuses full/basic saved prose, with order navigation and no edit/internal links',async()=>{
 const {default:ReferenceCustomerReading}=await import('../components/ReferenceCustomerReading');const x=samples[0],report=freezeReading(x.snapshot,x.receipt).customerReport!;
 for(const basic of [false,true]){
  const props={report,snapshot:x.snapshot,id:'source-reading',basic,publicTrial:true};
  const trial=renderToStaticMarkup(React.createElement(ReferenceCustomerReading,props));
  const order=renderToStaticMarkup(React.createElement(ReferenceCustomerReading,{...props,orderId:'order-id'}));
  expect(paragraphBodies(order)).toEqual(paragraphBodies(trial));expect(order).toContain('/don-thu?id=order-id');expect(order).not.toContain('/internal/');expect(order).not.toContain('/lap-la-so?edit=');expect(order).toContain('Tải PDF toàn bộ bản đọc');
 }
});
