import type { readerScope } from '@/lib/internal-review/reader-presentation';
import type { Rule } from '@/lib/interpretation-rules/schema';
export default function ReadingScope({scope,absentTopics,rules}:{scope:ReturnType<typeof readerScope>;absentTopics:string[];rules:Rule[]}) {
 if(!scope.length&&!absentTopics.length)return null;
 return <details className="card" data-reader-scope><summary>Phạm vi chưa được giải thích</summary>
 {absentTopics.length>0&&<p>Chưa có chú giải phù hợp trong phần: {absentTopics.join('; ')}. Đây là phạm vi nội dung, không phải đặc điểm của người đọc.</p>}
 {scope.map((g,i)=><section key={i}><h3>{g.topic}</h3><p>{g.reason}</p><details data-scope-evidence><summary>Xem căn cứ</summary>{g.traces.map(t=><div key={t.ruleId}><p>Điều kiện đang kiểm tra — {rules.find(r=>r.id===t.ruleId)?.presentation?.title||t.ruleId}. Chưa xác nhận điều kiện này hiện diện hoặc áp dụng.</p>{t.status==='missing-facts'&&<p>{g.reason}</p>}<details data-technical><summary>Chi tiết kỹ thuật</summary><pre>{JSON.stringify(t,null,2)}</pre></details></div>)}</details></section>)}
 </details>;
}
