# Gói 3.6 — hoàn tất kiểm UI bằng một recovery fixture QA3116

31/10/2026. Baseline **main@cabd152**; tracked/index sạch, Bửu Đình chưa theo dõi và không sửa. Chủ dự án cấp quyền riêng cho đúng một fixture trên report **38d15aef-df9f-4903-a397-ff58ad0bb043**, QA3116/DB clone55446. Không sửa ứng dụng, endpoint auth, UI hoặc cấu hình runtime; không gọi OpenAI, consumer, supervisor hoặc provider mock.

## Danh tính và cơ chế

Đối chiếu `current_database`, `inet_server_port`, `data_directory` với private config: **tinhluan_ai_paid36_qa_1793419312105**,127.0.0.1:55446, data dir riêng `.local/ai-paid36-20261031/pgdata`. Web3116 PID35827, build **yVlddR10fDAS90V0pX_Et**. Kiểm `customerSession` và `accountReading` bằng phiên QA hiện hữu; user ID/link owner phải khớp order binding của đúng report. Danh tính có subject kỹ thuật `qa-paid31-synthetic-…`, không phải khách hàng thật hoặc đăng nhập Google thật. Không chỉ dựa vào tên/ID/email để cấp phiên.

Sau khi kiểm ownership, tạo **một recovery binding fixture** gắn owner/order hiện hữu; thời hạn tối đa1giờ và không vượt hạn owner. Không tạo customer account/session, purchase grant, entitlement hoặc order. Đây là seed fixture được cho phép, không tuyên bố đã kiểm thao tác người dùng gắn email từ trial token (trial token gốc không còn).

Dùng `bindingReading` kiểm paid/ready/grant/frozen hash, `deliverRecoveryEmail` hiện có để sinh token ngẫu nhiên/hash có hạn, gửi **chỉ local mail provider tới .test**. Không chạy email worker chính/SMTP. Browser mở `/recover?reading=1`, bấm **Tiếp tục**: endpoint exchange hiện có tiêu thụ token một lần, xác minh binding/grant rồi Set-Cookie HttpOnly qua response server. Không chèn cookie/session qua công cụ browser hoặc thêm auth endpoint. Link raw không đưa vào log/bàn giao/Git; fragment được giao diện xóa khỏi URL.

Browser còn có phiên tài khoản QA tổng hợp sẵn có, vì vậy thư viện `/la-so-cua-toi` mở bằng phiên tài khoản ấy. Không gán việc này cho recovery đăng nhập Google/tạo customer session. Recovery được kiểm độc lập ở mức exchange: đúng binding chuyển verified, đúng một reading-magic bị tiêu thụ và đúng một reading-session được cấp. Không giả định đã kiểm browser chỉ còn recovery cookie.

## UI thực tế

- Đúng report/order: progress **9/11**, nhãn **QA · Mô phỏng AI, không gọi API thật**, xác nhận thanh toán thành công; quá ETA vẫn có thông báo tiếp tục xử lý và thông báo một số cung cần đối soát, không báo cả báo cáo thất bại.
- Mở **chín cung completed**, mỗi cung **tám phần**:72article khớp nguyên văn title/content từ kết quả API đã lưu. Đây là kiểm renderer/lưu-mở, không phải đánh giá chất lượng Astra.
- Điền Trạch mất response ID và Phu Thê404 đều hiện **“Cần kiểm tra”**, không article completed, không nút retry. Hai job không sửa field/attempt/result.
- Mệnh hiển thị ngay **7đoạn V1/Luna**, hai đoạn có thông tin biên tập, không chờ AI. Text trước/sau refresh giống nhau; bản frozen/report/order hash không đổi.
- Refresh:9/11 và Mệnh nguyên; rời trang bằng **Thư viện lá số**, chọn đúng report từ thư viện rồi mở12cung:9/11 và Mệnh nguyên. Quan Lộc vẫn đọc được tám phần sau mở lại.
- Mobile **360×900** và **390×900**: scrollWidth bằng viewport, không tràn ngang. Đã kiểm ảnh màn chờ/chín trên11 và bài Quan Lộc; viewport override được reset, tab QA đóng sau kiểm. Không cần sửa UI.

