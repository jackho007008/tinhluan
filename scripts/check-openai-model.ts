import OpenAI from "openai";
import { aiConfig, aiModels } from "../lib/ai/config";
const config = aiConfig();
const purpose = process.argv[2] || "free-edit";
if (!["free-edit", "paid-reading", "legacy"].includes(purpose))
  throw Error("MODEL_PURPOSE_REQUIRED");
const model =
  purpose === "free-edit"
    ? aiModels().freeEdit
    : purpose === "paid-reading"
      ? aiModels().paidReading
      : config.model;
const variable =
  purpose === "free-edit"
    ? "AI_FREE_EDIT_MODEL"
    : purpose === "paid-reading"
      ? "AI_PAID_READING_MODEL"
      : "OPENAI_MODEL";
if (!config.apiKey) {
  console.log("OPENAI_API_KEY is not configured; no API request made.");
  process.exitCode = 2;
} else {
  const client = new OpenAI({
    apiKey: config.apiKey,
    maxRetries: 0,
    timeout: 15000,
  });
  try {
    if (model) {
      const m = await client.models.retrieve(model);
      console.log(
        JSON.stringify({
          purpose,
          configuredModel: m.id,
          accessible: true,
          note: "Model visibility only; Responses/Structured Outputs still need a controlled generation test.",
        }),
      );
    } else {
      console.log(
        variable +
          " is not configured; no API request made and no fallback selected.",
      );
      process.exitCode = 2;
    }
  } catch {
    console.error(
      "Model access check failed; verify project/key/model. No key or provider error is logged.",
    );
    process.exitCode = 1;
  }
}
