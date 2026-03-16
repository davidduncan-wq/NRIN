import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import fs from "node:fs"
import { createClient } from "@supabase/supabase-js"
import { resolveFacilityDomain } from "./resolveFacilityDomain"
import { searchFacilityCandidates } from "./searchFacilityCandidates"

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const QUEUE_PATH = "tmp/google_repair_queue_final.csv"

type QueueRow = {
    id: string
    name: string
    input_domain: string
    status: string
    error: string
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
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

function loadQueue(): QueueRow[] {
    const raw = fs.readFileSync(QUEUE_PATH, "utf8").trim()
    const lines = raw.split(/\r?\n/)

    if (lines.length < 2) return []

    const headers = parseCsvLine(lines[0])

    return lines.slice(1).map((line) => {
        const vals = parseCsvLine(line)
        const obj = Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? ""]))
        return obj as QueueRow
    })
}

async function run() {
    const rows = loadQueue()

    console.log("rows needing resolution:", rows.length)

    for (const row of rows) {
        try {
            const searchResults = await searchFacilityCandidates(row.name)

            const domain = resolveFacilityDomain({
                name: row.name,
                searchResults,
            })

            if (!domain) {
                console.log("still unresolved:", row.name)
                await sleep(700)
                continue
            }

            const website = domain.startsWith("http") ? domain : `https://${domain}`

            const { error: updateError } = await supabase
                .from("facility_sites")
                .update({ website })
                .eq("id", row.id)

            if (updateError) {
                console.error("update error:", row.name, updateError)
            } else {
                console.log("resolved:", row.name, "=>", website)
            }
        } catch (error) {
            console.error("search error:", row.name, error)
        }

        await sleep(700)
    }

    console.log("google repair pass complete")
}

run().catch((error) => {
    console.error(error)
    process.exit(1)
})