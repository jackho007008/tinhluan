# AI trả phí — kết quả hoàn thiện và kiểm phát hành, 01/11/2026

**CHƯA ĐẠT để phát hành thương mại 11 cung.** Chức năng trong phạm vi QA đạt kiểm mock, ba bài Astra mới đã lưu và đọc lại đúng quyền. Reading V2 khắc phục phần rỗng và giảm lặp rõ rệt, nhưng chưa tạo thêm đủ chiều sâu; Nô Bộc/Tử Tức vẫn thiếu nền trực tiếp, Phu Thê còn rất mỏng. Không lấy API thành công hoặc nhãn `focused` làm chứng nhận nội dung chuyên sâu.

## Phạm vi và phiên bản thực tế

Baseline `main@bbf37de`. Đầu phiên tracked/index sạch; hai thư mục `buu-dinh-7parts/`, `docs/handoff/` chưa commit được giữ nguyên. Lô hữu hạn gồm provider/validation lỗi, truy xuất nguồn sách có điều kiện, prompt mới, test và báo cáo này. Không đổi engine, schema DB, thanh toán, quyền/edition/offer, bốn tab, Mệnh V1/Luna, PDF hoặc nội dung lịch sử.

- Schema giữ `paid-reading-v2.0.0`; prompt mới **`paid-palaces-vietnamese-2.1.0`**, retrieval **`paid-retrieval-1.3.0`**, facts **`paid-facts-1.1.0`**.
- Prompt 2.0.0 và các bản 1.0/1.1/1.2 vẫn đọc/đối soát được. CREATE/GET chọn schema từ phiên bản đã lưu tại job/attempt, không lấy writer hiện hành để đọc receipt cũ. Writer V2 vẫn opt-in; không đổi `PAID_EDITION`.
- Node **24.22.1**, SDK OpenAI **7.45.0**, model thực tế **gpt-6-astra**. Không fallback, không Luna, không retry hai attempt hết credit trước đây.
- QA riêng **3120**, DB **55450**, tên `tinhluan_ai_paidfinish_qa_1793522837609`; tạo instance mới, restore bản backup QA kiểm soát, không migration/restore DB gốc. Web key rỗng, không supervisor/consumer thường trực.
- Checkout/build cách ly `.local/ai-paid-finish-20261101/qa`, BUILD_ID **`ugITddC2sTuU-VIkCgLvC`**, 595 file với manifest hash. Không sửa build QA3118 hoặc QA3062/3070.
- Báo cáo mới **`4ca2ad20-d048-4404-9f5f-2e491bde3a8f`**, đơn test **`f1e77286-9496-49fb-9cd3-63ada84ccb0f`**. Chủ sở hữu synthetic qua helper QA hiện có, checkout/webhook HMAC test/cấp quyền qua luồng hiện hành; không ngân hàng thật hoặc Google OAuth thật.
- Cùng snapshot đối chứng 3.2/3.3, report1.79/catalog1.75, hash JSON nguồn **`bbeaa031ed477ac4f5cd9c744cb8d8fa51f03c514a424397ae976e498ceed370`**. Kiểm receipt, không an lại hoặc sửa snapshot. Facts gửi provider không có tên, email, ngày giờ sinh đầy đủ hay credential.

## Sửa lỗi provider và giữ lịch sử

Tái hiện bằng dữ liệu vòng V2 cũ: response `failed/credit_balance_exhausted`, `error.type=insufficient_quota`, output rỗng, usage null đã bị adapter chuyển thành `raw=null` rồi worker báo `AI_INVALID_OUTPUT`. Đây là lỗi phân loại, không phải bằng chứng schema sai.

`provider-failure.ts` phân biệt billing, access, rate limit, provider failed, incomplete/cancelled và validation. Cả HTTP429/quota lẫn response Background failed được nhận diện. Generation mang mã lỗi an toàn cùng receipt/usage/timing; worker lưu metadata trước khi kết thúc bằng lỗi tương ứng. Billing thành **`AI_BILLING_UNAVAILABLE`**, không retry tự động; operator được hướng dẫn kiểm credit/limit. Không lưu thông điệp tài khoản từ provider. Usage thiếu giữ `incomplete-usage`/cost null, không tuyên bố phí thực là zero.

