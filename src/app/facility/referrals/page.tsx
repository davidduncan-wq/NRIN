// src/app/facility/referrals/page.tsx

import { supabase } from "@/lib/supabaseClient";
import ReferralsClient from "@/components/facility/ReferralsClient";

export type ReferralRow = {
    id: string;
    created_at: string | null;
    updated_at: string | null;
    patient_id: string | null;
    facility_site_id: string | null;
    status: string | null;
    status_reason: string | null;
    referral_source: string | null;
    acuity_level: string | null;
    notes: string | null;
    created_by: string | null;
};

async function getReferrals(): Promise<ReferralRow[]> {
    const { data, error } = await supabase
        .from("referrals")
        .select("*") // 🔹 no joins, just raw rows
        .order("created_at", { ascending: false });

    if (error) {
        console.error(
            "Error loading referrals:",
            (error as { message?: string }).message ?? error
        );
        return [];
    }

    return (data ?? []) as ReferralRow[];
}

export default async function ReferralsPage() {
    const referrals = await getReferrals();

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="mx-auto max-w-6xl px-4 py-8">
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Referral Inbox
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Manage your incoming treatment referrals.
                    </p>
                </header>

                <ReferralsClient referrals={referrals} />
            </main>
        </div>
    );
}