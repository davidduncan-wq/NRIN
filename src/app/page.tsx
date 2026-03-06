import Link from "next/link";

type RoleCardProps = {
  href: string;
  title: string;
  description: string;
  variant?: "primary" | "secondary";
};

function RoleCard({
  href,
  title,
  description,
  variant = "secondary",
}: RoleCardProps) {
  const baseClasses =
    "block rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md";
  const variantClasses =
    variant === "primary"
      ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
      : "border-gray-200 bg-white text-gray-900 hover:border-gray-300";

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p
            className={`mt-2 text-sm leading-6 ${
              variant === "primary" ? "text-blue-50" : "text-gray-600"
            }`}
          >
            {description}
          </p>
        </div>
        <span
          className={`mt-1 text-xl ${
            variant === "primary" ? "text-blue-100" : "text-gray-400"
          }`}
          aria-hidden="true"
        >
          →
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-8 lg:px-10">
        <header className="mx-auto w-full max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
            NRIN — National Recovery Intake Network
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Who are you?
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            Start in the path that fits your role. Patients, families,
            organizations, courts, and treatment facilities can all begin here.
          </p>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm leading-6 text-amber-900">
            <strong>Need urgent help?</strong> If you are in immediate danger,
            call 911. If you are in crisis or thinking about suicide, call or
            text 988.
          </div>
        </header>

        <section className="mx-auto mt-10 grid w-full max-w-5xl gap-4 md:grid-cols-2 xl:grid-cols-3">
          <RoleCard
            href="/patient"
            title="I am a patient"
            description="Start a self-referral and answer a few questions so we can help guide you toward the right level of care."
            variant="primary"
          />

          <RoleCard
            href="/patient"
            title="I am a family member or friend"
            description="Help someone begin the intake process and explore appropriate treatment options."
          />

          <RoleCard
            href="/provider"
            title="I am a healthcare provider"
            description="Refer a patient and support a faster handoff into the right treatment setting."
          />

          <RoleCard
            href="/justice"
            title="I am a courthouse or justice agency"
            description="Support court-involved individuals with a clean referral path into treatment."
          />

          <RoleCard
            href="/org"
            title="I am a community organization or nonprofit"
            description="Help a client access treatment through a guided intake and referral workflow."
          />

          <RoleCard
            href="/facility/referrals"
            title="I am a treatment center"
            description="View and manage incoming referrals through the facility-side workflow."
          />
        </section>

        <section className="mx-auto mt-10 w-full max-w-5xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">What NRIN does</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
            NRIN is a neutral recovery intake and referral platform designed to
            help connect people to appropriate treatment options while reducing
            friction between patients, advocates, organizations, and treatment
            facilities.
          </p>
        </section>
      </div>
    </main>
  );
}