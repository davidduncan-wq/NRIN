"use client";

import * as React from "react";
import { StepShell } from "./StepShell";
import type { FormState } from "../page";

type Step5LifeFitProps = {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
    loading: boolean;
    onNext: () => void;
    onBack: () => void;
};

const ENV_OPTIONS = [
    { value: "island", label: "Island" },
    { value: "mountains", label: "Mountains" },
    { value: "east_coast", label: "East Coast" },
    { value: "west_coast", label: "West Coast" },
    { value: "urban", label: "Urban" },
    { value: "close_to_home", label: "Keep me close to home" },
] as const;

const INSURANCE_STATUS_OPTIONS = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "not_sure", label: "Not sure" },
] as const;

const INSURANCE_TYPE_OPTIONS = [
    { value: "private", label: "Private insurance" },
    { value: "medicaid", label: "Medicaid / state plan" },
    { value: "medicare", label: "Medicare" },
    { value: "va", label: "VA / Tricare" },
    { value: "not_sure", label: "Not sure" },
] as const;

const SELF_PAY_OPTIONS = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "not_sure", label: "Not sure" },
] as const;

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
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${active
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
    onSkip,
}: {
    eyebrow?: string;
    title: string;
    body: string;
    children: React.ReactNode;
    onSkip?: () => void;
}) {
    const [collapsed, setCollapsed] = React.useState(false);

    const handleSkip = () => {
        onSkip?.();
        setCollapsed(true);
    };

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

            {!collapsed && <div className="mt-4">{children}</div>}

            {collapsed && (
                <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">
                        Skipped for now
                    </div>

                    <button
                        type="button"
                        onClick={() => setCollapsed(false)}
                        className="text-xs font-medium text-sky-700 hover:text-sky-800"
                    >
                        Add now
                    </button>
                </div>
            )}

            {!collapsed && onSkip && (
                <button
                    type="button"
                    onClick={handleSkip}
                    className="mt-4 text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                    Skip for now
                </button>
            )}
        </div>
    );
}

function InsuranceStatusSection({
    form,
    setForm,
}: Pick<Step5LifeFitProps, "form" | "setForm">) {
    return (
        <SectionShell
            eyebrow="Coverage"
            title="Do you have insurance?"
            body="You can keep this broad for now. We can verify details after a facility is selected."
        >
            <div className="flex flex-wrap gap-2">
                {INSURANCE_STATUS_OPTIONS.map((option) => (
                    <ChoicePill
                        key={option.value}
                        active={form.insuranceStatus === option.value}
                        label={option.label}
                        onClick={() =>
                            setForm((prev) => ({
                                ...prev,
                                insuranceStatus: option.value,
                                insuranceDetailsTiming: undefined,
                                insuranceType: option.value === "yes" ? prev.insuranceType : "",
                                selfPayIntent: option.value === "no" ? prev.selfPayIntent : "",
                            }))
                        }
                    />
                    
                ))}
            </div>
        </SectionShell>
    );
}


function SelfPaySection({
    form,
    setForm,
}: Pick<Step5LifeFitProps, "form" | "setForm">) {
    if (form.insuranceStatus !== "no") return null;

    return (
        <SectionShell
            title="Are you planning to self-pay?"
            body="This helps us know whether to keep moving normally or flag the case for alternative funding paths later."
        >
            <div className="flex flex-wrap gap-2">
                {SELF_PAY_OPTIONS.map((option) => (
                    <ChoicePill
                        key={option.value}
                        active={form.selfPayIntent === option.value}
                        label={option.label}
                        onClick={() =>
                            setForm((prev) => ({
                                ...prev,
                                selfPayIntent: option.value,
                            }))
                        }
                    />
                ))}
            </div>
        </SectionShell>
    );
}


function PossibleFundingSignalsSection({
    form,
    setForm,
}: Pick<Step5LifeFitProps, "form" | "setForm">) {
    if (form.insuranceStatus !== "no" && form.insuranceStatus !== "not_sure") return null;

    const selected = form.possibleFundingSignals ?? [];

    const toggleSignal = (value: string) => {
        setForm((prev) => {
            const current = prev.possibleFundingSignals ?? [];

            if (value === "none" || value === "not_sure") {
                return {
                    ...prev,
                    possibleFundingSignals: [value],
                    militaryStatus: undefined,
                    militaryCoverage: undefined,
                };
            }

            const filtered = current.filter(
                (item: string) => item !== "none" && item !== "not_sure"
            );

            const next = filtered.includes(value)
                ? filtered.filter((item: string) => item !== value)
                : [...filtered, value];

            const hasMilitary = next.includes("military");

            return {
                ...prev,
                possibleFundingSignals: next,
                militaryStatus: hasMilitary ? prev.militaryStatus : undefined,
                militaryCoverage: hasMilitary ? prev.militaryCoverage : undefined,
            };
        });
    };

    return (
        <SectionShell
            title="Sometimes there are still ways to get treatment covered"
            body="Does any of this sound like you? You do not need to know whether it definitely applies."
        >
            <div className="flex flex-wrap gap-2">
                {[
                    { value: "military", label: "I’ve served in the military" },
                    { value: "tribal", label: "I’m part of a tribe or receive tribal services" },
                    { value: "union_employer", label: "My job, union, or employer might help" },
                    { value: "court_county", label: "I’m involved with court, probation, or county services" },
                    { value: "not_sure", label: "I’m not sure" },
                    { value: "none", label: "None of these" },
                ].map((option) => (
                    <ChoicePill
                        key={option.value}
                        active={selected.includes(option.value)}
                        label={option.label}
                        onClick={() => toggleSignal(option.value)}
                    />
                ))}
            </div>
        </SectionShell>
    );
}

