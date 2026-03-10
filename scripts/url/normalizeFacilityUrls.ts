import { URL } from "url"

export function normalizeFacilityUrl(input: string): string | null {
    if (!input) return null

    let url = input.trim()

    if (!url.startsWith("http")) {
        url = "https://" + url
    }

    try {
        const parsed = new URL(url)

        let hostname = parsed.hostname.toLowerCase()

        if (hostname.startsWith("www.")) {
            hostname = hostname.slice(4)
        }

        return `https://${hostname}`
    } catch {
        return null
    }
}