// Local owner utility. No bearer URLs, passwords or env contents on stdout.
import { readFile, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, execFileSync } from "node:child_process";
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const dir = join(root, ".local/beta-sandbox-20261008");
const app = join(dir, "app-copy");
const [action, sample] = process.argv.slice(2);
const choices = ["demo-wuqu-tianfu", "engine-combo", "vn-2"];
try {
  if (action === "start") {
    // Clean child environment: no inherited app secrets, origin or feature overrides.
    const child = spawn(
      process.execPath,
      [
        "node_modules/next/dist/bin/next",
        "start",
        "--hostname",
        "127.0.0.1",
        "--port",
        "3002",
      ],
      {
        cwd: app,
        stdio: "inherit",
        env: {
          PATH: process.env.PATH,
          HOME: process.env.HOME,
          USER: process.env.USER,
          LOGNAME: process.env.LOGNAME,
          TMPDIR: process.env.TMPDIR,
          NODE_ENV: "production",
        },
      },
    );
    child.on("exit", (code) => (process.exitCode = code ?? 1));
  } else if (action === "owner") {
    const lines = (await readFile(join(dir, "owner-access.txt"), "utf8"))
      .trim()
      .split("\n");
    execFileSync("/usr/bin/pbcopy", {
      input: lines.at(-1),
      stdio: ["pipe", "ignore", "ignore"],
    });
    execFileSync("/usr/bin/open", ["http://127.0.0.1:3002/internal"], {
      stdio: "ignore",
    });
    console.log(
      "Sandbox owner key copied to clipboard. Paste into internal login, then clear clipboard. Never share with readers.",
    );
  } else {
    if (!choices.includes(sample)) throw Error("INVALID_SAMPLE");
    const manifest = JSON.parse(
      await readFile(join(dir, "editions.json"), "utf8"),
    );
    const edition = manifest.find((e) => e.sample === sample);
    if (!edition) throw Error("UNKNOWN_EDITION");
    if (action === "open") {
      const link = JSON.parse(
        await readFile(join(dir, "links", sample + ".json"), "utf8"),
      );
      const url = new URL(link.url);
      if (url.origin !== "http://127.0.0.1:3002" || url.pathname !== "/beta")
        throw Error("INVALID_ORIGIN");
      execFileSync("/usr/bin/open", [link.url], { stdio: "ignore" });
      console.log(
        "Opened one-use DEMO access link in the default browser. No invitation sent.",
      );
    } else if (action === "revoke") {
      execFileSync(
        process.execPath,
        [
          "--env-file=.env",
          "--import",
          "tsx",
          "scripts/beta.ts",
          "revoke",
          "--id",
          edition.grantId,
        ],
        {
          cwd: app,
          stdio: ["ignore", "pipe", "pipe"],
          env: {
            PATH: process.env.PATH,
            HOME: process.env.HOME,
            USER: process.env.USER,
            LOGNAME: process.env.LOGNAME,
            TMPDIR: process.env.TMPDIR,
          },
        },
      );
      console.log(
        "Selected DEMO access revoked. Reload the reader to verify denial.",
      );
    } else if (action === "reissue") {
      const out = join(
        dir,
        "links",
        sample + "-reissued-" + Date.now() + ".json",
      );
      execFileSync(
        process.execPath,
        [
          "--env-file=.env",
          "--import",
          "tsx",
          "scripts/beta.ts",
          "reissue",
          "--id",
          edition.grantId,
          "--out",
          out,
        ],
        {
          cwd: app,
          stdio: ["ignore", "pipe", "pipe"],
          env: {
            PATH: process.env.PATH,
            HOME: process.env.HOME,
            USER: process.env.USER,
            LOGNAME: process.env.LOGNAME,
            TMPDIR: process.env.TMPDIR,
          },
        },
      );
      await writeFile(
        join(dir, "links", sample + ".json"),
        await readFile(out),
        { mode: 0o600 },
      );
      console.log(
        "New one-use link saved privately; previous session invalidated. Run open for the selected sample.",
      );
    } else throw Error("INVALID_ACTION");
  }
} catch {
  console.error(
    "DEMO operation failed. Use start, owner, or open/reissue/revoke with demo-wuqu-tianfu, engine-combo, vn-2. Reissue cannot restore revoked or expired access. No credentials printed.",
  );
  process.exitCode = 1;
}
