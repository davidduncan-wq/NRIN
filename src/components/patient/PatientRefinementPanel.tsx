"use client"

import { useEffect, useMemo, useState } from "react"

export type PatientRefinementReason =
  | "too_far"
  | "missing_support"
  | "wrong_setting"
  | "other"

export type PatientRefinementValues = {
  refineGeo: "inherit" | "close" | "open"
  refineLevels: string[]
  refineEnvironment: string[]
  refineExperience: string[]
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
  refineGeo: "inherit",
  refineLevels: [],
  refineEnvironment: [],
  refineExperience: [],
  refineFamily: false,
  refineProfessional: false,
  refineMAT: false,
  refineReason: "other",
}

const ENVIRONMENT_OPTIONS = [
  { value: "island", label: "Island" },
  { value: "coastal", label: "Coastal" },
  { value: "desert", label: "Desert" },
  { value: "mountains", label: "Mountains" },
  { value: "west_coast", label: "West Coast" },
  { value: "east_coast", label: "East Coast" },
] as const

const EXPERIENCE_OPTIONS = [
  { value: "YOGA", label: "Yoga" },
  { value: "MEDITATION", label: "Meditation" },
  { value: "FAITH_BASED", label: "Faith-based" },
  { value: "HOME_LIKE", label: "Home-like" },
  { value: "LUXURY", label: "Luxury" },
  { value: "NATURE", label: "Nature" },
] as const

const LEVEL_OPTIONS = [
  { value: "detox", label: "Detox" },
  { value: "residential", label: "Residential" },
  { value: "php", label: "PHP" },
  { value: "iop", label: "IOP" },
  { value: "outpatient", label: "Outpatient" },
] as const

function ChoiceCard({
  active,
  title,
  body,
  onClick,
}: {
  active: boolean
  title: string
  body?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[18px] border px-4 py-3 text-left transition sm:px-5 sm:py-4 ${
        active
          ? "border-sky-200 bg-sky-50 text-sky-800"
          : "border-sky-100 bg-white text-sky-700 hover:bg-sky-50"
      }`}
    >
      <div className="text-sm font-medium">{title}</div>
      {body ? <div className="mt-1 text-xs leading-5 text-stone-500">{body}</div> : null}
    </button>
  )
}

function SignalChip({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[11px] transition sm:px-4 sm:py-2 sm:text-sm ${
        active
          ? "border-sky-200 bg-sky-50 text-sky-800"
          : "border-sky-100 bg-white text-sky-700 hover:bg-sky-50"
      }`}
    >
      {children}
    </button>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-[12px] font-medium text-stone-900 sm:text-sm">{children}</div>
}

function formatEnvironmentLabel(value: string): string {
  return ENVIRONMENT_OPTIONS.find((option) => option.value === value)?.label ?? value
}

