import { matchPatientToFacilities } from "../src/lib/matching/matchPatientToFacilities"
import type {
  FacilityMatchingInput,
  PatientMatchingInput,
} from "../src/lib/matching/types"

const patient: PatientMatchingInput = {
  needsDetox: true,
  desiredLevelsOfCare: ["detox", "residential"],
  prefersDualDiagnosis: true,
  requiresMAT: true,
  insuranceCarrier: "blue_cross_blue_shield",
  wantsProfessionalProgram: false,
  wantsFamilyProgram: true,
}

const facilities: FacilityMatchingInput[] = [
  {
    facilityId: "hazelden-betty-ford",
    facilityName: "Hazelden Betty Ford",
    state: "CA",
    detectedLevelsOfCare: ["detox", "residential", "php", "iop", "outpatient"],
    hasDualDiagnosisSignal: true,
    hasMATSignal: true,
    hasProfessionalProgramSignal: true,
    hasFamilyProgramSignal: true,
    acceptedInsurance: ["blue_cross_blue_shield", "aetna", "cigna", "self_pay"],
    evidenceConfidence: 0.92,
  },
  {
    facilityId: "oasis-recovery",
    facilityName: "Oasis Recovery",
    state: "CA",
    detectedLevelsOfCare: ["residential", "php", "iop", "outpatient"],
    hasDualDiagnosisSignal: true,
    hasMATSignal: false,
    hasProfessionalProgramSignal: false,
    hasFamilyProgramSignal: true,
    acceptedInsurance: ["aetna", "cigna", "self_pay"],
    evidenceConfidence: 0.74,
  },
  {
    facilityId: "outpatient-only",
    facilityName: "Outpatient Only Center",
    state: "CA",
    detectedLevelsOfCare: ["iop", "outpatient"],
    hasDualDiagnosisSignal: false,
    hasMATSignal: false,
    hasProfessionalProgramSignal: false,
    hasFamilyProgramSignal: false,
    acceptedInsurance: ["self_pay"],
    evidenceConfidence: 0.55,
  },
]

const result = matchPatientToFacilities(patient, facilities)

console.log(JSON.stringify(result, null, 2))