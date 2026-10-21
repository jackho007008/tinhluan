import type { ChartSnapshot } from '../tuvi-engine';
import type { DerivedFact } from './derived';
import { verifiedNatalTransformations } from '../tuvi-engine/natal-transformations';
import { ruleSchema } from './schema';
export type CareerBranch = {id:string;title:string;section:string;page:string;stars:string[][];branches:string[];text:string;alone?:boolean;majorOnly?:boolean};
export const independentBranches:CareerBranch[] = [
 {id:'kinh-luc',title:'Kình Dương–Lực Sỹ đồng cung Quan Lộc',section:'8.32',page:'165–166',stars:[['Kình Dương'],['Lực Sỹ']],branches:[] as string[],text:'Quan Lộc có Kình Dương và Lực Sỹ bản mệnh đồng cung. Trong nhánh này, Tân Biên mô tả công danh trắc trở, sự ghi nhận từ người trên hạn chế và công việc khó bền lâu, đi cùng cảm giác bất đắc chí. Đây là lời luận cục bộ của tổ hợp trong sách, không xác nhận chức vị hay hoàn cảnh công việc thực tế của bạn.'},
 {id:'tham-xuong-khuc',title:'Tham Lang cùng Xương hoặc Khúc tại Quan Lộc',section:'8.23',page:'165',stars:[['Tham Lang'],['Văn Xương','Văn Khúc']],branches:['Hợi','Tý'],text:'Quan Lộc tại Hợi/Tý có Tham Lang bản mệnh đồng cung với Văn Xương hoặc Văn Khúc. Tân Biên mô tả riêng tổ hợp này theo hướng có danh chức, được nhiều người biết đến và tài lộc dồi dào. Đây là nhận định có điều kiện trong tài liệu, không phải xác nhận chức vụ, mức thu nhập hay mức độ nổi tiếng của bạn.'},
 {id:'sat-quyen',title:'Thất Sát và Hóa Quyền đồng cung Quan Lộc',section:'8.29',page:'165',stars:[['Thất Sát'],['Hóa Quyền']],branches:['Dần','Thân'],text:'Quan Lộc tại Dần/Thân có Thất Sát tọa thủ và Hóa Quyền bản mệnh đồng cung. Tân Biên mô tả riêng điều kiện này bằng uy quyền và sự vị nể. Không từ đó xác nhận chức vụ, năng lực lãnh đạo hoặc thành công thực tế; nhánh này không thay lời tổng hợp toàn cung.'},
];
type Truth = 'yes'|'no'|undefined;
const and=(xs:Truth[]):Truth=>xs.includes('no')?'no':xs.every(x=>x==='yes')?'yes':undefined;
const or=(xs:Truth[]):Truth=>xs.includes('yes')?'yes':xs.every(x=>x==='no')?'no':undefined;
export function independentCareerFacts(s:ChartSnapshot, specs:CareerBranch[]=independentBranches):DerivedFact[]{
 const qs=s.chart.palaces.map((p,i)=>({p,i})).filter(x=>x.p.name==='Quan Lộc');if(qs.length!==1)return [];
 const {p,i}=qs[0],base=`chart.palaces.${i}`,c=s.chart.tanBien?.completeness;
 const fields=['majorStars','minorStars','adjectiveStars'] as const;
 const all=fields.flatMap(g=>Array.isArray(p[g])?p[g]:[]);
 const full=c?.majorStars==='complete'&&c?.minorStars==='complete-with-declared-supplements'&&c?.adjectiveStars==='complete-with-declared-supplements'&&fields.every(g=>Array.isArray(p[g])&&p[g].every(st=>st&&typeof st.name==='string'&&st.name.trim()&&(st as {scope?:string}).scope==='origin'));
 const cert=verifiedNatalTransformations(s.chart);
 const present=(name:string):Truth=>{
   if(name==='Lực Sỹ'){const ring=(p as typeof p&{boshi12?:string}).boshi12;return s.chart.tanBien&&typeof ring==='string'&&ring.trim()?ring==='Lực Sỹ'?'yes':'no':undefined;}
   if(name==='Hóa Quyền'){if(all.some(st=>(st as {scope?:string}).scope==='origin'&&st.mutagen==='Quyền'))return 'yes';return cert?'no':undefined;}
   if(all.some(st=>st.name===name&&(st as {scope?:string}).scope==='origin'))return 'yes';return full?'no':undefined;
 };
 const valid=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'].includes(p.earthlyBranch);
 return specs.flatMap(r=>{
   const mainFull=c?.majorStars==='complete'&&Array.isArray(p.majorStars)&&p.majorStars.every(st=>(st as {scope?:string}).scope==='origin'&&typeof st.name==='string'&&st.name.trim());
   const mainPresent=(n:string):Truth=>p.majorStars?.some(st=>st.name===n&&(st as {scope?:string}).scope==='origin')?'yes':mainFull?'no':undefined;
   const alone:Truth=mainFull?(p.majorStars.length===1?'yes':'no'):undefined;
   const branch:Truth = valid ? (r.branches.includes(p.earthlyBranch)?'yes':'no') : undefined;
   const value=and([...r.stars.map(ns=>or(ns.map(r.majorOnly?mainPresent:present))),...(r.alone?[alone]:[]),...(r.branches.length?[branch]:[])]);
   if(!value)return [];
   return [{id:'fact.career-'+r.id,derivationId:'career-'+r.id,version:'1.0.0',value,text:value==='yes'?r.title+' — đủ các điều kiện vị trí bản mệnh.':r.title+' — ít nhất một điều kiện được dữ kiện xác nhận không thỏa.',evidencePaths:[base+'.name',base+'.earthlyBranch',...fields.filter(g=>Array.isArray(p[g])).map(g=>base+'.'+g),...(r.id==='kinh-luc'&&typeof (p as any).boshi12==='string'?[base+'.boshi12']:[]),...(cert?['chart.natalTransformations']:[])],status:'engine-reported' as const,limitation:'Quan hệ đồng cung, chỉ bản mệnh; thiếu danh sách không suy vắng mặt. Phương pháp trạng thái: không yêu cầu.'}];
 });
}
export const makeIndependentCareerRules=(specs:CareerBranch[])=>specs.map(r=>ruleSchema.parse({
 id:'tanbien.career-'+r.id,version:'0.1.0',kind:'interpretation',topic:'overview',origin:'catalog',requiredEngineProfile:['tanbien-vn-trial-v2'],requiredFacts:['fact.career-'+r.id,'fact.career-source-available'],conditions:[{fact:'fact.career-'+r.id,op:'eq',value:'yes'}],exceptions:[],claimTemplate:r.text,evidencePaths:['chart.palaces'],sourceReferences:[{id:'tanbien-supplied-pdf',title:'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên',url:'/internal/editorial/demo-wuqu-tianfu#source-list',location:`PDF/trang ebook ${r.page} §${r.section}; ngữ cảnh mục Quan Lộc158–167; đồng cung PDF33§2.8.`,accessedOn:'2026-10-12',rights:'pending',rightsNote:'Đối chiếu ảnh nguồn; xác minh văn bản, chưa có phê duyệt chuyên môn.'}],conflictsWith:[],conflictGroup:null,conflictPolicy:'retain-both',status:'draft',review:null,limitations:['Nhánh cục bộ theo điều kiện trực tiếp, chưa tổng hợp toàn cung.','Đoạn không nêu ngoại lệ riêng; không đồng nghĩa đã chứng minh không có điều chỉnh khác trong toàn lá số.'],presentation:{title:r.title,contentType:'combination',readingTheme:'work',readerLimit:'Nhận định trong tài liệu theo điều kiện cục bộ; không phải dự báo chắc chắn về đời sống thực tế.',sourceConditions:[...(r.alone?['Độc thủ: danh sách chính tinh đầy đủ và đúng một sao bản mệnh.']:[]),r.stars.map(x=>x.join(' hoặc ')).join(' và ')+' bản mệnh đồng cung tại Quan Lộc'+(r.branches.length?' ở '+r.branches.join(' hoặc '):'')+'.'],projectScope:['career-independent/1.0.0; profile v2; không thay phương pháp của rule cũ.','Phương pháp trạng thái: none — đoạn không đặt điều kiện sáng/mờ; không dùng bảng sát tinh để thêm hoặc loại nhánh.','Chỉ chính cung Quan Lộc; không thay bằng tam hợp, xung chiếu, nhị hợp.'],knownExceptions:[],unknownConditions:['Chưa có quy tắc hợp nhất nhánh này với mọi yếu tố khác của toàn cung; không tự cộng hoặc bù trừ.'],applicability:'Thỏa đồng thời các điều kiện nguồn và cổng dữ kiện hiện hành.',sourceScope:'Mục Quan Lộc, không mượn lời Mệnh hoặc hạn.'}
}));

// §8.29 is retained for source research/technical fixtures, not the current live profile.
export const independentCareerRules=makeIndependentCareerRules(independentBranches);
export const activeIndependentCareerRules=independentCareerRules.filter(r=>r.id!=="tanbien.career-sat-quyen");
