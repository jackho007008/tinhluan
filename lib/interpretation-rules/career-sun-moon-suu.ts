import type { ChartSnapshot } from '../tuvi-engine';
import type { DerivedFact } from './derived';
import { emptyLifeFacts } from './life-empty-facts';
import { ruleSchema } from './schema';

export const CAREER_SUN_MOON_SUU = 'tanbien.career-sun-moon-suu';
export const CAREER_SUN_MOON_SUU_FACT = 'fact.career-sun-moon-suu';
export const CAREER_SUN_MOON_SUU_COPY = 'Về công danh, Tân Biên mô tả thế Thái Dương tại Tỵ và Thái Âm tại Dậu cùng chiếu Mệnh ở Sửu bằng hình ảnh “nhẹ bước thang mây”. Đây là chú giải của nguồn về thế chiếu này, chưa xác định chức vụ, thu nhập hoặc thành công thực tế của bạn.';

/** Reuse certified natal geometry and the author's tables; evidence at Mệnh
 * does not change the paid narrative subject, Công việc. */
export function careerSunMoonSuuFacts(s: ChartSnapshot): DerivedFact[] {
  const facts = emptyLifeFacts(s);
  const count = facts.find(f => f.id === 'fact.life-complete-major-count');
  if (!count) return [];
  const life = s.chart.palaces.find(p => p.name === 'Mệnh')!;
  const sun = facts.find(f => f.id === 'fact.empty-life-sun-branch')!;
  const moon = facts.find(f => f.id === 'fact.empty-life-moon-branch')!;
  const geometry = life.earthlyBranch === 'Sửu' && Number(count.value) > 0 && sun.value === 'Tỵ' && moon.value === 'Dậu';
  const lights = facts.filter(f => ['fact.empty-life-sun-light', 'fact.empty-life-moon-light'].includes(f.id));
  if (geometry && lights.length !== 2) return [];
  const selected = [count, sun, moon, ...lights];
  return [{
    id: CAREER_SUN_MOON_SUU_FACT, derivationId: 'tanbien-sun-moon-suu-position', version: '1.0.0',
    value: geometry && lights.every(f => f.value === 'bright') ? 'yes' : 'no',
    text: `Mệnh tại ${life.earthlyBranch}, có ${count.value} chính tinh. ${sun.text} ${moon.text} ${lights.map(f => f.text).join(' ')}`,
    evidencePaths: [...new Set([...selected.flatMap(f => f.evidencePaths), `chart.palaces.${s.chart.palaces.indexOf(life)}.earthlyBranch`])],
    status: 'source-table', limitation: 'Câu riêng Tân Biên71; không đổi bảng engine, không thực thi nhánh tăng cường TT/sao phụ hoặc tổng hợp toàn Mệnh.'
  }];
}

export const careerSunMoonSuuRule = ruleSchema.parse({
  id: CAREER_SUN_MOON_SUU, version: '1.0.0', kind: 'interpretation', topic: 'career', origin: 'catalog',
  requiredEngineProfile: ['tanbien-vn-trial-v2'],
  requiredFacts: [CAREER_SUN_MOON_SUU_FACT, 'fact.source-position-available'],
  conditions: [{ fact: CAREER_SUN_MOON_SUU_FACT, op: 'eq', value: 'yes' }], exceptions: [],
  claimTemplate: CAREER_SUN_MOON_SUU_COPY,
  evidencePaths: ['chart.palaces', 'chart.tanBien.completeness'],
  sourceReferences: [{ id: 'tanbien-supplied-pdf', title: 'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên',
    location: 'PDF71 §4.2.5: câu riêng Mệnh Sửu, Nhật Tỵ, Nguyệt Dậu hợp chiếu; bảng35/36, ngữ cảnh53–54/70–72.',
    url: '/internal/editorial/demo-wuqu-tianfu#source-list', accessedOn: '2026-10-27', rights: 'pending',
    rightsNote: 'Tái dùng hồ sơ đã đối chiếu, chủ dự án duyệt đúng Q-U42; không mở nhánh khác hoặc xác nhận kết quả thực tế.' }],
  conflictsWith: [], conflictGroup: null, conflictPolicy: 'retain-both', status: 'draft', review: null,
  limitations: ['Cổng dự án Q-U42: chỉ Mệnh Sửu có chính tinh; cần profile Tân Biên v2, chứng nhận12cung/14chính tinh duy nhất và scope bản mệnh. Căn cứ Mệnh, lời công danh thuộc Công việc/G2; không đổi quyền vì vị trí căn cứ.', 'Chỉ vế công danh của thế chiếu đã định vị; không suy chức vụ, thu nhập, tuổi, tài sản, trí tuệ, phúc thọ hoặc thành công thực tế.'],
  presentation: {
    title: 'Thế Nhật–Nguyệt chiếu Mệnh và công danh', contentType: 'context', readingTheme: 'work',
    readerLimit: 'Giữ các lời về Thiên Lương và công việc khác phương diện; không chọn nguồn thắng hoặc kết luận tốt–xấu toàn cung.',
    sourceConditions: ['Tân Biên71: Mệnh Sửu, Thái Dương Tỵ và Thái Âm Dậu hợp chiếu; câu riêng này không yêu cầu Mệnh vô chính diệu.', 'Trạng thái Miếu/Vượng/Đắc theo bảng Tân Biên35/36; không lấy trạng thái engine hoặc bảng tác giả khác.'],
    projectScope: ['Q-U42 chỉ mở miền Mệnh Sửu có chính tinh; dữ liệu phải đủ chứng nhận12cung/14chính tinh duy nhất và scope bản mệnh, profile Tân Biên v2.', 'Căn cứ ở Mệnh, lời công danh đặt tại Công việc theo G2 trả phí. Không chạy lời sao tọa Mệnh ở cung giả lập.'],
    applicability: 'Thiếu chứng nhận, sai scope hoặc thiếu bảng nguồn: unknown. Không đòi giải toàn Thiên Lương trước vế thế chiếu độc lập.',
    knownExceptions: ['Không ghép điều kiện VCD hoặc tăng cường Tuần/Triệt của câu Nhật–Nguyệt khác vào câu định vị Sửu. Không thực thi nhánh tăng cường TT/sao phụ.'],
    unknownConditions: ['Chưa đặc tả mức tăng cường TT/sao phụ; không dùng chúng nâng mức lời cục bộ đã duyệt.'],
    sourceScope: 'Vế công danh của thế chiếu Mệnh; không suy kết quả toàn Mệnh hoặc mượn tuổi Bính Tuất của Toàn Thư143.'
  }
});
