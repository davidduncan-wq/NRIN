import { supabase } from "@/lib/supabaseClient"
import type {
    FacilityMatchingInput,
    InsuranceCarrier,
    LevelOfCare,
} from "./types"

type FacilityIdentitySignalRow = {
    facility_site_id: string
    tag: string
    family: "environment" | "activities" | "atmosphere" | "special_tracks"
}

type FacilityIdentityBuckets = {
    environment: string[]
    atmosphere: string[]
    activities: string[]
    special_tracks: string[]
    region: string[]
}
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
    accepts_private_insurance_detected: boolean | null
    accepts_private_insurance_resolved: boolean | null
    accepted_private_insurance_carriers_resolved: string[] | null
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
    facility_classification:
        | {
              supports_tricare_path: boolean | null
          }
        | {
              supports_tricare_path: boolean | null
          }[]
        | null
}


function normalizeWebsiteKey(website?: string) {
    const value = (website ?? "").trim().toLowerCase()
    if (!value) return ""

    try {
        const url = new URL(value.startsWith("http") ? value : `https://${value}`)
        return url.hostname.replace(/^www\./, "")
    } catch {
        return value
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .replace(/\/$/, "")
    }
}

function buildDedupeKey(facility: FacilityMatchingInput) {
    const websiteKey = normalizeWebsiteKey(facility.website)
    const cityKey = (facility.city ?? "").trim().toLowerCase()
    const stateKey = (facility.state ?? "").trim().toLowerCase()

    if (websiteKey) {
        return `${websiteKey}::${cityKey}::${stateKey}`
    }

    return `${(facility.facilityName ?? "").trim().toLowerCase()}::${cityKey}::${stateKey}`
}

function uniq(values: string[]) {
    return Array.from(new Set(values.filter(Boolean))).sort()
}

async function fetchIdentitySignalsForFacilityIds(
    facilityIds: string[],
): Promise<Record<string, FacilityIdentityBuckets>> {
    const out: Record<string, FacilityIdentityBuckets> = {}
    const uniqueIds = Array.from(new Set(facilityIds.filter(Boolean)))
    const batchSize = 200

    for (let start = 0; start < uniqueIds.length; start += batchSize) {
        const batch = uniqueIds.slice(start, start + batchSize)

        const { data, error } = await supabase
            .from("facility_identity_signals")
            .select("facility_site_id, tag, family")
            .in("facility_site_id", batch)

        if (error) {
            console.error("Error fetching facility_identity_signals:", error)
            return out
        }

        for (const row of (data ?? []) as FacilityIdentitySignalRow[]) {
            if (!row.facility_site_id) continue

            if (!out[row.facility_site_id]) {
                out[row.facility_site_id] = {
                    environment: [],
                    atmosphere: [],
                    activities: [],
                    special_tracks: [],
                    region: [],
                }
            }

            const bucket = out[row.facility_site_id]
            if (row.family === "environment") bucket.environment.push(row.tag)
            if (row.family === "atmosphere") bucket.atmosphere.push(row.tag)
            if (row.family === "activities") bucket.activities.push(row.tag)
            if (row.family === "special_tracks") bucket.special_tracks.push(row.tag)
        }
    }

    for (const facilityId of Object.keys(out)) {
        out[facilityId] = {
            environment: uniq(out[facilityId].environment),
            atmosphere: uniq(out[facilityId].atmosphere),
            activities: uniq(out[facilityId].activities),
            special_tracks: uniq(out[facilityId].special_tracks),
            region: uniq(out[facilityId].region),
        }
    }

    return out
}

function choosePreferredFacility(
    current: FacilityMatchingInput,
    challenger: FacilityMatchingInput,
) {
    const currentScore =
        (current.evidenceConfidence ?? 0) +
        current.detectedLevelsOfCare.length +
        (current.hasMATSignal ? 1 : 0) +
        (current.hasFamilyProgramSignal ? 1 : 0) +
        (current.hasDualDiagnosisSignal ? 1 : 0) +
        (current.acceptsPrivateInsurance ? 1 : 0)

    const challengerScore =
        (challenger.evidenceConfidence ?? 0) +
        challenger.detectedLevelsOfCare.length +
        (challenger.hasMATSignal ? 1 : 0) +
        (challenger.hasFamilyProgramSignal ? 1 : 0) +
        (challenger.hasDualDiagnosisSignal ? 1 : 0) +
        (challenger.acceptsPrivateInsurance ? 1 : 0)

    return challengerScore > currentScore ? challenger : current
}

