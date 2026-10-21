// Reproducible bounded search of fictitious inputs. No database, orders or star edits.
// Frozen output is read by /internal; rerunning refuses to overwrite it.
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { calculate } from "../lib/tuvi-engine";
import { samples } from "../lib/internal-review/samples";
import { tanBienLifeTables } from "../lib/interpretation-rules/tanbien-source";
import type { BirthInput } from "../lib/calendar";
const output = "lib/internal-review/engine-samples/tanbien-last.json";
const verify = process.argv.includes("--verify");
if (existsSync(output) && !verify)
  throw Error("FROZEN_SAMPLES_EXIST_USE_VERIFY");
const targets = ["tianliang", "qisha", "pojun"] as const;
const found: Record<string, unknown> = {};
let checked = 0;
async function check(input: BirthInput, origin: string) {
  const snapshot = await calculate(input);
  checked++;
  const life = snapshot.chart.palaces.find((p) => p.name === "Mệnh")!;
  for (const key of targets) {
    const table = tanBienLifeTables[key];
    if (
      !found[key] &&
      life.majorStars.some((s) => s.name === table.star) &&
      table.eligible.includes(table.states[life.earthlyBranch]) &&
      (key !== "pojun" || life.majorStars.length === 1)
    )
      found[key] = {
        id: `vn-${key}`,
        name: `Engine VN · ${table.star} tại Mệnh ${life.earthlyBranch} · đầu vào giả lập`,
        input,
        snapshot,
        origin,
        tableVersion: table.version,
      };
  }
}
for (const s of samples.filter(
  (s) =>
    s.kind === "engine" && s.id !== "vn-co-cu-loc" &&
    !["vn-tianliang", "vn-qisha", "vn-pojun"].includes(s.id),
))
  await check(s.input, `existing:${s.id}`);
for (let day = 1; day <= 31 && Object.keys(found).length < 3; day++) {
  for (let hour = 0; hour < 24 && Object.keys(found).length < 3; hour += 2)
    await check(
      {
        date: `2000-01-${String(day).padStart(2, "0")}`,
        hour,
        minute: 0,
        unknownTime: false,
        place: "Hà Nội",
        gender: "female",
        calendar: "solar",
        profile: "vn-utc7-midnight-v1",
        timezone: "Asia/Ho_Chi_Minh",
        consent: true,
      },
      "bounded:2000-01-01..31; hours 0..22 step2",
    );
}
if (Object.keys(found).length !== 3) throw Error("BOUNDED_SEARCH_INCOMPLETE");
if (verify) {
  const existing = JSON.parse(readFileSync(output, "utf8"));
  const results = Object.values(found) as {
    id: string;
    snapshot: { resultId: string };
    input: BirthInput;
  }[];
  if (
    existing.checked !== checked ||
    results.some((x) => {
      const old = existing.entries.find((e: { id: string }) => e.id === x.id);
      return (
        !old ||
        old.snapshot.resultId !== x.snapshot.resultId ||
        JSON.stringify(old.input) !== JSON.stringify(x.input)
      );
    })
  )
    throw Error("SEARCH_REPRODUCIBILITY_MISMATCH");
  console.log(
    `Verified ${results.length} frozen samples after ${checked} bounded calculations; no writes.`,
  );
  process.exit(0);
}
mkdirSync("lib/internal-review/engine-samples", { recursive: true });
writeFileSync(
  output,
  JSON.stringify(
    {
      kind: "engine-generated-fictitious-input-not-independent-validation",
      searchVersion: "1.0.0",
      checked,
      entries: Object.values(found),
    },
    null,
    2,
  ) + "\n",
  { flag: "wx" },
);
console.log(
  JSON.stringify({
    checked,
    entries: Object.values(found).map((x: any) => ({
      id: x.id,
      origin: x.origin,
      life: x.snapshot.chart.palaces.find((p: any) => p.name === "Mệnh")
        .earthlyBranch,
    })),
  }),
);
