'use client';

import React, { useState } from 'react';
import { 
    Receipt, 
    Check, 
    ArrowUpRight, 
    CreditCard, 
    Building, 
    User,
    Calendar,
    Save,
    Download
} from 'lucide-react';

interface SettlementOrder {
    id: string;
    orderId: string;
    productName: string;
    grossSales: number;
    commission: number; // 10%
    netAmount: number;  // 90%
    confirmedDate: string; // 구매확정일 YYYY.MM.DD
    payoutDate: string;    // 정산예정일 YYYY.MM.DD (구매확정일 + 14일)
    status: 'paid' | 'pending';
    paidDate?: string;
}

export type SettlementSubTab = 'daily' | 'category';

interface SettlementManagementProps {
    locale: string;
    activeSubTab: SettlementSubTab;
}

export function SettlementManagement({ locale, activeSubTab }: SettlementManagementProps) {
    // Current simulated date is 2026.07.29
    const todayStr = '2026.07.29';

    // Mock settlement database (Confirmed + 14 days payout policy)
    const [settlements] = useState<SettlementOrder[]>([
        { 
            id: 'SET-202607-05', 
            orderId: '31101614201992', 
            productName: '비건 레더 가죽 라벨 (10개입)', 
            grossSales: 50000, 
            commission: 5000, 
            netAmount: 45000, 
            confirmedDate: '2026.07.15', 
            payoutDate: '2026.07.29', 
            status: 'pending' // Scheduled for today, but pending payout
        },
        { 
            id: 'SET-202607-02', 
            orderId: '8101638202029', 
            productName: '파스텔 소프트 코튼 털실 (50g)', 
            grossSales: 18200, 
            commission: 1820, 
            netAmount: 16380, 
            confirmedDate: '2026.07.15', 
            payoutDate: '2026.07.29', 
            status: 'paid', 
            paidDate: '2026.07.29' // Settled today
        },
        { 
            id: 'SET-202607-04', 
            orderId: '21101613251154', 
            productName: '흠집 매트, 아이보리 20개 1.2cm', 
            grossSales: 39000, 
            commission: 3900, 
            netAmount: 35100, 
            confirmedDate: '2026.07.24', 
            payoutDate: '2026.08.07', 
            status: 'pending' 
        },
        { 
            id: 'SET-202607-03', 
            orderId: '9101638152551', 
            productName: '무늬오징어 에기, 3.5호 10종 세트', 
            grossSales: 31500, 
            commission: 3150, 
            netAmount: 28350, 
            confirmedDate: '2026.07.23', 
            payoutDate: '2026.08.06', 
            status: 'pending' 
        },
        { 
            id: 'SET-202607-01', 
            orderId: '7101648119022', 
            productName: '클래식 소프트 메리노 울 털실', 
            grossSales: 56000, 
            commission: 5600, 
            netAmount: 50400, 
            confirmedDate: '2026.07.10', 
            payoutDate: '2026.07.24', 
            status: 'paid', 
            paidDate: '2026.07.24' 
        }
    ]);

    // 오늘 정산 완료 금액 (status === 'paid' && paidDate === todayStr)
    const todaySettledTotal = settlements
        .filter(s => s.status === 'paid' && s.paidDate === todayStr)
        .reduce((acc, s) => acc + s.netAmount, 0);

    // 오늘 정산 예정 금액 (status === 'pending' && payoutDate === todayStr)
    const todayScheduledTotal = settlements
        .filter(s => s.status === 'pending' && s.payoutDate === todayStr)
        .reduce((acc, s) => acc + s.netAmount, 0);

    // CSV Excel Export logic showing commission breakdown and total net payout
    const handleExportExcel = () => {
        const headers = '\ufeff정산번호,주문번호,상품명,구매확정일,정산예정일,판매금액(총금액),플랫폼수수료(10%),실정산금액(최종금액),정산상태,지급일자\n';
        
        const rows = settlements.map(s => {
            return `"${s.id}","${s.orderId}","${s.productName}","${s.confirmedDate}","${s.payoutDate}",${s.grossSales},${s.commission},${s.netAmount},"${s.status === 'paid' ? '지급완료' : '지급대기'}","${s.paidDate || '-'}"`;
        }).join('\n');

        const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `byknit_settlement_report_${todayStr.replace(/\./g, '')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 animate-fadeIn font-sans">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-stone-850">
                    {locale === 'ko' ? '정산 관리' : 'Settlement Management'}
                </h1>
                <p className="text-stone-500 text-base mt-1">
                    {locale === 'ko' 
                        ? '구매확정 완료된 실물 상품 대금의 정산 지급 내역 및 영수증을 확인합니다.' 
                        : 'Check completed settlement history and pending payout details.'}
                </p>
            </div>

            {/* Payout Summary Cards (오늘 기준 지표) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. 오늘 정산 예정 금액 */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-100 shadow-soft flex flex-col justify-between h-40">
                    <div>
                        <div className="flex items-center justify-between text-stone-400 mb-2">
                            <span className="text-sm font-bold">{locale === 'ko' ? '오늘 정산 예정 금액' : 'Scheduled for Today'}</span>
                            <span className="text-xs font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">지급대기</span>
                        </div>
                        <span className="text-3xl font-bold text-[#556B2F] mt-2 block">
                            ₩ {todayScheduledTotal.toLocaleString()}
                        </span>
                    </div>
                    <span className="text-xs text-stone-400 font-bold block">
                        {locale === 'ko' ? `* 오늘(${todayStr}) 정산 지급 대기 중인 금액입니다.` : `* Pending payouts scheduled for today (${todayStr}).`}
                    </span>
                </div>

                {/* 2. 오늘 정산 완료 금액 */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-100 shadow-soft flex flex-col justify-between h-40">
                    <div>
                        <div className="flex items-center justify-between text-stone-400 mb-2">
                            <span className="text-sm font-bold">{locale === 'ko' ? '오늘 정산 완료 금액' : 'Settled Today'}</span>
                            <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">지급완료</span>
                        </div>
                        <span className="text-3xl font-bold text-stone-850 mt-2 block">
                            ₩ {todaySettledTotal.toLocaleString()}
                        </span>
                    </div>
                    <span className="text-xs text-[#8FBC8F] font-bold block flex items-center gap-1">
                        <Check size={12} />
                        <span>{locale === 'ko' ? `오늘(${todayStr}) 계좌 이체가 정상 완료되었습니다.` : `Transferred to account today (${todayStr}).`}</span>
                    </span>
                </div>
            </div>

            {/* Payout History Table Card (Full Width) */}
            {activeSubTab === 'daily' ? (
            <div className="bg-white rounded-3xl border border-stone-150 shadow-soft overflow-hidden animate-fadeIn">
                {/* Card Title & Excel Export */}
                <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-stone-50/50">
                    <div className="flex items-center gap-2">
                        <Receipt size={18} className="text-[#8FBC8F]" />
                        <h2 className="text-base font-bold text-stone-850">{locale === 'ko' ? '구매확정 주문별 정산 내역' : 'Payout History by Confirmed Orders'}</h2>
                    </div>
                    <button
                        onClick={handleExportExcel}
                        className="px-4 py-2.5 bg-white border border-stone-200 text-stone-700 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-inner-soft hover:bg-stone-50"
                    >
                        <Download size={14} className="text-[#8FBC8F]" />
                        <span>{locale === 'ko' ? '정산 대장 엑셀 다운로드 (CSV)' : 'Export Excel (CSV)'}</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px] text-sm">
                        <thead>
                            <tr className="bg-stone-100 text-stone-600 font-bold border-b border-stone-200">
                                <th className="p-4 pl-6 md:pl-8 border-r border-stone-200">{locale === 'ko' ? '정산번호 / 주문번호' : 'Payout ID / Order ID'}</th>
                                <th className="p-4 border-r border-stone-200">{locale === 'ko' ? '상품명' : 'Product'}</th>
                                <th className="p-4 border-r border-stone-200 text-center">{locale === 'ko' ? '구매확정일' : 'Confirmed Date'}</th>
                                <th className="p-4 border-r border-stone-200 text-center">{locale === 'ko' ? '정산예정일 (확정+2주)' : 'Payout Date (Confirmed+2W)'}</th>
                                <th className="p-4 border-r border-stone-200 text-right">{locale === 'ko' ? '판매금액 (총금액)' : 'Gross Sales'}</th>
                                <th className="p-4 border-r border-stone-200 text-right">{locale === 'ko' ? '수수료 (10%)' : 'Fee (10%)'}</th>
                                <th className="p-4 border-r border-stone-200 text-right">{locale === 'ko' ? '정산금액 (최종금액)' : 'Net Payout'}</th>
                                <th className="p-4 pr-6 md:pr-8 text-center">{locale === 'ko' ? '상태 / 지급일자' : 'Status / Date'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 text-stone-700 font-semibold">
                            {settlements.map((s) => (
                                <tr key={s.id} className="hover:bg-stone-50/50 transition-colors">
                                    {/* ID & Order ID */}
                                    <td className="p-4 pl-6 md:pl-8 border-r border-stone-200">
                                        <span className="font-bold text-stone-850 block">{s.id}</span>
                                        <span className="text-xs text-stone-400 block font-medium mt-0.5">{s.orderId}</span>
                                    </td>
                                    {/* Product Name */}
                                    <td className="p-4 border-r border-stone-200 font-bold text-stone-800 max-w-[180px] truncate" title={s.productName}>
                                        {s.productName}
                                    </td>
                                    {/* Confirmed Date */}
                                    <td className="p-4 border-r border-stone-200 text-center text-stone-500 font-medium">
                                        {s.confirmedDate}
                                    </td>
                                    {/* Payout Date */}
                                    <td className="p-4 border-r border-stone-200 text-center text-blue-600 font-bold">
                                        {s.payoutDate}
                                    </td>
                                    {/* Gross Sales */}
                                    <td className="p-4 border-r border-stone-200 text-right text-stone-500 font-medium">
                                        ₩ {s.grossSales.toLocaleString()}
                                    </td>
                                    {/* Commission */}
                                    <td className="p-4 border-r border-stone-200 text-right text-rose-500 font-medium">
                                        -₩ {s.commission.toLocaleString()}
                                    </td>
                                    {/* Net Amount */}
                                    <td className="p-4 border-r border-stone-200 text-right font-bold text-stone-850">
                                        ₩ {s.netAmount.toLocaleString()}
                                    </td>
                                    {/* Status */}
                                    <td className="p-4 pr-6 md:pr-8 text-center">
                                        {s.status === 'paid' ? (
                                            <div className="space-y-0.5">
                                                <span className="inline-block bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold px-2 py-0.5 rounded-md">
                                                    {locale === 'ko' ? '지급 완료' : 'Paid'}
                                                </span>
                                                <span className="text-xs text-stone-400 block font-semibold">{s.paidDate}</span>
                                            </div>
                                        ) : (
                                            <span className="inline-block bg-amber-50 text-amber-600 border border-amber-100 text-xs font-bold px-2 py-0.5 rounded-md">
                                                {locale === 'ko' ? '지급 대기' : 'Pending'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            ) : (
                <div className="bg-white rounded-3xl border border-stone-150 shadow-soft overflow-hidden animate-fadeIn p-12 text-center text-stone-500">
                    <Building className="mx-auto mb-4 text-[#8FBC8F]" size={48} />
                    <h2 className="text-lg font-bold text-stone-800 mb-2">
                        {locale === 'ko' ? '항목별 정산 내역 준비 중' : 'Category Settlement History Coming Soon'}
                    </h2>
                    <p className="text-base">
                        {locale === 'ko' 
                            ? '상품 카테고리별(예: 털실, 바늘, 도안 등) 정산 내역 및 통계 기능이 곧 추가될 예정입니다.' 
                            : 'Settlement statistics by category will be available soon.'}
                    </p>
                </div>
            )}
        </div>
    );
}
