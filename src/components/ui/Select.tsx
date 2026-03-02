// NRIN/src/components/ui/Select.tsx
"use client";

import * as React from "react";
import { inputBase } from "./InputBase";

export type SelectProps =
  React.SelectHTMLAttributes<HTMLSelectElement>;

/**
 * Canonical select component.
 * Wraps a native <select> and applies the shared inputBase styles.
 */
export const Select = React.forwardRef<
  HTMLSelectElement,
  SelectProps
>(({ className = "", children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`${inputBase} ${className}`.trim()}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;