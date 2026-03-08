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
        "inline-flex min-h-12 w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30";
    const selectedClasses =
        "border-blue-500 bg-blue-50 text-blue-900 shadow-sm";
    const unselectedClasses =
        "border-gray-200/80 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50";
    const disabledClasses = disabled ? " cursor-not-allowed opacity-60" : "";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${active ? selectedClasses : unselectedClasses}${disabledClasses} ${className}`}
            {...rest}
        >
            <span className="flex-1 text-left leading-5">{children}</span>

            <span
                className={`ml-3 flex items-center transition-opacity ${
                    active ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={!active}
            >
                <CheckIcon className="h-4.5 w-4.5 text-blue-600" />
            </span>
        </button>
    );
}