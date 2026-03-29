export type PatientAcuitySnapshot = {
    withdrawalSeverity: 0 | 1 | 2 | 3 | 4 | null
    psychiatricSeverity: 0 | 1 | 2 | 3 | 4 | null
    biomedicalSeverity: 0 | 1 | 2 | 3 | 4 | null
    urgentWithdrawalNeed: boolean
    urgentPsychNeed: boolean
    urgentMedicalNeed: boolean
    overallAcuityBand: "low" | "moderate" | "high" | "critical" | null
    rationale: string[]
}

export function buildPatientAcuitySnapshot() {
    return null as PatientAcuitySnapshot | null
}
