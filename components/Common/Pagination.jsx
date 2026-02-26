import React from 'react';
import Icon from './Icon';

export default function Pagination({ currentPage = 1, totalPages = 10, onPageChange }) {
    const pages = [];
    // Simple logic to show some pages. 
    // If totalPages is small, show all. If large, show window.
    // For now, let's keep it simple: 1, 2, 3, 4, 5 ... total

    // Generating dummy pages for visual representation
    for (let i = 1; i <= Math.min(5, totalPages); i++) {
        pages.push(i);
    }

    return (
        <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px', marginBottom: '40px', gap: '8px' }}>
            <button
                className="btn-pagination-nav"
                disabled={currentPage === 1}
                onClick={() => onPageChange && onPageChange(currentPage - 1)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    width: '32px',
                    height: '32px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    color: currentPage === 1 ? 'var(--neutral_200)' : 'var(--neutral_600)',
                }}
            >
                <Icon name="triangle-down" size={20} style={{ transform: 'rotate(90deg)' }} />
            </button>

            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange && onPageChange(page)}
                    style={{
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        backgroundColor: 'transparent',
                        fontFamily: 'var(--font-pretendard, "Pretendard", sans-serif)', // Fallback if var not set
                        fontSize: currentPage === page ? '20px' : '16px',
                        fontWeight: currentPage === page ? '600' : '500', // SemiBold vs Medium
                        color: currentPage === page ? 'var(--neutral_800)' : 'var(--neutral_400)',
                        cursor: 'pointer',
                        padding: 0,
                    }}
                >
                    {page}
                </button>
            ))}

            {totalPages > 5 && (
                <>
                    <span style={{
                        fontFamily: 'var(--font-pretendard, "Pretendard", sans-serif)',
                        fontSize: '20px',
                        fontWeight: '600',
                        color: 'var(--neutral_600)',
                        width: '32px',
                        textAlign: 'center'
                    }}>...</span>
                    <button
                        onClick={() => onPageChange && onPageChange(totalPages)}
                        style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            backgroundColor: 'transparent',
                            fontFamily: 'var(--font-pretendard, "Pretendard", sans-serif)',
                            fontSize: currentPage === totalPages ? '20px' : '16px',
                            fontWeight: currentPage === totalPages ? '600' : '500',
                            color: currentPage === totalPages ? 'var(--neutral_800)' : 'var(--neutral_400)',
                            cursor: 'pointer',
                            padding: 0,
                        }}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                className="btn-pagination-nav"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange && onPageChange(currentPage + 1)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    width: '32px',
                    height: '32px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    color: currentPage === totalPages ? 'var(--neutral_200)' : 'var(--neutral_700)',
                }}
            >
                <Icon name="triangle-down" size={20} style={{ transform: 'rotate(270deg)' }} />
            </button>
        </div>
    );
}
