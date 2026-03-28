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

export type LifeFitProfile = {
  captureMode: "" | "full" | "skip"

  constraints: {
    needsToStayNearFamily?: boolean
    needsToStayNearWork?: boolean
    legalPressurePresent?: boolean
  }

  preferences: {
    wantsDistanceFromHome?: boolean
    preferredEnvironment?: string
    privacyImportant?: boolean
  }

  signals: {
    familyProgramDesired?: boolean
    professionalTrackDesired?: boolean
  }

  narrativeSummary: string
}

export type FundingType =
  | "insurance"
  | "self_pay"
  | "indigent"

export type PatientMatchingInput = {
  needsDetox?: boolean
  desiredLevelsOfCare: LevelOfCare[]
  prefersDualDiagnosis?: boolean
  requiresMAT?: boolean
  insuranceCarrier?: InsuranceCarrier
  fundingType?: FundingType
  city?: string
  state?: string
  latitude?: number
  longitude?: number
  wantsProfessionalProgram?: boolean
  wantsFamilyProgram?: boolean
  lifeFitProfile?: LifeFitProfile
}

export type FacilityMatchingInput = {
  logoUrl?: string
  facilityId: string
  facilityName: string
  state?: string
  website?: string
  city?: string
  latitude?: number
  longitude?: number
  matcherSummary?: string

  detectedLevelsOfCare: LevelOfCare[]
  hasDualDiagnosisSignal?: boolean
  hasMATSignal?: boolean
  hasProfessionalProgramSignal?: boolean
  hasFamilyProgramSignal?: boolean

  acceptedInsurance: InsuranceCarrier[]
  evidenceConfidence?: number
  rawProgramEvidence?: any[]
  rawInsuranceEvidence?: any[]
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
  logoUrl?: string
  website?: string
  city?: string
  matcherSummary?: string
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
