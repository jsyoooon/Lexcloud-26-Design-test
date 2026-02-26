import React, { useState } from 'react';
import Badge from '../Common/Badge';
import Icon from '../Common/Icon';
import { formatDate } from '../../utils/dateUtils';

export default function AccountsReceivable() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    // Mock Data (from script.js)
    const receivablesData = {
        'P001': {
            client: 'Samsung Electronics',
            project: 'Galaxy S25 User Manual Translation',
            contract: '15,000,000원',
            balance: '5,000,000원',
            rounds: [
                { round: '1차 착수금', date: '2025-01-15', amount: '5,000,000원', status: 'paid', datePaid: '2025-01-15' },
                { round: '2차 중도금', date: '2025-02-15', amount: '5,000,000원', status: 'paid', datePaid: '2025-02-14' },
                { round: '3차 잔금', date: '2025-03-15', amount: '5,000,000원', status: 'unpaid', datePaid: '-' }
            ]
        },
        'P002': {
            client: 'LG Display',
            project: 'OLED Panel Specification',
            contract: '8,000,000원',
            balance: '0원',
            rounds: [
                { round: '일시불', date: '2025-02-10', amount: '8,000,000원', status: 'paid', datePaid: '2025-02-10' }
            ]
        },
        'P003': {
            client: 'SK Hynix',
            project: 'Semiconductor Terminology',
            contract: '3,000,000원',
            balance: '3,000,000원',
            rounds: [
                { round: '일시불', date: '2025-04-01', amount: '3,000,000원', status: 'unpaid', datePaid: '-' }
            ]
        }
    };

    const handleRowClick = (id) => {
        const data = receivablesData[id];
        if (data) {
            setSelectedData(data);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="main-content">
            <h1 className="page-title">미수관리</h1>

            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="filter-group-wrapper">
                    <div className="input-wrapper" style={{ width: '180px' }}>
                        <input type="text" className="input-text" placeholder="프로젝트코드 검색" aria-label="Project Code" />
                    </div>
                    <div className="date-range-inputs">
                        <input type="date" className="input-date" aria-label="Start Date" />
                        <span className="range-separator">-</span>
                        <input type="date" className="input-date" aria-label="End Date" />
                    </div>
                    <select className="dropdown filter-status" aria-label="Status">
                        <option value="all">전체</option>
                        <option value="unpaid">미결제</option>
                        <option value="paid">결제완료</option>
                    </select>
                    <button className="btn-search-action">조회하기</button>
                </div>
            </div>

            {/* List Section */}
            <div id="section-receivables" className="list-section">
                <div className="list-header-controls">
                    <div className="list-count">미수 리스트 <span className="badge" id="listTotalCount">3</span></div>
                    <div className="list-actions">
                        <button className="btn-outline">EXCEL 다운로드</button>
                    </div>
                </div>

                <div className="list-table-wrapper">
                    <div className="list-header-row receivables-grid">
                        <div className="cell-center">구분</div>
                        <div className="cell-left">고객명</div>
                        <div className="cell-left">프로젝트</div>
                        <div className="cell-center">수금방식</div>
                        <div className="cell-right">계약금액</div>
                        <div className="cell-right">결제완료</div>
                        <div className="cell-right">잔액(원)</div>
                        <div className="cell-center">상태</div>
                    </div>

                    {/* Checkbox Rows */}
                    <div className="list-row receivables-grid" onClick={() => handleRowClick('P001')}>
                        <div className="cell-center">법인</div>
                        <div className="cell-left">GMT company</div>
                        <div className="cell-project">
                            <div className="project-name">Medical Device Manual<br />User Guide Translation</div>
                            <div className="project-code">P20230803-002</div>
                        </div>
                        <div className="cell-center">전액</div>
                        <div className="cell-right">5,000,000원</div>
                        <div className="cell-right">0원</div>
                        <div className="cell-right" style={{ color: '#FF4D4F', fontWeight: 600 }}>5,000,000원</div>
                        <div className="cell-center">
                            <Badge
                                label="미결제(0/1)"
                                size="S"
                                variant="danger"
                                className="w-auto min-w-0 !px-[8px]"
                            />
                        </div>
                    </div>

                    <div className="list-row receivables-grid" onClick={() => handleRowClick('P002')}>
                        <div className="cell-center">법인</div>
                        <div className="cell-left">Samsung Electronics</div>
                        <div className="cell-project">
                            <div className="project-name">Galaxy S25 Launching Event<br />Marketing Materials</div>
                            <div className="project-code">P20230805-001</div>
                        </div>
                        <div className="cell-center">분할(50:50)</div>
                        <div className="cell-right">10,000,000원</div>
                        <div className="cell-right">5,000,000원</div>
                        <div className="cell-right" style={{ color: '#FF4D4F', fontWeight: 600 }}>5,000,000원</div>
                        <div className="cell-center">
                            <Badge
                                label="미결제(1/2)"
                                size="S"
                                variant="danger"
                                className="w-auto min-w-0 !px-[8px]"
                            />
                        </div>
                    </div>

                    <div className="list-row receivables-grid" onClick={() => handleRowClick('P003')}>
                        <div className="cell-center">개인</div>
                        <div className="cell-left">Individual Client</div>
                        <div className="cell-project">
                            <div className="project-name">Personal Essay Translation</div>
                            <div className="project-code">P20230810-004</div>
                        </div>
                        <div className="cell-center">전액</div>
                        <div className="cell-right">300,000원</div>
                        <div className="cell-right">300,000원</div>
                        <div className="cell-right">0원</div>
                        <div className="cell-center">
                            <Badge
                                label="결제완료(1/1)"
                                size="S"
                                variant="info" // Using info (blue) for paid/collected as per CollectionPage
                                className="w-auto min-w-0 !px-[8px]"
                            />
                        </div>
                    </div>
                </div>
            </div>


            {/* Modal */}
            {
                isModalOpen && selectedData && (
                    <div id="receivableDetailModal" className="modal-overlay" style={{ display: 'flex' }}>
                        <div className="modal-container" style={{ width: '800px', maxWidth: '90%' }}>
                            <div className="modal-header">
                                <h2 className="modal-title">수금 현황 상세</h2>
                                <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>
                                    <img src="/src/assets/icon/Close Icon.svg" alt="Close" width="24" height="24"
                                        onError={(e) => e.target.style.display = 'none'} /> {/* Fallback if icon missing */}
                                    {/* Or use Lucide Icon */}
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="pay-summary-grid">
                                    <div className="pay-summary-item">
                                        <span className="pay-summary-label">고객명</span>
                                        <span className="pay-summary-value">{selectedData.client}</span>
                                    </div>
                                    <div className="pay-summary-item">
                                        <span className="pay-summary-label">프로젝트명</span>
                                        <span className="pay-summary-value">{selectedData.project}</span>
                                    </div>
                                    <div className="pay-summary-item">
                                        <span className="pay-summary-label">계약금액</span>
                                        <span className="pay-summary-value">{selectedData.contract}</span>
                                    </div>
                                    <div className="pay-summary-item">
                                        <span className="pay-summary-label">미수잔액</span>
                                        <span className="pay-summary-value highlight">{selectedData.balance}</span>
                                    </div>
                                </div>

                                <div className="section-title">회차별 수금 내역</div>
                                <div className="pay-round-list">
                                    {selectedData.rounds.map((r, idx) => (
                                        <div className="pay-round-card" key={idx}>
                                            <div className="pay-round-header">
                                                <span className="pay-round-title">{r.round}</span>
                                                <Badge
                                                    label={r.status === 'paid' ? '결제완료' : '미결제'}
                                                    size="S"
                                                    variant={r.status === 'paid' ? 'info' : 'danger'}
                                                />
                                                <button className="btn-icon">
                                                    <Icon name="more-vertical" size={16} />
                                                </button>
                                            </div>
                                            <div className="pay-round-grid">
                                                <div className="pay-info-item"><label>예정일</label><span>{formatDate(r.date)}</span></div>
                                                <div className="pay-info-item"><label>입금일</label><span>{formatDate(r.datePaid)}</span></div>
                                                <div className="pay-info-item"><label>금액</label><span>{r.amount}</span></div>
                                                <div className="pay-info-item"><label>세금계산서</label>
                                                    <button className="btn-outline" style={{ padding: '2px 8px', fontSize: '11px' }}>보기</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn-footer-close" onClick={() => setIsModalOpen(false)}>닫기</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
