# Tinh Luận — chỉ dẫn cho thread làm việc

## Khởi động

1. Đọc yêu cầu mới nhất của chủ dự án; task hiện tại quyết định phạm vi được làm.
2. Đọc [HANDOFF](docs/HANDOFF.md), [CURRENT_STATUS](docs/CURRENT_STATUS.md), rồi phần liên quan của [V1-DELIVERY-PLAN](docs/V1-DELIVERY-PLAN.md). Đây là backlog duy nhất.
3. Đọc [BUSINESS_RULES](docs/BUSINESS_RULES.md) và [DECISIONS](docs/DECISIONS.md) trước thay đổi nội dung/quyền. Đọc [ARCHITECTURE](docs/ARCHITECTURE.md) và [TESTING](docs/TESTING.md) theo phần chịu ảnh hưởng.
4. Xác minh cwd, file/symbol thực tế và checkout phục vụ; không lấy phiên bản hoặc bàn giao làm bằng chứng code hiện hành. Nếu có Git, ghi HEAD/status/diff; nếu không có, nói rõ và lưu diff tài liệu/file trong phạm vi task.
5. Nêu lô hữu hạn, file dự kiến tác động và điểm dừng. Giữ thay đổi hợp lệ của thread khác; không tự mở task/thread hoặc gửi việc cho thread khác.

## Tra nguồn bền vững

- Đọc [SOURCE-LIBRARY](docs/SOURCE-LIBRARY.md); tra kho chữ, hồ sơ kiến thức và audit đã có trước. Chỉ mở PDF đúng đoạn khi thiếu ngữ cảnh, nghi OCR hoặc cần kiểm ảnh/bảng/ký hiệu.
- Sách/toàn văn/ảnh giữ trong `.local/source-library`, ngoài Git/phần công khai; không thay ignore. Phân biệt đã trích, đã đọc, đã kiểm ảnh, đã đặc tả; tái dùng nhật ký có chứng cứ, không đọc lại chỉ để tạo nhật ký.
- Chủ dự án và Codex thực hiện, không có người thẩm định bên ngoài. Codex khảo cứu và đề xuất cách hiểu có lập luận, giữ riêng từng tác giả và điều chưa biết; không yêu cầu chủ dự án đoán toán tử/chọn câu nguồn thắng. Đề xuất không tự trở thành quyết định hoặc quyền publish.
- Task khảo cứu toàn sách21/10 thay hạn chế đọc hẹp trước đó trong phạm vi nghiên cứu; theo từng chương, lưu checkpoint và điểm tiếp tục chính xác. Triển khai vẫn chỉ theo backlog V1 và task được giao.

## Ràng buộc

- Dùng lại engine, evaluator, renderer, quyền, queue và kho hiện có. Không dựng pipeline riêng cho mẫu nghiệm thu.
- Không chọn lời theo tên, ID hay ngày sinh mẫu. Fixture kỹ thuật không phải lá số engine thật; 192 mẫu không đại diện mọi cấu trúc có thể sinh.
- Bản lưu và quyền/hạn lịch sử bất biến. Sửa nội dung tạo phiên bản/bản mới, không backfill hoặc cập nhật lịch sử âm thầm.
- Quyền kiểm tại máy chủ; không gửi lời khóa xuống rồi che. ID/email/tên không chứng minh sở hữu; Google không tự cấp admin.
- Nguồn phải rõ điều kiện, lượng từ, vị trí và ngoại lệ. Không bỏ điều kiện hoặc suy AND/OR để tăng độ phủ; không tự tổng hợp hay chọn bên thắng.
- Tật Ách: chỉ được tiếp tục thẩm định hướng chú giải truyền thống theo cấu trúc. Hai mẫu chưa duyệt, chưa publish, chưa tính là luận cá nhân hoàn chỉnh.
- Beta, Live tắt; không tự mở bán, gửi email ngoài địa chỉ thử, Zalo/G6 hoặc deploy máy chủ. Quyết định mới cần ghi đúng bằng chứng, không biến đề xuất thành phê duyệt.
- Không in secret, cookie, token hoặc toàn bộ `.env`. Không đưa chúng vào Git/log/tài liệu.
- Không chạy migration, restore, purge, worker hoặc restart chỉ để xác minh tài liệu. Khi task cần migration phải backup và có kế hoạch quay lại; không ghi đè QA chính bằng dữ liệu thử.
- Không chạy worker chồng; xác minh database/kho/checkout đích trước thao tác có ghi. QA3070 giữ đối chiếu trừ yêu cầu khác.

## Kiểm và kết thúc

- Chọn kiểm theo phần thay đổi trong TESTING; test có DB phải chạy môi trường riêng. Task tài liệu chỉ kiểm liên kết/diff, không test/build ứng dụng.
- Không sửa expected nguồn/lịch sử cho xanh; ghi lỗi đầu tiên và từng lượt chạy lại. Không gọi mock là dịch vụ thật, test kỹ thuật là phê duyệt chuyên môn.
- Ghi đầu ra, file đổi, phiên bản/code identity, bằng chứng, phạm vi chưa kiểm và điểm còn chặn. Không hứa ngày đủ 12 cung khi điều kiện chuyên môn còn mở.
- Cập nhật đúng dòng backlog và trạng thái ngắn; DECISIONS ghi quyết định mới/thay thế. HANDOFF chỉ là đầu mối, không nhân đôi kế hoạch.
- Dừng đúng task. Đề xuất việc tiếp theo không phải quyền tự triển khai.

## Git và phối hợp nhiều thread

- Bắt đầu bằng `git branch --show-current`, `git status --short`, `git log -1 --oneline`, `git diff` và `git diff --cached`; nếu chưa có commit, ghi rõ baseline còn chờ. Đọc [quản lý Git cục bộ](docs/GIT-BASELINE.md).
- Không ghi đè, reset, clean hoặc stash thay đổi đang dở của thread khác. Cùng một working directory dùng chung branch/index; không đổi branch khi thread khác đang sửa. Thỏa thuận phạm vi file trước khi làm đồng thời.
- Mỗi task có phạm vi riêng và commit rõ; stage theo file/hunk đã kiểm, đọc staged diff và rà secret trước commit. Không `git add .` hoặc `git add -A` mù quáng. Không tự đặt danh tính tác giả.
- Chỉ tích hợp một thay đổi vào QA chính tại một thời điểm; xác minh commit, checkout, DB/kho và worker đích. Commit không tự cho phép restart, migrate hoặc phát hành.
- Không force-add dữ liệu bị ignore để test xanh; tài liệu/bằng chứng cục bộ cần được bàn giao riêng qua đường được phép. Không tạo remote/push khi chưa được yêu cầu.
