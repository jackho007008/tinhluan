import type { ChartData } from './tuvi-engine';

export const YEAR_RULER_VERSION = 'quan-xuan-thinh-year-rulers-1.0.0';
// Product decision 2026-10-11; verified against iztro@2.6.1
// lib/data/earthlyBranches.js (.soul), not the global zhongzhou algorithm.
export const BRANCH_IDS = ['ziEarthly','chouEarthly','yinEarthly','maoEarthly','chenEarthly','siEarthly','wuEarthly','weiEarthly','shenEarthly','youEarthly','xuEarthly','haiEarthly'] as const;
export type BranchId = typeof BRANCH_IDS[number];
export const YEAR_SOUL: Record<BranchId,string> = {
 ziEarthly:'tanlangMaj',chouEarthly:'jumenMaj',yinEarthly:'lucunMin',maoEarthly:'wenquMin',
 chenEarthly:'lianzhenMaj',siEarthly:'wuquMaj',wuEarthly:'pojunMaj',weiEarthly:'wuquMaj',
 shenEarthly:'lianzhenMaj',youEarthly:'wenquMin',xuEarthly:'lucunMin',haiEarthly:'jumenMaj',
};
export const YEAR_BODY: Record<BranchId,string> = {
 ziEarthly:'lingxingMin',chouEarthly:'tianxiangMaj',yinEarthly:'tianliangMaj',maoEarthly:'tiantongMaj',
 chenEarthly:'wenchangMin',siEarthly:'tianjiMaj',wuEarthly:'huoxingMin',weiEarthly:'tianxiangMaj',
 shenEarthly:'tianliangMaj',youEarthly:'tiantongMaj',xuEarthly:'wenchangMin',haiEarthly:'tianjiMaj',
};
export const RULER_SOURCE = 'Quy ước sản phẩm theo đoạn trích người dùng cung cấp, ghi nguồn Số Tử vi kinh nghiệm, quyển thượng — Quản Xuân Thịnh. Chưa đối chiếu bản gốc; không gán cho Tân Biên.';
const VI: Record<string,string> = {lingxingMin:'Linh Tinh',huoxingMin:'Hỏa Tinh',tianxiangMaj:'Thiên Tướng',tianliangMaj:'Thiên Lương',tiantongMaj:'Thiên Đồng',wenchangMin:'Văn Xương',tianjiMaj:'Thiên Cơ',tanlangMaj:'Tham Lang',jumenMaj:'Cự Môn',lucunMin:'Lộc Tồn',wenquMin:'Văn Khúc',lianzhenMaj:'Liêm Trinh',wuquMaj:'Vũ Khúc',pojunMaj:'Phá Quân'};
export function yearSoul(branch: string | undefined) {
 if (!branch || !Object.hasOwn(YEAR_SOUL, branch)) return undefined;
 const starId=YEAR_SOUL[branch as BranchId];
 return {starId,name:VI[starId]};
}
export function yearBody(branch: string | undefined) {
 if (!branch || !Object.hasOwn(YEAR_BODY, branch)) return undefined;
 const starId=YEAR_BODY[branch as BranchId];
 return {starId,name:VI[starId]};
}
export type RulerMetadata = {
 version: typeof YEAR_RULER_VERSION | 'birth-year-soul-1.0.0';
 body?: {starId: string | null; method: 'birth-year-branch'; previous: {value: string; implementation: 'iztro@2.6.1/algorithm=default'}};
 method: 'birth-year-branch';
 birthYearBranchId: BranchId | null;
 starId: string | null;
 inputPath: 'chart.tanBien.inputs.lunar.lunarYear';
 source: string;
 status: 'computed' | 'missing-birth-year';
 previous: {value: string; method: 'life-palace-branch'; implementation: 'iztro@2.6.1/algorithm=default'};
};
/** Creation-time adapter only. Historical snapshots are never passed through here on read. */
export function applyYearRuler(chart: ChartData): ChartData {
 const year=chart.tanBien?.inputs.lunar?.lunarYear;
 // Same Tý=0 birth-year normalization as the active profile; never solar/view year or a translated branch name.
 const birthYearBranchId=Number.isInteger(year) && year! > 0 ? BRANCH_IDS[((year!-4)%12+12)%12] : null;
 const value=yearSoul(birthYearBranchId ?? undefined);
 const body=yearBody(birthYearBranchId ?? undefined);
 return {...chart,soul:value?.name ?? '',body:body?.name ?? '',rulers:{
  body:{starId:body?.starId ?? null,method:'birth-year-branch',previous:{value:chart.body,implementation:'iztro@2.6.1/algorithm=default'}},
  version:YEAR_RULER_VERSION,method:'birth-year-branch',birthYearBranchId,starId:value?.starId ?? null,
  inputPath:'chart.tanBien.inputs.lunar.lunarYear',
  source:RULER_SOURCE,
  status:value?'computed':'missing-birth-year',
  previous:{value:chart.soul,method:'life-palace-branch',implementation:'iztro@2.6.1/algorithm=default'},
 }};
}
