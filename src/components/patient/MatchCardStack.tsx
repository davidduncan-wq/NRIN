"use client"

import { useEffect, useMemo, useState } from "react"
import MatchDetailSheet from "@/components/patient/MatchDetailSheet"
import { SignalPill } from "@/components/ui/SignalPill"
import { SurfaceCard } from "@/components/ui/SurfaceCard"
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
    showPrimaryAction = true,
}: {
    matches: MatchViewModel[]
    showPrimaryAction?: boolean
}) {
    const [open, setOpen] = useState(false)
    const [activated, setActivated] = useState(false)
    const [signalsVisible, setSignalsVisible] = useState(false)

    const current = matches[0]

    const initials = useMemo(
        () => (current ? getInitials(current.title) : ""),
        [current],
    )

    useEffect(() => {
        if (!current) return

        setSignalsVisible(false)

        const timer = window.setTimeout(() => {
            setSignalsVisible(true)
        }, 120)

        return () => window.clearTimeout(timer)
    }, [current?.id])

    if (!current) {
        return (
            <div className="mt-20 text-center text-stone-500">
                No matches available
            </div>
        )
    }

    if (activated) {
        return (
            <div className="mt-12 px-4 sm:mt-16 sm:px-0">
                <div className="mx-auto max-w-4xl rounded-[24px] border border-stone-200/80 bg-[linear-gradient(180deg,#fffdfa_0%,#fbf8f2_100%)] px-6 py-10 text-center shadow-[0_10px_30px_rgba(41,37,36,0.05)] sm:px-10 sm:py-14">
                    <div className="mx-auto max-w-2xl">
                        <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                            Help is on the way.
                        </h2>

                        <p className="mt-4 text-lg leading-8 text-stone-600">
                            We’ve contacted the admissions team at{" "}
                            {current.presentation.title}.
                        </p>

                        <p className="mt-3 text-base text-stone-500">
                            Expect a call shortly.
                        </p>

                        <p className="mt-6 text-sm text-stone-400">
                            Stay available — you’ve taken an important step.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    const location = current.presentation.location?.trim()
    const headline =
        current.presentation.subtitle?.trim() ||
        current.explanation.summary?.trim() ||
        ""

    return (
        <div
            className={`px-4 sm:px-0 transition-all duration-700 ease-out ${signalsVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
        >
            <SurfaceCard>
                <div className="px-6 py-7 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">


                            <div className="mt-4">
                                <h2 className="max-w-3xl text-[2.2rem] font-semibold leading-[1.03] tracking-[-0.035em] text-stone-900 sm:text-[2.8rem] lg:text-[3.25rem]">
                                    {current.presentation.title}
                                </h2>

                                {location && (
                                    <p className="mt-3 text-base font-medium text-stone-500 sm:text-lg">
                                        {location}
                                    </p>
                                )}
                            </div>

                            {headline && (
                                <div className="mt-8 max-w-2xl">
                                    <p className="text-[1.1rem] leading-8 text-stone-700 sm:text-[1.35rem] sm:leading-9">
                                        {headline}
                                    </p>
                                </div>
                            )}

                            {current.brochure.atAGlance.length > 0 && (
                                <div className="mt-8">
                                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
                                        Why this was selected
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2.5">
                                        {current.brochure.atAGlance.map((item, i) => (
                                            <SignalPill
                                                key={i}
                                                isVisible={signalsVisible}
                                                delayMs={i * 800}
                                            >
                                                {item}
                                            </SignalPill>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-start lg:justify-end">
                            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[20px] border border-stone-200 bg-white text-sm font-semibold text-stone-700 shadow-[0_4px_12px_rgba(41,37,36,0.04)] sm:h-20 sm:w-20 sm:text-base">
                                {current.presentation.logoUrl ? (
                                    <img
                                        src={current.presentation.logoUrl}
                                        alt={`${current.title} logo`}
                                        className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                                    />
                                ) : (
                                    initials
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 border-t border-stone-200/90 pt-6 sm:mt-12 sm:pt-7">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <button
                                onClick={() => setOpen((prev) => !prev)}
                                className="text-left text-sm font-medium text-stone-700 transition hover:text-stone-900"
                            >
                                {open ? "Hide details" : "See why we recommended this"}
                            </button>

                            {showPrimaryAction && (
                                <button
                                    onClick={() => setActivated(true)}
                                    className="rounded-[18px] bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 sm:px-6"
                                >
                                    {current.presentation.primaryCtaLabel}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </SurfaceCard>


            <MatchDetailSheet
                open={open}
                onClose={() => setOpen(false)}
                match={current}
            />
        </div>
    )
}