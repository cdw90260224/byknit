'use server';

import { createClient, createAdminClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getSellerBalance(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('seller_balance_krw')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching seller balance:', error);
        return 0;
    }

    return data.seller_balance_krw ?? 0;
}

export async function getSettlementHistory(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('settlement_transactions')
        .select('*')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching settlement history:', error);
        return [];
    }

    return data;
}

// 도안 판매 시 판매자에게 원화(KRW) 정산 적립. 웹훅/서버 액션에서 호출되므로 admin client로 RLS 우회.
export async function creditSellerSettlement(
    sellerId: string,
    amountKrw: number,
    orderId: string | null,
    description: string
) {
    if (amountKrw <= 0) return;

    const supabase = await createAdminClient();

    const { error } = await supabase
        .from('settlement_transactions')
        .insert({
            seller_id: sellerId,
            order_id: orderId,
            amount: amountKrw,
            type: 'sale',
            description
        });

    if (error) {
        console.warn('Error inserting settlement transaction, falling back to direct balance update:', error.message);

        const { data: profile } = await supabase
            .from('profiles')
            .select('seller_balance_krw')
            .eq('id', sellerId)
            .single();

        const currentBalance = profile?.seller_balance_krw ?? 0;
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ seller_balance_krw: currentBalance + amountKrw })
            .eq('id', sellerId);

        if (profileError) {
            console.error('Fallback direct seller balance update failed:', profileError.message);
            throw new Error('Failed to credit seller settlement');
        }
    }

    revalidatePath('/', 'layout');
}
