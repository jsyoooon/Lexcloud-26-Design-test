import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

/**
 * Date Range Picker
 * - Dual calendar view (Current Month, Next Month)
 * - Start/End date selection
 * - "YYYY. MM. DD ~ YYYY. MM. DD" display format
 */
export default function DateRangePicker({ startDate, endDate, onChange, placeholder = "날짜 선택", style }) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());
    const [hoverDate, setHoverDate] = useState(null);

    // Internal state for manual confirmation
    const [tempStart, setTempStart] = useState(startDate);
    const [tempEnd, setTempEnd] = useState(endDate);

    const containerRef = useRef(null);

    // Sync internal state when picker opens
    useEffect(() => {
        if (isOpen) {
            if (startDate) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setTempStart(startDate);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setTempEnd(endDate);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setViewDate(new Date(startDate));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]); // Only sync when isOpen changes, props sync handled if needed during open

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Helper: Format Date for Input Display (YYYY. MM. DD)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}. ${m}. ${day}`;
    };

    // Helper: Format Date for Comparison (YYYY-MM-DD)
    const toDateString = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    // Helper: Get Days in Month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Helper: Get formatted Month Title
    const getMonthTitle = (date) => {
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    };

    // Handle Month Navigation
    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    // Handle Date Click - Updates Internal State ONLY
    const handleDateClick = (dateStr) => {
        if (!dateStr) return;

        if (!tempStart || (tempStart && tempEnd)) {
            // New selection start
            setTempStart(dateStr);
            setTempEnd('');
        } else {
            // Completing the range
            if (new Date(dateStr) < new Date(tempStart)) {
                setTempStart(dateStr);
                setTempEnd('');
            } else {
                setTempEnd(dateStr);
            }
        }
    };

    // Handle Footer Actions
    const handleReset = () => {
        setTempStart('');
        setTempEnd('');
    };

    const handleApply = () => {
        onChange(tempStart, tempEnd);
        setIsOpen(false);
    };

    // Generate Calendar Grid
    const renderCalendar = (baseDate, isLeft) => {
        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(toDateString(new Date(year, month, i)));

        return (
            <div className="calendar-pane" style={{ width: '280px', padding: '0 10px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px', marginBottom: '10px', position: 'relative' }}>
                    {isLeft && (
                        <button onClick={handlePrevMonth} style={{ position: 'absolute', left: 0, background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                            <Icon name="chevron-left" size={20} color="var(--neutral_500)" />
                        </button>
                    )}
                    <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--neutral_900)' }}>{getMonthTitle(baseDate)}</span>
                    {!isLeft && (
                        <button onClick={handleNextMonth} style={{ position: 'absolute', right: 0, background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                            <Icon name="chevron-right" size={20} color="var(--neutral_500)" />
                        </button>
                    )}
                </div>

                {/* Weekdays */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px', textAlign: 'center' }}>
                    {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
                        <span key={d} style={{ fontSize: '13px', color: 'var(--neutral_500)', fontWeight: '500' }}>{d}</span>
                    ))}
                </div>

                {/* Days Grid - Uses tempStart/tempEnd for visualization */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '4px' }}>
                    {days.map((dateStr, idx) => {
                        if (!dateStr) return <div key={`empty-${idx}`}></div>;

                        const isStart = tempStart === dateStr;
                        const isEnd = tempEnd === dateStr;
                        const isInRange = tempStart && tempEnd && dateStr > tempStart && dateStr < tempEnd;
                        const isHoverInRange = !tempEnd && tempStart && hoverDate && dateStr > tempStart && dateStr <= hoverDate;

                        let bg = 'transparent';
                        let color = 'var(--neutral_900)';
                        let borderRadius = '4px';

                        if (isStart || isEnd) {
                            bg = 'var(--Primary)';
                            color = '#fff';
                            borderRadius = '50%';
                        } else if (isInRange || isHoverInRange) {
                            bg = '#F3F0FF';
                            color = 'var(--Primary)';
                            borderRadius = '0';
                        }

                        if (isStart && (tempEnd || hoverDate)) borderRadius = '50% 0 0 50%';
                        if (isEnd) borderRadius = '0 50% 50% 0';
                        if (isStart && !tempEnd && !hoverDate) borderRadius = '50%';

                        return (
                            <button
                                key={dateStr}
                                onClick={() => handleDateClick(dateStr)}
                                onMouseEnter={() => setHoverDate(dateStr)}
                                style={{
                                    width: '100%',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: bg,
                                    color: color,
                                    fontSize: '14px',
                                    fontWeight: isStart || isEnd ? '600' : '400',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderRadius: borderRadius
                                }}
                            >
                                {parseInt(dateStr.split('-')[2], 10)}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const nextMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);

    const hasSelection = startDate || endDate;

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            {/* Input Trigger */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%', // Use full width of container passed by parent
                    height: '100%',
                    padding: '0',
                    border: isOpen ? '1px solid var(--Primary)' : '1px solid #E5E8EB',
                    borderRadius: '6px',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                    position: 'relative',
                    flexShrink: 0,
                    ...style
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <span style={{
                        fontSize: '14px',
                        color: hasSelection ? 'var(--neutral_900)' : 'var(--neutral_500)',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        {hasSelection
                            ? `${formatDate(startDate)} ~ ${endDate ? formatDate(endDate) : ''}`
                            : placeholder
                        }
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Close icon removed as per request */}
                    <Icon name="calendar" size={16} color={isOpen || hasSelection ? "var(--Primary)" : "var(--neutral_700)"} />
                </div>
            </div>

            {/* Dropdown Calendar */}
            {
                isOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '40px',
                        left: 0,
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        padding: '24px',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column', // Stack vertically
                        gap: '20px',
                        border: '1px solid #E5E8EB'
                    }}>
                        {/* Calendar Row */}
                        <div style={{ display: 'flex', gap: '24px' }}>
                            {renderCalendar(viewDate, true)}
                            {renderCalendar(nextMonth, false)}
                        </div>

                        {/* Footer Buttons */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '8px',
                            borderTop: '1px solid #E5E8EB',
                            paddingTop: '16px',
                            marginTop: '4px'
                        }}>
                            <button
                                onClick={handleReset}
                                style={{
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    color: 'var(--neutral_700)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                초기화
                            </button>
                            <button
                                onClick={handleApply}
                                style={{
                                    padding: '8px 24px',
                                    fontSize: '14px',
                                    color: '#fff',
                                    background: 'var(--Primary)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                선택
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
