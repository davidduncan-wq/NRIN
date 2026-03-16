import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"
import { buildGoogleQuery } from "./buildGoogleQuery"
import { resolveFacilityDomain } from "./resolveFacilityDomain"

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
    const googleQuery = buildGoogleQuery(
      site.name,
      site.city ?? undefined
    )

    const domain = resolveFacilityDomain({
      name: site.name,
      city: site.city ?? undefined,
      websiteHint: site.website ?? undefined
    })

    const { error: upsertError } = await supabase
      .from("facility_seeds")
      .upsert(
        {
          facility_site_id: site.id,
          name: site.name,
          city: site.city ?? null,
          domain,
          google_query: googleQuery
        },
        { onConflict: "facility_site_id" }
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
  .then(() => console.log("done"))
  .catch((error) => {
    console.error("seeding failed", error)
    process.exit(1)
  })
