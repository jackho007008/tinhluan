# Đưa Tinh Luận beta lên Ubuntu

Dành cho **máy Ubuntu24.04 x86_64 mới**, PostgreSQL cùng máy. Chưa biết phiên bản/CPU máy của bạn: kiểm bước1 trước; nếu ARM64 hoặc máy đang chạy dịch vụ khác, không chạy nguyên xi phần cài Node/Nginx. Gói giữ bản miễn phí, Toàn thư34bài và admin; Gmail chỉ một email thử, không bật thanh toán.

Các lệnh dưới đây **chưa được chạy trên máy chủ của bạn**. Đã diễn tập backup/restore/web/worker/PDF trên máy hiện tại; phải hoàn thành bước10 trên Ubuntu mới coi là deploy đạt. Không cần gửi mật khẩu qua chat. Nếu một lệnh thất bại, dừng ở bước đó và xử lý lỗi trước; không dán tiếp toàn bộ hướng dẫn bất chấp lỗi.

## 1. Kiểm máy và chuẩn bị tên miền

Đăng nhập SSH bằng tài khoản có sudo, rồi chạy:

```sh
cat /etc/os-release
uname -m
free -h
df -h /
```

Hướng dẫn này cần Ubuntu24.04 và `x86_64`. Dự trù ban đầu2vCPU/4GBRAM/40GBSSD, chưa phải cam kết tải. Chọn domain/subdomain, ví dụ `beta.tenmiencuaban.vn`; tự trỏ bản ghi A về IP máy. Nếu có AAAA thì IPv6 cũng phải về đúng máy. Mở80/443 ở firewall nhà cung cấp và giữ cổngSSH đang dùng; không mở3000/5432. Không bật lại/reset firewall mù quáng làm mấtSSH.

Trong terminal Ubuntu, đặt tên miền thật (không kèm https hoặc dấu `/`):

```sh
TL_DOMAIN=beta.tenmiencuaban.vn
TL_RELEASE=/opt/tinhluan/releases/1.47.0-beta-20261018
```

Các biến không chứa secret. Nếu mở terminal mới, đặt lại hai biến này.

## 2. Cài môi trường

```sh
sudo apt update
sudo apt install -y ca-certificates curl xz-utils nginx postgresql-16 postgresql-client-16 snapd
sudo systemctl enable --now postgresql nginx
```

Cài bản mới nhất thuộc nhánhNode22 từ máy chủ chính thức, kiểm checksum trước giải nén. Dành cho máy chưa có `/opt/node22`; nếu đã có, giữ bản cũ và dùng thư mục version riêng thay vì ghi đè.

```sh
mkdir -p /tmp/tinhluan-node22
cd /tmp/tinhluan-node22
curl -fSLO https://nodejs.org/dist/latest-v22.x/SHASUMS256.txt
TL_NODE_ARCHIVE=$(awk '$2 ~ /^node-v22\..*-linux-x64\.tar\.xz$/ {print $2}' SHASUMS256.txt)
test -n "$TL_NODE_ARCHIVE"
curl -fSLO "https://nodejs.org/dist/latest-v22.x/$TL_NODE_ARCHIVE"
awk -v f="$TL_NODE_ARCHIVE" '$2 == f {print}' SHASUMS256.txt | sha256sum -c -
sudo mkdir /opt/node22
sudo tar -xJf "$TL_NODE_ARCHIVE" --strip-components=1 -C /opt/node22
sudo ln -s /opt/node22/bin/node /usr/local/bin/node
sudo ln -s /opt/node22/bin/npm /usr/local/bin/npm
sudo ln -s /opt/node22/bin/npx /usr/local/bin/npx
/usr/local/bin/node --version
/usr/local/bin/npm --version
```

Nếu symlink đã tồn tại, **không thêm `-f` để ghi đè** trước khi kiểm phần mềm đang dùng. Bộ systemd bàn giao chạy `/usr/local/bin/node`. Lưu phiên bảnNode thực cài trong nhật ký triển khai.

## 3. Chuyển mã nguồn và dữ liệu riêng

Trên Ubuntu tạo chỗ nhận riêng:

```sh
mkdir -m 700 ~/tinhluan-upload
```

Trên **máy Mac có dự án**, thay `USER@SERVER_IP` bằng SSH của bạn rồi chuyển hai phần:

