import React from 'react';
import Sidebar from './Sidebar';
import '../../styles/style.css';

export default function Layout({ children }) {
    return (
        <div className="screen">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
