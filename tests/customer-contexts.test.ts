import {it,expect} from 'vitest';import fs from 'node:fs';
import {buildCustomerReport} from '../lib/internal-review/customer-report';
import {contextualizeCustomerReport} from '../lib/internal-review/customer-contexts';
import {captureReportPolicy} from '../lib/trial/reading-policy';
const dir='.local/di-void-shared-20261021/after';
const build=(i:number)=>{const b=JSON.parse(fs.readFileSync(`${dir}/${i}.json`,'utf8'));return {b,r:buildCustomerReport(b.snapshot,b.continuous,b.customer.catalogVersion)};};
it('children means contradictions stay together, including the independent support clause',()=>{
 for(const i of [34,127,139,152]){const {b,r}=build(i),s=r.sections.find(s=>s.palaces.includes('Tử Nữ'))!;expect(s.paragraphs).toHaveLength(1);const p=s.paragraphs[0];expect(p.context?.kind).toBe('unresolved');expect(p.context?.methodResolved).toBe(false);expect(p.text).toContain('không khá giả');expect(p.text).toContain('sự hỗ trợ từ con về sau');expect(p.text).toContain('chưa có căn cứ');
 for(const old of b.customer.sections.find((s:any)=>s.palaces.includes('Tử Nữ')).paragraphs){expect(p.text).toContain(old.text);for(const m of old.members)expect(p.members.find(n=>n.claim.id===m.claim.id)).toEqual(m);}}
});
it('parents shortage and wealth share a context, while inheritance uses a different explanation',()=>{
 for(const i of [3,9,51,63,147]){const {r}=build(i),p=r.sections.flatMap(s=>s.paragraphs).find(p=>p.context?.ids.includes('parents-means'))!;expect(p).toBeDefined();expect(p.text).toContain('thiếu thốn');expect(p.text).toContain('của cải');expect(p.text).toContain('chưa có căn cứ');}
 const {r}=build(13),p=r.sections.flatMap(s=>s.paragraphs).find(p=>p.context?.ids.includes('parents-inheritance'))!;expect(p.context?.kind).toBe('distinct-aspects');expect(p.text).toContain('con không được thừa hưởng');expect(p.text).toContain('hai phương diện riêng');
});
it('covers accumulation with Thien Khong, creation with loss, and property maintenance',()=>{
 for(const [i,id] of [[130,'money-accumulation-loss'],[11,'money-creation-loss'],[131,'property-facets'],[3,'property-estate'],[137,'money-sequence-loss']] as const){const {r}=build(i),p=r.sections.flatMap(s=>s.paragraphs).find(p=>p.context?.ids.includes(id))!;expect(p).toBeDefined();expect(p.context?.methodResolved).toBe(false);expect(p.members.length).toBeGreaterThan(1);expect(p.relations).toEqual(expect.arrayContaining([expect.objectContaining({source:expect.any(String)})]));}
 expect(build(137).r.sections.flatMap(s=>s.paragraphs).find(p=>p.context?.ids.includes('money-sequence-loss'))!.text).toContain('ngoài 30');
});
it('whole conditions and G2 stay intact; identity and date do not select a conclusion',()=>{
 const {b,r}=build(9);expect(captureReportPolicy(r,b.continuous.palaces.find((p:any)=>p.name==='Mệnh'))).toEqual(b.accessPolicy);
 const other=structuredClone(b.snapshot);other.normalized.name='Tên khác';other.normalized.date='2000-01-01';const changed=buildCustomerReport(other,b.continuous,b.customer.catalogVersion);expect(changed.sections).toEqual(r.sections);
 const before=JSON.stringify(r.sections);contextualizeCustomerReport(r.sections);expect(JSON.stringify(r.sections)).toBe(before);
});
it('unlisted meanings and a missing opposite remain separate, without a fabricated conflict',()=>{
 const {r}=build(34),s=r.sections.find(s=>s.palaces.includes('Tử Nữ'))!;const p=structuredClone(s.paragraphs[0]);delete p.context;p.id='technical';p.members=p.members.slice(0,1);p.members[0].claim.rules.forEach(r=>r.id='future.unclassified');s.paragraphs=[p];const before=JSON.stringify(s);contextualizeCustomerReport([s]);expect(JSON.stringify(s)).toBe(before);
});

