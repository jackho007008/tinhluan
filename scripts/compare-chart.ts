import { readFile } from "node:fs/promises";
import { fixtureSchema, compareChart } from "../lib/chart-comparison";
import { calculate } from "../lib/tuvi-engine";
async function main() {
  const filename = process.argv[2];
  if (!filename)
    throw Error("Usage: npm run chart:compare -- fixture.json [snapshot.json]");
  const f = fixtureSchema.parse(JSON.parse(await readFile(filename, "utf8")));
  if (f.status === "awaiting-source") {
    console.log(
      JSON.stringify(
        {
          id: f.id,
          status: f.status,
          notice: "Chưa có expected độc lập; không tự tạo từ engine.",
        },
        null,
        2,
      ),
    );
    return;
  }
  const snapshot = process.argv[3]
    ? JSON.parse(await readFile(process.argv[3], "utf8"))
    : await calculate(f.birth);
  const result = compareChart(f, snapshot);
  console.log(JSON.stringify(result, null, 2));
  if (result.status !== "matched") process.exitCode = 1;
}
main().catch(() => {
  console.error(
    "Không thể so sánh: kiểm tra schema fixture, input, profile và file. Không ghi dữ liệu sinh vào log lỗi.",
  );
  process.exitCode = 1;
});
