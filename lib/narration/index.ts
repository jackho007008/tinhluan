import type { Statement } from "../interpretation-rules";
export type Paragraph = { text: string; statementIds: string[] };
export interface NarrationProvider {
  generate(statements: Pick<Statement, "id" | "text">[]): Promise<Paragraph[]>;
}
export async function narrate(
  statements: Statement[],
  provider?: NarrationProvider,
) {
  const fallback = statements.map((s) => ({
    text: s.text,
    statementIds: [s.id],
  }));
  if (!provider) return fallback;
  try {
    const candidate = await provider.generate(
      statements.map(({ id, text }) => ({ id, text })),
    ); // Exact allow-list validator. Free-form prose needs independent semantic review before enablement.
    if (
      candidate.length !== fallback.length ||
      candidate.some(
        (p, i) =>
          p.text !== fallback[i].text ||
          JSON.stringify(p.statementIds) !==
            JSON.stringify(fallback[i].statementIds),
      )
    )
      return fallback;
    return candidate;
  } catch {
    return fallback;
  }
}
