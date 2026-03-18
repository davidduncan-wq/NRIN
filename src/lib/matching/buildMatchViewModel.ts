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
    reasons: MatchReasonViewModel[]
    cautions: string[]
    badges: string[]
    presentation: {
        title: string
        subtitle?: string
        location?: string
        logoUrl?: string
        heroImageUrl?: string
        scoreLabel: string
        primaryCtaLabel: string
        explanationCtaLabel: string
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

function buildSubtitle(match: FacilityMatchResult) {
    if (match.breakdown.programs.levelMatches >= 2) {
        return "High alignment with requested care"
    }

    if (match.breakdown.programs.levelMatches === 1) {
        return "Promising alignment with requested care"
    }

    return "Recommended treatment option"
}

function buildExplanationSummary(match: FacilityMatchResult) {
    const parts: string[] = []

    if (match.breakdown.programs.detoxScore > 0) {
        parts.push(
            "Based on what you shared, a supervised detox may be an important first step.",
        )
    }

    if (match.breakdown.programs.levelMatches > 0) {
        parts.push(
            `This option appears to match ${match.breakdown.programs.levelMatches} of your requested levels of care.`,
        )
    }

    if (match.breakdown.insurance.insuranceMatch) {
        parts.push("It also appears to work with your insurance.")
    }

    if (match.breakdown.specialties.matScore > 0) {
        parts.push("Medication-assisted treatment support appears to be available.")
    }

    if (match.breakdown.specialties.familyProgramScore > 0) {
        parts.push("Family support programming also appears to be available.")
    }

    if (parts.length === 0) {
        return "This option appears to align with several of the needs you shared."
    }

    return parts.join(" ")
}

export function buildMatchViewModel(match: FacilityMatchResult): MatchViewModel {
    const badges: string[] = []
    const reasons = match.explanation.reasons.map(normalizeReason)

    if (match.breakdown.programs.totalScore > 0) {
        badges.push(`Programs ${match.breakdown.programs.totalScore}`)
    }

    if (match.breakdown.insurance.score > 0) {
        badges.push(`Insurance ${match.breakdown.insurance.score}`)
    }

    if (match.breakdown.specialties.totalScore > 0) {
        badges.push(`Specialties ${match.breakdown.specialties.totalScore}`)
    }

    if (match.breakdown.confidence.score > 0) {
        badges.push(`Confidence ${match.breakdown.confidence.score}`)
    }

    return {
        id: match.facilityId,
        title: match.facilityName,
        score: match.totalScore,
        reasons,
        cautions: match.explanation.cautions,
        badges,
        presentation: {
            title: match.facilityName,
            subtitle: buildSubtitle(match),
            location: match.city,
            logoUrl: match.logoUrl,
            heroImageUrl: undefined,
            scoreLabel: `${match.totalScore}`,
            primaryCtaLabel: "Choose this facility",
            explanationCtaLabel: "Why this may be a strong fit for you",
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