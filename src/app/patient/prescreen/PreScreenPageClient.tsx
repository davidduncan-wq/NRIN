"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function ChoicePill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-sky-300 bg-sky-50 text-sky-900"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

function SectionShell({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-2">
        {eyebrow && (
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            {eyebrow}
          </div>
        )}
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="text-sm leading-6 text-slate-600">{body}</p>
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}

type Props = {
  facilityId: string;
  facilityName: string;
  facilityLocation: string;
  patientId: string;
  caseId: string;
  matchScore: string;
  recommendedProgramType: string;
  insuranceStatus: string;
  insuranceType: string;
  selfPayIntent: string;
};

export default function PreScreenPageClient({
  facilityId,
  facilityName,
  facilityLocation,
  patientId,
  caseId,
  matchScore,
  recommendedProgramType,
  insuranceStatus: intakeInsuranceStatus,
  insuranceType: intakeInsuranceType,
  selfPayIntent: intakeSelfPayIntent,
}: Props) {
  const router = useRouter();

  const initialPaymentPath =
    intakeInsuranceStatus === "yes"
      ? "insurance"
      : intakeInsuranceStatus === "no" && intakeSelfPayIntent === "yes"
        ? "self_pay"
        : intakeInsuranceStatus === "no" && intakeSelfPayIntent === "no"
          ? "public_funding"
          : "";

  const initialInsuranceType =
    intakeInsuranceStatus === "yes" ? intakeInsuranceType : "";

  const [form, setForm] = useState({
    canTravel: "",
    timeline: "",
    legalIssues: "",
    paymentPath: initialPaymentPath,
    insuranceType: initialInsuranceType,
    insuranceCarrierName: "",
    selfPayConfirmed: intakeSelfPayIntent === "yes" ? "yes" : "",
  });

  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  const ratificationReady = useMemo(() => {
    if (form.paymentPath === "insurance") {
      return !!form.insuranceType && form.insuranceCarrierName.trim().length > 1;
    }

    if (form.paymentPath === "self_pay") {
      return form.selfPayConfirmed === "yes";
    }

    if (form.paymentPath === "public_funding") {
      return true;
    }

    return false;
  }, [form]);

  function normalizeCarrier(name: string): string | null {
    const n = name.toLowerCase();

    if (n.includes("aetna")) return "aetna";
    if (n.includes("cigna")) return "cigna";
    if (n.includes("blue cross") || n.includes("bcbs")) return "blue_cross_blue_shield";
    if (n.includes("united")) return "united_healthcare";
    if (n.includes("humana")) return "humana";
    if (n.includes("anthem")) return "anthem";
    if (n.includes("tricare")) return "tricare";
    if (n.includes("medicare")) return "medicare";
    if (n.includes("medicaid")) return "medicaid";

    return null;
  }

  async function handleContinue() {
    if (!patientId || !caseId || !facilityId) {
      console.error("Missing routing data", { patientId, caseId, facilityId });
      alert("Something went wrong. Please try again.");
      return;
    }

    if (!ratificationReady) {
      alert("Please complete the payment section before continuing.");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (form.paymentPath === "public_funding") {
        router.push("/patient/indigent-path");
        return;
      }

      const normalizedCarrier = normalizeCarrier(form.insuranceCarrierName);
      const noteParts = [
        form.canTravel ? `Can travel: ${form.canTravel}` : null,
        form.timeline ? `Timeline: ${form.timeline}` : null,
        form.legalIssues ? `Legal issues: ${form.legalIssues}` : null,
        form.paymentPath ? `Payment path: ${form.paymentPath}` : null,
        form.insuranceType ? `Insurance type: ${form.insuranceType}` : null,
        form.insuranceCarrierName.trim()
          ? `Insurance carrier: ${form.insuranceCarrierName.trim()}`
          : null,
        form.selfPayConfirmed ? `Self pay confirmed: ${form.selfPayConfirmed}` : null,
      ].filter(Boolean);

      const prescreenNotes = noteParts.length > 0 ? noteParts.join(" | ") : null;

      const desiredLevels =
        recommendedProgramType && recommendedProgramType.trim().length > 0
          ? [recommendedProgramType]
          : [];

      const patientMatchSnapshot = {
        needsDetox: recommendedProgramType === "detox",
        desiredLevelsOfCare: desiredLevels,
        prefersDualDiagnosis: false,
        requiresMAT: false,
        insuranceCarrier: normalizedCarrier || "unknown",
        fundingType:
          form.paymentPath === "insurance"
            ? "insurance"
            : form.paymentPath === "self_pay"
              ? "self_pay"
              : "indigent",
        state: undefined,
        wantsProfessionalProgram: false,
        wantsFamilyProgram: false,
      };

      const { error: caseError } = await supabase
        .from("cases")
        .update({
          match_score: matchScore ? Number(matchScore) : null,
          state: "MATCH_SELECTED",
          notes: prescreenNotes,
          patient_match_snapshot: patientMatchSnapshot,
        })
        .eq("id", caseId);

      if (caseError) {
        console.error("Error updating case:", caseError);
        alert(`We couldn’t update the case.\n\nSupabase says: ${caseError.message}`);
        return;
      }

      const { error: referralError } = await supabase
        .from("referrals")
        .insert({
          patient_id: patientId,
          case_id: caseId,
          facility_site_id: facilityId,
          referral_source: "nrin",
          status: "new",
          notes: prescreenNotes,
        });

      if (referralError) {
        console.error("Error creating referral:", referralError);
        alert(
          `We updated the case, but couldn’t create the referral.\n\nSupabase says: ${referralError.message}`
        );
        return;
      }

      router.push("/patient/confirmation");
    } catch (err) {
      console.error("Error completing prescreen:", err);
      alert("Something went wrong while sending your request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="space-y-3">
          <p className="text-sm text-stone-500">Selected facility</p>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
            {facilityName || "Selected facility"}
          </h1>
          {facilityLocation && (
            <p className="text-sm text-stone-500">{facilityLocation}</p>
          )}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <SectionShell
              eyebrow="Ratification"
              title="Lock in how this placement will be paid for"
              body="This is where we move from general information to real-world approval. Facilities require this before they review your case."
            >
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                You told us earlier you{" "}
                {intakeInsuranceStatus === "yes"
                  ? "have insurance"
                  : intakeInsuranceStatus === "no"
                    ? "do not have insurance"
                    : "weren’t sure about your insurance"}
                .
                <br />
                Now we need to confirm how this specific placement will be funded.
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <ChoicePill
                  active={form.paymentPath === "insurance"}
                  label="Use insurance"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      paymentPath: "insurance",
                      selfPayConfirmed: "",
                    }))
                  }
                />
                <ChoicePill
                  active={form.paymentPath === "self_pay"}
                  label="Self-pay"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      paymentPath: "self_pay",
                      insuranceType: "",
                      insuranceCarrierName: "",
                      selfPayConfirmed: "yes",
                    }))
                  }
                />
                <ChoicePill
                  active={form.paymentPath === "public_funding"}
                  label="No insurance / no self-pay"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      paymentPath: "public_funding",
                      insuranceType: "",
                      insuranceCarrierName: "",
                      selfPayConfirmed: "",
                    }))
                  }
                />
              </div>
            </SectionShell>

            {form.paymentPath === "insurance" && (
              <SectionShell
                title="What specific insurance will be used for this facility?"
                body="This is the ratification step where we capture the specific plan needed for review."
              >
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "private", label: "Private insurance" },
                    { value: "medicaid", label: "Medicaid / state plan" },
                    { value: "medicare", label: "Medicare" },
                    { value: "va", label: "VA / Tricare" },
                    { value: "not_sure", label: "Not sure" },
                  ].map((option) => (
                    <ChoicePill
                      key={option.value}
                      active={form.insuranceType === option.value}
                      label={option.label}
                      onClick={() => update("insuranceType", option.value)}
                    />
                  ))}
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Carrier or plan name
                  </label>
                  <input
                    type="text"
                    value={form.insuranceCarrierName}
                    onChange={(e) => update("insuranceCarrierName", e.target.value)}
                    placeholder="Example: Blue Shield PPO, Medi-Cal LA Care, Humana Medicare"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </SectionShell>
            )}

            {form.paymentPath === "self_pay" && (
              <SectionShell
                title="Self-pay confirmed"
                body="This keeps the referral moving on the normal track."
              >
                <div className="flex flex-wrap gap-2">
                  <ChoicePill
                    active={form.selfPayConfirmed === "yes"}
                    label="Proceed as self-pay"
                    onClick={() => update("selfPayConfirmed", "yes")}
                  />
                </div>
              </SectionShell>
            )}

            {form.paymentPath === "public_funding" && (
              <SectionShell
                title="Public funding path activated"
                body="You are not out of options. We’re moving this case into a different pipeline built for patients who need funded or indigent treatment options."
              >
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  After you continue, NRIN will route you to the public-funding path instead of the standard facility review path.
                </div>
              </SectionShell>
            )}
          </div>

          <div className="space-y-6">
            <SectionShell
              eyebrow="Operational details"
              title="A few final details"
              body="These help the receiving side understand travel timing and immediate constraints."
            >
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Are you able to travel for treatment?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["yes", "no", "not_sure"].map((opt) => (
                      <ChoicePill
                        key={opt}
                        active={form.canTravel === opt}
                        label={opt === "not_sure" ? "Not sure" : opt}
                        onClick={() => update("canTravel", opt)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    When are you looking to start?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "today", label: "Today" },
                      { value: "this_week", label: "This week" },
                      { value: "flexible", label: "Flexible" },
                    ].map((opt) => (
                      <ChoicePill
                        key={opt.value}
                        active={form.timeline === opt.value}
                        label={opt.label}
                        onClick={() => update("timeline", opt.value)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-900">
                    Any legal or monitoring issues we should note?
                  </label>
                  <input
                    type="text"
                    value={form.legalIssues}
                    onChange={(e) => update("legalIssues", e.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>
            </SectionShell>

            <SectionShell
              eyebrow="Next step"
              title="Send this placement to review"
              body="When you continue, NRIN will lock in this facility choice and send the referral into the receiving workflow."
            >
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                Recommended program:{" "}
                <span className="font-medium text-slate-900">
                  {recommendedProgramType || "Not specified"}
                </span>
                <br />
                Match score:{" "}
                <span className="font-medium text-slate-900">
                  {matchScore || "—"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleContinue}
                disabled={loading || !ratificationReady}
                className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending referral..." : "Continue"}
              </button>
            </SectionShell>
          </div>
        </div>
      </div>
    </main>
  );
}
