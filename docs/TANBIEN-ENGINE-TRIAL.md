# Bộ lập lá số Tân Biên — hồ sơ chính, bản thử 0.2.0

Ngày 2026-10-09. Profile hiện hành `tanbien-vn-trial-v2`, engine `tanbien-trial-0.2.0`; v1/0.1.0 giữ nguyên để tái lập, iztro khóa 2.6.1. **Thử nghiệm một phần, chưa phê duyệt chuyên môn; không gọi là bộ Tân Biên hoàn chỉnh.** Không bật beta, thu tiền hoặc email thật.

## Luồng sử dụng đã nối

- `/`: nhập sinh → xác nhận → lá số miễn phí, mặc định profile thử mới và khung đầy đủ. Vẫn chọn được profile cũ.
- `/internal/readings`: cùng quyền nội bộ cũ, nhập → snapshot mới → lá số/bài từ rule cùng snapshot.
- Hồ sơ cũ: “Tạo bản mới từ cùng thông tin để đối chiếu” mở form, yêu cầu xác nhận, tạo ID mới có parentId. Không tính lại khi chỉ mở hồ sơ cũ.
- Trang kết quả đơn có báo cáo: lấy chartSnapshot của chính báo cáo đã lưu, dùng cùng `components/Chart.tsx`. Không đưa draft vào báo cáo khách.
- Nguyên nhân hiển thị thiếu trước đây: mặc định rút gọn theo ngữ cảnh của Chart; phụ tinh có trong dữ liệu/chi tiết nhưng không nằm trên khung. Đã thống nhất mặc định đầy đủ; vẫn có nút rút gọn/danh sách/phóng to. Cung dài cuộn trong vùng chart, không kéo toàn trang.

Engine v1 ở `lib/tuvi-engine/tanbien.ts` (giữ nguyên byte); v2 ở `lib/tuvi-engine/tanbien-v2.ts`, chạy trên bản sao base VN; không sửa node_modules/global iztro. Công thức có trace, source, input/result và supplement/source-conflict. Profile/formula/output tham gia định danh kết quả. Receipt nội bộ đóng băng engine, nguồn code, rule và template. Chỉ R01–R21 Tân Biên được mở tương thích theo hợp đồng dữ kiện; không mở hai rule Toàn Thư. Đây là tương thích phần mềm, không phê duyệt nội dung.

## Nguồn và giới hạn việc đọc

Tệp người dùng cung cấp: `(boitoan)-Tử Vi Đầu Số Tân Biên - Vân Đằng Thái Thứ Lang-dantocking.com.pdf`, 277 trang. Trang 1 ghi tác phẩm Sài Gòn 1956; trang 276 ghi ebook 2014, người đánh máy không rõ. **Không phải đã đối chiếu bản in 1956; không suy quyền sử dụng từ việc có PDF.**

**Đã đọc toàn văn lớp chữ 1–277**, không chỉ trích xuất hay tìm từ khóa. Nhật ký tiếp nối:
- Mốc v1: 1–51, 225–228, 248–249, 267–277.
- Mốc v2: 52–172; 173–224; 229–247; 250–266. Các lượt output bị cắt giữa ở 58–70 và 84–93 đã đọc lại riêng. Không còn trang văn bản chưa đọc.
- Ảnh nguồn đã đối chiếu: 5–43,148,168–170,238–239,241–242,244–247,253,268–275. Bao gồm tất cả năm bảng Cục, bảng khởi Hỏa/Linh, Tứ Hóa, Tuần/Triệt, bảng trạng thái và cả bốn lá số phụ lục.
- Hình la bàn quét nhỏ ở 27–28: một số chữ vòng ngoài không đọc chắc ở độ phân giải gốc; **không dùng các chữ đó làm đầu vào thuật toán**. Bảng gõ lại cùng trang/26 đọc được, nhưng còn sai khác màu Thìn (26 ghi Đen,27 ghi Vàng); không triển khai màu ngũ hành.
- Không có trang hoàn toàn mất chữ. Có văn bản mâu thuẫn/đứt nghĩa được giữ ở bảng quyết định bên dưới; “đã đọc” không có nghĩa đã giải quyết hoặc chứng nhận toàn sách.
- Phần luận đoán 31–271 (sức khỏe, chết/tang, phán xét, nghề nghiệp, tương hợp, biểu tượng…) đã đọc để biết phạm vi; không biến thành rule mới trong task lập số.

Không xác nhận bản in 1956 hay quyền sử dụng ebook. Các ảnh nguồn ở `.local/tanbien-engine-source/`, không phát hành lại toàn sách.

Số trang dưới đây là PDF/trang in trong ebook này, cùng số tại các trang đã đối chiếu. Không phải số trang của một ấn bản khác.

## Danh mục duy nhất

