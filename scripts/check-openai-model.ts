import OpenAI from "openai";
import { aiConfig } from "../lib/ai/config";
const config = aiConfig();
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
    if (config.model) {
      const m = await client.models.retrieve(config.model);
      console.log(
        JSON.stringify({
          configuredModel: m.id,
          accessible: true,
          note: "Model visibility only; Responses/Structured Outputs still need a controlled generation test.",
        }),
      );
    } else {
      const list = await client.models.list();
      console.log(
        JSON.stringify({
          accessibleModels: list.data
            .map((m) => m.id)
            .filter((id) => /^gpt-/.test(id))
            .sort(),
          note: "Select a capable model explicitly in OPENAI_MODEL; no automatic fallback.",
        }),
      );
    }
  } catch {
    console.error(
      "Model access check failed; verify project/key/model. No key or provider error is logged.",
    );
    process.exitCode = 1;
  }
}
