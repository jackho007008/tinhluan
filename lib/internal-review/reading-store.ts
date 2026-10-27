import { assertChartIntegrity } from '../tuvi-engine/chart-integrity';
import {
  mkdir,
  readFile,
  writeFile,
  link,
  unlink,
  readdir,
} from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { ChartSnapshot } from "../tuvi-engine";
import type { FrozenReading, ListReceipt } from "./dynamic-reading";
export type InternalReading = {
  id: string;
  aiPolicy?: {edition:string;palace:'Mệnh'};
  accessPolicy?: import("../trial/reading-policy").ReadingPolicy;
  inputReceipt?: import("../customer-birth").CustomerInputReceipt;
  parentId?: string;
  sourceRecord?: { file: string; resultId: string; sha256: string; reason: string };
  createdAt: string;
  snapshot: ChartSnapshot;
  receipt?: ListReceipt;
  frozen: FrozenReading;
};
const root = () =>
  path.resolve(process.env.INTERNAL_READING_DIR || ".local/internal-readings");
export const validReadingId = (id: string) =>
  /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(
    id,
  );
export async function getReading(id: string): Promise<InternalReading | null> {
  if (!validReadingId(id)) return null;
  try {
    return JSON.parse(await readFile(path.join(root(), id + ".json"), "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}
export async function saveReading(record: InternalReading) {
  if (!validReadingId(record.id)) throw Error("INVALID_ID");
  assertChartIntegrity(record.snapshot.chart);
  await mkdir(root(), { recursive: true, mode: 0o700 });
  const temp = path.join(root(), `.${randomUUID()}.tmp`),
    target = path.join(root(), record.id + ".json");
  try {
    await writeFile(temp, JSON.stringify(record), { mode: 0o600, flag: "wx" });
    await link(temp, target);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
    const old = await getReading(record.id);
    if (old?.snapshot.resultId !== record.snapshot.resultId)
      throw Error("ID_CONFLICT");
  } finally {
    await unlink(temp).catch(() => {});
  }
}
export async function listReadings() {
  try {
    const files = (await readdir(root())).filter(
      (f) => validReadingId(f.slice(0, -5)) && f.endsWith(".json"),
    );
    const rows = await Promise.all(
      files.map((f) => getReading(f.slice(0, -5))),
    );
    return rows
      .filter((r): r is InternalReading => !!r)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 100);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}
