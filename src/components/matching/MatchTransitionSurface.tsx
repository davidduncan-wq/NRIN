"use client"

import { useEffect, useState } from "react"

function StageRow({
  label,
  active,
  done,
}: {
  label: string
  active: boolean
  done: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
        done
          ? "border-stone-200 bg-stone-50"
          : active
            ? "border-stone-300 bg-white"
            : "border-stone-100 bg-white"
      }`}
    >
      <span
        className={`text-sm ${
          done || active ? "text-stone-800" : "text-stone-400"
        }`}
      >
        {label}
      </span>

      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm transition ${
          done
            ? "bg-stone-900 text-white"
            : active
              ? "border border-stone-300 bg-white text-stone-500"
              : "border border-stone-200 bg-white text-stone-300"
        }`}
      >
        {done ? "✓" : active ? "…" : ""}
      </span>
    </div>
  )
}

export default function MatchTransitionSurface({
  open,
  eyebrow = "Reviewing recommendations",
  title,
  body,
  lines,
  variant = "fullscreen",
}: {
  open: boolean
  eyebrow?: string
  title: string
  body: string
  lines: string[]
  variant?: "fullscreen" | "card"
}) {
  const [activeStageIndex, setActiveStageIndex] = useState(0)

  useEffect(() => {
    if (!open) {
      setActiveStageIndex(0)
      return
    }

    setActiveStageIndex(0)

    const timers = lines.slice(1).map((_, index) =>
      window.setTimeout(() => setActiveStageIndex(index + 1), 550 * (index + 1)),
    )

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [open, lines])

  if (!open) return null

  const shellClass =
    variant === "fullscreen"
      ? "fixed inset-0 z-[100] flex items-center justify-center bg-white px-6"
      : "absolute inset-0 z-[90] flex items-center justify-center rounded-[28px] bg-white"

  return (
    <div className={shellClass}>
      <div className="w-full max-w-xl px-2">
        <div className="mx-auto max-w-lg rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_10px_40px_rgba(28,25,23,0.08)] sm:p-8">
          <div className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
              {eyebrow}
            </p>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-stone-900">
              {title}
            </h2>
            <p className="text-sm leading-6 text-stone-500">{body}</p>
          </div>

          <div className="mt-6 space-y-3">
            {lines.map((label, index) => (
              <StageRow
                key={`${label}-${index}`}
                label={label}
                active={activeStageIndex === index}
                done={activeStageIndex > index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
