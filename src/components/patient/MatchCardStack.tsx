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

export default function MatchCardStack({
    matches,
}: {
    matches: MatchViewModel[]
}) {
    const [index, setIndex] = useState(0)
    const [direction, setDirection] = useState<1 | -1>(1)
    const [open, setOpen] = useState(false)
    const [activated, setActivated] = useState(false)

    const nextIndex = (index + 1) % matches.length
    const current = matches[index]
    const next = matches[nextIndex]
    const canLoop = matches.length > 1

    const currentInitials = useMemo(
        () => (current ? getInitials(current.title) : ""),
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

    if (activated) {
        return (
            <div className="mt-20 flex flex-col items-center px-6 text-center">
                <div className="max-w-xl">
                    <h2 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                        Help is on the way.
                    </h2>

                    <p className="mt-4 text-lg leading-relaxed text-stone-600">
                        We’ve alerted the admissions team at{" "}
                        {current.presentation.title}.
                    </p>

                    <p className="mt-3 text-base text-stone-500">
                        They’ll contact you shortly.
                    </p>

                    <p className="mt-6 text-sm text-stone-400">
                        Most facilities respond within a few minutes.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="mt-10 flex flex-col items-center sm:mt-14">
            <div className="relative w-full max-w-3xl">
                {canLoop && next && (
                    <div className="pointer-events-none absolute inset-0 translate-y-3 scale-[0.985] opacity-45">
                        <div className="h-full rounded-[28px] border border-stone-200 bg-stone-50" />
                    </div>
                )}

                <AnimatePresence mode="wait" initial={false} custom={direction}>
                    <motion.div
                        key={current.id}
                        custom={direction}
                        initial={{
                            x: direction > 0 ? 160 : -160,
                            opacity: 0,
                            scale: 0.97,
                        }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{
                            x: direction > 0 ? -220 : 220,
                            opacity: 0,
                            scale: 0.97,
                        }}
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
                        <article className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                            <div className="px-6 py-6 sm:px-10 sm:py-10">
                                <div className="flex items-start gap-4 sm:gap-5">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-stone-200 bg-stone-50 text-sm font-semibold tracking-tight text-stone-900 sm:h-16 sm:w-16 sm:text-base">
                                        {current.presentation.logoUrl ? (
                                            <img
                                                src={current.presentation.logoUrl}
                                                alt={`${current.title} logo`}
                                                className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                                            />
                                        ) : (
                                            currentInitials
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        {current.presentation.eyebrow && (
                                            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                                                {current.presentation.eyebrow}
                                            </div>
                                        )}

                                        <h2 className="mt-1 text-3xl font-semibold leading-tight tracking-[-0.02em] text-stone-950 sm:text-4xl">
                                            {current.presentation.title}
                                        </h2>

                                        {current.presentation.subtitle && (
                                            <p className="mt-3 max-w-xl text-base leading-7 text-stone-700 sm:text-lg">
                                                {current.presentation.subtitle}
                                            </p>
                                        )}

                                        <p className="mt-4 max-w-xl text-sm leading-6 text-stone-500 sm:text-base">
                                            {current.presentation.reassuranceLine}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="order-2 flex items-center gap-2 text-xs text-stone-400 sm:order-1">
                                        <button
                                            onClick={goPrev}
                                            disabled={!canLoop}
                                            className="rounded-full border border-stone-100 px-3.5 py-2 text-stone-500 transition hover:border-stone-200 hover:text-stone-800 disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                            Previous
                                        </button>

                                        <div className="min-w-[48px] text-center">
                                            {index + 1} / {matches.length}
                                        </div>

                                        <button
                                            onClick={goNext}
                                            disabled={!canLoop}
                                            className="rounded-full border border-stone-100 px-3.5 py-2 text-stone-500 transition hover:border-stone-200 hover:text-stone-800 disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                            Next
                                        </button>
                                    </div>

                                    <div className="order-1 flex flex-col gap-3 sm:order-2 sm:items-end">
                                        <button
                                            onClick={() => setOpen(true)}
                                            className="text-left text-sm font-medium text-stone-800 underline underline-offset-4 transition hover:text-stone-600 sm:text-right"
                                        >
                                            {current.presentation.explanationCtaLabel}
                                        </button>

                                        <button
                                            onClick={() => setActivated(true)}
                                            className="rounded-full bg-stone-950 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-stone-800"
                                        >
                                            {current.presentation.primaryCtaLabel}
                                        </button>
                                    </div>
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