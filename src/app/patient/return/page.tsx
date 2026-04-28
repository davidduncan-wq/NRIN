"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function formatPhoneInput(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 10);

  const parts = [];

  if (digits.length > 0) {
    parts.push("(" + digits.slice(0, 3));
  }

  if (digits.length >= 4) {
    parts[0] += ")";
    parts.push(" " + digits.slice(3, 6));
  }

  if (digits.length >= 7) {
    parts[1] += "-";
    parts.push(digits.slice(6, 10));
  }

  return parts.join("");
}


type SendCodeResponse = {
  ok?: boolean;
  testMode?: boolean;
  error?: string;
};

type CheckCodeResponse = {
  ok?: boolean;
  redirectTo?: string;
  error?: string;
};

export default function PatientReturnPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function sendCode() {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/patient/return/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = (await res.json()) as SendCodeResponse;

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Unable to send a code right now.");
        return;
      }

      setCodeSent(true);
      setTestMode(Boolean(data.testMode));
      setMessage(
        data.testMode
          ? "Test mode is on. Use code 111111."
          : "We sent a secure code to your phone."
      );
    } catch (err) {
      console.error("send return code error:", err);
      setError("Unable to send a code right now.");
    } finally {
      setLoading(false);
    }
  }

  async function checkCode() {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/patient/return/check-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });

      const data = (await res.json()) as CheckCodeResponse;

      if (!res.ok || !data.ok || !data.redirectTo) {
        setError(data.error ?? "Unable to verify that code right now.");
        return;
      }

      router.push(data.redirectTo);
    } catch (err) {
      console.error("check return code error:", err);
      setError("Unable to verify that code right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900">
            Return to my intake
          </h1>
          <p className="mt-3 text-base text-gray-600">
            We’ll send a secure code so you can continue where you left off.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Mobile phone number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                placeholder="(555) 555-5555"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {!codeSent ? (
              <button
                type="button"
                onClick={sendCode}
                disabled={loading || phone.trim().length === 0}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending..." : "Text me a code"}
              </button>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Verification code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={testMode ? "111111" : "Enter code"}
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={checkCode}
                  disabled={loading || code.trim().length === 0}
                  className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Checking..." : "Continue my intake"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCodeSent(false);
                    setCode("");
                    setMessage(null);
                    setError(null);
                  }}
                  className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-900 transition hover:border-gray-300"
                >
                  Use a different phone number
                </button>
              </>
            )}

            {message ? (
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </main>
  );
}
