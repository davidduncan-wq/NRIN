import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import fs from "node:fs"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const QUEUE_PATH = "tmp/google_repair_queue_final.csv"
const UNRESOLVED_OUTPUT_PATH = "tmp/google_repair_queue_unresolved_after_nosearch.csv"

type QueueRow = {
    id: string
    name: string
    input_domain: string
    status: string
    error: string
}

const STOP_WORDS = new Set([
    "the",
    "and",
    "of",
    "for",
    "at",
    "in",
    "on",
    "a",
    "an",
    "inc",
    "llc",
    "ltd",
    "center",
    "centre",
    "health",
    "services",
    "service",
    "group",
    "systems",
    "system",
    "company",
    "co",
])

const CHAIN_DOMAIN_HINTS: Array<{ pattern: RegExp; domain: string }> = [
    { pattern: /\bbanyan\b/i, domain: "banyantreatmentcenter.com" },
    { pattern: /\bbranches of\b/i, domain: "brentwoodhospital.com" },
    { pattern: /\bbhg\b/i, domain: "bhgrecovery.com" },
    { pattern: /\bfairbanks\b/i, domain: "fairbankscd.org" },
    { pattern: /\bserenity mass\b/i, domain: "summitbehavioralhealth.com" },
]

const BLOCKED_HOST_SNIPPETS = [
    "hugedomains",
    "mydentalpracticesite",
    "keurig",
]

function sleep(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function parseCsvLine(line: string): string[] {
    const out: string[] = []
    let cur = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
        const ch = line[i]

        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                cur += '"'
                i++
            } else {
                inQuotes = !inQuotes
            }
        } else if (ch === "," && !inQuotes) {
            out.push(cur)
            cur = ""
        } else {
            cur += ch
        }
    }

    out.push(cur)
    return out
}

function csvEscape(value: string): string {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`
    }
    return value
}

function loadQueue(): QueueRow[] {
    const raw = fs.readFileSync(QUEUE_PATH, "utf8").trim()
    if (!raw) return []

    const lines = raw.split(/\r?\n/)
    if (lines.length < 2) return []

    const headers = parseCsvLine(lines[0])

    return lines.slice(1).map((line): QueueRow => {
        const vals = parseCsvLine(line)
        const record: Record<string, string> = Object.fromEntries(
            headers.map((h, i) => [h, vals[i] ?? ""]),
        )

        return {
            id: record.id ?? "",
            name: record.name ?? "",
            input_domain: record.input_domain ?? "",
            status: record.status ?? "",
            error: record.error ?? "",
        }
    })
}

function writeUnresolved(rows: QueueRow[]) {
    const deduped = dedupeRows(rows)

    const header = ["id", "name", "input_domain", "status", "error"].join(",")
    const lines = deduped.map((row) =>
        [
            row.id,
            row.name,
            row.input_domain,
            row.status,
            row.error,
        ].map((v) => csvEscape(v ?? "")).join(","),
    )

    fs.writeFileSync(UNRESOLVED_OUTPUT_PATH, [header, ...lines].join("\n"))
}

function dedupeRows(rows: QueueRow[]): QueueRow[] {
    const seen = new Set<string>()
    const out: QueueRow[] = []

    for (const row of rows) {
        const key = [
            row.name.trim().toLowerCase(),
            row.input_domain.trim().toLowerCase(),
        ].join("|")

        if (seen.has(key)) continue
        seen.add(key)
        out.push(row)
    }

    return out
}

function cleanDomain(input: string): string | null {
    if (!input) return null

    let value = input.trim().toLowerCase()

    value = value.replace(/^https?:\/\//, "")
    value = value.replace(/^wwww\./, "www.")
    value = value.replace(/^www\./, "")
    value = value.split("/")[0] ?? value
    value = value.split("?")[0] ?? value
    value = value.split("#")[0] ?? value
    value = value.replace(/\s+/g, "")
    value = value.replace(/\.+$/, "")
    value = value.replace(/\.\.+/g, ".")

    if (!value) return null
    if (!value.includes(".")) return null
    if (/[^a-z0-9.-]/.test(value)) return null

    return value
}

function tokenizeName(name: string): string[] {
    return name
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .filter((token) => !STOP_WORDS.has(token))
}

function getHintedDomain(name: string): string | null {
    for (const hint of CHAIN_DOMAIN_HINTS) {
        if (hint.pattern.test(name)) return hint.domain
    }
    return null
}

function isBlockedHostname(hostname: string): boolean {
    const host = hostname.toLowerCase()
    return BLOCKED_HOST_SNIPPETS.some((snippet) => host.includes(snippet))
}

function hostnameLooksPlausible(hostname: string, facilityName: string): boolean {
    const host = hostname.toLowerCase().replace(/^www\./, "")
    const hostWithoutTld = host.split(".").slice(0, -1).join(".")
    const tokens = tokenizeName(facilityName)
    const joined = tokens.join("")
    const acronym = tokens.map((t) => t[0]).join("")

    if (!host.includes(".")) return false
    if (isBlockedHostname(host)) return false

    if (tokens.some((token) => token.length >= 5 && hostWithoutTld.includes(token))) {
        return true
    }

    if (joined.length >= 8) {
        const prefix = joined.slice(0, Math.min(joined.length, 12))
        if (hostWithoutTld.includes(prefix)) return true
    }

    if (acronym.length >= 4 && hostWithoutTld === acronym.toLowerCase()) {
        return false
    }

    return false
}

function buildCandidateDomains(name: string): string[] {
    const tokens = tokenizeName(name)
    if (!tokens.length) return []

    const joined = tokens.join("")
    const hyphen = tokens.join("-")
    const shortJoined = tokens.slice(0, 3).join("")
    const acronym = tokens.map((t) => t[0]).join("")

    const roots = new Set<string>()

    if (joined.length >= 6) roots.add(joined)
    if (hyphen.length >= 6) roots.add(hyphen)
    if (shortJoined.length >= 6) roots.add(shortJoined)
    if (acronym.length >= 4) roots.add(acronym)

    const tlds = [".org", ".com", ".net"]

    const out: string[] = []
    for (const root of roots) {
        for (const tld of tlds) {
            out.push(`${root}${tld}`)
        }
    }

    return out
}

async function probeUrl(url: string): Promise<URL | null> {
    try {
        const response = await fetch(url, {
            method: "GET",
            redirect: "follow",
            headers: {
                "user-agent": "Mozilla/5.0 NRIN domain repair bot",
            },
        })

        if (response.url) {
            const finalUrl = new URL(response.url)
            if (isBlockedHostname(finalUrl.hostname)) return null

            if (response.ok) return finalUrl

            if (
                response.status === 404 ||
                response.status === 500 ||
                response.status === 403
            ) {
                return finalUrl
            }
        }

        return null
    } catch {
        return null
    }
}

async function resolveByDomainProbe(inputDomain: string, facilityName: string): Promise<string | null> {
    const cleaned = cleanDomain(inputDomain)
    if (!cleaned) return null

    const attempts = [
        `https://${cleaned}`,
        `https://www.${cleaned}`,
        `http://${cleaned}`,
    ]

    for (const attempt of attempts) {
        const finalUrl = await probeUrl(attempt)
        if (!finalUrl) continue

        const hostname = finalUrl.hostname.toLowerCase()
        if (!hostnameLooksPlausible(hostname, facilityName)) continue

        return `${finalUrl.protocol}//${hostname}`
    }

    if (hostnameLooksPlausible(cleaned, facilityName)) {
        return `https://${cleaned}`
    }

    return null
}

