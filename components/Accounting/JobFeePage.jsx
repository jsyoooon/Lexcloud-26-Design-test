import React, { useState, useMemo, useEffect, useRef } from 'react';
import NoticeArea, { EditNoticeModal } from './NoticeArea';
import ConfirmationModal from '../Common/ConfirmationModal';
import FilterBar from './FilterBar';
import JobFeeList from './JobFeeList';
import PaymentGroupList from './PaymentGroupList';
import SelectionBar from './SelectionBar';
import JobFeeDetailModal from './JobFeeDetailModal';
import PaymentGroupDetailModal from './PaymentGroupDetailModal';
import PaymentGroupCreateModal from './PaymentGroupCreateModal';
import ToastNotification from '../Common/ToastNotification';
import AccountingSummary from './AccountingSummary';
import '../../styles/accounting_summary.css';
import Icon from '../Common/Icon';
import Badge from '../Common/Badge';
import { formatDate } from '../../utils/dateUtils';

export default function JobFeePage() {
    const [activeTab, setActiveTab] = useState('job-fee');
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedJobFee, setSelectedJobFee] = useState(null);
    const [isPgModalOpen, setIsPgModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isPgCreateModalOpen, setIsPgCreateModalOpen] = useState(false);
    const [resetKey, setResetKey] = useState(0); // Key to force re-render of List to clear checkboxes

    // Toast State
    const [toast, setToast] = useState({ isVisible: false, message: '', action: null });

    // Notice State
    const [noticeData, setNoticeData] = useState({
        title: '[공지] 작업료 지급 지연 안내',
        start: '2025. 1. 1',
        end: '2025. 1. 7',
        content: '은행 시스템 점검으로 인해 1월 작업료 지급이 1일 지연될 예정입니다. 양해 부탁드립니다.'
    });
    const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);


    // Selection State
    const [selectedCount, setSelectedCount] = useState(0);
    const [selectedTotal, setSelectedTotal] = useState({ KRW: 0, USD: 0 });

    // Initial Mock Data
    // Initial Mock Data with workedAt
    const initialJobFeeRows = [
        { id: 1041, project: 'Mobile_App_UI_Strings_v2.json', code: 'APP_005', worker: '이앱', lang: '한국어→ 영어(미국)', size: '800', amount: 120000, currency: 'KRW', incentive: 0, pm: '남궁렉스', payStatus: 'confirm_pending', workedAt: '2026-01-20', confirmedAt: null, paidAt: null, client: '삼성전자', deadline: '2026-02-05' },
        { id: 1040, project: 'Quarterly_Financial_Report_Q3_2025.xlsx', code: 'FIN_003', worker: '김재무', lang: '한국어→ 영어(미국)', size: '5,500', amount: 700000, currency: 'KRW', incentive: 30000, pm: '남궁렉스', payStatus: 'paid', workedAt: '2026-01-05', confirmedAt: '2026-01-07 14:00', paidAt: '2026-01-08 10:05', client: 'LG전자', deadline: '2026-01-15' },
        { id: 1039, project: 'HR_Training_Video_Script.srt', code: 'HR_002', worker: '박영상', lang: '한국어→ 영어(미국)', size: '1,500', amount: 180000, currency: 'KRW', incentive: 0, pm: '남궁렉스', payStatus: 'confirm_done', workedAt: '2026-01-05', confirmedAt: '2026-01-07 14:22', paidAt: null, client: '현대자동차', deadline: '2026-01-20' },
        { id: 1038, project: 'Patent_Application_Semiconductor.pdf', code: 'PAT_009', worker: '최특허', lang: '한국어→ 영어(미국)', size: '8,000', amount: 1200000, currency: 'KRW', incentive: 50000, pm: '남궁렉스', payStatus: 'pay_pending', workedAt: '2026-01-06', confirmedAt: '2026-01-07 15:00', paidAt: null, client: 'SK하이닉스', deadline: '2026-01-25' },
        { id: 1037, project: 'Tourism_Guide_Seoul_City_Tour.docx', code: 'TOUR_001', worker: '정여행', lang: '한국어→ 영어(미국)', size: '4,200', amount: 480000, currency: 'KRW', incentive: 0, pm: '남궁렉스', payStatus: 'paid', workedAt: '2025-12-28', confirmedAt: '2026-01-06 11:30', paidAt: '2026-01-08 10:05', client: '한국관광공사', deadline: '2026-01-10' },
        { id: 1036, project: 'marketing_content_kr.docx', code: 'P20250000', worker: '김작업', lang: '한국어→ 영어(미국)', size: '2,000', amount: 250000, currency: 'KRW', incentive: 10000, pm: '남궁렉스', payStatus: 'paid', workedAt: '2025-12-30', confirmedAt: '2026-01-06 09:15', paidAt: '2026-01-08 10:05', client: '네이버', deadline: '2026-01-12' },
        { id: 1035, project: 'product_manual_long_version_final_v2.pdf', code: 'PROJECTCODE', worker: '이번역', lang: '한국어→ 영어(미국)', size: '3,500', amount: 300000, currency: 'KRW', incentive: 0, pm: '남궁렉스', payStatus: 'confirm_done', workedAt: '2026-01-08', confirmedAt: '2026-01-08 13:45', paidAt: null, client: '카카오', deadline: '2026-01-18' },
        { id: 1034, project: '[긴 제목 테스트] 프로젝트명이 매우 길어서 두 줄로 넘어가는 경우입니다.', code: 'P20250001', worker: '박검수', lang: '한국어→ 영어(미국)', size: '1,200', amount: 150000, currency: 'KRW', incentive: 5000, pm: '남궁렉스매니저님', payStatus: 'confirm_pending', workedAt: '2026-01-25', confirmedAt: null, paidAt: null, client: '삼성SDS', deadline: '2026-02-10' },
        { id: 1033, project: 'UX_UI_Design_Guide_2025.ppt', code: 'PROJ_UX_001', worker: '최디자인', lang: '한국어→ 영어(미국)', size: '500', amount: 50000, currency: 'KRW', incentive: 0, pm: '남궁렉스', payStatus: 'paid', workedAt: '2025-12-20', confirmedAt: '2026-01-05 16:20', paidAt: '2026-01-08 10:05', client: 'CJ ENM', deadline: '2026-01-08' },
        { id: 1032, project: 'Short_File.txt', code: 'P0000', worker: '김작업', lang: '한국어→ 영어(미국)', size: '100', amount: 10000, currency: 'KRW', incentive: 0, pm: '남궁렉스', payStatus: 'confirm_done', workedAt: '2026-01-08', confirmedAt: '2026-01-08 11:10', paidAt: null, client: '쿠팡', deadline: '2026-01-14' },
        { id: 1031, project: 'Medical_Report_Clinical_Trial_Phase_3.docx', code: 'MED_003', worker: '정의학', lang: '한국어→ 영어(미국)', size: '5,000', amount: 600000, currency: 'KRW', incentive: 20000, pm: '남궁렉스', payStatus: 'confirm_pending', workedAt: '2026-01-15', confirmedAt: null, paidAt: null, client: '셀트리온', deadline: '2026-02-01' },
        { id: 1030, project: '마케팅_브로셔_2025년_상반기_최종안.pdf', code: 'MKT_2025_01', worker: '이마케', lang: '한국어→ 영어(미국)', size: '1,800', amount: 200000, currency: 'KRW', incentive: 0, pm: '남궁렉스', payStatus: 'paid', workedAt: '2025-12-15', confirmedAt: '2026-01-04 10:00', paidAt: '2026-01-08 10:05', client: '아모레퍼시픽', deadline: '2025-12-28' },
        { id: 1029, project: 'Website_Localization_Kr_to_En.xliff', code: 'WEB_LOC_01', worker: '박웹', lang: '한국어→ 영어(미국)', size: '2,200', amount: 250000, currency: 'KRW', incentive: 0, pm: '남궁렉스', payStatus: 'confirm_done', workedAt: '2026-01-08', confirmedAt: '2026-01-08 15:30', paidAt: null, client: '배달의민족', deadline: '2026-01-22' },
        { id: 1028, project: 'Game_Script_Dialogue_Part_1.xlsx', code: 'GAME_001', worker: '최게임', lang: '한국어→ 영어(미국)', size: '4,000', amount: 450000, currency: 'KRW', incentive: 15000, pm: '남궁렉스', payStatus: 'paid', workedAt: '2025-12-10', confirmedAt: '2026-01-03 14:50', paidAt: '2026-01-08 10:05', client: '넥슨', deadline: '2025-12-25' },
        { id: 1027, project: 'Global_Expansion_Plan_v1.docx', code: 'GLB_001', worker: 'John Doe', lang: '영어(미국)→ 한국어', size: '1,000', amount: 200, currency: 'USD', incentive: 0, pm: '남궁렉스', payStatus: 'confirm_pending', workedAt: '2026-01-12', confirmedAt: null, paidAt: null, client: 'Google', deadline: '2026-01-15' },
        { id: 1026, project: 'Tech_Spec_Cloud_Migration.pdf', code: 'TECH_002', worker: 'Jane Smith', lang: '영어(미국)→ 한국어', size: '2,500', amount: 500, currency: 'USD', incentive: 50, pm: '남궁렉스', payStatus: 'confirm_done', workedAt: '2026-01-05', confirmedAt: '2026-01-06 10:00', paidAt: null, client: 'Amazon', deadline: '2026-01-10' },
        { id: 1025, project: 'Marketing_Pitch_Deck_Q1.pptx', code: 'MKT_003', worker: 'John Doe', lang: '영어(미국)→ 한국어', size: '1,200', amount: 300, currency: 'USD', incentive: 0, pm: '남궁렉스', payStatus: 'paid', workedAt: '2025-12-28', confirmedAt: '2026-01-05 09:30', paidAt: '2026-01-08 10:05', client: 'Facebook', deadline: '2026-01-05' },
    ];

    const [jobRows, setJobRows] = useState(initialJobFeeRows);
    const [searchCriteria, setSearchCriteria] = useState(null);

    // Month Selection State
    const [selectedMonth, setSelectedMonth] = useState(''); // YYYY-MM
    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMonthDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Set default month on mount: (Day <= 7) ? Prev Month : Curr Month
    useEffect(() => {
        const now = new Date();
        const currentDay = now.getDate();

        let targetDate = new Date(now);
        if (currentDay <= 7) {
            targetDate.setMonth(targetDate.getMonth() - 1);
        }

        const yyyy = targetDate.getFullYear();
        const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
        setSelectedMonth(`${yyyy}-${mm}`);
    }, []);


    // Helper: Determine Effective Month for a Row based on 7-day cutoff
    const getEffectiveMonth = (row) => {
        // 1. Identify Work Month
        if (!row.workedAt) return null;
        const workDate = new Date(row.workedAt);
        const workYear = workDate.getFullYear();
        const workMonth = workDate.getMonth(); // 0-indexed

        // If not confirmed yet, it belongs to workMonth (until confirmed differently)
        if (!row.confirmedAt) {
            return `${workYear}-${String(workMonth + 1).padStart(2, '0')}`;
        }

        // 2. Check Confirmation Cutoff
        const confirmDate = new Date(row.confirmedAt);

        // Cutoff is the 7th of the NEXT month relative to workDate
        // Example: Worked in Jan. Cutoff is Feb 7th.
        const cutoffDate = new Date(workYear, workMonth + 1, 7, 23, 59, 59);

        // If confirmed AFTER cutoff, it carries over to the next month
        if (confirmDate > cutoffDate) {
            // Simplification: In reality, it might carry over multiple months if confirmed VERY late,
            // but usually it just bumps to the month it fell into or the next available slot.
            // User requirement: "7일 이후 확인된 항목은: 해당 월 집계에서 제외, 다음 월 집계 대상으로 간주"
            // This suggests it moves to Month+1.

            // NOTE: If we want it to move to the month of confirmation, that's different.
            // But strict "Next Month" implies WorkMonth + 1.
            // Let's stick to WorkMonth + 1 for the scope of this rule.

            const nextMonthDate = new Date(workYear, workMonth + 1, 1);
            return `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}`;
        }

        return `${workYear}-${String(workMonth + 1).padStart(2, '0')}`;
    };

    // Filter rows by Selected Month
    const filteredByMonthRows = useMemo(() => {
        if (!selectedMonth) return jobRows;
        return jobRows.filter(row => getEffectiveMonth(row) === selectedMonth);
    }, [jobRows, selectedMonth]);


    // Filter rows by Search Criteria (FilterBar)
    const filteredJobRows = useMemo(() => {
        if (!searchCriteria) return jobRows;

        return jobRows.filter(row => {
            // 1. Worker Confirm Filter
            if (searchCriteria.workerConfirm && searchCriteria.workerConfirm !== 'all') {
                if (searchCriteria.workerConfirm === 'confirmed' && !row.confirmedAt) return false;
                if (searchCriteria.workerConfirm === 'unconfirmed' && row.confirmedAt) return false;
            }

            // 2. Status Filter
            if (searchCriteria.status && searchCriteria.status !== 'all') {
                if (searchCriteria.status === 'paid' && row.payStatus !== 'paid') return false;
                if (searchCriteria.status === 'unpaid' && row.payStatus === 'paid') return false;
            }

            // 3. Worker Name Search
            if (searchCriteria.worker && !row.worker.includes(searchCriteria.worker)) return false;

            // 4. Date Range Filter
            if (searchCriteria.startDate && searchCriteria.endDate) {
                const targetDateStr = row.workedAt;
                if (targetDateStr) {
                    const rowDate = new Date(targetDateStr);
                    const start = new Date(searchCriteria.startDate);
                    const end = new Date(searchCriteria.endDate);
                    end.setHours(23, 59, 59, 999);
                    if (rowDate < start || rowDate > end) return false;
                }
            }

            // 5. Currency Filter
            if (searchCriteria.currency && searchCriteria.currency !== 'all') {
                if (searchCriteria.currency === 'KRW' && row.currency !== 'KRW') return false;
                if (searchCriteria.currency === 'USD' && row.currency !== 'USD') return false;
            }

            return true;
        });
    }, [jobRows, searchCriteria]);

    const handleSearch = (criteria) => {
        setSearchCriteria(criteria);
    };



    const handleRowClick = (row) => {
        setSelectedJobFee(row);
        setIsDetailModalOpen(true);
    };

    // Calculate Summary Stats
    const summaryStats = useMemo(() => {
        const stats = {
            KRW: { unpaid: 0, unpaidCount: 0, payPending: 0, payPendingCount: 0, confirmPending: 0, confirmPendingCount: 0, paid: 0, paidCount: 0 },
            USD: { unpaid: 0, unpaidCount: 0, payPending: 0, payPendingCount: 0, confirmPending: 0, confirmPendingCount: 0, paid: 0, paidCount: 0 }
        };

        filteredByMonthRows.forEach(row => {
            const currency = row.currency || 'KRW';
            const amount = (row.amount || 0) + (row.incentive || 0);
            const isPaid = row.payStatus === 'paid';

            if (!isPaid) {
                stats[currency].unpaid += amount;
                stats[currency].unpaidCount++;
                if (row.confirmedAt) {
                    stats[currency].payPending += amount;
                    stats[currency].payPendingCount++;
                } else {
                    stats[currency].confirmPending += amount;
                    stats[currency].confirmPendingCount++;
                }
            } else {
                stats[currency].paid += amount;
                stats[currency].paidCount++;
            }
        });

        return stats;
    }, [filteredByMonthRows]);

    const formatSummaryValue = (stats, type, colorVariant) => {
        const krwCount = stats.KRW[`${type}Count`];
        const usdCount = stats.USD[`${type}Count`];

        const krwLine = krwCount > 0 ? (
            <div key="krw" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{stats.KRW[type].toLocaleString()}원</span>
                <Badge label={`${krwCount}건`} size="XS" variant={colorVariant} />
            </div>
        ) : null;
        const usdLine = usdCount > 0 ? (
            <div key="usd" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>${stats.USD[type].toLocaleString()}</span>
                <Badge label={`${usdCount}건`} size="XS" variant={colorVariant} />
            </div>
        ) : null;

        if (!krwLine && !usdLine) return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>0원</span>
                <Badge label="0건" size="XS" variant="neutral" />
            </div>
        );
        return [krwLine, usdLine];
    };

    const items = [
        {
            label: '미지급 총액',
            value: formatSummaryValue(summaryStats, 'unpaid', 'danger'),
            valueClassName: 'text-danger'
        },
        {
            label: '지급대기 금액',
            value: formatSummaryValue(summaryStats, 'payPending', 'neutral'),
        },
        {
            label: '확인대기 금액',
            value: formatSummaryValue(summaryStats, 'confirmPending', 'neutral'),
        },
        {
            label: '지급완료',
            value: formatSummaryValue(summaryStats, 'paid', 'neutral'),
            valueClassName: 'text-success',
        }
    ];
    const [groups, setGroups] = useState([
        {
            id: 19,
            name: '2026년 2월 작업료-국내, 해외',
            date: '2026. 2. 10',
            payDate: '-',
            count: '5 / 10',
            paid: <div><div>500,000원</div><div>$500</div></div>,
            total: <div><div>1,000,000원</div><div>$1,000</div></div>
        },
        { id: 18, name: '2026년 2월 작업료-국내', date: '2026. 2. 05', payDate: '-', count: '0 / 8', paid: '0원', total: '800,000원' },
        { id: 17, name: '2026년 2월 작업료-국내', date: '2026. 2. 02', payDate: '2026. 2. 03', count: '8 / 8', paid: '1,500,000원', total: '1,500,000원' },
        { id: 16, name: '2026년 2월 작업료-국내', date: '2026. 1. 28', payDate: '2026. 1. 29', count: '10 / 10', paid: '2,000,000원', total: '2,000,000원' },
        { id: 15, name: '2026년 1월 작업료-달러', date: '2026. 1. 25', payDate: '-', count: '2 / 5', paid: '$200', total: '$500' },
        { id: 14, name: '2026년 1월 작업료-국내', date: '2026. 1. 20', payDate: '2026. 1. 22', count: '3 / 3', paid: '300,000원', total: '300,000원' },
        { id: 13, name: '2026년 1월 작업료-국내', date: '2026. 1. 15', payDate: '-', count: '1 / 6', paid: '150,000원', total: '900,000원' },
        { id: 12, name: '2026년 1월 작업료-국내', date: '2026. 1. 10', payDate: '2026. 1. 12', count: '7 / 7', paid: '700,000원', total: '700,000원' },
        { id: 11, name: '2026년 1월 작업료-국내', date: '2026. 1. 05', payDate: '-', count: '0 / 4', paid: '0원', total: '400,000원' },
        { id: 1, name: '2025년 12월 작업료-달러', date: '2025. 12. 28', payDate: '2025. 12. 30', count: '1 / 10', paid: '$100', total: '$1,000' },
    ]);

    const handlePgRowClick = (group) => {
        setSelectedGroup(group);
        setIsPgModalOpen(true);
    };

    const handleSelectionChange = (count, total) => {
        setSelectedCount(count);
        setSelectedTotal(total);
    };

    const handleResetSelection = () => {
        setResetKey(prev => prev + 1); // Force re-render of JobFeeList
        setSelectedCount(0);
        setSelectedTotal({ KRW: 0, USD: 0 });
    };

    const handleCreateGroup = () => {
        if (selectedCount === 0) {
            alert('항목을 선택해주세요.');
            return;
        }
        setIsPgCreateModalOpen(true);
    };

    const handleConfirmCreateGroup = (groupName) => {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;

        const newGroup = {
            id: groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1, // Generate new ID
            name: groupName,
            date: formattedDate,
            payDate: '-',
            count: `${selectedCount} / ${selectedCount}`,
            paid: '0원',
            total: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {selectedTotal.KRW > 0 && <div>{selectedTotal.KRW.toLocaleString()}원</div>}
                    {selectedTotal.USD > 0 && <div>${selectedTotal.USD.toLocaleString()}</div>}
                    {selectedTotal.KRW === 0 && selectedTotal.USD === 0 && <div>0원</div>}
                </div>
            )
        };

        setGroups([newGroup, ...groups]);

        // Show Toast instead of switching immediately
        setToast({
            isVisible: true,
            message: '지급그룹이 생성되었습니다.',
            action: {
                label: '지급그룹 확인하기',
                onClick: () => {
                    setActiveTab('payment-group');
                    setToast(prev => ({ ...prev, isVisible: false }));
                }
            }
        });

        handleResetSelection(); // Clear selection
    };




    const handleRevertPayment = (id) => {
        if (!confirm('지급 완료 상태를 취소하시겠습니까?\n상태가 확인완료로 변경됩니다.')) return; // Simple confirm for now or use custom modal if preferred.
        // User asked to move function. I will use window.confirm or reusing existing modal infrastructure is harder without refactoring all modals.
        // JobFeeList used `modalConfig`. JobFeePage doesn't have a generic confirm modal exposed easily except via a new state.
        // I'll use window.confirm for simplicity or if the user demands custom modal I can add it. 
        // Given "ConfirmationModal" is imported in JobFeeList, I should probably use it in Page if I want consistency.
        // But JobFeePage imports `NoticeArea` etc.
        // Let's stick to window.confirm for the logic lift first, or just implement the state change and let the DetailModal handle the UI part?
        // Actually, let's pass a function that DOES the update, and let DetailModal handle the confirmation UI?
        // DetailModal is just a view. It shouldn't hold UI state for confirmation if possible.
        // I will add `handleRevertPayment` to JobFeePage and pass it down.

        setJobRows(prevRows => prevRows.map(row => {
            if (row.id === id) {
                return {
                    ...row,
                    payStatus: 'confirm_done',
                    paidAt: null
                };
            }
            return row;
        }));

        // Update selected item so modal reflects change immediately
        setSelectedJobFee(prev => prev.id === id ? { ...prev, payStatus: 'confirm_done', paidAt: null } : prev);

        setToast({
            isVisible: true,
            message: '지급 취소처리가 완료되었습니다.',
            action: null
        });
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleRequestDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteNotice = () => {
        setNoticeData(null);
        setIsDeleteModalOpen(false);
        setToast({
            isVisible: true,
            message: '삭제되었습니다.',
            action: null
        });
    };

    const handleNoticeSave = (newData) => {

        setNoticeData({
            ...newData,
            start: newData.start.includes('.') ? newData.start : formatDate(newData.start),
            end: newData.end.includes('.') ? newData.end : formatDate(newData.end)
        });
        setIsNoticeModalOpen(false);

        // Show update message
        setToast({
            isVisible: true,
            message: noticeData ? '공지사항이 수정되었습니다.' : '공지사항이 등록되었습니다.',
            action: null
        });
    };

    return (
        <div>
            <div className="flex justify-between items-start">
                <h1 className="page-title">작업료</h1>
                {!noticeData && (
                    <button
                        className="btn-outline"
                        onClick={() => setIsNoticeModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '36px', whiteSpace: 'nowrap' }}
                    >
                        <Icon name="plus" size={16} />
                        공지사항 작성
                    </button>
                )}
            </div>

            {/* Notice Area */}
            <NoticeArea
                noticeData={noticeData}
                onDelete={handleRequestDelete}
                onEdit={() => setIsNoticeModalOpen(true)}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteNotice}
                title="공지사항 삭제"
                message="공지사항을 삭제하시겠습니까?"
                confirmText="삭제"
            />

            {/* Notice Modal */}
            <EditNoticeModal
                isOpen={isNoticeModalOpen}
                initialData={noticeData}
                onClose={() => setIsNoticeModalOpen(false)}
                onSave={handleNoticeSave}
            />

            {/* Accounting Summary - Visible for Job Fee AND Payment Group tabs */}
            {(activeTab === 'job-fee' || activeTab === 'payment-group') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                    {/* Month Selector Title */}
                    <div className="month-selector-container">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {/* Select Box */}
                            <div
                                ref={dropdownRef}
                                className={`month-select-box ${isMonthDropdownOpen ? 'active' : ''}`}
                                onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                            >
                                <span className="month-select-text">{parseInt(selectedMonth.split('-')[1])}월</span>
                                <div className="icon-triangle-down">
                                    <Icon name="triangle-down" size={20} color="var(--neutral_700)" />
                                </div>

                                {/* Dropdown Menu */}
                                {isMonthDropdownOpen && (
                                    <div className="month-dropdown-menu">
                                        {Array.from({ length: 12 }, (_, i) => {
                                            const year = selectedMonth ? selectedMonth.split('-')[0] : new Date().getFullYear();
                                            const m = i + 1;
                                            const yyyy = year;
                                            const mm = String(m).padStart(2, '0');
                                            const val = `${yyyy}-${mm}`;
                                            return (
                                                <div
                                                    key={val}
                                                    className={`month-dropdown-item ${selectedMonth === val ? 'selected' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedMonth(val);
                                                        setIsMonthDropdownOpen(false);
                                                    }}
                                                >
                                                    {parseInt(mm)}월
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Static Title Text */}
                            <span className="month-title-text">의 작업료</span>
                        </div>


                    </div>

                    <AccountingSummary items={items} />
                </div>
            )}




            {/* Tabs */}
            <div className="tab-navigation">
                <div
                    className={`tab-item ${activeTab === 'job-fee' ? 'active' : ''}`}
                    onClick={() => setActiveTab('job-fee')}
                >
                    작업료 리스트
                </div>
                <div
                    className={`tab-item ${activeTab === 'payment-group' ? 'active' : ''}`}
                    onClick={() => setActiveTab('payment-group')}
                >
                    지급그룹 리스트
                </div>
            </div>

            {/* Filter Bar */}
            <FilterBar activeTab={activeTab} onSearch={handleSearch} />


            {/* Main Content Area */}
            {activeTab === 'job-fee' ? (
                <>
                    <JobFeeList
                        key={resetKey}
                        onRowClick={handleRowClick}
                        onSelectionChange={handleSelectionChange}
                        rows={filteredJobRows} // Show filtered rows based on FilterBar criteria
                        setRows={setJobRows}
                    />
                    {/* Selection Bar */}
                    <SelectionBar
                        count={selectedCount}
                        total={selectedTotal}
                        onReset={handleResetSelection}
                        onCreateGroup={handleCreateGroup}
                    />
                </>
            ) : (
                <PaymentGroupList
                    groups={groups}
                    onRowClick={handlePgRowClick}
                />
            )}

            {/* Modals */}
            <JobFeeDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                data={selectedJobFee}
                onRevertPayment={handleRevertPayment}
            />

            <PaymentGroupDetailModal
                isOpen={isPgModalOpen}
                onClose={() => setIsPgModalOpen(false)}
                group={selectedGroup}
            />

            <PaymentGroupCreateModal
                isOpen={isPgCreateModalOpen}
                onClose={() => setIsPgCreateModalOpen(false)}
                onConfirm={handleConfirmCreateGroup}
                existingNames={groups.map(g => g.name)}
            />
            {/* Toast Notification */}
            <ToastNotification
                isVisible={toast.isVisible}
                message={toast.message}
                action={toast.action}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
}
