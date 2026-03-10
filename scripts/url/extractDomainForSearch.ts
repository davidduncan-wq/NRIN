import { normalizeFacilityUrl } from "./normalizeFacilityUrls"

export function extractDomainForSearch(input: string): string | null {
    const normalized = normalizeFacilityUrl(input)
    if (!normalized) return null

    const domain = normalized
        .replace("https://", "")
        .replace("http://", "")

    return domain
}
