'use client';

import React, { useState } from 'react';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Truck, 
    AlertCircle, 
    Receipt, 
    Settings, 
    Menu, 
    X, 
    Store,
    ArrowLeft,
    BarChart3,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import { SellerTab } from '@/app/[locale]/seller/page';
import { ProductSubTab } from './ProductManagement';
import { SettlementSubTab } from './SettlementManagement';

interface SellerSidebarProps {
    activeTab: SellerTab;
    setActiveTab: (tab: SellerTab) => void;
    activeSubTab: ProductSubTab;
    setActiveSubTab: (subTab: ProductSubTab) => void;
    activeSettlementSubTab: SettlementSubTab;
    setActiveSettlementSubTab: (subTab: SettlementSubTab) => void;
    locale: string;
    userEmail: string;
    isAdminView?: boolean;
    adminReturnUrl?: string;
}

export function SellerSidebar({ 
    activeTab, 
    setActiveTab, 
    activeSubTab,
    setActiveSubTab,
    activeSettlementSubTab,
    setActiveSettlementSubTab,
    locale, 
    userEmail,
    isAdminView = false,
    adminReturnUrl
}: SellerSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isProductsExpanded, setIsProductsExpanded] = useState(true);
    const [isSettlementsExpanded, setIsSettlementsExpanded] = useState(true);

    const menuItems = [
        { id: 'dashboard', label: locale === 'ko' ? '대시보드' : 'Dashboard', icon: LayoutDashboard },
        { id: 'products', label: locale === 'ko' ? '상품 관리' : 'Products', icon: ShoppingBag },
        { id: 'orders', label: locale === 'ko' ? '주문 및 배송' : 'Orders & Shipping', icon: Truck },
        { id: 'claims', label: locale === 'ko' ? '클레임 & CS' : 'Claims & CS', icon: AlertCircle },
        { id: 'sales', label: locale === 'ko' ? '매출 관리' : 'Sales Analysis', icon: BarChart3 },
        { id: 'settlement', label: locale === 'ko' ? '정산 관리' : 'Settlements', icon: Receipt },
        // Only show settings if not admin view
        ...(isAdminView ? [] : [{ id: 'settings', label: locale === 'ko' ? '판매자 정보' : 'Seller Info', icon: Settings }]),
    ] as const;

    const productSubMenus = [
        { id: 'list', label: locale === 'ko' ? '상품 조회/수정' : 'Inquiry & Modify' },
        { id: 'register', label: locale === 'ko' ? '상품 등록' : 'Product Register' },
        { id: 'bulk', label: locale === 'ko' ? '상품 일괄등록' : 'Bulk Upload' },
        { id: 'announcements', label: locale === 'ko' ? '상품 공지사항 관리' : 'Announcements' },
        { id: 'shipping', label: locale === 'ko' ? '배송정보 관리' : 'Shipping Info' }
    ] as const;

    const settlementSubMenus = [
        { id: 'daily', label: locale === 'ko' ? '정산 내역(일별/건별)' : 'Daily / Per Item' },
        { id: 'category', label: locale === 'ko' ? '항목별 정산 내역' : 'By Category' }
    ] as const;

    const handleTabChange = (tabId: SellerTab) => {
        if (tabId === 'products') {
            setIsProductsExpanded(!isProductsExpanded);
            setActiveTab('products');
        } else if (tabId === 'settlement') {
            setIsSettlementsExpanded(!isSettlementsExpanded);
            setActiveTab('settlement');
        } else {
            setActiveTab(tabId);
            setIsOpen(false);
        }
    };

    const handleSubTabChange = (tabId: SellerTab, subTabId: ProductSubTab | SettlementSubTab) => {
        setActiveTab(tabId);
        if (tabId === 'products') {
            setActiveSubTab(subTabId as ProductSubTab);
        } else if (tabId === 'settlement') {
            setActiveSettlementSubTab(subTabId as SettlementSubTab);
        }
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Header */}
            <header className="md:hidden w-full bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
                <div className="flex items-center gap-2">
                    <Store className="text-[#8FBC8F] w-6 h-6" />
                    <span className="font-sans font-bold text-stone-800 text-lg">byKnit Seller</span>
                </div>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-stone-600 hover:text-stone-800 hover:bg-stone-50 rounded-xl transition-all"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Backdrop for Mobile */}
            {isOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 transition-all"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`
                fixed md:static inset-y-0 left-0 w-72 bg-white border-r border-stone-100 z-50 p-6 flex flex-col justify-between transition-transform duration-300 md:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="space-y-8">
                    {/* Brand Identity */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#E8F0E8] flex items-center justify-center text-[#556B2F]">
                            <Store size={22} />
                        </div>
                        <div>
                            <span className="font-sans font-bold text-stone-800 text-xl block leading-tight">byKnit Seller</span>
                            <span className="text-sm text-stone-400 font-medium">{locale === 'ko' ? '판매자 센터' : 'Partner Console'}</span>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            
                            return (
                                <div key={item.id} className="space-y-1">
                                    <button
                                        onClick={() => handleTabChange(item.id)}
                                        className={`
                                            w-full flex items-center justify-between px-4 py-3 rounded-2xl text-base font-bold transition-all
                                            ${isActive && item.id !== 'products' && item.id !== 'settlement'
                                                ? 'bg-[#E8F0E8] text-[#556B2F] shadow-inner-soft' 
                                                : isActive && (item.id === 'products' || item.id === 'settlement')
                                                ? 'text-[#556B2F] bg-stone-50'
                                                : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'}
                                        `}
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <Icon size={18} className={isActive ? 'text-[#556B2F]' : 'text-stone-400'} />
                                            <span>{item.label}</span>
                                        </div>
                                        {item.id === 'products' && (
                                            isProductsExpanded ? <ChevronUp size={14} className="text-stone-400" /> : <ChevronDown size={14} className="text-stone-400" />
                                        )}
                                        {item.id === 'settlement' && (
                                            isSettlementsExpanded ? <ChevronUp size={14} className="text-stone-400" /> : <ChevronDown size={14} className="text-stone-400" />
                                        )}
                                    </button>

                                    {/* Products Submenus */}
                                    {item.id === 'products' && isProductsExpanded && (
                                        <div className="ml-5 pl-4 border-l border-stone-200 space-y-1 py-1">
                                            {productSubMenus.map((sub) => {
                                                const isSubActive = activeTab === 'products' && activeSubTab === sub.id;
                                                return (
                                                    <button
                                                        key={sub.id}
                                                        onClick={() => handleSubTabChange('products', sub.id)}
                                                        className={`
                                                            w-full text-left py-2 px-3.5 rounded-xl text-sm font-bold transition-all block
                                                            ${isSubActive 
                                                                ? 'text-[#556B2F] bg-[#E8F0E8] font-bold' 
                                                                : 'text-stone-500 hover:text-stone-850 hover:bg-stone-50/70'}
                                                        `}
                                                    >
                                                        {sub.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Settlement Submenus */}
                                    {item.id === 'settlement' && isSettlementsExpanded && (
                                        <div className="ml-5 pl-4 border-l border-stone-200 space-y-1 py-1">
                                            {settlementSubMenus.map((sub) => {
                                                const isSubActive = activeTab === 'settlement' && activeSettlementSubTab === sub.id;
                                                return (
                                                    <button
                                                        key={sub.id}
                                                        onClick={() => handleSubTabChange('settlement', sub.id)}
                                                        className={`
                                                            w-full text-left py-2 px-3.5 rounded-xl text-sm font-bold transition-all block
                                                            ${isSubActive 
                                                                ? 'text-[#556B2F] bg-[#E8F0E8] font-bold' 
                                                                : 'text-stone-500 hover:text-stone-850 hover:bg-stone-50/70'}
                                                        `}
                                                    >
                                                        {sub.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Section */}
                <div className="space-y-4 pt-6 border-t border-stone-100">
                    <div className="px-4">
                        <span className="text-sm text-stone-400 block font-medium">Logged in as</span>
                        <span className="text-base font-bold text-stone-700 truncate block max-w-full" title={userEmail}>
                            {userEmail}
                        </span>
                    </div>

                    <Link 
                        href={isAdminView && adminReturnUrl ? adminReturnUrl : `/${locale}/marketplace/dashboard`}
                        className="flex items-center gap-2.5 px-4 py-3 w-full text-stone-500 hover:text-stone-800 hover:bg-stone-50 rounded-2xl text-sm font-bold transition-all"
                    >
                        <ArrowLeft size={16} />
                        <span>{isAdminView 
                            ? (locale === 'ko' ? '판매자 리스트로 돌아가기' : 'Back to Sellers List') 
                            : (locale === 'ko' ? '디자이너 콘솔로 이동' : 'Back to Designer Console')}</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
