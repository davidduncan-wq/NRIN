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
            {/* First name */}
            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-900">
                    First name
                </label>
                <Input
                    value={form.firstName}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    autoComplete="given-name"
                />
            </div>

            {/* Last name */}
            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-900">
                    Last name
                </label>
                <Input
                    value={form.lastName}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    autoComplete="family-name"
                />
            </div>

            {/* Date of birth */}
            <div className="space-y-1">
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

            {/* Mobile phone */}
            <div className="space-y-1">
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
                <p className="text-xs text-gray-500">
                    We’ll only use this if we need to reach you about your intake.
                </p>
            </div>

            {/* Where are you now? */}
            <div className="space-y-1">
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
                <p className="text-xs text-gray-500">
                    You can edit this later before submitting.
                </p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!isComplete || loading}
                    className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Continue
                </button>
            </div>
        </StepShell>
    );
}