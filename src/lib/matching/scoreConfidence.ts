import type {
  ConfidenceScoreBreakdown,
  FacilityMatchingInput,
} from "./types"

export function scoreConfidence(
  facility: FacilityMatchingInput,
): ConfidenceScoreBreakdown {
  const sourceConfidence = facility.evidenceConfidence ?? 0

  const normalized =
    sourceConfidence > 1 ? Math.min(sourceConfidence, 100) / 100 : sourceConfidence

  return {
    sourceConfidence: normalized,
    score: Math.round(normalized * 10),
  }
}