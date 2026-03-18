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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[88vh] rounded-t-3xl bg-white shadow-2xl"
          >
            <div className="mx-auto flex max-w-3xl max-h-[88vh] flex-col">
              <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-neutral-200 bg-white px-6 py-4">
                <h2 className="pr-4 text-xl font-semibold">{match.title}</h2>

                <button
                  onClick={onClose}
                  className="shrink-0 rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700"
                >
                  Close
                </button>
              </div>

              <div className="overflow-y-auto px-6 py-4">
                <div className="space-y-3">
                  {match.reasons.map((reason, reasonIndex) => (
                    <div
                      key={`${match.id}-reason-${reasonIndex}-${reason.label}`}
                      className="rounded-xl border border-neutral-200 px-4 py-3"
                    >
                      <div className="text-sm font-medium text-neutral-900">
                        {reason.label}
                      </div>

                      {reason.snippet && (
                        <div className="mt-2 text-sm leading-6 text-neutral-600">
                          {reason.snippet}
                        </div>
                      )}

                      {(reason.sourceLabel || reason.sourceUrl) && (
                        <div className="mt-3 text-xs text-neutral-500">
                          {reason.sourceUrl ? (
                            <a
                              href={reason.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="underline underline-offset-2"
                            >
                              {reason.sourceLabel ?? "View source"}
                            </a>
                          ) : (
                            reason.sourceLabel
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {match.cautions.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-2 text-xs uppercase text-neutral-500">
                      Cautions
                    </div>

                    {match.cautions.map((caution) => (
                      <div
                        key={caution}
                        className="mb-1 text-sm text-neutral-600"
                      >
                        {caution}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 pb-4">
                  <button className="w-full rounded-full bg-neutral-950 px-5 py-4 text-sm text-white">
                    Choose this facility
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}