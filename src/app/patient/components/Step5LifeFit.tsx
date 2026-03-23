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

export function Step5LifeFit({
    form,
    setForm,
    loading,
    onNext,
    onBack,
}: Step5LifeFitProps) {
    const [followUpPrompt, setFollowUpPrompt] = React.useState<string | null>(null);
    const [hasEvaluated, setHasEvaluated] = React.useState(false);

    const mainText = form.additionalContextNotes || "";

    function updateMainText(value: string) {
        setForm((prev) => ({
            ...prev,
            additionalContextNotes: value,
        }));
    }

    function evaluateForFollowUp(text: string) {
        const lower = text.toLowerCase();

        const mentionsWork =
            lower.includes("job") ||
            lower.includes("work") ||
            lower.includes("career") ||
            lower.includes("pilot") ||
            lower.includes("doctor") ||
            lower.includes("nurse");

        const mentionsFamily =
            lower.includes("family") ||
            lower.includes("wife") ||
            lower.includes("husband") ||
            lower.includes("kids") ||
            lower.includes("divorce");

        const mentionsLocation =
            lower.includes("home") ||
            lower.includes("travel") ||
            lower.includes("move") ||
            lower.includes("city") ||
            lower.includes("coast") ||
            lower.includes("mountain");

        const mentionsGoals =
            lower.includes("goal") ||
            lower.includes("sobriety") ||
            lower.includes("change") ||
            lower.includes("better");

        return null;

        return null;
    }

    function handleContinue() {
        const text = mainText.trim();

        if (!text) {
            setForm((prev) => ({
                ...prev,
                lifeFitCaptureMode: "skip",
            }));
            onNext();
            return;
        }

        if (!hasEvaluated) {
            const followUp = evaluateForFollowUp(text);

            if (followUp) {
                setFollowUpPrompt(followUp);
                setHasEvaluated(true);
                return;
            }
        }

        setForm((prev) => ({
            ...prev,
            lifeFitCaptureMode: "full",
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
                {/* Intro */}
                <div className="space-y-2">
                    <h2 className="text-base font-semibold text-gray-900">
                        Life situation & preferences
                    </h2>
                    <p className="text-sm leading-6 text-gray-600">
                        We already understand the care you may need. This helps us find
                        a place that fits your life — not just your treatment.
                    </p>
                    <p className="text-xs text-gray-500">
                        Optional — you can keep this simple or skip entirely.
                    </p>
                </div>

                {/* Main Input */}
                <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-900">
                            Tell us about yourself
                        </label>
                        <p className="text-xs text-gray-500 leading-5">
                            Include anything you want us to consider — family, work,
                            legal issues, location preferences, what you hope treatment
                            helps you accomplish, or even the kind of environment or
                            activities you connect with.
                        </p>

                        <textarea
                            value={mainText}
                            onChange={(e) => updateMainText(e.target.value)}
                            rows={6}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400"
                            placeholder="Share anything that would help us find a better fit for you..."
                        />
                    </div>
                </div>

                {/* Follow-up (only if needed) */}
                {followUpPrompt && (
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 md:p-5">
                        <div className="space-y-3">
                            <p className="text-sm text-gray-800">
                                {followUpPrompt}
                            </p>

                            <textarea
                                value={mainText}
                                onChange={(e) => updateMainText(e.target.value)}
                                rows={3}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400"
                                placeholder="Add anything else you'd like us to consider..."
                            />
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={loading}
                        className="inline-flex h-10 items-center rounded-xl bg-gray-100 px-4 text-sm font-medium text-gray-800 transition hover:bg-gray-200 disabled:opacity-40"
                    >
                        Back
                    </button>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                            type="button"
                            onClick={handleSkip}
                            disabled={loading}
                            className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-medium text-gray-700 ring-1 ring-gray-200 transition hover:bg-gray-50 disabled:opacity-40"
                        >
                            Skip for now
                        </button>

                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={loading}
                            className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-6 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:opacity-40"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </section>
        </StepShell>
    );
}