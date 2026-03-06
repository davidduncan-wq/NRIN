"use client";

import * as React from "react";
import { StepShell } from "./StepShell";
import { Input } from "@/components/ui/Input";
import type { FormState } from "@/app/patient/page";

type Step2Props = {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  loading: boolean;
  onNext: () => void;
  onBack: () => void;
};

export function Step2Contact({
  form,
  setForm,
  loading,
  onNext,
  onBack,
}: Step2Props) {
  const isComplete = Boolean(
    form.address && form.city && form.state && form.zip
  );

  return (
    <StepShell
      step={2}
      totalSteps={6}
      title="Contact & address"
      subtitle="We use this to match you to nearby programs and keep your referral organized."
    >
      {/* Street address */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-900">
          Street address
        </label>
        <Input
          value={form.address}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              address: e.target.value,
            }))
          }
          autoComplete="street-address"
        />
      </div>

      {/* City */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-900">City</label>
        <Input
          value={form.city}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              city: e.target.value,
            }))
          }
          autoComplete="address-level2"
        />
      </div>

      {/* State */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-900">State</label>
        <Input
          value={form.state}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              state: e.target.value,
            }))
          }
          autoComplete="address-level1"
        />
      </div>

      {/* ZIP */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-900">ZIP code</label>
        <Input
          value={form.zip}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              zip: e.target.value,
            }))
          }
          autoComplete="postal-code"
        />
      </div>

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