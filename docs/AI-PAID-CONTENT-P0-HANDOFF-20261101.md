# Content P0 — ngữ cảnh, prompt và giới hạn Tật Ách

01/11/2026, baseline **main@497447c**. Tracked/index sạch đầu phiên, chỉ `buu-dinh-7parts/` chưa theo dõi, không sửa. Lô hữu hạn: paid-context/retrieval/input, registry/prompt, validator y khoa, test tương ứng và tài liệu. Không thay engine/evaluator/catalog/thanh toán/queue/quyền/Mệnh V1-Luna/UI/schema8phần. **0 CREATE/GET OpenAI thật,0worker/supervisor/DB/QA deploy**, không mở Live/Gói3.7. Bốn khoảng thiếu được khảo cứu, không tự lấp bằng văn mới.

## 1. Chọn nhóm C

Retrieval mới **paid-retrieval-1.2.0**, facts vẫn1.1.0. Tái dùng các đoạn đã qua evaluator/điều kiện/ngoại lệ/template, không mở thêm nguồn không hợp lệ. Các ưu tiên chủ đề là **chính sách biên tập retrieval**, không điểm số Tử Vi hoặc rule mới về đời người.

`selectPaidContext` chọn từ candidate C hợp lệ: ưu tiên cung gốc ít được chọn, rồi loại văn thực chất (context/combination trước gloss/phương pháp) và theme hữu ích với chủ đề mục tiêu. Ví dụ Tài ưu tiên công việc, Quan ưu tiên nguồn lực; không dò từ khóa hoặc tên/ID/ngày sinh mẫu để chọn lời. ID chỉ phá hòa để kết quả ổn định. Khi phía khác không còn đoạn vừa ngân sách, một phía có thể dùng phần còn lại; **không quota cứng**. Một bài có nhiều đoạn không được tự chiếm hết C nếu có nguồn hợp lệ khác vừa budget. Việc cân nguồn không chứng minh mọi ngữ cảnh đều đủ ý nghĩa để suy luận trực tiếp.

Giữ tối đa8C, trần24.000byte và **không vượt tổngbyte của8C được chọn theo thuật toán cũ trên cùng candidate**. Tính đủ JSON mỗi đơn vị (nội dung/điều kiện/ngoại lệ/nguồn/provenance), không cắt ngắn câu nguồn để nhét. A12/B10/D3 giữ nguyên. Byte UTF8 là proxy ngân sách hữu hạn, **không khẳng định bằng tokenizer/model bill**; không thêm toàn kho. `contextSelection` là trace hàm cho dry-run; chưa thêm CLI hoặc API giám sát, không sửa schema DB/result. Các object nguồn giữ nguyên, nhãnC/context không đổi.

## 2. Dry-run trước/sau đúng ba cung

Dùng snapshot QA3.3 đã lưu, cùng chart3.2; không an lại. So với packet được lưu ở lần nghiệm thu497447c. [Danh mục giữ/loại/thêm theo từng ID](AI-PAID-CONTEXT-P0-20261101.csv); private evidence `.local/ai-paid-content-p0-20261101/*-dry.json` chứa toànfacts/knowledge/instructions/trace và bytebudget.

- **Quan Lộc:** C8toànMệnh → C8 từ **Tài2/Mệnh5/Phu1**. Thêm Liêm độc thủ Tài (`8-0`), chi ngoài công việc (`8-1`), Khoa tại Phu nam (`10-0`). Giữ Mệnh Vũ–Phủ (`0-1`), Vũ–Văn (`0-0`), Vũ (`0-2`), Phủ (`0-3`), âm dương (`0-4`). Loại Bản Mệnh–Cục (`0-5`), ngũ hành hai chính tinh (`0-6`), Mệnh–Thân tam hợp (`0-7`) khỏi C vì đã dành budget cho ngữ cảnh khác hữu ích hơn; không tuyên bố các lời đó sai hoặc xóa khỏi bản đọc. Input+instructions **99.261→98.280byte**, C14.399byte/trần14.817.
- **Tài Bạch:** C8toànMệnh → **Quan3/Mệnh3/Phúc2**. Thêm ba lời Quan tổ chức/Hổ–Tấu/Quyền (`4-0/1/2`) và hai lời Phúc Tham/Mã (`2-0/1`). Giữ Mệnh Vũ–Phủ/Vũ–Văn/Vũ (`0-1/0/2`). Loại Phủ riêng (`0-3`), âm dương (`0-4`), Cục (`0-5`), ngũ hành chính tinh (`0-6`), Mệnh–Thân (`0-7`) theo thứ tự ưu tiên/bytebudget, không loại khỏi lịch sử. Input+instructions **97.389→96.665byte**, C14.656/trần14.817.
- **Phu Thê:** vẫn6C, **Quan3/Phúc2/Di1**, không thêm/bớt nguồn; chỉ sắp lại ngữ cảnh công việc/tinh thần/ngoài xã hội. Input+instructions **90.242→89.679byte**, C9.540/trần9.540. Cân ngữ cảnh không tự tạo nghĩa Phá–Đà–Hỏa.

