import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Badge from '../Common/Badge';
import Pagination from '../Common/Pagination';
import { FilterSelect, FilterDateRange, FilterSearch } from '../Common/FilterComponents';
import CertificateDetailModal from './CertificateDetailModal';

// Sample Data with diverse statuses and realistic details
// Set dates to be very recent so they appear at the top
const initialCertData = [
    {
        id: 'CRT-2026-0001',
        requestDate: '2026.02.22',
        workerName: '홍길동',
        certType: '경력증명서',
        destination: '금융권 제출용',
        status: '발급요청',
        issueDate: '-',
        processor: '-',
        requestReason: '경력 기간에 현재 진행 중인 프로젝트를 포함해 주세요.',
        birthdate: '1988.05.12',
        affiliation: 'IT 개발 본부',
        jobRole: '시니어 개발자',
        period: '2020.03.01 ~ 현재',
        dischargeDate: '-',
        issueText: '위 사람은 당사의 전문 계약직으로 근무하며 위와 같이 성실히 업무를 수행하였음을 증명합니다.',
        rejectReason: null
    },
    {
        id: 'CRT-2026-0002',
        requestDate: '2026.02.22',
        workerName: '이영희',
        certType: '위촉증명서',
        destination: '비자 발급용',
        status: '자동발급',
        issueDate: '2026.02.22',
        processor: 'System',
        requestReason: null,
        birthdate: '1992.10.24',
        affiliation: '디자인팀',
        jobRole: 'UI/UX 디자이너',
        period: '2023.05.15 ~ 현재',
        dischargeDate: '-',
        issueText: '위 사람은 당사의 프리랜서 디자이너로 위촉되어 활동 중임을 증명합니다.',
        rejectReason: null
    },
    {
        id: 'CRT-2026-0003',
        requestDate: '2026.02.21',
        workerName: '김철수',
        certType: '경력증명서',
        destination: '경력 증빙용',
        status: '발급완료',
        issueDate: '2026.02.21',
        processor: '박관리',
        requestReason: '퇴직금 정산을 위한 경력 증명',
        birthdate: '1985.03.08',
        affiliation: '운영지원팀',
        jobRole: '운영 총괄',
        period: '2015.01.01 ~ 2026.01.31',
        dischargeDate: '2026.01.31',
        issueText: '위 사람은 위와 같이 당사의 정규직으로 재직하였음을 증명합니다.',
        rejectReason: null
    },
    {
        id: 'CRT-2026-0004',
        requestDate: '2026.02.21',
        workerName: '박지민',
        certType: '해촉증명서',
        destination: '건강보험공단 제출용',
        status: '요청반려',
        issueDate: '-',
        processor: '최승인',
        requestReason: '해촉일자를 1월 31일로 수정 요청',
        birthdate: '1995.12.30',
        affiliation: '교육콘텐츠팀',
        jobRole: '콘텐츠 작가',
        period: '2024.01.01 ~ 2025.12.31',
        dischargeDate: '2025.12.31',
        issueText: '위 사람은 당사의 위촉 계약이 종료되었음을 증명합니다.',
        rejectReason: '해당 작업자는 아직 계약 종료 처리가 완료되지 않아 해촉증명서 발급이 불가능합니다.'
    },
    ...Array.from({ length: 41 }, (_, i) => {
        // Reduce '발급요청' frequency to allow other states to show up more
        const states = ['자동발급', '발급완료', '요청반려', '자동발급', '발급완료', '발급요청'];
        const types = ['경력증명서', '위촉증명서', '해촉증명서'];
        const status = states[i % states.length];
        const idx = i + 5;
        return {
            id: `CRT-2026-${idx.toString().padStart(4, '0')}`,
            requestDate: `2026.02.${(Math.max(1, 18 - (i % 18))).toString().padStart(2, '0')}`,
            workerName: `작업자 ${idx}`,
            certType: types[i % 3],
            destination: i % 2 === 0 ? '은행 제출용' : '개인 확인용',
            status: status,
            issueDate: (status === '자동발급' || status === '발급완료') ? `2026.02.${(Math.max(1, 18 - (i % 18))).toString().padStart(2, '0')}` : '-',
            processor: (status === '발급완료' || status === '요청반려') ? '관리자' : '-',
            requestReason: status === '발급요청' ? '상세 주소 추가 부탁드립니다.' : null,
            birthdate: '1990.01.01',
            affiliation: '프리랜서 그룹',
            jobRole: '번역가',
            period: '2022.01.01 ~ 현재',
            dischargeDate: '-',
            issueText: i % 2 === 0 ? '위 사람은 당사의 프리랜서로 근무 중임을 증명합니다.' : '위 사람은 위와 같이 재직하였음을 증명합니다.',
            rejectReason: status === '요청반려' ? '필수 증빙 서류 부족으로 반려되었습니다.' : null
        };
    })
];

