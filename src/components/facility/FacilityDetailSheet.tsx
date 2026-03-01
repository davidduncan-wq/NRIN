// src/components/facility/FacilityDetailSheet.tsx
"use client";

import type { TreatmentCenterRow } from "@/app/facility/dashboard/page";

type Props = {
  center: TreatmentCenterRow | null;
  onClose: () => void;
};

export default function FacilityDetailSheet({ center, onClose }: Props) {
  if (!center) return null;

  const insuranceFlags: string[] = [];
  if (center.accepts_medicaid) insuranceFlags.push("Medicaid");
  if (center.accepts_private_insurance) insuranceFlags.push("Private insurance");
  if (center.accepts_self_pay) insuranceFlags.push("Self-pay / cash");

  const hasInsuranceInfo =
    insuranceFlags.length > 0 || !!center.insurance_notes;

  const addressLines = [
    center.address_line1,
    center.address_line2,
    [center.city, center.postal_code].filter(Boolean).join(" "),
    center.country,
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 h-full w-full bg-slate-950/40"
        aria-label="Close facility details"
        onClick={onClose}
      />

      {/* Panel: desktop = right drawer; mobile = full sheet */}
      <section className="absolute inset-y-0 right-0 flex w-full sm:max-w-md sm:pl-10">
        <div className="ml-auto flex h-full w-full max-w-md flex-col rounded-none bg-white shadow-xl sm:rounded-l-3xl">
          {/* Header */}
          <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {center.name || "Untitled facility"}
              </h2>
              {center.city && (
                <p className="mt-0.5 text-xs text-slate-500">
                  {[
                    center.city,
                    center.postal_code,
                    center.country ?? undefined,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              <span className="sr-only">Close</span>
              ✕
            </button>
          </header>

          {/* Content */}
          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4 text-sm text-slate-700">
            {/* Contact */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Contact
              </h3>
              <div className="mt-2 space-y-1.5">
                {addressLines.length > 0 && (
                  <p className="whitespace-pre-line text-sm">
                    {addressLines.join("\n")}
                  </p>
                )}
                {center.phone && (
                  <p className="text-sm">
                    <span className="font-medium">Phone: </span>
                    <a
                      href={`tel:${center.phone}`}
                      className="text-sky-700 hover:underline"
                    >
                      {center.phone}
                    </a>
                  </p>
                )}
                {center.website && (
                  <p className="text-sm">
                    <span className="font-medium">Website: </span>
                    <a
                      href={center.website}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-sky-700 hover:underline"
                    >
                      {center.website}
                    </a>
                  </p>
                )}
              </div>
            </section>

            {/* Programs */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Programs
              </h3>
              <div className="mt-2 space-y-1.5">
                <p className="text-sm">
                  <span className="font-medium">Primary: </span>
                  {center.primary_program || "Not specified"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Other programs: </span>
                  {center.programs_offered?.trim()
                    ? center.programs_offered
                    : "Not listed yet"}
                </p>
              </div>
            </section>

            {/* Insurance */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Insurance & Payment
              </h3>
              <div className="mt-2 space-y-1.5">
                {hasInsuranceInfo ? (
                  <>
                    {insuranceFlags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {insuranceFlags.map((label) => (
                          <span
                            key={label}
                            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-700"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                    {center.insurance_notes && (
                      <p className="text-sm text-slate-700">
                        {center.insurance_notes}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-slate-500">
                    Insurance information not captured yet.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Footer */}
          <footer className="border-t border-slate-200 px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Close
            </button>
          </footer>
        </div>
      </section>
    </div>
  );
}