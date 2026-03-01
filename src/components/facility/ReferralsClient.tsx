// src/components/facility/ReferralsClient.tsx
"use client";

import { useState } from "react";
import type { ReferralRow } from "@/app/facility/referrals/page";
import ReferralDetailSheet from "./ReferralDetailSheet";

type Props = {
    referrals: ReferralRow[];
};

function getPatientLabel(referral: ReferralRow): string {
    const patient = referral.patient;
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
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selectedReferral =
        referrals.find((r) => r.id === selectedId) ?? null;

    return (
        <>
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-left text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 font-medium text-slate-700">Patient</th>
                                <th className="px-4 py-3 font-medium text-slate-700">Source</th>
                                <th className="px-4 py-3 font-medium text-slate-700">Acuity</th>
                                <th className="px-4 py-3 font-medium text-slate-700">Status</th>
                                <th className="px-4 py-3 font-medium text-slate-700">
                                    Submitted
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {referrals.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-6 text-center text-sm text-slate-500"
                                    >
                                        No referrals yet.
                                    </td>
                                </tr>
                            ) : (
                                referrals.map((r) => {
                                    const patientLabel = getPatientLabel(r);
                                    const status = r.status ?? "new";

                                    return (
                                        <tr
                                            key={r.id}
                                            onClick={() => setSelectedId(r.id)}
                                            className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-3 text-slate-900">
                                                {patientLabel}
                                            </td>

                                            <td className="px-4 py-3 text-slate-700">
                                                {r.referral_source || "—"}
                                            </td>

                                            <td className="px-4 py-3 text-slate-700">
                                                {r.acuity_level || "—"}
                                            </td>

                                            <td className="px-4 py-3">
                                                <span className={getStatusPillClasses(status)}>
                                                    {status.replace("_", " ")}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-slate-700">
                                                {r.created_at
                                                    ? new Date(r.created_at).toLocaleString()
                                                    : "—"}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <ReferralDetailSheet
                referral={selectedReferral}
                onClose={() => setSelectedId(null)}
            />
        </>
    );
}