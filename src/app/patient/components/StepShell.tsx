"use client";

import * as React from "react";

type StepShellProps = {
  children: React.ReactNode;
  // kept for compatibility; only headerExtra is rendered for now
  title?: string;
  subtitle?: string;
  step?: number;
  totalSteps?: number;
  headerExtra?: React.ReactNode;
};

export function StepShell({
  children,
  headerExtra,
}: StepShellProps) {
  return (
    <div className="space-y-4">
      {headerExtra ? (
        <div>{headerExtra}</div>
      ) : null}
      <div className="space-y-6">{children}</div>
    </div>
  );
}