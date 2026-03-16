import { URL } from "url"
import { normalizeFacilityUrl } from "./normalizeFacilityUrls"

type ResolveInput = {
  name: string
  city?: string
  websiteHint?: string
  searchResults?: string[]
}

type Candidate = {
  url: string
  source: "hint" | "search"
}

const AGGREGATOR_HOSTS = [
  "facebook.com",
  "linkedin.com",
  "yelp.com",
  "psychologytoday.com",
  "rehabs.com",
  "recovery.org",
  "mapquest.com",
  "findtreatment.gov",
]

const NON_PUBLIC_HOST_PREFIXES = [
  "vaww.",
  "intranet.",
  "internal.",
  "localhost",
]

const BAD_PATH_HINTS = [
  "/careers",
  "/jobs",
  "/job",
  "/news",
  "/blog",
  "/press",
  "/donate",
  "/giving",
  "/foundation",
  "/investor",
  "/investors",
  "/research",
]

const PROGRAM_HINTS = [
  "addiction",
  "behavioral",
  "mental-health",
  "mentalhealth",
  "substance",
  "treatment",
  "rehab",
  "recovery",
  "services",
  "program",
  "outpatient",
  "iop",
  "php",
  "detox",
  "residential",
  "clinic",
  "cboc",
]

export function resolveFacilityDomain(input: ResolveInput): string | null {
  const candidates: Candidate[] = []

  if (input.websiteHint) {
    const normalized = normalizeFacilityUrl(input.websiteHint)
    if (normalized && isAllowed(normalized)) {
      candidates.push({ url: normalized, source: "hint" })
    }
  }

  for (const raw of input.searchResults ?? []) {
    const normalized = normalizeFacilityUrl(raw)
    if (!normalized) continue
    if (!isAllowed(normalized)) continue
    candidates.push({ url: normalized, source: "search" })
  }

  const deduped = dedupeCandidates(candidates)
  if (deduped.length === 0) return null

  const ranked = deduped
    .map((candidate) => ({
      ...candidate,
      score: scoreCandidate(candidate, input.name, input.city),
    }))
    .filter((candidate) => candidate.score > -1000)
    .sort((a, b) => b.score - a.score)

  return ranked[0]?.url ?? null
}

function isAllowed(url: string): boolean {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.toLowerCase()

    if (NON_PUBLIC_HOST_PREFIXES.some((prefix) => host.startsWith(prefix))) {
      return false
    }

    if (AGGREGATOR_HOSTS.some((bad) => host.includes(bad))) {
      return false
    }

    return true
  } catch {
    return false
  }
}

function scoreCandidate(candidate: Candidate, name: string, city?: string): number {
  try {
    const parsed = new URL(candidate.url)
    const host = parsed.hostname.toLowerCase()
    const path = parsed.pathname.toLowerCase()
    const urlText = `${host}${path}`

    const facilityTokens = buildMeaningfulTokens(name)
    const cityTokens = buildMeaningfulTokens(city ?? "")

    let score = 0

    if (candidate.source === "hint") score += 20

    const hostMatches = countTokenMatches(host, facilityTokens)
    const pathFacilityMatches = countTokenMatches(path, facilityTokens)
    const pathCityMatches = countTokenMatches(path, cityTokens)
    const programMatches = countTokenMatches(urlText, PROGRAM_HINTS)

    score += hostMatches * 18
    score += pathFacilityMatches * 20
    score += pathCityMatches * 10
    score += programMatches * 12

    if (path && path !== "/") score += 8

    if (looksBroadRoot(host, path)) score -= 30
    if (BAD_PATH_HINTS.some((bad) => path.includes(bad))) score -= 40

    if (host.endsWith(".gov") && programMatches > 0) score += 12
    if (host.endsWith(".va.gov") && (programMatches > 0 || pathFacilityMatches > 0)) score += 15
    if (host.endsWith(".tricare.mil") && (programMatches > 0 || pathFacilityMatches > 0)) score += 15

    if (hostMatches === 0 && pathFacilityMatches === 0 && path === "/") score -= 25

    return score
  } catch {
    return -10000
  }
}

function looksBroadRoot(host: string, path: string): boolean {
  if (path !== "/" && path !== "") return false

  return (
    host === "ok.gov" ||
    host === "va.gov" ||
    host === "kp.org" ||
    host.includes("hcahealthcare.com") ||
    host.includes("hcafloridahealthcare.com") ||
    host.includes("healthcare") ||
    host.includes("hospital") ||
    host.includes("medical") ||
    host.includes("system")
  )
}

function buildMeaningfulTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => token.length >= 4)
    .filter((token) => !STOP_WORDS.has(token))
}

function countTokenMatches(haystack: string, tokens: string[]): number {
  let count = 0
  for (const token of tokens) {
    if (haystack.includes(token)) count += 1
  }
  return count
}

function dedupeCandidates(candidates: Candidate[]): Candidate[] {
  const seen = new Set<string>()
  const output: Candidate[] = []

  for (const candidate of candidates) {
    if (seen.has(candidate.url)) continue
    seen.add(candidate.url)
    output.push(candidate)
  }

  return output
}

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "llc",
  "inc",
  "corp",
  "center",
  "centre",
  "clinic",
  "program",
  "programs",
  "health",
  "medical",
  "treatment",
  "services",
  "service",
  "hospital",
  "recovery",
  "behavioral",
  "mental",
  "substance",
  "abuse",
  "new",
  "york",
  "california",
  "oklahoma",
  "texas",
  "arizona",
  "florida",
  "indiana",
  "colorado",
  "district",
  "columbia",
  "ohio",
  "michigan",
  "illinois",
  "maryland",
  "connecticut",
  "tennessee",
])