import React, { useEffect } from 'react';
import Icon from './Icon';

const ToastNotification = ({ message, isVisible, onClose, action }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '12px 20px',
            borderRadius: '40px',
            backgroundColor: 'rgba(53, 62, 69, 0.95)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            animation: 'fadeInOut 3s ease-in-out forwards',
            pointerEvents: action ? 'auto' : 'none'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#22c55e',
                    borderRadius: '50%',
                    flexShrink: 0
                }}>
                    <Icon name="check" size={14} color="white" strokeWidth={3} />
                </div>
                <div style={{
                    fontFamily: 'Pretendard',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'white',
                    lineHeight: '1.5',
                    letterSpacing: '-0.32px',
                    whiteSpace: 'nowrap'
                }}>
                    {message}
                </div>
            </div>

            {action && (
                <button
                    onClick={action.onClick}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '0',
                        margin: '0',
                        fontFamily: 'Pretendard',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#a3e635', // Lime green or a distinct accent color
                        textDecoration: 'underline',
                        textUnderlineOffset: '4px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        marginLeft: '8px'
                    }}
                >
                    {action.label}
                </button>
            )}

            <style>
                {`
                    @keyframes fadeInOut {
                        0% { opacity: 0; transform: translate(-50%, -20px); }
                        10% { opacity: 1; transform: translate(-50%, 0); }
                        90% { opacity: 1; transform: translate(-50%, 0); }
                        100% { opacity: 0; transform: translate(-50%, -20px); }
                    }
                `}
            </style>
        </div>
    );
};

export default ToastNotification;
