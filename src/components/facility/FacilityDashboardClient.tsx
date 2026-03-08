// src/components/facility/FacilityDashboardClient.tsx
"use client";

import { useMemo, useState } from "react";
import type { TreatmentCenterRow } from "@/app/facility/dashboard/page";
import { inputBase } from "@/components/ui/InputBase";
import FacilityDetailSheet from "./FacilityDetailSheet";

type Props = {
    centers: TreatmentCenterRow[];
};

export default function FacilityDashboardClient({ centers }: Props) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [filterMedicaid, setFilterMedicaid] = useState(false);
    const [filterPrivate, setFilterPrivate] = useState(false);
    const [filterSelfPay, setFilterSelfPay] = useState(false);

    const filteredCenters = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        let result = centers;

        if (normalizedQuery.length > 0) {
            result = result.filter((center) => {
                const name = center.name ?? "";
                const city = center.city ?? "";
                return (
                    name.toLowerCase().includes(normalizedQuery) ||
                    city.toLowerCase().includes(normalizedQuery)
                );
            });
        }

        const anyInsuranceFilter =
            filterMedicaid || filterPrivate || filterSelfPay;

        if (anyInsuranceFilter) {
            result = result.filter((center) => {
                if (filterMedicaid && !center.accepts_medicaid) return false;
                if (filterPrivate && !center.accepts_private_insurance) return false;
                if (filterSelfPay && !center.accepts_self_pay) return false;
                return true;
            });
        }

        return result;
    }, [centers, query, filterMedicaid, filterPrivate, filterSelfPay]);

    const selectedCenter =
        filteredCenters.find((center) => center.id === selectedId) ??
        centers.find((center) => center.id === selectedId) ??
        null;

    const closeSheet = () => setSelectedId(null);

    const insurancePillBase =
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors";
    const insurancePillInactive =
        "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";
    const insurancePillActive =
        "border-sky-300 bg-sky-50 text-sky-800 hover:bg-sky-100";

    return (
        <>
            {/* Controls */}
            <section className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
                <div className="w-full sm:max-w-sm">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Search
                    </label>
                    <input
                        type="text"
                        className={inputBase}
                        placeholder="Search by name or city…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setFilterMedicaid((prev) => !prev)}
                        className={`${insurancePillBase} ${filterMedicaid ? insurancePillActive : insurancePillInactive
                            }`}
                    >
                        Medicaid
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterPrivate((prev) => !prev)}
                        className={`${insurancePillBase} ${filterPrivate ? insurancePillActive : insurancePillInactive
                            }`}
                    >
                        Private insurance
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterSelfPay((prev) => !prev)}
                        className={`${insurancePillBase} ${filterSelfPay ? insurancePillActive : insurancePillInactive
                            }`}
                    >
                        Self-pay
                    </button>
                </div>
            </section>

            {/* Table */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-left text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 font-medium text-slate-700">Name</th>
                                <th className="px-4 py-3 font-medium text-slate-700">
                                    Location
                                </th>
                                <th className="px-4 py-3 font-medium text-slate-700">Phone</th>
                                <th className="px-4 py-3 font-medium text-slate-700">
                                    Primary Program
                                </th>
                                <th className="px-4 py-3 font-medium text-slate-700">
                                    Insurance
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCenters.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-6 text-center text-sm text-slate-500"
                                    >
                                        No treatment centers match the current filters.
                                        <br />
                                        Try clearing the search or toggling off some insurance
                                        filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredCenters.map((center) => {
                                    const locationParts = [
                                        center.city,
                                        center.postal_code,
                                        center.country,
                                    ].filter(Boolean);

                                    const insuranceFlags: string[] = [];
                                    if (center.accepts_medicaid) insuranceFlags.push("Medicaid");
                                    if (center.accepts_private_insurance)
                                        insuranceFlags.push("Private");
                                    if (center.accepts_self_pay) insuranceFlags.push("Self-pay");

                                    return (
                                        <tr
                                            key={center.id}
                                            className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                                            onClick={() => setSelectedId(center.id)}
                                        >
                                            <td className="px-4 py-3 align-top text-slate-900">
                                                {center.name || "—"}
                                            </td>
                                            <td className="px-4 py-3 align-top text-slate-700">
                                                {locationParts.length > 0
                                                    ? locationParts.join(", ")
                                                    : "—"}
                                            </td>
                                            <td className="px-4 py-3 align-top text-slate-700">
                                                {center.phone || "—"}
                                            </td>
                                            <td className="px-4 py-3 align-top text-slate-700">
                                                {center.primary_program || "—"}
                                            </td>
                                            <td className="px-4 py-3 align-top text-slate-700">
                                                {insuranceFlags.length > 0
                                                    ? insuranceFlags.join(" · ")
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

            <FacilityDetailSheet center={selectedCenter} onClose={closeSheet} />
        </>
    );
}