export default function CertificateManagement() {
    const [data, setData] = useState(initialCertData);

    // Filters
    const [statusFilter, setStatusFilter] = useState('전체'); // 전체, 자동발급, 발급요청, 발급완료, 요청반려
    const [typeFilter, setTypeFilter] = useState('전체'); // 전체, 경력증명서, 위촉증명서, 해촉증명서
    const [searchCriteria, setSearchCriteria] = useState('worker'); // worker (작업자명), reason (요청사유)
    const [searchKeyword, setSearchKeyword] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modal State
    const [selectedCert, setSelectedCert] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sorting Logic: Newest date first
    // We remove the strict status-based sorting so that diverse statuses in the mock data (with recent dates) appear together.
    const sortedData = [...data].sort((a, b) => {
        return new Date(b.requestDate.replace(/\./g, '-')) - new Date(a.requestDate.replace(/\./g, '-'));
    });

    // Filtering Logic
    const filteredData = sortedData.filter(item => {
        const matchStatus = statusFilter === '전체' || item.status === statusFilter;
        const matchType = typeFilter === '전체' || item.certType === typeFilter;

        // Search Keyword
        let matchKeyword = true;
        if (searchKeyword.trim() !== '') {
            const kw = searchKeyword.toLowerCase();
            if (searchCriteria === 'worker') {
                matchKeyword = item.workerName.toLowerCase().includes(kw);
            } else if (searchCriteria === 'reason') {
                matchKeyword = item.requestReason?.toLowerCase().includes(kw) || false;
            }
        }

        return matchStatus && matchType && matchKeyword;
    });

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
    const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Handlers
    const openModal = (item) => {
        setSelectedCert(item);
        setIsModalOpen(true);
    };

    const handleResolve = (updatedCert) => {
        setData(prev => prev.map(c => c.id === updatedCert.id ? updatedCert : c));
        // Also could trigger a toast here
    };

    const handleReject = (updatedCert) => {
        setData(prev => prev.map(c => c.id === updatedCert.id ? updatedCert : c));
        // Also could trigger a toast here
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <header>
                <h1 className="page-title">증명서 관리(작업중)</h1>
                <p className="text-[13px] font-medium text-[var(--neutral_500)] -mt-5">관리자 전용 증명서 발급 처리 및 내역을 관리합니다.</p>
            </header>

            {/* Content Section */}
            <div>
                {/* Filter Bar */}
                <div className="filter-bar">
                    <div className="filter-group-wrapper">
                        <FilterSelect
                            label="상태"
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                            options={[
                                { label: '전체', value: '전체' },
                                { label: '자동발급', value: '자동발급' },
                                { label: '발급요청', value: '발급요청' },
                                { label: '발급완료', value: '발급완료' },
                                { label: '요청반려', value: '요청반려' }
                            ]}
                            style={{ width: '130px' }}
                        />

                        <FilterSelect
                            label="증명서 종류"
                            value={typeFilter}
                            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                            options={[
                                { label: '전체', value: '전체' },
                                { label: '경력증명서', value: '경력증명서' },
                                { label: '위촉증명서', value: '위촉증명서' },
                                { label: '해촉증명서', value: '해촉증명서' }
                            ]}
                            style={{ width: '170px' }}
                        />

                        <FilterSearch
                            criteria={searchCriteria}
                            onCriteriaChange={(e) => setSearchCriteria(e.target.value)}
                            criteriaOptions={[
                                { label: '작업자명', value: 'worker' },
                                { label: '요청사유', value: 'reason' }
                            ]}
                            keyword={searchKeyword}
                            onKeywordChange={(e) => { setSearchKeyword(e.target.value); setCurrentPage(1); }}
                            placeholder="검색어 입력"
                            style={{ flex: 1 }}
                        />

                        <button className="btn-search-action" style={{ width: 'auto', padding: '0 20px' }}>
                            조회
                        </button>
                    </div>
                </div>

                {/* Main Content Area (Table) */}
                <div className="list-section">
                    {/* Tools Header */}
                    <div className="list-header-controls">
                        <div className="list-count">
                            증명서 발급 리스트 <span className="badge">{filteredData.length}</span>
                        </div>
                    </div>

                    {/* Table Area - Scrollable */}
                    <div className="list-table-wrapper">
                        {/* Header Row */}
                        <div className="list-header-row" style={{ gridTemplateColumns: '110px 110px 140px 1fr 100px 120px', display: 'grid', alignItems: 'center', columnGap: '12px', padding: '12px' }}>
                            <div className="cell-center">신청일</div>
                            <div className="cell-center">발급일</div>
                            <div className="cell-left">작업자명</div>
                            <div className="cell-left">증명서 종류</div>
                            <div className="cell-center">상태</div>
                            <div className="cell-center">상세 관리</div>
                        </div>

                        {/* Data Rows */}
                        {currentItems.length > 0 ? (
                            currentItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="list-row"
                                    onClick={() => openModal(item)}
                                    style={{
                                        gridTemplateColumns: '110px 110px 140px 1fr 100px 120px',
                                        display: 'grid',
                                        alignItems: 'center',
                                        columnGap: '12px',
                                        padding: '16px 12px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #f0f2f4'
                                    }}
                                >
                                    <div className="cell-center" style={{ fontSize: '13px', color: '#151616' }}>{item.requestDate}</div>
                                    <div className="cell-center" style={{ fontSize: '13px', color: '#9ea4aa' }}>{item.issueDate || '-'}</div>
                                    <div className="cell-left">
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#151616' }}>{item.workerName}</div>
                                    </div>
                                    <div className="cell-left" style={{ fontSize: '13px', color: '#151616' }}>{item.certType}</div>
                                    <div className="cell-center">
                                        <Badge
                                            label={item.status}
                                            size="S"
                                            variant={
                                                item.status === '자동발급' || item.status === '발급완료' ? 'info' :
                                                    item.status === '발급요청' ? 'warning' : 'danger'
                                            }
                                        />
                                    </div>
                                    <div className="cell-center">
                                        <button
                                            className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors whitespace-nowrap ${item.status === '발급요청'
                                                ? 'bg-[var(--neutral_800)] text-white hover:bg-[var(--neutral_900)]'
                                                : 'bg-white border border-[var(--neutral_300)] text-[var(--neutral_700)] hover:bg-[var(--neutral_50)]'
                                                }`}
                                            onClick={(e) => { e.stopPropagation(); openModal(item); }}
                                        >
                                            {item.status === '발급요청' ? '처리하기' : '상세보기'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '120px', textAlign: 'center', color: 'var(--neutral_400)', fontSize: '15px', fontWeight: 500 }}>
                                조회된 증명서 신청 내역이 없습니다.
                            </div>
                        )}
                    </div>

                    {/* Footer Pagination */}
                    <div className="px-6 py-4 border-t border-[var(--neutral_200)] flex justify-center shrink-0">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>

                <CertificateDetailModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    certificateData={selectedCert}
                    onResolve={handleResolve}
                    onReject={handleReject}
                />
            </div>
        </div>
    );
}
