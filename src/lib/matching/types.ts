export type LevelOfCare =
  | "detox"
  | "residential"
  | "php"
  | "iop"
  | "outpatient"
  | "aftercare"

export type InsuranceCarrier =
  | "aetna"
  | "cigna"
  | "blue_cross_blue_shield"
  | "united_healthcare"
  | "humana"
  | "anthem"
  | "ambetter"
  | "molina"
  | "beacon"
  | "tricare"
  | "medicare"
  | "medicaid"
  | "self_pay"
  | "unknown"

export type PatientMatchingInput = {
  needsDetox?: boolean
  desiredLevelsOfCare: LevelOfCare[]
  prefersDualDiagnosis?: boolean
  requiresMAT?: boolean
  insuranceCarrier?: InsuranceCarrier
  state?: string
  wantsProfessionalProgram?: boolean
  wantsFamilyProgram?: boolean
}

export type FacilityMatchingInput = {
  facilityId: string
  facilityName: string
  state?: string

  detectedLevelsOfCare: LevelOfCare[]
  hasDualDiagnosisSignal?: boolean
  hasMATSignal?: boolean
  hasProfessionalProgramSignal?: boolean
  hasFamilyProgramSignal?: boolean

  acceptedInsurance: InsuranceCarrier[]
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

export type InsuranceScoreBreakdown = {
  requestedInsurance?: InsuranceCarrier
  insuranceMatch: boolean
  score: number
  reason?: string
}

export type SpecialtyScoreBreakdown = {
  matScore: number
  professionalProgramScore: number
  familyProgramScore: number
  totalScore: number
}

export type ConfidenceScoreBreakdown = {
  sourceConfidence: number
  score: number
}

export type MatchReasonEvidence = {
  label: string
  snippet?: string
  sourceUrl?: string
  sourceLabel?: string
  anchorId?: string
}

export type MatchExplanation = {
  reasons: Array<string | MatchReasonEvidence>
  cautions: string[]
}

export type FacilityMatchResult = {
  facilityId: string
  facilityName: string
  totalScore: number
  hardFilterPassed: boolean
  hardFilterReasons: string[]

  breakdown: {
    programs: ProgramScoreBreakdown
    insurance: InsuranceScoreBreakdown
    specialties: SpecialtyScoreBreakdown
    confidence: ConfidenceScoreBreakdown
  }

  explanation: MatchExplanation
}

export type MatchFacilitiesResult = {
  matches: FacilityMatchResult[]
}