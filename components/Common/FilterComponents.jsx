import React from 'react';
import Icon from './Icon';
import { twMerge } from 'tailwind-merge';
import DateRangePicker from './DateRangePicker';

/**
 * Filter Input Container
 * Wrapper for inline label style
 */

/**
 * Filter Input Container
 * Wrapper for inline label style
 */
const FilterContainer = ({ label, children, className, onClick, style, isActive, ...props }) => {
    return (
        <div
            className={twMerge("filter-input-container", className)}
            onClick={onClick}
            style={{
                height: '40px', // Standard height
                borderColor: isActive ? 'var(--Primary)' : 'var(--neutral_300)', // Focus state
                backgroundColor: isActive ? '#fff' : '#fff', // Optional: slight bg change? User said "Focus state", usually border.
                ...style // Allow style prop to override
            }}
            {...props}
        >
            {label && <label className="filter-inline-label">{label}</label>}
            {children}
        </div>
    );
};

/**
 * Filter Select Component
 */
export const FilterSelect = ({ label, value, onChange, options = [], className, style, ...props }) => {
    const isActive = value && value !== '' && value !== 'all';
    return (
        <FilterContainer label={label} className={className} style={style} isActive={isActive}>
            <div className="filter-input-wrapper-inner" style={{ width: '100%', position: 'relative', display: 'flex', alignItems: 'center' }}>
                <select
                    value={value}
                    onChange={onChange}
                    className="filter-input-field"
                    style={{ cursor: 'pointer', paddingRight: '20px', height: '100%' }}
                    {...props}
                >
                    {options.map((opt, idx) => (
                        <option key={idx} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <div style={{ position: 'absolute', right: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                    <Icon name="triangle-down" size={20} color={isActive ? "var(--Primary)" : "#666"} />
                </div>
            </div>
        </FilterContainer>
    );
};

/**
 * Filter Date Component
 */
export const FilterDate = ({ label, value, onChange, className, style, ...props }) => {
    const isActive = value && value !== '';
    return (
        <FilterContainer label={label} className={className} style={style} isActive={isActive}>
            <input
                type="date"
                value={value}
                onChange={onChange}
                className="filter-input-field"
                {...props}
            />
        </FilterContainer>
    );
};

/**
 * Filter Text Input Component
 */
export const FilterText = ({ label, value, onChange, placeholder, className, style, ...props }) => {
    const isActive = value && value !== '';
    return (
        <FilterContainer label={label} className={className} style={style} isActive={isActive}>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="filter-input-field"
                {...props}
            />
        </FilterContainer>
    );
};

/**
 * Filter Date Range Group Component
 * Renders [Criteria] [DateRangePicker]
 */
export const FilterDateRange = ({
    criteria,
    onCriteriaChange,
    criteriaOptions = [],
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    className,
    style
}) => {
    // Adapter
    const handleRangeChange = (start, end) => {
        if (start !== startDate) {
            onStartDateChange({ target: { value: start } });
        }
        if (end !== endDate) {
            onEndDateChange({ target: { value: end } });
        }
    };

    // Active if any value is selected
    const isActive = (criteria && criteria !== '' && criteria !== 'all') || (startDate && startDate !== '') || (endDate && endDate !== '');

    return (
        // Unified Box
        <FilterContainer
            label={null}
            className={className}
            isActive={isActive}
            style={{
                width: 'auto',
                minWidth: '310px',  // Min width to prevent date cutoff
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '0 12px',
                height: '40px', // Standard height
                display: 'flex',
                alignItems: 'center',
                boxShadow: 'none',
                // Border handled by FilterContainer via isActive or default class
                ...style
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {/* Criteria Select - Borderless */}
                <div style={{ position: 'relative', width: '90px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <select
                        value={criteria}
                        onChange={onCriteriaChange}
                        className="filter-input-field"
                        style={{
                            cursor: 'pointer',
                            paddingRight: '20px',
                            border: 'none',
                            background: 'transparent',
                            boxShadow: 'none',
                            paddingLeft: 0,
                            color: isActive ? 'var(--neutral_900)' : 'var(--neutral_900)'
                        }}
                    >
                        {criteriaOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <div style={{ position: 'absolute', right: -4, pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                        <Icon name="triangle-down" size={20} color="var(--neutral_700)" />
                    </div>
                </div>

                {/* Vertical Divider */}
                <div style={{ width: '1px', height: '14px', background: '#E5E8EB', margin: '0 12px' }}></div>

                {/* Date Range Picker - Borderless */}
                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onChange={handleRangeChange}
                    placeholder="날짜 선택"
                    style={{ border: 'none', padding: 0, width: '210px' }}
                />
            </div>
        </FilterContainer>
    );
};

/**
 * Filter Search Group Component
 * Renders [SearchCriteria] [SearchKeyword]
 */
export const FilterSearch = ({
    criteria,
    onCriteriaChange,
    criteriaOptions = [],
    keyword,
    onKeywordChange,
    placeholder = "검색어 입력",
    onSubmit,
    className,
    style
}) => {
    // Active if keyword exists
    const isActive = keyword && keyword !== '';

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && onSubmit) {
            onSubmit();
        }
    };

    return (
        <FilterContainer
            label={null}
            className={className}
            isActive={isActive}
            style={{
                width: 'auto',
                minWidth: '300px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '0 12px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                ...style
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {/* Criteria Select - Borderless */}
                <div style={{ position: 'relative', minWidth: '100px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <select
                        value={criteria}
                        onChange={(e) => {
                            onCriteriaChange(e);
                            // If keyword exists, trigger search on criteria change could be handled by parent
                            // But requirement says: "검색 조건이 변경되면, 동일한 검색어를 새 조건 기준으로 재조회한다."
                            // This logic is best handled in the parent's onChange handler or useEffect.
                        }}
                        className="filter-input-field"
                        style={{
                            cursor: 'pointer',
                            paddingRight: '20px',
                            border: 'none',
                            background: 'transparent',
                            boxShadow: 'none',
                            paddingLeft: 0,
                            color: 'var(--neutral_900)',
                            width: '100%'
                        }}
                    >
                        {criteriaOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <div style={{ position: 'absolute', right: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                        <Icon name="triangle-down" size={20} color="var(--neutral_700)" />
                    </div>
                </div>

                {/* Vertical Divider */}
                <div style={{ width: '1px', height: '14px', background: '#E5E8EB', margin: '0 8px' }}></div>

                {/* Keyword Input - Borderless */}
                <input
                    type="text"
                    value={keyword}
                    onChange={onKeywordChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="filter-input-field"
                    style={{
                        border: 'none',
                        padding: 0,
                        width: '100%',
                        background: 'transparent',
                        boxShadow: 'none'
                    }}
                />
            </div>
        </FilterContainer>
    );
};

/**
 * Filter Year Month Component (Single Box)
 * Renders [Year] | [Month] in one box with label "신청월"
 */
export const FilterYearMonth = ({
    label = "신청월",
    year,
    month,
    onYearChange,
    onMonthChange,
    yearOptions = [],
    monthOptions = [],
    className,
    style
}) => {
    const isActive = (year && year !== '') || (month && month !== '');
    return (
        <FilterContainer label={label} className={className} isActive={isActive} style={{ width: '160px', ...style }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                    <select
                        value={year}
                        onChange={onYearChange}
                        className="filter-input-field"
                        style={{ paddingRight: '16px', cursor: 'pointer', height: '100%' }}
                    >
                        {yearOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <div style={{ position: 'absolute', right: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                        <Icon name="triangle-down" size={20} color="var(--neutral_700)" />
                    </div>
                </div>
                <span style={{ color: 'var(--neutral_400)' }}>|</span>
                <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                    <select
                        value={month}
                        onChange={onMonthChange}
                        className="filter-input-field"
                        style={{ paddingRight: '16px', cursor: 'pointer', height: '100%' }}
                    >
                        {monthOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <div style={{ position: 'absolute', right: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                        <Icon name="triangle-down" size={20} color="var(--neutral_700)" />
                    </div>
                </div>
            </div>
        </FilterContainer>
    );
};
