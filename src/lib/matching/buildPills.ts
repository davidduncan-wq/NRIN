import type { FacilityMatchingInput, PatientMatchingInput } from "./types"
import { classifyGeoEnvironment } from "@/lib/geo/classifyGeoEnvironment"

export type MatchPillStatus = "met" | "missing"

export type MatchPill = {
  key:
    | "detox"
    | "mat"
    | "dual_diagnosis"
    | "family_program"
    | "professional_program"
    | "environment"
    | "close_to_home"
  label: string
  status: MatchPillStatus
  isPatientDriven: true
  negativeAllowedOnFirstRender: boolean
}

function normalizePreferredEnvironment(value?: string | null): string | null {
  if (!value) return null
  return value.trim().toLowerCase()
}

function formatEnvironmentLabel(value: string): string {
  switch (value) {
    case "west_coast":
      return "West Coast"
    case "east_coast":
      return "East Coast"
    case "midwest":
      return "Midwest"
    case "south":
      return "South"
    case "desert":
      return "Desert setting"
    case "mountains":
      return "Mountain setting"
    case "coastal":
      return "Coastal setting"
    case "island":
      return "Island setting"
    case "urban_city":
      return "Urban setting"
    case "rural_quiet":
      return "Quiet setting"
    case "home_like":
      return "Home-like setting"
    case "luxury":
      return "Luxury setting"
    case "nature":
      return "Nature setting"
    default:
      return value.replaceAll("_", " ").replace(/\b\w/g, (m) => m.toUpperCase())
  }
}

function environmentMatches(
  preferred: string,
  facility: FacilityMatchingInput,
): boolean {
  const geo = classifyGeoEnvironment({
    lat: facility.latitude ?? null,
    lng: facility.longitude ?? null,
    state: facility.state ?? null,
    city: facility.city ?? null,
  })

  const identityEnvironment = facility.identityEnvironment ?? []
  const identityRegion = facility.identityRegion ?? []

  switch (preferred) {
    case "west_coast":
      return identityRegion.includes("WEST_COAST") || geo.region === "west_coast"

    case "east_coast":
      return identityRegion.includes("EAST_COAST") || geo.region === "east_coast"

    case "desert":
      return identityEnvironment.includes("DESERT") || geo.environment === "desert"

    case "mountains":
      return identityEnvironment.includes("MOUNTAIN") || geo.environment === "mountain"

    case "coastal":
      return identityEnvironment.includes("COASTAL") || geo.environment === "coastal"

    case "island":
      return identityEnvironment.includes("ISLAND") || geo.environment === "island"

    case "urban_city":
      return geo.environment === "urban_city"

    case "rural_quiet":
      return geo.environment === "rural_quiet"

    case "home_like":
      return identityEnvironment.includes("HOME_LIKE")

    case "luxury":
      return identityEnvironment.includes("LUXURY")

    case "nature":
      return identityEnvironment.includes("NATURE")

    default:
      return false
  }
}

export function buildPills(
  patient: PatientMatchingInput,
  facility: FacilityMatchingInput,
): MatchPill[] {
  const pills: MatchPill[] = []

  const preferredEnvironment = normalizePreferredEnvironment(
    patient.lifeFitProfile?.preferences?.preferredEnvironment,
  )

  if (patient.needsDetox) {
    pills.push({
      key: "detox",
      label: "Detox",
      status: facility.detectedLevelsOfCare.includes("detox") ? "met" : "missing",
      isPatientDriven: true,
      negativeAllowedOnFirstRender: true,
    })
  }

  if (patient.requiresMAT) {
    pills.push({
      key: "mat",
      label: "MAT",
      status: facility.hasMATSignal ? "met" : "missing",
      isPatientDriven: true,
      negativeAllowedOnFirstRender: true,
    })
  }

  if (patient.prefersDualDiagnosis) {
    pills.push({
      key: "dual_diagnosis",
      label: "Dual diagnosis",
      status: facility.hasDualDiagnosisSignal ? "met" : "missing",
      isPatientDriven: true,
      negativeAllowedOnFirstRender: true,
    })
  }

  if (patient.wantsFamilyProgram || patient.lifeFitProfile?.signals.familyProgramDesired) {
    pills.push({
      key: "family_program",
      label: "Family support",
      status: facility.hasFamilyProgramSignal ? "met" : "missing",
      isPatientDriven: true,
      negativeAllowedOnFirstRender: true,
    })
  }

  if (
    patient.wantsProfessionalProgram ||
    patient.lifeFitProfile?.signals.professionalTrackDesired
  ) {
    pills.push({
      key: "professional_program",
      label: "Professional program",
      status: facility.hasProfessionalProgramSignal ? "met" : "missing",
      isPatientDriven: true,
      negativeAllowedOnFirstRender: true,
    })
  }

  if (preferredEnvironment) {
    pills.push({
      key: "environment",
      label: formatEnvironmentLabel(preferredEnvironment),
      status: environmentMatches(preferredEnvironment, facility) ? "met" : "missing",
      isPatientDriven: true,
      negativeAllowedOnFirstRender: true,
    })
  }

  if (patient.closeToHomeRequested) {
    pills.push({
      key: "close_to_home",
      label: "Close to home",
      status: "met",
      isPatientDriven: true,
      negativeAllowedOnFirstRender: true,
    })
  }

  return pills
}
