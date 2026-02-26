import React from 'react';
import { Link } from 'react-router-dom';

export default function AccountingDashboard() {
    const menus = [
        { name: '작업료 (Job Fee)', path: '/job-fee', icon: '💰', desc: '작업료 리스트 및 지급그룹 관리' },
        { name: '미수관리', path: '/receivable', icon: '📉', desc: '미수금 현황 및 관리' },
        { name: '선결제', path: '/prepayment', icon: '💳', desc: '선결제 처리 및 내역' },
        { name: '수금처리', path: '/collection', icon: '📥', desc: '수금 내역 및 처리' },
        { name: '은행거래내역', path: '/bank-transaction', icon: '🏦', desc: '은행 입출금 내역 조회' },
    ];

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 className="page-title">회계 관리 대시보드</h1>
            <p style={{ marginBottom: '40px', color: '#666' }}>이동할 메뉴를 선택하세요.</p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
            }}>
                {menus.map((menu) => (
                    <Link
                        to={menu.path}
                        key={menu.path}
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="notice-card" style={{
                            height: '100%',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            hover: { transform: 'translateY(-4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                        }}>
                            <div style={{ fontSize: '32px', marginBottom: '16px' }}>{menu.icon}</div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#151616' }}>{menu.name}</h3>
                            <p style={{ fontSize: '14px', color: '#636567', lineHeight: '1.5' }}>{menu.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