| Hạng mục | Nguồn | Đầu vào | Hiện thực / quyết định | Mức xác minh và phần thiếu |
|---|---|---|---|---|
| Lịch, ngày, giờ, tháng nhuận | §4 p6; calendar VN hiện hành | ngày dân sự UTC+7, 1976–2050, giờ biết rõ | tái sử dụng lịch VN, ngày đổi 00:00, nhuận lặp tháng | quy ước dự án; sách chưa đủ cho lịch thiên văn/biên 23h hiện đại |
| Mệnh/Thân | §5–6 p6–7 | tháng âm, chi giờ | tính độc lập 2+m−1∓h, kiểm tra base | công thức; không dùng phút/nơi sinh giả |
| Tên/can chi cung | p5–7/20; bảng can tháng §11.4.4 p29 | Mệnh, can năm | thứ tự cung đối chiếu phụ lục; can cung iztro được kiểm tra từng ô bằng bảng can tháng | áp bảng can tháng sang can cung là quy ước bổ sung; sách không nêu riêng phép an can cung |
| Mệnh chủ/Thân chủ | không tìm thấy phép an trong toàn văn đã đọc | chi Mệnh/chi năm | giữ iztro, nêu riêng | chưa xác minh Tân Biên |
| Cục | §7 p7 | can năm, chi Mệnh | ma trận 5×5 riêng | đọc bảng; test cả năm loại Cục |
| Tử Vi | §8.1 p7–8 | Cục/ngày âm | bảng ngày theo từng cung | Kim ngày 21 lặp, ngày 24 thiếu: giữ upstream có trace bổ sung |
| 13 chính tinh còn lại | §8.1–2 p8–9 | Tử Vi, đối xứng Thiên Phủ | offsets theo hai vòng | test vị trí nguồn; không đổi bảng để khớp website |
| Lộc Tồn/Kình/Đà | §8.4/8.6 p9–10 | can năm/Lộc | bảng can và ±1 | đã hiện thực theo văn nguồn |
| Địa Không/Kiếp | §8.6.2 p10 | giờ | Hợi ∓h | đã hiện thực, không đồng nhất Thiên Không |
| Hỏa/Linh | §8.6.3 p10–11 | nhóm chi, âm dương, nam nữ, giờ | điểm khởi + chiều riêng + từng bước | Hỏa Hợi/Mão/Mùi: bảng Dần khác ví dụ273/275; dùng bảng, công bố mâu thuẫn |
| Tả/Hữu, Xương/Khúc | §8.7–8 p11 | tháng/giờ | phép đếm riêng | alias Tả Phụ→Tả Phù; giữ ID tên hợp đồng |
| Long/Phượng, Khôi/Việt, Khốc/Hư | §8.9–11 p11–12 | can/chi năm | bảng/đếm | Phượng Các→Phụng Các, không nhân đôi |
| Tam Thai/Bát Tọa | §8.12 p12 | Tả/Hữu/ngày âm | đếm gồm ngày1 ở điểm khởi | đã hiện thực theo văn nguồn |
| Ân Quang/Thiên Quý | §8.13 p12; p272–275 | Xương/Khúc/ngày | Quý = Khúc−(ngày−1)+1 | cả bốn ví dụ đối chiếu đúng hình cố định; đính chính cách đọc chi lưu niên trong hồ sơ trước |
| Đức/Hình/Riêu/Y | §8.14–15 p12 | năm/tháng | các phép đếm | Thiên Riêu→Thiên Diêu; không suy tác động |
| Hồng Loan/Thiên Hỷ | §8.16 p12 | chi năm | giữ điểm khởi upstream | câu lặp “năm sinh”, chưa xác minh điểm khởi; supplement |
| Quốc Ấn/Đường Phù | §8.17 p12–13 | Lộc Tồn | +8/−7 | đã hiện thực |
| Giải/Thai/Phong/Tài/Thọ | §8.18–20 p13 | tháng/giờ/năm/Mệnh/Thân | phép đếm nguồn | Thai Phụ→Đài Phụ; nguồn/đầu vào trong trace |
| Thương/Sứ/La/Võng | §8.21–22 p13 | cung cố định | Nô/Tật/Thìn/Tuất | đã hiện thực |
| Tứ Hóa bản mệnh | §8.23 p13–14 | can năm | bảng10can, hóa gắn sao, không thêm sao hóa riêng | Tân Quyền=Thiên Lương theo bảng ebook **khác ví dụ273/275**; v2 gắn source-conflict |
| Quan/Phúc/Cô/Quả | §8.24–25 p14 | can/nhóm chi | bảng/nhóm riêng | đã hiện thực |
| Đào/Mã/Kiếp/Phá/Hoa | §8.26–30 p14–15 | nhóm chi năm | bảng nguồn; **v2 sửa Phá Toái hai nhóm bị đảo ởv1** | Phá Toái đối chiếu bốn ví dụ; sao khác có trace công thức, không tuyên bố mọi ô đã kiểm độc lập |
| Lưu Hà/Thiên Trù/Văn Tinh | §8.31–33 p16 | can năm | bảng nguồn | sao bản mệnh dù tên có chữ Lưu |
| Đẩu Quân/Thiên Không | §8.35–36 p16 | năm/tháng/giờ | đếm riêng | không đánh đồng với Địa Không |
| Tuần/Triệt | §8.37 p16–17 | can chi năm | sáu tuần, 10can, lưu explicit cặp cung | Triệt: ví dụ Canh Ngọ khác bảng/sơ đồ; chọn bảng/sơ đồ, không che sai khác |
| Bác Sỹ/Thái Tuế | §8.3–4/8.34 p9,16 | Lộc/năm/chiều | vòng riêng có tên lớp | không trộn với phụ tinh cùng tên |
| Tràng Sinh | §8.5 p10 + §3.79 p50 | Cục/chiều | đủ 12bước, bổ sung Suy từ p50 | văn p10 bỏ Suy, quyết định công bố |
| Vòng Tướng trước / sao ngoài danh mục | iztro2.6.1 | base | giữ dưới supplement | chưa gọi là công thức Tân Biên |
| Đại hạn | §10.1 p20–21 | Cục/Mệnh/chiều | cách1, 10năm/cung | không triển khai cách2 đồng thời |
| Tiểu hạn tuổi/năm | §10.3 p22–23 | nhóm chi/nữ nam/năm xem | tuổi1, chu kỳ12, tuổi mụ theo năm âm | ví dụ traiTý/gáiNgọ từsách; năm xem người dùng chọn, không lấy ngày hiện tại |
| Lưu đại hạn | §10.2 p21–22 | cung gốc, tuổi, chiều | v2 có vị trí khi chọn năm | sơ đồ27tuổi→Hợi,38tuổi→Dần khớp; lỗi lặp số/tênCục trong văn không bị giấu |
| Lưu nguyệt | §10.4 p23 | tiểu hạn, tháng/giờ sinh, tháng xem | v2 cách1; đủ 12tháng, xem ở chi tiết năm | cách2/3 không chọn; tháng nhuận xem unknown, không tự lặp tháng |
| Lưu nhật/thời | §10.5–6 p23–24 | ngày dương xem đổi âm, chi giờ tùy chọn | v2 có trên luồng nhập nội bộ | ngày hợp lệ và năm âm phải khớp; thiếu giờ không tự gán; tháng nhuận chưa chốt |
| 9 sao lưu | §4.1–4.4 p268–269 | can/chi năm âm xem | v2 lớp riêng: Tuế/Tang/Hổ/Khốc/Hư/Lộc/Kình/Đà/Mã | ví dụ năm Mùi/Ất Mùi khớp; không đưa sao lưu vào facts bản mệnh |
| Tuổi1–12 | §21.2 p239 | tên12cung | v2 danh sách tuổi→cung, trong trace | không suy sức khỏe, tuổi thọ hoặc tử vong |
| Nạp âm năm sinh | §22 p241–242 | canchi60năm | v2 bảng30cặp tên riêng, không diễn giải | khớp4nạpâm trongphụlục; giữ tên ebook |
| Quan hệ cung | §9 p18–20, §11.3 p25–26 | chi cung | tiện ích geometry hiện có, không đổi để theo câu tóm tắt p20 | tamhợp±4, đối+6; p20vídụSửu mâu thuẫn bảng; nhị hợp chỉ bảng, chưa thêm vào rule |
| Các phép giờ tiểu nhi | §21.1 p238–239 | năm/tháng/ngày/giờ/mùa | **không triển khai trong sản phẩm** | chỉ phục vụ phán đoán bệnh/tử vong trong nguồn; ngoài phạm vi sản phẩm, không phải sao bị thiếu |
| Ngũ hành/can chi/mùa, tương sinh khắc | §11 p24–30 | canchi/ngày | chỉ dữ liệu lịch/polarity đã dùng; không triển khai suy luận tốt xấu/màu | màuThìn26/27 và giờMậu-Quý/Tỵ29 mâu thuẫn; quy ước lịch riêng |
| Trạng thái 14 chính tinh | p33–38, registry đã đối chiếu | tên sao/chi | giữ bảng nguồn riêng, thêm Thiên Phủ | không thay rule table; bản mới lưu cả originalBrightness/originalBranch |
| Trạng thái phụ tinh | p39–43 | tên/chi | v2 thêm Kỵ, SongHao, Tang/Hổ ở vị trí Đắc có ghi rõ | ngoài bảng là unknown, không dùng iztro thay |
| Các luận đoán phầnII/III | phần sau | không thuộc phép an thuần | không thêm nội dung trong task | đã đọc toàn văn; không thêm luận đoán, không tuyên bố đủ khả năng luận toàn sách |

