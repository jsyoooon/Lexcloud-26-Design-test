import React from 'react';
import '../../styles/components/input_text.css';

/**
 * Reusable InputText Component
 * Implements styles from Figma: Small Size (Height 40px)
 * 
 * Props:
 * - value: string
 * - onChange: function
 * - placeholder: string
 * - error: boolean | string (if string, it's treated as error message but this component only handles the border style. Parent renders message?)
 * - disabled: boolean
 * - width: string (default 100% or specific width like '240px')
 * - className: string
 * - ...otherProps (type, etc)
 */
export default function InputText({
    value,
    onChange,
    placeholder,
    error,
    disabled = false,
    width = '100%',
    className = '',
    style = {},
    ...props
}) {
    // Determine border color based on state is handled via CSS classes usually, 
    // but since we are using inline style mapping to variables or a styled component approach?
    // User provided CSS snippets with $variable syntax. I need to map $neutral_300 to var(--neutral_300).

    // However, CSS pseudo-classes (:hover, :focus, :disabled) are better handled in a CSS file or styled-jsx.
    // Given the project uses CSS modules or plain CSS files, I should probably create a css file for this component?
    // Or I can use styled-components if available? No, I see css files import.
    // I will create `src/styles/components/input_text.css` or just `InputText.css` inside components?
    // Let's check project structure. `src/styles` exists.

    // I'll create `src/components/Common/InputText.jsx` and `src/styles/input_text.css`.

    // Mapping states to classes:
    // Default: .input-text-base
    // Hover: :hover
    // Focus: :focus
    // Error: .has-error
    // Disabled: :disabled

    return (
        <input
            type="text"
            className={`common-input-text ${error ? 'has-error' : ''} ${className}`}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            style={{ width, ...style }}
            {...props}
        />
    );
}