```sh
scp /Volumes/DATA/TINHLUAN/.local/beta-deploy-20261018/tinhluan-free-beta-1.47.0-ubuntu.tar.gz USER@SERVER_IP:~/tinhluan-upload/
scp /Volumes/DATA/TINHLUAN/.local/beta-deploy-20261018/tinhluan-free-beta-1.47.0-ubuntu.tar.gz.sha256 USER@SERVER_IP:~/tinhluan-upload/
scp -r /Volumes/DATA/TINHLUAN/.local/beta-deploy-20261018/private-backup USER@SERVER_IP:~/tinhluan-upload/
```

`private-backup` chứa dữ liệu riêng tư, không gửi link công khai. Đây là snapshot nghiệm thu18/10; nếu QA có dữ liệu mới sau đó, phải chụp lại backup cuối khi đã ngừng ghi. Không tuyên bố bản snapshot cũ đã mang đủ dữ liệu mới nhất. Gói nguồn không chứa secret hoặc dữ liệubackup.

Trên Ubuntu:

```sh
cd ~/tinhluan-upload
sha256sum -c tinhluan-free-beta-1.47.0-ubuntu.tar.gz.sha256
sudo useradd --system --home-dir /var/lib/tinhluan --shell /usr/sbin/nologin tinhluan
sudo install -d -o tinhluan -g tinhluan -m 750 /opt/tinhluan/releases /var/lib/tinhluan
sudo install -d -o tinhluan -g tinhluan -m 700 /var/lib/tinhluan/run /var/backups/tinhluan
sudo install -d -o root -g tinhluan -m 750 /etc/tinhluan
sudo mkdir "$TL_RELEASE"
sudo tar -xzf ~/tinhluan-upload/tinhluan-free-beta-1.47.0-ubuntu.tar.gz --strip-components=1 -C "$TL_RELEASE"
sudo cp -a ~/tinhluan-upload/private-backup /var/backups/tinhluan/qa-import-20261018
sudo chown -R tinhluan:tinhluan "$TL_RELEASE" /var/backups/tinhluan/qa-import-20261018
sudo chmod 700 /var/backups/tinhluan/qa-import-20261018
cd "$TL_RELEASE"
sudo -u tinhluan /usr/local/bin/npm ci --include=dev
```

Không chạy lại `useradd`, `mkdir release`, copybackup trên đích đã tồn tại; chọn tên release/đích mới cho lần triển khai sau. Kiểm archive SHA-256 với `package-check-ubuntu.json` được bàn giao. File manifest có hash từng file; scriptrestore còn tự kiểmdump/kho trước khi dùng.

## 4. Cấu hình database và bí mật

Tạo role Postgres, nhập mật khẩu trực tiếp ở prompt:

```sh
sudo -u postgres createuser --pwprompt tinhluan
sudo -u postgres psql -c 'ALTER ROLE tinhluan CREATEDB;'
sudo install -o tinhluan -g tinhluan -m 600 deploy/beta/env.example /etc/tinhluan/beta.env
sudoedit /etc/tinhluan/beta.env
```

Điền trong file (không đưa vào lệnh hoặc chat):

- `DATABASE_URL=postgresql://tinhluan:MAT_KHAU_DA_URL_ENCODE@127.0.0.1:5432/tinhluan_restore_beta_20261018`. Mật khẩu có ký tự đặc biệt phải percent-encode trongURL; không thay mật khẩu PostgreSQL thành bản đã encode. Chưa cần tự tạoDB: bước 5 sẽ tạo mới.
- `APP_ORIGIN=https://TEN_MIEN_THAT`, `RECOVERY_ORIGIN` y hệt.
- `INTERNAL_REVIEW_KEY`: chuỗi ngẫu nhiên ít nhất32ký tự, chỉ dùng đăng nhậpadmin; lưu trong kho mật khẩu. Không dùng khóa ví dụ.
- `INTERNAL_READING_DIR=/var/lib/tinhluan/restore-beta-20261018/internal`
- `TRIAL_READING_DIR=/var/lib/tinhluan/restore-beta-20261018/trial`
- `GMAIL_SMTP_USER`, `GMAIL_SMTP_APP_PASSWORD`, `GMAIL_SMTP_TEST_TO`: nhập lại bí mật đã nghiệm thu qua kênh riêng; TEST_TO phải đúng người nhận thử được cho phép.

Giữ nguyên các cờ còn lại trong mẫu. Không bỏ giới hạn Gmail. Không bật SePayLive/test/mockorder. `CUSTOMER_PDF_ORIGIN` giữloopback3000; không đặt URLHTTPS vào đây. Không in toànfileenv để chụp màn hình/log.

## 5. Restore dữ liệu, không seed lại giá/demo

