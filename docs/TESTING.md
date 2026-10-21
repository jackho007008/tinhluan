# Kiểm chứng theo phạm vi

Cập nhật20/10/2026 sau kiểm ND03; các lệnh mẫu dưới đây cần chọn theo phạm vi, không mặc định chạy toàn bộ. [package.json](../package.json), [vitest.config.ts](../vitest.config.ts), [playwright.config.ts](../playwright.config.ts) là cấu hình hiện có; [kiến trúc](ARCHITECTURE.md) giải thích kho/queue/quyền. Không có Git tại root; xem cách nhận diện code ở ARCHITECTURE.

## 1. Chọn mức kiểm

- **Tài liệu:** đọc lại ý nghĩa/quyết định, kiểm file/link/anchor và diff. Không chạy app, test/build, migration, PDF hoặc hash toàn kho.
- **Biên tập thuần draft CMS:** kiểm đúng bản lưu/trạng thái và source; không cần gate ứng dụng nếu không sửa renderer. CMS ghi dữ liệu cần đúng phạm vi được giao; không thuộc phiên tài liệu.
- **Renderer/rule:** test file liên quan + typecheck/build nếu code thay; thêm so ID, facts, relations, điều kiện/ngoại lệ, không chỉ đếm claim. Lưu/mở lại/mobile theo tác động. Chỉ PDF đại diện nếu phần dựng PDF/văn cần kiểm.
- **Quyền/API/queue:** integration PostgreSQL riêng + endpoint đọc/print/PDF chéo phiên, hạn/thu hồi/idempotency. Mock PDF chỉ kiểm đường quyền, không xác minh tệp PDF thật.
- **Provider:** test local và thao tác thật ghi riêng. Google mocked khác OAuth thật; webhook local khác SePay; SMTPaccepted khác nhận thư. Không tự gửi email ngoài địa chỉ QA, không Live.

## 2. Lệnh hiện có và cách chạy an toàn

Vitest include `tests/**/*.test.ts`, chạy file tuần tự (`fileParallelism:false`), timeout30s. Tên `.test.ts` **không đồng nghĩa unit thuần**: nhiều file dùng `pool` và ghi DB.

```sh
# Ví dụ test renderer thuần, sau đọc imports/setup của chính file
node node_modules/vitest/vitest.mjs run tests/encyclopedia-renderer.test.ts

# Integration: thay đường dẫn bằng env RIÊNG đã chuẩn bị, không dùng .env QA chính
node --env-file=/absolute/path/to/isolated-test.env node_modules/vitest/vitest.mjs run tests/reading-scope.test.ts tests/customer-accounts.test.ts

# Khi task code yêu cầu, chạy trong checkout thử được chọn
npm run typecheck
npm run build

# E2E lựa chọn, server thử đã chạy; không mặc định dùng QA chính
E2E_ORIGIN=http://localhost:3005 node --env-file=/absolute/path/to/isolated-test.env node_modules/@playwright/test/cli.js test tests/e2e/customer-journey.spec.ts
```

Đường env trên là placeholder, chưa phải cấu hình đã tạo. Trước integration/E2E: xác nhận `DATABASE_URL` là DB riêng, schema cần thiết đã có; các `TRIAL_READING_DIR`, `INTERNAL_READING_DIR`, exports/mail/file store trỏ kho riêng; provider/mock/test flags đúng ca, Livefalse. Không chỉ thay origin mà vẫn nối DB chính. Test có thể để lại dữ liệu mặc dù `afterAll` chạy; đọc cleanup từng file.

`npm test -- tests/<file>.test.ts` trong package **tự nạp `.env`**; chỉ dùng khi đã bảo đảm env của checkout đó cách ly. `npm run test:e2e -- <spec>` chạy Playwright, không tự khởi động webServer; `baseURL` mặc định localhost3000, Chrome channel, workers1,retries0. `npm run db:migrate`, `worker`, `reconcile`, `data:purge`, `data:delete` là lệnh **có tác động dữ liệu**, không phải kiểm đọc; không chạy như bước setup mặc định trên QA chính.

Cấu hình [playwright.stability.config.ts](../playwright.stability.config.ts) chỉ nhận localhost3005/3006, ba spec chỉ định. [saved-reports fixture](../tests/e2e/fixtures/saved-reports.ts) yêu cầu DB loopback trùng `E2E_ISOLATED_DATABASE` có prefix `tuvi_stability_`. [worker fixture](../tests/e2e/fixtures/worker.ts) tự spawn worker bằng process.env cho payment journey; không chạy chồng worker, ca fault-injection retry phải theo spec riêng không worker.

