"use client"

type Pill = {
  label: string
  status: "met" | "missing"
}

type Props = {
  pills: Pill[]
  reveal?: boolean
}

export default function PatientNeedPillRow({ pills, reveal = true }: Props) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {pills.map((pill, i) => {
        const isMet = pill.status === "met"

        return (
          <div
            key={`${pill.label}-${i}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-500
              ${
                isMet
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-stone-50 border-stone-200 text-stone-400"
              }
            `}
            style={{
              opacity: reveal ? 1 : 0,
              transform: reveal ? "translateY(0px)" : "translateY(6px)",
              transitionDelay: `${i * 120}ms`,
            }}
          >
            <span className="flex items-center gap-1.5">
              <span>
                {isMet ? "✓" : ""}
              </span>
              <span>{pill.label}</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}