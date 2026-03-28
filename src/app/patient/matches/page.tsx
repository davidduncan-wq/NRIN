import MatchCardStack from "@/components/patient/MatchCardStack"
import { fetchFacilityMatchingInputs } from "@/lib/matching/fetchFacilityMatches"
import { buildMatchViewModel } from "@/lib/matching/buildMatchViewModel"
import { buildPatientFromSearchParams } from "@/lib/matching/buildPatientProfile"
import { matchPatientToFacilities } from "@/lib/matching/matchPatientToFacilities"

export default async function PatientMatchesPage({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
    const resolvedSearchParams = searchParams ? await searchParams : undefined
    const patient = buildPatientFromSearchParams(resolvedSearchParams)

    const facilities = await fetchFacilityMatchingInputs({ insuranceCarrier: patient.insuranceCarrier })
    const result = matchPatientToFacilities(patient, facilities)

    console.log(
        "TOP 5 MATCHES:",
        result.matches.slice(0, 5).map((match) => ({
            facilityName: match.facilityName,
            totalScore: match.totalScore,
            city: match.city,
        })),
    )

    const viewModels = result.matches.map(buildMatchViewModel)

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
