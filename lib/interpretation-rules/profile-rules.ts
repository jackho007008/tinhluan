import {VTTL_ROOT_IDS} from './vttl-root-batch';
import {VTTL_PHUC_LIEM_SAT} from './vttl-phuc-liem-sat';
import {NPL_PHU326} from './npl-spouse-vcd-lonely';
import {VTTL_NO_LUONG} from './vttl-no-luong';
import {NPL_DIEN_SINGLE_IDS} from './npl-dien-single-void';
import {VTTL_CAREER_CO_AM} from './vttl-career-co-am';
import {VTTL_DIEN_PHU} from './vttl-dien-phu';
import {TRUNGCHAU_RULE_IDS} from './trungchau-natal';
import { catalog } from "./catalog";
import type { ChartSnapshot } from "../tuvi-engine";
/** Existing Tân Biên profile compatibility; does not alter approval or source rights. */
export function tanBienRules(snapshot: ChartSnapshot) {
  return catalog
    .filter((r) => VTTL_ROOT_IDS.includes(r.id) || r.id === VTTL_PHUC_LIEM_SAT || r.id === NPL_PHU326 || r.id === VTTL_NO_LUONG || NPL_DIEN_SINGLE_IDS.includes(r.id) || r.id === VTTL_CAREER_CO_AM || r.id === VTTL_DIEN_PHU || TRUNGCHAU_RULE_IDS.includes(r.id) || r.id.startsWith("npl.life-polarity-") || r.id.startsWith("npl.life-local-") || r.id.startsWith("tanbien.") || r.id.startsWith("npl.life-body-") || r.id.startsWith("npl.life-two-major-") || r.id.startsWith("npl.life-foundation-"))
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
