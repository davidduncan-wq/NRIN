"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type ReferralBaseRow = {
    id: string;
    patient_id: string | null;
    case_id: string | null;
    facility_site_id: string | null;
    referral_source: string | null;
    status: string | null;
    notes: string | null;
    acuity_level: string | null;
    created_at: string | null;
    updated_at: string | null;
};

type PatientRow = {
    id: string;
    first_name: string | null;
    last_name: string | null;
};

type FacilitySiteRow = {
    id: string;
    name: string | null;
    city: string | null;
    state: string | null;
};

type AdminReferralRow = ReferralBaseRow & {
    patient_name: string;
    facility_name: string;
    facility_location: string;
};

function normalizeStatus(raw: string | null | undefined) {
    return (raw ?? "new").toLowerCase();
}

function getStatusPillClasses(status: string | null) {
    const base =
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize";

    switch (normalizeStatus(status)) {
        case "in_review":
            return `${base} bg-amber-50 text-amber-800`;
        case "accepted":
            return `${base} bg-emerald-50 text-emerald-800`;
        case "declined":
        case "not_fit":
            return `${base} bg-rose-50 text-rose-800`;
        case "recommended_elsewhere":
            return `${base} bg-violet-50 text-violet-800`;
        case "returned_to_nrin":
            return `${base} bg-orange-50 text-orange-800`;
        case "closed":
            return `${base} bg-slate-100 text-slate-800`;
        case "pending":
        case "new":
        default:
            return `${base} bg-sky-50 text-sky-800`;
    }
}

function formatPatientName(patient: PatientRow | null | undefined, patientId: string | null) {
    if (patient) {
        const full = `${patient.first_name ?? ""} ${patient.last_name ?? ""}`.trim();
        if (full) return full;
    }

    if (patientId) return `${patientId.slice(0, 8)}…`;

    return "Unknown patient";
}

function formatFacilityLocation(site: FacilitySiteRow | null | undefined) {
    if (!site) return "—";

    const parts = [site.city, site.state].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "—";
}

export default function AdminReferralsPage() {
    const [rows, setRows] = useState<AdminReferralRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);

            const { data: referralData, error: referralError } = await supabase
                .from("referrals")
                .select(`
                    id,
                    patient_id,
                    case_id,
                    facility_site_id,
                    referral_source,
                    status,
                    notes,
                    acuity_level,
                    created_at,
                    updated_at
                `)
                .order("created_at", { ascending: false });

            if (referralError) {
                if (!cancelled) {
                    setError(referralError.message);
                    setLoading(false);
                }
                return;
            }

            const baseRows = (referralData ?? []) as ReferralBaseRow[];

            const patientIds = Array.from(
                new Set(
                    baseRows
                        .map((row) => row.patient_id)
                        .filter((id): id is string => Boolean(id)),
                ),
            );

            const facilitySiteIds = Array.from(
                new Set(
                    baseRows
                        .map((row) => row.facility_site_id)
                        .filter((id): id is string => Boolean(id)),
                ),
            );

            let patientMap = new Map<string, PatientRow>();
            let facilityMap = new Map<string, FacilitySiteRow>();

            if (patientIds.length > 0) {
                const { data: patientData, error: patientError } = await supabase
                    .from("patients")
                    .select("id, first_name, last_name")
                    .in("id", patientIds);

                if (patientError) {
                    console.error("admin referrals: patient load error", patientError);
                } else {
                    patientMap = new Map(
                        ((patientData ?? []) as PatientRow[]).map((row) => [row.id, row]),
                    );
                }
            }

            if (facilitySiteIds.length > 0) {
                const { data: facilityData, error: facilityError } = await supabase
                    .from("facility_sites")
                    .select("id, name, city, state")
                    .in("id", facilitySiteIds);

                if (facilityError) {
                    console.error("admin referrals: facility load error", facilityError);
                } else {
                    facilityMap = new Map(
                        ((facilityData ?? []) as FacilitySiteRow[]).map((row) => [row.id, row]),
                    );
                }
            }

            const merged: AdminReferralRow[] = baseRows.map((row) => {
                const patient = row.patient_id ? patientMap.get(row.patient_id) : null;
                const facility = row.facility_site_id
                    ? facilityMap.get(row.facility_site_id)
                    : null;

                return {
                    ...row,
                    patient_name: formatPatientName(patient, row.patient_id),
                    facility_name: facility?.name?.trim() || "Unknown facility",
                    facility_location: formatFacilityLocation(facility),
                };
            });

            if (!cancelled) {
                setRows(merged);
                setLoading(false);
            }
        }

        void load();

        return () => {
            cancelled = true;
        };
    }, []);

    const filtered = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return rows;

        return rows.filter((row) => {
            return (
                row.patient_name.toLowerCase().includes(q) ||
                row.facility_name.toLowerCase().includes(q) ||
                row.facility_location.toLowerCase().includes(q) ||
                (row.referral_source ?? "").toLowerCase().includes(q) ||
                (row.status ?? "").toLowerCase().includes(q) ||
                (row.patient_id ?? "").toLowerCase().includes(q) ||
                (row.facility_site_id ?? "").toLowerCase().includes(q) ||
                (row.case_id ?? "").toLowerCase().includes(q)
            );
        });
    }, [rows, searchTerm]);

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-7xl space-y-4">
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                                NRIN Admin
                            </p>
                            <h1 className="mt-1 text-xl font-semibold text-slate-900">
                                Referrals control view
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Global referral visibility across all facility sites.
                            </p>
                        </div>

                        <div className="w-full md:w-80">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search patient, facility, source, status, or ID"
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-sm text-slate-500">
                        Loading referrals…
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm">
                        Unable to load admin referrals: {error}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1.1fr)_minmax(0,1.2fr)] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <div>Patient</div>
                            <div>Facility</div>
                            <div>Source</div>
                            <div>Acuity</div>
                            <div>Status</div>
                            <div>Submitted</div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {filtered.length === 0 ? (
                                <div className="px-4 py-8 text-sm text-slate-500">
                                    No referrals match your search.
                                </div>
                            ) : (
                                filtered.map((row) => (
                                    <div
                                        key={row.id}
                                        className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1.1fr)_minmax(0,1.2fr)] gap-3 px-4 py-3 text-sm text-slate-700"
                                    >
                                        <div className="min-w-0">
                                            <div className="truncate font-medium text-slate-900">
                                                {row.patient_name}
                                            </div>
                                            <div className="truncate text-xs text-slate-500">
                                                patient_id: {row.patient_id ?? "—"}
                                            </div>
                                        </div>

                                        <div className="min-w-0">
                                            <div className="truncate font-medium text-slate-900">
                                                {row.facility_name}
                                            </div>
                                            <div className="truncate text-xs text-slate-500">
                                                {row.facility_location} · site_id: {row.facility_site_id ?? "—"}
                                            </div>
                                        </div>

                                        <div className="truncate">
                                            {row.referral_source || "—"}
                                        </div>

                                        <div className="truncate">
                                            {row.acuity_level || "—"}
                                        </div>

                                        <div>
                                            <span className={getStatusPillClasses(row.status)}>
                                                {(row.status ?? "new").replaceAll("_", " ")}
                                            </span>
                                        </div>

                                        <div className="truncate text-xs text-slate-500">
                                            {row.created_at
                                                ? new Date(row.created_at).toLocaleString()
                                                : "—"}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
