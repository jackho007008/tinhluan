import fs from "node:fs";
import { chartInventory } from "../lib/internal-review/chart-inventory";
const root = ".local/chart-comparison-1992-08-07/";
const { snapshot } = JSON.parse(fs.readFileSync(root + "audit.json", "utf8"));
const rows = chartInventory(snapshot);
fs.writeFileSync(
  root + "display-inventory.json",
  JSON.stringify({ snapshotId: snapshot.resultId, rows }, null, 2),
  { mode: 0o600 },
);
fs.writeFileSync(
  root + "display-inventory.md",
  "# Kiểm kê hiển thị — hồ sơ riêng, không phát hành\n\nCung | Dữ liệu snapshot | Khung trước | Chi tiết trước | Chưa có\n---|---|---|---|---\n" +
    rows
      .map((r) =>
        [
          r.palace,
          r.stored,
          r.previousFrame,
          r.previousDetails,
          r.missing,
        ].join(" | "),
      )
      .join("\n"),
  { mode: 0o600 },
);
console.log("Private inventory written; snapshot unchanged.");
