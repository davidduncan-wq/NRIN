import Link from "next/link";

export default function PatientEntryPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-xl text-center space-y-6">
        <h1 className="text-3xl font-semibold text-gray-900">
          Let’s get you started
        </h1>

        <p className="text-base text-gray-600">
          Continue where you left off, or begin a new intake.
        </p>

        <div className="mt-6 space-y-4">
          <Link
            href="/patient"
            className="block w-full rounded-xl bg-blue-600 px-5 py-4 text-white font-medium hover:bg-blue-700 transition"
          >
            Start a new intake
          </Link>

          <Link
            href="/patient/return"
            className="block w-full rounded-xl border border-gray-200 bg-white px-5 py-4 text-gray-900 font-medium hover:border-gray-300 transition"
          >
            Return to my intake
          </Link>
        </div>
      </div>
    </main>
  );
}
