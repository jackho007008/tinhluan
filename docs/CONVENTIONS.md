# Quy ước profile tham chiếu cũ

Tài liệu này giữ mô tả `cn-reference`. Profile UTC+7 mới xem [CALENDAR-CONVENTIONS.md](CALENDAR-CONVENTIONS.md).

Profile `cn-reference`: Tử vi Đẩu số, iztro 2.6.1, algorithm default. Lịch Trung Quốc upstream lunar-lite 0.2.8 / lunar-typescript 1.8.6. Language vi-VN chỉ dịch nhãn, không biến lịch thành lịch Việt Nam.

- yearDivide=normal, horoscopeDivide=normal, ageDivide=normal (tuổi mụ upstream).
- dayDivide=forward; 23:00–23:59 là chỉ số 12 (Tý muộn), 00:00–00:59 là 0 (Tý sớm); các giờ còn lại floor((hour+1)/2).
- Phút được giữ nguyên trong input/provenance; engine sử dụng chi giờ, không tạo độ phân giải theo phút.
- fixLeap=true: quy ước upstream nửa đầu/nửa sau tháng nhuận. Input âm lịch chưa hỗ trợ; ngày dương rơi vào tháng nhuận đi qua engine và quy ước này.
- Dùng ngày giờ dân sự UTC+7 như đã khai báo, không đổi sang UTC+8. Đây là quy ước demo tham chiếu chưa được duyệt cho mục đích thương mại, đặc biệt dữ liệu lịch sử.
- Không triển khai Tam Tai, Kim Lâu, sao hạn dân gian hoặc suy lá số đối phương.

Nguồn kỹ thuật: https://github.com/SylarLong/iztro/tree/v2.6.1 và https://docs.iztro.com/quick-start; vị trí đọc: lib/astro/astro.js bySolar/byLunar/withOptions, lib/astro/palace.js, lunar-lite. Đây là nguồn triển khai thuật toán, không chứng minh khả năng tiên đoán.

Mã kết quả SHA-256 của JSON chuẩn hóa theo schema cố định, profile, versions, chart DTO, warnings và validationStatus. Không đưa timestamp/copyright năm hiện tại của upstream vào hash; cùng input/profile/dependencies/version tạo cùng mã. Đổi dependency phải cập nhật lib/provenance và chạy regression, không sửa âm thầm.

Rules facts-0.1.0 chỉ sao chép cung, địa chi và danh sách chính tinh. Metadata gồm ID/version/profile, điều kiện, ngoại lệ, evidence paths, nguồn/vị trí, conflict policy, factual-only. Không có rule luận giải được phê duyệt. Rule conflict không được AI giải quyết; hệ thống không xuất bản diễn giải thiếu.

Scoring thật trả `score:null`, status unavailable, approvalStatus unapproved. Không chuẩn hóa thành 0. UI fixture có điểm cố định riêng; daily-fixture dùng ngày âm Trung Quốc từ solar2lunar chỉ để thử tooltip, không dùng ngày âm làm căn cứ cho các số mẫu. Giai đoạn đại vận trong báo cáo dùng range thực của từng cung, trục là tuổi mụ, không phải điểm.

Narration mặc định template; provider adapter nhận id/text của các statement (không tên/email/ngày sinh). Candidate hiện chỉ được chấp nhận nếu bằng nguyên văn allow-list, đúng thứ tự và đủ citation. Mọi biến thể/lỗi fallback template. Muốn bật văn AI tự do phải có kiểm tra ngữ nghĩa và kiểm duyệt chuyên môn độc lập; chỉ xác thực citation không đủ.