Trong release:

```sh
sudo -u tinhluan /usr/local/bin/node --env-file=/etc/tinhluan/beta.env deploy/beta/restore.mjs \
  /var/backups/tinhluan/qa-import-20261018 \
  tinhluan_restore_beta_20261018 \
  /var/lib/tinhluan/restore-beta-20261018
sudo -u postgres psql -c 'ALTER ROLE tinhluan NOCREATEDB;'
```

Chỉ tiếp tục khi trả `ok:true`, hash/count khớp. Nếu lỗi, giữ nguyên đích để điều tra, chọn DB/thư mục mới và sửa env tương ứng; **không DROP database hoặc xóa đích để chạy lại theo thói quen**. Quyền CREATEDB chỉ cấp trong thời gian restore, thu hồi kể cả khi thao tác lỗi.

Database backup đã có schema 001–007 và 34 bài xuất bản. **Không chạy `npm run db:migrate`**: lệnh cũ còn ghi giá/gói demo. Không copy DB3070.

## 6. Chrome và build trên Ubuntu

```sh
cd "$TL_RELEASE"
sudo /usr/local/bin/node node_modules/playwright/cli.js install --with-deps chrome
sudo -u tinhluan /usr/local/bin/node --env-file=/etc/tinhluan/beta.env node_modules/next/dist/bin/next build
sudo -u tinhluan /usr/local/bin/node --env-file=/etc/tinhluan/beta.env deploy/beta/health.mjs --preflight --chrome
```

Chrome được cài vào máy; lệnh cài dependency cần quyền root, ứng dụng không chạy root. Nếu đường dẫn `node_modules/playwright/cli.js` không có thì `npm ci --include=dev` chưa hoàn tất theo lockfile; không dùng bản CLI tự cập nhật ngẫu nhiên. Health preflight không yêu cầu web/worker đang chạy. Build Linux và Chrome phải đạt mới chuyển tiếp; đây là kiểm trên máy đích, không thay bằng bằng chứng macOS.

## 7. HTTPS trước khi mở ứng dụng

Tạo site HTTP tối thiểu để lấy chứng thư, chưa chuyển tiếp tới ứng dụng:

```sh
sudo mkdir -p /var/www/letsencrypt
sudo tee /etc/nginx/sites-available/tinhluan-bootstrap >/dev/null <<EOF_NGINX
server {
    listen 80;
    server_name $TL_DOMAIN;
    access_log off;
    error_log /dev/null;
    location ^~ /.well-known/acme-challenge/ { root /var/www/letsencrypt; }
    location / { return 503; }
}
EOF_NGINX
sudo ln -s /etc/nginx/sites-available/tinhluan-bootstrap /etc/nginx/sites-enabled/tinhluan-bootstrap
sudo nginx -t
sudo systemctl reload nginx
sudo snap install --classic certbot
sudo /snap/bin/certbot certonly --webroot -w /var/www/letsencrypt -d "$TL_DOMAIN"
```

Certbot sẽ hỏi email/quy định; bạn tự nhập. DNS và port 80 phải đúng. Chỉ cài proxy thật sau khi lấy chứng thư thành công:

```sh
sudo sed "s/beta.example.invalid/$TL_DOMAIN/g" "$TL_RELEASE/deploy/beta/nginx.conf.example" | sudo tee /etc/nginx/sites-available/tinhluan >/dev/null
sudo rm /etc/nginx/sites-enabled/tinhluan-bootstrap
sudo ln -s /etc/nginx/sites-available/tinhluan /etc/nginx/sites-enabled/tinhluan
sudo nginx -t
sudo systemctl reload nginx
sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
sudo tee /etc/letsencrypt/renewal-hooks/deploy/reload-tinhluan-nginx >/dev/null <<'EOF_HOOK'
#!/bin/sh
set -eu
/usr/sbin/nginx -t
/bin/systemctl reload nginx
EOF_HOOK
sudo chmod 750 /etc/letsencrypt/renewal-hooks/deploy/reload-tinhluan-nginx
sudo /snap/bin/certbot renew --dry-run
```

Chỉ xóa symlink bootstrap vừa tạo, không xóa site khác. Template giữ webroot ACME trên HTTP để gia hạn; access log không chứa query/token. Nếu sai domain/đường dẫn chứng thư thì `nginx -t` thất bại: không reload. Chưa có domain HTTPS thì dừng tại đây; không hạ tiêu chuẩn email xuống HTTP.

## 8. Bật web, worker và lịch sao lưu

