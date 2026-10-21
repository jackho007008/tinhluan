import {observeOperation} from '@/lib/admin/events';
import { randomUUID } from "node:crypto";
import {
  receiveSePayTest,
  sepayTestConfig,
  SePayError,
} from "../../../../../lib/payments/sepay-test";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_BODY = 32 * 1024;
async function readBounded(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BODY)
    throw new SePayError("BODY_TOO_LARGE", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new SePayError("SEPAY_PAYLOAD", 400);
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) break;
      length += chunk.value.length;
      if (length > MAX_BODY) {
        await reader.cancel();
        throw new SePayError("BODY_TOO_LARGE", 413);
      }
      chunks.push(chunk.value);
    }
  } finally {
    reader.releaseLock();
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(
      Buffer.concat(chunks),
    );
  } catch {
    throw new SePayError("SEPAY_PAYLOAD", 400);
  }
}
export async function POST(request: Request) {
  const requestId = randomUUID();
  try {
    sepayTestConfig();
    if (
      request.headers
        .get("content-type")
        ?.split(";")[0]
        .trim()
        .toLowerCase() !== "application/json"
    )
      throw new SePayError("JSON_REQUIRED", 415);
    const result = await receiveSePayTest(await readBounded(request), {
      signature: request.headers.get("x-sepay-signature") || "",
      timestamp: request.headers.get("x-sepay-timestamp") || "",
    });
    await observeOperation({channel:'webhook',outcome:'received',code:result.disposition==='accepted'?'WEBHOOK_ACCEPTED':result.disposition==='duplicate'?'WEBHOOK_DUPLICATE':result.disposition==='mismatch'?'WEBHOOK_MISMATCH':'WEBHOOK_IGNORED',transactionId:result.transactionId});
    // Fixed metadata only; never log body, headers, exception message, bank narrative or birth data.
    console.info(
      JSON.stringify({ event: "sepay_test_webhook", requestId, ...result }),
    );
    // Acknowledges durable receipt, not payment acceptance. Business rejects are kept in the inbox.
    return Response.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const known = error instanceof SePayError;
    console.warn(
      JSON.stringify({
        event: "sepay_test_webhook",
        requestId,
        reason: known ? error.code : "PROCESSING_FAILED",
      }),
    );
    return Response.json(
      { success: false, requestId },
      {
        status: known ? error.status : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
