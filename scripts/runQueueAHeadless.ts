import { INSURANCE_CARRIER_UNIVERSE } from "../src/crawler/config/insuranceCarrierUniverse";

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { crawlFacilityHeadless } from "../src/crawler/crawlFacilityHeadless";
import { CrawlPageResult, InsuranceDetection } from "../src/crawler/types";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const BATCH_SIZE = 150;

type QueueARow = {
  facility_site_id: string;
  confidence_score: number | null;
  accepts_private_insurance_detected: boolean | null;
  facility_sites:
  | {
    id: string;
    name: string | null;
    website: string | null;
  }
  | {
    id: string;
    name: string | null;
    website: string | null;
  }[]
  | null;
};

type QueueAWorkItem = {
  facilityId: string;
  facilityName: string | null;
  rootUrl: string;
  confidenceScore: number | null;
  acceptsPrivateInsuranceDetected: boolean | null;
};

type InterpretedInsuranceTruth = {
  acceptsPrivateInsuranceDetected: boolean;
  acceptedInsuranceProvidersDetected: string[];
  privateInsurancePhraseHits: string[];
  acceptsMedicaidDetected: boolean;
  acceptsMedicareDetected: boolean;
  canVerifyInsuranceOnlineDetected: boolean;
  hasCompositeInsuranceImageDetected: boolean;
};

const NON_PRIVATE_INSURANCE = new Set(["medicare", "medicaid"]);
const INSURANCE_PHRASES = [
  "commercial insurance",
  "most commercial insurance",
  "major insurance",
  "verify insurance",
  "in-network",
  "billing",
  "pricing",
];
const PRIVATE_INSURANCE_ACCEPTANCE_PHRASES = [
  "commercial insurance",
  "most commercial insurance",
  "most major insurance",
  "major insurance",
  "accept most insurance",
  "accept most major insurance",
  "verify your insurance",
  "verify insurance",
  "in-network with most",
];

const ONLINE_INSURANCE_VERIFICATION_PHRASES = [
  "insurance provider",
  "policy id",
  "member id",
  "subscriber id",
  "group number",
  "verify benefits",
  "verify your insurance",
  "insurance verification",
  "date of birth",
  "last 4 of ssn",
  "social security number",
];

function detectOnlineInsuranceVerification(pages: CrawlPageResult[]): boolean {
  let score = 0;

  for (const page of pages) {
    const haystack = `${page.title ?? ""}\n${page.rawText}`.toLowerCase();

    if (haystack.includes("insurance verification")) score += 2;
    if (haystack.includes("insurance provider")) score += 2;
    if (haystack.includes("policy id")) score += 2;
    if (haystack.includes("member id")) score += 2;
    if (haystack.includes("subscriber id")) score += 2;
    if (haystack.includes("group number")) score += 1;
    if (haystack.includes("verify benefits")) score += 2;
    if (haystack.includes("date of birth")) score += 1;
    if (haystack.includes("last 4 of ssn")) score += 2;
    if (haystack.includes("social security number")) score += 2;
  }

  return score >= 4;
}


function detectCompositeInsuranceImage(pages: CrawlPageResult[]): boolean {
  return pages.some((page) =>
    `${page.title ?? ""}\n${page.rawText}`
      .toLowerCase()
      .includes("composite_insurance_image_detected"),
  );
}

function pickFacilitySite(
  facilitySites: QueueARow["facility_sites"],
): { id: string; name: string | null; website: string | null } | null {
  if (!facilitySites) return null;
  if (Array.isArray(facilitySites)) return facilitySites[0] ?? null;
  return facilitySites;
}

