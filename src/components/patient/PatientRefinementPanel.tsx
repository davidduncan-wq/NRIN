"use client"

import { useEffect, useState } from "react"

export type PatientRefinementReason =
  | "too_far"
  | "wrong_program"
  | "doesnt_fit"
  | "other"

export type PatientRefinementValues = {
  refineGeo: "close" | "open"
  refineLevels: string[]
  refineFamily: boolean
  refineProfessional: boolean
  refineMAT: boolean
  refineReason: PatientRefinementReason
}

type PatientRefinementPanelProps = {
  open: boolean
  onClose: () => void
  onApply: (values: PatientRefinementValues) => void
  initialValues?: Partial<PatientRefinementValues>
}

const DEFAULT_VALUES: PatientRefinementValues = {
  refineGeo: "close",
  refineLevels: [],
  refineFamily: false,
  refineProfessional: false,
  refineMAT: false,
  refineReason: "too_far",
}

const LEVEL_OPTIONS = [
  { value: "detox", label: "Detox" },
  { value: "residential", label: "Residential" },
  { value: "php", label: "PHP" },
  { value: "iop", label: "IOP" },
  { value: "outpatient", label: "Outpatient" },
] as const

export default function PatientRefinementPanel({
  open,
  onClose,
  onApply,
  initialValues,
}: PatientRefinementPanelProps) {
  const [values, setValues] = useState<PatientRefinementValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
    refineLevels: initialValues?.refineLevels ?? DEFAULT_VALUES.refineLevels,
  })

  useEffect(() => {
    if (!open) return

    setValues({
      ...DEFAULT_VALUES,
      ...initialValues,
      refineLevels: initialValues?.refineLevels ?? DEFAULT_VALUES.refineLevels,
    })
  }, [open, initialValues])

  if (!open) return null

  function toggleLevel(level: string) {
    setValues((current) => {
      const exists = current.refineLevels.includes(level)

      return {
        ...current,
        refineLevels: exists
          ? current.refineLevels.filter((value) => value !== level)
          : [...current.refineLevels, level],
      }
    })
  }

  return (
    <div className="mt-6 rounded-[28px] border border-stone-200 bg-[linear-gradient(180deg,#fffdfa_0%,#faf8f4_100%)] px-5 py-5 shadow-[0_12px_30px_rgba(41,37,36,0.06)] sm:px-6 sm:py-6">
      <div className="max-w-3xl">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
          Let’s adjust the search
        </div>

        <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-stone-900 sm:text-2xl">
          Tell us what felt off.
        </h3>

        <p className="mt-3 text-sm leading-7 text-stone-600 sm:text-[15px]">
          We’ll keep your place and show options that should feel closer to what
          you’re looking for.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        <section>
          <div className="text-sm font-medium text-stone-900">
            What felt off about these options?
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              { value: "too_far", label: "They were too far away" },
              { value: "wrong_program", label: "Not the right type of program" },
              { value: "doesnt_fit", label: "They didn’t fit my situation" },
              { value: "other", label: "Something else felt off" },
            ].map((option) => {
              const active = values.refineReason === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setValues((current) => ({
                      ...current,
                      refineReason: option.value as PatientRefinementReason,
                    }))
                  }
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    active
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <div className="text-sm font-medium text-stone-900">
            Location preference
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setValues((current) => ({ ...current, refineGeo: "close" }))
              }
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                values.refineGeo === "close"
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
              }`}
            >
              Stay close to home
            </button>

            <button
              type="button"
              onClick={() =>
                setValues((current) => ({ ...current, refineGeo: "open" }))
              }
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                values.refineGeo === "open"
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
              }`}
            >
              I’m open to traveling
            </button>
          </div>
        </section>

        <section>
          <div className="text-sm font-medium text-stone-900">
            Level of care
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            {LEVEL_OPTIONS.map((option) => {
              const active = values.refineLevels.includes(option.value)

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleLevel(option.value)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    active
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>

          <p className="mt-3 text-xs leading-6 text-stone-500">
            Choose one or more if you want us to steer the recommendations more
            clearly.
          </p>
        </section>

        <section>
          <div className="text-sm font-medium text-stone-900">
            What else matters here?
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() =>
                setValues((current) => ({
                  ...current,
                  refineFamily: !current.refineFamily,
                }))
              }
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                values.refineFamily
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
              }`}
            >
              Family support matters
            </button>

            <button
              type="button"
              onClick={() =>
                setValues((current) => ({
                  ...current,
                  refineProfessional: !current.refineProfessional,
                }))
              }
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                values.refineProfessional
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
              }`}
            >
              Professional track matters
            </button>

            <button
              type="button"
              onClick={() =>
                setValues((current) => ({
                  ...current,
                  refineMAT: !current.refineMAT,
                }))
              }
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                values.refineMAT
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
              }`}
            >
              MAT support matters
            </button>
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onClose}
          className="text-left text-sm font-medium text-stone-600 transition hover:text-stone-900"
        >
          Keep current options
        </button>

        <button
          type="button"
          onClick={() => onApply(values)}
          className="rounded-[18px] bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 sm:px-6"
        >
          Show updated options
        </button>
      </div>
    </div>
  )
}
