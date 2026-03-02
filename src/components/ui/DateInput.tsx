// NRIN/src/components/ui/DateInput.tsx
"use client";

import * as React from "react";
import { inputBase } from "./InputBase";

export type DateInputProps =
  React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Canonical date input.
 * Optimized for MM/DD/YYYY typed input.
 * Caller handles formatting (e.g., formatDobMMDDYYYY).
 */
export const DateInput = React.forwardRef<
  HTMLInputElement,
  DateInputProps
>(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="text"
      className={`${inputBase} ${className}`.trim()}
      inputMode="numeric"
      {...props}
    />
  );
});

DateInput.displayName = "DateInput";

export default DateInput;