function normalizeRootUrl(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function toQueueAWorkItem(row: QueueARow): QueueAWorkItem | null {
  const facilitySite = pickFacilitySite(row.facility_sites);
  const rootUrl = normalizeRootUrl(facilitySite?.website);

  if (!facilitySite?.id || !rootUrl) {
    return null;
  }

  return {
    facilityId: row.facility_site_id,
    facilityName: facilitySite.name,
    rootUrl,
    confidenceScore: row.confidence_score,
    acceptsPrivateInsuranceDetected:
      row.accepts_private_insurance_detected ?? null,
  };
}

function getPrivateInsurancePhraseHits(pages: CrawlPageResult[]): string[] {
  const hits = new Set<string>();

  for (const page of pages) {
    const haystack = `${page.title ?? ""}\n${page.rawText}`.toLowerCase();

    for (const phrase of PRIVATE_INSURANCE_ACCEPTANCE_PHRASES) {
      if (haystack.includes(phrase)) {
        hits.add(phrase);
      }
    }
  }

  return Array.from(hits).sort();
}


function extractCarriersFromRawText(pages: CrawlPageResult[]): string[] {
  const found = new Set<string>();

  for (const page of pages) {
    const text = `${page.title ?? ""}\n${page.rawText}`;

    for (const carrier of INSURANCE_CARRIER_UNIVERSE) {
      for (const pattern of carrier.patterns) {
        if (pattern.test(text)) {
          found.add(carrier.key);
        }
      }
    }
  }

  return Array.from(found).sort();
}

function interpretInsuranceTruth(
  detections: InsuranceDetection[],
  pages: CrawlPageResult[],
): InterpretedInsuranceTruth {
  const structuredCarriers = Array.from(
    new Set(
      detections
        .map((detection) => detection.normalizedName.trim().toLowerCase())
        .filter(Boolean)
        .filter((name) => !NON_PRIVATE_INSURANCE.has(name)),
    ),
  );

  const rawTextCarriers = extractCarriersFromRawText(pages);

  const acceptedInsuranceProvidersDetected = Array.from(
    new Set([...structuredCarriers, ...rawTextCarriers]),
  )
    .filter(
      (name) =>
        !NON_PRIVATE_INSURANCE.has(name) && name !== "va_community_care",
    )
    .sort();

  const privateInsurancePhraseHits = getPrivateInsurancePhraseHits(pages);

  const allDetected = new Set(
    detections.map((d) => d.normalizedName.trim().toLowerCase())
  );

  const acceptsMedicaidDetected =
    allDetected.has("medicaid") || rawTextCarriers.includes("medicaid");
  const acceptsMedicareDetected =
    allDetected.has("medicare") || rawTextCarriers.includes("medicare");
  const canVerifyInsuranceOnlineDetected =
    detectOnlineInsuranceVerification(pages);
  const hasCompositeInsuranceImageDetected =
    detectCompositeInsuranceImage(pages);

  return {
    acceptsPrivateInsuranceDetected:
      acceptedInsuranceProvidersDetected.length > 0 ||
      privateInsurancePhraseHits.length > 0 ||
      canVerifyInsuranceOnlineDetected ||
      hasCompositeInsuranceImageDetected,
    acceptedInsuranceProvidersDetected,
    privateInsurancePhraseHits,
    acceptsMedicaidDetected,
    acceptsMedicareDetected,
    canVerifyInsuranceOnlineDetected,
    hasCompositeInsuranceImageDetected,
  };
}

async function loadQueueA(): Promise<QueueARow[]> {
  const { data, error } = await supabase
    .from("facility_intelligence")
    .select(`
      facility_site_id,
      confidence_score,
      accepts_private_insurance_detected,
      facility_sites:facility_site_id (
        id,
        name,
        website
      )
    `)
    .gte("confidence_score", 75)
    .or("accepts_private_insurance_detected.is.null,accepts_private_insurance_detected.eq.false")
    .not("facility_sites.website", "is", null)
    .limit(3000);

  if (error) {
    throw new Error("Queue A fetch failed: " + error.message);
  }

  return (data ?? []) as QueueARow[];
}

async function persistInsuranceTruth(
  facilityId: string,
  interpretedInsurance: InterpretedInsuranceTruth,
) {
  const payload = {
    accepts_private_insurance_detected:
      interpretedInsurance.acceptsPrivateInsuranceDetected,
    accepted_insurance_providers_detected:
      interpretedInsurance.acceptedInsuranceProvidersDetected,
    accepts_medicaid_detected:
      interpretedInsurance.acceptsMedicaidDetected,
    accepts_medicare_detected:
      interpretedInsurance.acceptsMedicareDetected,
    can_verify_insurance_online_detected:
      interpretedInsurance.canVerifyInsuranceOnlineDetected,
  };

  const { error } = await supabase
    .from("facility_intelligence")
    .update(payload)
    .eq("facility_site_id", facilityId);

  if (error) {
    throw new Error("Queue A writeback failed: " + error.message);
  }

  return payload;
}

async function processWorkItem(item: QueueAWorkItem, index: number, total: number) {
  console.log(`Queue A batch item ${index}/${total}: starting`, item);

  const result = await crawlFacilityHeadless({
    facilityId: item.facilityId,
    rootUrl: item.rootUrl,
  });

  const interpretedInsurance = interpretInsuranceTruth(
    result.insuranceDetections,
    result.pages,
  );

  console.log(`Queue A batch item ${index}/${total}: crawl summary`, {
    facilityId: result.facilityId,
    facilityName: item.facilityName,
    rootUrl: result.rootUrl,
    pagesFetched: result.pages.length,
    okPages: result.pages.filter((page) => page.ok).length,
    insuranceDetections: result.insuranceDetections.map((detection) => ({
      normalizedName: detection.normalizedName,
      mentions: detection.rawMentions.length,
      evidence: detection.evidence.length,
    })),
    privateInsurancePhraseHits: interpretedInsurance.privateInsurancePhraseHits,
    canVerifyInsuranceOnlineDetected:
      interpretedInsurance.canVerifyInsuranceOnlineDetected,
    hasCompositeInsuranceImageDetected:
      interpretedInsurance.hasCompositeInsuranceImageDetected,
    nextAcceptsPrivateInsuranceDetected:
      interpretedInsurance.acceptsPrivateInsuranceDetected,
    nextAcceptedInsuranceProvidersDetected:
      interpretedInsurance.acceptedInsuranceProvidersDetected,
  });

  console.log(`Queue A batch item ${index}/${total}: fetched pages`, result.pages.map((page) => ({
    ok: page.ok,
    status: page.status,
    title: page.title,
    url: page.url,
  })));

  console.log(`Queue A batch item ${index}/${total}: phrase hits by page`, result.pages.map((page) => {
    const haystack = `${page.title ?? ""}\n${page.rawText}`.toLowerCase();
    return {
      url: page.url,
      title: page.title,
      hits: INSURANCE_PHRASES.filter((phrase) => haystack.includes(phrase)),
      verificationHits: ONLINE_INSURANCE_VERIFICATION_PHRASES.filter((phrase) =>
        haystack.includes(phrase)
      ),
    };
  }));

  const persistedPayload = await persistInsuranceTruth(
    item.facilityId,
    interpretedInsurance,
  );

  console.log(`Queue A batch item ${index}/${total}: persisted`, {
    facilityId: item.facilityId,
    facilityName: item.facilityName,
    payload: persistedPayload,
  });

  return interpretedInsurance;
}


async function main() {

  let summary = {
    processed: 0,
    acceptsPrivate: 0,
    hasImage: 0,
    verifyOnline: 0,
    noSignal: 0
  };

  console.log("runQueueAHeadless: starting...");

  const queueA = await loadQueueA();
  const workItems = queueA.map(toQueueAWorkItem).filter(Boolean) as QueueAWorkItem[];
  const batch = workItems.slice(0, BATCH_SIZE);

  console.log("Queue A loaded:", {
    rows: queueA.length,
    runnable: workItems.length,
    batchSize: batch.length,
    sample: batch,
  });

  for (let i = 0; i < batch.length; i += 1) {
    const result = await processWorkItem(batch[i], i + 1, batch.length);

    summary.processed += 1;

    if (result.acceptsPrivateInsuranceDetected) {
      summary.acceptsPrivate += 1;
    }

    if (result.hasCompositeInsuranceImageDetected) {
      summary.hasImage += 1;
    }

    if (result.canVerifyInsuranceOnlineDetected) {
      summary.verifyOnline += 1;
    }

    if (
      !result.acceptsPrivateInsuranceDetected &&
      !result.hasCompositeInsuranceImageDetected &&
      !result.canVerifyInsuranceOnlineDetected
    ) {
      summary.noSignal += 1;
    }
    
  }

    console.log("\n--- QUEUE A SUMMARY ---");
  console.log(summary);
  console.log("------------------------\n");

  console.log("runQueueAHeadless: finished.");
}

main().catch((err) => {
  console.error("runQueueAHeadless: fatal error", err);
  process.exit(1);
});
