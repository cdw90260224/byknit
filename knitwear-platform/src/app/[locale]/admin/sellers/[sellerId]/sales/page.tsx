'use client';

import React, { use } from 'react';
import { SalesManagement } from '@/components/seller/SalesManagement';

export default function AdminSellerSalesTab({
    params
}: {
    params: Promise<{ locale: string, sellerId: string }>;
}) {
    const { locale } = use(params);
    return <SalesManagement locale={locale} />;
}
