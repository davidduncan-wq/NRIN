import { fetchPages } from "./fetchPages"
import { parseInsurance } from "./parseInsurance"
import { parsePrograms } from "./parsePrograms"
import { parseSynopsis } from "./parseSynopsis"
import { CrawlFacilityInput, CrawlFacilityResult, CrawlPageResult } from "./types"

export async function crawlFacility(input: CrawlFacilityInput): Promise<CrawlFacilityResult> {
  const pages = await fetchPages(input.rootUrl)
  const usablePages = pages.filter(isUsablePage)

  const insuranceDetections = parseInsurance(usablePages)
  const programDetections = parsePrograms(usablePages)
  const synopsisDraft = parseSynopsis(insuranceDetections, programDetections)

  const schemaGapSignals: string[] = []

  if (insuranceDetections.length === 0) {
    schemaGapSignals.push("No insurance detections found on sampled pages")
  }

  if (programDetections.length === 0) {
    schemaGapSignals.push("No program detections found on sampled pages")
  }

  if (pages.every((page) => !page.ok)) {
    schemaGapSignals.push("No candidate pages fetched successfully")
  }

  if (pages.some((page) => isSoft404(page))) {
    schemaGapSignals.push("One or more sampled pages appear to be soft-404 pages")
  }

  return {
    facilityId: input.facilityId,
    rootUrl: input.rootUrl,
    crawledAt: new Date().toISOString(),
    pages,
    insuranceDetections,
    programDetections,
    synopsisDraft,
    schemaGapSignals,
  }
}

function isUsablePage(page: CrawlPageResult): boolean {
  if (!page.ok) return false
  if (!page.rawText.trim()) return false
  if (isSoft404(page)) return false
  return true
}

function isSoft404(page: CrawlPageResult): boolean {
  const title = (page.title || "").toLowerCase()
  const text = page.rawText.toLowerCase()

  if (title.includes("404")) return true
  if (title.includes("page not found")) return true
  if (text.includes("404 error - page not found")) return true
  if (text.includes("page not found")) return true

  return false
}