/**
 * Formats a date string or Date object to 'YYYY. M. D'
 * Example: '2026-02-12' -> '2026. 2. 12'
 */
export const formatDate = (dateValue) => {
    if (!dateValue) return '-';

    let date;
    if (dateValue instanceof Date) {
        date = dateValue;
    } else if (typeof dateValue === 'string') {
        // If it's already in YYYY. M. D or similar, we might just return it
        // but it's safer to re-parse and format.
        // Normalize common separators
        const normalized = dateValue.replace(/\./g, '-');
        date = new Date(normalized);
    } else {
        return '-';
    }

    if (isNaN(date.getTime())) return dateValue;

    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();

    return `${y}. ${m}. ${d}`;
};
