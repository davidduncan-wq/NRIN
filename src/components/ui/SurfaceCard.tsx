"use client"

export function SurfaceCard({ children }: { children: React.ReactNode }) {
    return (
        <section className="rounded-[24px] border border-stone-200/70 bg-[linear-gradient(180deg,#fffdfa_0%,#fbf8f2_100%)] shadow-[0_12px_32px_rgba(41,37,36,0.06)]">
            {children}
        </section>
    )
}