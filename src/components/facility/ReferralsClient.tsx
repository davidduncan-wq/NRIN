// src/components/facility/ReferralsClient.tsx
"use client";

import { useRouter } from "next/navigation";
import type { ReferralRow } from "@/app/facility/referrals/page";

type Props = {
    referrals: ReferralRow[];
};

function getPatientLabel(referral: ReferralRow): string {
    const patient = referral.patient as
        | {
            first_name?: string | null;
            last_name?: string | null;
        }
        | null
        | undefined;

    if (patient) {
        const first = patient.first_name ?? "";
        const last = patient.last_name ?? "";
        const full = `${first} ${last}`.trim();
        if (full.length > 0) return full;
    }

    if (referral.patient_id) {
        return `${referral.patient_id.slice(0, 8)}…`;
    }

    return "Unknown patient";
}

function getStatusPillClasses(status: string | null): string {
    const base =
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize";
    switch (status) {
        case "in_review":
            return `${base} bg-amber-50 text-amber-800`;
        case "accepted":
            return `${base} bg-emerald-50 text-emerald-800`;
        case "declined":
            return `${base} bg-rose-50 text-rose-800`;
        case "closed":
            return `${base} bg-slate-100 text-slate-800`;
        case "ama":
            return `${base} bg-orange-50 text-orange-800`;
        case "pending":
        case "new":
        default:
            return `${base} bg-sky-50 text-sky-800`;
    }
}

export default function ReferralsClient({ referrals }: Props) {
    const router = useRouter();

    if (referrals.length === 0) {
        return (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                No referrals yet.
            </div>
        );
    }

    return (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header row */}
            <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)] border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <div>Patient</div>
                <div>Source</div>
                <div>Acuity</div>
                <div>Status</div>
                <div>Submitted</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100">
                {referrals.map((r) => {
                    const patientLabel = getPatientLabel(r);
                    const status = r.status ?? "new";

                    return (
                        <button
                            key={r.id}
                            type="button"
                            onClick={() => router.push(`/facility/referrals/${r.id}`)}
                            className="grid w-full grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)] items-center px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                            <div className="truncate">{patientLabel}</div>
                            <div className="truncate">
                                {r.referral_source || "—"}
                            </div>
                            <div className="truncate">
                                {r.acuity_level || "—"}
                            </div>
                            <div>
                                <span className={getStatusPillClasses(status)}>
                                    {status.replace("_", " ")}
                                </span>
                            </div>
                            <div className="truncate text-xs text-slate-500">
                                {r.created_at
                                    ? new Date(r.created_at).toLocaleString()
                                    : "—"}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}