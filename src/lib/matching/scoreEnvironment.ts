import type {
  FacilityMatchingInput,
  PatientMatchingInput
} from "./types"

import { classifyGeoEnvironment } from "../geo/classifyGeoEnvironment"

function hasTag(values: string[] | undefined, tag: string): boolean {
  return Array.isArray(values) && values.includes(tag)
}

export function scoreEnvironment(
  patient: PatientMatchingInput,
  facility: FacilityMatchingInput
): number {
  const preferred = patient?.lifeFitProfile?.preferences?.preferredEnvironment

  if (!preferred) return 0

  const geo = classifyGeoEnvironment({
    lat: facility.latitude ?? null,
    lng: facility.longitude ?? null,
    state: facility.state ?? null,
    city: facility.city ?? null,
  })

  let score = 0

  // REGION PREFERENCE
  if (preferred === "west_coast") {
    if (
      hasTag(facility.identityRegion, "WEST_COAST") ||
      geo.region === "west_coast"
    ) {
      score += 18
    } else {
      score -= 8
    }
  }

  if (preferred === "east_coast") {
    if (
      hasTag(facility.identityRegion, "EAST_COAST") ||
      geo.region === "east_coast"
    ) {
      score += 18
    } else {
      score -= 8
    }
  }

  // GEO IDENTITY PREFERENCE
  if (preferred === "island") {
    if (
      hasTag(facility.identityEnvironment, "ISLAND") ||
      geo.environment === "island"
    ) {
      score += 16
    } else {
      score -= 5
    }
  }

  if (preferred === "desert") {
    if (
      hasTag(facility.identityEnvironment, "DESERT") ||
      geo.environment === "desert"
    ) {
      score += 14
    } else {
      score -= 4
    }
  }

  if (preferred === "mountains") {
    if (
      hasTag(facility.identityEnvironment, "MOUNTAIN") ||
      geo.environment === "mountain"
    ) {
      score += 14
    } else {
      score -= 4
    }
  }

  if (preferred === "coastal") {
    if (
      hasTag(facility.identityEnvironment, "COASTAL") ||
      geo.environment === "coastal"
    ) {
      score += 14
    } else {
      score -= 4
    }
  }

  if (preferred === "urban_city") {
    if (geo.environment === "urban_city") {
      score += 12
    } else {
      score -= 3
    }
  }

  if (preferred === "rural_quiet") {
    if (geo.environment === "rural_quiet") {
      score += 12
    } else {
      score -= 3
    }
  }

  // QUEUE E IDENTITY OVERLAY
  if (preferred === "home_like") {
    if (hasTag(facility.identityEnvironment, "HOME_LIKE")) {
      score += 12
    }
  }

  if (preferred === "luxury") {
    if (hasTag(facility.identityEnvironment, "LUXURY")) {
      score += 12
    }
  }

  if (preferred === "nature") {
    if (hasTag(facility.identityEnvironment, "NATURE")) {
      score += 12
    }
  }

  return score
}
