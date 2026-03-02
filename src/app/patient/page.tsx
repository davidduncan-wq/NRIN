// NRIN/src/app/patient/page.tsx
"use client";

import { useState } from "react";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { DateInput } from "@/components/ui/DateInput";
import FieldCheck from "@/components/ui/FieldCheck";
import ChoiceButton from "@/components/ui/ChoiceButton";
import { supabase } from "@/lib/supabaseClient";

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

type FormState = {
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
        !!form.currentLocation.trim() &&
        !!form.sleptLastNight &&
        !!form.isCurrentlyHomeless;

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

            const {
                data: patientData,
                error: patientError,
            } = await supabase
                .from("patients")
                .insert(patientPayload)
                .select("id")
                .single();

            if (patientError || !patientData) {
                console.error("Error inserting patient:", patientError || "no data");
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
            const { error: referralError } = await supabase.from("referrals").insert({
                patient_id: patientId,
                referral_source: "self",
                status: "new",
            });

            if (referralError) {
                console.error("Error inserting referral:", referralError);

                alert(
                    `We saved your information, but couldn't send the referral.\n\n` +
                    `Supabase says: ${"message" in referralError ? referralError.message : JSON.stringify(referralError)}`
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
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                      step === s.id
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
              <section className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      First name
                    </label>
                    <Input
                      className="mt-1 w-full"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      autoComplete="given-name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Last name
                    </label>
                    <Input
                      className="mt-1 w-full"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Date of birth
                    </label>
                    <DateInput
                      className="mt-1 w-full"
                      placeholder="MM/DD/YYYY"
                      value={form.dob}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const formatted = formatDobMMDDYYYY(raw);
                        const iso = dobToISO(formatted);
                        setForm((prev) => ({
                          ...prev,
                          dob: formatted,
                          dobISO: iso ?? "",
                        }));
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Mobile phone
                    </label>
                    <PhoneInput
                      className="mt-1 w-full"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          phone: formatPhoneInput(e.target.value),
                        }))
                      }
                      maxLength={14} // (XXX) YYY-ZZZZ
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Where are you now?
                  </label>
                  <Input
                    className="mt-1 w-full"
                    value={form.currentLocation}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        currentLocation: e.target.value,
                      }))
                    }
                    placeholder="City / facility / general location"
                  />
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-500">
                    You can edit this later before submitting.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!isDemographicsStepComplete || loading}
                    className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continue
                  </button>
                </div>
              </section>
            )}

            {/* STEP 2 – IDENTITY & ADDRESS */}
            {step === 2 && (
              <section className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Home / primary address
                    </label>
                    <Input
                      className="mt-1 w-full"
                      value={form.address}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      autoComplete="street-address"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-900">
                        City
                      </label>
                      <Input
                        className="mt-1 w-full"
                        value={form.city}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900">
                        State
                      </label>
                      <Input
                        className="mt-1 w-full"
                        value={form.state}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            state: e.target.value
                              .toUpperCase()
                              .slice(0, 2),
                          }))
                        }
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-900">
                      ZIP
                    </label>
                    <Input
                      className="mt-1 w-full"
                      value={form.zip}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          zip: e.target.value.replace(/\D/g, "").slice(0, 5),
                        }))
                      }
                      maxLength={5}
                    />
                  </div>
                </div>

                {/* Sex assigned at birth */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    Sex assigned at birth
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {["male", "female", "intersex", "prefer_not_to_say"].map(
                      (v) => (
                        <ChoiceButton
                          key={v}
                          isSelected={form.sexAtBirth === v}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              sexAtBirth: v,
                            }))
                          }
                        >
                          <span className="text-sm">
                            {v.replace("_", " ")}
                          </span>
                        </ChoiceButton>
                      ),
                    )}
                  </div>
                </div>

                {/* Gender identity */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    Gender identity
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {[
                      "man",
                      "woman",
                      "nonbinary",
                      "another",
                      "prefer_not_to_say",
                    ].map((v) => (
                      <ChoiceButton
                        key={v}
                        isSelected={form.genderIdentity === v}
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            genderIdentity: v,
                          }))
                        }
                      >
                        <span className="text-sm">
                          {v.replace("_", " ")}
                        </span>
                      </ChoiceButton>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900"
                  >
                    Continue
                  </button>
                </div>
              </section>
            )}

            {/* STEP 3 – HOUSING */}
            {step === 3 && (
              <section className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Where did you sleep last night?
                  </label>
                  <Select
                    className="mt-1 w-full"
                    value={form.sleptLastNight}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        sleptLastNight: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select one</option>
                    <option value="shelter">Shelter</option>
                    <option value="street">Street / encampment</option>
                    <option value="park">Park</option>
                    <option value="vehicle">Car / vehicle</option>
                    <option value="friend_family">
                      Friend / family
                    </option>
                    <option value="hospital_er">Hospital / ER</option>
                    <option value="jail_detention">
                      Jail / detention
                    </option>
                    <option value="hotel_motel">Hotel / motel</option>
                    <option value="treatment_facility">
                      Treatment facility
                    </option>
                    <option value="other">Other</option>
                    <option value="decline">Decline to answer</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    Are you currently homeless?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <ChoiceButton
                      isSelected={form.isCurrentlyHomeless === "yes"}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          isCurrentlyHomeless: "yes",
                        }))
                      }
                    >
                      <span className="text-sm">Yes</span>
                    </ChoiceButton>
                    <ChoiceButton
                      isSelected={form.isCurrentlyHomeless === "no"}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          isCurrentlyHomeless: "no",
                          lastKnownAddress: "",
                          hasAddressYouCanUse: "",
                          mailingAddress: "",
                        }))
                      }
                    >
                      <span className="text-sm">No</span>
                    </ChoiceButton>
                  </div>
                </div>

                {form.isCurrentlyHomeless === "yes" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900">
                        Last known address
                      </label>
                      <Input
                        className="mt-1 w-full"
                        value={form.lastKnownAddress}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            lastKnownAddress: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">
                        Do you have an address you can use?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <ChoiceButton
                          isSelected={form.hasAddressYouCanUse === "yes"}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              hasAddressYouCanUse: "yes",
                            }))
                          }
                        >
                          <span className="text-sm">Yes</span>
                        </ChoiceButton>
                        <ChoiceButton
                          isSelected={form.hasAddressYouCanUse === "no"}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              hasAddressYouCanUse: "no",
                              mailingAddress: "",
                            }))
                          }
                        >
                          <span className="text-sm">No</span>
                        </ChoiceButton>
                      </div>
                    </div>

                    {form.hasAddressYouCanUse === "yes" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Address you can use
                        </label>
                        <Input
                          className="mt-1 w-full"
                          value={form.mailingAddress}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              mailingAddress: e.target.value,
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900"
                  >
                    Continue
                  </button>
                </div>
              </section>
            )}

            {/* STEP 4 – SUBSTANCES & TREATMENT */}
            {step === 4 && (
              <section className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    Substances used in the last 30 days
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {[
                      "alcohol",
                      "opioids",
                      "benzodiazepines",
                      "stimulants",
                      "ketamine",
                      "kratom",
                      "hallucinogens",
                      "inhalants",
                    ].map((s) => (
                      <ChoiceButton
                        key={s}
                        isSelected={form.substances.includes(s)}
                        onClick={() => toggleSubstance(s)}
                      >
                        <span className="text-sm">
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </span>
                      </ChoiceButton>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Last use
                    </label>
                    <Select
                      className="mt-1 w-full"
                      value={form.lastUse}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          lastUse: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select one</option>
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="2-3_days">2–3 days ago</option>
                      <option value="4-7_days">4–7 days ago</option>
                      <option value="more_than_week">
                        More than a week ago
                      </option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Frequency
                    </label>
                    <Select
                      className="mt-1 w-full"
                      value={form.frequency}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          frequency: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select one</option>
                      <option value="daily">Daily</option>
                      <option value="3-5_days_week">3–5 days / week</option>
                      <option value="1-2_days_week">1–2 days / week</option>
                      <option value="less_than_week">
                        Less than once a week
                      </option>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">
                      Have you been to treatment before?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <ChoiceButton
                        isSelected={form.priorTreatment === "yes"}
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            priorTreatment: "yes",
                          }))
                        }
                      >
                        <span className="text-sm">Yes</span>
                      </ChoiceButton>
                      <ChoiceButton
                        isSelected={form.priorTreatment === "no"}
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            priorTreatment: "no",
                            treatmentLastWhen: "",
                            treatmentLastDuration: "",
                            treatmentPHPCompleted: "",
                            treatmentIOPCompleted: "",
                            treatmentLastYear: "",
                            treatmentFacility: "",
                          }))
                        }
                      >
                        <span className="text-sm">No</span>
                      </ChoiceButton>
                    </div>
                  </div>

                  {form.priorTreatment === "yes" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          When were you last in treatment?
                        </label>
                        <div className="mt-1 grid gap-2 sm:grid-cols-3">
                          <ChoiceButton
                            isSelected={form.treatmentLastWhen === "0-12_months"}
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                treatmentLastWhen: "0-12_months",
                              }))
                            }
                          >
                            <span className="text-sm">0–12 months ago</span>
                          </ChoiceButton>
                          <ChoiceButton
                            isSelected={form.treatmentLastWhen === "1-5_years"}
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                treatmentLastWhen: "1-5_years",
                              }))
                            }
                          >
                            <span className="text-sm">Over 1 year ago</span>
                          </ChoiceButton>
                          <ChoiceButton
                            isSelected={form.treatmentLastWhen === "5+_years"}
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                treatmentLastWhen: "5+_years",
                              }))
                            }
                          >
                            <span className="text-sm">5+ years ago</span>
                          </ChoiceButton>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          How long were you in treatment?
                        </label>
                        <div className="mt-1 grid gap-2 sm:grid-cols-3">
                          <ChoiceButton
                            isSelected={
                              form.treatmentLastDuration === "0-7_days"
                            }
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                treatmentLastDuration: "0-7_days",
                              }))
                            }
                          >
                            <span className="text-sm">0–7 days</span>
                          </ChoiceButton>
                          <ChoiceButton
                            isSelected={
                              form.treatmentLastDuration === "7-30_days"
                            }
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                treatmentLastDuration: "7-30_days",
                              }))
                            }
                          >
                            <span className="text-sm">7–30 days</span>
                          </ChoiceButton>
                          <ChoiceButton
                            isSelected={
                              form.treatmentLastDuration === "30+_days"
                            }
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                treatmentLastDuration: "30+_days",
                              }))
                            }
                          >
                            <span className="text-sm">30+ days</span>
                          </ChoiceButton>
                        </div>
                      </div>

                      {form.treatmentLastDuration === "30+_days" && (
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Programs completed
                            </p>
                            <div className="mt-1 grid gap-2 sm:grid-cols-2">
                              <ChoiceButton
                                isSelected={
                                  form.treatmentPHPCompleted === "yes"
                                }
                                onClick={() =>
                                  setForm((prev) => ({
                                    ...prev,
                                    treatmentPHPCompleted: "yes",
                                  }))
                                }
                              >
                                <span className="text-sm">Completed PHP</span>
                              </ChoiceButton>
                              <ChoiceButton
                                isSelected={
                                  form.treatmentPHPCompleted === "no"
                                }
                                onClick={() =>
                                  setForm((prev) => ({
                                    ...prev,
                                    treatmentPHPCompleted: "no",
                                  }))
                                }
                              >
                                <span className="text-sm">
                                  Didn’t complete PHP
                                </span>
                              </ChoiceButton>
                              <ChoiceButton
                                isSelected={
                                  form.treatmentIOPCompleted === "yes"
                                }
                                onClick={() =>
                                  setForm((prev) => ({
                                    ...prev,
                                    treatmentIOPCompleted: "yes",
                                  }))
                                }
                              >
                                <span className="text-sm">Completed IOP</span>
                              </ChoiceButton>
                              <ChoiceButton
                                isSelected={
                                  form.treatmentIOPCompleted === "no"
                                }
                                onClick={() =>
                                  setForm((prev) => ({
                                    ...prev,
                                    treatmentIOPCompleted: "no",
                                  }))
                                }
                              >
                                <span className="text-sm">
                                  Didn’t complete IOP
                                </span>
                              </ChoiceButton>
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-900">
                                What year was that? (YYYY)
                              </label>
                              <Input
                                className="mt-1 w-full"
                                value={form.treatmentLastYear}
                                onChange={(e) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    treatmentLastYear: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-900">
                                Where was that treatment?
                              </label>
                              <Input
                                className="mt-1 w-full"
                                value={form.treatmentFacility}
                                onChange={(e) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    treatmentFacility: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900"
                  >
                    Review &amp; confirm
                  </button>
                </div>
              </section>
            )}

            {/* STEP 5 – REVIEW & CONFIRM */}
            {step === 5 && (
              <section className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                      Basic info
                    </h2>
                    <dl className="mt-2 space-y-1 text-sm text-gray-700">
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500">Name</dt>
                        <dd className="text-right">
                          {[form.firstName, form.lastName]
                            .filter(Boolean)
                            .join(" ") || "Not provided"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500">Date of birth</dt>
                        <dd className="text-right">
                          {form.dob || "Not provided"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500">Phone</dt>
                        <dd className="text-right">
                          {form.phone || "Not provided"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                      Housing / location
                    </h2>
                    <dl className="mt-2 space-y-1 text-sm text-gray-700">
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500">Current location</dt>
                        <dd className="text-right">
                          {form.currentLocation || "Not provided"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500">
                          Where you slept last night
                        </dt>
                        <dd className="text-right">
                          {form.sleptLastNight || "Not provided"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500">Currently homeless</dt>
                        <dd className="text-right">
                          {form.isCurrentlyHomeless || "Not provided"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                      Substance &amp; treatment snapshot
                    </h2>
                    <dl className="mt-2 space-y-1 text-sm text-gray-700">
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500">
                          Substances (last 30 days)
                        </dt>
                        <dd className="text-right">
                          {form.substances && form.substances.length > 0
                            ? form.substances.join(", ")
                            : "Not provided"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500">Last use</dt>
                        <dd className="text-right">
                          {form.lastUse || "Not provided"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500">Frequency</dt>
                        <dd className="text-right">
                          {form.frequency || "Not provided"}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500">Prior treatment</dt>
                        <dd className="text-right">
                          {form.priorTreatment === "yes"
                            ? "Yes"
                            : form.priorTreatment === "no"
                            ? "No"
                            : "Not provided"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Please type your initials to confirm this information is
                    accurate
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
                  />
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="inline-flex items-center rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loading ? "Submitting…" : "Get recommendation"}
                  </button>
                </div>
              </section>
            )}

            {/* STEP 6 – SUMMARY & RECOMMENDATION */}
            {step === 6 && result && (
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
                        <dd className="text-right">{result.relapseRisk}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-500">Co-occurring needs</dt>
                        <dd className="text-right">{result.coOccurring}</dd>
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

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      className="inline-flex items-center rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
                    >
                      Back to review
                    </button>
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      disabled={loading}
                      className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {loading ? "Submitting..." : "Submit intake"}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}