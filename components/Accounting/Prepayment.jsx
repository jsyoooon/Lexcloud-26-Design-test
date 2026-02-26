import React, { useState, useMemo } from 'react';
import Icon from '../Common/Icon';
import closeIcon from '../../assets/img/icon/Close Icon.svg';
import { formatDate } from '../../utils/dateUtils';

// --- Sub-Components ---

// 1. Adjustment Modal (PM Interaction)
const AdjustmentModal = ({ isOpen, onClose, item, onApply }) => {
    const [status, setStatus] = useState(item?.status || 'scheduled');
    const [amount, setAmount] = useState(item?.used || 0);
    const [reason, setReason] = useState('');

    if (!isOpen || !item) return null;

    const isDeduction = item.type === 'deduction';

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-container" style={{ width: '480px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">내역 상세 및 조정</h2>
                    <button className="btn-close-modal" onClick={onClose}>
                        <img src={closeIcon} alt="Close" width="24" height="24" />
                    </button>
                </div>
                <div className="modal-body">
                    <div className="info-block" style={{ marginBottom: '20px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#9ea4aa', marginBottom: '4px' }}>프로젝트 정보</div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.pName}</div>
                        <div style={{ fontSize: '11px', color: '#9ea4aa' }}>{item.pCode}</div>
                    </div>

                    <div className="form-group-grid" style={{ display: 'grid', gap: '16px' }}>
                        <div className="form-item">
                            <label className="form-label">진행 상태</label>
                            {isDeduction ? (
                                <select className="dropdown" style={{ width: '100%' }} value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="scheduled">차감 예정</option>
                                    <option value="fixed">차감 확정</option>
                                    <option value="hold">차감 보류</option>
                                </select>
                            ) : (
                                <input type="text" className="input-text" value="충전 확정" disabled style={{ width: '100%' }} />
                            )}
                        </div>

                        <div className="form-item">
                            <label className="form-label">금액 조정</label>
                            <input
                                type="number"
                                className="input-text"
                                style={{ width: '100%' }}
                                value={Math.abs(amount)}
                                onChange={(e) => setAmount(isDeduction ? -Math.abs(e.target.value) : Math.abs(e.target.value))}
                                disabled={item.source === 'auto' && item.type === 'charge'}
                            />
                            <p style={{ fontSize: '11px', color: '#9ea4aa', marginTop: '4px' }}>* 자동 생성된 충전 내역은 금액 조정이 불가합니다.</p>
                        </div>

                        <div className="form-item">
                            <label className="form-label">조정 사유 (필수)</label>
                            <textarea
                                className="input-text"
                                style={{ width: '100%', height: '80px', resize: 'none' }}
                                placeholder="금액 조정 또는 상태 변경 사유를 입력하세요."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-footer-close" onClick={onClose}>취소</button>
                    <button
                        className="btn-primary"
                        disabled={!reason && (status !== item.status || amount !== item.used)}
                        onClick={() => onApply({ ...item, status, used: amount, remarks: reason || item.remarks, source: 'manual' })}
                    >
                        수정사항 반영
                    </button>
                </div>
            </div>
        </div>
    );
};

