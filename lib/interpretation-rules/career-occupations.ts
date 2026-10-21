import type { ChartSnapshot } from '../tuvi-engine';
import { type CareerBranch, independentCareerFacts, makeIndependentCareerRules } from './career-independent';
// Source specification: docs/CAREER-OCCUPATIONS-1.0.0.md. No brightness method is required by these local clauses.
const row=(id:string,stars:string[],branches:string[],page:string,section:string,meaning:string):CareerBranch=>({
 id:'occupation-'+id,stars:stars.map(x=>[x]),branches,page,section,alone:stars.length===1,majorOnly:true,
 title:stars.join('–')+(stars.length===1?' độc thủ':' đồng cung')+' tại Quan Lộc'+(branches.length?' '+branches.join('/') : ''),
 text:`Quan Lộc có ${stars.join(' và ')} bản mệnh ${stars.length===1?'độc thủ':'đồng cung'}${branches.length?' tại '+branches.join('/') : ''}. Theo cách phân loại công việc trong Tân Biên, ${meaning} Đây là lời mô tả có điều kiện của sách, không xác nhận nghề nghiệp, chức vụ hay kết quả thực tế của bạn. “Võ nghiệp/võ chức” chỉ đường quân sự/chức vụ quân sự trong ngữ cảnh lịch sử; không tự quy đổi thành một nghề hiện đại.`,
});
export const occupationalBranches:CareerBranch[]=[
 row('liem-dan-than',['Liêm Trinh'],['Dần','Thân'],'158','8.2','cấu trúc này được liên hệ với võ nghiệp hiển đạt, uy quyền kiêm việc chính trị và sự kính nể.'),
 row('liem-phu',['Liêm Trinh','Thiên Phủ'],[],'158,160','8.2; §8.7','tổ hợp được mô tả bằng phú quý, chiến công và uy quyền.'),
 row('liem-tuong',['Liêm Trinh','Thiên Tướng'],[],'158,162','8.2; §8.11','tổ hợp được mô tả là văn võ kiêm toàn, hưởng giàu sang và được kính nể.'),
 row('liem-sat',['Liêm Trinh','Thất Sát'],[],'158,163','8.2; §8.13','tổ hợp được liên hệ với quân sự nhưng thăng giáng thất thường, nhanh lên chóng xuống, lợi danh đi cùng rủi ro. Cùng đoạn, sách mô tả hướng kinh doanh, buôn bán hoặc kỹ nghệ là phát đạt và yên thân hơn; đây không phải khuyến nghị đổi nghề.'),
 row('liem-pha',['Liêm Trinh','Phá Quân'],[],'158,163','8.2; §8.14 Phá Quân','tổ hợp được liên hệ với kỹ nghệ hoặc thương mại; trái lại, đường công danh được mô tả là khó toại nguyện, mang tâm trạng hậm hực.'),
 row('vu-thin-tuat',['Vũ Khúc'],['Thìn','Tuất'],'159','8.4','cấu trúc được liên hệ với võ nghiệp hiển đạt; sách cũng mô tả nhiều tài lộc nếu chuyên doanh thương, không định lượng thu nhập.'),
 row('vu-phu',['Vũ Khúc','Thiên Phủ'],[],'159,160','8.4; §8.7','tổ hợp được liên hệ trực tiếp với chức vụ thuộc tài chính hoặc kinh tế, cùng lời mô tả công danh hoạnh đạt và văn võ kiêm toàn. Không từ đó suy ra một nghề cụ thể ngày nay hay năng lực tài chính thực tế.'),
 row('vu-tuong',['Vũ Khúc','Thiên Tướng'],[],'159,162','8.4; §8.11','sách mô tả đường công danh được toại lòng; nếu không theo đường đó, kinh doanh buôn bán được mô tả là sớm giàu có. Đây là hai hướng trong câu nguồn, không phải cam kết tài sản.'),
 row('vu-sat',['Vũ Khúc','Thất Sát'],[],'159,163','8.4; §8.13','tổ hợp được liên hệ với võ nghiệp, trấn giữ nơi xa và chiến công, nhưng đi cùng thăng giáng thất thường.'),
 row('vu-pha',['Vũ Khúc','Phá Quân'],[],'159,163','8.4; §8.14 Phá Quân','sách mô tả xuất thân bằng võ nghiệp nhưng rất chật vật; đối với kinh doanh buôn bán, lời nguồn lại mô tả sự toại lòng. Hai vế được giữ trong đúng phạm vi của tổ hợp.'),
 row('tham-thin-tuat',['Tham Lang'],['Thìn','Tuất'],'161','8.9','cấu trúc được liên hệ với võ nghiệp hiển đạt; sách cũng mô tả sự toại lòng nếu kinh doanh buôn bán.'),
 row('tham-dan-than',['Tham Lang'],['Dần','Thân'],'161','8.9','sách mô tả chức vị quân sự nhỏ thấp, công danh trắc trở và không toại nguyện, nhưng buôn bán lại phát đạt. Vế bất lợi về công danh không bị lược bỏ.'),
 row('sat-dan-than',['Thất Sát'],['Dần','Thân'],'162','8.13','sách mô tả văn võ kiêm toàn, vượt việc khó và trở ngại để hiển đạt, có uy quyền và được kính nể. Nhánh độc thủ này không đòi Hóa Quyền đồng cung.'),
 row('sat-ty-ngo',['Thất Sát'],['Tý','Ngọ'],'162','8.13','sách mô tả văn chức hoặc võ chức hiển đạt nhưng kém rực rỡ hơn nhánh Dần/Thân, thường gặp trở ngại và may đi liền với rủi.'),
 row('tu-sat',['Tử Vi','Thất Sát'],[],'158,163','8.1; §8.13','tổ hợp được liên hệ trực tiếp với quân sự và uy quyền. Lời nguồn này không cho phép xác nhận chức vụ hoặc năng lực chỉ huy thực tế.'),
];
occupationalBranches.push({id:'occupation-dong-am-kinh',title:'Thiên Đồng–Thái Âm–Kình Dương đồng cung Quan Lộc tại Ngọ',stars:[['Thiên Đồng'],['Thái Âm'],['Kình Dương']],branches:['Ngọ'],page:'165',section:'8.25',text:'Quan Lộc tại Ngọ có Thiên Đồng, Thái Âm và Kình Dương bản mệnh đồng cung. Theo cách phân loại công việc trong Tân Biên, tổ hợp này được liên hệ với võ quan trấn giữ biên thùy, chiến công và sự hiển đạt trong thời loạn. Sách còn dùng những danh xưng tôn vinh anh hùng và danh tiếng; đây là ngôn ngữ lịch sử của nguồn, không phải danh hiệu, nghề nghiệp hay dự báo sự kiện dành cho người đọc. Không tự quy đổi võ quan thành một nghề hiện đại.'});
export const occupationalCareerFacts=(s:ChartSnapshot)=>independentCareerFacts(s,occupationalBranches);
export const occupationalCareerRules=makeIndependentCareerRules(occupationalBranches).map(r=>({...r,presentation:{...r.presentation!,projectScope:[...(r.presentation!.projectScope || []),'career-occupations/1.0.0; nguồn Tân Biên; liên hệ nghề nghiệp truyền thống được phép biên tập từ 1.24.0. Chính tinh phải ở danh sách chính tinh bản mệnh.']}}));
