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
    patient?: {
        first_name?: string | null;
        last_name?: string | null;
    } | null;
};

type ReferralBaseRow = {
    id: string;
    patient_id: string | null;
    referral_source: string | null;
    status: string | null;
    created_at: string | null;
    updated_at: string | null;
    facility_site_id: string | null;
    notes: string | null;
    acuity_level: string | null;
};

type PatientRow = {
    id: string;
    first_name: string | null;
    last_name: string | null;
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

            const { data: referralData, error: referralError } = await supabase
                .from("referrals")
                .select(
                    `
            id,
            patient_id,
            referral_source,
            status,
            created_at,
            updated_at,
            facility_site_id,
            notes,
            acuity_level
          `
                )
                .order("created_at", { ascending: false });

            if (referralError) {
                const errorMessage = [
                    referralError.message,
                    referralError.details,
                    referralError.hint,
                    referralError.code,
                ]
                    .filter(Boolean)
                    .join(" | ");

                if (!isCancelled) {
                    setError(`Unable to load referrals: ${errorMessage}`);
                    setIsLoading(false);
                }

                return;
            }

            const baseRows = (referralData ?? []) as ReferralBaseRow[];

            const patientIds = Array.from(
                new Set(
                    baseRows
                        .map((row) => row.patient_id)
                        .filter((id): id is string => Boolean(id))
                )
            );

            let patientMap = new Map<string, PatientRow>();

            if (patientIds.length > 0) {
                const { data: patientData, error: patientError } = await supabase
                    .from("patients")
                    .select("id, first_name, last_name")
                    .in("id", patientIds);

                if (patientError) {
                    console.error("Error loading patients for referrals", patientError);
                } else {
                    patientMap = new Map(
                        ((patientData ?? []) as PatientRow[]).map((patient) => [
                            patient.id,
                            patient,
                        ])
                    );
                }
            }

            const mergedRows: ReferralRow[] = baseRows.map((row) => {
                const patient = row.patient_id ? patientMap.get(row.patient_id) : null;

                return {
                    id: row.id,
                    patient_id: row.patient_id ?? null,
                    referral_source: row.referral_source ?? null,
                    status: row.status ?? "new",
                    created_at: row.created_at ?? null,
                    updated_at: row.updated_at ?? null,
                    facility_site_id: row.facility_site_id ?? null,
                    notes: row.notes ?? null,
                    acuity_level: row.acuity_level ?? null,
                    patient: patient
                        ? {
                            first_name: patient.first_name ?? null,
                            last_name: patient.last_name ?? null,
                        }
                        : null,
                };
            });

            if (!isCancelled) {
                setReferrals(mergedRows);
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