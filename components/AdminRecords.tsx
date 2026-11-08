import { Suspense, type ReactNode } from 'react';
import { adminUser, adminUsers } from '@/lib/admin/extended';
import { adminReading, adminReports, type AdminQuery } from '@/lib/admin/operations';
import { AdminPager, adminUrl } from './AdminPanels';
import CustomerReading from './CustomerReading';
import { Alert, Button, Card, EmptyState, Skeleton, StatusBadge } from './co-thu/primitives';

const missing = 'Chưa có dữ liệu';
const titles: Record<string, string> = {
  users: 'Khách hàng', user: 'Chi tiết khách hàng',
  reports: 'Lá số & báo cáo', report: 'Chi tiết báo cáo',
};
const labels: Record<string, string> = {
  free: 'Miễn phí', order: 'Gắn đơn hàng', internal: 'Nội bộ',
  pending: 'Chờ thanh toán', paid: 'Đã thanh toán', expired: 'Hết hạn',
  ready: 'Đã giao', waiting: 'Chờ giao', retry: 'Chờ thử lại', failed: 'Lỗi',
  'in-term': 'Trong hạn', revoked: 'Đã thu hồi', unavailable: 'Chưa có quyền hiệu lực',
};
const when = (date: string | Date) => new Date(date).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
const money = (amount: number | string) => Number(amount).toLocaleString('vi-VN') + ' ₫';

