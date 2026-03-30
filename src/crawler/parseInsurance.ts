import { collectEvidenceSnippets } from "./detectSignals"
import { CrawlPageResult, InsuranceDetection } from "./types"
import { INSURANCE_CARRIER_UNIVERSE } from "./config/insuranceCarrierUniverse"

const NEGATION_PATTERNS = [
  /\bdo not accept\b/i,
  /\bdoes not accept\b/i,
  /\bdon't accept\b/i,
  /\bdoesn't accept\b/i,
  /\bnot accepted\b/i,
  /\bnot currently accepted\b/i,
  /\bwe do not take\b/i,
  /\bwe don't take\b/i,
  /\bdoes not take\b/i,
  /\bdoesn't take\b/i,
  /\bnot in network\b/i,
  /\bout of network\b/i,
  /\bnot contracted with\b/i,
  /\bunable to accept\b/i,
  /\bno longer accept\b/i,
  /\bexcluded\b/i,
  /\bnot covered\b/i,
  /\bnot covered by\b/i,
]

const QUESTION_PATTERNS = [
  /^\s*does .* accept .* coverage\??\s*$/i,
  /^\s*does .* accept .* insurance\??\s*$/i,
  /^\s*do .* accept .* coverage\??\s*$/i,
  /^\s*do .* accept .* insurance\??\s*$/i,
]

export function parseInsurance(pages: CrawlPageResult[]): InsuranceDetection[] {
  const results: InsuranceDetection[] = []

  for (const carrier of INSURANCE_CARRIER_UNIVERSE) {
    const evidence = pages.flatMap((page) => {
      const haystack = `${page.title ?? ""}\n${page.rawText}`
      return collectEvidenceSnippets(page.url, haystack, carrier.patterns, `insurance:${carrier.key}`)
    })

    const filteredEvidence = evidence.filter(
      (item) => !looksNegated(item.snippet) && !looksLikeQuestion(item.snippet),
    )

    const fullTextFallbackEvidence = pages
      .filter((page) => {
        const haystack = `${page.title ?? ""}\n${page.rawText}`
        return carrier.patterns.some((pattern) => pattern.test(haystack))
      })
      .map((page) => ({
        pageUrl: page.url,
        label: `insurance:${carrier.key}:fulltext`,
        snippet: (page.title ?? page.rawText.slice(0, 200)).trim(),
      }))
      .filter(
        (item) => item.snippet && !looksNegated(item.snippet) && !looksLikeQuestion(item.snippet),
      )

    const combinedEvidence = [
      ...filteredEvidence,
      ...fullTextFallbackEvidence.filter(
        (fallback) =>
          !filteredEvidence.some(
            (item) => item.pageUrl === fallback.pageUrl && item.snippet === fallback.snippet,
          ),
      ),
    ]

    if (combinedEvidence.length === 0) continue

    const rawMentions = [...new Set(combinedEvidence.map((item) => item.snippet))]

    results.push({
      normalizedName: carrier.key,
      rawMentions,
      evidence: combinedEvidence,
    })
  }

  return results
}

function looksNegated(snippet: string): boolean {
  return NEGATION_PATTERNS.some((pattern) => pattern.test(snippet))
}

function looksLikeQuestion(snippet: string): boolean {
  return QUESTION_PATTERNS.some((pattern) => pattern.test(snippet.trim()))
}
