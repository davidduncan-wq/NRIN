import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

type SearchProvider = "serpapi" | "google-cse"

export async function searchFacilityCandidates(query: string): Promise<string[]> {
  const provider = detectProvider()

  if (provider === "serpapi") {
    return searchWithSerpApi(query)
  }

  if (provider === "google-cse") {
    return searchWithGoogleCse(query)
  }

  throw new Error(
    "No supported search provider found. Expected SerpAPI or Google Custom Search credentials in environment."
  )
}

function detectProvider(): SearchProvider | null {
  const serpApiKey = process.env.SERPAPI_API_KEY || process.env.SERP_API_KEY
  if (serpApiKey) return "serpapi"

  const googleKey =
    process.env.GOOGLE_CUSTOM_SEARCH_API_KEY || process.env.GOOGLE_API_KEY
  const googleCx =
    process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID || process.env.GOOGLE_CSE_ID

  if (googleKey && googleCx) return "google-cse"

  return null
}

async function searchWithSerpApi(query: string): Promise<string[]> {
  const apiKey = process.env.SERPAPI_API_KEY || process.env.SERP_API_KEY
  if (!apiKey) throw new Error("Missing SerpAPI key")

  const url = new URL("https://serpapi.com/search.json")
  url.searchParams.set("engine", "google")
  url.searchParams.set("q", query)
  url.searchParams.set("num", "10")
  url.searchParams.set("api_key", apiKey)

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`SerpAPI search failed: ${response.status} ${body.slice(0, 300)}`)
  }

  const json = await response.json()

  const links = Array.isArray(json?.organic_results)
    ? json.organic_results
        .map((item: any) => item?.link)
        .filter((value: unknown): value is string => typeof value === "string")
    : []

  return dedupe(links)
}

async function searchWithGoogleCse(query: string): Promise<string[]> {
  const apiKey =
    process.env.GOOGLE_CUSTOM_SEARCH_API_KEY || process.env.GOOGLE_API_KEY
  const cx =
    process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID || process.env.GOOGLE_CSE_ID

  if (!apiKey || !cx) {
    throw new Error("Missing Google Custom Search credentials")
  }

  const url = new URL("https://www.googleapis.com/customsearch/v1")
  url.searchParams.set("key", apiKey)
  url.searchParams.set("cx", cx)
  url.searchParams.set("q", query)
  url.searchParams.set("num", "10")

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `Google Custom Search failed: ${response.status} ${body.slice(0, 300)}`
    )
  }

  const json = await response.json()

  const links = Array.isArray(json?.items)
    ? json.items
        .map((item: any) => item?.link)
        .filter((value: unknown): value is string => typeof value === "string")
    : []

  return dedupe(links)
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)]
}