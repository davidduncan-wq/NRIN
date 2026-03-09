export type LevelOfCare =
  | "detox"
  | "residential"
  | "php"
  | "iop"
  | "outpatient"

export type PatientMatchingInput = {
  needsDetox?: boolean
  desiredLevelsOfCare: LevelOfCare[]
  prefersDualDiagnosis?: boolean
}

export type FacilityMatchingInput = {
  facilityId: string
  detectedLevelsOfCare: LevelOfCare[]
  hasDualDiagnosisSignal?: boolean
  evidenceConfidence?: number
}

export type HardFilterResult = {
  passed: boolean
  reasons: string[]
}

export type ProgramScoreBreakdown = {
  levelMatches: number
  levelRequested: number
  levelMatchScore: number
  detoxScore: number
  dualDiagnosisScore: number
  totalScore: number
}

export type ProgramMatchResult = {
  hardFilter: HardFilterResult
  score: ProgramScoreBreakdown
}