# Ổn định sau bản đọc 1.16.0 — bản sửa 1.16.1

Ngày 11/10/2026. Không thêm rule/chủ đề/phương pháp. Nội dung Công việc và Tài chính giữ nguyên.

## Môi trường và baseline

Đã đọc README; không tìm thấy AGENTS.md trong dự án. Không có Git metadata nên không gán commit. Đã sao lưu 395 tệp cùng SHA-256 tại `.local/stabilization-20261011/before-hashes.json` và `before/`. Node 20.20.2, npm 10.8.2, package 0.1.0, iztro 2.6.1, Next 15.5.27; package-lock.json không đổi.

Lệnh baseline `npm test` trong bản sao/database cô lập: 510 test, 497 đạt, 13 lỗi (48 file). Đây là lỗi quan sát trước khi sửa trong đợt này, không kết luận chúng tồn tại trước thay đổi của chủ dự án.

## 13 lỗi và cách xử lý

1. **interpretation.test.ts — catalog/draft gate** — 39 → 120. Kỳ vọng catalog cũ; catalog hiện hành gồm facts và các bộ nội dung đã có. Đối chiếu manifest hiện hành: 9 facts, 2 draft, 14 reading, 2 combination, 102 Tân Biên; giữ assertion không phát hành draft.

2. **reading.test.ts — partial overview** — 2 claim Mệnh → 3 (lẫn finance). Lỗi sản phẩm: preview cũ nhóm claim Tài chính vào phần bản thân. Phân nhóm bằng presentation.readingTheme; không đổi claim hay điều kiện. Thêm test chống rò finance vào Mệnh.

3. **tanbien-career.test.ts — historical prose** — Lời bản cũ bị so với catalog mới. Lỗi chọn phiên bản trong test. Replay định nghĩa rule đã lưu với claim lịch sử; kiểm tra đúng điều kiện, nguyên văn và phiên bản. Không sửa export cũ.

4. **tanbien-co-cu.test.ts — A–B–A** — 3/2 → 4/3 claim. Kỳ vọng chưa tính nhánh Thiên Đồng Tài Bạch Tỵ/Hợi của nội dung 1.15. Thêm đúng ID finance-dong-ty-hoi theo điều kiện cung/sao/chi đã chốt; giữ tách nghĩa Cơ–Cự, căn cứ và snapshot.

5. **tanbien-four.test.ts — four-star source range** — Thiếu claim finance/r32. Kỳ vọng chỉ catalog Mệnh trước khi đã có Công việc/Tài chính. Đối chiếu nhánh Thiên Đồng Tài Thìn/Tuất, Tỵ/Hợi và R32 Cự Môn Quan Thìn. Các assertion sai cung/ngoài phạm vi vẫn giữ.

6. **tanbien-four.test.ts — shared context** — 2 → 3 claim. Nhánh Tài chính có căn cứ riêng; context không thể dùng chung ghi chú Mệnh. Kiểm tra đủ các ID xác định; tách context Tài, không gán ghi chú Tuần của Mệnh vào Tài.

7. **tanbien-menh-expansion.test.ts — metadata titles** — R03/R08 → thêm finance-vu-thin-tuat. Kỳ vọng catalog cũ; mẫu có Vũ Khúc tại Tài Tuất. Giữ R03/R08 riêng, thêm nhánh Tài chính đã có; không suy tổ hợp mới.

8. **tanbien-presentation.test.ts — renderer/evaluator identity** — Hai execution khác catalog. Test truyền catalog nền vào evaluator nhưng renderer dùng catalog hiện hành. Dùng cùng catalog/profile ở hai phía; vẫn so nguyên execution và kiểm tra input/catalog không bị sửa.

9. **tanbien-presentation.test.ts — four engine samples** — Số/ID section cũ. Các mẫu có thêm nội dung 1.15/1.16 đã chốt. Kiểm tra ID theo dữ kiện từng mẫu; mẫu không có luận Mệnh vẫn được phép có Tài chính. Không dùng tổng số đoạn để suy đủ Mệnh.

10. **tanbien-review-pack.test.ts — 19 frozen results** — Rule/version lịch sử khác hiện hành. Test tính lại bản lưu bằng catalog mới. So kết quả đã lưu và replay chính định nghĩa lịch sử; giữ 19 export nguyên vẹn, tách fixture kỹ thuật khỏi engine.

11. **tanbien-sun.test.ts — R21 version** — 0.1.0 → 0.1.1. Expected chưa theo lần chỉnh điều kiện nguồn đã có. Cập nhật phiên bản R21 hiện hành; giữ ca đúng/sai cung, thiếu dữ kiện và cấm fallback brightness.

12. **tanbien-sun.test.ts — scope notice** — 1 → 2 claim. Mẫu có R07 cùng R32 Công việc hiện hành. Kiểm tra cả hai ID, giữ thông báo độ phủ Mệnh theo nội dung chính tinh, không theo tổng số đoạn.

13. **tanbien.test.ts — DEMO traces** — 39 → 102 trace. Số trace của catalog Tân Biên cũ. Đối chiếu inventory 102 nhánh hiện hành; vẫn đúng 7 claim DEMO khớp và 0 claim được duyệt khách hàng.

