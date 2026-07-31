import { redirect } from 'next/navigation';

export default async function AdminSellerRedirect({
    params
}: {
    params: Promise<{ locale: string, sellerId: string }>;
}) {
    const { locale, sellerId } = await params;
    redirect(`/${locale}/admin/sellers/${sellerId}/dashboard`);
}
