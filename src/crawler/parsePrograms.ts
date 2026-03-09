import { collectEvidenceSnippets } from "./detectSignals"
import { CrawlPageResult, ProgramDetection } from "./types"

const PROGRAM_PATTERNS: Record<string, RegExp[]> = {
  detox: [/\bdetox\b/i, /\bmedical detox\b/i],
  residential: [/\bresidential\b/i, /\binpatient\b/i],
  outpatient: [/\boutpatient\b/i],
  php: [/\bpartial hospitalization\b/i, /\bphp\b/i],
  iop: [/\bintensive outpatient\b/i, /\biop\b/i],
  op: [/\boutpatient program\b/i],
  dual_diagnosis: [/\bdual diagnosis\b/i, /\bco-occurring\b/i],
  mat: [
    /\bmedication[- ]assisted treatment\b/i,
    /\bmedication[- ]supported treatment\b/i,
    /\bmedication[- ]supported recovery\b/i,
    /\bmat\b/i,
    /\bsuboxone\b/i,
    /\bbuprenorphine\b/i,
    /\bnaltrexone\b/i,
    /\bvivitrol\b/i,
    /\bharm reduction\b/i,
    /\btaper program\b/i,
    /\btaper programs\b/i,
    /\bopioid use disorder treatment\b/i,
  ],
  sober_living: [/\bsober living\b/i],
  family_program: [/\bfamily program\b/i, /\bfamily therapy\b/i],
    professional_track: [
    /\bexecutive program\b/i,
    /\bexecutive treatment\b/i,
    /\bexecutive rehab\b/i,
    /\bprofessionals program\b/i,
    /\bprofessional program\b/i,
    /\bprofessionals track\b/i,
    /\bprofessional track\b/i,
    /\bphysician program\b/i,
    /\bphysicians program\b/i,
    /\bhealthcare professionals program\b/i,
    /\bhealth care professionals program\b/i,
    /\blegal professionals program\b/i,
    /\battorneys program\b/i,
    /\blawyers program\b/i,
    /\bfirst responders program\b/i,
    /\bfirst responders\b/i,
    /\bpilots program\b/i,
    /\bmilitary program\b/i,
  ],
}

export function parsePrograms(pages: CrawlPageResult[]): ProgramDetection[] {
  const results: ProgramDetection[] = []

  for (const [normalizedName, patterns] of Object.entries(PROGRAM_PATTERNS)) {
    const evidence = pages.flatMap((page) =>
      collectEvidenceSnippets(page.url, page.rawText, patterns, `program:${normalizedName}`)
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