function formatExperienceLabel(value: string): string {
  return EXPERIENCE_OPTIONS.find((option) => option.value === value)?.label ?? value
}

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
    refineEnvironment:
      initialValues?.refineEnvironment ?? DEFAULT_VALUES.refineEnvironment,
    refineExperience:
      initialValues?.refineExperience ?? DEFAULT_VALUES.refineExperience,
  })

  const [step, setStep] = useState(1)
  const [showEnvironmentChoices, setShowEnvironmentChoices] = useState(false)
  const [showExtras, setShowExtras] = useState(false)

  useEffect(() => {
    if (!open) return

    setValues({
      ...DEFAULT_VALUES,
      ...initialValues,
      refineLevels: initialValues?.refineLevels ?? DEFAULT_VALUES.refineLevels,
      refineEnvironment:
        initialValues?.refineEnvironment ?? DEFAULT_VALUES.refineEnvironment,
      refineExperience:
        initialValues?.refineExperience ?? DEFAULT_VALUES.refineExperience,
    })

    setStep(1)
    setShowEnvironmentChoices((initialValues?.refineEnvironment?.length ?? 0) > 0)
    setShowExtras(false)
  }, [open, initialValues])

  const suggestedExperience = useMemo(
    () =>
      EXPERIENCE_OPTIONS.filter(
        (option) => !values.refineExperience.includes(option.value),
      ),
    [values.refineExperience],
  )

  if (!open) return null

  function toggleEnvironment(environment: string) {
    setValues((current) => {
      const exists = current.refineEnvironment.includes(environment)
      return {
        ...current,
        refineEnvironment: exists
          ? current.refineEnvironment.filter((value) => value !== environment)
          : [environment],
      }
    })
  }

  function toggleExperience(exp: string) {
    setValues((current) => {
      const exists = current.refineExperience.includes(exp)
      return {
        ...current,
        refineExperience: exists
          ? current.refineExperience.filter((value) => value !== exp)
          : [...current.refineExperience, exp],
      }
    })
  }

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

  const activeSignals = [
    ...values.refineExperience.map(formatExperienceLabel),
    ...(values.refineFamily ? ["Family support"] : []),
    ...(values.refineProfessional ? ["Professional track"] : []),
    ...(values.refineMAT ? ["MAT support"] : []),
  ]

  return (
    <div className="mt-4 rounded-[28px] border border-stone-200 bg-[linear-gradient(180deg,#fffdfa_0%,#faf8f4_100%)] px-4 py-4 shadow-[0_12px_30px_rgba(41,37,36,0.04)] sm:mt-6 sm:px-5 sm:py-5">
      <div className="max-w-3xl">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400 sm:text-[11px]">
          Refine recommendations
        </div>

        <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-stone-900 sm:mt-3 sm:text-xl">
          We found several options that match your clinical needs.
        </h3>

        <p className="mt-2 text-[12px] leading-6 text-stone-600 sm:mt-3 sm:text-sm sm:leading-7">
          Now let’s narrow this down to what feels right for you.
        </p>
      </div>

      <div className="mt-6 space-y-6 sm:mt-8">
        {step === 1 && (
          <section>
            <SectionTitle>Would you like to stay close to home?</SectionTitle>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 sm:gap-3">
              <ChoiceCard
                active={values.refineGeo === "close"}
                title="Keep me close to home"
                body="Prioritize nearby options first."
                onClick={() =>
                  setValues((current) => ({ ...current, refineGeo: "close", refineReason: "too_far" }))
                }
              />

              <ChoiceCard
                active={values.refineGeo === "open" || values.refineGeo === "inherit"}
                title="Open up the search"
                body="Broaden the options to get a better fit."
                onClick={() =>
                  setValues((current) => ({ ...current, refineGeo: "open", refineReason: "other" }))
                }
              />
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <SectionTitle>Do you want to keep your current setting preference?</SectionTitle>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 sm:gap-3">
              <ChoiceCard
                active={!showEnvironmentChoices}
                title={
                  values.refineEnvironment.length > 0
                    ? `Keep ${values.refineEnvironment.map(formatEnvironmentLabel).join(", ")}`
                    : "Keep current setting"
                }
                body="Keep the current setting priority in the next set."
                onClick={() => {
                  setShowEnvironmentChoices(false)
                  setValues((current) => ({ ...current, refineReason: "wrong_setting" }))
                }}
              />

              <ChoiceCard
                active={showEnvironmentChoices}
                title="Choose another setting"
                body="Explore other environments for a better tradeoff."
                onClick={() => {
                  setShowEnvironmentChoices(true)
                  setValues((current) => ({ ...current, refineReason: "wrong_setting" }))
                }}
              />
            </div>

            {showEnvironmentChoices && (
              <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
                {ENVIRONMENT_OPTIONS.map((option) => (
                  <SignalChip
                    key={option.value}
                    active={values.refineEnvironment.includes(option.value)}
                    onClick={() => toggleEnvironment(option.value)}
                  >
                    {option.label}
                  </SignalChip>
                ))}
              </div>
            )}
          </section>
        )}

        {step === 3 && (
          <section>
            <SectionTitle>Would any of these make the fit better?</SectionTitle>

            {activeSignals.length > 0 && (
              <>
                <div className="mt-3 text-[11px] text-stone-500 sm:text-xs">
                  Already being emphasized
                </div>

                <div className="mt-2 flex flex-wrap gap-2 sm:gap-3">
                  {values.refineExperience.map((value) => (
                    <SignalChip
                      key={value}
                      active={true}
                      onClick={() => toggleExperience(value)}
                    >
                      {formatExperienceLabel(value)}
                    </SignalChip>
                  ))}

                  <SignalChip
                    active={values.refineFamily}
                    onClick={() =>
                      setValues((current) => ({
                        ...current,
                        refineFamily: !current.refineFamily,
                      }))
                    }
                  >
                    Family support
                  </SignalChip>

                  <SignalChip
                    active={values.refineProfessional}
                    onClick={() =>
                      setValues((current) => ({
                        ...current,
                        refineProfessional: !current.refineProfessional,
                      }))
                    }
                  >
                    Professional track
                  </SignalChip>

                  <SignalChip
                    active={values.refineMAT}
                    onClick={() =>
                      setValues((current) => ({
                        ...current,
                        refineMAT: !current.refineMAT,
                      }))
                    }
                  >
                    MAT support
                  </SignalChip>
                </div>
              </>
            )}

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-[11px] text-stone-500 sm:text-xs">
                Other things you may want to consider
              </div>

              <button
                type="button"
                onClick={() => setShowExtras((current) => !current)}
                className="text-[11px] font-medium text-stone-600 transition hover:text-stone-900 sm:text-xs"
              >
                {showExtras ? "Hide" : "Show"}
              </button>
            </div>

            {showExtras && (
              <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
                {suggestedExperience.map((option) => (
                  <SignalChip
                    key={option.value}
                    active={false}
                    onClick={() => toggleExperience(option.value)}
                  >
                    {option.label}
                  </SignalChip>
                ))}

                {!values.refineFamily && (
                  <SignalChip
                    active={false}
                    onClick={() =>
                      setValues((current) => ({
                        ...current,
                        refineFamily: true,
                        refineReason: "missing_support",
                      }))
                    }
                  >
                    Family support
                  </SignalChip>
                )}

                {!values.refineProfessional && (
                  <SignalChip
                    active={false}
                    onClick={() =>
                      setValues((current) => ({
                        ...current,
                        refineProfessional: true,
                        refineReason: "missing_support",
                      }))
                    }
                  >
                    Professional track
                  </SignalChip>
                )}

                {!values.refineMAT && (
                  <SignalChip
                    active={false}
                    onClick={() =>
                      setValues((current) => ({
                        ...current,
                        refineMAT: true,
                        refineReason: "missing_support",
                      }))
                    }
                  >
                    MAT support
                  </SignalChip>
                )}
              </div>
            )}
          </section>
        )}

        {step === 4 && (
          <section>
            <SectionTitle>Anything to change about level of care?</SectionTitle>

            <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
              {LEVEL_OPTIONS.map((option) => (
                <SignalChip
                  key={option.value}
                  active={values.refineLevels.includes(option.value)}
                  onClick={() => toggleLevel(option.value)}
                >
                  {option.label}
                </SignalChip>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-stone-200/80 pt-5 sm:mt-8 sm:pt-6">
        <button
          type="button"
          onClick={() => {
            if (step === 1) {
              onClose()
              return
            }
            setStep((current) => Math.max(1, current - 1))
          }}
          className="text-left text-sm font-medium text-stone-600 transition hover:text-stone-900"
        >
          {step === 1 ? "Keep current options" : "Back"}
        </button>

        <div className="flex items-center gap-2">
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((current) => Math.min(4, current + 1))}
              className="rounded-[18px] bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 sm:px-6"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onApply(values)}
              className="rounded-[18px] bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 sm:px-6"
            >
              Show better matches
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
