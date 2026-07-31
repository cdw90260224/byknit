'use client';

import React, { useState, use } from 'react';
import { ProductManagement, ProductSubTab } from '@/components/seller/ProductManagement';

export default function AdminSellerProductsTab({
    params
}: {
    params: Promise<{ locale: string, sellerId: string }>;
}) {
    const { locale } = use(params);
    const [activeSubTab, setActiveSubTab] = useState<ProductSubTab>('list');
    
    const subTabs = [
        { id: 'list', label: locale === 'ko' ? '상품 조회/수정' : 'Product List' },
        { id: 'register', label: locale === 'ko' ? '상품 등록' : 'Register Product' },
        { id: 'bulk', label: locale === 'ko' ? '상품 일괄등록' : 'Bulk Registration' },
        { id: 'catalog', label: locale === 'ko' ? '상품 카탈로그 관리' : 'Catalog Management' },
        { id: 'related', label: locale === 'ko' ? '연관상품 관리' : 'Related Products' },
        { id: 'announcements', label: locale === 'ko' ? '상품 공지사항 관리' : 'Announcements' },
        { id: 'shipping', label: locale === 'ko' ? '배송정보 관리' : 'Shipping Info' }
    ] as const;

    return (
        <div className="w-full">
            {/* Secondary Sub-Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto border-b border-stone-100 pb-2">
                {subTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id as ProductSubTab)}
                        className={`whitespace-nowrap px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                            activeSubTab === tab.id 
                                ? 'bg-stone-800 text-white shadow-soft' 
                                : 'bg-white text-stone-500 hover:bg-stone-50 border border-stone-200'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <ProductManagement 
                locale={locale} 
                activeSubTab={activeSubTab} 
                setActiveSubTab={setActiveSubTab} 
            />
        </div>
    );
}
