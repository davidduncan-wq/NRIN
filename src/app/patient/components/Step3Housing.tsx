"use client";

import * as React from "react";
import { StepShell } from "./StepShell";
import { Input } from "@/components/ui/Input";
import ChoiceButton from "@/components/ui/ChoiceButton";
import type { FormState } from "@/app/patient/page";

type Step3Props = {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
    loading: boolean;
    isComplete: boolean;
    onNext: () => void;
    onBack: () => void;
};

export function Step3Housing({
    form,
    setForm,
    loading,
    isComplete,
    onNext,
    onBack,
}: Step3Props) {
    return (
        <StepShell>
            <div className="space-y-6">
                {/* Did you sleep at home last night? */}
                <section className="space-y-3">
                    <label className="text-sm font-medium text-gray-900">
                        Did you sleep at home last night?
                    </label>

                    <div className="grid grid-cols-2 gap-2 md:max-w-sm">
                        <ChoiceButton
                            selected={form.sleptAtHome === true}
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    sleptAtHome: true,
                                    sleptLastNight: "home",
                                    sleptLocationType: "",
                                    sleptLocationOther: "",
                                    isCurrentlyHomeless: "",
                                    lastKnownAddress: "",
                                    hasAddressYouCanUse: "",
                                    mailingAddress: "",
                                }))
                            }
                        >
                            Yes
                        </ChoiceButton>

                        <ChoiceButton
                            selected={form.sleptAtHome === false}
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    sleptAtHome: false,
                                    sleptLastNight: "",
                                    sleptLocationType: "",
                                    sleptLocationOther: "",
                                    isCurrentlyHomeless: "",
                                    lastKnownAddress: "",
                                    hasAddressYouCanUse: "",
                                    mailingAddress: "",
                                }))
                            }
                        >
                            No
                        </ChoiceButton>
                    </div>
                </section>

                {/* Housing details if not at home */}
                {form.sleptAtHome === false && (
                    <section className="space-y-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 md:p-5">
                        {/* Where did you sleep last night? */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">
                                Where did you sleep last night?
                            </label>

                            <select
                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                value={form.sleptLocationType}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        sleptLocationType: e.target.value,
                                        sleptLastNight: e.target.value,
                                    }))
                                }
                            >
                                <option value="">Select one</option>
                                <option value="shelter">Shelter</option>
                                <option value="street">Street / encampment</option>
                                <option value="park">Park</option>
                                <option value="car">Car / vehicle</option>
                                <option value="friend_family">Friend / family</option>
                                <option value="hospital_er">Hospital / ER</option>
                                <option value="jail_detention">Jail / detention</option>
                                <option value="hotel_motel">Hotel / motel</option>
                                <option value="treatment_facility">Treatment facility</option>
                                <option value="other">Other</option>
                                <option value="decline">Decline to answer</option>
                            </select>
                        </div>

                        {/* Are you currently homeless? */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-900">
                                Are you currently homeless?
                            </label>

                            <div className="grid grid-cols-2 gap-2 md:max-w-sm">
                                <ChoiceButton
                                    selected={form.isCurrentlyHomeless === "yes"}
                                    onClick={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            isCurrentlyHomeless: "yes",
                                        }))
                                    }
                                >
                                    Yes
                                </ChoiceButton>

                                <ChoiceButton
                                    selected={form.isCurrentlyHomeless === "no"}
                                    onClick={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            isCurrentlyHomeless: "no",
                                            lastKnownAddress: "",
                                            hasAddressYouCanUse: "",
                                            mailingAddress: "",
                                        }))
                                    }
                                >
                                    No
                                </ChoiceButton>
                            </div>
                        </div>

                        {/* Conditional fields when homeless */}
                        {form.isCurrentlyHomeless === "yes" && (
                            <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">
                                        Last known address
                                    </label>

                                    <Input
                                        value={form.lastKnownAddress}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                lastKnownAddress: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-900">
                                        Do you have an address you can use?
                                    </label>

                                    <div className="grid grid-cols-2 gap-2 md:max-w-sm">
                                        <ChoiceButton
                                            selected={form.hasAddressYouCanUse === "yes"}
                                            onClick={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    hasAddressYouCanUse: "yes",
                                                }))
                                            }
                                        >
                                            Yes
                                        </ChoiceButton>

                                        <ChoiceButton
                                            selected={form.hasAddressYouCanUse === "no"}
                                            onClick={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    hasAddressYouCanUse: "no",
                                                    mailingAddress: "",
                                                }))
                                            }
                                        >
                                            No
                                        </ChoiceButton>
                                    </div>
                                </div>

                                {form.hasAddressYouCanUse === "yes" && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-900">
                                            Address you can use
                                        </label>

                                        <Input
                                            value={form.mailingAddress}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    mailingAddress: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                )}
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
                        Continue
                    </button>
                </div>
            </div>
        </StepShell>
    );
}