Cả ba giữ **159facts**, A/B/D nguyên toànobject; snapshot/record bất biến. Đơn vị nguồn mới vẫn thuộc cung gốc, không kết luận Khoa tại Phu tạo thành tích công việc hoặc Quan “được việc” bảo đảm kiếm tiền. Toàninput+instructions nhỏ hơn cũ; schema không đổi nên không tăng payload để chữa thiếu nội dung. Không dùng các số byte làm token/chi phí thật. Chưa gọi Astra để kết luận văn hay hơn.

## 3. Bốn phiếu nguồn

[Phiếu nguồn có tác giả/vị trí/điều kiện/ngoại lệ/dữ kiện và kết luận](AI-PAID-CONTENT-P0-SOURCES-20261101.md). Chỉ kho chữ/hồ sơ đã xử lý: TB190/195–196;213–215 và ToànThư83;Nô168/170–173;Tử198–201/205–207 và đặc tả kế thừa. Không PDF/ảnh mới hoặc đọc toàn sách. Source manifest private có hash các đoạn đã đối chiếu.

Kết quả: Liêm độc thủ Thân và Khoa tại Phu nam **đủ cục bộ, đã có**. Phối hợp Liêm–Đại Hao/Phá–Đà–Hỏa **chưa đủ**; Nô với Mệnh Vũ–Phủ và Nô Lương, Tử VCD/Cơ–Cự xung **chưa có mệnh đề mới đủ điều kiện**. Một số câu dự báo con cái/hôn nhân/phẩm hạnh ngoài phạm vi, không cải biên nhẹ để đưa vào. Không thêm rule/nguồn A/B giả hoặc tự nâng D.

## 4. Prompt mới, giữ phiên bản cũ

Mặc định cho **job mới**: **paid-palaces-vietnamese-1.2.0**, model purpose vẫn Astra, không fallback/thay model. Registry vẫn hỗ trợ1.0.0/1.0.1 và1.1.0. Chuỗi1.1.0 so đúng cả11cung với `git show497447c` giữ nguyên; hashQuan1.0.0/1.0.1/1.1.0 được test. Không relabel/backfill job hoặc input cũ; enqueue hiện có bỏ qua job cùng reading/hash/palace/edition bất kể phiên bản prompt. Không chạy enqueue trong task này.

1.2 bỏ mục tiêu số từ, yêu cầu một luận điểm→căn cứ→giải thích quan hệ→giới hạn đúng chỗ. Không lặp ý dưới nhiều tiêu đề, không liệt kê sao thay phân tích; cho tổng hợp có mức độ, phân biệt facts/source-interpretation/ai-synthesis. Không ép mọi sao phải có lời, không tự đặt chế hóa. Phần reflection tối đa hai câu hỏi có căn cứ, không biến thành mẹo quản lý/khuyên sống/đầu tư. Giữ giọng điềm đạm, không thuật ngữ nội bộ, không tăng mức khẳng định.

**Ví dụ đề cương đề xuất, không phải bài Astra mới:** thay ba phần cùng xoay quanh “tổ chức/quyền hạn” bằng (1) bộ chính tinh và vị trí Quyền: phân biệt khả năng với phạm vi; (2) Hổ–Tấu: liên hệ biểu đạt có mức độ; (3) ngữ cảnh Tài/Mệnh: giải thích vì sao được đọc cùng công việc, vẫn giữ chủ đề cung gốc. Phần tensions chỉ thêm khác biệt/giới hạn chưa nêu, không hỏi lại chuyện trách nhiệm. Không lấy C mới làm lời sách khẳng định cả quan hệ này.

Schema vẫn tám kind, thứ tự/basis/ID/storage/UI không đổi. Khi nguồn rất mỏng, prompt chỉ yêu cầu ngắn và giữ thiếu, không tạo ý để lấp phần. **Tám phần bắt buộc vẫn là giới hạn chưa giải quyết hoàn toàn**. Nếu cần ít phần hơn, đề xuất schema phiên bản mới5–8phần tùy luận điểm, renderer linh hoạt/đọc tương thích8phần cũ và validation theo phiên bản; cần quyết định riêng, chưa code/migration hoặc đổi bài lưu.

Tham khảo nguyên tắc hướng dẫn rõ, phiên bản hóa và eval tại [OpenAI prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering), đọc01/11; không dùng tài liệu này làm chứng nhận chuyên môn Tử Vi. Không gọi Models/Responses API.

## 5. Validator Tật Ách: tái hiện rồi sửa hẹp

Trước sửa, **5câu giới hạn hoàn chỉnh** bị `AI_SCOPE_VIOLATION` (log safety-before:5fail/8pass), gồm “Không chẩn đoán bệnh.” và “Không điều trị.”. Lỗi do regex từ cấm dò cả limitations mà không xét phủ định.

