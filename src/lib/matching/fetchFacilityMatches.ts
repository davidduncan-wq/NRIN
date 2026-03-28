import { supabase } from "@/lib/supabaseClient"
import type {
    FacilityMatchingInput,
    InsuranceCarrier,
    LevelOfCare,
} from "./types"

type FacilityIntelligenceRow = {
    facility_site_id: string
    offers_detox: boolean | null
    offers_residential: boolean | null
    offers_php: boolean | null
    offers_iop: boolean | null
    offers_outpatient: boolean | null
    offers_aftercare: boolean | null
    dual_diagnosis_support: boolean | null
    mat_supported: boolean | null
    family_therapy_program: boolean | null
    professional_program: boolean | null
    accepted_insurance_providers_detected: string[] | null
    matcher_summary: string | null
    detected_program_types: any[] | null
    detected_insurance_carriers: any[] | null
    confidence_score: number | null
    facility_sites:
        | {
              id: string
              name: string | null
              website: string | null
              city: string | null
              state: string | null
              latitude: number | null
              longitude: number | null
          }
        | {
              id: string
              name: string | null
              website: string | null
              city: string | null
              state: string | null
              latitude: number | null
              longitude: number | null
          }[]
        | null
}

function mapRowToFacility(
    row: FacilityIntelligenceRow,
): FacilityMatchingInput | null {
    if (!row.facility_site_id) return null

    const facilitySite = Array.isArray(row.facility_sites)
        ? row.facility_sites[0] ?? null
        : row.facility_sites ?? null

    const detectedLevelsOfCare: LevelOfCare[] = []

    if (row.offers_detox) detectedLevelsOfCare.push("detox")
    if (row.offers_residential) detectedLevelsOfCare.push("residential")
    if (row.offers_php) detectedLevelsOfCare.push("php")
    if (row.offers_iop) detectedLevelsOfCare.push("iop")
    if (row.offers_outpatient) detectedLevelsOfCare.push("outpatient")
    if (row.offers_aftercare) detectedLevelsOfCare.push("aftercare")

    const acceptedInsurance: InsuranceCarrier[] =
        ((row.accepted_insurance_providers_detected ?? []).map((value) =>
            value.toLowerCase(),
        ) as InsuranceCarrier[])

    return {
        facilityId: row.facility_site_id,
        facilityName:
            facilitySite?.name?.trim() ||
            row.matcher_summary ||
            "Unknown Facility",
        website: facilitySite?.website ?? undefined,
        city: facilitySite?.city ?? undefined,
        state: facilitySite?.state ?? undefined,
        latitude: facilitySite?.latitude ?? undefined,
        longitude: facilitySite?.longitude ?? undefined,
        matcherSummary: row.matcher_summary ?? undefined,
        
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

export async function fetchFacilityMatchingInputs(options?: {
    insuranceCarrier?: InsuranceCarrier
}): Promise<FacilityMatchingInput[]> {
    const pageSize = 250
    let from = 0
    let allRows: FacilityIntelligenceRow[] = []

    while (true) {
        const to = from + pageSize - 1

        let query = supabase
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
          confidence_score,
          facility_sites:facility_site_id (
            id,
            name,
            website,
            city,
            state,
            latitude,
            longitude
          )
        `)

        if (
            options?.insuranceCarrier &&
            options.insuranceCarrier !== "self_pay" &&
            options.insuranceCarrier !== "unknown"
        ) {
            query = query.contains(
                "accepted_insurance_providers_detected",
                [options.insuranceCarrier],
            )
        }

        const { data, error } = await query.range(from, to)

        if (error) {
            console.error("Error fetching facility_intelligence:", error)
            return []
        }

        const batch = (data ?? []) as FacilityIntelligenceRow[]
        allRows = allRows.concat(batch)

        if (batch.length < pageSize) break

        from += pageSize
    }

    const mapped = allRows
        .map((row) => mapRowToFacility(row))
        .filter((row): row is FacilityMatchingInput => Boolean(row))

    console.log("FACILITY COUNT:", mapped.length)

    return mapped
}
