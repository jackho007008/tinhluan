# Trạng thái Lục Sát phục vụ luận giải — 1.0.0

Bản đọc1.21.0, căn cứCôngviệc1.3.0; baseline1.20.0. Phương pháp `satinh-interpretation-states-1.0.0`. Không đổi catalog/claim/engine/bảngTB cũ.

## Tài liệu và kiểm chứng

Danh tính, SHA256 trong `.local/satinh-states-20261012/source-identity.json`: TB277trang; TL298trangScribd769699281. Đối chiếu ảnh TB39,40,114 và TL51,60,138; đọc ngữ cảnh TB113–115, TL50–52,59–62,136–139 và định nghĩaTB32–33 đã xác minh. TrangTL là thứ tựPDF/chântrang n/298, không phải trang sách gốc. Không tuyên bố đọc trọn sách.

## Đặc tả 72 ô trước kiểm thử

Thứ tự chi Tý Sửu Dần Mão Thìn Tỵ Ngọ Mùi Thân Dậu Tuất Hợi.
D=Đắc; H=Hãm; F=thuận vị trí, chưa chốt mức Đắc/Miếu; ?=unknown.

- Kình: ? D ? ? D ? ? D ? ? D ?
- Đà: ? H F ? H F ? H F ? H F
- Hỏa: ? H D D D D D H ? ? ? ?
- Linh: ? H D D D D D H ? ? ? ?
- Không: ? ? D ? ? D ? ? D ? ? D
- Kiếp: ? ? D ? ? D ? ? D ? ? D

TB39§3.14 là tiêu đề chungKình–Đà, ghi đắcThìnTuấtSửuMùi. TB39§3.16HỏaLinh đắcDầnMãoThìnTỵNgọ. TB40§3.21KhôngKiếp đắcDầnThânTỵHợi. Các câu “Hãm địa” ở đây mô tả tính chất, không liệt kê chi nên KHÔNG lấy phần bù làmHãm.

TB114§4.2.21 Phúgiải nêu Hỏa/Linh tọaMệnhSửuMùi “tuy hãm địa”. Lấy riêng dữ kiện trạng thái của sao ở vị trí Sửu/Mùi; đây là hình thức hóa vị trí trong phương pháp mới, không sao chép lời luậnMệnh sangQuan. Ngữ cảnh có Việt/Tham/Vũ, Kiếp tọa/chiếu làm điều chỉnh tổ hợp; không dùng các kết luận đó trong lớp tra trạng thái, không tuyên bố đã hóa giải.

TL60 danh sách vị trí sáu sao trùngTB, trừĐàtứsinh. TL51 kết đoạnThiênLa/ĐịaVõng nêu trực tiếp Đàđắc tứsinh, hãm tứmộ; có đủ chứng cứ Hãm, không suy từ thiếu tên. TL138 trong đoạngiáp nhắcĐàmiếu tứsinh, Kìnhđắc tứmộ. Không có chứng cứ thay đổi vị trí thuận theo ngữ cảnh giáp; giữ cả hai mức tên nguyên văn. Phân loại F chỉ ghi giao điểm thuận vị trí của hai mức, không tạo mứcMiếu hayĐắc giả. exact=null; degreeUnresolved=true. Không dùng F như một giá trị exact trongrule.

## Quyết định nguồn

-22ôĐắc khácĐà:TB đủ, TL xác nhận, giữTB.
-4ôĐàtứmộ:TBĐắc vsTLHãm, cùng sao/chi, xung đột trực tiếp → chọnTL51.
-4ôĐàtứsinh:TB không định danh, TLĐắc/Miếu → bổ sungF, lưu các nhãnnguồn.
-4ôHỏa/LinhSửuMùi: bổ sungTB114, TLchưa có chỉ định cụ thể những chi này trong các đoạnđọc.
-38ô còn lại:unknown. Không lấyiztro hoặcoriginalBrightness.
Tổng:34ô có phân loại vị trí (30nhãn chính xác+4F); so bảngcũ26ô:8ôthiếu được bổ sung,4ôxungđột đổi,38ô vẫnunknown. Sốôkhông phải điểmchấtlượng/sốnhậnđịnh.

## Vị trí và lớp dữ liệu

`bookState` giữ nguyên cho snapshot và mọi rule nguồnTB. Hàm mới bao bọc traTB hiện có, bổ sung/chọn nguồn đúng các ô nói trên. Không xây phép an mới. Kết quả có version/source/evidence/decision/baseline; lấy sao bảnmệnh từsnapshot, giữbrightnessvàsourceStateđãlưu riêng. Không ghi vào sao hoặc originalBrightness.

Lưu toàn bộ kết quả sáusát trongcareerAssessment.interpretationStates của bảnđọc mới. observations và căn cứ sử dụng trạng thái mới; điều kiệnrule/claim vẫn lấy lớp riêng hiện hành. Thiếu tên/chi hoặc sao khôngthuộcphạmvi →unknown, khôngfallback. Sao lưu không được đưa vào lớp này. Các bản cũ đãfreeze không tra lại.

Đọc vị trí TL không có nghĩa chọn phép anKình/Đà theo âm/dương màTL50/138nêu; phần này khác phương pháp hiện tại và bị loại khỏi đợt. Không áp lời Mệnh/hạn củaTL60–62 vàoQuan. Trạng thái mới không quyếtđịnh phạmvi “gặp”, toán tử nhóm hay ưu tiênTử–Tướng. Không có claimB mới; dữkiệnA mới, tổnghợpC còn thiếu.

## Expected hồ sơ chính

KimThoa:ĐàởDần, cũkhôngcóôTB→F theoTL; HỏaởMùi→Hãm theoTB114; LinhNgọ vẫnĐắc. Không đổi vịtrí, lờiCôngviệc.
1992:ĐàởTuất, cũĐắcTB→HãmTL51; HỏaTuất vẫnunknown; LinhDần vẫnĐắc. TuấtlàđốicungQuanThìn không tự sinhclaim§8.14.
Caengine khác ĐàởQuanTuất phải đọcHãm ở căn cứ mới, không thay nhánhThiênĐồng hoặc tự chọn lời sát tinh.

## Kiểm thử và phiên bản

Expected72ô ở trên viết từtrangnguồn; kiểmtraunknown, exactnullF, nguồnchọn, bảngTB khôngđổi, scopesao lưu, bảnfreeze, toàn39cặphồsơ/profile. Không đổiinput. Testphiênbản chỉ cậpnhậtassertionbảnmới, không sửa lịch sử/golden.
