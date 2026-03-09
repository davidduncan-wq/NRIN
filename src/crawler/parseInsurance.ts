import { collectEvidenceSnippets } from "./detectSignals"
import { CrawlPageResult, InsuranceDetection } from "./types"

const INSURANCE_PATTERNS: Record<string, RegExp[]> = {
  aetna: [/\baetna\b/i],
  cigna: [/\bcigna\b/i],
  blue_cross_blue_shield: [/\bblue\s*cross\b/i, /\bblue\s*shield\b/i, /\bbcbs\b/i],
  united_healthcare: [/\bunited\s*healthcare\b/i, /\buhc\b/i],
  humana: [/\bhumana\b/i],
  medicare: [/\bmedicare\b/i],
  medicaid: [/\bmedicaid\b/i],
  tricare: [/\btricare\b/i],
  anthem: [/\banthem\b/i],
  ambetter: [/\bambetter\b/i],
  molina: [/\bmolina\b/i],
  beacon: [/\bbeacon\b/i],
}

export function parseInsurance(pages: CrawlPageResult[]): InsuranceDetection[] {
  const results: InsuranceDetection[] = []

  for (const [normalizedName, patterns] of Object.entries(INSURANCE_PATTERNS)) {
    const evidence = pages.flatMap((page) =>
      collectEvidenceSnippets(page.url, page.rawText, patterns, `insurance:${normalizedName}`)
    )

    if (evidence.length === 0) continue

    const rawMentions = [...new Set(evidence.map((item) => item.snippet))]

    results.push({
      normalizedName,
      rawMentions,
      evidence,
    })
  }

  return results
}