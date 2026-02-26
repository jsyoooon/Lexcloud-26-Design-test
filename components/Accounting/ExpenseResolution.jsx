import React, { useState, useEffect, useMemo } from 'react';
import Icon from '../Common/Icon';
import Badge from '../Common/Badge';
import { FilterSelect, FilterText, FilterYearMonth } from '../Common/FilterComponents';
import { formatDate } from '../../utils/dateUtils';
import closeIcon from '../../assets/img/icon/Close Icon.svg';

// --- Detail Modal Component ---
const ExpenseDetailModal = ({ isOpen, onClose, item, onSave, onDelete }) => {
    const [reviewStatus, setReviewStatus] = useState('approved'); // approved / rejected
    const [comment, setComment] = useState('');

    // Editable state
    const [editForm, setEditForm] = useState({
        amount: 0,
        paymentMethod: '',
        evidenceType: ''
    });

    useEffect(() => {
        if (item) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setEditForm({
                amount: item.amount,
                paymentMethod: item.paymentMethod,
                evidenceType: item.evidenceType
            });
            setComment('');

            // Set initial review status based on item status
            if (item.status === '승인') {
                setReviewStatus('approved');
            } else if (item.status === '반려') {
                setReviewStatus('rejected');
            } else {
                setReviewStatus(null); // '대기' or other statuses -> unchecked
            }
        }
    }, [item, isOpen]); // Only sync when isOpen changes, props sync handled if needed during open

    if (!isOpen || !item) return null;

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-container" style={{ width: '640px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">지출결의 상세 및 검토</h2>
                    <button className="btn-close-modal" onClick={onClose}>
                        <img src={closeIcon} alt="Close" width="24" height="24" />
                    </button>
                </div>

                <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto', padding: '24px' }}>
                    {/* 1. 신청 내역 (Read-only + Editable) */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--neutral_900)' }}>
                            신청 정보
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '20px', background: 'var(--neutral_50)', borderRadius: '12px' }}>
                            {/* Read-only Fields */}
                            <div className="info-item">
                                <label style={{ fontSize: '12px', color: 'var(--neutral_800)', marginBottom: '4px', display: 'block' }}>프로젝트 코드</label>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--neutral_900)' }}>{item.projectCode || '-'}</div>
                            </div>
                            <div className="info-item">
                                <label style={{ fontSize: '12px', color: 'var(--neutral_800)', marginBottom: '4px', display: 'block' }}>사업장</label>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--neutral_900)' }}>{item.site}</div>
                            </div>
                            <div className="info-item">
                                <label style={{ fontSize: '12px', color: 'var(--neutral_800)', marginBottom: '4px', display: 'block' }}>신청자</label>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--neutral_900)' }}>{item.applicant}</div>
                            </div>
                            <div className="info-item">
                                <label style={{ fontSize: '12px', color: 'var(--neutral_800)', marginBottom: '4px', display: 'block' }}>신청일</label>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--neutral_900)' }}>{formatDate(item.requestDate)}</div>
                            </div>
                            <div className="info-item">
                                <label style={{ fontSize: '12px', color: 'var(--neutral_800)', marginBottom: '4px', display: 'block' }}>결제 기한</label>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--neutral_900)' }}>{formatDate(item.dueDate)}</div>
                            </div>
                            <div className="info-item">
                                <label style={{ fontSize: '12px', color: 'var(--neutral_800)', marginBottom: '4px', display: 'block' }}>수량 / 단가</label>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--neutral_900)' }}>{item.quantity} / {item.unitPrice?.toLocaleString()}원</div>
                            </div>
                            <div className="info-item" style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '12px', color: 'var(--neutral_800)', marginBottom: '4px', display: 'block' }}>품명</label>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--neutral_900)' }}>{item.itemName}</div>
                            </div>

                            {/* Editable Fields Group - Visually Distinct */}
                            <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', background: 'var(--white)', padding: '16px', borderRadius: '8px', border: '1px solid var(--neutral_300)', marginTop: '4px' }}>
                                <div className="info-item">
                                    <label style={{ fontSize: '12px', color: 'var(--neutral_800)', fontWeight: 700, marginBottom: '6px', display: 'block' }}>결제금액</label>
                                    <input
                                        type="number"
                                        className="input-text"
                                        style={{ width: '100%', height: '36px', fontWeight: 700 }}
                                        value={editForm.amount}
                                        onChange={(e) => setEditForm({ ...editForm, amount: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="info-item">
                                    <label style={{ fontSize: '12px', color: 'var(--neutral_800)', fontWeight: 700, marginBottom: '6px', display: 'block' }}>결제수단</label>
                                    <select
                                        className="dropdown"
                                        style={{ width: '100%', height: '36px' }}
                                        value={editForm.paymentMethod}
                                        onChange={(e) => setEditForm({ ...editForm, paymentMethod: e.target.value })}
                                    >
                                        <option>신용카드</option>
                                        <option>현금</option>
                                        <option>기타</option>
                                    </select>
                                </div>
                                <div className="info-item">
                                    <label style={{ fontSize: '12px', color: 'var(--neutral_800)', fontWeight: 700, marginBottom: '6px', display: 'block' }}>증빙종류</label>
                                    <select
                                        className="dropdown"
                                        style={{ width: '100%', height: '36px' }}
                                        value={editForm.evidenceType}
                                        onChange={(e) => setEditForm({ ...editForm, evidenceType: e.target.value })}
                                    >
                                        <option>신용카드전표</option>
                                        <option>세금계산서</option>
                                        <option>영수증</option>
                                        <option>기타</option>
                                    </select>
                                </div>
                            </div>

                            <div className="info-item" style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '12px', color: 'var(--neutral_800)', marginBottom: '4px', display: 'block' }}>비고 / 사유</label>
                                <div style={{ fontSize: '14px', color: 'var(--neutral_800)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{item.remarks || '-'}</div>
                            </div>
                            <div className="info-item" style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '12px', color: 'var(--neutral_800)', marginBottom: '8px', display: 'block' }}>첨부파일</label>
                                <button className="btn-outline" style={{ height: '32px', fontSize: '12px', gap: '6px' }}>
                                    <Icon name="download" size={14} /> 증빙자료_다운로드.pdf
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 2. 검토 결과 영역 */}
                    <div style={{ paddingTop: '24px', borderTop: '1px solid var(--neutral_100)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--neutral_900)' }}>
                            승인 검토
                        </h3>
                        <div className="form-group-grid" style={{ display: 'grid', gap: '20px', padding: '20px', background: 'var(--neutral_50)', borderRadius: '12px' }}>
                            <div className="form-item">
                                <label className="form-label">승인 여부</label>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                    <button
                                        onClick={() => setReviewStatus('approved')}
                                        style={{
                                            flex: 1,
                                            height: '40px',
                                            borderRadius: '8px',
                                            border: reviewStatus === 'approved' ? '1px solid var(--purple-600)' : '1px solid var(--neutral-300)',
                                            background: reviewStatus === 'approved' ? 'var(--purple-50)' : 'var(--white)',
                                            color: reviewStatus === 'approved' ? 'var(--purple-600)' : 'var(--neutral-800)',
                                            fontSize: '14px',
                                            fontWeight: reviewStatus === 'approved' ? 700 : 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        승인
                                    </button>
                                    <button
                                        onClick={() => setReviewStatus('rejected')}
                                        style={{
                                            flex: 1,
                                            height: '40px',
                                            borderRadius: '8px',
                                            border: reviewStatus === 'rejected' ? '1px solid var(--red-500)' : '1px solid var(--neutral-300)',
                                            background: reviewStatus === 'rejected' ? '#fff1f0' : 'var(--white)',
                                            color: reviewStatus === 'rejected' ? 'var(--red-500)' : 'var(--neutral-800)',
                                            fontSize: '14px',
                                            fontWeight: reviewStatus === 'rejected' ? 700 : 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        반려
                                    </button>
                                </div>
                            </div>

                            <div className="form-item">
                                <label className="form-label">전달사항</label>
                                <textarea
                                    className="input-text"
                                    style={{ width: '100%', height: '100px', resize: 'none', padding: '12px' }}
                                    placeholder={reviewStatus === 'rejected' ? '반려 사유를 필수로 입력해주세요.' : '승인 관련 메모를 입력해주세요.'}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="form-item">
                                <label className="form-label">첨부파일</label>
                                <div style={{ border: '1px dashed #dcdfe2', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}>
                                    <p style={{ fontSize: '13px', color: '#9ea4aa', margin: 0 }}>파일을 드래그하거나 클릭하여 업로드</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                    <button
                        className="btn-outline"
                        style={{ borderColor: '#ff4d4f', color: '#ff4d4f' }}
                        onClick={() => {
                            if (window.confirm('이 지출결의 내역을 삭제하시겠습니까?')) onDelete(item.id);
                        }}
                    >
                        <Icon name="trash-2" size={16} /> 삭제
                    </button>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-footer-close" onClick={onClose}>취소</button>
                        <button className="btn-primary" onClick={() => onSave(item.id, reviewStatus, editForm)}>
                            검토 결과 저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---
export default function ExpenseResolution() {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        year: '2025',
        month: '1',
        status: 'all',
        paymentMethod: 'all',
        applicant: '',
        site: 'all'
    });

    const mockData = [
        { id: 1, month: '2025-01', category: '번역 프로젝트 작업료', itemName: '프로젝트 A 번역료', applicant: '이민수', requestDate: '2025-01-14', site: '렉스코드', amount: 450000, paymentMethod: '신용카드', payDate: '2025-01-15', status: '승인', evidenceType: '신용카드전표', quantity: 1, unitPrice: 450000, projectCode: 'P-2025-001', dueDate: '2025-01-20' },
        { id: 2, month: '2025-01', category: '번역 프로젝트 작업료', itemName: '프로젝트 B 번역료', applicant: '박지연', requestDate: '2025-01-13', site: '렉스코드', amount: 300000, paymentMethod: '기타', payDate: '2025-01-14', status: '승인', evidenceType: '기타', quantity: 1, unitPrice: 300000, projectCode: 'P-2025-002', dueDate: '2025-01-20' },
        { id: 3, month: '2025-01', category: '번역 프로젝트 작업료', itemName: '프로젝트 C 번역료', applicant: '최현우', requestDate: '2025-01-16', site: '에퀴코리아', amount: 125000, paymentMethod: '신용카드', payDate: '-', status: '대기', evidenceType: '세금계산서', quantity: 1, unitPrice: 125000, projectCode: 'P-2025-003', dueDate: '2025-01-25' },
        { id: 4, month: '2025-01', category: '번역 프로젝트 작업료', itemName: '프로젝트 D 번역료', applicant: '김미래', requestDate: '2025-01-12', site: '렉스코드', amount: 119600, paymentMethod: '현금', payDate: '2025-01-13', status: '승인', evidenceType: '영수증', quantity: 1, unitPrice: 119600, projectCode: 'P-2025-004', dueDate: '2025-01-20' },
        { id: 5, month: '2025-01', category: '번역 프로젝트 작업료', itemName: '프로젝트 E 번역료', applicant: '정다운', requestDate: '2025-01-16', site: '렉스코드', amount: 68000, paymentMethod: '신용카드', payDate: '-', status: '반려', evidenceType: '신용카드전표', quantity: 1, unitPrice: 68000, projectCode: 'P-2025-005', dueDate: '2025-01-25' },
    ];

    const filteredData = useMemo(() => {
        return mockData.filter(item => {
            if (filters.status !== 'all' && item.status !== filters.status) return false;
            if (filters.paymentMethod !== 'all' && item.paymentMethod !== filters.paymentMethod) return false;
            if (filters.applicant && !item.applicant.includes(filters.applicant)) return false;
            if (filters.site !== 'all' && item.site !== (filters.site === '렉스코드' ? '렉스코드' : '에퀴코리아')) return false;
            return true;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const getStatusVariant = (status) => {
        switch (status) {
            case '승인': return 'info';
            case '대기': return 'warning';
            case '반려': return 'danger';
            case '확인': return 'success';
            default: return 'neutral';
        }
    };

    const handleRowClick = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleSaveReview = (id, status) => {
        alert(`${id}번 내역이 ${status === 'approved' ? '승인' : '반려'} 처리되었습니다.`);
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        alert(`${id}번 내역이 삭제되었습니다.`);
        setIsModalOpen(false);
    };


    return (
        <div className="space-y-6">
            <h1 className="page-title">지출결의 관리</h1>

            {/* Content Section */}
            <div>
                <>

                    {/* Filter Bar */}
                    <div className="filter-bar">
                        <div className="filter-group-wrapper" style={{ alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <FilterYearMonth
                                label="신청월"
                                year={filters.year}
                                onYearChange={(e) => setFilters({ ...filters, year: e.target.value })}
                                month={filters.month}
                                onMonthChange={(e) => setFilters({ ...filters, month: e.target.value })}
                                yearOptions={[
                                    { value: '2025', label: '2025' },
                                    { value: '2024', label: '2024' }
                                ]}
                                monthOptions={Array.from({ length: 12 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` }))}
                                style={{ width: '200px' }}
                            />

                            <FilterSelect
                                label="상태"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                options={[
                                    { value: 'all', label: '전체' },
                                    { value: '대기', label: '대기' },
                                    { value: '승인', label: '승인' },
                                    { value: '반려', label: '반려' }
                                ]}
                                style={{ width: '120px' }}
                            />

                            <FilterSelect
                                label="결제수단"
                                value={filters.paymentMethod}
                                onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                                options={[
                                    { value: 'all', label: '전체' },
                                    { value: '현금', label: '현금' },
                                    { value: '신용카드', label: '신용카드' },
                                    { value: '기타', label: '기타' }
                                ]}
                                style={{ width: '120px' }}
                            />

                            <FilterSelect
                                label="사업장"
                                value={filters.site}
                                onChange={(e) => setFilters({ ...filters, site: e.target.value })}
                                options={[
                                    { value: 'all', label: '전체' },
                                    { value: '렉스코드', label: '렉스코드' },
                                    { value: '에퀴코리아', label: '에퀴코리아' }
                                ]}
                                style={{ width: '120px' }}
                            />

                            <FilterText
                                label="검색"
                                value={filters.applicant}
                                onChange={(e) => setFilters({ ...filters, applicant: e.target.value })}
                                placeholder="이름 또는 품명 입력"
                                style={{ width: '200px' }}
                            />

                            <button className="btn-search-action" style={{ width: 'auto', padding: '0 20px' }}>
                                조회
                            </button>
                        </div>
                    </div>

                    {/* List Table Section */}
                    <div className="list-section">
                        <div className="list-header-controls">
                            <div className="list-count" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                지출 신청 내역 <span className="badge">{filteredData.length}</span>
                            </div>
                            <div>
                                <button className="btn-outline">
                                    <Icon name="download" size={16} /> EXCEL 다운로드
                                </button>
                            </div>
                        </div>

                        <div className="list-table-wrapper">
                            <div className="list-header-row" style={{ gridTemplateColumns: '80px 1fr 100px 110px 100px 120px 100px 110px 100px', display: 'grid', alignItems: 'center', columnGap: '12px', padding: '12px' }}>
                                <div className="cell-center">신청월</div>
                                <div className="cell-left">품명</div>
                                <div className="cell-center">신청자</div>
                                <div className="cell-center">신청일</div>
                                <div className="cell-center">사업장</div>
                                <div className="cell-right">결제금액</div>
                                <div className="cell-center">결제수단</div>
                                <div className="cell-center">결재일</div>
                                <div className="cell-center">상태</div>
                            </div>

                            {filteredData.map((item) => {
                                // const statusStyle = getStatusStyle(item.status);
                                return (
                                    <div
                                        key={item.id}
                                        className="list-row"
                                        onClick={() => handleRowClick(item)}
                                        style={{
                                            gridTemplateColumns: '80px 1fr 100px 110px 100px 120px 100px 110px 100px',
                                            display: 'grid',
                                            alignItems: 'center',
                                            columnGap: '12px',
                                            padding: '16px 12px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #f0f2f4'
                                        }}
                                    >
                                        <div className="cell-center" style={{ fontSize: '13px', color: '#151616' }}>{item.month}</div>
                                        <div className="cell-left" style={{ fontWeight: 600, fontSize: '14px', color: '#151616', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.itemName}
                                        </div>
                                        <div className="cell-center" style={{ fontSize: '13px' }}>{item.applicant}</div>
                                        <div className="cell-center" style={{ fontSize: '13px', color: '#9ea4aa' }}>{formatDate(item.requestDate)}</div>
                                        <div className="cell-center" style={{ fontSize: '13px' }}>{item.site}</div>
                                        <div className="cell-right" style={{ fontWeight: 700, fontSize: '14px' }}>{item.amount.toLocaleString()}원</div>
                                        <div className="cell-center" style={{ fontSize: '13px' }}>{item.paymentMethod}</div>
                                        <div className="cell-center" style={{ fontSize: '13px', color: '#9ea4aa' }}>{formatDate(item.payDate)}</div>
                                        <div className="cell-center">
                                            <Badge
                                                label={item.status}
                                                size="S"
                                                variant={getStatusVariant(item.status)}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <ExpenseDetailModal
                        isOpen={isModalOpen}
                        item={selectedItem}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveReview}
                        onDelete={handleDelete}
                    />
                </>
            </div>
        </div>
    );
}
