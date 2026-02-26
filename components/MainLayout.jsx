import React, { useState } from 'react';
import {
  Briefcase,
  Layers,
  Wallet,
  CreditCard,
  ArrowRightLeft,
  FileText,
  Landmark, // For TaxInvoice if needed, or Receipt
  Receipt,
  TrendingUp,
  BarChart3,
  FileCheck, // For Expense
  Bell,
  Home,
  Folder,
  Edit,
  Languages,
  Users,
  UserCog,
  BookOpen,
  Database, // For Accounting Mgmt
  ChevronDown,
  UserCheck
} from 'lucide-react';

import logoText from '../assets/img/LEX-Cloud26_logo.svg';
import iconHome from '../assets/img/icon_home.svg';
import iconProfile from '../assets/img/Profile.svg';
// import iconNoti from '../assets/img/icon_noti.png'; // Reverted
import iconBadgeNew from '../assets/img/icon/New Badge.svg';
import Icon from './Common/Icon'; // Keep for non-sidebar usages if any, though sidebar was the main target.

// Import All Components
import WorkFee from './Accounting/JobFeePage';
import CollectionProcessing from './Accounting/CollectionPage';
import Prepayment from './Accounting/Prepayment';
import ExpenseResolution from './Accounting/ExpenseResolution';
import TaxInvoice from './Accounting/TaxInvoice';
import CertificateManagement from './Accounting/CertificateManagement';

// Menu Configuration
const MENU_GROUPS = [


  {
    title: null, // General items
    items: [
      {
        id: 'dashboard',
        label: '홈',
        icon: ({ className, ...props }) => <img src={iconHome} alt="home" width={20} height={20} className={className?.replace('mr-3', 'mr-5')} {...props} />
      },
      {
        id: 'projects',
        label: '프로젝트 리스트',
        icon: Folder
      },
      {
        id: 'translation',
        label: '번역 요청',
        icon: Edit
      },
      {
        id: 'transcreation',
        label: '트랜스크리에이션',
        icon: Languages
      },
      // {
      //   id: 'proofreading',
      //   label: '감수 요청',
      //   icon: FileCheck
      // },
      // {
      //   id: 'interpretation',
      //   label: '통역 요청',
      //   icon: Users
      // }
    ]
  },
  {
    title: '사용자 관리',
    items: [
      {
        id: 'clients',
        label: '고객 정보',
        icon: Users
      },
      {
        id: 'workers',
        label: '작업자 정보',
        icon: UserCheck
      },
    ]
  },
  {
    title: '관리',
    items: [
      {
        id: 'payment-mgmt',
        label: '결제 관리',
        icon: CreditCard
      },
      {
        id: 'jobfee-mgmt',
        label: '작업료 관리',
        icon: Briefcase
      },
      {
        id: 'glossary',
        label: '용어집 관리',
        icon: BookOpen
      },
    ]
  }
];

const ACCOUNTING_MENU_ITEMS = [
  { id: '작업료', label: '작업료' }, // No icon for children
  { id: '수금처리', label: '수금처리' },
  { id: '선결제', label: '선결제' },
  { id: '지출결의', label: '지출결의' },

  { id: '세금계산서', label: '세금계산서' },
  { id: '증명서관리', label: '증명서 관리' },
];

