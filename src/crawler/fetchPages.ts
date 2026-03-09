import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { CrawlPageResult } from "./types"
import { extractTitle, stripHtmlToText } from "./stripHtml"

const execFileAsync = promisify(execFile)

const MAX_SELECTED_PAGES = 5
const HOMEPAGE_PATH = "/"

type CandidateBucket = "clinical" | "financial" | "specialty"

type CandidateLink = {
  url: string
  anchorText: string
  score: number
  buckets: CandidateBucket[]
}

const CLINICAL_KEYWORDS = [
  "detox",
  "withdrawal",
  "residential",
  "inpatient",
  "outpatient",
  "intensive outpatient",
  "iop",
  "partial hospitalization",
  "php",
  "program",
  "programs",
  "treatment",
  "services",
  "care",
  "levels of care",
]

const FINANCIAL_KEYWORDS = [
  "insurance",
  "verify insurance",
  "admissions",
  "admission",
  "payment",
  "paying for treatment",
  "coverage",
  "in-network",
  "out-of-network",
  "payer",
  "financing",
  "cost",
]

const SPECIALTY_KEYWORDS = [
  "mat",
  "medication assisted treatment",
  "medication-assisted treatment",
  "opioid",
  "opiate",
  "suboxone",
  "buprenorphine",
  "methadone",
  "vivitrol",
  "naltrexone",
  "dual diagnosis",
  "co-occurring",
  "mental health",
  "psychiatry",
]

const NEGATIVE_HINTS = [
  "contact",
  "team",
  "staff",
  "career",
  "careers",
  "job",
  "jobs",
  "blog",
  "news",
  "press",
  "event",
  "events",
  "testimonial",
  "testimonials",
  "review",
  "reviews",
  "privacy",
  "terms",
  "accessibility",
  "faq",
  "faqs",
]

export function buildCandidateUrls(rootUrl: string): string[] {
  const base = normalizeRootUrl(rootUrl)
  return [new URL(HOMEPAGE_PATH, base).toString()]
}

export async function fetchPages(rootUrl: string): Promise<CrawlPageResult[]> {
  const homepageUrl = buildCandidateUrls(rootUrl)[0]
  const pages: CrawlPageResult[] = []

  let homepageHtml = ""
  try {
    homepageHtml = await fetchHtmlWithCurl(homepageUrl)
    pages.push(buildSuccessPage(homepageUrl, homepageHtml))
  } catch (error) {
    pages.push(buildErrorPage(homepageUrl, error))
    return pages
  }

  const candidateLinks = extractCandidateLinks(homepageHtml, homepageUrl)
  const selectedUrls = selectUrlsForCoverage(homepageUrl, candidateLinks, MAX_SELECTED_PAGES)

  for (const url of selectedUrls) {
    if (url === homepageUrl) continue

    try {
      const rawHtml = await fetchHtmlWithCurl(url)
      pages.push(buildSuccessPage(url, rawHtml))
    } catch (error) {
      pages.push(buildErrorPage(url, error))
    }
  }

  return pages
}

function buildSuccessPage(url: string, rawHtml: string): CrawlPageResult {
  return {
    url,
    status: 200,
    ok: true,
    fetchedAt: new Date().toISOString(),
    title: extractTitle(rawHtml),
    rawHtml,
    rawText: stripHtmlToText(rawHtml),
    fetchError: null,
  }
}

function buildErrorPage(url: string, error: unknown): CrawlPageResult {
  return {
    url,
    status: null,
    ok: false,
    fetchedAt: new Date().toISOString(),
    title: null,
    rawHtml: "",
    rawText: "",
    fetchError: error instanceof Error ? error.message : String(error),
  }
}

async function fetchHtmlWithCurl(url: string): Promise<string> {
  const { stdout } = await execFileAsync("curl", [
    "-L",
    "--silent",
    "--show-error",
    "--max-time",
    "20",
    "--user-agent",
    "Mozilla/5.0 (compatible; NRIN-Crawler/1.0)",
    "--header",
    "accept: text/html,application/xhtml+xml",
    url,
  ])

  return stdout
}

function normalizeRootUrl(rootUrl: string): string {
  const withProtocol = /^https?:\/\//i.test(rootUrl) ? rootUrl : `https://${rootUrl}`
  const url = new URL(withProtocol)
  url.pathname = "/"
  url.search = ""
  url.hash = ""
  return url.toString()
}

function extractCandidateLinks(html: string, homepageUrl: string): CandidateLink[] {
  const homepage = new URL(homepageUrl)
  const anchorRegex = /<a\b[^>]*href=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi

  const deduped = new Map<string, CandidateLink>()
  let match: RegExpExecArray | null = null

  while ((match = anchorRegex.exec(html)) !== null) {
    const href = match[2]?.trim() ?? ""
    const anchorHtml = match[3] ?? ""
    const anchorText = stripHtmlToText(anchorHtml).replace(/\s+/g, " ").trim()

    const resolvedUrl = resolveInternalUrl(homepage, href)
    if (!resolvedUrl) continue

    const score = scoreCandidate(resolvedUrl, anchorText)
    const buckets = classifyBuckets(resolvedUrl, anchorText)

    if (score <= 0) continue
    if (buckets.length === 0) continue

    const existing = deduped.get(resolvedUrl)
    if (!existing || score > existing.score) {
      deduped.set(resolvedUrl, {
        url: resolvedUrl,
        anchorText,
        score,
        buckets,
      })
    }
  }

  return Array.from(deduped.values()).sort((a, b) => b.score - a.score)
}

