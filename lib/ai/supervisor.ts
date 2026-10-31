import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { pool } from "../db";
import { consumePaidScope } from "./paid-consumer";
import { PAID_PALACES } from "./paid-contract";
export const supervisorScopeSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]{1,64}$/),
    database: z.string().regex(/^[a-zA-Z0-9_]{1,63}$/),
    checkout: z.string().min(1),
    readingIds: z.array(z.string().uuid()).min(1).max(20),
    palace: z.string().optional(),
    createdAt: z.string().datetime(),
    expiresAt: z.string().datetime(),
    maxRuns: z.number().int().min(1).max(1440),
    maxScopesPerRun: z.number().int().min(1).max(20),
    maxNewJobsPerScope: z.number().int().min(0).max(11),
    runtimeMs: z.number().int().min(1000).max(300000),
    maxTicks: z.number().int().min(1).max(1000),
  })
  .strict()
  .superRefine((s, c) => {
    if (
      new Set(s.readingIds).size !== s.readingIds.length ||
      (s.palace && !PAID_PALACES.includes(s.palace as any)) ||
      Date.parse(s.expiresAt) <= Date.parse(s.createdAt) ||
      Date.parse(s.expiresAt) - Date.parse(s.createdAt) > 86400000
    )
      c.addIssue({
        code: "custom",
        message: "Invalid scope lifetime/allowlist",
      });
  });
export type SupervisorScope = z.infer<typeof supervisorScopeSchema>;
export async function runPaidSupervisor(file: string) {
  if (process.env.AI_PAID_SUPERVISOR_ENABLED !== "true")
    throw Error("AI_SUPERVISOR_DISABLED");
  if (!path.isAbsolute(file)) throw Error("AI_SCOPE_ABSOLUTE_PATH_REQUIRED");
  const stat = await fs.stat(file);
  if ((stat.mode & 0o077) !== 0) throw Error("AI_SCOPE_PRIVATE_MODE_REQUIRED");
  const scope = supervisorScopeSchema.parse(
    JSON.parse(await fs.readFile(file, "utf8")),
  );
  if (
    (await fs.realpath(scope.checkout)) !== (await fs.realpath(process.cwd()))
  )
    throw Error("AI_SUPERVISOR_CHECKOUT_MISMATCH");
  const c = await pool.connect();
  let locked = false;
  const stateFile = file + ".state.json";
  try {
    if (
      (await c.query("SELECT current_database() AS name")).rows[0].name !==
      scope.database
    )
      throw Error("AI_SUPERVISOR_DATABASE_MISMATCH");
    locked = (
      await c.query(
        "SELECT pg_try_advisory_lock(hashtextextended($1,0)) AS ok",
        ["paid-ai-supervisor:" + scope.id],
      )
    ).rows[0].ok;
    if (!locked) return { state: "already-running" };
    let previous:
      | { scopeId: string; runs: number; cursor?: number }
      | undefined;
    try {
      previous = JSON.parse(await fs.readFile(stateFile, "utf8"));
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "ENOENT")
        throw Error("AI_SUPERVISOR_STATE_INVALID");
    }
    if (
      previous &&
      (previous.scopeId !== scope.id ||
        !Number.isSafeInteger(previous.runs) ||
        previous.runs < 0)
    )
      throw Error("AI_SUPERVISOR_STATE_INVALID");
    if (
      Date.now() < Date.parse(scope.createdAt) ||
      Date.now() >= Date.parse(scope.expiresAt)
    )
      return { state: "scope-expired" };
    if ((previous?.runs || 0) >= scope.maxRuns)
      return { state: "run-budget-exhausted" };
    const run = (previous?.runs || 0) + 1,
      cursor = previous?.cursor || 0;
    const write = async (value: unknown) => {
      const temp = stateFile + "." + process.pid + ".tmp";
      await fs.writeFile(temp, JSON.stringify(value), { mode: 0o600 });
      await fs.rename(temp, stateFile);
    };
    // This is a supervisor heartbeat/budget, not a second job store. Reserve before work.
    const heartbeat = {
      scopeId: scope.id,
      runs: run,
      cursor,
      startedAt: new Date().toISOString(),
      pid: process.pid,
      state: "running",
    };
    await write(heartbeat);
    const deadline = Date.now() + scope.runtimeMs;
    let visited = 0;
    for (
      ;
      visited < Math.min(scope.maxScopesPerRun, scope.readingIds.length) &&
      deadline - Date.now() >= 1000;
      visited++
    ) {
      const id = scope.readingIds[(cursor + visited) % scope.readingIds.length];
      await consumePaidScope({
        readingId: id,
        palace: scope.palace,
        maxNewJobs: scope.maxNewJobsPerScope,
        maxTicks: scope.maxTicks,
        runtimeMs: Math.max(1000, deadline - Date.now()),
      });
    }
    await write({
      ...heartbeat,
      cursor: (cursor + Math.max(1, visited)) % scope.readingIds.length,
      state: "finished",
      finishedAt: new Date().toISOString(),
    });
    return { state: "finished", run, visited };
  } finally {
    if (locked)
      await c.query("SELECT pg_advisory_unlock(hashtextextended($1,0))", [
        "paid-ai-supervisor:" + scope.id,
      ]);
    c.release();
  }
}
