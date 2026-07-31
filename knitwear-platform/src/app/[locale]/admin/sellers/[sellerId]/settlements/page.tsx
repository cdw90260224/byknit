'use client';

import React, { useState, use } from 'react';
import { SettlementManagement, SettlementSubTab } from '@/components/seller/SettlementManagement';

export default function AdminSellerSettlementTab({
    params
}: {
    params: Promise<{ locale: string, sellerId: string }>;
}) {
    const { locale } = use(params);
    const [activeSubTab, setActiveSubTab] = useState<SettlementSubTab>('daily');
    
    const subTabs = [
        { id: 'daily', label: locale === 'ko' ? '정산 내역 (일별/건별)' : 'Daily Settlements' },
        { id: 'itemized', label: locale === 'ko' ? '항목별 정산 내역' : 'Itemized Settlements' }
    ] as const;

    return (
        <div className="w-full">
            {/* Secondary Sub-Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto border-b border-stone-100 pb-2">
                {subTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id as SettlementSubTab)}
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

            <SettlementManagement locale={locale} activeSubTab={activeSubTab} />
        </div>
    );
}
