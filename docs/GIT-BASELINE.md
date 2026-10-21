# Baseline Git cục bộ — 21/10/2026

## Trạng thái

Kiểm trước khởi tạo: root `/Volumes/DATA/TINHLUAN` chưa có Git; `.git` không có ở `/Volumes/DATA`, `/Volumes`, `/`; Git discovery qua ranh giới filesystem cũng không tìm repository. Quét toàn cây thực không theo symlink, không có repository lồng nhau, không lỗi đọc. Symlink phụ thuộc/checkout ngoài cây không được nhập vào repository.

Branch: `main`. Baseline commit **`0c5461a1d6fe2bbba9522e99dbeebd8fab67eb98`**, thông điệp `chore: establish Tinh Luan baseline and handoff docs`. Danh tính đã được chủ dự án cấu hình cục bộ; giữ `user.useConfigOnly=true`. Không tạo remote/push.

Trước commit đã kiểm đủ597 đường dẫn và SHA-256 của staged blobs khớp manifest được rà ở lượt chuẩn bị; không có thay đổi unstaged/untracked ngoài ignore. Năm lỗi khoảng trắng có sẵn giữ nguyên. Không stage thêm file vào baseline. Bản cập nhật trạng thái này được lưu bằng commit tài liệu riêng sau baseline.

## Phạm vi được quản lý

Code `app`, `components`, `lib`; script `scripts`; test `tests`; migration `db/001...010`; cấu hình deploy không secret; package/lockfile/cấu hình TypeScript/Next/Playwright/Vitest; assets website và license font; `.env*.example` đã rà; AGENTS, README, tài liệu `docs` gồm sáu tài liệu bàn giao, HANDOFF và backlog duy nhất.

Năm fixture JSON được giữ: hai M07 là đầu vào tổng hợp tìm hữu hạn, có receipt (nguồn xác nhận: `docs/LIFE-LITERARY-1.44.0.md`); Khoa–Kiếp có provenance ghi rõ synthetic; hai chart-comparison dùng ngày mẫu upstream công khai hoặc placeholder chưa xác nhận. Hai fixture TypeScript trong tests là bảng tham chiếu/harness, không kho dữ liệu khách.

## Phần loại khỏi Git, không xóa trên máy

- `.env` và `.env.*` thực; key/certificate, cookie/storage-state/token local.
- `.local`, `exports`, `output`, `release`, kho dữ liệu/báo cáo/backup, dump database, log, build, node_modules, kết quả test, cache và cấu hình editor riêng.
- PDF/sách gốc, tệp tài liệu nguồn/archives; `docs/evidence` chứa ảnh nguồn, output nghiệm thu/log và các bản đọc, không phải code.
- `fixtures/customer-reading-samples.json`: có hồ sơ có tên và ngày sinh, chưa đủ bằng chứng mọi bản đều synthetic; loại toàn file thay vì sửa tên/receipt để đưa vào Git. Nội dung gốc giữ nguyên.

Hệ quả: một số test/script và import code tham chiếu `exports`, `.local`, `docs/evidence` hoặc fixture riêng. Baseline lưu code hiện hành, **không phải gói clone là build/test đầy đủ ngay**. Máy hiện tại giữ các phụ thuộc này. Trước chuyển máy phải chuẩn bị tập dữ liệu đã khử định danh với receipt/hash đúng hoặc bàn giao riêng có quyền; không force-add dữ liệu khách. Việc tách phụ thuộc riêng khỏi build không nằm trong gói Git, chưa sửa logic.

## Rà an toàn cục bộ

Danh sách dự kiến theo allowlist từng nhóm file, không stage mù quáng. Scanner cục bộ đối chiếu giá trị secret từ env thực với file ứng viên; tìm private key, mẫu khóa provider, JWT, URL chứa mật khẩu và literal secret; không in giá trị.10 cảnh báo ban đầu:3 URL dùng mật khẩu placeholder/test;7 là dữ liệu unit test hoặc code sinh secret ngẫu nhiên. Không thấy secret thật trong tập đã rà. Email được rà theo vị trí: mẫu/example/test và attribution license; không đưa email người dùng QA vào Git.

Kết quả cuối:597 file staged khớp byte với manifest đã rà; đối chiếu6 giá trị secret cấu hình,0 trùng;10 cảnh báo đã phân loại,0 secret thật xác nhận;0 remote. `git diff --cached --check` ghi5 lỗi khoảng trắng có sẵn tại Chart.tsx, ChartSheet.tsx, ruler-conventions.ts, Phudu-OFL.txt và ruler-conventions.test.ts; giữ nguyên, không sửa code/license chỉ để baseline sạch. Không còn file chưa được quản lý ngoài ignore.

Đây là quét có phạm vi và kiểm thủ công cảnh báo, không phải bảo đảm không có mọi loại secret/PII có thể có. Không có gitleaks/trufflehog cài sẵn; không tải dịch vụ hoặc gửi nội dung ra ngoài. Kết quả tổng hợp, manifest hash và danh sách file ở `.local/git-baseline-20261021/`; giá trị secret không ghi vào hồ sơ này.

Không chạy test/build ứng dụng, không migration/restart QA, không thay nội dung báo cáo/quyền/engine/catalog hoặc dữ liệu. Git không bao gồm bản sao DB; không thể dùng commit để phục hồi dữ liệu runtime.

## Tra cứu baseline

```sh
git show --stat 0c5461a1d6fe2bbba9522e99dbeebd8fab67eb98
git log -2 --oneline
git status --short
```

Danh tính Git đã đủ, không còn chặn tạo baseline. Giới hạn dữ liệu riêng và khả năng dựng lại trên máy mới ở trên vẫn giữ nguyên. Không chạy test/build, sửa whitespace, QA hoặc migration trong lượt commit.

## Quy trình thread

Theo AGENTS: đọc branch/status/diff đầu task; cùng thư mục là cùng index/branch, không checkout/reset/clean ghi đè việc người khác. Mỗi task chọn file/hunk rõ và commit riêng sau kiểm. Một người/thread tích hợp QA chính tại một thời điểm, giữ lịch sử và dùng đúng DB/kho. Không tự chạy QA hoặc push chỉ vì commit đã tạo.
