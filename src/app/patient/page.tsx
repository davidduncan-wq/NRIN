'use client';

import { useState } from 'react';
import { inputBase } from "@/components/ui/InputBase";
import FieldCheck from "@/components/ui/FieldCheck";
import ChoiceButton from "@/components/ui/ChoiceButton";
import CheckIcon from "@/components/ui/CheckIcon";

function formatPhoneInput(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 10);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatDobMMDDYYYY(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 8);

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

    return `${yyyy}-${mm}-${dd}`;
}
type Step = 1 | 2 | 3 | 4 | 5;

type Recommendation = {
    withdrawalRisk: string;
    relapseRisk: string;
    coOccurring: string;
    supportLevel: string;
    recommendedLevelOfCare: string;
};

function computeAgeYears(isoDate: string | undefined): number | null {
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
    dobISO: string;

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
    relapseTiming: string;
    mHmeds: string;
    mhHospitalization: string;
    supportivePerson: string;

    // Review / confirmation
    initials: string;
};
export default function PatientIntakePage() {
    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Recommendation | null>(null);
    const [genderIdentity, setGenderIdentity] = useState<
        '' | 'woman' | 'man' | 'nonbinary' | 'another' | 'prefer_not_to_say'
    >('');
    const [genderIdentityOther, setGenderIdentityOther] = useState('');

    const [sexAtBirth, setSexAtBirth] = useState<
        '' | 'female' | 'male' | 'intersex' | 'prefer_not_to_say'
    >('');

    const [form, setForm] = useState<FormState>({
        firstName: '',
        lastName: '',
        phone: '',

        dob: '',
        dobISO: '',

        sexAtBirth: '',
        genderIdentity: '',

        address: '',
        city: '',
        state: '',
        zip: '',

        currentLocation: '',

        sleptLastNight: '',
        isCurrentlyHomeless: '',
        lastKnownAddress: '',
        hasAddressYouCanUse: '',
        mailingAddress: '',

        substances: [] as string[],

        lastUse: '',
        frequency: '',
        severeWithdrawalHistory: '',

        // Treatment history
        priorTreatment: '',          // "yes" | "no"
        treatmentLastWhen: '',       // "0-12 months" | "1-5 years" | "5+ years"
        treatmentLastDuration: '',   // "0-7 days" | "7-30 days" | "30+ days"
        treatmentPHPCompleted: '',   // "yes" | "no"
        treatmentIOPCompleted: '',   // "yes" | "no"
        treatmentLastYear: '',       // "YYYY"
        treatmentFacility: '',       // free-text

        relapseTiming: '',
        mHmeds: '',
        mhHospitalization: '',
        supportivePerson: '',

        // Review / confirmation
        initials: '',
    });
    const isDemographicsStepComplete =
        !!form.firstName &&
        !!form.lastName &&
        !!form.dob;
    const isIdentityStepComplete =
        !!form.address &&
        !!form.city &&
        !!form.state &&
        !!form.zip;

    const isSubstanceStepComplete =
        form.substances.length > 0 &&
        !!form.lastUse &&
        !!form.frequency;

    const isHousingStepComplete =
        !!(form.currentLocation || '').trim() &&
        !!form.sleptLastNight &&
        !!form.isCurrentlyHomeless;



    const ageYears = computeAgeYears(form.dobISO);
    function toggleSubstance(value: string) {
        setForm(prev => {
            const exists = prev.substances.includes(value);
            return {
                ...prev,
                substances: exists
                    ? prev.substances.filter(s => s !== value)
                    : [...prev.substances, value],
            };
        });
    }

    async function handleSubmit() {
        setLoading(true);

        const isoDob = dobToISO(form.dob);
        if (!isoDob) {
            alert('Please enter DOB in MM/DD/YYYY format');
            return;
        }

        try {
            const res = await fetch('/api/match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dob: isoDob,
                    currentLocation: form.currentLocation,

                    substances: form.substances,
                    lastUse: form.lastUse,
                    frequency: form.frequency,
                    dailyAlcoholOrBenzo: 'unknown',
                    severeWithdrawalHistory: form.severeWithdrawalHistory,
                    withdrawalSymptomsNow: 'unknown',
                    priorTreatment: form.priorTreatment,
                    relapseTiming: form.relapseTiming,
                    mhMeds: form.mhMeds,
                    mhHospitalization: form.mhHospitalization,
                    supportivePerson: form.supportivePerson,
                    housingStable:
                        form.isCurrentlyHomeless === 'yes'
                            ? 'no'
                            : form.isCurrentlyHomeless === 'no'
                                ? 'yes'
                                : 'unknown',
                }),
            });

            const data = await res.json();
            setResult(data);
            setStep(6);
        } catch {
            alert('Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
            {step === 1 && (
                <section className="max-w-3xl mx-auto bg-white shadow-sm rounded-xl border border-gray-200 p-6 md:p-8 space-y-6">
                    <header className="space-y-1">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            Basic information
                            {isDemographicsStepComplete && (
                                <span className="text-green-600" aria-hidden="true">
                                    <CheckIcon className="h-5 w-5" />
                                </span>
                            )}
                        </h2>

                        {form.firstName && ageYears !== null && (
                            <p className="mt-1 text-sm text-gray-600">
                                {form.firstName} · Age {ageYears}
                            </p>
                        )}

                        <p className="text-sm text-gray-500">
                            Tell us a little about yourself...
                        </p>
                        <p className="text-sm text-gray-500">
                            Tell us a little about yourself so we can match you to the right level of care.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className={`${inputBase} pr-12`}
                                    value={form.firstName || ''}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, firstName: e.target.value }))
                                    }
                                />
                                <FieldCheck ok={!!form.firstName.trim()} />
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                className={`${inputBase} pr-12`}
                                value={form.lastName || ''}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, lastName: e.target.value }))
                                }
                            />
                            <FieldCheck ok={!!form.lastName.trim()} />
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="MM/DD/YYYY"
                                className={`${inputBase} pr-12`}
                                value={form.dob || ''}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        dob: formatDobMMDDYYYY(e.target.value),
                                    }))
                                }
                            />
                            <FieldCheck ok={/^\d{2}\/\d{2}\/\d{4}$/.test(form.dob || '')} />
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="(555) 555-5555"
                                className={`${inputBase} pr-12`}
                                value={form.phone || ''}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        phone: formatPhoneInput(e.target.value),
                                    }))
                                }
                            />
                            <FieldCheck ok={(form.phone || '').replace(/\D/g, '').length >= 10} />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Where are you now?
                            </label>

                            {!!(form.currentLocation || '').trim() && (
                                <span className="text-green-600" aria-hidden="true">
                                    <CheckIcon className="h-5 w-5" />
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="City, State or ZIP"
                                className={`${inputBase} pr-12`}
                                value={form.currentLocation || ''}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        currentLocation: e.target.value,
                                    }))
                                }
                            />
                            <FieldCheck ok={!!(form.currentLocation || '').trim()} />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold bg-black text-white shadow-sm hover:bg-gray-900 transition active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed">
                            Continue
                        </button>
                    </div>
                </section>
            )}
            {step === 2 && (
                <div className="max-w-xl mx-auto">
                    <div className="bg-white rounded-xl shadow-sm p-6">

                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            Identity & Address
                            {isIdentityStepComplete && (
                                <span className="text-green-600" aria-hidden="true">
                                    <CheckIcon className="h-5 w-5" />
                                </span>
                            )}
                        </h2>

                        {/* Address */}
                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900">
                                    Home / Primary Address
                                </label>
                                <div className="relative">
                                    <input
                                        className={`${inputBase} pr-12`}
                                        value={form.address || ''}
                                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    />
                                    <FieldCheck ok={!!form.address.trim()} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="relative">
                                    <input
                                        placeholder="City"
                                        className="w-full rounded-md border border-gray-200 p-3 pr-10"
                                        value={form.city || ''}
                                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                                    />
                                    <FieldCheck ok={!!form.city.trim()} />
                                </div>

                                <div className="relative">
                                    <input
                                        placeholder="State"
                                        className="w-full rounded-md border border-gray-200 p-3 pr-10"
                                        value={form.state || ''}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                state: e.target.value.toUpperCase().slice(0, 2),
                                            })
                                        }
                                    />
                                    <FieldCheck ok={!!form.state.trim() && form.state.trim().length === 2} />
                                </div>

                                <div className="relative">
                                    <input
                                        placeholder="ZIP"
                                        inputMode="numeric"
                                        className="w-full rounded-md border border-gray-200 p-3 pr-10"
                                        value={form.zip || ''}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                zip: e.target.value.replace(/\D/g, '').slice(0, 5),
                                            })
                                        }
                                    />
                                    <FieldCheck ok={!!form.zip.trim() && form.zip.trim().length === 5} />
                                </div>
                            </div>
                        </div>

                        {/* Sex Assigned at Birth */}
                        <div className="mt-8">
                            <div className="flex items-center gap-2">
                                <label className="block text-sm font-medium text-gray-900">
                                    What sex were you assigned at birth (on your original birth certificate)?
                                </label>

                                {form.sexAtBirth && (
                                    <span className="text-green-600" aria-hidden="true">
                                        <CheckIcon className="h-5 w-5" />
                                    </span>
                                )}
                            </div>

                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {['male', 'female', 'intersex', 'prefer_not_to_say'].map((v) => (
                                    <button
                                        key={v}
                                        type="button"
                                        className={`w-full rounded-md border p-3 text-left ${form.sexAtBirth === v ? 'border-gray-900' : 'border-gray-200'
                                            }`}
                                        onClick={() =>
                                            setForm({ ...form, sexAtBirth: v })
                                        }
                                    >
                                        {v.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Gender Identity */}
                        <div className="mt-8">
                            <div className="flex items-center gap-2">
                                <label className="block text-sm font-medium text-gray-900">
                                    Gender identity
                                </label>

                                {form.genderIdentity && (
                                    <span className="text-green-600" aria-hidden="true">
                                        <CheckIcon className="h-5 w-5" />
                                    </span>
                                )}
                            </div>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {['man', 'woman', 'nonbinary', 'another', 'prefer_not_to_say'].map((v) => (
                                    <button
                                        key={v}
                                        type="button"
                                        className={`w-full rounded-md border p-3 text-left ${form.genderIdentity === v ? 'border-gray-900' : 'border-gray-200'
                                            }`}
                                        onClick={() =>
                                            setForm({ ...form, genderIdentity: v })
                                        }
                                    >
                                        {v.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <button
                                type="button"
                                className="rounded-md border border-gray-200 px-4 py-2"
                                onClick={() => setStep(1)}
                            >
                                Back
                            </button>

                            <button
                                type="button"
                                className="rounded-md bg-gray-900 text-white px-4 py-2"
                                onClick={() => setStep(3)}
                            >
                                Continue
                            </button>
                        </div>

                    </div>
                </div>
            )}
            {step === 3 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        Housing information
                        {isHousingStepComplete && (
                            <span className="text-green-600" aria-hidden="true">
                                <CheckIcon className="h-5 w-5" />
                            </span>
                        )}
                    </h2>

                    <label className="block text-sm font-medium text-gray-900">
                        Where did you sleep last night?
                    </label>

                    <div className="relative mt-2">
                        <select
                            className={`${inputBase} pr-12`}
                            value={form.sleptLastNight || ''}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, sleptLastNight: e.target.value }))
                            }
                        >
                            <option value="">Select one</option>
                            <option value="shelter">Shelter</option>
                            <option value="street_encampment">Street / encampment</option>
                            <option value="park">Park</option>
                            <option value="car">Car / vehicle</option>
                            <option value="friend_family">Friend / family</option>
                            <option value="hospital">Hospital / ER</option>
                            <option value="jail">Jail / detention</option>
                            <option value="hotel">Hotel / motel</option>
                            <option value="treatment">Treatment facility</option>
                            <option value="other">Other</option>
                            <option value="decline">Decline to answer</option>
                        </select>

                        <FieldCheck ok={!!form.sleptLastNight?.trim()} />
                    </div>

                    <label className="block font-medium">Are you currently homeless?</label>
                    <div className="grid grid-cols-2 gap-2 max-w-xs">
                        <ChoiceButton
                            isSelected={form.isCurrentlyHomeless === 'yes'}
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    isCurrentlyHomeless: 'yes',
                                }))
                            }
                        >
                            Yes
                        </ChoiceButton>

                        <ChoiceButton
                            isSelected={form.isCurrentlyHomeless === 'no'}
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    isCurrentlyHomeless: 'no',
                                    lastKnownAddress: '',
                                    hasAddressYouCanUse: '',
                                    mailingAddress: '',
                                }))
                            }
                        >
                            No
                        </ChoiceButton>
                    </div>

                    {form.isCurrentlyHomeless === 'yes' && (
                        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
                            <div>
                                <label className="block font-medium">Last known address</label>
                                <div className="relative">
                                    <input
                                        className={`${inputBase} pr-12`}
                                        placeholder="Street, City, State, ZIP"
                                        value={form.lastKnownAddress}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                lastKnownAddress: e.target.value,
                                            }))
                                        }
                                    />
                                    <FieldCheck ok={!!(form.lastKnownAddress || '').trim()} />
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium">Do you have an address you can use?</label>
                                <div className="grid grid-cols-2 gap-2 max-w-xs">
                                    <ChoiceButton
                                        isSelected={form.hasAddressYouCanUse === 'yes'}
                                        onClick={() => setForm((prev) => ({ ...prev, hasAddressYouCanUse: 'yes' }))}
                                    >
                                        Yes
                                    </ChoiceButton>

                                    <ChoiceButton
                                        isSelected={form.hasAddressYouCanUse === 'no'}
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                hasAddressYouCanUse: 'no',
                                                mailingAddress: '',
                                            }))
                                        }
                                    >
                                        No
                                    </ChoiceButton>
                                </div>
                            </div>

                            {form.hasAddressYouCanUse === 'yes' && (
                                <div>
                                    <label className="block font-medium">Address you can use</label>
                                    <div className="relative">
                                        <input
                                            className={`${inputBase} pr-12`}
                                            placeholder="Street, City, State, ZIP"
                                            value={form.mailingAddress}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    mailingAddress: e.target.value,
                                                }))
                                            }
                                        />
                                        <FieldCheck ok={!!(form.mailingAddress || '').trim()} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-6 flex justify-between">
                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300"
                        >
                            Back
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(4)}
                            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-gray-900"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
            {step === 4 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                        {isSubstanceStepComplete && (
                            <span className="text-green-600" aria-hidden="true">
                                <CheckIcon className="h-5 w-5" />
                            </span>
                        )}
                    </h2>
                    <label>Select substances used in last 30 days:</label>

                    {[
                        'alcohol',
                        'opioids',
                        'benzodiazepines',
                        'stimulants',
                        'ketamine',
                        'kratom',
                        'hallucinogens',
                        'inhalants',
                    ].map(s => (
                        <label key={s} className="block">
                            <input
                                type="checkbox"
                                checked={form.substances.includes(s)}
                                onChange={() => toggleSubstance(s)}
                            />{' '}
                            {s}
                        </label>
                    ))}
                    <div className="relative">
                        <select
                            className={`${inputBase} pr-12`}
                            value={form.lastUse}
                            onChange={e => setForm({ ...form, lastUse: e.target.value })}
                        >
                            <option value="">Last use</option>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="2-3">2-3 days ago</option>
                            <option value="4-7">4-7 days ago</option>
                        </select>
                        <FieldCheck ok={!!(form.lastUse || '').trim()} />
                    </div>

                    <div className="relative">
                        <select
                            className={`${inputBase} pr-12`}
                            value={form.frequency}
                            onChange={e => setForm({ ...form, frequency: e.target.value })}
                        >
                            <option value="">Frequency</option>
                            <option value="daily">Daily</option>
                            <option value="3-5">3-5 days/week</option>
                            <option value="1-2">1-2 days/week</option>
                        </select>
                        <FieldCheck ok={!!(form.frequency || '').trim()} />
                    </div>
                    {/* Treatment History */}
                    <div className="mt-4 space-y-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm max-w-2xl mx-auto">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Treatment history
                        </h2>

                        {/* Have you been to treatment before? */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-800">
                                Have you been to treatment before?
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <ChoiceButton
                                    isSelected={form.priorTreatment === 'yes'}
                                    onClick={() =>
                                        setForm(prev => ({
                                            ...prev,
                                            priorTreatment: 'yes',
                                        }))
                                    }
                                >
                                    Yes
                                </ChoiceButton>
                                <ChoiceButton
                                    isSelected={form.priorTreatment === 'no'}
                                    onClick={() =>
                                        setForm(prev => ({
                                            ...prev,
                                            priorTreatment: 'no',
                                            // clear dependent fields if they had values
                                            treatmentLastWhen: '',
                                            treatmentLastDuration: '',
                                            treatmentPHPCompleted: '',
                                            treatmentIOPCompleted: '',
                                            treatmentLastYear: '',
                                            treatmentFacility: '',
                                        }))
                                    }
                                >
                                    No
                                </ChoiceButton>
                            </div>
                        </div>

                        {form.priorTreatment === 'yes' && (
                            <div className="space-y-6">
                                {/* When were you last in treatment? */}
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-800">
                                        When were you last in treatment?
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <ChoiceButton
                                            isSelected={form.treatmentLastWhen === '0-12 months'}
                                            onClick={() =>
                                                setForm(prev => ({ ...prev, treatmentLastWhen: '0-12 months' }))
                                            }
                                        >
                                            0–12 months ago
                                        </ChoiceButton>
                                        <ChoiceButton
                                            isSelected={form.treatmentLastWhen === '1-5 years'}
                                            onClick={() =>
                                                setForm(prev => ({ ...prev, treatmentLastWhen: '1-5 years' }))
                                            }
                                        >
                                            Over 1 year ago
                                        </ChoiceButton>
                                        <ChoiceButton
                                            isSelected={form.treatmentLastWhen === '5+ years'}
                                            onClick={() =>
                                                setForm(prev => ({ ...prev, treatmentLastWhen: '5+ years' }))
                                            }
                                        >
                                            5 or more years ago
                                        </ChoiceButton>
                                    </div>
                                </div>

                                {/* How long were you in treatment? */}
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-800">
                                        How long were you in treatment?
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <ChoiceButton
                                            isSelected={form.treatmentLastDuration === '0-7 days'}
                                            onClick={() =>
                                                setForm(prev => ({ ...prev, treatmentLastDuration: '0-7 days' }))
                                            }
                                        >
                                            0–7 days
                                        </ChoiceButton>
                                        <ChoiceButton
                                            isSelected={form.treatmentLastDuration === '7-30 days'}
                                            onClick={() =>
                                                setForm(prev => ({
                                                    ...prev,
                                                    treatmentLastDuration: '7-30 days',
                                                }))
                                            }
                                        >
                                            7–30 days
                                        </ChoiceButton>
                                        <ChoiceButton
                                            isSelected={form.treatmentLastDuration === '30+ days'}
                                            onClick={() =>
                                                setForm(prev => ({ ...prev, treatmentLastDuration: '30+ days' }))
                                            }
                                        >
                                            30 days or more
                                        </ChoiceButton>
                                    </div>
                                </div>

                                {/* Extra details if 30+ days */}
                                {form.treatmentLastDuration === '30+ days' && (
                                    <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                                        <p className="text-sm font-medium text-gray-800">
                                            Tell us a bit more about that treatment:
                                        </p>

                                        {/* PHP / IOP */}
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Programs completed
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <ChoiceButton
                                                    isSelected={form.treatmentPHPCompleted === 'yes'}
                                                    onClick={() =>
                                                        setForm(prev => ({ ...prev, treatmentPHPCompleted: 'yes' }))
                                                    }
                                                >
                                                    Completed PHP
                                                </ChoiceButton>
                                                <ChoiceButton
                                                    isSelected={form.treatmentPHPCompleted === 'no'}
                                                    onClick={() =>
                                                        setForm(prev => ({ ...prev, treatmentPHPCompleted: 'no' }))
                                                    }
                                                >
                                                    Didn’t complete PHP
                                                </ChoiceButton>

                                                <ChoiceButton
                                                    isSelected={form.treatmentIOPCompleted === 'yes'}
                                                    onClick={() =>
                                                        setForm(prev => ({ ...prev, treatmentIOPCompleted: 'yes' }))
                                                    }
                                                >
                                                    Completed IOP
                                                </ChoiceButton>
                                                <ChoiceButton
                                                    isSelected={form.treatmentIOPCompleted === 'no'}
                                                    onClick={() =>
                                                        setForm(prev => ({ ...prev, treatmentIOPCompleted: 'no' }))
                                                    }
                                                >
                                                    Didn’t complete IOP
                                                </ChoiceButton>
                                            </div>
                                        </div>

                                        {/* Year and facility */}
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    What year was that? (YYYY)
                                                </label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={4}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    placeholder="2020"
                                                    value={form.treatmentLastYear}
                                                    onChange={e =>
                                                        setForm(prev => ({
                                                            ...prev,
                                                            treatmentLastYear: e.target.value,
                                                        }))
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    Where was that treatment?
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                    placeholder="Facility name or city"
                                                    value={form.treatmentFacility}
                                                    onChange={e =>
                                                        setForm(prev => ({
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
                    {/* Patient summary / review */}
                    <div className="mt-6 hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Review your answers
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Please double-check that this looks right before you continue.
                        </p>

                        <dl className="mt-4 space-y-4 text-sm">
                            {/* Basic info */}
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <dt className="font-medium text-gray-800">Name</dt>
                                    <dd className="text-gray-700">
                                        {[form.firstName, form.lastName].filter(Boolean).join(' ') || 'Not provided'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-800">Date of birth</dt>
                                    <dd className="text-gray-700">
                                        {form.dob || 'Not provided'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-800">Phone</dt>
                                    <dd className="text-gray-700">
                                        {form.phone || 'Not provided'}
                                    </dd>
                                </div>
                            </div>

                            {/* Housing / location */}
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <dt className="font-medium text-gray-800">Current location</dt>
                                    <dd className="text-gray-700">
                                        {form.currentLocation || 'Not provided'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-800">Where you slept last night</dt>
                                    <dd className="text-gray-700">
                                        {form.sleptLastNight || 'Not provided'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-800">Currently homeless</dt>
                                    <dd className="text-gray-700">
                                        {form.isCurrentlyHomeless || 'Not provided'}
                                    </dd>
                                </div>
                            </div>

                            {/* Substance & treatment snapshot */}
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <dt className="font-medium text-gray-800">Substances (last 30 days)</dt>
                                    <dd className="text-gray-700">
                                        {form.substances && form.substances.length > 0
                                            ? form.substances.join(', ')
                                            : 'Not provided'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-800">Last use</dt>
                                    <dd className="text-gray-700">
                                        {form.lastUse || 'Not provided'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-800">Frequency</dt>
                                    <dd className="text-gray-700">
                                        {form.frequency || 'Not provided'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-800">Prior treatment</dt>
                                    <dd className="text-gray-700">
                                        {form.priorTreatment === 'yes'
                                            ? 'Yes'
                                            : form.priorTreatment === 'no'
                                                ? 'No'
                                                : 'Not provided'}
                                    </dd>
                                </div>
                            </div>
                        </dl>

                        <p className="mt-3 text-xs text-gray-500">
                            If something doesn’t look right, you can use the Back button to update your answers.
                        </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                        <button
                            type="button"
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            onClick={() => setStep(3)}
                        >
                            Back
                        </button>

                        <button
                            type="button"
                            className="rounded-md bg-black text-white px-4 py-2 text-sm font-medium"
                            onClick={() => setStep(5)}
                        >
                            Review &amp; confirm
                        </button>
                    </div>
                </div>
            )
            }

            {step === 5 && (
                <div className="space-y-6">
                    {/* Summary card */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm max-w-2xl mx-auto">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Review your answers
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Please double-check that this looks right before you continue.
                        </p>

                        <dl className="mt-4 space-y-4 text-sm">
                            {/* Basic info */}
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <dt className="font-medium text-gray-800">Name</dt>
                                    <dd className="text-gray-700">
                                        {[form.firstName, form.lastName].filter(Boolean).join(' ') || 'Not provided'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-800">Date of birth</dt>
                                    <dd className="text-gray-700">
                                        {form.dob || 'Not provided'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-800">Phone</dt>
                                    <dd className="text-gray-700">
                                        {form.phone || 'Not provided'}
                                    </dd>
                                </div>
                            </div>

                            {/* Housing / location */}
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <dt className="font-medium text-gray-800">Current location</dt>
                                    <dd className="text-gray-700">
                                        {form.currentLocation || 'Not provided'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-800">Where you slept last night</dt>
                                    <dd className="text-gray-700">
                                        {form.sleptLastNight || 'Not provided'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-800">Currently homeless</dt>
                                    <dd className="text-gray-700">
                                        {form.isCurrentlyHomeless || 'Not provided'}
                                    </dd>
                                </div>
                            </div>

                            {/* Substance & treatment snapshot */}
                            <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                    <dt className="font-medium text-gray-800">Substances (last 30 days)</dt>
                                    <dd className="text-gray-700">
                                        {form.substances && form.substances.length > 0
                                            ? form.substances.join(', ')
                                            : 'Not provided'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-800">Last use</dt>
                                    <dd className="text-gray-700">
                                        {form.lastUse || 'Not provided'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-800">Frequency</dt>
                                    <dd className="text-gray-700">
                                        {form.frequency || 'Not provided'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-800">Prior treatment</dt>
                                    <dd className="text-gray-700">
                                        {form.priorTreatment === 'yes'
                                            ? 'Yes'
                                            : form.priorTreatment === 'no'
                                                ? 'No'
                                                : 'Not provided'}
                                    </dd>
                                </div>
                            </div>
                        </dl>

                        <p className="mt-3 text-xs text-gray-500">
                            If something doesn’t look right, you can use the Back button below to go back and update your answers.
                        </p>
                    </div>

                    {/* Initials input */}
                    <div className="max-w-sm mx-auto">
                        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Please type your initials to confirm this information is accurate
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                className={`${inputBase} pr-12`}
                                maxLength={4}
                                value={form.initials}
                                onChange={e =>
                                    setForm(prev => ({ ...prev, initials: e.target.value.toUpperCase() }))
                                }
                            />
                            <FieldCheck ok={!!(form.initials || '').trim()} />
                        </div>
                    </div>

                    {/* Back + Get Recommendation */}
                    <div className="mt-6 flex items-center justify-between max-w-2xl mx-auto">
                        <button
                            type="button"
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            onClick={() => setStep(4)}
                        >
                            Back
                        </button>

                        <button
                            type="button"
                            disabled={!form.initials.trim() || loading}
                            className="rounded-md bg-black text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
                            onClick={handleSubmit}
                        >
                            {loading ? 'Submitting…' : 'Get Recommendation'}
                        </button>
                    </div>
                </div>
            )}
            {
                step === 6 && result && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Summary & Recommendation</h2>

                        <div className="border p-4 rounded-xl space-y-2 bg-white shadow-sm">
                            <h3 className="text-lg font-semibold">Your Information</h3>

                            <dl className="space-y-2 text-sm">
                                <div>
                                    <dt className="font-medium text-gray-700">Name</dt>
                                    <dd>{form.firstName} {form.lastName}</dd>
                                </div>

                                <div>
                                    <dt className="font-medium text-gray-700">Date of Birth</dt>
                                    <dd>{form.dob}</dd>
                                </div>

                                <div>
                                    <dt className="font-medium text-gray-700">Substances Used (Last 30 Days)</dt>
                                    <dd>{form.substances.join(", ")}</dd>
                                </div>

                                <div>
                                    <dt className="font-medium text-gray-700">Last Use</dt>
                                    <dd>{form.lastUse}</dd>
                                </div>

                                <div>
                                    <dt className="font-medium text-gray-700">Use Frequency</dt>
                                    <dd>{form.frequency}</dd>
                                </div>

                                <div>
                                    <dt className="font-medium text-gray-700">Prior Treatment</dt>
                                    <dd>{form.priorTreatment === 'yes' ? 'Yes' : 'No'}</dd>
                                </div>

                                {form.priorTreatment === 'yes' && (
                                    <>
                                        <div>
                                            <dt className="font-medium text-gray-700">Last Treatment Duration</dt>
                                            <dd>{form.treatmentLastDuration}</dd>
                                        </div>

                                        <div>
                                            <dt className="font-medium text-gray-700">Last Treatment Year</dt>
                                            <dd>{form.treatmentLastYear}</dd>
                                        </div>

                                        <div>
                                            <dt className="font-medium text-gray-700">Treatment Facility</dt>
                                            <dd>{form.treatmentFacility}</dd>
                                        </div>
                                    </>
                                )}
                            </dl>
                        </div>

                        {/* Recommendation Section */}
                        <div className="border p-4 rounded-xl bg-indigo-50 shadow-sm">
                            <h3 className="text-lg font-semibold text-indigo-800">Recommendation</h3>

                            <p>
                                <strong>Withdrawal Risk:</strong> {result.withdrawalRisk}
                            </p>
                            <p>
                                <strong>Relapse Risk:</strong> {result.relapseRisk}
                            </p>
                            <p>
                                <strong>Co-Occurring Needs:</strong> {result.coOccurring}
                            </p>
                            <p>
                                <strong>Support Level:</strong> {result.supportLevel}
                            </p>
                            <p className="font-semibold text-indigo-900">
                                Recommended Level of Care: {result.recommendedLevelOfCare}
                            </p>
                        </div>

                        {/* Initials for consent */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Enter your initials to confirm accuracy:</label>
                            <input
                                type="text"
                                className="w-full border rounded-md p-2"
                                maxLength={4}
                                value={form.initials}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, initials: e.target.value.toUpperCase() }))
                                }
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="button"
                            disabled={!form.initials || loading}
                            className="bg-black text-white px-4 py-2 rounded-md w-full disabled:opacity-50"
                            onClick={handleSubmit}
                        >
                            {loading ? 'Submitting...' : 'Submit Intake'}
                        </button>
                    </div>
                )
            }
        </div >
    );
}