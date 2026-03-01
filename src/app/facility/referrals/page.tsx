// src/app/facility/referrals/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ReferralsClient from "@/components/facility/ReferralsClient";

export type ReferralRow = {
    id: string;
    patient_id: string | null;
    referral_source: string | null;
    status: string | null;
    created_at: string | null;
    updated_at: string | null;
    facility_site_id: string | null;
    notes: string | null;
    acuity_level: string | null;
    // optional patient object for display if present
    patient?: {
        first_name?: string | null;
        last_name?: string | null;
    } | null;
};

export default function FacilityReferralsPage() {
    const [referrals, setReferrals] = useState<ReferralRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false;

        const loadReferrals = async () => {
            setIsLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from("referrals")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error loading referrals", error);
                if (!isCancelled) {
                    setError("Unable to load referrals.");
                    setIsLoading(false);
                }
                return;
            }

            if (!isCancelled && data) {
                // Cast to ReferralRow with optional patient
                setReferrals(
                    data.map((row: any) => ({
                        id: row.id,
                        patient_id: row.patient_id ?? null,
                        referral_source: row.referral_source ?? null,
                        status: row.status ?? "new",
                        created_at: row.created_at ?? null,
                        updated_at: row.updated_at ?? null,
                        facility_site_id: row.facility_site_id ?? null,
                        notes: row.notes ?? null,
                        acuity_level: row.acuity_level ?? null,
                        patient: (row.patient as any) ?? null,
                    })),
                );
            }

            if (!isCancelled) {
                setIsLoading(false);
            }
        };

        void loadReferrals();

        return () => {
            isCancelled = true;
        };
    }, []);

    return (
        <div className="px-4 py-4 lg:px-8 lg:py-6">
            <div className="mx-auto max-w-5xl">
                <header className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold text-slate-900">
                            Referrals
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            View and manage incoming referrals for your facility.
                        </p>
                    </div>
                </header>

                {isLoading ? (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="h-4 w-32 rounded-full bg-slate-200" />
                        <div className="mt-4 h-10 rounded-xl bg-slate-100" />
                        <div className="mt-2 h-10 rounded-xl bg-slate-100" />
                        <div className="mt-2 h-10 rounded-xl bg-slate-100" />
                    </div>
                ) : error ? (
                    <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
                        {error}
                    </div>
                ) : (
                    <ReferralsClient referrals={referrals} />
                )}
            </div>
        </div>
    );
}