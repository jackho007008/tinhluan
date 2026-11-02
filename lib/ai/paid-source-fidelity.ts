import { createHash } from "node:crypto";
import type { Knowledge } from "./contract";

export const PAID_SOURCE_REVIEW = "paid-source-fidelity-1.0.0";
const sha = (text: string) => createHash("sha256").update(text).digest("hex");
const subject = (k: Knowledge, palace: string) =>
  k.subjectPalaces?.length === 1 && k.subjectPalaces[0] === palace;
const reference = (k: Knowledge, book: string, page: number) =>
  k.references.length === 1 &&
  k.references[0].title
    .normalize("NFC")
    .toLocaleLowerCase("vi")
    .includes(book) &&
  new RegExp(`(?:^|\\D)${page}(?:\\D|$)`, "u").test(k.references[0].location);

/** Qualify sources already selected by the evaluator/library. Never match a chart,
 * promote a source, edit its stored V1 text, or run while reading a saved job.
 * passage.digest still identifies the original library unit; sourceReview records
 * this separate editorial derivation. Apply before source byte budgets. */
export function reviewPaidSource(k: Knowledge, target: string): Knowledge {
  if (k.sourceReview) return k;
  let text: string;
  let limit: string;
  if (
    target === "Quan Lộc" &&
    k.group === "C" &&
    k.application === "context" &&
    subject(k, "Tài Bạch") &&
    ["matched-v1-editorial", "matched-snapshot"].includes(k.selection) &&
    k.provenance?.ruleIds.length === 1 &&
    k.provenance.ruleIds[0] === "tanbien.r06" &&
    reference(k, "tân biên", 190)
  ) {
    text =
      "Ở Tài Bạch, Tân Biên viết Liêm Trinh độc thủ Dần hoặc Thân phải cạnh tranh ráo riết mới kiếm tiền, làm giàu chậm nhưng chắc chắn. Vế sau là cách diễn đạt của tác giả, không phải bằng chứng tích lũy đã được bảo đảm.";
    limit =
      "Không biến lời sách thành bảo đảm tích lũy hoặc kết luận trực tiếp ở Quan.";
  } else if (
    target === "Nô Bộc" &&
    k.id === "paid-library.hs125-luong-general-disposition" &&
    k.group === "B" &&
    k.application === "reference-only" &&
    k.selection === "reference-only" &&
    subject(k, target) &&
    k.passage?.kind === "foundation" &&
    k.passage.anchorFactIds.length > 0 &&
    k.passage.digest ===
      "7029ee9c2be28a4ebdaf6a605fb387d430c2b3991a66beca748fec379c2e41b8" &&
    reference(k, "hàm số", 125)
  ) {
    text =
      "Trong phần nghĩa nền về tính tình Thiên Lương, Nguyễn Phát Lộc nói nét nhân hậu, khoan hòa, nhẫn nhục, mềm mỏng và khiêm cung cho cả đắc lẫn hãm. Chỉ dùng nét ấy như một hình tượng để phân tích cách đối đãi cùng luận điểm trực tiếp phù hợp ở Nô. Đây không phải lời riêng xác định tính cách người đọc hoặc phẩm chất bạn bè; các nhánh đắc/hãm trên cùng trang vẫn có phạm vi riêng.";
    limit =
      "Khi nối nền Lương với Lộc ở Nô, ghi phần nối là tổng hợp có điều kiện, không nhận là kết quả phối hợp Lương–Lộc do nguồn xác lập; không chuyển nghĩa nền tại Mệnh thành đặc tính thực tế của người tại Nô.";
  } else if (
    target === "Phu Thê" &&
    k.id === "paid-library.thp2-phu-ta-huu" &&
    k.group === "B" &&
    k.application === "direct" &&
    k.selection === "matched-snapshot" &&
    subject(k, target) &&
    k.passage?.kind === "direct" &&
    k.passage.anchorFactIds.length > 0 &&
    k.passage.digest ===
      "15ef86afc00a7345b9b3080e30ee46f409986674f75e2467ebe6ede4631fe2df" &&
    reference(k, "tứ hóa phái", 174)
  ) {
    text =
      "Trong Các kiểu tình yêu, với Tả Phụ hoặc Hữu Bật tọa Phu, tác giả dùng sắc thái thường thường cho hình tượng người có thể thành bạn đời từng trợ giúp mệnh tạo trong một giai đoạn. Quan niệm hai người có nhiều chỗ phải va chạm rồi mới hợp nhau. Giữ tần suất, phần trợ giúp đã qua và trình tự rồi mới; đây là gợi ý đơn lẻ, chưa xác nhận một người như vậy trong đời khách hàng.";
    limit =
      "Không rút thường thường thành mọi trường hợp, từng trợ giúp trong một giai đoạn thành luôn giúp đỡ, hoặc va chạm rồi mới hợp thành cứ va chạm thì sẽ hòa hợp. Phần phân tích trình tự là tổng hợp, không quy luật bảo đảm kết quả hôn nhân.";
  } else return k;

  const limits = [...k.limits, limit];
  return {
    ...k,
    text,
    limits,
    sourceReview: {
      version: PAID_SOURCE_REVIEW,
      sourceTextDigest: sha(k.text),
      reviewDigest: sha(
        JSON.stringify({ version: PAID_SOURCE_REVIEW, text, limits }),
      ),
    },
  };
}
