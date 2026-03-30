"use client";

import * as React from "react";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { StepShell } from "./StepShell";
import type { FormState } from "@/app/patient/page";

type Step1Props = {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
    loading: boolean;
    isComplete: boolean;
    onNext: () => void;
    formatDobMMDDYYYY: (input: string) => string;
    dobToISO: (input: string) => string | null;
    formatPhoneInput: (input: string) => string;
    ageYears: number | null;
};

export function Step1Demographics({
    form,
    setForm,
    loading,
    isComplete,
    onNext,
    formatDobMMDDYYYY,
    dobToISO,
    formatPhoneInput,
    ageYears,
}: Step1Props) {
    return (
        <StepShell
            step={1}
            totalSteps={6}
            title="Basic information"
            subtitle="Tell us a little about yourself so we can match you to the right level of care."
            headerExtra={
                isComplete && form.firstName && ageYears !== null ? (
                    <p className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {form.firstName} · Age {ageYears}
                    </p>
                ) : null
            }
        >
            <div className="space-y-6">
                {/* Military (early signal) */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-900">
                        Have you ever served in the military?
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {([
                            { label: "No", value: "none" },
                            { label: "Yes", value: "veteran" },
                            { label: "Active / Guard", value: "active" },
                            { label: "Prefer not to say", value: "unknown" },
                        ] as const).map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        militaryStatus: opt.value,
                                    }))
                                }
                                className={`px-4 py-2 rounded-xl text-sm font-medium border ${
                                    form.militaryStatus === opt.value
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-gray-700 border-gray-300"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">
                            First name
                        </label>
                        <Input
                            value={form.firstName}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    firstName: e.target.value,
                                }))
                            }
                            autoComplete="given-name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">
                            Last name
                        </label>
                        <Input
                            value={form.lastName}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    lastName: e.target.value,
                                }))
                            }
                            autoComplete="family-name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">
                            Date of birth
                        </label>
                        <Input
                            placeholder="MM/DD/YYYY"
                            value={form.dob}
                            onChange={(e) => {
                                const raw = e.target.value;
                                const formatted = formatDobMMDDYYYY(raw);
                                const iso = dobToISO(formatted);

                                setForm((prev) => ({
                                    ...prev,
                                    dob: formatted,
                                    dobISO: iso ?? "",
                                }));
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">
                            Mobile phone
                        </label>
                        <PhoneInput
                            value={form.phone}
                            onChange={(value) => {
                                const raw =
                                    typeof value === "string"
                                        ? value
                                        : value?.target?.value ?? "";

                                setForm((prev) => ({
                                    ...prev,
                                    phone: formatPhoneInput(raw),
                                }));
                            }}
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-900">
                            Where are you now?
                        </label>
                        <Input
                            placeholder="City / facility / general location"
                            value={form.currentLocation}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    currentLocation: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-500">
                        You can edit this later before submitting.
                    </p>

                    <button
                        type="button"
                        onClick={onNext}
                        disabled={!isComplete || loading}
                        className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </StepShell>
    );
}
