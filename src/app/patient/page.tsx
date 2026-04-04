// NRIN/src/app/patient/page.tsx
"use client";

import { Step5Review } from "./components/Step5Review";
import { Step5LifeFit } from "./components/Step5LifeFit";
import { useState } from "react";
import { Step3Housing } from "./components/Step3Housing";
import { Input } from "@/components/ui/Input";
import FieldCheck from "@/components/ui/FieldCheck";
import { supabase } from "@/lib/supabaseClient";
import { Step1Demographics } from "./components/Step1Demographics";
import { Step2Contact } from "./components/Step2Contact";
import { Step4Substances } from "./components/Step4Substances";
import { useRouter } from "next/navigation";
import { buildPatientMatchingInput, deriveDesiredLevelsOfCare } from "@/lib/matching/buildPatientProfile";
import MatchTransitionSurface from "@/components/matching/MatchTransitionSurface";

import type { LevelOfCare } from "@/lib/matching/types";


// Smooth wrapper (keep transitions, but never hide content)
function StepTransition({ children }: { children: React.ReactNode }) {
    return (
        <div className="transition-all duration-300 ease-out">
            {children}
        </div>
    );
}

function StickyActionBar({ children }: { children: React.ReactNode }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 shadow-lg sm:hidden">
            <div className="max-w-xl mx-auto">{children}</div>
        </div>
    );
}