Các lỗi riêng V2 như coverage sai, section trùng, C bị nâng thành trực tiếp hoặc tham chiếu sai nay được nhận là validation, thay vì nhầm thành uncertain và GET vô ích. Timeout/mất kết nối chưa rõ kết quả vẫn giữ uncertain; không nới backoff, receipt, ngân sách hoặc cơ chế CREATE. Kết quả completed không bị thay.

**Không backfill hai job cũ** đang mang mã lỗi cũ; DB55449 không khởi chạy và không GET/CREATE lại hai receipt ấy. [Bằng chứng vòng credit cũ](AI-PAID-ASTRA-V2-EVALUATION-20261101.md) giữ nguyên.

## Nguồn sách được tận dụng thêm

Không quét PDF hoặc xây hệ rule mới. Tái dùng hồ sơ NPL và kho chữ đã xử lý; phần mới là một tập trích ý biên tập nhỏ trong `paid-book-knowledge.ts`, không sửa catalog/evaluator. Chọn bằng cung, địa chi, chính tinh duy nhất và facts nguồn đã kiểm; không chọn theo ID/ngày sinh mẫu. Receipt sai bị từ chối.

1. **NPL261, Liêm Trinh tại Tài Dần/Thân:** cạnh tranh và chậm trong tạo tiền. Điều kiện đơn thủ giữ nguyên. Câu quả quyết về làm giàu của tác giả không thành bảo đảm cho khách hàng. Đoạn này xác nhận thêm nguồn cho ý đã có ở TB190, **không phải một luận điểm phối hợp Liêm–Hao mới**.
2. **NPL226, Tấu Thư:** nghĩa nền về ngôn ngữ/trình bày/thuyết phục trong mục năng khiếu dạy học. Chỉ `B/reference-only`, giữ ngữ cảnh gốc; không suy nghề dạy học, bằng cấp hoặc ngoại ngữ từ lời đơn sao. Bài Quan mới dùng cùng nguồn Hổ–Tấu trực tiếp và đánh dấu tổng hợp AI.
3. **NPL226, Thái Tuế:** nghĩa nền về biện luận trong mục nghề nghiệp, chỉ tham khảo khi Thái Tuế bản mệnh đã kiểm tại Tài. Không chuyển thành lời thu nhập/tranh chấp. Bài Tài mới không dùng nguồn này.
4. **NPL262, điều kiện Nhị Hao:** giữ nhóm, điều kiện hãm và ngoại lệ Mão/Dậu; **không** sửa Đại Hao Đắc trong snapshot theo bảng NPL. Đây là ranh giới nguồn `B/reference-only`, không lời hoang phí/nợ nần áp lên người đọc hoặc phép Liêm–Hao.

Hash lớp chữ đã đối chiếu: NPL226 `3a3a4a2d778075e2d4238ef204cc8c14cddf14cf66b36ce78e0b0b458d0dc8cf`; NPL261 `560fcd61533c22f6838d7b5b014bbe0e88a843917be92fd95574cd66d7712826`; NPL262 `6819999cc0503f0e5f116705766460f7d1de02fe2876347b47636c2dc554d874`. Không tính là kiểm ảnh/PDF mới.

D vẫn tối đa ba hồ sơ, nay chọn đúng chủ đề hơn: Quan dùng NPL42/33, Tài22/27, Nô02/42, Phu45/15, Tử46/07, cùng NPL01. NPL45 cần dữ liệu phối hôn, NPL46 có điều kiện nhiều lá số/hoàn cảnh; **không nâng D thành lời cá nhân**. Nô với Mệnh Vũ–Phủ và Nô Lương vẫn chưa khép điều kiện bảng. Tử VCD/xung Cơ–Cự vẫn không cho phép lấy nghĩa chi tiêu thành lời con. Kho ba sách đã xử lý được đối chiếu qua hồ sơ/candidate hiện có, không lấy ví dụ/can cung/tự hóa làm Tứ Hóa năm sinh.

