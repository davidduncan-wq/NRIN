"use client";

import * as React from "react";
import { StepShell } from "./StepShell";
import { Input } from "@/components/ui/Input";
import ChoiceButton from "@/components/ui/ChoiceButton";
import type { FormState } from "@/app/patient/page";

type Step4Props = {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
    loading: boolean;
    isComplete: boolean;
    onNext: () => void;
    onBack: () => void;
    toggleSubstance: (value: string) => void;
};

const substancesList = [
    "alcohol",
    "opioids",
    "benzodiazepines",
    "stimulants",
    "ketamine",
    "kratom",
    "hallucinogens",
    "inhalants",
];

const lastUseOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "2-3_days", label: "2–3 days ago" },
    { value: "4-7_days", label: "4–7 days ago" },
    { value: "more_than_a_week", label: "More than a week ago" },
];

const frequencyOptions = [
    { value: "daily", label: "Daily" },
    { value: "3-5_days_week", label: "3–5 days / week" },
    { value: "1-2_days_week", label: "1–2 days / week" },
    { value: "less_than_once_week", label: "Less than once a week" },
];

const treatmentWhenOptions = [
    { value: "0-12_months", label: "0–12 months ago" },
    { value: "1-5_years", label: "Over 1 year ago" },
    { value: "5+_years", label: "5+ years ago" },
];

const treatmentDurationOptions = [
    { value: "0-7_days", label: "0–7 days" },
    { value: "7-30_days", label: "7–30 days" },
    { value: "30+_days", label: "30+ days" },
];

export function Step4Substances({
    form,
    setForm,
    loading,
    isComplete,
    onNext,
    onBack,
    toggleSubstance,
}: Step4Props) {
    return (
        <StepShell>
            <div className="space-y-6">
                {/* Substances used in the last 30 days */}
                <section className="space-y-3">
                    <div className="space-y-1">
                        <h2 className="text-sm font-semibold text-gray-900">
                            Substances used in the last 30 days
                        </h2>
                        <p className="text-xs text-gray-500">
                            Tap all that apply. We&apos;ll use this to match you to the right
                            level of care.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                        {substancesList.map((s) => (
                            <ChoiceButton
                                key={s}
                                selected={form.substances.includes(s)}
                                onClick={() => toggleSubstance(s)}
                            >
                                <span className="text-sm">
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </span>
                            </ChoiceButton>
                        ))}
                    </div>
                </section>

                {/* Last use */}
                <section className="space-y-3">
                    <label className="text-sm font-medium text-gray-900">
                        Last use
                    </label>

                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                        {lastUseOptions.map((option) => (
                            <ChoiceButton
                                key={option.value}
                                selected={form.lastUse === option.value}
                                onClick={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        lastUse: option.value,
                                    }))
                                }
                            >
                                <span className="text-sm">{option.label}</span>
                            </ChoiceButton>
                        ))}
                    </div>
                </section>

                {/* Frequency */}
                <section className="space-y-3">
                    <label className="text-sm font-medium text-gray-900">
                        Frequency
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                        {frequencyOptions.map((option) => (
                            <ChoiceButton
                                key={option.value}
                                selected={form.frequency === option.value}
                                onClick={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        frequency: option.value,
                                    }))
                                }
                            >
                                <span className="text-sm">{option.label}</span>
                            </ChoiceButton>
                        ))}
                    </div>
                </section>

                {/* Treatment history */}
                <section className="space-y-3">
                    <label className="text-sm font-medium text-gray-900">
                        Have you been to treatment before?
                    </label>

                    <div className="grid grid-cols-1 gap-2">
                        <ChoiceButton
                            selected={form.priorTreatment === "yes"}
                            onClick={() =>
                                setForm((prev) => ({ ...prev, priorTreatment: "yes" }))
                            }
                        >
                            Yes
                        </ChoiceButton>

                        <ChoiceButton
                            selected={form.priorTreatment === "no"}
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    priorTreatment: "no",
                                    treatmentLastWhen: "",
                                    treatmentLastDuration: "",
                                    treatmentPHPCompleted: "",
                                    treatmentIOPCompleted: "",
                                    treatmentLastYear: "",
                                    treatmentFacility: "",
                                }))
                            }
                        >
                            No
                        </ChoiceButton>
                    </div>
                </section>

                {/* Conditional treatment details */}
                {form.priorTreatment === "yes" && (
                    <section className="space-y-5 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 md:p-5">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-900">
                                When were you last in treatment?
                            </label>

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                {treatmentWhenOptions.map((option) => (
                                    <ChoiceButton
                                        key={option.value}
                                        selected={form.treatmentLastWhen === option.value}
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                treatmentLastWhen: option.value,
                                            }))
                                        }
                                    >
                                        <span className="text-sm">{option.label}</span>
                                    </ChoiceButton>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-900">
                                How long were you in treatment?
                            </label>

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                {treatmentDurationOptions.map((option) => (
                                    <ChoiceButton
                                        key={option.value}
                                        selected={form.treatmentLastDuration === option.value}
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                treatmentLastDuration: option.value,
                                            }))
                                        }
                                    >
                                        <span className="text-sm">{option.label}</span>
                                    </ChoiceButton>
                                ))}
                            </div>
                        </div>

                        {form.treatmentLastDuration === "30+_days" && (
                            <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-4">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-900">
                                        Programs completed
                                    </label>

                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                        <ChoiceButton
                                            selected={form.treatmentPHPCompleted === "yes"}
                                            onClick={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    treatmentPHPCompleted: "yes",
                                                }))
                                            }
                                        >
                                            Completed PHP
                                        </ChoiceButton>

                                        <ChoiceButton
                                            selected={form.treatmentPHPCompleted === "no"}
                                            onClick={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    treatmentPHPCompleted: "no",
                                                }))
                                            }
                                        >
                                            Didn&apos;t complete PHP
                                        </ChoiceButton>

                                        <ChoiceButton
                                            selected={form.treatmentIOPCompleted === "yes"}
                                            onClick={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    treatmentIOPCompleted: "yes",
                                                }))
                                            }
                                        >
                                            Completed IOP
                                        </ChoiceButton>

                                        <ChoiceButton
                                            selected={form.treatmentIOPCompleted === "no"}
                                            onClick={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    treatmentIOPCompleted: "no",
                                                }))
                                            }
                                        >
                                            Didn&apos;t complete IOP
                                        </ChoiceButton>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-900">
                                            What year was that? (YYYY)
                                        </label>
                                        <Input
                                            value={form.treatmentLastYear}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    treatmentLastYear: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-900">
                                            Where was that treatment?
                                        </label>
                                        <Input
                                            value={form.treatmentFacility}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    treatmentFacility: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex h-10 items-center rounded-xl bg-gray-100 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                    >
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={onNext}
                        disabled={!isComplete || loading}
                        className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Review &amp; confirm
                    </button>
                </div>
            </div>
        </StepShell>
    );
}