# Sáu cấu hình trước/sau

Bản nháp nội bộ. Nội dung đầy đủ và căn cứ: [COVERAGE-READINGS.md](COVERAGE-READINGS.md). Các claim trước/sau nguyên văn và mọi lý do loại rule: [JSON đối chiếu](evidence/overview-before-after.json). Cùng đầu vào; không có xác nhận chuyên môn độc lập.

## vn-0

Đầu vào demo 2000-08-16 0:00; vn-utc7-midnight-v1. Không sửa kết quả engine.

Trước (interpretation-1.3.0): reading.overview.taiyin, reading.overview.tianji. Mở rộng: không.

Sau (interpretation-1.4.0): reading.overview.taiyin, reading.overview.tianji. Mở rộng: không.

Chưa có chú giải: không có khoảng trống tên sao trong mẫu này; vẫn chưa luận toàn lá số.

Các rule phối hợp không xuất:

- combination.ziwei-assistants: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Tử Vi","actual":["Thiên Cơ","Thái Âm"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.majorStars","chart.palaces.6.majorStars.0.name","chart.palaces.6.majorStars.1.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Tả Phù","actual":["Lộc Tồn"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.minorStars","chart.palaces.6.minorStars.0.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Hữu Bật","actual":["Lộc Tồn"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.minorStars","chart.palaces.6.minorStars.0.name"]}

- combination.ziwei-assistants-qualified: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Tử Vi","actual":["Thiên Cơ","Thái Âm"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.majorStars","chart.palaces.6.majorStars.0.name","chart.palaces.6.majorStars.1.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Tả Phù","actual":["Lộc Tồn"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.minorStars","chart.palaces.6.minorStars.0.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Hữu Bật","actual":["Lộc Tồn"],"evidencePaths":["chart.palaces.6.name","chart.palaces.6.minorStars","chart.palaces.6.minorStars.0.name"]}; {"fact":"fact.life-local-sat","op":"eq","value":"recorded","actual":"none-recorded","evidencePaths":["chart.palaces.6.name","chart.palaces.6.minorStars","chart.palaces.6.minorStars.0.name"]}

## vn-2

Đầu vào demo 2000-08-16 2:00; vn-utc7-midnight-v1. Không sửa kết quả engine.

Trước (interpretation-1.3.0): reading.overview.empty. Mở rộng: không.

Sau (interpretation-1.4.0): reading.overview.empty. Mở rộng: không.

Chưa có chú giải: không có khoảng trống tên sao trong mẫu này; vẫn chưa luận toàn lá số.

Các rule phối hợp không xuất:

- combination.ziwei-assistants: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Tử Vi","actual":[],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Tả Phù","actual":["Thiên Việt","Đà La"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.minorStars","chart.palaces.5.minorStars.0.name","chart.palaces.5.minorStars.1.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Hữu Bật","actual":["Thiên Việt","Đà La"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.minorStars","chart.palaces.5.minorStars.0.name","chart.palaces.5.minorStars.1.name"]}

- combination.ziwei-assistants-qualified: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Tử Vi","actual":[],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Tả Phù","actual":["Thiên Việt","Đà La"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.minorStars","chart.palaces.5.minorStars.0.name","chart.palaces.5.minorStars.1.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Hữu Bật","actual":["Thiên Việt","Đà La"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.minorStars","chart.palaces.5.minorStars.0.name","chart.palaces.5.minorStars.1.name"]}

## vn-4

Đầu vào demo 2000-08-16 4:00; vn-utc7-midnight-v1. Không sửa kết quả engine.

Trước (interpretation-1.3.0): reading.overview.ziwei. Mở rộng: không.

Sau (interpretation-1.4.0): reading.overview.ziwei. Mở rộng: không.

Chưa có chú giải: không có khoảng trống tên sao trong mẫu này; vẫn chưa luận toàn lá số.

Các rule phối hợp không xuất:

- combination.ziwei-assistants: condition-false; {"fact":"fact.life-minor-stars","op":"includes","value":"Tả Phù","actual":["Văn Khúc"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.minorStars","chart.palaces.4.minorStars.0.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Hữu Bật","actual":["Văn Khúc"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.minorStars","chart.palaces.4.minorStars.0.name"]}

