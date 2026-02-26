import React from 'react';
import { Link } from 'react-router-dom';

export default function PlaceholderPage({ title }) {
    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1 className="page-title">{title}</h1>
            <div style={{ marginTop: '60px', color: '#636567' }}>
                <p>아직 구현되지 않은 페이지입니다.</p>
                <Link to="/" style={{ display: 'inline-block', marginTop: '20px', color: '#3b82f6', textDecoration: 'underline' }}>
                    대시보드로 돌아가기
                </Link>
            </div>
        </div>
    );
}
