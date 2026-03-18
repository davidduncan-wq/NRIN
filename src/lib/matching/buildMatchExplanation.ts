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
        reasons.push({
            label: "Offers detox support",
            snippet: "Detox level of care detected in facility profile",
            sourceUrl: "#detox",
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
        reasons.push({
            label: `Detected acceptance of ${patient.insuranceCarrier}`,
            snippet: `${patient.insuranceCarrier} listed among accepted insurance providers`,
            sourceUrl: "#insurance",
            sourceLabel: "Insurance details",
        })
    }

    if (patient.requiresMAT && facility.hasMATSignal) {
        reasons.push({
            label: "Shows medication-assisted treatment support",
            snippet: "MAT support signal detected in facility profile",
            sourceUrl: "#mat",
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
        cautions.push(`Insurance compatibility with ${patient.insuranceCarrier} should be verified`)
    }

    return {
        reasons,
        cautions,
    }
}