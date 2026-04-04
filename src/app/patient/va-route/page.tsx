export const dynamic = "force-dynamic";
export const revalidate = 0;

import { fetchVAFacilities } from "@/lib/va/fetchVAFacilities";

export default async function VARoutePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = searchParams ? await searchParams : undefined;

  const get = (key: string) => {
    const value = params?.[key];
    return typeof value === "string" ? value : Array.isArray(value) ? value[0] ?? "" : "";
  };

  const city = get("city");
  const state = get("state");
  const latitude = Number(get("latitude"));
  const longitude = Number(get("longitude"));

  const facilities = await fetchVAFacilities({
    latitude: Number.isFinite(latitude) ? latitude : undefined,
    longitude: Number.isFinite(longitude) ? longitude : undefined,
  });

  return (
    <main className="min-h-screen bg-white px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm text-stone-500">VA system route</p>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-stone-900 sm:text-4xl">
            Care for veterans typically begins through the VA system.
          </h1>
          <p className="text-base leading-7 text-stone-600">
            Based on your location, these are the closest VA-connected facilities in our system.
          </p>
        </div>

        <div className="mt-8 rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_10px_40px_rgba(28,25,23,0.06)] sm:p-8">
          <div className="space-y-2">
            <p className="text-sm text-stone-500">Current location</p>
            <p className="text-xl font-semibold text-stone-900">
              {[city, state].filter(Boolean).join(", ") || "Location received"}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {facilities.length === 0 ? (
            <div className="rounded-[28px] border border-stone-200 bg-white p-6 text-stone-600 shadow-[0_10px_40px_rgba(28,25,23,0.06)]">
              We could not find a nearby VA facility from the current location signal.
            </div>
          ) : (
            facilities.map((facility) => (
              <div
                key={facility.id}
                className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_10px_40px_rgba(28,25,23,0.06)] sm:p-8"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold tracking-[-0.02em] text-stone-900">
                    {facility.name}
                  </h2>
                  <p className="text-base text-stone-500">
                    {[facility.city, facility.state].filter(Boolean).join(", ")}
                  </p>
                  {"distance" in facility && typeof facility.distance === "number" && facility.distance < 9999 ? (
                    <p className="text-sm text-stone-500">
                      {Math.round(facility.distance)} miles away
                    </p>
                  ) : null}
                </div>

                {facility.website ? (
                  <div className="mt-6">
                    <a
                      href={facility.website.startsWith("http") ? facility.website : `https://${facility.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-[18px] bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
                    >
                      Visit facility
                    </a>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
