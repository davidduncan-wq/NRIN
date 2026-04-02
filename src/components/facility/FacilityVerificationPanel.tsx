"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { TreatmentCenterRow } from "@/app/facility/dashboard/page";

type Props = {
  center: TreatmentCenterRow | null;
  onAdvanceQueue?: () => void;
};

type ReviewStatus =
  | "in_review"
  | "verified_web"
  | "verified_phone"
  | "verified_both"
  | "skipped";

type ReviewMethod = "web" | "phone" | "both";

type QueueCReviewRow = {
  id: string;
  facility_site_id: string;
  review_status: ReviewStatus;
  review_method: ReviewMethod;
  accepts_private: boolean | null;
  accepts_medicaid: boolean | null;
  accepts_medicare: boolean | null;
  accepts_va_tricare: boolean | null;
  accepts_tribal: boolean | null;
  accepts_self_pay: boolean | null;
  selected_major_carriers: string[] | null;
  other_carriers_text: string | null;
  exact_source_text: string | null;
  source_url: string | null;
  review_notes: string | null;
  skipped_to_back_of_queue: boolean;
  offers_detox_reviewed: boolean | null;
  offers_residential_reviewed: boolean | null;
  offers_php_reviewed: boolean | null;
  offers_iop_reviewed: boolean | null;
  offers_outpatient_reviewed: boolean | null;
  offers_aftercare_reviewed: boolean | null;
  mat_supported_reviewed: boolean | null;
  family_program_reviewed: boolean | null;
  created_at: string;
  updated_at: string;
};

type FacilityIntelligenceRow = {
  offers_detox: boolean | null;
  offers_residential: boolean | null;
  offers_php: boolean | null;
  offers_iop: boolean | null;
  offers_outpatient: boolean | null;
  offers_aftercare: boolean | null;
  mat_supported: boolean | null;
  family_therapy_program: boolean | null;
};

const MAJOR_CARRIERS = [
  "Aetna",
  "Anthem",
  "Blue Cross Blue Shield",
  "Cigna",
  "UnitedHealthcare / Optum",
  "Humana",
  "Kaiser Permanente",
  "Health Net",
  "Molina",
  "Carelon / Beacon",
  "Magellan",
  "Ambetter",
  "Providence",
] as const;

const COMMON_PPO_SET = new Set([
  "Aetna",
  "Anthem",
  "Blue Cross Blue Shield",
  "Cigna",
  "UnitedHealthcare / Optum",
  "Humana",
  "Kaiser Permanente",
]);

function SectionCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {eyebrow ? (
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="mt-1 text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function TogglePill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  );
}

function ReadonlyField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 break-words text-sm text-slate-800">
        {value?.trim() || "—"}
      </div>
    </div>
  );
}

