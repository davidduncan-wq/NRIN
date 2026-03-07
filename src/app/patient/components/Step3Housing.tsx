"use client";

import * as React from "react";
import { StepShell } from "./StepShell";
import { Input } from "@/components/ui/Input";
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
            {/* Did you sleep at home last night? */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">
                    Did you sleep at home last night?
                </p>

                <div className="grid grid-cols-2 gap-2 sm:max-w-sm">
                    <button
                        type="button"
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
                        className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium ${form.sleptAtHome === true
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                    >
                        Yes
                    </button>

                    <button
                        type="button"
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
                        className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium ${form.sleptAtHome === false
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                    >
                        No
                    </button>
                </div>
            </div>

            {/* Housing details if not at home */}
            {form.sleptAtHome === false && (
                <>
                    {/* Where did you sleep last night? */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-900">
                            Where did you sleep last night?
                        </label>

                        <select
                            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
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
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-900">
                            Are you currently homeless?
                        </label>

                        <div className="mt-1 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        isCurrentlyHomeless: "yes",
                                    }))
                                }
                                className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium ${form.isCurrentlyHomeless === "yes"
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                    }`}
                            >
                                Yes
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        isCurrentlyHomeless: "no",
                                        lastKnownAddress: "",
                                        hasAddressYouCanUse: "",
                                        mailingAddress: "",
                                    }))
                                }
                                className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium ${form.isCurrentlyHomeless === "no"
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                    }`}
                            >
                                No
                            </button>
                        </div>
                    </div>

                    {/* Conditional fields when homeless */}
                    {form.isCurrentlyHomeless === "yes" && (
                        <div className="space-y-4">
                            {/* Last known address */}
                            <div className="space-y-1">
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

                            {/* Do you have an address you can use? */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-900">
                                    Do you have an address you can use?
                                </label>

                                <div className="mt-1 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                hasAddressYouCanUse: "yes",
                                            }))
                                        }
                                        className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium ${form.hasAddressYouCanUse === "yes"
                                            ? "bg-gray-900 text-white"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                            }`}
                                    >
                                        Yes
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                hasAddressYouCanUse: "no",
                                                mailingAddress: "",
                                            }))
                                        }
                                        className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium ${form.hasAddressYouCanUse === "no"
                                            ? "bg-gray-900 text-white"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                            }`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>

                            {/* Address you can use */}
                            {form.hasAddressYouCanUse === "yes" && (
                                <div className="space-y-1">
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
                </>
            )}

            {/* Actions */}
            <div className="mt-4 flex items-center justify-between">
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
                    Continue
                </button>
            </div>
        </StepShell>
    );
}