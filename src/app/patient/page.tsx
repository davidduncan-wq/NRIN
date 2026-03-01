// NRIN/src/app/patient/page.tsx
"use client";

import { useState } from "react";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { DateInput } from "@/components/ui/DateInput";
import FieldCheck from "@/components/ui/FieldCheck";
import ChoiceButton from "@/components/ui/ChoiceButton";

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

  const stepsMeta: { id: Step; label: string; complete: boolean }[] = [
    { id: 1, label: "Basic information", complete: isDemographicsStepComplete },
    { id: 2, label: "Identity & address", complete: isIdentityStepComplete },
    { id: 3, label: "Housing", complete: isHousingStepComplete },
    { id: 4, label: "Substances & treatment", complete: isSubstanceStepComplete },
    { id: 5, label: "Review & confirm", complete: step === 6 || !!form.initials },
    { id: 6, label: "Recommendation", complete: !!result },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto flex max-w-6xl gap-10 px-4">
        {/* Sidebar progress */}
        <aside className="w-64 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Intake progress
          </h2>
          <ol className="space-y-2 text-sm">
            {stepsMeta.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition ${
                    step === s.id
                      ? "bg-white shadow-sm ring-1 ring-gray-200"
                      : "text-gray-600 hover:bg-white/60"
                  }`}
                >
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-gray-400">
                      Step {s.id}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {s.label}
                    </div>
                  </div>
                  <FieldCheck ok={s.complete} />
                </button>
              </li>
            ))}
          </ol>
        </aside>

        {/* Main content */}
        <main className="flex-1 rounded-2xl bg-white p-6 shadow-sm">
          {/* STEP 1 – DEMOGRAPHICS */}
          {step === 1 && (
            <section className="space-y-6">
              <header className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Basic information
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Tell us a little about yourself so we can match you to the
                    right level of care.
                  </p>
                </div>
                {isDemographicsStepComplete && <FieldCheck ok={true} />}
              </header>

              {form.firstName && ageYears !== null && (
                <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-900">
                  {form.firstName} · Age {ageYears}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    First name
                  </label>
                  <Input
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Date of birth
                  </label>
                  <DateInput
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

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!isDemographicsStepComplete}
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
              <header className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Identity & address
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Where can we reach you and how do you describe yourself?
                  </p>
                </div>
                <FieldCheck ok={isIdentityStepComplete} />
              </header>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Home / primary address
                  </label>
                  <Input
                    value={form.address}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, address: e.target.value }))
                    }
                    autoComplete="street-address"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-900">
                      City
                    </label>
                    <Input
                      value={form.city}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, city: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      State
                    </label>
                    <Input
                      value={form.state}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          state: e.target.value.toUpperCase().slice(0, 2),
                        }))
                      }
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      ZIP
                    </label>
                    <Input
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
              </div>

              {/* Sex assigned at birth */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-900">
                    Sex assigned at birth
                  </label>
                  <FieldCheck ok={!!form.sexAtBirth} />
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {["male", "female", "intersex", "prefer_not_to_say"].map(
                    (v) => (
                      <ChoiceButton
                        key={v}
                        isSelected={form.sexAtBirth === v}
                        onClick={() =>
                          setForm((prev) => ({ ...prev, sexAtBirth: v }))
                        }
                      >
                        {v.replace("_", " ")}
                      </ChoiceButton>
                    )
                  )}
                </div>
              </div>

              {/* Gender identity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-900">
                    Gender identity
                  </label>
                  <FieldCheck ok={!!form.genderIdentity} />
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {["man", "woman", "nonbinary", "another", "prefer_not_to_say"].map(
                    (v) => (
                      <ChoiceButton
                        key={v}
                        isSelected={form.genderIdentity === v}
                        onClick={() =>
                          setForm((prev) => ({ ...prev, genderIdentity: v }))
                        }
                      >
                        {v.replace("_", " ")}
                      </ChoiceButton>
                    )
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
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
                  className="inline-flex items-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-900"
                >
                  Continue
                </button>
              </div>
            </section>
          )}

          {/* STEP 3 – HOUSING */}
          {step === 3 && (
            <section className="space-y-6">
              <header className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Housing information
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    A few quick questions about where you’re staying.
                  </p>
                </div>
                <FieldCheck ok={isHousingStepComplete} />
              </header>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Where did you sleep last night?
                  </label>
                  <Select
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
                    <option value="friend_family">Friend / family</option>
                    <option value="hospital">Hospital / ER</option>
                    <option value="jail">Jail / detention</option>
                    <option value="hotel">Hotel / motel</option>
                    <option value="treatment">Treatment facility</option>
                    <option value="other">Other</option>
                    <option value="decline">Decline to answer</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <span className="block text-sm font-medium text-gray-900">
                    Are you currently homeless?
                  </span>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <ChoiceButton
                      isSelected={form.isCurrentlyHomeless === "yes"}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          isCurrentlyHomeless: "yes",
                        }))
                      }
                    >
                      Yes
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
                      No
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
                      <span className="block text-sm font-medium text-gray-900">
                        Do you have an address you can use?
                      </span>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <ChoiceButton
                          isSelected={form.hasAddressYouCanUse === "yes"}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              hasAddressYouCanUse: "yes",
                            }))
                          }
                        >
                          Yes
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
                          No
                        </ChoiceButton>
                      </div>
                    </div>

                    {form.hasAddressYouCanUse === "yes" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-900">
                          Address you can use
                        </label>
                        <Input
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
              </div>

              <div className="mt-6 flex items-center justify-between">
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
                  className="inline-flex items-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-900"
                >
                  Continue
                </button>
              </div>
            </section>
          )}

          {/* STEP 4 – SUBSTANCES & TREATMENT */}
          {step === 4 && (
            <section className="space-y-6">
              <header className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Substances & treatment history
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    This helps us understand withdrawal and relapse risk.
                  </p>
                </div>
                <FieldCheck ok={isSubstanceStepComplete} />
              </header>

              {/* Substances */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Substances used in the last 30 days
                </label>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </ChoiceButton>
                  ))}
                </div>
              </div>

              {/* Last use + frequency */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Last use
                  </label>
                  <Select
                    value={form.lastUse}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, lastUse: e.target.value }))
                    }
                  >
                    <option value="">Select one</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="2-3_days_ago">2–3 days ago</option>
                    <option value="4-7_days_ago">4–7 days ago</option>
                    <option value="7+_days_ago">More than a week ago</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Frequency
                  </label>
                  <Select
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
                    <option value="less_than_weekly">
                      Less than once a week
                    </option>
                  </Select>
                </div>
              </div>

              {/* Treatment history (simplified version keeping your fields) */}
              <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <h2 className="text-sm font-semibold text-gray-900">
                  Treatment history
                </h2>

                <div className="space-y-2">
                  <span className="block text-sm font-medium text-gray-900">
                    Have you been to treatment before?
                  </span>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <ChoiceButton
                      isSelected={form.priorTreatment === "yes"}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, priorTreatment: "yes" }))
                      }
                    >
                      Yes
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
                      No
                    </ChoiceButton>
                  </div>
                </div>

                {form.priorTreatment === "yes" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900">
                        When were you last in treatment?
                      </label>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                        <ChoiceButton
                          isSelected={form.treatmentLastWhen === "0-12_months"}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              treatmentLastWhen: "0-12_months",
                            }))
                          }
                        >
                          0–12 months ago
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
                          Over 1 year ago
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
                          5+ years ago
                        </ChoiceButton>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900">
                        How long were you in treatment?
                      </label>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
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
                          0–7 days
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
                          7–30 days
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
                          30+ days
                        </ChoiceButton>
                      </div>
                    </div>

                    {form.treatmentLastDuration === "30+_days" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <span className="block text-sm font-medium text-gray-900">
                            Programs completed
                          </span>
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
                              Completed PHP
                            </ChoiceButton>
                            <ChoiceButton
                              isSelected={form.treatmentPHPCompleted === "no"}
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  treatmentPHPCompleted: "no",
                                }))
                              }
                            >
                              Didn’t complete PHP
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
                              Completed IOP
                            </ChoiceButton>
                            <ChoiceButton
                              isSelected={form.treatmentIOPCompleted === "no"}
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  treatmentIOPCompleted: "no",
                                }))
                              }
                            >
                              Didn’t complete IOP
                            </ChoiceButton>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-900">
                              What year was that? (YYYY)
                            </label>
                            <Input
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

              <div className="mt-6 flex items-center justify-between">
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
                  className="inline-flex items-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-900"
                >
                  Review & confirm
                </button>
              </div>
            </section>
          )}

          {/* STEP 5 – REVIEW & CONFIRM */}
          {step === 5 && (
            <section className="space-y-6">
              <header>
                <h1 className="text-xl font-semibold text-gray-900">
                  Review your answers
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Please double-check that this looks right before you continue.
                </p>
              </header>

              <div className="space-y-4 text-sm">
                <div>
                  <h2 className="font-semibold text-gray-900">Basic info</h2>
                  <dl className="mt-1 space-y-1 text-gray-700">
                    <div className="flex justify-between gap-4">
                      <dt>Name</dt>
                      <dd className="text-right">
                        {[form.firstName, form.lastName]
                          .filter(Boolean)
                          .join(" ") || "Not provided"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Date of birth</dt>
                      <dd className="text-right">
                        {form.dob || "Not provided"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Phone</dt>
                      <dd className="text-right">
                        {form.phone || "Not provided"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Housing / location
                  </h2>
                  <dl className="mt-1 space-y-1 text-gray-700">
                    <div className="flex justify-between gap-4">
                      <dt>Current location</dt>
                      <dd className="text-right">
                        {form.currentLocation || "Not provided"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Where you slept last night</dt>
                      <dd className="text-right">
                        {form.sleptLastNight || "Not provided"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Currently homeless</dt>
                      <dd className="text-right">
                        {form.isCurrentlyHomeless || "Not provided"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Substance & treatment snapshot
                  </h2>
                  <dl className="mt-1 space-y-1 text-gray-700">
                    <div className="flex justify-between gap-4">
                      <dt>Substances (last 30 days)</dt>
                      <dd className="text-right">
                        {form.substances && form.substances.length > 0
                          ? form.substances.join(", ")
                          : "Not provided"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Last use</dt>
                      <dd className="text-right">
                        {form.lastUse || "Not provided"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Frequency</dt>
                      <dd className="text-right">
                        {form.frequency || "Not provided"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Prior treatment</dt>
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

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Please type your initials to confirm this information is
                  accurate
                </label>
                <Input
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

              <div className="mt-6 flex items-center justify-between">
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
                  disabled={loading || !form.initials.trim()}
                  className="inline-flex items-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Submitting…" : "Get recommendation"}
                </button>
              </div>
            </section>
          )}

          {/* STEP 6 – SUMMARY & RECOMMENDATION */}
          {step === 6 && result && (
            <section className="space-y-6">
              <header>
                <h1 className="text-xl font-semibold text-gray-900">
                  Summary & recommendation
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Based on what you shared, here’s an initial snapshot.
                </p>
              </header>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Your information
                  </h2>
                  <dl className="mt-2 space-y-1 text-sm text-gray-700">
                    <div className="flex justify-between gap-4">
                      <dt>Name</dt>
                      <dd className="text-right">
                        {[form.firstName, form.lastName]
                          .filter(Boolean)
                          .join(" ")}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Date of birth</dt>
                      <dd className="text-right">{form.dob}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Substances used (last 30 days)</dt>
                      <dd className="text-right">
                        {form.substances.join(", ")}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Last use</dt>
                      <dd className="text-right">{form.lastUse}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Use frequency</dt>
                      <dd className="text-right">{form.frequency}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Prior treatment</dt>
                      <dd className="text-right">
                        {form.priorTreatment === "yes" ? "Yes" : "No"}
                      </dd>
                    </div>
                    {form.priorTreatment === "yes" && (
                      <>
                        <div className="flex justify-between gap-4">
                          <dt>Last treatment duration</dt>
                          <dd className="text-right">
                            {form.treatmentLastDuration}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt>Last treatment year</dt>
                          <dd className="text-right">
                            {form.treatmentLastYear}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt>Treatment facility</dt>
                          <dd className="text-right">
                            {form.treatmentFacility}
                          </dd>
                        </div>
                      </>
                    )}
                  </dl>
                </div>

                <div className="space-y-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <h2 className="text-sm font-semibold text-blue-900">
                    Recommendation
                  </h2>
                  <dl className="mt-2 space-y-1 text-sm text-blue-900">
                    <div className="flex justify-between gap-4">
                      <dt>Withdrawal risk</dt>
                      <dd className="text-right">{result.withdrawalRisk}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Relapse risk</dt>
                      <dd className="text-right">{result.relapseRisk}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Co-occurring needs</dt>
                      <dd className="text-right">{result.coOccurring}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Support level</dt>
                      <dd className="text-right">{result.supportLevel}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Recommended level of care</dt>
                      <dd className="text-right">
                        {result.recommendedLevelOfCare}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Enter your initials to confirm accuracy
                </label>
                <Input
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

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  disabled={loading || !form.initials.trim()}
                  className="inline-flex items-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit intake"}
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}