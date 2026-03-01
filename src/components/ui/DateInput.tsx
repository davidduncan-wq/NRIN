// NRIN/src/components/ui/DateInput.tsx
"use client";

import * as React from "react";
import { inputBase } from "./InputBase";

export type DateInputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Canonical date input.
 * Optimized for MM/DD/YYYY typed input.
 * Caller handles formatting (e.g., formatDobMMDDYYYY).
 */
export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        placeholder={props.placeholder ?? "MM/DD/YYYY"}
        className={`${inputBase} ${className}`.trim()}
        {...props}
      />
    );
  }
);

DateInput.displayName = "DateInput";

export default DateInput;