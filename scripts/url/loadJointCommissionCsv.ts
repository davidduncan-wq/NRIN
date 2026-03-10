import fs from "fs"
import { prepareFacilitySeed } from "./prepareFacilitySeedList"

const file = "data/joint_commission_facilities.csv"

const raw = fs.readFileSync(file, "utf8")
const lines = raw.split("\n")

const header = lines.shift()

for (const line of lines) {
    if (!line.trim()) continue

    const [name, city, state, website] = line.split(",")

    const seed = prepareFacilitySeed({
        name,
        city,
        state,
        website
    })

    console.log(seed)
}