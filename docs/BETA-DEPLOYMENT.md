# Triển khai beta miễn phí Tinh Luận

Cập nhật 18/10/2026. Bản nguồn đã đối chiếu với checkout QA chính: trình bày **1.47.0**, catalog **interpretation-1.45.0**. Gói này chuẩn bị vận hành, không thay nội dung hoặc mở thanh toán. Chưa triển khai lên máy chủ ổn định vì chưa có máy chủ/tên miền.

Chủ dự án đã chọn Ubuntu. Bắt đầu bằng [hướng dẫn Ubuntu từng lệnh](UBUNTU-BETA-QUICKSTART.md); tài liệu này giữ chi tiết vận hành/phục hồi và giới hạn kiểm chứng.

## 1. Kiến trúc và điều kiện máy đích

Một máy Linux, một web Next.js, một worker hiện hành, PostgreSQL và hai thư mục dữ liệu bền vững. Nginx kết thúc HTTPS, chuyển vào web loopback. Không mở cổng PostgreSQL hoặc Node ra Internet. Đây là cấu hình một instance; chưa có thiết kế nhiều máy/chia sẻ kho file.

- Đích đề xuất: Ubuntu 24.04 **x86_64**, Node 22 LTS, PostgreSQL 16, Nginx và Google Chrome. Khởi điểm dự trù 2 vCPU/4 GB RAM/40 GB SSD; đây là mức dự trù, **chưa phải kết quả đo tải**. Cần điều chỉnh theo dung lượng báo cáo và tần suất PDF.
- Đã diễn tập trên macOS, Node 20.20.2, PostgreSQL/pg_dump/pg_restore 16.14, Chrome 155.0.8059.84. Chưa kiểm systemd/Nginx/Node22/Linux trên máy đích; Nginx chỉ đã kiểm cú pháp cấu hình mẫu tại máy hiện tại.
- PDF hiện gọi Playwright với `channel: 'chrome'`: phải có **Google Chrome**, không chỉ cài Chromium. `npx playwright install --with-deps chrome` từ đúng release là cách cài được tài liệu Playwright hướng dẫn; kiểm lại phiên bản thực sau cài. Không sao chép Chrome/macOS node_modules sang Linux.
- Chạy `npm ci --include=dev`: worker dùng `tsx` đang nằm trong devDependencies. Chưa chuyển dependency hoặc dựng queue mới.
- Giữ nguyên source `lib/`, `scripts/engine*.cjs`, `public/`, ba file `exports/` đi kèm; ứng dụng còn đọc source/hash và dữ liệu mẫu nội bộ khi chạy. Không chỉ giao `.next/standalone`.
- Mỗi web chỉ xuất một PDF đồng thời. Có xử lý bận trong ứng dụng; chưa kiểm tải beta đông người trong đợt này.

## 2. Gói bàn giao và bố trí

Mã vận hành nằm ở `deploy/beta/`. Gói nguồn riêng được tạo bằng:

```sh
node deploy/beta/package.mjs /DUONG_DAN_RIENG/tinhluan-free-beta-1.47.0
```

Đích phải chưa tồn tại. Nhận thư mục nguồn, `release-manifest.json` và `.tar.gz`. Gói dùng danh sách file cho phép; không chứa `.env`, DB, kho báo cáo, node_modules hoặc build macOS. Đây là gói cho người triển khai, không đặt trong thư mục phục vụ công khai.

Bố trí đề xuất:

```text
/opt/tinhluan/releases/<release-id>/   source + node_modules + build Linux
/opt/tinhluan/current                 symlink đến release đang chạy
/etc/tinhluan/beta.env                cấu hình riêng, mode 0600
/var/lib/tinhluan/internal-readings/   báo cáo nội bộ đã lưu
/var/lib/tinhluan/trial-readings/      sessions + readings của khách
/var/lib/tinhluan/run/                heartbeat web/worker
/var/backups/tinhluan/<UTC-time>/      dump + hai kho + manifest
```

Tạo tài khoản hệ điều hành riêng `tinhluan` có home `/var/lib/tinhluan` (không cho shell đăng nhập). Chạy bằng tài khoản này, không dùng root cho web/worker. Cấp quyền đọc release, ghi đúng `/var/lib/tinhluan` và `/var/backups/tinhluan`; kho dữ liệu không nằm trong `public/`. Không liên kết kho QA trực tiếp sang máy đích.

