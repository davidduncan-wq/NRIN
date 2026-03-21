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
        heroImageUrl?: string
        primaryCtaLabel: string
        explanationCtaLabel: string
        reassuranceLine: string
        eyebrow?: string
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

function buildEyebrow(match: FacilityMatchResult) {
    if (match.city) return match.city
    return undefined
}

function buildSubtitle(match: FacilityMatchResult) {
    if (
        match.breakdown.programs.detoxScore > 0 &&
        match.breakdown.programs.levelMatches >= 2
    ) {
        return "Structured detox and continued care."
    }

    if (match.breakdown.programs.detoxScore > 0) {
        return "Detox support with continued care options."
    }

    if (match.breakdown.programs.levelMatches >= 2) {
        return "Strong alignment with your requested care."
    }

    if (match.breakdown.programs.levelMatches === 1) {
        return "Aligned with a key part of your care needs."
    }

    return "A credible treatment option."
}

function buildReassuranceLine(match: FacilityMatchResult) {
    if (
        match.breakdown.insurance.insuranceMatch &&
        match.breakdown.specialties.matScore > 0
    ) {
        return "Insurance accepted. Medication-supported care available."
    }

    if (match.breakdown.insurance.insuranceMatch) {
        return "Insurance accepted."
    }

    if (match.breakdown.specialties.matScore > 0) {
        return "Medication-supported care available."
    }

    if (match.breakdown.specialties.familyProgramScore > 0) {
        return "Family support available."
    }

    return "Established treatment setting."
}

function buildExplanationSummary(match: FacilityMatchResult) {
    const parts: string[] = []

    if (match.breakdown.programs.detoxScore > 0) {
        parts.push("Detox support is available.")
    }

    if (match.breakdown.programs.levelMatches >= 2) {
        parts.push("Strong alignment with your requested level of care.")
    } else if (match.breakdown.programs.levelMatches === 1) {
        parts.push("Aligned with an important part of your care needs.")
    }

    if (match.breakdown.insurance.insuranceMatch) {
        parts.push("Accepts your insurance.")
    }

    if (match.breakdown.specialties.matScore > 0) {
        parts.push("Medication-assisted treatment is available.")
    }

    if (match.breakdown.specialties.familyProgramScore > 0) {
        parts.push("Family support programming is available.")
    }

    if (parts.length === 0) {
        return "Aligned with several of your care needs."
    }

    return parts.join(" ")
}

export function buildMatchViewModel(match: FacilityMatchResult): MatchViewModel {
    const reasons = match.explanation.reasons.map(normalizeReason)

    return {
        id: match.facilityId,
        title: match.facilityName,
        score: match.totalScore,
        reasons,
        cautions: match.explanation.cautions,
        presentation: {
            title: match.facilityName,
            subtitle: buildSubtitle(match),
            location: match.city,
            logoUrl: match.logoUrl,
            heroImageUrl: undefined,
            primaryCtaLabel: "Explore this option",
            explanationCtaLabel: "Why this may be a strong fit for you",
            reassuranceLine: buildReassuranceLine(match),
            eyebrow: buildEyebrow(match),
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