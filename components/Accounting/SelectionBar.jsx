import React from 'react';

export default function SelectionBar({ count, total, onReset, onCreateGroup }) {
    const isActive = count > 0;

    return (
        <div id="selectionBar" className={`selection-bar ${isActive ? 'active' : ''}`}>
            <div className="sb-left">
                <span className="sb-count">
                    <strong id="sbCount">{count}</strong>건 선택
                </span>
                <span className="sb-divider"></span>
                <span className="sb-total-label">총 지급액</span>
                <span className="sb-total-value" id="sbTotal">
                    {total.KRW > 0 && <span style={{ marginRight: total.USD > 0 ? '12px' : 0 }}>{total.KRW.toLocaleString()}원</span>}
                    {total.USD > 0 && <span>${total.USD.toLocaleString()}</span>}
                    {total.KRW === 0 && total.USD === 0 && <span>0원</span>}
                </span>
            </div>
            <div className="sb-right">
                <button className="btn-text" id="btnCancelSelection" onClick={onReset}>선택 해제</button>
                <button className="btn-secondary" id="btnCreateGroup" onClick={onCreateGroup}>지급그룹 생성</button>
                <button className="btn-primary" id="btnPaySelected">선택 지급</button>
            </div>
        </div>
    );
}
