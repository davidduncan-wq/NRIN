"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { MatchViewModel } from "@/lib/matching/buildMatchViewModel"

export default function MatchDetailSheet({
    open,
    onClose,
    match,
}: {
    open: boolean
    onClose: () => void
    match: MatchViewModel | null
}) {
    if (!match) return null

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.32 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 260, damping: 30 }}
                        className="fixed inset-x-0 bottom-0 z-50 max-h-[88vh] rounded-t-[32px] bg-white shadow-2xl"
                    >
                        <div className="mx-auto flex max-h-[88vh] max-w-3xl flex-col">
                            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-[32px] border-b border-stone-200 bg-white px-6 py-5 sm:px-8">
                                <div className="min-w-0 pr-4">
                                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                                        Explore this option
                                    </div>
                                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-950 sm:text-2xl">
                                        {match.presentation.title}
                                    </h2>
                                    {match.presentation.location && (
                                        <div className="mt-1 text-sm text-stone-400">
                                            {match.presentation.location}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={onClose}
                                    className="shrink-0 rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-700"
                                >
                                    Close
                                </button>
                            </div>

                            <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
                                <section className="border-b border-stone-100 pb-8">
                                    {match.presentation.subtitle && (
                                        <p className="max-w-2xl text-lg leading-8 text-stone-800 sm:text-[1.15rem]">
                                            {match.presentation.subtitle}
                                        </p>
                                    )}

                                    {match.presentation.reassuranceLine && (
                                        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
                                            {match.presentation.reassuranceLine}
                                        </p>
                                    )}

                                    <div className="mt-8">
                                        <button className="w-full rounded-full bg-stone-950 px-5 py-4 text-sm font-medium text-white sm:w-auto sm:min-w-[260px]">
                                            Continue with this facility
                                        </button>
                                    </div>
                                </section>

                                <section className="pt-8">
                                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                                        Why this place may fit
                                    </div>

                                    <p className="mt-4 max-w-2xl text-base leading-8 text-stone-700">
                                        {match.explanation.summary}
                                    </p>
                                </section>

                                {match.reasons.length > 0 && (
                                    <section className="mt-10">
                                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                                            What stands out
                                        </div>

                                        <div className="mt-4 space-y-4">
                                            {match.reasons.map((reason, reasonIndex) => (
                                                <div
                                                    key={`${match.id}-reason-${reasonIndex}-${reason.label}`}
                                                    className="rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-4"
                                                >
                                                    <div className="text-sm font-medium text-stone-900">
                                                        {reason.label}
                                                    </div>

                                                    {reason.snippet && (
                                                        <div className="mt-2 text-sm leading-7 text-stone-600">
                                                            {reason.snippet}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                <section className="mt-10">
                                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                                        What happens next
                                    </div>

                                    <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
                                        If you choose this facility, their admissions team will
                                        reach out shortly to speak with you and confirm next
                                        steps.
                                    </p>
                                </section>

                                {match.cautions.length > 0 && (
                                    <section className="mt-10">
                                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                                            Important to note
                                        </div>

                                        <div className="mt-3 space-y-2">
                                            {match.cautions.map((caution) => (
                                                <div
                                                    key={caution}
                                                    className="text-sm leading-7 text-stone-600"
                                                >
                                                    {caution}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {match.reasons.some(
                                    (reason) => reason.snippet || reason.sourceLabel || reason.sourceUrl,
                                ) && (
                                    <section className="mt-10 border-t border-stone-100 pt-8">
                                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                                            Supporting information
                                        </div>

                                        <div className="mt-4 space-y-4">
                                            {match.reasons.map((reason, reasonIndex) => {
                                                if (
                                                    !reason.snippet &&
                                                    !reason.sourceLabel &&
                                                    !reason.sourceUrl
                                                ) {
                                                    return null
                                                }

                                                return (
                                                    <div
                                                        key={`${match.id}-evidence-${reasonIndex}-${reason.label}`}
                                                        className="rounded-2xl border border-stone-200 px-4 py-4"
                                                    >
                                                        <div className="text-sm font-medium text-stone-900">
                                                            {reason.label}
                                                        </div>

                                                        {reason.snippet && (
                                                            <div className="mt-2 text-sm leading-7 text-stone-600">
                                                                {reason.snippet}
                                                            </div>
                                                        )}

                                                        {(reason.sourceLabel || reason.sourceUrl) && (
                                                            <div className="mt-3 text-xs text-stone-500">
                                                                {reason.sourceUrl ? (
                                                                    <a
                                                                        href={reason.sourceUrl}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="underline underline-offset-2"
                                                                    >
                                                                        {reason.sourceLabel ?? "View source"}
                                                                    </a>
                                                                ) : (
                                                                    reason.sourceLabel
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </section>
                                )}

                                <div className="mt-10 pb-4">
                                    <button className="w-full rounded-full bg-stone-950 px-5 py-4 text-sm font-medium text-white">
                                        Continue with this facility
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}