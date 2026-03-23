"use client"

import type { MatchViewModel } from "@/lib/matching/buildMatchViewModel"

export default function MatchDetailSheet({
    open,
    match,
}: {
    open: boolean
    onClose: () => void
    match: MatchViewModel | null
}) {
    if (!open || !match) return null

    return (
        <div className="mt-10 border-t border-stone-200 pt-10">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
                Why this may be a strong fit for you
            </div>

            <p className="mt-6 max-w-2xl text-[1.05rem] leading-8 text-stone-700">
                {match.explanation.summary}
            </p>

            {match.brochure.strengths.length > 0 && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {match.brochure.strengths.map((reason, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-stone-200 bg-[linear-gradient(180deg,#fffdfa_0%,#faf8f4_100%)] px-4 py-4"
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
            )}

            {match.brochure.supportingInfo.length > 0 && (
                <div className="mt-10">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
                        Supporting information
                    </div>

                    <div className="mt-4 space-y-5">
                        {match.brochure.supportingInfo.map((reason, i) => {
                            if (!reason.snippet && !reason.sourceUrl) return null

                            return (
                                <div key={i} className="max-w-2xl">
                                    {reason.snippet && (
                                        <div className="text-sm leading-7 text-stone-600">
                                            {reason.snippet}
                                        </div>
                                    )}

                                    {reason.sourceUrl && (
                                        <a
                                            href={reason.sourceUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-2 inline-block text-xs font-medium text-sky-700 underline underline-offset-2"
                                        >
                                            {reason.sourceLabel ?? "View source"}
                                        </a>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="mt-10">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
                    What happens next
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
                    {match.brochure.nextStep}
                </p>
            </div>

            {match.cautions.length > 0 && (
                <div className="mt-10">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
                        Worth confirming
                    </div>

                    <div className="mt-4 space-y-2">
                        {match.cautions.map((caution) => (
                            <p key={caution} className="text-sm leading-7 text-stone-600">
                                {caution}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}