export default function MainLayout() {
  const [activeMenu, setActiveMenu] = useState('작업료');
  const [isAccountingOpen, setIsAccountingOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false); // Collapsed State

  // Content Rendering Logic
  const renderContent = () => {
    switch (activeMenu) {
      case '작업료': return <WorkFee />;
      case '수금처리': return <CollectionProcessing />;
      case '선결제': return <Prepayment />;
      case '지출결의': return <ExpenseResolution />;

      case '세금계산서': return <TaxInvoice />;
      case '증명서관리': return <CertificateManagement />;

      default:
        return <div className="p-8 text-gray-400">페이지 준비중입니다.</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--neutral_50)] font-pretendard">
      {/* Navigation Bar */}
      <aside
        className="h-full bg-[var(--base_white)] flex flex-col shrink-0 z-20 transition-all duration-300 ease-in-out overflow-hidden relative"
        style={{
          width: isCollapsed ? 'var(--nav_width_collapsed)' : 'var(--nav_width_expanded)',
          borderRight: '1px solid var(--neutral_300)'
        }}
      >

        {/* Header: Logo + Collapse */}
        <div
          className={`flex items-center shrink-0 ${isCollapsed ? 'justify-center w-full' : 'justify-between w-full'}`}
          style={{
            height: '74px',
            padding: isCollapsed ? '0' : '24px 16px 20px 20px',
            gap: isCollapsed ? '0' : '21px'
          }}
        >
          {!isCollapsed && (
            <img src={logoText} alt="LEX-Cloud 26" className="h-[30px] w-auto object-contain" />
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors ${isCollapsed ? '' : 'rotate-180'}`}
          >
            <ArrowRightLeft size={16} strokeWidth={2} className={`${isCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Scrollable Menu Area */}
        <nav className={`w-full overflow-y-auto pb-6 custom-scrollbar flex flex-col min-h-0`} /* min-h-0 for nested flex scroll */
          style={{
            height: 'calc(100vh - 154px)', /* Header(74px) + Footer(80px) */
            gap: 'var(--nav_item_gap)',
            paddingLeft: isCollapsed ? '8px' : 'var(--nav_padding_x)',
            paddingRight: isCollapsed ? '8px' : 'var(--nav_padding_x)'
          }}>


          {/* Notification Area (Moved inside nav) */}
          <div className={`w-full mb-2 shrink-0 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
            <button className={`w-full flex items-center rounded-lg transition-colors hover:bg-gray-50 ${isCollapsed ? 'justify-center' : 'justify-between px-3'}`}
              style={{ height: 'var(--nav_item_height)' }}>
              <div className="flex items-center gap-3">
                <Bell size={20} strokeWidth={1.8} className="text-[var(--neutral_900)] shrink-0" />
                {!isCollapsed && <span style={{
                  fontFamily: 'var(--Body_md_medium_font_family)',
                  fontSize: 'var(--Body_md_medium_font_size)',
                  fontWeight: 'var(--Body_md_medium_font_weight)',
                  lineHeight: 'var(--Body_md_medium_line_height)',
                  letterSpacing: 'var(--Body_md_medium_letter_spacing)',
                  color: 'var(--neutral_900)'
                }}>알림</span>}
              </div>
              {!isCollapsed && <img src={iconBadgeNew} alt="N" width={16} height={16} />}
              {isCollapsed && <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border border-white"></div>}
            </button>
            <div className="h-px bg-gray-100 my-2 w-full"></div>
          </div>

          {/* 1. General & Mgmt Sections */}
          {MENU_GROUPS.map((group, idx) => (
            <div key={idx} className="flex flex-col gap-[var(--nav_item_gap)]">
              {group.title && !isCollapsed && (
                <div className="px-3 mt-2 first:mt-0">
                  <span style={{
                    fontFamily: 'var(--Body_sm_medium_font_family)',
                    fontSize: 'var(--Body_sm_medium_font_size)',
                    fontWeight: 'var(--Body_sm_medium_font_weight)',
                    lineHeight: 'var(--Body_sm_medium_line_height)',
                    letterSpacing: 'var(--Body_sm_medium_letter_spacing)',
                    color: 'var(--Gray_Secondary_text)'
                  }}>{group.title}</span>
                </div>
              )}

              <ul className="flex flex-col" style={{ gap: 'var(--nav_item_gap)' }}>
                {group.items.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center rounded-lg transition-colors tracking-tight gap-3
                                        ${activeMenu === item.id ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50 font-medium'}
                                        ${isCollapsed ? 'justify-center px-0' : 'px-3'}
                                        text-[var(--neutral_900)]
                                    `}
                      style={{
                        height: 'var(--nav_item_height)',
                        fontFamily: 'var(--Body_md_medium_font_family)',
                        fontSize: 'var(--Body_md_medium_font_size)',
                        lineHeight: 'var(--Body_md_medium_line_height)',
                        letterSpacing: 'var(--Body_md_medium_letter_spacing)',
                      }}
                      title={isCollapsed ? item.label : ''}
                    >
                      <item.icon size={20} className={`text-[var(--neutral_900)] shrink-0`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 2. Accounting Section (Collapsible) */}
          <div className="flex flex-col" style={{ gap: 'var(--nav_item_gap)' }}>
            <button
              onClick={() => {
                if (isCollapsed) {
                  setIsCollapsed(false);
                  setIsAccountingOpen(true);
                } else {
                  setIsAccountingOpen(!isAccountingOpen);
                }
              }}
              className={`w-full flex items-center rounded-lg transition-colors group tracking-tight
                        ${isAccountingOpen && !isCollapsed ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50 font-medium'}
                        ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3'}
                        text-[var(--neutral_900)]
                    `}
              style={{
                height: 'var(--nav_item_height)',
                fontFamily: 'var(--Body_md_medium_font_family)',
                fontSize: 'var(--Body_md_medium_font_size)',
                lineHeight: 'var(--Body_md_medium_line_height)',
                letterSpacing: 'var(--Body_md_medium_letter_spacing)',
              }}
              title="회계 관리"
            >
              <div className="flex items-center gap-3">
                <Database size={20} className={`text-[var(--neutral_900)] shrink-0`} />
                {!isCollapsed && <span>회계 관리</span>}
              </div>
              {!isCollapsed && (
                isAccountingOpen
                  ? <ChevronDown size={20} className="text-gray-500" style={{ transform: 'rotate(180deg)' }} />
                  : <ChevronDown size={20} className="text-gray-400" />
              )}
            </button>

            {/* Accounting Sub-items */}
            {isAccountingOpen && !isCollapsed && (
              <ul className="ml-0 flex flex-col" style={{ gap: 'var(--nav_item_gap)' }}>
                {ACCOUNTING_MENU_ITEMS.map((item) => {
                  const isActive = activeMenu === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveMenu(item.id)}
                        className={`w-full flex items-center pr-3 pl-[52px] rounded-lg transition-colors tracking-tight
                                             ${isActive ? 'font-bold' : 'font-medium hover:text-gray-900'}
                                             text-[var(--neutral_900)]
                                         `}
                        style={{
                          height: 'var(--nav_item_height)',
                          fontFamily: 'var(--Body_md_medium_font_family)',
                          fontSize: 'var(--Body_md_medium_font_size)',
                          lineHeight: 'var(--Body_md_medium_line_height)',
                          letterSpacing: 'var(--Body_md_medium_letter_spacing)',
                        }}
                      >
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

        </nav>

        {/* User Profile */}
        <div className={`w-full bg-white absolute bottom-0 left-0 z-20 flex items-center ${isCollapsed ? 'justify-center' : ''}`}
          style={{
            padding: isCollapsed ? '12px 0 16px 0' : '12px 20px 16px 20px',
            borderTop: '1px solid var(--neutral_300)',
            gap: '8px'
          }}>
          <img src={iconProfile} alt="Profile" width={32} height={32} className="w-[32px] h-[32px] rounded-full shrink-0" />
          {!isCollapsed && (
            <div className="flex flex-col whitespace-nowrap overflow-hidden">
              <span className="leading-tight" style={{
                fontFamily: 'var(--Body_md_medium_font_family)', // Using medium as base for name
                fontWeight: '700', // Bold for name as per previous design
                fontSize: 'var(--Body_md_medium_font_size)',
                color: 'var(--neutral_900)'
              }}>김피엠</span>
            </div>
          )}
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto bg-[var(--neutral_50)] relative p-[40px]">
        <div className="h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
