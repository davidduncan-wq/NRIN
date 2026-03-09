import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { CrawlPageResult } from "./types"
import { extractTitle, stripHtmlToText } from "./stripHtml"

const execFileAsync = promisify(execFile)

const DEFAULT_PATHS = ["/", "/about", "/admissions", "/insurance", "/programs"]

export function buildCandidateUrls(rootUrl: string): string[] {
  const base = normalizeRootUrl(rootUrl)
  return DEFAULT_PATHS.map((path) => new URL(path, base).toString())
}

export async function fetchPages(rootUrl: string): Promise<CrawlPageResult[]> {
  const urls = buildCandidateUrls(rootUrl)
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