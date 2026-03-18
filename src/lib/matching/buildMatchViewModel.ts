import type { FacilityMatchResult } from "./types"

export type MatchViewModel = {
  id: string
  title: string
  score: number
  reasons: string[]
  cautions: string[]
  badges: string[]
  meta: {
    programsScore: number
    insuranceScore: number
    specialtiesScore: number
    confidenceScore: number
  }
}

export function buildMatchViewModel(match: FacilityMatchResult): MatchViewModel {
  const badges: string[] = []

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
    reasons: match.explanation.reasons,
    cautions: match.explanation.cautions,
    badges,
    meta: {
      programsScore: match.breakdown.programs.totalScore,
      insuranceScore: match.breakdown.insurance.score,
      specialtiesScore: match.breakdown.specialties.totalScore,
      confidenceScore: match.breakdown.confidence.score,
    },
  }
}