// src/components/facility/ReferralDetailSheet.tsx
"use client";

import type { ReferralRow } from "@/app/facility/referrals/page";

type Props = {
    referral: ReferralRow | null;
    onClose: () => void;
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

export default function ReferralDetailSheet({ referral, onClose }: Props) {
    if (!referral) return null;

    const patientLabel = getPatientLabel(referral);

    return (
        <div className="fixed inset-0 z-40">
            <button
                className="absolute inset-0 h-full w-full bg-slate-950/40"
                onClick={onClose}
            />

            <section className="absolute inset-y-0 right-0 flex w-full sm:max-w-md sm:pl-10">
                <div className="ml-auto flex h-full w-full max-w-md flex-col rounded-none bg-white shadow-xl sm:rounded-l-3xl">
                    <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                {patientLabel}
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Referral ID: {referral.id}
                            </p>
                            {referral.facility?.name && (
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Facility: {referral.facility.name}
                                </p>
                            )}
                        </div>

                        <button
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                    </header>

                    <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4 text-sm text-slate-700">
                        <section>
                            <h3 className="text-xs font-semibold uppercase text-slate-500">
                                Status
                            </h3>
                            <p className="mt-2 text-sm">
                                {referral.status?.replace("_", " ") || "new"}
                            </p>
                            {referral.status_reason && (
                                <p className="mt-1 text-xs text-slate-600">
                                    {referral.status_reason}
                                </p>
                            )}
                        </section>

                        <section>
                            <h3 className="text-xs font-semibold uppercase text-slate-500">
                                Source
                            </h3>
                            <p className="mt-2 text-sm">
                                {referral.referral_source || "Not specified"}
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xs font-semibold uppercase text-slate-500">
                                Acuity Level
                            </h3>
                            <p className="mt-2 text-sm">
                                {referral.acuity_level || "Not specified"}
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xs font-semibold uppercase text-slate-500">
                                Notes
                            </h3>
                            <p className="mt-2 whitespace-pre-line text-sm">
                                {referral.notes || "No notes"}
                            </p>
                        </section>
                    </div>

                    <footer className="border-t border-slate-200 px-5 py-3">
                        <button
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </footer>
                </div>
            </section>
        </div>
    );
}