## 3. Bản đồ test theo phần thay đổi

- **Đầu vào/engine/receipt:** [birth-validation](../tests/birth-validation.test.ts), [customer-birth-interval](../tests/customer-birth-interval.test.ts), [dynamic-reading](../tests/dynamic-reading.test.ts), [chart-integrity](../tests/chart-integrity.test.ts). Không import cùng engine làm expected rồi gọi kiểm chứng độc lập.
- **Nội dung gần nhất:** [family-extension](../tests/family-extension.test.ts), [kin-coverage](../tests/kin-coverage.test.ts), [di-vu-tu-mo](../tests/di-vu-tu-mo.test.ts), [di-vcd](../tests/di-vcd.test.ts), [di-vcd-sun-moon](../tests/di-vcd-sun-moon.test.ts). Expected từ đặc tả/source, không điều chỉnh hàng loạt snapshot cho xanh.
- **Tổ chức/văn:** [continuous-report](../tests/continuous-report.test.ts), [customer-reading](../tests/customer-reading.test.ts), [customer-editorial-catalog](../tests/customer-editorial-catalog.test.ts), [customer-basic-selection](../tests/customer-basic-selection.test.ts), [finance-presentation](../tests/finance-presentation.test.ts). Giữ ngoại lệ, các vế khác chiều, quan hệ; không test chỉ lặp literal implementation.
- **G2/quyền công khai:** [reading-scope](../tests/reading-scope.test.ts), [public-trial](../tests/public-trial.test.ts), [public-trial-pdf](../tests/public-trial-pdf.test.ts). Kiểm cả serialized response/print/evidence, không chỉ trạng thái nút.
- **Google/recovery:** [customer-accounts](../tests/customer-accounts.test.ts), [reading-recovery](../tests/reading-recovery.test.ts), [gmail-smtp](../tests/gmail-smtp.test.ts). `customer-accounts` mock Google và PDF nhưng dùng PostgreSQL; không gọi đây là Google/PDF thật.
- **Đơn/worker/payment:** [core-orders](../tests/core-orders.test.ts), [test-checkout](../tests/test-checkout.test.ts), [sepay-test](../tests/sepay-test.test.ts), [sepay-reconcile](../tests/sepay-reconcile.test.ts), [database](../tests/database.test.ts). Kiểm tài khoản/tiền/mã, aliastransaction, duplicate/retry, quyền/hạn và artifacthash.
- **Admin/CMS:** [admin-g5](../tests/admin-g5.test.ts), [admin-operations](../tests/admin-operations.test.ts), [encyclopedia](../tests/encyclopedia.test.ts), [encyclopedia-renderer](../tests/encyclopedia-renderer.test.ts). Đọc trước file nào có DB; kiểm draftkhônglộ và role, đừng dùng Google session làm admin fixture mặc định.
- **PDF thật:** [stored-customer-pdf](../tests/stored-customer-pdf.test.ts), pipeline [customer-pdf](../lib/internal-review/customer-pdf.ts). Một ca thực cần Chrome/web đúngorigin, quyền, so text frozen, xem ảnh mọi trang đại diện; test giả trả `%PDF-test` không đáp ứng.
- **E2E:** [customer-journey](../tests/e2e/customer-journey.spec.ts), [customer-system](../tests/e2e/customer-system.spec.ts), [customer-retry](../tests/e2e/customer-retry.spec.ts), [reading-stability](../tests/e2e/reading-stability.spec.ts). Spec cũ có thể kiểm nhánh legacy: đọc assertions/setup trước chọn, không gọi mọi spec bao phủ luồng1.53.

## 4. Fixture, bộ192 và mức bằng chứng

[customer-reading-samples.json](../fixtures/customer-reading-samples.json) là nhóm cấu trúc dùng lại. Bộ192v2 và diff mới nhất nằm trong hồ sơ lô được liên kết từ [kế hoạch](V1-DELIVERY-PLAN.md), ví dụ [impact192](../.local/family-scope-20261020/impact192.json). Ghi snapshotID/hash riêng; nhiều bản của cùng snapshot không thành nhiều mẫu độc lập.

