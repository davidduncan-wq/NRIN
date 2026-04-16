export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { fetchVAFacilities } from "@/lib/va/fetchVAFacilities";

export default async function VARoutePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
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
  const caseId = get("caseId");

  let caseCode: string | null = null;

  if (caseId) {
    const { data: caseRow } = await supabase
      .from("cases")
      .select("case_code")
      .eq("id", caseId)
      .single();

    caseCode = caseRow?.case_code ?? null;
  }

  const facilities = await fetchVAFacilities({
    latitude: Number.isFinite(latitude) ? latitude : undefined,
    longitude: Number.isFinite(longitude) ? longitude : undefined,
  });

  const intakeReturnParams = new URLSearchParams();
  intakeReturnParams.set("returnStep", "5");

  return (
    <main className="min-h-screen bg-white px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-3xl space-y-4">
          <div>
            <p className="text-sm font-medium text-stone-500">VA care path</p>
            {caseCode ? (
              <p className="mt-1 text-xs text-stone-400">Case code: {caseCode}</p>
            ) : null}
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-stone-900 sm:text-4xl">
            Care for veterans typically begins through the VA system.
          </h1>
          <p className="text-base leading-7 text-stone-600">
            You indicated VA coverage, so we’re guiding you into the VA pathway rather than showing a standard ranked marketplace of treatment options.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
          <section className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_10px_40px_rgba(28,25,23,0.06)] sm:p-8">
            <div className="space-y-2">
              <p className="text-sm text-stone-500">What happens next</p>
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-stone-900">
                Start with the nearest VA-connected facility
              </h2>
              <p className="text-base leading-7 text-stone-600">
                In most cases, the first step is connecting with the VA system nearby. From there, the VA can help determine the appropriate next stage of care and where that care should happen.
              </p>
            </div>

            <div className="mt-6 rounded-[24px] border border-stone-200 bg-stone-50 p-5">
              <p className="text-sm text-stone-500">Current location</p>
              <p className="mt-1 text-xl font-semibold text-stone-900">
                {[city, state].filter(Boolean).join(", ") || "Location received"}
              </p>
            </div>
          </section>

          <aside className="rounded-[28px] border border-stone-200 bg-stone-50 p-6 shadow-[0_10px_40px_rgba(28,25,23,0.04)] sm:p-8">
            <div className="space-y-3">
              <p className="text-sm text-stone-500">Other path</p>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-stone-900">
                Not looking for the VA route?
              </h2>
              <p className="text-sm leading-6 text-stone-600">
                You can return to the standard treatment search if you want to see non-VA treatment centers instead.
              </p>
              <div className="pt-2">
                <Link
                  href={`/patient?${intakeReturnParams.toString()}`}
                  className="inline-flex rounded-[18px] border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
                >
                  I’m not using the VA route
                </Link>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-8 space-y-4">
          {facilities.length === 0 ? (
            <div className="rounded-[28px] border border-stone-200 bg-white p-6 text-stone-600 shadow-[0_10px_40px_rgba(28,25,23,0.06)]">
              We could not find a nearby VA facility from the current location signal.
            </div>
          ) : (
            facilities.map((facility, index) => (
              <div
                key={facility.id}
                className="rounded-[28px] border border-[#005ea2]/20 bg-white p-6 shadow-[0_10px_40px_rgba(28,25,23,0.06)] sm:p-8"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-[#005ea2]">
                      {index === 0 ? "Closest VA-connected facility" : "VA-connected facility"}
                    </p>
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
                    <div className="sm:pt-1">
                      <a
                        href={facility.website.startsWith("http") ? facility.website : `https://${facility.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-[18px] bg-[#005ea2] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1a4480]"
                      >
                        Visit VA facility
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
