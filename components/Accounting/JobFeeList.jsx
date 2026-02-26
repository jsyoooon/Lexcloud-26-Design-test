import React, { useState } from 'react';
import Badge from '../Common/Badge';
import Pagination from '../Common/Pagination';

import ConfirmationModal from '../Common/ConfirmationModal';
import Icon from '../Common/Icon';
import { formatDate } from '../../utils/dateUtils';

export default function JobFeeList({
    onRowClick,
    onSelectionChange,
    rows
}) {
    // Local UI state
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        showCancel: true,
        confirmText: '확인',
        onConfirm: () => { }
    });

    // Helper to format currency
    const formatMoney = (amount, currency) => {
        if (currency === 'USD') {
            return `$${amount.toLocaleString()}`;
        }
        return `${amount.toLocaleString()}원`;
    };



    const handleCheckboxChange = (e, id) => {
        e.stopPropagation();
        const newSelected = new Set(selectedItems);
        if (e.target.checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedItems(newSelected);
        updateSelectionStats(newSelected);
    };

    const handleCheckAll = (e) => {
        if (e.target.checked) {
            const allIds = new Set(rows.map(r => r.id));
            setSelectedItems(allIds);
            updateSelectionStats(allIds);
        } else {
            setSelectedItems(new Set());
            updateSelectionStats(new Set());
        }
    };

    const updateSelectionStats = (selectedSet) => {
        if (onSelectionChange) {
            const totals = { KRW: 0, USD: 0 };
            rows.forEach(r => {
                if (selectedSet.has(r.id)) {
                    const currency = r.currency || 'KRW';
                    const amount = (r.amount || 0) + (r.incentive || 0);
                    totals[currency] += amount;
                }
            });
            onSelectionChange(selectedSet.size, totals);
        }
    };





    const getStatusBadgeProps = (status) => {
        if (status === 'paid') {
            return { label: '지급완료', variant: 'success' };
        }
        return { label: '미지급', variant: 'danger' };
    };



    return (
        <div id="section-job-fee" className="list-section">
            <div className="list-header-controls">
                <div className="list-count" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span>작업료 리스트 <span className="badge">{rows.length}</span></span>
                </div>
                <div className="list-actions" style={{ gap: '8px' }}>
                    <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '32px' }}>
                        <Icon name="download" size={16} /> EXCEL 다운로드
                    </button>
                </div>
            </div>

            <div className="list-table-wrapper">
                {/* Header */}
                <div className="list-header-row">
                    <div className="cell-center cell-checkbox">
                        <input
                            type="checkbox"
                            id="checkAll"
                            className="custom-checkbox"
                            onChange={handleCheckAll}
                            checked={rows.length > 0 && selectedItems.size === rows.length}
                        />
                    </div>

                    <div className="cell-left">파일명/ 프로젝트코드</div>
                    <div className="cell-left">고객사명</div>
                    <div className="cell-left">작업자명</div>

                    <div className="cell-right">총 지급액</div>
                    <div className="cell-left">담당 PM</div>
                    <div className="cell-left">작업 마감일</div>
                    <div className="cell-left">지급 상태</div>
                </div>

                {/* Rows */}
                {rows.map((row) => {
                    const badgeProps = getStatusBadgeProps(row.payStatus);


                    const renderTimestamp = () => {
                        if (row.payStatus === 'paid') {
                            return (
                                <>
                                    {row.confirmedAt && <div>확인 {formatDate(row.confirmedAt)}</div>}
                                    {row.paidAt && <div>지급 {formatDate(row.paidAt)}</div>}
                                </>
                            );
                        }
                        if (row.confirmedAt) {
                            return <div>확인 {formatDate(row.confirmedAt)}</div>;
                        }
                        return null;
                    };

                    // Financial calculations
                    const amount = row.amount || 0;
                    const incentive = row.incentive || 0;
                    const totalVal = amount + incentive;

                    return (
                        <div key={row.id} className="list-row" onClick={() => onRowClick(row)} style={{ cursor: 'pointer', height: 'auto', minHeight: '52px' }}>
                            <div className="cell-center cell-checkbox" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    className="custom-checkbox row-checkbox"
                                    checked={selectedItems.has(row.id)}
                                    onChange={(e) => handleCheckboxChange(e, row.id)}
                                />
                            </div>

                            <div className="cell-project">
                                <div className="project-name">{row.project}</div>
                                <div className="project-code">{row.code}</div>
                            </div>
                            {/* 고객사명 */}
                            <div className="cell-left">{row.client || '-'}</div>
                            <div className="cell-left">{row.worker}</div>

                            <div className="cell-right" style={{ color: 'var(--neutral_900)', fontWeight: '500' }}>
                                {formatMoney(totalVal, row.currency)}
                            </div>
                            <div className="cell-left cell-pm">{row.pm}</div>
                            {/* 작업 마감일 */}
                            <div className="cell-left">{row.deadline ? formatDate(row.deadline) : '-'}</div>
                            <div className="cell-status cell-left" style={{ flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Badge
                                        label={badgeProps.label}
                                        size="S"
                                        variant={badgeProps.variant}
                                    />
                                </div>
                                <div style={{
                                    fontSize: 'var(--Body_sm_regular_font_size)',
                                    color: 'var(--neutral_700)',
                                    letterSpacing: '-0.01em',
                                    textAlign: 'left',
                                    lineHeight: 'var(--Body_sm_regular_line_height)'
                                }}>
                                    {renderTimestamp()}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Pagination totalPages={5} currentPage={1} />

            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                onConfirm={modalConfig.onConfirm}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                showCancel={modalConfig.showCancel}
            />
        </div>
    );
}
