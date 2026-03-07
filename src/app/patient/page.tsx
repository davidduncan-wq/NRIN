// NRIN/src/app/patient/page.tsx
"use client";

import { Step5Review } from "./components/Step5Review";
import { useState } from "react";
import { Step3Housing } from "./components/Step3Housing";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { DateInput } from "@/components/ui/DateInput";
import FieldCheck from "@/components/ui/FieldCheck";
import ChoiceButton from "@/components/ui/ChoiceButton";
import { supabase } from "@/lib/supabaseClient";
import { Step1Demographics } from "./components/Step1Demographics";
import { Step2Contact } from "./components/Step2Contact";
import { Step4Substances } from "./components/Step4Substances";

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

type Step = 1 | 2 | 3 | 4 | 5 | 6;

type Recommendation = {
    withdrawalRisk: string;
    relapseRisk: string;
    coOccurring: string;
    supportLevel: string;
    recommendedLevelOfCare: string;
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

    initials: string;
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

    initials: "",
};

export default function PatientIntakePage() {
    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Recommendation | null>(null);
    const [form, setForm] = useState<FormState>(initialFormState);

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
                    dailyAlcoholOrBenzo: "unknown",
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
            setStep(6);
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

            // 1) Create patient
            const patientPayload: any = {

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
                current_location_description: form.currentLocation || null,
                housing_status: form.isCurrentlyHomeless || null,
                homeless_last_night: form.sleptLastNight || null,
                primary_substance: form.substances[0] ?? null,
                secondary_substance: form.substances[1] ?? null,
                use_frequency: form.frequency || null,
                withdrawal_risk: null,
                last_use_date: null,
            };
            console.log("patientPayload", patientPayload);
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

            // 2) Pick a default facility (first facility_sites row)
            let facilitySiteId: string | null = null;

            const {
                data: facilityData,
                error: facilityError,
            } = await supabase
                .from("facility_sites")
                .select("id")
                .order("created_at", { ascending: true })
                .limit(1);

            if (!facilityError && facilityData && facilityData.length > 0) {
                facilitySiteId = (facilityData[0] as { id: string }).id;
            }

            // 3) Create referral
            const { error: referralError } = await supabase.from("referrals").insert([
                {
                    patient_id: patientId,
                    status: "new",

                    facility_site_id: facilitySiteId
                }
            ]);

            if (referralError) {
                console.error("Error inserting referral:", referralError);

                alert(
                    `We saved your information, but couldn't send the referral.\n\n` +
                    `Supabase says: ${"message" in referralError
                        ? referralError.message
                        : JSON.stringify(referralError)
                    }`,
                );
                return;
            }

            alert("Your intake has been submitted and a referral has been sent.");
        } catch (err) {
            console.error("Unexpected error submitting intake + referral:", err);
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
        {
            id: 5,
            label: "Review & confirm",
            complete: step === 6 || !!form.initials,
        },
        { id: 6, label: "Recommendation", complete: !!result },
    ];

    const activeStep = stepsMeta.find((s) => s.id === step);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10 md:flex-row">
                {/* Progress rail (top on mobile, sidebar on desktop) */}
                <aside className="order-1 md:order-none md:w-64 md:shrink-0">
                    <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
                        <h2 className="text-sm font-semibold text-gray-900">
                            Intake progress
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                            You can tap a step to jump back and edit.
                        </p>

                        <ol className="mt-4 grid gap-2 sm:gap-3">
                            {stepsMeta.map((s) => (
                                <li key={s.id}>
                                    <button
                                        type="button"
                                        onClick={() => setStep(s.id)}
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${step === s.id
                                            ? "bg-gray-900 text-white shadow-sm"
                                            : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-medium uppercase tracking-wide opacity-70">
                                                Step {s.id} of 6
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
                            <header className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Step {activeStep.id} of 6
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
                                            "Please double-check that everything looks right before you continue."}
                                        {step === 6 &&
                                            "Based on what you shared, here’s an initial snapshot and recommendation."}
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

                        {/* STEP 5 – REVIEW & CONFIRM */}
                        {step === 5 && (
                            <Step5Review
                                form={form}
                                setForm={setForm}
                                loading={loading}
                                onBack={() => setStep(4)}
                                onGetRecommendation={handleSubmit}
                            />
                        )}

                        {/* STEP 6 – SUMMARY & RECOMMENDATION */}
                        {step === 6 && result && (
                            <StepTransition>
                                <section className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* Left card: Your information */}
                                        <div className="space-y-4">
                                            <h2 className="text-sm font-semibold text-gray-900">
                                                Your information
                                            </h2>
                                            <dl className="space-y-1 text-sm text-gray-700">
                                                <div className="flex justify-between gap-4">
                                                    <dt className="text-gray-500">Name</dt>
                                                    <dd className="text-right">
                                                        {[form.firstName, form.lastName]
                                                            .filter(Boolean)
                                                            .join(" ")}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <dt className="text-gray-500">Date of birth</dt>
                                                    <dd className="text-right">{form.dob}</dd>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <dt className="text-gray-500">
                                                        Substances used (last 30 days)
                                                    </dt>
                                                    <dd className="text-right">
                                                        {form.substances.join(", ")}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <dt className="text-gray-500">Last use</dt>
                                                    <dd className="text-right">{form.lastUse}</dd>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <dt className="text-gray-500">Use frequency</dt>
                                                    <dd className="text-right">{form.frequency}</dd>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <dt className="text-gray-500">Prior treatment</dt>
                                                    <dd className="text-right">
                                                        {form.priorTreatment === "yes" ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                {form.priorTreatment === "yes" && (
                                                    <>
                                                        <div className="flex justify-between gap-4">
                                                            <dt className="text-gray-500">
                                                                Last treatment duration
                                                            </dt>
                                                            <dd className="text-right">
                                                                {form.treatmentLastDuration}
                                                            </dd>
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <dt className="text-gray-500">
                                                                Last treatment year
                                                            </dt>
                                                            <dd className="text-right">
                                                                {form.treatmentLastYear}
                                                            </dd>
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <dt className="text-gray-500">
                                                                Treatment facility
                                                            </dt>
                                                            <dd className="text-right">
                                                                {form.treatmentFacility}
                                                            </dd>
                                                        </div>
                                                    </>
                                                )}
                                            </dl>
                                        </div>

                                        {/* Right card: Recommendation */}
                                        <div className="space-y-4">
                                            <h2 className="text-sm font-semibold text-gray-900">
                                                Recommendation
                                            </h2>
                                            <dl className="space-y-1 text-sm text-gray-700">
                                                <div className="flex justify-between gap-4">
                                                    <dt className="text-gray-500">Withdrawal risk</dt>
                                                    <dd className="text-right">
                                                        {result.withdrawalRisk}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <dt className="text-gray-500">Relapse risk</dt>
                                                    <dd className="text-right">
                                                        {result.relapseRisk}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <dt className="text-gray-500">
                                                        Co-occurring needs
                                                    </dt>
                                                    <dd className="text-right">
                                                        {result.coOccurring}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <dt className="text-gray-500">Support level</dt>
                                                    <dd className="text-right">
                                                        {result.supportLevel}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <dt className="text-gray-500">
                                                        Recommended level of care
                                                    </dt>
                                                    <dd className="text-right">
                                                        {result.recommendedLevelOfCare}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900">
                                                Enter your initials to confirm accuracy
                                            </label>
                                            <Input
                                                className="mt-1 w-24"
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

                                        {/* Step 6 — Actions */}
                                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
                                            {/* Back button */}
                                            <button
                                                type="button"
                                                onClick={() => setStep(5)}
                                                className="inline-flex items-center rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
                                            >
                                                Back to review
                                            </button>

                                            {/* Desktop primary — Submit intake */}
                                            <div className="hidden sm:block">
                                                <button
                                                    type="button"
                                                    onClick={handleFinalSubmit}
                                                    disabled={loading}
                                                    className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm w-full disabled:opacity-40 disabled:cursor-not-allowed transition hover:bg-gray-900"
                                                >
                                                    {loading ? "Submitting..." : "Submit intake"}
                                                </button>
                                            </div>

                                            {/* Mobile sticky primary — Submit intake */}
                                            <StickyActionBar>
                                                <button
                                                    type="button"
                                                    onClick={handleFinalSubmit}
                                                    disabled={loading}
                                                    className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-base font-semibold text-white shadow-sm w-full disabled:opacity-40 disabled:cursor-not-allowed transition hover:bg-gray-900"
                                                >
                                                    {loading ? "Submitting..." : "Submit intake"}
                                                </button>
                                            </StickyActionBar>
                                        </div>
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