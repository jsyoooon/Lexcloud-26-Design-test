import React, { useState, useEffect } from 'react';
import Badge from '../Common/Badge';
import Icon from '../Common/Icon';
import ToastNotification from '../Common/ToastNotification';
import { formatDate } from '../../utils/dateUtils';
import TaxInvoiceModal from './TaxInvoiceModal';

export default function CollectionDetailModal({ isOpen, onClose, data, onSave }) {
    const [status, setStatus] = useState('uncollected');
    const [depositDate, setDepositDate] = useState('');
    const [depositor, setDepositor] = useState('');
    const [note, setNote] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isTaxInvoiceModalOpen, setIsTaxInvoiceModalOpen] = useState(false);

    useEffect(() => {
        if (data) {
            setStatus(data.status || 'uncollected');
            setDepositDate(data.date === '-' ? '' : data.date.replace(/\. /g, '-'));
            setDepositor(data.depositor || '');
            setNote(data.note === '-' ? '' : data.note);
        }
    }, [data, isOpen]);

    if (!isOpen || !data) return null;

    const isUncollected = status === 'uncollected';
    const isCollected = status === 'collected';

    const handleSave = () => {
        onSave({
            ...data,
            // We keep the actual status as it is, or update if specifically intended.
            // But based on user request "상태 전환은 일어나지 않아", we keep the current data status
            // if we want to just save changes.
            date: depositDate ? depositDate.replace(/-/g, '. ') : '-',
            depositor: depositor || '-',
            note: note || '-'
        });
        setShowToast(true);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount) + '원';
    };

    const labelStyle = {
        fontSize: '13px',
        fontWeight: 500,
        color: 'var(--neutral_700, #85888B)',
        marginBottom: '4px'
    };

    const valueStyle = {
        fontSize: '14px',
        fontWeight: 600,
        color: 'var(--neutral_900, #151616)',
    };

    return (
        <div id="collectionDetailModal" className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="modal-container" style={{
                width: '700px',
                maxWidth: '100%',
                maxHeight: 'calc(100vh - 40px)',
                backgroundColor: '#fff',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
                {/* Header */}
                <div className="modal-header" style={{ padding: '24px 32px', borderBottom: '1px solid var(--neutral_100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <h2 className="modal-title" style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>수금 처리</h2>
                    <button className="btn-close-modal" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Icon name="x" size={24} color="var(--neutral_700)" />
                    </button>
                </div>

                <div className="modal-body custom-scrollbar" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto', flex: 1 }}>

                    {/* [섹션 1] 상단 요약 영역 (Card style) */}
                    <div style={{ backgroundColor: '#fff', border: '1px solid var(--neutral_100)', borderRadius: '12px', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <div style={labelStyle}>고객명</div>
                                <div style={{ ...valueStyle, fontSize: '15px' }}>{data.client || '텍스트텍스트'}</div>
                            </div>
                            <div>
                                <div style={labelStyle}>수금방식</div>
                                <div style={valueStyle}>전액</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <div style={labelStyle}>계약금액</div>
                                <div style={valueStyle}>50,000원</div>
                            </div>
                            <div>
                                <div style={{ ...labelStyle, color: isUncollected ? 'var(--neutral_700)' : 'var(--neutral_700)' }}>미수금</div>
                                <div style={{ ...valueStyle, fontSize: '14px', fontWeight: 600, color: 'var(--neutral_900)' }}>
                                    {isUncollected ? '50,000원' : '0원'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* [섹션 2] "1차 결제" 카드 */}
                    <div style={{ border: '1px solid var(--neutral_100)', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '16px', fontWeight: 700 }}>1차 결제</span>
                            <Badge
                                label={status === 'collected' ? '결제완료' : '미결제'}
                                variant={status === 'collected' ? 'success' : 'danger'}
                                size="XS"
                            />
                        </div>

                        <div style={{ padding: '0 24px 24px' }}>
                            {/* Input Area with light gray background */}
                            <div style={{ backgroundColor: '#F9FAFB', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '80px', fontSize: '13px', color: '#666', fontWeight: 500 }}>입금일</div>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <input
                                            type="date"
                                            value={depositDate}
                                            onChange={(e) => setDepositDate(e.target.value)}
                                            style={{
                                                width: '100%',
                                                height: '40px',
                                                padding: '0 12px 0 12px',
                                                borderRadius: '8px',
                                                border: '1px solid #E5E7EB',
                                                backgroundColor: isCollected ? '#eee' : '#fff',
                                                fontSize: '14px'
                                            }}
                                            disabled={isCollected}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '80px', fontSize: '13px', color: '#666', fontWeight: 500 }}>입금자</div>
                                    <input
                                        type="text"
                                        value={depositor}
                                        placeholder="입금자명"
                                        onChange={(e) => setDepositor(e.target.value)}
                                        style={{
                                            flex: 1,
                                            height: '40px',
                                            padding: '0 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #E5E7EB',
                                            backgroundColor: isCollected ? '#eee' : '#fff',
                                            fontSize: '14px'
                                        }}
                                        disabled={isCollected}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <div style={{ width: '80px', fontSize: '13px', color: '#666', fontWeight: 500, marginTop: '10px' }}>비고</div>
                                    <textarea
                                        value={note}
                                        placeholder="참고 사항을 입력하세요."
                                        onChange={(e) => setNote(e.target.value)}
                                        style={{
                                            flex: 1,
                                            minHeight: '80px',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #E5E7EB',
                                            backgroundColor: '#fff', // Always white to indicate editable
                                            fontSize: '14px',
                                            resize: 'none'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                                    <button
                                        onClick={handleSave}
                                        style={{
                                            backgroundColor: 'var(--Primary)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '8px 24px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        저장
                                    </button>
                                </div>
                            </div>

                            {/* Details Area */}
                            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 40px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <div style={labelStyle}>예정일</div>
                                        <div style={valueStyle}>{formatDate('2026. 00. 00')}</div>
                                    </div>
                                    <div>
                                        <div style={labelStyle}>결제구분</div>
                                        <div style={valueStyle}>국내</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <div style={labelStyle}>결제 필요금액(?)</div>
                                        <div style={valueStyle}>50,000원</div>
                                    </div>
                                    <div>
                                        <div style={labelStyle}>결제수단</div>
                                        <div style={valueStyle}>송금</div>
                                    </div>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <div style={labelStyle}>청구</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button
                                            onClick={() => setIsTaxInvoiceModalOpen(true)}
                                            style={{
                                                backgroundColor: '#fff',
                                                border: '1px solid var(--neutral_100)',
                                                borderRadius: '8px',
                                                padding: '6px 12px',
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            세금계산서 <Icon name="chevron-right" size={12} />
                                        </button>
                                        <button style={{
                                            backgroundColor: '#fff',
                                            border: '1px solid var(--neutral_100)',
                                            borderRadius: '8px',
                                            padding: '6px 12px',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            cursor: 'pointer'
                                        }}>
                                            현금영수증 <Icon name="chevron-right" size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '20px 32px', borderTop: '1px solid var(--neutral_100)', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: 'var(--Primary)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 32px',
                            fontSize: '15px',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        결제처리
                    </button>
                </div>
            </div>

            <ToastNotification
                message="저장되었습니다"
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />

            <TaxInvoiceModal
                isOpen={isTaxInvoiceModalOpen}
                onClose={() => setIsTaxInvoiceModalOpen(false)}
                data={data}
                onSave={(taxData) => {
                    console.log('Tax Invoice Saved:', taxData);
                    setIsTaxInvoiceModalOpen(false);
                }}
            />
        </div>
    );
}
