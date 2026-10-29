# Gói 2.5 — Chuẩn bị tích hợp Mệnh V1 vào riêng web QA3062

Ngày 29/10/2026, baseline `main@f18acee`; tracked/index sạch trước sửa, giữ nguyên `buu-dinh-7parts/`. **Đã chuẩn bị, chưa cập nhật/restart QA3062.** Không triển khai Gói 3, AI 11 cung, worker AI, migration hoặc Live. Commit Gói 2.5 chỉ thêm công cụ snapshot kho, test và tài liệu; mã ứng dụng phục vụ Mệnh vẫn là Gói 2.4 `f18acee`, không sửa engine/renderer/quyền/thanh toán.

## Phiên bản và tiến trình đã xác minh

QA3062 đang phục vụ code `a104748`, UI `result-package1-1.0.0`, report 1.79/catalog 1.75; build `UlHf9zr5Clv8NtCpv64jF`. Web **PID94756**, cổng **127.0.0.1:3062**, checkout `.local/result-package1-web3062-20261027/qa`, khởi động 27/10 lúc13:19:14. Executable hiện tại `/Users/taiho/.nvm/versions/node/v20.20.2/bin/node`. Đối chiếu đủ339file code từ receipt deploy cũ, không chỉ nhãn phiên bản.

**Cần đổi riêng executable của web sang Node24** khi được cấp quyền; SDK OpenAI7.45 yêu cầu Node≥22. Đã build bằng `/Users/taiho/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`, v24.22.1. Không đổi executable hoặc restart worker thanh toán.

Danh tính được bảo vệ: worker thanh toán **62860**, QA3070 web/worker **94421/94426**, QA3101 web **89190**, QA3111 web **4641**; PID/cwd/thời điểm khởi động giữ nguyên. QA3111 đang build `Bjl2ywne20ipxEub69x6q`; AI worker dừng. Không process manager chung; quy trình hiện hành dùng một web Next riêng được spawn với env riêng.

`ps` của Next chỉ trả process title, không đọc được env web. Đã đối chiếu28thiết lập app/thanh toán với worker dùng cùng launch recipe, không có `.env` override tại checkout; đọc Toàn thư và đối chiếu socket TCP của **đúng PID94756** với `pg_stat_activity` xác nhận database thực. Đây là chuỗi bằng chứng, không tuyên bố đã đọc trực tiếp toàn bộ env web. [Preflight](../.local/ai-menh-package25-20261029/preflight.json).

## Kho private đã sẵn sàng

Kho đích tuyệt đối: `/Volumes/DATA/TINHLUAN/.local/runtime-private/qa3062/menh-v1-f18acee-20261029`. Tách khỏi cả checkout cũ và checkout mới, không trong `.next`/public/Git; deploy checkout riêng không thay thư mục này. Chưa gắn vào cấu hình web đang chạy.

Đã chuyển đầy đủ **89artifact**:73sources,4candidates,4requests,4review events/journal,2approved kiểu cũ và2inventories. Thư mục errors hiện không có artifact; công cụ vẫn hỗ trợ giữ nó khi có. Không chỉ chép approved. Kho có73đơn vị,4candidate đã sinh,2approved/1rejected/70draft; trong70draft có1candidate prompt1.1 và69chưa sinh. Quyết định duyệt lời không nâng51rule nguồn draft thành chứng nhận chuyên môn.

Backup toàn kho: `/Volumes/DATA/TINHLUAN/.local/backups/qa3062-menh-v1-20261029/editorial-store`. Đã khôi phục thử vào `.local/ai-menh-package25-20261029/restore-drill`, không ghi đè kho/báo cáo đang dùng. SHA-256 của từng artifact,73context/điều kiện/V1/catalog và lựa chọn approved/fallback tại source/backup/release/restore đều khớp. File0600/thư mục0700; web chạy cùng tài khoản hệ thống nên đọc được. Không cần quyền ghi để phục vụ nội dung đã chốt.

Đây là thư mục dữ liệu riêng trên **volume DATA hiện có**, **không phải volume vật lý thứ hai**. Release và backup cùng `/dev/disk3s1`, còn khoảng65GiB tại lúc kiểm. Backup này phục hồi lỗi triển khai/sao chép, chưa bảo vệ khi mất cả volume. Nếu yêu cầu “volume riêng” theo nghĩa thiết bị/mount độc lập thì **chưa đạt phần đó**; cần chủ dự án chỉ định/cấp quyền đích lưu ngoài DATA. Không tự tạo mount hoặc gửi backup có dữ liệu riêng lên dịch vụ ngoài.

