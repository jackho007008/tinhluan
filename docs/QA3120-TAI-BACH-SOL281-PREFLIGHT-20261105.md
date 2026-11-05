# QA3120 — chuẩn bị một lượt Tài Bạch, chưa gửi CREATE

Đã kiểm trên web QA3120, build `Wr1jSlACQfJZCRNjcxnS5` (PID 60123), DB clone ở 55462 (PID 58461), đối chiếu identity DB. Mã ứng dụng `63bb815`. Web vẫn không có key; không khởi chạy consumer/supervisor.

**Phiên và quyền.** Tạo một lá số tổng hợp mới [QA Tài Bạch 1.20](http://paid120.localhost:3120/ban-doc?id=aaba0eb6-9924-45e2-b3b8-5131b6dff91a&mode=basic#cung-8) bằng form thường; tải lại và mở tab 12 cung bằng cùng phiên. Đọc được Mệnh miễn phí, Tài ở Thân có Liêm Trinh (Vượng); accordion báo “Luận AI · Chưa có quyền”. Đi từ accordion tới đúng checkout cho báo cáo này: checkout yêu cầu đăng nhập Google, thư viện cho biết Google Login trên QA đang chờ cấu hình. GET báo cáo không có phiên trả 404. Không lấy cookie từ browser, không dùng danh tính Google giả hoặc áp quyền của môi trường khác. [Ảnh cung Tài](../.local/qa3120-tai-sol281-preflight-20261105/tai-owner-locked.jpg) · [Ảnh checkout](../.local/qa3120-tai-sol281-preflight-20261105/checkout-owner.jpg).

**Đối chiếu máy chủ.** SELECT chỉ đọc trên đúng clone: báo cáo mới có **0 checkout, 0 grant paid/ready còn hiệu lực theo điều kiện server, 0 job**. Tổng 38 completed, 28 queued, 39 attempt không đổi. Có một job Tài queued với phiên bản cũ 1.1; không dùng lại hoặc nâng version. Không sửa quyền, đơn, kết quả lịch sử hay cấu hình đăng nhập. [Số đếm](../.local/qa3120-tai-sol281-preflight-20261105/access-check.json).

**Đầu vào và dự toán.** Dùng factory của checkout QA và chính bản lưu mới; toàn bộ input khớp mẫu 1.20 đã kiểm, 159 facts và 19 mục tri thức. Bản đối chiếu Tài qua validator 2.8.1. Đã lưu [body dự kiến](../.local/qa3120-tai-sol281-preflight-20261105/request-preview.json) và [kết quả preflight offline](../.local/qa3120-tai-sol281-preflight-20261105/preparation.json). Model `gpt-6.1-sol`, `paid-retrieval-1.20.0`, `paid-palaces-vietnamese-2.8.1`, schema V2, Background, cache 30 phút, tối đa 12.000 output token gồm reasoning. Dự toán **35.276 input token** theo tỷ lệ kích thước JSON so với lần đếm 33.440 token ở vòng Tài trước, chưa phải số đếm provider trên body mới. Theo [giá Sol Standard](https://developers.openai.com/api/docs/models/gpt-6.1-sol), nếu toàn bộ input tính cache-write $2,50/triệu và dùng hết output $10/triệu: **$0,20819**. Dự phòng đề xuất **$0,30** cho 1 CREATE; không phải hard cap hóa đơn. Không kiểm model access/credit trực tuyến.

**Điểm tiếp tục.** Cần đường đăng nhập hợp lệ cho tài khoản QA được phép checkout, liên kết đúng báo cáo qua cơ chế chứng minh chủ sở hữu và hoàn tất giao dịch test. Bản khôi phục quyền đọc đơn thuần không thay đăng nhập checkout hoặc cấp quyền trả phí. Nếu sử dụng fixture thay thế, phải nói rõ đó là QA synthetic và xác minh quyền trình duyệt trên đúng fixture, không gọi đó là nghiệm thu báo cáo này. Chỉ sau khi xác minh grant mới dùng job mới đúng cung/phiên bản; tối đa một CREATE, không retry và không chạm queue cũ. **0 request OpenAI, $0 thực chi; không thay QA3062/3070.** Chỉ chạy mock tham chiếu của cung Tài, không build/E2E vì không đổi mã ứng dụng.

## Bổ sung ngày 05/11 — Google Login qua HTTPS riêng

Tunnel `tinhluan-qa3120` chuyển HTTPS tới `127.0.0.1:3120`, tắt inspection. Web QA3120 chạy cùng checkout/build và DB 55462, PID 20202 thay 60123. Cấu hình và launcher nằm riêng trong thư mục QA private. Web chỉ được kết nối local và hai host Google phục vụ đổi code/kiểm chữ ký. SePay ở test mode, webhook dùng secret riêng trên clone. Hai tunnel 3062/3070 vẫn trỏ đúng đích khi đối chiếu.

Trường **Authorized redirect URIs** của Google OAuth Web client cần thêm đúng `https://4025-171-247-105-128.ngrok-free.app/api/account/google/callback`. Đã kiểm qua tunnel: [thư viện QA3120](https://4025-171-247-105-128.ngrok-free.app/la-so-cua-toi) trả 200, form OAuth POST trả 303 đến Google với đúng redirect_uri. Lần tạo tunnel đầu bị ngrok từ chối do trường bind_tls, đổi sang schemes HTTPS và xác nhận tạo thành công. Phần đăng nhập/callback với tài khoản của chủ dự án còn chờ.

Clone có 0 danh tính Google khớp danh sách QA đã duyệt và 0 liên kết tài khoản còn hạn cho báo cáo aaba0eb6-9924-45e2-b3b8-5131b6dff91a ở thời điểm kiểm trước đăng nhập. Cookie trial của localhost thuộc hostname cũ. Sau khi người dùng đăng nhập, phải đối chiếu tài khoản QA được phép và quyền sở hữu báo cáo qua luồng chuẩn trước checkout. Chỉ chạy một CREATE Tài Bạch khi đã có thanh toán test được máy chủ xác nhận, grant và job đúng phiên bản. 0 CREATE trong bước mở tunnel.

## Quyền checkout và khôi phục từ phiên chủ

Đã đối chiếu đúng một tài khoản Google đăng nhập trên clone từ khi mở HTTPS. Web QA3120 nạp ID bổ sung từ file private của riêng môi trường này. Chỉ web 3120 được nạp lại (PID 36748), thư viện trả HTTP 200. Kiểm bằng điều kiện checkout của ứng dụng cho thấy phiên còn hạn và tài khoản được phép checkout.

Trình duyệt localhost của chủ mở lại đúng bản QA Tài Bạch 1.20 (ID ở trên), có Liêm Trinh tại Thân. Đã gửi yêu cầu bằng biểu mẫu khôi phục của bản đó. Email đã xác minh của Google trùng người nhận QA được cấu hình. Lượt xử lý đầu dừng trước SMTP do thiếu lựa chọn provider, transaction rollback. Lượt có provider Gmail xử lý duy nhất email cho binding của đúng phiên chủ và báo cáo. SMTP đã chấp nhận, DB đã ghi sent. Người dùng mở liên kết dùng một lần trên hostname ngrok, bấm Tiếp tục và liên kết bản đọc trong thư viện của phiên Google. Lúc gửi thư, resolver còn chờ bước xác minh và liên kết này, 0 đơn, 0 job cho báo cáo, 0 CREATE.

## Kết quả lượt thật

Đơn test đã paid/ready qua đối soát SePay Sandbox, 1 giao dịch được áp và 1 grant còn hạn. Chưa xác minh đường webhook. Đúng báo cáo đã tạo 11 job. Một CREATE Tài Bạch, một attempt, ba GET đối soát cùng receipt, 0 retry. Mười job khác đều queued với 0 attempt. Giữ nguyên quyền mua.

Sol nhận đúng request đã kiểm (retrieval 1.20.0, prompt 2.8.1). Provider completed sau 105 giây, quan sát đến khi QA ghi nhận kết quả khoảng 217 giây. Usage 35.112 input (3 thường, 35.109 ghi cache 30 phút), 5.261 output gồm 3.624 reasoning. Parser ước tính 0,1403885 USD, dự phòng 0,30 USD.

Bài gồm ba phần, sáu đoạn. QA lưu lỗi AI_INVALID_OUTPUT, bộ đọc giao 0/11. Chạy lại validator offline trên nguyên văn tái hiện AI_PREMISE_SOURCE_MISSING và định vị hai đoạn tổng hợp. Đoạn Đại Hao nhắc Tiểu Hao trong tên nhóm nhưng chưa dẫn fact cho sao đó. Đoạn nghề nghiệp dẫn fact Thiên Tướng ngoài các sao được đánh dấu trong nguồn tam hợp và nguồn V1 đính kèm chưa mang liên kết fact đó. Chưa xác định đây là hai sai nghĩa chuyên môn. Không sửa hoặc duyệt thay nội dung. [Toàn văn để duyệt](../.local/qa3120-sol281-run/bai-tai-bach.html) · [Usage và số đếm sau lượt chạy](../.local/qa3120-sol281-run/audit.json).

## Kiểm lại tham chiếu và giao bài

Tiểu Hao xuất hiện trong tên nhóm của mục Tân Biên tr.41 §3.27. Đoạn luận trạng thái Đại Hao tại Tài, không đặt Tiểu Hao đồng cung. R05 (§8.1/8.11, tr.158/162) được chọn ở nhóm C theo điều kiện Tử Vi và Thiên Tướng cùng ở Quan Lộc. Hai chính tinh đều có trong facts Quan Lộc tại Thìn. Đoạn tổng hợp dùng nguồn này cho mặt tổ chức và giới hạn quyền hạn; khuynh hướng nghề tài chính đến từ nguồn tam hợp riêng. Bộ kiểm tra phân biệt tên nhóm, tên chính tinh Tử Vi và động từ “để suy ra” với các sao/vòng được luận thật. Kiểm riêng các trường hợp nhắc sao độc lập, sai cung và thiếu nguồn.

Dùng đúng response completed lưu tại QA3120, trùng bản lưu của lần GET thứ ba, khớp job/attempt/receipt và input gốc. Validator ban đầu từ chối hai đoạn; sau khi sửa hai liên kết, còn lỗi nhận “Tử”, “Suy” trong đoạn nghề nghiệp. Kiểm lại sau khi phân biệt từ cho kết quả đạt cả bài. Worker dùng nhánh revalidate trên chính attempt đó với nguồn đọc đĩa; mạng ra ngoài bị chặn. Bộ đếm kiểm Background ghi thêm một lượt kiểm nội bộ. Số GET/CREATE thực tế giữ ở 3/1 của lần gọi ban đầu. Không có phí mới.

Đã so sánh toàn bộ content trong DB và qua bộ đọc trả phí với JSON model trả về, bao gồm từng đoạn và các ID tham chiếu. Tài completed, coverage focused, bộ đọc 1/11. Mười hàng job khác khớp nguyên trước/sau, queued và 0 attempt. Chi phí ước tính cũ 0,1403885 USD. [Bài đã giao](../.local/qa3120-sol281-run/bai-tai-bach-da-giao.html) · [Kết quả kiểm](../.local/qa3120-sol281-run/review-completed.json).

55 test ở ba file đạt; kiểm lại riêng 19 ca guard sau tinh chỉnh ranh giới tên sao đều đạt. Typecheck checkout build ban đầu thiếu hai fixture được Git bỏ qua; chép đúng bản cục bộ vào checkout cách ly rồi typecheck và build đạt.
