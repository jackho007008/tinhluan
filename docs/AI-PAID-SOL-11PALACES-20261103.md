# Một báo cáo QA 11 cung bằng Sol — 03/11/2026

**CHƯA ĐẠT để phát hành; chưa có đủ 11 bài.** Chủ dự án chọn một báo cáo đủ 11 cung, tối đa 11 CREATE, model `gpt-6.1-sol` đã cấu hình. Đã dùng đúng 11 CREATE: bốn bài `limited` được lưu, một kết quả `insufficient` không có đoạn luận, một bài bị chặn tham chiếu và năm request thất bại do credit. Không retry CREATE, fallback hoặc dùng văn tự biên tập để lấp chỗ thiếu.

## Đọc kết quả thật

[Bản đọc hiện có — HTML](../.local/ai-paid-sol27-20261103/ban-doc-ket-qua-thuc-te.html) · [Markdown](../.local/ai-paid-sol27-20261103/ban-doc-ket-qua-thuc-te.md). Có Mệnh miễn phí đã lưu và đủ tên 11 cung; chỗ chưa có bài được ghi rõ. Đây là bản xuất QA cục bộ, không phải phiên web đã triển khai.

- [Phụ Mẫu](../.local/ai-paid-sol27-20261103/palace-0-reading.md): limited, 2 phần/4 đoạn.
- [Huynh Đệ](../.local/ai-paid-sol27-20261103/palace-10-reading.md): limited, 2 phần/4 đoạn.
- [Tử Tức](../.local/ai-paid-sol27-20261103/palace-8-reading.md): limited, 2 phần/6 đoạn.
- [Phu Thê](../.local/ai-paid-sol27-20261103/palace-9-reading.md): limited, 4 phần/9 đoạn.
- [Tật Ách](../.local/ai-paid-sol27-20261103/palace-6-reading.md): insufficient, **0 phần**, chỉ thông báo phạm vi và giới hạn; không tính là bài chuyên sâu đã giao.
- [Tài Bạch, nguyên văn bị chặn](../.local/ai-paid-sol27-20261103/palace-7-reading-rejected.md): chỉ để chủ dự án đối chiếu, **không** được lưu/hiển thị như bài hợp lệ. Không sửa chữ hoặc thêm tham chiếu để cho qua.
- Phúc Đức, Điền Trạch, Quan Lộc, Nô Bộc, Thiên Di: không có bài; provider trả `credit_balance_exhausted`, ứng dụng ghi `AI_BILLING_UNAVAILABLE`, không nhầm lỗi schema.

Các file trong `.local` là tài sản riêng trên máy, ngoài Git; không có key/session trong tài liệu này. Bản xuất không chứa dữ kiện nhận dạng khách hàng thật.

## Identity và giới hạn thực thi

Baseline `main@da78069`, tracked/index sạch trước task; giữ nguyên `buu-dinh-7parts/`, `docs/handoff/`. Model đúng `gpt-6.1-sol`, reasoning high, Responses Background + Structured Outputs; SDK7.45.0, Node24. Không sửa prompt2.7.0, ReadingV2.0.0, retrieval1.14.0 hoặc facts1.1.0 trong vòng này.

DB thử riêng `tinhluan_sol27_eval_1793680365512`/55458, từ backup QA55448 đã kiểm identity. Báo cáo mới `2f664518-fa1f-45c4-b00b-115fe70b43cb`, đơn test `86408204-121e-435f-8bb3-497262c5ed6d`, owner synthetic. Dùng luồng fixture QA có sẵn → checkout test → webhook có chữ ký → report/grant → reconcile11job; không chèn session hoặc thêm endpoint/quyền. Chỉ report mới được consumer xử lý.

Preflight model GET truy cập được. Đếm trước tổng322.596 input token, mỗi cung maxoutput12.000, dự toán bảo thủ $3,013655 (đệm5% input, write-rate12h, output chạm trần); thông báo dự phòng nội bộ $3,10. Không đọc trực tiếp được balance/spending limit project; quyền model không chứng minh còn credit. `preflight.json.reserveUsd=4` là placeholder ban đầu, **không phải** giới hạn áp dụng: `run-started.json` và ledger dùng $3,10 tăng thêm. Clone có sẵn2attempt/$0,8061175 trong ngày, nên daily counter đặt13/$3,9061175 để dành đúng11 lượt mới, không cấp thêm lượt CREATE.

Đầu vòng maxRunning1. Sau khi Phụ Mẫu còn xử lý hơn10phút, dừng đúng PID80383, giữ receipt/attempt, tiếp tục **consumer hiện có** theo scope cả report/maxRunning3 (PID80864), không worker chồng hoặc thuật toán queue mới. Cả hai đã thoát. Mỗi cung chỉ1attempt. Không consumer/supervisor thường trực.