function resolveInternalUrl(base: URL, href: string): string | null {
  if (!href) return null
  if (href.startsWith("#")) return null
  if (/^(mailto:|tel:|javascript:)/i.test(href)) return null

  let url: URL
  try {
    url = new URL(href, base)
  } catch {
    return null
  }

  if (url.hostname !== base.hostname) return null

  url.hash = ""

  const normalizedPath = normalizePath(url.pathname)
  if (!normalizedPath) return null

  url.pathname = normalizedPath
  url.search = ""

  if (normalizePath(url.pathname) === HOMEPAGE_PATH) {
    return url.toString()
  }

  return url.toString()
}

function normalizePath(pathname: string): string | null {
  if (!pathname) return HOMEPAGE_PATH

  let path = pathname.trim()
  if (!path.startsWith("/")) path = `/${path}`

  path = path.replace(/\/{2,}/g, "/")

  if (path !== "/" && path.endsWith("/")) {
    path = path.slice(0, -1)
  }

  const lower = path.toLowerCase()
  if (
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".png") ||
    lower.endsWith(".gif") ||
    lower.endsWith(".svg") ||
    lower.endsWith(".webp") ||
    lower.endsWith(".pdf") ||
    lower.endsWith(".zip")
  ) {
    return null
  }

  return path
}

function scoreCandidate(url: string, anchorText: string): number {
  const haystack = `${url} ${anchorText}`.toLowerCase()
  let score = 0

  score += scoreKeywordSet(haystack, CLINICAL_KEYWORDS, 10)
  score += scoreKeywordSet(haystack, FINANCIAL_KEYWORDS, 11)
  score += scoreKeywordSet(haystack, SPECIALTY_KEYWORDS, 12)

  if (looksLikeDeepProgramPage(url)) score += 8
  if (looksLikeGenericButUsefulPage(url)) score += 3

  for (const term of NEGATIVE_HINTS) {
    if (haystack.includes(term)) score -= 8
  }

  if (anchorText.length > 0 && anchorText.length < 80) {
    score += 1
  }

  return score
}

function classifyBuckets(url: string, anchorText: string): CandidateBucket[] {
  const haystack = `${url} ${anchorText}`.toLowerCase()
  const buckets: CandidateBucket[] = []

  if (containsAny(haystack, CLINICAL_KEYWORDS)) buckets.push("clinical")
  if (containsAny(haystack, FINANCIAL_KEYWORDS)) buckets.push("financial")
  if (containsAny(haystack, SPECIALTY_KEYWORDS)) buckets.push("specialty")

  return buckets
}

function scoreKeywordSet(haystack: string, keywords: string[], weight: number): number {
  let score = 0

  for (const keyword of keywords) {
    if (haystack.includes(keyword)) {
      score += weight
    }
  }

  return score
}

function containsAny(haystack: string, keywords: string[]): boolean {
  return keywords.some((keyword) => haystack.includes(keyword))
}

function looksLikeDeepProgramPage(url: string): boolean {
  const path = new URL(url).pathname.toLowerCase()

  return (
    path.includes("/program") ||
    path.includes("/treatment") ||
    path.includes("/services") ||
    path.includes("/care") ||
    path.includes("/detox") ||
    path.includes("/outpatient") ||
    path.includes("/residential") ||
    path.includes("/dual-diagnosis") ||
    path.includes("/mat") ||
    path.includes("/opioid")
  )
}

function looksLikeGenericButUsefulPage(url: string): boolean {
  const path = new URL(url).pathname.toLowerCase()

  return (
    path === "/programs" ||
    path === "/treatment" ||
    path === "/services" ||
    path === "/admissions" ||
    path === "/insurance"
  )
}

function selectUrlsForCoverage(
  homepageUrl: string,
  candidates: CandidateLink[],
  maxPages: number,
): string[] {
  const selected = new Set<string>()
  selected.add(homepageUrl)

  const ranked = [...candidates].sort((a, b) => b.score - a.score)

  const reserveFromBucket = (bucket: CandidateBucket, count: number) => {
    for (const candidate of ranked) {
      if (selected.size >= maxPages) return
      if (!candidate.buckets.includes(bucket)) continue
      if (selected.has(candidate.url)) continue
      selected.add(candidate.url)
      if (count <= 1) return
      count -= 1
    }
  }

  // Coverage plan:
  // 1 homepage
  // 2 clinical
  // 1 financial
  // 1 specialty
  reserveFromBucket("clinical", 2)
  reserveFromBucket("financial", 1)
  reserveFromBucket("specialty", 1)

  // Fill any remaining slots with best overall candidates.
  for (const candidate of ranked) {
    if (selected.size >= maxPages) break
    if (selected.has(candidate.url)) continue
    selected.add(candidate.url)
  }

  return Array.from(selected).slice(0, maxPages)
}