`violatesPaidMedicalScope` nay chỉ loại khỏi phép dò y khoa **một whitelist câu/phân đoạn giới hạn hoàn chỉnh** (chuẩnNFC/khoảng trắng/hoa thường), không phải cứ có từ “không” là bỏ qua câu. Loại đúng câu giới hạn hoàn chỉnh riêng từng trường rồi ghép để dò y khoa; cụm bị tách giữa title/content vẫn bị chặn, câu an toàn ở đầu thân không bị title ghép trước làm sai. Từ kỹ thuật/template/tríchtrang/kết luận chắc chắn vẫn kiểm trên toànvăn không loại.

Câu “Không chẩn đoán, không điều trị.” hợp lệ; “Không chẩn đoán bệnh, nhưng cần điều trị ngay”, “Không phải không chẩn đoán”, hoặc câu an toàn rồi khẳng định mắc bệnh/kê đơn/dùng thuốc vẫn từ chối. Thêm chặn thuốc/phácđồ/kêđơn và một số mẫu khẳng định bệnh; không biến tên sao **Bệnh Phù** thành lời chẩn đoán. Prompt gợi đúng câu giới hạn chuẩn để tránh model viết biến thể không được whitelist.

Đây là guard văn bản bảo thủ, **không phải bộ hiểu ngữ nghĩa y khoa đầy đủ**; biến thể phủ định khác có thể vẫn bị từ chối và cần review. Không xóa cổng y khoa, không coi vượt validator là đủ an toàn. Chưa tạo Tật Ách thật; giới hạn không bệnh/điều trị/tuổi thọ/tử vong giữ nguyên.

## 6. Kiểm thực sự chạy

- **39/39test trong3file**: paid-adapter, paid-context, paid-safety. Có snapshotshape thực, đủ nguồn ở ba phía, source object/conditions bất biến, một phía dùng phần còn lại (không quota), budget gồmJSON/UTF8, không cắt nguồn dài, thứ tựổn định; registrycũ, schema/ID/D, câu giới hạn hợp lệ và launder ykhoa.
- Lượt đầu sau sửa:1testcontext kỳ vọng8 nhưng trả7 vìhai cung có tên UTF8 dài hơn khiến vượt budget. Sửa fixture kỹ thuật bằng cách paddingđể mọi đơn vị đúng1024byte; **giữ expected8** để kiểm khôngquota, không nới budget hoặc đổi expected theo implementation. Sau thêmca body/hash và chặn cụm tách title/content:39/39.
- Typecheck cuối đạt. **Build cách ly Node24.22.1** đạt, BUILD_ID`cXfuvOEBpT4fUTpYTczdE`; key rỗng,AI/Livefalse,DB URL trỏport1khôngkếtnối;không phục vụ hoặc thayQA. Root/runtimeskhác không restart. QA3062/3070/3113/3116 không lắng nghe tại lượt đọc đầu, không tự bật lại.
- So hash **16artifact nguồn bài thật/input/snapshot cũ** nguyên; so11prompt1.1.0 nguyên. Không đụngDB/job/quyền; không tuyên bố đã smoke runtimeQA/DB offline. Không toànE2E/PDF.

Logs/private: `.local/ai-paid-content-p0-20261101/{safety-before,test-first,test-second,test-final,test-guard-final,typecheck-guard-final,build-final}.log`, dry-summary.json, history-verification.json, build-receipt.json. Không key/cookie/trường dữ liệu cá nhân vàoGit. BửuĐình nguyên. File code/test trong staged diff; tài liệu/backlog/kiếntrúc/kiểm được cập nhật đúng phạmvi.

## 7. Còn thiếu và tối đa ba bài đáng thử

Chưa giải quyết nguồn phối hợp Liêm–Hao/Phá–Đà–Hỏa, lời trực tiếp Nô/Tử và phạmvi sản phẩmTật. Chưa có bài1.2thật để đánhgiá chiều sâu/giọng,támphầnvẫncóthểvắngý nếuA/Bmỏng. Không nghiệmthu thươngmại hoặc ETA5phút từdry/test.

**Đề xuất, chưa thực thi:** (1)QuanLộc cùngchart/bảnQAđánhgiáriêng: kiểm C mới có thực sự tạo thêm lập luận Tài/Mệnh/Phu mà không chuyểncung/lặpcoaching; (2)TàiBạch cùngchart: kiểmnguồnQuan/Phúc,mộttrục tạo–giữ–chi,không bịa Liêm–Hao; (3)PhuThê chỉ dựphòng sau khi có thêm nguồnđúngđiềukiện hoặc quyếtđịnh chấpnhận bài ngắn,mộtý. Hiện **hai bài đầu đángthử hơn**; không gọiPhu chỉđể épvăn hay từmộtlờiKhoa. Mỗi cungtốiđamộtCREATE,receiptuncertainkhôngretry,táchbảnđánhgiá/giữcompletedcũ,ngânsáchphảiđượcduyệttrước. KhôngAstra/Luna,Tật thật,QA3062/3070,mởbán,thanh toán hoặcGói3.7 tronglượt này.