## Đầu vào, lưu và bảo toàn

11 packet đều159facts; JSON thực gửi khớp preflight sau chuẩn hóa thứ tự khóa JSONB, mọi trường/giá trị giữ nguyên. Không an lại sao hoặc thay snapshot. Hai output được đối soát sau sửa guard vẫn nguyên văn provider. [Kiểm input](../.local/ai-paid-sol27-20261103/input-immutability.json).

Mỗi `palace-N-input.json` lưu facts/knowledge; `palace-N-actual-request.json` lưu prompt/schema/model thực gửi; `palace-N-provider-response.json` lưu raw response. N tương ứng thứ tự0Phụ,1Phúc,2Điền,3Quan,4Nô,5Di,6Tật,7Tài,8Tử,9Phu,10Huynh. [Căn cứ từng đoạn hợp lệ](../.local/ai-paid-sol27-20261103/can-cu.json) · [Metrics/responseID/usage/thời gian](../.local/ai-paid-sol27-20261103/metrics.json).

Sau cùng progress **4/11**, processed **5/11**, state `attention`: không đếm insufficient thành bài sâu, không tiếp tục loading giả. ReadPaid hai lần cho nội dung/trạng thái giống nhau; thiếu authorized order bị từ chối; grant test còn hợp lệ; Mệnh miễn phí7unit giữ nguyên. Đây là kiểm server/store, **chưa smoke API route/browser owner hoặc mở lại qua thư viện**.

37bảng DB nguồn55448 giữ nguyên count/hash, gồm66job/39attempt, quyền/đơn/bài công khai. Trong clone,66job cũ và28queued giữ nguyên. Web3118 PID74791 và nguồn55448 PID68265 vẫn chạy; các cổng3062/3070/3101/3111/3113/3119 không listen tại lúc kiểm, không được báo thành dịch vụ đang hoạt động. Không restart/cập nhật bất kỳ web hoặc worker thanh toán nào. Không Live, migration hoặc gửi email ra ngoài; mail QA local.

Backup mới sau vòng thử đã kiểm `pg_restore -l`, 7.596.296byte; SHA256 `bf9edfac5f9698adbba8011dee16b5ac82a49296692f46cbb2bd63d356a13d12`. Đã dừng duy nhất PostgreSQL clone55458, giữ thư mục và dump riêng; chưa restore. [Bảo toàn](../.local/ai-paid-sol27-20261103/preservation.json) · [Backup](../.local/ai-paid-sol27-20261103/final-backup.json).

## Lỗi có bằng chứng và sửa hẹp

1. **Phu Thê:** accent-fold tên nguồn “Cổ Học” trùng từ thông thường “có học”. Giữ chính sách chặn nguồn, riêng tên ngắn này so chính tả có dấu/NFC/zero-width; không biến thành bỏ kiểm nguồn. Mock có học được chấp nhận, Cổ Học vẫn bị chặn.
2. **Tật:** câu phủ định hoàn chỉnh “không dùng để chẩn đoán, đề xuất điều trị, luận tuổi thọ, tử vong hoặc đánh giá sức khỏe cá nhân” bị medical guard chặn. Thêm **đúng câu đầy đủ** vào allowlist; câu nối chẩn đoán/dùng thuốc vẫn bị bác. Không dùng phát hiện phủ định tổng quát, không mở lời y khoa.
3. Hai lỗi trên qua mock rồi dùng `runAiMenhJob(allowCreate:false,revalidateOutput:true)` GET đúng2response đã lưu, cùngattempt/responseID, không viết lại output. Phu thành limited, Tật thành insufficient. Các job khác nguyên. [Trước sửa](../.local/ai-paid-sol27-20261103/before-revalidation-private.json) · [Đối soát](../.local/ai-paid-sol27-20261103/revalidation.json).
4. **Tài:** đoạn “Góc nhìn nghề nghiệp” chỉ dẫn `paid-library.thp2-tai-liem-than-trine` B/reference-only, neo gồm Mệnh/Quan. Contract hiện hành chỉ cho foundation đứng riêng khi mọi neo đã source-traced tại cung mục tiêu; đoạn này không có nguồn direct đi kèm nên `AI_REFERENCE_SCOPE`. Không phải factID không tồn tại, và không kết luận toàn đoạn bịa kiến thức. Đây là không tương thích cách dùng tham chiếu với contract, giữ chặn; muốn sửa phải đặc tả/test rõ cách dùng foundation liên cung, không tự nới để hợp bài.
5. **Credit:** Background trả HTTP200 nhưng trạng thái response failed. Phân loại billing đã đúng; consumer vẫn tiếp tục gửi các job còn lại khi tài khoản lỗi. Đã thêm kiểm hold billing/access theo **toàn report** trước CREATE; receipt cũ vẫn GET, hold tồn tại qua restart/scope một cung. Cần xử lý có quyền trước khi dispatch lại; hiện chưa có thao tác operator chuyên biệt mở hold billing không retryable. Không tự xóa trạng thái hoặc giả sử nạp tiền đã giải quyết. Bản sửa mới chỉ mock/build, không chạy lại consumer thật. Không hoàn tác 11 lượt đã dùng.

