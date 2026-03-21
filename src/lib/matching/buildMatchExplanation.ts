import type {
    FacilityMatchingInput,
    InsuranceScoreBreakdown,
    MatchExplanation,
    MatchReasonEvidence,
    PatientMatchingInput,
    ProgramScoreBreakdown,
    SpecialtyScoreBreakdown,
} from "./types"

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

export function buildMatchExplanation(
    patient: PatientMatchingInput,
    facility: FacilityMatchingInput,
    programs: ProgramScoreBreakdown,
    insurance: InsuranceScoreBreakdown,
    specialties: SpecialtyScoreBreakdown,
): MatchExplanation {
    const reasons: MatchReasonEvidence[] = []
    const cautions: string[] = []

    const matchedLevels = patient.desiredLevelsOfCare.filter((level) =>
        facility.detectedLevelsOfCare.includes(level),
    )

    if (programs.levelMatches > 0) {
        reasons.push({
            label: "Aligned with your requested level of care",
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

    if (patient.wantsProfessionalProgram && facility.hasProfessionalProgramSignal) {
        reasons.push({
            label: "Professional program available",
            snippet: "A professional-focused treatment track is available.",
            sourceUrl: "#professional-program",
            sourceLabel: "Professional program",
        })
    }

    if (patient.wantsFamilyProgram && facility.hasFamilyProgramSignal) {
        reasons.push({
            label: "Family support available",
            snippet: "Family programming and support services are available.",
            sourceUrl: "#family-program",
            sourceLabel: "Family program",
        })
    }

    if (patient.prefersDualDiagnosis && !facility.hasDualDiagnosisSignal) {
        cautions.push("Dual-diagnosis support should be confirmed.")
    }

    if (patient.requiresMAT && !facility.hasMATSignal) {
        cautions.push("Medication-assisted treatment availability should be confirmed.")
    }

    if (patient.insuranceCarrier && !insurance.insuranceMatch) {
        cautions.push(
            `Insurance acceptance for ${formatInsuranceCarrier(patient.insuranceCarrier)} should be confirmed.`,
        )
    }

    return {
        reasons,
        cautions,
    }
}