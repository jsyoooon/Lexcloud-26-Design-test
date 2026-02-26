import React, { useState } from 'react';
import closeIcon from '../../assets/img/icon/Close Icon.svg';
import checkboxChecked from '../../assets/img/icon/icon/checkbox/checked_sm.svg';
import checkboxUnchecked from '../../assets/img/icon/icon/checkbox/unchecked_sm.svg';
import Badge from '../Common/Badge';
import { formatDate } from '../../utils/dateUtils';

export default function PaymentGroupAddModal({ isOpen, onClose, onConfirm }) {
    const [selectedItems, setSelectedItems] = useState(new Set());

    // Mock candidates data (items that are 'confirmed' but not yet 'paid' or in a group)
    const [candidates] = useState([
        { id: 101, worker: '이앱', client: '네이버', project: 'Mobile_App_UI_Strings_v2.json', code: 'APP_005', lang: '한국어 → 영어(미국)', size: '800', pm: '남궁렉스', amount: '120,000원', incentive: null, confirmedAt: '2026-01-07', status: 'unpaid' },
        { id: 102, worker: '김재무', client: '카카오', project: 'Quarterly_Financial_Report_Q3_202...', code: 'FIN_003', lang: '한국어 → 영어(미국)', size: '5,500', pm: '남궁렉스', amount: '700,000원', incentive: '+30,000원', confirmedAt: '2026-01-07', status: 'paid', paidAt: '2026-01-08' },
        { id: 103, worker: '박영상', client: 'CJ ENM', project: 'HR_Training_Video_Script.srt', code: 'HR_002', lang: '한국어 → 영어(미국)', size: '1,500', pm: '남궁렉스', amount: '180,000원', incentive: null, confirmedAt: '2026-01-07', status: 'unpaid' },
    ]);

    if (!isOpen) return null;

    const handleCheckboxChange = (id) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const handleConfirm = () => {
        const selectedCandidates = candidates.filter(c => selectedItems.has(c.id));
        onConfirm(selectedCandidates);
        setSelectedItems(new Set()); // Reset selection
    };

    return (
        <div className="modal-overlay" style={{
            display: 'flex',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1100, // Higher than Detail Modal if needed, or same level logic
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="modal-content" style={{
                width: '1200px', // Slightly wider to match image content
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                maxHeight: '90vh'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>지급 대상 추가</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <img src={closeIcon} alt="Close" width="24" height="24" />
                    </button>
                </div>

                <div className="list-table-wrapper" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <div className="list-header-row" style={{ display: 'grid', gridTemplateColumns: '50px 2fr 1fr 1.5fr 0.8fr 1.2fr 1fr 1.2fr', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee', fontSize: '13px', color: '#666', fontWeight: 600 }}>
                        <div className="cell-center">선택</div>
                        <div className="cell-left">프로젝트</div>
                        <div className="cell-left">작업자</div>
                        <div className="cell-left">언어쌍</div>
                        <div className="cell-left">분량</div>
                        <div className="cell-left">작업료/인센티브</div>
                        <div className="cell-left">담당 PM</div>
                        <div className="cell-left">지급 상태</div>
                    </div>
                    <div>
                        {candidates.map(candidate => (
                            <div key={candidate.id} className="list-row" style={{ display: 'grid', gridTemplateColumns: '50px 2fr 1fr 1.5fr 0.8fr 1.2fr 1fr 1.2fr', padding: '16px 0', borderBottom: '1px solid #eee', alignItems: 'center', fontSize: '14px', color: '#333' }}>
                                <div className="cell-center" onClick={() => handleCheckboxChange(candidate.id)} style={{ cursor: 'pointer' }}>
                                    <img
                                        src={selectedItems.has(candidate.id) ? checkboxChecked : checkboxUnchecked}
                                        alt="checkbox"
                                        width="16"
                                        height="16"
                                    />
                                </div>
                                <div className="cell-project" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div className="project-name" style={{ color: 'var(--neutral_900)', fontSize: '14px', fontWeight: 500 }}>{candidate.project}</div>
                                    <div className="project-code" style={{ color: '#888', fontSize: '12px' }}>{candidate.code}</div>
                                </div>
                                <div className="cell-left">{candidate.worker}</div>
                                <div className="cell-lang cell-left">
                                    <span style={{ fontSize: '13px' }}>{candidate.lang}</span>
                                </div>
                                <div className="cell-left">{candidate.size}</div>
                                <div className="cell-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <div>{candidate.amount}</div>
                                    {candidate.incentive && (
                                        <div style={{ fontSize: '12px', color: '#3b82f6', marginTop: '2px' }}>{candidate.incentive}</div>
                                    )}
                                </div>
                                <div className="cell-left">{candidate.pm}</div>
                                <div className="cell-status cell-left" style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                                    <Badge
                                        label={candidate.status === 'paid' ? '지급완료' : '미지급'}
                                        variant={candidate.status === 'paid' ? 'success' : 'danger'}
                                        size="S"
                                    />
                                    <div style={{ fontSize: '12px', color: '#777', lineHeight: '1.3', marginTop: '4px' }}>
                                        {candidate.confirmedAt && <div>확인 {formatDate(candidate.confirmedAt)}</div>}
                                        {candidate.paidAt && <div>지급 {formatDate(candidate.paidAt)}</div>}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {candidates.length === 0 && (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                                추가 가능한 지급 대상이 없습니다.
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                    <button onClick={onClose} className="btn-outline">
                        취소
                    </button>
                    <button onClick={handleConfirm} className="btn-primary" disabled={selectedItems.size === 0}>
                        {selectedItems.size}건 추가하기
                    </button>
                </div>
            </div>
        </div>
    );
}