## Quyết định và bằng chứng

A. Đúng phép tính đặc tả: pure tests cho điểm khởi/chiều Hỏa-Linh, sáu Tuần, mười Triệt, năm Cục, biên lịch và bất biến input. Kiểm tra tổ hợp hữu hạn là test phần mềm.

B. Khớp ví dụ nguồn: Thiên Quý p272/273/274/275 tại Dậu/Mão/Dần/Dần, đọc ô cố định p5 (không đọc chi tiểu hạn bên trong); Hỏa p272/274 khớp. Harness đầu vào âm lịch của sách là fixture kỹ thuật có nguồn, không phải mẫu lịch dương do engine xác nhận độc lập.

C. Không khớp/chưa xác minh: hai ví dụ Hỏa p273/275 khác bảng; Kim21/24 và Triệt Canh có mâu thuẫn; bảng Tứ Hóa cần bản in độc lập; nguồn bổ sung giữ nguyên có nhãn. Test không xác nhận chuyên môn.

Bảng sao nguyên gốc trong snapshot cũ không bị sửa. Bản mới giữ trạng thái iztro gốc kèm vị trí cũ để tránh hiểu đó là trạng thái ở vị trí mới. Dấu `?` nghĩa thiếu **trạng thái** theo Tân Biên, không thiếu sao. Tuần/Triệt hai nhãn biểu diễn một cặp từ engine, không an thêm hai sao.

