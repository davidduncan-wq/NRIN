"use client";

import { useMemo, useState } from "react";
import type { TreatmentCenterRow } from "@/app/facility/dashboard/page";

type Props = {
  center: TreatmentCenterRow | null;
};

type OpsStatus = "accepting_now" | "accepting_later" | "not_accepting";

export default function FacilityOperationsPanel({ center }: Props) {
  const [status, setStatus] = useState<OpsStatus>("accepting_now");
  const [laterDate, setLaterDate] = useState("");
  const [notes, setNotes] = useState("");

  const selectedLabel = useMemo(() => {
    switch (status) {
      case "accepting_later":
        return laterDate ? `Accepting later: ${laterDate}` : "Accepting later";
      case "not_accepting":
        return "Not accepting";
      case "accepting_now":
      default:
        return "Accepting now";
    }
  }, [laterDate, status]);

  if (!center) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
        Select a facility to manage operational status.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
          Operational Status
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          {center.name || "Untitled facility"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          This panel will drive live admissions availability and eventually feed recommendation
          ranking.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">Admissions availability</div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <button
            type="button"
            onClick={() => setStatus("accepting_now")}
            className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
              status === "accepting_now"
                ? "border-sky-300 bg-sky-50 text-sky-900"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Accepting now
          </button>

          <button
            type="button"
            onClick={() => setStatus("accepting_later")}
            className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
              status === "accepting_later"
                ? "border-sky-300 bg-sky-50 text-sky-900"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Accepting later
          </button>

          <button
            type="button"
            onClick={() => setStatus("not_accepting")}
            className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
              status === "not_accepting"
                ? "border-sky-300 bg-sky-50 text-sky-900"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Not accepting
          </button>
        </div>

        {status === "accepting_later" && (
          <div className="mt-4 max-w-sm">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Expected date
            </label>
            <input
              type="date"
              value={laterDate}
              onChange={(e) => setLaterDate(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Current selection: <span className="font-medium">{selectedLabel}</span>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">Operational notes</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Example: residential full this week, PHP openings Monday, detox callback required"
          className="mt-4 min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        />
      </div>
    </div>
  );
}