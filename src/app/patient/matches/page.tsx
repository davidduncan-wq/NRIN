import MatchCardStack from "@/components/patient/MatchCardStack"
import { buildMatchViewModel } from "@/lib/matching/buildMatchViewModel"
import { matchPatientToFacilities } from "@/lib/matching/matchPatientToFacilities"
import type {
  FacilityMatchingInput,
  PatientMatchingInput,
} from "@/lib/matching/types"

const demoPatient: PatientMatchingInput = {
  needsDetox: true,
  desiredLevelsOfCare: ["detox", "residential"],
  prefersDualDiagnosis: true,
  requiresMAT: true,
  insuranceCarrier: "blue_cross_blue_shield",
  wantsProfessionalProgram: false,
  wantsFamilyProgram: true,
}

const demoFacilities: FacilityMatchingInput[] = [
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
    facilityId: "caron-treatment",
    facilityName: "Caron Treatment",
    state: "PA",
    detectedLevelsOfCare: ["detox", "residential", "php", "iop", "outpatient"],
    hasDualDiagnosisSignal: true,
    hasMATSignal: true,
    hasProfessionalProgramSignal: true,
    hasFamilyProgramSignal: false,
    acceptedInsurance: ["aetna", "cigna", "self_pay"],
    evidenceConfidence: 0.88,
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
]

export default function PatientMatchesPage() {
  const result = matchPatientToFacilities(demoPatient, demoFacilities)
  const viewModels = result.matches.map(buildMatchViewModel)

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-6 border-b border-neutral-200 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              NRIN Matching
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
              Recommended facilities
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600">
              These recommendations are based on requested level of care,
              specialty fit, insurance compatibility, and facility profile
              confidence.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 px-4 py-3 text-right">
            <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
              Matches found
            </div>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
              {result.matches.length}
            </div>
          </div>
        </div>

                <MatchCardStack matches={viewModels} />

             
        </div>
      
    </main>
  )
}