import MatchCardStack from "@/components/patient/MatchCardStack"
import { fetchFacilityMatchingInputs } from "@/lib/matching/fetchFacilityMatches"
import { buildMatchViewModel } from "@/lib/matching/buildMatchViewModel"
import { matchPatientToFacilities } from "@/lib/matching/matchPatientToFacilities"

import type {
    FacilityMatchingInput,
    InsuranceCarrier,
    LevelOfCare,
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

function parseBoolean(value: string | string[] | undefined, fallback: boolean) {
    if (typeof value !== "string") return fallback
    return value === "1"
}

function parseLevels(value: string | string[] | undefined, fallback: LevelOfCare[]) {
    if (typeof value !== "string" || value.trim() === "") return fallback
    return value
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean) as LevelOfCare[]
}

function parseInsuranceCarrier(
    value: string | string[] | undefined,
): InsuranceCarrier | undefined {
    return typeof value === "string" ? (value as InsuranceCarrier) : undefined
}

function buildPatientFromSearchParams(
    searchParams?: Record<string, string | string[] | undefined>,
): PatientMatchingInput {
    if (!searchParams) return demoPatient

    const desiredLevelsOfCare = parseLevels(
        searchParams.desiredLevelsOfCare,
        demoPatient.desiredLevelsOfCare,
    )

    return {
        needsDetox: parseBoolean(
            searchParams.needsDetox,
            demoPatient.needsDetox ?? true,
        ),
        desiredLevelsOfCare,
        prefersDualDiagnosis: parseBoolean(
            searchParams.prefersDualDiagnosis,
            demoPatient.prefersDualDiagnosis ?? true,
        ),
        requiresMAT: parseBoolean(
            searchParams.requiresMAT,
            demoPatient.requiresMAT ?? true,
        ),
        insuranceCarrier:
            parseInsuranceCarrier(searchParams.insuranceCarrier) ??
            demoPatient.insuranceCarrier,
        wantsProfessionalProgram: parseBoolean(
            searchParams.wantsProfessionalProgram,
            demoPatient.wantsProfessionalProgram ?? false,
        ),
        wantsFamilyProgram: parseBoolean(
            searchParams.wantsFamilyProgram,
            demoPatient.wantsFamilyProgram ?? true,
        ),

        state:
            typeof searchParams.state === "string" && searchParams.state.trim() !== ""
                ? searchParams.state
                : demoPatient.state,
    }
}

export default async function PatientMatchesPage({
    searchParams,
}: {
    searchParams?: Record<string, string | string[] | undefined>
}) {
    const patient = buildPatientFromSearchParams(searchParams)

    const fetchedFacilities = await fetchFacilityMatchingInputs()
    const facilities =
        fetchedFacilities.length > 0 ? fetchedFacilities : demoFacilities

    const result = matchPatientToFacilities(patient, facilities)
    const viewModels = result.matches.map(buildMatchViewModel)
    const recommendationSourceLabel =
        viewModels[0]?.presentation.recommendationSourceLabel ?? "Our recommendation"

    return (
        <main className="min-h-screen bg-white px-6 py-10 sm:py-14">
            <div className="mx-auto max-w-6xl">
                <div className="pt-14 sm:pt-20">
                    <div className="max-w-[720px]">
                        <p className="text-sm text-stone-500">
                            Based on what you shared
                        </p>

                        <h1 className="mt-1 text-lg font-semibold text-stone-950 sm:text-xl">
                            Our recommendation
                        </h1>
                    </div>
                </div>

                <div className="mt-12 sm:mt-16">
                    <MatchCardStack matches={viewModels} />
                </div>
            </div>
        </main>
    )
}