import type {
  ConfidenceScoreBreakdown,
  FacilityMatchingInput,
  PatientMatchingInput,
} from "./types"

export function scoreConfidence(
  patient: PatientMatchingInput,
  facility: FacilityMatchingInput,
): ConfidenceScoreBreakdown {
  const sourceConfidence = facility.evidenceConfidence ?? 0

  const normalized =
    sourceConfidence > 1 ? Math.min(sourceConfidence, 100) / 100 : sourceConfidence

  let score = Math.round(normalized * 10)

  const captureMode = patient?.lifeFitProfile?.captureMode ?? ""

  if (captureMode === "skip") {
    score = Math.max(0, score - 3)
  }

  return {
    sourceConfidence: normalized,
    score,
  }
}