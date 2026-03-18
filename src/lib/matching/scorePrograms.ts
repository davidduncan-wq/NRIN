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

  const levelMatches = requestedLevels.filter((level) =>
    facilityLevels.has(level),
  ).length

  const levelRequested = requestedLevels.length

  const levelMatchScore =
    levelRequested > 0 ? Math.round((levelMatches / levelRequested) * 80) : 0

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
      levelMatches,
      levelRequested,
      levelMatchScore,
      detoxScore,
      dualDiagnosisScore,
      totalScore: hardFilter.passed ? totalScore : 0,
    },
  }
}