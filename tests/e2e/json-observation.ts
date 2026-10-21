import type { Page } from "@playwright/test";
export async function observeJSON(page: Page) {
  if (process.env.JSON_PROBE !== "1") return;
  page.on("response", async (response) => {
    if (response.request().resourceType() !== "document") return;
    const meta = {
      kind: "document",
      path: new URL(response.url()).pathname,
      status: response.status(),
      type: response.headers()["content-type"],
      bytes: null as number | null,
    };
    try {
      meta.bytes = (await response.body()).length;
    } catch {}
    console.error("HTTP diagnostic", JSON.stringify(meta));
  });
  await page.exposeBinding("jsonDiagnostic", (_source, event) =>
    console.error("JSON diagnostic", JSON.stringify(event)),
  );
  await page.addInitScript(() => {
    const report = (event: unknown) =>
      (
        window as unknown as { jsonDiagnostic: (e: unknown) => void }
      ).jsonDiagnostic(event);
    const parse = JSON.parse;
    JSON.parse = function (value, reviver) {
      try {
        return parse(value, reviver);
      } catch (e) {
        report({
          kind: "parse",
          length: typeof value === "string" ? value.length : null,
          stack: (e as Error).stack,
        });
        throw e;
      }
    };
    const json = Response.prototype.json;
    Response.prototype.json = async function () {
      try {
        return await json.call(this);
      } catch (e) {
        report({
          kind: "response-json",
          path: new URL(this.url, location.href).pathname,
          status: this.status,
          type: this.headers.get("content-type"),
          stack: (e as Error).stack,
        });
        throw e;
      }
    };
  });
}