function MilitaryStatusSection({ form, setForm }: any) {
    if (!(form.possibleFundingSignals ?? []).includes("military")) return null;

    return (
        <SectionShell
            title="Have you ever served in the U.S. military?"
            body=""
        >
            {[
                { value: "active", label: "Active Duty" },
                { value: "veteran", label: "Veteran" },
                { value: "guard", label: "National Guard / Reserves" },
                { value: "none", label: "No" },
                { value: "unknown", label: "Prefer not to say" },
            ].map((option) => (
                <ChoicePill
                    key={option.value}
                    active={form.militaryStatus === option.value}
                    label={option.label}
                    onClick={() =>
                        setForm((prev: any) => ({
                            ...prev,
                            militaryStatus: option.value,
                            militaryCoverage:
                                option.value === "none" ? undefined : prev.militaryCoverage,
                        }))
                    }
                />
            ))}
        </SectionShell>
    );
}

function MilitaryCoverageSection({ form, setForm }: any) {
    if (!(form.possibleFundingSignals ?? []).includes("military")) return null;
    if (!form.militaryStatus || form.militaryStatus === "none") return null;

    return (
        <SectionShell
            title="Do you have TRICARE or VA healthcare?"
            body=""
        >
            {[
                { value: "tricare", label: "TRICARE" },
                { value: "va", label: "VA Healthcare" },
                { value: "none", label: "No" },
                { value: "unknown", label: "Not sure" },
            ].map((option) => (
                <ChoicePill
                    key={option.value}
                    active={form.militaryCoverage === option.value}
                    label={option.label}
                    onClick={() =>
                        setForm((prev: any) => ({
                            ...prev,
                            militaryCoverage: option.value,
                        }))
                    }
                />
            ))}
        </SectionShell>
    );
}

function EnvironmentPreferenceSection({
    form,
    setForm,
}: Pick<Step5LifeFitProps, "form" | "setForm">) {
    return (
        <SectionShell
            eyebrow="Life fit"
            title="What kind of setting feels right?"
            body="This is a soft preference, not a hard rule. It helps us break ties between otherwise good options."
        >
            <div className="flex flex-wrap gap-2">
                {ENV_OPTIONS.map((option) => (
                    <ChoicePill
                        key={option.value}
                        active={form.environmentPreference === option.value}
                        label={option.label}
                        onClick={() =>
                            setForm((prev) => ({
                                ...prev,
                                environmentPreference: option.value,
                            }))
                        }
                    />
                ))}
            </div>
        </SectionShell>
    );
}

function NarrativeSection({
    form,
    setForm,
}: Pick<Step5LifeFitProps, "form" | "setForm">) {
    return (
        <SectionShell
            eyebrow="Context"
            title="Tell us anything else that matters"
            body="Family, work, court pressure, environment, goals, pride, privacy — anything that helps us find a better fit."
            onSkip={() =>
                setForm((prev) => ({
                    ...prev,
                    additionalContextNotes: "",
                }))
            }
        >
            <textarea
                value={form.additionalContextNotes}
                onChange={(e) =>
                    setForm((prev) => ({
                        ...prev,
                        additionalContextNotes: e.target.value,
                    }))
                }
                rows={5}
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                placeholder="Example: I lost my job, my family is on the line, and I need somewhere I can get stable fast."
            />

        </SectionShell>
    );
}