## 3. Cấu hình, dữ liệu và build

1. Chuyển gói nguồn qua kênh quản trị an toàn, kiểm SHA-256 và file manifest. Giải nén vào release mới. Tạo user/thư mục theo bố trí trên.
2. Sao chép `deploy/beta/env.example` thành `/etc/tinhluan/beta.env`; nhập trực tiếp trên máy, không đưa secret vào Git, shell history hoặc chat. Đặt owner `tinhluan`, mode `0600`.
3. Điền DATABASE_URL; khóa nội bộ ngẫu nhiên tối thiểu32ký tự; APP_ORIGIN và RECOVERY_ORIGIN cùng HTTPS chính thức. PORT3000/PDF loopback phải cùng web. Hai dịch vụ đọc **một file cấu hình**, không dựa vào `.env` khác nhau.
4. Điền Gmail đầy đủ, App Password, **đúng địa chỉ nhận thử đã được cho phép**. Giữ STARTTLS587/From trùng tài khoản qua adapter hiện có. Không bỏ allowlist hoặc mở gửi đại trà. Không gửi thư trong lần chuẩn bị này.
5. Giữ FREE_TRIAL_ENABLED=true; BETA_ENABLED, DEMO_ENABLED, CORE_ORDER_TEST_ENABLED, SEPAY_TEST_ENABLED và SEPAY_LIVE_ENABLED=false. PAYMENT_PROVIDER=mock không có nghĩa cho phép khách tự paid: các cổng mock/test đều tắt; Nginx còn chặn đường payment. Dữ liệu đơn cũ vẫn lưu để admin tra cứu. Luồng truy cập đơn thử chuyên biệt vẫn ở QA, không là checkout beta.
6. Phục hồi **backup mới nhất** của QA vào database mới và kho mới bằng mục5. Backup diễn tập ngày18/10 chỉ là bằng chứng; không dùng bản đó thay lần chụp cuối khi chuyển máy. Bản phục hồi đã có schema001–007; **không chạy lại `npm run db:migrate`**, vì script hiện còn upsert gói/giá demo. Không phát sinh migration ứng dụng trong đợt này. Nếu cần database trống, phải áp riêng các SQL `db/001_init.sql`…`007_reading_recovery.sql` theo thứ tự trong transaction bằng công cụ quản trị; cách đó không mang34bài và báo cáo hiện có sang.
7. Trong release, chạy:

```sh
npm ci --include=dev
npx playwright install --with-deps chrome
node --env-file=/etc/tinhluan/beta.env node_modules/next/dist/bin/next build
node --env-file=/etc/tinhluan/beta.env deploy/beta/health.mjs --preflight --chrome
```

Cài dependencies hệ điều hành của Chrome bằng quyền quản trị khi cần; không chạy ứng dụng bằng root. Build phải chạy trên máy/CI Linux tương thích. Không build đè release đang phục vụ. Lưu lockfile, BUILD_ID, phiên bản Node/Chrome/Postgres và kết quả kiểm vào hồ sơ release.

## 4. Khởi động, HTTPS và health

