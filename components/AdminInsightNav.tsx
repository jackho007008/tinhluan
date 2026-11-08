'use client';
import { usePathname, useSearchParams } from 'next/navigation';

const pages = [['dashboard','Dashboard'], ['revenue','Doanh thu'], ['analytics','Phân tích']] as const;

export default function AdminInsightNav() {
  const params = useSearchParams();
  const onOverview = usePathname() === '/internal/admin' && (params.get('view') || 'overview') === 'overview';
  const currentView = params.get('view') || 'overview';
  const records = [['users', 'Khách hàng'], ['reports', 'Lá số & báo cáo']] as const;
  return <>{pages.map(([panel,label]) => {
    const query = new URLSearchParams({ view: 'overview', panel });
    for (const key of ['from','to','environment']) {
      const value = params.get(key);
      if (value) query.set(key,value);
    }
    const active = onOverview && (params.get('panel') || 'dashboard') === panel;
    return <a href={'/internal/admin?' + query} aria-current={active ? 'page' : undefined} key={panel}>{label}</a>;
  })}{records.map(([view, label]) => <a key={view} href={'/internal/admin?view=' + view}
    aria-current={currentView === view || (view === 'users' && currentView === 'user') || (view === 'reports' && currentView === 'report') ? 'page' : undefined}>{label}</a>)}</>;
}
