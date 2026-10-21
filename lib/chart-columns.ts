import type {SheetEntry} from './chart-sheet';
// Presentation convention transcribed from the user-supplied kim-thoa.jpg.
// Not a universal good/bad judgement: e.g. Tướng Quân is on the right in that image.
export const COLUMN_VERSION = 'reference-kim-thoa-2';
const left = new Set(`Hóa Lộc|Thanh Long|Ân Quang|Thiên Y|Hữu Bật|Văn Xương|Hóa Khoa|Phúc Đức|Thiên Đức|Bát Tọa|Hồng Loan|Văn Tinh|Phong Cáo|Đào Hoa|Thiên Trù|Thiên Thọ|Tả Phù|Văn Khúc|Thiên Việt|Tấu Thư|Tam Thai|Thiên Phúc|Đường Phù|Lực Sĩ|Lực Sỹ|Long Đức|Thiên Quan|Thiên Quý|Hóa Quyền|Lộc Tồn|Bác Sỹ|Bác Sĩ|Hỷ Thần|Thiếu Dương|Thai Phụ|Đài Phụ|Nguyệt Đức|Long Trì|Phượng Các|Phụng Các|Giải Thần|Hoa Cái|Thiên Khôi|Thiếu Âm|Thiên Hỷ|Thiên Giải|Thiên Tài|Quốc Ấn|Địa Giải|Thiên Mã`.split('|'));
const right = new Set(`Bạch Hổ|Thiên Riêu|Thiên Diêu|Phá Toái|Linh Tinh|Tiểu Hao|Địa Không|Hỏa Tinh|Tướng Quân|Điếu Khách|Quả Tú|Thiên Thương|Trực Phù|Kình Dương|Thiên La|Phi Liêm|Thái Tuế|Thiên Khốc|Thiên Sứ|Đẩu Quân|Địa Kiếp|Tuế Phá|Thiên Hư|Thiên Không|Địa Võng|Lưu Hà|Đà La|Quan Phủ|Tử Phù|Kiếp Sát|Phục Binh|Quan Phù|Thiên Hình|Đại Hao|Hóa Kỵ|Bệnh Phù|Tang Môn|Cô Thần`.split('|'));
export function referenceSide(name:string): 'left'|'right'|'unclassified' {
  const natal=name === 'Lưu Hà' ? name : name.replace(/^Lưu /,'');
  return left.has(natal)?'left':right.has(natal)?'right':'unclassified';
}
export function sheetColumns(entries:SheetEntry[]) {
  // Unknown names remain visible after the left group, marked explicitly. Never infer bad from absence.
  return [
    [...entries.filter(e=>referenceSide(e.name)==='left'),...entries.filter(e=>referenceSide(e.name)==='unclassified')],
    entries.filter(e=>referenceSide(e.name)==='right'),
  ];
}
