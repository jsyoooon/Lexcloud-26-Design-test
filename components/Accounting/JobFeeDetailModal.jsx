import React from 'react';
import Badge from '../Common/Badge';
import closeIcon from '../../assets/img/icon/Close Icon.svg';
import workerAvatarIcon from '../../assets/icons/⚾️Avatar/Type=Icon, Size=Lg-32px.svg';

// File Icons (16px)
import iconDocx from '../../assets/icons/file/File=Docx, Size=16px.svg';
import iconPdf from '../../assets/icons/file/File=Pdf, Size=16px.svg';
import iconXlsx from '../../assets/icons/file/File=Xlsx, Size=16px.svg';
import iconPptx from '../../assets/icons/file/File=Pptx, Size=16px.svg';
import iconHwp from '../../assets/icons/file/File=Txt, Size=16px.svg'; // Fallback for hwp or others if specific icon missing
import iconDefault from '../../assets/icons/file/File=Txt, Size=16px.svg';

export default function JobFeeDetailModal({ isOpen, onClose, data, onRevertPayment }) {
    if (!isOpen) return null;

    // Helper to get icon by extension
    const getFileIcon = (filename) => {
        if (!filename) return iconDefault;
        const ext = filename.split('.').pop().toLowerCase();
        switch (ext) {
            case 'docx': return iconDocx;
            case 'doc': return iconDocx;
            case 'pdf': return iconPdf;
            case 'xlsx': return iconXlsx;
            case 'xls': return iconXlsx;
            case 'pptx': return iconPptx;
            case 'ppt': return iconPptx;
            case 'hwp': return iconHwp;
            default: return iconDefault;
        }
    };

    // Mock Files Data (Simulating the requested format)
    // If real data has files, use them. Otherwise use this sample.
    // LIMIT TO SINGLE FILE AS REQUESTED
    const allFiles = data?.files || [
        { name: 'Samsung_Manual_v1.docx', info: 'Korean -> English (12,500 words)' },
        { name: 'Project_Specs.pdf', info: 'English -> Korean (3,200 words)' }
    ];
    const files = allFiles.slice(0, 1);

    // Generate dynamic logs based on data
    const logs = [];
    if (data) {
        // 1. Confirmed
        if (data.confirmedAt || data.payStatus === 'confirm_done' || data.payStatus === 'pay_pending' || data.payStatus === 'paid') {
            logs.push({
                status: '작업자 확인',
                time: data.confirmedAt ? `${data.confirmedAt}:00` : '-'
            });
        }
        // 2. Group Created
        if (data.payStatus === 'pay_pending' || data.payStatus === 'paid') {
            const baseDate = data.confirmedAt ? data.confirmedAt.split(' ')[0] : '2026-01-08';
            logs.push({ status: '지급 그룹 생성', time: `${baseDate} 15:00:00` });
        }
        // 3. Paid
        if (data.payStatus === 'paid') {
            logs.push({
                status: '지급 완료',
                time: data.paidAt ? `${data.paidAt}:00` : '-'
            });
        }
    }

    if (logs.length === 0 && data) {
        logs.push({ status: '기록 없음', time: '-' });
    }

    // Money Calculations
    const feeVal = data?.amount || 0;
    const incVal = data?.incentive || 0;
    const totalVal = feeVal + incVal;
    // Tax calculation (only for KRW in this mock logic)
    const actualVal = data?.currency === 'USD' ? totalVal : Math.floor(totalVal * 0.967);

    const formatMoney = (val) => {
        if (data?.currency === 'USD') return `$${val.toLocaleString()}`;
        return `${val.toLocaleString()}원`;
    };

    return (
        <div id="detailModal" className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2 className="modal-title">지급 현황</h2>
                    <button className="btn-close-modal" onClick={onClose} aria-label="Close modal">
                        <img src={closeIcon} alt="Close" width="24" height="24" />
                    </button>
                </div>

                <div className="modal-body" style={{ paddingBottom: 0 }}>
                    {/* Summary Cards */}
                    <div className="pg-summary-grid">
                        <div className="pg-summary-item">
                            <span className="pg-label">기본 작업료</span>
                            <span className="pg-value">{formatMoney(feeVal)}</span>
                        </div>
                        <div className="pg-summary-item">
                            <span className="pg-label">인센티브</span>
                            <span className="pg-value">{formatMoney(incVal)}</span>
                        </div>
                        <div className="pg-summary-divider"></div>
                        <div className="pg-summary-item">
                            <span className="pg-label">총 지급액</span>
                            <span className="pg-value">{formatMoney(totalVal)}</span>
                        </div>
                        <div className="pg-summary-item">
                            <span className="pg-label">실지급액</span>
                            <span className="pg-value highlight">{formatMoney(actualVal)}</span>
                        </div>
                    </div>

                    {/* Worker Info */}
                    <div className="modal-info-block">
                        <div className="modal-info-row">
                            <div className="worker-wrapper">
                                {data?.profileImg ? (
                                    <img src={data.profileImg} alt="profile" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
                                ) : (
                                    <img src={workerAvatarIcon} alt="user" style={{ width: '32px', height: '32px' }} />
                                )}
                                <div className="worker-info-col">
                                    <span className="worker-name-text">{data?.worker || '-'}</span>
                                    <span className="worker-code-text">{data?.code || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Work File Section */}
                    {/* Work File Section */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div className="section-title" style={{ marginBottom: 0 }}>작업 파일</div>
                        {data?.pm && (
                            <Badge label={`담당PM: ${data.pm}`} size="S" variant="neutral" />
                        )}
                    </div>
                    {/* CONTAINER HAS BORDER */}
                    <div className="file-list-container" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--neutral-200)',
                        backgroundColor: 'var(--white)'
                    }}>
                        {files.map((file, index) => (
                            <div key={index} className="file-card" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                // REMOVED INDIVIDUAL BORDER
                            }}>
                                <img src={getFileIcon(file.name)} alt="file-icon" width="16" height="16" />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    {/* File Name Styling */}
                                    <span style={{
                                        color: 'var(--neutral-900)',
                                        fontFamily: 'Pretendard, sans-serif',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        lineHeight: '150%',
                                        letterSpacing: '-0.28px'
                                    }}>
                                        {file.name}
                                    </span>
                                    {/* Language -> Language (Word Count) Styling */}
                                    <span style={{
                                        color: 'var(--neutral-800)',
                                        fontFamily: 'Pretendard, sans-serif',
                                        fontSize: '14px',
                                        fontWeight: 400,
                                        lineHeight: '150%',
                                        letterSpacing: '-0.28px'
                                    }}>
                                        {file.info}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payment Status Logs */}
                    <div className="section-title" style={{ marginTop: '24px', marginBottom: '12px' }}>지급 상태</div>
                    {/* CONTAINER HAS BORDER - Items wrapped in single box */}
                    <div className="modal-logs-box" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid var(--neutral-200)',
                        backgroundColor: 'var(--white)'
                    }}>
                        {logs.length > 0 ? logs.map((log, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                // REMOVED INDIVIDUAL BORDER
                            }}>
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: 'var(--neutral-900)',
                                    fontFamily: 'Pretendard, sans-serif'
                                }}>{log.status}</span>
                                <span style={{
                                    fontSize: '13px',
                                    color: 'var(--Gray_Secondary_text)',
                                    fontFamily: 'Pretendard, sans-serif'
                                }}>{(() => {
                                    if (!log.time || log.time === '-') return '-';
                                    const [dPart, tPart] = log.time.split(' ');
                                    if (!dPart) return log.time;
                                    const parts = dPart.split('-');
                                    if (parts.length < 3) return dPart;
                                    const [y, m, d] = parts;
                                    return `${y}. ${parseInt(m)}. ${parseInt(d)}${tPart ? ' (' + tPart + ')' : ''}`;
                                })()}</span>
                            </div>
                        )) : (
                            <div style={{
                                fontSize: '13px',
                                color: 'var(--neutral-500)',
                                textAlign: 'center',
                                padding: '12px 0'
                            }}>
                                기록된 상태가 없습니다.
                            </div>
                        )}
                    </div>
                </div>

                <div className="modal-footer" style={{ gap: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                    {data?.payStatus === 'paid' && (
                        <button
                            onClick={() => onRevertPayment && onRevertPayment(data.id)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid var(--red_500)',
                                backgroundColor: '#fff',
                                color: 'var(--red_500)',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontFamily: 'Pretendard, sans-serif'
                            }}
                        >
                            지급 취소
                        </button>
                    )}
                    <button className="btn-footer-close" onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
}