// 2. Add Charge Modal (Exceptional Case for PM)
const AddChargeModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        category: '세금계산서',
        issueDate: new Date().toISOString().split('T')[0],
        payDate: new Date().toISOString().split('T')[0],
        depositAmount: '',
        chargeAmount: '',
        remarks: ''
    });

    if (!isOpen) return null;

    const isReady = formData.category && formData.payDate && formData.chargeAmount > 0;

    const handleSave = () => {
        if (!isReady) return;
        onSave({
            id: Date.now(),
            pCode: '-',
            pName: formData.remarks || `수동 충전(${formData.category})`,
            type: 'charge',
            source: 'manual',
            issueDate: formData.issueDate,
            payDate: formData.payDate,
            amount: Number(formData.chargeAmount),
            used: 0,
            status: 'fixed',
            remarks: formData.remarks,
            regDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });
    };

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-container" style={{ width: '520px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">충전 추가</h2>
                    <button className="btn-close-modal" onClick={onClose}>
                        <img src={closeIcon} alt="Close" width="24" height="24" />
                    </button>
                </div>
                <div className="modal-body" style={{ padding: '24px' }}>
                    {/* Basic Info */}
                    <div style={{ marginBottom: '24px' }}>
                        <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>충전 구분</label>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            {['세금계산서', '현금영수증', '카드', '해외 입금', '기타(이벤트)'].map(cat => (
                                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={formData.category === cat}
                                        onChange={() => setFormData({ ...formData, category: cat })}
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        <div className="form-item">
                            <label className="form-label">발행일 (증빙 기준일)</label>
                            <input
                                type="date"
                                className="input-text"
                                style={{ width: '100%' }}
                                value={formData.issueDate}
                                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                            />
                        </div>
                        <div className="form-item">
                            <label className="form-label">입금일 (실제 완료일)</label>
                            <input
                                type="date"
                                className="input-text"
                                style={{ width: '100%' }}
                                value={formData.payDate}
                                onChange={(e) => setFormData({ ...formData, payDate: e.target.value })}
                            />
                            {formData.payDate < formData.issueDate && (
                                <p style={{ fontSize: '11px', color: 'var(--Primary)', marginTop: '4px' }}>* 입금일이 발행일보다 빠릅니다. (정상 진행 가능)</p>
                            )}
                        </div>
                    </div>

                    {/* Amount Info */}
                    <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '12px', marginBottom: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-item">
                                <label className="form-label">입금액</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="number"
                                        className="input-text"
                                        style={{ width: '100%', paddingRight: '30px' }}
                                        placeholder="0"
                                        value={formData.depositAmount}
                                        onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                                    />
                                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#9ea4aa' }}>원</span>
                                </div>
                            </div>
                            <div className="form-item">
                                <label className="form-label" style={{ color: 'var(--Primary)', fontWeight: 700 }}>충전액 (잔액 반영)</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="number"
                                        className="input-text"
                                        style={{ width: '100%', paddingRight: '30px', borderColor: 'var(--Primary)' }}
                                        placeholder="0"
                                        value={formData.chargeAmount}
                                        onChange={(e) => setFormData({ ...formData, chargeAmount: e.target.value })}
                                    />
                                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: 'var(--Primary)' }}>원</span>
                                </div>
                            </div>
                        </div>
                        {formData.depositAmount !== formData.chargeAmount && formData.chargeAmount > 0 && (
                            <div style={{ marginTop: '12px', padding: '10px', background: '#fff', borderRadius: '6px', border: '1px dashed var(--neutral_300)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--neutral_800)' }}>
                                    <span>차이 금액</span>
                                    <span style={{ fontWeight: 600 }}>{(formData.chargeAmount - formData.depositAmount).toLocaleString()}원</span>
                                </div>
                                <p style={{ fontSize: '11px', color: '#9ea4aa', marginTop: '4px' }}>* 차이 금액은 이벤트/할인/조정 사유로 발생할 수 있습니다.</p>
                            </div>
                        )}
                    </div>

                    {/* Subsidiary Info */}
                    <div className="form-item">
                        <label className="form-label">비고 (사유)</label>
                        <textarea
                            className="input-text"
                            style={{ width: '100%', height: '80px', resize: 'none', padding: '12px' }}
                            placeholder="이벤트명, 계약 조정 사유, 내부 참고사항 등을 입력하세요"
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                        ></textarea>
                    </div>
                </div>

                <div className="modal-footer" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px' }}>
                    <div style={{ textAlign: 'center', padding: '12px', background: '#f4f0ff', borderRadius: '8px', color: 'var(--Primary)', fontSize: '13px', fontWeight: 600 }}>
                        이 충전으로 선결제 잔액이 +{Number(formData.chargeAmount).toLocaleString()}원 증가합니다.
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn-footer-close" onClick={onClose} style={{ flex: 1 }}>취소</button>
                        <button
                            className="btn-primary"
                            style={{ flex: 2 }}
                            disabled={!isReady}
                            onClick={handleSave}
                        >저장</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 3. Manual Deduction Modal (Exceptional Case for PM)
const ManualDeductionModal = ({ isOpen, onClose, onSave, availableBalance }) => {
    const [formData, setFormData] = useState({
        pmName: '홍길동 PM',
        clientContact: '',
        targetProject: null, // {id, name, code, startDate, endDate}
        isNoProject: false,
        reason: '',
        otherReason: '',
        supplyValue: '',
        vatAmount: '',
        deductionAmount: '',
        status: 'fixed',
        remarks: ''
    });

    if (!isOpen) return null;

    const mockProjects = [
        { id: 'P001', name: '갤럭시 S25 매뉴얼 번역', code: 'P-2025-001', startDate: '2025-01-01', endDate: '2025-01-31' },
        { id: 'P002', name: 'UI 가이드라인 업데이트', code: 'P-2025-002', startDate: '2025-01-10', endDate: '2025-02-15' },
    ];

    const isReady = (formData.reason && (formData.reason !== '기타' || formData.otherReason)) && formData.deductionAmount > 0;
    const isOverBalance = formData.deductionAmount > availableBalance;

    const handleAmountChange = (field, value) => {
        const newFormData = { ...formData, [field]: Number(value) };
        if (field === 'supplyValue' || field === 'vatAmount') {
            newFormData.deductionAmount = newFormData.supplyValue + newFormData.vatAmount;
        }
        setFormData(newFormData);
    };

    const handleSave = () => {
        if (!isReady) return;
        if (isOverBalance && !window.confirm('차감액이 사용 가능 잔액보다 큽니다. 계속 진행하시겠습니까?')) return;

        onSave({
            id: Date.now(),
            pCode: formData.isNoProject ? '-' : (formData.targetProject?.code || '-'),
            pName: formData.isNoProject ? (formData.otherReason || formData.reason) : (formData.targetProject?.name || formData.reason),
            type: 'deduction',
            source: 'manual',
            issueDate: new Date().toISOString().split('T')[0],
            payDate: '-',
            amount: 0,
            used: -Number(formData.deductionAmount),
            status: formData.status,
            remarks: formData.remarks || formData.pmName,
            regDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });
    };

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-container" style={{ width: '560px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">수동 차감</h2>
                    <button className="btn-close-modal" onClick={onClose}>
                        <img src={closeIcon} alt="Close" width="24" height="24" />
                    </button>
                </div>
                <div className="modal-body" style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>

                    {/* 1. 차감 책임 정보 */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: 'var(--neutral_900)' }}>1. 차감 책임 정보</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-item">
                                <label className="form-label">담당 PM</label>
                                <input type="text" className="input-text" style={{ width: '100%' }} value={formData.pmName} onChange={(e) => setFormData({ ...formData, pmName: e.target.value })} />
                            </div>
                            <div className="form-item">
                                <label className="form-label">거래처 담당자 (선택)</label>
                                <input type="text" className="input-text" style={{ width: '100%' }} value={formData.clientContact} onChange={(e) => setFormData({ ...formData, clientContact: e.target.value })} placeholder="성함/연락처" />
                            </div>
                        </div>
                    </div>

                    {/* 2. 프로젝트 연계 정보 */}
                    <div style={{ marginBottom: '24px', padding: '16px', background: '#f8f9fa', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--neutral_900)' }}>2. 프로젝트 연계 정보</h3>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={formData.isNoProject} onChange={(e) => setFormData({ ...formData, isNoProject: e.target.checked })} />
                                프로젝트 없음 (조정)
                            </label>
                        </div>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div className="form-item">
                                <label className="form-label">차감 대상 프로젝트</label>
                                <select
                                    className="dropdown"
                                    style={{ width: '100%' }}
                                    disabled={formData.isNoProject}
                                    value={formData.targetProject?.id || ''}
                                    onChange={(e) => {
                                        const p = mockProjects.find(item => item.id === e.target.value);
                                        setFormData({ ...formData, targetProject: p });
                                    }}
                                >
                                    <option value="">프로젝트 선택 (검색)</option>
                                    {mockProjects.map(p => <option key={p.id} value={p.id}>{p.code} | {p.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-item">
                                    <label className="form-label">프로젝트 시작일</label>
                                    <input type="date" className="input-text" style={{ width: '100%' }} disabled={formData.isNoProject} value={formData.targetProject?.startDate || ''} readOnly />
                                </div>
                                <div className="form-item">
                                    <label className="form-label">프로젝트 완료일</label>
                                    <input type="date" className="input-text" style={{ width: '100%' }} disabled={formData.isNoProject} value={formData.targetProject?.endDate || ''} readOnly />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. 차감 사유 */}
                    <div style={{ marginBottom: '24px' }}>
                        <div className="form-item">
                            <label className="form-label">차감 사유 (필수)</label>
                            <select className="dropdown" style={{ width: '100%', marginBottom: formData.reason === '기타' ? '8px' : '0' }} value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })}>
                                <option value="">사유 선택</option>
                                <option value="계약 변경">계약 변경</option>
                                <option value="이벤트 정산">이벤트 정산</option>
                                <option value="내부 조정">내부 조정</option>
                                <option value="클레임 처리">클레임 처리</option>
                                <option value="기타">기타 (직접 입력)</option>
                            </select>
                            {formData.reason === '기타' && (
                                <input type="text" className="input-text" style={{ width: '100%' }} placeholder="상세 사유를 입력하세요" value={formData.otherReason} onChange={(e) => setFormData({ ...formData, otherReason: e.target.value })} />
                            )}
                        </div>
                    </div>

                    {/* 4. 금액 및 회계 정보 */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: 'var(--neutral_900)' }}>3. 금액 및 회계 정보</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <div className="form-item">
                                <label className="form-label">공급가액</label>
                                <input type="number" className="input-text" style={{ width: '100%' }} placeholder="0" value={formData.supplyValue} onChange={(e) => handleAmountChange('supplyValue', e.target.value)} />
                            </div>
                            <div className="form-item">
                                <label className="form-label">부가세액</label>
                                <input type="number" className="input-text" style={{ width: '100%' }} placeholder="0" value={formData.vatAmount} onChange={(e) => handleAmountChange('vatAmount', e.target.value)} />
                            </div>
                            <div className="form-item">
                                <label className="form-label" style={{ color: '#ff4d4f', fontWeight: 700 }}>차감액 (필수)</label>
                                <input type="number" className="input-text" style={{ width: '100%', borderColor: '#ff4d4f' }} placeholder="0" value={formData.deductionAmount} onChange={(e) => handleAmountChange('deductionAmount', e.target.value)} />
                            </div>
                        </div>
                        <div className="form-item">
                            <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>차감 상태</label>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                                    <input type="radio" name="status" checked={formData.status === 'fixed'} onChange={() => setFormData({ ...formData, status: 'fixed' })} />
                                    차감 확정 (즉시 잔액 반영)
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                                    <input type="radio" name="status" checked={formData.status === 'scheduled'} onChange={() => setFormData({ ...formData, status: 'scheduled' })} />
                                    차감 예정
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 5. 비고 */}
                    <div className="form-item">
                        <label className="form-label">비고 (내부 메모)</label>
                        <textarea className="input-text" style={{ width: '100%', height: '60px', resize: 'none', padding: '12px' }} placeholder="내부 운영 참고사항을 입력하세요" value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}></textarea>
                    </div>
                </div>

                <div className="modal-footer" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px' }}>
                    {isOverBalance && (
                        <div style={{ textAlign: 'center', padding: '10px', background: '#fff1f0', borderRadius: '8px', color: '#ff4d4f', fontSize: '12px', border: '1px solid #ffccc7' }}>
                            <Icon name="info" size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                            차감액이 현재 사용 가능 잔액({availableBalance.toLocaleString()}원)보다 큽니다.
                        </div>
                    )}
                    <div style={{ textAlign: 'center', padding: '12px', background: '#f4f0ff', borderRadius: '8px', color: 'var(--Primary)', fontSize: '13px', fontWeight: 600 }}>
                        이 차감으로 선결제 잔액이 -{Number(formData.deductionAmount).toLocaleString()}원 변경됩니다.
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button className="btn-footer-close" onClick={onClose} style={{ flex: 1 }}>취소</button>
                        <button className="btn-primary" style={{ flex: 2, background: 'var(--neutral_900)' }} disabled={!isReady} onClick={handleSave}>차감 저장</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 4. Prepayment Detail View (Refined)
