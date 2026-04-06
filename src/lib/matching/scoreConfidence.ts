import type {
  ConfidenceScoreBreakdown,
  FacilityMatchingInput,
  PatientMatchingInput,
} from "./types"
import { getRegionFromState } from "./environmentClassifier"

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (x: number) => (x * Math.PI) / 180
  const R = 3958.8 // miles

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function scoreConfidence(
  patient: PatientMatchingInput,
  facility: FacilityMatchingInput,
): ConfidenceScoreBreakdown {
  const sourceConfidence = facility.evidenceConfidence ?? 0

  const normalized =
    sourceConfidence > 1 ? Math.min(sourceConfidence, 100) / 100 : sourceConfidence

  let score = 0

  const captureMode = patient?.lifeFitProfile?.captureMode ?? ""

  if (captureMode === "skip") {
    score = Math.max(0, score - 3)
  }

  const preferredEnvironment =
    patient?.lifeFitProfile?.preferences?.preferredEnvironment
  const closeToHomeRequested = patient.closeToHomeRequested === true

  if (closeToHomeRequested) {
    if (
      patient.latitude &&
      patient.longitude &&
      facility.latitude &&
      facility.longitude
    ) {
      const distance = haversineDistance(
        patient.latitude,
        patient.longitude,
        facility.latitude,
        facility.longitude,
      )

      if (distance < 15) score += 30
      else if (distance < 35) score += 24
      else if (distance < 75) score += 18
      else if (distance < 150) score += 10
      else if (distance < 300) score += 4
      else if (distance > 1000) score -= 26
      else if (distance > 500) score -= 18
      else if (distance > 300) score -= 10
    }

    if (
      patient.city &&
      facility.city &&
      facility.city.toLowerCase().includes(patient.city.toLowerCase())
    ) {
      score += 12
    } else if (patient.state && facility.state && patient.state === facility.state) {
      score += 8
    } else if (patient.state && facility.state && patient.state !== facility.state) {
      score -= 12
    }
  }


  return {
    sourceConfidence: normalized,
    score,
  }
}
