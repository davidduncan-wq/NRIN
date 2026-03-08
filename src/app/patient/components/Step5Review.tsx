"use client";

import * as React from "react";
import { StepShell } from "./StepShell";
import { Input } from "@/components/ui/Input";
import type { FormState } from "@/app/patient/page";

type Step5Props = {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  loading: boolean;
  onBack: () => void;
  onGetRecommendation: () => void;
};

export function Step5Review({
  form,
  setForm,
  loading,
  onBack,
  onGetRecommendation,
}: Step5Props) {
  const fullName = [form.firstName, form.lastName].filter(Boolean).join(" ");
  const canGetRecommendation = !!form.initials.trim();

  return (
    <StepShell>
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Basic info */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-900">Basic info</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-gray-500">Name</dt>
                  <dd className="text-right text-gray-900">
                    {fullName || "Not provided"}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-gray-500">Date of birth</dt>
                  <dd className="text-right text-gray-900">
                    {form.dob || "Not provided"}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-gray-500">Phone</dt>
                  <dd className="text-right text-gray-900">
                    {form.phone || "Not provided"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Housing / location */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-900">
                Housing / location
              </h2>
              <dl className="space-y-2 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-gray-500">Current location</dt>
                  <dd className="text-right text-gray-900">
                    {form.currentLocation || "Not provided"}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-gray-500">Where you slept last night</dt>
                  <dd className="text-right text-gray-900">
                    {form.sleptLastNight || "Not provided"}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-gray-500">Currently homeless</dt>
                  <dd className="text-right text-gray-900">
                    {form.isCurrentlyHomeless || "Not provided"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Substance & treatment snapshot */}
        <section className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-900">
              Substance &amp; treatment snapshot
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-gray-500">Substances (last 30 days)</dt>
                <dd className="max-w-[60%] text-right text-gray-900">
                  {form.substances && form.substances.length > 0
                    ? form.substances.join(", ")
                    : "Not provided"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-gray-500">Last use</dt>
                <dd className="text-right text-gray-900">
                  {form.lastUse || "Not provided"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-gray-500">Frequency</dt>
                <dd className="text-right text-gray-900">
                  {form.frequency || "Not provided"}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-gray-500">Prior treatment</dt>
                <dd className="text-right text-gray-900">
                  {form.priorTreatment === "yes"
                    ? "Yes"
                    : form.priorTreatment === "no"
                    ? "No"
                    : "Not provided"}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Initials confirmation */}
        <section className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 md:p-5">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">
                Please type your initials to confirm this information is accurate
              </label>
              <p className="text-xs text-gray-500">
                This doesn&apos;t count as a legal signature, but it helps us make
                sure you&apos;ve reviewed everything carefully.
              </p>
            </div>

            <div className="max-w-[140px]">
              <Input
                value={form.initials}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    initials: e.target.value.toUpperCase(),
                  }))
                }
                maxLength={4}
                placeholder="ABC"
              />
            </div>
          </div>
        </section>

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
            onClick={onGetRecommendation}
            disabled={!canGetRecommendation || loading}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Submitting..." : "Get recommendation"}
          </button>
        </div>
      </div>
    </StepShell>
  );
}