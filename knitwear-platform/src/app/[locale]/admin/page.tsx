import { redirect } from 'next/navigation';

export default async function AdminIndexRedirect({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    // Redirect to the sellers management page by default
    redirect(`/${locale}/admin/sellers`);
}
