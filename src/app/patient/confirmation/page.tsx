export default function ConfirmationPage() {
    return (
        <main className="min-h-screen bg-white px-6 py-12">
            <div className="max-w-xl mx-auto text-center space-y-8">

                <div className="space-y-3">
                    <h1 className="text-2xl font-semibold text-stone-900">
                        You’re in motion.
                    </h1>

                    <p className="text-stone-600">
                        Your referral has been sent to the admissions team.
                    </p>
                </div>

                <div className="rounded-xl border border-stone-200 p-6 space-y-3">
                    <p className="text-sm text-stone-500">
                        Next step
                    </p>

                    <p className="text-lg font-semibold text-stone-900">
                        Text your location to
                    </p>

                    <p className="text-2xl font-semibold text-black">
                        (310) 740-4837
                    </p>

                    <p className="text-sm text-stone-500">
                        This helps us coordinate your arrival, timing, and intake.
                    </p>
                </div>

                <div className="text-left space-y-2 text-sm text-stone-500">
                    <p>✓ Intake received</p>
                    <p>✓ Facility selected</p>
                    <p>✓ Referral sent</p>
                    <p>• Admission in progress</p>
                </div>

            </div>
        </main>
    );
}
