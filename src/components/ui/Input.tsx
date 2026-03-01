// NRIN/src/components/ui/Input.tsx
"use client";

import * as React from "react";
import { inputBase } from "./InputBase";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Canonical text input component.
 * Wraps a native <input> and applies the shared inputBase styles.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`${inputBase} ${className}`.trim()}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;