Cài các file `deploy/beta/*.service`, `*.timer` vào `/etc/systemd/system/`. Chỉnh đường Node nếu không ở `/usr/local/bin/node`; bộ mẫu dùng đúng vị trí này. Đặt symlink `current` vào release đã build.

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now tinhluan-web.service tinhluan-worker.service
sudo systemctl enable --now tinhluan-health.timer tinhluan-backup.timer
node --env-file=/etc/tinhluan/beta.env deploy/beta/health.mjs --chrome
```

Web bind127.0.0.1; systemd tự khởi động cùng máy và restart khi tiến trình kết thúc, chờ5giây. Worker dùng hàng đợi hiện có; wrapper giữ advisory lock theo DB để chặn worker wrapper thứ hai. **Worker cũ chạy trực tiếp không dùng lock này: vẫn phải dừng thủ công trước chuyển đổi.** Không chạy chồng worker QA và máy đích trên cùng database.

Dùng `deploy/beta/nginx.conf.example`: thay domain/chứng thư HTTPS, đặt vào http/sites-enabled phù hợp distro, chạy `nginx -t` rồi mới reload. Chưa có chứng thư/DNS thì chưa mở beta. Không tự đổi DNS. Chỉ mở80/443 và kênh quản trị được giới hạn; PostgreSQL không mở công khai.

Access log mẫu chỉ ghi `$uri`, không query/body/cookie. Error log Nginx bị tắt vì lỗi proxy có thể chứa nguyên request và token email; không bật debug log/request dump. Dùng mã lỗi được lọc của ứng dụng/health để điều tra. Nếu cần bật log hạ tầng, phải lọc token trước khi lưu, không bật tùy tiện ở đường recovery.

Health là CLI nội bộ, không endpoint lộ cấu hình. Kiểm DB/schema, quyền kho, heartbeat/pid web/worker, trang nhập/Toàn thư và job pending/retry quá10phút. `--preflight` mới thử ghi/xóa một file kiểm kho; health định kỳ không ghi vào kho báo cáo. `--chrome` kiểm Chrome khởi động. Heartbeat chứng minh tiến trình/DB còn sống, **không chứng minh worker đã giao báo cáo hoặc thư đã đến Inbox**. Timer health không tự restart một tiến trình bị treo hoặc tự gửi cảnh báo; người vận hành cần xem `systemctl --failed`/health, nối cảnh báo khi đã có đích nhận. Lỗi job terminal cần tra admin, không được suy health xanh là mọi job thành công.

## 5. Sao lưu và phục hồi

### Sao lưu

```sh
node --env-file=/etc/tinhluan/beta.env deploy/beta/backup.mjs /var/backups/tinhluan/20261018T080000Z
```

Đích phải mới. Sao lưu **toàn bộ24bảng hiện tại** bằng pg_dump custom ở snapshot PostgreSQL nhất quán, kèm cả hai kho (bao gồm sessions khách) và SHA-256. Kiểm kho trước/sau; nếu có file đổi trong quá trình chụp, lệnh trả `STORE_CHANGED_RETRY_IN_MAINTENANCE`, **không có manifest hoàn tất**. Không sử dụng thư mục thất bại để restore. Khi có lượt ghi, tạm ngừng tạo/mutate qua web và dừng worker, chụp lại vào thư mục mới; không ép backup đang đổi dữ liệu thành hợp lệ.

Timer mẫu chạy03:15theo múi giờ máy đích, bù lượt lỡ khi khởi động lại. Không xóa backup tự động. Cần chốt múi giờ, thời gian lưu, mức mất dữ liệu chấp nhận được và nơi lưu ngoài máy. Một bản trên cùng ổ **chưa chống mất máy/ổ**. Database dump chứa thông tin riêng tư/email/tokenhash; file0700/0600, không nằm trong release/public. Mã hóa bản chuyển ra ngoài bằng công cụ/kho do chủ dự án chọn. Secret `.env` không đi trong backup này: lưu riêng trong kho quản trị an toàn.

### Phục hồi vào database/kho mới

```sh
node --env-file=/etc/tinhluan/beta.env deploy/beta/restore.mjs \
  /var/backups/tinhluan/20261018T080000Z \
  tinhluan_restore_20261018 \
  /var/lib/tinhluan/restore-20261018