Giữ A12/B10/C8/D3 hữu hạn; C tiếp tục đa dạng cung gốc và bytebudget cũ. Phần bổ sung B tối đa bốn trích ý, không đưa toàn sách vào request. Validator không cho `B/reference-only` thay nền trực tiếp hoặc dùng như lời nguồn áp cá nhân; muốn tổng hợp phải có A/B direct hợp lệ cùng đoạn. Conditions/exceptions/provenance giữ trong căn cứ.

[Ma trận đủ 11 cung](AI-PAID-RELEASE-READINESS-20261101.csv) và [dry-run đầy đủ](../.local/ai-paid-finish-20261101/matrix.json) phân biệt nguồn với luận điểm. Mọi packet giữ159facts; không có template chưa resolve. Quan direct3/Bnền1/C8/D3; Tài direct3/Bnền2/C8/D3; Phúc direct2/C4/D3. Tài direct3 chỉ có hai ý độc lập vì NPL261 trùng ý Liêm của TB.

## Prompt và bài thật

2.1.0 giữ contract V2 linh hoạt, không ép tám phần hoặc số từ. Gộp trục quyền–trách nhiệm; phân biệt thu/tích lũy/chi; giải thích phép nối có mức độ; không tạo chương chỉ để rào hoặc kể sao. Nguồn nền không thành luật tổ hợp. Giữ tất cả guard Tật Ách; không khẳng định đời sống, chẩn đoán, tuổi thọ hoặc điều trị.

Chọn trước **Quan, Tài, Phúc**. Phúc có hai lời trực tiếp hợp lệ, thay vì dùng lượt thử để ép Phu từ một lời Khoa. Ba bản đánh giá mới tách lịch sử, mỗi cung một CREATE/attempt; không chọn bài đẹp bằng lượt bổ sung.

- **Quan Lộc — focused,4phần:** [Toàn văn nguyên bản](../.local/ai-paid-finish-20261101/quan-loc-reading.md), [facts](../.local/ai-paid-finish-20261101/quan-loc-facts.json), [knowledge](../.local/ai-paid-finish-20261101/quan-loc-knowledge.json), [prompt](../.local/ai-paid-finish-20261101/quan-loc-prompt.md), [đầu vào thực gửi](../.local/ai-paid-finish-20261101/quan-loc-input.json).
- **Tài Bạch — limited,4phần:** [Toàn văn nguyên bản](../.local/ai-paid-finish-20261101/tai-bach-reading.md), [facts](../.local/ai-paid-finish-20261101/tai-bach-facts.json), [knowledge](../.local/ai-paid-finish-20261101/tai-bach-knowledge.json), [prompt](../.local/ai-paid-finish-20261101/tai-bach-prompt.md), [đầu vào thực gửi](../.local/ai-paid-finish-20261101/tai-bach-input.json).
- **Phúc Đức — limited,4phần:** [Toàn văn nguyên bản](../.local/ai-paid-finish-20261101/phuc-duc-reading.md), [facts](../.local/ai-paid-finish-20261101/phuc-duc-facts.json), [knowledge](../.local/ai-paid-finish-20261101/phuc-duc-knowledge.json), [prompt](../.local/ai-paid-finish-20261101/phuc-duc-prompt.md), [đầu vào thực gửi](../.local/ai-paid-finish-20261101/phuc-duc-input.json).

Đã đọc toàn văn cả ba bài mới, đối chiếu từng paragraph/ref với facts/knowledge thực gửi và đọc lại đầy đủ [Quan/Tài1.2](AI-PAID-ASTRA12-EVALUATION-20261101.md). Không sửa văn đã lưu. Mệnh vẫn từ lựa chọn V1/Luna đã chốt trong báo cáo.

## Đánh giá chín tiêu chí bằng dẫn chứng

Đây là đối chiếu nội dung của Codex, không phải chứng minh Tử Vi đúng với đời sống. Không lấy số phần/số nguồn làm điểm chất lượng.

