"use client";

import * as React from "react";
import { StepShell } from "./StepShell";
import { Input } from "@/components/ui/Input";
import ChoiceButton from "@/components/ui/ChoiceButton";
import type { FormState } from "@/app/patient/page";

type Step2Props = {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  loading: boolean;
  onNext: () => void;
  onBack: () => void;
};

const sexOptions = [
  { value: "male", label: "male" },
  { value: "female", label: "female" },
  { value: "intersex", label: "intersex" },
  { value: "prefer_not_to_say", label: "prefer\nnot_to_say" },
];

const genderOptions = [
  { value: "man", label: "man" },
  { value: "woman", label: "woman" },
  { value: "nonbinary", label: "nonbinary" },
  { value: "another", label: "another" },
  { value: "prefer_not_to_say", label: "prefer\nnot_to_say" },
];

export function Step2Contact({
  form,
  setForm,
  loading,
  onNext,
  onBack,
}: Step2Props) {
  const isComplete = Boolean(
    form.address &&
      form.city &&
      form.state &&
      form.zip &&
      form.sexAtBirth &&
      form.genderIdentity
  );

  return (
    <StepShell
      step={2}
      totalSteps={6}
      title="Identity & address"
      subtitle="Where can we reach you, and how do you describe yourself?"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="space-y-2 md:col-span-12">
            <label className="text-sm font-medium text-gray-900">
              Home / primary address
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

          <div className="space-y-2 md:col-span-8">
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

          <div className="space-y-2 md:col-span-4">
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

          <div className="space-y-2 md:col-span-3">
            <label className="text-sm font-medium text-gray-900">ZIP</label>
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
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-900">
            Sex assigned at birth
          </label>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {sexOptions.map((option) => (
              <ChoiceButton
                key={option.value}
                selected={form.sexAtBirth === option.value}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    sexAtBirth: option.value,
                  }))
                }
              >
                <span className="text-sm whitespace-pre-line">{option.label}</span>
              </ChoiceButton>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-900">
            Gender identity
          </label>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {genderOptions.map((option) => (
              <ChoiceButton
                key={option.value}
                selected={form.genderIdentity === option.value}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    genderIdentity: option.value,
                  }))
                }
              >
                <span className="text-sm whitespace-pre-line">{option.label}</span>
              </ChoiceButton>
            ))}
          </div>
        </div>

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