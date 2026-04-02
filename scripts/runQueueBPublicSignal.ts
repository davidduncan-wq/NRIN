import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

type QueueBRow = {
  facility_site_id: string;
  facility_sites: {
    name: string | null;
    website: string | null;
  } | null;
};

async function loadQueueB(): Promise<QueueBRow[]> {
  const { data, error } = await supabase
    .from("facility_intelligence")
    .select(`
      facility_site_id,
      facility_sites:facility_site_id (
        name,
        website
      )
    `)
    .limit(50);

  if (error) {
    throw new Error("Queue B fetch failed: " + error.message);
  }

  return (data ?? []).map((row: any) => ({
  ...row,
  facility_sites: Array.isArray(row.facility_sites) ? row.facility_sites[0] : row.facility_sites
})) as QueueBRow[];
}

function inferPublicFacility(name: string | null, website: string | null): boolean {
  const n = (name ?? "").toLowerCase();
  const w = (website ?? "").toLowerCase();

  let score = 0;

  // STRONG PUBLIC SIGNALS
  if (w.includes(".gov")) score += 3;
  if (n.includes("county")) score += 2;
  if (n.includes("behavioral health")) score += 2;
  if (n.includes("community health")) score += 2;
  if (n.includes("mental health center")) score += 2;
  if (n.includes("state hospital")) score += 2;

  // MEDIUM SIGNALS
  if (n.includes("services")) score += 1;
  if (n.includes("clinic")) score += 1;
  if (n.includes("outreach")) score += 1;
  if (n.includes("treatment authority")) score += 2;

  // NEGATIVE (PRIVATE / COMMERCIAL SIGNALS)
  if (n.includes("llc")) score -= 2;
  if (n.includes("recovery")) score -= 1;
  if (n.includes("wellness")) score -= 1;
  if (n.includes("detox")) score -= 1;

  return score >= 2;
}

async function persist(
  facilityId: string,
  payload: {
    public_facility_signal: boolean;
    registry_match_confidence: number;
  }
) {
  const { error } = await supabase
    .from("facility_intelligence")
    .update(payload)
    .eq("facility_site_id", facilityId);

  if (error) {
    throw new Error("Persist failed: " + error.message);
  }
}

async function main() {
  console.log("runQueueBPublicSignal: starting...");

  const rows = await loadQueueB();

  console.log("Queue B loaded:", {
    count: rows.length,
    sample: rows.slice(0, 3),
  });

  for (const row of rows) {
    const name = row.facility_sites?.name ?? null;
    const website = row.facility_sites?.website ?? null;

    const publicSignal = inferPublicFacility(name, website);

    const payload = {
      public_facility_signal: publicSignal,
      registry_match_confidence: publicSignal ? 0.6 : 0,
    };

    await persist(row.facility_site_id, payload);

    console.log("Queue B updated:", {
      facilityId: row.facility_site_id,
      name,
      payload,
    });
  }

  console.log("runQueueBPublicSignal: finished.");
}

main().catch((err) => {
  console.error("runQueueBPublicSignal: fatal error", err);
  process.exit(1);
});
