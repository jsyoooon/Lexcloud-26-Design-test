import React from 'react';

/**
 * Toggle Switch Component
 * A robust, reusable toggle switch component.
 * 
 * @param {boolean} checked - The current state of the toggle
 * @param {function} onChange - Callback function when toggle state changes
 * @param {string} className - Additional CSS classes for the container
 * @param {boolean} disabled - Whether the toggle is disabled
 */
export default function Toggle({ checked, onChange, className = '', disabled = false }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => !disabled && onChange(!checked)}
            className={`
                relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none 
                ${checked ? 'bg-[var(--Primary)]' : 'bg-gray-200'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}
            `}
        >
            <span className="sr-only">Toggle setting</span>
            <span
                aria-hidden="true"
                className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${checked ? 'translate-x-6' : 'translate-x-0'}
                `}
            />
        </button>
    );
}
