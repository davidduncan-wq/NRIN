import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import fs from "fs"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FILE = "tmp/domain_verification_results.csv"

type Row = {
  id: string
  name: string
  input_domain: string
  normalized_start_url: string
  final_url: string
  final_domain: string
  status: string
  http_status: string
  error: string
  redirect_hops: string
}

function parseCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    const next = line[i + 1]

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cur += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (ch === "," && !inQuotes) {
      out.push(cur)
      cur = ""
      continue
    }

    cur += ch
  }

  out.push(cur)
  return out.map((s) => s.trim())
}

function normalizeUrl(url?: string | null): string | null {
  if (!url) return null
  const trimmed = url.trim()
  if (!trimmed) return null

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const parsed = new URL(withProtocol)
    parsed.hash = ""
    parsed.search = ""
    if (parsed.pathname === "/") parsed.pathname = ""
    return parsed.toString().replace(/\/$/, "")
  } catch {
    return null
  }
}

async function run() {
  const raw = fs.readFileSync(FILE, "utf8")
  const lines = raw.split(/\r?\n/).filter(Boolean)
  const header = parseCsvLine(lines[0])

  const rows: Row[] = lines.slice(1).map((line) => {
    const cols = parseCsvLine(line)
    const obj: Record<string, string> = {}
    header.forEach((key, i) => {
      obj[key] = cols[i] ?? ""
    })
    return obj as Row
  })

  console.log("verification rows:", rows.length)

  let attempted = 0
  let seeded = 0
  let skippedStatus = 0
  let skippedNoFinalUrl = 0
  let failed = 0

  for (const row of rows) {
    const status = (row.status || "").trim().toLowerCase()
    if (!["valid", "redirected"].includes(status)) {
      skippedStatus += 1
      continue
    }

    const domain = normalizeUrl(row.final_url || row.normalized_start_url)
    if (!domain) {
      skippedNoFinalUrl += 1
      continue
    }

    attempted += 1

    const { error } = await supabase
      .from("facility_seeds")
      .upsert(
        {
          facility_site_id: row.id,
          name: row.name,
          domain,
        },
        { onConflict: "facility_site_id" }
      )

    if (error) {
      failed += 1
      console.error("seed error", row.name, error)
    } else {
      seeded += 1
    }
  }

  console.log(
    JSON.stringify(
      {
        attempted,
        seeded,
        skippedStatus,
        skippedNoFinalUrl,
        failed,
      },
      null,
      2
    )
  )
}

run().catch((error) => {
  console.error("seed import failed", error)
  process.exit(1)
})
