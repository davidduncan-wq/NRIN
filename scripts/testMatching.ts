import { scorePrograms } from "../src/lib/matching/scorePrograms"
import type {
  FacilityMatchingInput,
  PatientMatchingInput,
} from "../src/lib/matching/types"

const patientNeedsDetoxResidential: PatientMatchingInput = {
  needsDetox: true,
  desiredLevelsOfCare: ["detox", "residential"],
  prefersDualDiagnosis: true,
}

const hazeldenLikeFacility: FacilityMatchingInput = {
  facilityId: "hazelden-betty-ford",
  detectedLevelsOfCare: ["detox", "residential", "php", "iop", "outpatient"],
  hasDualDiagnosisSignal: true,
  evidenceConfidence: 0.9,
}

const oasisLikeFacility: FacilityMatchingInput = {
  facilityId: "oasis-recovery",
  detectedLevelsOfCare: ["residential", "php", "iop", "outpatient"],
  hasDualDiagnosisSignal: true,
  evidenceConfidence: 0.7,
}

const outpatientOnlyFacility: FacilityMatchingInput = {
  facilityId: "outpatient-only",
  detectedLevelsOfCare: ["iop", "outpatient"],
  hasDualDiagnosisSignal: false,
  evidenceConfidence: 0.5,
}

console.log("\n=== Hazelden-like facility ===")
console.log(scorePrograms(patientNeedsDetoxResidential, hazeldenLikeFacility))

console.log("\n=== Oasis-like facility ===")
console.log(scorePrograms(patientNeedsDetoxResidential, oasisLikeFacility))

console.log("\n=== Outpatient-only facility ===")
console.log(scorePrograms(patientNeedsDetoxResidential, outpatientOnlyFacility))