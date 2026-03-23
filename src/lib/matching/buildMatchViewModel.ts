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
    presentation: {
        title: string
        subtitle?: string
        location?: string
        logoUrl?: string
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

    if (match.breakdown.programs.levelMatches >= 2) {
        items.push("Multiple levels of care")
    } else if (match.breakdown.programs.levelMatches === 1) {
        items.push("Appropriate level of care")
    }

    if (match.breakdown.insurance.insuranceMatch) {
        items.push("Insurance accepted")
    }

    if (match.breakdown.specialties.matScore > 0) {
        items.push("MAT available")
    }

    if (match.breakdown.specialties.familyProgramScore > 0) {
        items.push("Family support available")
    }

    if (items.length === 0) {
        items.push("Aligned with key care needs")
    }

    return items.slice(0, 4)
}

function buildNextStep(match: FacilityMatchResult) {
    if (match.breakdown.insurance.insuranceMatch) {
        return "A good next step is to confirm admissions timing, insurance details, and any program-specific requirements."
    }

    return "A good next step is to confirm admissions timing, payment options, and whether the program fits your immediate care needs."
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
    if (
        match.breakdown.programs.detoxScore > 0 &&
        match.breakdown.programs.levelMatches >= 2
    ) {
        return "Structured care with detox and continued support."
    }

    if (match.breakdown.programs.detoxScore > 0) {
        return "Detox support with continued care options."
    }

    if (match.breakdown.programs.levelMatches >= 2) {
        return "A strong fit for the level of care you may need."
    }

    if (match.breakdown.programs.levelMatches === 1) {
        return "Aligned with an important part of your care needs."
    }

    return "A credible treatment option."
}

function buildReassuranceLine(match: FacilityMatchResult) {
    return ""
}

function buildExplanationSummary(match: FacilityMatchResult) {
    const parts: string[] = []

    if (match.breakdown.programs.detoxScore > 0) {
        parts.push("Detox support is available.")
    }

    if (match.breakdown.programs.levelMatches >= 2) {
        parts.push("The level of care aligns closely with what you may need.")
    } else if (match.breakdown.programs.levelMatches === 1) {
        parts.push("An important part of your care needs appears to align here.")
    }

    if (match.breakdown.insurance.insuranceMatch) {
        parts.push("This facility appears to work with your insurance.")
    }

    if (match.breakdown.specialties.matScore > 0) {
        parts.push("Medication-supported treatment is available.")
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

    return {
        id: match.facilityId,
        title: match.facilityName,
        score: match.totalScore,
        reasons,
        cautions,
        presentation: {

            title: match.facilityName,
            subtitle: buildSubtitle(match),
            location: match.city,
            logoUrl: match.logoUrl,

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
            strengths: reasons.slice(0, 4),
            watchouts: cautions,
            nextStep: buildNextStep(match),
            supportingInfo: reasons.filter(
                (reason) => reason.snippet || reason.sourceLabel || reason.sourceUrl,
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