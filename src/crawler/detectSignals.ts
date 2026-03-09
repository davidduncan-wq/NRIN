import { EvidenceSnippet } from "./types"

export type SignalDefinition = {
  label: string
  patterns: RegExp[]
}

export type SignalDefinitionMap = Record<string, SignalDefinition>

export const PROGRAM_SIGNAL_DEFINITIONS: SignalDefinitionMap = {
  detox: {
    label: "Detox",
    patterns: [
      /\bdetox\b/i,
      /\bmedical detox\b/i,
      /\bwithdrawal management\b/i,
      /\bmedically supervised detox\b/i,
    ],
  },
  residential: {
    label: "Residential",
    patterns: [
      /\bresidential\b/i,
      /\binpatient\b/i,
      /\blive-?in treatment\b/i,
      /\bresidential treatment\b/i,
    ],
  },
  php: {
    label: "PHP",
    patterns: [
      /\bpartial hospitalization\b/i,
      /\bpartial hospitalization program\b/i,
      /\bphp\b/i,
    ],
  },
  iop: {
    label: "IOP",
    patterns: [
      /\bintensive outpatient\b/i,
      /\bintensive outpatient program\b/i,
      /\biop\b/i,
    ],
  },
  outpatient: {
    label: "Outpatient",
    patterns: [
      /\boutpatient\b/i,
      /\boutpatient treatment\b/i,
      /\boutpatient program\b/i,
      /\bop\b/i,
    ],
  },
  sober_living: {
    label: "Sober Living",
    patterns: [
      /\bsober living\b/i,
      /\brecovery residence\b/i,
      /\btransitional living\b/i,
      /\bhalfway house\b/i,
    ],
  },
  family_program: {
    label: "Family Program",
    patterns: [
      /\bfamily program\b/i,
      /\bfamily therapy\b/i,
      /\bfamily support\b/i,
      /\bfamily services\b/i,
    ],
  },
}

export const SPECIAL_CAPABILITY_SIGNAL_DEFINITIONS: SignalDefinitionMap = {
  dual_diagnosis: {
    label: "Dual Diagnosis",
    patterns: [
      /\bdual diagnosis\b/i,
      /\bco-occurring\b/i,
      /\bco occurring\b/i,
      /\bmental health and addiction\b/i,
    ],
  },
  mat: {
    label: "MAT",
    patterns: [
      /\bmat\b/i,
      /\bmedication assisted treatment\b/i,
      /\bmedication-assisted treatment\b/i,
      /\bsuboxone\b/i,
      /\bbuprenorphine\b/i,
      /\bmethadone\b/i,
      /\bvivitrol\b/i,
      /\bnaltrexone\b/i,
    ],
  },
  opioid_treatment: {
    label: "Opioid Treatment",
    patterns: [
      /\bopioid treatment\b/i,
      /\bopioid use disorder\b/i,
      /\bopiate treatment\b/i,
      /\bopiate addiction\b/i,
      /\bheroin addiction\b/i,
      /\bfentanyl addiction\b/i,
    ],
  },
  professional_track: {
    label: "Professional Track",
    patterns: [
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
  },
}

export const INSURANCE_SIGNAL_DEFINITIONS: SignalDefinitionMap = {
  aetna: {
    label: "Aetna",
    patterns: [/\baetna\b/i],
  },
  cigna: {
    label: "Cigna",
    patterns: [/\bcigna\b/i],
  },
  blue_cross_blue_shield: {
    label: "Blue Cross Blue Shield",
    patterns: [
      /\bblue cross\b/i,
      /\bblue shield\b/i,
      /\bbcbs\b/i,
      /\bblue cross blue shield\b/i,
    ],
  },
  anthem: {
    label: "Anthem",
    patterns: [/\banthem\b/i],
  },
  humana: {
    label: "Humana",
    patterns: [/\bhumana\b/i],
  },
  united_healthcare: {
    label: "United Healthcare",
    patterns: [
      /\bunited healthcare\b/i,
      /\bunitedhealthcare\b/i,
      /\buhc\b/i,
    ],
  },
  beacon: {
    label: "Beacon",
    patterns: [
      /\bbeacon\b/i,
      /\bbeacon health\b/i,
      /\bbeacon health options\b/i,
    ],
  },
  medicare: {
    label: "Medicare",
    patterns: [/\bmedicare\b/i],
  },
  medicaid: {
    label: "Medicaid",
    patterns: [/\bmedicaid\b/i],
  },
  ambetter: {
    label: "Ambetter",
    patterns: [/\bambetter\b/i],
  },
  tricare: {
    label: "Tricare",
    patterns: [/\btricare\b/i],
  },
  verify_insurance: {
    label: "Verify Insurance",
    patterns: [
      /\bverify insurance\b/i,
      /\binsurance verification\b/i,
      /\bcheck insurance\b/i,
      /\binsurance check\b/i,
    ],
  },
}

export function collectEvidenceSnippets(
  pageUrl: string,
  pageText: string,
  patterns: RegExp[],
  label: string
): EvidenceSnippet[] {
  const snippets: EvidenceSnippet[] = []
  const seen = new Set<string>()

  for (const pattern of patterns) {
    const regex = new RegExp(
      pattern.source,
      pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`
    )

    let match: RegExpExecArray | null

    while ((match = regex.exec(pageText)) !== null) {
      const snippet = buildSentenceSnippet(pageText, match.index, match[0].length)
      if (!snippet) continue

      const normalizedSnippet = normalizeSnippet(snippet)
      const key = `${pageUrl}::${label}::${normalizedSnippet}`

      if (seen.has(key)) continue
      seen.add(key)

      snippets.push({
        pageUrl,
        label,
        snippet,
      })
    }
  }

  return snippets
}

export function collectSignalEvidence(
  pageUrl: string,
  pageText: string,
  definitions: SignalDefinitionMap
): Record<string, EvidenceSnippet[]> {
  const result: Record<string, EvidenceSnippet[]> = {}

  for (const [key, definition] of Object.entries(definitions)) {
    const evidence = collectEvidenceSnippets(
      pageUrl,
      pageText,
      definition.patterns,
      definition.label
    )

    if (evidence.length > 0) {
      result[key] = evidence
    }
  }

  return result
}

export function pageContainsSignal(pageText: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(pageText))
}

function buildSentenceSnippet(text: string, matchIndex: number, matchLength: number): string {
  const start = findSentenceStart(text, matchIndex)
  const end = findSentenceEnd(text, matchIndex + matchLength)
  return text.slice(start, end).replace(/\s+/g, " ").trim()
}

function findSentenceStart(text: string, index: number): number {
  for (let i = index; i >= 0; i--) {
    const char = text[i]
    if (char === "." || char === "!" || char === "?" || char === "\n") {
      return i + 1
    }
  }

  return 0
}

function findSentenceEnd(text: string, index: number): number {
  for (let i = index; i < text.length; i++) {
    const char = text[i]
    if (char === "." || char === "!" || char === "?" || char === "\n") {
      return i + 1
    }
  }

  return text.length
}

function normalizeSnippet(snippet: string): string {
  return snippet.toLowerCase().replace(/\s+/g, " ").trim()
}