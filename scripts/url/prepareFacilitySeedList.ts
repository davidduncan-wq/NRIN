import { normalizeFacilityUrl } from "./normalizeFacilityUrls"
import { buildGoogleQuery } from "./buildGoogleQuery"

type Facility = {
    name: string
    city?: string
    state?: string
    website?: string
}

export function prepareFacilitySeed(f: Facility) {
    const normalized = f.website
        ? normalizeFacilityUrl(f.website)
        : null

    const googleQuery = buildGoogleQuery(
        f.name,
        f.city,
        f.state
    )

    return {
        name: f.name,
        city: f.city,
        state: f.state,
        normalizedDomain: normalized,
        googleQuery
    }
}