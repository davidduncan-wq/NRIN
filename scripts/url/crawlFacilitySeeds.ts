import { createClient } from "@supabase/supabase-js"
import { crawlFacility } from "../../src/crawler/crawlFacility"

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
    const { data, error } = await supabase
        .from("facility_seeds")
        .select("*")

    if (error) {
        console.error(error)
        process.exit(1)
    }

    for (const seed of data ?? []) {

        if (!seed.domain) continue

        console.log(`URL: ${seed.domain}`)

        const result = await crawlFacility({
            facilityId: seed.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            rootUrl: seed.domain,
        })

        console.log("pages:", result.pages.length)
        console.log("program detections:", result.programDetections.length)
        console.log("insurance detections:", result.insuranceDetections.length)

        await supabase.from("facility_crawl_results").insert({
            facility_seed_id: seed.id,
            name: seed.name,
            domain: seed.domain,
            pages_count: result.pages.length,
            program_detections_count: result.programDetections.length,
            insurance_detections_count: result.insuranceDetections.length,
            program_types: result.programDetections,
            insurance_carriers: result.insuranceDetections,
            synopsis: result.synopsisDraft.shortSynopsis,
            raw_result: result
        })

    }

}

run()