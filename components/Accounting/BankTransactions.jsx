import React, { useState, useEffect } from 'react';
import InputText from '../Common/InputText';
import { formatDate } from '../../utils/dateUtils';

// Shared Modal Component for Add/Edit
const TransactionModal = ({ isOpen, onClose, mode, initialData }) => {
    const [formData, setFormData] = useState({
        date: '',
        depositor: '',
        approval: '',
        deposit: '',
        withdrawal: '',
        balance: '',
        note: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    date: initialData.date,
                    depositor: initialData.depositor,
                    approval: initialData.approval,
                    deposit: initialData.deposit === '-' ? '' : parseInt(initialData.deposit.replace(/[^0-9]/g, '')),
                    withdrawal: initialData.withdrawal === '-' ? '' : parseInt(initialData.withdrawal.replace(/[^0-9]/g, '')),
                    balance: parseInt(initialData.balance.replace(/[^0-9]/g, '')),
                    note: initialData.note || ''
                });
            } else {
                setFormData({
                    date: '', depositor: '', approval: '', deposit: '', withdrawal: '', balance: '', note: ''
                });
            }
            setErrors({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]); // Only sync when isOpen changes, props sync handled if needed during openif and when possible

    const handleChange = (e) => {
        const { id, value } = e.target;
        let newData = { ...formData, [id]: value };

        // Mutual Exclusion
        if (id === 'deposit' && value && parseFloat(value) > 0) {
            newData.withdrawal = '';
        } else if (id === 'withdrawal' && value && parseFloat(value) > 0) {
            newData.deposit = '';
        }

        setFormData(newData);
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.date) newErrors.date = true;
        if (!formData.depositor) newErrors.depositor = true;
        if (!formData.balance) newErrors.balance = true;
        if (!formData.deposit && !formData.withdrawal) newErrors.amount = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            alert(`Transaction ${mode === 'add' ? 'Added' : 'Updated'} (Demo)`);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-container" style={{ width: '600px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">{mode === 'add' ? '거래내역 추가' : '거래내역 상세'}</h2>
                    <button className="btn-close-modal" onClick={onClose}>
                        <img src="/src/assets/icon/Close Icon.svg" alt="Close" width="24" height="24" onError={(e) => e.target.style.display = 'none'} />
                    </button>
                </div>
                <div className="modal-body modal-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', rowGap: '20px' }}>
                    <div className="form-group form-col-span-2" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">거래일자 <span className="required" style={{ color: '#ff4d4f' }}>*</span></label>
                        <input type="date" id="date" className="input-date input-full" style={{ width: '100%' }} value={formData.date} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">입금자명 <span className="required" style={{ color: '#ff4d4f' }}>*</span></label>
                        <InputText
                            id="depositor"
                            width="100%"
                            placeholder="예: 삼성전자"
                            value={formData.depositor}
                            onChange={handleChange}
                            error={errors.depositor}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">승인번호</label>
                        <InputText
                            id="approval"
                            width="100%"
                            placeholder="승인/식별 번호"
                            value={formData.approval}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">입금액</label>
                        <InputText
                            type="number"
                            id="deposit"
                            width="100%"
                            placeholder="0"
                            value={formData.deposit}
                            onChange={handleChange}
                            disabled={!!formData.withdrawal}
                            error={errors.amount}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">출금액</label>
                        <InputText
                            type="number"
                            id="withdrawal"
                            width="100%"
                            placeholder="0"
                            value={formData.withdrawal}
                            onChange={handleChange}
                            disabled={!!formData.deposit}
                            error={errors.amount}
                        />
                    </div>
                    {errors.amount && (
                        <div className="form-col-span-2" style={{ marginTop: '-12px', marginBottom: '-8px', gridColumn: 'span 2' }}>
                            <span className="inline-error" style={{ display: 'block', color: '#ff4d4f', fontSize: '12px' }}>입금액 또는 출금액 중 하나를 입력해주세요.</span>
                        </div>
                    )}
                    <div className="form-group form-col-span-2" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">잔액(원) <span className="required" style={{ color: '#ff4d4f' }}>*</span></label>
                        <InputText
                            type="number"
                            id="balance"
                            width="100%"
                            placeholder="거래 후 잔액 입력"
                            value={formData.balance}
                            onChange={handleChange}
                            error={errors.balance}
                        />
                    </div>
                    <div className="form-group form-col-span-2" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">비고</label>
                        <textarea id="note" className="input-textarea input-full" placeholder="비고 사항 입력" rows="3"
                            style={{ width: '100%', padding: '12px', border: '1px solid #dcdfe2', borderRadius: '8px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Pretendard, sans-serif' }}
                            value={formData.note} onChange={handleChange}></textarea>
                    </div>
                </div>
                <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px', borderTop: '1px solid #f0f2f4', gap: '8px' }}>
                    <button className="btn-footer-close" onClick={onClose}>닫기</button>
                    <button className="btn-primary" onClick={handleSave}
                        style={{ backgroundColor: '#7c4dff', border: 'none', padding: '10px 24px', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function BankTransactions() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // Mock Data
    const transactions = [
        { id: 5, date: '2025-01-10', depositor: 'Samsung Electronics', approval: 'APP-2025-005', deposit: '5,000,000원', withdrawal: '-', balance: '15,000,000원', color: '#3b82f6' },
        { id: 4, date: '2025-01-09', depositor: 'Office Supply Co.', approval: 'WDR-2025-012', deposit: '-', withdrawal: '200,000원', balance: '10,000,000원', color: '#FF4D4F' },
        { id: 3, date: '2025-01-08', depositor: 'LG Electronics', approval: 'APP-2025-003', deposit: '3,000,000원', withdrawal: '-', balance: '10,200,000원', color: '#3b82f6' },
        { id: 2, date: '2025-01-05', depositor: 'Client A', approval: 'APP-2025-001', deposit: '450,000원', withdrawal: '-', balance: '7,200,000원', color: '#3b82f6' },
        { id: 1, date: '2025-01-01', depositor: 'Carry Over', approval: '-', deposit: '6,750,000원', withdrawal: '-', balance: '6,750,000원', color: '#3b82f6' },
    ];

    const handleAdd = () => {
        setModalMode('add');
        setSelectedTransaction(null);
        setIsModalOpen(true);
    };

    const handleRowClick = (item) => {
        setModalMode('edit');
        setSelectedTransaction(item);
        setIsModalOpen(true);
    };

    return (
        <div className="main-content">
            <h1 className="page-title">은행거래내역</h1>

            <div className="filter-bar">
                <div className="filter-group-wrapper">
                    <div className="input-wrapper">
                        <input type="text" className="input-text" placeholder="입금자명 검색" aria-label="Depositor Name" />
                    </div>
                    <button className="btn-search-action">조회하기</button>
                </div>
            </div>

            <div id="section-transaction-history" className="list-section">
                <div className="list-header-controls">
                    <div className="list-count">거래내역 <span className="badge" id="listTotalCount">{transactions.length}</span></div>
                    <div className="list-actions">
                        <button className="btn-outline">EXCEL 다운로드</button>
                        <button className="btn-primary" onClick={handleAdd}
                            style={{ backgroundColor: '#7c4dff', border: 'none', padding: '10px 24px', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                            추가
                        </button>
                    </div>
                </div>

                <div className="list-table-wrapper">
                    <div className="list-header-row bank-history-grid" style={{ display: 'grid', gridTemplateColumns: '110px 1fr 140px 1fr 1fr 1fr', alignItems: 'center', backgroundColor: '#f9fafb', fontSize: '13px', fontWeight: 600, color: '#666', borderBottom: '1px solid #f0f2f4', padding: '12px 10px' }}>
                        <div className="cell-center">거래일자</div>
                        <div className="cell-left">입금자명</div>
                        <div className="cell-center">승인번호</div>
                        <div className="cell-right">입금액</div>
                        <div className="cell-right">출금액</div>
                        <div className="cell-right">잔액(원)</div>
                    </div>

                    {transactions.map(item => (
                        <div key={item.id} className="list-row bank-history-grid" onClick={() => handleRowClick(item)}
                            style={{ display: 'grid', gridTemplateColumns: '110px 1fr 140px 1fr 1fr 1fr', alignItems: 'center', borderBottom: '1px solid #f0f2f4', padding: '12px 10px', backgroundColor: '#fff', cursor: 'pointer' }}>
                            <div className="cell-center">{formatDate(item.date)}</div>
                            <div className="cell-left">{item.depositor}</div>
                            <div className="cell-center">{item.approval}</div>
                            <div className="cell-right" style={{ color: item.deposit !== '-' ? '#3b82f6' : '#ccc', fontWeight: item.deposit !== '-' ? 600 : 400, textAlign: 'right', justifyContent: 'flex-end' }}>{item.deposit}</div>
                            <div className="cell-right" style={{ color: item.withdrawal !== '-' ? '#FF4D4F' : '#ccc', fontWeight: item.withdrawal !== '-' ? 600 : 400, textAlign: 'right', justifyContent: 'flex-end' }}>{item.withdrawal}</div>
                            <div className="cell-right" style={{ textAlign: 'right', justifyContent: 'flex-end' }}>{item.balance}</div>
                        </div>
                    ))}
                </div>
            </div>

            <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mode={modalMode} initialData={selectedTransaction} />
        </div>
    );
}
