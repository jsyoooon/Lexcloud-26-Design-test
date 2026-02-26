import React, { useState, useEffect } from 'react';
import Badge from '../Common/Badge';
import Icon from '../Common/Icon';
import ToastNotification from '../Common/ToastNotification';
import { formatDate } from '../../utils/dateUtils';
import TaxInvoiceModal from './TaxInvoiceModal';

export default function CollectionGroupDetailModal({ isOpen, onClose, groupData, onSave }) {
    const [status, setStatus] = useState('uncollected');
    const [depositDate, setDepositDate] = useState('');
    const [depositor, setDepositor] = useState('');
    const [note, setNote] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isTaxInvoiceModalOpen, setIsTaxInvoiceModalOpen] = useState(false);

    useEffect(() => {
        if (groupData) {
            setStatus(groupData.status === 'paid' ? 'collected' : 'uncollected');
            setDepositDate(groupData.payDate === '-' ? '' : groupData.payDate.replace(/\. /g, '-'));
            setDepositor(groupData.depositor || ''); // Use depositor if available
            setNote(groupData.note || '');
        }
    }, [groupData, isOpen]);

    if (!isOpen || !groupData) return null;

    const isUncollected = status === 'uncollected';
    const isCollected = status === 'collected';

    const handleSave = () => {
        if (onSave) {
            onSave({
                ...groupData,
                status: status, // Keep status as is or update based on input
                payDate: depositDate ? depositDate.replace(/-/g, '. ') : '-',
                depositor: depositor || '-',
                note: note || '-'
            });
        }
        setShowToast(true);
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

    const totalAmount = groupData.items?.reduce((sum, i) => sum + i.amount, 0) || 0;

    return (
        <div id="collectionGroupDetailModal" className="modal-overlay" style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="modal-container" style={{
                width: '700px', maxWidth: '100%',
                maxHeight: 'calc(100vh - 40px)',
                backgroundColor: '#fff', borderRadius: '16px',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
                {/* Header */}
                <div className="modal-header" style={{ padding: '24px 32px', borderBottom: '1px solid var(--neutral_100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <h2 className="modal-title" style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>합산그룹 상세</h2>
                    <button className="btn-close-modal" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Icon name="x" size={24} color="var(--neutral_700)" />
                    </button>
                </div>

                <div className="modal-body custom-scrollbar" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto', flex: 1 }}>

                    {/* [섹션 1] 상단 요약 영역 */}
                    <div style={{ backgroundColor: '#fff', border: '1px solid var(--neutral_100)', borderRadius: '12px', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <div style={labelStyle}>그룹명</div>
                                <div style={{ ...valueStyle, fontSize: '15px' }}>{groupData.name}</div>
                            </div>
                            <div>
                                <div style={labelStyle}>합산 항목수</div>
                                <div style={valueStyle}>{groupData.items?.length || 0}건</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <div style={labelStyle}>합산금액</div>
                                <div style={{ ...valueStyle, color: 'var(--Primary)' }}>{totalAmount.toLocaleString()}원</div>
                            </div>
                            <div>
                                <div style={labelStyle}>생성일</div>
                                <div style={valueStyle}>{formatDate(groupData.createDate)}</div>
                            </div>
                        </div>
                    </div>

                    {/* [섹션 2] 그룹 포함 프로젝트 정보 영역 (추가 요청 사항) */}
                    <div style={{ border: '1px solid var(--neutral_100)', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 24px', backgroundColor: '#F9FAFB', borderBottom: '1px solid var(--neutral_100)', fontSize: '15px', fontWeight: 700 }}>
                            그룹 포함 프로젝트 정보
                        </div>
                        <div style={{ padding: '0' }}>
                            <div className="list-table-wrapper" style={{ boxShadow: 'none' }}>
                                <div className="list-header-row" style={{ gridTemplateColumns: '2fr 1fr 1fr', backgroundColor: '#f9fafb', fontSize: '12px', fontWeight: 600, borderBottom: '1px solid var(--neutral_100)' }}>
                                    <div className="cell-left">파일명/프로젝트 코드</div>
                                    <div className="cell-left">업체명</div>
                                    <div className="cell-right">금액</div>
                                </div>
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {groupData.items?.map(item => (
                                        <div key={item.id} className="list-row" style={{ gridTemplateColumns: '2fr 1fr 1fr', borderBottom: '1px solid #f0f2f4', padding: '12px 24px' }}>
                                            <div className="cell-project">
                                                <div className="project-name" style={{ fontSize: '13px', fontWeight: 500 }}>{item.projectName}</div>
                                                <div className="project-code" style={{ fontSize: '11px', color: '#999' }}>{item.projectCode}</div>
                                            </div>
                                            <div className="cell-left" style={{ fontSize: '13px' }}>{item.client}</div>
                                            <div className="cell-right" style={{ fontSize: '13px', fontWeight: 600 }}>{item.amount.toLocaleString()}원</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* [섹션 3] 결제 정보 (CollectionDetailModal 디자인 미러링) */}
                    <div style={{ border: '1px solid var(--neutral_100)', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '16px', fontWeight: 700 }}>결제 처리</span>
                            <Badge
                                label={status === 'collected' ? '결제완료' : '미결제'}
                                variant={status === 'collected' ? 'success' : 'danger'}
                                size="XS"
                            />
                        </div>

                        <div style={{ padding: '0 24px 24px' }}>
                            <div style={{ backgroundColor: '#F9FAFB', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '80px', fontSize: '13px', color: '#666', fontWeight: 500 }}>입금일</div>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <input
                                            type="date"
                                            value={depositDate}
                                            onChange={(e) => setDepositDate(e.target.value)}
                                            style={{
                                                width: '100%', height: '40px', padding: '0 12px',
                                                borderRadius: '8px', border: '1px solid #E5E7EB',
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
                                            flex: 1, height: '40px', padding: '0 12px',
                                            borderRadius: '8px', border: '1px solid #E5E7EB',
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
                                            flex: 1, minHeight: '80px', padding: '12px',
                                            borderRadius: '8px', border: '1px solid #E5E7EB',
                                            backgroundColor: '#fff', fontSize: '14px', resize: 'none'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                                    <button
                                        onClick={handleSave}
                                        style={{ backgroundColor: 'var(--Primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        저장
                                    </button>
                                </div>
                            </div>

                            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 40px' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <div style={labelStyle}>청구</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button
                                            onClick={() => setIsTaxInvoiceModalOpen(true)}
                                            style={{ backgroundColor: '#fff', border: '1px solid var(--neutral_100)', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                                        >
                                            세금계산서 <Icon name="chevron-right" size={12} />
                                        </button>
                                        <button style={{ backgroundColor: '#fff', border: '1px solid var(--neutral_100)', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
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
                        style={{ backgroundColor: 'var(--Primary)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 32px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}
                    >
                        닫기
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
                data={groupData}
                onSave={(taxData) => {
                    console.log('Tax Invoice Saved:', taxData);
                    setIsTaxInvoiceModalOpen(false);
                }}
            />
        </div>
    );
}
