'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type Step = 1 | 2 | 3;

type FormState = {
  // Step 1
  firstName: string;
  lastName: string;
  phone: string;
  dob: string; // optional, keep as string for MVP

  // Step 2
  housingStatus: string; // e.g. 'stable' | 'unstable' | 'homeless' | ''
  homelessLastNight: string; // 'yes' | 'no' | ''
  hasMailingAddress: string; // 'yes' | 'no' | ''
  mailingAddressLine1: string;
  mailingAddressLine2: string;
  mailingCity: string;
  mailingState: string;
  mailingPostalCode: string;

  // Step 3
  programInterest: string; // e.g. 'detox' | 'residential' | 'iop' | ''
  notes: string;
};

const STORAGE_KEY = 'nrin_patient_intake_v1';

const defaultState: FormState = {
  firstName: '',
  lastName: '',
  phone: '',
  dob: '',

  housingStatus: '',
  homelessLastNight: '',
  hasMailingAddress: '',
  mailingAddressLine1: '',
  mailingAddressLine2: '',
  mailingCity: '',
  mailingState: '',
  mailingPostalCode: '',

  programInterest: '',
  notes: '',
};

function isValidPhoneLoose(phone: string) {
  // MVP-friendly: at least 10 digits
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
}

export default function PatientPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [patientId, setPatientId] = useState<string>('');

  const [form, setForm] = useState<FormState>(defaultState);

  const facilityId = process.env.NEXT_PUBLIC_FACILITY_ID;
