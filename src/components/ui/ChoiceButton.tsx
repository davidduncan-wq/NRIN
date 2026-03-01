// NRIN/src/components/ui/ChoiceButton.tsx
"use client";

import type { ReactNode } from "react";
import CheckIcon from "./CheckIcon";

type ChoiceButtonProps = {
  isSelected: boolean;
  onClick: () => void;
  children: ReactNode;
};

/**
 * Canonical choice button for multi-option questions.
 * Shows a blue CheckIcon when selected.
 */
export default function ChoiceButton({
  isSelected,
  onClick,
  children,
}: ChoiceButtonProps) {
  const base =
    "inline-flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40";
  const selected =
    "border-blue-600 bg-blue-50 text-blue-900";
  const unselected =
    "border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${isSelected ? selected : unselected}`}
    >
      <span className="flex-1 text-left">{children}</span>
      {isSelected && (
        <span className="ml-3 flex items-center">
          <CheckIcon className="h-5 w-5 text-blue-600" />
        </span>
      )}
    </button>
  );
}