1. **Facts:** chưa phát hiện sai trong các bài đã đọc. Quan đúng Thìn/Tử–Tướng Vượng/Thân/Quyền, Hổ–Tấu đúng hai field vòng. Tài đúng Liêm Vượng/Đại Hao Đắc, VCD của Tử chỉ dùng làm điều kiện chi. Phúc đúng Tham Đắc/Mã Đắc, Sát Miếu tại Di Ngọ. Không an thêm sao hoặc chuyển vị trí.
2. **Phối hợp chính/phụ:** Quan có thêm giải thích về biểu đạt qua Tấu, giữ Hổ–Tấu như nguồn tổ hợp riêng. Câu “Đặt nghĩa nền ấy cạnh lời Hổ–Tấu...” là tổng hợp có giới hạn, không phép chế hóa. Tài vẫn **chưa có** Liêm–Hao; việc nhắc thêm hai tác giả không tạo thêm phối hợp. Phúc nối Tham và Mã theo hai phương diện, không suy cát tinh xóa Triệt/Linh/Hao.
3. **Tam phương/tứ chính:** Quan/Tài **kém bao quát hơn1.2**: C đã gửi nhưng không được dùng trong bài. Quan1.2 có quyền quyết định–nguồn lực ở Tài; Tài1.2 có bối cảnh Quan/Mệnh. Hai bài mới bỏ cả mạch này, nên không gọi là tăng chiều sâu liên cung. Phúc dùng đúng Di ở role context, nói rõ “Đây vẫn là chú giải của cung Thiên Di”, rồi nối hai phạm vi với basis tổng hợp.
4. **Tứ Hóa/điều chỉnh:** Quan dùng Quyền năm sinh đúng cung, không dự báo chức vụ hoặc xóa Kỵ. Tài không khai thác Kỵ ở Mệnh hoặc Quyền ở Quan; Phúc không tự thêm nghĩa hóa. Không phát hiện chế hóa giả, nhưng chưa có phân tích điều chỉnh chuyên sâu được nguồn hỗ trợ.
5. **Chiều sâu chủ đề:** Quan có hai trục thực chất, gộp tổ chức/quyền vào một mục; Tài có hai trục tạo–gom nguồn và chi ngoài nghề. Câu “không thể lấy bên thu bù cho bên chi...” giữ đúng phạm vi nhưng chưa cung cấp kiến thức mới so1.2. Phúc chỉ hai ý cục bộ, không bao quát đời sống tinh thần. **Cả ba chưa chứng minh bài chuyên sâu toàn cung**; `focused` của Quan là nhãn phạm vi kỹ thuật đã lưu, không nghiệm thu thương mại.
6. **Nguồn/căn cứ:** các ID tồn tại, tác giả/vị trí truy được; chưa thấy trích dẫn bịa. Quan có nguồn nền NPL226 mới hữu ích; Tài NPL261 xác nhận cùng ý, NPL262 giải thích khác bảng. Điều kiện quan trọng và chủ thể của SPEND201 được giữ. Tuy vậy, validator chỉ kiểm cấu trúc/provenance, không chứng minh mọi câu suy luận đúng; kết luận này dựa vào đọc toàn văn.
7. **Văn phong:** tốt hơn về độ gọn. Quan8→4phần, không còn ba mục phân tích lặp riêng quyền/trách nhiệm; Tài bỏ phần chỉ kể Bát Tọa/Thiên Tài rồi nói thiếu nghĩa. Mỗi bài vẫn có nhiều câu phủ định và dè dặt; không nhầm sự trôi chảy với tăng tri thức. Không thấy thuật ngữ nội bộ trong thân bài. Giọng tự đối chiếu cụ thể hơn coaching chung, nhưng chưa thật giàu biên luận.
8. **Tính cụ thể/tự đối chiếu:** Quan hỏi một việc chung và ranh giới đề xuất/chốt, bám trục trực tiếp; Tài hỏi nhịp mua theo hứng rồi giữ chặt, bám SPEND201. Phúc gợi duy trì liên hệ khi ở xa, là liên hệ AI có điều kiện, **không** lời sách xác nhận sự gắn bó hay hoàn cảnh gia đình. Không dùng các gợi mở này làm sự kiện của người đọc.
9. **Không bịa/certainty:** chưa phát hiện lỗi facts/trích dẫn nghiêm trọng hoặc dự báo chắc chắn trong ba bài. Tài giữ khác bảng Hao, không hứa thu nhập; Phúc đặt nguyên lời khá giả xa quê trong giới hạn, không khuyên chuyển nơi ở. Tài có cụm “ý nghĩa bất lợi của hao tinh” ở câu phủ định; không coi đó là bằng chứng Đại Hao Đắc gây hại hay cơ sở bổ sung phối hợp.

