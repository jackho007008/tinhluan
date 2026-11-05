'use client';
import { usePathname, useSearchParams } from 'next/navigation';

const pages = [['dashboard','Dashboard'], ['revenue','Doanh thu'], ['analytics','Phân tích']] as const;

export default function AdminInsightNav() {
  const params = useSearchParams();
  const onOverview = usePathname() === '/internal/admin' && (params.get('view') || 'overview') === 'overview';
  return <>{pages.map(([panel,label]) => {
    const query = new URLSearchParams({ view: 'overview', panel });
    for (const key of ['from','to','environment']) {
      const value = params.get(key);
      if (value) query.set(key,value);
    }
    const active = onOverview && (params.get('panel') || 'dashboard') === panel;
    return <a href={'/internal/admin?' + query} aria-current={active ? 'page' : undefined} key={panel}>{label}</a>;
  })}</>;
}
