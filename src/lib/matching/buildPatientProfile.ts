import type { FormState } from "@/app/patient/page"
import { buildLifeFitProfile } from "./buildLifeFitProfile"
import type {
  FundingType,
  InsuranceCarrier,
  LevelOfCare,
  PatientMatchingInput,
} from "./types"

type Recommendation = {
  withdrawalRisk: string
  relapseRisk: string
  mentalHealthSignal: string
  supportLevel: string
  recommendedProgramType: string
}

function parseBoolean(value: string | string[] | undefined, fallback: boolean) {
  if (typeof value !== "string") return fallback
  return value === "1"
}

function parseLevels(value: string | string[] | undefined, fallback: LevelOfCare[]) {
  if (typeof value !== "string" || value.trim() === "") return fallback
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean) as LevelOfCare[]
}

function parseInsuranceCarrier(
  value: string | string[] | undefined,
): InsuranceCarrier | undefined {
  return typeof value === "string" ? (value as InsuranceCarrier) : undefined
}

function deriveInsuranceCarrierFromNotes(notes: string): InsuranceCarrier | undefined {
  if (notes.includes("aetna")) return "aetna"
  if (notes.includes("cigna")) return "cigna"
  if (notes.includes("blue cross") || notes.includes("bcbs")) return "blue_cross_blue_shield"
  if (notes.includes("united")) return "united_healthcare"
  if (notes.includes("humana")) return "humana"
  if (notes.includes("anthem")) return "anthem"
  if (notes.includes("ambetter")) return "ambetter"
  if (notes.includes("molina")) return "molina"
  if (notes.includes("beacon")) return "beacon"
  if (notes.includes("tricare")) return "tricare"
  if (notes.includes("medicare")) return "medicare"
  if (notes.includes("medicaid")) return "medicaid"
  return undefined
}

function deriveFundingTypeFromForm(form: FormState): FundingType {
  if (form.insuranceStatus === "yes") return "insurance"
  if (form.insuranceStatus === "no" && form.selfPayIntent === "yes") return "self_pay"
  return "indigent"
}

function deriveFundingTypeFromSearchParams(
  searchParams?: Record<string, string | string[] | undefined>,
): FundingType | undefined {
  if (!searchParams) return undefined

  if (typeof searchParams.fundingType === "string") {
    return searchParams.fundingType as FundingType
  }

  if (typeof searchParams.insuranceCarrier === "string") {
    return searchParams.insuranceCarrier === "self_pay" ? "self_pay" : "insurance"
  }

  return undefined
}

export function deriveDesiredLevelsOfCare(result: Recommendation): LevelOfCare[] {
  const text = result.recommendedProgramType.toLowerCase()
  const levels: LevelOfCare[] = []

  if (text.includes("detox")) levels.push("detox")
  if (text.includes("residential")) levels.push("residential")
  if (text.includes("php")) levels.push("php")
  if (text.includes("iop")) levels.push("iop")
  if (text.includes("outpatient")) levels.push("outpatient")
  if (text.includes("aftercare")) levels.push("aftercare")

  if (levels.length === 0) {
    levels.push("residential")
  }

  return levels
}

export function buildPatientMatchingInput(
  form: FormState,
  result: Recommendation,
): PatientMatchingInput {
  const notes = [
    form.workDailyLifeNotes,
    form.familyRelationshipNotes,
    form.locationEnvironmentNotes,
    form.treatmentGoalsNotes,
    form.additionalContextNotes,
  ]
    .join(" ")
    .toLowerCase()

  const lifeFitProfile = buildLifeFitProfile(form)
  const substances = form.substances.map((value) => value.toLowerCase())

  const requiresMAT =
    substances.some((value) =>
      ["fentanyl", "opioids", "opioid", "heroin"].includes(value),
    ) ||
    notes.includes("mat") ||
    notes.includes("medication-assisted treatment") ||
    notes.includes("medication assisted treatment") ||
    notes.includes("suboxone") ||
    notes.includes("methadone") ||
    notes.includes("vivitrol")

  const wantsFamilyProgram =
    lifeFitProfile.signals.familyProgramDesired ??
    (
      notes.includes("family") ||
      notes.includes("children") ||
      notes.includes("kids") ||
      notes.includes("wife") ||
      notes.includes("husband") ||
      notes.includes("divorce")
    )

  const wantsProfessionalProgram =
    lifeFitProfile.signals.professionalTrackDesired ??
    (
      notes.includes("career") ||
      notes.includes("job") ||
      notes.includes("work") ||
      notes.includes("pilot") ||
      notes.includes("doctor") ||
      notes.includes("nurse") ||
      notes.includes("attorney") ||
      notes.includes("executive") ||
      notes.includes("monitoring")
    )

  const prefersDualDiagnosis =
    result.mentalHealthSignal.toLowerCase() !== "none" &&
    result.mentalHealthSignal.toLowerCase() !== "low"

  const noteCarrier = deriveInsuranceCarrierFromNotes(notes)

  const insuranceCarrier = form.insuranceCarrier?.toLowerCase() ||
    form.insuranceStatus === "yes"
      ? noteCarrier ??
        (form.insuranceType === "medicaid"
          ? "medicaid"
          : form.insuranceType === "medicare"
            ? "medicare"
            : form.insuranceType === "va"
              ? "tricare"
              : undefined)
      : form.insuranceStatus === "no" && form.selfPayIntent === "yes"
        ? "self_pay"
        : undefined

  const fundingType = deriveFundingTypeFromForm(form)
  const desiredLevelsOfCare = deriveDesiredLevelsOfCare(result)

  return {
    needsDetox: desiredLevelsOfCare.includes("detox"),
    desiredLevelsOfCare,
    prefersDualDiagnosis,
    requiresMAT,
    insuranceCarrier,
    fundingType,
    closeToHomeRequested: form.environmentPreference === "close_to_home",
    wantsProfessionalProgram,
    wantsFamilyProgram,
    city: form.city || undefined,
    state: form.state || undefined,
    latitude: form.addressLatitude || undefined,
    longitude: form.addressLongitude || undefined,
    lifeFitProfile,
  }
}

