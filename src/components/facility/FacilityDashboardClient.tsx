"use client";

import { useMemo, useState } from "react";
import type { TreatmentCenterRow } from "@/app/facility/dashboard/page";
import { inputBase } from "@/components/ui/InputBase";
import FacilityDetailSheet from "./FacilityDetailSheet";
import FacilityProfilePanel from "./FacilityProfilePanel";
import FacilityVerificationPanel from "./FacilityVerificationPanel";
import FacilityOperationsPanel from "./FacilityOperationsPanel";

type Props = {
    centers: TreatmentCenterRow[];
};

type FacilityDashboardTab = "directory" | "profile" | "verification" | "operations";

export default function FacilityDashboardClient({ centers }: Props) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [filterMedicaid, setFilterMedicaid] = useState(false);
    const [filterPrivate, setFilterPrivate] = useState(false);
    const [filterSelfPay, setFilterSelfPay] = useState(false);
    const [activeTab, setActiveTab] = useState<FacilityDashboardTab>("directory");

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

        const anyInsuranceFilter = filterMedicaid || filterPrivate || filterSelfPay;

        if (anyInsuranceFilter) {
            result = result.filter((center) => {
                const matchesMedicaid = filterMedicaid && center.accepts_medicaid;
                const matchesPrivate = filterPrivate && center.accepts_private_insurance;
                const matchesSelfPay = filterSelfPay && center.accepts_self_pay;

                return Boolean(matchesMedicaid || matchesPrivate || matchesSelfPay);
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

    const tabBase =
        "rounded-full px-3 py-1.5 text-sm font-medium transition-colors";
    const tabInactive = "bg-white text-slate-700 hover:bg-slate-100";
    const tabActive = "bg-slate-900 text-white";

    function handleSelectFacility(id: string) {
        setSelectedId(id);
        setActiveTab("profile");
    }

    function renderRightPanel() {
        switch (activeTab) {
            case "profile":
                return <FacilityProfilePanel center={selectedCenter} />;
            case "verification":
                return <FacilityVerificationPanel center={selectedCenter} />;
            case "operations":
                return <FacilityOperationsPanel center={selectedCenter} />;
            case "directory":
            default:
                return (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
                        Select a facility from the left to begin reviewing its profile, verification status,
                        and operations controls.
                    </div>
                );
        }
    }

    return (
        <>
            <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
                <div className="space-y-5">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Directory</div>
                        <div className="mt-1 text-sm text-slate-600">
                            Search facilities and filter by basic insurance fit.
                        </div>

                        <div className="mt-4">
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by facility or city"
                                className={inputBase}
                            />
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setFilterMedicaid((prev) => !prev)}
                                className={`${insurancePillBase} ${filterMedicaid ? insurancePillActive : insurancePillInactive}`}
                            >
                                Medicaid
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterPrivate((prev) => !prev)}
                                className={`${insurancePillBase} ${filterPrivate ? insurancePillActive : insurancePillInactive}`}
                            >
                                Private insurance
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterSelfPay((prev) => !prev)}
                                className={`${insurancePillBase} ${filterSelfPay ? insurancePillActive : insurancePillInactive}`}
                            >
                                Self-pay
                            </button>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(0,1fr)] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <div>Name</div>
                            <div>Location</div>
                            <div>Program</div>
                        </div>

                        {filteredCenters.length === 0 ? (
                            <div className="px-4 py-10 text-center">
                                <div className="text-sm font-medium text-slate-700">
                                    No treatment centers match the current filters.
                                </div>
                                <div className="mt-1 text-sm text-slate-500">
                                    Try clearing the search or toggling off some insurance filters.
                                </div>
                            </div>
                        ) : (
                            filteredCenters.map((center) => {
                                const isSelected = center.id === selectedId;
                                const locationParts = [center.city, center.postal_code, center.country].filter(Boolean);

                                return (
                                    <button
                                        key={center.id}
                                        type="button"
                                        onClick={() => handleSelectFacility(center.id)}
                                        className={`grid w-full grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(0,1fr)] gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 ${isSelected ? "bg-sky-50" : "bg-white hover:bg-slate-50"
                                            }`}
                                    >
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-medium text-slate-900">
                                                {center.name || "—"}
                                            </div>
                                            <div className="mt-1 truncate text-xs text-slate-500">
                                                {center.phone || "—"}
                                            </div>
                                        </div>

                                        <div className="min-w-0 truncate text-sm text-slate-700">
                                            {locationParts.length > 0 ? locationParts.join(", ") : "—"}
                                        </div>

                                        <div className="min-w-0 truncate text-sm text-slate-700">
                                            {center.primary_program || "—"}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab("directory")}
                                className={`${tabBase} ${activeTab === "directory" ? tabActive : tabInactive}`}
                            >
                                Overview
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("profile")}
                                className={`${tabBase} ${activeTab === "profile" ? tabActive : tabInactive}`}
                            >
                                Profile
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("verification")}
                                className={`${tabBase} ${activeTab === "verification" ? tabActive : tabInactive}`}
                            >
                                Verification
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("operations")}
                                className={`${tabBase} ${activeTab === "operations" ? tabActive : tabInactive}`}
                            >
                                Operations
                            </button>
                        </div>
                    </div>

                    {renderRightPanel()}
                </div>
            </div>

            <FacilityDetailSheet center={selectedCenter} onClose={closeSheet} />
        </>
    );
}