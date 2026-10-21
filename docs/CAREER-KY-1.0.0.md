# Nhánh Công việc Hóa Kỵ — career-ky/1.0.0

Baseline bài đọc1.21.0, mới1.22.0. Cataloginterpretation-1.22.0. Hai rule0.1.0 draft/review=null. Không đổi phép an, snapshot hoặc bảng trạng thái.

## Ứng viên đã kiểm tra

- §8.14 sát tinh: muốn điều chỉnh nhánh nền; đã có vị trí/trạng thái; thiếu phạm vi “gặp”, lượng từ, phối hợp khác trạng thái và Tử–Tướng. Thiếu đặc tả nguồn, ảnh hưởng Kim/1992. Không chặn nhánh độc lập.
- §8.17/20 phụ tá: muốn nhận định hỗ trợ/tăng thêm; có sao tại cung; thiếu toán tử nhóm và nền tăng thêm. Thiếu định nghĩa nguồn, không phải thiếu tất cả dữ kiện.
- §8.32 Kình–Lực đồng cung: điều kiện hình học rõ, lời cục bộ về trở ngại; chưa có mẫuengineđã lưu đủ cặp tạiQuan trong39cặp đốichiếu. Là ứngviên khác, không phải nhánhđượcchọn đợt này.
- §8.19 HóaKỵ: nguồn có nhận định nền và ngoại lệ cùng đoạn. Hai mẫuenginev2 có KỵởQuan:20/05/1998 (ThiênCơKỵ,Thìn),16/05/2000 (ThiênĐồngKỵ,Dậu). Thiếu code xác định/loại ngoại lệ, nay triển khai. Hai hồ sơ chính không bị ép khớp.

## Văn bản và ngữ cảnh

TânBiên PDF164§8.19, số chântrangebook164: “Hay gặp sự phiền lòng, công danh trắc trở” nhưng nếu Nhật–Nguyệt đồng cung Sửu/Mùi thì nguồn chuyển sang hoạnh đạt/hanh thông. Đọc nguyên đoạn và trước/sau§8.14–8.20; ảnhPDF164. Đồngcung định nghĩaTB33§2.8; chủ đềQuan bắt đầuPDF158. Không coi dấu phẩyNhật,Nguyệt làOR: chính cụm “đồng cung” ràng buộc hai sao ởcùngcung. Sửu/Mùi làhai vị trí thaythế, không yêu cầu đồngthờihai cung.

ThiênLương bản298trangPDF31–32 có lờiHóaKỵ và các cáchKhoa/Tý/ThiênLương,LiêmTham/Mệnh/ngũhành. Không có nhánh cùngQuan/điềukiệnSửuMùi thay thế§8.19 trong đoạn đãđọc; khácphạmvi không thànhxungđột. Không ghép ngoại lệMệnh củaTL vàoQuan. Hash nguồn giữ như bộđối chiếu1.21.0.

## Đặc tả lập trình

Q = duy nhất cungQuanLộc. P = ít nhất một sao có scopeorigin, mutagenKỵ rõ tạiQ (major/minor). Không dùng Kỵ ởtam/xung/nhịhợp thaythế.
E = QởSửu hoặcMùi VÀ cảTháiDương,TháiÂm origin ởQ. Không đòi chính tinh độc thủ, không đòi độsáng, không đòi sao được hóa cụ thể.

P=true,E=false → nhánh nền phiềnlòng/trắc trở. P=true,E=true → ngoại lệ phátđạt/hanhthông theo nguồn, loại nhánh nền. P=false → không có claim. P hoặcEunknown → không được xuất lời nền/ngoại lệ như kết luận khẳng định.

Chứng cứ Ppositive là witness cóscope+mutagen+path. Muốn Pnegative phải có danh sách/metadata đầy đủ, mutagentườngminh (rỗng được coi khônghóa). Muốn Efalse: chi hợp lệ ngoàiSửu/Mùi đủ loại điều kiệnvịtrí; ởSửu/Mùi phải đủ danh sáchmajor vàscope đểxácnhận thiếuít nhấtmộtsao. Thiếu chi hoặc danh sách không đủ →Eunknown. Cảhaisao có witnesspositive đủEtrue, không cần suyabsence.

Giới hạn kỹ thuật: profiletanbien-vn-trial-v2 và cổng nguồn/receipt hiệnhành. Rulecũ giữnguyên. StateMethod=none: không đọc bảngTBhayLụcSát1.21.0 nên trạng tháiunknown khôngchặn. Đây là quyếtđịnh đúng vì§8.19 không yêu cầu mức sáng/mờ. Dữkiệnunknown6sát hiện diện trong mẫuengine thật, không cầnđiền thêm72ô.

## Lời luận và giới hạn

Nhánhcục bộ theo sách, không khẳngđịnh biếncố cá nhân, chức vụ, nghềcụthể, thu nhập hay thờiđiểm. Ngoạilệghi rõ thay lời nền, không tuyênbố hóa giải toàncung. Nguồn không nêu ngoạilệkhác trongđoạn không cónghĩa đãchứngminh toànlá số không cóđiềuchỉnh. Nhánh đãđủ điều kiện/ngoạilệ/kếtquả trong phạmvi§8.19, không quảngbá luận đủQuan.

## Nghiệm thu

Hai mẫuengine thật nhánh nền; hai controlKim/1992 không thêmclaim. Ca ngoạilệSửu/Mùi làfixture kỹ thuật sửa sao/chi cóghi rõ, không giả hồsơengine. Đủthiếu từng sao, sai vịtrí, saoKỵcungkhác, thiếu scope/mutagen/chi/danhsách, sao lưu, unknownbrightness, draftgate. Expected từP/E trên, không outputhàm.

39cặpsnapshot/profile: so oldclaims/traces sau khi chỉ loại haiIDmới; kiểmtra input khôngđổi. Hồsơlịch sử giữbyte; tạo bảnmới bằngsaveReading. Các bảntrước của hai mẫu bổsung có thể cũ hơn1.21.0; báo đúng templateVersionđãlưu, không dựng lại rồi gọi là snapshotlịch sử.