## Hồ sơ riêng và bảo toàn

Hồ sơ kiểm toán trước/sau và ảnh chỉ ở `.local/tanbien-engine-audit/`; không vào public, exports hoặc mẫu phát hành. `new-reading.json` lưu URL mới; `comparison.json` giữ kết quả gốc/mới cùng formula trace; `ui-verification.json` đối chiếu tập tên sao render với snapshot ở1440/360/390. Audit gốc trong `.local/chart-comparison-1992-08-07` giữ nguyên.

Không sửa DB hiện hành. Bản thử mới được tạo trong store nội bộ bằng quyền chủ dự án; báo cáo cũ không tính lại. Bộ duyệt1.9.0 và catalog không chỉnh nội dung.

## Chạy lại kiểm tra

`npm run typecheck`

`node --env-file=.env node_modules/vitest/vitest.mjs run tests/tanbien-v2.test.ts tests/tanbien-engine.test.ts tests/chart-presentation.test.ts tests/dynamic-reading.test.ts tests/tanbien-review-pack.test.ts tests/vietnamese-engine.test.ts tests/birth-validation.test.ts`

Production riêng: `scripts/reading-stability.mjs prepare/build/start`, localhost3005, DB thử55443, không dùng DB thật. E2E chọn năm test chart conventions/dynamic internal/full chart/new profile/actual free entry; retries=0. Log ở `docs/evidence/tanbien-engine/`; ảnh ở `mobile/` dùng dữ liệu giả lập.

Chưa kiểm lại thanh toán/email trong đợt này. Việc đọc trang kết quả dùng snapshot được kiểm ở cấu trúc/kiểu dữ liệu, chưa tính là đã chạy toàn bộ mua hàng.

## Còn cần chốt

1. Đối chiếu bản in cho Hỏa Hợi/Mão/Mùi, Kim21/24, Triệt Canh và Tứ Hóa can Tân.
2. Quy ước bổ sung nào tiếp tục giữ: can cung, Mệnh/Thân chủ, Hồng Loan, vòng ngoài sách; không gắn nhãn tất cả là Tân Biên.
3. Quyết định tháng nhuận xem và quy ước lịch ngoài sách; kiểm duyệt chuyên môn tách khỏi kiểm thử phần mềm. Đọc toàn văn đã hoàn tất; không cần lặp lại việc đọc để che các câu hỏi nguồn cụ thể.

## Kết quả mốc v1 (kế thừa, không dùng làm số test v2)

- Typecheck đạt; production build cô lập đạt (`typecheck.txt`, `build.txt`).
- Vitest: **80/80**, 6 file, 5.09s (`unit.txt`). Không phải 80 ví dụ nguồn hoặc 80 xác nhận chuyên môn.
- E2E cuối: **4/4**, một worker, retries=0, Chrome/production3005. Gồm trang chủ và nội bộ, đổi hồ sơ, tạo bản mới, mở căn cứ, 360/390/1440. Lượt trước có một test sai locator exact-text (nhãn có tiền tố lịch); ứng dụng đã có profile đúng, đã sửa locator và chạy lại toàn bộ bốn test. Giữ cả log thất bại `e2e-final.txt` và log cuối `e2e-final-2.txt`.
- Hồ sơ cá nhân: nghiệm thu trực tiếp localhost3000, tập sao render bằng đúng ba danh sách trong snapshot, bốn nhãn thuộc hai cặp Tuần/Triệt, không tràn trang ở cả ba độ rộng. Ảnh riêng không phát hành.
- Hash **123/123** tệp cũ giữ nguyên; `preservation.json`. Phạm vi gồm bộ xuất cũ/1.9.0, mẫu engine, hồ sơ nội bộ có trước và kiểm toán gốc. Không suy rộng thành kiểm checksum toàn DB; không có thao tác ghi DB trong đợt này.

Các tệp chính thay đổi: `lib/tuvi-engine/tanbien.ts` (mới), adapter/index calendar/profile, tương thích snapshot/rule nội bộ, `components/Chart.tsx`, `components/Experience.tsx`, `components/InternalBirthForm.tsx`, route internal-readings và order GET, CSS, tests. Catalog chuyên môn và evaluator conditions giữ nguyên. Bộ duyệt1.9.0 giữ nguyên.

## Khép hồ sơ nguồn ở v2: quyết định, không biểu quyết ví dụ

Quy ước chỉ số của mọi phép đếm sau: Tý=0,…Hợi=11; điểm khởi là giờ Tý/ngày1, do đó đếm đến giờ h là h bước, đến ngày d là d−1 bước. Các số dưới đây được lập từ nguồn trước khi gọi hàm, không chụp output làm expected.

