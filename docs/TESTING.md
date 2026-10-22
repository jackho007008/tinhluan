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


## Lô Nô–Điền–Phúc 1.58 / catalog1.55 — 21/10/2026

Baseline9f8d407/code3bff73c sạch;192 report1.57 dựng lại khớp. Code `e7bd1e4`. Thư mục bằng chứng `.local/no-dien-phuc-20261021/` (local/ignore; không force-add). Phần ảnh hưởng:

- `tests/no-dien-phuc.test.ts`, `no-dien`, `phuc-di`, `kin-approved`, `customer-editorial-catalog`, `customer-topic-editorial`, `continuous-report`:842/842 ở lượt nhóm cuối; thêm kiểm Tang Môn vòng bản mệnh làm file mới41/41, tổng843 kiểm riêng biệt. Cấu trúc đúng/sai cung/chi, scopeorigin/year, thiếu chứng nhận/phủ định, TT, OR/AND nguồn, trạng tháiKình, G2/văn khách. Fixture gán sao rõ là kỹ thuật, không engine thật.
- `compare.ts`:192snapshot, giữ nguyên oldfacts/rules/traces/claims/P2/quan hệ tại cung và văn/căn cứ cũ. Đoạn liên kết Tài–Điền có thể thêm thành viên mới qua pipeline chung; không đòi byte-identical toàn đoạn khi căn cứ mới được thêm. G2 policy toàn192 bằng baseline.33snapshot đổi; số trống và mới/bổ sung xem impact192.json.
- Typecheck/build production đạt trong checkoutqa-final, không test/build lại vô cớ.6/6reading-scope vớiDB riêng `tinhluan_no_dien_phuc_*`;6/6stored-customer-pdf dùng mock renderer, không gọi làPDFthật.
- QA3084 cô lập:5lượtform Lập lá số (4đầu vào khác nhau), đầy đủ→API/DOM giữ nguyên bản lưu; quyền full từ thanh toán mock cục bộ, không SePaythật. Khóa không lọt freepayload/DOM; freePDF403; chéo phiên đọc/PDF404; reload đúng. Mobile360/390 không overflow, căn cứ mở/thu được. PDFthật9trang từ endpoint:19đoạn frozen đủ qua pypdf, đã xem ảnh toàn9trang và mobile. Không cắt điều kiện/ngoại lệ. QA3084 đã tắt saukiểm.
- QA3062 sau đổi đúngweb/worker:5lượtform tạo mới/reload đúng1.58/catalog1.55, chỉ quyềnfree; không giả thanh toán trênDBchính.175file cũ giữhash;26access_tokens/23binding/18link, nội dung34bài công khai giữ nguyên. QA3070pid94421/cwd cũ nguyên; Livefalse. Serving-code.json ghi commit/hashroot=checkout.
- Engine192 có7/9nhánh mới; Cự–Hỏa và Kỵ–Không–Kiếp chỉfixture. Tìm có chủ đích tối đa3ngày liền kề cho5cấu trúc, ghi attempts;2mẫu ngoài192 thật quaform là nữ21/02/1978 giờSửu và nữ07/11/1978 giờTỵ. Không lấy tìm mẫu làm cách tăng độ phủ.

Lỗi đầu và cách xử lý:8assertionfixture fail vì fixtureVCD đổi nhầm cung rỗng, không có chứng nhận đủTứHóa để khẳng định vắngKỵ; sửa fixturechứng nhận, cặpTTkề nhau. Comparator cũ bỏ cả đoạn liên kết có thành viênmới, làm sai kiểm“oldparagraph”; đổi kiểm bảo toàn văn/membercũ, không đổi expectednguồn/lịch sử. Tang Môn thực tế nằm vòngsuiqian12: dùng evaluatorvòng chung, thêm kiểm không chấp nhận phụ tinh giả. Lượt DB đầu bị sandboxEPERMlocalhost, QA3084 chưa khởi động; chạy lại được quyềntruycậpDBriêng và đạt. Lượt mẫu mới đầu chưa cóĐiền sau ba ngàyliềnkề: giữ kết quảâm, không tìm hàngloạt; dùngĐiền từ192và2Phúcngoàibộ. Không chạy fullgate, không kiểm SePay/emailproviderthật trong lô.


