// src/app/facility/referrals/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ReferralDetailSheet from "@/components/facility/ReferralDetailSheet";

type Referral = {
    id: string;
    case_id: string | null;
    patient_id: string;
    referral_source: string | null;
    status: string;
    created_at: string | null;
    updated_at: string | null;
    facility_site_id: string | null;
    notes: string | null;
    acuity_level: string | null;
    recommended_facility_site_id: string | null;
    recommendation_reason: string | null;
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
    const [isSavingNotes, setIsSavingNotes] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [facilitySites, setFacilitySites] = useState<
        {
            id: string;
            name: string;
            city: string | null;
            postal_code: string | null;
            programs_offered: string | null;
            accepts_private_insurance: boolean | null;
            accepts_medicaid: boolean | null;
            accepts_self_pay: boolean | null;
            insurance_notes: string | null;
        }[]
    >([]);

    useEffect(() => {
        if (!referralId || referralId === "[id]") return;

        let isCancelled = false;

        const loadData = async () => {
            setIsLoading(true);
            setError(null);

            // 1. Load referral (with new columns)
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
                    case_id: referralRow.case_id ?? null,
                    patient_id: referralRow.patient_id,
                    referral_source: referralRow.referral_source ?? null,
                    status: referralRow.status,
                    created_at: referralRow.created_at ?? null,
                    updated_at: referralRow.updated_at ?? null,
                    facility_site_id: referralRow.facility_site_id ?? null,
                    notes: referralRow.notes ?? null,
                    acuity_level: referralRow.acuity_level ?? null,
                    recommended_facility_site_id:
                        referralRow.recommended_facility_site_id ?? null,
                    recommendation_reason: referralRow.recommendation_reason ?? null,
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
                    // 3. Load facility sites
                    const batchSize = 1000;
                    let from = 0;
                    let allFacilitySites: {
                        id: string;
                        name: string;
                        city: string | null;
                        postal_code: string | null;
                        programs_offered: string | null;
                        accepts_private_insurance: boolean | null;
                        accepts_medicaid: boolean | null;
                        accepts_self_pay: boolean | null;
                        insurance_notes: string | null;
                    }[] = [];

                    while (true) {
                        const { data, error } = await supabase
                            .from("facility_sites")
                            .select(
                                "id, name, city, postal_code, programs_offered, accepts_private_insurance, accepts_medicaid, accepts_self_pay, insurance_notes"
                            )
                            .order("name", { ascending: true })
                            .order("id", { ascending: true })
                            .range(from, from + batchSize - 1);

                        if (error) {
                            console.error("Error loading facility sites", error);
                            break;
                        }

                        if (!data || data.length === 0) {
                            break;
                        }

                        allFacilitySites = allFacilitySites.concat(data);

                        if (data.length < batchSize) {
                            break;
                        }

                        from += batchSize;
                    }

                    const dedupedFacilitySites = Array.from(
                        new Map(allFacilitySites.map((site) => [site.id, site])).values()
                    );

                    console.log("facility_sites loaded:", dedupedFacilitySites.length);
                    setFacilitySites(dedupedFacilitySites);
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
            console.error("Error details", {
                message: (updateError as any).message,
                details: (updateError as any).details,
                hint: (updateError as any).hint,
                code: (updateError as any).code,
            });

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
    const handleChangeAcuity = async (nextLevel: string) => {
        if (!referral) return;

        setIsUpdatingStatus(true);

        const { data, error } = await supabase
            .from("referrals")
            .update({ acuity_level: nextLevel })
            .eq("id", referral.id)
            .select("*")
            .single();

        if (error) {
            console.error("Error updating acuity level", error);
            setIsUpdatingStatus(false);
            return;
        }

        setReferral((prev) =>
            prev ? { ...prev, acuity_level: data.acuity_level } : prev
        );

        setIsUpdatingStatus(false);
    };
    const handleChangeFacility = async (siteId: string | null) => {
        if (!referral) return;

        setIsUpdatingStatus(true);

        const { data, error } = await supabase
            .from("referrals")
            .update({ facility_site_id: siteId || null })
            .eq("id", referral.id)
            .select("*")
            .single();

        if (error) {
            console.error("Error updating facility site", error);
            setIsUpdatingStatus(false);
            return;
        }

        setReferral((prev) =>
            prev
                ? {
                    ...prev,
                    facility_site_id: data.facility_site_id,
                    updated_at: data.updated_at ?? prev.updated_at,
                }
                : prev
        );

        setIsUpdatingStatus(false);
    };

    const handleRecommendElsewhere = async (
        recommendedFacilitySiteId: string,
        reason: string
    ) => {
        if (!referral) return;

        const trimmedReason = reason.trim();

        if (!recommendedFacilitySiteId || !trimmedReason) {
            setError("Please select a recommended facility and provide a reason.");
            return;
        }

        setIsUpdatingStatus(true);
        setError(null);

        const { data, error: updateError } = await supabase
            .from("referrals")
            .update({
                status: "recommended_elsewhere",
                recommended_facility_site_id: recommendedFacilitySiteId,
                recommendation_reason: trimmedReason,
            })
            .eq("id", referral.id)
            .select("*")
            .single();

        if (updateError) {
            console.error("Error recommending elsewhere", updateError);
            setError("Unable to recommend another facility.");
            setIsUpdatingStatus(false);
            return;
        }

        const { data: existingReferral, error: existingReferralError } = await supabase
            .from("referrals")
            .select("id")
            .eq("case_id", referral.case_id)
            .eq("patient_id", referral.patient_id)
            .eq("facility_site_id", recommendedFacilitySiteId)
            .limit(1)
            .maybeSingle();

        if (existingReferralError) {
            console.error("Error checking existing receiving referral", existingReferralError);
            setError("Recommended facility saved, but receiving referral check failed.");
            setReferral((prev) =>
                prev
                    ? {
                        ...prev,
                        status: data.status,
                        updated_at: data.updated_at ?? prev.updated_at,
                        recommended_facility_site_id:
                            data.recommended_facility_site_id ?? null,
                        recommendation_reason: data.recommendation_reason ?? null,
                    }
                    : prev
            );
            setIsUpdatingStatus(false);
            return;
        }

        if (!existingReferral) {
            const { error: insertError } = await supabase
                .from("referrals")
                .insert({
                    case_id: referral.case_id,
                    patient_id: referral.patient_id,
                    facility_site_id: recommendedFacilitySiteId,
                    referral_source: "facility_recommendation",
                    status: "new",
                    acuity_level: referral.acuity_level ?? null,
                    notes: `Recommended by facility referral ${referral.id}: ${trimmedReason}`,
                });

            if (insertError) {
                console.error("Error creating receiving referral", insertError);
                setError("Recommended facility saved, but new receiving referral could not be created.");
                setReferral((prev) =>
                    prev
                        ? {
                            ...prev,
                            status: data.status,
                            updated_at: data.updated_at ?? prev.updated_at,
                            recommended_facility_site_id:
                                data.recommended_facility_site_id ?? null,
                            recommendation_reason: data.recommendation_reason ?? null,
                        }
                        : prev
                );
                setIsUpdatingStatus(false);
                return;
            }
        }

        setReferral((prev) =>
            prev
                ? {
                    ...prev,
                    status: data.status,
                    updated_at: data.updated_at ?? prev.updated_at,
                    recommended_facility_site_id:
                        data.recommended_facility_site_id ?? null,
                    recommendation_reason: data.recommendation_reason ?? null,
                }
                : prev
        );

        setIsUpdatingStatus(false);
    };
    const handleReturnToNrin = async (reason: string) => {
        if (!referral) return;

        const trimmedReason = reason.trim();

        if (!trimmedReason) {
            setError("Please provide a reason.");
            return;
        }

        setIsUpdatingStatus(true);
        setError(null);

        const { data, error: updateError } = await supabase
            .from("referrals")
            .update({
                status: "returned_to_nrin",
                recommendation_reason: trimmedReason,
                recommended_facility_site_id: null,
            })
            .eq("id", referral.id)
            .select("*")
            .single();

        if (updateError) {
            console.error("Error returning to nrin", updateError);
            setError("Unable to return to nrin.");
            setIsUpdatingStatus(false);
            return;
        }

        setReferral((prev) =>
            prev
                ? {
                    ...prev,
                    status: data.status,
                    updated_at: data.updated_at ?? prev.updated_at,
                    recommendation_reason: data.recommendation_reason ?? null,
                    recommended_facility_site_id: null,
                }
                : prev
        );

        // 🔥 AUTO REROUTE — create new referral
        try {
            const { data: nextFacility, error: nextFacilityError } = await supabase
                .from("facility_sites")
                .select("id")
                .neq("id", referral.facility_site_id)
                .limit(1)
                .single();

            if (nextFacilityError) {
                console.error("Error finding next facility", nextFacilityError);
            } else if (nextFacility) {
                const { error: insertError } = await supabase
                    .from("referrals")
                    .insert({
                        case_id: referral.case_id,
                        patient_id: referral.patient_id,
                        facility_site_id: nextFacility.id,
                        status: "new",
                        referral_source: "nrin_reroute",
                        notes: `Auto-rerouted after return_to_nrin from ${referral.facility_site_id}: ${trimmedReason}`,
                    });

                if (insertError) {
                    console.error("Error creating rerouted referral", insertError);
                } else {
                    console.log("Auto reroute created →", nextFacility.id);
                }
            }
        } catch (e) {
            console.error("Auto reroute failed", e);
        }

        setIsUpdatingStatus(false);
    };

    const handleSaveNotes = async (nextNotes: string) => {
        if (!referral) return;

        setIsSavingNotes(true);
        setError(null);

        const { data, error: notesError } = await supabase
            .from("referrals")
            .update({ notes: nextNotes })
            .eq("id", referral.id)
            .select("*")
            .single();

        if (notesError) {
            console.error("Error updating notes", notesError);
            setError("Unable to save notes.");
            setIsSavingNotes(false);
            return;
        }

        setReferral((prev) =>
            prev
                ? {
                    ...prev,
                    notes: data.notes ?? null,
                    updated_at: data.updated_at ?? prev.updated_at,
                }
                : prev,
        );
        setIsSavingNotes(false);
    };

    // Render guards

    if (!referralId || referralId === "[id]") {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 shadow-sm">
                    <p>Referral ID is missing or invalid.</p>
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
                <div className="w-full max-w-5xl animate-pulse space-y-4">
                    <div className="h-4 w-32 rounded-full bg-slate-200" />
                    <div className="h-32 rounded-2xl bg-slate-100" />
                    <div className="h-40 rounded-2xl bg-slate-100" />
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
        <div className="px-4 py-4 lg:px-8 lg:py-6">
            <div className="mx-auto mb-4 flex max-w-5xl items-center gap-2 text-sm text-slate-500">
                <button
                    type="button"
                    onClick={() => router.push("/facility/referrals")}
                    className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                >
                    ← Back to referrals
                </button>
                <span className="text-slate-400">/</span>
                <span className="truncate font-medium text-slate-700">
                    Referral detail
                </span>
            </div>

            <ReferralDetailSheet
                onRecommendElsewhere={handleRecommendElsewhere}
                onReturnToNrin={handleReturnToNrin}

                referral={referral}
                patient={patient}
                facilitySites={facilitySites}
                isUpdatingStatus={isUpdatingStatus}
                notesSaving={isSavingNotes}
                onChangeStatus={handleChangeStatus}
                onSaveNotes={handleSaveNotes}
                onChangeAcuity={handleChangeAcuity}
                onChangeFacility={handleChangeFacility}

            />
        </div>
    );
}