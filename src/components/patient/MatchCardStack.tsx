"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import MatchDetailSheet from "@/components/patient/MatchDetailSheet"
import MatchTransitionSurface from "@/components/matching/MatchTransitionSurface"
import PatientRefinementPanel, {
    type PatientRefinementValues,
} from "@/components/patient/PatientRefinementPanel"
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
    const [refinementOpen, setRefinementOpen] = useState(false)
    const [isRefining, setIsRefining] = useState(false)
    const [signalsVisible, setSignalsVisible] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const router = useRouter()
    const searchParams = useSearchParams()

    const current = matches[currentIndex] ?? matches[0]

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

    useEffect(() => {
        if (currentIndex > matches.length - 1) {
            setCurrentIndex(0)
        }
    }, [currentIndex, matches.length])

    useEffect(() => {
        if (!isRefining) return
        setIsRefining(false)
    }, [isRefining, searchParams, current?.id, matches.length])

    const transitionLines = useMemo(() => {
        const labels = ["Reviewing your clinical needs"]

        const levels = (searchParams.get("refineLevels") ?? "")
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)

        if (levels.includes("detox") || searchParams.get("needsDetox") === "1") {
            labels.push("Checking detox support")
        } else if (levels.includes("residential")) {
            labels.push("Checking residential fit")
        } else {
            labels.push("Confirming level of care fit")
        }

        if (searchParams.get("refineMAT") === "1") {
            labels.push("Reviewing medication support")
        } else if (searchParams.get("refineFamily") === "1") {
            labels.push("Reviewing family-support options")
        } else if (searchParams.get("insuranceStatus") === "yes") {
            labels.push("Checking payment path")
        } else if (searchParams.get("refineGeo") === "close") {
            labels.push("Looking closer to home")
        } else {
            labels.push("Reviewing program and support signals")
        }

        labels.push("Preparing updated recommendations")

        return labels.slice(0, 4)
    }, [searchParams])

    if (!current) {
        return (
            <div className="mt-20 text-center text-stone-500">
                No matches available
            </div>
        )
    }

    const location = current.presentation.location?.trim()
    const headline =
        current.presentation.subtitle?.trim() ||
        current.explanation.summary?.trim() ||
        ""

    const visibleReasonPills = current.presentation.reasonPills ?? []

    function handleChooseFacility() {
        if (isRefining) return

        const params = new URLSearchParams()

        const patientId = searchParams.get("patientId")
        const caseId = searchParams.get("caseId")
        const insuranceStatus = searchParams.get("insuranceStatus")
        const insuranceType = searchParams.get("insuranceType")
        const selfPayIntent = searchParams.get("selfPayIntent")

        if (patientId) params.set("patientId", patientId)
        if (caseId) params.set("caseId", caseId)
        if (insuranceStatus) params.set("insuranceStatus", insuranceStatus)
        if (insuranceType) params.set("insuranceType", insuranceType)
        if (selfPayIntent) params.set("selfPayIntent", selfPayIntent)

        params.set("facilityId", current.id)
        params.set("facilityName", current.presentation.title)
        params.set("matchScore", String(current.score ?? 0))
        if (current.recommendedProgramType) {
            params.set("recommendedProgramType", current.recommendedProgramType)
        }

        if (current.presentation.location) {
            params.set("facilityLocation", current.presentation.location)
        }

        router.push(`/patient/prescreen?${params.toString()}`)
    }

    function handleApplyRefinement(values: PatientRefinementValues) {
        const params = new URLSearchParams(searchParams.toString())

        params.set("refineGeo", values.refineGeo)

        if (values.refineLevels.length > 0) {
            params.set("refineLevels", values.refineLevels.join(","))
        } else {
            params.delete("refineLevels")
        }

        if (values.refineFamily) {
            params.set("refineFamily", "1")
        } else {
            params.delete("refineFamily")
        }

        if (values.refineProfessional) {
            params.set("refineProfessional", "1")
        } else {
            params.delete("refineProfessional")
        }

        if (values.refineMAT) {
            params.set("refineMAT", "1")
        } else {
            params.delete("refineMAT")
        }

        params.set("refineReason", values.refineReason)

        setIsRefining(true)
        setRefinementOpen(false)
        setOpen(false)

        router.push(`/patient/matches?${params.toString()}`)
    }

    const refinementInitialValues: Partial<PatientRefinementValues> = {
        refineGeo: searchParams.get("refineGeo") === "open" ? "open" : "close",
        refineLevels: (searchParams.get("refineLevels") ?? "")
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
        refineFamily: searchParams.get("refineFamily") === "1",
        refineProfessional: searchParams.get("refineProfessional") === "1",
        refineMAT: searchParams.get("refineMAT") === "1",
        refineReason:
            searchParams.get("refineReason") === "wrong_program" ||
            searchParams.get("refineReason") === "doesnt_fit" ||
            searchParams.get("refineReason") === "other"
                ? (searchParams.get("refineReason") as PatientRefinementValues["refineReason"])
                : "too_far",
    }

    const canGoPrev = currentIndex > 0
    const canGoNext = currentIndex < matches.length - 1

    return (
        <div
            className={`relative px-4 sm:px-0 transition-all duration-700 ease-out ${
                signalsVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
        >
            <MatchTransitionSurface
                open={isRefining}
                eyebrow="Updating recommendations"
                title="Looking for a better fit"
                body="We’re quietly reviewing the details you gave us and preparing a better set of options."
                lines={transitionLines}
                variant="card"
            />

            <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-stone-500">
                    Option {currentIndex + 1} of {matches.length}
                </div>

                {matches.length > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false)
                                setCurrentIndex((prev) => Math.max(0, prev - 1))
                            }}
                            disabled={isRefining || !canGoPrev}
                            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false)
                                setCurrentIndex((prev) => Math.min(matches.length - 1, prev + 1))
                            }}
                            disabled={isRefining || !canGoNext}
                            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

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

                            {visibleReasonPills.length > 0 && (
                                <div className="mt-8">
                                    <div className="mt-4 flex flex-wrap gap-2.5">
                                        {visibleReasonPills.map((item, i) => (
                                            <SignalPill
                                                key={`${current.id}-${i}`}
                                                isVisible={signalsVisible}
                                                delayMs={i * 120}
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
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                                <button
                                    onClick={() => {
                                        if (isRefining) return
                                        setRefinementOpen(false)
                                        setOpen((prev) => !prev)
                                    }}
                                    className="text-left text-sm font-medium text-stone-700 transition hover:text-stone-900"
                                >
                                    {open ? "Hide details" : "See why we recommended this"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (isRefining) return
                                        setOpen(false)
                                        setRefinementOpen((prev) => !prev)
                                    }}
                                    className="text-left text-sm font-medium text-stone-600 transition hover:text-stone-900"
                                >
                                    {refinementOpen ? "Hide refinement" : "Show me better options"}
                                </button>
                            </div>

                            {showPrimaryAction && (
                                <button
                                    onClick={handleChooseFacility}
                                    disabled={isRefining}
                                    className="rounded-[18px] bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60 sm:px-6"
                                >
                                    {current.presentation.primaryCtaLabel}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </SurfaceCard>

            <PatientRefinementPanel
                open={refinementOpen}
                onClose={() => setRefinementOpen(false)}
                onApply={handleApplyRefinement}
                initialValues={refinementInitialValues}
            />

            <MatchDetailSheet
                open={open}
                onClose={() => setOpen(false)}
                match={current}
            />
        </div>
    )
}
