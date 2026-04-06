import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const VOCAB = {
  DETOX: ["detox", "detoxification", "medical detox", "withdrawal management"],
  RESIDENTIAL: ["residential treatment", "residential rehab", "inpatient residential", "inpatient rehab", "rehab program", "inpatient treatment"],
  PHP: ["partial hospitalization program", "day treatment"],
  IOP: ["intensive outpatient program"],
  DUAL_DX: ["dual diagnosis", "co-occurring disorders", "co-occurring"],
  MAT: ["medication-assisted treatment", "suboxone", "buprenorphine", "methadone", "subutex", "naltrexone"],
} as const;

const FIELD_MAP: Record<keyof typeof VOCAB, string> = {
  DETOX: "offers_detox",
  RESIDENTIAL: "offers_residential",
  PHP: "offers_php",
  IOP: "offers_iop",
  DUAL_DX: "dual_diagnosis_support",
  MAT: "mat_supported",
};

type CrawlPage = {
  title?: string | null;
  rawHtml?: string | null;
};

type RawResult = {
  pages?: CrawlPage[];
};

type CrawlFetchRow = {
  facility_seed_id: string;
  raw_result: RawResult | null;
};

type ReviewTier = "high" | "medium";

type CandidateRow = {
  facility_site_id: string;
  tag: keyof typeof VOCAB;
  field: string;
  truthValue: boolean | null;
  supporting_phrases: string[];
  review_tier: ReviewTier;
};

function stripHtmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTextFromRawResult(rawResult: RawResult | null): string {
  const pages = rawResult?.pages ?? [];
  const chunks: string[] = [];

  for (const page of pages) {
    const title = page.title?.trim() ?? "";
    const rawHtml = page.rawHtml?.trim() ?? "";
    const htmlText = rawHtml ? stripHtmlToText(rawHtml) : "";
    const combined = [title, htmlText].filter(Boolean).join(" ");
    if (combined) chunks.push(combined);
  }

  return normalizeText(chunks.join(" "));
}

function getReviewTier(tag: keyof typeof VOCAB, supportingPhrases: string[]): ReviewTier {
  const normalized = supportingPhrases.map((p) => normalizeText(p));

  const highSignals = new Set([
    "medical detox",
    "partial hospitalization program",
    "intensive outpatient program",
    "medication assisted treatment",
    "suboxone",
    "buprenorphine",
    "methadone",
    "subutex",
    "naltrexone",
    "dual diagnosis",
    "co occurring disorders",
  ]);

  if (tag === "DETOX" && normalized.includes("medical detox")) return "high";
  if (tag === "PHP" && normalized.includes("partial hospitalization program")) return "high";
  if (tag === "IOP" && normalized.includes("intensive outpatient program")) return "high";
  if (tag === "MAT" && normalized.some((p) => highSignals.has(p))) return "high";
  if (tag === "DUAL_DX" && normalized.some((p) => highSignals.has(p))) return "high";

  return "medium";
}

async function fetchCrawlRows(limit = 250): Promise<CrawlFetchRow[]> {
  const batchSize = 10;
  const out: CrawlFetchRow[] = [];

  for (let start = 0; start < limit; start += batchSize) {
    const end = Math.min(start + batchSize - 1, limit - 1);

    const { data, error } = await supabase
      .from("facility_crawl_results")
      .select("facility_seed_id, raw_result")
      .not("raw_result", "is", null)
      .range(start, end);

    if (error) throw error;

    const rows = (data ?? []) as CrawlFetchRow[];
    out.push(...rows);

    console.log("fetched crawl batch:", start, "to", end, "rows:", rows.length);

    if (rows.length < batchSize) break;
  }

  return out;
}

async function fetchSeedToSiteMap(seedIds: string[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const uniqueSeedIds = Array.from(new Set(seedIds.filter(Boolean)));
  const batchSize = 100;

  for (let start = 0; start < uniqueSeedIds.length; start += batchSize) {
    const batch = uniqueSeedIds.slice(start, start + batchSize);

    const { data, error } = await supabase
      .from("facility_seeds")
      .select("id, facility_site_id")
      .in("id", batch);

    if (error) throw error;

    for (const row of data ?? []) {
      if (row.id && row.facility_site_id) {
        out[row.id] = row.facility_site_id;
      }
    }
  }

  return out;
}

async function fetchTruthRows(limit = 5000): Promise<Record<string, any>> {
  const { data, error } = await supabase
    .from("facility_intelligence")
    .select(`
      facility_site_id,
      offers_detox,
      offers_residential,
      offers_php,
      offers_iop,
      dual_diagnosis_support,
      mat_supported
    `)
    .limit(limit);

  if (error) throw error;

  const map: Record<string, any> = {};
  for (const row of data ?? []) {
    map[row.facility_site_id] = row;
  }
  return map;
}

async function run(): Promise<void> {
  console.log("=== Queue B Clinical V1 ===");

  const crawlRows = await fetchCrawlRows(250);
  const seedToSiteMap = await fetchSeedToSiteMap(crawlRows.map((r) => r.facility_seed_id));
  const truthMap = await fetchTruthRows(5000);

  console.log("crawlRows:", crawlRows.length);
  console.log("seedToSiteMap:", Object.keys(seedToSiteMap).length);
  console.log("truthRows:", Object.keys(truthMap).length);

  const results: CandidateRow[] = [];

  for (const row of crawlRows) {
    const facilitySiteId = seedToSiteMap[row.facility_seed_id];
    if (!facilitySiteId) continue;

    const truth = truthMap[facilitySiteId];
    if (!truth) continue;

    const text = extractTextFromRawResult(row.raw_result);
    if (!text) continue;

    for (const tag of Object.keys(VOCAB) as Array<keyof typeof VOCAB>) {
      const phrases = VOCAB[tag];
      const supportingPhrases = phrases.filter((phrase) =>
        text.includes(normalizeText(phrase)),
      );

      if (!supportingPhrases.length) continue;

      const field = FIELD_MAP[tag];
      const truthValue = truth[field] ?? null;

      if (truthValue === false || truthValue === null) {
        results.push({
          facility_site_id: facilitySiteId,
          tag,
          field,
          truthValue,
          supporting_phrases: supportingPhrases,
          review_tier: getReviewTier(tag, supportingPhrases),
        });
      }
    }
  }

  console.log("Total candidates:", results.length);
  console.log(
    "review tier counts:",
    results.reduce(
      (acc, row) => {
        acc[row.review_tier] = (acc[row.review_tier] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  );

  fs.mkdirSync("tmp", { recursive: true });
  fs.writeFileSync("tmp/queue_b_clinical_v1.json", JSON.stringify(results, null, 2));
  console.log("Wrote tmp/queue_b_clinical_v1.json");
}

run().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
