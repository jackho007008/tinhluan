# NPL — chú giải riêng vị trí Thân, 1.39.0

Baseline template/catalog1.38.0; giữ engine0.3, lịch và snapshot. Gói hữu hạn này bổ sung hai chú giải cục bộ theo vị trí Thân, **không phải phép tổng hợp hai chính tinh hoặc chọn nhận định thắng**.

## Đối chiếu nguồn và lựa chọn

Tử Vi Tổng Hợp — Nguyễn Phát Lộc, bản442 trang, SHA25682f242d44a1173c7c9963b88adde529f57c20bbbb3b6267159e86f3204378a37. Dùng danh tính/ảnh đã kiểm tra trong hồ sơ trước; đối chiếu lại ảnh192 và241. PDF và số trang in trùng tại các trang sử dụng.

Đọc phương pháp107–112 (mạch liên tục); tái sử dụng191–192,223–225,241–242 và ảnh224/241 từ đợt trước. Không tuyên bố đọc toàn sách. Phần107–112 đưa ra nhiều phương pháp khác; không nhập toàn bộ trong gói này.

1. **Thân cư Tài — A độc lập**:192 mô tả liên hệ nghề kinh tế/tài chính;224§3 nhắc lại, có câu thêm nhiều sao tại Tài để củng cố.241§4 mô tả nỗ lực tạo dựng của cải, xu hướng kiếm tiền; câu sau mới thêm điều kiện Tài tốt để nói đại phú. Tách mệnh đề vị trí được vì chủ thể và kết luận không phụ thuộc Tài tốt. Không áp phần đại phú. Nhận định nguồn chỉ được đưa thành chú giải riêng; không xác định nghề cụ thể hoặc hoàn cảnh thực tế. Việc thiếu công thức tìm cách trội yếu trong223 chặn xác định nghề toàn lá số, không chặn trích đúng liên hệ vị trí này. Đây là thay đổi lựa chọn triển khai theo chỉ dẫn mới của chủ dự án, không phải sửa chữ sách.
2. **Thân cư Quan — A độc lập**:191§3 nối192 mô tả sự gắn bó với nghiệp quan xuyên suốt. Giữ khía cạnh đường công danh, không diễn thành chức vụ cao, thành công, thu nhập hoặc chỉ sống vì công việc. Không phát hành dự báo tuổi thọ/thời điểm chết; cách nói suốt đời chỉ được diễn đạt thành mô tả định hướng của nguồn, không xác nhận cá nhân.
3. **Mệnh hai chính tinh và hành Bản Mệnh — ứng viên riêng, chưa chọn**:109 ưu tiên xét hệ cấp chính tinh–Bản Mệnh, phân biệt phía được sinh/bị khắc; không cho quyền xóa chú giải sao. Cần đối chiếu trọn bảng hành của NPL và quan hệ với phương pháp hành hiện có trước khi có phép phối hợp. Không dùng bảng Tân Biên làm bảng NPL. Gói này không triển khai.
4. **Chính/phụ tinh sinh khắc — chưa đủ gói thực thi**:109–110 có điều chỉnh, nhưng các ví dụ và mức giải phụ thuộc trạng thái, phạm vi và Phúc/Mệnh/Thân/Hạn; không chuyển thành mọi phụ tinh khắc là cứu giải. Ví dụ hình tụng không đưa vào sản phẩm đợt này.
5. **Cục–Thân — không triển khai**:111–112 ghi quan điểm lạ và khuyến cáo thử chứng nghiệm; không coi là phương pháp đã xác minh. Cách đủ bộ ở110–111 còn trạng thái/ngoại lệ và không đồng nghĩa phép gộp lời sao.

Hai nhánh mới không giải công thức TB54–55. Không có xung đột trực tiếp đã chứng minh với Thiên Lương181: Thiên Lương nói quan hệ biểu tượng cùng tam hợp, NPL nói phương diện vị trí; giữ hai khía cạnh, không cộng bằng chứng. Không thay bất kỳ claim cũ.

## Hợp đồng thực thi

