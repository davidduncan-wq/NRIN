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
            label: `Matches ${programs.levelMatches} of ${programs.levelRequested} requested levels of care`,
            snippet:
                matchedLevels.length > 0
                    ? `Matched levels: ${matchedLevels.map(formatLevelOfCare).join(", ")}`
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
            label: "Shows dual-diagnosis support",
            snippet: "Dual-diagnosis support signal detected in facility profile",
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
            label: `Detected acceptance of ${carrier}`,
            snippet:
                firstEvidence?.snippet ??
                `${carrier} listed among accepted insurance providers`,
            sourceUrl: firstEvidence?.pageUrl,
            sourceLabel: "Insurance details",
        })
    }

    if (patient.requiresMAT && facility.hasMATSignal) {
        const firstEvidence = getProgramEvidence(facility, "mat")

        reasons.push({
            label: "Shows medication-assisted treatment support",
            snippet:
                firstEvidence?.snippet ??
                "MAT support signal detected in facility profile",
            sourceUrl: firstEvidence?.pageUrl,
            sourceLabel: "MAT support",
        })
    }

    if (patient.wantsProfessionalProgram && facility.hasProfessionalProgramSignal) {
        reasons.push({
            label: "Shows professional-track programming",
            snippet: "Professional program signal detected in facility profile",
            sourceUrl: "#professional-program",
            sourceLabel: "Professional program",
        })
    }

    if (patient.wantsFamilyProgram && facility.hasFamilyProgramSignal) {
        reasons.push({
            label: "Shows family-program support",
            snippet: "Family program signal detected in facility profile",
            sourceUrl: "#family-program",
            sourceLabel: "Family program",
        })
    }

    if (patient.prefersDualDiagnosis && !facility.hasDualDiagnosisSignal) {
        cautions.push("No strong dual-diagnosis signal detected")
    }

    if (patient.requiresMAT && !facility.hasMATSignal) {
        cautions.push("No strong MAT signal detected")
    }

    if (patient.insuranceCarrier && !insurance.insuranceMatch) {
        cautions.push(
            `Insurance compatibility with ${patient.insuranceCarrier} should be verified`,
        )
    }

    return {
        reasons,
        cautions,
    }
}