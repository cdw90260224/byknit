'use client';

import React, { useState } from 'react';
import { 
    Calendar as CalendarIcon, 
    Search, 
    TrendingUp, 
    ShoppingBag, 
    RotateCcw, 
    Coins,
    BarChart3,
    ArrowUpRight
} from 'lucide-react';

interface SaleRecord {
    id: string;
    orderId: string;
    date: string; // YYYY-MM-DD HH:mm:ss
    productName: string;
    amount: number;
    shippingFee: number;
    paymentMethod: string;
    status: 'paid' | 'completed' | 'cancelled';
}

export function SalesManagement({ locale }: { locale: string }) {
    // Current simulated date is 2026-07-24
    const todayStr = '2026-07-24';

    // Mock sales database
    const [salesDb] = useState<SaleRecord[]>([
        { id: 'S-001', orderId: '6101588833390', date: '2026-07-24 13:05:22', productName: '흠집 매트, 그레이 20개 2cm', amount: 49000, shippingFee: 3000, paymentMethod: '네이버페이', status: 'paid' },
        { id: 'S-002', orderId: '15101609070459', date: '2026-07-24 11:20:05', productName: '흠집 매트, 블랙 20개 2cm', amount: 49000, shippingFee: 0, paymentMethod: '카카오페이', status: 'paid' },
        { id: 'S-003', orderId: '11101611587928', date: '2026-07-24 09:30:11', productName: '무늬오징어 에기, 3.5호 10종 세트', amount: 28500, shippingFee: 3000, paymentMethod: '신용카드', status: 'paid' },
        { id: 'S-004', orderId: '21101613251154', date: '2026-07-23 16:42:00', productName: '흠집 매트, 아이보리 20개 1.2cm', amount: 39000, shippingFee: 0, paymentMethod: '토스페이', status: 'completed' },
        { id: 'S-005', orderId: '9101638152551', date: '2026-07-23 10:11:54', productName: '무늬오징어 에기, 3.5호 10종 세트', amount: 28500, shippingFee: 3000, paymentMethod: '카카오페이', status: 'completed' },
        { id: 'S-006', orderId: '8101638202029', date: '2026-07-21 14:15:00', productName: '파스텔 소프트 코튼 털실 (50g)', amount: 15200, shippingFee: 3000, paymentMethod: '네이버페이', status: 'completed' },
        { id: 'S-007', orderId: '7101648119022', date: '2026-07-18 10:05:00', productName: '클래식 소프트 메리노 울 털실', amount: 56000, shippingFee: 0, paymentMethod: '신용카드', status: 'completed' },
        { id: 'S-008', orderId: '5101655291039', date: '2026-07-15 16:30:00', productName: '비건 레더 가죽 라벨 (10개입)', amount: 14000, shippingFee: 3000, paymentMethod: '카카오페이', status: 'completed' },
        { id: 'S-009', orderId: '4101662910392', date: '2026-07-10 11:22:00', productName: '유기농 내추럴 메리노 울 털실', amount: 89000, shippingFee: 0, paymentMethod: '네이버페이', status: 'completed' },
        { id: 'S-010', orderId: '3101671190209', date: '2026-07-02 09:15:00', productName: '흠집 매트, 그레이 20개 2cm', amount: 49000, shippingFee: 3000, paymentMethod: '신용카드', status: 'completed' },
        { id: 'S-011', orderId: '2101689201990', date: '2026-06-25 15:40:00', productName: '파스텔 소프트 코튼 털실 (50g)', amount: 38000, shippingFee: 3000, paymentMethod: '네이버페이', status: 'completed' },
        { id: 'S-012', orderId: '1101699102991', date: '2026-06-12 14:10:00', productName: '무늬오징어 에기, 3.5호 10종 세트', amount: 28500, shippingFee: 3000, paymentMethod: '카카오페이', status: 'cancelled' },
        { id: 'S-013', orderId: '0101701928392', date: '2026-05-18 10:20:00', productName: '비건 레더 가죽 라벨 (10개입)', amount: 7000, shippingFee: 3000, paymentMethod: '신용카드', status: 'completed' }
    ]);

    // Filter states
    const [startDate, setStartDate] = useState('2026-07-17'); // Default 1 week
    const [endDate, setEndDate] = useState(todayStr);
    const [appliedRange, setAppliedRange] = useState({ start: '2026-07-17', end: todayStr });

    // Quick range selector handler
    const handleQuickRange = (range: 'today' | '1week' | '1month' | '3months') => {
        const end = new Date(todayStr);
        let start = new Date(todayStr);

        if (range === 'today') {
            // start is already today
        } else if (range === '1week') {
            start.setDate(end.getDate() - 7);
        } else if (range === '1month') {
            start.setMonth(end.getMonth() - 1);
        } else if (range === '3months') {
            start.setMonth(end.getMonth() - 3);
        }

        const startStr = start.toISOString().split('T')[0];
        setStartDate(startStr);
        setEndDate(todayStr);
        setAppliedRange({ start: startStr, end: todayStr });
    };

    const handleSearch = () => {
        if (new Date(startDate) > new Date(endDate)) {
            alert(locale === 'ko' ? '시작일은 종료일보다 이전이어야 합니다.' : 'Start date must be before end date.');
            return;
        }
        setAppliedRange({ start: startDate, end: endDate });
    };

    // Filtered data based on applied range
    const filteredRecords = salesDb.filter(item => {
        const itemDate = item.date.split(' ')[0]; // Extract YYYY-MM-DD
        return itemDate >= appliedRange.start && itemDate <= appliedRange.end;
    });

    // Summary calculation
    const totalPayment = filteredRecords.reduce((acc, cur) => acc + (cur.status !== 'cancelled' ? cur.amount + cur.shippingFee : 0), 0);
    const totalOrderCount = filteredRecords.filter(cur => cur.status !== 'cancelled').length;
    const totalCancelledAmount = filteredRecords.reduce((acc, cur) => acc + (cur.status === 'cancelled' ? cur.amount + cur.shippingFee : 0), 0);
    const netSales = totalPayment; // payment minus refunds (simulated here as active sales total)

    const todayProducts = [
        { name: locale === 'ko' ? '흠집 매트, 그레이 20개 2cm' : 'Scratch Mat, Grey 20pcs 2cm', qty: 1, revenue: 52000 },
        { name: locale === 'ko' ? '흠집 매트, 블랙 20개 2cm' : 'Scratch Mat, Black 20pcs 2cm', qty: 1, revenue: 49000 },
        { name: locale === 'ko' ? '무늬오징어 에기, 3.5호 10종 세트' : 'Squid Egi, 3.5 10pcs Set', qty: 1, revenue: 31500 }
    ];

    return (
        <div className="space-y-6 text-stone-700 animate-fadeIn font-sans">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-stone-800">
                    {locale === 'ko' ? '매출 관리 및 분석' : 'Sales Management'}
                </h1>
                <p className="text-stone-500 text-base mt-1">
                    {locale === 'ko' 
                        ? '기간별 상점의 매출 트랙과 주문 결제 내역을 모니터링합니다.' 
                        : 'Track store sales logs and payment history.'}
                </p>
            </div>

            {/* Today's Sales Summary (지표 & 전일대비 & 전환율) */}
            <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-soft space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h3 className="font-bold text-stone-800 text-base">
                        {locale === 'ko' ? '오늘 하루 판매 지표 (2026.07.24)' : 'Today\'s Sales Performance'}
                    </h3>
                    <span className="text-xs text-stone-400 font-semibold">{locale === 'ko' ? '실시간 집계 기준' : 'Real-time'}</span>
                </div>

                {/* Metrics Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Today Revenue */}
                    <div className="bg-stone-50/50 p-4.5 rounded-2xl border border-stone-100">
                        <span className="text-sm text-stone-400 font-bold block">{locale === 'ko' ? '오늘의 매출액' : 'Today\'s Revenue'}</span>
                        <div className="text-xl font-bold text-stone-800 mt-1">₩ 132,500</div>
                        <span className="text-xs text-emerald-600 font-bold mt-1.5 block">
                            {locale === 'ko' ? '전일 대비 ▲ ₩62,000 (+87.9%)' : 'vs yesterday ▲ ₩62,000'}
                        </span>
                    </div>

                    {/* Today Orders */}
                    <div className="bg-stone-50/50 p-4.5 rounded-2xl border border-stone-100">
                        <span className="text-sm text-stone-400 font-bold block">{locale === 'ko' ? '오늘의 결제 건수' : 'Today\'s Orders'}</span>
                        <div className="text-xl font-bold text-stone-800 mt-1">3 건</div>
                        <span className="text-xs text-emerald-600 font-bold mt-1.5 block">
                            {locale === 'ko' ? '전일 대비 ▲ 1건 (+50%)' : 'vs yesterday ▲ 1 order'}
                        </span>
                    </div>

                    {/* Today Sales Volume */}
                    <div className="bg-stone-50/50 p-4.5 rounded-2xl border border-stone-100">
                        <span className="text-sm text-stone-400 font-bold block">{locale === 'ko' ? '오늘의 판매량' : 'Today\'s Sales Volume'}</span>
                        <div className="text-xl font-bold text-stone-800 mt-1">3 개</div>
                        <span className="text-xs text-emerald-600 font-bold mt-1.5 block">
                            {locale === 'ko' ? '전일 대비 ▲ 1개 (+50%)' : 'vs yesterday ▲ 1 pcs'}
                        </span>
                    </div>

                    {/* Today Conversion Rate */}
                    <div className="bg-stone-50/50 p-4.5 rounded-2xl border border-stone-100">
                        <span className="text-sm text-stone-400 font-bold block">★ {locale === 'ko' ? '오늘의 구매전환율' : 'Conversion Rate'}</span>
                        <div className="text-xl font-bold text-[#556B2F] mt-1">2.5 %</div>
                        <span className="text-xs text-emerald-600 font-bold mt-1.5 block">
                            {locale === 'ko' ? '전일 대비 ▲ 0.7%p (방문자 120명)' : 'vs yesterday ▲ 0.7%p'}
                        </span>
                    </div>
                </div>

                {/* Today's Product Sales Breakdown List */}
                <div className="bg-stone-50/40 p-4 rounded-2xl border border-stone-100 space-y-3">
                    <h4 className="text-sm font-bold text-stone-600">{locale === 'ko' ? '오늘 팔린 상품 및 금액' : 'Today\'s Sold Products & Revenues'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {todayProducts.map((p, idx) => (
                            <div key={idx} className="flex flex-col justify-between text-sm bg-white p-4 rounded-xl border border-stone-100 font-bold space-y-2">
                                <span className="text-stone-700 truncate block w-full" title={p.name}>{p.name}</span>
                                <div className="flex items-center justify-between border-t border-stone-50 pt-2 text-sm">
                                    <span className="text-stone-400">{locale === 'ko' ? '판매량' : 'Qty'}: <b className="text-stone-700">{p.qty}개</b></span>
                                    <span className="text-[#556B2F]">₩ {p.revenue.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Date Range Selection Box */}
            <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-soft space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm font-bold text-stone-500 w-16">{locale === 'ko' ? '조회 기간' : 'Inquiry Period'}</span>
                    
                    {/* Quick Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleQuickRange('today')}
                            className="px-3.5 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-lg text-sm font-bold transition-all border border-stone-100"
                        >
                            {locale === 'ko' ? '오늘' : 'Today'}
                        </button>
                        <button
                            onClick={() => handleQuickRange('1week')}
                            className="px-3.5 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-lg text-sm font-bold transition-all border border-stone-100"
                        >
                            {locale === 'ko' ? '최근 1주일' : '1 Week'}
                        </button>
                        <button
                            onClick={() => handleQuickRange('1month')}
                            className="px-3.5 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-lg text-sm font-bold transition-all border border-stone-100"
                        >
                            {locale === 'ko' ? '1개월' : '1 Month'}
                        </button>
                        <button
                            onClick={() => handleQuickRange('3months')}
                            className="px-3.5 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-lg text-sm font-bold transition-all border border-stone-100"
                        >
                            {locale === 'ko' ? '3개월' : '3 Months'}
                        </button>
                    </div>

                    {/* Date Pickers */}
                    <div className="flex items-center gap-2 text-sm font-bold">
                        <div className="relative">
                            <input 
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-stone-50 border border-stone-150 rounded-xl p-2 pl-3 outline-none text-stone-600 focus:bg-white"
                            />
                        </div>
                        <span className="text-stone-300">~</span>
                        <div className="relative">
                            <input 
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-stone-50 border border-stone-150 rounded-xl p-2 pl-3 outline-none text-stone-600 focus:bg-white"
                            />
                        </div>

                        {/* Search Action */}
                        <button
                            onClick={handleSearch}
                            className="ml-2 px-5 py-2 bg-[#556B2F] hover:bg-[#8FBC8F] text-white rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 shadow-soft"
                        >
                            <Search size={12} />
                            <span>{locale === 'ko' ? '조회' : 'Search'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Sales Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-soft flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-stone-400 mb-2">
                            <span className="text-sm font-bold">{locale === 'ko' ? '총 결제 금액' : 'Total Payments'}</span>
                            <TrendingUp size={16} className="text-[#8FBC8F]" />
                        </div>
                        <span className="text-2xl font-bold text-stone-800">₩ {totalPayment.toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-stone-400 mt-3 font-semibold">선택 기간 전체 실결제액</span>
                </div>

                {/* Metric 2 */}
                <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-soft flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-stone-400 mb-2">
                            <span className="text-sm font-bold">{locale === 'ko' ? '결제 건수' : 'Order Count'}</span>
                            <ShoppingBag size={16} className="text-blue-400" />
                        </div>
                        <span className="text-2xl font-bold text-stone-800">{totalOrderCount} 건</span>
                    </div>
                    <span className="text-xs text-stone-400 mt-3 font-semibold">취소 제외 정상 완료 거래</span>
                </div>

                {/* Metric 3 */}
                <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-soft flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between text-stone-400 mb-2">
                            <span className="text-sm font-bold">{locale === 'ko' ? '환불 및 취소 금액' : 'Refunds'}</span>
                            <RotateCcw size={16} className="text-rose-400" />
                        </div>
                        <span className="text-2xl font-bold text-rose-500">₩ {totalCancelledAmount.toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-stone-400 mt-3 font-semibold">취소 및 반품 완료 환불액</span>
                </div>

                {/* Metric 4 */}
                <div className="bg-white p-6 rounded-3xl border border-[#E8F0E8] shadow-soft flex flex-col justify-between bg-gradient-to-br from-white to-[#FAFDF9]">
                    <div>
                        <div className="flex items-center justify-between text-stone-400 mb-2">
                            <span className="text-sm font-bold">{locale === 'ko' ? '순 매출액' : 'Net Sales'}</span>
                            <Coins size={16} className="text-[#556B2F]" />
                        </div>
                        <span className="text-2xl font-bold text-[#556B2F]">₩ {netSales.toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-[#8FBC8F] mt-3 font-bold">정산 대상 순수 매출액</span>
                </div>
            </div>

            {/* Sales Transaction Grid Table */}
            <div className="bg-white rounded-3xl border border-stone-150 shadow-soft overflow-hidden">
                <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                    <span className="text-sm font-bold text-stone-600">
                        {locale === 'ko' 
                            ? `조회 결과: 총 ${filteredRecords.length}건` 
                            : `Results: ${filteredRecords.length} records`}
                    </span>
                    <span className="text-xs text-stone-400 font-semibold">
                        기간: {appliedRange.start} ~ {appliedRange.end}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm min-w-[900px]">
                        <thead>
                            <tr className="bg-stone-100 text-stone-600 font-bold border-b border-stone-200">
                                <th className="p-3.5 border-r border-stone-200">{locale === 'ko' ? '결제 일시' : 'Payment Time'}</th>
                                <th className="p-3.5 border-r border-stone-200">{locale === 'ko' ? '주문번호' : 'Order ID'}</th>
                                <th className="p-3.5 border-r border-stone-200">{locale === 'ko' ? '상품명' : 'Product'}</th>
                                <th className="p-3.5 border-r border-stone-200 text-right">{locale === 'ko' ? '상품 금액' : 'Price'}</th>
                                <th className="p-3.5 border-r border-stone-200 text-right">{locale === 'ko' ? '배송비' : 'Shipping'}</th>
                                <th className="p-3.5 border-r border-stone-200 text-right">{locale === 'ko' ? '합계 금액' : 'Total'}</th>
                                <th className="p-3.5 border-r border-stone-200 text-center">{locale === 'ko' ? '결제 수단' : 'Payment Method'}</th>
                                <th className="p-3.5 text-center">{locale === 'ko' ? '상태' : 'Status'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 font-semibold text-stone-700">
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map((r) => {
                                    const isCancelled = r.status === 'cancelled';
                                    const total = r.amount + r.shippingFee;

                                    return (
                                        <tr 
                                            key={r.id} 
                                            className={`hover:bg-stone-50/50 transition-colors ${
                                                isCancelled ? 'bg-rose-50/20 text-stone-400' : ''
                                            }`}
                                        >
                                            {/* Date/Time */}
                                            <td className="p-3.5 border-r border-stone-200 text-stone-500 font-medium">
                                                {r.date}
                                            </td>

                                            {/* Order ID */}
                                            <td className="p-3.5 border-r border-stone-200 font-bold select-all">
                                                {r.orderId}
                                            </td>

                                            {/* Product Name */}
                                            <td className="p-3.5 border-r border-stone-200 truncate max-w-[200px]" title={r.productName}>
                                                {r.productName}
                                            </td>

                                            {/* Price */}
                                            <td className="p-3.5 border-r border-stone-200 text-right">
                                                ₩ {r.amount.toLocaleString()}
                                            </td>

                                            {/* Shipping Fee */}
                                            <td className="p-3.5 border-r border-stone-200 text-right text-stone-500">
                                                {r.shippingFee > 0 ? `₩ ${r.shippingFee.toLocaleString()}` : '무료배송'}
                                            </td>

                                            {/* Total */}
                                            <td className={`p-3.5 border-r border-stone-200 text-right font-bold ${
                                                isCancelled ? 'text-stone-400 line-through' : 'text-stone-800'
                                            }`}>
                                                ₩ {total.toLocaleString()}
                                            </td>

                                            {/* Payment Method */}
                                            <td className="p-3.5 border-r border-stone-200 text-center font-medium">
                                                {r.paymentMethod}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="p-3.5 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${
                                                    r.status === 'paid' 
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                        : r.status === 'completed'
                                                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                                        : 'bg-rose-50 text-rose-600 border border-rose-100'
                                                }`}>
                                                    {r.status === 'paid' && (locale === 'ko' ? '결제완료' : 'Paid')}
                                                    {r.status === 'completed' && (locale === 'ko' ? '구매확정' : 'Completed')}
                                                    {r.status === 'cancelled' && (locale === 'ko' ? '취소완료' : 'Cancelled')}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={8} className="p-20 text-center text-stone-400 font-bold">
                                        조회된 매출 내역이 없습니다. 다른 기간을 선택해 주세요.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