## Ranh giới import iztro

`lib/tuvi-engine/decadal.ts` runtime-import đường dẫn nội bộ thiếu `.js`, không hợp lệ trong Node ESM. E2E nạp engine qua các module samples/fixtures nên lỗi ngay khi collection. Tái hiện tối thiểu: `node --input-type=module -e 'import("iztro/lib/star/location")'`. Stack đầy đủ tại `import-before.log`, lỗi collection tại `e2e-before.log` trong thư mục bàn giao.

Bản cài 2.6.1 có CommonJS main `lib/index.js`, không exports map. Đổi sang API công khai `import { star, data } from "iztro"`; kiểm tra từng hàm và bảng bằng identity với chính bản cài. Không sửa node_modules, version dependency, algorithm hoặc công thức.

## Thông báo Tứ Hóa

1992: Vũ Khúc có scope origin, mutagen Kỵ; Thiên Phủ có scope origin nhưng không lưu mutagen. Câu cũ nói thiếu đầy đủ lớp/Tứ Hóa “của chính tinh tại Mệnh” quá rộng. Câu mới nêu riêng Thiên Phủ thiếu trường Tứ Hóa, không phủ nhận Vũ Khúc Hóa Kỵ và không suy thiếu trường nghĩa là không có Tứ Hóa. Không tự điền dữ liệu. Test riêng thiếu scope, thiếu mutagen, thiếu cả hai và scope sao lưu.

Tạo hai bản mới template 1.16.1, presentation 1.11.1, dynamic internal-reading-1.5.1; giữ snapshot và liên kết cha. Bản lịch sử không ghi đè. Preview cũ cũng sửa phân nhóm finance/work theo metadata, không thay lời claim.

## Kết quả gate

- Unit/integration: 515/515 đạt; 49 file, 0 lỗi, 0 skip.
- Typecheck và production build: đạt.
- E2E toàn bộ dev: 36 đạt, 0 lỗi, 2 opt-in skip ở môi trường này.
- Production E2E: 27 đạt, 0 lỗi, 2 opt-in skip; 9 ca nhóm DEMO/payment/fixture chạy ở dev, không bật mock trên production.
- Beta opt-in production riêng: 1 + 1 đạt. Cả 38 định nghĩa E2E đã được thực thi; 65 lần chạy test cuối đạt, 0 lỗi. Hai opt-in bị skip trong hai lượt chung nhưng đã chạy riêng. workers=1/retries=0.

Lệnh đầy đủ và tên log nằm trong HTML bàn giao. `npm test`, `npm run typecheck`, `npm run build`; E2E dùng `node --env-file=.env node_modules/@playwright/test/cli.js test`. Production lọc nhóm DEMO bằng `--grep-invert 'customer journey|demo queued|mobile 360: input|mobile 390: input|keyboard, unknown time|email fragment|legacy report without'`. Hai beta spec chạy riêng với env/database loopback beta DEMO.

## Bảo toàn và phạm vi

175 tệp exports/internal-readings lịch sử không đổi SHA-256; 12 tệp rule không đổi; lockfile không đổi. Hai chart tính lại theo input/profile cũ giữ toàn bộ chart, versions, resultId theo JSON lưu trữ. Hai bản đọc mới giữ nguyên snapshot và toàn bộ section Work/Finance, gồm claim/điều kiện/nguồn. Các quy ước Mệnh chủ/Thân chủ đã lưu được giữ nguyên.

Đã kiểm tra hai hồ sơ thật trên production và ứng dụng localhost:3000: chọn cung bằng bàn phím, đổi hồ sơ, căn cứ, mở bản lịch sử, xuất toàn văn/nguồn/PNG/PDF tại 360/390px, không tràn ngang và không pageerror. Các cổng đăng nhập/draft vẫn được kiểm thử. Không bật dịch vụ thật.

Hai test beta opt-in chạy riêng trên bản sao loopback, database DEMO riêng; đã thu hồi toàn bộ grant test và dừng server beta. Root không bật beta. Lượt production không bật endpoint mock thanh toán để ép các ca DEMO chạy như dịch vụ thật.

Bản build có cảnh báo máy chứa lockfile ở thư mục cha nên Next suy workspace root; build đạt. Không sửa lockfile ngoài dự án để che cảnh báo. Đây là nghiệm thu kỹ thuật, không phải phê duyệt chuyên môn hoặc phê duyệt draft.

## Bàn giao

HTML tự chứa ảnh và bảng 13 lỗi: `.local/stabilization-20261011/ban-giao.html`. Log baseline, từng lần lỗi và lượt cuối đều giữ trong thư mục này; không dùng retry tự động.

- Kim Thoa: http://localhost:3000/internal/readings?id=fd53f714-31ab-47af-aa39-e9549120e4fe (cha f312ada6-3b10-4d9a-a7ab-68be78856779).
- 07/08/1992: http://localhost:3000/internal/readings?id=ceb3d36b-c761-4b7b-bc92-118ad20ab4f5 (cha 6a55077e-e82d-4414-8701-cd4e9a7d8198).
