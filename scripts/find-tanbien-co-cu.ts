// Bounded search of fictitious engine inputs, never mutates stars or writes orders.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { calculate, type ChartSnapshot } from "../lib/tuvi-engine";
import { samples, loadSample } from "../lib/internal-review/samples";
import type { BirthInput } from "../lib/calendar";
const output = "lib/internal-review/engine-samples/tanbien-co-cu.json";
const verify = process.argv.includes("--verify");
if (existsSync(output) && !verify)
  throw Error("FROZEN_SAMPLES_EXIST_USE_VERIFY");
let checked = 0;
let found:
  | {
      id: string;
      name: string;
      input: BirthInput;
      snapshot: ChartSnapshot;
      origin: string;
    }
  | undefined;
function inspect(input: BirthInput, snapshot: ChartSnapshot, origin: string) {
  checked++;
  const m = snapshot.chart.palaces.find((p) => p.name === "Mệnh")!;
  if (
    ["Mão", "Dậu"].includes(m.earthlyBranch) &&
    ["Thiên Cơ", "Cự Môn"].every((n) =>
      m.majorStars.some((s) => s.name === n),
    ) &&
    m.minorStars.some((s) => s.name === "Lộc Tồn")
  )
    found = {
      id: "vn-co-cu-loc",
      name: `Engine VN · Cơ–Cự–Lộc Tồn tại Mệnh ${m.earthlyBranch} · đầu vào giả lập`,
      input,
      snapshot,
      origin,
    };
}
for (const sample of samples.filter(
  (s) => s.kind === "engine" && s.id !== "vn-co-cu-loc",
)) {
  const loaded = (await loadSample(sample.id))!;
  inspect(sample.input, loaded.report.snapshot, `existing:${sample.id}`);
  if (found) break;
}
for (const year of [2001, 2005]) {
  for (let day = 1; day <= 31 && !found; day++)
    for (let hour = 0; hour < 24 && !found; hour += 2) {
      const input: BirthInput = {
        date: `${year}-03-${String(day).padStart(2, "0")}`,
        hour,
        minute: 0,
        unknownTime: false,
        place: "Hà Nội",
        gender: "female",
        calendar: "solar",
        profile: "vn-utc7-midnight-v1",
        timezone: "Asia/Ho_Chi_Minh",
        consent: true,
      };
      inspect(
        input,
        await calculate(input),
        "bounded:March 1..31 of 2001,2005; hours0..22 step2",
      );
    }
  if (found) break;
}
if (!found) throw Error("NO_MATCH_WITHIN_BOUND");
if (verify) {
  const old = JSON.parse(readFileSync(output, "utf8"));
  if (
    old.checked !== checked ||
    old.entries[0].snapshot.resultId !== found.snapshot.resultId ||
    JSON.stringify(old.entries[0].input) !== JSON.stringify(found.input)
  )
    throw Error("REPRODUCIBILITY_MISMATCH");
} else
  writeFileSync(
    output,
    JSON.stringify(
      {
        kind: "engine-generated-fictitious-input-not-independent-validation",
        searchVersion: "1.0.0",
        checked,
        entries: [found],
      },
      null,
      2,
    ) + "\n",
    { flag: "wx" },
  );
console.log(
  JSON.stringify({
    verify,
    checked,
    id: found.id,
    origin: found.origin,
    life: found.snapshot.chart.palaces.find((p) => p.name === "Mệnh")!
      .earthlyBranch,
  }),
);