async function resolveByNameHeuristic(name: string): Promise<string | null> {
    const candidates = buildCandidateDomains(name)

    for (const candidate of candidates) {
        const attempts = [
            `https://${candidate}`,
            `https://www.${candidate}`,
            `http://${candidate}`,
        ]

        for (const attempt of attempts) {
            const finalUrl = await probeUrl(attempt)
            if (!finalUrl) continue

            const hostname = finalUrl.hostname.toLowerCase()
            if (!hostnameLooksPlausible(hostname, name)) continue

            return `${finalUrl.protocol}//${hostname}`
        }
    }

    return null
}

async function run() {
    const rows = loadQueue()
    const unresolved: QueueRow[] = []

    console.log("rows needing resolution:", rows.length)

    for (const row of rows) {
        try {
            let website: string | null = null

            if (row.input_domain) {
                website = await resolveByDomainProbe(row.input_domain, row.name)
            }

            if (!website) {
                const hintedDomain = getHintedDomain(row.name)
                if (hintedDomain) {
                    website = await resolveByDomainProbe(hintedDomain, row.name)
                }
            }

            if (!website) {
                website = await resolveByNameHeuristic(row.name)
            }

            if (!website) {
                console.log("still unresolved:", row.name)
                unresolved.push(row)
                await sleep(500)
                continue
            }

            const { error: updateError } = await supabase
                .from("facility_sites")
                .update({ website })
                .eq("id", row.id)

            if (updateError) {
                console.error("update error:", row.name, updateError)
                unresolved.push(row)
            } else {
                console.log("resolved:", row.name, "=>", website)
            }
        } catch (error) {
            console.error("search error:", row.name, error)
            unresolved.push(row)
        }

        await sleep(500)
    }

    writeUnresolved(unresolved)
    console.log("no-search repair pass complete")
    console.log("remaining unresolved:", dedupeRows(unresolved).length)
    console.log("wrote:", UNRESOLVED_OUTPUT_PATH)
}

run().catch((error) => {
    console.error(error)
    process.exit(1)
})