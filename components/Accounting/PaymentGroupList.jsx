import React from 'react';
import Pagination from '../Common/Pagination';

export default function PaymentGroupList({ groups, onRowClick }) {
    // Groups are now passed as props

    return (
        <div id="section-payment-group" className="list-section">
            <div className="list-header-controls">
                <div className="list-count">지급그룹 리스트 <span className="badge">{groups.length}</span></div>
                <div className="list-actions">
                    <button className="btn-outline">EXCEL 다운로드</button>
                </div>
            </div>

            <div className="list-table-wrapper">
                {/* Header */}
                <div className="list-header-row payment-group-grid">

                    <div className="cell-left">그룹명</div>
                    <div className="cell-left">생성일</div>
                    <div className="cell-left">지급일</div>
                    <div className="cell-center">지급건수</div>
                    <div className="cell-left" style={{ textAlign: 'right', justifyContent: 'flex-end' }}>지급액</div>
                    <div className="cell-left" style={{ textAlign: 'right', justifyContent: 'flex-end' }}>총금액</div>
                </div>

                {/* Rows */}
                {groups.map((item) => (
                    <div
                        key={item.id}
                        className="list-row payment-group-grid"
                        onClick={() => onRowClick(item)}
                        style={{ cursor: 'pointer' }}
                    >

                        <div className="cell-left">{item.name}</div>
                        <div className="cell-left">{item.date}</div>
                        <div className="cell-left">{item.payDate}</div>
                        <div className="cell-center">{item.count}</div>
                        <div className="cell-left" style={{ textAlign: 'right', justifyContent: 'flex-end', fontWeight: 600 }}>
                            {item.paid}
                        </div>
                        <div className="cell-left" style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
                            {item.total}
                        </div>
                    </div>
                ))}
            </div>

            <Pagination totalPages={5} currentPage={1} />
        </div>
    );
}
