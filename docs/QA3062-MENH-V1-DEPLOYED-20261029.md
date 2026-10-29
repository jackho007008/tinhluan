# QA3062 — Gói 2.5 đã cập nhật riêng web, 29/10/2026

Chủ dự án cấp quyền thực thi riêng theo kế hoạch/c576d6a, chấp nhận kho/backup cùng volume DATA. Git trước thao tác `main@c576d6a`, tracked/index sạch, Bửu Đình giữ nguyên. Không thay mã ứng dụng/build trong lần deploy; commit bàn giao tiếp theo chỉ cập nhật tài liệu.

- Code ứng dụng a104748 → f18acee; commit chuẩn bị c576d6a.
- Build `UlHf9zr5Clv8NtCpv64jF` → **`vQVwORxbMpjju4MCaF34c`**.
- Web **94756/Node20.20.2 → 32792/Node24.22.1**, cổng127.0.0.1:3062.
- Checkout mới `.local/ai-menh-package25-20261029/qa`,660file theo manifest; executable Node24 hash khớp kế hoạch. Checkout cũ giữ nguyên.
- AI_MENH_ENABLED=false; không truyền OPENAI_API_KEY, không workerAI,0API CREATE, không migration/Live/Gói3/11cung. Không rollback.

Đã xác minh lại PID/cwd/start/cổng,339file code cũ,660file checkout mới, Node hash/buildID,28thiết lập worker/launch cùng database socket thực; Next chỉ hiển thị process title nên không tuyên bố đọc trực tiếp env web. Chỉ SIGTERM đúng web94756 rồi spawn một web mới. Worker thanh toán62860,QA3070 web/worker94421/94426,QA3101 89190,QA3111 4641 giữ danh tính/thời điểm khởi động. Không dùng restart chung.

Kho release và backup89artifact được verify trước stop và sau smoke, hash không đổi. Backup đầu phiên có282file và DBdump; backup cuối ngay trước stop có184file và DBdump được pg_restore--list đọc hợp lệ. Không restore DB hoặc kho. [Preflight](../.local/qa3062-menh-deploy-20261029/preflight.json), [backup cuối](../.local/qa3062-menh-deploy-20261029/main-backup.json), [receipt deploy](../.local/qa3062-menh-deploy-20261029/deployed.json), [hậu kiểm](../.local/qa3062-menh-deploy-20261029/post.json).

## Smoke trên đúng QA3062

Mẫu QA tổng hợp tạo qua form trên web cũ trước stop: `a1e6fbbd…`; sau deploy mở lại đúng7đoạn V1 gốc/0Luna, không backfill freeMenh. Mẫu mới trên web mới `111f61f9…`:7đoạn/2Luna approved1.0/5V1gốc, không sử dụng candidate1.1 draft. Mệnh Tý/Vũ–Phủ đúngsnapshot, đủ4tab,11cung not-entitled; căn cứ nguồn/điều kiện/giới hạn đóng–mở được. Refresh và rời trang→danh sách→mở lại mẫu mới vẫn7/2; danh sách hiển thị cả hai bản. Không gọi OpenAI; web không cókey và main không cóschemaAI. Cache89artifact không tăng/đổi.

Tổng quan đã quan sát đúng; không chạy lại fullE2E/PDF/OAuth hoặc test/build đã đạt ở bước chuẩn bị. Không coi smoke hai mẫu là nghiệm thu toàn bộ nội dung Mệnh. [Smoke](../.local/qa3062-menh-deploy-20261029/smoke.json), [ảnh trình duyệt](../.local/qa3062-menh-deploy-20261029/smoke.png). Mẫu trước/sau là dữ liệu kiểm thử có chủ động tạo, không lấy báo cáo QA3111 làm bằng chứng main.

Hậu kiểm:184file có ngay trước stop giữ nguyên hash,22file QA3111 giữ hash,8bảng quyền/đơn/webhook/Toàn thư giữ toàn bộ rowhash;34bài vẫn công khai, main không bảngAI. Các tiến trình được bảo vệ nguyên. Không có lỗi readiness/runtime trong smoke hoặc lý do rollback.

## Ngoại lệ dữ liệu cần ghi rõ

So đầu phiên282file với preflight cuối184file: **100file biến mất trước khi dừng web cũ**, gồm49file phiên dùng thử và51report. Đồng thời có2file mới do mẫu QA trướcdeploy. Toàn bộ49phiên liên quan đều expiresAt đã qua, và51report thuộc các owner đó; quan sát phù hợp cơ chế TTL có sẵn. Chưa xác định riêng tiến trình nào đã thực hiện xóa; không gọi đây là chứng cứ tất cả lịch sử282file vẫn nguyên hoặc quy lỗi cho build mới.

Tất cả100file có trong backup đầu phiên `.local/backups/qa3062-menh-deploy-20261029/main-before-deploy/trial`; chưa tựrestore hoặc gia hạn vì có thể thay quyền/retention cũ, ngoài phạm vi deploy. Không chạy lệnh purge trong task này. [Đối chiếu expiry](../.local/qa3062-menh-deploy-20261029/expiry-observation.json). Cần chủ dự án xem đây là hành vi TTL mong muốn hay cần một task riêng; không sửa cơ chế trong lần deploy này.

Kho/backup cùngDATA là giới hạn đã được chủ dự án chấp nhận choQA. V1 còn nội dung một phần/nguồn draft; prompt1.1 candidate giữdraft như trước. Không phát sinh phí API, không cập nhật production hoặc dịch vụ khác.
