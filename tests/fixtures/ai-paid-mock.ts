import {SECTION_KINDS,type MenhInput} from '../../lib/ai/contract';
import type {Generation} from '../../lib/ai/provider';
export function mockPaidGeneration(input:MenhInput):Generation{
 const p=input.paidTarget?.palace;if(!p)throw Error('MOCK_PAID_TARGET_REQUIRED');
 const fact=input.facts.find(f=>f.text.startsWith(p+' tại'))||input.facts[0];
 return {provider:'test-mock',model:'test-mock-not-an-openai-model',responseId:'mock-paid-response',durationMs:1,usage:{inputTokens:0,cachedInputTokens:0,outputTokens:0,reasoningTokens:0},estimatedCostUsd:null,raw:{sections:SECTION_KINDS.map((kind,i)=>({kind,title:['Cấu trúc cung','Xu hướng của chủ đề','Điểm thuận và giới hạn','Chính tinh','Sao đi cùng','Các cung chiếu','Điều cần đọc cùng','Tự đối chiếu'][i],content:`BẢN MÔ PHỎNG cho cung ${p}. ${fact.text} Đây là văn kiểm thử việc tạo, lưu và hiển thị; không phải lời luận OpenAI hoặc kết luận về con người thực tế.`,factIds:[fact.id],knowledgeIds:[],basis:'facts'})),limitations:['BẢN MÔ PHỎNG KIỂM THỬ, không dùng để đánh giá chất lượng lời luận thực tế.']}};
}
