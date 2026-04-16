export default function PatientReturnPage() {
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
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Mobile phone number
              </label>
              <input
                type="tel"
                placeholder="(555) 555-5555"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Text me a code
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