Ảnh local không chứa token/cookie, chỉ dữ liệu QA tổng hợp:

- [Màn chờ360px](../.local/ai-paid36-20261031/ui-paid-recovery-360.jpg).
- [Màn chờ390px](../.local/ai-paid36-20261031/ui-paid-recovery-390.jpg).
- [Quan Lộc completed390px](../.local/ai-paid36-20261031/ui-paid-completed-390.jpg).

## Kiểm quyền tại server và dữ liệu trước/sau

GET API không có phiên **404**; recovery token sai **404** và không trả văn trả phí; customer session QA sở hữu hiện hữu **200**, eligible=true/completed9/total11. Gửi lại token magic đã tiêu thụ qua exchange **403**, không cấp thêm fixture/session. Clone không có report thuộc account khác để kiểm cross-owner trực tiếp trong vòng này; không tạo thêm account/fixture nhằm lấp ca thiếu. Không coi việc UI hiện mở khóa là bằng chứng duy nhất về quyền.

Trước/sau: **11job→11job,12attempt→12attempt,9completed→9completed,2uncertain→2uncertain**. Hash toàn bộ job/attempt của report giữ nguyên; orders, order_reading_bindings, payment_transactions, customer_checkouts, customer_reading_links, reports và customer-order grants giữ nguyên. Provider event ledger không đổi. **0CREATE/0GET OpenAI thật;0request provider mock mới;0phí API**.44job ngoài report/18queued trong clone và185file main giữ hash. QA cũ/PG55439 vẫn offline từ đầu; không tự khởi động/kiểm SQL DB gốc offline. Không QA3062/3070/3113/worker thanh toán/Live/Gói3.7.

## Thu hồi và bằng chứng

Sau kiểm, đặt revoked_at đúng binding fixture và tất cả token thuộc binding đó; **0token fixture còn hoạt động**. Không xóa report hoặc thu hồi grant đã mua. Local mail/link raw được thay bằng marker revoked, không lưu raw credential vào evidence. Một fixture đã tạo và thu hồi; không tạo fixture thứ hai. Phiên account QA tồn tại trước không bị thu hồi/thay đổi; vì vậy revoke fixture không đồng nghĩa thu hồi quyền account hoặc buộc browser mất quyền báo cáo.

Evidence private `.local/ai-paid36-20261031`: `recovery-before.json`, `recovery-fixture-created.json`, `recovery-ui-completed.json`, `recovery-ui-held.json`, `recovery-ui-library.txt`, `recovery-ui-receipt.json`, `recovery-final-receipt.json`, ảnh và AX từng cung. Receipt không chứa token/session/key. Không commit private evidence hoặc script có cấu hình QA. Lỗi selector kiểm thử đầu dùng tên in hoa/space theo AX, DOM dùng Title Case nối địa chi; sửa selector theo DOM, không sửa UI.

Không chạy lại test/build/E2E/PDF vì chỉ kiểm runtime và sửa tài liệu; kế thừa28/28test/typecheck/build tại cabd152, không gọi đó là lượt chạy mới. Đã kiểm diff/liên kết/secret của tài liệu mới.

**Phần chặn UI phiên hợp lệ của Gói3.6 đã được kiểm trong phạm vi trên.** Hai job QA cần operator vẫn giữ để truy vết. Trước QA3062 còn các giới hạn cũ: provider thật với supervisor mới chưa kiểm, chất lượng Tài/Phu prompt mới và nguồn/chế hóa chưa nghiệm thu, ETA5phút chưa đo, cần phê duyệt triển khai/scope/ngân sách riêng. Không tự triển khai tiếp.
