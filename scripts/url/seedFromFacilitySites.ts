import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"
import { normalizeFacilityUrl } from "./normalizeFacilityUrls"
import { buildGoogleQuery } from "./buildGoogleQuery"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  const { data: sites, error } = await supabase
    .from("facility_sites")
    .select("id,name,city,website")

  if (error) {
    console.error("failed to fetch facility_sites", error)
    process.exit(1)
  }

  console.log("facility_sites rows:", sites?.length ?? 0)

  for (const site of sites ?? []) {
    if (!site.website) continue

    const domain = normalizeFacilityUrl(site.website)
    if (!domain) continue

    const googleQuery = buildGoogleQuery(site.name, site.city)

    const { error: upsertError } = await supabase
      .from("facility_seeds")
      .upsert(
        {
          name: site.name,
          city: site.city,
          domain,
          google_query: googleQuery,
        },
        { onConflict: "domain" }
      )

    if (upsertError) {
      console.error("seed error", site.name, upsertError)
    } else {
      console.log("seeded", site.name)
    }
  }

  console.log("facility seed generation complete")
}

run()
  .then(() => {
    console.log("done")
  })
  .catch((error) => {
    console.error("seeding failed", error)
    process.exit(1)
  })
