import React, { useState } from 'react'; // Added useState for managing inputs if needed here, or just props
import { FilterSelect, FilterDate, FilterText, FilterDateRange } from '../Common/FilterComponents';

export default function FilterBar({ activeTab, onSearch }) {
    // Local state for demonstration - in real app, these might be lifted or passed as props/context
    const [criteria, setCriteria] = useState('all');
    const [status, setStatus] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [worker, setWorker] = useState('');
    const [workerConfirm, setWorkerConfirm] = useState('all');
    const [currency, setCurrency] = useState('all');

    // For Payment Group tab (simplified)
    // For Payment Group tab
    const [pgStartDate, setPgStartDate] = useState('');
    const [pgEndDate, setPgEndDate] = useState('');

    const handleSearchClick = () => {
        if (onSearch) {
            onSearch({
                criteria,
                status,
                startDate,
                endDate,
                worker,
                workerConfirm,
                currency
            });
        }
    };

    const handlePgSearchClick = () => {
        if (onSearch) {
            onSearch({
                criteria: 'payment-group',
                startDate: pgStartDate,
                endDate: pgEndDate
            });
        }
    }

    if (activeTab === 'payment-group') {
        return (
            <div className="filter-bar">
                <div className="filter-group-wrapper">
                    <FilterDateRange
                        criteria="all" // Or specific criteria for PG if needed, 'all' effectively hides the selector if we don't pass options or handling
                        // Actually JobFee uses FilterDateRange with criteria options. 
                        // If we want identical style, we should probably stick to similar structure.
                        // However, PG list might just need Date Range. 
                        // Let's assume just Date Range for now but using the unified component if possible or just the styling
                        // The user said "Apply same style".
                        // Let's use FilterText for search as well if needed? No, user said "Search Filter".
                        // I will assume they want the Date Range picker style found in Job Fee.
                        criteriaOptions={[{ value: 'created', label: '생성일' }]}
                        startDate={pgStartDate}
                        endDate={pgEndDate}
                        onStartDateChange={(e) => setPgStartDate(e.target.value)}
                        onEndDateChange={(e) => setPgEndDate(e.target.value)}
                    />
                    <button className="btn-search-action" onClick={handlePgSearchClick}>조회하기</button>
                </div>
            </div>
        );
    }

    // Default: Job Fee Filter
    return (
        <div className="filter-bar">
            <div className="filter-group-wrapper">
                {/* 1) & 2) Unified Criteria and Date Range */}
                <FilterDateRange
                    criteria={criteria}
                    onCriteriaChange={(e) => setCriteria(e.target.value)}
                    criteriaOptions={[
                        { value: 'all', label: '기준 날짜' },
                        { value: 'delivery', label: '프로젝트 납품일' },
                        { value: 'deadline', label: '마감일' }
                    ]}
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={(e) => setStartDate(e.target.value)}
                    onEndDateChange={(e) => setEndDate(e.target.value)}
                />

                {/* 3) Status Dropdown */}
                <FilterSelect
                    label="상태"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={[
                        { value: 'all', label: '전체' },
                        { value: 'unpaid', label: '미지급' },
                        { value: 'paid', label: '지급' }
                    ]}
                />

                {/* 3.5) Worker Confirm Dropdown */}
                <FilterSelect
                    label="작업자 컨펌"
                    value={workerConfirm}
                    onChange={(e) => setWorkerConfirm(e.target.value)}
                    options={[
                        { value: 'all', label: '전체' },
                        { value: 'confirmed', label: '확인' },
                        { value: 'unconfirmed', label: '미확인' }
                    ]}
                />

                {/* 3.6) Currency Filter */}
                <FilterSelect
                    label="화폐"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    options={[
                        { value: 'all', label: '전체' },
                        { value: 'KRW', label: '원' },
                        { value: 'USD', label: '$' }
                    ]}
                />

                {/* 4) Worker Input */}
                <FilterText
                    label="검색"
                    placeholder="작업자명 입력"
                    value={worker}
                    onChange={(e) => setWorker(e.target.value)}
                />

                {/* 5) Search Button */}
                <button className="btn-search-action" onClick={handleSearchClick}>조회하기</button>
            </div>
        </div>
    );
}
