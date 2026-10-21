import data from './phuc-di-content.json';
import type { ChartSnapshot } from '../tuvi-engine';
import { CHART_BRANCHES, principalIntegrity } from '../tuvi-engine/chart-integrity';
import type { DerivedFact } from './derived';
import { ruleSchema } from './schema';

export const DI_VCD_SUN_MOON_METHOD = 'tanbien-di-vcd-sun-moon-base-1.0.0';
export const DI_VCD_SUN_MOON_ID = 'nhat-nguyet-base';
export const DI_VCD_METHOD = 'tanbien-di-vcd-pairs-1.0.0';
// TB180 §10.36 + the six position-independent Thiên Di clauses verified in ND04.
// Never run the whole catalog against a virtual palace or move minor stars.
export const DI_VCD_PAIRS = ['co-luong', 'co-cu', 'dong-luong', 'dong-cu', 'vu-tham', 'liem-tham'] as const;
export const diVcdBranches = DI_VCD_PAIRS.map(id => {
  const row = data.find(r => r.palace === 'Thiên Di' && r.id === id)!;
  if (!row || row.minor || row.branches.length || row.stars.length !== 2) throw Error('DI_VCD_SOURCE_SCOPE');
  return row;
}).concat([{
  palace: 'Thiên Di', id: DI_VCD_SUN_MOON_ID, stars: ['Thái Dương', 'Thái Âm'], branches: [],
  page: '175–176', section: '10.5; 10.8', minor: false,
  text: 'ra ngoài lợi ích hơn ở nhà, thường gần nơi quyền quý và được tôn phục. Chỉ áp dụng lời nền; chưa áp dụng vế tăng thêm khi gặp Tuần hoặc Hóa Kỵ cho cấu trúc xung chiếu.',
}]);

export function diVcdFacts(s: ChartSnapshot): DerivedFact[] {
  if (s.chart.tanBien?.completeness?.majorStars !== 'complete' || !principalIntegrity(s.chart).valid) return [];
  const di = s.chart.palaces.findIndex(p => p.name === 'Thiên Di');
  const life = s.chart.palaces.findIndex(p => p.name === 'Mệnh');
  if (di < 0 || life < 0) return [];
  const target = s.chart.palaces[di], donor = s.chart.palaces[life];
  if ((CHART_BRANCHES.indexOf(target.earthlyBranch) + 6) % 12 !== CHART_BRANCHES.indexOf(donor.earthlyBranch)) return [];
  const names = donor.majorStars.map(st => st.name);
  return diVcdBranches.map(r => ({
    id: 'fact.di-vcd-' + r.id,
    derivationId: 'di-vcd-' + r.id,
    version: '1.0.0',
    value: target.majorStars.length === 0 && names.length === 2 && r.stars.every(n => names.includes(n)) ? 'yes' : 'no',
    text: `Thiên Di tại ${target.earthlyBranch}: ${target.majorStars.length === 0 ? 'không có chính tinh tọa thủ' : target.majorStars.map(st => st.name).join(', ')}. Đối cung Mệnh tại ${donor.earthlyBranch}: ${names.join(', ') || 'không có chính tinh'}. Phép xét chỉ nhận cặp ${r.stars.join('–')} xung chiếu, không chuyển sao vào Thiên Di.`,
    evidencePaths: [
      `chart.palaces.${di}.name`, `chart.palaces.${di}.earthlyBranch`, `chart.palaces.${di}.majorStars`,
      `chart.palaces.${life}.name`, `chart.palaces.${life}.earthlyBranch`, `chart.palaces.${life}.majorStars`,
      'chart.tanBien.completeness',
    ],
    status: 'engine-reported' as const,
    limitation: 'Chỉ dùng lời Thiên Di về cặp chính diệu không phụ thuộc địa chi/trạng thái. Không dùng brightness của cung cho hoặc cung nhận; không mượn phụ tinh, Tứ Hóa, Tuần/Triệt hay lời luận Mệnh.',
  }));
}

