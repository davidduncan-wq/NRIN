import type {
  FacilityMatchingInput,
  InsuranceScoreBreakdown,
  PatientMatchingInput,
} from "./types"

export function scoreInsurance(
  patient: PatientMatchingInput,
  facility: FacilityMatchingInput,
): InsuranceScoreBreakdown {
  const requestedInsurance = patient.insuranceCarrier

  if (!requestedInsurance || requestedInsurance === "unknown") {
    return {
      requestedInsurance,
      insuranceMatch: false,
      score: 0,
      reason: "No insurance preference provided",
    }
  }

  const insuranceMatch = facility.acceptedInsurance.includes(requestedInsurance)

  return {
    requestedInsurance,
    insuranceMatch,
    score: insuranceMatch ? 15 : 0,
    reason: insuranceMatch
      ? `Facility shows acceptance of ${requestedInsurance}`
      : `No detected acceptance for ${requestedInsurance}`,
  }
}