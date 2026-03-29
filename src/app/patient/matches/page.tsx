import MatchCardStack from "@/components/patient/MatchCardStack"
import { fetchFacilityMatchingInputs } from "@/lib/matching/fetchFacilityMatches"
import { buildMatchViewModel } from "@/lib/matching/buildMatchViewModel"
import { buildPatientFromSearchParams } from "@/lib/matching/buildPatientProfile"
import { matchPatientToFacilities } from "@/lib/matching/matchPatientToFacilities"
import { supabase } from "@/lib/supabaseClient"

export default async function PatientMatchesPage({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
    const resolvedSearchParams = searchParams ? await searchParams : undefined
    const patient = buildPatientFromSearchParams(resolvedSearchParams)

    const facilities = await fetchFacilityMatchingInputs({
        insuranceCarrier: patient.insuranceCarrier,
        insuranceType:
            typeof resolvedSearchParams?.insuranceType === "string"
                ? resolvedSearchParams.insuranceType
                : undefined,
        selfPayOnly: resolvedSearchParams?.selfPayIntent === "yes",
    })
    const result = matchPatientToFacilities(patient, facilities)

    const patientId =
        typeof resolvedSearchParams?.patientId === "string"
            ? resolvedSearchParams.patientId
            : null

    const caseId =
        typeof resolvedSearchParams?.caseId === "string"
            ? resolvedSearchParams.caseId
            : null

    const previousExposureIds = new Set<string>()

    if (patientId || caseId) {
        let historyQuery = supabase
            .from("match_sessions")
            .select("top_matches, created_at")
            .order("created_at", { ascending: false })
            .limit(10)

        if (caseId) {
            historyQuery = historyQuery.eq("case_id", caseId)
        } else if (patientId) {
            historyQuery = historyQuery.eq("patient_id", patientId)
        }

        const { data: previousSessions, error: previousSessionsError } =
            await historyQuery

        if (previousSessionsError) {
            console.error(
                "MATCH SESSION HISTORY ERROR:",
                previousSessionsError,
            )
        } else {
            for (const session of previousSessions ?? []) {
                const topMatches =
                    Array.isArray(session.top_matches) ? session.top_matches : []

                for (const item of topMatches) {
                    if (
                        item &&
                        typeof item === "object" &&
                        "facilityId" in item &&
                        typeof item.facilityId === "string"
                    ) {
                        previousExposureIds.add(item.facilityId)
                    }
                }
            }
        }
    }

    const unseenMatches = result.matches.filter(
        (match) => !previousExposureIds.has(match.facilityId),
    )

    const finalMatches =
        unseenMatches.length >= 5
            ? unseenMatches
            : unseenMatches.length > 0
              ? [...unseenMatches, ...result.matches.filter((match) =>
                    !unseenMatches.some(
                        (unseen) => unseen.facilityId === match.facilityId,
                    ),
                )]
              : result.matches

    console.log(
        "TOP 5 MATCHES:",
        finalMatches.slice(0, 5).map((match) => ({
            facilityName: match.facilityName,
            totalScore: match.totalScore,
            city: match.city,
        })),
    )

    const topMatches = finalMatches.slice(0, 5).map((match, index) => ({
        rank: index + 1,
        facilityId: match.facilityId,
        facilityName: match.facilityName,
        city: match.city,
        score: match.totalScore,
        recommendedProgramType: match.recommendedProgramType,
    }))

    const refinementState = {
        refineGeo:
            typeof resolvedSearchParams?.refineGeo === "string"
                ? resolvedSearchParams.refineGeo
                : null,
        refineLevels:
            typeof resolvedSearchParams?.refineLevels === "string"
                ? resolvedSearchParams.refineLevels
                      .split(",")
                      .map((value) => value.trim())
                      .filter(Boolean)
                : [],
        refineFamily: resolvedSearchParams?.refineFamily === "1",
        refineProfessional: resolvedSearchParams?.refineProfessional === "1",
        refineMAT: resolvedSearchParams?.refineMAT === "1",
        refineReason:
            typeof resolvedSearchParams?.refineReason === "string"
                ? resolvedSearchParams.refineReason
                : null,
    }

    const hasRefinement =
        refinementState.refineGeo !== null ||
        refinementState.refineLevels.length > 0 ||
        refinementState.refineFamily ||
        refinementState.refineProfessional ||
        refinementState.refineMAT ||
        refinementState.refineReason !== null

    const { error: matchSessionError } = await supabase
        .from("match_sessions")
        .insert({
            patient_id: patientId,
            case_id: caseId,
            session_index: hasRefinement ? 2 : 1,
            patient_snapshot: patient,
            top_matches: topMatches,
            match_metadata: {
                facilityCount: facilities.length,
            },
            refinement_state: hasRefinement ? refinementState : {},
        })

    if (matchSessionError) {
        console.error("MATCH SESSION INSERT ERROR:", matchSessionError)
    }

    const viewModels = finalMatches.map(buildMatchViewModel)

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
