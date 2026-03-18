import type {
  FacilityMatchingInput,
  PatientMatchingInput,
  SpecialtyScoreBreakdown,
} from "./types"

export function scoreSpecialties(
  patient: PatientMatchingInput,
  facility: FacilityMatchingInput,
): SpecialtyScoreBreakdown {
  const matScore =
    patient.requiresMAT && facility.hasMATSignal
      ? 8
      : patient.requiresMAT
        ? 0
        : 0

  const professionalProgramScore =
    patient.wantsProfessionalProgram && facility.hasProfessionalProgramSignal
      ? 6
      : 0

  const familyProgramScore =
    patient.wantsFamilyProgram && facility.hasFamilyProgramSignal
      ? 6
      : 0

  return {
    matScore,
    professionalProgramScore,
    familyProgramScore,
    totalScore: matScore + professionalProgramScore + familyProgramScore,
  }
}