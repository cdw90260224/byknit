'use client';

import React, { useState, useEffect } from 'react';
import { 
    Settings, 
    Truck, 
    Store, 
    Check, 
    Save, 
    Phone,
    MapPin,
    CreditCard,
    Building,
    User,
    Receipt,
    ShieldAlert,
    FileText,
    Upload,
    ShieldCheck,
    Shield,
    Lock,
    Eye,
    EyeOff,
    XCircle,
    ExternalLink
} from 'lucide-react';

type SellerType = 'individual' | 'biz_general' | 'biz_simplified' | 'corporate';

export function SellerInfo({ locale }: { locale: string }) {
    // Security verification password states
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [pwError, setPwError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Brand Config states
    const [shopName, setShopName] = useState('차도운의 손뜨개 공방');
    const [shopBio, setShopBio] = useState('한 코 한 코 정성을 담아 뜨개실과 소품을 판매하는 감성 크래프트 샵입니다.');
    const [csContact, setCsContact] = useState('02-1234-5678');
    const [shopLogo, setShopLogo] = useState('https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=150&auto=format&fit=crop');

    // Shipping Config states
    const [baseShippingFee, setBaseShippingFee] = useState('3000');
    const [freeShippingThreshold, setFreeShippingThreshold] = useState('50000');
    const [extraRegionalFee, setExtraRegionalFee] = useState('3000');

    // Outbound (출고지) & Return (반품지) address states
    const [outboundPostcode, setOutboundPostcode] = useState('06132');
    const [outboundAddress, setOutboundAddress] = useState('서울특별시 강남구 테헤란로 152');
    const [outboundAddressDetail, setOutboundAddressDetail] = useState('지하 2층 201호 (역삼동, 한독빌딩)');
    const [outboundContact, setOutboundContact] = useState('010-3489-0234');

    const [returnPostcode, setReturnPostcode] = useState('06132');
    const [returnAddress, setReturnAddress] = useState('서울특별시 강남구 테헤란로 152');
    const [returnAddressDetail, setReturnAddressDetail] = useState('지하 2층 201호 (역삼동, 한독빌딩)');
    const [returnContact, setReturnContact] = useState('010-3489-0234');
    const [sameAsOutbound, setSameAsOutbound] = useState(true);

    // Payout Account states
    const [bankName, setBankName] = useState('신한은행');
    const [accountHolder, setAccountHolder] = useState('차도운');
    const [accountNumber, setAccountNumber] = useState('110-348-902348');

    // Customer Due Diligence (KYC / 고객확인제도) states
    const [kycStatus, setKycStatus] = useState<'unsubmitted' | 'pending' | 'verified'>('unsubmitted');
    const [sellerType, setSellerType] = useState<SellerType>('individual');
    const [businessNum, setBusinessNum] = useState('');
    const [corporateNum, setCorporateNum] = useState(''); // 법인등록번호
    const [repName, setRepName] = useState('차도운');
    const [repBirth, setRepBirth] = useState('1992-05-12');
    const [mailOrderNum, setMailOrderNum] = useState('');
    const [verifiedPhone, setVerifiedPhone] = useState(false);
    const [kycRejectReason, setKycRejectReason] = useState('');

    // Mock file upload states
    const [uploadedFiles, setUploadedFiles] = useState<{ idCopy: boolean; bizCert: boolean; bankBook: boolean; corpRegister: boolean; corpSeal: boolean }>({
        idCopy: false,
        bizCert: false,
        bankBook: false,
        corpRegister: false,
        corpSeal: false
    });

    const [isSaved, setIsSaved] = useState(false);

    // Load KYC & address state from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedStatus = localStorage.getItem('byknit_kyc_status') as any;
            if (savedStatus) setKycStatus(savedStatus);

            const savedReason = localStorage.getItem('byknit_kyc_reject_reason') || '';
            setKycRejectReason(savedReason);

            const savedType = localStorage.getItem('byknit_seller_type') as any;
            if (savedType) setSellerType(savedType);

            const savedRepName = localStorage.getItem('byknit_rep_name');
            if (savedRepName) setRepName(savedRepName);

            const savedBizNum = localStorage.getItem('byknit_business_num');
            if (savedBizNum) setBusinessNum(savedBizNum);

            const savedCorpNum = localStorage.getItem('byknit_corporate_num');
            if (savedCorpNum) setCorporateNum(savedCorpNum);

            const savedMailNum = localStorage.getItem('byknit_mail_order_num');
            if (savedMailNum) setMailOrderNum(savedMailNum);

            const savedHolder = localStorage.getItem('byknit_account_holder');
            if (savedHolder) setAccountHolder(savedHolder);

            const savedBank = localStorage.getItem('byknit_bank_name');
            if (savedBank) setBankName(savedBank);

            const savedAccount = localStorage.getItem('byknit_account_number');
            if (savedAccount) setAccountNumber(savedAccount);

            // Load Address states
            const savedOutboundPostcode = localStorage.getItem('byknit_outbound_postcode');
            if (savedOutboundPostcode) setOutboundPostcode(savedOutboundPostcode);
            const savedOutboundAddress = localStorage.getItem('byknit_outbound_address');
            if (savedOutboundAddress) setOutboundAddress(savedOutboundAddress);
            const savedOutboundAddressDetail = localStorage.getItem('byknit_outbound_address_detail');
            if (savedOutboundAddressDetail) setOutboundAddressDetail(savedOutboundAddressDetail);
            const savedOutboundContact = localStorage.getItem('byknit_outbound_contact');
            if (savedOutboundContact) setOutboundContact(savedOutboundContact);

            const savedReturnPostcode = localStorage.getItem('byknit_return_postcode');
            if (savedReturnPostcode) setReturnPostcode(savedReturnPostcode);
            const savedReturnAddress = localStorage.getItem('byknit_return_address');
            if (savedReturnAddress) setReturnAddress(savedReturnAddress);
            const savedReturnAddressDetail = localStorage.getItem('byknit_return_address_detail');
            if (savedReturnAddressDetail) setReturnAddressDetail(savedReturnAddressDetail);
            const savedReturnContact = localStorage.getItem('byknit_return_contact');
            if (savedReturnContact) setReturnContact(savedReturnContact);

            const savedSameAsOutbound = localStorage.getItem('byknit_same_as_outbound');
            if (savedSameAsOutbound) setSameAsOutbound(savedSameAsOutbound === 'true');
        }

        const handleStorageChange = () => {
            const savedStatus = localStorage.getItem('byknit_kyc_status') as any;
            if (savedStatus) setKycStatus(savedStatus);
            const savedReason = localStorage.getItem('byknit_kyc_reject_reason') || '';
            setKycRejectReason(savedReason);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Helper functions for Outbound Address synchronizations
    const handleOutboundChange = (field: 'postcode' | 'address' | 'detail' | 'contact', value: string) => {
        if (field === 'postcode') {
            setOutboundPostcode(value);
            if (sameAsOutbound) setReturnPostcode(value);
        } else if (field === 'address') {
            setOutboundAddress(value);
            if (sameAsOutbound) setReturnAddress(value);
        } else if (field === 'detail') {
            setOutboundAddressDetail(value);
            if (sameAsOutbound) setReturnAddressDetail(value);
        } else if (field === 'contact') {
            setOutboundContact(value);
            if (sameAsOutbound) setReturnContact(value);
        }
    };

    const handleToggleSameAddress = (checked: boolean) => {
        setSameAsOutbound(checked);
        if (checked) {
            setReturnPostcode(outboundPostcode);
            setReturnAddress(outboundAddress);
            setReturnAddressDetail(outboundAddressDetail);
            setReturnContact(outboundContact);
        }
    };

    // Verify Password to unlock Seller Info
    const handleVerifyPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === 'admin123') {
            setIsUnlocked(true);
            setPwError('');
        } else {
            setPwError(locale === 'ko' 
                ? '비밀번호가 올바르지 않습니다. (테스트용 비밀번호: admin123)' 
                : 'Incorrect password. (Test PW: admin123)');
        }
    };

    // Save info with representative vs account holder match verification
    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();

        // STRICT RULE CHECK: Account holder name must match representative name
        if (accountHolder.trim() !== repName.trim()) {
            alert(locale === 'ko'
                ? `[오류] 정산 계좌 예금주명(${accountHolder})은 고객확인제도(KYC) 대표자명(${repName})과 반드시 일치해야 합니다. (동일인/동일법인 계좌만 등록 가능)`
                : `[Error] Account holder name (${accountHolder}) must match Representative name (${repName}).`);
            return;
        }

        // Save to localStorage
        localStorage.setItem('byknit_rep_name', repName);
        localStorage.setItem('byknit_account_holder', accountHolder);
        localStorage.setItem('byknit_bank_name', bankName);
        localStorage.setItem('byknit_account_number', accountNumber);
        localStorage.setItem('byknit_seller_type', sellerType);
        localStorage.setItem('byknit_business_num', businessNum);
        localStorage.setItem('byknit_corporate_num', corporateNum);
        localStorage.setItem('byknit_mail_order_num', mailOrderNum);

        // Save addresses
        localStorage.setItem('byknit_outbound_postcode', outboundPostcode);
        localStorage.setItem('byknit_outbound_address', outboundAddress);
        localStorage.setItem('byknit_outbound_address_detail', outboundAddressDetail);
        localStorage.setItem('byknit_outbound_contact', outboundContact);
        localStorage.setItem('byknit_return_postcode', returnPostcode);
        localStorage.setItem('byknit_return_address', returnAddress);
        localStorage.setItem('byknit_return_address_detail', returnAddressDetail);
        localStorage.setItem('byknit_return_contact', returnContact);
        localStorage.setItem('byknit_same_as_outbound', sameAsOutbound ? 'true' : 'false');

        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    // KYC submit with check
    const handleKycSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        
        // Business validation
        const isBusiness = sellerType !== 'individual';
        if (isBusiness && (!businessNum || !mailOrderNum)) {
            alert(locale === 'ko' ? '사업자등록번호와 통신판매업 신고번호를 입력해 주세요.' : 'Please enter all business details.');
            return;
        }
        if (sellerType === 'corporate' && !corporateNum) {
            alert(locale === 'ko' ? '법인등록번호를 입력해 주세요.' : 'Please enter Corporate Registration Number.');
            return;
        }

        // Document upload validation based on Seller Type
        if (!uploadedFiles.bankBook) {
            alert(locale === 'ko' ? '통장 사본을 업로드해 주세요.' : 'Please upload your bankbook copy.');
            return;
        }
        if (sellerType === 'individual') {
            if (!uploadedFiles.idCopy) {
                alert(locale === 'ko' ? '신분증 사본을 업로드해 주세요.' : 'Please upload your ID copy.');
                return;
            }
        } else if (sellerType === 'biz_general' || sellerType === 'biz_simplified') {
            if (!uploadedFiles.bizCert || !uploadedFiles.idCopy) {
                alert(locale === 'ko' ? '사업자등록증과 대표자 신분증 사본을 업로드해 주세요.' : 'Please upload Business Certificate and ID copy.');
                return;
            }
        } else if (sellerType === 'corporate') {
            if (!uploadedFiles.bizCert || !uploadedFiles.corpRegister || !uploadedFiles.corpSeal) {
                alert(locale === 'ko' ? '법인 필수 서류(사업자등록증, 등기부등본, 인감증명서)를 모두 업로드해 주세요.' : 'Please upload all corporate documents.');
                return;
            }
        }

        // STRICT RULE CHECK: Account holder name must match representative name
        if (accountHolder.trim() !== repName.trim()) {
            alert(locale === 'ko'
                ? `[제출 반려] 등록된 정산 계좌 예금주명(${accountHolder})이 고객확인(KYC) 대표자명(${repName})과 불일치합니다. 동일인 명의의 정산계좌를 입력 후 서류를 신청해 주세요.`
                : `[KYC Rejected] Account holder name does not match Representative name.`);
            return;
        }

        // Save all data to localStorage for the Admin to read
        localStorage.setItem('byknit_kyc_status', 'pending');
        localStorage.setItem('byknit_rep_name', repName);
        localStorage.setItem('byknit_rep_birth', repBirth);
        localStorage.setItem('byknit_account_holder', accountHolder);
        localStorage.setItem('byknit_bank_name', bankName);
        localStorage.setItem('byknit_account_number', accountNumber);
        localStorage.setItem('byknit_seller_type', sellerType);
        localStorage.setItem('byknit_business_num', businessNum);
        localStorage.setItem('byknit_corporate_num', corporateNum);
        localStorage.setItem('byknit_mail_order_num', mailOrderNum);

        setKycStatus('pending');
        setKycRejectReason('');

        alert(locale === 'ko' 
            ? '고객확인제도(KYC) 심사 서류가 본사에 제출되었습니다.\n\n* 본사 관리자 페이지(http://localhost:3001/ko/admin/kyc)에서 승인/반려 처리를 직접 시뮬레이션해볼 수 있습니다.' 
            : 'KYC application submitted. Check the Admin panel to review.');
    };

    const banks = [
        '국민은행', '신한은행', '우리은행', '하나은행', '농협은행', '기업은행', '카카오뱅크', '토스뱅크'
    ];

    // Render password screen if locked
    if (!isUnlocked) {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl border border-stone-150 shadow-soft text-stone-700 animate-fadeIn font-sans space-y-6">
                <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100">
                        <Lock size={20} />
                    </div>
                    <h2 className="text-lg font-black text-stone-850">{locale === 'ko' ? '판매자 정보 보안 확인' : 'Security Verification'}</h2>
                    <p className="text-xs text-stone-400 font-medium leading-relaxed">
                        {locale === 'ko' 
                            ? '중요 정산계좌 및 판매자 개인정보를 안전하게 보호하기 위해 비밀번호를 다시 한 번 확인합니다.' 
                            : 'Enter your password to verify ownership and access sensitive seller details.'}
                    </p>
                </div>

                <form onSubmit={handleVerifyPassword} className="space-y-4">
                    <div className="space-y-1.5 relative">
                        <label className="text-[10px] font-bold text-stone-400 block">{locale === 'ko' ? '판매자 계정 비밀번호 *' : 'Seller Password *'}</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold text-stone-700 outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                            >
                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                        {pwError && (
                            <span className="text-[10px] text-rose-500 font-bold block mt-1">{pwError}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 bg-stone-850 hover:bg-stone-900 text-white rounded-2xl text-xs font-black transition-all shadow-soft"
                    >
                        {locale === 'ko' ? '인증 및 입장하기' : 'Verify & Enter'}
                    </button>
                </form>
            </div>
        );
    }

    // Render original Seller Info page if unlocked
    return (
        <form onSubmit={handleSaveSettings} className="space-y-8 animate-fadeIn font-sans">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-stone-850">
                        {locale === 'ko' ? '판매자 정보 설정' : 'Seller Profile & Settings'}
                    </h1>
                    <p className="text-stone-500 text-sm mt-1">
                        {locale === 'ko' 
                            ? '브랜드 프로필, 배송 정책, 정산 계좌 및 고객확인제도(KYC) 인증 상태를 관리합니다.' 
                            : 'Configure brand profile, shipping fees, payout account, and KYC verification.'}
                    </p>
                </div>
                <button
                    type="submit"
                    className={`
                        px-6 py-3.5 rounded-2xl font-bold text-xs shadow-soft flex items-center justify-center gap-1.5 transition-all hover:-translate-y-0.5
                        ${isSaved 
                            ? 'bg-[#556B2F] text-white' 
                            : 'bg-stone-850 hover:bg-stone-900 text-white'}
                    `}
                >
                    {isSaved ? (
                        <>
                            <Check size={14} />
                            <span>{locale === 'ko' ? '정보 저장 완료!' : 'Information Saved!'}</span>
                        </>
                    ) : (
                        <>
                            <Save size={14} />
                            <span>{locale === 'ko' ? '모든 판매자 정보 저장' : 'Save Seller Info'}</span>
                        </>
                    )}
                </button>
            </div>

            {/* Split layout: Left (Brand Profile & Shipping), Right (Settlement Account) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Side Column */}
                <div className="space-y-6">
                    {/* Brand Profile Card */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-100 shadow-soft space-y-6">
                        <div className="flex items-center gap-2 border-b border-stone-50 pb-3">
                            <Store size={18} className="text-[#8FBC8F]" />
                            <h2 className="text-base font-bold text-stone-850">{locale === 'ko' ? '브랜드 프로필 설정' : 'Brand Profile'}</h2>
                        </div>

                        <div className="space-y-5">
                            {/* Logo Image */}
                            <div className="flex items-center gap-5 bg-stone-50 p-4 rounded-2xl border border-stone-100/50">
                                <img 
                                    src={shopLogo} 
                                    alt={shopName} 
                                    className="w-16 h-16 rounded-2xl object-cover border border-stone-100 shadow-soft shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <span className="text-xs font-bold text-stone-400 block mb-1.5">{locale === 'ko' ? '상점 로고 이미지' : 'Store Logo'}</span>
                                    <input 
                                        type="url"
                                        value={shopLogo}
                                        onChange={(e) => setShopLogo(e.target.value)}
                                        className="px-3 py-1.5 bg-white border border-stone-100 rounded-xl text-[10px] text-stone-500 font-bold outline-none focus:bg-stone-50 w-full truncate"
                                    />
                                </div>
                            </div>

                            {/* Store Name */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-stone-400 block">{locale === 'ko' ? '상점 이름 *' : 'Store Name *'}</label>
                                <input 
                                    type="text"
                                    required
                                    value={shopName}
                                    onChange={(e) => setShopName(e.target.value)}
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-bold text-stone-700 outline-none focus:bg-white transition-colors"
                                />
                            </div>

                            {/* Store Bio */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-stone-400 block">{locale === 'ko' ? '상점 한 줄 소개' : 'Store Description'}</label>
                                <textarea 
                                    value={shopBio}
                                    onChange={(e) => setShopBio(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-bold text-stone-700 outline-none focus:bg-white transition-colors leading-relaxed"
                                />
                            </div>

                            {/* CS contact */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-stone-400 flex items-center gap-1">
                                    <Phone size={12} />
                                    <span>{locale === 'ko' ? '고객센터 연락처 *' : 'CS Contact *'}</span>
                                </label>
                                <input 
                                    type="text"
                                    required
                                    value={csContact}
                                    onChange={(e) => setCsContact(e.target.value)}
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-bold text-stone-700 outline-none focus:bg-white transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* NEW CARD: Outbound & Return Address settings */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-150 shadow-soft space-y-6 animate-fadeIn">
                        <div className="flex items-center gap-2 border-b border-stone-50 pb-3">
                            <MapPin size={18} className="text-[#8FBC8F]" />
                            <h2 className="text-base font-bold text-stone-850">{locale === 'ko' ? '출고지 / 반품지 주소 설정' : 'Shipping & Return Addresses'}</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Outbound Address */}
                            <div className="space-y-4">
                                <span className="text-xs font-black text-stone-800 block">{locale === 'ko' ? '1. 상품 출고지 주소 (배송지)' : '1. Outbound Origin Address'}</span>
                                <div className="grid grid-cols-3 gap-2">
                                    <input 
                                        type="text"
                                        placeholder={locale === 'ko' ? '우편번호' : 'Postcode'}
                                        value={outboundPostcode}
                                        onChange={(e) => handleOutboundChange('postcode', e.target.value)}
                                        className="col-span-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 outline-none focus:bg-white"
                                    />
                                    <input 
                                        type="text"
                                        placeholder={locale === 'ko' ? '기본 주소' : 'Base Address'}
                                        value={outboundAddress}
                                        onChange={(e) => handleOutboundChange('address', e.target.value)}
                                        className="col-span-2 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 outline-none focus:bg-white"
                                    />
                                </div>
                                <input 
                                    type="text"
                                    placeholder={locale === 'ko' ? '상세 주소 입력' : 'Detail Address'}
                                    value={outboundAddressDetail}
                                    onChange={(e) => handleOutboundChange('detail', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 outline-none focus:bg-white"
                                />
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-stone-400 block">{locale === 'ko' ? '출고지 CS 연락처 *' : 'Outbound Phone *'}</label>
                                    <input 
                                        type="text"
                                        placeholder="010-0000-0000"
                                        value={outboundContact}
                                        onChange={(e) => handleOutboundChange('contact', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 outline-none focus:bg-white"
                                    />
                                </div>
                            </div>

                            <hr className="border-stone-100" />

                            {/* Return Address */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-stone-800 block">{locale === 'ko' ? '2. 반품지 주소 (수거지)' : '2. Return Destination Address'}</span>
                                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-stone-500 cursor-pointer">
                                        <input 
                                            type="checkbox"
                                            checked={sameAsOutbound}
                                            onChange={(e) => handleToggleSameAddress(e.target.checked)}
                                            className="rounded text-blue-600 focus:ring-blue-500"
                                        />
                                        <span>{locale === 'ko' ? '출고지와 동일하게 설정' : 'Same as Outbound'}</span>
                                    </label>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <input 
                                        type="text"
                                        placeholder={locale === 'ko' ? '우편번호' : 'Postcode'}
                                        value={returnPostcode}
                                        onChange={(e) => setReturnPostcode(e.target.value)}
                                        disabled={sameAsOutbound}
                                        className={`col-span-1 px-4 py-2.5 rounded-xl text-xs font-bold outline-none border ${
                                            sameAsOutbound 
                                                ? 'bg-stone-100 text-stone-400 border-stone-150' 
                                                : 'bg-stone-50 border-stone-200 focus:bg-white text-stone-700'
                                        }`}
                                    />
                                    <input 
                                        type="text"
                                        placeholder={locale === 'ko' ? '기본 주소' : 'Base Address'}
                                        value={returnAddress}
                                        onChange={(e) => setReturnAddress(e.target.value)}
                                        disabled={sameAsOutbound}
                                        className={`col-span-2 px-4 py-2.5 rounded-xl text-xs font-bold outline-none border ${
                                            sameAsOutbound 
                                                ? 'bg-stone-100 text-stone-400 border-stone-150' 
                                                : 'bg-stone-50 border-stone-200 focus:bg-white text-stone-700'
                                        }`}
                                    />
                                </div>
                                <input 
                                    type="text"
                                    placeholder={locale === 'ko' ? '상세 주소 입력' : 'Detail Address'}
                                    value={returnAddressDetail}
                                    onChange={(e) => setReturnAddressDetail(e.target.value)}
                                    disabled={sameAsOutbound}
                                    className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold outline-none border ${
                                        sameAsOutbound 
                                            ? 'bg-stone-100 text-stone-400 border-stone-150' 
                                            : 'bg-stone-50 border-stone-200 focus:bg-white text-stone-700'
                                    }`}
                                />
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-stone-400 block">{locale === 'ko' ? '반품지 CS 연락처 *' : 'Return Phone *'}</label>
                                    <input 
                                        type="text"
                                        placeholder="010-0000-0000"
                                        value={returnContact}
                                        onChange={(e) => setReturnContact(e.target.value)}
                                        disabled={sameAsOutbound}
                                        className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold outline-none border ${
                                            sameAsOutbound 
                                                ? 'bg-stone-100 text-stone-400 border-stone-150' 
                                                : 'bg-stone-50 border-stone-200 focus:bg-white text-stone-700'
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Column */}
                <div className="space-y-6">
                    {/* Shipping config Card */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-100 shadow-soft space-y-6">
                        <div className="flex items-center gap-2 border-b border-stone-50 pb-3">
                            <Truck size={18} className="text-[#8FBC8F]" />
                            <h2 className="text-base font-bold text-[#556B2F]">{locale === 'ko' ? '배송 정책 설정 (기본 배송비)' : 'Shipping Fee Settings'}</h2>
                        </div>

                        <div className="space-y-5">
                            {/* Base shipping fee */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-stone-400 block">
                                    {locale === 'ko' ? '기본 배송비 (원) *' : 'Base Shipping Fee (KRW) *'}
                                </label>
                                <input 
                                    type="number"
                                    required
                                    value={baseShippingFee}
                                    onChange={(e) => setBaseShippingFee(e.target.value)}
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-bold text-stone-700 outline-none focus:bg-white transition-colors"
                                />
                            </div>

                            {/* Conditional Free shipping */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-stone-400 block">
                                    {locale === 'ko' ? '무료 배송 기준금액 (원) *' : 'Free Shipping Threshold (KRW) *'}
                                </label>
                                <input 
                                    type="number"
                                    required
                                    value={freeShippingThreshold}
                                    onChange={(e) => setFreeShippingThreshold(e.target.value)}
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-bold text-stone-700 outline-none focus:bg-white transition-colors"
                                />
                                <span className="text-[10px] text-stone-400 block font-semibold pl-1">
                                    {locale === 'ko' ? '* 설정 금액 이상 구매 시 기본 배송비가 0원으로 적용됩니다.' : '* Purchase above this limit will waive the base shipping fee.'}
                                </span>
                            </div>

                            {/* Regional shipping fee */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-stone-400 flex items-center gap-1">
                                    <MapPin size={12} />
                                    <span>{locale === 'ko' ? '제주 / 도서산간 추가 배송비 (원) *' : 'Extra Island/Regional Fee (KRW) *'}</span>
                                </label>
                                <input 
                                    type="number"
                                    required
                                    value={extraRegionalFee}
                                    onChange={(e) => setExtraRegionalFee(e.target.value)}
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-bold text-stone-700 outline-none focus:bg-white transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Settlement Account Config Card */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-100 shadow-soft space-y-6">
                        <div className="flex items-center gap-2 border-b border-stone-50 pb-3">
                            <CreditCard size={18} className="text-[#8FBC8F]" />
                            <h2 className="text-base font-bold text-stone-850">{locale === 'ko' ? '정산 계좌 정보 관리' : 'Payout Account Details'}</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Bank */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-stone-400 flex items-center gap-1">
                                    <Building size={12} />
                                    <span>{locale === 'ko' ? '정산 은행 *' : 'Bank *'}</span>
                                </label>
                                <select
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-bold text-stone-700 outline-none focus:bg-white transition-colors"
                                >
                                    {banks.map(b => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Account Number */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-stone-400 flex items-center gap-1">
                                    <Receipt size={12} />
                                    <span>{locale === 'ko' ? '계좌 번호 *' : 'Account Number *'}</span>
                                </label>
                                <input 
                                    type="text"
                                    required
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-bold text-stone-700 outline-none focus:bg-white transition-colors"
                                />
                            </div>

                            {/* Account Holder */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-stone-400 flex items-center gap-1">
                                    <User size={12} />
                                    <span>{locale === 'ko' ? '예금주명 (대표자명과 필수 일치) *' : 'Holder Name (Must match Representative) *'}</span>
                                </label>
                                <input 
                                    type="text"
                                    required
                                    value={accountHolder}
                                    onChange={(e) => setAccountHolder(e.target.value)}
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-bold text-stone-700 outline-none focus:bg-white transition-colors border-l-4 border-l-amber-500"
                                />
                                <span className="text-[10px] text-amber-600 font-bold block pl-1">
                                    {locale === 'ko' ? '* 법률상 예금주명은 고객확인의 대표자(사업자)명과 반드시 동일해야 합니다.' : '* Holder name must legally match the KYC representative.'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Customer Due Diligence (KYC / 고객확인제도이행) Card */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-100 shadow-soft space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-50 pb-3 gap-3">
                    <div className="flex items-center gap-2">
                        <Shield size={18} className="text-blue-500" />
                        <h2 className="text-base font-bold text-stone-850">{locale === 'ko' ? '고객확인제도(KYC) 이행 및 제출' : 'Customer Due Diligence (KYC)'}</h2>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-1.5">
                        {kycStatus === 'unsubmitted' && (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-black px-2.5 py-1 rounded-full">
                                <ShieldAlert size={12} />
                                <span>{locale === 'ko' ? '인증 정보 미제출' : 'Info Required'}</span>
                            </span>
                        )}
                        {kycStatus === 'pending' && (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-black px-2.5 py-1 rounded-full animate-pulse">
                                <Settings className="animate-spin" size={12} />
                                <span>{locale === 'ko' ? '본사 심사 대기 중' : 'Under Review'}</span>
                            </span>
                        )}
                        {kycStatus === 'verified' && (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-black px-2.5 py-1 rounded-full">
                                <ShieldCheck size={12} />
                                <span>{locale === 'ko' ? '고객확인 인증 완료' : 'Verified'}</span>
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* KYC Input Forms */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Seller Type Selector */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-stone-400 block">{locale === 'ko' ? '판매자 구분' : 'Seller Type'}</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <label className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer text-center transition-all ${
                                    sellerType === 'individual' 
                                        ? 'border-blue-500 bg-blue-50/20 text-blue-700 font-bold' 
                                        : 'border-stone-150 bg-stone-50 hover:bg-stone-100/50 text-stone-600'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name="seller_type"
                                        checked={sellerType === 'individual'} 
                                        onChange={() => setSellerType('individual')}
                                        disabled={kycStatus === 'pending'}
                                        className="sr-only"
                                    />
                                    <span className="text-xs">{locale === 'ko' ? '개인 판매자' : 'Individual'}</span>
                                    <span className="text-[9px] text-stone-400 font-medium mt-0.5">{locale === 'ko' ? '(비사업자)' : '(Non-biz)'}</span>
                                </label>
                                <label className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer text-center transition-all ${
                                    sellerType === 'biz_general' 
                                        ? 'border-blue-500 bg-blue-50/20 text-blue-700 font-bold' 
                                        : 'border-stone-150 bg-stone-50 hover:bg-stone-100/50 text-stone-600'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name="seller_type"
                                        checked={sellerType === 'biz_general'} 
                                        onChange={() => setSellerType('biz_general')}
                                        disabled={kycStatus === 'pending'}
                                        className="sr-only"
                                    />
                                    <span className="text-xs">{locale === 'ko' ? '개인 일반과세' : 'General Biz'}</span>
                                    <span className="text-[9px] text-stone-400 font-medium mt-0.5">{locale === 'ko' ? '(일반사업자)' : '(General Tax)'}</span>
                                </label>
                                <label className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer text-center transition-all ${
                                    sellerType === 'biz_simplified' 
                                        ? 'border-blue-500 bg-blue-50/20 text-blue-700 font-bold' 
                                        : 'border-stone-150 bg-stone-50 hover:bg-stone-100/50 text-stone-600'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name="seller_type"
                                        checked={sellerType === 'biz_simplified'} 
                                        onChange={() => setSellerType('biz_simplified')}
                                        disabled={kycStatus === 'pending'}
                                        className="sr-only"
                                    />
                                    <span className="text-xs">{locale === 'ko' ? '개인 간이과세' : 'Simplified Biz'}</span>
                                    <span className="text-[9px] text-stone-400 font-medium mt-0.5">{locale === 'ko' ? '(간이사업자)' : '(Simplified)'}</span>
                                </label>
                                <label className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer text-center transition-all ${
                                    sellerType === 'corporate' 
                                        ? 'border-blue-500 bg-blue-50/20 text-blue-700 font-bold' 
                                        : 'border-stone-150 bg-stone-50 hover:bg-stone-100/50 text-stone-600'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name="seller_type"
                                        checked={sellerType === 'corporate'} 
                                        onChange={() => setSellerType('corporate')}
                                        disabled={kycStatus === 'pending'}
                                        className="sr-only"
                                    />
                                    <span className="text-xs">{locale === 'ko' ? '법인 사업자' : 'Corporate'}</span>
                                    <span className="text-[9px] text-stone-400 font-medium mt-0.5">{locale === 'ko' ? '(법인등록필수)' : '(Corp Reg)'}</span>
                                </label>
                            </div>
                        </div>

                        {/* KYC fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-stone-400 block mb-1">
                                    {sellerType === 'corporate' 
                                        ? (locale === 'ko' ? '대표자명 *' : 'Representative Name *')
                                        : (locale === 'ko' ? '대표자 실명 (예금주와 일치 필수) *' : 'Rep Real Name (Must match Account Holder) *')}
                                </label>
                                <input 
                                    type="text"
                                    value={repName}
                                    onChange={(e) => setRepName(e.target.value)}
                                    disabled={kycStatus === 'pending'}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 outline-none focus:bg-white border-l-4 border-l-amber-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-400 block mb-1">{locale === 'ko' ? '대표자 생년월일 *' : 'Date of Birth *'}</label>
                                <input 
                                    type="date"
                                    value={repBirth}
                                    onChange={(e) => setRepBirth(e.target.value)}
                                    disabled={kycStatus === 'pending'}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-100 rounded-xl text-xs font-bold text-stone-700 outline-none focus:bg-white"
                                />
                            </div>
                        </div>

                        {/* Business details */}
                        {sellerType !== 'individual' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                                <div>
                                    <label className="text-xs font-bold text-stone-400 block mb-1">
                                        {sellerType === 'corporate' ? (locale === 'ko' ? '법인명(상호명) *' : 'Corporate Name *') : (locale === 'ko' ? '상호명 *' : 'Business Name *')}
                                    </label>
                                    <input 
                                        type="text"
                                        required
                                        value={shopName}
                                        onChange={(e) => setShopName(e.target.value)}
                                        disabled={kycStatus === 'pending'}
                                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-100 rounded-xl text-xs font-bold text-stone-700 outline-none focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-stone-400 block mb-1">{locale === 'ko' ? '사업자등록번호 *' : 'Business Registration No. *'}</label>
                                    <input 
                                        type="text"
                                        placeholder="000-00-00000"
                                        value={businessNum}
                                        onChange={(e) => setBusinessNum(e.target.value)}
                                        disabled={kycStatus === 'pending'}
                                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-100 rounded-xl text-xs font-bold text-stone-700 outline-none focus:bg-white"
                                    />
                                </div>
                                {sellerType === 'corporate' && (
                                    <div className="animate-fadeIn">
                                        <label className="text-xs font-bold text-stone-400 block mb-1">{locale === 'ko' ? '법인등록번호 *' : 'Corporate Registration No. *'}</label>
                                        <input 
                                            type="text"
                                            placeholder="000000-0000000"
                                            value={corporateNum}
                                            onChange={(e) => setCorporateNum(e.target.value)}
                                            disabled={kycStatus === 'pending'}
                                            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-100 rounded-xl text-xs font-bold text-stone-700 outline-none focus:bg-white"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="text-xs font-bold text-stone-400 block mb-1">{locale === 'ko' ? '통신판매업 신고번호 *' : 'Mail Order Business No. *'}</label>
                                    <input 
                                        type="text"
                                        placeholder="제 2026-서울강남-0000호"
                                        value={mailOrderNum}
                                        onChange={(e) => setMailOrderNum(e.target.value)}
                                        disabled={kycStatus === 'pending'}
                                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-100 rounded-xl text-xs font-bold text-stone-700 outline-none focus:bg-white"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Phone identity authentication */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-stone-400 block">{locale === 'ko' ? '본인인증 휴대폰 번호 *' : 'Mobile Verification *'}</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    placeholder="010-0000-0000"
                                    disabled={kycStatus === 'pending' || verifiedPhone}
                                    className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-100 rounded-xl text-xs font-bold text-stone-700 outline-none focus:bg-white"
                                />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setVerifiedPhone(true);
                                        alert(locale === 'ko' ? '본인인증이 완료되었습니다.' : 'Phone verification success.');
                                    }}
                                    disabled={kycStatus === 'pending' || verifiedPhone}
                                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                                        verifiedPhone 
                                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                                    }`}
                                >
                                    {verifiedPhone ? (locale === 'ko' ? '인증완료' : 'Verified') : (locale === 'ko' ? '본인인증' : 'Verify')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Document Upload Panels */}
                    <div className="space-y-4 bg-stone-50/50 p-5 rounded-2xl border border-stone-100 h-fit">
                        <span className="text-xs font-bold text-stone-600 block mb-2">{locale === 'ko' ? '심사 서류 제출 (사본)' : 'Required Documents'}</span>
                        
                        {/* ID upload (only for individual and sole proprietor) */}
                        {sellerType !== 'corporate' && (
                            <div className="flex items-center justify-between text-xs font-bold animate-fadeIn">
                                <span className="text-stone-500 font-semibold">{locale === 'ko' ? '1. 대표자 신분증 사본 *' : '1. ID Copy *'}</span>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setUploadedFiles({ ...uploadedFiles, idCopy: true });
                                    }}
                                    disabled={kycStatus === 'pending' || uploadedFiles.idCopy}
                                    className={`p-1.5 rounded-lg border flex items-center gap-1 text-[10px] transition-all ${
                                        uploadedFiles.idCopy 
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                    }`}
                                >
                                    {uploadedFiles.idCopy ? <Check size={12} /> : <Upload size={12} />}
                                    <span>{uploadedFiles.idCopy ? (locale === 'ko' ? '첨부됨' : 'Attached') : (locale === 'ko' ? '업로드' : 'Upload')}</span>
                                </button>
                            </div>
                        )}

                        {/* Business license upload (for all businesses) */}
                        {sellerType !== 'individual' && (
                            <div className="flex items-center justify-between text-xs font-bold animate-fadeIn">
                                <span className="text-stone-500 font-semibold">
                                    {sellerType === 'corporate' ? (locale === 'ko' ? '1. 사업자등록증 사본 *' : '1. Biz Certificate *') : (locale === 'ko' ? '2. 사업자등록증 사본 *' : '2. Biz Certificate *')}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setUploadedFiles({ ...uploadedFiles, bizCert: true });
                                    }}
                                    disabled={kycStatus === 'pending' || uploadedFiles.bizCert}
                                    className={`p-1.5 rounded-lg border flex items-center gap-1 text-[10px] transition-all ${
                                        uploadedFiles.bizCert 
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                    }`}
                                >
                                    {uploadedFiles.bizCert ? <Check size={12} /> : <Upload size={12} />}
                                    <span>{uploadedFiles.bizCert ? (locale === 'ko' ? '첨부됨' : 'Attached') : (locale === 'ko' ? '업로드' : 'Upload')}</span>
                                </button>
                            </div>
                        )}

                        {/* Bankbook copy upload (all types) */}
                        <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-stone-500 font-semibold">
                                {sellerType === 'individual' && (locale === 'ko' ? '2. 정산통장 사본 *' : '2. Bankbook Copy *')}
                                {(sellerType === 'biz_general' || sellerType === 'biz_simplified') && (locale === 'ko' ? '3. 정산통장 사본 *' : '3. Bankbook Copy *')}
                                {sellerType === 'corporate' && (locale === 'ko' ? '2. 법인명의 통장 사본 *' : '2. Corp Bankbook Copy *')}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setUploadedFiles({ ...uploadedFiles, bankBook: true });
                                }}
                                disabled={kycStatus === 'pending' || uploadedFiles.bankBook}
                                className={`p-1.5 rounded-lg border flex items-center gap-1 text-[10px] transition-all ${
                                    uploadedFiles.bankBook 
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                }`}
                            >
                                {uploadedFiles.bankBook ? <Check size={12} /> : <Upload size={12} />}
                                <span>{uploadedFiles.bankBook ? (locale === 'ko' ? '첨부됨' : 'Attached') : (locale === 'ko' ? '업로드' : 'Upload')}</span>
                            </button>
                        </div>

                        {/* Corporate registration certificate (only corporate) */}
                        {sellerType === 'corporate' && (
                            <>
                                <div className="flex items-center justify-between text-xs font-bold animate-fadeIn">
                                    <span className="text-stone-500 font-semibold">{locale === 'ko' ? '3. 법인 등기부등본 *' : '3. Corporate Register *'}</span>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setUploadedFiles({ ...uploadedFiles, corpRegister: true });
                                        }}
                                        disabled={kycStatus === 'pending' || uploadedFiles.corpRegister}
                                        className={`p-1.5 rounded-lg border flex items-center gap-1 text-[10px] transition-all ${
                                            uploadedFiles.corpRegister 
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                                                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                        }`}
                                    >
                                        {uploadedFiles.corpRegister ? <Check size={12} /> : <Upload size={12} />}
                                        <span>{uploadedFiles.corpRegister ? (locale === 'ko' ? '첨부됨' : 'Attached') : (locale === 'ko' ? '업로드' : 'Upload')}</span>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold animate-fadeIn">
                                    <span className="text-stone-500 font-semibold">{locale === 'ko' ? '4. 법인 인감증명서 *' : '4. Corporate Seal Cert *'}</span>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setUploadedFiles({ ...uploadedFiles, corpSeal: true });
                                        }}
                                        disabled={kycStatus === 'pending' || uploadedFiles.corpSeal}
                                        className={`p-1.5 rounded-lg border flex items-center gap-1 text-[10px] transition-all ${
                                            uploadedFiles.corpSeal 
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                                                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                        }`}
                                    >
                                        {uploadedFiles.corpSeal ? <Check size={12} /> : <Upload size={12} />}
                                        <span>{uploadedFiles.corpSeal ? (locale === 'ko' ? '첨부됨' : 'Attached') : (locale === 'ko' ? '업로드' : 'Upload')}</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Display reject reason if present */}
                {kycStatus === 'unsubmitted' && kycRejectReason && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-600 font-bold animate-fadeIn">
                        <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                        <div>
                            <span className="block font-black text-rose-800">{locale === 'ko' ? '이전 심사 반려 사유' : 'Previous KYC Rejection Reason'}</span>
                            <p className="mt-0.5 leading-relaxed font-semibold">{kycRejectReason}</p>
                        </div>
                    </div>
                )}

                {/* KYC Submit Button */}
                {kycStatus === 'unsubmitted' && (
                    <div className="pt-3 border-t border-stone-100 flex justify-end">
                        <button
                            onClick={handleKycSubmit}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black transition-all shadow-soft flex items-center gap-1.5"
                        >
                            <ShieldCheck size={14} />
                            <span>{locale === 'ko' ? '고객확인(KYC) 심사 서류 제출하기' : 'Submit KYC for Review'}</span>
                        </button>
                    </div>
                )}

                {/* Instruction link when pending */}
                {kycStatus === 'pending' && (
                    <div className="pt-5 border-t border-stone-100 p-4 bg-blue-50/50 border border-blue-150 rounded-2xl text-xs text-blue-700 font-bold flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fadeIn">
                        <div className="space-y-1">
                            <span className="block font-black text-blue-800">{locale === 'ko' ? '서류 제출이 완료되었습니다.' : 'Documents Submitted Successfully'}</span>
                            <p className="text-[10px] text-stone-500 font-semibold leading-relaxed">
                                {locale === 'ko' 
                                    ? '보안상 신청자 본인은 직접 승인 처리를 할 수 없습니다. 본사 관리자 페이지(byKnit Admin)로 이동해 검토 및 승인을 완료해 주세요.' 
                                    : 'For security, you cannot self-approve. Open the Admin console to review.'}
                            </p>
                        </div>
                        <a
                            href="/ko/admin/kyc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black transition-all flex items-center gap-1 shrink-0 self-end sm:self-center"
                        >
                            <span>{locale === 'ko' ? '본사 관리자 페이지 바로가기' : 'Go to Admin Console'}</span>
                            <ExternalLink size={10} />
                        </a>
                    </div>
                )}
            </div>
        </form>
    );
}
