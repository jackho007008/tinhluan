import type { InternalReading } from "../internal-review/reading-store";
import { PAID_EDITION, PAID_PALACES } from "./paid-contract";
import { paidFacts } from "./paid-facts";
import { paidKnowledge } from "./paid-retrieval";
import { paidContextGuide } from "./paid-context-guide";
export function paidInput(record: InternalReading, palace: string) {
  if (!PAID_PALACES.includes(palace as any))
    throw Error("AI_PAID_TARGET_INVALID");
  const input = paidFacts(record, palace);
  input.paidTarget = { palace, edition: PAID_EDITION };
  if (record.frozen.customerReport?.snapshotId !== record.snapshot.resultId)
    throw Error("AI_UNVERIFIED_SNAPSHOT");
  const retrieval = paidKnowledge(record, palace);
  input.knowledge = retrieval.items;
  if (
    retrieval.excluded.some(
      (e) => e.id === "paid-library" && e.reason === "missing-or-invalid-index",
    )
  )
    input.missing.push(
      "Kho đoạn sách đã duyệt chưa sẵn sàng; chỉ dùng phần nguồn có thật trong yêu cầu này.",
    );
  input.knowledgeVersion = "paid-retrieval-1.11.0";
  const guide = paidContextGuide(input, retrieval.contextMetadata);
  if (guide) input.contextGuide = guide;
  if (!input.knowledge.some((k) => k.application === "direct"))
    input.missing.push(
      "Chưa có luận điểm áp trực tiếp cung này; dùng phần nguồn có thật, không bịa phần thiếu.",
    );
  return input;
}
