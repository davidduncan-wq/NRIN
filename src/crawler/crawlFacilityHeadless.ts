import { fetchPagesHeadless } from "./fetchPagesHeadless"
import { parsePrograms } from "./parsePrograms"
import { parseInsurance } from "./parseInsurance"
import { parseSynopsis } from "./parseSynopsis"
import { CrawlFacilityInput, CrawlFacilityResult } from "./types"

export async function crawlFacilityHeadless(
  input: CrawlFacilityInput,
): Promise<CrawlFacilityResult> {
  const pages = await fetchPagesHeadless(input.rootUrl)
  const successfulPages = pages.filter((page) => page.ok)

  const programDetections = parsePrograms(successfulPages)
  const insuranceDetections = parseInsurance(successfulPages)
  const synopsisDraft = parseSynopsis(insuranceDetections, programDetections)

  return {
    facilityId: input.facilityId,
    rootUrl: input.rootUrl,
    crawledAt: new Date().toISOString(),
    pages,
    insuranceDetections,
    programDetections,
    synopsisDraft,
    schemaGapSignals: [],
  }
}
