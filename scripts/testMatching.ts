import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"
import { matchPatientToFacilities } from "../src/lib/matching/matchPatientToFacilities"
import type {
  FacilityMatchingInput,
  InsuranceCarrier,
  LevelOfCare,
  PatientMatchingInput,
} from "../src/lib/matching/types"

type FacilityIntelligenceRow = {
  facility_id: string | null
  facility_name: string | null
  state: string | null
  primary_state: string | null
  levels_of_care: string[] | null
  detected_levels_of_care: string[] | null
  accepted_insurance: string[] | null
  insurance_accepted: string[] | null
  has_dual_diagnosis: boolean | null
  dual_diagnosis_supported: boolean | null
  has_mat: boolean | null
  mat_supported: boolean | null
  has_professional_program: boolean | null
  professional_program: boolean | null
  has_family_program: boolean | null
  family_program: boolean | null
  evidence_confidence: number | null
  confidence_score: number | null
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const patient: PatientMatchingInput = {
  needsDetox: true,
  desiredLevelsOfCare: ["detox", "residential"],
  prefersDualDiagnosis: true,
  requiresMAT: true,
  insuranceCarrier: "blue_cross_blue_shield",
  wantsProfessionalProgram: false,
  wantsFamilyProgram: true,
}

const VALID_LEVELS: LevelOfCare[] = [
  "detox",
  "residential",
  "php",
  "iop",
  "outpatient",
  "aftercare",
]

const VALID_INSURANCE: InsuranceCarrier[] = [
  "aetna",
  "cigna",
  "blue_cross_blue_shield",
  "united_healthcare",
  "humana",
  "anthem",
  "ambetter",
  "molina",
  "beacon",
  "tricare",
  "medicare",
  "medicaid",
  "self_pay",
  "unknown",
]

function normalizeLevel(value: string): LevelOfCare | null {
  const v = value.trim().toLowerCase()
  if (v === "partial hospitalization" || v === "partial hospitalization program") return "php"
  if (v === "intensive outpatient" || v === "intensive outpatient program") return "iop"
  if (VALID_LEVELS.includes(v as LevelOfCare)) return v as LevelOfCare
  return null
}

function normalizeInsurance(value: string): InsuranceCarrier | null {
  const v = value.trim().toLowerCase()
  if (v.includes("blue cross") || v.includes("bcbs")) return "blue_cross_blue_shield"
  if (v.includes("united")) return "united_healthcare"
  if (v.includes("self")) return "self_pay"
  if (VALID_INSURANCE.includes(v as InsuranceCarrier)) return v as InsuranceCarrier
  return null
}

function mapRowToFacility(row: any): FacilityMatchingInput | null {
  if (!row.facility_site_id) return null
  const programEvidence = row.detected_program_types ?? []
  const insuranceEvidence = row.detected_insurance_carriers ?? []

  // --- LEVELS ---
  const detectedLevelsOfCare: LevelOfCare[] = []


  if (row.offers_detox) detectedLevelsOfCare.push("detox")
  if (row.offers_residential) detectedLevelsOfCare.push("residential")
  if (row.offers_php) detectedLevelsOfCare.push("php")
  if (row.offers_iop) detectedLevelsOfCare.push("iop")
  if (row.offers_outpatient) detectedLevelsOfCare.push("outpatient")
  if (row.offers_aftercare) detectedLevelsOfCare.push("aftercare")

  // --- INSURANCE ---
  const acceptedInsurance: InsuranceCarrier[] =
    (row.accepted_insurance_providers_detected ?? []).map((v: string) =>
      v.toLowerCase(),
    ) as InsuranceCarrier[]

  return {
    facilityId: row.facility_site_id,
    facilityName: row.matcher_summary ?? "Unknown Facility",

    state: undefined, // not in this row

    detectedLevelsOfCare,

    hasDualDiagnosisSignal: row.dual_diagnosis_support ?? false,
    hasMATSignal: row.mat_supported ?? false,
    hasProfessionalProgramSignal: row.professional_program ?? false,
    hasFamilyProgramSignal: row.family_therapy_program ?? false,

    acceptedInsurance,
    evidenceConfidence: row.confidence_score ?? 0,
    rawProgramEvidence: row.detected_program_types ?? [],
    rawInsuranceEvidence: row.detected_insurance_carriers ?? [],
  }
}

async function main() {
  const { data, error } = await supabase
    .from("facility_intelligence")
    .select(`
  facility_site_id,
  offers_detox,
  offers_residential,
  offers_php,
  offers_iop,
  offers_outpatient,
  offers_aftercare,
  dual_diagnosis_support,
  mat_supported,
  family_therapy_program,
  professional_program,
  accepted_insurance_providers_detected,
  matcher_summary,
  detected_program_types,
  detected_insurance_carriers,
  confidence_score
`)
    .limit(100)

  if (error) {
    console.error("facility_intelligence fetch error:", error)
    process.exit(1)
  }

  const facilities = (data ?? [])
    .map((row) => mapRowToFacility(row))
    .filter((row): row is FacilityMatchingInput => Boolean(row))

  const result = matchPatientToFacilities(patient, facilities)

  console.log("patient:", JSON.stringify(patient, null, 2))
  console.log("facility_rows_fetched:", (data ?? []).length)
  console.log("facility_rows_mapped:", facilities.length)
  console.log("matches_found:", result.matches.length)

  console.log(
    "top_matches:",
    JSON.stringify(
      result.matches.slice(0, 10).map((match) => ({
        facilityId: match.facilityId,
        facilityName: match.facilityName,
        totalScore: match.totalScore,
        hardFilterReasons: match.hardFilterReasons,
        reasons: match.explanation.reasons,
        cautions: match.explanation.cautions,
      })),
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})