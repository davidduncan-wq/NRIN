"use client"

type SignalPillProps = {
    children: React.ReactNode
    isVisible?: boolean
    delayMs?: number
}

export function SignalPill({
    children,
    isVisible = true,
    delayMs = 0,
}: SignalPillProps) {
    return (
        <div
            className={`inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-2 text-sm font-medium text-sky-800 transition-all duration-800 ease-out ${
                isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-1 opacity-0"
            }`}
            style={{ transitionDelay: `${delayMs}ms` }}
        >
            <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-[11px] font-semibold text-white transition-all duration-700 ease-out ${
                    isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"
                }`}
                style={{ transitionDelay: `${delayMs + 60}ms` }}
            >
                ✓
            </span>

            <span>{children}</span>
        </div>
    )
}