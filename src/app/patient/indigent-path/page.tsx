"use client";

export default function IndigentPathPage() {
    return (
        <main className="min-h-screen bg-white px-6 py-10">
            <div className="max-w-xl mx-auto space-y-8">
                <div className="space-y-3">
                    <p className="text-sm text-stone-500">
                        We’ve got you
                    </p>

                    <h1 className="text-xl font-semibold text-stone-900">
                        Let’s find a treatment option that works for your situation
                    </h1>

                    <p className="text-sm text-stone-600">
                        Based on what you shared, we’re going to connect you with
                        programs that offer treatment through public funding,
                        non-profit care, or state-supported options.
                    </p>
                </div>

                <div className="rounded-xl border p-4 space-y-3 bg-stone-50">
                    <p className="text-sm font-medium">
                        What happens next
                    </p>

                    <ul className="text-sm text-stone-600 space-y-1">
                        <li>• We identify programs in your area that accept public funding</li>
                        <li>• We prioritize availability and speed of placement</li>
                        <li>• We guide you through the next step directly</li>
                    </ul>
                </div>

                <div className="rounded-xl border p-4 space-y-2">
                    <p className="text-sm font-medium">
                        Immediate option
                    </p>

                    <p className="text-sm text-stone-600">
                        Text your location to:
                    </p>

                    <p className="text-lg font-semibold">
                        (310) 740-4837
                    </p>

                    <p className="text-xs text-stone-500">
                        We’ll use that to quickly find the closest available options.
                    </p>
                </div>

                <div className="text-xs text-stone-400">
                    You’re not out of options. We’ll help you take the next step.
                </div>
            </div>
        </main>
    );
}
