import type {CustomerReport} from './customer-report';
/** Offline indices over frozen evidence; no matching, eligibility or paraphrased conclusions. */
export function customerAppendix(report:CustomerReport){
 const sources:{key:string;title:string;locations:string[]}[]=[],conditions:{key:string;text:string[]}[]=[],facts:{key:string;text:string[]}[]=[],limits:{key:string;text:string[]}[]=[],paragraphs:{section:string;number:number;sourceKeys:string[];conditionKeys:string[];factKeys:string[];limitKeys:string[]}[]=[];
 const unique=(x:string[])=>[...new Set(x.filter(Boolean))];
 const register=(arr:{key:string;text:string[]}[],prefix:string,values:string[])=>{const text=unique(values);if(!text.length)return null;const old=arr.find(v=>JSON.stringify(v.text)===JSON.stringify(text));if(old)return old.key;const key=prefix+(arr.length+1);arr.push({key,text});return key;};
 for(const section of report.sections)for(const [i,p]of section.paragraphs.entries()){
  const sk:string[]=[],ck:string[]=[],fk:string[]=[],lk:string[]=[];
  for(const m of p.members)for(const l of m.layers){
   for(const s of l.sources){let source=sources.find(a=>a.title===s.title);if(!source){source={key:'N'+(sources.length+1),title:s.title,locations:[]};sources.push(source);}if(!source.locations.includes(s.location))source.locations.push(s.location);sk.push(source.key);}
   const c=register(conditions,'Đ',l.sourceConditions),f=register(facts,'D',unique([...l.snapshot.map(f=>f.text),...l.sourceFacts.map(f=>f.text)])),lim=register(limits,'G',l.limits);
   if(c)ck.push(c);if(f)fk.push(f);if(lim)lk.push(lim);
  }
  paragraphs.push({section:section.title,number:i+1,sourceKeys:unique(sk),conditionKeys:unique(ck),factKeys:unique(fk),limitKeys:unique(lk)});
 }
 return{sources,conditions,facts,limits,paragraphs};
}
