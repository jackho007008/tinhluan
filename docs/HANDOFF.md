# Tinh Luận — đầu mối bàn giao đa thread

Cập nhật20/10/2026; làm việc tại `/Volumes/DATA/TINHLUAN`. Đây chỉ là chỉ mục, không phải backlog thứ hai.

## Sáu tài liệu và thứ tự đọc

1. [AGENTS.md tại root](../AGENTS.md): khởi động, ràng buộc, kiểm và kết thúc task.
2. [CURRENT_STATUS.md](CURRENT_STATUS.md): trạng thái ngắn, phiên bản/QA, đã phục vụ và khoảng thiếu.
3. [BUSINESS_RULES.md](BUSINESS_RULES.md): hợp đồng quyền/nguồn/phạm vi, câu hỏi chuyên môn và **toàn văn hai mẫu Tật Ách**.
4. [DECISIONS.md](DECISIONS.md): quyết định đã chốt, đề xuất chưa duyệt, mục thay thế và mức bằng chứng.
5. [ARCHITECTURE.md](ARCHITECTURE.md): luồng dữ liệu, module/symbol, kho, worker, dịch vụ; nhận diện code khi không có Git.
6. [TESTING.md](TESTING.md): lệnh và nhóm kiểm theo tác động, cách ly dữ liệu, fixture/provider thật và lỗi còn mở.

Đọc tiếp đúng phần [V1-DELIVERY-PLAN.md](V1-DELIVERY-PLAN.md): **backlog ND01–ND19 duy nhất**. Nội dung nhật ký cũ giữ để truy vết, không áp ngược trạng thái đã bị thay thế. Kế hoạch triển khai không đồng nghĩa chủ dự án cho phép tự chạy task tiếp theo.

## Hồ sơ cần dùng lại theo phạm vi

- Nguồn: [độ phủ Tân Biên](TANBIEN-READING-COVERAGE.md), [bổ luận Mệnh–Thân](TANBIEN-MENH-THAN-SUPPLEMENT-AUDIT.md), [bàn giao NPL](../.local/npl-full-audit-20261014/ban-giao.html). Chỉ mở đoạn cần thiết cho task.
- Nội dung: [Phúc–Di](PHUC-DI-1.0.0.md), [Nô–Điền](NO-DIEN-1.31.0.md), [Phụ–Huynh](PHU-HUYNH-1.32.0.md), [Phu–Tử](PHU-TU-1.33.0.md), [Tật Ách](TAT-ACH-1.34.0.md); đối chiếu các lô mới trong backlog, không coi bản cũ là trạng thái mới.
- Quyền/dịch vụ: [G1a](G1A-GOOGLE-LOGIN-QA.md), [G2](G2-READING-SCOPE-QA.md), [G3](G3-CUSTOMER-WORKSPACE-QA.md), [G4](G4-TEST-CHECKOUT-QA.md), [G5](G5-ADMIN-OPERATIONS-QA.md), [email hợp nhất](QA-MAIN-EMAIL-MERGE.md), [đối soát](SEPAY-TEST-RECONCILIATION.md).
- Hạ tầng đang hoãn: [Ubuntu](UBUNTU-BETA-QUICKSTART.md), [backup/restore](BETA-DEPLOYMENT.md). Tài liệu có sẵn không phải phép deploy.

## Kết quả phiên tài liệu trước — giữ để truy vết

Đã đối chiếu tĩnh code/symbol/test; bốn file đại diện root và checkout QA trùng byte. **Không có Git repository ở root** nên không có commit/status thay đổi chưa commit hoặc baseline Git để đối chiếu. Dùng diff tài liệu trước/sau, không khởi tạo Git.

Không chạy test/build, migration, DB/kho, HTTP/provider hoặc restart; không xác nhận lại process/tunnel hiện thời. Các bằng chứng nghiệm thu cũ được ghi đúng là cũ. Nguồn quyết định chưa có xác nhận trực tiếp được đánh dấu trong DECISIONS; chưa có bản xuất chat độc lập/permalink cho toàn lịch sử.

Kiểm tài liệu: 185 liên kết nội bộ/anchor hợp lệ; `git diff --no-index --check` với bản tài liệu đầu phiên không có lỗi khoảng trắng. Hai mẫu khớp nguyên văn kế hoạch, bốn hash code đại diện không đổi. Đây không phải `git diff HEAD` hoặc kiểm toàn kho.

Tật Ách vẫn giữ chú giải để thẩm định, **chưa duyệt mẫu/publish, chưa hoàn thành luận cá nhân**. Trạng thái ND03 đề xuất ở phiên tài liệu đã được thay bởi yêu cầu triển khai và nghiệm thu bên dưới.

## Cập nhật sau ND03 — 20/10/2026

QA3062 đang phục vụ1.54.0/catalog1.51.0. Đọc [CURRENT_STATUS](CURRENT_STATUS.md), dòng ND03 trong [backlog duy nhất](V1-DELIVERY-PLAN.md), [bàn giao/văn trước-sau](../.local/nd03-20261020/ban-giao.md). Lượt này có kiểm thực thi192, test liên quan, build, luồng khách/mobile và một PDF; khác phiên tài liệu tĩnh phía trên. Không đổi engine/quyền/lịch sử, không publish Tật, Live tắt. Kết thúc ND03; task tiếp theo cần yêu cầu riêng.

## Git cục bộ — 21/10/2026

Xem [GIT-BASELINE](GIT-BASELINE.md) cho phạm vi baseline, kiểm secret/fixture và trạng thái commit. Ghi nhận “không có Git” phía trên là lịch sử của phiên trước. Không dùng số phiên bản ứng dụng thay cho branch/status/diff. Kho `.local`, báo cáo, sách gốc và bằng chứng loại khỏi Git vẫn giữ nguyên trên máy; liên kết tới chúng không được bảo đảm có trên máy mới.

Baseline Git đã tạo: `0c5461a1d6fe2bbba9522e99dbeebd8fab67eb98` (`main`), `chore: establish Tinh Luan baseline and handoff docs`.597 file staged khớp manifest trước commit; không thay QA hoặc dữ liệu. Cập nhật ghi nhận này nằm ở commit tài liệu riêng; xem `git log -2 --oneline` và trạng thái hiện tại trước task mới.
