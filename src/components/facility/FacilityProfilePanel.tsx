"use client";

import type { TreatmentCenterRow } from "@/app/facility/dashboard/page";

type Props = {
  center: TreatmentCenterRow | null;
};

function Field({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-sm text-slate-800">{value?.trim() || "—"}</div>
    </div>
  );
}

function BoolPill({
  label,
  active,
}: {
  label: string;
  active: boolean | null | undefined;
}) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      {label}
    </div>
  );
}

export default function FacilityProfilePanel({ center }: Props) {
  if (!center) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
        Select a facility from the directory to review its profile.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
            Facility Profile
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {center.name || "Untitled facility"}
          </h2>
          <p className="text-sm text-slate-600">
            Review core identity, program mix, insurance flags, and the patient-facing summary
            that will eventually be editable in the dashboard.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Facility name" value={center.name} />
        <Field
          label="Location"
          value={[center.city, center.postal_code, center.country].filter(Boolean).join(", ")}
        />
        <Field label="Phone" value={center.phone} />
        <Field label="Website" value={center.website} />
        <Field label="Primary program" value={center.primary_program} />
        <Field label="Programs offered" value={center.programs_offered} />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">Insurance Signals</div>
        <div className="mt-4 flex flex-wrap gap-2">
          <BoolPill label="Medicaid" active={center.accepts_medicaid} />
          <BoolPill label="Private insurance" active={center.accepts_private_insurance} />
          <BoolPill label="Self-pay" active={center.accepts_self_pay} />
        </div>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Insurance notes
          </div>
          <div className="mt-2">{center.insurance_notes?.trim() || "No insurance notes captured yet."}</div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">Patient-Facing Summary</div>
        <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          Imported website summary, AI summary, and facility override summary will live here in
          the next slice.
        </div>
      </div>
    </div>
  );
}