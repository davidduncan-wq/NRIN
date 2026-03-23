"use client"

import type { AdaptivePrompt } from "@/lib/patient/getAdaptivePrompt"

type AdaptiveIntakePromptProps = {
  prompt: AdaptivePrompt
  value: string
  onChange: (value: string) => void
  onContinue: () => void
  onSkip: () => void
  loading?: boolean
}

export default function AdaptiveIntakePrompt({
  prompt,
  value,
  onChange,
  onContinue,
  onSkip,
  loading = false,
}: AdaptiveIntakePromptProps) {
  return (
    <section className="rounded-[24px] border border-stone-200/80 bg-[linear-gradient(180deg,#fffdfa_0%,#fcfaf6_100%)] shadow-[0_10px_30px_rgba(41,37,36,0.04)]">
      <div className="px-6 py-7 sm:px-9 sm:py-10">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
          We can show more options
        </div>

        <h3 className="mt-4 max-w-2xl text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-stone-900 sm:text-[2.35rem]">
          {prompt.prompt}
        </h3>

        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
          {prompt.reason}
        </p>

        <div className="mt-6">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={prompt.placeholder}
            rows={5}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-stone-300"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onSkip}
            className="text-left text-sm font-medium text-stone-600 transition hover:text-stone-900"
          >
            {prompt.skipLabel}
          </button>

          <button
            type="button"
            onClick={onContinue}
            disabled={loading}
            className="rounded-[18px] bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40 sm:px-6"
          >
            {loading ? "Saving..." : prompt.ctaLabel}
          </button>
        </div>
      </div>
    </section>
  )
}
