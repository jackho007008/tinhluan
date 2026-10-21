// Run only inside the isolated local DEMO copy, never against the primary database.
import { writeFile, mkdir } from "node:fs/promises";
import { calculate } from "../lib/tuvi-engine";
import { buildReport } from "../lib/reports";
import { loadSample } from "../lib/internal-review/samples";
import { prepareBeta, issueBetaGrant } from "../lib/beta/store";
import { pool } from "../lib/db";
const url = new URL(process.env.DATABASE_URL!);
if (
  url.pathname !== "/tuvi_beta_demo_20261008" ||
  !["localhost", "127.0.0.1"].includes(url.hostname) ||
  process.env.APP_ORIGIN !== "http://127.0.0.1:3002"
)
  throw Error("SANDBOX_ONLY");
try {
  if (
    Number(
      (await pool.query("SELECT count(*) FROM beta_reports")).rows[0].count,
    )
  )
    throw Error("ALREADY_SEEDED");
  await mkdir("../links", { mode: 0o700 });
  const base = (await loadSample("vn-2"))!;
  const wuqu = await buildReport(
    await calculate({ ...base.sample.input, date: "2000-08-03", hour: 16 }),
    { groups: ["Tổng quan"], year: null },
  );
  const selected = [
    {
      id: "demo-wuqu-tianfu",
      name: "DEMO · Mệnh Vũ Khúc–Thiên Phủ",
      report: wuqu,
    },
    {
      id: "engine-combo",
      name: "DEMO · Mệnh Tử Vi–Phá Quân, đủ phụ tá",
      report: (await loadSample("engine-combo"))!.report,
    },
    { id: "vn-2", name: "DEMO · Mệnh không chính tinh", report: base.report },
  ];
  const manifest = [];
  const expires = new Date(Date.now() + 7 * 86400000).toISOString();
  const deleteAfter = new Date(Date.now() + 14 * 86400000).toISOString();
  for (const s of selected) {
    const reportId = await prepareBeta(s.report, {
      cohort: "demo-local-20261008",
      demo: true,
      expires,
      deleteAfter,
    });
    await pool.query("UPDATE beta_reports SET released_at=now() WHERE id=$1", [
      reportId,
    ]);
    const grant = await issueBetaGrant(reportId);
    await writeFile(
      "../links/" + s.id + ".json",
      JSON.stringify(
        { label: s.name, url: process.env.APP_ORIGIN + "/beta#" + grant.token },
        null,
        2,
      ),
      { mode: 0o600, flag: "wx" },
    );
    const row = (
      await pool.query(
        "SELECT versions,document FROM beta_reports WHERE id=$1",
        [reportId],
      )
    ).rows[0];
    manifest.push({
      sample: s.id,
      name: s.name,
      reportId,
      grantId: grant.id,
      alias: grant.alias,
      expires,
      deleteAfter,
      versions: row.versions,
      claimIds: row.document.sections
        .map((s: { claimId: string | null }) => s.claimId)
        .filter(Boolean),
      input: s.report.snapshot.normalized,
    });
  }
  await writeFile("../editions.json", JSON.stringify(manifest, null, 2), {
    mode: 0o600,
    flag: "wx",
  });
  console.log(
    "Three immutable DEMO editions prepared. Three fresh access links saved privately; zero real invitations.",
  );
} finally {
  await pool.end();
}