## Đọc toàn văn và chất lượng

Đã đọc toàn bộ6output sinh được và đối chiếu refs/điều kiện đã gửi; không coi số phần hoặc độ trôi chảy là bằng chứng đúng chuyên môn.

- **Phụ Mẫu:** Nhật–Nguyệt đồngPhụSửu đúng; giữ riêng vật chất/hòa thuận/sống gần. Nối Tử đúng vai thế hệ, neo Lộc vẫnNô. Hai trục có ích nhưng đoạn tổng hợp dài và thiên về phân biệt khái niệm, chưa phối hợp phụ tinh. Chỉ limited.
- **Huynh Đệ:** Thiên Đồng độcHợi và hình tượng xa cách đúng nhánh. Nô–Lộc giữ đúng cung gốc, không suy bạn bè chân tình/phi hóa chưa có. Câu “có chung quan hệ gia đình… dễ trao đổi… là việc khác” dễ hiểu nhưng liên hệ chưa sâu, còn nhiều phủ định; không bài toàn diện.
- **Tử Tức:** VCD Dậu, Lộc tạiNô và Nhật–NguyệtPhụ giữ vị trí; không suy số con/sinh sản. Tách vai người con/người lớn đúng. Đoạn “mong muốn con đáp ứng kỳ vọng” là tổng hợp AI khá chung, chưa thêm giá trị đặc thù từ cấu trúc; phần cuối lặp ý phân biệt hòa/bất hòa. Tên Tử Nữ/Tử Tức chưa được giải thích nhất quán trong lời. Limited, chưa đủ cam kết sâu.
- **Phu Thê:** giữ PháĐắc/ĐàĐắc/Hỏa khôngđộsáng/Tả vàKhoa đúng. Giữ **“phần nhiều”**, **“từng trợ giúp… trong một giai đoạn”**, **“va chạm rồi mới hợp”**; không đổi thành luôn hỗ trợ hoặc cứ cãi là hợp. Nối Quan về tổ chức với đồng thuận đúng vai, không bịa phép Phá–Đà–Hỏa/Khoa hóa giải. Câu “khả năng tổ chức công việc không tự trả lời… đồng thuận” có ý rõ, nhưng nhắc kỹ thuật và rào giới hạn còn nhiều; cách phối hợp phụ tinh vẫn thiếu. Limited, không tự công nhận bài quan hệ chuyên sâu.
- **Tài bị chặn:** phân biệt tạo/giữ/chi tiền, HaoĐắc không tự tụtài; TiểuHao ởPhúc đốiTài không chuyển cung. Có đoạn giải thích tam phương, nhưng lỗi contract tham chiếu nêu trên ngăn nghiệm thu. Chưa xác nhận phép Liêm–ĐạiHao; không sửa lời/refs để “cứu” bài. Không có bài Quan mới để so cùng model.
- **Tật:** đúng kết thúc insufficient,0section; giữ Mộ là giai đoạn/khôngđộsáng, không chuyển sao cung khác. Chỉ đạt an toàn/kết thúc kỹ thuật, không có bài sức khỏe cá nhân để chấm chiều sâu.

Thân bài hợp lệ không nêu tên sách/tác giả; metadata căn cứ vẫn có trong disclosure riêng. Chưa thể kết luận Sol vượt Astra bằng một snapshot, bốn bài limited và hai kết quả bị chặn ban đầu. Không benchmark thêm model hoặc gọi lại chọn bài đẹp.

## Token, thời gian, chi phí

Tổng **11CREATE/23ResponsesGET**, gồm2GET revalidation; **12modelGET** (1preflight+11providercheck) và11POST input-token-count không tạo bài. Không GET/CREATE sau đóng vòng. Usage của sáu response completed được ghi đủ trong metrics:

