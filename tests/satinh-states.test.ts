import { expect, it, describe } from "vitest";
import {
  satinhState,
  SATINH_NAMES,
  snapshotSatinhStates,
} from "../lib/interpretation-rules/satinh-states";
import { bookState } from "../lib/tuvi-engine/tanbien";
import fs from "node:fs";
const branches = [
  "Tý",
  "Sửu",
  "Dần",
  "Mão",
  "Thìn",
  "Tỵ",
  "Ngọ",
  "Mùi",
  "Thân",
  "Dậu",
  "Tuất",
  "Hợi",
];
// Transcribed expectations from docs/SATINH-STATES-1.0.0.md before running the lookup.
const expected = [
  "?D??D??D??D?",
  "?HF?HF?HF?HF",
  "?HDDDDD H????".replaceAll(" ", ""),
  "?HDDDDD H????".replaceAll(" ", ""),
  "??D??D??D??D",
  "??D??D??D??D",
];
describe("72 source cells", () => {
  for (const [i, name] of SATINH_NAMES.entries())
    for (const [j, b] of branches.entries())
      it(name + " " + b, () => {
        const r = satinhState(name, b),
          e = expected[i][j];
        expect(r.exact).toBe(e === "D" ? "Đắc" : e === "H" ? "Hãm" : null);
        expect(r.classification).toBe(
          e === "?"
            ? "unknown"
            : e === "H"
              ? "dim-position"
              : "favorable-position",
        );
        expect(r.degreeUnresolved).toBe(e === "F");
        if (e !== "?") expect(r.evidence.length).toBeGreaterThan(0);
      });
  it("direct conflict TL wins, old explicitly TB lookup stays Đắc", () => {
    for (const b of ["Sửu", "Thìn", "Mùi", "Tuất"]) {
      expect(satinhState("Đà La", b).decision).toBe("override");
      expect(satinhState("Đà La", b).source).toContain("PDF51");
      expect(bookState("Đà La", b)?.value).toBe("Đắc");
    }
  });
  it("Đắc and Miếu preserved, not a synthetic exact grade", () => {
    const r = satinhState("Đà La", "Dần");
    expect(r.exact).toBeNull();
    expect(r.evidence.map((e) => e.label)).toEqual(["Đắc", "Đắc", "Miếu"]);
    expect(bookState("Đà La", "Dần")?.value).toBeUndefined();
  });
  it("TB114 independent location data does not fill all remaining branches", () => {
    expect(satinhState("Hỏa Tinh", "Sửu").source).toContain("PDF114");
    expect(satinhState("Hỏa Tinh", "Tuất").classification).toBe("unknown");
  });
  it("invalid identity and branch unknown", () => {
    expect(satinhState("Lưu Hà", "Tý").classification).toBe("unknown");
    expect(satinhState("Đà La", "?").classification).toBe("unknown");
  });
  it("technical scope and missing brightness: never read iztro as fallback; snapshot immutable", () => {
    const row = JSON.parse(
      fs.readFileSync(
        ".local/internal-readings/c914aeac-3c2e-413f-a86b-cea74ba8df72.json",
        "utf8",
      ),
    );
    const snap = row.snapshot,
      before = JSON.stringify(snap);
    const result = snapshotSatinhStates(snap);
    expect(result.find((x) => x.name === "Đà La")!.selected.exact).toBe("Hãm");
    expect(JSON.stringify(snap)).toBe(before);
    const technical = structuredClone(snap);
    for (const p of technical.chart.palaces)
      for (const f of ["majorStars", "minorStars", "adjectiveStars"])
        for (const s of p[f])
          if (s.name === "Đà La") {
            s.scope = "yearly";
            s.originalBrightness = "Miếu";
          }
    expect(
      snapshotSatinhStates(technical).some((x) => x.name === "Đà La"),
    ).toBe(false);
  });
});