function ProgramPill({
  label,
  systemValue,
  reviewedValue,
  onToggle,
}: {
  label: string;
  systemValue: boolean | null;
  reviewedValue: boolean | null;
  onToggle: () => void;
}) {
  const displayValue =
    reviewedValue === null
      ? systemValue === null
        ? "—"
        : systemValue
          ? "Yes"
          : "No"
      : reviewedValue
        ? "Yes"
        : "No";

  const active = reviewedValue === null ? systemValue === true : reviewedValue === true;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
      }`}
    >
      {label} {displayValue}
    </button>
  );
}

export default function FacilityVerificationPanel({
  center,
  onAdvanceQueue,
}: Props) {
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [intelligence, setIntelligence] = useState<FacilityIntelligenceRow | null>(null);

  const [acceptsPrivate, setAcceptsPrivate] = useState<boolean | null>(null);
  const [acceptsMedicaid, setAcceptsMedicaid] = useState<boolean | null>(null);
  const [acceptsMedicare, setAcceptsMedicare] = useState<boolean | null>(null);
  const [acceptsVA, setAcceptsVA] = useState<boolean | null>(null);
  const [acceptsTribal, setAcceptsTribal] = useState<boolean | null>(null);
  const [acceptsSelfPay, setAcceptsSelfPay] = useState<boolean | null>(null);

  const [offersDetoxReviewed, setOffersDetoxReviewed] = useState<boolean | null>(null);
  const [offersResidentialReviewed, setOffersResidentialReviewed] = useState<boolean | null>(null);
  const [offersPhpReviewed, setOffersPhpReviewed] = useState<boolean | null>(null);
  const [offersIopReviewed, setOffersIopReviewed] = useState<boolean | null>(null);
  const [offersOutpatientReviewed, setOffersOutpatientReviewed] = useState<boolean | null>(null);
  const [offersAftercareReviewed, setOffersAftercareReviewed] = useState<boolean | null>(null);
  const [matSupportedReviewed, setMatSupportedReviewed] = useState<boolean | null>(null);
  const [familyProgramReviewed, setFamilyProgramReviewed] = useState<boolean | null>(null);

  const [selectedCarriers, setSelectedCarriers] = useState<string[]>([]);
  const [otherCarriers, setOtherCarriers] = useState("");
  const [exactSourceText, setExactSourceText] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [reviewMethod, setReviewMethod] = useState<ReviewMethod>("web");
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("in_review");
  const [reviewNotes, setReviewNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const locationLine = useMemo(() => {
    if (!center) return "—";
    return [center.city, center.state, center.postal_code].filter(Boolean).join(", ");
  }, [center]);

  function resetForm() {
    setReviewId(null);
    setIntelligence(null);

    setAcceptsPrivate(null);
    setAcceptsMedicaid(null);
    setAcceptsMedicare(null);
    setAcceptsVA(null);
    setAcceptsTribal(null);
    setAcceptsSelfPay(null);

    setOffersDetoxReviewed(null);
    setOffersResidentialReviewed(null);
    setOffersPhpReviewed(null);
    setOffersIopReviewed(null);
    setOffersOutpatientReviewed(null);
    setOffersAftercareReviewed(null);
    setMatSupportedReviewed(null);
    setFamilyProgramReviewed(null);

    setSelectedCarriers([]);
    setOtherCarriers("");
    setExactSourceText("");
    setSourceUrl("");
    setReviewMethod("web");
    setReviewStatus("in_review");
    setReviewNotes("");
    setSaveMessage(null);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadEverything() {
      resetForm();

      if (!center?.id) return;

      setIsLoadingReview(true);

      const [reviewResult, intelligenceResult] = await Promise.all([
        supabase
          .from("facility_queue_c_reviews")
          .select("*")
          .eq("facility_site_id", center.id)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("facility_intelligence")
          .select(`
            offers_detox,
            offers_residential,
            offers_php,
            offers_iop,
            offers_outpatient,
            offers_aftercare,
            mat_supported,
            family_therapy_program
          `)
          .eq("facility_site_id", center.id)
          .maybeSingle(),
      ]);

      if (cancelled) return;

      setIsLoadingReview(false);

      if (intelligenceResult.error) {
        console.error("Error loading facility intelligence:", intelligenceResult.error);
      } else {
        setIntelligence((intelligenceResult.data as FacilityIntelligenceRow | null) ?? null);
      }

      if (reviewResult.error) {
        console.error("Error loading Queue C review:", reviewResult.error);
        setSaveMessage("Could not load prior review.");
        return;
      }

      const review = reviewResult.data as QueueCReviewRow | null;
      if (!review) {
        setSaveMessage("No prior review yet.");
        return;
      }

      setReviewId(review.id);
      setAcceptsPrivate(review.accepts_private);
      setAcceptsMedicaid(review.accepts_medicaid);
      setAcceptsMedicare(review.accepts_medicare);
      setAcceptsVA(review.accepts_va_tricare);
      setAcceptsTribal(review.accepts_tribal);
      setAcceptsSelfPay(review.accepts_self_pay);

      setOffersDetoxReviewed(review.offers_detox_reviewed);
      setOffersResidentialReviewed(review.offers_residential_reviewed);
      setOffersPhpReviewed(review.offers_php_reviewed);
      setOffersIopReviewed(review.offers_iop_reviewed);
      setOffersOutpatientReviewed(review.offers_outpatient_reviewed);
      setOffersAftercareReviewed(review.offers_aftercare_reviewed);
      setMatSupportedReviewed(review.mat_supported_reviewed);
      setFamilyProgramReviewed(review.family_program_reviewed);

      setSelectedCarriers(review.selected_major_carriers ?? []);
      setOtherCarriers(review.other_carriers_text ?? "");
      setExactSourceText(review.exact_source_text ?? "");
      setSourceUrl(review.source_url ?? "");
      setReviewMethod(review.review_method ?? "web");
      setReviewStatus(review.review_status ?? "in_review");
      setReviewNotes(review.review_notes ?? "");
      setSaveMessage("Loaded existing review.");
    }

    void loadEverything();

    return () => {
      cancelled = true;
    };
  }, [center?.id]);

  function toggleTriState(
    value: boolean | null,
    setter: React.Dispatch<React.SetStateAction<boolean | null>>,
  ) {
    if (value === null) setter(true);
    else if (value === true) setter(false);
    else setter(null);
  }

  function toggleCarrier(carrier: string) {
    setSelectedCarriers((prev) =>
      prev.includes(carrier)
        ? prev.filter((item) => item !== carrier)
        : [...prev, carrier],
    );
  }

  function selectAllCarriers() {
    setSelectedCarriers([...MAJOR_CARRIERS]);
  }

  function selectCommonPPOs() {
    setSelectedCarriers(
      MAJOR_CARRIERS.filter((carrier) => COMMON_PPO_SET.has(carrier)),
    );
  }

  function clearCarriers() {
    setSelectedCarriers([]);
  }

  function skipFacility() {
    setReviewStatus("skipped");
    setReviewNotes((prev) =>
      prev.trim().length > 0
        ? prev
        : "Skipped for now. Send this facility to the back of the Queue C line.",
    );
    setSaveMessage("Marked as skipped locally. Save or submit to persist.");
  }

  async function persistReview(nextStatusOverride?: ReviewStatus) {
    if (!center?.id) return { ok: false };

    const effectiveStatus = nextStatusOverride ?? reviewStatus;

    const payload = {
      facility_site_id: center.id,
      review_status: effectiveStatus,
      review_method: reviewMethod,
      accepts_private: acceptsPrivate,
      accepts_medicaid: acceptsMedicaid,
      accepts_medicare: acceptsMedicare,
      accepts_va_tricare: acceptsVA,
      accepts_tribal: acceptsTribal,
      accepts_self_pay: acceptsSelfPay,
      offers_detox_reviewed: offersDetoxReviewed,
      offers_residential_reviewed: offersResidentialReviewed,
      offers_php_reviewed: offersPhpReviewed,
      offers_iop_reviewed: offersIopReviewed,
      offers_outpatient_reviewed: offersOutpatientReviewed,
      offers_aftercare_reviewed: offersAftercareReviewed,
      mat_supported_reviewed: matSupportedReviewed,
      family_program_reviewed: familyProgramReviewed,
      selected_major_carriers: selectedCarriers,
      other_carriers_text: otherCarriers || null,
      exact_source_text: exactSourceText || null,
      source_url: sourceUrl || null,
      review_notes: reviewNotes || null,
      skipped_to_back_of_queue: effectiveStatus === "skipped",
      updated_at: new Date().toISOString(),
    };

    let error: { message?: string } | null = null;
    let data: { id: string }[] | null = null;

    if (reviewId) {
      const result = await supabase
        .from("facility_queue_c_reviews")
        .update(payload)
        .eq("id", reviewId)
        .select("id");
      error = result.error;
      data = result.data as { id: string }[] | null;
    } else {
      const result = await supabase
        .from("facility_queue_c_reviews")
        .insert(payload)
        .select("id");
      error = result.error;
      data = result.data as { id: string }[] | null;
    }

    if (error) {
      console.error("Error saving Queue C review:", error);
      setSaveMessage(`Save failed: ${error.message ?? "unknown error"}`);
      return { ok: false };
    }

    const nextId = data?.[0]?.id ?? reviewId ?? null;
    setReviewId(nextId);
    setReviewStatus(effectiveStatus);
    return { ok: true };
  }

  async function saveDraft() {
    setIsSaving(true);
    setSaveMessage(null);
    const result = await persistReview();
    setIsSaving(false);
    if (result.ok) setSaveMessage("Draft saved.");
  }

  async function submitAndNext() {
    const nextStatus: ReviewStatus =
      reviewMethod === "both"
        ? "verified_both"
        : reviewMethod === "phone"
          ? "verified_phone"
          : "verified_web";

    setIsSaving(true);
    setSaveMessage(null);
    const result = await persistReview(nextStatus);
    setIsSaving(false);

    if (!result.ok) return;

    setSaveMessage("Submitted. Loading next facility...");
    onAdvanceQueue?.();
  }

  if (!center) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
        Select a facility from the directory to begin Queue C review.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionCard eyebrow="Queue C" title="NRIN internal review">
        <div className="grid gap-4 md:grid-cols-2">
          <ReadonlyField label="Facility" value={center.name} />
          <ReadonlyField label="Location" value={locationLine} />
          <ReadonlyField label="Phone" value={center.phone} />
          <ReadonlyField label="Website" value={center.website} />
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          Evidence-first review. Use the current NRIN understanding below, correct what is obviously
          wrong, and only click through to the source site as a last resort.
        </div>
      </SectionCard>

      <SectionCard eyebrow="Current system understanding" title="What NRIN currently thinks">
        <div className="grid gap-4 md:grid-cols-2">
          <ReadonlyField label="Primary program" value={center.primary_program} />
          <ReadonlyField label="Programs offered" value={center.programs_offered} />
          <ReadonlyField
            label="Detected levels of care"
            value={[
              intelligence?.offers_detox ? "Detox" : null,
              intelligence?.offers_residential ? "Residential" : null,
              intelligence?.offers_php ? "PHP" : null,
              intelligence?.offers_iop ? "IOP" : null,
              intelligence?.offers_outpatient ? "Outpatient" : null,
              intelligence?.offers_aftercare ? "Aftercare" : null,
            ]
              .filter(Boolean)
              .join(", ") || "—"}
          />
          <ReadonlyField
            label="Detected MAT / family"
            value={[
              intelligence?.mat_supported ? "MAT supported" : null,
              intelligence?.family_therapy_program ? "Family program" : null,
            ]
              .filter(Boolean)
              .join(", ") || "—"}
          />
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium text-slate-900">Reviewed program truth</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <ProgramPill
              label="Detox"
              systemValue={intelligence?.offers_detox ?? null}
              reviewedValue={offersDetoxReviewed}
              onToggle={() => toggleTriState(offersDetoxReviewed, setOffersDetoxReviewed)}
            />
            <ProgramPill
              label="Residential"
              systemValue={intelligence?.offers_residential ?? null}
              reviewedValue={offersResidentialReviewed}
              onToggle={() => toggleTriState(offersResidentialReviewed, setOffersResidentialReviewed)}
            />
            <ProgramPill
              label="PHP"
              systemValue={intelligence?.offers_php ?? null}
              reviewedValue={offersPhpReviewed}
              onToggle={() => toggleTriState(offersPhpReviewed, setOffersPhpReviewed)}
            />
            <ProgramPill
              label="IOP"
              systemValue={intelligence?.offers_iop ?? null}
              reviewedValue={offersIopReviewed}
              onToggle={() => toggleTriState(offersIopReviewed, setOffersIopReviewed)}
            />
            <ProgramPill
              label="Outpatient"
              systemValue={intelligence?.offers_outpatient ?? null}
              reviewedValue={offersOutpatientReviewed}
              onToggle={() => toggleTriState(offersOutpatientReviewed, setOffersOutpatientReviewed)}
            />
            <ProgramPill
              label="Aftercare"
              systemValue={intelligence?.offers_aftercare ?? null}
              reviewedValue={offersAftercareReviewed}
              onToggle={() => toggleTriState(offersAftercareReviewed, setOffersAftercareReviewed)}
            />
            <ProgramPill
              label="MAT"
              systemValue={intelligence?.mat_supported ?? null}
              reviewedValue={matSupportedReviewed}
              onToggle={() => toggleTriState(matSupportedReviewed, setMatSupportedReviewed)}
            />
            <ProgramPill
              label="Family"
              systemValue={intelligence?.family_therapy_program ?? null}
              reviewedValue={familyProgramReviewed}
              onToggle={() => toggleTriState(familyProgramReviewed, setFamilyProgramReviewed)}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard eyebrow="Insurance review" title="Queue C carrier verification">
        <div className="space-y-5">
          <div>
            <div className="text-sm font-medium text-slate-900">Coverage types</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <TogglePill
                label={`Private ${acceptsPrivate === null ? "—" : acceptsPrivate ? "Yes" : "No"}`}
                active={acceptsPrivate === true}
                onClick={() => toggleTriState(acceptsPrivate, setAcceptsPrivate)}
              />
              <TogglePill
                label={`Medicaid ${acceptsMedicaid === null ? "—" : acceptsMedicaid ? "Yes" : "No"}`}
                active={acceptsMedicaid === true}
                onClick={() => toggleTriState(acceptsMedicaid, setAcceptsMedicaid)}
              />
              <TogglePill
                label={`Medicare ${acceptsMedicare === null ? "—" : acceptsMedicare ? "Yes" : "No"}`}
                active={acceptsMedicare === true}
                onClick={() => toggleTriState(acceptsMedicare, setAcceptsMedicare)}
              />
              <TogglePill
                label={`VA / Tricare ${acceptsVA === null ? "—" : acceptsVA ? "Yes" : "No"}`}
                active={acceptsVA === true}
                onClick={() => toggleTriState(acceptsVA, setAcceptsVA)}
              />
              <TogglePill
                label={`Tribal ${acceptsTribal === null ? "—" : acceptsTribal ? "Yes" : "No"}`}
                active={acceptsTribal === true}
                onClick={() => toggleTriState(acceptsTribal, setAcceptsTribal)}
              />
              <TogglePill
                label={`Self-pay ${acceptsSelfPay === null ? "—" : acceptsSelfPay ? "Yes" : "No"}`}
                active={acceptsSelfPay === true}
                onClick={() => toggleTriState(acceptsSelfPay, setAcceptsSelfPay)}
              />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-medium text-slate-900">Major carriers</div>
              <button
                type="button"
                onClick={selectAllCarriers}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={selectCommonPPOs}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Common PPOs
              </button>
              <button
                type="button"
                onClick={clearCarriers}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Clear all
              </button>
            </div>

            <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {MAJOR_CARRIERS.map((carrier) => {
                const active = selectedCarriers.includes(carrier);
                return (
                  <button
                    key={carrier}
                    type="button"
                    onClick={() => toggleCarrier(carrier)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                      active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-medium">{carrier}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {active ? "Selected" : "Not selected"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <div className="text-sm font-medium text-slate-900">
                Other carriers — not major
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Enter one per line or comma-separated. These should later feed NRIN suggestions.
              </div>
              <textarea
                value={otherCarriers}
                onChange={(e) => setOtherCarriers(e.target.value)}
                rows={6}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-sky-300"
                placeholder={"IEHP\nHMSA\nFirst Health"}
              />
            </label>

            <label className="block">
              <div className="text-sm font-medium text-slate-900">Exact source text</div>
              <div className="mt-1 text-xs text-slate-500">
                Paste exactly what the website or staff member said.
              </div>
              <textarea
                value={exactSourceText}
                onChange={(e) => setExactSourceText(e.target.value)}
                rows={6}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-sky-300"
                placeholder="We accept Aetna, Cigna, Blue Cross Blue Shield, and some out-of-network PPO plans..."
              />
            </label>
          </div>
        </div>
      </SectionCard>

      <SectionCard eyebrow="Evidence / submission" title="Review outcome">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <div className="text-sm font-medium text-slate-900">Source URL</div>
            <input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-sky-300"
              placeholder="https://..."
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-900">Review method</div>
            <select
              value={reviewMethod}
              onChange={(e) => setReviewMethod(e.target.value as ReviewMethod)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-sky-300"
            >
              <option value="web">Verified by web</option>
              <option value="phone">Verified by phone</option>
              <option value="both">Verified by both</option>
            </select>
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-900">Review status</div>
            <select
              value={reviewStatus}
              onChange={(e) => setReviewStatus(e.target.value as ReviewStatus)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-sky-300"
            >
              <option value="in_review">In review</option>
              <option value="verified_web">Verified by web</option>
              <option value="verified_phone">Verified by phone</option>
              <option value="verified_both">Verified by both</option>
              <option value="skipped">Skipped</option>
            </select>
          </label>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-medium text-slate-900">Queue actions</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={saveDraft}
                disabled={isSaving || isLoadingReview}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save draft"}
              </button>
              <button
                type="button"
                onClick={submitAndNext}
                disabled={isSaving || isLoadingReview}
                className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-800 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? "Submitting..." : "Submit + next"}
              </button>
              <button
                type="button"
                onClick={skipFacility}
                disabled={isSaving || isLoadingReview}
                className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Skip facility
              </button>
            </div>
            <div className="mt-3 text-xs leading-5 text-slate-500">
              Skip should send this facility to the back of the Queue C line.
            </div>
            {saveMessage ? (
              <div className="mt-3 text-xs font-medium text-sky-700">{saveMessage}</div>
            ) : null}
          </div>
        </div>

        <div className="mt-4">
          <label className="block">
            <div className="text-sm font-medium text-slate-900">Reviewer notes</div>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-sky-300"
              placeholder="Internal Queue C notes..."
            />
          </label>
        </div>
      </SectionCard>
    </div>
  );
}