- Engine thật chứng kiến nhánh có thể xảy ra trong miền đã tìm; fixture hoán đổi sao/trạng thái kiểm điều kiện, không chứng minh khả đạt engine.
- Không khớp rule không luôn là nguồn thiếu; thiếu receipt/dữ liệu phải phân biệt ngoài điều kiện/ngoài phạm vi.
- Chín Di còn chặn không đọc lại nguồn cũ khi chưa có bằng chứng mới. Bốn cặp TửVCD mới trong lô1.52 còn chỉ fixture theo hồ sơ; không nâng thành E2E.
- Mẫu khớp, near miss, thiếu/mâu thuẫn dữ liệu, ngoại lệ, đảo chiều quan hệ phải theo source decision table. Unit/integration đạt không chứng minh tử vi đúng hay đủ12cung.

## 5. Lỗi mở và kết quả cũ còn giới hạn

**OPEN-TEST-01 — đã khép trong ND03 ngày20/10/2026.** `customer-basic-selection.test.ts` còn đòi `whole-topics-1.0.0`; hợp đồng đã là `whole-free-groups-1.1.0` từ1.51, gồm key-points nguyên nhóm miễn phí và tối đa3 nhóm còn lại. Lượt đầu ND03 tái hiện lỗi; sửa expected theo hợp đồng G2, kiểm toàn bộ paragraph bằng bản chi tiết, không trùngID, highlights không lặp ở phần còn lại và không lấy đoạn khóa. Không đổi expected bản lịch sử. Assertion câu/tiêu đề trong `customer-reading.test.ts` cũng đổi thành kiểm quan hệ unresolved có đủ các bên và đúng thứ tự trước nhà đất, vì ND03 chủ đích đổi văn/tiêu đề. Không bỏ hoặc skip kiểm.

Lượt đầu20đạt/2lỗi tại4file; lượt sau26/26 tại5file; cuối sau sửa chỗ đặt mục tài chính27/27. [Log đầu](../.local/nd03-20261020/tests-first.log), [cuối](../.local/nd03-20261020/tests-final.log). G2 riêng6/6 trong database `tinhluan_nd03_*`, [log](../.local/nd03-20261020/g2-tests.log). Typecheck/build cuối đạt; [nghiệm thu](../.local/nd03-20261020/ban-giao.md) ghi phạm vi và lỗi setup. Không chạy các file hoặc toàngate ngoài phạm vi. Không có fail/skip trong tập cuối đã chạy; điều này không chứng minh các phần chưa chạy đều xanh.

[tests-focused-final.log](../.local/family-scope-20261020/tests-focused-final.log) ghi619passed; [g2-tests.log](../.local/family-scope-20261020/g2-tests.log) là lượt6case riêng. Các lượt cũ này không đồng nghĩa toàngate xanh; OPEN-TEST-01 chỉ được khép bởi lượt ND03 nêu trên. [typecheck](../.local/family-scope-20261020/typecheck-final.log), [build](../.local/family-scope-20261020/build.log), [PDF](../.local/family-scope-20261020/pdf-check.json) là bằng chứng lô trước, không phải kiểm mới trong phiên tài liệu.

Danh sách này chỉ ghi lỗi mở tìm được trong tài liệu gần nhất và assertion đã đọc; không cam kết không còn lỗi ở phần chưa chạy. Timeout/rerun phải ghi riêng; không xóa/skip/làm yếu assertion hoặc sửa expected lịch sử. Bằng chứng provider thật xem các bàn giao G1a/G4/SePay/email từ HANDOFF, không thay bằng kết quả mock.

## 6. Kết thúc một lượt kiểm

Ghi cwd/codeidentity, envđích khôngsecret, lệnh, files/cases, kết quả từng lượt, lỗi và thay đổi sau kiểm, fixturesvsengine/providerthật, phần chưa chạy. Nếu sửa code saugate, chỉ nêu phần kết quả còn hiệu lực; không chạy lại toànbộ trừ tác động yêu cầu. Task tài liệu kiểm link/diff là đủ; không dùng nó để báo ứng dụng đã được nghiệm thu lại.

## ND04 Phụ/Huynh — 21/10/2026

Baseline `main@1fa0829`, đầu lô sạch. Code cuối phục vụ từ `.local/vcd-20261021/qa-final`; root/QA trùng byte các file ứng dụng đổi. Chỉ sửa tài liệu sau lượt kiểm cuối.

