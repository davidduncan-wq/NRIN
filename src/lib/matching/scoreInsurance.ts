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
  const hasMajorInsuranceSignal =
    facility.acceptsPrivateInsurance ||
    facility.acceptedInsurance.length >= 3

  let score = 0
  let reason = `No detected acceptance for ${requestedInsurance}`

  if (requestedInsurance === "self_pay") {
    if (hasMajorInsuranceSignal) {
      score = 22
      reason = "Facility appears commercially viable for self-pay placement"
    } else if (facility.acceptedInsurance.length === 0) {
      score = 15
      reason = "Insurance acceptance unclear; self-pay remains feasible"
    } else {
      score = 12
      reason = "Facility shows limited insurance data; self-pay remains possible"
    }

    return {
      requestedInsurance,
      insuranceMatch: false,
      score,
      reason,
    }
  }

  if (insuranceMatch) {
    score = 25
    reason = `Facility shows acceptance of ${requestedInsurance}`
  } else if (hasMajorInsuranceSignal) {
    score = 22
    reason = "Facility shows broad private / major insurance acceptance"
  } else if (facility.acceptedInsurance.length === 0) {
    score = 10
    reason = "Insurance acceptance unclear from available facility data"
  } else {
    score = 5
    reason = "Facility shows limited insurance acceptance"
  }

  return {
    requestedInsurance,
    insuranceMatch,
    score,
    reason,
  }
}
