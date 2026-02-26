import React from 'react';

export default function AccountingSummary({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="accounting-summary-container">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="summary-card"
                    onClick={item.onClick}
                    style={{
                        cursor: item.onClick ? 'pointer' : 'default',
                        border: item.isActive ? '1px solid var(--Primary)' : undefined,
                        backgroundColor: item.isActive ? 'var(--Primary_50)' : undefined // Slight bg tint if active
                    }}
                >
                    <div className="summary-header">
                        <div className="summary-label">{item.label}</div>
                        {item.subText && <div className="summary-subtext">{item.subText}</div>}
                    </div>
                    <div className="summary-value-row">
                        <div className={`summary-value ${item.valueClassName || ''}`}>{item.value}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
