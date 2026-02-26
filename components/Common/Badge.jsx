import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Common Badge Component
 * Aligned with Figma / StyleGuide Variables
 * 
 * @param {string} label - The text to display
 * @param {'S' | 'M'} size - Size variant (default: 'M')
 * @param {'neutral' | 'warning' | 'info' | 'success' | 'danger' | 'dark'} variant - Color variant (default: 'neutral')
 * @param {boolean} interactive - Whether the badge has hover/interaction styles (default: false)
 * @param {React.ReactNode} icon - Optional icon to display before/after text
 * @param {string} className - Additional classes
 * @param {function} onClick - Click handler (if interactive)
 */
export default function Badge({
    label,
    size = 'M',
    variant = 'neutral',
    interactive = false,
    icon,
    className,
    onClick,
    ...props
}) {
    // Base styles
    // Matched to btn-outline style (Radius 8px)
    // font-weight is handled by size variants now (Body/sm/medium is 500)
    const baseStyles = "inline-flex items-center justify-center rounded-[8px] transition-colors duration-200 select-none whitespace-nowrap";

    // Size variants
    // S: min-w-48px (auto), Height 28px (Matched to btn-outline), Padding 4px 12px (px-3)
    // Uses CSS Variables for Typography: Body/sm/medium
    // M: Height 32px, Padding 4px 8px, Gap 0px
    const sizeStyles = {
        XS: "w-auto h-auto min-h-[22px] px-2 py-[2px] gap-[4px] font-['Pretendard'] !text-[12px] !leading-[1.4] !font-bold !tracking-[-0.01em] !rounded-[4px]",
        S: "w-auto min-w-[48px] h-[28px] px-2 py-1 gap-[4px] font-['Pretendard'] !text-[12px] !leading-[1.5] !font-medium !tracking-[-0.02em]",
        M: "h-[32px] px-2 py-1 gap-0 text-[14px] font-medium"
    };

    // Color/State variants using CSS Variables from styleguide.css
    // Using arbitrary values [color:var(--name)] for precise mapping including typos in variable names (Sublte)
    const variantStyles = {
        neutral: "bg-[var(--neutral_100)] text-[var(--neutral_800)]",
        warning: "bg-[var(--Status_03-Subtle)] text-[var(--Status_03)]", // Orange
        info: "bg-[var(--Status_07-Subtle)] text-[var(--Status_07)]", // Blue
        success: "bg-[var(--Status_06-Subtle)] text-[var(--Status_06)]", // Teal/Mint
        danger: "bg-[var(--Status_10-Subtle)] text-[var(--red_600)]", // Pink/Red
        dark: "bg-[var(--neutral_800)] text-[var(--white)]"
    };

    // Interactive styles
    const interactiveStyles = interactive
        ? "cursor-pointer hover:opacity-80 active:scale-95"
        : "cursor-default";

    return (
        <span
            className={twMerge(
                baseStyles,
                sizeStyles[size],
                variantStyles[variant],
                interactiveStyles,
                className
            )}
            onClick={interactive ? onClick : undefined}
            {...props}
        >
            {icon && <span className="flex items-center">{icon}</span>}
            <span className="truncate">{label}</span>
        </span>
    );
}
