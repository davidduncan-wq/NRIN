// src/components/facility/ReferralsClient.tsx
"use client";

import { useMemo, useState } from "react";
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

type StatusFilterValue =
    | "all"
    | "new"
    | "in_review"
    | "accepted"
    | "declined"
    | "closed";

function normalizeStatus(raw: string | null | undefined): StatusFilterValue | "other" {
    const s = (raw ?? "new").toLowerCase();
    switch (s) {
        case "new":
            return "new";
        case "in_review":
            return "in_review";
        case "accepted":
            return "accepted";
        case "declined":
            return "declined";
        case "closed":
            return "closed";
        default:
            return "other";
    }
}

export default function ReferralsClient({ referrals }: Props) {
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");

    // If there are truly no referrals, show a simple empty state
    if (!referrals || referrals.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <h2 className="text-base font-semibold text-slate-900">
                    No referrals yet
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    New referrals will appear here as facilities submit them.
                </p>
            </div>
        );
    }

    const filteredReferrals = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();

        return referrals.filter((referral) => {
            // Status filter
            const normalized = normalizeStatus(referral.status);
            if (statusFilter !== "all" && normalized !== statusFilter) {
                return false;
            }

            // Search filter
            if (!q) return true;

            const patientLabel = getPatientLabel(referral).toLowerCase();
            const source = (referral.referral_source ?? "").toLowerCase();
            const idFragment = (referral.patient_id ?? referral.id ?? "")
                .toString()
                .toLowerCase();
            const statusText = (referral.status ?? "new").replace("_", " ").toLowerCase();

            return (
                patientLabel.includes(q) ||
                source.includes(q) ||
                idFragment.includes(q) ||
                statusText.includes(q)
            );
        });
    }, [referrals, searchTerm, statusFilter]);

    const hasMatches = filteredReferrals.length > 0;

    return (
        <div className="space-y-4">
            {/* Top bar: title + controls */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900">Referrals</h1>
                    <p className="text-sm text-slate-500">
                        View and manage incoming referrals for your facility.
                    </p>
                </div>

                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    {/* Search */}
                    <div className="w-full md:w-64">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by patient, ID, or source"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        />
                    </div>

                    {/* Status filter */}
                    <div className="w-full md:w-40">
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value as StatusFilterValue)
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        >
                            <option value="all">All statuses</option>
                            <option value="new">New</option>
                            <option value="in_review">In review</option>
                            <option value="accepted">Accepted</option>
                            <option value="declined">Declined</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                {/* Header row */}
                <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)] items-center border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <div>Patient</div>
                    <div>Source</div>
                    <div>Acuity</div>
                    <div>Status</div>
                    <div>Submitted</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-slate-100">
                    {hasMatches ? (
                        filteredReferrals.map((r) => {
                            const patientLabel = getPatientLabel(r);
                            const status = r.status ?? "new";

                            return (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => router.push(`/facility/referrals/${r.id}`)}
                                    className="grid w-full grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)] items-center px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
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
                        })
                    ) : (
                        <div className="px-4 py-6 text-sm text-slate-500">
                            No referrals match your current search or status filter.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}