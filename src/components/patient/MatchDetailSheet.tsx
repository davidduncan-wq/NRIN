"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { MatchViewModel } from "@/lib/matching/buildMatchViewModel"

export default function MatchDetailSheet({
  open,
  onClose,
  match,
}: {
  open: boolean
  onClose: () => void
  match: MatchViewModel | null
}) {
  if (!match) return null

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* PANEL */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white p-6 shadow-2xl"
          >
            <div className="max-w-3xl mx-auto">

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {match.title}
                </h2>

                <button
                  onClick={onClose}
                  className="text-sm text-neutral-500"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {match.reasons.map((reason) => (
                  <div
                    key={reason}
                    className="rounded-xl border border-neutral-200 px-4 py-3 text-sm"
                  >
                    {reason}
                  </div>
                ))}
              </div>

              {match.cautions.length > 0 && (
                <div className="mt-6">
                  <div className="text-xs uppercase text-neutral-500 mb-2">
                    Cautions
                  </div>

                  {match.cautions.map((caution) => (
                    <div
                      key={caution}
                      className="text-sm text-neutral-600 mb-1"
                    >
                      {caution}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <button className="w-full rounded-full bg-neutral-950 px-5 py-4 text-sm text-white">
                  Choose this facility
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}