'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export default function PaymentsPage() {
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || 'ko';
    const isKo = locale === 'ko';

    const [user, setUser] = useState<User | null>(null);
    const [currentCredits, setCurrentCredits] = useState<number>(0);
    const [loadingUser, setLoadingUser] = useState(true);

    const supabase = createClient();

    // 유저 정보 및 크레딧 정보 획득
    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push(`/${locale}/login?next=/${locale}/payments`);
                return;
            }
            setUser(user);

            // Fetch profile credits
            const { data: profile } = await supabase
                .from('profiles')
                .select('credits')
                .eq('id', user.id)
                .single();

            if (profile) {
                setCurrentCredits(profile.credits ?? 0);
            }
            setLoadingUser(false);
        };

        fetchUserData();
    }, [router, locale, supabase]);

    if (loadingUser) {
        return (
            <div className="min-h-screen bg-cream-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brown-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-soft border border-tan-200">
                
                {/* Header */}
                <div className="border-b border-tan-100 pb-6 mb-8">
                    <h1 className="text-3xl font-bold text-brown-800 mb-2">
                        {isKo ? '크레딧 적립 안내' : 'About Credits'}
                    </h1>
                    <p className="text-brown-600">
                        {isKo
                            ? '크레딧은 더 이상 충전(구매)할 수 없습니다. 가입, 글쓰기, 도안 업로드 등 활동을 통해 무료로 적립되며, 차트변환기·도안에디터 같은 도구를 사용할 때 소비됩니다.'
                            : 'Credits can no longer be charged with money. They are earned for free through activities like signing up, writing posts, or uploading patterns, and are spent on tools like the chart converter and pattern editor.'}
                    </p>
                </div>

                {/* User Status */}
                <div className="bg-cream-50 rounded-2xl p-5 mb-8 border border-tan-150 flex justify-between items-center">
                    <div>
                        <span className="text-sm text-brown-600">{isKo ? '로그인 계정' : 'Account'}</span>
                        <p className="font-semibold text-brown-800">{user?.email}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-sm text-brown-600">{isKo ? '보유 크레딧' : 'Current Balance'}</span>
                        <p className="text-2xl font-bold text-emerald-600">
                            {currentCredits.toLocaleString()} <span className="text-sm font-normal text-brown-700">Credits</span>
                        </p>
                    </div>
                </div>

                {/* Info: Charging discontinued */}
                <div className="bg-cream-50 rounded-2xl p-6 border border-tan-150 text-center">
                    <p className="font-bold text-brown-800 mb-2">
                        {isKo ? '💳 크레딧 충전 기능이 종료되었습니다' : '💳 Credit charging has been discontinued'}
                    </p>
                    <p className="text-sm text-brown-600 mb-6">
                        {isKo
                            ? '도안이나 상품 구매는 이제 원화(₩)로 직접 결제합니다. 크레딧은 도구 사용 전용 적립금입니다.'
                            : 'Patterns and products are now purchased directly with KRW. Credits are only for using our tools.'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href={`/${locale}/marketplace`}
                            className="px-6 py-3 rounded-2xl bg-brown-600 hover:bg-brown-700 text-white font-bold transition-all duration-200 shadow-soft"
                        >
                            {isKo ? '마켓플레이스 둘러보기' : 'Browse Marketplace'}
                        </a>
                        <a
                            href={`/${locale}/profile`}
                            className="px-6 py-3 rounded-2xl bg-white border border-tan-300 hover:bg-cream-50 text-brown-800 font-bold transition-all duration-200"
                        >
                            {isKo ? '적립 내역 보기' : 'View Credit History'}
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}
