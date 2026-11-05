import { Suspense } from 'react';
import { adminOverview } from '@/lib/admin/extended';
import { adminTransactions, type AdminQuery } from '@/lib/admin/operations';
import { Alert, Button, Card, EmptyState, Skeleton } from './co-thu/primitives';

const insightTitles = { dashboard: 'Tổng quan', revenue: 'Doanh thu', analytics: 'Phân tích' };
type Panel = keyof typeof insightTitles;
type Overview = Awaited<ReturnType<typeof adminOverview>>;
const missing = 'Chưa có dữ liệu';
const money = (value: number | string) => Number(value).toLocaleString('vi-VN') + ' ₫';
const day = (date: Date) => date.toLocaleDateString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' });

function url(q: AdminQuery, panel: Panel, extra: Record<string,string> = {}) {
  return '/internal/admin?' + new URLSearchParams({ view: 'overview', panel, environment: q.environment,
    ...(q.from && { from: q.from }), ...(q.to && { to: q.to }), ...extra });
}

function Filters({ q, panel }: { q: AdminQuery; panel: Panel }) {
  const today = day(new Date());
  const start = (days: number) => new Date(Date.parse(today + 'T00:00:00Z') - days * 86400000).toISOString().slice(0,10);
  const presets = [['Hôm nay', today], ['7 ngày', start(6)], ['30 ngày', start(29)], ['Tháng này', today.slice(0,7) + '-01']];
  return <div className="insight-filters"><nav aria-label="Khoảng ngày">{presets.map(([label,from]) =>
    <a key={label} href={url(q,panel,{from,to:today})} aria-current={q.from===from && q.to===today ? 'true' : undefined}>{label}</a>)}</nav>
    <form method="get"><input type="hidden" name="view" value="overview"/><input type="hidden" name="panel" value={panel}/>
      <label>Từ ngày<input type="date" name="from" defaultValue={q.from}/></label>
      <label>Đến ngày<input type="date" name="to" defaultValue={q.to}/></label>
      <label>Đơn và thanh toán<select name="environment" defaultValue={q.environment}><option value="all">Test và Live</option><option value="test">Test</option><option value="live">Live</option></select></label>
      <Button type="submit" variant="secondary">Áp dụng</Button><a href={'?view=overview&panel='+panel}>Xóa lọc</a>
    </form></div>;
}

