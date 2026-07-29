'use client';

import React, { useState, useEffect } from 'react';
import { 
    Shield, 
    Check, 
    XCircle, 
    User, 
    Building, 
    FileText, 
    CreditCard, 
    Building2, 
    ArrowLeft,
    AlertTriangle,
    Eye,
    Lock,
    EyeOff
} from 'lucide-react';
import Link from 'next/link';

export default function AdminKycPage() {
    const [kycStatus, setKycStatus] = useState<'unsubmitted' | 'pending' | 'verified'>('unsubmitted');
    const [sellerType, setSellerType] = useState<'individual' | 'biz_general' | 'biz_simplified' | 'corporate'>('individual');
    const [repName, setRepName] = useState('');
    const [repBirth, setRepBirth] = useState('');
    const [businessNum, setBusinessNum] = useState('');
    const [corporateNum, setCorporateNum] = useState(''); // 법인등록번호
    const [mailOrderNum, setMailOrderNum] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountHolder, setAccountHolder] = useState('');
    
    // Admin authorization states
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [adminPasswordInput, setAdminPasswordInput] = useState('');
    const [adminError, setAdminError] = useState('');
    const [showAdminPassword, setShowAdminPassword] = useState(false);
    
    const [isLoading, setIsLoading] = useState(true);

    // Load data from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const status = localStorage.getItem('byknit_kyc_status') as any;
            if (status) setKycStatus(status);

            const sType = localStorage.getItem('byknit_seller_type') as any;
            if (sType) setSellerType(sType);

            setRepName(localStorage.getItem('byknit_rep_name') || '');
            setRepBirth(localStorage.getItem('byknit_rep_birth') || '');
            setBusinessNum(localStorage.getItem('byknit_business_num') || '');
            setCorporateNum(localStorage.getItem('byknit_corporate_num') || '');
            setMailOrderNum(localStorage.getItem('byknit_mail_order_num') || '');
            setBankName(localStorage.getItem('byknit_bank_name') || '');
            setAccountNumber(localStorage.getItem('byknit_account_number') || '');
            setAccountHolder(localStorage.getItem('byknit_account_holder') || '');
            setIsLoading(false);
        }
    }, []);

    const handleVerifyAdmin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mandatory password: 행복하자12! (English layout: godqhrgkwk12!)
        if (adminPasswordInput === '행복하자12!' || adminPasswordInput === 'godqhrgkwk12!') {
            setIsAuthorized(true);
            setAdminError('');
        } else {
            setAdminError('관리자 보안 비밀번호가 일치하지 않습니다.');
        }
    };

    const handleApprove = () => {
        localStorage.setItem('byknit_kyc_status', 'verified');
        localStorage.removeItem('byknit_kyc_reject_reason');
        setKycStatus('verified');
        alert('고객확인제도(KYC) 심사가 최종 승인되었습니다! 판매자의 정산 및 판매 기능이 해제됩니다.');
        window.location.reload();
    };

    const handleReject = () => {
        const reason = prompt('반려 사유를 기입해 주세요:', '통장 예금주와 사업자 대표자명 불일치');
        if (reason === null) return;

        localStorage.setItem('byknit_kyc_status', 'unsubmitted');
        localStorage.setItem('byknit_kyc_reject_reason', reason || '심사 서류 보완 필요');
        setKycStatus('unsubmitted');
        alert('심사가 반려 처리되었습니다. 판매자에게 반려 사유가 전송됩니다.');
        window.location.reload();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center font-sans">
                <span className="text-stone-400 text-xs font-bold">심사 데이터를 불러오는 중...</span>
            </div>
        );
    }

    // Render Admin authentication lock screen if not authorized
    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-[#F9F9F8] flex items-center justify-center p-6 font-sans">
                <div className="max-w-md w-full p-8 bg-white rounded-3xl border border-stone-200 shadow-soft text-stone-700 space-y-6">
                    <div className="text-center space-y-3">
                        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100 animate-pulse">
                            <Lock size={20} />
                        </div>
                        <h2 className="text-lg font-black text-stone-850">byKnit 본사 관리자 인증</h2>
                        <p className="text-xs text-stone-400 font-medium leading-relaxed">
                            본 페이지는 승인되지 않은 일반 사용자의 접근이 법적으로 엄격히 금지됩니다.<br />
                            보안 구역 입장을 위해 본사 전용 비밀번호를 입력하십시오.
                        </p>
                    </div>

                    <form onSubmit={handleVerifyAdmin} className="space-y-4">
                        <div className="space-y-1.5 relative">
                            <label className="text-[10px] font-bold text-stone-400 block">관리자 인증 비밀번호 *</label>
                            <div className="relative">
                                <input 
                                    type={showAdminPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    value={adminPasswordInput}
                                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                                    className="w-full pl-4 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold text-stone-700 outline-none focus:bg-white focus:ring-1 focus:ring-rose-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                                >
                                    {showAdminPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            {adminError && (
                                <span className="text-[10px] text-rose-500 font-bold block mt-1">{adminError}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 bg-stone-850 hover:bg-stone-900 text-white rounded-2xl text-xs font-black transition-all shadow-soft"
                        >
                            본사 어드민 서버 입장
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const nameMatches = repName && accountHolder && repName.trim() === accountHolder.trim();

    // Map Seller Type ID to Korean label
    const getSellerTypeLabel = (type: typeof sellerType) => {
        switch (type) {
            case 'individual':
                return '개인 판매자 (비사업자)';
            case 'biz_general':
                return '개인 사업자 (일반과세)';
            case 'biz_simplified':
                return '개인 사업자 (간이과세)';
            case 'corporate':
                return '법인 사업자 (일반과세/면세)';
            default:
                return '미분류';
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F9F8] p-6 sm:p-12 font-sans text-stone-700">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-200 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-soft">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-stone-850">byKnit 본사 관리자 콘솔</h1>
                            <p className="text-[11px] text-stone-400 font-bold mt-0.5">고객확인제도(KYC) 및 입점 서류 심사 센터</p>
                        </div>
                    </div>
                    <Link 
                        href="/ko/seller" 
                        className="px-4 py-2 border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                        <ArrowLeft size={12} />
                        <span>판매자 센터로 돌아가기</span>
                    </Link>
                </div>

                {/* State Overview */}
                {kycStatus !== 'pending' ? (
                    <div className="bg-white p-8 rounded-3xl border border-stone-200/60 shadow-soft text-center space-y-4">
                        <div className="w-12 h-12 bg-stone-50 text-stone-400 rounded-full flex items-center justify-center mx-auto border border-stone-100">
                            <Check size={20} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-stone-800">현재 대기 중인 고객확인 심사 건이 없습니다.</h3>
                            <p className="text-xs text-stone-400 font-medium leading-relaxed">
                                판매자 센터에서 서류 제출을 신청하면 이곳에 실시간으로 심사 요청 내역이 나타납니다.<br />
                                (현재 로컬 저장소 상태: <span className="font-bold text-stone-600">{kycStatus === 'verified' ? '최종 승인 상태 (Verified)' : '서류 미제출 상태'}</span>)
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Left Side: Seller Info Details */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Card 1: Representative & Business Info */}
                            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/60 shadow-soft space-y-6">
                                <div className="flex items-center gap-2 border-b border-stone-50 pb-3">
                                    <User size={16} className="text-blue-500" />
                                    <h2 className="text-sm font-bold text-stone-850">신청인 및 사업자 정보 검토</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                                    <div className="space-y-1">
                                        <span className="text-stone-400 block text-[10px] font-bold">판매자 구분 (과세유형)</span>
                                        <span className="text-stone-850 font-black">{getSellerTypeLabel(sellerType)}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-stone-400 block text-[10px] font-bold">대표자명 (실명)</span>
                                        <span className="text-stone-850 font-black">{repName || '-'}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-stone-400 block text-[10px] font-bold">대표자 생년월일</span>
                                        <span className="text-stone-850 font-black">{repBirth || '-'}</span>
                                    </div>
                                    
                                    {sellerType !== 'individual' && (
                                        <>
                                            <div className="space-y-1">
                                                <span className="text-stone-400 block text-[10px] font-bold">사업자등록번호</span>
                                                <span className="text-stone-850 font-black">{businessNum || '-'}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-stone-400 block text-[10px] font-bold">통신판매업 신고번호</span>
                                                <span className="text-stone-850 font-black">{mailOrderNum || '-'}</span>
                                            </div>
                                        </>
                                    )}

                                    {sellerType === 'corporate' && (
                                        <div className="space-y-1 animate-fadeIn">
                                            <span className="text-stone-400 block text-[10px] font-bold">법인등록번호</span>
                                            <span className="text-stone-850 font-black">{corporateNum || '-'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card 2: Submitted Documents Verification */}
                            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/60 shadow-soft space-y-6">
                                <div className="flex items-center gap-2 border-b border-stone-50 pb-3">
                                    <FileText size={16} className="text-blue-500" />
                                    <h2 className="text-sm font-bold text-stone-850">제출 사본 서류 확인 ({getSellerTypeLabel(sellerType)})</h2>
                                </div>

                                <div className="space-y-3">
                                    {/* ID Card Copy (For individual & sole proprietor) */}
                                    {sellerType !== 'corporate' && (
                                        <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-100 rounded-xl">
                                            <span className="text-xs font-bold text-stone-700">1. 대표자 신분증 사본</span>
                                            <button className="px-3 py-1.5 bg-white border border-stone-200 text-stone-600 text-[10px] font-bold rounded-lg flex items-center gap-1 hover:bg-stone-50">
                                                <Eye size={12} />
                                                <span>사본 열람</span>
                                            </button>
                                        </div>
                                    )}
                                    
                                    {/* Biz Registration Copy */}
                                    {sellerType !== 'individual' && (
                                        <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-100 rounded-xl">
                                            <span className="text-xs font-bold text-stone-700">
                                                {sellerType === 'corporate' ? '1. 사업자등록증 사본' : '2. 사업자등록증 사본'}
                                            </span>
                                            <button className="px-3 py-1.5 bg-white border border-stone-200 text-stone-600 text-[10px] font-bold rounded-lg flex items-center gap-1 hover:bg-stone-50">
                                                <Eye size={12} />
                                                <span>사본 열람</span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Bankbook Copy */}
                                    <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-100 rounded-xl">
                                        <span className="text-xs font-bold text-stone-700">
                                            {sellerType === 'individual' && '2. 정산통장 사본'}
                                            {(sellerType === 'biz_general' || sellerType === 'biz_simplified') && '3. 정산통장 사본'}
                                            {sellerType === 'corporate' && '2. 법인명의 통장 사본'}
                                        </span>
                                        <button className="px-3 py-1.5 bg-white border border-stone-200 text-stone-600 text-[10px] font-bold rounded-lg flex items-center gap-1 hover:bg-stone-50">
                                            <Eye size={12} />
                                            <span>사본 열람</span>
                                        </button>
                                    </div>

                                    {/* Corporate specific documents */}
                                    {sellerType === 'corporate' && (
                                        <>
                                            <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-100 rounded-xl">
                                                <span className="text-xs font-bold text-stone-700">3. 법인 등기부등본 사본</span>
                                                <button className="px-3 py-1.5 bg-white border border-stone-200 text-stone-600 text-[10px] font-bold rounded-lg flex items-center gap-1 hover:bg-stone-50">
                                                    <Eye size={12} />
                                                    <span>사본 열람</span>
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-100 rounded-xl">
                                                <span className="text-xs font-bold text-stone-700">4. 법인 인감증명서 사본</span>
                                                <button className="px-3 py-1.5 bg-white border border-stone-200 text-stone-600 text-[10px] font-bold rounded-lg flex items-center gap-1 hover:bg-stone-50">
                                                    <Eye size={12} />
                                                    <span>사본 열람</span>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Account Matching Verification & Decision */}
                        <div className="space-y-6">
                            
                            {/* Account Verification Check Card */}
                            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/60 shadow-soft space-y-6">
                                <div className="flex items-center gap-2 border-b border-stone-50 pb-3">
                                    <CreditCard size={16} className="text-blue-500" />
                                    <h2 className="text-sm font-bold text-stone-850">정산 계좌 명의 검증</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl space-y-2.5 text-xs font-bold">
                                        <div className="flex justify-between">
                                            <span className="text-stone-400 font-semibold">등록 은행</span>
                                            <span className="text-stone-800">{bankName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-stone-400 font-semibold">계좌 번호</span>
                                            <span className="text-stone-800">{accountNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-stone-400 font-semibold">예금주명</span>
                                            <span className="text-stone-800">{accountHolder}</span>
                                        </div>
                                    </div>

                                    {/* Verification Banner */}
                                    {nameMatches ? (
                                        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-[10px] font-bold flex items-center gap-1.5">
                                            <Check size={14} />
                                            <span>대표자명과 예금주명이 일치합니다. (검증 완료)</span>
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[10px] font-bold flex items-start gap-1.5">
                                            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                            <span>대표자명({repName})과 예금주명({accountHolder})이 다릅니다. 심사를 반려해 주세요.</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Decision Actions Card */}
                            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/60 shadow-soft space-y-4">
                                <h3 className="text-xs font-black text-stone-500 uppercase tracking-wider">심사 결정</h3>
                                
                                <div className="flex flex-col gap-2">
                                    <button 
                                        onClick={handleApprove}
                                        disabled={!nameMatches}
                                        className={`w-full py-3.5 text-white rounded-2xl text-xs font-black transition-all shadow-soft flex items-center justify-center gap-1.5 ${
                                            nameMatches 
                                                ? 'bg-emerald-600 hover:bg-emerald-700' 
                                                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <Check size={14} />
                                        <span>심사 최종 승인</span>
                                    </button>
                                    <button 
                                        onClick={handleReject}
                                        className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5"
                                    >
                                        <XCircle size={14} />
                                        <span>심사 반려 처리</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
