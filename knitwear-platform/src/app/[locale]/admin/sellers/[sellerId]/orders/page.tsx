'use client';

import React, { use } from 'react';
import { OrderManagement } from '@/components/seller/OrderManagement';

export default function AdminSellerOrdersTab({
    params
}: {
    params: Promise<{ locale: string, sellerId: string }>;
}) {
    const { locale } = use(params);
    return <OrderManagement locale={locale} />;
}
