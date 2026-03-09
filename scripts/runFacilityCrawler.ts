import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { crawlFacility } from "../src/crawler/crawlFacility"

function getArg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag)
  if (index === -1) return undefined
  return process.argv[index + 1]
}

async function main() {
  const facilityId = getArg("--facilityId")
  const url = getArg("--url")

  if (!facilityId || !url) {
    console.error("Usage: npx tsx scripts/runFacilityCrawler.ts --facilityId <id> --url <url>")
    process.exit(1)
  }

  const result = await crawlFacility({
    facilityId,
    rootUrl: url,
  })

  const outDir = path.join(process.cwd(), "tmp")
  await mkdir(outDir, { recursive: true })

  const safeId = facilityId.replace(/[^a-z0-9_-]/gi, "_")
  const outPath = path.join(outDir, `crawler-result-${safeId}.json`)

  await writeFile(outPath, JSON.stringify(result, null, 2), "utf8")

  console.log("Crawler run complete.")
  console.log(`Output: ${outPath}`)
  console.log(`Fetched pages: ${result.pages.length}`)
  console.log(`Insurance detections: ${result.insuranceDetections.length}`)
  console.log(`Program detections: ${result.programDetections.length}`)
  console.log(`Synopsis: ${result.synopsisDraft.shortSynopsis}`)
}

main().catch((error) => {
  console.error("Crawler run failed:")
  console.error(error)
  process.exit(1)
})