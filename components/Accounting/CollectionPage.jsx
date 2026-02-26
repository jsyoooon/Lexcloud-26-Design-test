
import React, { useState, useMemo } from 'react';
import Badge from '../Common/Badge';
import Icon from '../Common/Icon';
import { FilterSelect, FilterDate, FilterText, FilterDateRange, FilterSearch } from '../Common/FilterComponents';
import CollectionDetailModal from './CollectionDetailModal';
import CollectionGroupDetailModal from './CollectionGroupDetailModal';
import { formatDate } from '../../utils/dateUtils';


// Mock Data
const collectionList = [
    { id: 1, project: 'Galaxy S25 Manual Trans', code: '2025-07-20 001', client: 'Samsung Electronics', pm: 'Kim PM', method: '송금', amount: 5000000, type: '발행완료', issuedAt: '2025. 07. 22', date: '-', note: '-', status: 'uncollected', clientGroup: 'Samsung', depositor: '' },
    { id: 2, project: 'Galaxy S25 Marketing', code: '2025-07-20 002', client: 'Samsung Electronics', pm: 'Lee PM', method: '카드', amount: 1200000, type: '미발행', issuedAt: null, date: '2025. 07. 25', note: '마케팅 대금', status: 'collected', clientGroup: 'Samsung', depositor: '홍길동' },
    { id: 3, project: 'OLED TV Update', code: '2025-08-01 001', client: 'LG Electronics', pm: 'Choi PM', method: '현금', amount: 3000000, type: '직접발행', issuedAt: null, date: '-', note: '분할 납부', status: 'uncollected', clientGroup: 'LG', depositor: '' },
    { id: 4, project: 'SKT AI Project v2', code: '2025-08-10 005', client: 'SK Telecom', pm: 'Park PM', method: '송금', amount: 8500000, type: '발행완료', issuedAt: '2025. 08. 12', date: '2025. 08. 15', note: '-', status: 'collected', clientGroup: 'SK', depositor: 'SK텔레콤' },
    { id: 5, project: 'Hyundai Car Interface', code: '2025-09-01 010', client: 'Hyundai Motors', pm: 'Kim PM', method: '충전액', amount: 4200000, type: '발행요청', issuedAt: null, date: '-', note: '-', status: 'uncollected', clientGroup: 'Hyundai', depositor: '' },
    { id: 12, project: 'Musinsa Global Store', code: '2025-12-01 040', client: 'Musinsa', pm: 'Lee PM', method: '카드', amount: 4800000, type: '미발행', issuedAt: null, date: '-', note: '취소 예정', status: 'cancelled', clientGroup: 'Musinsa', depositor: '' },
];

const groupList = [
    {
        id: 'G001', name: '2025-07-24 삼성 1차 정산', createDate: '2025-07-24', payDate: '-', status: 'unpaid',
        client: '삼성전자', items: [
            { id: 'I001', worker: '김작업', client: '삼성전자', projectName: 'Galaxy S25 Manual', projectCode: '2025-07-20 001', method: '계좌이체', amount: 3200000, realAmount: 3200000, proof: '세금계산서', status: 'unpaid', payDate: '-' }
        ]
    },
    {
        id: 'G002', name: '2025-08-05 LG 통합 정산', createDate: '2025-08-05', payDate: '2025-08-10', status: 'paid',
        client: 'LG전자', items: []
    }
];