## Lô Quan–Tài 1.59 / catalog1.56 — 21/10/2026

Baseline `main` sạch `e9fdbbd` (codee7bd1e4),192report dựng lại khớp1.58. Code `bb230d5`, bằng chứng `.local/quan-tai-20261021/` local/ignore, không force-add.

-156/156 tại `quan-tai`, `career-closing`, `customer-editorial-catalog`, `customer-topic-editorial`, `continuous-report`;128/128 tại `finance-assets`, `finance-expansion`, `finance-presentation`, `career-batch`, `career-occupations`: **284 kiểm tại10file**. Kiểm đúng/sai cấu trúc, saiThân, sao thiếu/sai cung/sao lưu, chứng nhận thiếu, giữ toàn câu mốc30/ngoài30/vềgià; không chọn kết quả theo tuổi/nămxem/giới, không tự thêm độ sáng hoặcTT. Không chỉnh expected nguồn/lịch sử.
- Rà nhãn phát hiện câu giàu ngoài30 không có căn cứ để xếp“Nguồn thu”; bỏ phân loại thêm, dùng“Tiền bạc”củaND03.39/39 kiểm lại tại3file (thuộc284 phía trên); typecheck/build chạy lại sau sửa và đạt. Lượt UI đầu giữ riêng public-acceptance-first.json; UI cuối không dùng nhãn cũ. Không có assertionfailed trong các lượt đã chạy. Bản đầu so192 có versiontrìnhbày cũ do chưa đổi chuỗi dấu nháy; đã bắt bằng kiểmversiontrướcbuild và chạy lại so192 với1.59, không sửa nguồn/expected.
- `compare.ts` giữ facts/rules/traces/claims/P2/quan hệ cũ, văn/member cũ và G2 trên192;7snapshot thêm lời. Quan28→24 (4mới/1bổ sung), Tài21→21 (0/2). Cả3nhánh có engine192, không fixture-only. Tìm hữu hạn tối đa3ngày lân cận cho mỗi3cấu trúc;2mẫu ngoài192 thật, không mở quét engine hàng loạt.
-6/6`reading-scope` dùngDBriêng `tinhluan_quan_tai_*`;6/6`stored-customer-pdf` mockrenderer. Không lấy6PDFmock làm bằng chứngPDFthật. Typecheck/build cuối ởcheckoutqa-final đạt; root và các file đổi ởcheckout trùng hash phục vụ.
- QA3085:3mẫu qua form, freepayload/DOMkhônglộlời khóa, freePDF403, chéo phiên đọc/PDF404; full bằng thanh toán **mock** chỉDBriêng, khôngSePaythật. Lưu–mở lại đúngtoànvăn, mobile360/390 khôngoverflow vàcăn cứmở/thuđược. PDFthật8trang từendpoint,17đoạnfrozenđủ qua pypdf; đã xemảnh8trang vàmobile. QA3085 đãtắt.
- QA3062 saucutover:3mẫu form mới đúng1.59/catalog1.56, reloadđúngfree, khôngtạođơnmockởQA chính.186file cũ giữhash;26token/23binding/18linkvà34bài côngkhai nguyên. Web81341/worker81345đúngcheckout, QA3070pid94421/cwdnguyên, Livefalse. Khôngtestproviderthật hoặc chạytoàngate.

Mẫu ngoài192: nam20/02/1978giờTỵ (QuanVũ–Tham), nữ05/05/1988giờTỵ (TàiVũ–Tham); Nhật–Cự/Thân dùng mẫuengine192nam06/05/2008giờSửu. Fixture hoán đổisao chỉkiểm logic. Bằng chứng: baseline.json, impact192.json, representative-attempts.json, public-acceptance.json, main-acceptance.json, pdf-check.json, preservation.json, db-after.json, serving-code.json.


## Tài VCD trực tiếp1.60 — 21/10/2026

Baseline `main@80d9232` sạch, code `48683ce`; không chạy toàn gate. Bằng chứng `.local/finance-vcd-20261021/` ngoài Git; [bàn giao](../.local/finance-vcd-20261021/ban-giao.md).

