// NRIN/src/components/ui/PhoneInput.tsx
"use client";

import * as React from "react";
import { inputBase } from "./InputBase";

export type PhoneInputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Canonical phone input.
 * Uses type="tel" and the shared inputBase styles.
 * Caller is responsible for any masking/formatting (e.g., formatPhoneInput).
 */
export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="tel"
        inputMode="tel"
        className={`${inputBase} ${className}`}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;