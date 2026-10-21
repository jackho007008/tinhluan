export function unavailableScore() {
  return {
    methodVersion: "unavailable-0.1.0",
    inputFeatures: [],
    ruleContributions: [],
    normalizationMethod: null,
    score: null,
    status: "unavailable",
    evidenceIds: [],
    approvalStatus: "unapproved",
  } as const;
}
// Deliberately static UI fixtures; NEVER used by report generation.
export const fixtureScores = [48, 62, 55, 71, 43, 66, 58, 73, 51, 64, 46, 60];
