export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function VARoutePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = searchParams ? await searchParams : undefined

  const get = (key: string) => {
    const value = params?.[key]
    return typeof value === "string" ? value : Array.isArray(value) ? value[0] ?? "" : ""
  }

  const city = get("city")
  const state = get("state")

  return (
    <main className="min-h-screen bg-white px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm text-stone-500">VA system route</p>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-stone-900 sm:text-4xl">
            Care for veterans typically begins through the VA system.
          </h1>
          <p className="text-base leading-7 text-stone-600">
            NRIN is routing this case into the VA path instead of the standard treatment-center matcher.
          </p>
        </div>

        <div className="mt-10 rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_10px_40px_rgba(28,25,23,0.06)] sm:p-8">
          <div className="space-y-2">
            <p className="text-sm text-stone-500">Current location</p>
            <p className="text-xl font-semibold text-stone-900">
              {[city, state].filter(Boolean).join(", ") || "Location received"}
            </p>
          </div>

          <div className="mt-8 space-y-3 text-sm leading-6 text-stone-600">
            <p>This is a stub route.</p>
            <p>Next build will:</p>
            <p>• identify nearest VA facilities</p>
            <p>• sort them by distance</p>
            <p>• provide a VA-specific next-step surface</p>
          </div>
        </div>
      </div>
    </main>
  )
}
