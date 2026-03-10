import fs from "fs"
import { createClient } from "@supabase/supabase-js"
import { prepareFacilitySeed } from "./prepareFacilitySeedList"

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const file = "data/joint_commission_facilities.csv"

const raw = fs.readFileSync(file, "utf8")
const lines = raw.split("\n")

lines.shift()

async function run() {
    for (const line of lines) {
        if (!line.trim()) continue

        const [name, city, state, website] = line.split(",")

        const seed = prepareFacilitySeed({
            name,
            city,
            state,
            website
        })

        const { error } = await supabase
            .from("facility_seeds")
            .insert({
                name: seed.name,
                city: seed.city,
                state: seed.state,
                domain: seed.normalizedDomain,
                google_query: seed.googleQuery
            })

        if (error) {
            console.log("insert error", error)
        } else {
            console.log("inserted", seed.name)
        }
    }
}

run()