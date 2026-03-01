import { NextRequest, NextResponse } from "next/server";

type FrequencyBucket =
  | "daily"
  | "3-5"
  | "1-2"
  | "less"
  | "unknown";

type LastUseBucket =
  | "today"
  | "yesterday"
  | "2-3"
  | "4-7"
  | "8-30"
  | "unknown";

interface IntakeInput {
  substances: string[];
  lastUse: LastUseBucket;
  frequency: FrequencyBucket;
  dailyAlcoholOrBenzo: "yes" | "no" | "unknown";
  severeWithdrawalHistory: "yes" | "no" | "unknown";
  withdrawalSymptomsNow: "yes" | "no" | "unknown";

  priorTreatment: "yes" | "no" | "unknown";
  relapseTiming?: "30" | "90" | "90plus" | "none" | "unknown";

  mhMeds: "yes" | "no" | "unknown";
  mhHospitalization: "yes" | "no" | "unknown";

  supportivePerson: "yes" | "no" | "unknown";
  housingStable: "yes" | "no" | "unknown";
}

function deriveWithdrawalRisk(input: IntakeInput) {
  const substances = input.substances ?? [];
const usesAlcohol = substances.includes("alcohol");
const usesBenzo = substances.includes("benzodiazepines");

  if (input.severeWithdrawalHistory === "yes") return "high";

  if (
    (usesAlcohol || usesBenzo) &&
    input.frequency === "daily" &&
    (input.lastUse === "today" || input.lastUse === "yesterday")
  ) {
    return input.withdrawalSymptomsNow === "yes" ? "high" : "medium";
  }

  return "low";
}

function deriveRelapseRisk(input: IntakeInput) {
  if (input.priorTreatment === "yes") {
    if (input.relapseTiming === "30") return "high";
    if (input.relapseTiming === "90") return "high";
    if (input.relapseTiming === "90plus") return "medium";
  }

  if (input.frequency === "daily") return "medium";

  return "low";
}

function deriveCoOccurringNeed(input: IntakeInput) {
  if (input.mhHospitalization === "yes") return "likely";
  if (input.mhMeds === "yes") return "possible";
  return "none";
}

function deriveSupportLevel(input: IntakeInput) {
  if (input.supportivePerson === "no") return "low";
  if (input.supportivePerson === "unknown") return "medium";
  return "high";
}

function deriveLevelOfCare(
  withdrawalRisk: string,
  relapseRisk: string,
  coOccurring: string,
  supportLevel: string,
  housingStable: string
) {
  if (withdrawalRisk === "high") return "detox";

  const residentialTriggers = [
    housingStable === "no",
    relapseRisk === "high",
    supportLevel === "low",
    coOccurring === "likely",
  ].filter(Boolean).length;

  if (residentialTriggers >= 2) return "residential";

  if (residentialTriggers === 1) return "php";

  return "iop";
}

export async function POST(req: NextRequest) {
  const body: IntakeInput = await req.json();

  const withdrawalRisk = deriveWithdrawalRisk(body);
  const relapseRisk = deriveRelapseRisk(body);
  const coOccurring = deriveCoOccurringNeed(body);
  const supportLevel = deriveSupportLevel(body);

  const recommendedLevelOfCare = deriveLevelOfCare(
    withdrawalRisk,
    relapseRisk,
    coOccurring,
    supportLevel,
    body.housingStable
  );

  return NextResponse.json({
    withdrawalRisk,
    relapseRisk,
    coOccurring,
    supportLevel,
    recommendedLevelOfCare,
  });
}