| Điểm | Công thức/bảng và ví dụ đọc được (PDF = trang in ebook) | Phương án và phép tính riêng | Phạm vi / lựa chọn hiện hành | Kết luận còn thiếu |
|---|---|---|---|---|
| Hỏa Hợi/Mão/Mùi | §8.6.3 p10–11 bảng khởi Dần; p273 Tân Mão nam tháng6 ngày6 giờ Mão: Hỏa Ngọ; p275 Tân Mùi nam tháng11 ngày30 giờ Dần: Hỏa Mùi | Âm nam Hỏa nghịch: Dần−3=Hợi và Dần−2=Tý; nếu khởi Dậu: Dậu−3=Ngọ và Dậu−2=Mùi | Mọi năm chi Hợi/Mão/Mùi; v1/v2 giữ bảng Dần, trace source-conflict. Linh vẫn điểm Tuất và chiều ngược Hỏa | Chưa giải quyết bằng nguồn; cần bản in/đính chính có xuất xứ, không tự gọi lỗi in |
| Kim Cục21/24 | §8.1 p8:21 ởThìn vàMùi,24 không có; bốn phụ lục không thuộc ca này | Bảng cho21 hai đáp án. Phương án bổ sung iztro:21+3=24,24/4=6; từDần đi5 rồi lùi3→Thìn;24/4=6 đi5→Mùi | Chỉ Kim 4 ngày 21/24; Tử Vi và toàn bộ 14 chính tinh phụ thuộc. Giữ upstream, trace supplement, không gắn nhãn bảng đã xác minh | Cần bảng in rõ/đính chính. Không sửa21thành24 trong dữ liệu nguồn |
| Triệt Canh | §8.37.2 p17: bảng/sơ đồ Ất–Canh ở Ngọ–Mùi; văn ví dụCanh Ngọ ghi Thân–Dậu | A: can Canh 6%5=1→NgọMùi. B: theo câu ví dụ→ThânDậu | Các năm Canh: dùng bảng/sơ đồ; nhãn cặp hai cung rõ ràng, không suy từ một sao | Bốn phụ lục không có can Canh; chưa giải quyết nguồn |
| Thiên Quý | §8.13 p12; p272Quý Sửu m9d23hDần Khúc Ngọ/Quý Dậu; p273Tân Mão m6d6hMão Khúc Mùi/Quý Mão; p274Giáp Thìn m9d10hNgọ Khúc Tuất/Quý Dần; p275Tân Mùi m11d30hDần Khúc Ngọ/Quý Dần | Khúc−(d−1)+1:6−22+1=9;7−5+1=3;10−9+1=2;6−29+1≡2. Nếu bước cuối−1:7/1/0/0 | Toàn bộ hồ sơ có Quý. Giữ phép +1 v1/v2; v1 đã đổi so với upstream | Đã giải thích mâu thuẫn đọc ảnh cũ: dùng nhầm chữ chi tiểu hạn bên trong thay ô cố định p5. Không cần chọn theo số đông. Chưa có phê duyệt chuyên môn/bản in |
| Phá Toái | §8.29 p15; ví dụ272Sửu→Sửu,273Mão→Tỵ,274Thìn→Sửu,275Mùi→Sửu | Tứ Chính→Tỵ; Tứ Sinh→Dậu; Tứ Mộ→Sửu. v1 hoán đổi hai nhóm cuối | NămDần/Thân/Tỵ/Hợi/Thìn/Tuất/Sửu/Mùi: **v2 sửa lỗi code đã chứng minh**; v1 không đổi | Công thức và bốn ô ví dụ khớp; không phải xác nhận luận đoán |
| Tứ Hóa can Tân | §8.23 p14:Quyền = Thiên Lương; p273Quyền Sửu nhưngLương Tỵ; p275Quyền Thân nhưngLương Tuất | A:bảng Lương. B: ví dụ ghi Quyền ở cung Nhật/Nguyệt hoặc Nhật/Cự; chỉ biết cung, không có đường gắn sao | CanTân; dùng bảng Lương, **v2 nêu source-conflict**. Rule HóaQuyền có thể chịu ảnh hưởng, không sửa rule để khớp ảnh | Cần bản in/giải nghĩa quy tắc; không tự chọn Thái Dương chỉ vì cùng xuất hiện |
| Tràng Sinh | §8.5 p10 liệt kê thiếu Suy; §3.79 p50 và phần luận vòng p223 có Suy; vídụ272/273/274/275 có Suy | Dãy 12 gồm Suy sau Đế Vượng, trước Bệnh | v1/v2 công bố ghép nguồn này, không giả nguyên dãy đã in đủ tại p10 | Đủ triển khai dãy 12 theo các đoạn nguồn; cần biên tập nguồn nếu phát hành bản chuyên môn |
| Danh sách cung | §5 p6 bỏ Phụ Mẫu; sơ đồ và phụ lục có Phụ Mẫu | Giữ 12 cung, Phụ Mẫu sau Mệnh chiều thuận | iztro thứ tự tương thích bốn phụ lục | Không bỏ cung theo câu thiếu |
| Tóm tắt quan hệ | §9.4 p20 nói Sửu xung Tý, tam Dậu/Mùi; sơ đồ p18–19 và bảng p25–26:Sửu xung Mùi, tam Tỵ/Dậu | Hai bộ quan hệ khác; chọn bảng hình học rõ p25–26 | Geometry giữ ±4/+6; không đổi rule | Chưa có đính chính câu tóm tắt; không dùng câu này |
| Lưu đại hạn | p21 văn lặp 26 ở bước cuối; p22 văn lặp 35/36 và tâm hình ghi Mộc dù tiêu đề Kim | p21 cố định Thìn 23→Tuất24→Dậu25→Tuất26→Hợi27; p22 **Dậu34**→Mão35→Thìn36→Mão37→Dần38 | v2 theo quy tắc và ô hình; cả hai điểm cuối khớp. Không đọc cung tuổi 34 thành Tuất từ thứ tự trích chữ | Chưa giải quyết tên Cục/lặp chữ; không ảnh hưởng phép đếm đã minh họa |
| Can giờ và màu | p29 Mậu/Quý ngày, giờ Tỵ ghiBính; chuỗi trước/sau cần Đinh theo quy ước cầu nối. p26Thìn Đen, p27Thìn Vàng | Giữ cầu nối hiện hành là quy ước bổ sung; không nhập nhãn màu | Không đổi lịch hoặc màu sao; bảng can tháng p29 dùng đối chiếu riêng | Cần bản ingốc, không gọi toàn bộ can giờ là đã khớp sách |