export default function CollectionPage() {
    const [activeTab, setActiveTab] = useState('collection-list');
    const [selectedIds, setSelectedIds] = useState([]);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [items, setItems] = useState(collectionList);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);

    // Collection Detail Modal State
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Filter State
    const [filters, setFilters] = useState({
        searchType: 'vendor', // Default to 'vendor' (업체명)
        searchKeyword: '',
        dateCriteria: 'all',
        startDate: '',
        endDate: '',
        issueMethod: 'all',
        paymentMethod: 'all',
        status: 'all'
    });
    const [activeFilters, setActiveFilters] = useState({ ...filters });

    const handleFilterChange = (key, value) => {
        setFilters(prev => {
            const newFilters = { ...prev, [key]: value };
            // Special rule: If searchType changes and keyword exists, trigger search
            if (key === 'searchType' && prev.searchKeyword) {
                setActiveFilters(newFilters);
            }
            return newFilters;
        });
    };

    const handleSearch = () => {
        setActiveFilters(filters);
    };


    // Filtered List
    const filteredCollectionList = useMemo(() => {
        return items.filter(item => {
            // 1. Search Filter
            if (activeFilters.searchKeyword) {
                const keyword = activeFilters.searchKeyword.toLowerCase();
                let targetValue = '';
                switch (activeFilters.searchType) {
                    case 'projectCode': targetValue = item.code; break;
                    case 'projectName': targetValue = item.project; break;
                    case 'client': targetValue = item.client; break; // '고객명'
                    case 'vendor': targetValue = item.client; break; // '업체명' -> Map to client for now
                    case 'contractAmount': targetValue = String(item.amount); break;
                    case 'pm': targetValue = item.pm; break;
                    case 'note': targetValue = item.note; break;
                    default: targetValue = '';
                }
                if (!targetValue.toLowerCase().includes(keyword)) return false;
            }

            // 2. Date Filter (Project Period) - Using 'date' (deposit date) or create date? 
            // Mock data has 'date' (입금일). Code has 'code' (contains date-like?).
            // Requirement says "Project Period Filter". Usually this checks Project Start/End or similar.
            // JobFee checks delivery/deadline/workedAt. 
            // CollectionList mock item doesn't have explicit project period. 
            // I will use 'date' (Deposit Date) if criteria is 'deposit' or similar, but req says "Mirror Job Fee" (Delivery/Deadline).
            // But Collection List items don't have delivery/deadline in mock.
            // I'll add 'deliveryDate' to mock logic or just use 'date' for now if they select 'all'.
            // Let's assume 'date' is the primary date for Collection.
            // Wait, "Project Period" usually implies looking at project dates. 
            // If the mock data is limited, I'll skip strict date filtering implementation details or just map to what's available.
            // Let's implement generic logic: if valid date range, check 'date'.
            if (activeFilters.dateCriteria !== 'all' && activeFilters.startDate && activeFilters.endDate) {
                // Placeholder logic as mock data lacks specific date fields for project period
                // Just checking item.date if it exists
                if (item.date !== '-' && item.date) {
                    const itemDate = new Date(item.date); // '2025. 7. 25'
                    const start = new Date(activeFilters.startDate);
                    const end = new Date(activeFilters.endDate);
                    end.setHours(23, 59, 59);
                    if (itemDate < start || itemDate > end) return false;
                }
            }


            // 3. Issuance Method
            if (activeFilters.issueMethod !== 'all' && item.type !== activeFilters.issueMethod) return false;

            // 4. Payment Method
            if (activeFilters.paymentMethod !== 'all' && item.method !== activeFilters.paymentMethod) return false;

            // 5. Status
            if (activeFilters.status !== 'all') {
                if (activeFilters.status === 'uncollected' && item.status !== 'uncollected') return false; // 미결제
                if (activeFilters.status === 'collected' && item.status !== 'collected') return false; // 결제완료
                // 'cancel' logic?
            }

            return true;
        });
    }, [activeFilters, items]);



    // Helper functions


    const toggleSelection = (id) => {
        setSelectedIds(prev => {
            const newSelection = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
            return newSelection;
        });
    };

    const toggleAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredCollectionList.map(i => i.id));
        } else {
            setSelectedIds([]);
        }
    };

    const selectedTotal = useMemo(() => {
        return items.filter(i => selectedIds.includes(i.id)).reduce((sum, i) => sum + i.amount, 0);
    }, [selectedIds, items]);

    // Selection Logic Flags
    const selectedRows = useMemo(() => items.filter(i => selectedIds.includes(i.id)), [selectedIds, items]);
    const hasUncollected = selectedRows.some(i => i.status === 'uncollected');
    const hasCollected = selectedRows.some(i => i.status === 'collected');

    // Handlers for Status Change
    const handleBulkCollect = (finalDate) => {
        if (window.confirm(`선택한 ${selectedIds.length}건을 '결제완료' 처리하시겠습니까?`)) {
            setItems(prev => prev.map(item => {
                if (selectedIds.includes(item.id)) {
                    return { ...item, status: 'collected', date: finalDate.replace(/-/g, '. ') };
                }
                return item;
            }));
            setSelectedIds([]);
            setIsDateModalOpen(false);
            alert('결제 처리되었습니다.');
        }
    };

    const handleBulkUncollect = () => {
        if (window.confirm(`선택한 ${selectedIds.length}건을 '미결제' 처리하시겠습니까?`)) {
            setItems(prev => prev.map(item => {
                if (selectedIds.includes(item.id)) {
                    return { ...item, status: 'uncollected', date: '-' };
                }
                return item;
            }));
            setSelectedIds([]);
            alert('미결제 처리되었습니다.');
        }
    };

    const handleGroupClick = (group) => {
        setSelectedGroup(group);
        setIsGroupModalOpen(true);
    };

    const handleRowClick = (item) => {
        setSelectedItem(item);
        setIsDetailModalOpen(true);
    };

    const handleUpdateItem = (updatedItem) => {
        setItems(prev => prev.map(it => it.id === updatedItem.id ? updatedItem : it));
    };

    return (
        <div className="main-content">
            <h1 className="page-title">수금처리</h1>

            <div className="tab-navigation">
                <div className={`tab-item ${activeTab === 'collection-list' ? 'active' : ''} `} onClick={() => setActiveTab('collection-list')}>수금 처리 리스트</div>
                <div className={`tab-item ${activeTab === 'payment-group-list' ? 'active' : ''} `} onClick={() => setActiveTab('payment-group-list')}>합산그룹 리스트</div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="filter-group-wrapper">
                    {/* 1. Search Filter */}
                    <FilterSearch
                        criteria={filters.searchType}
                        onCriteriaChange={(e) => handleFilterChange('searchType', e.target.value)}
                        criteriaOptions={[
                            { value: 'vendor', label: '업체명' },
                            { value: 'projectCode', label: '프로젝트코드' },
                            { value: 'projectName', label: '프로젝트명' },
                            { value: 'client', label: '고객명' },
                            { value: 'contractAmount', label: '계약금액' },
                            { value: 'pm', label: 'PM' },
                            { value: 'note', label: '비고' }
                        ]}
                        keyword={filters.searchKeyword}
                        onKeywordChange={(e) => handleFilterChange('searchKeyword', e.target.value)}
                        onSubmit={handleSearch}
                    />

                    {/* 2. Project Period Filter - Removed per request */}

                    {/* 3. Issuance Method */}
                    {activeTab === 'collection-list' && (
                        <FilterSelect
                            label="발행방법"
                            value={filters.issueMethod}
                            onChange={(e) => handleFilterChange('issueMethod', e.target.value)}
                            options={[
                                { value: 'all', label: '전체' },
                                { value: '미발행', label: '미발행' },
                                { value: '직접발행', label: '직접발행' },
                                { value: '발행완료', label: '발행완료' },
                                { value: '발행요청', label: '발행요청' }
                            ]}
                        />
                    )}

                    {/* 4. Payment Method */}
                    {activeTab === 'collection-list' && (
                        <FilterSelect
                            label="결제수단"
                            value={filters.paymentMethod}
                            onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                            options={[
                                { value: 'all', label: '전체' },
                                { value: '현금', label: '현금' },
                                { value: '카드', label: '카드' },
                                { value: '충전액', label: '충전액' },
                                { value: '페이팔', label: '페이팔' },
                                { value: '송금', label: '송금' }
                            ]}
                        />
                    )}

                    {/* 5. Status */}
                    <FilterSelect
                        label="상태"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        options={[
                            { value: 'all', label: '전체' },
                            { value: 'uncollected', label: '미결제' }, // Mapped from 'uncollected'
                            { value: 'collected', label: '결제완료' }, // Mapped from 'collected'
                            { value: 'cancelled', label: '취소' }
                        ]}
                    />

                    <button className="btn-search-action" onClick={handleSearch}>조회하기</button>
                </div>
            </div>

            {/* Content Lists */}
            {activeTab === 'collection-list' && (
                <div id="section-collection-list" className="list-section">
                    <div className="list-header-controls">
                        <div className="list-count">수금 리스트 <span className="badge">{filteredCollectionList.length}</span></div>
                        <div className="list-actions">

                            <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Icon name="download" size={16} /> EXCEL 다운로드
                            </button>
                        </div>
                    </div>

                    <div className="list-table-wrapper">
                        {/* Header */}
                        {/* Columns: Check(50) Project(2.5fr) Client(1fr) PM(80) Round(60) Method(100) Amount(1.2fr) Issuance(100) Date(110) Note(1fr) Status(100) */}
                        <div className="list-header-row payment-list-grid" style={{ gridTemplateColumns: '50px 3.5fr 1fr 80px 100px 1.2fr 100px 110px 1fr 100px' }}>
                            <div className="cell-center cell-checkbox">
                                <input type="checkbox" className="custom-checkbox" onChange={toggleAll} checked={selectedIds.length === filteredCollectionList.length && filteredCollectionList.length > 0} />
                            </div>
                            <div className="cell-left">파일명/프로젝트코드</div>
                            <div className="cell-left">업체명</div>
                            <div className="cell-left">PM</div>
                            <div className="cell-center">결제수단</div>
                            <div className="cell-right" style={{ paddingRight: '12px' }}>결제액</div>
                            <div className="cell-center">발행방법</div>
                            <div className="cell-center">입금일</div>
                            <div className="cell-left">비고</div>
                            <div className="cell-center">상태</div>
                        </div>

                        {/* Rows */}
                        {filteredCollectionList.map(item => (
                            <div key={item.id} className="list-row payment-list-grid" style={{ gridTemplateColumns: '50px 3.5fr 1fr 80px 100px 1.2fr 100px 110px 1fr 100px', cursor: 'pointer' }} onClick={() => handleRowClick(item)}>
                                <div className="cell-center cell-checkbox" onClick={(e) => e.stopPropagation()}>
                                    <input type="checkbox" className="custom-checkbox row-checkbox"
                                        checked={selectedIds.includes(item.id)}
                                        onChange={() => toggleSelection(item.id)} />
                                </div>
                                <div className="cell-project">
                                    <div className="project-name">{item.project}</div>
                                    <div className="project-code">{item.code}</div>
                                </div>
                                <div className="cell-left">{item.client}</div>
                                <div className="cell-left">{item.pm}</div>
                                <div className="cell-center">{item.method}</div>
                                <div className="cell-right payment-amount">{item.amount.toLocaleString()}원</div>
                                <div className="cell-center" style={{ flexDirection: 'column', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        color: item.type === '발행완료' ? 'var(--Status_06)' :
                                            item.type === '미발행' ? 'var(--red_600)' :
                                                'var(--neutral_700)'
                                    }}>
                                        {item.type}
                                    </span>
                                    {item.type === '발행완료' && item.issuedAt && (
                                        <div style={{
                                            fontSize: 'var(--Body_sm_regular_font_size)',
                                            color: 'var(--neutral_700)',
                                            letterSpacing: '-0.01em',
                                            textAlign: 'left',
                                            lineHeight: 'var(--Body_sm_regular_line_height)',
                                            marginTop: '2px'
                                        }}>
                                            {formatDate(item.issuedAt)}
                                        </div>
                                    )}
                                </div>
                                <div className="cell-center">{formatDate(item.date)}</div>
                                <div className="cell-left">{item.note}</div>
                                <div className="cell-center">
                                    <Badge
                                        label={item.status === 'collected' ? '결제완료' : '미결제'}
                                        size="S"
                                        variant={item.status === 'collected' ? 'success' : 'danger'}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'payment-group-list' && (
                <div id="section-payment-group" className="list-section">
                    <div className="list-header-controls">
                        <div className="list-count">합산그룹 리스트 <span className="badge">{groupList.length}</span></div>
                        <div className="list-actions">
                            <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Icon name="download" size={16} /> EXCEL 다운로드
                            </button>
                        </div>
                    </div>

                    <div className="list-table-wrapper">
                        {/* Header */}
                        {/* Columns: GroupName(1.2fr) Client(1fr) Amount(1.2fr) Paid(1fr) Balance(1.2fr) Method(1.5fr) Status(100px) */}
                        <div className="list-header-row collection-group-grid" style={{ gridTemplateColumns: '1.2fr 1fr 1.2fr 1fr 1.2fr 1.5fr 100px' }}>
                            <div className="cell-left">그룹명</div>
                            <div className="cell-left">고객명</div>
                            <div className="cell-right">계약금액</div>
                            <div className="cell-right">결제완료</div>
                            <div className="cell-right">잔액(원)</div>
                            <div className="cell-center">수금방식</div>
                            <div className="cell-center">상태</div>
                        </div>

                        {groupList.map((group) => (
                            <React.Fragment key={group.id}>
                                <div className="list-row collection-group-grid"
                                    style={{
                                        gridTemplateColumns: '1.2fr 1fr 1.2fr 1fr 1.2fr 1.5fr 100px',
                                        cursor: 'pointer',
                                        borderBottom: 'none'
                                    }}
                                    onClick={() => handleGroupClick(group)}
                                >
                                    <div className="cell-left" style={{ fontWeight: 600 }}>{group.name}</div>
                                    <div className="cell-left">{group.client}</div>
                                    <div className="cell-right">6,200,000</div>
                                    <div className="cell-right">0</div>
                                    <div className="cell-right" style={{ color: '#FF4D4F', fontWeight: 600 }}>6,200,000</div>
                                    <div className="cell-center" style={{ fontSize: '13px' }}>현금- 세금계산서- 직접발행</div>
                                    <div className="cell-center">
                                        <Badge
                                            label={group.status === 'paid' ? '결제완료' : '미결제'}
                                            size="S"
                                            variant={group.status === 'paid' ? 'success' : 'danger'}
                                        />
                                    </div>
                                </div>
                                <div className="expansion-row" style={{ backgroundColor: 'var(--neutral_50)', padding: '0 24px 16px 24px', borderBottom: '1px solid var(--neutral_200)' }}>
                                    <div style={{ borderTop: '1px solid var(--neutral_200)', paddingTop: '12px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 3fr', gap: '24px', padding: '12px 20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid var(--neutral_200)' }}>
                                            <div>
                                                <div style={{ fontSize: '12px', color: 'var(--neutral_500)', marginBottom: '4px', fontWeight: 500 }}>프로젝트코드</div>
                                                <div style={{ fontSize: '13px', color: 'var(--neutral_800)', lineHeight: '1.6' }}>
                                                    {group.items.length > 0 ? group.items.map(item => <div key={item.projectCode}>{item.projectCode}</div>) : 'P20260205-029'}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '12px', color: 'var(--neutral_500)', marginBottom: '4px', fontWeight: 500 }}>프로젝트명</div>
                                                <div style={{ fontSize: '13px', color: 'var(--neutral_800)', lineHeight: '1.6' }}>
                                                    {group.items.length > 0 ? group.items.map(item => <div key={item.projectName}>{item.projectName}</div>) : '2026-01_4w_michelin_why-michelin-sell-in-kit_kam-d'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {/* Selection Bar */}
            {selectedIds.length > 0 && (
                <div id="paymentSelectionBar" className="selection-bar active">
                    <div className="sb-left">
                        <div className="sb-info-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span className="sb-count" style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                                <strong>{selectedIds.length}</strong>건 선택
                            </span>
                            <button className="btn-text" onClick={() => { setSelectedIds([]); setIsDateModalOpen(false); }} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textDecoration: 'underline', border: 'none', background: 'none', padding: 0, cursor: 'pointer', height: 'auto' }}>선택 해제</button>
                        </div>
                        <span className="sb-divider"></span>
                        <div className="sb-total-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span className="sb-label" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>총 결제액</span>
                            <span className="sb-total-value" style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{selectedTotal.toLocaleString()}원</span>
                        </div>
                    </div>

                    <div className="sb-right">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {hasCollected && (
                                <button
                                    className="btn-danger"
                                    style={{ height: '36px', padding: '0 20px', borderRadius: '8px', background: '#FF4D4F', border: 'none', color: '#fff', fontWeight: 600 }}
                                    onClick={handleBulkUncollect}
                                >
                                    미결제 처리
                                </button>
                            )}
                            {hasUncollected && (
                                <button
                                    className="btn-primary"
                                    style={{ height: '36px', padding: '0 24px', borderRadius: '8px' }}
                                    onClick={() => setIsDateModalOpen(true)}
                                >
                                    결제 처리
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            <PaymentDateModal
                isOpen={isDateModalOpen}
                onClose={() => setIsDateModalOpen(false)}
                onConfirm={handleBulkCollect}
                count={selectedIds.length}
            />

            <CollectionGroupDetailModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} groupData={selectedGroup} />

            <CollectionDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                data={selectedItem}
                onSave={handleUpdateItem}
            />
        </div>
    );
}

// Payment Date Selection Modal
function PaymentDateModal({ isOpen, onClose, onConfirm, count }) {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000
        }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                width: '360px', padding: '24px',
                backgroundColor: 'white', borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                display: 'flex', flexDirection: 'column', gap: '20px'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--neutral_900)' }}>결제 처리 확인</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--neutral_600)' }}>선택한 {count}건의 실입금일을 확인해주세요.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--neutral_700)' }}>입금일</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                        style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--neutral_300)', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <button onClick={onClose} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--neutral_300)', backgroundColor: '#fff', color: 'var(--neutral_700)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>취소</button>
                    <button onClick={() => onConfirm(date)} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--Primary)', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>결제 완료</button>
                </div>
            </div>
        </div>
    );
}
