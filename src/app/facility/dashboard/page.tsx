// src/app/facility/dashboard/page.tsx

import { supabase } from "@/lib/supabaseClient";
import FacilityDashboardClient from "@/components/facility/FacilityDashboardClient";

export type TreatmentCenterRow = {
    id: string;
    name: string | null;
    address_line1: string | null;
    address_line2: string | null;
    city: string | null;
    postal_code: string | null;
    country: string | null;
    phone: string | null;
    website: string | null;
    programs_offered: string | null;
    primary_program: string | null;
    accepts_medicaid: boolean | null;
    accepts_private_insurance: boolean | null;
    accepts_self_pay: boolean | null;
    insurance_notes: string | null;
};

async function getTreatmentCenters(): Promise<TreatmentCenterRow[]> {
    const { data, error } = await supabase
        // 🔴 IMPORTANT: use your real table name here
        .from("facility_sites")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error(
            "Error loading facility_sites:",
            (error as { message?: string }).message ?? error
        );
        return [];
    }

    return (data ?? []) as TreatmentCenterRow[];
}

export default async function FacilityDashboardPage() {
    const centers = await getTreatmentCenters();

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="mx-auto max-w-6xl px-4 py-8">
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Facility Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Browse and filter treatment centers in the National Recovery Intake
                        Network.
                    </p>
                </header>

                <FacilityDashboardClient centers={centers} />
            </main>
        </div>
    );
}