const PrepaymentDetail = ({ item, onBack }) => {
    // Shared state for the workgroup
    const [history, setHistory] = useState([
        { id: 4, pCode: '-', pName: '설 이벤트 리워드 충전', type: 'charge', source: 'manual', issueDate: '2025-01-15', payDate: '2025-01-15', amount: 500000, used: 0, status: 'fixed', remarks: '프로모션', regDate: '2025-01-15 09:00' },
        { id: 3, pCode: 'P-2025-002', pName: 'UI 가이드라인 업데이트', type: 'deduction', source: 'auto', issueDate: '2025-01-14', payDate: '-', amount: 0, used: -1000000, status: 'fixed', remarks: '업무 완료 컴펌', regDate: '2025-01-14 14:20' },
        { id: 2, pCode: 'P-2025-001', pName: '갤럭시 S25 매뉴얼 번역', type: 'deduction', source: 'auto', issueDate: '2025-01-12', payDate: '-', amount: 0, used: -2500000, status: 'scheduled', remarks: '납품 완료 자동 생성', regDate: '2025-01-12 11:30' },
        { id: 1, pCode: '-', pName: '결제 시스템 연동 충전', type: 'charge', source: 'auto', issueDate: '2025-01-10', payDate: '2025-01-10', amount: 10000000, used: 0, status: 'fixed', remarks: 'PG 자동 입금', regDate: '2025-01-10 10:00' },
    ]);

    const [selectedLog, setSelectedLog] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);

    // Summary Calculations (Rule: Available = Total - Fixed)
    const summary = useMemo(() => {
        const totalCharged = history.filter(h => h.type === 'charge').reduce((acc, curr) => acc + curr.amount, 0);
        const scheduledDeduction = Math.abs(history.filter(h => h.status === 'scheduled' && h.type === 'deduction').reduce((acc, curr) => acc + curr.used, 0));
        const fixedDeduction = Math.abs(history.filter(h => h.status === 'fixed' && h.type === 'deduction').reduce((acc, curr) => acc + curr.used, 0));
        const availableBalance = totalCharged - fixedDeduction;

        return { totalCharged, scheduledDeduction, fixedDeduction, availableBalance };
    }, [history]);

    const handleApplyAdjustment = (updatedItem) => {
        setHistory(history.map(h => h.id === updatedItem.id ? updatedItem : h));
        setSelectedLog(null);
    };

    const handleSaveNewCharge = (newLog) => {
        setHistory([newLog, ...history]);
        setIsAddModalOpen(false);
        setIsDeductionModalOpen(false);
        alert('저장되었습니다.');
    };

    return (
        <div className="space-y-6">
            <div className="detail-header-section" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <button className="btn-back-circle" onClick={onBack} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--neutral_300)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Icon name="arrow-left" size={20} color="var(--neutral_900)" />
                </button>
                <h1 className="page-title" style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>작업그룹 상세</h1>
            </div>

            {/* Simplified Basic Info Header (Light Mode) */}
            <div className="detailed-info-card" style={{
                background: 'var(--white)',
                borderRadius: '16px',
                padding: '28px 32px',
                marginBottom: '24px',
                color: 'var(--neutral_900)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid var(--neutral_100)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
            }}>
                <div style={{ display: 'flex', gap: '60px' }}>
                    <div className="info-group">
                        <label style={{ fontSize: '12px', color: '#9ea4aa', marginBottom: '8px', display: 'block', fontWeight: 500 }}>작업그룹</label>
                        <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--neutral_900)' }}>{item.group}</span>
                    </div>
                    <div className="info-group">
                        <label style={{ fontSize: '12px', color: '#9ea4aa', marginBottom: '8px', display: 'block', fontWeight: 500 }}>업체명</label>
                        <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--neutral_900)' }}>{item.company}</span>
                    </div>
                    <div className="info-group">
                        <label style={{ fontSize: '12px', color: '#9ea4aa', marginBottom: '8px', display: 'block', fontWeight: 500 }}>고객분류</label>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--Primary)', background: '#f4f0ff', padding: '4px 12px', borderRadius: '20px' }}>{item.category}</span>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#9ea4aa', marginBottom: '4px', fontWeight: 500 }}>충전 잔액</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--Primary)' }}>{summary.availableBalance.toLocaleString()}원</div>
                </div>
            </div>



            {/* Event Log Table */}
            <div className="list-section">
                <div className="list-header-controls">
                    <div className="list-count" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        충전·차감 내역 <span className="badge">{history.length}</span>
                    </div>
                    <div className="list-actions" style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-outline" onClick={() => setIsAddModalOpen(true)}>
                            <Icon name="plus" size={16} /> 충전 추가
                        </button>
                        <button className="btn-outline"
                            onClick={() => setIsDeductionModalOpen(true)}>
                            -충전 차감
                        </button>
                    </div>
                </div>

                <div className="list-table-wrapper">
                    <div className="list-header-row prepayment-detail-merged-grid">

                        <div className="cell-left">프로젝트</div>
                        <div className="cell-left">구분</div>
                        <div className="cell-left">발행일</div>
                        <div className="cell-left">입금일</div>
                        <div className="cell-right">충전액</div>
                        <div className="cell-right">사용액</div>
                        <div className="cell-left">비고</div>
                        <div className="cell-left">등록일</div>
                    </div>

                    {history.map((log) => (
                        <div key={log.id} className="list-row prepayment-detail-merged-grid"
                            style={{ height: 'auto', padding: '16px 12px', cursor: 'pointer' }}
                            onClick={() => setSelectedLog(log)}>

                            <div className="cell-project">
                                <div className="project-name" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--neutral_900)', lineHeight: 1.4 }}>{log.pName}</div>
                                <div className="project-code" style={{ fontSize: '11px', color: 'var(--neutral_800)', fontFamily: 'Pretendard', marginTop: '2px' }}>{log.pCode}</div>
                            </div>
                            <div className="cell-left">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                                    <span style={{ color: 'var(--neutral_900)', fontWeight: 600, fontSize: '13px' }}>
                                        {log.type === 'charge' ? '충전' : '차감'}
                                    </span>
                                    <span className={`badge - project - status ${log.status === 'fixed' ? 'collected' : log.status === 'scheduled' ? 'processing' : 'uncollected'} `}
                                        style={{
                                            fontSize: '10px',
                                            padding: '1px 6px',
                                            minWidth: 'auto',
                                            background: log.status === 'scheduled' ? 'var(--neutral_100)' : '',
                                            color: log.status === 'scheduled' ? 'var(--neutral_800)' : '',
                                            border: log.status === 'scheduled' ? '1px solid var(--neutral_300)' : '',
                                            borderRadius: '4px',
                                            flexShrink: 0
                                        }}>
                                        {log.status === 'fixed' ? '확정' : log.status === 'scheduled' ? '예정' : '보류'}
                                    </span>
                                </div>
                            </div>
                            <div className="cell-left" style={{ fontSize: '11px', color: '#9ea4aa' }}>{formatDate(log.issueDate)}</div>
                            <div className="cell-left" style={{ fontSize: '11px', color: '#9ea4aa' }}>{formatDate(log.payDate)}</div>
                            <div className="cell-right" style={{ color: 'var(--neutral_900)', fontWeight: 500 }}>{log.amount > 0 ? `${log.amount.toLocaleString()} ` : '-'}</div>
                            <div className="cell-right" style={{ color: 'var(--neutral_900)', fontWeight: 500 }}>{log.used < 0 ? `${log.used.toLocaleString()} ` : '-'}</div>
                            <div className="cell-left" style={{ fontSize: '12px', color: 'var(--neutral_800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.remarks}</div>
                            <div className="cell-left" style={{ fontSize: '11px', color: '#9ea4aa' }}>{formatDate(log.regDate.split(' ')[0])}</div>
                        </div>
                    ))}
                </div>
            </div>

            <AdjustmentModal
                isOpen={!!selectedLog}
                item={selectedLog}
                onClose={() => setSelectedLog(null)}
                onApply={handleApplyAdjustment}
            />

            <AddChargeModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSaveNewCharge}
            />

            <ManualDeductionModal
                isOpen={isDeductionModalOpen}
                availableBalance={summary.availableBalance}
                onClose={() => setIsDeductionModalOpen(false)}
                onSave={handleSaveNewCharge}
            />
        </div>
    );
};