- Phụ: input27.246/output3.628/reasoning2.588; write27.243/read0; provider680s;5GET; estimate$0,1043935.
- Huynh: input28.521/output2.971/reasoning1.988; write28.518/read0;55s;2GET;$0,101011.
- Tử: input27.807/output3.908/reasoning2.588; write27.804/read0;72s;2GET;$0,108596.
- Phu: input30.916/output6.373/reasoning4.439; write30.913/read0;107s;4GET;$0,1410185.
- Tài bị chặn: input33.382/output6.439/reasoning4.142; write33.379/read0;114s;3GET;$0,1478435.
- Tật: input27.381/output1.266/reasoning978; write27.378/read0;24s;2GET;$0,081111.
- Năm billingfailed: mỗi cung1CREATE/1GET; không usage/thời gian hoàn thành hợp lệ, **không** ghi thành0token/0USD.

Reasoning nằm trong output, cachewrite/read nằm trong input, không cộng trùng. Parser thêm bảng riêng Sol, giữ số Astra cũ. [Giá model](https://developers.openai.com/api/docs/models/gpt-6.1-sol), [giá cache](https://developers.openai.com/api/docs/pricing): USD/triệu token input2/read0,10/write30m2,50/output10; write12h5. Tổng theo giả định write30m **$0,6839735**, nếu toàn write12h **$1,122061**. Response lại ghi retention24h, không tách TTLwrite trong usage; bảng công khai chưa xác định mức24h nên **chưa đối soát được giá TTL/hóa đơn thực**. Không gọi số ước tính này là tiền đã trừ chính xác, không gọi khoảng trên là hard cap. Năm lỗi không usage cũng chưa có estimate. Queue/provider/operator-wait lưu riêng trong metrics, không suy SLA5phút hay ETA11cung.

## Kiểm thực sự chạy

- 71/71 test ban đầu; sau sửa guard/consumer **112/112**,6file: cost,customer-prose,safety,consumer,V2,provider-failure. Consumer mock kiểm chặn CREATE khibilling/access, restart/narrowscope giữhold, GET vẫn đi, maxnew0 và trầnCREATE. Không gọi mock là provider thật.
- 11 packet và44probe sai scope/model/prompt/tokens bị chặn trước gửi. Finalaudit inputlầnđầu vấp thứ tự khóa trong **chuỗi** JSONB, sửa so JSON đãparse; mọi giá trị/field nguyên, không đổiexpected dữ liệu.
- Typecheck/build cách ly đạt, Node24.21.0; BUILD_ID **`sBspZxxsO2pDLUTskc0lj`**, snapshot riêng/keyrỗng/AI tắt/DBcổng1/fetchblocked. Không thay `.next` hoặc deploy.
- Mobile bản HTML cục bộ360/390 khôngtràn/pageerror, đã xemảnhPhu390; không phải UIđăngnhập QA. Chrome sandboxđầu bịEPERM, lần cóquyền chạy thànhcông. SSRexportđầu thiếu Reactglobal ở helperTSX, sửa helper rồixuất; không phải sửaapp/UI.
- Không chạy toànE2E/PDF; không migration hoặc APIrequestngoàiscope. [Test](../.local/ai-paid-sol27-20261103/tests-final.log) · [Build](../.local/ai-paid-sol27-20261103/build-identity-final.json) · [Mobile](../.local/ai-paid-sol27-20261103/mobile-static.json) · [Ảnh360](../.local/ai-paid-sol27-20261103/phu-the-360.png) · [Ảnh390](../.local/ai-paid-sol27-20261103/phu-the-390.png).

## Checklist và ba điểm chặn

Hồ sơ hiện hành của Phụ Mẫu,Phúc Đức,Điền Trạch,Quan Lộc,Nô Bộc,Thiên Di,Tật Ách,Tài Bạch,Tử Tức,Phu Thê,Huynh Đệ **đều giữ90%** theo checklist đang yêu cầuP09Astra2.7. Phép thửSol không âmthầm đổi tiêu chí hoặc tự nâng100%; mọi commercialReady=false. Riêng độgiao bàiSol là4/11limited,1insufficient,6error như trên, không dùng90% để che kết quả này.

1. Chưa đủ 11 bài: 5 billing failed; đã hết 11 CREATE được phép. Không tự retry sau nạp credit hoặc phục hồi backup; hold billing chưa có thao tác operator chuyên biệt để mở lại an toàn.
2. Tài còn lỗi contract nguồn liêncung; bốn bài hợp lệ vẫnlimited và còn hạn chế chiều sâu/văn phong; Tật không đủ lời cá nhân. Không gắn nhãn chuyên sâu.
3. Chưa nghiệmthu web owner/mởlại thưviện trên runtime mới, và chưa đốisoát hóađơn/TTLcache. Runtime mới khôngđược tự deploy từ thànhcông build.

Dừng vòng thử, giữ mọi bài cũ và kết quả mới. Không mởbán/Live, cập nhậtQA3062/3070 hoặc tự gọi thêm model.
