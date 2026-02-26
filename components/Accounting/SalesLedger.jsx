import React, { useState, useEffect } from 'react';
import Icon from '../Common/Icon';
import { formatDate } from '../../utils/dateUtils';

import closeIcon from '../../assets/img/icon/Close Icon.svg';

import ConfirmationModal from '../Common/ConfirmationModal';
import ToastNotification from '../Common/ToastNotification';

// --- Modal Component ---
const SalesLedgerModal = ({ isOpen, onClose, mode, initialData, onSave, onDelete }) => {
    const [formData, setFormData] = useState({
        date: '',
        clientName: '',
        businessRegNo: '',
        type: '매출',
        account: '매출',
        itemName: '',
        quantity: 1,
        unitPrice: 0,
        supplyValue: 0,
        taxAmount: 0,
        totalAmount: 0,
        remarks: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (mode === 'detail' && initialData) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setFormData({
                    date: initialData.date || new Date().toISOString().split('T')[0],
                    clientName: initialData.client || '',
                    businessRegNo: initialData.businessRegNo || '',
                    type: initialData.type || '매출',
                    account: initialData.account || '매출',
                    itemName: initialData.itemName || '',
                    quantity: initialData.quantity || 1,
                    unitPrice: initialData.unitPrice || 0,
                    supplyValue: initialData.supplyValue || (initialData.quantity * initialData.unitPrice) || 0,
                    taxAmount: initialData.taxAmount || ((initialData.quantity * initialData.unitPrice) * 0.1) || 0,
                    totalAmount: initialData.total || 0,
                    remarks: initialData.remarks || ''
                });
            } else {
                // Add Mode Default
                setFormData({
                    date: new Date().toISOString().split('T')[0],
                    clientName: '',
                    businessRegNo: '',
                    type: '매출',
                    account: '매출',
                    itemName: '',
                    quantity: 1,
                    unitPrice: 0,
                    supplyValue: 0,
                    taxAmount: 0,
                    totalAmount: 0,
                    remarks: ''
                });
            }
        }
    }, [isOpen, mode, initialData]);

    // Auto Calculation
    useEffect(() => {
        const qty = Number(formData.quantity) || 0;
        const price = Number(formData.unitPrice) || 0;
        const supply = qty * price;
        const tax = Math.floor(supply * 0.1);

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(prev => {
            // Only update if values are materially different to avoid loop, 
            // but here we are syncing derived state.
            // We only trigger this if quantity or unitPrice changes.
            // To prevent overwriting manual supply/tax edits if we allowed them, we'd need flags.
            // For now, prompt implies auto-calc is standard.
            if (prev.supplyValue === supply && prev.taxAmount === tax) return prev;
            return {
                ...prev,
                supplyValue: supply,
                taxAmount: tax,
                totalAmount: supply + tax
            };
        });
    }, [formData.quantity, formData.unitPrice]);

    // Calculate Supply Value & Tax based on Total (Manual Override Support)
    useEffect(() => {
        const supplyVal = Math.floor(formData.totalAmount / 1.1);
        const taxVal = formData.totalAmount - supplyVal;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(prev => ({
            ...prev,
            supplyValue: supplyVal,
            taxAmount: taxVal
        }));
    }, [formData.totalAmount]);

    // Calculate Total based on Supply & Tax
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(prev => ({
            ...prev,
            totalAmount: prev.supplyValue + prev.taxAmount
        }));
    }, [formData.supplyValue, formData.taxAmount]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-container" style={{ width: '600px', backgroundColor: 'white', borderRadius: '16px', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                {/* Header */}
                <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 16px', borderBottom: '1px solid #f0f2f4' }}>
                    <h2 className="modal-title" style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>
                        {mode === 'add' ? '매출 항목 추가' : '매출 항목 상세 / 수정'}
                    </h2>
                    <button className="btn-close-modal" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        <img src={closeIcon} alt="Close" width="24" height="24" />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="modal-body" style={{ padding: '24px', overflowY: 'auto' }}>

                    {/* 1. Basic Info */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: 'var(--neutral_900)' }}>기본 정보</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--neutral_700)' }}>
                                    매출일자 <span style={{ color: '#ff4d4f' }}>*</span>
                                </label>
                                <input type="date" name="date" className="input-text" style={{ width: '100%', padding: '10px 12px', border: '1px solid #dcdfe2', borderRadius: '8px' }} value={formData.date} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--neutral_700)' }}>
                                    거래처명 <span style={{ color: '#ff4d4f' }}>*</span>
                                </label>
                                <input type="text" name="clientName" className="input-text" style={{ width: '100%', padding: '10px 12px', border: '1px solid #dcdfe2', borderRadius: '8px' }} placeholder="예: (주)렉스코드" value={formData.clientName} onChange={handleChange} />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label className="form-label" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--neutral_700)' }}>
                                    사업자번호
                                </label>
                                <input type="text" name="businessRegNo" className="input-text" style={{ width: '100%', padding: '10px 12px', border: '1px solid #dcdfe2', borderRadius: '8px' }} placeholder="000-00-00000" value={formData.businessRegNo} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* 2. Classification */}
                    <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: 'var(--neutral_900)' }}>매출 분류 및 금액</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--neutral_700)' }}>유형</label>
                                <div style={{ position: 'relative' }}>
                                    <select name="type" className="input-text" style={{ width: '100%', padding: '10px 36px 10px 12px', border: '1px solid #dcdfe2', borderRadius: '8px', backgroundColor: 'white', appearance: 'none', WebkitAppearance: 'none' }} value={formData.type} onChange={handleChange}>
                                        <option value="매출">매출</option>
                                        <option value="기타미수금">기타미수금</option>
                                        <option value="선수금">선수금</option>
                                    </select>
                                    <Icon name="triangle-down" size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--neutral_700)' }} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--neutral_700)' }}>계정</label>
                                <div style={{ position: 'relative' }}>
                                    <select name="account" className="input-text" style={{ width: '100%', padding: '10px 36px 10px 12px', border: '1px solid #dcdfe2', borderRadius: '8px', backgroundColor: 'white', appearance: 'none', WebkitAppearance: 'none' }} value={formData.account} onChange={handleChange}>
                                        <option value="매출">매출</option>
                                        <option value="제품매출">제품매출</option>
                                        <option value="잡이익">잡이익</option>
                                    </select>
                                    <Icon name="triangle-down" size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--neutral_700)' }} />
                                </div>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label className="form-label" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--neutral_700)' }}>품명</label>
                            <input type="text" name="itemName" className="input-text" style={{ width: '100%', padding: '10px 12px', border: '1px solid #dcdfe2', borderRadius: '8px' }} placeholder="품목명을 입력하세요" value={formData.itemName} onChange={handleChange} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--neutral_700)' }}>수량</label>
                                <input type="number" name="quantity" className="input-text" style={{ width: '100%', padding: '10px 12px', border: '1px solid #dcdfe2', borderRadius: '8px' }} value={formData.quantity} onChange={handleNumberChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--neutral_700)' }}>단가</label>
                                <div style={{ position: 'relative' }}>
                                    <input type="number" name="unitPrice" className="input-text" style={{ width: '100%', padding: '10px 32px 10px 12px', border: '1px solid #dcdfe2', borderRadius: '8px', textAlign: 'right' }} value={formData.unitPrice} onChange={handleNumberChange} />
                                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#999' }}>원</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--neutral_700)' }}>공급가액</label>
                                <div style={{ position: 'relative' }}>
                                    <input type="number" name="supplyValue" className="input-text" style={{ width: '100%', padding: '10px 32px 10px 12px', border: '1px solid #dcdfe2', borderRadius: '8px', textAlign: 'right' }} value={formData.supplyValue} onChange={handleNumberChange} />
                                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#999' }}>원</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--neutral_700)' }}>세액</label>
                                <div style={{ position: 'relative' }}>
                                    <input type="number" name="taxAmount" className="input-text" style={{ width: '100%', padding: '10px 32px 10px 12px', border: '1px solid #dcdfe2', borderRadius: '8px', textAlign: 'right' }} value={formData.taxAmount} onChange={handleNumberChange} />
                                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#999' }}>원</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: 'var(--neutral_900)' }}>합계 (부가세 포함)</label>
                            <div style={{ width: '100%', padding: '12px', border: '1px solid var(--Primary)', borderRadius: '8px', textAlign: 'right', backgroundColor: '#f4f0ff', color: 'var(--Primary)', fontWeight: 700, fontSize: '16px' }}>
                                {formData.totalAmount.toLocaleString()} 원
                            </div>
                        </div>
                    </div>

                    {/* 3. Remarks */}
                    <div className="form-group">
                        <label className="form-label" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--neutral_700)' }}>비고</label>
                        <textarea name="remarks" className="input-text" style={{ width: '100%', padding: '12px', border: '1px solid #dcdfe2', borderRadius: '8px', height: '80px', resize: 'vertical' }} placeholder="메모할 사항을 입력하세요" value={formData.remarks} onChange={handleChange} />
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid #f0f2f4', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    {mode === 'detail' && (
                        <button className="btn-outline" onClick={() => onDelete(initialData.id)} style={{ marginRight: 'auto', borderColor: '#ff4d4f', color: '#ff4d4f' }}>
                            삭제
                        </button>
                    )}
                    <button className="btn-footer-close" onClick={onClose} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #dcdfe2', backgroundColor: 'white', cursor: 'pointer', fontWeight: 600 }}>닫기</button>
                    <button className="btn-primary" onClick={() => onSave(formData)} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#7c4dff', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                        {mode === 'add' ? '저장' : '수정사항 저장'}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function SalesLedger() {
    // ... (Mock Data state)
    const [salesItems, setSalesItems] = useState([
        { id: 1, no: 1045, client: '(주)렉스코드', type: '매출', account: '매출', itemName: '웹사이트 국문 번역 1차', quantity: 1, unitPrice: 2000000, total: 2000000 },
        { id: 2, no: 1044, client: '구글코리아', type: '매출', account: '매출', itemName: '마케팅 영상 자막 번역', quantity: 45, unitPrice: 15000, total: 675000 },
        { id: 3, no: 1043, client: '삼성전자', type: '매출', account: '제품매출', itemName: 'S24 사용자 매뉴얼 (영문)', quantity: 1, unitPrice: 4500000, total: 4500000 },
        { id: 4, no: 1042, client: '(주)렉스코드', type: '매출', account: '매출', itemName: '감수 작업료 (Time Charge)', quantity: 3, unitPrice: 50000, total: 150000 },
        { id: 5, no: 1041, client: 'LG화학', type: '매출', account: '매출', itemName: '특허 명세서 일한 번역', quantity: 120, unitPrice: 35000, total: 4200000 },
        { id: 6, no: 1040, client: '스타트업A', type: '기타미수금', account: '잡이익', itemName: '기술 자문료', quantity: 1, unitPrice: 500000, total: 500000 },
        { id: 7, no: 1039, client: '현대자동차', type: '매출', account: '매출', itemName: '차량 매뉴얼 업데이트', quantity: 1, unitPrice: 1200000, total: 1200000 },
        { id: 8, no: 1038, client: 'SK하이닉스', type: '매출', account: '제품매출', itemName: '반도체 공정 보고서', quantity: 15, unitPrice: 80000, total: 1200000 },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedItem, setSelectedItem] = useState(null);

    const [toast, setToast] = useState({ isVisible: false, message: '' });

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: null,
        onConfirm: null
    });

    const filteredItems = salesItems.filter(item =>
        item.client.includes(searchTerm)
    );

    // Summary Calculations
    const totalCount = filteredItems.length;
    const totalAmount = filteredItems.reduce((sum, item) => sum + item.total, 0);
    const clientCount = new Set(filteredItems.map(item => item.client)).size;

    // Handlers
    const handleRowClick = (item) => {
        setModalMode('detail');
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const showToast = (message) => {
        setToast({ isVisible: true, message });
        setTimeout(() => {
            setToast({ isVisible: false, message: '' });
        }, 3000); // Hide toast after 3s
    };

    const handleSave = (data) => {
        // Optimistic UI update
        if (modalMode === 'add') {
            const newItem = {
                id: Date.now(),
                no: 1046 + salesItems.length,
                client: data.clientName,
                type: data.type,
                account: data.account,
                itemName: data.itemName,
                quantity: data.quantity,
                unitPrice: data.unitPrice,
                total: data.totalAmount
            };
            setSalesItems([newItem, ...salesItems]);
            showToast('새로운 매출 항목이 추가되었습니다.');
        } else {
            setSalesItems(prev => prev.map(item => item.id === selectedItem.id ? {
                ...item,
                client: data.clientName,
                type: data.type,
                account: data.account,
                itemName: data.itemName,
                quantity: data.quantity,
                unitPrice: data.unitPrice,
                total: data.totalAmount
            } : item));
            showToast('매출 항목이 수정되었습니다.');
        }

        // Close modal immediately (or after a delay if preferred, but user complained about 1s close, 
        // so immediate close with a lingering Toast is better UX)
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        setConfirmModal({
            isOpen: true,
            title: '정말 삭제하시겠습니까?',
            onConfirm: () => {
                setSalesItems(prev => prev.filter(item => item.id !== id));
                setIsModalOpen(false);
                setConfirmModal({ isOpen: false, title: '', onConfirm: null });
                showToast('삭제되었습니다.');
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div>
                <h1 className="page-title">매출관리대장</h1>
            </div>

            {/* Summary Section */}
            <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                    background: 'var(--white)',
                    borderRadius: '8px',
                    border: '1px solid var(--neutral_200)',
                    display: 'flex',
                    padding: '12px',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: '4px',
                    flex: '1 0 0'
                }}>
                    <div style={{
                        fontFamily: 'var(--Body_lg_medium_font_family)',
                        fontSize: 'var(--Body_lg_medium_font_size)',
                        fontWeight: 'var(--Body_lg_medium_font_weight)',
                        lineHeight: 'var(--Body_lg_medium_line_height)',
                        letterSpacing: 'var(--Body_lg_medium_letter_spacing)',
                        color: 'var(--neutral_800)'
                    }}>총 매출 건수</div>
                    <div style={{
                        fontFamily: 'var(--Heading_Desktop_md_semibold_font_family)',
                        fontSize: 'var(--Heading_Desktop_md_semibold_font_size)',
                        fontWeight: 'var(--Heading_Desktop_md_semibold_font_weight)',
                        lineHeight: 'var(--Heading_Desktop_md_semibold_line_height)',
                        letterSpacing: 'var(--Heading_Desktop_md_semibold_letter_spacing)',
                        color: 'var(--neutral_900)'
                    }}>
                        {totalCount}<span style={{ fontSize: '16px', fontWeight: 400, marginLeft: '4px' }}>건</span>
                    </div>
                </div>
                <div style={{
                    background: 'var(--white)',
                    borderRadius: '8px',
                    border: '1px solid var(--neutral_200)',
                    display: 'flex',
                    padding: '12px',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: '4px',
                    flex: '1 0 0'
                }}>
                    <div style={{
                        fontFamily: 'var(--Body_lg_medium_font_family)',
                        fontSize: 'var(--Body_lg_medium_font_size)',
                        fontWeight: 'var(--Body_lg_medium_font_weight)',
                        lineHeight: 'var(--Body_lg_medium_line_height)',
                        letterSpacing: 'var(--Body_lg_medium_letter_spacing)',
                        color: 'var(--neutral_800)'
                    }}>총 매출 금액</div>
                    <div style={{
                        fontFamily: 'var(--Heading_Desktop_md_semibold_font_family)',
                        fontSize: 'var(--Heading_Desktop_md_semibold_font_size)',
                        fontWeight: 'var(--Heading_Desktop_md_semibold_font_weight)',
                        lineHeight: 'var(--Heading_Desktop_md_semibold_line_height)',
                        letterSpacing: 'var(--Heading_Desktop_md_semibold_letter_spacing)',
                        color: 'var(--neutral_900)'
                    }}>
                        {totalAmount.toLocaleString()}<span style={{ fontSize: '16px', fontWeight: 400, marginLeft: '4px' }}>원</span>
                    </div>
                </div>
                <div style={{
                    background: 'var(--white)',
                    borderRadius: '8px',
                    border: '1px solid var(--neutral_200)',
                    display: 'flex',
                    padding: '12px',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    gap: '4px',
                    flex: '1 0 0'
                }}>
                    <div style={{
                        fontFamily: 'var(--Body_lg_medium_font_family)',
                        fontSize: 'var(--Body_lg_medium_font_size)',
                        fontWeight: 'var(--Body_lg_medium_font_weight)',
                        lineHeight: 'var(--Body_lg_medium_line_height)',
                        letterSpacing: 'var(--Body_lg_medium_letter_spacing)',
                        color: 'var(--neutral_800)'
                    }}>거래처 수</div>
                    <div style={{
                        fontFamily: 'var(--Heading_Desktop_md_semibold_font_family)',
                        fontSize: 'var(--Heading_Desktop_md_semibold_font_size)',
                        fontWeight: 'var(--Heading_Desktop_md_semibold_font_weight)',
                        lineHeight: 'var(--Heading_Desktop_md_semibold_line_height)',
                        letterSpacing: 'var(--Heading_Desktop_md_semibold_letter_spacing)',
                        color: 'var(--neutral_900)'
                    }}>
                        {clientCount}<span style={{ fontSize: '16px', fontWeight: 400, marginLeft: '4px' }}>곳</span>
                    </div>
                </div>
            </div>

            {/* Filter Bar (Search) */}
            <div className="filter-bar" style={{ marginTop: '36px' }}>
                <div className="filter-group-wrapper">
                    <div className="input-wrapper" style={{ flex: '0 1 320px' }}>
                        <input
                            type="text"
                            className="input-text"
                            style={{ width: '100%' }}
                            placeholder="거래처명을 입력하세요"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-search-action">조회하기</button>
                </div>
            </div>


            {/* List Section */}
            <div className="list-section">
                {/* List Header Controls */}
                <div className="list-header-controls">
                    <div className="list-count">
                        매출 리스트 <span className="count" style={{
                            backgroundColor: 'var(--neutral_100)',
                            color: 'var(--neutral_600)',
                            borderRadius: '12px',
                            padding: '2px 8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            marginLeft: '8px'
                        }}>{filteredItems.length}</span>
                    </div>
                    <div className="list-actions">
                        <button className="btn-outline" onClick={() => setIsModalOpen(true)}>
                            <Icon name="plus" size={16} /> 매출 등록
                        </button>
                        <button className="btn-outline">
                            <Icon name="download" size={16} /> EXCEL 다운로드
                        </button>
                    </div>
                </div>

                <div className="list-table-wrapper">
                    {/* Table Header */}
                    <div
                        className="list-header-row"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '180px 100px 100px 1fr 80px 120px 140px',
                            gap: '12px',
                            padding: '12px 24px'
                        }}
                    >
                        <div className="cell-left">거래처명</div>
                        <div className="cell-center">유형</div>
                        <div className="cell-center">계정</div>
                        <div className="cell-left">품명</div>
                        <div className="cell-right">수량</div>
                        <div className="cell-right">단가</div>
                        <div className="cell-right">합계</div>
                    </div>

                    {/* Table Body */}
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="list-row"
                            onClick={() => handleRowClick(item)}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '180px 100px 100px 1fr 80px 120px 140px',
                                gap: '12px',
                                padding: '16px 24px',
                                borderBottom: '1px solid var(--neutral_100)',
                                cursor: 'pointer',
                                alignItems: 'center'
                            }}
                        >
                            <div className="cell-left" style={{ fontWeight: 600, color: 'var(--neutral_900)' }}>{item.client}</div>
                            <div className="cell-center">
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: item.type === '매출' ? 'var(--blue-50)' : 'var(--neutral_100)',
                                    color: item.type === '매출' ? 'var(--blue-600)' : 'var(--neutral_600)',
                                    fontSize: '12px',
                                    fontWeight: 500
                                }}>
                                    {item.type}
                                </span>
                            </div>
                            <div className="cell-center" style={{ fontSize: '13px', color: 'var(--neutral_800)' }}>{item.account}</div>
                            <div className="cell-left" style={{ fontWeight: 500, color: 'var(--neutral_900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.itemName}
                            </div>
                            <div className="cell-right" style={{ fontSize: '13px', color: 'var(--neutral_800)' }}>{item.quantity.toLocaleString()}</div>
                            <div className="cell-right" style={{ fontSize: '13px', color: 'var(--neutral_800)' }}>{item.unitPrice.toLocaleString()}</div>
                            <div className="cell-right" style={{ fontWeight: 700, fontSize: '14px', color: 'var(--blue-600)' }}>
                                {item.total.toLocaleString()}원
                            </div>
                        </div>
                    ))}

                    {filteredItems.length === 0 && (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--neutral_500)' }}>
                            검색 결과가 없습니다.
                        </div>
                    )}
                </div>
            </div>

            <SalesLedgerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
                initialData={selectedItem}
                onSave={handleSave}
                onDelete={handleDelete}
            />

            <ToastNotification
                isVisible={toast.isVisible}
                message={toast.message}
                onClose={() => setToast({ ...toast, isVisible: false })}
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </div >
    );
}
