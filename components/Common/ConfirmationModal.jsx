import React from 'react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = '확인',
    cancelText = '취소',
    showCancel = true
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 3000, // Higher than other modals (usually 1000/2000)
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="modal-container" style={{
                backgroundColor: 'var(--white)',
                borderRadius: '12px',
                boxShadow: '0px 2px 20px 0px rgba(187,187,187,0.25)',
                padding: '24px 32px',
                width: '360px', // Min width for better appearance
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
            }}>
                <div style={{
                    fontFamily: 'var(--Heading_Desktop_md_semibold_font_family)',
                    fontSize: '18px',
                    fontWeight: 700,
                    lineHeight: '1.5',
                    color: 'var(--neutral_900)',
                    textAlign: 'center',
                    whiteSpace: 'pre-wrap' // Allow newlines in title
                }}>
                    {title}
                </div>

                {message && (
                    <div style={{
                        marginTop: '-8px', // Reduce gap if message exists
                        fontSize: '14px',
                        color: 'var(--neutral_700)',
                        textAlign: 'center',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {message}
                    </div>
                )}

                <div style={{
                    display: 'flex',
                    width: '100%',
                    gap: '32px', // User Request
                    justifyContent: 'center'
                }}>
                    {showCancel && (
                        <button
                            onClick={onClose}
                            style={{
                                flex: 1,
                                height: '40px',
                                border: '1px solid var(--neutral_300)',
                                borderRadius: '8px',
                                backgroundColor: 'var(--white)',
                                color: 'var(--neutral_900)',
                                fontSize: '15px',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={onConfirm}
                        style={{
                            flex: 1,
                            height: '40px',
                            border: 'none',
                            borderRadius: '8px',
                            backgroundColor: 'var(--Primary)', // Purple
                            color: 'var(--white)',
                            fontSize: '15px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
