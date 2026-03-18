import type {
  FacilityMatchingInput,
  InsuranceScoreBreakdown,
  MatchExplanation,
  PatientMatchingInput,
  ProgramScoreBreakdown,
  SpecialtyScoreBreakdown,
} from "./types"

export function buildMatchExplanation(
  patient: PatientMatchingInput,
  facility: FacilityMatchingInput,
  programs: ProgramScoreBreakdown,
  insurance: InsuranceScoreBreakdown,
  specialties: SpecialtyScoreBreakdown,
): MatchExplanation {
  const reasons: string[] = []
  const cautions: string[] = []

  if (programs.levelMatches > 0) {
    reasons.push(
      `Matches ${programs.levelMatches} of ${programs.levelRequested} requested levels of care`,
    )
  }

  if (patient.needsDetox && facility.detectedLevelsOfCare.includes("detox")) {
    reasons.push("Offers detox support")
  }

  if (patient.prefersDualDiagnosis && facility.hasDualDiagnosisSignal) {
    reasons.push("Shows dual-diagnosis support")
  }

  if (insurance.insuranceMatch && patient.insuranceCarrier) {
    reasons.push(`Detected acceptance of ${patient.insuranceCarrier}`)
  }

  if (patient.requiresMAT && facility.hasMATSignal) {
    reasons.push("Shows medication-assisted treatment support")
  }

  if (patient.wantsProfessionalProgram && facility.hasProfessionalProgramSignal) {
    reasons.push("Shows professional-track programming")
  }

  if (patient.wantsFamilyProgram && facility.hasFamilyProgramSignal) {
    reasons.push("Shows family-program support")
  }

  if (
    patient.prefersDualDiagnosis &&
    !facility.hasDualDiagnosisSignal
  ) {
    cautions.push("No strong dual-diagnosis signal detected")
  }

  if (patient.requiresMAT && !facility.hasMATSignal) {
    cautions.push("No strong MAT signal detected")
  }

  if (patient.insuranceCarrier && !insurance.insuranceMatch) {
    cautions.push(`Insurance compatibility with ${patient.insuranceCarrier} should be verified`)
  }

  return {
    reasons,
    cautions,
  }
}