import {AI_STATE_LABELS,type AiReadingState} from '@/lib/result-presentation';
/** Presentation only. Preview states are injected by tests, never by URL/query. */
export default function AiReadingStatus({state}:{state:AiReadingState}){
 const messages:Record<AiReadingState,string>={
  'not-created':'Tính năng luận AI chưa được kích hoạt. Chưa có bài luận AI được tạo.',
  'not-entitled':'Luận AI cho cung này cần thanh toán hợp lệ khi tính năng được mở. Hiện chưa tạo bài trả phí.',
  generating:'Bài luận AI đang được tạo. Kết quả sẽ được lưu để mở lại.',
  completed:'Đã có kết quả luận AI được lưu.',
  error:'Chưa tạo được bài luận AI. Vui lòng kiểm tra lại sau.',
 };
 return <div className="ai-reading-status" data-ai-state={state} role="status"><span>Luận AI · {AI_STATE_LABELS[state]}</span><p>{messages[state]}</p></div>;
}