- `finance-vcd`, `void-palace`, `finance-presentation`, `customer-editorial-catalog`, `customer-topic-editorial`, `continuous-report`: **68/68 tại6file**, lượt đầu và cuối sau bổ sung kiểm căn cứ. Không fail/skip. Kiểm đúng/sai/unknown, trạng thái ở chi thật, TT đối cung/cả hai TT, thiếu/trùng/sao lưu/cặp TT sai; cả hai Nhật–Nguyệt sáng giữ ngoài tập con kể cả không chiếu. Fixture không chứng minh khả đạt engine.
- Dựng lại đủ192 khớp baseline1.59; thêm một fact/rule, bốn snapshot thêm claim, **1Tài mới có nhận định/3bổ sung**. Facts/rules/traces/claims/P2/relations/văn/member cũ và G2 nguyên. Phu49 không đoạn +2 chú giải chưa áp vẫn là51 chưa có nhận định. Ba mẫu88/53/150 qua engine/form; ba ngày lân cận88 đều không khớp, giữ kết quả âm, không gọi bất khả đạt.
- **6/6 reading-scope** ở DB mới `tinhluan_finance_vcd_1792571439851`; **6/6 stored-customer-pdf** với renderer giả. Lượt DB đầu bị sandboxEPERM trước tạo DB; chạy lại với quyền loopback đạt. Typecheck đầu4TS2741 do fixtureTT thiếu `source`; sửa fixture rồi đạt. Build đầu đạt; sau thêm ánh xạ căn cứ, build cuối đạt. Không sửa ứng dụng sau đó.
- QA3086 cách ly: hai mẫu đầu rồi bổ sung riêng mẫu Tài trước trống, tổng3bản/3đơn mock và3cấu trúc. Form → miễn phí → full mock → reload giữ toàn văn. Không lọt lời khóa payload/DOM; freePDF403, chéo phiên đọc/PDF404; mobile360/390 và căn cứ đạt. Hai PDF thật9trang/20đoạn và8trang/14đoạn khớp frozen; đã xem contact mọi trang và trang chứa đoạn mới. Đọc đủ toàn văn ba mẫu; không đọc lại toàn192. Mock không phải SePay thật.
- QA3062 tích hợp ba bản mới đúng1.60/catalog1.57 qua form/reload, chỉ quyền miễn phí; không đơn mock trên DB chính. Web13354/worker13359 cùng checkout `.local/finance-vcd-20261021/qa-final`; tám file code/test đổi trùng hash commit.192file báo cáo/phiên cũ,26token/23binding/18link và34bài công khai nguyên. Livefalse; QA3070pid94421/cwd nguyên. QA3086 đã tắt, không worker thử chồng. Không kiểm provider ngoài/tunnel hoặc migration/restore QA.

Lượt commit đầu bị sandbox chặn `.git/index.lock` trước stage; chạy lại với quyền ghi Git đạt, không đổi branch/remote/push. Không đổi expected nguồn/lịch sử để xanh. Hạn chế chuyên môn còn mở ở FINANCE-ASSETS; kiểm kỹ thuật không chứng minh đủ12cung.


## Đồng–Âm/Di — TT tại cung nhận1.61,21/10/2026

Baseline code48683ce, tám tài liệu lô trước đã khép riênga0b4396; codea57bb76. [Bằng chứng lô](../.local/dong-am-di-20261021/ban-giao.md).

