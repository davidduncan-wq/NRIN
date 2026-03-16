import { URL } from "url"

export function normalizeFacilityUrl(input: string): string | null {
    if (!input) return null

    let url = input.trim()

    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url
    }

    try {
        const parsed = new URL(url)

        let hostname = parsed.hostname.toLowerCase()

        if (hostname.startsWith("www.")) {
            hostname = hostname.slice(4)
        }

        if (hostname.startsWith("vaww.")) {
            return null
        }

        const pathname = normalizePath(parsed.pathname)

        if (!pathname || pathname === "/") {
            return `https://${hostname}`
        }

        return `https://${hostname}${pathname}`
    } catch {
        return null
    }
}

function normalizePath(pathname: string): string | null {
    if (!pathname || pathname === "/") return "/"

    let path = pathname.trim()

    if (!path.startsWith("/")) {
        path = `/${path}`
    }

    path = path.replace(/\/{2,}/g, "/")

    if (path.length > 1 && path.endsWith("/")) {
        path = path.slice(0, -1)
    }

    const lower = path.toLowerCase()

    if (
        lower.endsWith(".jpg") ||
        lower.endsWith(".jpeg") ||
        lower.endsWith(".png") ||
        lower.endsWith(".gif") ||
        lower.endsWith(".svg") ||
        lower.endsWith(".webp") ||
        lower.endsWith(".pdf") ||
        lower.endsWith(".zip")
    ) {
        return null
    }

    return path
}