function formatPhoneInput(input: string): string {
    const digits = input.replace(/\D/g, "").slice(0, 10);

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatDobMMDDYYYY(input: string): string {
    const digits = input.replace(/\D/g, "").slice(0, 8);

    if (digits.length <= 2) return digits;
    if (digits.length <= 4) {
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function dobToISO(dob: string): string | null {
    const match = dob.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return null;

    const [, mm, dd, yyyy] = match;
    const month = Number(mm);
    const day = Number(dd);
    const year = Number(yyyy);

    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;
    if (year < 1900 || year > 2100) return null;

    // Basic validation only; not checking month/day combo (e.g., Feb 30).
    return `${yyyy}-${mm}-${dd}`;
}

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type Recommendation = {
    withdrawalRisk: string;
    relapseRisk: string;
    mentalHealthSignal: string;
    supportLevel: string;
    recommendedProgramType: string;
};

function computeAgeYears(isoDate: string | undefined | null): number | null {
    if (!isoDate) return null;

    const dob = new Date(isoDate);
    if (isNaN(dob.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();

    const hasHadBirthdayThisYear =
        today.getMonth() > dob.getMonth() ||
        (today.getMonth() === dob.getMonth() &&
            today.getDate() >= dob.getDate());

    if (!hasHadBirthdayThisYear) age--;

    if (age < 0 || age > 120) return null;

    return age;
}

export type FormState = {
    firstName: string;
    lastName: string;
    phone: string;
    dob: string; // MM/DD/YYYY
    dobISO: string; // YYYY-MM-DD
    sexAtBirth: string;
    genderIdentity: string;

    address: string;
    city: string;
    state: string;
    zip: string;
    addressLatitude: number | null;
    addressLongitude: number | null;

    currentLocation: string; // "Where are you now?"
    sleptLastNight: string;

    sleptAtHome: boolean | null;
    sleptLocationType: string;
    sleptLocationOther: string;

    isCurrentlyHomeless: string;
    lastKnownAddress: string;
    hasAddressYouCanUse: string;
    mailingAddress: string;

    substances: string[];
    lastUse: string;
    frequency: string;
    severeWithdrawalHistory: string;

    priorTreatment: string;
    treatmentLastWhen: string;
    treatmentLastDuration: string;
    treatmentPHPCompleted: string;
    treatmentIOPCompleted: string;
    treatmentLastYear: string;
    treatmentFacility: string;

    relapseTiming: string;
    mhMeds: string;
    mhHospitalization: string;
    supportivePerson: string;

    lifeFitCaptureMode: "" | "full" | "skip";
    environmentPreference: "" | "island" | "desert" | "mountains" | "east_coast" | "west_coast" | "urban" | "close_to_home" | "dont_care";
    insuranceStatus: "" | "yes" | "no" | "not_sure";
    insuranceType: "" | "private" | "medicaid" | "medicare" | "va" | "not_sure";
    possibleFundingSignals?: ("military" | "tribal" | "union_employer" | "court_county" | "none" | "not_sure")[];
    militaryStatus?: "active" | "veteran" | "guard" | "none" | "unknown";
    militaryCoverage?: "tricare" | "va" | "none" | "unknown";

    selfPayIntent: "" | "yes" | "no" | "not_sure";

    workDailyLifeNotes: string;
    familyRelationshipNotes: string;
    locationEnvironmentNotes: string;
    treatmentGoalsNotes: string;
    additionalContextNotes: string;

    initials: string;

    insuranceCarrier?: string;
    insuranceDetailsTiming?: "now" | "later";
    insuranceInputMethod?: "scan" | "manual";
};

const initialFormState: FormState = {
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    dobISO: "",
    sexAtBirth: "",
    genderIdentity: "",

    address: "",
    city: "",
    state: "",
    zip: "",
    addressLatitude: null,
    addressLongitude: null,

    currentLocation: "",
    sleptLastNight: "",

    sleptAtHome: null,
    sleptLocationType: "",
    sleptLocationOther: "",

    isCurrentlyHomeless: "",
    lastKnownAddress: "",
    hasAddressYouCanUse: "",
    mailingAddress: "",

    substances: [],
    lastUse: "",
    frequency: "",
    severeWithdrawalHistory: "",

    priorTreatment: "",
    treatmentLastWhen: "",
    treatmentLastDuration: "",
    treatmentPHPCompleted: "",
    treatmentIOPCompleted: "",
    treatmentLastYear: "",
    treatmentFacility: "",

    relapseTiming: "",
    mhMeds: "",
    mhHospitalization: "",
    supportivePerson: "",

    lifeFitCaptureMode: "",
    environmentPreference: "",
    insuranceStatus: "",
    insuranceType: "",
    possibleFundingSignals: [],
    militaryStatus: undefined,
    militaryCoverage: undefined,

    selfPayIntent: "",

    workDailyLifeNotes: "",
    familyRelationshipNotes: "",
    locationEnvironmentNotes: "",
    treatmentGoalsNotes: "",
    additionalContextNotes: "",

    initials: "",
};

export default function PatientIntakePage() {
    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [isRoutingToMatches, setIsRoutingToMatches] = useState(false);
    const [result, setResult] = useState<Recommendation | null>(null);
    const [form, setForm] = useState<FormState>(initialFormState);

    const router = useRouter();


    const ageYears = computeAgeYears(form.dobISO);

    const isDemographicsStepComplete =
        !!form.firstName && !!form.lastName && !!form.dob;

    const isIdentityStepComplete =
        !!form.address && !!form.city && !!form.state && !!form.zip;

    const isHousingStepComplete =
        form.sleptAtHome === true ||
        (form.sleptAtHome === false &&
            form.sleptLocationType !== "" &&
            (form.sleptLocationType !== "other" ||
                form.sleptLocationOther.trim() !== ""));

    const isSubstanceStepComplete =
        form.substances.length > 0 && !!form.lastUse && !!form.frequency;

    const hasLifeFitInput = [
        form.workDailyLifeNotes,
        form.familyRelationshipNotes,
        form.locationEnvironmentNotes,
        form.treatmentGoalsNotes,
        form.additionalContextNotes,
    ].some((value) => value.trim().length > 0);

    const isLifeFitStepComplete =
        form.lifeFitCaptureMode === "skip" || hasLifeFitInput || step > 5;

    function toggleSubstance(value: string) {
        setForm((prev) => {
            const exists = prev.substances.includes(value);
            return {
                ...prev,
                substances: exists
                    ? prev.substances.filter((s) => s !== value)
                    : [...prev.substances, value],
            };
        });
    }

    async function handleSubmit() {
        setLoading(true);

        const isoDob = dobToISO(form.dob);
        if (!isoDob) {
            alert("Please enter DOB in MM/DD/YYYY format");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dob: isoDob,
                    currentLocation: form.currentLocation,
                    substances: form.substances,
                    lastUse: form.lastUse,
                    frequency: form.frequency,
                    dailyAlcoholOrBenzo: form.substances.some((value) =>
                        ["alcohol", "benzodiazepines"].includes(value.toLowerCase())
                    )
                        ? "yes"
                        : "no",
                    severeWithdrawalHistory: form.severeWithdrawalHistory,
                    withdrawalSymptomsNow: "unknown",
                    priorTreatment: form.priorTreatment,
                    relapseTiming: form.relapseTiming,
                    mhMeds: form.mhMeds,
                    mhHospitalization: form.mhHospitalization,
                    supportivePerson: form.supportivePerson,
                    housingStable:
                        form.isCurrentlyHomeless === "yes"
                            ? "no"
                            : form.isCurrentlyHomeless === "no"
                                ? "yes"
                                : "unknown",
                }),
            });

            const data = (await res.json()) as Recommendation;
            setResult(data);
            setStep(7);
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    async function handleFinalSubmit() {
        if (!result) {
            alert("Please get your recommendation first.");
            return;
        }

        if (!form.initials.trim()) {
            alert("Please enter your initials to confirm before submitting.");
            return;
        }

        setLoading(true);

        try {
            const isoDob = dobToISO(form.dob) ?? null;

            const patientPayload = {
                first_name: form.firstName || null,
                last_name: form.lastName || null,
                date_of_birth: isoDob,
                phone: form.phone || null,
                email: null,
                address_line1: form.address || null,
                address_line2: null,
                city: form.city || null,
                state: form.state || null,
                postal_code: form.zip || null,
                address_latitude: form.addressLatitude,
                address_longitude: form.addressLongitude,
                current_location_description: form.currentLocation || null,
                housing_status: form.isCurrentlyHomeless || null,
                homeless_last_night: form.sleptLastNight || null,
                primary_substance: form.substances[0] ?? null,
                secondary_substance: form.substances[1] ?? null,
                use_frequency: form.frequency || null,
                withdrawal_risk: null,
                last_use_date: null,
                life_fit_capture_mode: form.lifeFitCaptureMode || null,
                environment_preference: form.environmentPreference || null,
                work_daily_life_notes: form.workDailyLifeNotes || null,
                family_relationship_notes: form.familyRelationshipNotes || null,
                location_environment_notes: form.locationEnvironmentNotes || null,
                treatment_goals_notes: form.treatmentGoalsNotes || null,
                additional_context_notes: form.additionalContextNotes || null,
            };

            const {
                data: patientData,
                error: patientError,
            } = await supabase
                .from("patients")
                .insert(patientPayload)
                .select("id")
                .single();

            if (patientError || !patientData) {
                console.error("Error inserting patient:", patientError);
                console.error("Patient payload:", patientPayload);
                alert("We couldn't save your information. Please try again.");
                return;
            }

            const patientId: string = patientData.id;

            const { data: caseData, error: caseError } = await supabase
                .from("cases")
                .insert([
                    {
                        patient_id: patientId,
                        state: "NEW_INTAKE",
                    },
                ])
                .select("id")
                .single();

            if (caseError || !caseData) {
                console.error("Error inserting case:", caseError);
                alert(
                    `We saved your patient record, but couldn't create the case.\n\n` +
                    `Supabase says: ${caseError?.message ?? "No case row was returned."}`
                );
                return;
            }

            const patientInput = buildPatientMatchingInput(form, result);
            const params = new URLSearchParams();

            params.set("needsDetox", patientInput.needsDetox ? "1" : "0");
            params.set("desiredLevelsOfCare", patientInput.desiredLevelsOfCare.join(","));
            params.set("prefersDualDiagnosis", patientInput.prefersDualDiagnosis ? "1" : "0");
            params.set("requiresMAT", patientInput.requiresMAT ? "1" : "0");
            params.set("wantsProfessionalProgram", patientInput.wantsProfessionalProgram ? "1" : "0");
            params.set("wantsFamilyProgram", patientInput.wantsFamilyProgram ? "1" : "0");

            if (patientInput.insuranceCarrier) {
                params.set("insuranceCarrier", patientInput.insuranceCarrier);
            }

            if (patientInput.fundingType) {
                params.set("fundingType", patientInput.fundingType);
            }

            if (patientInput.city) {
                params.set("city", patientInput.city);
            }

            if (patientInput.state) {
                params.set("state", patientInput.state);
            }

            if (patientInput.latitude) {
                params.set("latitude", String(patientInput.latitude));
            }

            if (patientInput.longitude) {
                params.set("longitude", String(patientInput.longitude));
            }

            if (form.environmentPreference === "close_to_home") {
                params.set("refineGeo", "close");
            } else if (form.environmentPreference) {
                params.set("environmentPreference", form.environmentPreference);
            }

            if (form.insuranceStatus) {
                params.set("insuranceStatus", form.insuranceStatus);
            }

            if (form.insuranceType) {
                params.set("insuranceType", form.insuranceType);
            }

            if (form.selfPayIntent) {
                params.set("selfPayIntent", form.selfPayIntent);
            }

            params.set("patientId", patientId);
            params.set("caseId", caseData.id);

            if (form.insuranceType === "va") {
                router.push(`/patient/va-route?${params.toString()}`);
                return;
            }

            setIsRoutingToMatches(true);
            router.push(`/patient/matches?${params.toString()}`);
        } catch (err) {
            console.error("Unexpected error submitting intake:", err);
            alert("Something went wrong while submitting. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const stepsMeta: { id: Step; label: string; complete: boolean }[] = [
        { id: 1, label: "Basic information", complete: isDemographicsStepComplete },
        { id: 2, label: "Identity & address", complete: isIdentityStepComplete },
        { id: 3, label: "Housing", complete: isHousingStepComplete },
        { id: 4, label: "Substances & treatment", complete: isSubstanceStepComplete },
        { id: 5, label: "Life situation & preferences", complete: isLifeFitStepComplete },
        {
            id: 6,
            label: "Review & confirm",
            complete: step === 7 || !!form.initials,
        },
        { id: 7, label: "Summary & submit", complete: !!result },
    ];

    const activeStep = stepsMeta.find((s) => s.id === step);

    const routingLines = [
        "Reviewing your clinical needs",
        result?.recommendedProgramType === "detox"
            ? "Checking detox support"
            : "Confirming level of care fit",
        form.insuranceStatus === "yes"
            ? "Checking payment path"
            : form.environmentPreference === "close_to_home"
              ? "Looking closer to home"
              : "Reviewing support signals",
        "Preparing your recommendations",
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <MatchTransitionSurface
                open={isRoutingToMatches}
                eyebrow="Reviewing recommendations"
                title="Finding the right options"
                body="We’re quietly reviewing what you shared and preparing your recommendations."
                lines={routingLines}
                variant="fullscreen"
            />
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 md:flex-row">
                {/* Progress rail (top on mobile, sidebar on desktop) */}
                <aside className="order-1 md:order-none md:w-64 md:shrink-0">
                    <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 md:p-7">
                        <h2 className="text-sm font-semibold text-gray-900">
                            Intake progress
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                            You can tap a step to jump back and edit.
                        </p>

                        <ol className="mt-4 grid gap-3 sm:gap-3">
                            {stepsMeta.map((s) => (
                                <li key={s.id}>
                                    <button
                                        type="button"
                                        onClick={() => setStep(s.id)}
                                        className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm transition ${step === s.id
                                            ? "bg-gray-900 text-white shadow-sm"
                                            : "bg-white text-gray-600 ring-1 ring-gray-100 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-medium uppercase tracking-wide opacity-70">
                                                Step {s.id} of 7
                                            </span>
                                            <span className="text-sm font-medium">{s.label}</span>
                                        </div>
                                        <FieldCheck ok={s.complete} />
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </div>
                </aside>

                {/* Main content card */}
                <main className="order-2 flex-1 md:order-none">
                    <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 md:p-8">
                        {/* Step header */}
                        {activeStep && (
                            <header className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Step {activeStep.id} of 7
                                    </p>
                                    <h1 className="mt-1 text-lg font-semibold text-gray-900 sm:text-xl">
                                        {activeStep.label}
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {step === 1 &&
                                            "Tell us a little about yourself so we can match you to the right level of care."}
                                        {step === 2 &&
                                            "Where can we reach you, and how do you describe yourself?"}
                                        {step === 3 &&
                                            "A few quick questions about where you’re staying."}
                                        {step === 4 &&
                                            "This helps us understand withdrawal and relapse risk."}
                                        {step === 5 &&
                                            "This optional step helps us find a place that fits your life, not just your treatment."}
                                        {step === 6 &&
                                            "Please double-check that everything looks right before you continue."}
                                        {step === 7 &&
                                            "Please review your summary, confirm accuracy, and submit intake to see your recommendation."}
                                    </p>
                                </div>

                                {step === 1 &&
                                    isDemographicsStepComplete &&
                                    form.firstName &&
                                    ageYears !== null && (
                                        <div className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 sm:mt-0">
                                            <span>{form.firstName}</span>
                                            <span className="mx-1">·</span>
                                            <span>Age {ageYears}</span>
                                        </div>
                                    )}
                            </header>
                        )}


                        {/* STEP 1 – DEMOGRAPHICS */}
                        {step === 1 && (
                            <Step1Demographics
                                form={form}
                                setForm={setForm}
                                loading={loading}
                                isComplete={isDemographicsStepComplete}
                                onNext={() => setStep(2)}
                                formatDobMMDDYYYY={formatDobMMDDYYYY}
                                dobToISO={dobToISO}
                                formatPhoneInput={formatPhoneInput}
                                ageYears={ageYears}
                            />
                        )}

                        {/* STEP 2 – CONTACT & ADDRESS */}
                        {step === 2 && (
                            <Step2Contact
                                form={form}
                                setForm={setForm}
                                loading={loading}
                                onNext={() => setStep(3)}
                                onBack={() => setStep(1)}
                            />
                        )}
                        {/* STEP 3 – HOUSING */}
                        {step === 3 && (
                            <Step3Housing
                                form={form}
                                setForm={setForm}
                                loading={loading}
                                isComplete={true}
                                onNext={() => setStep(4)}
                                onBack={() => setStep(2)}
                            />
                        )}

                        {/* STEP 4 – SUBSTANCES & TREATMENT */}
                        {step === 4 && (
                            <Step4Substances
                                form={form}
                                setForm={setForm}
                                loading={loading}
                                isComplete={isSubstanceStepComplete}
                                onNext={() => setStep(5)}
                                onBack={() => setStep(3)}
                                toggleSubstance={toggleSubstance}
                            />
                        )}

                        {/* STEP 5 – LIFE SITUATION & PREFERENCES */}
                        {step === 5 && (
                            <Step5LifeFit
                                form={form}
                                setForm={setForm}
                                loading={loading}
                                onBack={() => setStep(4)}
                                onNext={() => setStep(6)}
                            />
                        )}

                        {/* STEP 6 – REVIEW & CONFIRM */}
                        {step === 6 && (
                            <Step5Review
                                form={form}
                                setForm={setForm}
                                loading={loading}
                                onBack={() => setStep(5)}
                                onGetRecommendation={handleSubmit}
                            />
                        )}

                        {/* STEP 7 – SUMMARY & SUBMIT */}
                        {step === 7 && result && (
                            <StepTransition>
                                <section className="space-y-6">
                                    <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-5">
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <h2 className="text-sm font-semibold text-gray-900">
                                                    Your information
                                                </h2>
                                                <p className="text-xs text-gray-500">
                                                    A quick summary of what you shared with us.
                                                </p>
                                            </div>

                                            <dl className="space-y-2 text-sm text-gray-700">
                                                <div className="flex items-start justify-between gap-4">
                                                    <dt className="text-gray-500">Name</dt>
                                                    <dd className="text-right text-gray-900">
                                                        {[form.firstName, form.lastName].filter(Boolean).join(" ") ||
                                                            "Not provided"}
                                                    </dd>
                                                </div>

                                                <div className="flex items-start justify-between gap-4">
                                                    <dt className="text-gray-500">Date of birth</dt>
                                                    <dd className="text-right text-gray-900">
                                                        {form.dob || "Not provided"}
                                                    </dd>
                                                </div>

                                                <div className="flex items-start justify-between gap-4">
                                                    <dt className="text-gray-500">
                                                        Substances used (last 30 days)
                                                    </dt>
                                                    <dd className="max-w-[60%] text-right text-gray-900">
                                                        {form.substances.length > 0
                                                            ? form.substances.join(", ")
                                                            : "Not provided"}
                                                    </dd>
                                                </div>

                                                <div className="flex items-start justify-between gap-4">
                                                    <dt className="text-gray-500">Last use</dt>
                                                    <dd className="text-right text-gray-900">
                                                        {form.lastUse || "Not provided"}
                                                    </dd>
                                                </div>

                                                <div className="flex items-start justify-between gap-4">
                                                    <dt className="text-gray-500">Use frequency</dt>
                                                    <dd className="text-right text-gray-900">
                                                        {form.frequency || "Not provided"}
                                                    </dd>
                                                </div>

                                                <div className="flex items-start justify-between gap-4">
                                                    <dt className="text-gray-500">Prior treatment</dt>
                                                    <dd className="text-right text-gray-900">
                                                        {form.priorTreatment === "yes"
                                                            ? "Yes"
                                                            : form.priorTreatment === "no"
                                                                ? "No"
                                                                : "Not provided"}
                                                    </dd>
                                                </div>

                                                {form.priorTreatment === "yes" && (
                                                    <>
                                                        <div className="flex items-start justify-between gap-4">
                                                            <dt className="text-gray-500">
                                                                Last treatment duration
                                                            </dt>
                                                            <dd className="text-right text-gray-900">
                                                                {form.treatmentLastDuration || "Not provided"}
                                                            </dd>
                                                        </div>

                                                        <div className="flex items-start justify-between gap-4">
                                                            <dt className="text-gray-500">
                                                                Last treatment year
                                                            </dt>
                                                            <dd className="text-right text-gray-900">
                                                                {form.treatmentLastYear || "Not provided"}
                                                            </dd>
                                                        </div>

                                                        <div className="flex items-start justify-between gap-4">
                                                            <dt className="text-gray-500">
                                                                Treatment facility
                                                            </dt>
                                                            <dd className="max-w-[60%] text-right text-gray-900">
                                                                {form.treatmentFacility || "Not provided"}
                                                            </dd>
                                                        </div>
                                                    </>
                                                )}
                                            </dl>
                                        </div>
                                    </div>

                                    <section className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 md:p-5">
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-gray-900">
                                                    Enter your initials to confirm accuracy
                                                </label>
                                                <p className="text-xs text-gray-500">
                                                    Please review the summary above before submitting your intake.
                                                </p>
                                            </div>

                                            <Input
                                                className="w-24"
                                                value={form.initials}
                                                onChange={(e) =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        initials: e.target.value.toUpperCase(),
                                                    }))
                                                }
                                                maxLength={4}
                                                placeholder="ABC"
                                            />
                                        </div>
                                    </section>

                                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                        <button
                                            type="button"
                                            onClick={() => setStep(6)}
                                            className="inline-flex h-10 items-center rounded-xl bg-gray-100 px-4 text-sm font-medium text-gray-800 transition hover:bg-gray-200"
                                        >
                                            Back to review
                                        </button>

                                        <div className="hidden sm:block">
                                            <button
                                                type="button"
                                                onClick={handleFinalSubmit}
                                                disabled={loading || isRoutingToMatches}
                                                className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                {isRoutingToMatches ? "Finding options..." : loading ? "Submitting..." : "Submit intake and see recommendation"}
                                            </button>
                                        </div>

                                        <StickyActionBar>
                                            <button
                                                type="button"
                                                onClick={handleFinalSubmit}
                                                disabled={loading || isRoutingToMatches}
                                                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-black px-6 text-base font-semibold text-white shadow-sm transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                {isRoutingToMatches ? "Finding options..." : loading ? "Submitting..." : "Submit intake and see recommendation"}
                                            </button>
                                        </StickyActionBar>
                                    </div>
                                </section>
                            </StepTransition>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}