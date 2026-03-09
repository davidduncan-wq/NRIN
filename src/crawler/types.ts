export type CrawlPageResult = {
  url: string
  status: number | null
  ok: boolean
  fetchedAt: string
  title: string | null
  rawHtml: string
  rawText: string
  fetchError: string | null
}

export type EvidenceSnippet = {
  pageUrl: string
  label: string
  snippet: string
}

export type InsuranceDetection = {
  normalizedName: string
  rawMentions: string[]
  evidence: EvidenceSnippet[]
}

export type ProgramDetection = {
  normalizedName: string
  rawMentions: string[]
  evidence: EvidenceSnippet[]
}

export type FacilitySynopsisDraft = {
  shortSynopsis: string
  supportingSignals: string[]
}

export type CrawlFacilityInput = {
  facilityId: string
  rootUrl: string
}

export type CrawlFacilityResult = {
  facilityId: string
  rootUrl: string
  crawledAt: string
  pages: CrawlPageResult[]
  insuranceDetections: InsuranceDetection[]
  programDetections: ProgramDetection[]
  synopsisDraft: FacilitySynopsisDraft
  schemaGapSignals: string[]
}