"use client"

import { AnimatePresence, motion } from "framer-motion"
import MatchDetailSheet from "@/components/patient/MatchDetailSheet"
import { useMemo, useState } from "react"
import type { MatchViewModel } from "@/lib/matching/buildMatchViewModel"

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
}

function formatReasonLabel(label: string) {
    return label
        .replace(/^Detected acceptance of\s+/i, "Accepts ")
        .replace(/^Shows\s+/i, "")
        .replace(/^Offers\s+/i, "")
        .replace(/^Matches\s+/i, "Matches ")
        .replace(/blue_cross_blue_shield/gi, "Blue Cross Blue Shield")
        .replace(/united_healthcare/gi, "United Healthcare")
        .replace(/\bmat\b/gi, "Medication-Assisted Treatment")
        .replace(/dual-diagnosis/gi, "Dual Diagnosis")
        .replace(/family-program/gi, "Family Program")
        .replace(/professional-track programming/gi, "Professional Program")
        .replace(/\s+/g, " ")
        .trim()
}

function buildSubline(title: string) {
    const lower = title.toLowerCase()

    if (lower.includes("recovery")) return "Recovery Center"
    if (lower.includes("health")) return "Behavioral Health"
    if (lower.includes("clinic")) return "Treatment Clinic"
    if (lower.includes("rehab")) return "Treatment Center"

    return "Treatment Center"
}

export default function MatchCardStack({ matches }: { matches: MatchViewModel[] }) {
    const [index, setIndex] = useState(0)
    const [direction, setDirection] = useState<1 | -1>(1)
    const [open, setOpen] = useState(false)

    const nextIndex = (index + 1) % matches.length

    const current = matches[index]
    const next = matches[nextIndex]

    const canLoop = matches.length > 1

    const currentInitials = useMemo(
        () => (current ? getInitials(current.title) : ""),
        [current],
    )

    const topReasons = useMemo(
        () => current?.reasons.slice(0, 3) ?? [],
        [current],
    )

    const goNext = () => {
        if (!canLoop) return
        setDirection(1)
        setIndex((i) => (i + 1) % matches.length)
    }

    const goPrev = () => {
        if (!canLoop) return
        setDirection(-1)
        setIndex((i) => (i - 1 + matches.length) % matches.length)
    }

    if (!current) {
        return (
            <div className="mt-20 text-center text-neutral-500">
                No matches available
            </div>
        )
    }

    return (
        <div className="mt-8 flex flex-col items-center sm:mt-10">
            <div className="relative w-full max-w-3xl">
                {canLoop && next && (
                    <div className="pointer-events-none absolute inset-0 translate-y-2 scale-[0.985] opacity-50 sm:translate-y-3 sm:scale-[0.97] sm:opacity-60">
                        <div className="h-full rounded-[24px] border border-neutral-200 bg-neutral-50 shadow-sm sm:rounded-[28px]" />
                    </div>
                )}

                <AnimatePresence mode="wait" initial={false} custom={direction}>
                    <motion.div
                        key={current.id}
                        custom={direction}
                        initial={{ x: direction > 0 ? 160 : -160, opacity: 0, scale: 0.96 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{ x: direction > 0 ? -220 : 220, opacity: 0, scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 280, damping: 28 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.18}
                        onDragEnd={(_, info) => {
                            const offset = info.offset.x
                            const velocity = info.velocity.x

                            if ((offset < -110 || velocity < -700) && canLoop) {
                                goNext()
                                return
                            }

                            if ((offset > 110 || velocity > 700) && canLoop) {
                                goPrev()
                            }
                        }}
                        className="relative z-10 cursor-grab active:cursor-grabbing"
                    >
                        <article className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-lg sm:rounded-[28px] sm:shadow-xl">
                            <div className="border-b border-neutral-200 bg-white px-5 py-5 sm:px-8 sm:py-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold tracking-tight text-neutral-900 sm:h-14 sm:w-14 sm:text-base">
                                            {current.presentation.logoUrl ? (
                                                <img
                                                    src={current.presentation.logoUrl}
                                                    className="h-12 w-12 object-contain"
                                                />
                                            ) : (
                                                currentInitials
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 sm:text-[11px] sm:tracking-[0.22em]">
                                                Match {index + 1} of {matches.length}
                                            </div>
                                            <h2 className="mt-1 text-2xl font-semibold leading-tight tracking-tight text-neutral-950 sm:text-3xl">
                                                {current.title}
                                            </h2>
                                            <div className="mt-1 text-sm text-neutral-500">
                                                {current.presentation.subtitle}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="shrink-0 rounded-full border border-neutral-900 px-3 py-1.5 text-sm font-medium text-neutral-950 sm:px-4 sm:py-2">
                                        {current.presentation.scoreLabel}
                                    </div>
                                </div>
                            </div>

                            <div className="px-5 py-5 sm:px-8 sm:py-6">


                                <div className="mt-6">
                                    <button
                                        onClick={() => setOpen(true)}
                                        className="text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
                                    >
                                        {current.presentation.explanationCtaLabel}
                                    </button>
                                </div>

                                {current.cautions.length > 0 && (
                                    <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4 sm:mt-6">
                                        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400 sm:text-xs sm:tracking-[0.18em]">
                                            Cautions
                                        </div>
                                        <div className="mt-2 space-y-2">
                                            {current.cautions.slice(0, 2).map((caution) => (
                                                <div
                                                    key={caution}
                                                    className="text-sm leading-6 text-neutral-600"
                                                >
                                                    {caution}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 flex items-center justify-between gap-4 sm:mt-8">
                                    <button
                                        onClick={goPrev}
                                        disabled={!canLoop}
                                        className="rounded-full border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-30 sm:px-5 sm:py-3"
                                    >
                                        Previous
                                    </button>

                                    <div className="text-sm font-medium text-neutral-400">
                                        {index + 1} / {matches.length}
                                    </div>

                                    <button
                                        onClick={goNext}
                                        disabled={!canLoop}
                                        className="rounded-full border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-30 sm:px-5 sm:py-3"
                                    >
                                        Next
                                    </button>
                                </div>

                                <div className="mt-5 sm:mt-6">
                                    <button className="w-full rounded-full bg-neutral-950 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800 sm:py-4">
                                        {current.presentation.primaryCtaLabel}
                                    </button>
                                </div>
                            </div>
                        </article>
                    </motion.div>
                </AnimatePresence>
            </div>

            <MatchDetailSheet
                open={open}
                onClose={() => setOpen(false)}
                match={current}
            />
        </div>
    )
}