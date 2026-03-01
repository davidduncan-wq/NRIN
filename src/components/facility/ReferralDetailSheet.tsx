// src/components/facility/ReferralDetailSheet.tsx
"use client";

import React from "react";
import CheckIcon from "@/components/ui/CheckIcon";
import ChoiceButton from "@/components/ui/ChoiceButton";

type Referral = {
    id: string;
    patient_id: string;
    referral_source: string | null;
    status: string;
    created_at: string | null;
    updated_at: string | null;
};

type Patient = {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    date_of_birth?: string | null;
    phone?: string | null;
};

type ReferralDetailSheetProps = {
    referral: Referral;
    patient: Patient | null;
    isUpdatingStatus: boolean;
    onChangeStatus: (nextStatus: string) => void;
};

const STATUS_FLOW = [
    "new",
    "in_review",
    "accepted",
    "declined",
    "closed",
] as const;

const formatDateTime = (value: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
};

const formatDOB = (value: string | null | undefined) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
};

const formatPhone = (value: string | null | undefined) => {
    if (!value) return "—";
    return value;
};

const initials = (patient: Patient | null) => {
    if (!patient) return "";
    const first = patient.first_name?.[0] ?? "";
    const last = patient.last_name?.[0] ?? "";
    return (first + last).toUpperCase();
};

const fullName = (patient: Patient | null) => {
    if (!patient) return "Unknown patient";
    const parts = [patient.first_name, patient.last_name].filter(Boolean);
    return parts.length ? parts.join(" ") : "Unnamed patient";
};

const statusLabel = (status: string) => {
    switch (status) {
        case "new":
            return "New";
        case "in_review":
            return "In Review";
        case "accepted":
            return "Accepted";
        case "declined":
            return "Declined";
        case "closed":
            return "Closed";
        default:
            return status;
    }
};

const statusBadgeClasses = (status: string) => {
    const base =
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border";
    switch (status) {
        case "new":
            return `${base} border-blue-200 bg-blue-50 text-blue-700`;
        case "in_review":
            return `${base} border-amber-200 bg-amber-50 text-amber-700`;
        case "accepted":
            return `${base} border-emerald-200 bg-emerald-50 text-emerald-700`;
        case "declined":
            return `${base} border-rose-200 bg-rose-50 text-rose-700`;
        case "closed":
            return `${base} border-slate-200 bg-slate-50 text-slate-600`;
        default:
            return `${base} border-slate-200 bg-slate-50 text-slate-600`;
    }
};

export default function ReferralDetailSheet({
    referral,
    patient,
    isUpdatingStatus,
    onChangeStatus,
}: ReferralDetailSheetProps) {
    const [notesDraft, setNotesDraft] = React.useState("");

    // NOTE: This is intentionally *not* persisted yet.
    // The referrals table does not currently have a `notes` column.
    // Once schema is migrated, wire notesDraft to Supabase.

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 lg:flex-row lg:py-10">
            {/* Left column: identity + metadata */}
            <div className="flex-1 space-y-6">
                {/* Header card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
                            {initials(patient)}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-lg font-semibold text-slate-900">
                                    {fullName(patient)}
                                </h1>
                                <span className={statusBadgeClasses(referral.status)}>
                                    {statusLabel(referral.status)}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500">
                                Referral ID:{" "}
                                <span className="font-mono text-xs text-slate-600">
                                    {referral.id}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Referral source
                            </p>
                            <p>{referral.referral_source ?? "—"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Created at
                            </p>
                            <p>{formatDateTime(referral.created_at)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Last updated
                            </p>
                            <p>{formatDateTime(referral.updated_at)}</p>
                        </div>
                    </div>
                </div>

                {/* Patient summary */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-semibold text-slate-900">
                        Patient summary
                    </h2>
                    <div className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Full name
                            </p>
                            <p>{fullName(patient)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Date of birth
                            </p>
                            <p>{formatDOB(patient?.date_of_birth ?? null)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Phone
                            </p>
                            <p>{formatPhone(patient?.phone)}</p>
                        </div>
                    </div>
                </div>

                {/* Activity timeline (placeholder) */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-semibold text-slate-900">
                        Activity timeline
                    </h2>
                    <p className="mt-2 text-xs text-slate-500">
                        This is a placeholder. When audit trails are available, events will
                        appear here.
                    </p>
                    <div className="mt-4 space-y-3">
                        <div className="flex items-start gap-3 text-sm text-slate-600">
                            <CheckIcon />
                            <div>
                                <p>Referral created</p>
                                <p className="text-xs text-slate-500">
                                    {formatDateTime(referral.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right column: status controls + notes */}
            <div className="w-full max-w-sm space-y-6 lg:w-80">
                {/* Status control */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-semibold text-slate-900">Status</h2>
                    <p className="mt-2 text-xs text-slate-500">
                        Move referrals through your workflow. Changes are saved instantly.
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-2">
                        {STATUS_FLOW.map((status) => {
                            const isCurrent = referral.status === status;
                            return (
                                <ChoiceButton
                                    key={status}
                                    type="button"
                                    selected={isCurrent}
                                    disabled={isUpdatingStatus || isCurrent}
                                    onClick={() => onChangeStatus(status)}
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <span>{statusLabel(status)}</span>
                                        {isCurrent && (
                                            <CheckIcon />
                                        )}
                                    </div>
                                </ChoiceButton>
                            );
                        })}
                    </div>

                    {isUpdatingStatus && (
                        <p className="mt-2 text-xs text-slate-500">Updating status…</p>
                    )}
                </div>

                {/* Notes (UI only for now) */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-semibold text-slate-900">Notes</h2>
                    <p className="mt-2 text-xs text-slate-500">
                        Notes UI is ready. Once the{" "}
                        <span className="font-mono">notes</span> column exists on{" "}
                        <span className="font-mono">public.referrals</span>, we&apos;ll
                        wire this up to Supabase.
                    </p>
                    <textarea
                        className="mt-3 h-32 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none ring-0 transition focus:border-slate-300 focus:bg-white"
                        placeholder="Add internal notes about this referral…"
                        value={notesDraft}
                        onChange={(e) => setNotesDraft(e.target.value)}
                    />
                    <button
                        type="button"
                        disabled
                        className="mt-3 w-full rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-400"
                    >
                        Save notes (coming soon)
                    </button>
                </div>
            </div>
        </div>
    );
}