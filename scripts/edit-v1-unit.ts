import {
  registerV1Source,
  listV1Sources,
  type V1SourceContext,
  type V1ReviewAssessment,
} from "../lib/ai/v1-review-store";
import fs from "node:fs/promises";
import {
  prepareV1Edit,
  decideV1Edit,
  inspectV1Edit,
  type V1EditUnit,
} from "../lib/ai/v1-edit";
// Operator-only tool, deliberately one unit per invocation; no catalog scan,
// queue consumer, public HTTP endpoint or automatic approval.
const [action, keyOrFile, reviewFile] = process.argv.slice(2);
if (action === "register" && keyOrFile) {
  const bundle = JSON.parse(await fs.readFile(keyOrFile, "utf8")) as {
    unit: V1EditUnit;
    source: V1SourceContext;
  };
  console.log(
    JSON.stringify({
      sourceId: await registerV1Source(bundle.unit, bundle.source),
      apiCalls: 0,
    }),
  );
} else if (action === "prepare" && keyOrFile) {
  const bundle = JSON.parse(await fs.readFile(keyOrFile, "utf8")) as {
    unit: V1EditUnit;
    source: V1SourceContext;
  };
  if (!bundle.source || !bundle.unit) throw Error("V1_SOURCE_CONTEXT_REQUIRED");
  await registerV1Source(bundle.unit, bundle.source);
  const r = await prepareV1Edit(bundle.unit);
  console.log(
    JSON.stringify({
      key: r.key,
      dispatched: r.dispatched,
      candidateAvailable: !!r.candidate,
      approved: false,
    }),
  );
} else if (action === "review" && keyOrFile && reviewFile) {
  const r = JSON.parse(await fs.readFile(reviewFile, "utf8")) as {
    candidateHash: string;
    source: V1SourceContext;
    assessment: V1ReviewAssessment;
  };
  const event = await decideV1Edit(
    keyOrFile,
    r.candidateHash,
    r.source,
    r.assessment,
  );
  console.log(JSON.stringify(event));
} else if (action === "list" || action === "inspect") {
  const rows = await listV1Sources();
  if (action === "inspect") {
    const row = rows.find((r) => r.id === keyOrFile);
    if (!row) throw Error("V1_SOURCE_NOT_FOUND");
    console.log(
      JSON.stringify({
        ...(await inspectV1Edit(row.unit, row.source)),
        unit: row.unit,
        source: row.source,
      }),
    );
  } else
    console.log(
      JSON.stringify(
        await Promise.all(
          rows.map(async (r) => {
            const e = await inspectV1Edit(r.unit, r.source);
            return {
              id: r.id,
              sourceId: r.source.sourceId,
              state: e.state,
              generated: e.generated,
              model: e.model,
              promptVersion: e.promptVersion,
              v1Version: r.source.v1Version,
              catalogVersion: r.source.catalogVersion,
              updatedAt: e.updatedAt,
            };
          }),
        ),
      ),
    );
} else
  throw Error(
    "Usage: edit-v1-unit register|prepare <private-source-bundle.json> | review <candidate-key> <private-review.json> | list | inspect <source-context-id>",
  );
