import type {
  FacilityMatchingInput,
  PatientMatchingInput,
} from "./types"

function hasTag(values: string[] | undefined, tag: string): boolean {
  return Array.isArray(values) && values.includes(tag)
}

function facilityHasExperienceTag(
  facility: FacilityMatchingInput,
  tag: string,
): boolean {
  return (
    hasTag(facility.identityActivities, tag) ||
    hasTag(facility.identityAtmosphere, tag) ||
    hasTag(facility.identityEnvironment, tag) ||
    hasTag(facility.identitySpecialTracks, tag)
  )
}

export function scoreExperience(
  patient: PatientMatchingInput,
  facility: FacilityMatchingInput,
): number {
  const requested = patient.preferredExperienceTags ?? []
  if (requested.length === 0) return 0

  let score = 0

  for (const tag of requested) {
    if (facilityHasExperienceTag(facility, tag)) {
      score += 6
    } else {
      score -= 1
    }
  }

  return score
}
