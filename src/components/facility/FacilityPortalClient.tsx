"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type FacilityPortalRow = {
  id: string;
  name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  phone: string | null;
  website: string | null;
  programs_offered: string | null;
  primary_program: string | null;
  accepts_medicaid: boolean | null;
  accepts_private_insurance: boolean | null;
  accepts_self_pay: boolean | null;
  insurance_notes: string | null;
};

type Props = {
  facilityId: string | null;
};

type PortalStep =
  | "overview"
  | "programs"
  | "insurance"
  | "mat_medical"
  | "environment"
  | "contact";

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

function LabelValue({
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
      <div className="mt-2 text-sm text-slate-800">{value?.trim() || "—"}</div>
    </div>
  );
}

function BoolPill({
  label,
  active,
}: {
  label: string;
  active: boolean | null | undefined;
}) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      {label}
    </div>
  );
}

function ReadonlyPrompt({
  prompt,
  helper,
}: {
  prompt: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
      <div className="text-sm font-medium text-slate-900">{prompt}</div>
      <div className="mt-2 text-sm leading-6 text-slate-600">{helper}</div>
    </div>
  );
}

export default function FacilityPortalClient({ facilityId }: Props) {
  const [facility, setFacility] = useState<FacilityPortalRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<PortalStep>("overview");

  useEffect(() => {
    let cancelled = false;

    async function loadFacility() {
      if (!facilityId) {
        setFacility(null);
        setLoadError("Missing facilityId in URL.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      const { data, error } = await supabase
        .from("facility_sites")
        .select(`
          id,
          name,
          address_line1,
          address_line2,
          city,
          state,
          postal_code,
          country,
          phone,
          website,
          programs_offered,
          primary_program,
          accepts_medicaid,
          accepts_private_insurance,
          accepts_self_pay,
          insurance_notes
        `)
        .eq("id", facilityId)
        .single();

      if (cancelled) return;

      if (error || !data) {
        console.error("Error loading facility portal row:", error);
        setFacility(null);
        setLoadError("Unable to load this facility.");
        setIsLoading(false);
        return;
      }

      setFacility(data as FacilityPortalRow);
      setIsLoading(false);
    }

    void loadFacility();

    return () => {
      cancelled = true;
    };
  }, [facilityId]);

  const locationLine = useMemo(() => {
    if (!facility) return "—";
    return [facility.city, facility.state, facility.postal_code]
      .filter(Boolean)
      .join(", ");
  }, [facility]);

  const stepBase =
    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors";
  const stepInactive = "bg-white text-slate-700 hover:bg-slate-100";
  const stepActive = "bg-slate-900 text-white";

  function renderStepBody() {
    if (!facility) return null;

    switch (activeStep) {
      case "overview":
        return (
          <div className="space-y-6">
            <SectionCard
              eyebrow="Facility Portal"
              title={facility.name || "Facility"}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <LabelValue label="Location" value={locationLine} />
                <LabelValue label="Phone" value={facility.phone} />
                <LabelValue label="Website" value={facility.website} />
                <LabelValue
                  label="Primary program"
                  value={facility.primary_program}
                />
              </div>
            </SectionCard>

            <SectionCard title="How this portal works">
              <div className="space-y-3 text-sm leading-6 text-slate-700">
                <p>
                  NRIN starts with what the system currently understands about
                  your facility. This portal is where you confirm, correct, and
                  clarify that understanding.
                </p>
                <p>
                  Your responses do not automatically overwrite matcher truth.
                  They become facility claims or confirmations that NRIN can
                  review and verify.
                </p>
              </div>
            </SectionCard>
          </div>
        );

      case "programs":
        return (
          <SectionCard
            eyebrow="Onboarding — Program Offerings"
            title="What we currently understand about your program"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <LabelValue
                label="Primary program"
                value={facility.primary_program}
              />
              <LabelValue
                label="Programs offered"
                value={facility.programs_offered}
              />
            </div>
            <div className="mt-4">
              <ReadonlyPrompt
                prompt="Program confirmation flow comes next"
                helper="This page will show NRIN's current program understanding first, then allow the facility to confirm or adjust levels of care as facility-claimed truth without overwriting system-derived truth."
              />
            </div>
          </SectionCard>
        );

      case "insurance":
        return (
          <SectionCard
            eyebrow="Onboarding — Insurance"
            title="Current insurance understanding"
          >
            <div className="flex flex-wrap gap-2">
              <BoolPill label="Medicaid" active={facility.accepts_medicaid} />
              <BoolPill
                label="Private insurance"
                active={facility.accepts_private_insurance}
              />
              <BoolPill label="Self-pay" active={facility.accepts_self_pay} />
            </div>
            <div className="mt-4">
              <LabelValue
                label="Insurance notes"
                value={facility.insurance_notes}
              />
            </div>
            <div className="mt-4">
              <ReadonlyPrompt
                prompt="Carrier confirmation flow comes next"
                helper="This page will allow facilities to confirm whether NRIN's current insurance understanding is correct, paste exact carrier lists, and provide admissions/insurance contact paths as facility-claimed truth."
              />
            </div>
          </SectionCard>
        );

      case "mat_medical":
        return (
          <SectionCard
            eyebrow="Onboarding — MAT / Medical"
            title="MAT and medical clarification"
          >
            <ReadonlyPrompt
              prompt="MAT verification scaffold"
              helper="This page will tee up NRIN's current MAT / medical understanding and let the facility confirm, deny, or clarify medical support, medications, and admissions-relevant nuance."
            />
          </SectionCard>
        );

      case "environment":
        return (
          <SectionCard
            eyebrow="Onboarding — Environment"
            title="Environment narrative"
          >
            <ReadonlyPrompt
              prompt="Environment remains system-owned"
              helper="Facilities do not declare region, terrain, or local/out-of-area truth. This page will collect free-text narrative only: what the setting feels like for a patient considering treatment here."
            />
          </SectionCard>
        );

      case "contact":
        return (
          <SectionCard
            eyebrow="Onboarding — Contact / Admissions"
            title="Contact confirmation"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <LabelValue label="Current phone" value={facility.phone} />
              <LabelValue label="Current website" value={facility.website} />
            </div>
            <div className="mt-4">
              <ReadonlyPrompt
                prompt="Admissions contact confirmation comes next"
                helper="This page will let the facility confirm the correct admissions phone, website path, and preferred contact route for future verification and routing workflows."
              />
            </div>
          </SectionCard>
        );

      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Facility Portal
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Facility onboarding
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            This is the facility-facing portal. It is separate from NRIN’s
            internal dashboard and is intended to help a facility confirm,
            clarify, and shape how NRIN understands this specific location.
          </p>
        </header>

        {loadError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {loadError}
          </div>
        ) : isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Loading facility onboarding...
          </div>
        ) : !facility ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            No facility found.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {([
                  ["overview", "Overview"],
                  ["programs", "Program offerings"],
                  ["insurance", "Insurance"],
                  ["mat_medical", "MAT / medical"],
                  ["environment", "Environment"],
                  ["contact", "Contact"],
                ] as Array<[PortalStep, string]>).map(([step, label]) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setActiveStep(step)}
                    className={`${stepBase} ${
                      activeStep === step ? stepActive : stepInactive
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {renderStepBody()}
          </div>
        )}
      </main>
    </div>
  );
}
