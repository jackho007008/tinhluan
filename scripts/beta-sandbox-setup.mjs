// Local DEMO only. Never copies production/customer data or prints credentials.
import {
  cp,
  mkdir,
  readFile,
  writeFile,
  symlink,
  readdir,
} from "node:fs/promises";
import { resolve, join } from "node:path";
import { randomBytes, createHash } from "node:crypto";
import pg from "pg";
const root = resolve(".");
const dir = join(root, ".local/beta-sandbox-20261008");
const dbName = "tuvi_beta_demo_20261008";
const source = new URL(
  process.env.DATABASE_URL || "postgresql://localhost:55439/tuvi",
);
if (
  !["localhost", "127.0.0.1"].includes(source.hostname) ||
  source.pathname === "/" + dbName
)
  throw Error("LOCAL_SOURCE_DATABASE_REQUIRED");
await mkdir(dir, { mode: 0o700 }); // refuse to overwrite an existing sandbox
await mkdir(join(dir, "app-copy"), { mode: 0o700 });
const files = [
  "app",
  "components",
  "db",
  "lib",
  "scripts",
  "fixtures",
  "public",
  "tests",
  "docs",
  "package.json",
  "package-lock.json",
  "next.config.ts",
  "next-env.d.ts",
  "tsconfig.json",
  "postcss.config.mjs",
  "vitest.config.ts",
  "playwright.config.ts",
];
for (const name of files)
  await cp(join(root, name), join(dir, "app-copy", name), { recursive: true });
await symlink(join(root, "node_modules"), join(dir, "app-copy/node_modules"));
const admin = new pg.Client({ connectionString: source.href });
await admin.connect();
try {
  await admin.query("CREATE DATABASE " + dbName);
} finally {
  await admin.end();
}
source.pathname = "/" + dbName;
const key = randomBytes(32).toString("hex");
const env =
  [
    "DATABASE_URL=" + source.href,
    "APP_ORIGIN=http://127.0.0.1:3002",
    "INTERNAL_REVIEW_ALLOWED_ORIGINS=",
    "INTERNAL_REVIEW_KEY=" + key,
    "BETA_ENABLED=true",
    "DEMO_ENABLED=false",
    "PAYMENT_PROVIDER=mock",
    "EMAIL_PROVIDER=local",
    "MOCK_WEBHOOK_SECRET=" + randomBytes(32).toString("hex"),
  ].join("\n") + "\n";
await writeFile(join(dir, "app-copy/.env"), env, { mode: 0o600, flag: "wx" });
await writeFile(
  join(dir, "owner-access.txt"),
  "DEMO ONLY — separate internal key, do not share with readers.\nhttp://127.0.0.1:3002/internal\n" +
    key +
    "\n",
  { mode: 0o600, flag: "wx" },
);
const hashes = {};
async function collect(path, prefix = "") {
  for (const e of await readdir(path, { withFileTypes: true })) {
    if (["node_modules", ".env", ".next"].includes(e.name)) continue;
    const rel = join(prefix, e.name),
      full = join(path, e.name);
    if (e.isDirectory()) await collect(full, rel);
    else
      hashes[rel] = createHash("sha256")
        .update(await readFile(full))
        .digest("hex");
  }
}
await collect(join(dir, "app-copy"));
await writeFile(
  join(dir, "source-manifest.json"),
  JSON.stringify(
    { createdAt: new Date().toISOString(), files: hashes },
    null,
    2,
  ),
  { mode: 0o600 },
);
console.log(
  "Created isolated local DEMO database and source copy. Credentials saved privately; no invitations sent.",
);
