import React, { useState } from 'react';
import Icon from '../Common/Icon';

export default function TaxInvoiceModal({ isOpen, onClose, data, onSave }) {
    const [issueMode, setIssueMode] = useState('direct'); // direct, request, complete
    const [recipient, setRecipient] = useState({
        bizNum: '',
        subBizNum: '',
        company: '',
        name: '',
        address: '',
        category: '',
        item: '',
        email: ''
    });
    const [billingType, setBillingType] = useState('bill'); // bill, receipt

    if (!isOpen) return null;

    const labelStyle = {
        padding: '8px 12px',
        backgroundColor: '#F9F9FB', // Default gray
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--neutral_900)',
        borderBottom: '1px solid #E5E7EB',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    };

    const pinkLabelStyle = {
        ...labelStyle,
        backgroundColor: '#FFE5E5', // Light pink
    };

    const blueLabelStyle = {
        ...labelStyle,
        backgroundColor: '#E5EBFF', // Light blue
    };

    const inputAreaStyle = {
        padding: '0',
        fontSize: '14px',
        borderBottom: '1px solid #E5E7EB',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff'
    };

    const inputStyle = {
        width: '100%',
        height: '100%',
        padding: '10px 16px',
        border: 'none',
        outline: 'none',
        fontSize: '14px',
        color: 'var(--neutral_900)'
    };

    const disabledInputStyle = {
        ...inputStyle,
        backgroundColor: 'transparent',
        cursor: 'default'
    };

    const radioLabelStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        padding: '6px 12px',
        borderRadius: '20px',
        border: '1px solid #E5E7EB',
        backgroundColor: '#fff'
    };

    const activeRadioLabelStyle = {
        ...radioLabelStyle,
        borderColor: 'var(--Primary)',
        color: 'var(--Primary)'
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="modal-container" style={{
                width: '1000px',
                maxWidth: '100%',
                maxHeight: 'calc(100vh - 40px)',
                backgroundColor: '#fff',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
                {/* Header */}
                <div style={{ padding: '24px 32px', borderBottom: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>세금계산서 발행</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        <Icon name="x" size={24} color="#151616" />
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body custom-scrollbar" style={{ padding: '0 32px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Issuance Mode Selection */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '16px 20px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#151616', minWidth: '80px', textAlign: 'center' }}>발행방법</span>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {[
                                { id: 'direct', label: '직접발행' },
                                { id: 'request', label: '발행요청' },
                                { id: 'complete', label: '발행완료' }
                            ].map((mode) => (
                                <label
                                    key={mode.id}
                                    style={issueMode === mode.id ? activeRadioLabelStyle : radioLabelStyle}
                                >
                                    <input
                                        type="radio"
                                        name="issueMode"
                                        checked={issueMode === mode.id}
                                        onChange={() => setIssueMode(mode.id)}
                                        style={{ accentColor: 'var(--Primary)' }}
                                    />
                                    {mode.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Main Section: Supplier & Recipient Grid */}
                    <div style={{ display: 'flex', border: '1px solid #E5E7EB', borderRadius: '0', overflow: 'hidden' }}>
                        {/* Supplier (공급자) Section */}
                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '40px 100px 1fr 100px 1fr' }}>
                            <div style={{
                                gridRow: 'span 4',
                                backgroundColor: '#FFF0F0',
                                borderRight: '1px solid #E5E7EB',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                writingMode: 'vertical-rl',
                                fontSize: '14px',
                                fontWeight: 700,
                                color: '#151616',
                                letterSpacing: '4px'
                            }}>
                                공 급 자
                            </div>

                            <div style={pinkLabelStyle}>등록번호</div>
                            <div style={{ ...inputAreaStyle, gridColumn: 'span 1' }}>
                                <div style={disabledInputStyle}>214-88-17490</div>
                            </div>
                            <div style={pinkLabelStyle}>종사업장<br />번호</div>
                            <div style={{ ...inputAreaStyle, gridColumn: 'span 1' }}>
                                <div style={disabledInputStyle}></div>
                            </div>

                            <div style={pinkLabelStyle}>상호<br />(법인명)</div>
                            <div style={inputAreaStyle}>
                                <div style={disabledInputStyle}>(주)렉스코드</div>
                            </div>
                            <div style={pinkLabelStyle}>성명</div>
                            <div style={inputAreaStyle}>
                                <div style={disabledInputStyle}>함철용</div>
                            </div>

                            <div style={pinkLabelStyle}>사업장<br />주소</div>
                            <div style={{ ...inputAreaStyle, gridColumn: 'span 3' }}>
                                <div style={disabledInputStyle}>서울특별시 서초구 서초중앙로 41, 6층, 지하1층 (서초동)</div>
                            </div>

                            <div style={pinkLabelStyle}>업태</div>
                            <div style={inputAreaStyle}>
                                <div style={disabledInputStyle}>서비스</div>
                            </div>
                            <div style={pinkLabelStyle}>종목</div>
                            <div style={inputAreaStyle}>
                                <div style={disabledInputStyle}>번역 및 통역</div>
                            </div>
                        </div>

                        {/* Recipient (공급받는 자) Section */}
                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '40px 100px 1fr 100px 1fr', borderLeft: '2px solid #5B6B83' }}>
                            <div style={{
                                gridRow: 'span 5',
                                backgroundColor: '#EBEFFF',
                                borderRight: '1px solid #E5E7EB',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                writingMode: 'vertical-rl',
                                fontSize: '14px',
                                fontWeight: 700,
                                color: '#151616',
                                letterSpacing: '4px'
                            }}>
                                공 급 받 는 자
                            </div>

                            <div style={blueLabelStyle}>등록번호</div>
                            <div style={{ ...inputAreaStyle, gridColumn: 'span 1' }}>
                                <input type="text" style={inputStyle} value={recipient.bizNum} onChange={e => setRecipient({ ...recipient, bizNum: e.target.value })} />
                            </div>
                            <div style={blueLabelStyle}>종사업장<br />번호</div>
                            <div style={{ ...inputAreaStyle, gridColumn: 'span 1' }}>
                                <input type="text" style={inputStyle} value={recipient.subBizNum} onChange={e => setRecipient({ ...recipient, subBizNum: e.target.value })} />
                            </div>

                            <div style={blueLabelStyle}>상호<br />(법인명)</div>
                            <div style={inputAreaStyle}>
                                <input type="text" style={inputStyle} value={recipient.company} onChange={e => setRecipient({ ...recipient, company: e.target.value })} />
                            </div>
                            <div style={blueLabelStyle}>성명</div>
                            <div style={inputAreaStyle}>
                                <input type="text" style={inputStyle} value={recipient.name} onChange={e => setRecipient({ ...recipient, name: e.target.value })} />
                            </div>

                            <div style={blueLabelStyle}>사업장<br />주소</div>
                            <div style={{ ...inputAreaStyle, gridColumn: 'span 3' }}>
                                <input type="text" style={inputStyle} value={recipient.address} onChange={e => setRecipient({ ...recipient, address: e.target.value })} />
                            </div>

                            <div style={blueLabelStyle}>업태</div>
                            <div style={inputAreaStyle}>
                                <input type="text" style={inputStyle} value={recipient.category} onChange={e => setRecipient({ ...recipient, category: e.target.value })} />
                            </div>
                            <div style={blueLabelStyle}>종목</div>
                            <div style={inputAreaStyle}>
                                <input type="text" style={inputStyle} value={recipient.item} onChange={e => setRecipient({ ...recipient, item: e.target.value })} />
                            </div>

                            <div style={blueLabelStyle}>이메일</div>
                            <div style={{ ...inputAreaStyle, gridColumn: 'span 3', flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none' }}>
                                <input type="text" style={inputStyle} value={recipient.email} onChange={e => setRecipient({ ...recipient, email: e.target.value })} />
                                <div style={{ fontSize: '11px', color: '#85888B', padding: '0px 16px 8px' }}>다중메일 입력시 쉼표(,)로 구분지어 입력해주세요.</div>
                            </div>
                        </div>
                    </div>

                    {/* Writing Info Section */}
                    <div style={{ border: '1px solid #E5E7EB', borderBottom: 'none' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(140px, 1fr) 2fr 2fr 2fr' }}>
                            <div style={labelStyle}>작성일자</div>
                            <div style={labelStyle}>공급가액</div>
                            <div style={labelStyle}>세액</div>
                            <div style={{ ...labelStyle, borderRight: 'none' }}>수정사유</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(140px, 1fr) 2fr 2fr 2fr' }}>
                            <div style={{ ...inputAreaStyle, padding: '8px 12px', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '4px', padding: '4px 8px', gap: '8px', cursor: 'pointer' }}>
                                    <span style={{ fontSize: '14px' }}>2026-02-19</span>
                                    <Icon name="calendar" size={16} color="var(--neutral_600)" />
                                </div>
                            </div>
                            <div style={{ ...inputAreaStyle, padding: '8px 12px', justifyContent: 'center', fontSize: '16px', fontWeight: 600 }}>52,704</div>
                            <div style={{ ...inputAreaStyle, padding: '8px 12px', justifyContent: 'center', fontSize: '16px', fontWeight: 600 }}>5,270</div>
                            <div style={{ ...inputAreaStyle, borderRight: 'none' }}>
                                <input type="text" style={inputStyle} />
                            </div>
                        </div>
                    </div>

                    {/* Remarks (비고) Section */}
                    <div style={{ display: 'flex', border: '1px solid #E5E7EB' }}>
                        <div style={{ ...labelStyle, width: '100px', flexShrink: 0, borderBottom: 'none' }}>비고</div>
                        <div style={{ ...inputAreaStyle, flex: 1, borderBottom: 'none', borderRight: 'none' }}>
                            <input type="text" style={inputStyle} />
                        </div>
                    </div>

                    {/* 품목 (Items) Table */}
                    <div style={{ border: '1px solid #E5E7EB', borderBottom: 'none' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 120px 120px 100px', backgroundColor: '#F9F9FB' }}>
                            <div style={labelStyle}>월/일</div>
                            <div style={labelStyle}>품목</div>
                            <div style={labelStyle}>공급가액</div>
                            <div style={labelStyle}>세액</div>
                            <div style={{ ...labelStyle, borderRight: 'none' }}>비고</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 120px 120px 100px' }}>
                            <div style={{ ...inputAreaStyle, justifyContent: 'center' }}>02/19</div>
                            <div style={inputAreaStyle}>
                                <input type="text" value="데이터 사이언스와 빅데이터.xlsx" style={inputStyle} />
                            </div>
                            <div style={inputAreaStyle}>
                                <input type="text" value="52704" style={{ ...inputStyle, textAlign: 'center' }} />
                            </div>
                            <div style={inputAreaStyle}>
                                <input type="text" value="5270" style={{ ...inputStyle, textAlign: 'center' }} />
                            </div>
                            <div style={{ ...inputAreaStyle, borderRight: 'none' }}>
                                <input type="text" style={inputStyle} />
                            </div>
                        </div>
                    </div>

                    {/* Billing/Receipt Radio */}
                    <div style={{ display: 'flex', border: '1px solid #E5E7EB', borderRadius: '4px', alignSelf: 'flex-start' }}>
                        <div style={{ ...labelStyle, width: '100px', borderBottom: 'none', flexShrink: 0 }}>청구</div>
                        <div style={{ display: 'flex', gap: '12px', padding: '8px 24px', backgroundColor: '#fff' }}>
                            {[
                                { id: 'bill', label: '청구' },
                                { id: 'receipt', label: '영수' }
                            ].map((type) => (
                                <label
                                    key={type.id}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}
                                >
                                    <input
                                        type="radio"
                                        name="billingType"
                                        checked={billingType === type.id}
                                        onChange={() => setBillingType(type.id)}
                                        style={{ accentColor: 'var(--Primary)' }}
                                    />
                                    {type.label}
                                </label>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div style={{ padding: '24px 32px', borderTop: 'none', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button onClick={onClose} style={{
                        padding: '10px 24px',
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        backgroundColor: '#fff',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--neutral_700)',
                        cursor: 'pointer'
                    }}>
                        돌아가기
                    </button>
                    <button style={{
                        padding: '10px 32px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#2D354E', // Dark navy as in the image
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}>
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}
