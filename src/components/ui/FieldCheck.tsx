// NRIN/src/components/ui/FieldCheck.tsx

import CheckIcon from "./CheckIcon";

type FieldCheckProps = {
  ok: boolean;
};

export default function FieldCheck({ ok }: FieldCheckProps) {
  if (!ok) return null;

  return (
    <span
      className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white shadow-sm"
      aria-hidden="true"
    >
      <CheckIcon className="h-4 w-4" />
    </span>
  );
}