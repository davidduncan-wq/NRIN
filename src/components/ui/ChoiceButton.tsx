// NRIN/src/components/ui/ChoiceButton.tsx

import type { ReactNode } from "react";
import CheckIcon from "./CheckIcon";

type ChoiceButtonProps = {
  isSelected: boolean;
  onClick: () => void;
  children: ReactNode;
};

export default function ChoiceButton({
  isSelected,
  onClick,
  children,
}: ChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative w-full sm:w-auto rounded-xl border px-4 py-3 text-sm transition-all duration-150",
        isSelected
          ? "border-gray-900 bg-gray-900 text-white shadow-md"
          : "border-gray-200 bg-white text-gray-900 hover:border-gray-900 hover:shadow-sm",
        "flex items-center justify-between gap-3",
      ].join(" ")}
    >
      <span className="capitalize">{children}</span>
      {isSelected && (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
          <CheckIcon className="h-4 w-4" />
        </span>
      )}
    </button>
  );
}