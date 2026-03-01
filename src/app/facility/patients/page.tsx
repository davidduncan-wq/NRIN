// src/app/facility/patients/page.tsx

export default function FacilityPatientsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Patients at Your Facility
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            This view will surface patients who have been matched and admitted
            through NRIN.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          <p>
            Patient rosters and admission timelines will be wired here next:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Current census (by level of care, program, etc.)</li>
            <li>Recently admitted / recently discharged patients</li>
            <li>Basic read-only intake fields (no PHI overkill)</li>
            <li>Links back to original intake / referral details</li>
          </ul>
        </section>
      </main>
    </div>
  );
}