Các mâu thuẫn **luận giải ngoài phạm vi phép an** còn thấy khi đọc: p52 tiêu đề Dương nhưng ngoặc Âm; p88 Cơ–Cự tại Dần khác p89 Mão/Dậu; p151 Phủ đơn tại Dần/Thân và p251 Tử–Phủ tại Sửu/Mùi không tương thích ma trận chính tinh; p160–161 Cơ–Nguyệt tại Thìn cần đối chiếu; p189 Khôi lặp ý Tướng; p217 cung Huynh có câu Tử Tức. Không dùng các câu này bổ sung rule hoặc sửa engine. Đây là câu hỏi nguồn, không phải kết luận tác giả hay bản in sai.

## Kế thừa iztro và dữ liệu vào rule

| Trường/lớp còn kế thừa | Kiểm tra hiện tại | Tình trạng |
|---|---|---|
| Lịch qua runner VN/cầu nối | Thay `lunar-lite` trước khi load iztro, chặn truy cập lịch Trung Quốc; UTC+7, ngày đổi 00:00, tháng nhuận lặp tháng | Quy ước bổ sung; sách không cung cấp thuật toán lịch này |
| index/name/can chi cung/isBodyPalace | Mệnh/Thân tính riêng, chặn mismatch; thứ tự cung khớp bốn phụ lục; can cung kiểm tra bằng bảng can tháng p29 | Áp bảng can tháng cho can cung là quy ước bổ sung |
| soul/body | Công thức upstream theo chi Mệnh/chi năm; không tìm thấy phép Mệnh chủ/Thân chủ trong toàn văn | Bổ sung, không tự đổi sang Liêm Trinh |
| solarDate/lunarDate/time/timeRange | Cùng input/cầu nối; 23h thuộc Tý nhưng ngày đổi 00:00 | Quy ước lịch; không dùng ảnh làm đầu vào |
| 14 chính tinh | Tự an theo bảng, không kế thừa vị trí ngoại trừ Kim Cục ngày 21/24 | 56 vị trí ở bốn phụ lục khớp; không suy mọi ca đã được chứng minh |
| Các sao thuộc §8 đã đặc tả | Loại sao cũ rồi an lại; xóa mutagens trước khi gắn bốn hóa | Trace từng sao; không mang trạng thái cũ sang cung mới |
| Sao bổ sung | Thiên Vu, Âm Sát, Phi Liêm, Niên Giải, Không Vong, Hàm Trì, Thiên Nguyệt; tập thực tế lưu trong `supplementalStars` | Chưa có phép an tương ứng trong sách; Phi Liêm ở đây khác lớp Bác Sỹ |
| `jiangqian12` | Giữ vòng Tướng trước upstream | Không gọi là vòng Tân Biên |
| `isOriginalPalace`, star type/scope, alias | Metadata upstream | Bổ sung kỹ thuật, không dùng để tô màu tốt/xấu |
| decadal can chi, ages | Range/ages tính lại; can chi cung bất biến, không phải can chi năm xem | Tuổi dài nằm trong chi tiết |
| Brightness | Giữ `originalBrightness` và `originalBranch`; tính brightness từ bảng Tân Biên tại vị trí cuối, thiếu thì xóa | Không fallback; v2 thêm Kỵ/Hao/Tang/Hổ và sửa locator Kình/Đà |

`calculateInternal` cấp receipt sau tính toán v2; hash gồm runner, adapter và cả hai file công thức. Kiểm tra 12 cung/các mảng/tên. Nhãn complete chỉ trong hợp đồng adapter, không có nghĩa đã phủ mọi sao trong sách. `freezeReading` suy facts từ toàn bộ ba mảng, không dùng mảng đã lọc cho UI. Lớp `viewing.stars` tách riêng, không lọt vào facts bản mệnh. Chỉ `tanbien.*` được mở tương thích; catalog, điều kiện evaluator và bộ duyệt 1.9.0 không đổi. Snapshot cũ không được gắn receipt mới.

## Phân biệt mức hoàn thành