// --- Main Page Component ---
export default function Prepayment() {
    const [view, setView] = useState('list');
    const [activeTab, setActiveTab] = useState('workgroup');
    const [selectedGroup, setSelectedGroup] = useState(null);

    const mockData = [
        { id: 1, company: '삼성전자', group: 'Galaxy S25 Global Launch', category: '법인기업', type: '본사', phone: '02-1234-5678', balance: 12000000 },
        { id: 2, company: 'LG Display', group: 'OLED Specification V3', category: '법인기업', type: '파트너', phone: '02-9876-5432', balance: 50000 },
        { id: 3, company: '현대자동차', group: 'Manual Translation 2025', category: '법인기업', type: '본사', phone: '02-1111-2222', balance: 3500000 },
        { id: 4, company: 'Individual Client', group: 'Personal Paper Research', category: '개인', type: '-', phone: '010-4444-5555', balance: 100000 },
    ];

    const handleRowClick = (item) => {
        setSelectedGroup(item);
        setView('detail');
    };

    if (view === 'detail' && selectedGroup) {
        return <PrepaymentDetail item={selectedGroup} onBack={() => setView('list')} />;
    }

    return (
        <div className="space-y-6">
            <h1 className="page-title">선결제 관리(요청안 확인 후 작업)

            </h1>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <div className={`tab-item ${activeTab === 'workgroup' ? 'active' : ''} `} onClick={() => setActiveTab('workgroup')}>작업그룹별</div>
                <div className={`tab-item ${activeTab === 'enterprise' ? 'active' : ''} `} onClick={() => setActiveTab('enterprise')}>기업별</div>
                <div className={`tab-item ${activeTab === 'member' ? 'active' : ''} `} onClick={() => setActiveTab('member')}>회원별</div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="filter-group-wrapper">
                    <div className="input-wrapper" style={{ width: '280px' }}>
                        <input type="text" className="input-text" style={{ width: '100%' }} placeholder="업체명 검색" />
                    </div>
                    <button className="btn-search-action">조회하기</button>
                </div>
            </div>

            {/* List Table */}
            <div id="section-prepayment-list" className="list-section">
                <div className="list-header-controls">
                    <div className="list-count">
                        {activeTab === 'workgroup' ? '작업그룹 리스트' : activeTab === 'enterprise' ? '기업 리스트' : '회원 리스트'}
                        <span className="badge">{mockData.length}</span>
                    </div>
                    <div className="list-actions">
                        <button className="btn-outline" style={{ gap: '6px' }}>
                            <Icon name="download" size={16} /> EXCEL 다운로드
                        </button>
                    </div>
                </div>

                <div className="list-table-wrapper">
                    <div className="list-header-row prepayment-grid">
                        <div className="cell-left">업체명</div>
                        <div className="cell-left">작업그룹 / 장부명</div>
                        <div className="cell-center">고객분류</div>
                        <div className="cell-center">법인종류</div>
                        <div className="cell-center">대표전화번호</div>
                        <div className="cell-right">잔액(원)</div>
                    </div>

                    {mockData.map((item) => (
                        <div key={item.id} className="list-row prepayment-grid" onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>

                            <div className="cell-left" style={{ fontWeight: 600 }}>{item.company}</div>
                            <div className="cell-left">{item.group}</div>
                            <div className="cell-center">{item.category}</div>
                            <div className="cell-center">{item.type}</div>
                            <div className="cell-center">{item.phone}</div>
                            <div className="cell-right" style={{ fontWeight: 700, color: item.balance < 100000 ? '#ff4d4f' : 'var(--neutral_900)' }}>
                                {item.balance.toLocaleString()}원
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
}
