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
        <div className="mt-10 flex flex-col items-center">
            <div className="relative w-full max-w-3xl">
                {canLoop && next && (
                    <div className="pointer-events-none absolute inset-0 translate-y-3 scale-[0.97] opacity-60">
                        <div className="h-full rounded-[28px] border border-neutral-200 bg-neutral-50 shadow-sm" />
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
                        <article className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-xl">
                            <div className="border-b border-neutral-200 bg-neutral-50/70 px-8 py-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-base font-semibold tracking-tight text-neutral-900 shadow-sm">
                                            {currentInitials}
                                        </div>

                                        <div>
                                            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                                                Match {index + 1} of {matches.length}
                                            </div>
                                            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
                                                {current.title}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white">
                                        {current.score}
                                    </div>
                                </div>

                                <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600">
                                    Recommended based on level-of-care alignment, specialty fit,
                                    insurance compatibility, and facility profile confidence.
                                </p>
                            </div>

                            <div className="px-8 py-7">
                                <div className="flex flex-wrap gap-2">
                                    {current.badges.map((badge) => (
                                        <button
                                            key={badge}
                                            type="button"
                                            className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950"
                                        >
                                            {badge}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-6 space-y-3">
                                    {current.reasons.slice(0, 4).map((reason, reasonIndex) => (
                                        <button
                                            key={`${current.id}-reason-${reasonIndex}-${reason.label}`}
                                            onClick={() => setOpen(true)}
                                            type="button"
                                            className="block w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-left text-sm leading-6 text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-100"
                                        >
                                            {reason.label}
                                        </button>
                                    ))}
                                </div>

                                {current.cautions.length > 0 && (
                                    <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4">
                                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                                            Cautions
                                        </div>
                                        <div className="mt-3 space-y-2">
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

                                <div className="mt-8 flex items-center justify-between gap-4">
                                    <button
                                        onClick={goPrev}
                                        disabled={!canLoop}
                                        className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        Previous
                                    </button>

                                    <div className="text-sm font-medium text-neutral-500">
                                        {index + 1} / {matches.length}
                                    </div>

                                    <button
                                        onClick={goNext}
                                        disabled={!canLoop}
                                        className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        Next
                                    </button>
                                </div>

                                <div className="mt-6">
                                    <button className="w-full rounded-full bg-neutral-950 px-5 py-4 text-sm font-medium text-white transition hover:bg-neutral-800">
                                        Choose this facility
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