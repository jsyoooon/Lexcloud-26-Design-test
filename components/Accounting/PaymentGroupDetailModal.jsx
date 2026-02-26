import React, { useState } from 'react';
import Badge from '../Common/Badge';
import PaymentGroupAddModal from './PaymentGroupAddModal';
import checkboxChecked from '../../assets/img/icon/icon/checkbox/checked_sm.svg';
import checkboxUnchecked from '../../assets/img/icon/icon/checkbox/unchecked_sm.svg';
import Icon from '../Common/Icon';
import { formatDate } from '../../utils/dateUtils';

export default function PaymentGroupDetailModal({ isOpen, onClose, group }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // Initial data (Mock) with Details
    const [paymentItems, setPaymentItems] = useState([
        {
            id: 1, worker: '김작업', client: '삼성전자', project: 'Global Marketing Guide', code: '2025-GMG-001', amount: '250,000원', total: '250,000원', status: 'paid', confirmedAt: '2025-07-20', payDate: '2025-07-25', pm: '남궁렉스', deadline: '2025-07-30',
            details: [
                { id: '1-1', date: '2025-07-10', file: 'global_marketing_v1.docx', amount: '100,000원' },
                { id: '1-2', date: '2025-07-15', file: 'global_marketing_v2_final.docx', amount: '150,000원' }
            ]
        },
        {
            id: 2, worker: '이마케', client: 'LG전자', project: 'Product Manual v2', code: '2025-LGE-002', amount: '300,000원', total: '300,000원', status: 'unpaid', confirmedAt: null, pm: '남궁렉스', deadline: '2025-08-05',
            details: [
                { id: '2-1', date: '2025-07-18', file: 'manual_v2_draft.pdf', amount: '300,000원' }
            ]
        },
        {
            id: 3, worker: '박검수', client: '현대자동차', project: 'Legal Contract v1.0', code: '2025-HMC-003', amount: '150,000원', total: '150,000원', status: 'unpaid', confirmedAt: null, pm: '남궁렉스', deadline: '2025-08-10',
            details: [
                { id: '3-1', date: '2025-07-19', file: 'contract_review_01.hwp', amount: '150,000원' }
            ]
        },
        {
            id: 4, worker: '최디자인', client: 'SK텔레콤', project: 'UX/UI Guidelines', code: '2025-SKT-004', amount: '150,000원', total: '150,000원', status: 'unpaid', confirmedAt: null, pm: '남궁렉스', deadline: '2025-08-15',
            details: [
                { id: '4-1', date: '2025-07-12', file: 'guideline_assets.zip', amount: '150,000원' }
            ]
        },
        {
            id: 5, worker: '정의학', client: '서울대학교병원', project: 'Medical Report', code: '2025-SNU-005', amount: '350,000원', total: '350,000원', status: 'unpaid', confirmedAt: null, pm: '남궁렉스', deadline: '2025-08-20',
            details: [
                { id: '5-1', date: '2025-07-20', file: 'medical_report_case1.docx', amount: '200,000원' },
                { id: '5-2', date: '2025-07-21', file: 'medical_report_case2.docx', amount: '150,000원' }
            ]
        },
    ]);


    // Selection state
    const [selectedItems, setSelectedItems] = useState(new Set());
    // Bulk Payment state
    const [isDateModalOpen, setIsDateModal] = useState(false);
    const [dateModalMode, setDateModalMode] = useState('pay'); // 'pay' | 'edit'
    const [paymentDate, setPaymentDate] = useState('');

    // Calculate selection state
    const selectedRows = React.useMemo(() => paymentItems.filter(r => selectedItems.has(r.id)), [paymentItems, selectedItems]);
    const hasPaidItems = React.useMemo(() => selectedRows.some(r => r.status === 'paid'), [selectedRows]);
    const hasUnpaidItems = React.useMemo(() => selectedRows.some(r => r.status !== 'paid'), [selectedRows]);



    // Recalculate summary when paymentItems change
    const summary = {
        count: paymentItems.length,
        totalAmount: paymentItems.reduce((sum, item) => {
            const val = parseInt(item.amount.replace(/[^0-9]/g, ''), 10);
            return sum + val;
        }, 0).toLocaleString() + '원'
    };

    const toggleSelect = (id) => {
        const newSet = new Set(selectedItems);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedItems(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedItems.size === paymentItems.length) {
            setSelectedItems(new Set());
        } else {
            const newSet = new Set(paymentItems.map(item => item.id));
            setSelectedItems(newSet);
        }
    };

    const handleBulkPayment = () => {
        if (selectedItems.size === 0) {
            alert('지급할 항목을 선택해주세요.');
            return;
        }
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        setPaymentDate(today);
        setDateModalMode('pay');
        setIsDateModal(true);
    };

    const handleConfirmPayment = () => {
        if (!paymentDate) {
            alert('지급일자를 입력해주세요.');
            return;
        }

        setPaymentItems(prev => prev.map(item => {
            if (selectedItems.has(item.id)) {
                if (dateModalMode === 'pay') {
                    return {
                        ...item,
                        status: 'paid',
                        confirmedAt: new Date().toISOString().split('T')[0], // Action Date (Today)
                        payDate: paymentDate, // Actual Pay Date (User Input)
                    };
                } else { // 'edit' mode
                    // Only update date, keep status as is (it should be paid already)
                    return {
                        ...item,
                        payDate: paymentDate
                    };
                }
            }
            return item;
        }));

        setSelectedItems(new Set());
        setIsDateModal(false);
        const msg = dateModalMode === 'pay' ? '일괄 지급 처리되었습니다.' : '지급일이 수정되었습니다.';
        alert(msg);
    };

    const handleExcelDownload = () => {
        alert('엑셀 다운로드가 시작됩니다.');
        // Logic for excel download would go here
    };

    if (!isOpen) return null;

    const handleAddClick = () => {
        setIsAddModalOpen(true);
    };

    const handleAddConfirm = (newItems) => {
        // Transform the candidate items to match the payment item structure
        const formattedNewItems = newItems.map(item => ({
            ...item,
            code: item.code || '2025-NEW-999', // Default code for new items
            // actual removed
            status: 'unpaid', // Default status for newly added items
            pm: '남궁렉스', // Default PM
            deadline: '2025-12-31', // Default Deadline
            details: [ // Mock detail for added item
                { id: `new-${item.id}-1`, date: item.confirmedAt || '2025-07-30', file: item.project + '_file.docx', amount: item.amount }
            ]
        }));

        setPaymentItems(prev => [...prev, ...formattedNewItems]);
        // Also expand new items by default if desired, or leave them closed. User said "Default value expanded", implying initial load.
        // Let's expand new items too for consistency.

        setIsAddModalOpen(false);
    };



    const handleBulkDelete = () => {
        if (selectedItems.size === 0) {
            alert('삭제할 항목을 선택해주세요.');
            return;
        }

        if (window.confirm('선택한 항목을 삭제하시겠습니까?')) {
            setPaymentItems(prev => prev.filter(item => !selectedItems.has(item.id)));
            setSelectedItems(new Set());
            alert('삭제되었습니다.');
        }
    };



    const handleCancelPayment = () => {
        if (!hasPaidItems) return;

        const count = selectedRows.filter(r => r.status === 'paid').length;
        if (window.confirm(`선택한 ${count}건의 지급을 취소하시겠습니까?\n상태가 '확인완료'로 변경됩니다.`)) {
            setPaymentItems(prev => prev.map(item => {
                if (selectedItems.has(item.id) && item.status === 'paid') {
                    return {
                        ...item,
                        status: 'unpaid', // Revert to unpaid/confirmed
                        confirmedAt: item.confirmedAt || new Date().toISOString().split('T')[0],
                        payDate: null
                    };
                }
                return item;
            }));
            setSelectedItems(new Set());
        }
    };

    const handleEditPaymentDate = () => {
        if (!hasPaidItems) return;
        const today = new Date().toISOString().split('T')[0];

        // Use existing modal logic
        setPaymentDate(today);
        setDateModalMode('edit');
        setIsDateModal(true);
    };

    return (
        <div id="paymentGroupDetailModal" className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-container full">
                <div className="modal-header">
                    <h2 className="modal-title">지급그룹</h2>
                    <button className="btn-close-modal" onClick={onClose}>
                        <Icon name="x" size={24} color="#666" />
                    </button>
                </div>

                <div className="modal-body">
                    {/* 1. Summary Section */}
                    {group && (
                        <div className="pg-summary-grid">
                            <div className="pg-summary-item">
                                <span className="pg-label">그룹명</span>
                                <span className="pg-value">{group.name}</span>
                            </div>
                            <div className="pg-summary-item">
                                <span className="pg-label">생성일</span>
                                <span className="pg-value">{formatDate(group.date)}</span>
                            </div>
                            <div className="pg-summary-item">
                                <span className="pg-label">지급일</span>
                                <span className="pg-value">{formatDate(group.payDate)}</span>
                            </div>
                            <div className="pg-summary-divider"></div>
                            <div className="pg-summary-item">
                                <span className="pg-label">지급건수</span>
                                <span className="pg-value">{group.count}</span>
                            </div>
                            <div className="pg-summary-item">
                                <span className="pg-label">지급액</span>
                                <div className="pg-value highlight" style={{ textAlign: 'right' }}>
                                    {group.paid}
                                </div>
                            </div>
                            <div className="pg-summary-item">
                                <span className="pg-label">총금액</span>
                                <div className="pg-value" style={{ textAlign: 'right' }}>
                                    {group.total}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Action Toolbar (Group Level) */}
                    <div className="pg-action-bar" style={{ alignItems: 'flex-end', paddingBottom: '16px' }}>
                        <div className="pg-bar-left" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{
                                fontFamily: 'var(--Heading_Desktop_md_semibold_font_family)',
                                fontSize: 'var(--Heading_Desktop_md_semibold_font_size)',
                                fontWeight: 'var(--Heading_Desktop_md_semibold_font_weight)',
                                lineHeight: 'var(--Heading_Desktop_md_semibold_line_height)',
                                color: 'var(--neutral_900)'
                            }}>지급 리스트</span>
                        </div>
                        <div className="pg-bar-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button className="btn-outline" onClick={handleExcelDownload} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Icon name="download" size={16} /> EXCEL 다운로드
                            </button>
                            <button className="btn-outline" onClick={handleAddClick} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Icon name="plus" size={16} /> 추가
                            </button>
                        </div>
                    </div>

                    {/* 3. Payment Item List Table */}
                    <div className="list-table-wrapper" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {/* Modified Header Grid Template to exclude Proof column */}
                        <div className="list-header-row" style={{ display: 'grid', gridTemplateColumns: '50px 2fr 120px 100px 120px 100px 120px 100px', alignItems: 'center', minWidth: '100%', padding: '12px 0' }}>
                            <div className="cell-center">
                                <img
                                    src={selectedItems.size === paymentItems.length && paymentItems.length > 0 ? checkboxChecked : checkboxUnchecked}
                                    alt="checkbox"
                                    width="16"
                                    height="16"
                                    style={{ cursor: 'pointer' }}
                                    onClick={toggleSelectAll}
                                />
                            </div>

                            <div className="cell-left">파일명/ 프로젝트코드</div>
                            <div className="cell-left">고객사명</div>
                            <div className="cell-left">작업자명</div>

                            <div className="cell-right">총 지급액</div>
                            <div className="cell-left">담당 PM</div>
                            <div className="cell-left">작업 마감일</div>
                            <div className="cell-left">지급 상태</div>
                        </div>
                        <div id="pgListContainer">
                            {paymentItems.map((row, idx) => (
                                <React.Fragment key={row.id || idx}>
                                    <div className="list-row" style={{ display: 'grid', gridTemplateColumns: '50px 2fr 120px 100px 120px 100px 120px 100px', alignItems: 'center', borderBottom: '1px solid #EFF2F5', minWidth: '100%', padding: '12px 0' }}>
                                        <div className="cell-center">
                                            <img
                                                src={selectedItems.has(row.id) ? checkboxChecked : checkboxUnchecked}
                                                alt="checkbox"
                                                width="16"
                                                height="16"
                                                style={{ cursor: 'pointer' }}
                                                onClick={(e) => { e.stopPropagation(); toggleSelect(row.id); }}
                                            />
                                        </div>

                                        <div className="cell-project" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <div className="project-name" style={{ color: 'var(--neutral_900)', fontSize: '14px' }}>{row.project}</div>
                                            <div className="project-code" style={{ color: 'var(--neutral_800)', fontSize: '12px' }}>{row.code}</div>
                                        </div>
                                        <div className="cell-left">{row.client}</div>
                                        <div className="cell-left">{row.worker}</div>

                                        <div className="cell-right" style={{ fontWeight: 600 }}>{row.amount}</div>
                                        <div className="cell-left">{row.pm || '-'}</div>
                                        <div className="cell-left">{formatDate(row.deadline) || '-'}</div>
                                        <div className="cell-center" style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                                                <Badge
                                                    label={row.status === 'paid' ? '지급완료' : '미지급'}
                                                    variant={row.status === 'paid' ? 'success' : 'danger'}
                                                    size="S"
                                                />
                                                {row.status === 'paid' && row.confirmedAt && (
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: '2px', // gap between dates
                                                        marginTop: '2px'
                                                    }}>
                                                        <div style={{
                                                            fontSize: '11px',
                                                            color: 'var(--neutral_700)',
                                                            letterSpacing: '-0.01em',
                                                            lineHeight: '1.2',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            <span style={{ color: 'var(--neutral_700)', fontWeight: 400 }}>처리</span> {formatDate(row.confirmedAt)}
                                                        </div>

                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <PaymentGroupAddModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onConfirm={handleAddConfirm}
            />

            {/* Bulk Payment Date Input Modal */}
            {isDateModalOpen && (
                <div className="modal-overlay" style={{ display: 'flex', zIndex: 1100 }}>
                    <div className="modal-container" style={{ width: '400px', maxWidth: '90%', height: 'auto', maxHeight: 'none' }}>
                        <div className="modal-header">
                            <h3 className="modal-title" style={{ fontSize: '18px' }}>
                                {dateModalMode === 'pay' ? '일괄 지급 처리' : '지급일 수정'}
                            </h3>
                            <button className="btn-close-modal" onClick={() => setIsDateModal(false)}>
                                <Icon name="x" size={20} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '24px' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                                    {dateModalMode === 'pay' ? '실제 지급일자' : '수정할 지급일자'}
                                </label>
                                <input
                                    type="date"
                                    className="input-text"
                                    style={{ width: '100%' }}
                                    value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                />
                            </div>
                            <p style={{ fontSize: '13px', color: '#666', marginTop: '12px', lineHeight: '1.5' }}>
                                {dateModalMode === 'pay'
                                    ? <>선택된 {selectedItems.size}건의 항목이 '지급완료' 상태로 변경되며,<br />입력하신 지급일자가 적용됩니다.</>
                                    : <>선택된 {selectedItems.size}건의 지급일이<br />입력하신 날짜로 수정됩니다.</>
                                }
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-outline" onClick={() => setIsDateModal(false)} style={{ marginRight: '8px' }}>취소</button>
                            <button className="btn-primary" onClick={handleConfirmPayment}>확인</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Floating Action Bar */}
            {selectedItems.size > 0 && (
                <div className="floating-action-bar" style={{ bottom: '40px', zIndex: 2000 }}>
                    <div className="fab-content" style={{ gap: '24px', width: 'auto' }}>
                        <div className="fab-summary">
                            {selectedItems.size}개 선택됨
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {hasPaidItems && (
                                <>
                                    <button
                                        className="btn-outline"
                                        onClick={handleEditPaymentDate}
                                        style={{ height: '36px', fontSize: '14px' }}
                                    >
                                        지급일 수정
                                    </button>
                                    <button
                                        className="btn-danger-outline" // Reusing danger style or make new one? 
                                        onClick={handleCancelPayment}
                                        style={{
                                            height: '36px',
                                            padding: '0 16px',
                                            borderColor: '#FF4D4F',
                                            color: '#FF4D4F'
                                        }}
                                    >
                                        지급 취소
                                    </button>
                                </>
                            )}

                            {hasUnpaidItems && (
                                <button
                                    className="btn-primary"
                                    onClick={handleBulkPayment}
                                    style={{
                                        padding: '8px 20px',
                                        height: '36px',
                                        fontSize: '14px'
                                    }}
                                >
                                    일괄 지급
                                </button>
                            )}

                            {/* Show Delete only if NO paid items are selected, OR allow mixed? 
                                User plan says: Delete allowed for Unpaid. Paid should be canceled first.
                                So if hasPaidItems is true, hide Delete? or Disable?
                            */}
                            {!hasPaidItems && (
                                <button
                                    onClick={handleBulkDelete}
                                    style={{
                                        background: 'rgba(255, 77, 79, 0.15)',
                                        border: '1px solid #FF4D4F',
                                        color: '#FF4D4F',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontFamily: 'Pretendard',
                                        height: '36px'
                                    }}
                                >
                                    <Icon name="trash" size={16} color="#FF4D4F" /> 삭제
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