- Dùng fact.life-body-position hiện hành: duy nhất Mệnh và Thân, đủ12cung, tên/địa chi nhất quán, cờ Thân boolean, chứng nhận chính tinh và danh sách đầy đủ. Các kiểm tra này là cổng kỹ thuật, không gán thành điều kiện sách.
- Hai điều kiện loại trừ nhau: vị tríTài Bạch hoặcQuan Lộc. Không dùng tuổi, giới tính, sao hoặc trạng thái; không mượn bảng nguồn khác. Các vị trí khác không fallback.
- Chưa rõ/không nhất quán→missing-facts; danh sách/cờ thiếu không thành false. Rule dùng facts cũ không sửa facts.
- Ngoại lệ: không có ngoại lệ vị trí cụ thể trong đoạn đã chọn. Không khẳng định toàn sách không có ngoại lệ; giữ lời sao, Tuần/Triệt và các giới hạn cung riêng. Không chạy “Tài tốt”, “nhiều sao”, “cách trội”, hệ số hoặc tuổi30.
- ID npl.life-body-wealth / npl.life-body-career; phương pháp npl-body-position-1.0.0; rule0.1.0; draft/review=null; nguồn NPL riêng. Quan hệ bổ sung, không điều chỉnh/thay thế.
- Lưu claim, rule, nguồn, facts và trace bằng freezeReading/saveReading cũ. Mở lại lấy frozen, không tính catalog mới.

## Lỗi căn cứ

factEvidence trong tanbien-presentation.ts thiếu nhánh đọc lifeBodyFacts, nên cả ứng dụng và HTML cùng hiện thiếu ánh xạ mặc dù facts đã có. Bổ sung ánh xạ đọc đúng text/evidencePaths; thiếu thực sự có câu dữ liệu thiếu riêng. Không sửa giá trị facts. PRESENTATION_VERSION1.13.0, template1.39.0. Bản lưu cũ giữ nguyên để truy vết; bản mới sửa căn cứ.

## Kết quả thực chạy

- 192v2:0claim thêm/bớt, trace cũ giữ nguyên;64Phúc/64Phu Thê/64Di. Sửa căn cứ hiển thị là thay đổi trình bày, không tăng độ phủ nội dung.
- Bộ10engine ngoài192:1Tài+1Quan thêm mỗi mẫu1claim;8đối chứng không thêm. Hai nhánh đều có mẫu engine hợp lệ hiện có; không quét sinh hoặc tạo mẫu giả.
- 35test có trọng tâm đạt; typecheck đầu/cuối đạt. Toàn bộ lần đầu2821đạt/7lỗi;6kỳ vọng hiện hành được cập nhật đúng đặc tả (nguồnID NPL/count2/version),1ENGINE_TIMEOUT tháng nhuận không tái hiện và chưa xác định nguyên nhân. Không tăng timeout. Gate cuối78files2828đạt,0bỏ qua.
- Hồi quy script đầu lỗi helper norm(undefined) cho financeAssets vắng; sửa helperQA rồi đối chiếu192+10đạt. Không sửa sản phẩm vì lỗi này.
- Build production cache riêng đạt;3036đang chạy. Chrome22lượt360/390,API tạo/lưu/mở lại,3lịch sử,quyền vô danh/Origin sai đạt.3E2E liên quan engine thật,worker1,retries0 đạt. Không chạy toàn bộE2E.
- HTML20lượt khớp nguyên văn component,căn cứ mở,không tài nguyên ngoài,không tràn360/390. Script xuấtHTML đầu gặp lỗi đọc mãUTF8 của Python; thêm khai báoUTF8, xuất lại đạt. Đây là lỗi công cụ xuất, không phải dữ liệu nguồn/snapshot.
- Các claim cũ, phần financeAssets và11cung ngoài Mệnh giữ nguyên trên bộ đối chiếu. Hash lịch sử/engine/lịch không đổi. Bản mới cóparentId; source/rule/facts/trace được đóng băng.
- Bàn giao `.local/npl-body-20261013/ban-giao.html`; links dùng127.0.0.1:3036 đúng môi trường đã kiểm tra.
