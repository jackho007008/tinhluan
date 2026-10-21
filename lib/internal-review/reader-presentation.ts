import {kinBranches,kinKey,kinAssessment} from '../interpretation-rules/phu-tu';
import {familyBranches,familyKey,familyAssessment} from '../interpretation-rules/phu-huynh';
import type {ChartSnapshot} from "../tuvi-engine";
import {noDienBranches,noDienKey,noDienAssessment} from "../interpretation-rules/no-dien";
// Reader-facing scope labels only. Never change execution, facts or rule outcomes.
import type { executeRules } from '../interpretation-rules/execute';
import { missingText } from './tanbien-presentation';
export function readerScope(execution: ReturnType<typeof executeRules>, snapshot?:ChartSnapshot) {
  const groups: { topic: string; reason: string; traces: typeof execution.traces }[] = [];
  for (const trace of execution.traces.filter(t=>!['matched','condition-false','exception'].includes(t.status))) {
    const rule=execution.rules.find(r=>r.id===trace.ruleId);
    const theme=rule?.presentation?.readingTheme;
    const topic=theme==='spouse'?'Phu Thê':theme==='children'?'Tử Nữ':theme==='parents'?'Phụ Mẫu':theme==='siblings'?'Huynh Đệ':theme==='no'?'Nô Bộc':theme==='dien'?'Điền Trạch':theme==='phuc'?'Phúc Đức':theme==='di'?'Thiên Di':theme==='work'?'Công việc':theme==='finance'?'Tài chính':theme==='learning'?'Học hỏi':['action','initiative'].includes(theme||'')?'Các yếu tố tại cung Mệnh':null;
    if (!topic) continue;
    const nd=noDienBranches.find(r=>'tanbien.'+noDienKey(r)===trace.ruleId);
    const fam=familyBranches.find(r=>'tanbien.'+familyKey(r)===trace.ruleId);
    const kin=kinBranches.find(r=>'tanbien.'+kinKey(r)===trace.ruleId);
    const assessment=kin&&snapshot?kinAssessment(snapshot,kin):fam&&snapshot?familyAssessment(snapshot,fam):nd&&snapshot?noDienAssessment(snapshot,nd):undefined;
    const reason=trace.status==='missing-facts'&&assessment ? assessment.text : trace.status==='wrong-profile'
      ? 'Một số nhánh chú giải chưa hỗ trợ hệ tính của hồ sơ này; chưa xác định các nhánh ấy có áp dụng cho lá số hay không.'
      : trace.status==='missing-facts'
        ? missingText(trace.details).join(' ') || 'Điều kiện cần kiểm tra chưa có dữ kiện xác nhận; xem căn cứ để biết trường còn thiếu.'
        : 'Phạm vi áp dụng chưa được xác nhận; trạng thái và nguyên nhân đã ghi được giữ trong căn cứ.';
    const existing=groups.find(g=>g.topic===topic&&g.reason===reason);
    if(existing) existing.traces.push(trace);else groups.push({topic,reason,traces:[trace]});
  }
  return groups;
}