Kết quả: **đạt lưu/đọc và cải thiện biên tập; chưa đạt chiều sâu thương mại**. Không sửa prompt lần nữa rồi tự gọi để nâng điểm. Giữ nguyên 2.1.0 và ba bài làm bằng chứng của phiên bản đã kiểm.

## Usage, thời gian và giới hạn phí

Preflight GET xác nhận model. Chủ dự án xác nhận bổ sung credit; không đọc được spending limit/credit project trực tiếp. Dự toán bảo thủ mỗi bài60.000input toàn cache-write và12.000output =1,35USD, ba bài4,05USD. Reservation1,65/bài, daily reserve5USD, maxCREATE/ngày3, maxattempt1, GET tối đa12/attempt theo backoff30→300giây. Không gọi reserve là hard cap hóa đơn.

Theo [giá Astra](https://developers.openai.com/api/docs/models/gpt-6-astra) và parser hiện hành: input10/cache-read1/cache-write12,5/output50USD mỗi triệu token, output đã bao gồm reasoning; không cộng hai lần. Cả ba dùng standard/default, dưới272kinput.

- **Quan:** input28.545 =3uncached+0read+28.542write; output6.279 gồm4.660reasoning. **0,670755USD**. Provider119giây; dispatch→persist225,411giây; queue59,363giây gồm chuẩn bị/operator; tổng thời gian các lượt quan sát11,738giây. Job `5804de28-703c-4913-bf09-c73f8150ec21`; receipt `resp_0671651551d24ef9006ae70793ae7c87d29cc84e3463f0a038`;1CREATE/3GET/1attempt.
- **Tài:** input28.709 =3uncached+0read+28.706write; output5.117 gồm3.624reasoning. **0,614705USD**. Provider104giây; dispatch→persist222,674giây; queue62,718giây; quan sát3,801giây. Job `f89108e7-c27c-4618-973b-e2f938ca9d0d`; receipt `resp_0265ab855f43a504006ae70795f04887d28c434a8904353ccb`;1CREATE/3GET/1attempt.
- **Phúc:** input25.703 =3uncached+0read+25.700write; output5.140 gồm3.624reasoning. **0,578280USD**. Provider94giây; dispatch→persist103,843giây; queue64,789giây; quan sát4,958giây. Job `7dc49e67-5c46-47b6-a2aa-a4401cdcdfdc`; receipt `resp_08c1f2ec063f186c006ae70798d0fc87d2a0c9c1429ce841a7`;1CREATE/2GET/1attempt.

Tổng **3CREATE/8ResponsesGET/4ModelsGET**, **1,863740USD ước tính**, không phải hóa đơn. Không suy ETA11cung hoặc đổi UI5phút từ ba bài. [Usage/timing/ID thực tế](../.local/ai-paid-finish-20261101/metrics.json), [ledger không có header/secret](../.local/ai-paid-finish-20261101/network-events.jsonl).

## Kiểm chức năng và bảo toàn

- **98 test liên quan riêng biệt đạt:**74pure ban đầu, bổ sung3case HTTP429/background-source guard (hai file chạy lại37/37), và21integration trên DB test cách ly. Có quyền đúng/sai chủ, webhook lặp, enqueue11không trùng, ba mức coverage, V1 pending giữ schema/attempt, completed không tạo lại, billing không retry, V2 validation không thành uncertain, Background timeout/restart/budget và guard y khoa.
- Typecheck cuối đạt; build cách ly đạt. Không toàn E2E/PDF. Các lần lỗi đầu: expectation cũ loại NPL45 được sửa theo chính sách D mới có kiểm reference-only; fixture địa điểm rỗng không qua schema; fixture sửa snapshot bị receipt guard từ chối thay vì trả rỗng; kiểu hàm fetch mock thiếu tham số. Không sửa facts/nguồn lịch sử hoặc nới guard để xanh. Log giữ private.
- API QA3120: không phiên404; đúng chủ200 ba lần; payload result khớp DB, mở trang đơn200, thư viện có báo cáo. Toàn job/attempt và ledger không đổi sau đọc lặp/mở lại; snapshot/Mệnh nguyên. [Chứng cứ HTTP](../.local/ai-paid-finish-20261101/http-verification.json). **Chưa kiểm browser/mobile mới trong vòng này**, không ảnh mới, không tạo recovery fixture hoặc chèn cookie vào browser; mobileV2mock trước đây là bằng chứng lịch sử, không phải kiểm mới.
- Trạng thái thật3/11:1focused/2limited; tám job mới khác queued/attempt0, chưa sinh AI. UI tiếp tục processing là đúng vì vòng chỉ duyệt ba cung, không báo11/11giả. Tầng mock kiểm kết thúc limited/insufficient, giữ quyền và không loading vô hạn.
-44job cũ/18queued trong clone nguyên hash;49artifact lịch sử nguyên, gồm hai attempt credit cũ qua manifest. Bốn đơn/báo cáo cũ và tất cả hàng gốc của7bảng orders/reports/bindings/checkouts/payment giữ nguyên khi COPY đối chiếu backup. Lượt so đầu dùng UTC khác timestamp+07; đặt đúng timezone backup thì khớp toànbyte, không sửa dữ liệu. [Job/read](../.local/ai-paid-finish-20261101/preservation-and-read.json), [dữ liệu gốc](../.local/ai-paid-finish-20261101/historical-data.json), [artifact cũ](../.local/ai-paid-finish-20261101/history-preserved.json).
- QA3118/DB55448 giữ PID68941/68265. QA3062/3070 và các cổng QA chính không LISTEN ở lượt kiểm, không tự bật; không tuyên bố đã smoke các dịch vụ đang offline. Không chạy/restart worker thanh toán, không supervisor hoặc OpenAI ngoài ba job đã chọn. Không mở Live/mở bán, không sửa Bửu Đình.

Đã kết thúc consumer hữu hạn, backup DB mới vào kho private (69.010.966bytes, có hash), rồi xác minh PID/cwd trước khi dừng riêng web3120/PG55450. Giữ data directory và mọi export; không rollback hoặc dừng dịch vụ khác. [Biên nhận backup](../.local/ai-paid-finish-20261101/backup-after.json), [biên nhận dừng](../.local/ai-paid-finish-20261101/shutdown.json).

## Hai điểm chặn thực sự trước phát hành

1. **Độ phủ giá trị trả phí chưa đủ:** Nô/Tử chưa có nền trực tiếp phù hợp; Phu chủ yếu một lời phụ. Cần nội dung đúng điều kiện hoặc quyết định phạm vi sản phẩm rõ; không lấp bằng bảng/rule suy đoán, không gắn chuyên sâu cho phần thiếu. Ma trận chỉ chứng minh đúng snapshot đã kiểm, không mọi lá số.
2. **Chiều sâu chưa ổn định:** V2 gọn hơn nhưng Quan/Tài bỏ ngữ cảnh C có ích đã có; Liêm–Hao/Phá–Đà–Hỏa chưa có phép phối hợp được nguồn hỗ trợ. Cần giải quyết việc khai thác luận điểm thật, không tăng số mục hoặc số lời rào.
Giới hạn bằng chứng: mới ba bài V2 trên một snapshot; không lấy QA mock kỹ thuật làm nghiệm thu chuyên môn hoặc ETA/chi phí11cung. Không kết luận các cấu trúc chưa thử sẽ có cùng chất lượng, và không yêu cầu gọi hàng loạt để che thiếu nguồn.

Không tự tạo gói tiếp theo, không thêm request. Đây là bản đã triển khai/kiểm trong phạm vi tối đa ba CREATE; **giữ ở QA, chưa phát hành**.
