import { applyHardFilters } from "./hardFilters"
import type {
  FacilityMatchingInput,
  HardFilterResult,
  PatientMatchingInput,
  ProgramScoreBreakdown,
} from "./types"

export function scorePrograms(
  patient: PatientMatchingInput,
  facility: FacilityMatchingInput,
): {
  hardFilter: HardFilterResult
  score: ProgramScoreBreakdown
} {
  const hardFilter = applyHardFilters(patient, facility)

  const facilityLevels = new Set(facility.detectedLevelsOfCare)
  const requestedLevels = patient.desiredLevelsOfCare

  const primaryLevel = requestedLevels[0]

  const primaryMatch = primaryLevel
    ? facilityLevels.has(primaryLevel)
    : false

  const secondaryMatches = requestedLevels
    .slice(1)
    .filter((level) => facilityLevels.has(level)).length

  let levelMatchScore = 0

  if (primaryMatch) {
    levelMatchScore = 70
  } else if (secondaryMatches > 0) {
    levelMatchScore = 25
  } else {
    levelMatchScore = 0
  }

  const detoxScore =
    patient.needsDetox && facilityLevels.has("detox")
      ? 15
      : 0

  const dualDiagnosisScore =
    patient.prefersDualDiagnosis && facility.hasDualDiagnosisSignal ? 5 : 0

  const totalScore = levelMatchScore + detoxScore + dualDiagnosisScore

  return {
    hardFilter,
    score: {
      levelMatches: primaryMatch ? 1 : secondaryMatches,
      levelRequested: requestedLevels.length,
      levelMatchScore,
      detoxScore,
      dualDiagnosisScore,
      totalScore: hardFilter.passed ? totalScore : 0,
    },
  }
}