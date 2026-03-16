import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import * as fs from "node:fs"
import * as path from "node:path"
import { createClient } from "@supabase/supabase-js"
import { crawlFacility } from "../../src/crawler/crawlFacility"

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TMP_DIR = path.join(process.cwd(), "tmp")
const MANUAL_REVIEW_FILE = path.join(
    TMP_DIR,
    "facility_crawl_22p05_manual_review.ndjson"
)
const SKIP_FILE = path.join(
    TMP_DIR,
    "facility_crawl_skip_seed_ids.txt"
)

const BATCH_SIZE = 10
const RECENT_DOMAIN_WINDOW = 500
const MAX_RECENT_CRAWLS_PER_DOMAIN = 3

function ensureTmpFiles() {
    if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true })
    if (!fs.existsSync(SKIP_FILE)) fs.writeFileSync(SKIP_FILE, "")
    if (!fs.existsSync(MANUAL_REVIEW_FILE)) fs.writeFileSync(MANUAL_REVIEW_FILE, "")
}

function loadSkipSeedIds(): Set<string> {
    ensureTmpFiles()

    const raw = fs.readFileSync(SKIP_FILE, "utf8")

    return new Set(
        raw
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
    )
}

function appendSkipSeedId(seedId: string) {
    ensureTmpFiles()

    const current = loadSkipSeedIds()
    if (current.has(seedId)) return

    fs.appendFileSync(SKIP_FILE, `${seedId}\n`)
}

function appendManualReviewRow(payload: {
    seedId: string
    name: string
    domain: string
    errorCode: string
    errorMessage: string
    errorDetails?: string | null
}) {
    ensureTmpFiles()

    fs.appendFileSync(
        MANUAL_REVIEW_FILE,
        JSON.stringify({
            logged_at: new Date().toISOString(),
            ...payload,
        }) + "\n"
    )
}

function normalizeDomain(input: string | null | undefined): string | null {
    if (!input) return null

    const raw = input.trim()
    if (!raw) return null

    try {
        const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
        const url = new URL(withProtocol)
        return url.hostname.toLowerCase().replace(/^www\./, "")
    } catch {
        return raw
            .toLowerCase()
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .split("/")[0]
            .trim() || null
    }
}

async function loadAllCrawledSeedIds(): Promise<Set<string>> {
    const crawledSeedIds = new Set<string>()
    const pageSize = 1000
    let from = 0

    while (true) {
        const to = from + pageSize - 1

        const { data, error } = await supabase
            .from("facility_crawl_results")
            .select("facility_seed_id")
            .range(from, to)

        if (error) throw error
        if (!data || data.length === 0) break

        for (const row of data) {
            if (row.facility_seed_id) {
                crawledSeedIds.add(row.facility_seed_id)
            }
        }

        if (data.length < pageSize) break
        from += pageSize
    }

    return crawledSeedIds
}

async function loadAllFacilitySeeds() {
    const allSeeds: any[] = []
    const pageSize = 1000
    let from = 0

    while (true) {
        const to = from + pageSize - 1

        const { data, error } = await supabase
            .from("facility_seeds")
            .select("*")
            .order("created_at", { ascending: false })
            .range(from, to)

        if (error) throw error
        if (!data || data.length === 0) break

        allSeeds.push(...data)

        if (data.length < pageSize) break
        from += pageSize
    }

    return allSeeds
}

async function run() {
    const skipSeedIds = loadSkipSeedIds()

    let crawledSeedIds: Set<string>
    try {
        crawledSeedIds = await loadAllCrawledSeedIds()
    } catch (crawledError) {
        console.error(crawledError)
        process.exit(1)
    }

    const { data: recentDomainRows, error: recentDomainError } = await supabase
        .from("facility_crawl_results")
        .select("domain")
        .order("created_at", { ascending: false })
        .limit(RECENT_DOMAIN_WINDOW)

    if (recentDomainError) {
        console.error(recentDomainError)
        process.exit(1)
    }

    const recentDomainCounts = new Map<string, number>()

    for (const row of recentDomainRows ?? []) {
        const normalized = normalizeDomain(row.domain)
        if (!normalized) continue

        recentDomainCounts.set(
            normalized,
            (recentDomainCounts.get(normalized) ?? 0) + 1
        )
    }

    let data: any[]
    try {
        data = await loadAllFacilitySeeds()
    } catch (error) {
        console.error(error)
        process.exit(1)
    }

    const eligibleSeeds = (data ?? [])
        .filter((seed) => seed.domain)
        .filter((seed) => !crawledSeedIds.has(seed.id))
        .filter((seed) => !skipSeedIds.has(seed.id))

    const pendingSeeds: typeof eligibleSeeds = []
    const selectedSeedIds = new Set<string>()

    for (const seed of eligibleSeeds) {
        if (pendingSeeds.length >= BATCH_SIZE) break

        const normalizedDomain = normalizeDomain(seed.domain)
        if (!normalizedDomain) continue

        const recentCount = recentDomainCounts.get(normalizedDomain) ?? 0

        if (recentCount >= MAX_RECENT_CRAWLS_PER_DOMAIN) {
            continue
        }

        pendingSeeds.push(seed)
        selectedSeedIds.add(seed.id)
        recentDomainCounts.set(normalizedDomain, recentCount + 1)
    }

    if (pendingSeeds.length < BATCH_SIZE) {
        for (const seed of eligibleSeeds) {
            if (pendingSeeds.length >= BATCH_SIZE) break
            if (selectedSeedIds.has(seed.id)) continue

            const normalizedDomain = normalizeDomain(seed.domain)
            if (!normalizedDomain) continue

            pendingSeeds.push(seed)
            selectedSeedIds.add(seed.id)
        }
    }

    console.log("already crawled:", crawledSeedIds.size)
    console.log("seed batch size:", pendingSeeds.length)
    console.log(
        "recent domain throttle:",
        `window=${RECENT_DOMAIN_WINDOW}, max_per_domain=${MAX_RECENT_CRAWLS_PER_DOMAIN}`
    )

    for (const seed of pendingSeeds) {
        console.log(`URL: ${seed.domain}`)

        const result = await crawlFacility({
            facilityId: seed.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            rootUrl: seed.domain,
        })

        console.log("pages:", result.pages.length)
        console.log("program detections:", result.programDetections.length)
        console.log("insurance detections:", result.insuranceDetections.length)

        const { error: insertError } = await supabase
            .from("facility_crawl_results")
            .upsert(
                {
                    facility_seed_id: seed.id,
                    name: seed.name,
                    domain: seed.domain,
                    pages_count: result.pages.length,
                    program_detections_count: result.programDetections.length,
                    insurance_detections_count: result.insuranceDetections.length,
                    program_types: result.programDetections,
                    insurance_carriers: result.insuranceDetections,
                    synopsis: result.synopsisDraft.shortSynopsis,
                    raw_result: result,
                },
                {
                    onConflict: "facility_seed_id",
                }
            )

        if (insertError) {
            console.error("insert error", seed.name, insertError)

            if (insertError.code === "22P05") {
                appendManualReviewRow({
                    seedId: seed.id,
                    name: seed.name,
                    domain: seed.domain,
                    errorCode: insertError.code,
                    errorMessage: insertError.message ?? "unknown insert error",
                    errorDetails: insertError.details ?? null,
                })

                appendSkipSeedId(seed.id)
                console.log(`quarantined seed ${seed.id} for manual review`)
            }
        }
    }
}

run()
    .then(() => {
        console.log("crawl batch complete")
    })
    .catch((error) => {
        console.error("crawl batch failed", error)
        process.exit(1)
    })