- **Có trên UI:** ba danh sách sao, hóa gắn sao, bốn vòng đã lưu, đại hạn và cặp Tuần/Triệt. Lớp năm xem chỉ có khi nhập năm. Điều này không tương đương xác minh phép an.
- **Đúng đặc tả phần mềm:** các phép v2 được kiểm thử; cùng input/profile cho cùng kết quả; v1 tái lập không đổi.
- **Đối chiếu nguồn trực tiếp:** bảng/phép đếm đã đọc; bốn phụ lục với 14 chính tinh, Tuần/Triệt, Quý và Phá Toái; ví dụ Hỏa có cả khớp và không khớp; hai sơ đồ lưu đại hạn và ví dụ sao lưu Mùi/Ất Mùi. Chưa có tập độc lập bao phủ mọi phụ tinh, năm và giờ.
- **Trạng thái:** bảng 14 chính tinh riêng; phụ tinh chỉ nhập vị trí ghi rõ. Có vị trí sao không đồng nghĩa có bảng trạng thái.
- **Chưa hỗ trợ:** tháng nhuận xem; cách 2 đại hạn và cách 2/3 nguyệt hạn (profile chọn cách 1). Phán đoán bệnh/tử vong và giờ tiểu nhi nguy hiểm bị loại khỏi sản phẩm; không phải sao bản mệnh bị ẩn.
- **Chưa chốt nguồn:** Hỏa Hợi/Mão/Mùi, Kim 21/24, Triệt Canh, Tứ Hóa Tân. Can cung, Mệnh/Thân chủ và các vòng ngoài sách vẫn là quy ước bổ sung. Không có phê duyệt chuyên môn.


## Nghiệm thu v2 — chạy trực tiếp ngày 2026-10-09

- **87/87 test, 7 file, 5,65 giây**: `docs/evidence/tanbien-engine/v2/unit-complete.txt`. Bao gồm v1/v2, lịch Việt Nam, validation, trình bày lá số, hồ sơ nội bộ và bộ duyệt. Không phải 87 ca kiểm chứng chuyên môn độc lập.
- **Typecheck và production build đạt**: `typecheck-complete.txt`, `build-complete.txt` trong cùng thư mục. Bản build riêng nằm ở `.local/json-stability/app`, không thay bản dev của chủ dự án.
- **5/5 E2E, 47 giây, retries=0**: `e2e-complete.txt`; Chrome, một worker, production localhost:3005, cấu hình/DB thử riêng. Kiểm tra nhập miễn phí ở trang chủ; nhập/lưu/tạo bản đối chiếu nội bộ; đổi hồ sơ; nguồn trạng thái; render từng nhóm sao; năm/ngày/giờ xem; 360/390/1440px. Lượt đầu 4/5 do locator tên trường năm không bao gồm phần chú thích; đã sửa locator, không sửa bảo mật hay điều kiện engine. Giữ `e2e.txt` làm bằng chứng lượt thất bại.
- **Hồ sơ kiểm toán thật, localhost:3000:** cùng ID snapshot giữa bài đọc và hình; tập sao từng cung/từng nhóm, hóa gắn sao, vòng sao, khoảng đại hạn và cặp Tuần/Triệt khớp dữ liệu lưu. Không tràn ngang toàn trang ở 360/390/1440px. Kiểm tra này xác nhận UI khớp snapshot, không xác nhận snapshot đúng chuyên môn.
- **126/126 tệp lịch sử giữ hash:** `preservation.json`. Phạm vi là danh sách có trước ở `.local/tanbien-engine-audit/baseline-v2.json`, gồm kiểm toán gốc, hồ sơ cũ, bộ xuất/mẫu và công thức v1. Không tuyên bố checksum toàn database. Không chạy thao tác ghi database hiện hành.
- Trạng thái cấu hình đã kiểm: beta tắt, payment mock, email local. Không gửi email hay giao dịch thật.

### Mở bản mới và xem trước/sau

Nhập mới tại `http://localhost:3000/internal/readings` bằng quyền nội bộ hiện có. Chọn “Tân Biên — bản thử” v2; năm âm xem là tùy chọn, ngày/chi giờ xem chỉ nhập khi cần. Mở “Lá số”, chế độ đầy đủ mặc định; chạm từng cung hoặc chọn danh sách trên mobile. Hồ sơ cũ vẫn mở theo phiên bản đã lưu, nút tạo bản mới không ghi đè bản cũ.

URL riêng của hồ sơ kiểm toán nằm trong `.local/tanbien-engine-audit/v2/new-reading.json`; vẫn yêu cầu xác thực nội bộ, ID không phải quyền truy cập. Không đưa dữ liệu sinh thật vào mẫu/public. Hồ sơ đối chiếu riêng:

- `v2/comparison.json` và `v2/comparison.md`: profile gốc → v2, gồm các vị trí, trạng thái và cặp cung.
- `v2/v1-v2-differences.json`: so trực tiếp hai snapshot đã lưu; hồ sơ này chỉ đổi vị trí Phá Toái từ Sửu sang Dậu giữa v1 và v2. Nạp âm và các metadata nguồn mới được lưu riêng; không suy tập thay đổi sao là toàn bộ thay đổi schema.
- `v2/ui-verification.json`: kết quả đối chiếu từng lớp UI.
- `v2/chart-new-1440.png`, `chart-new-360.png`, `chart-new-390.png`: ảnh cá nhân lưu riêng. Ảnh test giả lập ở `docs/evidence/tanbien-engine/v2/mobile/`.

