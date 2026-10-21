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
