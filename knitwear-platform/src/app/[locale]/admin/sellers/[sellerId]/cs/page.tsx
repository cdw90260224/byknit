'use client';

import React, { use } from 'react';
import { ClaimManagement } from '@/components/seller/ClaimManagement';

export default function AdminSellerClaimsTab({
    params
}: {
    params: Promise<{ locale: string, sellerId: string }>;
}) {
    const { locale } = use(params);
    return <ClaimManagement locale={locale} />;
}
