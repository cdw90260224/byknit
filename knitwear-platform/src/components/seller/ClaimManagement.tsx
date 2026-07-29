'use client';

import React, { useState } from 'react';
import { 
    AlertCircle, 
    MessageSquare, 
    Check, 
    X, 
    User,
    CornerDownRight,
    Send,
    Truck,
    RefreshCw,
    XCircle,
    Star
} from 'lucide-react';

interface Claim {
    id: string;
    customerName: string;
    productName: string;
    productThumbnail: string;
    type: 'cancel' | 'return' | 'exchange';
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    date: string;
    price: number;
    shippingFee: number;
    optionSelected?: string;
    exchangeOption?: string; // Only for exchanges
}

interface Inquiry {
    id: number;
    author: string;
    productName: string;
    productThumbnail: string;
    content: string;
    date: string;
    status: 'pending' | 'answered';
    answer?: string;
}

interface Review {
    id: number;
    author: string;
    productName: string;
    productThumbnail: string;
    rating: number; // 1-5
    content: string;
    date: string;
    status: 'pending' | 'answered';
    answer?: string;
}

type ClaimSubTab = 'cancel' | 'return' | 'exchange' | 'inquiries' | 'reviews';

export function ClaimManagement({ locale }: { locale: string }) {
    // Sub-tab state
    const [activeSubTab, setActiveSubTab] = useState<ClaimSubTab>('cancel');

    // Claims Mock Database
    const [claims, setClaims] = useState<Claim[]>([
        { 
            id: 'CLM-C01', 
            customerName: '오수현', 
            productName: '카본 대바늘 35cm 5종 풀패키지', 
            productThumbnail: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=200',
            type: 'cancel', 
            reason: '사이즈 오선택으로 인한 즉시 취소 요청', 
            status: 'pending',
            date: '2026.07.24 10:15',
            price: 24000,
            shippingFee: 3000,
            optionSelected: '3mm ~ 5mm 패키지'
        },
        { 
            id: 'CLM-C02', 
            customerName: '이민호', 
            productName: '파스텔 소프트 코튼 털실 (50g)', 
            productThumbnail: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=200&auto=format&fit=crop',
            type: 'cancel', 
            reason: '배송 시작 전에 다른 상품으로 재주문하고자 긴급 취소 요청합니다.', 
            status: 'approved',
            date: '2026.07.23 14:10',
            price: 19000,
            shippingFee: 3000,
            optionSelected: '밀크화이트 / 얇음'
        },
        { 
            id: 'CLM-R01', 
            customerName: '김미선', 
            productName: '파스텔 소프트 코튼 털실 (50g)', 
            productThumbnail: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=200&auto=format&fit=crop',
            type: 'return', 
            reason: '화면에서 본 색상이 생각했던 것보다 실물은 어두워요. 미개봉 상태로 반품 요청합니다.', 
            status: 'pending',
            date: '2026.07.23 18:22',
            price: 19000,
            shippingFee: 3000,
            optionSelected: '밀크화이트 / 얇음'
        },
        { 
            id: 'CLM-E01', 
            customerName: '최진우', 
            productName: '비건 레더 가죽 라벨 (10개입)', 
            productThumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=200',
            type: 'exchange', 
            reason: '브라운 레더로 잘못 선택해 결제했어요. 혹시 블랙 레더 옵션으로 교환 배송 가능할까요?', 
            status: 'pending',
            date: '2026.07.22 14:05',
            price: 7000,
            shippingFee: 3000,
            optionSelected: '브라운 레더',
            exchangeOption: '클래식 블랙'
        }
    ]);

    // Inquiries State
    const [inquiries, setInquiries] = useState<Inquiry[]>([
        { 
            id: 1, 
            author: '김은지', 
            productName: '파스텔 소프트 코튼 털실 (50g)', 
            productThumbnail: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=200&auto=format&fit=crop',
            content: '클래식 울 털실 아이보리색 재입고 일정이 언제쯤 되나요? 가을 가디건 뜨려고 하는데 기다리는 중입니다.', 
            date: '10분 전', 
            status: 'pending' 
        },
        { 
            id: 2, 
            author: '이태영', 
            productName: '카본 대바늘 35cm 5종 풀패키지', 
            productThumbnail: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=200',
            content: '5호 대바늘 패키지 배송 발송되었나요? 목요일까지는 꼭 받아야 해서 급합니다.', 
            date: '1시간 전', 
            status: 'pending' 
        },
        { 
            id: 3, 
            author: 'Sarah K.', 
            productName: '유기농 내추럴 메리노 울', 
            productThumbnail: 'https://images.unsplash.com/photo-1584992236310-6edddc085ff8?q=80&w=200&auto=format&fit=crop',
            content: 'Is the Sage Green yarn lot consistent? I want to make sure colors match.', 
            date: '4시간 전', 
            status: 'pending' 
        },
        { 
            id: 4, 
            author: '한나경', 
            productName: '파스텔 소프트 코튼 털실 (50g)', 
            productThumbnail: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=200&auto=format&fit=crop',
            content: '보통 니트 하나 뜨는데 몇 볼정도 드나요?', 
            date: '1일 전', 
            status: 'answered',
            answer: '여성 M 사이즈 기본 니트 기준으로 보통 6~8볼 정도 소요됩니다. 뜨시는 게이지에 따라 오차가 있을 수 있으니 여유있게 구매하시는 것을 추천해 드립니다!'
        }
    ]);

    // Reviews State
    const [reviews, setReviews] = useState<Review[]>([
        {
            id: 101,
            author: '김현아',
            productName: '파스텔 소프트 코튼 털실 (50g)',
            productThumbnail: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=200&auto=format&fit=crop',
            rating: 5,
            content: '실 색상이 너무 파스텔톤으로 뽀얗고 촉촉해요! 목도리 뜨고 있는데 가볍고 따뜻해서 대만족입니다. 다른 색상도 추가로 사고 싶어요.',
            date: '2026.07.28 15:40',
            status: 'pending'
        },
        {
            id: 102,
            author: '박정우',
            productName: '흠집 매트, 블랙 20개 2cm',
            productThumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=200',
            rating: 4,
            content: '배송 아주 빠르고 재질도 탄탄해서 흠집 소음방지에 대박입니다. 다만 2cm 치고는 두께감이 딱 적당하네요. 재구매 의향 있습니다.',
            date: '2026.07.27 11:20',
            status: 'answered',
            answer: '소중한 구매후기 진심으로 감사드립니다! 흠집 매트로 한층 더 조용하고 안전한 공간이 되시길 기원하겠습니다. 늘 좋은 품질의 제품으로 보답하겠습니다.'
        },
        {
            id: 103,
            author: '최민지',
            productName: '유기농 내추럴 메리노 울',
            productThumbnail: 'https://images.unsplash.com/photo-1584992236310-6edddc085ff8?q=80&w=200&auto=format&fit=crop',
            rating: 5,
            content: '울 털실 퀄리티 진짜 부드러워요. 까슬거림 전혀 없고 포근하네요. 스웨터 뜨려고 하는데 완성작이 너무 기대됩니다!',
            date: '2026.07.25 18:05',
            status: 'pending'
        }
    ]);

    // Temp Q&A answers
    const [answerText, setAnswerText] = useState<Record<number, string>>({});
    // Temp Review answers
    const [reviewAnswerText, setReviewAnswerText] = useState<Record<number, string>>({});

    const handleAnswerChange = (id: number, text: string) => {
        setAnswerText({ ...answerText, [id]: text });
    };

    const handleRegisterAnswer = (inquiryId: number) => {
        const text = answerText[inquiryId];
        if (!text || !text.trim()) return;

        setInquiries(inquiries.map(inq => {
            if (inq.id === inquiryId) {
                return { ...inq, status: 'answered', answer: text.trim() };
            }
            return inq;
        }));

        const updated = { ...answerText };
        delete updated[inquiryId];
        setAnswerText(updated);
        alert(locale === 'ko' ? '문의 답변이 등록되었습니다.' : 'Answer registered.');
    };

    const handleReviewAnswerChange = (id: number, text: string) => {
        setReviewAnswerText({ ...reviewAnswerText, [id]: text });
    };

    const handleRegisterReviewAnswer = (reviewId: number) => {
        const text = reviewAnswerText[reviewId];
        if (!text || !text.trim()) return;

        setReviews(reviews.map(rev => {
            if (rev.id === reviewId) {
                return { ...rev, status: 'answered', answer: text.trim() };
            }
            return rev;
        }));

        const updated = { ...reviewAnswerText };
        delete updated[reviewId];
        setReviewAnswerText(updated);
        alert(locale === 'ko' ? '리뷰 답변이 등록되었습니다.' : 'Review reply registered.');
    };

    // Action handlers for claims
    const handleApproveClaim = (claimId: string, actionName: string) => {
        setClaims(claims.map(c => {
            if (c.id === claimId) {
                return { ...c, status: 'approved' };
            }
            return c;
        }));
        alert(locale === 'ko' ? `${actionName} 처리가 승인 완료되었습니다.` : 'Approved successfully.');
    };

    const handleRejectClaim = (claimId: string) => {
        const reason = prompt(locale === 'ko' ? '반려(거절) 사유를 적어주세요:' : 'Please enter rejection reason:');
        if (reason === null) return; // user cancelled prompt

        setClaims(claims.map(c => {
            if (c.id === claimId) {
                return { ...c, status: 'rejected' };
            }
            return c;
        }));
        alert(locale === 'ko' ? '요청이 반려 처리되었습니다.' : 'Request rejected.');
    };

    // Count tabs warning badges
    const getPendingCount = (type: 'cancel' | 'return' | 'exchange') => {
        return claims.filter(c => c.type === type && c.status === 'pending').length;
    };

    return (
        <div className="space-y-6 text-stone-700 animate-fadeIn font-sans">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-black text-stone-800">
                    {locale === 'ko' ? '클레임 및 CS 관리' : 'CS & Claim Center'}
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                    {locale === 'ko' 
                        ? '고객의 주문 취소, 반품 수거, 교환 요청 처리 및 문의/리뷰 게시판을 전담 관리합니다.' 
                        : 'Manage cancellations, returns, exchanges, inquiries, and customer reviews.'}
                </p>
            </div>

            {/* Sub-tab Swapper */}
            <div className="flex border-b border-stone-200">
                <button
                    onClick={() => setActiveSubTab('cancel')}
                    className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                        activeSubTab === 'cancel'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                >
                    <span>{locale === 'ko' ? '주문취소 관리' : 'Cancel Orders'}</span>
                    {getPendingCount('cancel') > 0 && (
                        <span className="text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full">
                            {getPendingCount('cancel')}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveSubTab('return')}
                    className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                        activeSubTab === 'return'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                >
                    <span>{locale === 'ko' ? '반품 관리' : 'Return Log'}</span>
                    {getPendingCount('return') > 0 && (
                        <span className="text-[10px] font-black bg-rose-50 text-rose-500 border border-rose-200 px-1.5 py-0.5 rounded-full">
                            {getPendingCount('return')}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveSubTab('exchange')}
                    className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                        activeSubTab === 'exchange'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                >
                    <span>{locale === 'ko' ? '교환 관리' : 'Exchange Log'}</span>
                    {getPendingCount('exchange') > 0 && (
                        <span className="text-[10px] font-black bg-indigo-50 text-indigo-500 border border-indigo-200 px-1.5 py-0.5 rounded-full">
                            {getPendingCount('exchange')}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveSubTab('inquiries')}
                    className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                        activeSubTab === 'inquiries'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                >
                    <span>{locale === 'ko' ? '상품 Q&A 문의' : 'Product Q&A'}</span>
                    {inquiries.filter(i => i.status === 'pending').length > 0 && (
                        <span className="text-[10px] font-black bg-stone-100 text-stone-600 border border-stone-200 px-1.5 py-0.5 rounded-full">
                            {inquiries.filter(i => i.status === 'pending').length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveSubTab('reviews')}
                    className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                        activeSubTab === 'reviews'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                >
                    <span>{locale === 'ko' ? '구매후기(리뷰) 관리' : 'Product Reviews'}</span>
                    {reviews.filter(r => r.status === 'pending').length > 0 && (
                        <span className="text-[10px] font-black bg-rose-50 text-rose-500 border border-rose-200 px-1.5 py-0.5 rounded-full">
                            {reviews.filter(r => r.status === 'pending').length}
                        </span>
                    )}
                </button>
            </div>

            {/* Sub-tab content renderer */}
            <div className="space-y-4">
                {/* 1. 주문취소 관리 */}
                {activeSubTab === 'cancel' && (
                    <div className="space-y-4">
                        {claims.filter(c => c.type === 'cancel').map(c => (
                            <div key={c.id} className={`bg-white p-6 rounded-3xl border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all ${
                                c.status === 'approved' ? 'border-emerald-100 bg-emerald-50/5' : c.status === 'rejected' ? 'border-stone-100 bg-stone-50/10' : 'border-stone-150'
                            }`}>
                                <div className="space-y-3 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-md">
                                            {locale === 'ko' ? '취소 요청' : 'Cancel Request'}
                                        </span>
                                        <span className="text-stone-400 text-xs font-semibold">{c.id}</span>
                                        <span className="text-stone-800 text-xs font-black">{c.customerName}</span>
                                        <span className="text-stone-400 text-xs">{c.date}</span>
                                    </div>
                                    
                                    <div className="flex gap-3.5 items-start">
                                        <img 
                                            src={c.productThumbnail} 
                                            alt={c.productName}
                                            className="w-12 h-12 object-cover rounded-xl border border-stone-150 shrink-0 mt-0.5"
                                        />
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-stone-700 text-sm">
                                                {locale === 'ko' ? '취소 상품' : 'Product'}: <span className="text-stone-800">{c.productName} ({c.optionSelected})</span>
                                            </h4>
                                            <div className="text-xs text-stone-500 font-bold">
                                                {locale === 'ko' ? '환불 예정액' : 'Refund Value'}: <span className="text-rose-500 font-black">₩{(c.price + c.shippingFee).toLocaleString()}</span> (배송비 포함)
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-2xl border border-stone-100 leading-relaxed font-semibold">
                                        <b>{locale === 'ko' ? '취소 사유' : 'Reason'}:</b> {c.reason}
                                    </div>
                                </div>

                                <div className="shrink-0 flex items-center gap-2 pt-4 border-t md:border-t-0 md:pt-0">
                                    {c.status === 'pending' ? (
                                        <>
                                            <button
                                                onClick={() => handleRejectClaim(c.id)}
                                                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
                                            >
                                                <X size={14} />
                                                <span>{locale === 'ko' ? '취소 반려' : 'Reject'}</span>
                                            </button>
                                            <button
                                                onClick={() => handleApproveClaim(c.id, locale === 'ko' ? '취소 승인' : 'Approve')}
                                                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-soft"
                                            >
                                                <Check size={14} />
                                                <span>{locale === 'ko' ? '취소 승인 (환불)' : 'Approve Refund'}</span>
                                            </button>
                                        </>
                                    ) : (
                                        <span className={`text-xs font-black px-3 py-1 rounded-full ${
                                            c.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-500'
                                        }`}>
                                            {c.status === 'approved' ? (locale === 'ko' ? '취소완료(환불완료)' : 'Refunded') : (locale === 'ko' ? '취소거부(반려)' : 'Rejected')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. 반품 관리 */}
                {activeSubTab === 'return' && (
                    <div className="space-y-4">
                        {claims.filter(c => c.type === 'return').map(c => (
                            <div key={c.id} className={`bg-white p-6 rounded-3xl border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all ${
                                c.status === 'approved' ? 'border-emerald-100 bg-emerald-50/5' : c.status === 'rejected' ? 'border-stone-100 bg-stone-50/10' : 'border-stone-150'
                            }`}>
                                <div className="space-y-3 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-[10px] font-black bg-rose-50 text-rose-500 border border-rose-200 px-2 py-0.5 rounded-md">
                                            {locale === 'ko' ? '반품 요청' : 'Return Request'}
                                        </span>
                                        <span className="text-stone-400 text-xs font-semibold">{c.id}</span>
                                        <span className="text-stone-800 text-xs font-black">{c.customerName}</span>
                                        <span className="text-stone-400 text-xs">{c.date}</span>
                                    </div>
                                    
                                    <div className="flex gap-3.5 items-start">
                                        <img 
                                            src={c.productThumbnail} 
                                            alt={c.productName}
                                            className="w-12 h-12 object-cover rounded-xl border border-stone-150 shrink-0 mt-0.5"
                                        />
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-stone-700 text-sm">
                                                {locale === 'ko' ? '반품 대상 상품' : 'Return Product'}: <span className="text-stone-800">{c.productName} ({c.optionSelected})</span>
                                            </h4>
                                            <div className="text-xs text-stone-500 font-bold">
                                                {locale === 'ko' ? '반품가' : 'Return Value'}: <span className="text-[#556B2F]">₩{c.price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-2xl border border-stone-100 leading-relaxed font-semibold">
                                        <b>{locale === 'ko' ? '반품 사유' : 'Reason'}:</b> {c.reason}
                                    </div>
                                    <div className="flex gap-4 text-xs text-stone-500 font-bold">
                                        <div>
                                            {locale === 'ko' ? '반품수거방식' : 'Return Carrier'}: <span className="text-stone-850">지정 택배 자동 수거 (우체국택배)</span>
                                        </div>
                                        <div>
                                            {locale === 'ko' ? '수거 운송장' : 'Return Tracking'}: <span className="text-blue-500 underline select-all">84792039401</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="shrink-0 flex items-center gap-2 pt-4 border-t md:border-t-0 md:pt-0">
                                    {c.status === 'pending' ? (
                                        <>
                                            <button
                                                onClick={() => handleRejectClaim(c.id)}
                                                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
                                            >
                                                <XCircle size={14} />
                                                <span>{locale === 'ko' ? '반품 거부' : 'Reject'}</span>
                                            </button>
                                            <button
                                                onClick={() => handleApproveClaim(c.id, locale === 'ko' ? '반품 승인' : 'Approve')}
                                                className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-soft"
                                            >
                                                <Truck size={14} />
                                                <span>{locale === 'ko' ? '수거완료 & 환불승인' : 'Approve Refund'}</span>
                                            </button>
                                        </>
                                    ) : (
                                        <span className={`text-xs font-black px-3 py-1 rounded-full ${
                                            c.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-500'
                                        }`}>
                                            {c.status === 'approved' ? (locale === 'ko' ? '반품완료(환불입금완료)' : 'Returned & Refunded') : (locale === 'ko' ? '반품보류(거부)' : 'Rejected')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 3. 교환 관리 */}
                {activeSubTab === 'exchange' && (
                    <div className="space-y-4">
                        {claims.filter(c => c.type === 'exchange').map(c => (
                            <div key={c.id} className={`bg-white p-6 rounded-3xl border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all ${
                                c.status === 'approved' ? 'border-emerald-100 bg-emerald-50/5' : c.status === 'rejected' ? 'border-stone-100 bg-stone-50/10' : 'border-stone-150'
                            }`}>
                                <div className="space-y-3 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 border border-indigo-200 px-2 py-0.5 rounded-md">
                                            {locale === 'ko' ? '교환 요청' : 'Exchange Request'}
                                        </span>
                                        <span className="text-stone-400 text-xs font-semibold">{c.id}</span>
                                        <span className="text-stone-800 text-xs font-black">{c.customerName}</span>
                                        <span className="text-stone-400 text-xs">{c.date}</span>
                                    </div>
                                    
                                    <div className="flex gap-3.5 items-start">
                                        <img 
                                            src={c.productThumbnail} 
                                            alt={c.productName}
                                            className="w-12 h-12 object-cover rounded-xl border border-stone-150 shrink-0 mt-0.5"
                                        />
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-stone-700 text-sm">
                                                {locale === 'ko' ? '교환 대상 상품' : 'Exchange Product'}: <span className="text-stone-800">{c.productName}</span>
                                            </h4>
                                            {/* Option exchange flow */}
                                            <div className="flex items-center gap-2 text-xs bg-stone-50 p-2 rounded-xl border border-stone-100 w-fit font-bold">
                                                <span className="text-stone-400">기존 옵션: {c.optionSelected}</span>
                                                <span className="text-stone-300">➡️</span>
                                                <span className="text-blue-600">교환 옵션: {c.exchangeOption}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-2xl border border-stone-100 leading-relaxed font-semibold">
                                        <b>{locale === 'ko' ? '교환 사유' : 'Reason'}:</b> {c.reason}
                                    </div>
                                </div>

                                <div className="shrink-0 flex items-center gap-2 pt-4 border-t md:border-t-0 md:pt-0">
                                    {c.status === 'pending' ? (
                                        <>
                                            <button
                                                onClick={() => handleRejectClaim(c.id)}
                                                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
                                            >
                                                <X size={14} />
                                                <span>{locale === 'ko' ? '교환 거절' : 'Reject'}</span>
                                            </button>
                                            <button
                                                onClick={() => handleApproveClaim(c.id, locale === 'ko' ? '교환 재발송' : 'Re-Ship')}
                                                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-soft"
                                            >
                                                <RefreshCw size={14} />
                                                <span>{locale === 'ko' ? '교환 수거 및 재배송' : 'Collect & Re-Ship'}</span>
                                            </button>
                                        </>
                                    ) : (
                                        <span className={`text-xs font-black px-3 py-1 rounded-full ${
                                            c.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-500'
                                        }`}>
                                            {c.status === 'approved' ? (locale === 'ko' ? '교환완료(재발송송장등록)' : 'Exchanged & Shipped') : (locale === 'ko' ? '교환반려' : 'Rejected')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 4. 상품 Q&A 문의 */}
                {activeSubTab === 'inquiries' && (
                    <div className="space-y-4">
                        {inquiries.map((q) => (
                            <div 
                                key={q.id}
                                className="bg-white rounded-3xl border border-stone-150 shadow-soft p-6 space-y-4 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center justify-between border-b border-stone-50 pb-2">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={q.productThumbnail} 
                                            alt={q.productName}
                                            className="w-10 h-10 object-cover rounded-xl border border-stone-100 shrink-0"
                                        />
                                        <div className="text-xs space-y-0.5">
                                            <div className="font-bold text-stone-850 truncate max-w-[250px]" title={q.productName}>
                                                {q.productName}
                                            </div>
                                            <div className="flex items-center gap-2 text-stone-400 font-medium">
                                                <span className="font-bold text-stone-800">{q.author}</span>
                                                <span>•</span>
                                                <span>{q.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs text-stone-600 font-semibold leading-relaxed pl-1">
                                    {q.content}
                                </p>

                                {q.status === 'answered' ? (
                                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 flex items-start gap-2.5 animate-fadeIn">
                                        <CornerDownRight size={14} className="text-[#8FBC8F] shrink-0 mt-0.5" />
                                        <div className="text-xs space-y-1">
                                            <span className="font-bold text-[#556B2F] block">{locale === 'ko' ? '상점 답변 완료' : 'Shop Answer'}</span>
                                            <p className="text-stone-500 leading-relaxed font-semibold">{q.answer}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="text" 
                                            placeholder={locale === 'ko' ? '답변을 등록해 주세요...' : 'Write answer to customer...'}
                                            value={answerText[q.id] || ''}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            className="flex-1 bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs outline-none focus:bg-white text-stone-700 font-bold"
                                        />
                                        <button 
                                            onClick={() => handleRegisterAnswer(q.id)}
                                            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-soft"
                                            title="답변 등록"
                                        >
                                            <Send size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* 5. 구매후기(리뷰) 관리 */}
                {activeSubTab === 'reviews' && (
                    <div className="space-y-4">
                        {reviews.map((r) => (
                            <div 
                                key={r.id}
                                className="bg-white rounded-3xl border border-stone-150 shadow-soft p-6 space-y-4 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center justify-between border-b border-stone-50 pb-2">
                                    <div className="flex items-center gap-3">
                                        {/* Product Thumbnail & Name */}
                                        <img 
                                            src={r.productThumbnail} 
                                            alt={r.productName}
                                            className="w-10 h-10 object-cover rounded-xl border border-stone-100 shrink-0"
                                        />
                                        <div className="text-xs space-y-0.5">
                                            <div className="font-bold text-stone-850 truncate max-w-[220px]" title={r.productName}>
                                                {r.productName}
                                            </div>
                                            <div className="flex items-center gap-2 text-stone-400 font-medium">
                                                <span>{r.author}</span>
                                                <span>•</span>
                                                <span className="text-amber-500 font-bold flex items-center gap-0.5">
                                                    <Star size={10} className="fill-amber-500 stroke-amber-500 inline" /> 
                                                    <span>{r.rating.toFixed(1)}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-stone-400 text-[10px] font-semibold">{r.date}</span>
                                </div>

                                <p className="text-xs text-stone-600 font-semibold leading-relaxed pl-1">
                                    {r.content}
                                </p>

                                {r.status === 'answered' ? (
                                    <div className="bg-[#FAFDF9] p-4 rounded-2xl border border-[#E8F0E8] flex items-start gap-2.5 animate-fadeIn">
                                        <CornerDownRight size={14} className="text-[#8FBC8F] shrink-0 mt-0.5" />
                                        <div className="text-xs space-y-1">
                                            <span className="font-bold text-[#556B2F] block">{locale === 'ko' ? '판매자 답변 완료' : 'Seller Reply'}</span>
                                            <p className="text-stone-600 leading-relaxed font-medium">{r.answer}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="text" 
                                            placeholder={locale === 'ko' ? '리뷰에 감사 답변을 작성해 주세요...' : 'Write reply to review...'}
                                            value={reviewAnswerText[r.id] || ''}
                                            onChange={(e) => handleReviewAnswerChange(r.id, e.target.value)}
                                            className="flex-1 bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs outline-none focus:bg-white text-stone-700 font-bold"
                                        />
                                        <button 
                                            onClick={() => handleRegisterReviewAnswer(r.id)}
                                            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-soft"
                                            title="답변 등록"
                                        >
                                            <Send size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
