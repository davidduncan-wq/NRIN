// NRIN/src/components/ui/CheckIcon.tsx

type CheckIconProps = {
  className?: string;
};

export default function CheckIcon({ className = "" }: CheckIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16.25 5.75L8.5 13.5L4.75 9.75"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}