function mapRowToFacility(
    row: FacilityIntelligenceRow,
): FacilityMatchingInput | null {
    if (!row.facility_site_id) return null

    const facilitySite = Array.isArray(row.facility_sites)
        ? row.facility_sites[0] ?? null
        : row.facility_sites ?? null

    if (!facilitySite?.id || !facilitySite?.name) return null

    const detectedLevelsOfCare: LevelOfCare[] = []

    if (row.offers_detox) detectedLevelsOfCare.push("detox")
    if (row.offers_residential) detectedLevelsOfCare.push("residential")
    if (row.offers_php) detectedLevelsOfCare.push("php")
    if (row.offers_iop) detectedLevelsOfCare.push("iop")
    if (row.offers_outpatient) detectedLevelsOfCare.push("outpatient")
    if (row.offers_aftercare) detectedLevelsOfCare.push("aftercare")

    const acceptedInsurance: InsuranceCarrier[] =
        row.accepted_private_insurance_carriers_resolved ??
        row.accepted_insurance_providers_detected ??
        row.detected_insurance_carriers ??
        []

    const classification = null

    return {
        facilityId: facilitySite.id,
        facilityName: facilitySite.name,
        website: facilitySite.website ?? undefined,
        city: facilitySite.city ?? undefined,
        state: facilitySite.state ?? undefined,
        latitude: facilitySite.latitude ?? undefined,
        longitude: facilitySite.longitude ?? undefined,
        matcherSummary: row.matcher_summary ?? undefined,

        detectedLevelsOfCare,
        hasDualDiagnosisSignal: row.dual_diagnosis_support ?? false,
        hasMATSignal: row.mat_supported ?? false,
        hasProfessionalProgramSignal: row.professional_program ?? false,
        hasFamilyProgramSignal: row.family_therapy_program ?? false,
        acceptedInsurance,
        acceptsPrivateInsurance:
            row.accepts_private_insurance_resolved ??
            row.accepts_private_insurance_detected ??
            false,
        supportsTricarePath: false,
        evidenceConfidence: row.confidence_score ?? 0,
        rawProgramEvidence: row.detected_program_types ?? [],
        rawInsuranceEvidence: row.detected_insurance_carriers ?? [],
    }
}

export async function fetchFacilityMatchingInputs(options?: {
    insuranceCarrier?: InsuranceCarrier
    insuranceType?: string
    selfPayOnly?: boolean
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
          accepts_private_insurance_detected,
          accepts_private_insurance_resolved,
          accepted_private_insurance_carriers_resolved,
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
            options.insuranceCarrier !== "unknown" &&
            options.insuranceCarrier !== "tricare"
        ) {
            query = query.contains(
                "accepted_insurance_providers_detected",
                [options.insuranceCarrier],
            )
        }

        if (options?.insuranceType === "private") {
            query = query.or("accepts_private_insurance_resolved.eq.true,accepts_private_insurance_detected.eq.true")
        }

        // selfPayOnly = true means UNLOCK insurance constraints (no DB filter)

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

    const dedupedMap = new Map<string, FacilityMatchingInput>()

    for (const facility of mapped) {
        const key = buildDedupeKey(facility)
        const existing = dedupedMap.get(key)

        if (!existing) {
            dedupedMap.set(key, facility)
            continue
        }

        dedupedMap.set(key, choosePreferredFacility(existing, facility))
    }

    const deduped = Array.from(dedupedMap.values())

    const classificationFiltered =
        options?.insuranceCarrier === "tricare"
            ? deduped.filter((f) => f.supportsTricarePath)
            : deduped

    const identityByFacilityId = await fetchIdentitySignalsForFacilityIds(
        classificationFiltered.map((f) => f.facilityId),
    )

    console.log("FACILITY COUNT:", classificationFiltered.length)
    console.log("FACILITY IDENTITY COUNT:", Object.keys(identityByFacilityId).length)

    return classificationFiltered.map((f) => {
        const identity = identityByFacilityId[f.facilityId] ?? {
            environment: [],
            atmosphere: [],
            activities: [],
            special_tracks: [],
            region: [],
        }

        return {
            ...f,
            hasProfessionalProgramSignal:
                f.hasProfessionalProgramSignal || identity.special_tracks.includes("PROFESSIONAL_TRACK"),
            hasFamilyProgramSignal:
                f.hasFamilyProgramSignal || identity.special_tracks.includes("FAMILY_SUPPORT"),
            identityEnvironment: identity.environment,
            identityAtmosphere: identity.atmosphere,
            identityActivities: identity.activities,
            identitySpecialTracks: identity.special_tracks,
            identityRegion: identity.region,
        }
    })
}
