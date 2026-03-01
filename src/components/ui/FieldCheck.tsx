// NRIN/src/components/ui/FieldCheck.tsx
"use client";

import { Check } from "lucide-react";

type FieldCheckProps = {
  ok: boolean;
};

/**
 * Small inline check indicator.
 * - When ok = false → renders nothing (caller can choose where to show it).
 * - When ok = true  → shows a small green circular check, inline with content.
 */
export default function FieldCheck({ ok }: FieldCheckProps) {
  if (!ok) return null;

  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white shadow-sm">
      <Check className="h-3 w-3" />
    </span>
  );
}