import MatchCardStack from "@/components/patient/MatchCardStack"
import { fetchFacilityMatchingInputs } from "@/lib/matching/fetchFacilityMatches"
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
        acceptedInsurance: ["blue_cross_blue_shield", "aetna", "cigna", "self_pay"],
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

export default async function PatientMatchesPage() {
    const fetchedFacilities = await fetchFacilityMatchingInputs()
    const facilities =
        fetchedFacilities.length > 0 ? fetchedFacilities : demoFacilities

    const result = matchPatientToFacilities(demoPatient, facilities)
    const viewModels = result.matches.map(buildMatchViewModel)

    return (
        <main className="min-h-screen bg-white px-6 py-10 sm:py-14">
            <div className="mx-auto max-w-6xl">
                <div className="max-w-3xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400">
                        Recommended options
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-stone-950 sm:text-5xl">
                        Places that may fit your care needs
                    </h1>

                    <p className="mt-4 max-w-xl text-base leading-7 text-stone-500 sm:text-lg">
                        Treatment options matched to your care needs.
                    </p>
                </div>

                <MatchCardStack matches={viewModels} />
            </div>
        </main>
    )
}