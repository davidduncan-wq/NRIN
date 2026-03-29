import type { FacilityMatchResult, MatchReasonEvidence } from "./types"

export type MatchReasonViewModel = {
    label: string
    snippet?: string
    sourceUrl?: string
    sourceLabel?: string
    anchorId?: string
}

export type MatchViewModel = {
    id: string
    title: string
    score: number
    recommendedProgramType?: string | null
    reasons: MatchReasonViewModel[]
    cautions: string[]
    presentation: {
        title: string
        subtitle?: string
        location?: string
        logoUrl?: string
        reasonPills: string[]
        recommendationSourceLabel: "Our recommendation",
        heroImageUrl?: string
        primaryCtaLabel: string
        explanationCtaLabel: string
        reassuranceLine: string
        eyebrow?: string
        scoreLabel: string
    }
    brochure: {
        atAGlance: string[]
        strengths: MatchReasonViewModel[]
        watchouts: string[]
        nextStep: string
        supportingInfo: MatchReasonViewModel[]
    }
    explanation: {
        summary: string
        reasons: MatchReasonViewModel[]
    }
    meta: {
        programsScore: number
        insuranceScore: number
        specialtiesScore: number
        confidenceScore: number
    }
}

function buildScoreLabel(match: FacilityMatchResult) {
    if (match.totalScore >= 85) return "Strong match"
    if (match.totalScore >= 70) return "Promising option"
    if (match.totalScore >= 55) return "Worth exploring"
    return "Possible fit"
}

function buildAtAGlance(match: FacilityMatchResult) {
    const items: string[] = []

    if (match.breakdown.programs.detoxScore > 0) {
        items.push("Detox available")
    }

    if (match.breakdown.programs.levelMatchScore >= 70) {
        items.push("Primary care level match")
    } else if (match.breakdown.programs.levelMatchScore >= 25) {
        items.push("Partial care-path match")
    }

    if (match.breakdown.insurance.insuranceMatch) {
        items.push("Insurance accepted")
    }

    if (match.breakdown.specialties.matScore > 0) {
        items.push("MAT available")
    }

    if (match.breakdown.specialties.professionalProgramScore > 0) {
        items.push("Professional support available")
    }

    if (match.breakdown.specialties.familyProgramScore > 0) {
        items.push("Family support available")
    }

    if (items.length === 0) {
        items.push("Relevant care options available")
    }

    return items.slice(0, 4)
}

function buildNextStep(match: FacilityMatchResult) {
    if (match.breakdown.insurance.insuranceMatch) {
        return "A good next step is to confirm admissions timing, finalize insurance details, and review any program-specific requirements."
    }

    if (match.breakdown.insurance.score > 0) {
        return "A good next step is to verify insurance compatibility, confirm admissions timing, and make sure the program fits your immediate care needs."
    }

    return "A good next step is to confirm admissions timing, discuss payment options, and make sure the program fits your immediate care needs."
}

function normalizeReason(
    reason: string | MatchReasonEvidence,
): MatchReasonViewModel {
    if (typeof reason === "string") {
        return { label: reason }
    }

    return {
        label: reason.label,
        snippet: reason.snippet,
        sourceUrl: reason.sourceUrl,
        sourceLabel: reason.sourceLabel,
        anchorId: reason.anchorId,
    }
}

function buildEyebrow(match: FacilityMatchResult) {
    if (match.city) return match.city
    return undefined
}

function buildSubtitle(match: FacilityMatchResult) {
    if (match.breakdown.programs.levelMatchScore >= 70) {
        return match.breakdown.programs.detoxScore > 0
            ? "Detox support with strong primary care-level alignment."
            : "Strong alignment with your primary level of care."
    }

    if (match.breakdown.programs.levelMatchScore >= 25) {
        return "Partial alignment with your care needs."
    }

    if (match.breakdown.programs.detoxScore > 0) {
        return "Detox support is available."
    }

    return "A credible treatment option."
}

function buildReassuranceLine(match: FacilityMatchResult) {
    return ""
}

function buildExplanationSummary(match: FacilityMatchResult) {
    const parts: string[] = []

    if (match.breakdown.programs.levelMatchScore >= 70) {
        parts.push("This facility matches your primary level of care.")
    } else if (match.breakdown.programs.levelMatchScore >= 25) {
        parts.push("This facility covers part of the level-of-care path you may need.")
    }

    if (match.breakdown.insurance.insuranceMatch) {
        parts.push("It appears to work with your insurance.")
    }

    if (match.breakdown.specialties.matScore > 0) {
        parts.push("Medication-supported treatment is available.")
    }

    if (match.breakdown.specialties.professionalProgramScore > 0) {
        parts.push("Professional-track support is available.")
    }

    if (match.breakdown.specialties.familyProgramScore > 0) {
        parts.push("Family support is available.")
    }

    if (parts.length === 0) {
        return "This facility appears to align with several of your care needs."
    }

    return parts.join(" ")
}

export function buildMatchViewModel(match: FacilityMatchResult): MatchViewModel {
    const reasons = match.explanation.reasons.map(normalizeReason)
    const cautions = match.explanation.cautions
    const strengths = reasons
        .filter((reason) => reason.label)

    return {
        id: match.facilityId,
        title: match.facilityName,
        score: match.totalScore,
        recommendedProgramType: (match as any).recommendedProgramType ?? null,
        reasons,
        cautions,
        presentation: {

            title: match.facilityName,
            subtitle: buildSubtitle(match),
            location: match.city,
            logoUrl: match.logoUrl,
            
            reasonPills: (() => {
    const labels = strengths.map((r) => r.label)

    const insurance = labels.find((l) =>
        l.toLowerCase().includes("accepts") ||
        l.toLowerCase().includes("insurance")
    )

    const primary = labels.find((l) =>
        l.toLowerCase().includes("primary level")
    )

    const mat = labels.find((l) =>
        l.toLowerCase().includes("medication")
    )

    const professional = labels.find((l) =>
        l.toLowerCase().includes("professional")
    )

    const family = labels.find((l) =>
        l.toLowerCase().includes("family")
    )

    const ordered = [
        primary,
        insurance,
        mat,
        professional,
        family,
        ...labels,
    ].filter(Boolean)

    const unique = [...new Set(ordered)]

    return unique as string[]
})(),

            recommendationSourceLabel: "Our recommendation",

            heroImageUrl: undefined,
            primaryCtaLabel: "Choose this facility",
            explanationCtaLabel: "See why we recommended this",
            reassuranceLine: buildReassuranceLine(match),
            eyebrow: buildEyebrow(match),
            scoreLabel: buildScoreLabel(match),
        },
        brochure: {
            atAGlance: buildAtAGlance(match),
            strengths,
            watchouts: cautions,
            nextStep: buildNextStep(match),
            supportingInfo: reasons.filter(
                (reason) =>
                    !!reason.sourceUrl &&
                    !!reason.snippet &&
                    !strengths.some((strength) => strength.label === reason.label),
            ),
        },
        explanation: {
            summary: buildExplanationSummary(match),
            reasons,
        },
        meta: {
            programsScore: match.breakdown.programs.totalScore,
            insuranceScore: match.breakdown.insurance.score,
            specialtiesScore: match.breakdown.specialties.totalScore,
            confidenceScore: match.breakdown.confidence.score,
        },
    }
}