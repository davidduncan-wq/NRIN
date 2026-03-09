import type {
  FacilityMatchingInput,
  HardFilterResult,
  PatientMatchingInput,
} from "./types"

export function applyHardFilters(
  patient: PatientMatchingInput,
  facility: FacilityMatchingInput,
): HardFilterResult {
  const reasons: string[] = []

  const facilityLevels = new Set(facility.detectedLevelsOfCare)

  if (patient.needsDetox && !facilityLevels.has("detox")) {
    reasons.push("Patient needs detox but facility has no detox signal")
  }

  const patientNeedsResidential =
    patient.desiredLevelsOfCare.includes("residential")

  const facilityOnlyOutpatient =
    facilityLevels.size > 0 &&
    !facilityLevels.has("detox") &&
    !facilityLevels.has("residential") &&
    (facilityLevels.has("php") ||
      facilityLevels.has("iop") ||
      facilityLevels.has("outpatient"))

  if (patientNeedsResidential && facilityOnlyOutpatient) {
    reasons.push(
      "Patient needs residential level of care but facility appears outpatient-only",
    )
  }

  return {
    passed: reasons.length === 0,
    reasons,
  }
}