import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { CrawlPageResult } from "./types"
import { extractTitle, stripHtmlToText } from "./stripHtml"

const execFileAsync = promisify(execFile)

const MAX_PAGES = 5

const GUARANTEED_PATHS = ["/insurance", "/admissions"]

const FALLBACK_DISCOVERY_PATHS = ["/programs", "/detox", "/residential-treatment"]

export async function fetchPages(rootUrl: string): Promise<CrawlPageResult[]> {
  const base = normalizeRootUrl(rootUrl)
  const urls = await buildCandidateUrls(base)
  const pages: CrawlPageResult[] = []

  for (const url of urls) {
    try {
      const rawHtml = await fetchHtmlWithCurl(url)
      const rawText = stripHtmlToText(rawHtml)
      const title = extractTitle(rawHtml)

      pages.push({
        url,
        status: 200,
        ok: true,
        fetchedAt: new Date().toISOString(),
        title,
        rawHtml,
        rawText,
        fetchError: null,
      })
    } catch (error) {
      pages.push({
        url,
        status: null,
        ok: false,
        fetchedAt: new Date().toISOString(),
        title: null,
        rawHtml: "",
        rawText: "",
        fetchError: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return pages
}

async function buildCandidateUrls(base: string): Promise<string[]> {
  const guaranteedUrls = GUARANTEED_PATHS.map((path) => new URL(path, base).toString())

  try {
    const homepageHtml = await fetchHtmlWithCurl(base)
    const discoveredUrls = extractInternalLinks(homepageHtml, base)

    const rankedDiscoveredUrls = discoveredUrls
      .filter((url) => !guaranteedUrls.includes(url))
      .map((url) => ({
        url,
        score: scoreCandidateUrl(url),
      }))
      .sort((a, b) => b.score - a.score)
      .map((item) => item.url)

    const selectedDiscoveredUrls = rankedDiscoveredUrls.slice(0, 3)

    const combined = [...new Set([...selectedDiscoveredUrls, ...guaranteedUrls])]

    return combined.slice(0, MAX_PAGES)
  } catch {
    const fallbackDiscoveredUrls = FALLBACK_DISCOVERY_PATHS.map((path) =>
      new URL(path, base).toString(),
    )

    const combined = [...new Set([...fallbackDiscoveredUrls, ...guaranteedUrls])]

    return combined.slice(0, MAX_PAGES)
  }
}

function extractInternalLinks(html: string, baseUrl: string): string[] {
  const links = new Set<string>()
  const base = new URL(baseUrl)
  const anchorRegex = /<a[^>]+href=["']([^"'#]+)["']/gi

  let match: RegExpExecArray | null = anchorRegex.exec(html)

  while (match !== null) {
    const href = match[1]

    try {
      const url = new URL(href, base)

      if (url.hostname !== base.hostname) {
        match = anchorRegex.exec(html)
        continue
      }

      url.hash = ""
      url.search = ""

      links.add(url.toString())
    } catch {
      // ignore malformed hrefs
    }

    match = anchorRegex.exec(html)
  }

  return [...links]
}

function scoreCandidateUrl(url: string): number {
  const lower = url.toLowerCase()
  let score = 0

  const positiveKeywords = [
    "program",
    "programs",
    "treatment",
    "detox",
    "levels-of-care",
    "residential",
    "outpatient",
    "php",
    "iop",
    "dual-diagnosis",
    "co-occurring",
    "opioid",
    "suboxone",
    "buprenorphine",
    "naltrexone",
    "vivitrol",
    "harm-reduction",
    "taper",
    "insurance",
    "verify-insurance",
    "admissions",
  ]

  const negativeKeywords = [
    "blog",
    "news",
    "press",
    "careers",
    "team",
    "about",
    "privacy",
    "terms",
    "contact",
  ]

  for (const keyword of positiveKeywords) {
    if (lower.includes(keyword)) {
      score += 5
    }
  }

  for (const keyword of negativeKeywords) {
    if (lower.includes(keyword)) {
      score -= 5
    }
  }

  return score
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