import React, { useState } from 'react';
import closeIcon from '../../assets/img/icon/Close Icon.svg';
import InputText from '../Common/InputText';
import Icon from '../Common/Icon';
import { formatDate } from '../../utils/dateUtils';

export const EditNoticeModal = ({ isOpen, onClose, initialData, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        start: '',
        end: '',
        content: ''
    });

    React.useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                title: initialData.title || '',
                start: '2025-01-01', // Mock mapping
                end: '2025-01-07',   // Mock mapping
                content: initialData.content || ''
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-container" style={{ width: '600px', backgroundColor: 'white', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 16px', borderBottom: '1px solid #f0f2f4' }}>
                    <h2 className="modal-title" style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>공지사항 수정</h2>
                    <button className="btn-close-modal" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        <img src={closeIcon} alt="Close" width="24" height="24" />
                    </button>
                </div>
                <div className="modal-body" style={{ padding: '24px' }}>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label className="form-label" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--neutral_700)' }}>제목</label>
                        <InputText
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            width="100%"
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--neutral_700)' }}>게시 시작일</label>
                            <input
                                type="date"
                                className="input-text"
                                style={{ width: '100%' }}
                                value={formData.start}
                                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--neutral_700)' }}>게시 종료일</label>
                            <input
                                type="date"
                                className="input-text"
                                style={{ width: '100%' }}
                                value={formData.end}
                                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'var(--neutral_700)' }}>내용</label>
                        <textarea
                            className="input-text"
                            style={{ width: '100%', height: '120px', resize: 'none', padding: '12px' }}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>
                </div>
                <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid #f0f2f4', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button className="btn-footer-close" onClick={onClose} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #dcdfe2', backgroundColor: 'white', cursor: 'pointer', fontWeight: 600 }}>취소</button>
                    <button className="btn-primary" onClick={() => onSave(formData)} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#7c4dff', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                        수정사항 저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function NoticeArea({ noticeData, onDelete, onEdit }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showKebab, setShowKebab] = useState(false);

    const handleEditClick = () => {
        onEdit();
        setShowKebab(false);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete();
        setShowKebab(false);
    };

    if (!noticeData) return null;

    return (
        <div id="noticeContainer">
            <div className="notice-card">
                <div className="notice-header">
                    <div className="notice-header-left">
                        <span className="notice-badge">공지사항</span>
                        <span className="notice-title">{noticeData.title}</span>
                    </div>
                    <div className="notice-header-right">
                        <span className="notice-date">{formatDate(noticeData.start)} - {formatDate(noticeData.end)}</span>

                        {/* Kebab Menu */}
                        <div className="notice-actions" style={{ position: 'relative' }}>
                            <button
                                className="btn-icon"
                                onClick={(e) => { e.stopPropagation(); setShowKebab(!showKebab); }}
                            >
                                <span style={{ fontSize: '18px', lineHeight: 1 }}>⋮</span>
                            </button>
                            {showKebab && (
                                <>
                                    <div
                                        className="kebab-menu"
                                        style={{ display: 'block' }}
                                        onClick={() => setShowKebab(false)}
                                    >
                                        <button className="menu-item" onClick={handleEditClick}>수정</button>
                                        <button className="menu-item delete" onClick={handleDeleteClick}>삭제</button>
                                    </div>
                                    {/* Backdrop to close */}
                                    <div
                                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5 }}
                                        onClick={() => setShowKebab(false)}
                                    />
                                </>
                            )}
                        </div>

                        {/* Toggle Chevron */}
                        <button className="btn-icon" onClick={() => setIsExpanded(!isExpanded)}>
                            <Icon
                                name="triangle-down"
                                size={20}
                                style={{
                                    display: 'inline-block',
                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s',
                                    color: 'var(--neutral_700)'
                                }}
                            />
                        </button>
                    </div>
                </div>

                {/* Notice Body */}
                {isExpanded && (
                    <div className="notice-body" style={{ display: 'block' }}>
                        <div className="notice-description">{noticeData.content}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