- `dong-am-di`, `di-vcd`, `di-vcd-sun-moon`, `phuc-di`, `customer-editorial-catalog`, `customer-topic-editorial`, `continuous-report`: lượt đầu373/373; thêm fixture chiềuMệnhTý/DiNgọ (không chứng kiến engine), lượt cuối **374/374 tại7file**, không fail/skip. Kiểm TT cung cho/nhận/cảhai/khôngbênnào; một/cảTT; danh sách thiếu/trùng/lưu; sai cặp/đối cung; toàn văn/căn cứ/G2. Không lây điều chỉnh của nền cặp sang xóa vếTTDi độc lập.
- So192 dựng lại1.60 khớp,1snapshot139 thêm đúngclaimTTDi.1Di mới có nhận định/0bổ sung;14→13thiếu. Facts/rules/traces/claims/P2/relations/văn/member cũ vàG2 nguyên.34/127 không nhận lời mới; nền Đồng–Âm chưa xuất.
- Engine tìm hữu hạn480 đầu vào hợp lệ,0lỗi,13cấu trúc,6khôngTTcảhai cung. Hai mẫu khôngTT ban đầu kiểm như đối chứng không khớp ruleTTDi. Hai mẫu eligible:192#139 và nam06/11/1982giờThìn đã nằm trong480; tính lại qua engine rồi quaform. Không cộng tìm kiếm vào test hoặc độphủ192.
- 6/6`reading-scope` DB mới `tinhluan_dong_am_di_1792579279779`;6/6`stored-customer-pdf` với renderer giả. Typecheck đầu/cuối và productionbuild đạt; lượt cuối chỉ thêm fixturetest, không sửaapp saubuild. Không sửaexpectednguồn/lịch sử hoặc chạytoàngate.
- QA3087 riêng:2bản/2đơnmock, fullAPI/DOM và reload đúngfrozen; freekhônglộpayload/DOM, PDF403, chéophiênđọc/PDF404; mobile360/390 vàcăncứđạt. PDFthật8trang15đoạn khớpfrozen; xemcontactmọitrang/căn cứmobile. Đãđọc toànvăn2mẫu. Mock không phảiSePaythật. QA3087đãtắt, khôngworkerthử.
- QA3062:2bản mới đúng1.61/catalog1.58 quaform/reload chỉfree, khôngđơnmock trênDBchính. Web21700/worker21704đúngcheckout `.local/dong-am-di-20261021/qa-final`;8filecode/testđổi trùnghashcommit.199filebáocáo/phiêncũ và26token/23binding/18link/34bài côngkhai nguyên. Livefalse,QA3070pid94421/cwdnguyên. Không kiểmprovider/tunnelngoài, migration/restoreQA.

Dừng nhánh TTDi đã có nguồn. Các phương diện lời nền Đồng–Âm còn chặn được ghi đúng trong PHUC-DI, không coi test kỹ thuật là phê duyệt chuyên môn.


## TTDi dùng chung1.62 —21/10/2026

Code `daee8c2`, nối ca75881/a57bb76; [bằng chứng](../.local/di-void-shared-20261021/ban-giao.md). Chỉ gói chungTB179§10.27, khôngtoàngate.

- Sáu file: `di-void`, `phuc-di`, `no-dien-phuc`, `customer-editorial-catalog`, `customer-topic-editorial`, `customer-basic-selection`: lượt đầu389/389; thêm8ca phạm vi engine/profile có1lỗi vì fixture gán `engineProfile` thay `profile.id`. Sửa trường đúng, không đổi expected;29/29filedi-void đạt,5file368đạt không sửa. Tổng397ca đã đạt. [Lỗi đầu](../.local/di-void-shared-20261021/tests-final.log), [lượt sửa](../.local/di-void-shared-20261021/tests-corrected.log). Typecheck/build cuối đạt, không đổi code sau build.
- So192: đối chiếu sâu mọi fact/rule/trace/claim/văn khác, P2/relations/G2 nguyên; chỉ loại rule/fact TT hẹp bị thay, xác nhận không còn active và TT mới tối đa1claim.3Di mới/55bổsung/1thayđoạn,13→10thiếu; không tăng phủ cung khác.
- `reading-scope.test.ts`6/6 trongDBmới `tinhluan_di_void_*`,kho riêng; `stored-customer-pdf.test.ts`6/6mock, không gọi mocklàPDFthật. [G2](../.local/di-void-shared-20261021/g2-tests.log), [PDFmock](../.local/di-void-shared-20261021/pdf-tests.log).
- Sáu engine87/169/32/159/63/139: có chính tinh/VCD/HóaKỵ/Nhật–Nguyệt/xung chiếu/Đồng–Âm quaform3088, free/fullthử bằng ordermock trongDBriêng, lưu/mở lại đúng frozen,khóa server403 vàchéophiên404; mobile360/390 khôngtràn,căn cứmở/đóng. PDFthật từendpoint8trang16đoạn đủvăn,đãxemcontactvàtrang6. [UI](../.local/di-void-shared-20261021/public-acceptance.json), [PDF](../.local/di-void-shared-20261021/pdf-check.json). Sáu bản tạoQA3062chỉfree, khôngđơn/mock/provider ởDBchính.
- 204filelịch sử cũgiữhash;quyền/binding/link và34bàicôngkhai nguyên. QA3062web26158/worker26162;QA3070PID94421cwdcũ giữnguyên. Livefalse;QA3088tắt. Khôngkiểmprovider ngoài/tunnel/toàngate,khôngmigration/restartchỉvìtài liệu.


