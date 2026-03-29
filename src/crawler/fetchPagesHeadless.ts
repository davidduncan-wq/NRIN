import { chromium } from "playwright"
import { CrawlPageResult } from "./types"
import { extractTitle, stripHtmlToText } from "./stripHtml"

const MAX_PAGES = 5

const STRONG_INCLUDE_HINTS = [
  "insurance",
  "verify-insurance",
  "verify insurance",
  "check-insurance",
  "check insurance",
  "insurance-verification",
  "insurance verification",
  "insurance-we-accept",
  "insurance we accept",
  "paying-for-treatment",
  "treatment-cost",
  "admissions",
  "admission",
  "treatment",
  "program",
  "programs",
  "services",
  "detox",
  "residential",
  "outpatient",
  "php",
  "iop",
  "locations",
  "location",
  "rehab",
]

const STRONG_EXCLUDE_HINTS = [
  "#",
  "thought-for-the-day",
  "graduate-school",
  "blog",
  "news",
  "press",
  "event",
  "events",
  "article",
  "articles",
  "podcast",
  "career",
  "careers",
  "job",
  "jobs",
  "donate",
  "foundation",
  "research",
  "webinar",
]

const FALLBACK_PATHS = [
  "/insurance",
  "/verify-insurance",
  "/check-insurance",
  "/insurance-verification",
  "/insurance-we-accept",
  "/paying-for-treatment",
  "/treatment-cost",
  "/admissions",
  "/treatment",
  "/programs",
  "/services",
  "/locations",
  "/detox",
  "/residential-treatment",
  "/outpatient-treatment",
]

const EXPANDER_TEXT_HINTS = [
  "show more",
  "show all",
  "view more",
  "see more",
  "more insurance",
  "more carriers",
  "all insurance",
  "all carriers",
]

export async function fetchPagesHeadless(rootUrl: string): Promise<CrawlPageResult[]> {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  const pages: CrawlPageResult[] = []

  try {
    const url = normalizeUrl(rootUrl)
    const root = new URL(url)
    const seen = new Set<string>()

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 })
    await page.waitForTimeout(2000)

    await expandLikelyMenus(page)
    await expandLikelyMoreButtons(page)

    const homepageHtml = await page.content()
    pages.push(buildPage(url, homepageHtml))
    seen.add(normalizeComparableUrl(url))

    const rawAnchors = await page.$$eval("a", (anchors) =>
      anchors.map((a) => ({
        href: (a as HTMLAnchorElement).href,
        text: ((a as HTMLAnchorElement).innerText || "").trim(),
      })),
    )

    const candidateLinks = rankCandidateLinks(rawAnchors, root)

    const forcedPriorityLinks = [
      new URL("/insurance", root).toString(),
      new URL("/verify-insurance", root).toString(),
      new URL("/check-insurance", root).toString(),
      new URL("/insurance-verification", root).toString(),
      new URL("/insurance-we-accept", root).toString(),
    ]

    const prioritizedLinks = [
      ...forcedPriorityLinks,
      ...candidateLinks.filter((link) => !forcedPriorityLinks.includes(link)),
    ]

    for (const link of prioritizedLinks) {
      if (pages.length >= MAX_PAGES) break

      const normalized = normalizeComparableUrl(link)
      if (seen.has(normalized)) continue

      try {
        await page.goto(link, { waitUntil: "domcontentloaded", timeout: 20000 })
        await page.waitForTimeout(1200)
        await expandLikelyMenus(page)
        await expandLikelyMoreButtons(page)

        const html = await page.content()
        pages.push(buildPage(link, html))
        seen.add(normalized)
      } catch {}
    }

    if (pages.length < MAX_PAGES) {
      for (const fallbackPath of FALLBACK_PATHS) {
        if (pages.length >= MAX_PAGES) break

        const fallbackUrl = new URL(fallbackPath, root).toString()
        const normalized = normalizeComparableUrl(fallbackUrl)
        if (seen.has(normalized)) continue

        try {
          await page.goto(fallbackUrl, { waitUntil: "domcontentloaded", timeout: 20000 })
          await page.waitForTimeout(1200)
          await expandLikelyMoreButtons(page)

          const html = await page.content()
          const text = stripHtmlToText(html).toLowerCase()

          if (text.length < 250) continue
          if (looksLikeJunk(fallbackUrl)) continue
          if (looksLikeSoft404(text)) continue

          pages.push(buildPage(fallbackUrl, html))
          seen.add(normalized)
        } catch {}
      }
    }
  } catch (error) {
    pages.push({
      url: rootUrl,
      status: null,
      ok: false,
      fetchedAt: new Date().toISOString(),
      title: null,
      rawHtml: "",
      rawText: "",
      fetchError: error instanceof Error ? error.message : String(error),
    })
  }

  await browser.close()
  return pages
}

