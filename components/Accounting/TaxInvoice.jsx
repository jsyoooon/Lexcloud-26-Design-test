import React, { useState } from 'react';
import Badge from '../Common/Badge';
import Icon from '../Common/Icon';
import ConfirmationModal from '../Common/ConfirmationModal';
import { FilterSelect, FilterDate, FilterText, FilterSearch } from '../Common/FilterComponents';
import TaxInvoiceModal from './TaxInvoiceModal';
import { formatDate } from '../../utils/dateUtils';

export default function TaxInvoice() {
    // Tab State
    const [activeTab, setActiveTab] = useState('direct-issuance');

    // Filter States
    const [searchCondition, setSearchCondition] = useState('company_name');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    // Request Filter State
    const [requestStatusFilter, setRequestStatusFilter] = useState('all');

    // Expansion State
    const [expandedRowId, setExpandedRowId] = useState(null);

    // Retry Modal State
    const [isRetryModalOpen, setIsRetryModalOpen] = useState(false);
    const [retryTarget, setRetryTarget] = useState(null);

    // Issue Modal State
    const [showIssueModal, setShowIssueModal] = useState(false);

    // Mock Data
    const [invoices, setInvoices] = useState([
        {
            id: 1,
            date: '2024-01-05',
            approvalNum: '20240105-41000215',
            issueDate: '2024-01-05',
            bizNum: '101-81-12345',
            customer: '(주)A사',
            ceo: '홍길동',
            item: '웹사이트 번역',
            amount: 1000000,
            vat: 100000,
            remark: '',
            email: 'fin@acorp.com',
            code: 'P-001',
            pm: '김PM',
            status: 'success'
        },
        {
            id: 2,
            date: '2024-01-08',
            approvalNum: '',
            issueDate: '',
            bizNum: '202-81-54321',
            customer: 'B테크',
            ceo: '이철수',
            item: '매뉴얼 번역',
            amount: 5000000,
            vat: 500000,
            remark: '긴급 건',
            email: 'acc@btech.co.kr',
            code: 'P-002',
            pm: '이PM',
            status: 'fail'
        },
        {
            id: 3,
            date: '2024-01-11',
            approvalNum: '20240111-99887766',
            issueDate: '2024-01-11',
            bizNum: '333-44-55555',
            customer: 'C유통',
            ceo: '박영희',
            item: '영상 자막',
            amount: 200000,
            vat: 20000,
            remark: '',
            email: 'tax@c-dist.com',
            code: 'P-003',
            pm: '박PM',
            status: 'success'
        },
    ]);

    // Mock Data - Issuance Requests
    const [requests] = useState([
        {
            id: 'REQ-001',
            date: '2024-01-20',
            customer: '(주)스타트업',
            bizNum: '111-22-33333',
            ceo: '김대표',
            email: 'ceo@startup.com',
            item: '번역 필드 테스트',
            amount: 150000,
            vat: 15000,
            code: 'P-100',
            pm: '최PM',
            status: 'pending', // pending, processing, complete, rejected
            reason: '신규 프로젝트 착수금'
        },
        {
            id: 'REQ-002',
            date: '2024-01-19',
            customer: '글로벌Corp',
            bizNum: '999-88-77777',
            ceo: 'Steve',
            email: 'steve@global.com',
            item: '계약서 번역',
            amount: 3000000,
            vat: 300000,
            code: 'P-101',
            pm: '박PM',
            status: 'processing',
            reason: ''
        },
        {
            id: 'REQ-003',
            date: '2024-01-18',
            customer: '디자인랩',
            bizNum: '444-55-66666',
            ceo: '이디자이너',
            email: 'design@lab.kr',
            item: 'UI 텍스트 번역',
            amount: 500000,
            vat: 50000,
            code: 'P-102',
            pm: '김PM',
            status: 'rejected',
            reason: '',
            rejectReason: '사업자등록증 정보 불일치'
        }
    ]);

    // Handlers
    const toggleExpansion = (id) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };

    const handleRetryClick = (inv) => {
        setRetryTarget(inv);
        setIsRetryModalOpen(true);
    };

    const handleConfirmRetry = () => {
        if (!retryTarget) return;

        // processing logic (optimistic update)
        // 1. Set status to 'processing' (not visually defined, so we mock success immediately or mock processing)
        // User requested: "Change status to processing -> Result Success/Fail". 
        // For simple mock, I'll update it to 'success' with a new approval number to show the flow.

        const updatedInvoices = invoices.map(inv => {
            if (inv.id === retryTarget.id) {
                return {
                    ...inv,
                    status: 'success',
                    approvalNum: `RE-${new Date().getTime()}`,
                    issueDate: new Date().toISOString().split('T')[0]
                };
            }
            return inv;
        });

        setInvoices(updatedInvoices);
        setIsRetryModalOpen(false);
        setRetryTarget(null);
    };

    return (
        <div className="space-y-6">
            <h1 className="page-title">세금계산서 발행</h1>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <div
                    className={`tab-item ${activeTab === 'direct-issuance' ? 'active' : ''}`}
                    onClick={() => setActiveTab('direct-issuance')}
                >
                    직접 발행 리스트
                </div>
                <div
                    className={`tab-item ${activeTab === 'issuance-request' ? 'active' : ''}`}
                    onClick={() => setActiveTab('issuance-request')}
                >
                    발행 요청 리스트
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="filter-group-wrapper">
                    {/* Search Group: Condition Select + Input */}
                    <FilterSearch
                        criteria={searchCondition}
                        onCriteriaChange={(e) => setSearchCondition(e.target.value)}
                        criteriaOptions={[
                            { value: 'company_name', label: '상호' },
                            { value: 'ceo_name', label: '대표자명' },
                            { value: 'item_name', label: '품목명' },
                            { value: 'project_code', label: '프로젝트코드' },
                            { value: 'pm_name', label: 'PM' }
                        ]}
                        keyword={searchTerm}
                        onKeywordChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="검색어 입력"
                        style={{ width: '380px' }}
                    />


                    {/* Lookup Button */}
                    <button className="btn-search-action">조회하기</button>
                </div>
            </div>

            {/* Content Area */}
            {activeTab === 'direct-issuance' && (
                <div className="list-section">
                    <div className="list-header-controls">
                        <div className="list-count">
                            발행 내역 <span className="badge">{invoices.length}</span>
                        </div>
                        <div className="list-actions">
                        </div>
                    </div>

                    <div className="list-table-wrapper">
                        {/* Table Header */}
                        <div className="list-header-row tax-invoice-grid">

                            <div className="cell-left">작성일자</div>
                            <div className="cell-left">발급일자</div>
                            <div className="cell-left">사업자번호</div>
                            <div className="cell-left">상호</div>
                            <div className="cell-left">품목명</div>
                            <div className="cell-right">합계금액</div>
                            <div className="cell-right">공급가액</div>
                            <div className="cell-right">세액</div>
                            <div className="cell-center">상태</div>
                        </div>

                        {/* Table Body */}
                        {invoices.map((inv) => (
                            <React.Fragment key={inv.id}>
                                <div
                                    className={`list-row tax-invoice-grid ${inv.status === 'fail' ? 'row-danger' : ''}`}
                                    style={{ borderBottom: expandedRowId === inv.id ? 'none' : '' }}
                                >

                                    <div className="cell-left" style={{ color: 'var(--neutral_700)' }}>{formatDate(inv.date)}</div>
                                    <div className="cell-left" style={{ color: 'var(--neutral_700)' }}>{formatDate(inv.issueDate)}</div>
                                    <div className="cell-left">{inv.bizNum}</div>
                                    <div className="cell-left" style={{ fontWeight: 600 }}>{inv.customer}</div>
                                    <div className="cell-left">{inv.item}</div>
                                    <div className="cell-right" style={{ fontWeight: 600 }}>{(inv.amount + inv.vat).toLocaleString()}원</div>
                                    <div className="cell-right" style={{ fontWeight: 600 }}>{inv.amount.toLocaleString()}</div>
                                    <div className="cell-right" style={{ color: 'var(--neutral_700)' }}>{inv.vat.toLocaleString()}</div>
                                    <div className="cell-right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                            {inv.status === 'fail' ? (
                                                <button
                                                    className="btn-outline"
                                                    style={{ padding: '4px 12px', fontSize: '12px', color: '#FF4D4F', borderColor: '#FF4D4F' }}
                                                    onClick={() => handleRetryClick(inv)}
                                                >
                                                    재시도
                                                </button>
                                            ) : (
                                                <Badge
                                                    label={inv.status === 'success' ? '발행' : '발행실패'}
                                                    size="S"
                                                    variant={inv.status === 'success' ? 'success' : 'danger'}
                                                />
                                            )}
                                        </div>
                                        <button
                                            className={`btn-expand ${expandedRowId === inv.id ? 'expanded' : ''}`}
                                            onClick={() => toggleExpansion(inv.id)}
                                            style={{ flexShrink: 0 }}
                                        >
                                            <Icon name="triangle-down" size={20} color="var(--neutral_700)" />
                                        </button>
                                    </div>
                                </div>
                                {expandedRowId === inv.id && (
                                    <div className="expansion-row">
                                        {/* Row 1: CEO, Email, Code, PM */}
                                        <div className="expansion-grid">
                                            <div className="expansion-item">
                                                <span className="expansion-label">대표자명</span>
                                                <span className="expansion-value">{inv.ceo}</span>
                                            </div>
                                            <div className="expansion-item">
                                                <span className="expansion-label">수신자 이메일</span>
                                                <span className="expansion-value">{inv.email}</span>
                                            </div>
                                            <div className="expansion-item">
                                                <span className="expansion-label">프로젝트코드</span>
                                                <span className="expansion-value">{inv.code}</span>
                                            </div>
                                            <div className="expansion-item">
                                                <span className="expansion-label">견적 담당PM</span>
                                                <span className="expansion-value">{inv.pm}</span>
                                            </div>
                                        </div>

                                        {/* Row 2: Remark */}
                                        <div className="expansion-grid">
                                            <div className="expansion-item" style={{ gridColumn: 'span 4' }}>
                                                <span className="expansion-label">비고</span>
                                                <span className="expansion-value">{inv.remark || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'issuance-request' && (
                <div className="list-section">
                    <div className="list-header-controls">
                        <div className="list-count">
                            요청 내역 <span className="badge">{requests.length}</span>
                        </div>
                        <div className="list-actions"></div>
                    </div>

                    <div className="list-table-wrapper">
                        {/* Table Header */}
                        <div className="list-header-row tax-invoice-grid">
                            <div className="cell-left">작성일자</div>
                            <div className="cell-left">발급일자</div>
                            <div className="cell-left">사업자번호</div>
                            <div className="cell-left">상호</div>
                            <div className="cell-left">품목명</div>
                            <div className="cell-right">합계금액</div>
                            <div className="cell-right">공급가액</div>
                            <div className="cell-right">세액</div>
                            <div className="cell-center">상태</div>
                        </div>

                        {/* Table Body */}
                        {requests.map((req) => (
                            <React.Fragment key={req.id}>
                                <div
                                    className="list-row tax-invoice-grid"
                                    style={{ borderBottom: expandedRowId === req.id ? 'none' : '' }}
                                >
                                    <div className="cell-left" style={{ color: 'var(--neutral_700)' }}>{formatDate(req.date)}</div>
                                    <div className="cell-left" style={{ color: 'var(--neutral_700)' }}>-</div>
                                    <div className="cell-left">{req.bizNum}</div>
                                    <div className="cell-left" style={{ fontWeight: 600 }}>{req.customer}</div>
                                    <div className="cell-left">{req.item}</div>
                                    <div className="cell-right" style={{ fontWeight: 600 }}>{(req.amount + req.vat).toLocaleString()}원</div>
                                    <div className="cell-right" style={{ fontWeight: 600 }}>{req.amount.toLocaleString()}</div>
                                    <div className="cell-right" style={{ color: 'var(--neutral_700)' }}>{req.vat.toLocaleString()}</div>
                                    <div className="cell-right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                            {/* Badge Status */}
                                            <Badge
                                                label={req.status === 'complete' ? '발행완료' : '미발행'}
                                                size="S"
                                                variant={req.status === 'complete' ? 'success' : 'neutral'}
                                            />
                                        </div>
                                        <button
                                            className={`btn-expand ${expandedRowId === req.id ? 'expanded' : ''}`}
                                            onClick={() => toggleExpansion(req.id)}
                                            style={{ flexShrink: 0 }}
                                        >
                                            <Icon name="triangle-down" size={20} color="var(--neutral_700)" />
                                        </button>
                                    </div>
                                </div>
                                {expandedRowId === req.id && (
                                    <div className="expansion-row">
                                        {/* Row 1: CEO, Email, Code, PM */}
                                        <div className="expansion-grid">
                                            <div className="expansion-item">
                                                <span className="expansion-label">대표자명</span>
                                                <span className="expansion-value">{req.ceo}</span>
                                            </div>
                                            <div className="expansion-item">
                                                <span className="expansion-label">수신자 이메일</span>
                                                <span className="expansion-value">{req.email}</span>
                                            </div>
                                            <div className="expansion-item">
                                                <span className="expansion-label">프로젝트코드</span>
                                                <span className="expansion-value">{req.code}</span>
                                            </div>
                                            <div className="expansion-item">
                                                <span className="expansion-label">견적 담당PM</span>
                                                <span className="expansion-value">{req.pm}</span>
                                            </div>
                                        </div>

                                        {/* Row 2: Reason / Remark */}
                                        <div className="expansion-grid">
                                            <div className="expansion-item" style={{ gridColumn: 'span 4' }}>
                                                <span className="expansion-label">비고 / 사유</span>
                                                <span className="expansion-value">{req.reason || req.remark || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {/* Retry Confirmation Modal */}
            <ConfirmationModal
                isOpen={isRetryModalOpen}
                title="세금계산서 발행을 재시도 하시겠습니까?"
                message="이전에 발행에 실패한 세금계산서를 동일한 정보로 다시 발행 시도합니다."
                confirmText="재시도 확정"
                cancelText="취소"
                onConfirm={handleConfirmRetry}
                onClose={() => setIsRetryModalOpen(false)}
            />

            {/* Issue Request Modal */}
            <TaxInvoiceModal
                isOpen={showIssueModal}
                onClose={() => setShowIssueModal(false)}
                onSave={(data) => {
                    console.log('Saved:', data);
                    setShowIssueModal(false);
                }}
            />
        </div>
    );
}
