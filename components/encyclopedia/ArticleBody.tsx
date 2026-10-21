import type {ArticleContent} from '@/lib/encyclopedia/schema';
import {relatedArticleLink,type PublishedArticleLink} from '@/lib/encyclopedia/related';

// A deliberately small, text-only Markdown subset. Author content is always
// rendered as React text, never author HTML or URLs. Related links are resolved
// only from server-selected published articles.
type Alignment = 'left' | 'center' | 'right';
type Block = {text:string;id:string;level:number} & (
 | {kind:'paragraph'|'heading'}
 | {kind:'table';header:string[];rows:string[][];align:Alignment[]}
 | {kind:'list';items:string[];ordered:boolean;start:number}
);
function cells(line:string):string[]|null {
 const value=line.trim();
 if(!/(?<!\\)\|/.test(value))return null;
 const parts=value.split(/(?<!\\)\|/);
 if(value.startsWith('|'))parts.shift();
 if(/(?<!\\)\|$/.test(value))parts.pop();
 return parts.map(p=>p.trim().replace(/\\\|/g,'|'));
}
function tableStart(lines:string[],i:number){
 const header=cells(lines[i]??''),separator=cells(lines[i+1]??'');
 if(!header||!separator||header.length<2||header.length!==separator.length||!separator.every(c=>/^:?-{3,}:?$/.test(c)))return null;
 return {header,align:separator.map<Alignment>(c=>c.startsWith(':')&&c.endsWith(':')?'center':c.endsWith(':')?'right':'left')};
}
const listItem=(line:string)=>line.match(/^\s*(?:([-+*])|(\d+)[.)])\s+(.+)$/);
export function articleBlocks(body:string):Block[]{
 const lines=body.replace(/\r\n?/g,'\n').split('\n'),blocks:Block[]=[];
 let i=0;
 while(i<lines.length){
  if(!lines[i].trim()){i++;continue;}
  const start=i,heading=lines[i].trim().match(/^(#{2,3})\s+(.+)$/);
  const base=()=>({id:`section-${blocks.length}`,text:lines.slice(start,i).join('\n').trim(),level:0});
  if(heading){i++;blocks.push({...base(),kind:'heading',level:heading[1].length});continue;}
  const table=tableStart(lines,i);
  if(table){
   i+=2;const rows:string[][]=[];let valid=true;
   while(i<lines.length&&lines[i].trim()&&cells(lines[i])){
    const row=cells(lines[i])!;if(row.length!==table.header.length)valid=false;
    rows.push(row);i++;
   }
   // Preserve malformed input verbatim instead of silently dropping extra cells.
   blocks.push(valid?{...base(),kind:'table',...table,rows}:{...base(),kind:'paragraph'});continue;
  }
  const first=listItem(lines[i]);
  if(first){
   const ordered=!!first[2],items:string[]=[];
   while(i<lines.length){const item=listItem(lines[i]);if(!item||!!item[2]!==ordered)break;items.push(item[3]);i++;}
   blocks.push({...base(),kind:'list',items,ordered,start:ordered?Number(first[2]):1});continue;
  }
  i++;
  while(i<lines.length&&lines[i].trim()&&!/^#{2,3}\s+/.test(lines[i].trim())&&!tableStart(lines,i)&&!listItem(lines[i]))i++;
  blocks.push({...base(),kind:'paragraph'});
 }
 return blocks;
}
export default function ArticleBody({content,preview=false,publishedArticles=[]}:{content:ArticleContent;preview?:boolean;publishedArticles?:PublishedArticleLink[]}){
 const blocks=articleBlocks(content.body),headings=blocks.filter(b=>b.kind==='heading');
 let relatedSection=false;
 return <article className="ency-article">
  {preview&&<p className="ency-notice">Xem trước bản nháp · Chưa phải bài công khai</p>}
  <span className="eyebrow">{content.category}</span><h1>{content.title}</h1><p className="ency-lead">{content.description}</p>
  <details className="ency-toc" open><summary>Mục lục</summary><nav aria-label="Mục lục bài">
   {!headings.length&&<a href="#article-content">Nội dung bài</a>}
   {headings.map(h=><a key={h.id} href={'#'+h.id}>{h.text.replace(/^#{2,3}\s+/,'')}</a>)}<a href="#references">Nguồn tham khảo</a>
  </nav></details>
  <div id="article-content">{blocks.map(b=>{
   if(b.kind==='heading'&&b.level===2)relatedSection=b.text.replace(/^##\s+/,'').trim()==='Bài liên quan';
   if(b.kind==='heading')return b.level===2?<h2 id={b.id} key={b.id}>{b.text.replace(/^##\s+/,'')}</h2>:<h3 id={b.id} key={b.id}>{b.text.replace(/^###\s+/,'')}</h3>;
   if(b.kind==='table')return <div className="ency-table-region" key={b.id}>
    {b.header.length>2&&<p className="ency-table-hint" id={b.id+'-hint'}>Bảng rộng có thể cuộn ngang để xem đủ các cột.</p>}
    <div className="ency-table-scroll" role="region" aria-label={'Bảng: '+b.header.join(' · ')} aria-describedby={b.header.length>2?b.id+'-hint':undefined} tabIndex={0}>
     <table data-columns={b.header.length}><thead><tr>{b.header.map((cell,j)=><th key={j} scope="col" style={{textAlign:b.align[j]}}>{cell}</th>)}</tr></thead>
      <tbody>{b.rows.map((row,k)=><tr key={k}>{row.map((cell,j)=><td key={j} style={{textAlign:b.align[j]}}>{cell}</td>)}</tr>)}</tbody></table>
    </div>
   </div>;
   if(b.kind==='list'){const items=b.items.map((item,j)=>{const link=relatedSection?relatedArticleLink(item,publishedArticles):null;return <li key={j}>{link?<><a href={link.href}>{link.title}</a>{link.suffix}</>:item}</li>;});return b.ordered?<ol className="ency-list" start={b.start} key={b.id}>{items}</ol>:<ul className="ency-list" key={b.id}>{items}</ul>;}
   return <p className="ency-paragraph" key={b.id}>{b.text}</p>;
  })}</div>
  <section className="ency-sources" id="references"><h2>Nguồn tham khảo</h2>{content.references.split('\n').filter(Boolean).map((s,i)=><p key={i}>{s}</p>)}</section>
 </article>;
}
