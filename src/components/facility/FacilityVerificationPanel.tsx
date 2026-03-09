"use client";

import type { TreatmentCenterRow } from "@/app/facility/dashboard/page";

type Props = {
  center: TreatmentCenterRow | null;
};

function VerificationRow({
  label,
  status,
}: {
  label: string;
  status: "pending";
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="text-sm text-slate-800">{label}</div>
      <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
        {status}
      </div>
    </div>
  );
}

export default function FacilityVerificationPanel({ center }: Props) {
  if (!center) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
        Select a facility to review verification and document status.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
          Verification & Documents
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          {center.name || "Untitled facility"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          This panel will hold accreditation documents, licensing uploads, review notes, and
          approval state.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Current status</div>
          <div className="mt-4 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800">
            Pending verification model
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Verification workflow has not been wired yet. This is the correct home for document
            upload, reviewer notes, and approval state.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Required document categories</div>
          <div className="mt-4 space-y-3">
            <VerificationRow label="Joint Commission / CARF proof" status="pending" />
            <VerificationRow label="State license documentation" status="pending" />
            <VerificationRow label="Other compliance attachments" status="pending" />
          </div>
        </div>
      </div>
    </div>
  );
}