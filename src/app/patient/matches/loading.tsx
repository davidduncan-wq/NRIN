export default function LoadingMatches() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 p-6 shadow-sm bg-white space-y-6">
        
        <div className="text-center space-y-2">
          <div className="text-xs tracking-wide text-stone-400 uppercase">
            Reviewing recommendations
          </div>
          <div className="text-lg font-semibold text-stone-900">
            Finding the right options
          </div>
          <div className="text-sm text-stone-500">
            We’re quietly reviewing what you shared and preparing your recommendations.
          </div>
        </div>

        <div className="space-y-3">
          
          <Step label="Reviewing your clinical needs" done />
          <Step label="Checking detox support" done />
          <Step label="Reviewing support signals" done />
          <Step label="Preparing your recommendations" loading />

        </div>

      </div>
    </main>
  )
}

function Step({
  label,
  done,
  loading,
}: {
  label: string
  done?: boolean
  loading?: boolean
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-700">
      <span>{label}</span>
      <span className="text-stone-400">
        {done ? "✓" : loading ? "…" : ""}
      </span>
    </div>
  )
}