- `node node_modules/vitest/vitest.mjs run tests/family-vcd.test.ts tests/phu-huynh.test.ts tests/family-extension.test.ts tests/di-vcd.test.ts tests/di-vcd-sun-moon.test.ts tests/customer-editorial-catalog.test.ts tests/customer-topic-editorial.test.ts tests/continuous-report.test.ts`: **679/679,8file**. [Log](../.local/vcd-20261021/tests-final.log).
- `node .local/vcd-20261021/run.mjs scope-test`: **6/6**, `reading-scope.test.ts` trong DB riêng tạo mới; không QA chính. [Log](../.local/vcd-20261021/g2-tests.log).
- `node .local/vcd-20261021/run.mjs typecheck` và `build` gọi `npm run typecheck/build` trong checkout QA: đạt. Build một lượt; typecheck lượt đầu có2TS2790 do test delete thuộc tính bắt buộc, sửa castfixture rồi đạt.
- `.local/vcd-20261021/compare.ts`: so đủ192, giữ claims/facts/rule/trace/relations cũ, ND01/Di/ND03 và G2. Lượt đầu bắt thay metadata B, đã tách B-vcd để giữ nguyên B; lần cuối đạt. Không thay expected lịch sử.
- Các lỗi setup khác: fixture place trống bị validation; search chọn1971ngoài miền. Sửa fixture và phạm vi tìm; không tính output lỗi thành mẫu. Tìm1.440input hợp lệ ngoài192 có15nhánh/14input;18nhánh chỉfixture. Test nguồn khớp/không khớp/unknown/TT/ngoài bảng không thay chứng kiến engine.
- Hai phiên khách qua form → lưu/mở lại; fullPDF403 trước grant, chéo đọc/PDF404; hai đơn **mock** nội bộ để kiểm toàn bài. Mobile360/390/căn cứ; PDF8trang,18đoạn đúng bản lưu, đã xem đủ ảnh. Không báo mock là SePay thật. [Bằng chứng](../.local/vcd-20261021/public-acceptance.json), [PDF](../.local/vcd-20261021/pdf-check.json).

Không chạy toàngate, bộPDF hoặc nghiệm thu provider. Lượt cuối các file đã chạy không fail/skip; phần chưa chạy không được tuyên bố đạt. Bảo toàn117file báo cáo/103ID,35file phiên,14filecode bảo vệ và các dòng quyền/link/binding cũ;34bài công khai không đổi. [Manifest](../.local/vcd-20261021/preservation.json).

## Sửa chính xác hai câu tọa thủ — 21/10/2026

Baseline `1d6caa3`, working tree sạch. Chạy Vitest tại5file: `phu-huynh`, `family-vcd`, `customer-editorial-catalog`, `customer-topic-editorial`, `continuous-report`. Lượt đầu662/662 nhưng so192 bắt mẫu ghép Cơ–Cự/Kỵ còn lời sai; sửa mẫu ghép. Lượt tiếp661đạt/2lỗi: expected cũ yêu cầu “xa cách” và quy đối tượng con–cha mẹ cho câu hòa khí chung. Đối chiếu PDF127/128 rồi thay bằng kiểm câu độc lập và đủ hai khả năng Kỵ; kiểm dữ liệu fixture lịch sử nguyên vẹn, không đổi expected bản lưu. Lượt cuối **663/663,5file**, không skip.

`node --import tsx .local/family-accuracy-20261021/compare.ts`:192 mẫu, chỉ hai rule đổi claim/căn cứ/văn; tập khớp, facts, relations và tất cả33VCD không đổi. Không tìm mẫu cho18fixture-only. Chuẩn bị/typecheck/build ban đầu thiếuenv, runtime báo Invalid URL trước chạy npm; sau nạp cấu hình đúng typecheck/build đạt. Sau chỉnh test chạy typecheck cuối đạt, không đổi app sau build. Không chạy toàngate.

Hai hồ sơ qua form công khai, reload và full grant mock trả đúng bản lưu; G2 không lộ lời khóa, PDF403 khi thiếu full, chéo phiên đọc/PDF404; mobile360/390 và căn cứ đạt. Không xuất PDF mới hoặc báo đã kiểm lại tệp PDF. [Log/đầu ra](../.local/family-accuracy-20261021/ban-giao.md). Bảo toàn120file báo cáo/37file phiên/14filecode và các dòng quyền cũ;34bài công khai không đổi. QA3070 giữ nguyên.

## Tử–Phu21/10/2026 — 1.56.0

