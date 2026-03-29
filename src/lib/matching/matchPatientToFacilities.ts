import { applyHardFilters } from "./hardFilters"
import { buildMatchExplanation } from "./buildMatchExplanation"
import { scoreConfidence } from "./scoreConfidence"
import { scoreInsurance } from "./scoreInsurance"
import { scorePrograms } from "./scorePrograms"
import { scoreSpecialties } from "./scoreSpecialties"
import type {
    FacilityMatchResult,
    FacilityMatchingInput,
    MatchFacilitiesResult,
    PatientMatchingInput,
} from "./types"

function normalizeDedupKey(name?: string, city?: string) {
    return `${(name ?? "").trim().toLowerCase()}::${(city ?? "").trim().toLowerCase()}`
}

export function matchPatientToFacilities(
    patient: PatientMatchingInput,
    facilities: FacilityMatchingInput[],
): MatchFacilitiesResult {
    const matches: FacilityMatchResult[] = facilities
        .map((facility) => {
            const hardFilter = applyHardFilters(patient, facility)
            const programs = scorePrograms(patient, facility).score
            const insurance = scoreInsurance(patient, facility)
            const specialties = scoreSpecialties(patient, facility)
            const confidence = scoreConfidence(patient, facility)

            const totalScore = hardFilter.passed
                ? programs.totalScore +
                  insurance.score +
                  specialties.totalScore +
                  confidence.score
                : 0

            const explanation = buildMatchExplanation(
                patient,
                facility,
                programs,
                insurance,
                specialties,
            )

            return {
                facilityId: facility.facilityId,
                facilityName: facility.facilityName,
                logoUrl: facility.logoUrl,
                website: facility.website,
                city: facility.city,
                matcherSummary: facility.matcherSummary,
                totalScore,
                hardFilterPassed: hardFilter.passed,
                hardFilterReasons: hardFilter.reasons,
                breakdown: {
                    programs,
                    insurance,
                    specialties,
                    confidence,
                },
                explanation,
                recommendedProgramType: patient.desiredLevelsOfCare[0] ?? null,
            }
        })
        .filter((match) => match.hardFilterPassed)
        .sort((a, b) => b.totalScore - a.totalScore)

    const seenKeys = new Set<string>()
    const deduped = matches.filter((match) => {
        const key = normalizeDedupKey(match.facilityName, match.city)
        if (seenKeys.has(key)) return false
        seenKeys.add(key)
        return true
    })

    const diversified: FacilityMatchResult[] = []
    const usedCities = new Set<string>()
    const targetCount = 50

    for (const match of deduped) {
        const cityKey = (match.city ?? "").trim().toLowerCase()

        if (diversified.length < 10) {
            if (cityKey && usedCities.has(cityKey)) continue
            diversified.push(match)
            if (cityKey) usedCities.add(cityKey)
            continue
        }

        diversified.push(match)

        if (diversified.length === targetCount) break
    }

    return {
        matches: diversified.length > 0 ? diversified : deduped.slice(0, targetCount),
    }
}