function email(value: string | null) {
  if (!value) return 'Chưa có email';
  const at = value.lastIndexOf('@');
  return at > 0 ? value.slice(0, 1) + '***' + value.slice(at) : '***';
}
function State({ value }: { value: string }) {
  const tone = ['paid', 'ready', 'in-term'].includes(value) ? 'success'
    : ['failed', 'revoked'].includes(value) ? 'danger' : 'neutral';
  return <StatusBadge tone={tone}>{labels[value] || value}</StatusBadge>;
}
function Table({ columns, rows, title }: { columns: string[]; rows: { key: string; cells: ReactNode[] }[]; title: string }) {
  return <div className="records-table-wrap"><table className="records-table">
    <caption className="sr-only">{title}</caption>
    <thead><tr>{columns.map(col => <th scope="col" key={col}>{col}</th>)}</tr></thead>
    <tbody>{rows.map(row => <tr key={row.key}>{row.cells.map((cell, index) =>
      <td key={columns[index]}><span className="records-cell-label" aria-hidden="true">{columns[index]}</span><div>{cell}</div></td>)}</tr>)}</tbody>
  </table></div>;
}
function Filter({ q }: { q: AdminQuery }) {
  return <form className="records-filters" method="get">
    <input type="hidden" name="view" value={q.view}/>{q.id && <input type="hidden" name="id" value={q.id}/>}
    <label>Tìm kiếm<input name="q" defaultValue={q.q} maxLength={120} placeholder={q.view === 'users' ? 'Tên, email hoặc ID' : 'Tên hoặc ID'}/></label>
    {q.view === 'reports' && <label>Nguồn<select name="source" defaultValue={q.source}>
      <option value="all">Tất cả</option><option value="free">Miễn phí</option><option value="order">Gắn đơn hàng</option><option value="internal">Nội bộ</option>
    </select></label>}
    <label>Từ ngày<input type="date" name="from" defaultValue={q.from}/></label>
    <label>Đến ngày<input type="date" name="to" defaultValue={q.to}/></label>
    <label>Mỗi trang<select name="size" defaultValue={q.size}>{[5, 20, 50].map(size => <option key={size}>{size}</option>)}</select></label>
    <Button type="submit">Tìm kiếm</Button><a href={adminUrl({ view: q.view, id: q.id })}>Xóa bộ lọc</a>
  </form>;
}
function NoRows({ title, q }: { title: string; q: AdminQuery }) {
  return <EmptyState title={title} action={<a href={adminUrl({ view: q.view, id: q.id })}>Xóa bộ lọc</a>}/>;
}
function Stat({ title, value }: { title: string; value: ReactNode }) {
  return <Card className="records-stat"><h2>{title}</h2><strong>{value}</strong></Card>;
}
function Customers({ d, q }: { d: Awaited<ReturnType<typeof adminUsers>>; q: AdminQuery }) {
  return <><p>{d.total} tài khoản khớp bộ lọc</p><Filter q={q}/>
    {d.items.length ? <Table title="Danh sách khách hàng"
      columns={['Mã KH', 'Tài khoản', 'Ngày đăng ký', 'Lá số lưu', 'Đơn hàng', 'Tổng đã thanh toán', 'Trạng thái']}
      rows={d.items.map(user => ({ key: user.id, cells: [
        <a className="records-id" href={adminUrl({ view: 'user', id: user.id })}>{user.id}</a>,
        <>{user.name || 'Khách hàng'}<br/>{email(user.email)}{user.admin && <p>Vai trò quản trị</p>}</>,
        when(user.created_at), user.readings, user.orders, missing, missing,
      ] }))}/> : <NoRows title="Không có khách hàng phù hợp" q={q}/>}
    <AdminPager q={q} total={d.total}/></>;
}
function CustomerDetail({ d, q }: { d: NonNullable<Awaited<ReturnType<typeof adminUser>>>; q: AdminQuery }) {
  return <><header className="records-heading"><h2>{d.user.name || 'Khách hàng'}</h2><p>{email(d.user.email)} · đăng ký {when(d.user.created_at)}</p><p className="records-id">{d.user.id}</p></header>
    <div className="records-split"><div className="records-stack">
      <div className="records-stats"><Stat title="Lá số liên kết" value={d.user.readings}/><Stat title="Đơn hàng" value={d.user.orders}/><Stat title="Tổng đã thanh toán" value={missing}/></div>
      <Card><h2>Lá số và quyền liên kết</h2><p>{d.rights.note}</p><Filter q={q}/>
        {d.rights.items.length ? <Table title="Lá số của khách hàng" columns={['Mã lá số', 'Danh hiệu', 'Liên kết lúc', 'Quyền', 'Báo cáo']}
          rows={d.rights.items.map(record => ({ key: record.id, cells: [
            <a className="records-id" href={adminUrl({ view: 'report', source: record.order_id ? 'order' : 'free', id: record.order_id || record.reading_id })}>{record.reading_id}</a>,
            record.name || missing, when(record.created_at),
            <><State value={record.state}/><p>{record.scope}</p><p>Hết hạn {when(record.expires_at)}</p></>, missing,
          ] }))}/> : <NoRows title="Chưa có liên kết quyền khớp bộ lọc" q={q}/>}
        <AdminPager q={q} total={d.rights.total}/>
      </Card>
      <Card><h2>Lịch sử đơn hàng</h2><p>Đơn toàn thời gian. Bộ lọc ngày và tìm kiếm phía trên áp dụng cho liên kết quyền.</p>
        {d.orders.length ? <Table title="Đơn của khách hàng" columns={['Mã đơn', 'Gói', 'Số tiền', 'Thanh toán', 'Giao báo cáo']}
          rows={d.orders.map(order => ({ key: order.id, cells: [
            <a href={adminUrl({ view: 'order', id: order.id })}>{order.code}</a>, missing,
            <>{money(order.amount)} · {order.demo ? 'Test' : 'Live'}</>, <State value={order.payment_status}/>, <State value={order.report_status}/>,
          ] }))}/> : <EmptyState title="Chưa có đơn trong trang này"/>}
        <AdminPager q={q} total={d.user.orders}/>
      </Card>
    </div><aside className="records-stack">
      <Card><h2>Thông tin tài khoản</h2><dl><dt>Email</dt><dd>{email(d.user.email)}</dd><dt>Số điện thoại</dt><dd>{missing}</dd><dt>Lần đăng nhập cuối</dt><dd>{missing}</dd><dt>Trạng thái tài khoản</dt><dd>{missing}</dd></dl></Card>
      <Card><h2>Quyền liên kết</h2>{d.rights.items.map(record => <div className="records-right" key={record.id}><State value={record.state}/><p>{record.name || record.reading_id}</p>{record.order_id && <a href={adminUrl({ view: 'order', id: record.order_id })}>Xem đơn liên quan</a>}<p>Hạn {when(record.expires_at)}</p></div>)}{!d.rights.items.length && <p>Chưa có liên kết trong trang này</p>}</Card>
    </aside></div></>;
}
function Reports({ d, q }: { d: Awaited<ReturnType<typeof adminReports>>; q: AdminQuery }) {
  return <><p>{d.uniqueTotal} ID bản lưu duy nhất · {d.total} mục theo nguồn</p><Filter q={q}/>
    {d.items.length ? <Table title="Lá số và báo cáo" columns={['Mã bản lưu', 'Danh hiệu', 'Tạo lúc', 'Nguồn', 'Phiên bản', 'Quyền', 'Xử lý AI', 'Cung đã luận', 'PDF']}
      rows={d.items.map(record => ({ key: record.source + record.key, cells: [
        <a className="records-id" href={adminUrl({ view: 'report', source: record.source as AdminQuery['source'], id: record.key })}>{record.id}</a>,
        <>{record.name}{record.orderCode && <p>Đơn {record.orderCode}</p>}</>, when(record.createdAt), labels[record.source],
        <>{record.presentation}<br/>{record.catalog}</>, missing,
        <>{missing}{record.delivery && <p>Giao báo cáo · {labels[record.delivery] || record.delivery}</p>}</>, missing, missing,
      ] }))}/> : <NoRows title="Không có báo cáo phù hợp" q={q}/>}
    <AdminPager q={q} total={d.total}/></>;
}
function ReportDetail({ d, q }: { d: NonNullable<Awaited<ReturnType<typeof adminReading>>>; q: AdminQuery }) {
  const reading = d.reading;
  return <><Alert title="Bản lưu chỉ đọc">{d.note}</Alert>
    <div className="records-split"><div className="records-stack">
      <Card><h2>Tiến trình theo cung</h2><EmptyState title={missing}/></Card>
      <Card><details className="records-reader"><summary>Mở nội dung bản đọc đã lưu</summary>
        {reading?.frozen.customerReport ? <CustomerReading report={reading.frozen.customerReport} snapshot={reading.snapshot} birthTimeLabel={reading.inputReceipt?.timeLabel}/> : <EmptyState title="Chưa có bản khách hàng tương thích được lưu"/>}
      </details></Card>
    </div><aside className="records-stack">
      <Card><h2>Thông tin</h2><dl><dt>Mã lá số</dt><dd className="records-id">{reading?.id || missing}</dd>
        <dt>Nguồn</dt><dd>{labels[q.source]}</dd><dt>Phiên bản</dt><dd>{reading?.frozen.presentationVersion || missing}</dd>
        <dt>Catalog</dt><dd>{reading?.frozen.catalogVersion || missing}</dd><dt>Tạo lúc</dt><dd>{reading ? when(reading.createdAt) : missing}</dd><dt>PDF</dt><dd>{missing}</dd></dl></Card>
      <Card><h2>Kiểm tra quyền</h2>{q.source === 'order' ? <a href={adminUrl({ view: 'order', id: q.id })}>Xem đơn và quyền liên quan →</a> : <p>{missing}</p>}</Card>
      <Card><h2>Lịch sử xử lý AI</h2><p>{missing}</p></Card>
    </aside></div></>;
}
type Props = { q: AdminQuery; session: string };
async function Content({ q, session }: Props) {
  try {
    switch (q.view) {
      case 'users': return <Customers d={await adminUsers(session, q)} q={q}/>;
      case 'user': {
        const data = await adminUser(session, q);
        return data ? <CustomerDetail d={data} q={q}/> : <EmptyState title="Không tìm thấy khách hàng"/>;
      }
      case 'reports': return <Reports d={await adminReports(session, q)} q={q}/>;
      case 'report': {
        const data = q.id ? await adminReading(session, q.source, q.id) : null;
        return data ? <ReportDetail d={data} q={q}/> : <EmptyState title="Không tìm thấy bản lưu trong nguồn đã chọn"/>;
      }
    }
  } catch {
    return <Alert tone="danger" role="alert" title="Chưa tải được dữ liệu"><a href={adminUrl(q)}>Thử tải lại</a></Alert>;
  }
}
export default function AdminRecords(props: Props) {
  const { q } = props;
  return <main className="records"><nav aria-label="Đường dẫn">
    <a href="/internal/admin">Admin</a> / <a href={adminUrl({ view: q.view === 'user' || q.view === 'users' ? 'users' : 'reports' })}>{q.view === 'user' || q.view === 'users' ? 'Khách hàng' : 'Lá số & báo cáo'}</a>
  </nav><h1>{titles[q.view]}</h1>
    <Suspense key={adminUrl(q)} fallback={<Skeleton label="Đang tải dữ liệu quản trị"/>}><Content {...props}/></Suspense>
  </main>;
}