function Metric({title,value,href}: {title:string; value?:React.ReactNode; href?:string}) {
  return <Card className="insight-metric"><h3>{title}</h3>
    {href ? <a href={href}>{value}</a> : <strong className={value == null ? 'unavailable' : undefined}>{value ?? missing}</strong>}
  </Card>;
}
function Funds({d,q}: {d:Overview;q:AdminQuery}) {
  return <Metric title="Số tiền ghi sổ" value={<>{(['test','live'] as const).filter(env=>q.environment==='all'||q.environment===env).map(env=>{
    const row=d.payments.find(p=>p.demo===(env==='test'));
    return <span className="fund-line" key={env}><small>{env==='test'?'Test':'Live'}</small> {money(row?.amount??0)}
      <a href={url(q,'dashboard',{view:'transactions',status:'paid',environment:env})}>{row?.count??0} giao dịch</a></span>;
  })}</>}/>;
}
function Blank({title}: {title:string}) {
  return <Card className="insight-panel"><h2>{title}</h2><EmptyState title={missing}/></Card>;
}
function Dashboard({d,q}: {d:Overview;q:AdminQuery}) {
  const detail=(view:string,status?:string)=>url(q,'dashboard',{view,...(status&&{status})});
  return <><h2>Người dùng và lá số</h2><div className="insight-kpis">
    <Metric title="Tổng tài khoản"/><Metric title="Tài khoản mới" value={d.users} href={detail('users')}/>
    <Metric title="Lượt lập lá số"/><Metric title="Lá số được lưu" value={d.readings} href={detail('reports')}/></div>
    <h2>Báo cáo luận giải</h2><div className="insight-kpis">{['Báo cáo đã tạo','Đang xử lý','Hoàn thành đủ 11 cung','Báo cáo lỗi'].map(t=><Metric key={t} title={t}/>)}</div>
    <h2>Đơn hàng và doanh thu</h2><div className="insight-kpis"><Metric title="Đơn hàng mới" value={d.orders.total} href={detail('orders')}/>
    <Metric title="Đơn đã thanh toán" value={d.orders.paid} href={detail('orders','paid')}/><Funds d={d} q={q}/>
    {['Giá trị đơn trung bình','Chuyển đổi lập lá số → mua','Chi phí AI'].map(t=><Metric key={t} title={t}/>)}</div>
    <div className="insight-pair"><Blank title="Doanh thu theo ngày"/><Blank title="Lượt lập lá số theo ngày"/><Blank title="Hàng đợi AI lúc này"/>
    <Card className="insight-panel"><h2>Đơn cần hỗ trợ</h2><p>{d.orders.errors} đơn giao lỗi hoặc chờ thử lại</p><a href={detail('orders','failed')}>Đơn giao lỗi</a> · <a href={detail('orders','retry')}>Đơn chờ thử lại</a>
      <p><a href={detail('orders','pending')}>{d.orders.pending} đơn chờ thanh toán</a> · <a href={detail('orders','ready')}>{d.orders.delivered} đơn đã giao</a></p></Card></div>
    {d.observationSince && <p>Sổ sự kiện vận hành bắt đầu ngày {new Date(d.observationSince).toLocaleDateString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})}.</p>}</>;
}
function Revenue({d,q,ledger}: {d:Overview;q:AdminQuery;ledger:Awaited<ReturnType<typeof adminTransactions>>}) {
  return <><div className="insight-kpis"><Funds d={d} q={q}/>{['Giá trị đơn trung bình','Hoàn tiền','Điều chỉnh'].map(t=><Metric key={t} title={t}/>)}</div>
    <div className="insight-pair"><Blank title="Doanh thu theo tuần"/><Card className="insight-panel"><h2>Trạng thái đơn hàng</h2>
    <dl>{[['Tổng đơn trong kỳ',d.orders.total],['Đã thanh toán',d.orders.paid],['Chờ thanh toán',d.orders.pending],['Hết hạn / thất bại',missing]].map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></Card>
    <Blank title="Theo gói dịch vụ"/><Card className="insight-panel"><h2>Giao dịch ghi nhận gần đây</h2>
    {ledger.items.length ? <table className="insight-ledger"><caption className="sr-only">Giao dịch đã ghi sổ</caption>
      <thead><tr>{['Mã giao dịch','Mã đơn','Thời điểm','Số tiền'].map(col=><th key={col} scope="col">{col}</th>)}</tr></thead>
      <tbody>{ledger.items.map(r=><tr key={r.transaction_id}>
        <td>{r.transaction_id}</td><td><a href={url(q,'revenue',{view:'order',id:r.order_id})}>{r.code}</a></td>
        <td>{new Date(r.created_at).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})}</td>
        <td>{money(r.amount)} · {r.demo?'Test':'Live'}</td></tr>)}</tbody></table> : <EmptyState title="Chưa có giao dịch trong kỳ"/>}
    <a href={url(q,'revenue',{view:'transactions',status:'paid'})}>Xem sổ giao dịch →</a></Card></div></>;
}
function Analytics({d}: {d:Overview}) {
  return <><div className="insight-kpis">{['Người dùng hoạt động','Tài khoản có mua hàng','Báo cáo trong hàng đợi AI','Tỷ lệ báo cáo lỗi'].map(t=><Metric key={t} title={t}/>)}</div>
    <Card className="insight-panel"><h2>Phễu chuyển đổi</h2><p>Số đơn tính riêng trong kỳ. Chưa có dữ liệu liên kết các bước để tính tỷ lệ.</p>
    <ol className="insight-funnel">{[['Lập lá số',missing],['Xem luận Mệnh',missing],['Tạo đơn',d.orders.total],['Đơn đã thanh toán',d.orders.paid],['AI hoàn thành báo cáo',missing]].map(([k,v])=><li key={k}><span>{k}</span><strong>{v}</strong></li>)}</ol></Card>
    <div className="insight-pair"><Card className="insight-panel"><h2>Tài khoản mới theo tuần</h2><p>{d.users} tài khoản mới trong kỳ</p><EmptyState title="Chưa có dữ liệu theo tuần"/></Card>
    {['Khách mua lần đầu và quay lại','Báo cáo hoàn thành theo tuần','Tỷ lệ mua luận giải theo tuần'].map(t=><Blank key={t} title={t}/>)}</div></>;
}
type Props = {q:AdminQuery;panel:Panel;session:string};
async function Content({q,panel,session}:Props) {
  try {
    const d=await adminOverview(session,q);
    if(panel==='analytics')return <Analytics d={d}/>;
    if(panel==='revenue'){
      const ledger=await adminTransactions(session,{...q,status:'paid',page:1,size:5,q:''});
      return <Revenue d={d} q={q} ledger={ledger}/>;
    }
    return <Dashboard d={d} q={q}/>;
  } catch {
    return <Alert tone="danger" role="alert" title="Chưa tải được dữ liệu"><a href={url(q,panel)}>Thử tải lại</a></Alert>;
  }
}
export function AdminInsights(props:Props) {
  const {q,panel}=props;
  return <main className="insights"><h1>{insightTitles[panel]}</h1>
    <p>{q.from || q.to ? [q.from && 'Từ ' + q.from, q.to && 'đến ' + q.to].filter(Boolean).join(' ') : 'Toàn bộ thời gian'}</p>
    <p>Ngày tính theo giờ Việt Nam. Bộ lọc Test và Live áp dụng cho đơn hàng và thanh toán.</p>
    <Filters panel={panel} q={q}/><Suspense key={url(q,panel)} fallback={<Skeleton label="Đang tải số liệu"/>}><Content {...props}/></Suspense></main>;
}
