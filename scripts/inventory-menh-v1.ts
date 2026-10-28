import fs from "node:fs/promises";
import path from "node:path";
import { inventoryV1Menh } from "../lib/ai/v1-inventory";
import { registerV1Source } from "../lib/ai/v1-review-store";
import {
  contentHash,
  v1EditRoot,
  writeEditArtifact,
} from "../lib/ai/v1-edit-storage";
import type { InternalReading } from "../lib/internal-review/reading-store";
// Bounded operator inventory of explicit QA snapshots, never a catalog/model batch.
const file = process.argv[2];
if (!file) throw Error("Provide a private QA samples JSON file.");
const samples = JSON.parse(await fs.readFile(file, "utf8")) as {
  label: string;
  record: InternalReading;
}[];
if (
  !Array.isArray(samples) ||
  samples.length < 1 ||
  samples.length > 64 ||
  samples.some((s) => typeof s.label !== "string" || !s.record?.frozen) ||
  new Set(samples.map((s) => s.label)).size !== samples.length
)
  throw Error("V1_INVENTORY_REQUIRES_1_TO_64_UNIQUE_QA_SAMPLES");
const result = inventoryV1Menh(samples),
  id = contentHash(result);
for (const unit of result.units) await registerV1Source(unit.unit, unit.source);
try {
  await writeEditArtifact("inventories", id, result);
} catch (e) {
  if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
}
console.log(
  JSON.stringify({
    path: path.join(v1EditRoot(), "inventories", id + ".json"),
    samples: result.sampleCount,
    templates: result.templateCount,
    renderedUnits: result.renderedUnitCount,
    modelRequests: 0,
  }),
);
