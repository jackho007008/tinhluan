import fs from "node:fs/promises";
import {
  prepareV1Edit,
  approveV1Edit,
  type V1EditUnit,
} from "../lib/ai/v1-edit";
// Operator-only tool, deliberately one unit per invocation; no catalog scan,
// queue consumer, public HTTP endpoint or automatic approval.
const [action, keyOrFile, reviewedHash] = process.argv.slice(2);
if (action === "prepare" && keyOrFile) {
  const unit = JSON.parse(await fs.readFile(keyOrFile, "utf8")) as V1EditUnit;
  const r = await prepareV1Edit(unit);
  console.log(
    JSON.stringify({
      key: r.key,
      dispatched: r.dispatched,
      candidateAvailable: !!r.candidate,
      approved: false,
    }),
  );
} else if (action === "approve" && keyOrFile && reviewedHash) {
  const r = await approveV1Edit(keyOrFile, reviewedHash);
  console.log(
    JSON.stringify({
      key: r.key,
      approved: true,
      artifactHash: r.artifactHash,
    }),
  );
} else
  throw Error(
    "Usage: edit-v1-unit prepare <private-unit.json> | approve <key> <reviewed-candidate-hash>",
  );