it('sample50 separates acquisition/scale/dispute from retention and retains the whole clauses',()=>{
 const {b,r}=build(50),p=r.sections.flatMap(s=>s.paragraphs).find(p=>p.context?.ids.includes('property-facets'))!;
 expect(p.context?.kind).toBe('distinct-aspects');expect(p.context?.ids).not.toContain('property-retention');
 expect(p.text).not.toContain('Một lời riêng nêu');expect(p.text).not.toContain('Lời khác nêu');expect(p.text).not.toContain('khác chiều');
 for(const old of b.customer.sections.flatMap((s:any)=>s.paragraphs).filter((q:any)=>!q.id.startsWith('customer-')&&q.members.some((m:any)=>m.claim.rules.some((r:any)=>['tanbien.dien-dong-cu','tanbien.dien-ky'].includes(r.id)))))expect(p.text).toContain(old.text);
 expect(p.text).toContain('không suy mua bán hoặc tranh chấp thành mất tài sản');
});
it('former property-retention members are classified by their stated meaning, not all as loss',()=>{
 const base=build(50).b.customer.sections.flatMap((s:any)=>s.paragraphs).find((p:any)=>p.members.some((m:any)=>m.claim.rules.some((r:any)=>r.id==='tanbien.dien-ky')));
 const fixture=(id:string)=>{const p=structuredClone(base);p.id=id;p.text='Điều kiện và toàn ý riêng '+id+'.';p.claimIds=[id];p.sentences=[{text:p.text,claimIds:[id],kind:'paraphrase'}];p.members=p.members.slice(0,1);p.members[0].claim.id=id;p.members[0].claim.rules=p.members[0].claim.rules.slice(0,1);p.members[0].claim.rules[0].id='tanbien.'+id;p.relations=[];return p;};
 for(const id of ['dien-dong-cu','dien-dong-ti-hoi','dien-dong-dau','dien-dong-am-ngo','dien-luong-low','dien-liem','dien-liem-tham','dien-tuong-low','dien-da','dien-vu-pha','dien-tham-mo','dien-tham-other','dien-pha-thin-tuat']){
  const s:any={id:'assets',palaces:['Điền Trạch'],paragraphs:[fixture('dien-ky'),fixture(id)]};contextualizeCustomerReport([s]);expect(s.paragraphs[0].context.kind,id).toBe('distinct-aspects');expect(s.paragraphs[0].relations.every((r:any)=>r.kind==='complementary'),id).toBe(true);
 }
 for(const id of ['dien-liem-phu','dien-tu-sat','dien-tu-tham','dien-sun-high','dien-pha-ty-ngo']){
  const s:any={id:'assets',palaces:['Điền Trạch'],paragraphs:[fixture('dien-ky'),fixture(id)]};contextualizeCustomerReport([s]);expect(s.paragraphs[0].context.kind,id).toBe('unresolved');
 }
});
it('retention, accumulation, livelihood and timing are not interchangeable',()=>{
 for(const [i,id] of [[130,'money-accumulation-loss'],[49,'money-accumulation-loss'],[22,'money-retention-flow'],[137,'money-sequence-loss']] as const){const p=build(i).r.sections.flatMap(s=>s.paragraphs).find(p=>p.context?.ids.includes(id))!;expect(p.context?.kind).toBe('distinct-aspects');expect(p.text).not.toContain('Các lời khác chiều');}
 for(const i of [157,160]){const p=build(i).r.sections.flatMap(s=>s.paragraphs).find(p=>p.context?.ids.includes('money-retention'))!;expect(p.context?.kind).toBe('unresolved');expect(p.sentences.filter(s=>s.kind==='editorial-transition')).toHaveLength(1);}
});
