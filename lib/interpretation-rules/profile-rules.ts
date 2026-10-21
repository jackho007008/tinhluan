import { catalog } from "./catalog";
import type { ChartSnapshot } from "../tuvi-engine";
/** Existing Tân Biên profile compatibility; does not alter approval or source rights. */
export function tanBienRules(snapshot: ChartSnapshot) {
  return catalog
    .filter((r) => r.id.startsWith("npl.life-polarity-") || r.id.startsWith("npl.life-local-") || r.id.startsWith("tanbien.") || r.id.startsWith("npl.life-body-") || r.id.startsWith("npl.life-two-major-") || r.id.startsWith("npl.life-foundation-"))
    .map((r) =>
      (snapshot.profile.id === "tanbien-vn-trial-v1" ||
        snapshot.profile.id === "tanbien-vn-trial-v2") &&
      r.requiredEngineProfile.includes("cn-reference")
        ? {
            ...r,
            requiredEngineProfile: [
              ...r.requiredEngineProfile,
              snapshot.profile.id,
            ],
          }
        : r,
    );
}
