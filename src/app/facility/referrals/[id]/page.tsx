// src/app/facility/referrals/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ReferralDetailSheet from "@/components/facility/ReferralDetailSheet";

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

export default function ReferralDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const referralId = params?.id;

  const [referral, setReferral] = useState<Referral | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!referralId) return;

    let isCancelled = false;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      // 1. Load referral
      const { data: referralRow, error: referralError } = await supabase
        .from("referrals")
        .select("*")
        .eq("id", referralId)
        .single();

      if (referralError) {
        console.error("Error loading referral", referralError);
        if (!isCancelled) {
          setError("Unable to load referral.");
          setIsLoading(false);
        }
        return;
      }

      if (!referralRow) {
        if (!isCancelled) {
          setError("Referral not found.");
          setIsLoading(false);
        }
        return;
      }

      if (!isCancelled) {
        setReferral({
          id: referralRow.id,
          patient_id: referralRow.patient_id,
          referral_source: referralRow.referral_source ?? null,
          status: referralRow.status,
          created_at: referralRow.created_at ?? null,
          updated_at: referralRow.updated_at ?? null,
        });
      }

      // 2. Load patient (best-effort)
      if (referralRow.patient_id) {
        const { data: patientRow, error: patientError } = await supabase
          .from("patients")
          .select("*")
          .eq("id", referralRow.patient_id)
          .single();

        if (patientError) {
          console.error("Error loading patient", patientError);
          if (!isCancelled) {
            // We treat this as non-fatal: referral still renders.
            setPatient(null);
          }
        } else if (!isCancelled && patientRow) {
          setPatient({
            id: patientRow.id,
            first_name: patientRow.first_name ?? null,
            last_name: patientRow.last_name ?? null,
            date_of_birth: patientRow.date_of_birth ?? patientRow.dob ?? null,
            phone: patientRow.phone ?? null,
          });
        }
      }

      if (!isCancelled) {
        setIsLoading(false);
      }
    };

    void loadData();

    return () => {
      isCancelled = true;
    };
  }, [referralId]);

  const handleChangeStatus = async (nextStatus: string) => {
    if (!referral) return;
    if (referral.status === nextStatus) return;

    setIsUpdatingStatus(true);
    setError(null);

    const { data, error: updateError } = await supabase
      .from("referrals")
      .update({ status: nextStatus })
      .eq("id", referral.id)
      .select("*")
      .single();

    if (updateError) {
      console.error("Error updating status", updateError);
      setError("Unable to update status.");
      setIsUpdatingStatus(false);
      return;
    }

    setReferral((prev) =>
      prev
        ? {
            ...prev,
            status: data.status,
            updated_at: data.updated_at ?? prev.updated_at,
          }
        : prev,
    );
    setIsUpdatingStatus(false);
  };

  if (!referralId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 shadow-sm">
          Missing referral ID.{" "}
          <button
            type="button"
            className="font-medium text-slate-900 underline"
            onClick={() => router.push("/facility/referrals")}
          >
            Go back to referrals list
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 shadow-sm">
          Loading referral…
        </div>
      </div>
    );
  }

  if (error || !referral) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-700 shadow-sm">
          <p>{error ?? "Referral not found."}</p>
          <button
            type="button"
            className="font-medium text-rose-800 underline"
            onClick={() => router.push("/facility/referrals")}
          >
            Go back to referrals list
          </button>
        </div>
      </div>
    );
  }

  return (
    <ReferralDetailSheet
      referral={referral}
      patient={patient}
      isUpdatingStatus={isUpdatingStatus}
      onChangeStatus={handleChangeStatus}
    />
  );
}