async function expandLikelyMenus(page: any) {
  const selectors = [
    'button[aria-label*="menu" i]',
    'button[aria-label*="navigation" i]',
    'button[aria-expanded]',
    '[role="button"][aria-label*="menu" i]',
    'button:has-text("Menu")',
    'button:has-text("Programs")',
    'button:has-text("Treatment")',
    'button:has-text("Admissions")',
    'button:has-text("Insurance")',
  ]

  for (const selector of selectors) {
    try {
      const elements = await page.$$(selector)
      for (const el of elements.slice(0, 4)) {
        try {
          await el.click({ timeout: 1000 })
          await page.waitForTimeout(300)
        } catch {}
      }
    } catch {}
  }
}

async function expandLikelyMoreButtons(page: any) {
  const clickableSelectors = ["button", "[role='button']", "a"]

  for (const selector of clickableSelectors) {
    try {
      const elements = await page.$$(selector)
      for (const el of elements.slice(0, 40)) {
        let text = ""
        try {
          text = ((await el.innerText()) || "").trim().toLowerCase()
        } catch {}

        if (!text) continue
        if (!EXPANDER_TEXT_HINTS.some((hint) => text.includes(hint))) continue

        try {
          await el.click({ timeout: 1000 })
          await page.waitForTimeout(500)
        } catch {}
      }
    } catch {}
  }
}

function rankCandidateLinks(
  rawAnchors: Array<{ href: string; text: string }>,
  root: URL,
): string[] {
  const deduped = new Map<string, number>()

  for (const anchor of rawAnchors) {
    let url: URL
    try {
      url = new URL(anchor.href, root)
    } catch {
      continue
    }

    if (url.hostname !== root.hostname) continue

    const normalized = normalizeComparableUrl(url.toString())
    if (!normalized) continue
    if (normalized === normalizeComparableUrl(root.toString())) continue
    if (looksLikeJunk(normalized)) continue

    const score = scoreLink(normalized, anchor.text || "")
    if (score <= 0) continue

    const existing = deduped.get(normalized)
    if (existing === undefined || score > existing) {
      deduped.set(normalized, score)
    }
  }

  return Array.from(deduped.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([url]) => url)
    .slice(0, 12)
}

function scoreLink(url: string, anchorText: string): number {
  const lower = `${url} ${anchorText}`.toLowerCase()
  let score = 0

  for (const hint of STRONG_INCLUDE_HINTS) {
    if (lower.includes(hint)) score += 10
  }

  if (lower.includes("/locations/")) score += 8
  if (lower.includes("/insurance")) score += 12
  if (lower.includes("/verify-insurance")) score += 14
  if (lower.includes("/check-insurance")) score += 14
  if (lower.includes("/insurance-verification")) score += 14
  if (lower.includes("/admissions")) score += 10
  if (lower.includes("/program")) score += 9
  if (lower.includes("/treatment")) score += 9

  for (const hint of STRONG_EXCLUDE_HINTS) {
    if (lower.includes(hint)) score -= 20
  }

  return score
}

function looksLikeJunk(url: string): boolean {
  const lower = url.toLowerCase()
  return STRONG_EXCLUDE_HINTS.some((hint) => lower.includes(hint))
}

function looksLikeSoft404(text: string): boolean {
  return (
    text.includes("page not found") ||
    text.includes("not found") ||
    text.includes("sorry, we can't find") ||
    text.includes("sorry, we can’t find") ||
    text.includes("404")
  )
}

function buildPage(url: string, rawHtml: string): CrawlPageResult {
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

function normalizeUrl(input: string): string {
  if (/^https?:\/\//i.test(input)) return input
  return `https://${input}`
}

function normalizeComparableUrl(input: string): string {
  try {
    const url = new URL(input)
    url.hash = ""
    url.search = ""
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1)
    }
    return url.toString()
  } catch {
    return input
  }
}