### Điểm dừng

Đã hoàn tất phần triển khai độc lập có đặc tả rõ trong danh mục và tích hợp vào luồng hiện hành. Những điểm nguồn còn mở không được gọi là đã giải quyết: Hỏa nhóm Hợi/Mão/Mùi, bảng Kim ngày 21/24, Triệt can Canh, Tứ Hóa can Tân, cùng quy ước tháng nhuận xem. Mỗi điểm có phương án hiện hành và phạm vi ảnh hưởng trong bảng trên. Quy ước bổ sung được công bố, không gắn tất cả kết quả với sách. Chưa có phê duyệt chuyên môn và chưa có kiểm chứng độc lập toàn bộ tổ hợp đầu vào/phụ tinh.

## Đối chiếu Kim Thoa — 10/10/2026, trình bày 1.4.0

Đối chiếu hai ảnh người dùng cung cấp và snapshot **tái lập**, không tìm thấy snapshot gốc tương ứng trong `.local/internal-readings` hoặc `chart_snapshots`. Đầu vào nhìn thấy: 2005-06-07, nữ, 08:30 (Thìn), tháng âm 5 ngày 1, profile v2/engine 0.2.0, không lớp năm xem trong ảnh dự án. Không suy nơi sinh từ ảnh; nhãn nơi sinh của bản tái lập là “Không ghi trên ảnh”. Các file riêng tư và bảng đầy đủ ở `.local/kim-thoa-audit/`: `comparison.html`, `comparison.tsv`, `comparison.json`, `reconstructed-snapshot.json`, `project-before.png`, `reference.jpg`, `corrected.png`, `baseline-sha256.json`. Không đưa thông tin sinh cá nhân vào fixture công khai.

- 16 thực thể bổ sung chỉ có trên phiếu dự án sau khi đối chiếu tên. Nguồn thực thi iztro 2.6.1: 7 sao riêng, 9 mục vòng Tướng trước không trùng thực thể sao riêng. Hàm Trì giữ cả đường dẫn sao riêng và vòng nhưng chỉ render một lần. Hoa Cái/Kiếp Sát có danh mục Tân Biên vẫn hiện mặc định dù có thêm đường dẫn vòng Tướng trước.
- Thai Phụ/Đài Phụ: `taifu / 台辅`, cùng §8.19 p13; Ngọ + giờ Thìn(4) = Tuất. Engine đã an đúng và ánh xạ sang Đài Phụ. Chỉ sửa nhãn phiếu sang Thai Phụ và ánh xạ cột/màu; không sửa snapshot hay phép tính.
- Phi Liêm ở Tật Ách: `faylian / 飞廉`, vòng Bác Sỹ §8.4 p9–10, Ất Lộc Mão, Âm Nữ thuận +6 → Dậu. Phi Liêm Tử Nữ: `feilian / 蜚廉`, sao riêng theo bảng chi năm của iztro `star/location.js:616`, Dậu → Hợi. Không phải render lặp; giữ bản thứ hai trong lớp mở rộng.
- Mệnh chủ Lộc Tồn: `astro/astro.js:212`, algorithm default, chi Mệnh Dần → `earthlyBranches.yinEarthly.soul=lucunMin`. Thân chủ Thiên Đồng: `astro/astro.js:226`, năm Dậu → `earthlyBranches.youEarthly.body=tiantongMaj`. Chưa xác minh công thức của AItuvi dẫn tới Cự Môn/Thiên Tướng. Không kết luận khác trường phái hoặc sửa cho khớp ảnh. Nhãn hai chủ tinh ghi rõ iztro.
- Vòng `jiangqian12` trong bản này dùng **ngày sinh** tại `astro/astro.js:179`, không phải lưu 2026 dù tên hàm có “Yearly”. Lớp sao lưu vẫn tách tại `chart.tanBien.viewing`, ghi năm xem.

Thay đổi nằm ở projection `lib/chart-provenance.ts`, `lib/chart-sheet.ts`, `lib/chart-columns.ts`, `components/ChartSheet.tsx`. Phiếu mặc định ẩn lớp ngoài danh mục; checkbox mở rộng khôi phục đủ dữ liệu, mục Nguồn sao liệt kê đường dẫn và nguồn. Bỏ dấu `*` phân cột khỏi phiếu; không dùng màu để khẳng định nguồn. Không đổi engine/profile 0.2.0, không đổi rule luận, không xóa/ghi đè bản xuất cũ. Nâng riêng SHEET_VERSION 1.3.0 → 1.4.0.

Kiểm tra: 15 test trong 5 file (sheet/columns/provenance/year) đạt; kiểm tra UI checkbox mở rộng trả đủ 16 mục và hai Phi Liêm, mặc định chỉ giữ Phi Liêm Bác Sỹ. PNG 2400px xuất từ component thật và đọc lại để kiểm tra bố cục. Test bảo toàn byte JSON đầu vào, bảo toàn tập đường dẫn qua hai lớp, giữ Hoa Cái/Kiếp Sát, giữ 9 sao lưu và tắt lớp năm độc lập.