export const diVcdRules = diVcdBranches.map(r => ruleSchema.parse({
  id: 'tanbien.di-vcd-' + r.id, version: '0.1.0', kind: 'interpretation', topic: 'overview', origin: 'catalog',
  requiredEngineProfile: ['tanbien-vn-trial-v2'],
  requiredFacts: ['fact.di-vcd-' + r.id, 'fact.source-position-available'],
  conditions: [{ fact: 'fact.di-vcd-' + r.id, op: 'eq', value: 'yes' }], exceptions: [],
  claimTemplate: `Theo Tân Biên PDF180 §10.36, Thiên Di vô chính diệu xét cặp ${r.stars.join('–')} tại Mệnh xung chiếu theo lời về Thiên Di: ${r.text}`,
  evidencePaths: ['chart.palaces', 'chart.tanBien.completeness'],
  sourceReferences: [{
    id: 'tanbien-supplied-pdf', title: 'Vân Đằng Thái Thứ Lang — Tử Vi Đẩu Số Tân Biên',
    url: '/internal/editorial/demo-wuqu-tianfu#source-list',
    location: (r.id === DI_VCD_SUN_MOON_ID ? 'Chỉ câu nền Nhật–Nguyệt. Câu kế tiếp “Nếu gặp Tuần, Tuần án ngữ hay Kỵ đồng cung lại càng rực rỡ” chưa triển khai: chưa rõ nơi xét khi xung chiếu và không tự sửa chữ lặp thành Triệt. ' : '') + `Trang PDF180 §10.36: chính diệu xung chiếu khi Di vô chính diệu; trang PDF${r.page} §${r.section}: lời riêng của cặp tại Thiên Di. PDF174 đầu mục: Mệnh–Di xung chiếu; PDF33 §2.6–2.11: vị trí sao thật và trạng thái. Bản277 trang, SHA256 4d9a326d111ffca5290a93e19b238fb14a568afb0df7d6e44227410e27b4fabc.`,
    accessedOn: '2026-10-19', rights: 'pending', rightsNote: 'Đã đối chiếu ảnh nguồn; chưa phê duyệt chuyên môn.',
  }],
  conflictsWith: [], conflictGroup: null, conflictPolicy: 'retain-both', status: 'draft', review: null,
  limitations: [
    'Lời cục bộ về môi trường bên ngoài, không phải kết luận toàn cung hoặc thực tế cá nhân.',
    'Không chuyển lời Mệnh, trạng thái hay phụ tinh sang Thiên Di; không xóa lời phụ tinh thật tại Di.',
    'Các nhánh phụ thuộc địa chi/sáng-hãm hoặc ngoại lệ chưa rõ vị trí chưa được chuyển bằng §10.36.',
  ],
  presentation: {
    title: `Thiên Di vô chính diệu, ${r.stars.join('–')} xung chiếu`, readingTheme: 'di', contentType: 'combination',
    sourceConditions: ['Thiên Di thực sự không có chính tinh tọa thủ.', `Toàn bộ cặp ${r.stars.join('–')} bản mệnh đồng cung tại Mệnh, xung chiếu Thiên Di.`],
    projectScope: [r.id === DI_VCD_SUN_MOON_ID ? DI_VCD_SUN_MOON_METHOD : DI_VCD_METHOD, 'Danh sách chính tinh đầy đủ, toàn vẹn; Mệnh và Di đối nhau sáu địa chi.', 'Trạng thái: không sử dụng. Lời được chọn không có điều kiện sáng/hãm/địa chi; không tính lại trạng thái ở cung nhận.', 'Giữ nguyên các sao và lời thật tại mỗi cung; không dựng cung giả, không truyền điều chỉnh từ Mệnh.'],
    readerLimit: 'Đây là cách xét cặp chính diệu xung chiếu cho Thiên Di vô chính diệu, chưa hợp nhất mọi yếu tố của cung.',
    knownExceptions: r.id === DI_VCD_SUN_MOON_ID ? ['Vế “lại càng rực rỡ” với Tuần/Kỵ chưa được áp dụng; không biết nơi xét án ngữ/đồng cung cho sao xung chiếu. Không tự sửa “Tuần, Tuần” thành Triệt. Nền không đòi hỏi vắng các yếu tố ấy.', 'Không xóa hoặc điều chỉnh lời Hóa Kỵ tại Di; chưa có phép hợp nhất nền này với các lời phụ tinh khác.'] : ['Không tự áp dụng cho cặp khác, lời phụ thuộc địa chi hoặc ngoại lệ Nhật–Nguyệt với Kỵ/Tuần. Không chạy ND01 bằng Vũ Khúc xung chiếu.'],
    unknownConditions: r.id === DI_VCD_SUN_MOON_ID ? ['Thiếu/bất nhất danh sách chính tinh hoặc quan hệ Mệnh–Di: không xuất lời.', 'Trạng thái và địa chi không là đầu vào của câu nền. Ngoại lệ tăng thêm vẫn chưa đặc tả; thiếu chứng nhận Tứ Hóa không được hiểu là không có Kỵ.'] : ['Thiếu/bất nhất danh sách chính tinh hoặc quan hệ Mệnh–Di: không xuất lời.', 'Chưa giải quyết vị trí xét trạng thái và nơi áp dụng ngoại lệ của các nhánh ngoài sáu cặp.'],
    applicability: 'Di vô chính diệu và đúng cả hai chính diệu bản mệnh xung chiếu trong danh sách đã đối chiếu.',
    sourceScope: 'Chỉ Thiên Di; không mở sang vô chính diệu ở cung khác, không chuyển lời Mệnh sang Di.',
  },
}));