```

Tên DB phải bắt đầu `tinhluan_restore_`; database và thư mục đích **chưa tồn tại**. Script kiểm hash trước, CREATE DATABASE, pg_restore transaction, kiểm count/hash từng bảng và từng file. Không DROP, không `--clean`, không ghi lên QA. Nếu lỗi giữa chừng, giữ đích để điều tra; lần chạy sau chọn đích mới.

Kết nối quản trị lấy từ RESTORE_ADMIN_DATABASE_URL nếu có, nếu không dùng DATABASE_URL, chuyển DB kết nối sang `postgres`. Quyền cần: kết nối postgres + CREATEDB + đọc backup. Với đích tự quản lý, có thể tạm cấp CREATEDB cho role sở hữu ứng dụng, restore dưới role đó rồi thu hồi CREATEDB. Do `--no-owner --no-acl`, các object thuộc role restore; **không restore bằng superuser rồi bỏ qua ownership/grant**. Nếu dùng managedPostgres/role riêng, cần xác minh CREATE DATABASE, ownership, quyền và TLS với nhà cung cấp trước. Hỗ trợ chuyển tham số sslmode/sslrootcert/sslcert/sslkey cho công cụ pg; chứng thư phải tồn tại trên máy đích. Chưa nghiệm thu managedPostgres/remoteTLS.

Cho diễn tập loopback: env riêng DEPLOY_MODE=restore-drill, DBtinhluan_restore_…, port riêng, kho mới; EMAIL_PROVIDER=unconfigured, GMAIL_SMTP_ENABLED=false, READING_RECOVERY_ENABLED=false, các payment/testflagsfalse. Wrapper từ chối khởi động worker nếu DB phục hồi còn job pending/retry, để tránh xử lý tác vụ thật. Không xóa hàng đợi để lách kiểm; nếu có backlog chỉ kiểm web, dừng ở đó và lập cách cô lập tác vụ phù hợp. Khi cutover thật dùng DEPLOY_MODE=beta và Gmail allowlist, giữ quyền/hạn gốc.

### Kết quả diễn tập thực tế18/10

- Backup từ DB/kho QA chính, không lấy dữ liệu3070: **24bảng,31file internal và34file trial**. Đây là65file bao gồm session, không phải65báo cáo.
- Restore vào `tinhluan_restore_1792309428904`, kho `.local/beta-deploy-20261018/restored/`, web3072/worker riêng. Toàn bộ24bảng và65file khớp hash/count.
- Mở bản lưu `07c6d81e-465b-4595-8669-f547bad59090`: HTTP200, đúng tên/version1.47.0. Xuất1PDF bằng bộ xuất hiện có;9trang, đủ21/21đoạn frozen; đã xem cả9trang, không thấy trang trắng/cắt chữ. Không chạy lại catalog, không sửa bản lưu.
- 34 bài công khai; khách gọi APIadmin403. Chặn worker wrapper trùng; chặn restore đè thư mục và dump bị đổi hash trước khi tạo DB.
- 11/11 test cấu hình ban đầu đạt; lượt cuối bổ sung kiểm chuyển tham số TLS đạt **12/12**, không fail/skip. Kiểm cú pháp 7 file MJS đạt. Nginx `-t` đạt với chứng thư fixture; lượt đầu bị sandbox chặn sysctl/log mặc định, lượt sau dùng log `/dev/null` và quyền chạy kiểm cú pháp đạt. Không start Nginx. Không chạy gate nội dung, typecheck/build ứng dụng hoặc cả bộ PDF vì không sửa ứng dụng. Diễn tập dùng build production đã nghiệm thu của QA chính; buildLinux là bước còn phải làm trên máy đích.
- Lượt start đầu của harness bị `GMAIL_CONFIG_INVALID` vì import script QA có side effect đọc argv. Sửa riêng harness để đọc cấu hình cần thiết mà không import startupQA; lượt sau web/worker/health đạt. Đây không phải lỗi gửi Gmail, không gửi email và không khởi động lại QA chính.
- Kết thúc diễn tập: đã dừng riêng web/worker3072; giữ backup và DB phục hồi để tra cứu. Main24bảng và65file vẫn khớp hash trước/sau;284file source ứng dụng khớp checkout QA đang chạy. QA3062/3070 vẫn trả200, main giữ34bài công khai.
- Bằng chứng riêng: `.local/beta-deploy-20261018/{private-backup/manifest.json,restored/restore-result.json,restored-reading-check.json,pdf-check.json,negative-checks.json,source-comparison.json}`. Backup/DB phục hồi có dữ liệu riêng tư, không đưa vào gói nguồn.

## 6. Chuyển phiên bản và quay lui

Trước cutover: giữ release cũ + cấu hình cũ trong kho secret; chụp backup nhất quán mới nhất khi đã khóa ghi. Dừng worker cũ, triển khai vào DB/kho mới theo mục5, kiểm bằng hostname nội bộ/hosts trước khi chủ dự án đổiDNS. Không cho hai môi trường cùng nhận dữ liệu mới trong lúc chuyển. Chỉ chuyển HTTPS/domain khi smoke đạt.

Trong một máy đã dùng cấu trúc releases: dừng web/worker, đổi `current` sang release mới đã build, dùng cùng beta.env/kho đã xác minh, start và smoke. Gói này không đổi schema nên rollback phần code là dừng hai dịch vụ, trỏ `current` lại release cũ và start; **không restore DB cũ đè dữ liệu mới**. Nếu lỗi do dữ liệu/migration ở đợt khác, giữ bản lỗi để điều tra, restore vào DB/kho mới và lập kế hoạch giữ các giao dịch sau backup trước khi chuyển; không tự coi rollbackDB là không mất dữ liệu.

Người dùng đang có cookie trên ngrok **không tự mang cookie sang domain mới**. Snapshot/báo cáo vẫn được bảo toàn; khôi phục qua email chỉ dùng email đã xác minh và địa chỉ thử được phép. Khách chưa xác minh email không có bảo đảm mở lại xuyên domain. Phiên miễn phí hiện có hạn7ngày và cơ chế dọn phiên hết hạn; restore không kéo dài quyền. Cần thông báo phạm vi beta này trước khi mời người dùng mới, không hứa lưu vô hạn.

## 7. Kiểm sau triển khai máy đích

1. Health preflight/running/Chrome đạt; restart một lần từng service và reboot máy có chủ đích để xác nhận auto-start, không làm trên QA hiện hành. Kiểm chỉ một worker trên DB.
2. Phiên khách mới: nhập → tạo → cơ bản/chi tiết → tải lại → PDF đúng bản lưu. Hai phiên không đọc/PDF chéo, khách không vàoadmin; kiểm mobile một ca360/390px. Không dùng ID làm quyền.
3. Toàn thư đủ34bài đúngnhóm, tìm kiếm/mởliênquan; adminđăngnhập trađúngbáocáo/đơn. Nháp/bàibổtrợ không bị mở thêm.
4. Gửi duy nhất tới Gmail nhận thử đã chỉ định, xác minh link đúngHTTPS; mở trên phiên mới, đọc/PDF; dùng lại token bị chặn. Phân biệt SMTPaccepted với thư nhận được. Không gửi cho khách khác.
5. Kiểmpaymentroute bịchặn,Livefalse; logkhôngtoken/secret; chụpbackupđầu tiên và healthtimer. Kiểm hashbáocáocũ trước/sau.

Các bước trên cần chạy khi có máy đích; kết quảlocal không thay cho nghiệm thu đó.

## 8. Còn chờ chủ dự án

- Máy chủ/nhà cung cấp, OS, kiến trúcCPU, RAM/SSD và quyền triển khai; không gửi mật khẩu/privatekey qua chat.
- Domain/subdomain cho beta và người quản lýDNS/chứng thư. Chưa mua dịch vụ/đổiDNS trong gói này.
- PostgreSQL cùng máy hay managed, phiên bản/quyền/CA nếuremote; vùng lưu dữ liệu, nơi lưu backup ngoài máy, thời gian giữ và mức khôi phục mong muốn.
- Chuyển secret trực tiếp vào máy đích: DB,khóanộibộ,GmailAppPassword và người nhận thử; xác nhận giữ allowlist hiện hành. Chưa mở emailđạitrà.
- Thời điểm khóa ghi/cutover và cách thông báo đổi domain/hạn phiên. Cần kết quả build/restart/HTTPS/PDF trênLinux trước khi ghi đã triển khai ổn định.

## Tài liệu vận hành tham khảo

- Next.js: https://nextjs.org/docs/app/guides/self-hosting
- Playwright/Chrome: https://playwright.dev/docs/browsers
- PostgreSQL restore: https://www.postgresql.org/docs/17/app-pgrestore.html (diễn tập thực dùngPG16.14)
- systemd service/restart: https://www.freedesktop.org/software/systemd/man/257/systemd.service.html
- Nginx proxy: https://nginx.org/en/docs/http/ngx_http_proxy_module.html

Hướng dẫn này là cấu hình beta mới; không dùng phần demo/payment trong tài liệu vận hành đời đầu để mở Live.
