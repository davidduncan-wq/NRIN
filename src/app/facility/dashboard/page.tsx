"use client";

// src/app/facility/dashboard/page.tsx

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import FacilityDashboardClient from "@/components/facility/FacilityDashboardClient";

export type TreatmentCenterRow = {
  id: string;
  name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
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

export default function FacilityDashboardPage() {
  const [centers, setCenters] = useState<TreatmentCenterRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadCenters = async () => {
      setIsLoading(true);
      setLoadError(null);

      const pageSize = 1000;
      let from = 0;
      let allRows: TreatmentCenterRow[] = [];

      while (true) {
        const to = from + pageSize - 1;

        const { data, error } = await supabase
          .from("facility_sites")
          .select(`
            id,
            name,
            address_line1,
            address_line2,
            city,
            postal_code,
            country,
            phone,
            website,
            programs_offered,
            primary_program,
            accepts_medicaid,
            accepts_private_insurance,
            accepts_self_pay,
            insurance_notes
          `)
          .order("name", { ascending: true })
          .range(from, to);

        if (error) {
          console.error("Error loading facility_sites:", error);
          if (!isCancelled) {
            setLoadError("Unable to load treatment centers.");
            setCenters([]);
            setIsLoading(false);
          }
          return;
        }

        const batch = (data ?? []) as TreatmentCenterRow[];
        allRows = allRows.concat(batch);

        if (batch.length < pageSize) break;
        from += pageSize;
      }

      if (!isCancelled) {
        setCenters(allRows);
        setIsLoading(false);
      }
    };

    void loadCenters();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Facility Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse treatment centers, prepare verification workflows, and manage facility operations inside NRIN.
          </p>
        </header>

        {loadError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {loadError}
          </div>
        ) : isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Loading treatment centers...
          </div>
        ) : (
          <FacilityDashboardClient centers={centers} />
        )}
      </main>
    </div>
  );
}