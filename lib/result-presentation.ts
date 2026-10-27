import type {ChartSnapshot} from './tuvi-engine';
import {customerInfo,majorStatus} from './chart-customer-info';
import {starState} from './chart-presentation';
import {verifiedNatalTransformations} from './tuvi-engine/natal-transformations';
import {rulerConvention} from './ruler-conventions';
import type {ReadingScope} from './trial/reading-policy';

export const RESULT_UI_VERSION='result-package1-1.0.0';
export const RESULT_PALACES=['Mệnh','Phụ Mẫu','Phúc Đức','Điền Trạch','Quan Lộc','Nô Bộc','Thiên Di','Tật Ách','Tài Bạch','Tử Nữ','Phu Thê','Huynh Đệ'] as const;
export type AiReadingState='not-created'|'generating'|'completed'|'error'|'not-entitled';
export const AI_STATE_LABELS:Record<AiReadingState,string>={
 'not-created':'Chưa tạo','generating':'Đang tạo','completed':'Hoàn thành','error':'Lỗi','not-entitled':'Chưa có quyền',
};
// A future server-owned AI record must supply actual states/results. Catalog text
// is never evidence of AI completion; this release neither generates nor queues.
export function initialAiState(name:string,scope:ReadingScope):AiReadingState {
 return name==='Mệnh'||scope.full?'not-created':'not-entitled';
}
export const TRANSFORMATION_GUIDE=[
 {kind:'Lộc',text:'Trong mô tả khái quát của Tân Biên, Hóa Lộc gắn với tài lộc và việc giữ chức vị. Các tổ hợp đi kèm có thể có ý nghĩa khác nhau.',source:'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên, trang PDF 40, mục 3.23.'},
 {kind:'Quyền',text:'Hóa Quyền được mô tả qua sự mạnh bạo, mau mắn và xu hướng nắm quyền hành. Nguồn yêu cầu phân biệt các sao đi kèm.',source:'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên, trang PDF 40, mục 3.24.'},
 {kind:'Khoa',text:'Hóa Khoa gắn với học vấn, thi cử và văn bài trong mô tả khái quát của nguồn. Vị trí riêng lẻ chưa xác định thành tựu cá nhân.',source:'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên, trang PDF 40–41, mục 3.25.'},
 {kind:'Kỵ',text:'Mô tả khái quát về Hóa Kỵ có cả thị phi, nhầm lẫn và giữ của cải. Cần xét riêng vị trí và tổ hợp; không quy thành kết luận tốt hoặc xấu toàn cung.',source:'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên, trang PDF 41, mục 3.26.'},
] as const;
/** Read the saved snapshot only. Never run the engine or fill a historical chart. */
export function resultPresentation(snapshot?:ChartSnapshot){
 const info=snapshot?customerInfo(snapshot):[];
 const convention=snapshot?rulerConvention(snapshot):undefined;
 const rulers=snapshot?.chart.rulers;
 const hasRulers=rulers?.status==='computed'&&!!convention;
 const bodyPalaces=snapshot?.chart.palaces.filter(p=>p.isBodyPalace)??[];
 const palaces=RESULT_PALACES.map(name=>{
  const matches=snapshot?.chart.palaces.filter(p=>p.name===name)??[];
  const p=matches.length===1?matches[0]:undefined;
  return {name,branch:p?.earthlyBranch||'Chưa có dữ kiện',isBody:bodyPalaces.length===1&&p===bodyPalaces[0],
   stars:p&&snapshot&&Array.isArray(p.majorStars)?p.majorStars.map(star=>({name:star.name,...starState(star,p.earthlyBranch,snapshot,snapshot.chart.tanBien?'tanbien':'engine')})):[],
   empty:p&&snapshot?majorStatus(snapshot,p):'Chưa có dữ liệu cung.',
   voidConfirmed:!!(p&&snapshot&&Array.isArray(p.majorStars)&&p.majorStars.length===0&&snapshot.chart.tanBien?.completeness.majorStars==='complete'),
  };
 });
 const certificate=snapshot?verifiedNatalTransformations(snapshot.chart):undefined;
 const trace=snapshot?.chart.tanBien?.trace.find(t=>t.id==='mutagens');
 return {info,palaces,body:bodyPalaces.length===1?bodyPalaces[0].name:'Chưa xác định',
  soul:hasRulers&&rulers.starId?snapshot?.chart.soul:undefined,
  bodyRuler:hasRulers&&rulers.body?.starId?snapshot?.chart.body:undefined,convention,
  transformations:TRANSFORMATION_GUIDE.map(guide=>({...guide,entry:certificate?.entries.find(e=>e.kind===guide.kind)})),
  transformationSource:certificate?.source,transformationNote:trace?.note,
  birthYear:snapshot?.chart.tanBien?`${snapshot.chart.tanBien.inputs.yearStem} ${snapshot.chart.tanBien.inputs.yearBranch}`:undefined,
 };
}