console.log('ENV CHECK', {
  hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  hasFacilityId: !!process.env.NEXT_PUBLIC_FACILITY_ID,
});
  // Load draft from localStorage so refresh doesn’t wipe progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        step?: Step;
        patientId?: string;
        form?: FormState;
      };
      if (parsed.form) setForm({ ...defaultState, ...parsed.form });
      if (parsed.patientId) setPatientId(parsed.patientId);
      if (parsed.step) setStep(parsed.step);
    } catch {
      // ignore
    }
  }, []);

  // Persist draft
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ step, patientId, form })
      );
    } catch {
      // ignore
    }
  }, [step, patientId, form]);

  const canContinueStep1 = useMemo(() => {
    return (
      form.firstName.trim().length > 0 &&
      form.lastName.trim().length > 0 &&
      isValidPhoneLoose(form.phone)
    );
  }, [form.firstName, form.lastName, form.phone]);

  const canContinueStep2 = useMemo(() => {
    // Minimal: housingStatus required; if hasMailingAddress=yes then line1/city/state/zip required
    if (!form.housingStatus) return false;

    if (form.hasMailingAddress === 'yes') {
      return (
        form.mailingAddressLine1.trim().length > 0 &&
        form.mailingCity.trim().length > 0 &&
        form.mailingState.trim().length > 0 &&
        form.mailingPostalCode.trim().length > 0
      );
    }

    return true;
  }, [
    form.housingStatus,
    form.hasMailingAddress,
    form.mailingAddressLine1,
    form.mailingCity,
    form.mailingState,
    form.mailingPostalCode,
  ]);

  const canSubmitStep3 = useMemo(() => {
    return !!form.programInterest;
  }, [form.programInterest]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function saveStep1CreatePatient() {
    setError('');
    setLoading(true);
    try {
      // IMPORTANT: adjust column names here to match your `patients` table.
      // Common choices: first_name, last_name, phone, dob
      const payload: any = {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        phone: form.phone.trim(),
      };

      if (form.dob.trim()) payload.dob = form.dob.trim();

      const { data, error: insertError } = await supabase
        .from('patients')
        .insert(payload)
        .select('id')
        .single();

      if (insertError) throw insertError;
      if (!data?.id) throw new Error('Insert succeeded but no patient id returned.');

      setPatientId(data.id);
      setStep(2);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save Step 1.');
    } finally {
      setLoading(false);
    }
  }

  async function saveStep2UpdatePatient() {
    setError('');
    setLoading(true);
    try {
      if (!patientId) throw new Error('Missing patientId. Go back to Step 1.');

      // IMPORTANT: adjust column names here to match your `patients` table.
      const payload: any = {
        housing_status: form.housingStatus,
        homeless_last_night: form.homelessLastNight || null,
        has_mailing_address: form.hasMailingAddress || null,
        mailing_address_line1: form.mailingAddressLine1 || null,
        mailing_address_line2: form.mailingAddressLine2 || null,
        mailing_city: form.mailingCity || null,
        mailing_state: form.mailingState || null,
        mailing_postal_code: form.mailingPostalCode || null,
      };

      const { error: updateError } = await supabase
        .from('patients')
        .update(payload)
        .eq('id', patientId);

      if (updateError) throw updateError;

      setStep(3);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save Step 2.');
    } finally {
      setLoading(false);
    }
  }

  async function submitStep3CreateReferral() {
    setError('');
    setLoading(true);
    try {
      if (!patientId) throw new Error('Missing patientId. Go back to Step 1.');
      if (!facilityId) throw new Error('Missing NEXT_PUBLIC_FACILITY_ID.');

      // IMPORTANT: adjust column names here to match your `referrals` table.
      const payload: any = {
        patient_id: patientId,
        facility_id: facilityId,
        status: 'new',
        program_interest: form.programInterest,
        notes: form.notes || null,
      };

      const { data, error: insertError } = await supabase
        .from('referrals')
        .insert(payload)
        .select('id')
        .single();

      if (insertError) throw insertError;

      // Clear draft and go to a simple success screen (for now, we just reset + stay here)
      localStorage.removeItem(STORAGE_KEY);

      // Tiny MVP success: reset state and optionally route somewhere later
      setStep(1);
      setPatientId('');
      setForm(defaultState);

      alert(`Referral created ✅ (id: ${data?.id ?? 'unknown'})`);
      // router.push('/'); // optional later
    } catch (e: any) {
      setError(e?.message ?? 'Failed to submit Step 3.');
    } finally {
      setLoading(false);
    }
  }

  function resetDraft() {
    localStorage.removeItem(STORAGE_KEY);
    setStep(1);
    setPatientId('');
    setForm(defaultState);
    setError('');
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Patient Intake</h1>
        <p className="text-sm text-gray-600">
          Step {step} of 3 {patientId ? `• Draft patient: ${patientId}` : ''}
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="rounded-xl border bg-white p-5 shadow-sm">
        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">First name</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                placeholder="Jane"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Last name</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                placeholder="Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="(555) 555-5555"
              />
              <p className="mt-1 text-xs text-gray-500">Minimum 10 digits for now (MVP).</p>
            </div>

            <div>
              <label className="block text-sm font-medium">DOB (optional)</label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.dob}
                onChange={(e) => update('dob', e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                className="text-sm text-gray-600 hover:underline"
                onClick={resetDraft}
                type="button"
              >
                Reset draft
              </button>

              <button
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                onClick={saveStep1CreatePatient}
                disabled={!canContinueStep1 || loading}
                type="button"
              >
                {loading ? 'Saving…' : 'Continue →'}
              </button>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Housing status</label>
              <select
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.housingStatus}
                onChange={(e) => update('housingStatus', e.target.value)}
              >
                <option value="">Select…</option>
                <option value="stable">Stable</option>
                <option value="unstable">Unstable</option>
                <option value="homeless">Homeless</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Homeless last night?</label>
              <select
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.homelessLastNight}
                onChange={(e) => update('homelessLastNight', e.target.value)}
              >
                <option value="">Select…</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Do you have a mailing address?</label>
              <select
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.hasMailingAddress}
                onChange={(e) => update('hasMailingAddress', e.target.value)}
              >
                <option value="">Select…</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {form.hasMailingAddress === 'yes' ? (
              <div className="space-y-3 rounded-lg border p-3">
                <div>
                  <label className="block text-sm font-medium">Address line 1</label>
                  <input
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    value={form.mailingAddressLine1}
                    onChange={(e) => update('mailingAddressLine1', e.target.value)}
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Address line 2 (optional)</label>
                  <input
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    value={form.mailingAddressLine2}
                    onChange={(e) => update('mailingAddressLine2', e.target.value)}
                    placeholder="Apt 4"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium">City</label>
                    <input
                      className="mt-1 w-full rounded-md border px-3 py-2"
                      value={form.mailingCity}
                      onChange={(e) => update('mailingCity', e.target.value)}
                      placeholder="Indio"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">State</label>
                    <input
                      className="mt-1 w-full rounded-md border px-3 py-2"
                      value={form.mailingState}
                      onChange={(e) => update('mailingState', e.target.value)}
                      placeholder="CA"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium">Postal code</label>
                  <input
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    value={form.mailingPostalCode}
                    onChange={(e) => update('mailingPostalCode', e.target.value)}
                    placeholder="92201"
                  />
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-2">
              <button
                className="text-sm text-gray-600 hover:underline"
                onClick={() => setStep(1)}
                type="button"
                disabled={loading}
              >
                ← Back
              </button>

              <button
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                onClick={saveStep2UpdatePatient}
                disabled={!canContinueStep2 || loading}
                type="button"
              >
                {loading ? 'Saving…' : 'Continue →'}
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Program interest</label>
              <select
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.programInterest}
                onChange={(e) => update('programInterest', e.target.value)}
              >
                <option value="">Select…</option>
                <option value="detox">Detox</option>
                <option value="residential">Residential</option>
                <option value="php">PHP</option>
                <option value="iop">IOP</option>
                <option value="op">Outpatient</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Notes (optional)</label>
              <textarea
                className="mt-1 w-full rounded-md border px-3 py-2"
                rows={4}
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                placeholder="Anything the facility should know…"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                className="text-sm text-gray-600 hover:underline"
                onClick={() => setStep(2)}
                type="button"
                disabled={loading}
              >
                ← Back
              </button>

              <button
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                onClick={submitStep3CreateReferral}
                disabled={!canSubmitStep3 || loading}
                type="button"
              >
                {loading ? 'Submitting…' : 'Submit Intake ✅'}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <button
          className="hover:underline"
          type="button"
          onClick={() => router.push('/')}
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
}