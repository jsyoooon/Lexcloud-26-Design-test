import React, { useState, useEffect } from 'react';
import InputText from '../Common/InputText';

export default function PaymentGroupCreateModal({
    isOpen,
    onClose,
    onConfirm,
    existingNames = []
}) {
    const [groupName, setGroupName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            const today = new Date();
            const defaultName = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')} 지급그룹`;
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setGroupName(defaultName);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        const trimmedName = groupName.trim();

        // Validation
        if (!trimmedName) {
            setError('지급그룹명을 입력해주세요.');
            return;
        }

        if (trimmedName.length < 2 || trimmedName.length > 30) {
            setError('지급그룹명은 2자 이상 30자 이내로 입력해주세요.');
            return;
        }

        if (existingNames.includes(trimmedName)) {
            setError('이미 사용 중인 지급그룹명입니다.');
            return;
        }

        onConfirm(trimmedName);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                width: '400px',
                padding: '24px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
            }}>
                <div style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--neutral_900)'
                }}>
                    지급그룹 생성
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'var(--neutral_700)'
                    }}>
                        지급그룹명
                    </label>
                    <InputText
                        value={groupName}
                        onChange={(e) => {
                            setGroupName(e.target.value);
                            setError('');
                        }}
                        placeholder="예: 2026-01 지급그룹"
                        error={!!error}
                        autoFocus
                    />
                    {error && (
                        <span style={{
                            fontSize: '12px',
                            color: 'var(--red_500)',
                            marginTop: '2px'
                        }}>
                            {error}
                        </span>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: '1px solid var(--neutral_300)',
                            backgroundColor: 'white',
                            color: 'var(--neutral_700)',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: 'var(--Primary)',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        생성하기
                    </button>
                </div>
            </div>
        </div>
    );
}