export function Step5LifeFit({
    form,
    setForm,
    loading,
    onNext,
    onBack,
}: Step5LifeFitProps) {
    function handleContinue() {
        const hasInsurance =
            !!form.insuranceStatus ||
            !!form.insuranceType ||
            !!form.selfPayIntent;

        const hasEnvironment = !!form.environmentPreference;

        const hasNarrative = form.additionalContextNotes.trim().length > 0;

        let captureMode: "" | "full" | "skip" = "skip";

        if (hasInsurance || hasEnvironment || hasNarrative) {
            captureMode = "full";
        }

        setForm((prev) => ({
            ...prev,
            lifeFitCaptureMode: captureMode,
        }));

        onNext();
    }

    function handleSkip() {
        setForm((prev) => ({
            ...prev,
            lifeFitCaptureMode: "skip",
        }));
        onNext();
    }

    return (
        <StepShell>
            <section className="space-y-6">
                <div className="space-y-2">
                    <h2 className="text-base font-semibold text-slate-900">
                        Life situation & preferences
                    </h2>
                    <p className="text-sm leading-6 text-slate-600">
                        We already understand the care you may need. This helps us find a place
                        that fits your life, your logistics, and your next best move.
                    </p>
                    <p className="text-xs text-slate-500">
                        Optional — you can keep this simple now and add more detail later.
                    </p>
                </div>

                <InsuranceStatusSection form={form} setForm={setForm} />
                <InsuranceTypeSection form={form} setForm={setForm} />
                <InsuranceCarrierSection form={form} setForm={setForm} />
                <InsuranceTimingSection form={form} setForm={setForm} />
                <InsuranceMethodSection form={form} setForm={setForm} />
                <SelfPaySection form={form} setForm={setForm} />
                <PossibleFundingSignalsSection form={form} setForm={setForm} />
                <MilitaryStatusSection form={form} setForm={setForm} />
                <MilitaryCoverageSection form={form} setForm={setForm} />
                <EnvironmentPreferenceSection form={form} setForm={setForm} />
                <NarrativeSection form={form} setForm={setForm} />

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={loading}
                        className="inline-flex h-10 items-center rounded-xl bg-slate-100 px-4 text-sm font-medium text-slate-800 transition hover:bg-slate-200 disabled:opacity-40"
                    >
                        Back
                    </button>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                            type="button"
                            onClick={handleSkip}
                            disabled={loading}
                            className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
                        >
                            Skip for now
                        </button>

                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={loading}
                            className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-6 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:opacity-40"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </section>
        </StepShell>
    );
}


function InsuranceCarrierSection({ form, setForm }: any) {
    if (form.insuranceStatus !== "yes") return null;

    return (
        <SectionShell title="Who is your insurance with?" body="You can keep this broad for now.">
            <input
                type="text"
                value={form.insuranceCarrier || ""}
                onChange={(e) =>
                    setForm((prev: any) => ({
                        ...prev,
                        insuranceCarrier: e.target.value,
                    }))
                }
                placeholder="e.g. Blue Cross, Aetna, Cigna"
                className="w-full rounded-xl border px-3 py-2 text-sm"
            />
        </SectionShell>
    );
}

function InsuranceTimingSection({ form, setForm }: any) {
    if (form.insuranceStatus !== "yes" || !form.insuranceType) return null;

    return (
        <SectionShell title="Add your insurance details now or later?" body="">
            <div className="flex gap-2">
                <ChoicePill
                    active={form.insuranceDetailsTiming === "now"}
                    label="Add now"
                    onClick={() =>
                        setForm((prev: any) => ({
                            ...prev,
                            insuranceDetailsTiming: "now",
                        }))
                    }
                />
                <ChoicePill
                    active={form.insuranceDetailsTiming === "later"}
                    label="Add later"
                    onClick={() =>
                        setForm((prev: any) => ({
                            ...prev,
                            insuranceDetailsTiming: "later",
                        }))
                    }
                />
            </div>
        </SectionShell>
    );
}

function InsuranceMethodSection({ form, setForm }: any) {
    if (form.insuranceStatus !== "yes" || form.insuranceDetailsTiming !== "now") return null;

    return (
        <SectionShell title="How would you like to add it?" body="">
            <div className="flex gap-2">
                <ChoicePill
                    active={form.insuranceInputMethod === "scan"}
                    label="Scan / upload card"
                    onClick={() =>
                        setForm((prev: any) => ({
                            ...prev,
                            insuranceInputMethod: "scan",
                        }))
                    }
                />
                <ChoicePill
                    active={form.insuranceInputMethod === "manual"}
                    label="Enter manually"
                    onClick={() =>
                        setForm((prev: any) => ({
                            ...prev,
                            insuranceInputMethod: "manual",
                        }))
                    }
                />
            </div>
        </SectionShell>
    );
}


function InsuranceTypeSection({
    form,
    setForm,
}: any) {
    if (form.insuranceStatus !== "yes") return null;

    const OPTIONS = [
        { value: "private", label: "Private" },
        { value: "medicaid", label: "Medicaid / state plan" },
        { value: "medicare", label: "Medicare" },
        { value: "va", label: "VA / Tricare" },
        { value: "not_sure", label: "Not sure" },
    ];

    return (
        <SectionShell
            title="What type of insurance?"
            body=""
        >
            <div className="flex flex-wrap gap-2">
                {OPTIONS.map((option) => (
                    <ChoicePill
                        key={option.value}
                        active={form.insuranceType === option.value}
                        label={option.label}
                        onClick={() =>
                            setForm((prev: any) => ({
                                ...prev,
                                insuranceType: option.value,
                            }))
                        }
                    />
                ))}
            </div>
        </SectionShell>
    );
}
