"use client";

import * as React from "react";
import { StepShell } from "./StepShell";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
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
            {/* Substances used in the last 30 days */}
            <section className="space-y-2">
                <h2 className="text-sm font-semibold text-gray-900">
                    Substances used in the last 30 days
                </h2>
                <p className="text-xs text-gray-500">
                    Tap all that apply. We&apos;ll use this to match you to the right
                    level of care.
                </p>
                <div className="mt-1 flex flex-wrap gap-2">
                    {substancesList.map((s) => {
                        const selected = form.substances.includes(s);
                        const label = s.charAt(0).toUpperCase() + s.slice(1);

                        return (
                            <button
                                key={s}
                                type="button"
                                onClick={() => toggleSubstance(s)}
                                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${selected
                                        ? "border-gray-900 bg-gray-900 text-white"
                                        : "border-gray-200 bg-gray-50 text-gray-800"
                                    }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
        </section>

      {/* Last use + frequency */ }
    <section className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">
                Last use
            </label>
            <Select
                value={form.lastUse}
                onChange={(e) =>
                    setForm((prev) => ({ ...prev, lastUse: e.target.value }))
                }
            >
                <option value="">Select one</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="2-3_days">2–3 days ago</option>
                <option value="4-7_days">4–7 days ago</option>
                <option value="more_than_a_week">More than a week ago</option>
            </Select>
        </div>

        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">
                Frequency
            </label>
            <Select
                value={form.frequency}
                onChange={(e) =>
                    setForm((prev) => ({ ...prev, frequency: e.target.value }))
                }
            >
                <option value="">Select one</option>
                <option value="daily">Daily</option>
                <option value="3-5_days_week">3–5 days / week</option>
                <option value="1-2_days_week">1–2 days / week</option>
                <option value="less_than_once_week">
                    Less than once a week
                </option>
            </Select>
        </div>
    </section>

    {/* Prior treatment yes/no */ }
    <section className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-900">
            Treatment history
        </h2>
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">
                Have you been to treatment before?
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
                <ChoiceButton
                    isSelected={form.priorTreatment === "yes"}
                    onClick={() =>
                        setForm((prev) => ({ ...prev, priorTreatment: "yes" }))
                    }
                >
                    Yes
                </ChoiceButton>
                <ChoiceButton
                    isSelected={form.priorTreatment === "no"}
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
        </div>
    </section>

    {
        form.priorTreatment === "yes" && (
            <section className="space-y-4">
                {/* When + how long */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-900">
                            When were you last in treatment?
                        </label>
                        <Select
                            value={form.treatmentLastWhen}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    treatmentLastWhen: e.target.value,
                                }))
                            }
                        >
                            <option value="">Select one</option>
                            <option value="0-12_months">0–12 months ago</option>
                            <option value="1-5_years">Over 1 year ago</option>
                            <option value="5+_years">5+ years ago</option>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-900">
                            How long were you in treatment?
                        </label>
                        <Select
                            value={form.treatmentLastDuration}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    treatmentLastDuration: e.target.value,
                                }))
                            }
                        >
                            <option value="">Select one</option>
                            <option value="0-7_days">0–7 days</option>
                            <option value="7-30_days">7–30 days</option>
                            <option value="30+_days">30+ days</option>
                        </Select>
                    </div>
                </div>

                {form.treatmentLastDuration === "30+_days" && (
                    <div className="space-y-4">
                        {/* Programs completed */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-900">
                                Programs completed
                            </label>
                            <div className="mt-1 flex flex-wrap gap-2">
                                <ChoiceButton
                                    isSelected={form.treatmentPHPCompleted === "yes"}
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
                                    isSelected={form.treatmentPHPCompleted === "no"}
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
                                    isSelected={form.treatmentIOPCompleted === "yes"}
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
                                    isSelected={form.treatmentIOPCompleted === "no"}
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

                        {/* Year & facility */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
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

                            <div className="space-y-1">
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
        )
    }

    {/* Actions */ }
    <div className="mt-6 flex items-center justify-between">
        <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-gray-700 underline-offset-2 hover:underline"
        >
            Back
        </button>

        <button
            type="button"
            onClick={onNext}
            disabled={!isComplete || loading}
            className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
            Review &amp; confirm
        </button>
    </div>
    </StepShell >
  );
}