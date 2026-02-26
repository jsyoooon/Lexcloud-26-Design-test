import React, { useState } from 'react';
import Badge from '../Common/Badge';
import Icon from '../Common/Icon';

/**
 * Certificate Detail Modal Component
 * 
 * Target users: Admin team
 * Purpose: Handling certificate issuance requests, reading details, editing internal fields, resolving or rejecting.
 * Fields: Name, Birthdate, Affiliation, Job, Period, Discharge Date, Issue Text, Issue Date
 * Status: '발급요청' (Request) allows editing fields and resolving/rejecting.
 *         '자동발급', '발급완료', '요청반려' are read-only.
 */
export default function CertificateDetailModal({
    isOpen,
    onClose,
    certificateData,
    onResolve,
    onReject
}) {
    if (!isOpen || !certificateData) return null;

    // Internal editable state for '발급요청' mode
    const [editableFields, setEditableFields] = useState({
        workerName: certificateData.workerName || '',
        birthdate: certificateData.birthdate || '',
        affiliation: certificateData.affiliation || '',
        jobRole: certificateData.jobRole || '',
        period: certificateData.period || '',
        dischargeDate: certificateData.dischargeDate || '',
        issueText: certificateData.issueText || '',
        issueDate: certificateData.issueDate || '',
    });

    const [rejectReason, setRejectReason] = useState('');
    const [showRejectInput, setShowRejectInput] = useState(false);

    const isEditable = certificateData.status === '발급요청';

    const handleFieldChange = (key, value) => {
        setEditableFields(prev => ({ ...prev, [key]: value }));
    };

    const handleResolve = () => {
        onResolve({
            ...certificateData,
            ...editableFields,
            status: '발급완료',
            processor: '현재 접속자(김피엠)', // Dummy processor
            processedDate: new Date().toISOString()
        });
        onClose();
    };

    const handleReject = () => {
        if (!rejectReason.trim()) {
            alert('반려 사유를 입력해주세요.');
            return;
        }
        onReject({
            ...certificateData,
            status: '요청반려',
            processor: '현재 접속자(김피엠)',
            rejectReason: rejectReason,
            processedDate: new Date().toISOString()
        });
        onClose();
    };

    const handlePreview = () => {
        alert('기능 준비 중: PDF 렌더링 미리보기\n' + JSON.stringify(editableFields, null, 2));
    };

    // Render a field row: showing original and input if editable, or just text if readonly.
    const renderField = (label, key, originalValue, editableValue, isFullWidth = false) => {
        const isModified = isEditable && originalValue !== editableValue;

        return (
            <div
                className="form-group"
                style={{ gridColumn: isFullWidth ? '1 / span 2' : 'auto', width: '100%' }}
            >
                <label className="form-label">{label}</label>
                {isEditable ? (
                    <div className="flex flex-col gap-[8px] w-full">
                        <input
                            type="text"
                            value={editableValue}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            className="input-text w-full"
                        />
                        {isModified && (
                            <div className="text-[12px] font-medium text-[var(--Status_03)] leading-[1.5] tracking-[-0.02em]">
                                기존: {originalValue || '-'}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-[14px] font-medium text-[var(--neutral_900)] leading-[1.5] tracking-[-0.02em] p-[12px] rounded-[8px] w-full text-left" style={{ backgroundColor: 'var(--neutral_50)' }}>
                        {originalValue || '-'}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-container standard">
                {/* Header */}
                <div className="modal-header">
                    <h2 className="modal-title flex items-center gap-[8px]">
                        증명서 발급 상세
                        <Badge
                            label={certificateData.status}
                            variant={
                                certificateData.status === '자동발급' || certificateData.status === '발급완료' ? 'info' :
                                    certificateData.status === '발급요청' ? 'warning' : 'danger'
                            }
                        />
                    </h2>
                    <button className="btn-close-modal" onClick={onClose}>
                        <Icon name="close" size={24} />
                    </button>
                </div>

                {/* Body Content - Scrollable */}
                <div className="modal-body custom-scrollbar">

                    {/* Summary Info (Read-only) */}
                    <div className="rounded-[12px] p-[20px] mb-[32px]" style={{ backgroundColor: 'var(--neutral_50)' }}>
                        <h3 className="text-[16px] font-bold text-[var(--neutral_900)] mb-[16px] tracking-tight">요약 정보</h3>
                        <div className="grid grid-cols-2 gap-y-[16px] gap-x-[24px]">
                            <div className="flex flex-col gap-[4px]">
                                <span className="text-[13px] font-medium text-[var(--neutral_500)]">증명서 종류</span>
                                <span className="text-[14px] font-medium text-[var(--neutral_900)]">{certificateData.certType}</span>
                            </div>
                            <div className="flex flex-col gap-[4px]">
                                <span className="text-[13px] font-medium text-[var(--neutral_500)]">신청일 / 발급일</span>
                                <span className="text-[14px] font-medium text-[var(--neutral_900)]">
                                    {certificateData.requestDate} / {certificateData.issueDate || '-'}
                                </span>
                            </div>
                            <div className="flex flex-col gap-[4px]">
                                <span className="text-[13px] font-medium text-[var(--neutral_500)]">작업자 정보</span>
                                <span className="text-[14px] font-medium text-[var(--neutral_900)]">{certificateData.workerName} ({certificateData.workerEmail})</span>
                            </div>
                            <div className="flex flex-col gap-[4px]">
                                <span className="text-[13px] font-medium text-[var(--neutral_500)]">제출처</span>
                                <span className="text-[14px] font-medium text-[var(--neutral_900)]">{certificateData.destination || '-'}</span>
                            </div>
                            {(certificateData.status === '발급완료' || certificateData.status === '요청반려') && (
                                <div className="flex flex-col gap-[4px] col-span-2">
                                    <span className="text-[13px] font-medium text-[var(--neutral_500)]">처리자 정보</span>
                                    <span className="text-[14px] font-medium text-[var(--neutral_900)]">{certificateData.processor} ({certificateData.processedDate})</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Worker Request Reason (Read-only text) */}
                    {certificateData.requestReason && (
                        <div className="mb-[32px]">
                            <h3 className="text-[16px] font-bold text-[var(--neutral_900)] mb-[16px] tracking-tight flex items-center gap-[8px]">
                                작업자 수정/요청 사유
                                <span className="text-[12px] font-medium text-[var(--neutral_500)] bg-[var(--neutral_100)] px-[8px] py-[2px] rounded-full">원문</span>
                            </h3>
                            <div className="p-[16px] bg-[#FEE2E2] bg-opacity-30 rounded-[8px] border border-[#FCA5A5] text-[14px] font-medium text-[var(--neutral_800)] whitespace-pre-wrap leading-[1.6]">
                                {certificateData.requestReason}
                            </div>
                        </div>
                    )}

                    {/* Reject Reason Display if Rejected */}
                    {certificateData.status === '요청반려' && certificateData.rejectReason && (
                        <div className="mb-[32px]">
                            <h3 className="text-[16px] font-bold text-[var(--Status_10)] mb-[16px] tracking-tight flex items-center gap-[8px]">
                                반려 사유
                            </h3>
                            <div className="p-[16px] bg-[var(--Status_10-Subtle)] rounded-[8px] text-[14px] font-medium text-[var(--Status_10)] whitespace-pre-wrap leading-[1.6]">
                                {certificateData.rejectReason}
                            </div>
                        </div>
                    )}


                    {/* Internal Field Editing Area */}
                    <div className="mb-[32px]">
                        <h3 className="text-[16px] font-bold text-[var(--neutral_900)] mb-[16px] tracking-tight">발급 정보 세부 설정</h3>
                        <div className="grid grid-cols-2 gap-x-[24px]">
                            {renderField('성명', 'workerName', certificateData.workerName, editableFields.workerName)}
                            {renderField('생년월일', 'birthdate', certificateData.birthdate, editableFields.birthdate)}
                            {renderField('소속', 'affiliation', certificateData.affiliation, editableFields.affiliation)}
                            {renderField('직무', 'jobRole', certificateData.jobRole, editableFields.jobRole)}
                            {renderField('위촉 기간', 'period', certificateData.period, editableFields.period)}
                            {renderField('해촉일', 'dischargeDate', certificateData.dischargeDate, editableFields.dischargeDate)}
                            {renderField('발급 문구', 'issueText', certificateData.issueText, editableFields.issueText, true)}
                            {renderField('발급일', 'issueDate', certificateData.issueDate, editableFields.issueDate)}
                        </div>
                    </div>

                    {/* Reject Input section conditionally shown */}
                    {showRejectInput && isEditable && (
                        <div className="mb-[32px] p-[16px] bg-[var(--neutral_50)] rounded-[8px] border border-[var(--neutral_200)] animate-fade-in">
                            <h4 className="text-[14px] font-bold text-[var(--neutral_900)] mb-[8px]">반려 사유 입력</h4>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="작업자에게 전달될 반려 사유를 입력하세요. (필수)"
                                className="w-full h-[80px] p-[12px] bg-white border border-[var(--neutral_300)] rounded-[6px] text-[14px] resize-none focus:outline-none focus:border-[var(--Status_10)]"
                            />
                            <div className="flex justify-end gap-[8px] mt-[12px]">
                                <button
                                    onClick={() => setShowRejectInput(false)}
                                    className="px-[16px] py-[8px] text-[13px] font-medium text-[var(--neutral_600)] bg-white border border-[var(--neutral_300)] rounded-[6px] hover:bg-gray-50"
                                >취소</button>
                                <button
                                    onClick={handleReject}
                                    className="px-[16px] py-[8px] text-[13px] font-bold text-white bg-[var(--Status_10)] rounded-[6px] hover:bg-red-600"
                                >반려 확정</button>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                    <button
                        className="btn-outline"
                        style={{ height: '40px', padding: '0 20px' }}
                        onClick={handlePreview}
                    >
                        <Icon name="search" size={16} />
                        미리보기
                    </button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        {isEditable ? (
                            <>
                                <button
                                    className="btn-footer-close"
                                    style={{ color: 'var(--Status_10)', borderColor: 'var(--Status_10)' }}
                                    onClick={() => setShowRejectInput(true)}
                                >수정 불가 (반려)</button>
                                <button
                                    className="btn-primary"
                                    onClick={handleResolve}
                                >발급완료 처리</button>
                            </>
                        ) : (
                            <button
                                className="btn-primary"
                                onClick={onClose}
                            >확인</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
