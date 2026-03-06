"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import CheckIcon from "./CheckIcon";

type ChoiceButtonProps = {
    isSelected?: boolean;
    selected?: boolean;
    children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

/**
 * Canonical choice button for selectable options.
 * Supports both `isSelected` and `selected` for compatibility.
 */
export default function ChoiceButton({
    isSelected,
    selected,
    onClick,
    children,
    className = "",
    disabled = false,
    type = "button",
    ...rest
}: ChoiceButtonProps) {
    const active = isSelected ?? selected ?? false;

    const base =
        "inline-flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40";
    const selectedClasses = "border-blue-600 bg-blue-50 text-blue-900";
    const unselectedClasses =
        "border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50";
    const disabledClasses = disabled ? " opacity-60 cursor-not-allowed" : "";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${active ? selectedClasses : unselectedClasses}${disabledClasses} ${className}`}
            {...rest}
        >
            <span className="flex-1 text-left">{children}</span>
            {active && (
                <span className="ml-3 flex items-center">
                    <CheckIcon className="h-5 w-5 text-blue-600" />
                </span>
            )}
        </button>
    );
}