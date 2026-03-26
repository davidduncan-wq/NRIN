import type {
  FacilityMatchingInput,
  PatientMatchingInput,
  SpecialtyScoreBreakdown,
} from "./types"

export function scoreSpecialties(
  patient: PatientMatchingInput,
  facility: FacilityMatchingInput,
): SpecialtyScoreBreakdown {
  const lifeFit = patient.lifeFitProfile

  const requiresMAT = patient.requiresMAT

  const wantsProfessionalProgram =
    patient.wantsProfessionalProgram ||
    lifeFit?.signals.professionalTrackDesired === true

  const wantsFamilyProgram =
    patient.wantsFamilyProgram ||
    lifeFit?.signals.familyProgramDesired === true

  const matScore =
    requiresMAT && facility.hasMATSignal
      ? 8
      : requiresMAT
        ? 0
        : 0

  const professionalProgramScore =
    wantsProfessionalProgram && facility.hasProfessionalProgramSignal
      ? 6
      : 0

  const familyProgramScore =
    wantsFamilyProgram && facility.hasFamilyProgramSignal
      ? 6
      : 0

  return {
    matScore,
    professionalProgramScore,
    familyProgramScore,
    totalScore: matScore + professionalProgramScore + familyProgramScore,
  }
}
