# Đưa phương pháp web đã đối chiếu vào đầu vào và nối Phu–Quan

02/11/2026, baseline `main@cec82dd`, tracked/index sạch; giữ `buu-dinh-7parts/`, `docs/handoff/`. Chủ dự án yêu cầu tiếp tục tìm nguồn để hoàn thiện rồi mới kiểm Astra. Lượt này đi tiếp từ [7phiếu trước](AI-PAID-INTERNET-SOURCE-REVIEW-20261102.md), không chỉ thu thêm URL: nhận1mệnh đề phương pháp, tích hợp đầu vào thật, biên tập hai bản mock mới và kiểm bảo toàn. **Chưa gọi APIAI, deploy hoặc xử lý job.**

## 1. Nguồn bổ sung và kết luận khảo cứu

**WEB08 — [Dương Lương, Tiểu Hao–Đại Hao](https://hocvienlyso.org/tieu-hao-dai-hao.html)**, trang ghi16/08/2022, mục Đặc tính về vị trí trong sự phối hợp với các sao an theo Can. Tác giả mô tả hai Hao ở thế xung chiếu. Trên snapshot đã lưu có ĐạiHao/BácSĩ tạiTàiThân và TiểuHao/BácSĩ tạiPhúcDần, quan hệopposition đã được adapter ghi. Đây là phần hình thế có thể dùng, không phải quy tắc mới để tự an sao.

Chỉ nhận phương pháp đọc cặp tọa–xung: không đòi cả hai cùng tọaTài rồi mới nhận diện tên cặp. **Không từ đó kết luận mọi lời SongHao của tác giả khác đã đủ điều kiện**, không chuyển TiểuHao thành tọaTài, chọn bảng sáng hoặc nhập lời mất tiền/y khoa của bài. Nguồn web là bài có tên tác giả, không là chứng nhận TửVi đúng đời sống.

WEB09 — [bản đăng lại chương Phu, mục14Phá](https://vlee0610.pixnet.net/blog/posts/3036353460) và WEB11 — [chương Tài, mục6Liêm](https://vlee0610.pixnet.net/blog/posts/3036353500) giúp định vị các nhánh riêng theo tổ hợp và quan hệ. Bản Phu phân biệt hội, đồng độ và giáp; bản Tài giữ thêm điều kiện HóaKỵ/sát/hình/hao hoặc các nhánh HóaLộc. Chưa xác minh ảnh/trang ấn bản cho các đoạn này; **giữ draft, không nhập kết luận hôn nhân, phẩm hạnh, tiền bạc hoặc bệnh vào bài mới**. Không ghép đoạn Mệnh hay nhánh khác thành lời cho tổ hợp mẫu.

WEB10 — [NCC, thông tin bộ Deep lectures](https://www.ncc.com.tw/books/goods.php?id=3571) ghi tác giả王亭之 và nhà xuất bản紫微文化服務社. Đây là đối chiếu thư mục và lời mở đầu, không chứng minh các blog chép đúng từng chữ hoặc nhận giai thoại y khoa làm chứng cứ. WEB12 — [đầu mối Tật](https://tuvixemtuong.net/hoc-tu-vi/cung-tat-ach) mở toàn bài bị Cache miss; không dùng snippet để đặt ngưỡng “nhiều”.

[5phiếu mới, trạng thái sử dụng](../.local/ai-paid-web-integration-20261102/source-review.json). Không sửa trạng thái7phiếu cũ hoặc gọi các bản đăng lại cùng nguồn là chứng cứ độc lập. Không tải lại toànPDF, đọc toàn kho, sửa BửuĐình hoặc tạo hàng trăm rule.

## 2. Phần đã đi vào inputfactory

Retrieval mới **`paid-retrieval-1.14.0`**, facts1.1/159facts, prompt **2.6.0**, ReadingV2 và modelconfig giữ nguyên.

- Unit `dl-hao-opposition-method` dùng `webSources` trong loader thư viện hiện có. Chỉ **D/method/reference-only**, phải có đủ hai neo BácSĩ bản mệnh source-traced ở Tài và Phúc, Phúc đúngopposition. Mất sao, sai vòng, chưa xác minh hoặc sai quan hệ đều không nhận. Không chọn theo tên/ID/ngày sinh mẫu.
- Phiếu web cục bộ có URLHTTPS, tác giả/tiêu đề, locator, đoạn đối chiếu ngắn, thời điểm truy cập và hash. Loader kiểm tên/hash/schema/status/metadata/URL tham chiếu, từ chối symlink, quá kích thước, credentialURL hoặc bằng chứng hỏng. Không fetch lúc lập/mở lá số và không gửi nguyên phiếu hay cả trang web vào prompt. Hash nhận diện **phiếu nghiên cứu cục bộ**, không được gọi là hash toàn trang hoặc bằng chứng lời nguồn đúng thực tế.
- Web hiện **chỉ cho method**, không direct/foundation; một index cố nâng vai trò sẽ fail closed. Không giả số trang sách để đặt nguồn internet vào kiểu `pages`. Bản mới dùng `pages:[]` với bằng chứng web riêng; unit thiếu cả hai loại bằng chứng không hợp lệ.
- Giữ **4vị trí sách** trước, tối đa **1methodweb** dùng phần dung lượng còn lại trong **14000byte cũ**. Tổng tối đa5unit, không phải tăng trần byte hoặc tăng capC/D. Không cho nguồn web đẩy nguồn sách đang dùng ra ngoài.
- D vẫn tối đa3. Tài giữ phương pháp giao dịch/chi tiêu, thêm phương pháp cặp Hao và giữ NPL27 về phạm vi Hao. NPL22 tổng quát bị bỏ khỏi input mới, không xóa khỏi kho. Đây là ưu tiên nguồn gắn đúng cấu trúc đã lưu, không thay expected/lời sách để test xanh.

**Phu–Quan:** `paidContextGuide` bổ sung đường QuanLộc→PhuThê. Chỉ có guide khi cả nguồn trực tiếp tạiPhu, nguồnC ởQuan và thế xung chiếu đều hợp lệ. Nối câu hỏi về cách tổ chức thực hiện với câu hỏi về đồng thuận mục tiêu/nhịp quyết định; đây là hướng biên tập, không quy tắc chế hóa từ sách. Không tự biến Mệnh thành tam hợp củaPhu hoặc lời về công việc thành hành vi thực tế trong hôn nhân. Prompt2.6 đã cho phép và hướng dẫn kiểu tổng hợp này, không cần thay prompt.

## 3. Đầu ra và mức sẵn sàng

[Input/instructions thực tạo mới và số đo](../.local/ai-paid-web-integration-20261102/summary.json) · [Script dry-run](../.local/ai-paid-web-integration-20261102/dry-run.ts) · [Log](../.local/ai-paid-web-integration-20261102/dry.log).

- Phu: knowledge13nguồn nguyên; thêm guideQuanopposition. Input90811→92272byte, library5783byte, C9540/9540byte. [Bản biên tập mới](../.local/ai-paid-web-integration-20261102/Phu-Thê-editorial-mock.json) có3section, giữ tần suất/giai đoạn trợ giúp, thay chương Khoa riêng dễ lặp bằng ngữ cảnhQuan có hai tiền đề. Không ép diễn giải mọi sao hoặc thêm phần chỉ để nêu giới hạn.
- Tài:18nguồn sau chọn, A/B/C giữ nguyên,4unit sách vẫn đủ; D thay NPL22 bằng methodweb, giữ NPL27. Input101875→102484byte, library9117/14000byte, C14656/14817byte. [Bản biên tập mới](../.local/ai-paid-web-integration-20261102/Tài-Bạch-editorial-mock.json) có4section: gộp ý tạo/giữ vào lập luận đang có, bỏ phần bổ sung trùng, dùng hình thế cặp làm phương pháp chứ không dự báo kết quả tiền bạc.
- Tật: knowledge/facts/guide nguyên ngoài nhãn retrievalmới; [mock](../.local/ai-paid-web-integration-20261102/Tật-Ách-editorial-mock.json) vẫn `insufficient`,0section. Không suy số lượng hoặc sức mạnh cứu/tác từ lời “nhiều”; T1 vẫn chú giải nội bộ theo cấu trúc.

Các bản trên là **MOCK biên tập bởi Codex, không kết quả Astra**; nằm ở artifact mới. Việc qua validator chỉ kiểm tham chiếu/phạm vi kỹ thuật; luận điểm và vai trò đã được rà riêng với nguồn. Không chấm model từ bản tự biên tập.

**Đánh giá trước API:** Phu và Tài có thể thử một vòng đánh giá **limited** với câu hỏi hữu hạn: Astra có giữ đúng tiền đề, khai thác guide và giảm lặp hay không. Không cần tìm vô hạn một câu nguồn viết sẵn cả tổ hợp mới được thử kiểu tổng hợp giới hạn này. Nhưng chưa đủ để cam kết bài chuyên sâu đầy đủ hoặc đóng khoảng phối hợp Phá–Đà–Hỏa/Liêm–ĐạiHao. Tật không thuộc vòng thử cá nhân; không tự gọiAstra từ đánh giá sẵn sàng này. Cần xác minh lại runtimeQA, budget và giới hạn request cụ thể trước vòng thật được phép.

## 4. Kiểm và bảo toàn

**216/216test,13file đạt trên mã cuối**, gồm15test mới: sourceweb đúng vai trò, hai neo/vòng/quan hệ, metadata/hash/status/URL/symlink/kích thước, không nâng thành direct, giữ nguồn sách/NPL27 và guidePhu cần nguồn hai phía. Giữ log [lượt đầu](../.local/ai-paid-web-integration-20261102/tests-1.log), [lượt lỗi](../.local/ai-paid-web-integration-20261102/tests-final.log) và [lượt cuối](../.local/ai-paid-web-integration-20261102/tests-final-2.log).

Diễn biến cần lưu: suite đầu đạt nhưng kiểm input phát hiện methodgiao dịch bị rơi vì dùng chung4slot; đã giữ4slot sách và chỉ cho web dùng byte dư. Suite tiếp215/216: NPL27 bị Dcap3 đẩy ra. Đã sửa ưu tiên phương pháp khớp cấu trúc trước hướng dẫn chung và thêm kiểm chống mất nguồn; không sửa expected nguồn để bỏ lỗi. Suite cuối216đạt, dry-run giữ đủ các tiền đề đang dùng.

Dry11cung giữ159facts/cung; ngoàiTài, knowledge10cung nguyên. Phu chỉ thêm guide.3mock hợp lệ;8bài thật cũ qua savedprompt/validator và giữhash;19artifactbaseline và mọi artifact1.13 giữhash. Không ghi lại snapshot hoặc result/input cũ. CREATE/GET/queue vẫn dùng savedinput/prompt của job cũ, không chạy lại loaderweb khi đọc/đối soát bài đã lưu.

Node24, không nạp `.env`, keyrỗng/AItắt/DBcổng1, chặnfetch ngoài HTTPmock do test cài. [Typecheck](../.local/ai-paid-web-integration-20261102/typecheck.log) đạt; [build cách ly](../.local/ai-paid-web-integration-20261102/build.log) đạt, BUILD_ID **`ivjOZJ7TYHz1cqLHXROBt`**. Cảnh báo nhiều lockfile giữ nguyên. Không thay `.next` đang phục vụ; không E2E/PDF/mobile vì không sửa UI/PDF. Không xác nhận quyền model hay chất lượng dịch vụ từ HTTPmock.

## 5. Bàn giao kho và phần chưa xong

Index-v114 có17unit;16unit v113 giữ nguyên. [Unit mới](../.local/ai-paid-web-integration-20261102/new-unit.json), [phiếu web](../.local/source-library/web/dl-hao-opposition-20220816.json), [bundle33artifact](../.local/ai-paid-web-integration-20261102/bundle-manifest.json) và [bản sao private](../.local/ai-paid-web-integration-20261102/source-bundle/). Cần cả code và kho đúnghash khi có quyền triển khai sau này; sách/webphiếu vẫn ngoàiGit, không đổi ignore hoặc force-add. Chưa cập nhật runtimeQA nào.

SHA256 index-v114: `a7d6ac7915d04aafdf7dbaf69d6252260eaba4a589affa7819ec091182a0e619`. SHA256 phiếuweb: `ab04e221f2b0284009ca576a5ec2d0605687f228d03e7869b9d81d64b0d68c39`.

PhụMẫu90%; PhúcĐức90%; ĐiềnTrạch90%; QuanLộc90%; NôBộc90%; ThiênDi90%; TậtÁch90%; TàiBạch90%; TửTức90%; PhuThê90%; HuynhĐệ90%. Giữ checklist/status/phạm vi;P09 chưa kiểm model với input hiện hành, mọi `commercialReady=false`. Tật90% chỉ hồ sơT1, không bài sức khỏe cá nhân.

Chưa đạt100% hoặc phát hành: (1) chưa có outputAstra hiện hành được đối chiếu toàn văn; (2) hai tổ hợp chỉ có tổng hợp giới hạn, chưa đủ nội dung chuyên sâu toàn cung; (3) T1 chưa có điều kiện xuất lời cá nhân và còn phát hiện guard câu phủ định rút gọn ở lô trước, chưa sửa trong lượt này. Không che các khoảng thiếu bằng nguồn web chưa xác minh hoặc nângcoverage.

**0CREATE/0GET OpenAI thật,0USD; không worker/supervisor/DBwrite/migration/deploy/QA3062/3070/Live.** Bước tích hợp phương pháp và chuẩn bị input/mock đã xong; mục tiêu nghiệm thu thương mại chưa hoàn tất. Không lấy lời “sẽ test Astra khi đủ tự tin” làm quyền gọi thêm ngay trong lượt nghiên cứu.
