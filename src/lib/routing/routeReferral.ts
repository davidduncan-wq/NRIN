type ReferralInput = {
  acuity_level?: string | null
  patient_state?: string | null
}

type FacilitySite = {
  id: string
  name: string
  state?: string | null
  accepts_high_acuity?: boolean | null
}

export function routeReferral(
  referral: ReferralInput,
  sites: FacilitySite[]
) {
  if (!sites || sites.length === 0) {
    return null
  }

  // Example rule 1 — high acuity centers
  if (referral.acuity_level === "high") {
    const highAcuitySite = sites.find(
      s => s.accepts_high_acuity === true
    )

    if (highAcuitySite) {
      return {
        facility_site_id: highAcuitySite.id,
        reason: "High acuity routing rule"
      }
    }
  }

  // Example rule 2 — same state
  if (referral.patient_state) {
    const stateMatch = sites.find(
      s => s.state === referral.patient_state
    )

    if (stateMatch) {
      return {
        facility_site_id: stateMatch.id,
        reason: "State match routing rule"
      }
    }
  }

  // fallback
  return {
    facility_site_id: sites[0].id,
    reason: "Fallback routing rule"
  }
}