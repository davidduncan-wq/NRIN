// NRIN/src/components/ui/CheckIcon.tsx
"use client";

import { Check } from "lucide-react";

type CheckIconProps = {
  className?: string;
};

/**
 * Thin wrapper around lucide-react's Check icon.
 * ClassName is fully controlled by the caller.
 */
export default function CheckIcon({ className = "" }: CheckIconProps) {
  return <Check className={className} />;
}