## Ngữ cảnh khác chiều1.63 —22/10/2026

Baseline7ab01c5 sạch, codephụcvụdaee8c2. [Đặc tả](OPPOSING-CLAIMS-1.63.0.md), [bàn giao và log](../.local/opposing-20261022/ban-giao.md). Kiểm tập trung, khôngtoàngate.

- 35ca/5file `customer-contexts`, `customer-topic-editorial`, `finance-presentation`, `customer-editorial-catalog`, `continuous-report`;78ca/3file `finance-assets`, `tanbien-finance`, `customer-basic-selection`. Tổng113ca riêng biệt, không cộng lượt chạy lại. Chốt ngữ nghĩa, đủ vế/điều kiện/căn cứ, nhóm chưa biết không tạo xung đột, tên/ngày không chọn lời, gom chạy lại không lặp, kiểm ngoại lệ nguồn đã có. Test dùng bộ cục bộ giữ ngoàiGit theoGIT-BASELINE.
- So192 sâu reading/continuous nguyên, G2policy bằngbaseline;40bài gom lại, mọi đoạn khác nguyên. Mỗi câu khách gốc trong cụm còn nguyên; mỗi member/layers/fact/trace/rule nguyên. Không gọi đếm test/đoạn là đầy đủ bài.
- G2integration6/6 DBriêng `tinhluan_opposing_*`,PDFmock6/6; typecheck/build đạtcheckoutriêng. Sáumẫu engine192quaform/lưu/mở/fullmockriêng/freePDF403/chéophiên404/mobile360/390/căncứ. HaiPDFthật8trang,13và18đoạnfrozenđủ, kiểmảnh mọi trang và trang6/5 có đoạn mới. Không providerthật, không worker thử. Thông tin lượt cuối/codeidentity/phụcvụ/bảotoàn trong bàngiao.
- Lỗi đầu:2assertioncũ đòi đoạn riêng, cập nhật kiểm đủmember/nguyênvăn trong cụm;1lỗi gom lầnhai gây lặp, sửa bỏ qua cụmđãđánhdấu; không thay expected nguồn/lịch sử. Setupenvthiếu gâyInvalidURL trước typecheck/build/DB, nạpđúngenv; sandboxEPERM DB trước tạoDB, chạy lại có quyềnloopbackriêng. Rà nội dung cuối táchPhụcBinh khỏi xungđộtgiữcủa (cảnhbáo chưa phảisựkiện); sửa sốtrang căn cứVũ–Tham192→191, vănkháchkhôngđổi. Rerunđúngphầnảnhhưởng, không sửa lịch sử cho xanh.


## Rà nghĩa1.63 —1.63.1,22/10/2026

Code13a7f3d, baseline6c80bc6 sạch.38/38 tại5file `customer-contexts`, `customer-topic-editorial`, `finance-presentation`, `customer-editorial-catalog`, `continuous-report`. Thêm mẫu50 thực và fixture13nhánh khácphươngdiện/5nhánh thật sự khógiữ; không gọi fixture làengine. Lượt đầu37đạt/1lỗi do filtertest lấy cả ghi chútiền–nhàđất chung; sửa đúngfilter, nguồn/lịch sử nguyên. Kiểm one-transition, khôngwrapperlặp và member/điềukiện/nguyêncâu/G2 bảo toàn. [Bàn giao/toàn đoạn/log](../.local/context-review-20261022/ban-giao.md).

So192 reading/continuous vàG2khớp sâu;40bài chỉ đổi lớp gom.6/6G2 DBriêng `tinhluan_context_review_*`;6/6PDFmock; typecheck/build đạt.6engineform/lưu/mở/fullmockriêng/mobile360/390/căncứ/freePDF403/chủkhác404. PDFthật9trang19đoạn và8trang13đoạn đủfrozen, đãxemmọitrang và5/6. QA3062saucutover6form/reload1.63.1 chỉfree, khôngmockởDBchính.228file/26token/23binding/18link/34bàigiữnguyên; QA3070nguyên, Livefalse,Tậtchưa publish;3090tắt. Khôngtoàngate/providerngoài hoặcmigration/restore/purge.