- combination.ziwei-assistants-qualified: condition-false; {"fact":"fact.life-minor-stars","op":"includes","value":"Tả Phù","actual":["Văn Khúc"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.minorStars","chart.palaces.4.minorStars.0.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Hữu Bật","actual":["Văn Khúc"],"evidencePaths":["chart.palaces.4.name","chart.palaces.4.minorStars","chart.palaces.4.minorStars.0.name"]}; {"fact":"fact.life-local-sat","op":"eq","value":"recorded","actual":"none-recorded","evidencePaths":["chart.palaces.4.name","chart.palaces.4.minorStars","chart.palaces.4.minorStars.0.name"]}

## vn-20

Đầu vào demo 2000-08-16 20:00; vn-utc7-midnight-v1. Không sửa kết quả engine.

Trước (interpretation-1.3.0): reading.wuqu. Mở rộng: không.

Sau (interpretation-1.4.0): reading.wuqu. Mở rộng: không.

Chưa có chú giải: không có khoảng trống tên sao trong mẫu này; vẫn chưa luận toàn lá số.

Các rule phối hợp không xuất:

- combination.ziwei-assistants: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Tử Vi","actual":["Vũ Khúc"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.majorStars","chart.palaces.8.majorStars.0.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Hữu Bật","actual":["Tả Phù"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.minorStars","chart.palaces.8.minorStars.0.name"]}

- combination.ziwei-assistants-qualified: condition-false; {"fact":"fact.life-stars","op":"includes","value":"Tử Vi","actual":["Vũ Khúc"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.majorStars","chart.palaces.8.majorStars.0.name"]}; {"fact":"fact.life-minor-stars","op":"includes","value":"Hữu Bật","actual":["Tả Phù"],"evidencePaths":["chart.palaces.8.name","chart.palaces.8.minorStars","chart.palaces.8.minorStars.0.name"]}; {"fact":"fact.life-local-sat","op":"eq","value":"recorded","actual":"none-recorded","evidencePaths":["chart.palaces.8.name","chart.palaces.8.minorStars","chart.palaces.8.minorStars.0.name"]}

## engine-combo

Đầu vào demo 2001-05-06 20:00; vn-utc7-midnight-v1. Không sửa kết quả engine.

Trước (interpretation-1.3.0): combination.ziwei-assistants. Mở rộng: reading.overview.ziwei.

Sau (interpretation-1.4.0): reading.overview.ziwei, reading.overview.pojun. Mở rộng: không.

Có Phá Quân cùng Tử Vi tại Mệnh: phần tổng hợp chủ tinh–phụ tá tạm dừng vì chưa đặc tả quan hệ Tử Vi–Phá Quân. Các chú giải riêng vẫn đọc được; đây là giới hạn nội dung, không phải đánh giá xấu về lá số.

Chưa có chú giải: Phá Quân.

Các rule phối hợp không xuất:

- combination.ziwei-assistants: exception; {"fact":"fact.life-stars","op":"includes","value":"Phá Quân","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}

- combination.ziwei-assistants-qualified: condition-false; {"fact":"fact.life-local-sat","op":"eq","value":"recorded","actual":"none-recorded","evidencePaths":["chart.palaces.5.name","chart.palaces.5.minorStars","chart.palaces.5.minorStars.0.name","chart.palaces.5.minorStars.1.name"]}

## engine-exception

Đầu vào demo 2000-05-13 20:00; vn-utc7-midnight-v1. Không sửa kết quả engine.

Trước (interpretation-1.3.0): combination.ziwei-assistants-qualified. Mở rộng: reading.overview.ziwei.

Sau (interpretation-1.4.0): reading.overview.ziwei, reading.overview.pojun. Mở rộng: không.

Có Phá Quân cùng Tử Vi tại Mệnh: phần tổng hợp chủ tinh–phụ tá tạm dừng vì chưa đặc tả quan hệ Tử Vi–Phá Quân. Các chú giải riêng vẫn đọc được; đây là giới hạn nội dung, không phải đánh giá xấu về lá số.

Chưa có chú giải: Phá Quân.

Các rule phối hợp không xuất:

- combination.ziwei-assistants: exception; {"fact":"fact.life-stars","op":"includes","value":"Phá Quân","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}; {"fact":"fact.life-local-sat","op":"eq","value":"recorded","actual":"recorded","evidencePaths":["chart.palaces.5.name","chart.palaces.5.minorStars","chart.palaces.5.minorStars.0.name","chart.palaces.5.minorStars.1.name","chart.palaces.5.minorStars.2.name","chart.palaces.5.minorStars.3.name"]}

- combination.ziwei-assistants-qualified: exception; {"fact":"fact.life-stars","op":"includes","value":"Phá Quân","actual":["Tử Vi","Phá Quân"],"evidencePaths":["chart.palaces.5.name","chart.palaces.5.majorStars","chart.palaces.5.majorStars.0.name","chart.palaces.5.majorStars.1.name"]}