Công cụ mới `scripts/snapshot-v1-edit-store.ts` dùng thư mục đích **chưa tồn tại**, không merge/overwrite; giữ toàn bộ JSON và journal, từ chối symlink, overlap, JSON lỗi, phát hiện nguồn đổi trong lúc chép. Manifest hoàn tất có file/hash/bytes; verify phát hiện thiếu/thừa/đổi artifact. Khôi phục là snapshot từ backup hợp lệ sang **thư mục mới**, không restore DB. Không API, queue hoặc process control trong công cụ này. Parent đích phải tồn tại. Các lệnh chỉ đọc có thể chạy trước deploy:

```sh
node --import tsx scripts/snapshot-v1-edit-store.ts verify /Volumes/DATA/TINHLUAN/.local/runtime-private/qa3062/menh-v1-f18acee-20261029
node --import tsx scripts/snapshot-v1-edit-store.ts verify /Volumes/DATA/TINHLUAN/.local/backups/qa3062-menh-v1-20261029/editorial-store
```

[Receipt chuyển/khôi phục/quyền file](../.local/ai-menh-package25-20261029/store-ready.json), [đối chiếu mọi đơn vị](../.local/ai-menh-package25-20261029/store-semantics.json). Kho release là snapshot có phiên bản: không gọi prepare/review trực tiếp trong đó. Muốn bổ sung sau này cần duyệt ở kho operator rồi tạo release mới, không sửa selection lịch sử.

## Một thử nghiệm Luna prompt1.1 thật

