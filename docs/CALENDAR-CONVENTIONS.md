# Quy ước lịch và an sao

Profile thử nghiệm `vn-utc7-midnight-v1`, engine `vn-adapter-1.0.0`, calendar `vn-astronomical-1.0.0`, bridge `iztro-vn-bridge-1.0.0`. Đây là một quy ước công khai để tái lập, **không tự nhận là chuẩn cho mọi trường phái Tử vi Việt Nam**.

## Phạm vi

- Đầu vào UI/API: ngày dương Gregorian **01/01/1976–31/12/2050**, giờ/phút dân sự UTC+7 cố định, nam/nữ theo yêu cầu thư viện. Ngày ngoài phạm vi, múi giờ khác, ngày sai, thiếu giờ bị từ chối. Nơi sinh là thông tin khai báo, không tự suy kinh độ hay múi giờ.
- Không phục dựng thay đổi múi giờ lịch sử, DST hoặc giờ mặt trời thực. Người sinh ngoài quy ước UTC+7 chưa được hỗ trợ.
- UI/API chưa nhận ngày âm trực tiếp. Hàm `lunarToSolar` nội bộ phục vụ kiểm tra nghịch đảo, xác thực tháng nhuận thật và số ngày; không âm thầm chấp nhận input âm ở API.
- Phút được lưu nguyên nhưng chi giờ có độ phân giải 2 giờ. Không tạo luận vận theo phút.
- Mốc 1976–2050 là phạm vi kỹ thuật có kiểm tra toàn bộ tính nhất quán, không có nghĩa từng ngày được một cơ quan lịch độc lập chứng nhận.

## Phương pháp lịch

Triển khai riêng quy tắc âm dương lịch, dùng **Astronomy Engine 2.1.19 (Don Cross, MIT)** tính thời điểm sóc (SearchMoonPhase), Đông chí (Seasons), các trung khí cách nhau 30° kinh độ Mặt Trời (SearchSunLongitude). Xem [API chính thức](https://github.com/cosinekitty/astronomy/tree/master/source/js) và [giấy phép lưu kèm](licenses/astronomy-engine-MIT.txt). Thời gian Date UTC theo gần đúng UT của thư viện; TT/ΔT do thư viện xử lý. Không sửa global ΔT. Đây là ephemeris xấp xỉ, không cam kết sai số tuyệt đối từ vài fixture.

Quy tắc lịch tham khảo [bài Hồ Ngọc Đức bản tiếng Anh trên mirror](https://www.xemamlich.uhm.vn/calrules_en.html): ngày dân sự chứa sóc bắt đầu tháng; tháng 11 chứa Đông chí; chu kỳ hai tháng 11 có 13 tháng thì tháng đầu tiên sau tháng 11 không chứa trung khí là nhuận, lặp số tháng trước. So sánh **ngày địa phương** của các sự kiện, không so riêng thứ tự thời điểm trong cùng ngày.

Không sao chép mã AA98/Hồ Ngọc Đức có thông báo hạn chế sử dụng phi thương mại. Chỉ dùng mô tả quy tắc để viết mã mới và ephemeris MIT. Mirror không phải bản lưu do tác giả trực tiếp xác nhận. Đã phát hiện khác biệt biên tập giữa hai bản ngôn ngữ, ghi riêng trong validation.

Ngày sự kiện = floor((UTC milliseconds + 7 giờ) / 86400000). Việc dùng UTC+7 ở đây được áp dụng vào **toàn bộ khâu dựng tháng/năm/tháng nhuận**, không đổi nhãn hoặc truyền một ngày âm sang thư viện Trung Quốc. Kết quả chuyển lịch cung cấp trực tiếp cho mọi hàm an sao đã audit.

Guard: sóc cách nửa đêm dưới 120 giây chặn tháng có đầu/cuối liên quan; trung khí dưới 120 giây mà dịch trong khoảng ±120 giây có thể đổi tháng sẽ chặn chu kỳ liên quan. 120 giây là ngưỡng thận trọng của dự án, không phải giới hạn sai số được chứng minh. Quét phiên bản hiện tại 1976–2050 chưa tìm thấy tháng bị chặn; [evidence/calendar-exclusions.json](evidence/calendar-exclusions.json) hiện rỗng. Nếu có sau khi thay ephemeris, trả CALENDAR_BOUNDARY_REVIEW; không fallback.

## Quy ước an sao của profile mới

- iztro **2.6.1**, algorithm=default, language=vi-VN; đây là hệ upstream với lịch thay thế, chưa là bộ sao Việt Nam được chuyên gia phê duyệt.
- Đổi ngày **00:00**. 23:00–23:59 và 00:00–00:59 cùng chi Tý, nhưng thuộc ngày dân sự đang khai báo. 01:00–02:59 Sửu, tiếp tục đến 21:00–22:59 Hợi.
- 23 giờ chuyển sang timeIndex=0; dayDivide=current. Không dùng index12 có nhánh tăng ngày riêng của upstream. Ngày sau 00:00 do đầu vào ngày mới quyết định.
- Năm đổi mùng 1 tháng 1 âm; yearDivide/ageDivide/horoscopeDivide=normal, không đổi năm tại Lập xuân.
- **fixLeap=false**: an sao dùng nguyên số tháng âm cho cả tháng nhuận, không chia trước/sau ngày15. Đây là quyết định quy ước kỹ thuật cần chuyên gia duyệt trước bán; không phải kết luận trường phái nào đúng.
- Can chi năm lấy năm âm; tháng lấy số tháng lặp khi nhuận; ngày dựa JDN Gregorian; giờ lấy can ngày và chi giờ. Bridge không cung cấp chuyển lịch CN hay lịch theo tiết khí.
- Khoảng đại vận lấy cục và hướng theo giới tính/âm dương năm của upstream, tuổi mụ normal. Chỉ xuất khoảng kỹ thuật, chưa có luận thuận lợi/thách thức. Không xuất horoscope năm/tháng/ngày/giờ.

## Profile tham chiếu cũ

`cn-reference` giữ nguyên phạm vi đầu vào 1900–2099, lunar-lite 0.2.8 / lunar-typescript 1.8.6, dayDivide=forward, Tý muộn index12, fixLeap=true, algorithm default. Xem [CONVENTIONS.md](CONVENTIONS.md). Chọn rõ mới sử dụng; không tự chuyển qua profile này khi VN bị chặn. Không sửa snapshot/profile/hash cũ. Ngày giao diện trước đây ghi “vn-unavailable” vẫn không tính được.

## Khả năng tái lập

Result ID SHA-256 bao gồm input, profile, versions, chart/evidence, warnings và trạng thái kiểm chứng. Đổi calendar/bridge/dependency/quy ước phải tăng phiên bản, giữ snapshot cũ, chạy kiểm chứng lại. Không đưa thời điểm tạo báo cáo vào hash lá số. Cần giữ lockfile và mã bridge đúng phiên bản để tái lập từ input; chỉ có hash không đủ khôi phục môi trường cũ.
