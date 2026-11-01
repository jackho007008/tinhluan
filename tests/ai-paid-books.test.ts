import { it, expect, beforeAll } from "vitest";
import { calculateInternal, freezeReading } from "../lib/internal-review/dynamic-reading";
import { paidBookKnowledge } from "../lib/ai/paid-book-knowledge";
import { paidInput } from "../lib/ai/paid-input";
let r: any;
beforeAll(async () => {
  const {snapshot,receipt} = await calculateInternal({name:"QA sách",date:"1992-08-07",hour:16,minute:0,gender:"male",calendar:"solar",timezone:"Asia/Ho_Chi_Minh",profile:"tanbien-vn-trial-v2",place:"Không ghi",unknownTime:false,consent:true});
  r = {snapshot,receipt,frozen:freezeReading(snapshot,receipt)};
});
it("processed books retain topic, conditions and reference-only boundaries", () => {
  const before = JSON.stringify(r);
  const t = paidBookKnowledge(r,"Tài Bạch"), q = paidBookKnowledge(r,"Quan Lộc");
  expect(t.find(k=>k.id === "paid-book.npl261-liem-tai")).toMatchObject({application:"direct",subjectPalaces:["Tài Bạch"]});
  expect(t.find(k=>k.id === "paid-book.npl226-thai-tue")).toMatchObject({application:"reference-only"});
  expect(t.find(k=>k.id === "paid-book.npl262-hao-boundary")?.limits.join(" ")).toContain("Không đổi trạng thái");
  expect(q.find(k=>k.id === "paid-book.npl226-tau-thu")?.conditions.join(" ")).toContain("nghề dạy học");
  expect(paidBookKnowledge(r,"Tật Ách")).toEqual([]);
  const changed = structuredClone(r), p = changed.snapshot.chart.palaces.find((p:any)=>p.name === "Tài Bạch");
  p.majorStars.push({name:"Tham Lang"});
  expect(() => paidBookKnowledge(changed,"Tài Bạch")).toThrow("AI_UNVERIFIED_SNAPSHOT");
  p.majorStars.pop();p.earthlyBranch="Mão";
  expect(() => paidBookKnowledge(changed,"Tài Bạch")).toThrow("AI_UNVERIFIED_SNAPSHOT");
  expect(JSON.stringify(r)).toBe(before);
  for (const [palace,id] of [["Nô Bộc","02"],["Tử Nữ","46"],["Phu Thê","45"]])
    expect(paidInput(r,palace).knowledge.find(k=>k.id === "paid-method.inherited-NPL-"+id)).toMatchObject({group:"D",application:"reference-only",subjectPalaces:[]});
});
