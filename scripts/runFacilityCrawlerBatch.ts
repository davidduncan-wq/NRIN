import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { crawlFacility } from "../src/crawler/crawlFacility"

type BatchTarget = {
  facilityId: string
  url: string
}

type RunClassification =
  | "content_detected"
  | "soft_404_present"
  | "security_block"
  | "dns_failure"
  | "fetch_failure"
  | "no_structured_signals"

type BatchSummary = {
  attempted: number
  content_detected: number
  soft_404_present: number
  security_block: number
  dns_failure: number
  fetch_failure: number
  no_structured_signals: number
  with_program_detections: number
  with_insurance_detections: number
}

function getArg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag)
  if (index === -1) return undefined
  return process.argv[index + 1]
}

function hasSignal(text: string, patterns: string[]): boolean {
  const lower = text.toLowerCase()
  return patterns.some((pattern) => lower.includes(pattern))
}

function classifyRun(
  result: Awaited<ReturnType<typeof crawlFacility>>,
): RunClassification {
  const allPagesFailed = result.pages.length > 0 && result.pages.every((page) => !page.ok)

  if (allPagesFailed) {
    const allErrors = result.pages
      .map((page) => page.fetchError || "")
      .join(" ")
      .toLowerCase()

    if (allErrors.includes("could not resolve host")) {
      return "dns_failure"
    }

    return "fetch_failure"
  }

  const combinedTitlesAndText = result.pages
    .map((page) => `${page.title || ""}\n${page.rawText || ""}`)
    .join("\n")
    .toLowerCase()

  if (
    hasSignal(combinedTitlesAndText, [
      "attention required! | cloudflare",
      "sorry, you have been blocked",
      "please enable cookies",
      "security service to protect itself from online attacks",
      "you are unable to access",
    ])
  ) {
    return "security_block"
  }

  if (
    result.schemaGapSignals.some((signal) =>
      signal.toLowerCase().includes("soft-404"),
    )
  ) {
    return "soft_404_present"
  }

  if (result.programDetections.length > 0 || result.insuranceDetections.length > 0) {
    return "content_detected"
  }

  return "no_structured_signals"
}

async function main() {
  const inputPathArg = getArg("--input")
  const inputPath = inputPathArg
    ? path.resolve(process.cwd(), inputPathArg)
    : path.join(process.cwd(), "tmp", "crawler-batch-input.json")

  const raw = await readFile(inputPath, "utf8")
  const targets = JSON.parse(raw) as BatchTarget[]

  if (!Array.isArray(targets) || targets.length === 0) {
    console.error("Batch input must be a non-empty JSON array.")
    process.exit(1)
  }

  const outDir = path.join(process.cwd(), "tmp")
  await mkdir(outDir, { recursive: true })

  const summary: BatchSummary = {
    attempted: 0,
    content_detected: 0,
    soft_404_present: 0,
    security_block: 0,
    dns_failure: 0,
    fetch_failure: 0,
    no_structured_signals: 0,
    with_program_detections: 0,
    with_insurance_detections: 0,
  }

  for (const target of targets) {
    summary.attempted += 1

    console.log(`\n=== Crawling ${target.facilityId} ===`)
    console.log(`URL: ${target.url}`)

    try {
      const result = await crawlFacility({
        facilityId: target.facilityId,
        rootUrl: target.url,
      })

      const safeId = target.facilityId.replace(/[^a-z0-9_-]/gi, "_")
      const outPath = path.join(outDir, `crawler-result-${safeId}.json`)

      await writeFile(outPath, JSON.stringify(result, null, 2), "utf8")

      const classification = classifyRun(result)
      summary[classification] += 1

      if (result.programDetections.length > 0) {
        summary.with_program_detections += 1
      }

      if (result.insuranceDetections.length > 0) {
        summary.with_insurance_detections += 1
      }

      console.log(`Classification: ${classification}`)
      console.log(`Output: ${outPath}`)
      console.log(`Fetched pages: ${result.pages.length}`)
      console.log(`Insurance detections: ${result.insuranceDetections.length}`)
      console.log(`Program detections: ${result.programDetections.length}`)
      console.log(`Synopsis: ${result.synopsisDraft.shortSynopsis}`)
    } catch (error) {
      summary.fetch_failure += 1
      console.error(`Failed: ${target.facilityId}`)
      console.error(error)
    }
  }

  const summaryPath = path.join(outDir, "crawler-batch-summary.json")
  await writeFile(summaryPath, JSON.stringify(summary, null, 2), "utf8")

  console.log("\n=== Batch complete ===")
  console.log(JSON.stringify(summary, null, 2))
  console.log(`Summary output: ${summaryPath}`)
}

main().catch((error) => {
  console.error("Batch crawler run failed:")
  console.error(error)
  process.exit(1)
})