Chọn trước khi gọi một đơn vị V1 chưa có request/candidate: `npl.life-foundation-empty`, Mệnh Tỵ không chính tinh, hành Hỏa khắc Bản Mệnh Kim. Mẫu kiểm được vị trí, chiều khắc, phủ định và phạm vi phép xét; không chọn để có bài đẹp. Model `gpt-6-luna`, prompt `menh-v1-copyedit-1.1.0`, Responses + Structured Outputs SDK server; quyền Models GET và schema thực đạt. [Tài liệu model](https://developers.openai.com/api/docs/models/gpt-6-luna).

**Đúng1CREATE Luna,0Astra**, không batch/retry.1267input/0cached/95output token,3413ms cho Responses sau Models GET; chi phí ước **$0,0001742** theo Standard0,10/0,01/0,50USD mỗi triệu input/cache/output tại [giá API ngày29/10](https://developers.openai.com/api/docs/pricing?latest-pricing=standard). Đây là usage thực và chi phí tính theo bảng giá, chưa phải hóa đơn đối soát. Không gửi tên/ngày sinh/key vào nội dung request; facts/unit gốc giữ hash.

V1: “Mệnh tại Tỵ không có chính tinh tọa thủ; hành cung Hỏa khắc Bản Mệnh Kim (Bạch Lạp Kim). Đây là quan hệ nghịch trong phép xét riêng hành cung Mệnh không chính tinh với Bản Mệnh; chưa phải đánh giá con người hoặc cả cuộc đời. Các mức phân loại chi tiết của phép xét được giữ trong căn cứ.”

Luna: “Mệnh tại Tỵ không có chính tinh tọa thủ; hành cung Hỏa khắc Bản Mệnh Kim (Bạch Lạp Kim). Đây là quan hệ nghịch trong phép xét riêng hành cung Mệnh không chính tinh với Bản Mệnh, không phải đánh giá con người hay cả cuộc đời. Các mức phân loại chi tiết của phép xét được giữ trong căn cứ.”

**Giữ draft, không approved.** Dữ kiện/phạm vi, điều kiện, không thêm luận điểm và nguồn: pass sau đọc đối chiếu. Nghĩa: uncertain vì “chưa phải”→“không phải” đổi sắc thái hạn định. “Hoặc”→“hay” có thể tương đương; cảnh báo từ bộ lọc bảo thủ không tự chứng minh lỗi Tử Vi. Không nới guard để nhận bản này hoặc gọi thêm. V1 gốc vẫn dùng; hai approved1.0 cũ giữ nguyên. [Toàn văn và đánh giá5tiêu chí](../.local/ai-menh-package25-20261029/luna-comparison.txt), [usage/responseID/hash](../.local/ai-menh-package25-20261029/luna-result.json), [nguồn/prompt đã gửi](../.local/ai-menh-package25-20261029/selected-unit.json), [journal draft](../.local/ai-menh-package25-20261029/review.json).

## Build, backup và kiểm thực tế

Checkout chuẩn bị: `/Volumes/DATA/TINHLUAN/.local/ai-menh-package25-20261029/qa`,660file có manifest, build **vQVwORxbMpjju4MCaF34c**. Mã ứng dụng đúng f18acee; thêm3file công cụ/test Gói2.5. Docs trong checkout là snapshot lúc chuẩn bị, không dùng chúng thay trạng thái bàn giao mới tại root. Typecheck/build Node24.22.1 đạt, build dùng DB/kho test riêng và key rỗng, không chạm data main.

**49/49test**:45ca đã có cho V1/duyệt/AI/phạm vi +4ca snapshot/restore/hash/permission/overlap/không overwrite/symlink/thiếu-thừa artifact. Chạy trên DBtest khác QA3111 và main. Không E2E/PDF. [Test](../.local/ai-menh-package25-20261029/test.log), [typecheck](../.local/ai-menh-package25-20261029/typecheck.log), [build](../.local/ai-menh-package25-20261029/build.log), [build/source identity](../.local/ai-menh-package25-20261029/prepared.json).

Preview tạm **QA3112** dùng đúng build chuẩn bị, Node24, cache release, **AI_MENH_ENABLED=false và key rỗng**, DB/kho báo cáo riêng. Hai mẫu tạo qua form thật: VCD Tỵ2đoạn gốc (đúng đoạn draft bị loại), Vũ–Phủ7đoạn gồm2Luna approved. Không chờ AI,11cung not-entitled,4tab; căn cứ đóng–mở, Tứ Hóa4thẻ, Vận hạn đúng placeholder,360/390không tràn ngang; refresh VCD và rời trang/mở lại mẫu approved giữ nội dung. Không job AI cho hai report. Preview PID27362 đã dừng sau kiểm; không worker được chạy. [Ảnh V1 fallback360](../.local/ai-menh-package25-20261029/fallback-360.png), [ảnh approved390](../.local/ai-menh-package25-20261029/approved-390.png), [mở lại](../.local/ai-menh-package25-20261029/reopen-ui.json).

282file main và22file QA3111 trước task giữ hash;12jobAI QA3111 giữ status/attempt/responseID/result;8artifact biên tập cũ nguyên.8bảng main và34bài công khai nguyên, main vẫn không có bảng AI. So mã xác nhận Tổng quan/Tứ Hóa/Vận hạn, adapter và policy giữ đúng Gói1; thay đổi tích hợp chỉ bổ sung vùng Mệnh miễn phí và đọc Astra lịch sử. Bộ đọc file thật của checkout cũ chạy Node20 đọc nguyên hai report QA mới có `freeMenh` optional: hỗ trợ rollback web, **chưa thực hiện rollback dịch vụ thật**. Không gọi lại Google OAuth/PDF/main smoke trên bản chưa deploy; source/config28thiết lập liên quan giữ nguyên. [Đối chiếu cuối](../.local/ai-menh-package25-20261029/verification.json), [main/process](../.local/ai-menh-package25-20261029/protected-after.json).

Backup chuẩn bị main: `.local/backups/qa3062-menh-v1-20261029/main-preparation`:282file đúng hash và DB dump11321958bytes, `pg_restore --list` đọc được. Dump lấy chỉ đọc; **không thử restore DB**, không có rollback DB trong kế hoạch này. Cần backup mới ngay trước lần deploy được cấp quyền, vì người dùng/worker có thể tiếp tục tạo dữ liệu sau task. [Receipt backup](../.local/ai-menh-package25-20261029/main-backup.json). Checkout cũ giữ nguyên để rollback, không build đè vào đó.

## Cấu hình sau khi được cấp quyền

Giữ nguyên database/kho trial/internal, APP_ORIGIN/cookie/Google/email/quyền/thanh toán và28thiết lập đã đối chiếu; không đổi env worker. Chỉ bổ sung/override cho **web mới**:

```text
AI_MENH_ENABLED=false
AI_FREE_EDIT_MODEL=gpt-6-luna
AI_PAID_READING_MODEL=gpt-6-astra
AI_V1_EDIT_DIR=/Volumes/DATA/TINHLUAN/.local/runtime-private/qa3062/menh-v1-f18acee-20261029
AI_MENH_BACKGROUND=false
OPENAI_API_KEY=(không truyền key cho web)
OPENAI_MODEL=(không bật model Astra miễn phí cũ)
```

Tên Astra chỉ là cấu hình tương lai, không sinh bài trả phí. Web chỉ đọc cache/V1, không cần key hoặc bảng AI mới. Key vẫn ở môi trường operator riêng để biên tập chủ động, không đưa vào client/checkout/Git. Không chạy migration011, AIworker, reconcile/retry hay consumers cũ khi triển khai này.

## Các thao tác cần quyền cập nhật riêng web

1. Xác minh lại HEAD/app hash, buildID, executable Node24, manifest89file và target PID94756/cwd/start/cổng3062; đối chiếu worker/QA3070/3101/3111. Nếu danh tính hoặc config đổi, dừng để cập nhật kế hoạch; không dùng PID cũ một cách mù quáng. Không chạy lại nguyên script deploy Gói1: script đó khóa HEAD350cdb4/PID62859 đã cũ.
2. Chốt thời điểm, làm mới backup chỉ đọc báo cáo/DB/env reference và hash. Không restore hoặc chép báo cáo/DB QA vào main. Giữ checkout cũ/build cũ/executable Node20 và env đã xác minh cho rollback.
3. Sau quyền cụ thể, gửi **SIGTERM chỉ tới web QA3062 đã xác minh**, chờ cổng3062 trống. Không kill theo tên/pattern, không pm2 restart all, không restart worker. Dừng nếu thao tác có thể lan sang tiến trình khác.
4. Spawn detached **một web** từ checkout mới bằng Node24 và env riêng phía trên, lệnh Next `node_modules/next/dist/bin/next start --hostname 127.0.0.1 -p 3062`. Lưu newPID/cwd/start/buildID/log private; không chạy npm install, migrate, worker hoặc API generation trong bước này.
5. Readiness HTTP200, đối chiếu đúng newPID/cổng/build. Dùng phiên browser sở hữu hợp lệ kiểm báo cáo lịch sử, quyền/library,4tab, Mệnh/căn cứ/refresh/mở lại; một mẫu QA mới có thể dùng để kiểm ngay V1, không tự gọi OpenAI. Chứng minh không job/attempt/requestcache mới, không viết lại file cũ và11cung khóa AI. Đối chiếu lại worker/QA3070 cùng các bảng quyền/đơn/webhook/Toàn thư; tách file mới được chủ động tạo để không nhầm là lịch sử thay đổi.
6. Nếu readiness hoặc smoke lỗi: xác minh newPID/cwd rồi **dừng chỉ web mới**, chờ cổng, khởi chạy lại checkout cũ bằng Node20/env cũ trên3062; xác nhận HTTP và báo cáo cũ. Không rollback/restore DB, không xóa report mới, không quay journal hoặc restart dịch vụ khác. Nếu không thể xác minh danh tính/rollback web, dừng và báo lại, không mở rộng phạm vi.

Rủi ro thực tế: downtime ngắn khi đổi một web; Node20→24 chỉ cho web; hai web không được cùng chiếm3062; shared DB/kho phải giữ đúng env; backup cùng DATA không bảo vệ mất volume; metadata sai/mất cache sẽ dùng V1 gốc. Các phần chưa có nội dung/nguồn draft vẫn còn; không cần hoàn thiện cả kho để triển khai fallback. Luna1.1 draft chưa được dùng là quyết định an toàn, không phải lỗi runtime chặn Mệnh.

**Điểm dừng:** chưa có quyền thực thi cập nhật lần này; không tự restart. Nếu chấp nhận thư mục dữ liệu tách checkout trên DATA và giới hạn backup cùng volume cho QA, các kiểm kỹ thuật hiện đã đủ để đề xuất xin quyền cập nhật **riêng web QA3062**, gồm rollback riêng web khi cần. Nếu bắt buộc mount/backup ngoài DATA, cần chuẩn bị đích đó trước; chưa coi yêu cầu này đã đạt. Không mở bán/Live/Gói3 hoặc chạy thêm Luna để tối ưu.