Dừng worker cũ nếu dùng cùng DB. Máy Ubuntu này dùng DB riêng đã restore; không chạy thêm worker thứ hai. QA3062/3070 không bị các lệnh này tác động.

```sh
sudo ln -s "$TL_RELEASE" /opt/tinhluan/current
sudo cp "$TL_RELEASE"/deploy/beta/*.service "$TL_RELEASE"/deploy/beta/*.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now tinhluan-web.service tinhluan-worker.service
sudo systemctl enable --now tinhluan-health.timer tinhluan-backup.timer
cd /opt/tinhluan/current
sudo -u tinhluan /usr/local/bin/node --env-file=/etc/tinhluan/beta.env deploy/beta/health.mjs --chrome
sudo systemctl status tinhluan-web tinhluan-worker --no-pager
```

Nếu `current` đã có, dùng quy trình đổi release/quay lui, không chạy `ln -sf` khi web còn phục vụ. Timer backup chạy 03:15 theo múi giờ máy; kiểm `timedatectl`. Backup cùng ổ chưa đủ chống mất máy: cần chọn nơi lưu bên ngoài, mã hóa và thời gian lưu trước beta rộng.

## 9. Các đường để thử

- `https://TEN_MIEN/lap-la-so`: khách tự nhập, đọc cơ bản/chi tiết và PDF.
- `https://TEN_MIEN/toan-thu`: 34 bài đã công khai.
- `https://TEN_MIEN/internal`: đăng nhập nội bộ bằng khóa đã cấu hình.
- `https://TEN_MIEN/internal/admin`: quản trị đơn/báo cáo.
- `https://TEN_MIEN/internal/admin/toan-thu`: quản lý Toàn thư.

Không gửi khóa nội bộ trong URL. Trang công khai không cần khóa; một phiên không được đọc báo cáo của phiên khác.

## 10. Checklist để ghi triển khai đạt

- Health web/worker/DB/Chrome đạt; restart từng service, rồi reboot có chủ đích và kiểm chúng tự lên. Không gọi đã kiểm tự khởi động chỉ vì có file unit.
- Tạo một báo cáo mới → đọc → tải lại → PDF; một báo cáo cũ mở đúng nội dung/phiên bản. Hai browser profile khác nhau bị chặn đọc/PDF chéo; khách bị chặn admin.
- Toàn thư đủ 34 bài, bài liên quan hoạt động; nháp/fixture không lộ. Kiểm điện thoại 360/390px.
- Chỉ gửi Gmail tới địa chỉ thử đã chốt, link đúng domain; kiểm thư thực nhận, đổi token, đọc/PDF, dùng lại bị chặn. Không mở gửi đại trà.
- Chạy backup thủ công vào đích mới, kiểm manifest hoàn tất. Không cần xuất lại hàng loạt PDF hoặc chạy toàn bộ gate.
- Live vẫn tắt. Không coi đã triển khai là phê duyệt chuyên môn hoặc đủ điều kiện thu phí.

Cookie của ngrok không chuyển sang domain mới. Phiên miễn phí hiện có hạn 7 ngày; không tự gia hạn khi restore. Người chưa xác minh email không được hứa quyền mở lại xuyên domain. Kho 34 bài/báo cáo vẫn có, nhưng quyền phiên phải giữ đúng hợp đồng.

## 11. Khi triển khai lỗi

Dừng web/worker của **máy Ubuntu này**, không động QA trên Mac:

```sh
sudo systemctl stop tinhluan-web tinhluan-worker
```

Lần đầu chưa có release cũ: giữ DB/kho để điều tra, khôi phục trang bảo trì, chưa mở beta. Lần nâng cấp: lưu trạng thái lỗi, đổi `current` về release cũ đã build rồi start hai dịch vụ. Gói này không đổi schema; không restore DB cũ đè dữ liệu mới chỉ để quay code. Hướng dẫn chi tiết ở [BETA-DEPLOYMENT.md](BETA-DEPLOYMENT.md).

## Căn cứ cài đặt

- [Ubuntu: PostgreSQL](https://ubuntu.com/server/docs/how-to/databases/install-postgresql/).
- [Node.js: bản phân phối chính thức](https://nodejs.org/en/download/) — lệnh trên chọn nhánh 22 và kiểm checksum khi tải, không khẳng định một bản patch chưa kiểm.
- [Playwright: cài Chrome](https://playwright.dev/docs/browsers).
- [Certbot: hướng dẫn chính thức](https://certbot.eff.org/instructions?os=snap&tab=standard&ws=nginx).