export function buildPatientFromSearchParams(
  searchParams?: Record<string, string | string[] | undefined>,
): PatientMatchingInput {
  if (!searchParams) {
    return {
      needsDetox: false,
      desiredLevelsOfCare: ["iop"],
      prefersDualDiagnosis: false,
      requiresMAT: false,
      wantsProfessionalProgram: false,
      wantsFamilyProgram: false,
    }
  }

  const desiredLevelsOfCare = parseLevels(
    searchParams.desiredLevelsOfCare,
    ["iop"],
  )

  const refineLevels = parseLevels(
    searchParams.refineLevels,
    desiredLevelsOfCare,
  )

  const refineGeo =
    typeof searchParams.refineGeo === "string"
      ? searchParams.refineGeo
      : undefined

  const environmentPreference =
    typeof searchParams.environmentPreference === "string" &&
    searchParams.environmentPreference.trim() !== ""
      ? searchParams.environmentPreference
      : undefined

  const insuranceCarrier =
    typeof searchParams.insuranceCarrier === "string" &&
    searchParams.insuranceCarrier.trim() !== ""
      ? parseInsuranceCarrier(searchParams.insuranceCarrier)
      : undefined

  const city =
    typeof searchParams.city === "string" && searchParams.city.trim() !== ""
      ? searchParams.city
      : undefined

  const state =
    typeof searchParams.state === "string" && searchParams.state.trim() !== ""
      ? searchParams.state
      : undefined

  const latitude =
    typeof searchParams.latitude === "string"
      ? Number(searchParams.latitude)
      : undefined

  const longitude =
    typeof searchParams.longitude === "string"
      ? Number(searchParams.longitude)
      : undefined

  const closeToHome = refineGeo === "close"

  return {
    needsDetox: refineLevels.includes("detox"),
    desiredLevelsOfCare: refineLevels,
    prefersDualDiagnosis: parseBoolean(searchParams.prefersDualDiagnosis, false),
    requiresMAT: parseBoolean(
      searchParams.refineMAT,
      parseBoolean(searchParams.requiresMAT, false),
    ),
    insuranceCarrier,
    fundingType: deriveFundingTypeFromSearchParams(searchParams),
    closeToHomeRequested: closeToHome,
    wantsProfessionalProgram: parseBoolean(
      searchParams.refineProfessional,
      parseBoolean(searchParams.wantsProfessionalProgram, false),
    ),
    wantsFamilyProgram: parseBoolean(
      searchParams.refineFamily,
      parseBoolean(searchParams.wantsFamilyProgram, false),
    ),
    city: closeToHome ? city : undefined,
    state: closeToHome ? state : undefined,
    latitude: closeToHome ? latitude : undefined,
    longitude: closeToHome ? longitude : undefined,
    lifeFitProfile:
      environmentPreference || refineGeo === "close"
        ? {
            captureMode: "full",
            constraints: {
              ...(refineGeo === "close"
                ? { needsToStayNearFamily: true }
                : {}),
            },
            preferences: {
              ...(environmentPreference
                ? { preferredEnvironment: environmentPreference }
                : {}),
            },
            signals: {},
            narrativeSummary: "",
          }
        : undefined,
  }
}
