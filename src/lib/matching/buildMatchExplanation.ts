import type {
    FacilityMatchingInput,
    InsuranceScoreBreakdown,
    MatchExplanation,
    MatchReasonEvidence,
    PatientMatchingInput,
    ProgramScoreBreakdown,
    SpecialtyScoreBreakdown,
} from "./types"
import { classifyGeoEnvironment } from "@/lib/geo/classifyGeoEnvironment"

function formatLevelOfCare(level: string) {
    switch (level) {
        case "php":
            return "PHP"
        case "iop":
            return "IOP"
        default:
            return level.charAt(0).toUpperCase() + level.slice(1)
    }
}

function formatInsuranceCarrier(carrier: string) {
    switch (carrier) {
        case "blue_cross_blue_shield":
            return "Blue Cross Blue Shield"
        case "united_healthcare":
            return "United Healthcare"
        case "self_pay":
            return "Self-pay"
        default:
            return carrier
                .split("_")
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(" ")
    }
}

function getProgramEvidence(
    facility: FacilityMatchingInput,
    normalizedName: string,
) {
    const match = facility.rawProgramEvidence?.find(
        (item: any) => item.normalizedName === normalizedName,
    )

    return match?.evidence?.[0]
}

function normalizePreferredEnvironment(value?: string | null): string | null {
    if (!value) return null
    return value.trim().toLowerCase()
}

function formatPreferredEnvironment(value: string): string {
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
            return value.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
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

export function buildMatchExplanation(
    patient: PatientMatchingInput,
    facility: FacilityMatchingInput,
    programs: ProgramScoreBreakdown,
    insurance: InsuranceScoreBreakdown,
    specialties: SpecialtyScoreBreakdown,
): MatchExplanation {
    const reasons: MatchReasonEvidence[] = []
    const cautions: string[] = []

    const lifeFit = patient.lifeFitProfile

    const wantsProfessionalProgram =
        patient.wantsProfessionalProgram ||
        lifeFit?.signals.professionalTrackDesired === true

    const wantsFamilyProgram =
        patient.wantsFamilyProgram ||
        lifeFit?.signals.familyProgramDesired === true

    const matchedLevels = patient.desiredLevelsOfCare.filter((level) =>
        facility.detectedLevelsOfCare.includes(level),
    )

    const primaryLevel = patient.desiredLevelsOfCare[0]

    if (primaryLevel && facility.detectedLevelsOfCare.includes(primaryLevel)) {
        reasons.push({
            label: "Matches your primary level of care",
            snippet: `Includes: ${formatLevelOfCare(primaryLevel)}`,
            sourceUrl: "#levels-of-care",
            sourceLabel: "Levels of care",
        })
    } else if (programs.levelMatches > 0) {
        reasons.push({
            label: "Partial level-of-care alignment",
            snippet:
                matchedLevels.length > 0
                    ? `Includes: ${matchedLevels.map(formatLevelOfCare).join(", ")}`
                    : undefined,
            sourceUrl: "#levels-of-care",
            sourceLabel: "Levels of care",
        })
    }

    if (patient.needsDetox && facility.detectedLevelsOfCare.includes("detox")) {
        const firstEvidence = getProgramEvidence(facility, "detox")

        reasons.push({
            label: "Offers detox support",
            snippet:
                firstEvidence?.snippet ??
                "Detox level of care detected in facility profile",
            sourceUrl: firstEvidence?.pageUrl,
            sourceLabel: "Detox support",
        })
    }

    if (patient.prefersDualDiagnosis && facility.hasDualDiagnosisSignal) {
        reasons.push({
            label: "Dual-diagnosis support available",
            snippet: "Support for co-occurring mental health and substance use needs is available.",
            sourceUrl: "#dual-diagnosis",
            sourceLabel: "Dual-diagnosis support",
        })
    }

    if (insurance.insuranceMatch && patient.insuranceCarrier) {
        const carrier = patient.insuranceCarrier

        const insuranceEvidenceMatch = facility.rawInsuranceEvidence?.find(
            (item: any) => item.normalizedName === carrier,
        )

        const firstEvidence = insuranceEvidenceMatch?.evidence?.[0]

        reasons.push({
            label: `Accepts ${formatInsuranceCarrier(carrier)}`,
            snippet:
                firstEvidence?.snippet ??
                `${formatInsuranceCarrier(carrier)} is listed among accepted insurance providers.`,
            sourceUrl: firstEvidence?.pageUrl,
            sourceLabel: "Insurance details",
        })
    } else if (patient.fundingType === "insurance") {
        reasons.push({
            label: "Likely accepts private insurance",
            snippet:
                "This facility appears to work with major insurance providers, but your specific plan should be confirmed.",
            sourceUrl: "#insurance",
            sourceLabel: "Insurance details",
        })
    }

    if (patient.requiresMAT && facility.hasMATSignal) {
        const firstEvidence = getProgramEvidence(facility, "mat")

        reasons.push({
            label: "Medication-assisted treatment available",
            snippet:
                firstEvidence?.snippet ??
                "Medication-assisted treatment support is available.",
            sourceUrl: firstEvidence?.pageUrl,
            sourceLabel: "MAT support",
        })
    }

    if (wantsProfessionalProgram && facility.hasProfessionalProgramSignal) {
        reasons.push({
            label: "Professional program available",
            snippet:
                lifeFit?.signals.professionalTrackDesired
                    ? "This facility appears to support work, licensing, or professional recovery needs."
                    : "A professional-focused treatment track is available.",
            sourceUrl: "#professional-program",
            sourceLabel: "Professional program",
        })
    }

    const preferredEnvironment = normalizePreferredEnvironment(
        lifeFit?.preferences?.preferredEnvironment,
    )

    if (preferredEnvironment) {
        const environmentLabel = formatPreferredEnvironment(preferredEnvironment)

        if (environmentMatches(preferredEnvironment, facility)) {
            reasons.push({
                label: environmentLabel,
                snippet: `${environmentLabel} matches what you’re looking for.`,
                sourceUrl: "#life-fit",
                sourceLabel: "Life fit",
            })
        } else {
            cautions.push(`Not a ${environmentLabel.toLowerCase()}`)
        }
    }

    if (wantsFamilyProgram && facility.hasFamilyProgramSignal) {
        reasons.push({
            label: "Family support available",
            snippet:
                lifeFit?.signals.familyProgramDesired
                    ? "This facility appears to support family involvement and relationship-focused recovery goals."
                    : "Family programming and support services are available.",
            sourceUrl: "#family-program",
            sourceLabel: "Family program",
        })
    }

    // === NEGATIVE FIT SIGNALS (NRIN DOCTRINE) ===

    if (patient.needsDetox && !facility.detectedLevelsOfCare.includes("detox")) {
        cautions.push("Detox not available")
    }

    if (patient.requiresMAT && !facility.hasMATSignal) {
        cautions.push("Medication-assisted treatment (MAT) not available")
    }

    if (patient.prefersDualDiagnosis && !facility.hasDualDiagnosisSignal) {
        cautions.push("Dual-diagnosis support not available")
    }

    if (wantsFamilyProgram && !facility.hasFamilyProgramSignal) {
        cautions.push("Family support program not available")
    }

    if (wantsProfessionalProgram && !facility.hasProfessionalProgramSignal) {
        cautions.push("Professional program not available")
    }

    if (patient.insuranceCarrier && !insurance.insuranceMatch) {
        cautions.push(
            `Does not confirm acceptance of ${formatInsuranceCarrier(patient.insuranceCarrier)}`,
        )
    }

    return {
        reasons,
        cautions,
    }
}