Baseline28328cc sạch, code8776d6e. Vitest tại `kin-coverage`, `phu-tu`, `customer-editorial-catalog`, `customer-topic-editorial`, `continuous-report`: cuối436/436. Lượt đầu429đạt/1lỗi vì assertion chữ ly tán/phiêu bạt của Tử dùng chung IDseparation cho Phu; sửa điều kiện test đúng cung, không sửa lời nguồn cho xanh. Sau lần lượt433,435,436đạt khi bổ sung Tướng và ánh xạ căn cứ. [Log cuối](../.local/kin-batch-20261021/tests-evidence.log). So192 giữ tất cả lời/facts/traces/relations/văn cũ và G2;37claim mới,37snapshot. Hai đầu vào mới có chủ đích, không quét;2nhánh mới chưa có engine ngoài fixture.

G2 `reading-scope`6/6 trong DB mới `tinhluan_kin_1792551726765`; lần đầu sandboxEPERM localhost dừng trước tạoDB, lần có quyền kết nối đạt. Schema chỉ khởi tạo DB riêng rỗng, không migration/restore QA. PDFmock6/6 trong cùng môi trường riêng. Typecheck/build cuối [đạt](../.local/kin-batch-20261021/build-evidence.log); không chạy toàngate.

QA3082 riêng: ba lượt UI (2+3+3bản/đơn mock, chỉ3cấu trúc engine; không đếm bản trùng thành mẫu mới). Lượt cuối3/3 form→lưu→full→reload nguyên văn, mobile360/390/căn cứ, khóa payload/PDF403 và chéo đọc/PDF404. PDF thật8trang,17đoạn khớp frozen; kiểm đủ ảnh. Lượt đầu bắt mục lục trống vì thiếu1.56 trong allowlist paginator; chỉ thêm phiên bản mới. Lượt ảnh căn cứ bắt thiếu ánh xạ facts; thêm cho đúng16nhánh mới, không sửa lời lịch sử. TríchPDF ban đầu thiếu pdftotext và pypdf hệ thống; dùng Python/runtime đi kèm đạt, không cài phụ thuộc mới. [Kết quả cuối](../.local/kin-batch-20261021/public-acceptance.json), [PDF](../.local/kin-batch-20261021/pdf-check.json).

QA3062 tích hợp cùng DB/kho sau khi so byte checkout với commit:3bản mới qua form đúng1.56/1.53, free/reload và403đạt; không đưa đơn mock vào QA chính. Bảo toàn122filebản/39filephiên/14filecode và các dòng quyền/binding/link cũ;34bài công khai nguyên vẹn. QA3070 giữ PID94421. Không nghiệm thu lại Google/SePay/SMTP thật hoặc tunnel. [Bảo toàn](../.local/kin-batch-20261021/preservation.json), [đích](../.local/kin-batch-20261021/runtime-target.json).

## Bốn mẫu được duyệt — 1.57.0,21/10/2026

Baseline0613901; code3bff73c. `kin-approved`, `kin-coverage`, `phu-tu`, `customer-editorial-catalog`, `customer-topic-editorial`, `continuous-report`:447/447, lần đầu đạt. Kiểm fixture đúng/sai cung/chi, sao lưu, chứng nhận thiếu/mâu thuẫn, extra chính tinh, G2 và trạng thái unknown/outcomeApplied=false khi dựng/lưu văn. Bốn mẫu engine thực từ192 được xác minh qua form; fixture không thay chứng kiến engine. G2 riêng6/6 trong DB `tinhluan_kin_approved_1792554113797`; PDFmock6/6; typecheck/build checkout riêng đạt.

So192 giữ mọi facts/rules/traces/claims/văn/relations cũ và G2.41snapshot đổi:17Tử mới có nhận định,22Tử bổ sung;2Phu chỉ chú giải điều kiện. QA3083:4mẫu full grant qua đơn mock, lưu/mở/mobile360/390, khóa payload/PDF403 và chéo đọc/PDF404. PDF thật8trang/17đoạn nguyên văn, kiểm ảnh8trang; thiếu fitz ở runtimePython nên dùng Poppler/pypdf, không có lỗi ứng dụng hoặc sửa expected để xanh. QA3062:4mẫu mới qua form/reload đúng1.57/catalog1.54; không mockorder vào QA chính.181file lịch sử/phiên/code và quyền/link/binding,34bài công khai giữ nguyên. [Bằng chứng](../.local/kin-approved-20261021/ban-giao.md). Không kiểm toàn gate, provider thật/tunnel; QA3070 và Livefalse giữ nguyên.
