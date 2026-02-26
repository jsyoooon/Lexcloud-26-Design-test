import React from 'react';

// Dynamically load all SVGs from the icons directory as raw strings
const modules = import.meta.glob('../../assets/icons/icon/*.svg', {
    eager: true,
    import: 'default',
    query: '?raw'
});

// Create a map of icon names to SVG content strings
// Example: "arrow-left" -> "<svg>...</svg>"
const iconMap = Object.fromEntries(
    Object.entries(modules).map(([path, content]) => {
        const name = path.split('/').pop().replace('.svg', '');
        return [name, content];
    })
);

/**
 * Custom Icon Component
 * Renders an SVG icon from src/assets/icons/ based on the 'name' prop.
 * Uses 'dangerouslySetInnerHTML' to inject the raw SVG string, allowing 'currentColor' inheritance.
 * 
 * @param {string} name - The kebab-case name of the icon file (without extension)
 * @param {number|string} size - Width and height of the icon container (default: 20)
 * @param {string} className - CSS classes
 * @param {object} style - Inline styles
 * @param {string} color - Explicit color (sets 'color' style)
 */
export default function Icon({ name, size = 20, className = '', style = {}, color, ...props }) {
    const svgContent = iconMap[name];

    if (!svgContent) {
        console.warn(`[Icon] "${name}" not found in src/assets/icons/`);
        return <span style={{ width: size, height: size, display: 'inline-block', backgroundColor: '#eee', borderRadius: '4px', ...style }} />;
    }

    const computedStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        color: color || 'inherit',
        ...style,
    };

    return (
        <span
            className={`custom-icon ${className}`}
            style={computedStyle}
            dangerouslySetInnerHTML={{ __html: svgContent }}
            {...props}
        />
    );
}
