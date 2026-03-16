import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function normalizeWebsite(website?: string | null): string | null {
  if (!website) return null
  const trimmed = website.trim()
  if (!trimmed) return null

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const url = new URL(withProtocol)

    url.hash = ""

    if (url.pathname === "/") {
      url.pathname = ""
    }

    return url.toString().replace(/\/$/, "")
  } catch {
    return null
  }
}

async function run() {
  const { data: sites, error } = await supabase
    .from("facility_sites")
    .select("id,name,city,website")
.range(0,6000)

  if (error) {
    console.error("failed to fetch facility_sites", error)
    process.exit(1)
  }

  console.log("facility_sites rows:", sites?.length ?? 0)

  const seenDomains = new Set<string>()
  let seeded = 0
  let skippedNoWebsite = 0
  let skippedInvalidWebsite = 0
  let skippedDuplicateInRun = 0
  let skippedDuplicateInDb = 0
  let failed = 0

  for (const site of sites ?? []) {
    const domain = normalizeWebsite(site.website)

    if (!site.website) {
      skippedNoWebsite += 1
      continue
    }

    if (!domain) {
      skippedInvalidWebsite += 1
      continue
    }

    if (seenDomains.has(domain)) {
      skippedDuplicateInRun += 1
      continue
    }

    seenDomains.add(domain)

    const { error: insertError } = await supabase
      .from("facility_seeds")
      .upsert(
        {
          facility_site_id: site.id,
          name: site.name,
          city: site.city ?? null,
          domain,
        },
        { onConflict: "facility_site_id" }
      )

    if (insertError) {
      failed += 1
      console.error("seed error", site.name, insertError)
    } else {
      seeded += 1
    }
  }

  console.log(JSON.stringify({
    seeded,
    skippedNoWebsite,
    skippedInvalidWebsite,
    skippedDuplicateInRun,
    skippedDuplicateInDb,
    failed,
    uniqueDomainsSeen: seenDomains.size,
  }, null, 2))
}

run()
  .then(() => console.log("crawler seed generation complete"))
  .catch((error) => {
    console.error("seeding failed", error)
    process.exit(1)
  })
