# Kiểm chứng theo phạm vi

<a id="tb-family-phuc-testing-20261026"></a>
## TB–Phụ–Phúc1.78 —26/10/2026,code2e8758a

[Bàn giao](V1-DELIVERY-PLAN.md#tb-family-phuc-delivery-178-20261026). Schema/registration/predicate/owner/render được kiểm trước bộ rộng.8file953/953 đạt (`tb-family-phuc-clauses`,`family-vcd`,`phu-huynh`,`parent-property-void`,`no-dien-phuc`,`customer-editorial-catalog`,`customer-topic-editorial`,`continuous-report`). Sau sửa phần căn cứ mới: đúng2file137/137,so192,typecheck/build cuối đạt.12/12reading-scope+stored-customer-pdf chỉ DBriêng. So192 giải12gốc/11hồsơ,5bổsung,16kếtquảtínhmớiđổi,0sửa/rútclaim/paragraphcũ,0unknownmới;G2khônglộvăn/ID/căn cứmới qua192freeprojection. Không gọi phương diện bắt buộc/chiều sâu khi chưa định nghĩa.

3engine0/99/119 form–lưu–mở/quyền/print/mobile360/390;3PDFthật8/9/9trang đủ19/22/18paragraphfrozen (NFC+khoảngtrắng),đã xemcontact/trangđích5/6–7/5.119gộp2claim,giữparent-child;99baoPhụvàPhúc. P02đơn32/39tái dùng đường chung, kiểm API tạo–lưu–mở; không lặp thêmUI/PDF. QA3062saucutover3form+9APIđạt,12bảnmới/11hồsơgốc+119,khôngorder/mock trênmain. Khôngfullgate/providerngoài/sửaselectorTàicũ.

**Lỗi/lượt kiểm được giữ:** narrowđầu124pass/1fail dofixture54đãcóĐà,mớithêmtrùng; sửafixturekhôngđổinguồn. Lượt kiểmgộp952pass/1fail doassertviếthoa“Cha”khácvănđãduyệt“cha”; sửaassertgiữcopy. Công cụwiređầu dừng ởimport locator sai,dòđúngprefix rồi tiếp phầnchưaáp. UIlượtđầu đườngbackupdùngownerobjectthayowner.hash,đãcopybảnthửcònnguyên; lượttiếp UI bắt thiếu cổngdựán trong phầncăn cứ hiểnthị dùmetadatađãcó. Đã bổsunglimitationscho đúng4rulemới,giữvănchính/predicate,kiểm2file137/137+so192+build+3UI/PDFtrênbảncuối. CutoverlượtđầuđếmnhầmworkerQA3070, dừngtrướcmọiSIGTERM; sửaphạmvi kiểmcheckoutđíchvàgiữriêngQA3070web/worker. Scriptxuấtbefore/afterđầu bịSyntaxErrorlistcomprehension,sửahelperxuấtvăn; khôngchạylạiứngdụng. Genericcustomer-copytestchỉngoạilệ4prefix“Theo Tân Biên”đúngvănchủdựánchốt,khôngđổi expectednguồn/lịchsử.

250tệpcũ+backupgiữnguyên,24tệpmớicopy/hash,DBquyền/hạn/34bàigiữnguyên;engine8file/QA3070giữ,492fileroot/checkoutkhớp,3100dừng. Biênmalformed/Kỵ/chứngnhận tổnghợpchỉfixture;khônggọilàengine thật hoặc sourceđãchứngminhsựkiện. [Log/giới hạn](../.local/tb-family-phuc-20261026/verification-notes.json),[bảo toàn](../.local/tb-family-phuc-20261026/preservation.json).

Cập nhật20/10/2026 sau kiểm ND03; các lệnh mẫu dưới đây cần chọn theo phạm vi, không mặc định chạy toàn bộ. [package.json](../package.json), [vitest.config.ts](../vitest.config.ts), [playwright.config.ts](../playwright.config.ts) là cấu hình hiện có; [kiến trúc](ARCHITECTURE.md) giải thích kho/queue/quyền. Không có Git tại root; xem cách nhận diện code ở ARCHITECTURE.

<a id="efficiency-minimum-testing-20261026"></a>
## Hậu kiểm hiệu suất/retention 26/10 — đề xuất quy trình, không nghiệm thu lại

[Phân tích đầy đủ](V1-DELIVERY-PLAN.md#efficiency-retention-next-177-20261026). Phiên B01/B02 kéo dài 6 giờ 19 phút 56 giây nhưng chưa đo thời gian làm/chờ riêng. Năm log Vitest cộng 29.018 giây, log G2 cuối 3.45 giây chỉ là phần runner có ghi; compile 2.5 giây chỉ là bước thành phần. Không suy thời gian nghiên cứu/coding/debug/UI/PDF/chờ/tổng build từ phần còn lại hoặc mtime.

Quy trình đề nghị: kiểm schema, ID đăng ký, routing, fact→claim→section→customer, chủ đề/G2 và trạng thái hasClaims/unknown trên mỗi đường trước bộ rộng. Chốt nghĩa trạng thái rồi kiểm phần ảnh hưởng, so192 và typecheck/build bản cuối. Gộp kiểm DB quyền khi đường quyền/bản lưu có rủi ro; thay riêng câu căn cứ thì đối chiếu serialization phần đổi, không mặc định chạy lại toàn gate DB. UI/PDF một mẫu mỗi đường khác nhau; bốn mẫu cùng đường qua API smoke là hợp lý. Lưu version/hash/evidence-text/checkpoint từng chặng trước assertion; giữ context trong phiên khi có thể, không ghi cookie/token. Lỗi công cụ kiểm phải sửa cách kiểm theo bằng chứng, không sửa nguồn/lịch sử cho xanh. Mã thay đổi thật thì kiểm lại phần ảnh hưởng.

Snapshot ngay đầu: kiểm TTL hiện có và dùng phiên nghiệm thu mới theo cơ chế chuẩn, không gia hạn phiên cũ. Đọc byte/copy/hash cùng buffer; xác minh bản sao và ghi expiresAt/version/quyền trước test hoặc tích hợp QA. Mỗi bản mới lưu xong thì chụp frozen/evidence ngay vào kho bằng chứng riêng được phép ngoài trial root bị dọn. Bản sao không cấp lại quyền sống. ENOENT phải phân loại đúng owner/expiry/bằng chứng backup, không dùng TTL để bỏ qua file khác hoặc hash đổi. Ghi start/end/duration và chờ/gián đoạn riêng; phần không đo để null.

Hiệu chỉnh retention cũ: 18 file (17 bản đọc + một phiên) đã hết hạn trước lô; phù hợp purge hiện hành nhưng thiếu audit nên không kết luận chắc chắn caller/thời điểm. 16 bản đọc và phiên có bản sao khớp hash, một bản chỉ còn hash. Không gọi là không ảnh hưởng dữ liệu khách chỉ vì QA. SQL READ ONLY hiện tại không tìm thấy quyền/binding/link/recovery cho 17 ID. [Đối chiếu file/quyền](../.local/efficiency-retention-177-20261026/retention-readonly.json). Phiên này không chạy lại test/build/UI/PDF; chưa thay phần mềm hoặc chính sách retention.

<a id="root-gap-batch-testing-20261026"></a>
## Lô B01/B02 — hoàn tất26/10/2026,codeb7083fc

- **297/297qua8file,112ca mới** `vttl-root-batch`;còn`vttl-phuc-liem-sat`,`vttl-no-luong`,`vttl-career-co-am`,`vttl-dien-phu`,`customer-editorial-catalog`,`customer-topic-editorial`,`continuous-report`. Hai trạng thái/bảng riêng,chi khớp/ngoài/thiếuô;TT1/2/vắng/missing;KìnhĐà B01chỉtrựctiếp/B02bốnvịtrí;LiêmSát/TửTham;VCD/cặp/chiếu;cert/list/scope/trùng/unknown,chốngtrùng/editorial/G2/giữlờicũ/trống67đúngphạmvi. [Logcuối](../.local/root-batch-delivery-20261025/tests-final.log).
- So192đúngB01first29/115/118/122/125,B02first67;6khóa gốc,còn481.0chỉbổsung/chiềusâu/sửa-rút;giữmọithànhphầncũ.13báocáođổicăn cứ/trạngthái,vănthấyđổingoàisáuở43/64/133,4ca102/105/180/190giữcâu nhưngthêmcăn cứ.67giữ3traceVCD/undeterminedvàthôngbáocònthiếu;financeAssetschỉthêm1liênkếtunclassifiedcôngviệctrong67,cácfacettiềnbạcnguyên.192freeprojectionkhônglộcopy/ID/unknownmới. [Impact](../.local/root-batch-delivery-20261025/impact192.json).
- Typecheck/buildcuốiđạt;12/12`reading-scope`+`stored-customer-pdf`DBriêng`tinhluan_root_batch_…`/3100. MockTestchỉDBriêng,khôngSePaythật. Engine29Tuất/67Dậu form–lưu–mở/quyền/G2/API/print/mobile360/390,mỗinhánh1PDFthậtđủfrozen:Nô8trang15đoạn,target6;Quan9trang19đoạn,target5.Đãxemcontact/trangtarget/mobile,cảhai chart/sections/palaceskhớpaudit. **B01Dậu/Hợi,B02Tỵ/Sửuchỉfixture**,khôngtìmthêmengine hoặcgọiđãkiểmenginecácchiấy.
- QAchính2formđạidiện+4APIcùngluồngtạo6bảnmới/lưu–mở/version/G2,khôngorder/mock.490file root/QAkhớp,mộtworker,engine6file/QA3070/quyền-hạn/bindings/liênkết/34bàinguyên,Livefalse/Tậtchưapublish. Isolated3100dừng,khôngmigration/backfill/fullgate/providerthật/sửaselectorTàicũ.

**Lỗi từng lượt:** lần1khôngchạytestdoenumreadingTheme`career`khônghợplệ,sửađúng`work`. Lần2có296pass/1fail:B02đãmatchednhưngthiếuregistrationtrongsectionCôngviệc;thêmđúngIDB02vàtemplateversionmới. Lần3có296pass/1fail:asserttestmớiđòigapnullsai,khi67còn3traceVCDcũ;giữtrace/giới hạnvàsửaassertkiểmđúngkhôngcònthôngbáotrốngtoànphần. Lần4vàcuốicùng297pass;sauphânloạiônguồnMùichưa cólàunresolved-adjustmentchứkhôngthiếudữliệukháchđãchạy297vàso192lạicuối. ComparebanđầuđòifinanceAssetsbấtbiếnhoàntoàn;bổsungngoạilệđượckiểmchặtđúngliênkếtunclassifiedB02ở67,khôngsửacodefinance/facet/vănđểlàmxanh. BốntestToànThưcũchỉđổiallowlist/metadatahiệnhành,khôngexpectednguồn/lịch sử.

UI29hailượtđầudừngởassertcăn cứđòinguyêncụm“tập con dự án”;UIthựctếdùng“cổng dự án”,đổiassertharnesskiểmđúngýnghĩavàghiđủtext,khôngsửalờinguồn/ứngdụngchỉđểxanh.Lượtcuối29và67đạtđủmobile/PDF. [Nhật kýkiểm](../.local/root-batch-delivery-20261025/verification-notes.json). Cácbiênnull/malformedđượckiểmtrựctiếppredicate/factmới,khôngtuyênbốmọimodulecũchấpnhậnobjectngoàihợpđồngengine.

**Bảo toàn có ngoại lệ TTL cũ:**hash284fileđầuphiên,266filecòntạibằngbyte;18file1phiêntrialhếthạnđượcmaintenancehourlycũdọn,đốichiếuexpiresAtvàbackupbấtbiến.Khôngmanualpurge/restore/giahạn.Backedup283file,1filehếthạntrướccopychưacóbảncopyđủ.Khôngsửachínhsáchretentionđểxanhhoặcgọi284filevẫncònnguyên. [Receipt](../.local/root-batch-delivery-20261025/expired-history-check.json),[preservation](../.local/root-batch-delivery-20261025/preservation.json),[nghiệmthu](V1-DELIVERY-PLAN.md#root-gap-batch-delivery-177-20261026).

<a id="phuc-liem-sat-testing-20261025"></a>
## Gói Phúc Liêm–Sát Toàn Thư84 —25/10/2026

- **250/250 qua8file**,53 ca mới `vttl-phuc-liem-sat`; còn `vttl-no-luong`,`vttl-career-co-am`,`vttl-dien-phu`,`npl-spouse-vcd-lonely`,`customer-editorial-catalog`,`customer-topic-editorial`,`continuous-report`. Kiểm khớp/no/unknown, Sửu/Mùi và ngoài chi, VCD/thiếu/thêm chính tinh, chiếu không thay tọa, TT/cảhai,4sát×4vịtrí,17 biên cert/scope/TT/chính tinh,8 nhóm biên list/scope/trùng phụ tinh, chống trùng/G2/editorial/giữ lời cũ/trống. [Log](../.local/phuc-liem-sat-20261025/tests-final.log).
- So192 giữ mọi thành phần cũ, đúng2first98/101;0 bổ sung/chiều sâu/sửa-rút/ngoài hai mẫu về văn/nhóm/thông báo/căn cứ khách. Mỗi bản tính mới thêm fact/status/rule/trace và metadata mới; lịch sử không đổi. Khóa gốc487; owner cơ học486 khác thước đo. 192free projections không lộ văn/ID/lý do unknown mới. [Impact](../.local/phuc-liem-sat-20261025/impact192.json).
- Typecheck/build đạt,12/12 reading-scope+stored-customer-pdf bằng DBriêng `tinhluan_phuc_sat_…`/3100. Mock Test chỉ ở DBriêng, không SePay thật. Một engine98 Mùi form–lưu–mở/quyền/G2/API/print/mobile360/390/PDF thật đạt; chart/sections/palaces khớp audit. PDF9trang19đoạn đủ frozen theo NFC+khoảng trắng, lời Phúc trang7, nguồn84/Vũ Tài Lục; đã xem contact9trang/trang7/mobile. Hai chứng kiến engine98/101 Mùi; **Sửu chỉ fixture**, không nhận đã kiểm engine Sửu. Không lặp UI/PDF cho hai mẫu cùng đường.
- QAchính98/101 tạo bản mới/form/lưu–mở/G2/version đạt, không order/mock.286file lịch sử có backup/giữ byte; quyền-hạn/bindings/liên kết/34bài/engine6file/QA3070 nguyên.488file root/checkout khớp,một worker; isolated3100 dừng. Không migration/backfill/fullgate/provider thật/Live hoặc sửa selector tài chính cũ.

**Lỗi đầu/lượt xử lý:** không có test ứng dụng thất bại trong tập đã chạy. Setup prepare lần đầu thiếu `--env-file` dừng vì cấu hình URL chưa nạp, trước tạo package/runtime; chạy lại với env rõ ràng đạt. Kết nối DB lần đầu bị EPERM localhost, chưa tạo DB; lượt có quyền kết nối tạo đúng DBriêng và đạt. Typecheck được kiểm lại sau bổ sung file test vào checkout; build ứng dụng đã đạt và byte ứng dụng không đổi. Ba test nhánh Toàn Thư cũ chỉ cập nhật allowlist hữu hạn/metadata bản mới, không sửa expected nguồn/lịch sử. Không gọi mock là thanh toán/PDF thật. [Chứng cứ/giới hạn](../.local/phuc-liem-sat-20261025/verification-notes.json), [nghiệm thu](V1-DELIVERY-PLAN.md#phuc-liem-sat-delivery-176-20261025).

<a id="phu326-testing-20261025"></a>
## Phu VCD/NPL326 — phần ảnhhưởng25/10/2026,code6faa35f

- **611/611qua9file**,65mớitrong`npl-spouse-vcd-lonely`;còn`vttl-no-luong`,`npl-dien-single-void`,`vttl-career-co-am`,`vttl-dien-phu`,`customer-editorial-catalog`,`customer-topic-editorial`,`continuous-report`,`phu-tu`. Cả3sao/0-1-2-3/VCD-cóchínhtinh/chiếu/TT/đủ21têngiữ/Kỵchứngnhận/23biênthiếutrùngscope/cert/editorial/G2/chốngtrùng/trạngtháiđượckiểm. [Logcuối](../.local/phu326-20261025/tests-final.log).
- So192giữmọinhậnđịnh cũ/fact/rule/trace/nhóm/căn cứ/G2/financeAssets. Đúng3firstPhu7/34/73,0chỉbổsung/0chiềusâu/0sửa-rút nhậnđịnh;3thôngbáotrốngđượcbỏtheodữliệu. **7ngoàimẫu54/138/139/150/155/167/186thêmcăn cứunknownvàthôngbáogiớihạn**:5câutrốngđổi,2giớihạnthêmvàomụcđãcólời,giữnguyênlờicũ.10báocáothayđổihiểnthị,khôngghi“chỉ3báocáođổi”.489gapgốc/488owner cơhọc,42Phuchỉdữkiện+2conditionalchưaápgiữ. [Chi tiết/toànvăn/bảnlưu](V1-DELIVERY-PLAN.md#phu326-delivery-175-20261025).
- Typecheck/buildđạt,12/12`reading-scope`+`stored-customer-pdf`DBriêng`tinhluan_phu326_…`/3100.192freeprojectionkhônglộCOPY/ID/căn cứunknown;3engineform–lưu–mở/API/G2/freePDF403/ngườilạ404/mobile360/390đạt;fullsections/chartkhớpaudit. Print7free/ngườilạkhônglộ/fullđủvăn;PDF7thật8trang18đoạntrùngfrozen(NFC+khoảngtrắng),nguồn326/322,đoạnPhutrang6khôngcâutrống,đãxemảnh/mobile/contact. MockTestorderchỉDBriêng,khôngdịchvụSePaythật;khôngchạylạifullgate.
- QAchính7/34/73bảnmới/version/G2/lưu–mởđạt,khôngorder/mock.278filecũ/quyền-hạn/34bài/6fileengine/QA3070nguyên;486file root/QAkhớp,mộtworker,isolated3100dừng. Khôngmigration/backfill/providerthật/Livehoặcsửatestselectortàichínhcũ.

**Lỗiđầu/lượtsửa:**lượt1có610pass/1failởfixturechồnglời dùngLộcTồnnhưngrulePhucũlàHóaLộc;thayfixturebằngviệcdờisaomangKhoađãcótrongtracevàoPhuvàchứngnhậnlạicùngphâncôngcótrước(khôngtínhHóa),kiểmnhậnđịnhcũcùngtồntại. Khôngsửacâunguồnhoặcexpectedlịchsử. Lượtcuối611/611;typecheckđượckiểmlại,buildmãứngdụngđạt;thayđổicuốichỉfixture. TestTứHóaKỵdùngtrace/phâncôngtổnghợpcóghi“technicalfixture”,khônggọilàengine thật;productionchỉgọi`verifiedNatalTransformations`. CôThầnvàcácbiênmalformedchỉpredicate/factfixture;khôngkhẳngđịnhevaluatorTàicũnhậnmọiobjectnullngoàihợpđồngengine(giớihạncũgiữ). TTthiếutrườnghợphợpđồngvẫncókiểmquaevaluator. TrạngtháitrốngtínhtừhasClaims/groupshiệnhữu,khôngpatchchuỗitheoID;fixturegiữpartiallimitvàemptythậtcũngđạt. Hai lượtgiánđoạn côngcụtrongphiênđượcgiữtrongthờilượngtoànphiên,khôngtrừâmthầm.

<a id="no-luong-testing-20261025"></a>
## Nô Thiên Lương87 — phần ảnh hưởng25/10/2026, codeaf5d7e4

- **616/616 qua8file:**`vttl-no-luong`38mới,`vttl-career-co-am`,`vttl-dien-phu`,`npl-dien-single-void`,`customer-editorial-catalog`,`customer-topic-editorial`,`continuous-report`,`no-dien`. Kiểm đủ12ôtrạngtháiToànThư37,khôngdùngbrightness; cặpĐồng/Cơ,VCD/saođơnkhác;Tuần/Triệt/cảhai;15biênthiếudữkiện;finite3ID/nguồn–dựán/G2/chốngtrùng/receipt/editorialversion. [Logcuối](../.local/no-luong-20261025/tests-final.log).
- So192giữsnapshot/fact/rule/trace/claim/nhóm/văn/căn cứ/G2cũ; financeAssetsnguyên. Đúng44/112thêmvăn,2Nôfirst/0chỉbổsung/0chiềusâu/0sửa-rút;69Nôcòntrống,492gapgốc/491owner cơhọc. **87/107thêm căn cứunknown doTriệt**, khôngđổivăn; phépso cho phépđúng bổsungdiagnosticIDmới vàkiểmđủmọi thànhphầncũ. Khônggọi0thayđổingoài2mẫu ởmọitầng. [Impact/toànvăn](V1-DELIVERY-PLAN.md#no-luong-delivery-174-20261025).
- Typecheck/build đạt;12/12`reading-scope`+`stored-customer-pdf`trong DBriêng`tinhluan_no_luong_…`/3099. Haiengine44/112tínhmới form–lưu–mở/G2/quyềnsởhữu/mobile360/390,chart/toànvănkhớpaudit. MockTestorderchỉ DBriêng. PDFthật44/9trang21đoạn đủfrozenvăn,theoNFC+khoảngtrắng;đoạnNôtrang6,nguồn87/37,đãxemcontact/trang6/mobile. QAchínhhai bảnmới44/112đạtversion/G2/lưu–mở,khôngorder/mock.
- Bảo toàn274filelịch sử/quyền/hạn/bindings/liênkết/34bài/6fileengine/QA3070.484file root/checkoutkhớp,mộtworkerchính; isolated3099dừng. Khôngmigration/backfill/fullgate/providerthật/Live; khôngchạy/sửa selectortàichínhlỗisẵn.

**Lỗi đầu/lượt sửa:** lượt1có614pass/2fail. Một assertionnhãnđúng đãbắt thiếu nhãn`Quy mô người phụ giúp`ởcustomer; sửa điểmhiểnthịđúngIDmới tạiNô. BiênTT`null entry`đượcpredicate/factmớitrảunknown nhưng`executeRules`còn gọi derivedfinance-vcd cũ vàthrow đọc`name`ởnull. Giữ kiểmbiênnull trực tiếppredicate/fact; khôngmởsửa bộTàicũ hoặcgọi đãkiểmpipelinechungvớiobjectnullngoàihợpđồngengine. Các biênthiếudữkiệncòn lại vẫnkiểmqua evaluator. Lượtcuối616/616;typecheck/buildchạylại sau sửa hiểnthị,12G2riêngđạt. Khôngsửaexpectednguồn/lịch sử; hai testU08/U24chỉ cậpnhậtdanh sáchIDđượcmở vàmetadata bảnmới. Lượtđầuphépso táidùngU24đòi`gap=null`, đổi vềyêucầugiữnguyêngapTBvìNôchưagiảiđiềuchỉnh; sauđó ghiđúngdiagnostic87/107vàthẩmtra cácphầncũgiữ. Khôngdùngviệcsửa phépso đểbỏlờihoặcgiấuthayđổi.

<a id="u07-testing-20261025"></a>
## U07/NPL260 — phần ảnh hưởng25/10/2026, code110ff10

- **582/582 qua8file**,31mới trong `npl-dien-single-void`; còn `vttl-career-co-am`, `vttl-dien-phu`, `customer-editorial-catalog`, `customer-topic-editorial`, `continuous-report`, `finance-presentation`, `no-dien`. Kiểm mộtTuần/mộtTriệt/cảhai/vắngTT/VCD/chiếu,14biên thiếu dữkiện,4Cơ–CựMão/Dậu×TT, Tài thuận vẫnunknown, editorialversion/receipt/G2. [Logcuối](../.local/u07-delivery-20261025/tests-final.log).
- So192giữ snapshot/fact/rule/trace/claim/nhóm/văn/căn cứ/G2cũ. Đúng41firstĐiền18/23;0chỉbổsung/0chiềusâu/0sửa-rút/0ngoài41.33ghi chú money-property hiệncó xuất cùng lờiĐiềnmới, khôngtínhthêmgap.494gapgốc/493owner cơhọc. [Impact/toànvăn](V1-DELIVERY-PLAN.md#u07-delivery-173-20261025).
- Typecheck/build đạt trong checkoutU07; DBriêng`tinhluan_u07_…`/3098.12/12 `reading-scope`+`stored-customer-pdf` đạt, mockPDFchỉkiểmquyền. Haiengine49Tuần/52Triệt tínhmới form/lưu–mở/free403/ngườilạ404/mobile360/390khôngtràn; dữkiện/vănkhớpaudit. MockTestorder chỉDBriêng. HaiPDFthật9trang18/20đoạn từfrozen khớpNFC+khoảngtrắng, đủcâuđiềukiện vànguồn257/260–261; đãxemcontact/trang5/mobile. QA chínhhai bảnmới/version/G2/lưu–mởđạt, khôngorder/mock.
- Bảo toàn270filelịch sử, quyền/hạn/bindings/liênkết,34bài,6fileengine,QA3070.482file root/checkoutkhớp, mộtworkerchính; isolated3098dừng saukiểm. Khôngmigration/backfill/fullgate/providerthật/Live.

**Lỗi đầu/từng lượt:** lượt1 transform trùngbiến`nd` tronglabelmapper, sửa tênbiếnU07. Lượt2có3assertionmới sai(vănnhãn căn cứ, fixtureTàiởTT, prefixfactfinance); sửa assertdùngvănthực vàfixtureTàiđúngchiHợi. Lượt3còn1selectorfixture nhầm, sửa ID`tanbien.finance-vu-phu`;31testmớiđạt. Lượt mở rộng9file có596pass/1fail tài chínhcũ: row5trong`tuan-triet-20261013/readings.json`đãcóU08`vttl.dien-phu-hoi-scale`, khôngphảiNPLmới; expected`creation-loss`/Điềngap đãlỗi ởbaselineU24, actual`money-property,creation-loss`/khônggap. Thửchỉnhassert rồixácđịnh ngoài phạmvi, **đã trả`finance-assets.test.ts`vềnguyênHEAD**, khôngsửaexpectednguồn/lịch sửcho xanh. Lỗi này vàOPEN-TEST-02khôngđượcgọiđãsửa hoặc toàngateđạt. Lượtcuối8file582/582;12G2riêngđạt. Pythonmặcđịnh thiếupypdfium2, dùngruntimeđónggói hiệncó, khôngcài môi trường.

## 1. Chọn mức kiểm

- **Tài liệu:** đọc lại ý nghĩa/quyết định, kiểm file/link/anchor và diff. Không chạy app, test/build, migration, PDF hoặc hash toàn kho.
- **Biên tập thuần draft CMS:** kiểm đúng bản lưu/trạng thái và source; không cần gate ứng dụng nếu không sửa renderer. CMS ghi dữ liệu cần đúng phạm vi được giao; không thuộc phiên tài liệu.
- **Renderer/rule:** test file liên quan + typecheck/build nếu code thay; thêm so ID, facts, relations, điều kiện/ngoại lệ, không chỉ đếm claim. Lưu/mở lại/mobile theo tác động. Chỉ PDF đại diện nếu phần dựng PDF/văn cần kiểm.
- **Quyền/API/queue:** integration PostgreSQL riêng + endpoint đọc/print/PDF chéo phiên, hạn/thu hồi/idempotency. Mock PDF chỉ kiểm đường quyền, không xác minh tệp PDF thật.
- **Provider:** test local và thao tác thật ghi riêng. Google mocked khác OAuth thật; webhook local khác SePay; SMTPaccepted khác nhận thư. Không tự gửi email ngoài địa chỉ QA, không Live.

## 2. Lệnh hiện có và cách chạy an toàn

Vitest include `tests/**/*.test.ts`, chạy file tuần tự (`fileParallelism:false`), timeout30s. Tên `.test.ts` **không đồng nghĩa unit thuần**: nhiều file dùng `pool` và ghi DB.

```sh
# Ví dụ test renderer thuần, sau đọc imports/setup của chính file
node node_modules/vitest/vitest.mjs run tests/encyclopedia-renderer.test.ts

# Integration: thay đường dẫn bằng env RIÊNG đã chuẩn bị, không dùng .env QA chính
node --env-file=/absolute/path/to/isolated-test.env node_modules/vitest/vitest.mjs run tests/reading-scope.test.ts tests/customer-accounts.test.ts

# Khi task code yêu cầu, chạy trong checkout thử được chọn
npm run typecheck
npm run build

# E2E lựa chọn, server thử đã chạy; không mặc định dùng QA chính
E2E_ORIGIN=http://localhost:3005 node --env-file=/absolute/path/to/isolated-test.env node_modules/@playwright/test/cli.js test tests/e2e/customer-journey.spec.ts
```

Đường env trên là placeholder, chưa phải cấu hình đã tạo. Trước integration/E2E: xác nhận `DATABASE_URL` là DB riêng, schema cần thiết đã có; các `TRIAL_READING_DIR`, `INTERNAL_READING_DIR`, exports/mail/file store trỏ kho riêng; provider/mock/test flags đúng ca, Livefalse. Không chỉ thay origin mà vẫn nối DB chính. Test có thể để lại dữ liệu mặc dù `afterAll` chạy; đọc cleanup từng file.

`npm test -- tests/<file>.test.ts` trong package **tự nạp `.env`**; chỉ dùng khi đã bảo đảm env của checkout đó cách ly. `npm run test:e2e -- <spec>` chạy Playwright, không tự khởi động webServer; `baseURL` mặc định localhost3000, Chrome channel, workers1,retries0. `npm run db:migrate`, `worker`, `reconcile`, `data:purge`, `data:delete` là lệnh **có tác động dữ liệu**, không phải kiểm đọc; không chạy như bước setup mặc định trên QA chính.

Cấu hình [playwright.stability.config.ts](../playwright.stability.config.ts) chỉ nhận localhost3005/3006, ba spec chỉ định. [saved-reports fixture](../tests/e2e/fixtures/saved-reports.ts) yêu cầu DB loopback trùng `E2E_ISOLATED_DATABASE` có prefix `tuvi_stability_`. [worker fixture](../tests/e2e/fixtures/worker.ts) tự spawn worker bằng process.env cho payment journey; không chạy chồng worker, ca fault-injection retry phải theo spec riêng không worker.

## 3. Bản đồ test theo phần thay đổi

- **Đầu vào/engine/receipt:** [birth-validation](../tests/birth-validation.test.ts), [customer-birth-interval](../tests/customer-birth-interval.test.ts), [dynamic-reading](../tests/dynamic-reading.test.ts), [chart-integrity](../tests/chart-integrity.test.ts). Không import cùng engine làm expected rồi gọi kiểm chứng độc lập.
- **Nội dung gần nhất:** [family-extension](../tests/family-extension.test.ts), [kin-coverage](../tests/kin-coverage.test.ts), [di-vu-tu-mo](../tests/di-vu-tu-mo.test.ts), [di-vcd](../tests/di-vcd.test.ts), [di-vcd-sun-moon](../tests/di-vcd-sun-moon.test.ts). Expected từ đặc tả/source, không điều chỉnh hàng loạt snapshot cho xanh.
- **Tổ chức/văn:** [continuous-report](../tests/continuous-report.test.ts), [customer-reading](../tests/customer-reading.test.ts), [customer-editorial-catalog](../tests/customer-editorial-catalog.test.ts), [customer-basic-selection](../tests/customer-basic-selection.test.ts), [finance-presentation](../tests/finance-presentation.test.ts). Giữ ngoại lệ, các vế khác chiều, quan hệ; không test chỉ lặp literal implementation.
- **G2/quyền công khai:** [reading-scope](../tests/reading-scope.test.ts), [public-trial](../tests/public-trial.test.ts), [public-trial-pdf](../tests/public-trial-pdf.test.ts). Kiểm cả serialized response/print/evidence, không chỉ trạng thái nút.
- **Google/recovery:** [customer-accounts](../tests/customer-accounts.test.ts), [reading-recovery](../tests/reading-recovery.test.ts), [gmail-smtp](../tests/gmail-smtp.test.ts). `customer-accounts` mock Google và PDF nhưng dùng PostgreSQL; không gọi đây là Google/PDF thật.
- **Đơn/worker/payment:** [core-orders](../tests/core-orders.test.ts), [test-checkout](../tests/test-checkout.test.ts), [sepay-test](../tests/sepay-test.test.ts), [sepay-reconcile](../tests/sepay-reconcile.test.ts), [database](../tests/database.test.ts). Kiểm tài khoản/tiền/mã, aliastransaction, duplicate/retry, quyền/hạn và artifacthash.
- **Admin/CMS:** [admin-g5](../tests/admin-g5.test.ts), [admin-operations](../tests/admin-operations.test.ts), [encyclopedia](../tests/encyclopedia.test.ts), [encyclopedia-renderer](../tests/encyclopedia-renderer.test.ts). Đọc trước file nào có DB; kiểm draftkhônglộ và role, đừng dùng Google session làm admin fixture mặc định.
- **PDF thật:** [stored-customer-pdf](../tests/stored-customer-pdf.test.ts), pipeline [customer-pdf](../lib/internal-review/customer-pdf.ts). Một ca thực cần Chrome/web đúngorigin, quyền, so text frozen, xem ảnh mọi trang đại diện; test giả trả `%PDF-test` không đáp ứng.
- **E2E:** [customer-journey](../tests/e2e/customer-journey.spec.ts), [customer-system](../tests/e2e/customer-system.spec.ts), [customer-retry](../tests/e2e/customer-retry.spec.ts), [reading-stability](../tests/e2e/reading-stability.spec.ts). Spec cũ có thể kiểm nhánh legacy: đọc assertions/setup trước chọn, không gọi mọi spec bao phủ luồng1.53.

## 4. Fixture, bộ192 và mức bằng chứng

[customer-reading-samples.json](../fixtures/customer-reading-samples.json) là nhóm cấu trúc dùng lại. Bộ192v2 và diff mới nhất nằm trong hồ sơ lô được liên kết từ [kế hoạch](V1-DELIVERY-PLAN.md), ví dụ [impact192](../.local/family-scope-20261020/impact192.json). Ghi snapshotID/hash riêng; nhiều bản của cùng snapshot không thành nhiều mẫu độc lập.

- Engine thật chứng kiến nhánh có thể xảy ra trong miền đã tìm; fixture hoán đổi sao/trạng thái kiểm điều kiện, không chứng minh khả đạt engine.
- Không khớp rule không luôn là nguồn thiếu; thiếu receipt/dữ liệu phải phân biệt ngoài điều kiện/ngoài phạm vi.
- Chín Di còn chặn không đọc lại nguồn cũ khi chưa có bằng chứng mới. Bốn cặp TửVCD mới trong lô1.52 còn chỉ fixture theo hồ sơ; không nâng thành E2E.
- Mẫu khớp, near miss, thiếu/mâu thuẫn dữ liệu, ngoại lệ, đảo chiều quan hệ phải theo source decision table. Unit/integration đạt không chứng minh tử vi đúng hay đủ12cung.

## 5. Lỗi mở và kết quả cũ còn giới hạn

**OPEN-TEST-01 — đã khép trong ND03 ngày20/10/2026.** `customer-basic-selection.test.ts` còn đòi `whole-topics-1.0.0`; hợp đồng đã là `whole-free-groups-1.1.0` từ1.51, gồm key-points nguyên nhóm miễn phí và tối đa3 nhóm còn lại. Lượt đầu ND03 tái hiện lỗi; sửa expected theo hợp đồng G2, kiểm toàn bộ paragraph bằng bản chi tiết, không trùngID, highlights không lặp ở phần còn lại và không lấy đoạn khóa. Không đổi expected bản lịch sử. Assertion câu/tiêu đề trong `customer-reading.test.ts` cũng đổi thành kiểm quan hệ unresolved có đủ các bên và đúng thứ tự trước nhà đất, vì ND03 chủ đích đổi văn/tiêu đề. Không bỏ hoặc skip kiểm.

Lượt đầu20đạt/2lỗi tại4file; lượt sau26/26 tại5file; cuối sau sửa chỗ đặt mục tài chính27/27. [Log đầu](../.local/nd03-20261020/tests-first.log), [cuối](../.local/nd03-20261020/tests-final.log). G2 riêng6/6 trong database `tinhluan_nd03_*`, [log](../.local/nd03-20261020/g2-tests.log). Typecheck/build cuối đạt; [nghiệm thu](../.local/nd03-20261020/ban-giao.md) ghi phạm vi và lỗi setup. Không chạy các file hoặc toàngate ngoài phạm vi. Không có fail/skip trong tập cuối đã chạy; điều này không chứng minh các phần chưa chạy đều xanh.

[tests-focused-final.log](../.local/family-scope-20261020/tests-focused-final.log) ghi619passed; [g2-tests.log](../.local/family-scope-20261020/g2-tests.log) là lượt6case riêng. Các lượt cũ này không đồng nghĩa toàngate xanh; OPEN-TEST-01 chỉ được khép bởi lượt ND03 nêu trên. [typecheck](../.local/family-scope-20261020/typecheck-final.log), [build](../.local/family-scope-20261020/build.log), [PDF](../.local/family-scope-20261020/pdf-check.json) là bằng chứng lô trước, không phải kiểm mới trong phiên tài liệu.

Danh sách này chỉ ghi lỗi mở tìm được trong tài liệu gần nhất và assertion đã đọc; không cam kết không còn lỗi ở phần chưa chạy. Timeout/rerun phải ghi riêng; không xóa/skip/làm yếu assertion hoặc sửa expected lịch sử. Bằng chứng provider thật xem các bàn giao G1a/G4/SePay/email từ HANDOFF, không thay bằng kết quả mock.

## 6. Kết thúc một lượt kiểm

Ghi cwd/codeidentity, envđích khôngsecret, lệnh, files/cases, kết quả từng lượt, lỗi và thay đổi sau kiểm, fixturesvsengine/providerthật, phần chưa chạy. Nếu sửa code saugate, chỉ nêu phần kết quả còn hiệu lực; không chạy lại toànbộ trừ tác động yêu cầu. Task tài liệu kiểm link/diff là đủ; không dùng nó để báo ứng dụng đã được nghiệm thu lại.

## ND04 Phụ/Huynh — 21/10/2026

Baseline `main@1fa0829`, đầu lô sạch. Code cuối phục vụ từ `.local/vcd-20261021/qa-final`; root/QA trùng byte các file ứng dụng đổi. Chỉ sửa tài liệu sau lượt kiểm cuối.

- `node node_modules/vitest/vitest.mjs run tests/family-vcd.test.ts tests/phu-huynh.test.ts tests/family-extension.test.ts tests/di-vcd.test.ts tests/di-vcd-sun-moon.test.ts tests/customer-editorial-catalog.test.ts tests/customer-topic-editorial.test.ts tests/continuous-report.test.ts`: **679/679,8file**. [Log](../.local/vcd-20261021/tests-final.log).
- `node .local/vcd-20261021/run.mjs scope-test`: **6/6**, `reading-scope.test.ts` trong DB riêng tạo mới; không QA chính. [Log](../.local/vcd-20261021/g2-tests.log).
- `node .local/vcd-20261021/run.mjs typecheck` và `build` gọi `npm run typecheck/build` trong checkout QA: đạt. Build một lượt; typecheck lượt đầu có2TS2790 do test delete thuộc tính bắt buộc, sửa castfixture rồi đạt.
- `.local/vcd-20261021/compare.ts`: so đủ192, giữ claims/facts/rule/trace/relations cũ, ND01/Di/ND03 và G2. Lượt đầu bắt thay metadata B, đã tách B-vcd để giữ nguyên B; lần cuối đạt. Không thay expected lịch sử.
- Các lỗi setup khác: fixture place trống bị validation; search chọn1971ngoài miền. Sửa fixture và phạm vi tìm; không tính output lỗi thành mẫu. Tìm1.440input hợp lệ ngoài192 có15nhánh/14input;18nhánh chỉfixture. Test nguồn khớp/không khớp/unknown/TT/ngoài bảng không thay chứng kiến engine.
- Hai phiên khách qua form → lưu/mở lại; fullPDF403 trước grant, chéo đọc/PDF404; hai đơn **mock** nội bộ để kiểm toàn bài. Mobile360/390/căn cứ; PDF8trang,18đoạn đúng bản lưu, đã xem đủ ảnh. Không báo mock là SePay thật. [Bằng chứng](../.local/vcd-20261021/public-acceptance.json), [PDF](../.local/vcd-20261021/pdf-check.json).

Không chạy toàngate, bộPDF hoặc nghiệm thu provider. Lượt cuối các file đã chạy không fail/skip; phần chưa chạy không được tuyên bố đạt. Bảo toàn117file báo cáo/103ID,35file phiên,14filecode bảo vệ và các dòng quyền/link/binding cũ;34bài công khai không đổi. [Manifest](../.local/vcd-20261021/preservation.json).

## Sửa chính xác hai câu tọa thủ — 21/10/2026

Baseline `1d6caa3`, working tree sạch. Chạy Vitest tại5file: `phu-huynh`, `family-vcd`, `customer-editorial-catalog`, `customer-topic-editorial`, `continuous-report`. Lượt đầu662/662 nhưng so192 bắt mẫu ghép Cơ–Cự/Kỵ còn lời sai; sửa mẫu ghép. Lượt tiếp661đạt/2lỗi: expected cũ yêu cầu “xa cách” và quy đối tượng con–cha mẹ cho câu hòa khí chung. Đối chiếu PDF127/128 rồi thay bằng kiểm câu độc lập và đủ hai khả năng Kỵ; kiểm dữ liệu fixture lịch sử nguyên vẹn, không đổi expected bản lưu. Lượt cuối **663/663,5file**, không skip.

`node --import tsx .local/family-accuracy-20261021/compare.ts`:192 mẫu, chỉ hai rule đổi claim/căn cứ/văn; tập khớp, facts, relations và tất cả33VCD không đổi. Không tìm mẫu cho18fixture-only. Chuẩn bị/typecheck/build ban đầu thiếuenv, runtime báo Invalid URL trước chạy npm; sau nạp cấu hình đúng typecheck/build đạt. Sau chỉnh test chạy typecheck cuối đạt, không đổi app sau build. Không chạy toàngate.

Hai hồ sơ qua form công khai, reload và full grant mock trả đúng bản lưu; G2 không lộ lời khóa, PDF403 khi thiếu full, chéo phiên đọc/PDF404; mobile360/390 và căn cứ đạt. Không xuất PDF mới hoặc báo đã kiểm lại tệp PDF. [Log/đầu ra](../.local/family-accuracy-20261021/ban-giao.md). Bảo toàn120file báo cáo/37file phiên/14filecode và các dòng quyền cũ;34bài công khai không đổi. QA3070 giữ nguyên.

## Tử–Phu21/10/2026 — 1.56.0

Baseline28328cc sạch, code8776d6e. Vitest tại `kin-coverage`, `phu-tu`, `customer-editorial-catalog`, `customer-topic-editorial`, `continuous-report`: cuối436/436. Lượt đầu429đạt/1lỗi vì assertion chữ ly tán/phiêu bạt của Tử dùng chung IDseparation cho Phu; sửa điều kiện test đúng cung, không sửa lời nguồn cho xanh. Sau lần lượt433,435,436đạt khi bổ sung Tướng và ánh xạ căn cứ. [Log cuối](../.local/kin-batch-20261021/tests-evidence.log). So192 giữ tất cả lời/facts/traces/relations/văn cũ và G2;37claim mới,37snapshot. Hai đầu vào mới có chủ đích, không quét;2nhánh mới chưa có engine ngoài fixture.

G2 `reading-scope`6/6 trong DB mới `tinhluan_kin_1792551726765`; lần đầu sandboxEPERM localhost dừng trước tạoDB, lần có quyền kết nối đạt. Schema chỉ khởi tạo DB riêng rỗng, không migration/restore QA. PDFmock6/6 trong cùng môi trường riêng. Typecheck/build cuối [đạt](../.local/kin-batch-20261021/build-evidence.log); không chạy toàngate.

QA3082 riêng: ba lượt UI (2+3+3bản/đơn mock, chỉ3cấu trúc engine; không đếm bản trùng thành mẫu mới). Lượt cuối3/3 form→lưu→full→reload nguyên văn, mobile360/390/căn cứ, khóa payload/PDF403 và chéo đọc/PDF404. PDF thật8trang,17đoạn khớp frozen; kiểm đủ ảnh. Lượt đầu bắt mục lục trống vì thiếu1.56 trong allowlist paginator; chỉ thêm phiên bản mới. Lượt ảnh căn cứ bắt thiếu ánh xạ facts; thêm cho đúng16nhánh mới, không sửa lời lịch sử. TríchPDF ban đầu thiếu pdftotext và pypdf hệ thống; dùng Python/runtime đi kèm đạt, không cài phụ thuộc mới. [Kết quả cuối](../.local/kin-batch-20261021/public-acceptance.json), [PDF](../.local/kin-batch-20261021/pdf-check.json).

QA3062 tích hợp cùng DB/kho sau khi so byte checkout với commit:3bản mới qua form đúng1.56/1.53, free/reload và403đạt; không đưa đơn mock vào QA chính. Bảo toàn122filebản/39filephiên/14filecode và các dòng quyền/binding/link cũ;34bài công khai nguyên vẹn. QA3070 giữ PID94421. Không nghiệm thu lại Google/SePay/SMTP thật hoặc tunnel. [Bảo toàn](../.local/kin-batch-20261021/preservation.json), [đích](../.local/kin-batch-20261021/runtime-target.json).

## Bốn mẫu được duyệt — 1.57.0,21/10/2026

Baseline0613901; code3bff73c. `kin-approved`, `kin-coverage`, `phu-tu`, `customer-editorial-catalog`, `customer-topic-editorial`, `continuous-report`:447/447, lần đầu đạt. Kiểm fixture đúng/sai cung/chi, sao lưu, chứng nhận thiếu/mâu thuẫn, extra chính tinh, G2 và trạng thái unknown/outcomeApplied=false khi dựng/lưu văn. Bốn mẫu engine thực từ192 được xác minh qua form; fixture không thay chứng kiến engine. G2 riêng6/6 trong DB `tinhluan_kin_approved_1792554113797`; PDFmock6/6; typecheck/build checkout riêng đạt.

So192 giữ mọi facts/rules/traces/claims/văn/relations cũ và G2.41snapshot đổi:17Tử mới có nhận định,22Tử bổ sung;2Phu chỉ chú giải điều kiện. QA3083:4mẫu full grant qua đơn mock, lưu/mở/mobile360/390, khóa payload/PDF403 và chéo đọc/PDF404. PDF thật8trang/17đoạn nguyên văn, kiểm ảnh8trang; thiếu fitz ở runtimePython nên dùng Poppler/pypdf, không có lỗi ứng dụng hoặc sửa expected để xanh. QA3062:4mẫu mới qua form/reload đúng1.57/catalog1.54; không mockorder vào QA chính.181file lịch sử/phiên/code và quyền/link/binding,34bài công khai giữ nguyên. [Bằng chứng](../.local/kin-approved-20261021/ban-giao.md). Không kiểm toàn gate, provider thật/tunnel; QA3070 và Livefalse giữ nguyên.


## Lô Nô–Điền–Phúc 1.58 / catalog1.55 — 21/10/2026

Baseline9f8d407/code3bff73c sạch;192 report1.57 dựng lại khớp. Code `e7bd1e4`. Thư mục bằng chứng `.local/no-dien-phuc-20261021/` (local/ignore; không force-add). Phần ảnh hưởng:

- `tests/no-dien-phuc.test.ts`, `no-dien`, `phuc-di`, `kin-approved`, `customer-editorial-catalog`, `customer-topic-editorial`, `continuous-report`:842/842 ở lượt nhóm cuối; thêm kiểm Tang Môn vòng bản mệnh làm file mới41/41, tổng843 kiểm riêng biệt. Cấu trúc đúng/sai cung/chi, scopeorigin/year, thiếu chứng nhận/phủ định, TT, OR/AND nguồn, trạng tháiKình, G2/văn khách. Fixture gán sao rõ là kỹ thuật, không engine thật.
- `compare.ts`:192snapshot, giữ nguyên oldfacts/rules/traces/claims/P2/quan hệ tại cung và văn/căn cứ cũ. Đoạn liên kết Tài–Điền có thể thêm thành viên mới qua pipeline chung; không đòi byte-identical toàn đoạn khi căn cứ mới được thêm. G2 policy toàn192 bằng baseline.33snapshot đổi; số trống và mới/bổ sung xem impact192.json.
- Typecheck/build production đạt trong checkoutqa-final, không test/build lại vô cớ.6/6reading-scope vớiDB riêng `tinhluan_no_dien_phuc_*`;6/6stored-customer-pdf dùng mock renderer, không gọi làPDFthật.
- QA3084 cô lập:5lượtform Lập lá số (4đầu vào khác nhau), đầy đủ→API/DOM giữ nguyên bản lưu; quyền full từ thanh toán mock cục bộ, không SePaythật. Khóa không lọt freepayload/DOM; freePDF403; chéo phiên đọc/PDF404; reload đúng. Mobile360/390 không overflow, căn cứ mở/thu được. PDFthật9trang từ endpoint:19đoạn frozen đủ qua pypdf, đã xem ảnh toàn9trang và mobile. Không cắt điều kiện/ngoại lệ. QA3084 đã tắt saukiểm.
- QA3062 sau đổi đúngweb/worker:5lượtform tạo mới/reload đúng1.58/catalog1.55, chỉ quyềnfree; không giả thanh toán trênDBchính.175file cũ giữhash;26access_tokens/23binding/18link, nội dung34bài công khai giữ nguyên. QA3070pid94421/cwd cũ nguyên; Livefalse. Serving-code.json ghi commit/hashroot=checkout.
- Engine192 có7/9nhánh mới; Cự–Hỏa và Kỵ–Không–Kiếp chỉfixture. Tìm có chủ đích tối đa3ngày liền kề cho5cấu trúc, ghi attempts;2mẫu ngoài192 thật quaform là nữ21/02/1978 giờSửu và nữ07/11/1978 giờTỵ. Không lấy tìm mẫu làm cách tăng độ phủ.

Lỗi đầu và cách xử lý:8assertionfixture fail vì fixtureVCD đổi nhầm cung rỗng, không có chứng nhận đủTứHóa để khẳng định vắngKỵ; sửa fixturechứng nhận, cặpTTkề nhau. Comparator cũ bỏ cả đoạn liên kết có thành viênmới, làm sai kiểm“oldparagraph”; đổi kiểm bảo toàn văn/membercũ, không đổi expectednguồn/lịch sử. Tang Môn thực tế nằm vòngsuiqian12: dùng evaluatorvòng chung, thêm kiểm không chấp nhận phụ tinh giả. Lượt DB đầu bị sandboxEPERMlocalhost, QA3084 chưa khởi động; chạy lại được quyềntruycậpDBriêng và đạt. Lượt mẫu mới đầu chưa cóĐiền sau ba ngàyliềnkề: giữ kết quảâm, không tìm hàngloạt; dùngĐiền từ192và2Phúcngoàibộ. Không chạy fullgate, không kiểm SePay/emailproviderthật trong lô.


## Lô Quan–Tài 1.59 / catalog1.56 — 21/10/2026

Baseline `main` sạch `e9fdbbd` (codee7bd1e4),192report dựng lại khớp1.58. Code `bb230d5`, bằng chứng `.local/quan-tai-20261021/` local/ignore, không force-add.

-156/156 tại `quan-tai`, `career-closing`, `customer-editorial-catalog`, `customer-topic-editorial`, `continuous-report`;128/128 tại `finance-assets`, `finance-expansion`, `finance-presentation`, `career-batch`, `career-occupations`: **284 kiểm tại10file**. Kiểm đúng/sai cấu trúc, saiThân, sao thiếu/sai cung/sao lưu, chứng nhận thiếu, giữ toàn câu mốc30/ngoài30/vềgià; không chọn kết quả theo tuổi/nămxem/giới, không tự thêm độ sáng hoặcTT. Không chỉnh expected nguồn/lịch sử.
- Rà nhãn phát hiện câu giàu ngoài30 không có căn cứ để xếp“Nguồn thu”; bỏ phân loại thêm, dùng“Tiền bạc”củaND03.39/39 kiểm lại tại3file (thuộc284 phía trên); typecheck/build chạy lại sau sửa và đạt. Lượt UI đầu giữ riêng public-acceptance-first.json; UI cuối không dùng nhãn cũ. Không có assertionfailed trong các lượt đã chạy. Bản đầu so192 có versiontrìnhbày cũ do chưa đổi chuỗi dấu nháy; đã bắt bằng kiểmversiontrướcbuild và chạy lại so192 với1.59, không sửa nguồn/expected.
- `compare.ts` giữ facts/rules/traces/claims/P2/quan hệ cũ, văn/member cũ và G2 trên192;7snapshot thêm lời. Quan28→24 (4mới/1bổ sung), Tài21→21 (0/2). Cả3nhánh có engine192, không fixture-only. Tìm hữu hạn tối đa3ngày lân cận cho mỗi3cấu trúc;2mẫu ngoài192 thật, không mở quét engine hàng loạt.
-6/6`reading-scope` dùngDBriêng `tinhluan_quan_tai_*`;6/6`stored-customer-pdf` mockrenderer. Không lấy6PDFmock làm bằng chứngPDFthật. Typecheck/build cuối ởcheckoutqa-final đạt; root và các file đổi ởcheckout trùng hash phục vụ.
- QA3085:3mẫu qua form, freepayload/DOMkhônglộlời khóa, freePDF403, chéo phiên đọc/PDF404; full bằng thanh toán **mock** chỉDBriêng, khôngSePaythật. Lưu–mở lại đúngtoànvăn, mobile360/390 khôngoverflow vàcăn cứmở/thuđược. PDFthật8trang từendpoint,17đoạnfrozenđủ qua pypdf; đã xemảnh8trang vàmobile. QA3085 đãtắt.
- QA3062 saucutover:3mẫu form mới đúng1.59/catalog1.56, reloadđúngfree, khôngtạođơnmockởQA chính.186file cũ giữhash;26token/23binding/18linkvà34bài côngkhai nguyên. Web81341/worker81345đúngcheckout, QA3070pid94421/cwdnguyên, Livefalse. Khôngtestproviderthật hoặc chạytoàngate.

Mẫu ngoài192: nam20/02/1978giờTỵ (QuanVũ–Tham), nữ05/05/1988giờTỵ (TàiVũ–Tham); Nhật–Cự/Thân dùng mẫuengine192nam06/05/2008giờSửu. Fixture hoán đổisao chỉkiểm logic. Bằng chứng: baseline.json, impact192.json, representative-attempts.json, public-acceptance.json, main-acceptance.json, pdf-check.json, preservation.json, db-after.json, serving-code.json.


## Tài VCD trực tiếp1.60 — 21/10/2026

Baseline `main@80d9232` sạch, code `48683ce`; không chạy toàn gate. Bằng chứng `.local/finance-vcd-20261021/` ngoài Git; [bàn giao](../.local/finance-vcd-20261021/ban-giao.md).

- `finance-vcd`, `void-palace`, `finance-presentation`, `customer-editorial-catalog`, `customer-topic-editorial`, `continuous-report`: **68/68 tại6file**, lượt đầu và cuối sau bổ sung kiểm căn cứ. Không fail/skip. Kiểm đúng/sai/unknown, trạng thái ở chi thật, TT đối cung/cả hai TT, thiếu/trùng/sao lưu/cặp TT sai; cả hai Nhật–Nguyệt sáng giữ ngoài tập con kể cả không chiếu. Fixture không chứng minh khả đạt engine.
- Dựng lại đủ192 khớp baseline1.59; thêm một fact/rule, bốn snapshot thêm claim, **1Tài mới có nhận định/3bổ sung**. Facts/rules/traces/claims/P2/relations/văn/member cũ và G2 nguyên. Phu49 không đoạn +2 chú giải chưa áp vẫn là51 chưa có nhận định. Ba mẫu88/53/150 qua engine/form; ba ngày lân cận88 đều không khớp, giữ kết quả âm, không gọi bất khả đạt.
- **6/6 reading-scope** ở DB mới `tinhluan_finance_vcd_1792571439851`; **6/6 stored-customer-pdf** với renderer giả. Lượt DB đầu bị sandboxEPERM trước tạo DB; chạy lại với quyền loopback đạt. Typecheck đầu4TS2741 do fixtureTT thiếu `source`; sửa fixture rồi đạt. Build đầu đạt; sau thêm ánh xạ căn cứ, build cuối đạt. Không sửa ứng dụng sau đó.
- QA3086 cách ly: hai mẫu đầu rồi bổ sung riêng mẫu Tài trước trống, tổng3bản/3đơn mock và3cấu trúc. Form → miễn phí → full mock → reload giữ toàn văn. Không lọt lời khóa payload/DOM; freePDF403, chéo phiên đọc/PDF404; mobile360/390 và căn cứ đạt. Hai PDF thật9trang/20đoạn và8trang/14đoạn khớp frozen; đã xem contact mọi trang và trang chứa đoạn mới. Đọc đủ toàn văn ba mẫu; không đọc lại toàn192. Mock không phải SePay thật.
- QA3062 tích hợp ba bản mới đúng1.60/catalog1.57 qua form/reload, chỉ quyền miễn phí; không đơn mock trên DB chính. Web13354/worker13359 cùng checkout `.local/finance-vcd-20261021/qa-final`; tám file code/test đổi trùng hash commit.192file báo cáo/phiên cũ,26token/23binding/18link và34bài công khai nguyên. Livefalse; QA3070pid94421/cwd nguyên. QA3086 đã tắt, không worker thử chồng. Không kiểm provider ngoài/tunnel hoặc migration/restore QA.

Lượt commit đầu bị sandbox chặn `.git/index.lock` trước stage; chạy lại với quyền ghi Git đạt, không đổi branch/remote/push. Không đổi expected nguồn/lịch sử để xanh. Hạn chế chuyên môn còn mở ở FINANCE-ASSETS; kiểm kỹ thuật không chứng minh đủ12cung.


## Đồng–Âm/Di — TT tại cung nhận1.61,21/10/2026

Baseline code48683ce, tám tài liệu lô trước đã khép riênga0b4396; codea57bb76. [Bằng chứng lô](../.local/dong-am-di-20261021/ban-giao.md).

- `dong-am-di`, `di-vcd`, `di-vcd-sun-moon`, `phuc-di`, `customer-editorial-catalog`, `customer-topic-editorial`, `continuous-report`: lượt đầu373/373; thêm fixture chiềuMệnhTý/DiNgọ (không chứng kiến engine), lượt cuối **374/374 tại7file**, không fail/skip. Kiểm TT cung cho/nhận/cảhai/khôngbênnào; một/cảTT; danh sách thiếu/trùng/lưu; sai cặp/đối cung; toàn văn/căn cứ/G2. Không lây điều chỉnh của nền cặp sang xóa vếTTDi độc lập.
- So192 dựng lại1.60 khớp,1snapshot139 thêm đúngclaimTTDi.1Di mới có nhận định/0bổ sung;14→13thiếu. Facts/rules/traces/claims/P2/relations/văn/member cũ vàG2 nguyên.34/127 không nhận lời mới; nền Đồng–Âm chưa xuất.
- Engine tìm hữu hạn480 đầu vào hợp lệ,0lỗi,13cấu trúc,6khôngTTcảhai cung. Hai mẫu khôngTT ban đầu kiểm như đối chứng không khớp ruleTTDi. Hai mẫu eligible:192#139 và nam06/11/1982giờThìn đã nằm trong480; tính lại qua engine rồi quaform. Không cộng tìm kiếm vào test hoặc độphủ192.
- 6/6`reading-scope` DB mới `tinhluan_dong_am_di_1792579279779`;6/6`stored-customer-pdf` với renderer giả. Typecheck đầu/cuối và productionbuild đạt; lượt cuối chỉ thêm fixturetest, không sửaapp saubuild. Không sửaexpectednguồn/lịch sử hoặc chạytoàngate.
- QA3087 riêng:2bản/2đơnmock, fullAPI/DOM và reload đúngfrozen; freekhônglộpayload/DOM, PDF403, chéophiênđọc/PDF404; mobile360/390 vàcăncứđạt. PDFthật8trang15đoạn khớpfrozen; xemcontactmọitrang/căn cứmobile. Đãđọc toànvăn2mẫu. Mock không phảiSePaythật. QA3087đãtắt, khôngworkerthử.
- QA3062:2bản mới đúng1.61/catalog1.58 quaform/reload chỉfree, khôngđơnmock trênDBchính. Web21700/worker21704đúngcheckout `.local/dong-am-di-20261021/qa-final`;8filecode/testđổi trùnghashcommit.199filebáocáo/phiêncũ và26token/23binding/18link/34bài côngkhai nguyên. Livefalse,QA3070pid94421/cwdnguyên. Không kiểmprovider/tunnelngoài, migration/restoreQA.

Dừng nhánh TTDi đã có nguồn. Các phương diện lời nền Đồng–Âm còn chặn được ghi đúng trong PHUC-DI, không coi test kỹ thuật là phê duyệt chuyên môn.


## TTDi dùng chung1.62 —21/10/2026

Code `daee8c2`, nối ca75881/a57bb76; [bằng chứng](../.local/di-void-shared-20261021/ban-giao.md). Chỉ gói chungTB179§10.27, khôngtoàngate.

- Sáu file: `di-void`, `phuc-di`, `no-dien-phuc`, `customer-editorial-catalog`, `customer-topic-editorial`, `customer-basic-selection`: lượt đầu389/389; thêm8ca phạm vi engine/profile có1lỗi vì fixture gán `engineProfile` thay `profile.id`. Sửa trường đúng, không đổi expected;29/29filedi-void đạt,5file368đạt không sửa. Tổng397ca đã đạt. [Lỗi đầu](../.local/di-void-shared-20261021/tests-final.log), [lượt sửa](../.local/di-void-shared-20261021/tests-corrected.log). Typecheck/build cuối đạt, không đổi code sau build.
- So192: đối chiếu sâu mọi fact/rule/trace/claim/văn khác, P2/relations/G2 nguyên; chỉ loại rule/fact TT hẹp bị thay, xác nhận không còn active và TT mới tối đa1claim.3Di mới/55bổsung/1thayđoạn,13→10thiếu; không tăng phủ cung khác.
- `reading-scope.test.ts`6/6 trongDBmới `tinhluan_di_void_*`,kho riêng; `stored-customer-pdf.test.ts`6/6mock, không gọi mocklàPDFthật. [G2](../.local/di-void-shared-20261021/g2-tests.log), [PDFmock](../.local/di-void-shared-20261021/pdf-tests.log).
- Sáu engine87/169/32/159/63/139: có chính tinh/VCD/HóaKỵ/Nhật–Nguyệt/xung chiếu/Đồng–Âm quaform3088, free/fullthử bằng ordermock trongDBriêng, lưu/mở lại đúng frozen,khóa server403 vàchéophiên404; mobile360/390 khôngtràn,căn cứmở/đóng. PDFthật từendpoint8trang16đoạn đủvăn,đãxemcontactvàtrang6. [UI](../.local/di-void-shared-20261021/public-acceptance.json), [PDF](../.local/di-void-shared-20261021/pdf-check.json). Sáu bản tạoQA3062chỉfree, khôngđơn/mock/provider ởDBchính.
- 204filelịch sử cũgiữhash;quyền/binding/link và34bàicôngkhai nguyên. QA3062web26158/worker26162;QA3070PID94421cwdcũ giữnguyên. Livefalse;QA3088tắt. Khôngkiểmprovider ngoài/tunnel/toàngate,khôngmigration/restartchỉvìtài liệu.


## Ngữ cảnh khác chiều1.63 —22/10/2026

Baseline7ab01c5 sạch, codephụcvụdaee8c2. [Đặc tả](OPPOSING-CLAIMS-1.63.0.md), [bàn giao và log](../.local/opposing-20261022/ban-giao.md). Kiểm tập trung, khôngtoàngate.

- 35ca/5file `customer-contexts`, `customer-topic-editorial`, `finance-presentation`, `customer-editorial-catalog`, `continuous-report`;78ca/3file `finance-assets`, `tanbien-finance`, `customer-basic-selection`. Tổng113ca riêng biệt, không cộng lượt chạy lại. Chốt ngữ nghĩa, đủ vế/điều kiện/căn cứ, nhóm chưa biết không tạo xung đột, tên/ngày không chọn lời, gom chạy lại không lặp, kiểm ngoại lệ nguồn đã có. Test dùng bộ cục bộ giữ ngoàiGit theoGIT-BASELINE.
- So192 sâu reading/continuous nguyên, G2policy bằngbaseline;40bài gom lại, mọi đoạn khác nguyên. Mỗi câu khách gốc trong cụm còn nguyên; mỗi member/layers/fact/trace/rule nguyên. Không gọi đếm test/đoạn là đầy đủ bài.
- G2integration6/6 DBriêng `tinhluan_opposing_*`,PDFmock6/6; typecheck/build đạtcheckoutriêng. Sáumẫu engine192quaform/lưu/mở/fullmockriêng/freePDF403/chéophiên404/mobile360/390/căncứ. HaiPDFthật8trang,13và18đoạnfrozenđủ, kiểmảnh mọi trang và trang6/5 có đoạn mới. Không providerthật, không worker thử. Thông tin lượt cuối/codeidentity/phụcvụ/bảotoàn trong bàngiao.
- Lỗi đầu:2assertioncũ đòi đoạn riêng, cập nhật kiểm đủmember/nguyênvăn trong cụm;1lỗi gom lầnhai gây lặp, sửa bỏ qua cụmđãđánhdấu; không thay expected nguồn/lịch sử. Setupenvthiếu gâyInvalidURL trước typecheck/build/DB, nạpđúngenv; sandboxEPERM DB trước tạoDB, chạy lại có quyềnloopbackriêng. Rà nội dung cuối táchPhụcBinh khỏi xungđộtgiữcủa (cảnhbáo chưa phảisựkiện); sửa sốtrang căn cứVũ–Tham192→191, vănkháchkhôngđổi. Rerunđúngphầnảnhhưởng, không sửa lịch sử cho xanh.


## Rà nghĩa1.63 —1.63.1,22/10/2026

Code13a7f3d, baseline6c80bc6 sạch.38/38 tại5file `customer-contexts`, `customer-topic-editorial`, `finance-presentation`, `customer-editorial-catalog`, `continuous-report`. Thêm mẫu50 thực và fixture13nhánh khácphươngdiện/5nhánh thật sự khógiữ; không gọi fixture làengine. Lượt đầu37đạt/1lỗi do filtertest lấy cả ghi chútiền–nhàđất chung; sửa đúngfilter, nguồn/lịch sử nguyên. Kiểm one-transition, khôngwrapperlặp và member/điềukiện/nguyêncâu/G2 bảo toàn. [Bàn giao/toàn đoạn/log](../.local/context-review-20261022/ban-giao.md).

So192 reading/continuous vàG2khớp sâu;40bài chỉ đổi lớp gom.6/6G2 DBriêng `tinhluan_context_review_*`;6/6PDFmock; typecheck/build đạt.6engineform/lưu/mở/fullmockriêng/mobile360/390/căncứ/freePDF403/chủkhác404. PDFthật9trang19đoạn và8trang13đoạn đủfrozen, đãxemmọitrang và5/6. QA3062saucutover6form/reload1.63.1 chỉfree, khôngmockởDBchính.228file/26token/23binding/18link/34bàigiữnguyên; QA3070nguyên, Livefalse,Tậtchưa publish;3090tắt. Khôngtoàngate/providerngoài hoặcmigration/restore/purge.


## TT Phụ–Điền theo phương diện —1.64.1,22/10/2026

Code `1b8c1c1`, baseline `02e6ce3` sạch, code phục vụ trước13a7f3d được kiểm hash thực tế. [Bàn giao](../.local/parent-property-void-20261022/ban-giao.md), [đối chiếu192](../.local/parent-property-void-20261022/impact192.json).

- **1.234ca/9file** `parent-property-void`, `family-vcd`, `phu-huynh`, `no-dien-phuc`, `no-dien`, `customer-editorial-catalog`, `customer-topic-editorial`, `continuous-report`, `tanbien-presentation` đạt. Sau rà nguồn bỏ xa cách có điều kiện ởTham/Phá, chạy lại cả8file đạt; sau bổ sung paths căn cứ kiểm đúng2file78ca đạt, không cộng trùng. Fixture chính tinh sắp lại là kiểm predicate, không lá sốengine thật.
- Kiểm mỗi nhánh mộtTuần/mộtTriệt/cảhai/khôngTT, TTcungcho/nhậnVCD, thiếu chứng nhận/sao lưu/cặp thiếu/sai vịtrí, khônglặp câuđầyđủ, khôngđảo giàu/nghèo vàkhông đổi mệnhđề sinh tử/lờikhuyên thànhxacách. ĐiềnVCDmộtTTgiữ nguồn gốc, cảhai chỉnhánh§7.33. So192giữ claims/facts/rules/traces/văn/membercũ ngoài metadata/fact của nhánhĐiền sửa cóchủđích;10cung khác khớpsâu; G2freeParagraphIds bằngbaseline.48bài54claim mới.
- G2`reading-scope`6/6 trongDBmới `tinhluan_parent_property_void_*`;`stored-customer-pdf`6/6renderergiả. Không gọi mockPDF làPDFthật. Typecheck/productionbuildcuối đạt ởcheckoutriêng;10filecode/testtrùnghashcommit/root/checkout. Khôngchạytoàngate/providerngoài.
-7mẫuengine192 quaformQA3091, full bằngorder **mock** trongDB/kho riêng, reloadtoànvăn giữfrozen, freekhônglộpayload/DOM, PDF403 vàchéophiênđọc/PDF404. Mobile360/390khôngtràn/căncứđóngmở.2PDFthật từendpoint8trang/mẫu,16và17đoạnkhớp đầyđủ, xemảnhmọitrangvàtrang5. Khôngworkerthử. Bảncuối chạy lạiUI7mẫu sau hoànthiệnpaths căn cứ, khôngsửaapp sauđó. QA3062kiểm2lượt7form/reload (14bản/7cấutrúc),chỉfree, khôngmock vàoDBchính.
- Lỗiđầu:3assertions (metadataeditorialĐiềnchưa nângversion; cổngTTcũ trongtest; pendingeditorial cùng nguyênnhânversion). Sửa bindingvàexpectedcủađúngphươngpháp mớitheonguồn, khôngđổi lịch sử. Comparatorđầu bắtmetadataĐiền trongruleMatches; miễntrừ đúngnhánhđãsửa, giữ sâu mọinhánhkhác. Ràtoànvăn bắtxacách trong3vế cóđiềukiện sinh tử, bỏkhỏi nhánhmới vàkiểmlại. KhôngcólỗiUI/providerthật hoặcskipđểxanh.
- Bảo toàn241filelịch sử đầu phiên vàtoànbộdòngquyền/binding/link/CMSđãghihash;34bàicôngkhai. GiữQA3070PID94421/checkoutcũ, G2/Tậtchưapublish/Livefalse. Khôngmigration/restore/purgeQA.

Bảnđầu1.64.0/code08f098e có lời đúng nhưng ảnh UI bắt thiếu ánhxạ fact mới trong căn cứ. Sửa `conditionText`/`factEvidence` chung, tăng trìnhbày căn cứ1.14.1 và bảnkhách1.64.1/code1b8c1c1; giữ nguyên bảnlưu1.64.0. Kiểm lại9file1.234ca,so192,typecheck/build trong checkoutv2 riêng,UI/PDF/căncứ cuối. Không build hoặc sửa checkout đang phục vụ.

## Rà12cung1.66 —22/10/2026

Code `c6f9c5c`, [bản đồ và số liệu](V1-DELIVERY-PLAN.md#coverage-repair-166-20261022), [.local kiểm](../.local/coverage-repair-20261022/source-spec.md).1.236ca/8file (`coverage-repair`, `phu-huynh`, `no-dien-phuc`, `finance-vcd`, `customer-editorial-catalog`, `career-closing`, `parent-property-void`, `phuc-di`) đã đạt; lần cuối sửa câuCự chạy lại đúng3file ảnhhưởng.12caG2/PDFmock dùngDBriêng `tinhluan_coverage_*`; khôngmainDB, khôngproviderngoài. Typecheck/build cuối đạt, root/QA15file trùngSHA.14 nhánh dùng chung; các fixture biên không phải mẫu engine; riêngLươngPhúcTý/Ngọ0/192 chỉfixture.

192dựngbaselinekhớp sâu; sau sửa mọi oldrule/condition/claim/văn nguồn giữ, metadata fact kỹthuật1.17→1.18 được chuẩn hóa riêng khi đối chiếu legacy; không chuẩn hóa giá trị/căn cứ/điều kiện.43báo cáo đổi văn/35cungmới/10bổsung/28chốngtrùng; C0phát hiện trong chuỗi preview→continuous→customer,0pending/0unbound. Các diagnostic/notice khi rulemới không khớp hoặc ngoài tập con được ghi riêng, không tính độphủ.

2engine169/37quaform–lưu–mở, freekhôngcóvăntrảphí/freePDF403/chéophiên404/fullorderTestmocklocal, mobile360/390Chrome. Chỉjobđúngorder trongDBriêng, khôngworkerphụ.1PDF1699trang17đoạnđủfrozen; xemcontact/trang4/5. Sau phầnDi/Cự cuối, finalsource táidựng nguyên paragraph/member/căn cứ của169 và đúngvănPDF, không tạoPDFthứhai; UI37kiểm trênbuildcuối, khôngPDF. Sau tíchhợpQA3062, engine7quaform/newDi/lưu–mở/G2, khôngorder/mock trênmain; bảo toàn273tệpcũ/quyền/binding/link/34bài. QA3070PID/cwdnguyên; mộtworker chính.

Giữlỗithửđầu vàlượtsửa: fixtureTT/arrayindex; saiIDHỏa trong coveredBy bịguardchặn; templatechuỗitronghelper; exportdir ởscriptDBriêng; comparator bắt thayversionfacts. Không đổi expectednguồn/lịch sử đểxanh. [Logđầu](../.local/coverage-repair-20261022/tests-first.log), [cấu hình nguồn sai](../.local/coverage-repair-20261022/tests-last-source.log), [kiểmcuối](../.local/coverage-repair-20261022/tests-complete.log), [kiểmcopycuối](../.local/coverage-repair-20261022/tests-copy-final.log), [scope](../.local/coverage-repair-20261022/scope-tests.log). Không gọi testkỹthuật là phêduyệt toàn bộnộidung/đãđủ12cung.

## VCD Tài/Quan1.67 —23/10/2026

[Lô25 trong backlog duy nhất](V1-DELIVERY-PLAN.md#vcd-finance-career-167-20261023). Code11b1a92:72ca/4file vcd-light-exceptions/finance-vcd/coverage-repair/customer-editorial-catalog;24ca chạy lại sauoptionalbookStateguard,khôngcộngrerun. Đầulỗihai fixturecònTTtạisao/đặtchínhtinhvàocungnhận đãsửacáchdựng,giữexpectednguồn;typecheckđầubắt ônguồnundefinedđãsửaguard.192baselinekhớpsâu;9đổivăn/6cungmới/3bổsung,oldclaim/condition/văn/G2IDsnguyên;chỉchuẩnhóametadatafactversion1.19→1.18khi so. Typecheck/buildcuốiđạt checkoutmới,8hashroot/QAtrùng. Cả4nhánhcóenginewitness;fixtureskhôngengine. UI6/162form–lưu–mở/G2/fullTestlocal/mobile360/390;1PDF6thật8trang18đoạnđủ,xemcontact/trang5;162khôngPDFthứhai. DB/kho thửriêng,khôngworkerphụ/providerngoài. QA3062saucutoverengine6mớiđạt,khôngorder/mocktrênmain.244tệpcũnguyên;2trialfileđãhếthạn10:11đượcretentioncũdọn,backupkhớpSHA;khôngrestorehoặcthayquyền.34bài/QA3070giữ,Livefalse. [Biênbản/log](../.local/vcd-finance-career-20261023/checks.json).

## Ba nhận định Trung Châu —24/10/2026,1.70

Baseline20d45ef,codea1936d8; [kết quả/bằng chứng và toàn văn](V1-DELIVERY-PLAN.md#three-candidates-170-20261024).87/87nội dung tại6file;G2+PDFmock12/12DBriêng;typecheck/build đạt. So1921/29/4hit,7guard,34báo cáo thêmý;mọi oldclaim/fact/rule/trace/oldgroup/gap/relations/G2membership giữ.4engineform/lưu/mở/mobile360/390/căn cứ ởQAriêng;1PDFthật8trang16đoạn khớpfrozen,chi+guard cùngtrang5 vàđã kiểmảnh. MainQA3062tạo4bản mới đúng1.70/1.66,khôngmockorder;247filecũ/quyền/34bài giữ,QA3070/Livefalse/Tậtchưa publish nguyên. Khôngfullgate/providerthật,tìmngoài192 hoặcPDFmọinhánh;Mùi chỉfixture.

**OPEN-TEST-02 — lỗi có sẵn, ngoài gói ba ý:** lượt mở rộng `customer-reading.test.ts`94đạt/1lỗi ở7file; ca “Kim work adjustment stays adjacent and finance does not duplicate its full body”, dòng15, tìm paragraphID `customer-relation-retention-unresolved` không còn độc lập sau cơ chế context. Checkout phục vụ1.69khôngsửa cũng7đạt/1lỗi đúng chỗ; [baseline](../.local/three-candidates-20261024/baseline-customer-test.log). Giữ nguyên test/expected; không gọi toàn gate xanh. Kiểm toàn văn192/quan hệ cũ/`customer-topic-editorial`/`finance-presentation` vàUI đại diện đạt, nên không là regression do ba ý; chưa sửa selector cũ trong task này.

Lỗi đầu trong gói:1TS2345(typeguard cungoptional),đãsửa; probe/audit gặpcontainer financeAssets vắng,giảđịnh0owner mới vàIDnhómMệnhdịch vìthêmlearning trướcnhómThân. Codecuối thêmnhóm mới saunhómcũ,giữmọiID/membership;spendingkhôngkhépgapnguồnthu/tíchlũy hoặcTử. Phépđối chiếu cuối kiểmmạnh hơn mọi gap/group/oldclaim/relations,khôngđổi expected nguồn/lịch sử. Thiếtlập envđầu thiếuDATABASE_URL vàkếtnốiPGcục bộbịEPERM trướcghi;đã nạpđúngenv vàchạyDBriêng được phép. Tựđộngduyệt từngchặn lệnhnớikiểm+kíchQA;chỉkhởiđộngsauđiềutra/sửacode/đốichiếuđạt. Không bỏ/skip test để xanh.

## U08 Phủ Điền Hợi —24/10/2026,1.71

Code0a681c6 từ đặc tảfe3f0ac được duyệt; [kết quả/receipt](V1-DELIVERY-PLAN.md#u08-delivery-171-20261024).563/563 tại7file,26ca mới `vttl-dien-phu`: predicate/biên/thiếu dữ kiện/TT/cause unknown/profile/compatibility/frozen/G2/giữ Lộc/chống trùng.12/12G2/PDFmock chỉ DB riêng, typecheck/build đạt. So192:3hit/3đổi11/25/155,2khóa thiếu gốc+1bổ sung, mọi lời cũ giữ;0văn đổi ngoài3. UI3engine thật form–lưu–mở/quyền/căn cứ/mobile360/390,PDF25 thật9trang21đoạn khớp frozen, đã kiểm ảnh. QA3062 sau chuyển3bản mới đạt, khôngmockorder.256tệp cũ/DB quyền-hạn/34bài giữ;engine6file/QA3070 giữ,478file source phục vụ khớp;Livefalse,Tật chưa publish.

**Sửa selector trực tiếp chặn gói:** lần đầu506đạt/1lỗi `finance-presentation.test.ts` dựa `relations[0]`; mẫu5 kỹ thuật có money-property mới đứng trước creation-loss. Đổi tìm đúng ID `creation-loss`, thêm kiểm tồn tại; giữ mọi expected văn/kind/placement. Không phải sửa **OPEN-TEST-02** ở `customer-reading.test.ts` (vẫn nguyên/chưa chạy lại). Typecheck đầu2TS2790 xóa trường bắt buộc trong fixture: sửa cast fixture. Rà cuối phát hiện metadata cũ cấm Toàn Thư và thiếu reason unknown trong gap, đã sửa và chạy lại bộ kiểm/build/UI/PDF trên code cuối. Log từng lượt ở `.local/u08-20261024`; không đổi expected nguồn/lịch sử. Không chạy fullgate/provider thật/PDF mọi nhánh, không coi fixture là engine hoặc bộ192 là mọi cấu trúc.

## U24 Cơ–Âm Quan Dần —25/10/2026,1.72

Code1b6e072 từ đặc tả5310b2e đã duyệt; [receipt và phạm vi](V1-DELIVERY-PLAN.md#u24-delivery-172-20261025).260/260 tại9file: `vttl-career-co-am`(42ca mới),`vttl-dien-phu`,`customer-editorial-catalog`,`customer-topic-editorial`,`continuous-report`,`finance-presentation`,`career-closing`,`career-batch`,`career-conditions`.12/12G2/PDFmock chỉ DBU24riêng, typecheck/build đạt. So192 đúng3hit/3đổi38/93/186,3Quan đầu tiên/0chỉ-bổ-sung/0chiều-sâu; mọi lời/fact/trace/claim/nhóm/G2 cũ giữ,0văn ngoài3. Finance chỉ thêm3metadataunclassified trỏclaimQuan mới, không thêmvăn/entry/quan hệ tài chính.

Ba engine qua form–lưu–mở/quyền/căn cứ/mobile360/390;PDF38thật8trang16đoạn khớpfrozen, đã kiểm ảnh toàn bài, đoạn mới trang5/nguồn79–43trang8. SauQA3062tạo3bản mới,free/G2/PDF403/kháchlạ404/lưu–mở/mobile390đạt, vănkhớpaudit vàQAriêng. Khôngorder/mock trênQA chính.263tệp lịch sử/DBquyền-hạn/34bài giữ,480file phục vụ khớp,engine6file/QA3070nguyên;Livefalse,Tậtchưapublish. Runtimekiểm3097đãdừng.

Lượt đầu96đạt/2lỗi ở6file: claim có nhưng selectorwork chưa nhậnIDVTTL. Sửa đúngIDU24,98/98; mởrộngkiểmQuan260/260. Phépso đầu bắtmetadatafinanceunclassified, đốichiếu cuối chỉcho đúng3claimQuan mới vàgiữmọivăn/entry/quan hệ. Khôngsửaexpectednguồn/lịch sử hoặcselector tàichính. KiểmU08chỉ cập nhậtallowlist/metadata phiênbản mới, giữpredicate/văn/nguồn; đổi têncase chođúnghaiIDđãduyệt,26cađạt, khôngcộnglượtlạithànhtestmới. BaselineGit477file+1fixtureignoredsofile/QA,khôngforce-add. Khôngfullgate/providerthật/PDFmọinhánh;fixturebiênkhônglàwitnessengine. OPEN-TEST-02giữngoàiphạmvi.
