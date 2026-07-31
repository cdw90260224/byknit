'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { SellerDashboard } from '@/components/seller/SellerDashboard';

export default function AdminSellerDashboardTab({
    params
}: {
    params: Promise<{ locale: string, sellerId: string }>;
}) {
    const { locale, sellerId } = use(params);
    const router = useRouter();

    const handleSetActiveTab = (tab: string) => {
        router.push(`/${locale}/admin/sellers/${sellerId}/${tab === 'claims' ? 'cs' : tab}`);
    };

    return <SellerDashboard setActiveTab={handleSetActiveTab as any} locale={locale} />;
}
