'use client';

import React, { useState, useEffect } from 'react';
import { Search, Package, Ban, Trash2, Filter, Eye, X, Save, AlertCircle } from 'lucide-react';

interface AdminProduct {
    id: string;
    name: string;
    sellerBrand: string;
    price: number;
    salesQty: number;
    revenue: number;
    status: 'selling' | 'hidden' | 'out_of_stock' | 'banned';
    registeredAt: string;
    mainCategory: string;
    subCategory: string;
    imageUrl: string;
    basicShippingFee: number;
    freeShippingThreshold: number;
    returnShippingFee: number;
    exchangeShippingFee: number;
    options: { name: string; stock: number }[];
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'selling' | 'hidden' | 'banned'>('all');
    
    // Modal State
    const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
    const [modalTab, setModalTab] = useState<'basic' | 'shipping' | 'options'>('basic');
    const [editData, setEditData] = useState<Partial<AdminProduct>>({});

    useEffect(() => {
        // Initial Dummy Data
        const dummyProducts: AdminProduct[] = [
            { 
                id: '1026073009000101', name: '핸드메이드 알파카 스웨터', sellerBrand: '포근한 니팅 아틀리에', price: 125000, salesQty: 12, revenue: 1500000, status: 'selling', registeredAt: '2026-07-29',
                mainCategory: 'clothes', subCategory: 'sweater', imageUrl: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=300&q=80',
                basicShippingFee: 3000, freeShippingThreshold: 50000, returnShippingFee: 3000, exchangeShippingFee: 6000,
                options: [{ name: '베이지(M)', stock: 5 }, { name: '차콜(L)', stock: 2 }]
            },
            { 
                id: '1026072911000102', name: '여름용 코튼 네트백', sellerBrand: '김니트 스튜디오', price: 45000, salesQty: 8, revenue: 360000, status: 'selling', registeredAt: '2026-07-25',
                mainCategory: 'bags', subCategory: 'totebag', imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&q=80',
                basicShippingFee: 2500, freeShippingThreshold: 40000, returnShippingFee: 2500, exchangeShippingFee: 5000,
                options: [{ name: '아이보리', stock: 15 }, { name: '네이비', stock: 8 }]
            },
            { 
                id: '1026072815000103', name: '프리미엄 캐시미어 목도리', sellerBrand: '겨울이야기', price: 89000, salesQty: 0, revenue: 0, status: 'hidden', registeredAt: '2026-07-20',
                mainCategory: 'accessories', subCategory: 'muffler', imageUrl: 'https://images.unsplash.com/photo-1520903073618-2fdc65e8a604?w=300&q=80',
                basicShippingFee: 3000, freeShippingThreshold: 50000, returnShippingFee: 3000, exchangeShippingFee: 6000,
                options: [{ name: '카멜', stock: 0 }]
            },
            { 
                id: '1026072009000104', name: '수제 염색 실 (50g)', sellerBrand: '다채로운 실공방', price: 15000, salesQty: 105, revenue: 1575000, status: 'selling', registeredAt: '2026-07-15',
                mainCategory: 'yarn', subCategory: 'wool', imageUrl: 'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=300&q=80',
                basicShippingFee: 3000, freeShippingThreshold: 30000, returnShippingFee: 3000, exchangeShippingFee: 6000,
                options: [{ name: '선셋 그라데이션', stock: 50 }, { name: '미드나잇 블루', stock: 32 }]
            },
            { 
                id: '1026071018000105', name: '조립식 우드 바늘 세트', sellerBrand: '클래식 대바늘 공작소', price: 150000, salesQty: 30, revenue: 4500000, status: 'out_of_stock', registeredAt: '2026-07-10',
                mainCategory: 'tools', subCategory: 'needle', imageUrl: 'https://images.unsplash.com/photo-1622396089771-419b48c3b7a5?w=300&q=80',
                basicShippingFee: 0, freeShippingThreshold: 0, returnShippingFee: 3000, exchangeShippingFee: 6000,
                options: [{ name: '기본 세트', stock: 0 }]
            }
        ];
        
        const saved = localStorage.getItem('byknit_admin_products');
        if (saved) {
            try { setProducts(JSON.parse(saved)); } catch(e) { setProducts(dummyProducts); }
        } else {
            setProducts(dummyProducts);
            localStorage.setItem('byknit_admin_products', JSON.stringify(dummyProducts));
        }
    }, []);

    const saveProducts = (newProducts: AdminProduct[]) => {
        setProducts(newProducts);
        localStorage.setItem('byknit_admin_products', JSON.stringify(newProducts));
    };

    const handleBan = (id: string) => {
        if (confirm('이 상품을 강제로 판매 중지하시겠습니까? (규정 위반 등의 사유)')) {
            const newProds = products.map(p => p.id === id ? { ...p, status: 'banned' as const } : p);
            saveProducts(newProds);
            alert('판매 중지 처리되었습니다.');
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('이 상품을 시스템에서 완전히 삭제하시겠습니까? 이 작업은 복구할 수 없습니다.')) {
            const newProds = products.filter(p => p.id !== id);
            saveProducts(newProds);
            alert('상품이 삭제되었습니다.');
        }
    };

    const openModal = (product: AdminProduct) => {
        setSelectedProduct(product);
        setEditData({ status: product.status, mainCategory: product.mainCategory, subCategory: product.subCategory });
        setModalTab('basic');
    };

    const saveEdit = () => {
        if (!selectedProduct) return;
        const newProds = products.map(p => p.id === selectedProduct.id ? { ...p, ...editData } : p);
        saveProducts(newProds);
        alert('상품 수정사항이 저장되었습니다.');
        setSelectedProduct(null);
    };

    const filtered = products.filter(p => {
        const matchesSearch = p.name.includes(searchTerm) || p.sellerBrand.includes(searchTerm) || p.id.includes(searchTerm);
        const matchesFilter = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    const totalRevenue = products.reduce((acc, p) => acc + p.revenue, 0);

    return (
        <div className="p-6 md:p-10 font-sans text-stone-700 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-stone-900 flex items-center gap-2">
                        <Package size={24} className="text-rose-600" />
                        통합 상품 관리
                    </h1>
                    <p className="text-sm text-stone-400 font-bold mt-1">플랫폼에 등록된 모든 판매자의 상품을 통합 관리합니다.</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input 
                            type="text" 
                            placeholder="상품명, 판매자, 상품번호 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold outline-none focus:bg-white transition-all"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-stone-400" />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold outline-none"
                    >
                        <option value="all">전체 상태</option>
                        <option value="selling">판매중</option>
                        <option value="hidden">숨김</option>
                        <option value="banned">판매중지</option>
                    </select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                    <span className="text-xs font-bold text-stone-400">총 등록 상품</span>
                    <div className="text-2xl font-black text-stone-800 mt-1">{products.length}개</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                    <span className="text-xs font-bold text-stone-400">판매중인 상품</span>
                    <div className="text-2xl font-black text-emerald-600 mt-1">{products.filter(p => p.status === 'selling').length}개</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                    <span className="text-xs font-bold text-stone-400">판매 중지(규정 위반)</span>
                    <div className="text-2xl font-black text-rose-600 mt-1">{products.filter(p => p.status === 'banned').length}개</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                    <span className="text-xs font-bold text-stone-400">플랫폼 누적 상품 매출</span>
                    <div className="text-2xl font-black text-stone-800 mt-1">₩ {totalRevenue.toLocaleString()}</div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold">
                            <tr>
                                <th className="px-6 py-4 text-center">조회</th>
                                <th className="px-6 py-4">상품번호</th>
                                <th className="px-6 py-4">상품명</th>
                                <th className="px-6 py-4">판매자 (브랜드)</th>
                                <th className="px-6 py-4 text-right">가격</th>
                                <th className="px-6 py-4 text-right">총 매출</th>
                                <th className="px-6 py-4 text-center">상태</th>
                                <th className="px-6 py-4 text-center">관리 액션</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-stone-400 font-bold">
                                        검색 결과가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(p => (
                                    <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => openModal(p)} className="p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700 rounded-md transition-colors">
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-stone-400">{p.id}</td>
                                        <td className="px-6 py-4 font-bold text-stone-800">
                                            <div className="flex items-center gap-3">
                                                <img src={p.imageUrl} alt={p.name} className="w-8 h-8 rounded-md object-cover" />
                                                <span className="truncate max-w-[200px]" title={p.name}>{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-bold">
                                                {p.sellerBrand}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold">₩ {p.price.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right font-bold text-[#556B2F]">₩ {p.revenue.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            {p.status === 'selling' && <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-black">판매중</span>}
                                            {p.status === 'hidden' && <span className="px-2 py-1 bg-stone-100 text-stone-500 rounded-md text-[10px] font-black">숨김</span>}
                                            {p.status === 'out_of_stock' && <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-md text-[10px] font-black">품절</span>}
                                            {p.status === 'banned' && <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded-md text-[10px] font-black">판매중지</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {p.status !== 'banned' && (
                                                    <button 
                                                        onClick={() => handleBan(p.id)}
                                                        className="p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 rounded-md transition-colors"
                                                        title="판매 중지(규정 위반)"
                                                    >
                                                        <Ban size={16} />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleDelete(p.id)}
                                                    className="p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 rounded-md transition-colors"
                                                    title="완전 삭제"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detailed View Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-stone-200 flex items-start justify-between bg-stone-50">
                            <div className="flex items-center gap-4">
                                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-sm" />
                                <div>
                                    <div className="text-xs text-stone-400 font-mono font-bold">{selectedProduct.id}</div>
                                    <h2 className="text-xl font-black text-stone-900 mt-0.5">{selectedProduct.name}</h2>
                                    <div className="text-sm font-bold text-stone-500 mt-1">판매자: {selectedProduct.sellerBrand}</div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedProduct(null)} className="p-2 text-stone-400 hover:bg-stone-200 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Tabs */}
                        <div className="flex px-6 border-b border-stone-200">
                            {['basic', 'shipping', 'options'].map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setModalTab(tab as any)}
                                    className={`px-4 py-3 text-sm font-bold border-b-2 transition-all ${
                                        modalTab === tab 
                                            ? 'border-stone-900 text-stone-900' 
                                            : 'border-transparent text-stone-400 hover:text-stone-600'
                                    }`}
                                >
                                    {tab === 'basic' && '기본 정보 (어드민 설정)'}
                                    {tab === 'shipping' && '배송 정보'}
                                    {tab === 'options' && '옵션 및 재고'}
                                </button>
                            ))}
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 bg-white">
                            {modalTab === 'basic' && (
                                <div className="space-y-6">
                                    <div className="bg-amber-50 text-amber-700 p-4 rounded-xl flex gap-3 text-sm font-bold border border-amber-100">
                                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                        <p>어드민은 판매자의 잘못된 카테고리나 상태를 강제로 수정할 수 있습니다.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-500 mb-1.5">대분류 카테고리</label>
                                            <select 
                                                value={editData.mainCategory}
                                                onChange={(e) => setEditData({...editData, mainCategory: e.target.value})}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-bold text-stone-700 outline-none"
                                            >
                                                <option value="yarn">털실 / 실</option>
                                                <option value="tools">뜨개 도구 / 부자재</option>
                                                <option value="clothes">의류 (니트 / 스웨터)</option>
                                                <option value="accessories">패션 소품 (목도리 등)</option>
                                                <option value="bags">가방 / 파우치</option>
                                                <option value="home">홈데코 / 리빙</option>
                                                <option value="diy">DIY 패키지</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-500 mb-1.5">상품 상태</label>
                                            <select 
                                                value={editData.status}
                                                onChange={(e) => setEditData({...editData, status: e.target.value as any})}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-bold text-stone-700 outline-none"
                                            >
                                                <option value="selling">판매중</option>
                                                <option value="hidden">숨김</option>
                                                <option value="out_of_stock">품절</option>
                                                <option value="banned">판매중지 (강제)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 mb-1.5">판매 단가</label>
                                        <div className="text-base font-bold text-stone-900">₩ {selectedProduct.price.toLocaleString()}</div>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'shipping' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                                            <span className="text-xs font-bold text-stone-400 block mb-1">기본 배송비</span>
                                            <div className="text-sm font-bold text-stone-800">
                                                {(selectedProduct.basicShippingFee || 0) === 0 ? '무료배송' : `₩ ${(selectedProduct.basicShippingFee || 0).toLocaleString()}`}
                                            </div>
                                        </div>
                                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                                            <span className="text-xs font-bold text-stone-400 block mb-1">무료 조건</span>
                                            <div className="text-sm font-bold text-stone-800">
                                                {(selectedProduct.freeShippingThreshold || 0) === 0 ? '-' : `₩ ${(selectedProduct.freeShippingThreshold || 0).toLocaleString()} 이상 무료`}
                                            </div>
                                        </div>
                                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                                            <span className="text-xs font-bold text-stone-400 block mb-1">반품 배송비 (편도)</span>
                                            <div className="text-sm font-bold text-stone-800">₩ {(selectedProduct.returnShippingFee || 0).toLocaleString()}</div>
                                        </div>
                                        <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                                            <span className="text-xs font-bold text-stone-400 block mb-1">교환 배송비 (왕복)</span>
                                            <div className="text-sm font-bold text-stone-800">₩ {(selectedProduct.exchangeShippingFee || 0).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'options' && (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-stone-600">등록된 옵션 ({(selectedProduct.options || []).length}개)</h3>
                                    <div className="space-y-2">
                                        {(selectedProduct.options || []).map((opt, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
                                                <span className="text-sm font-bold text-stone-800">{opt.name}</span>
                                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${opt.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                    {opt.stock > 0 ? `재고: ${opt.stock}개` : '품절'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-stone-200 bg-stone-50 flex justify-end gap-3">
                            <button onClick={() => setSelectedProduct(null)} className="px-5 py-2.5 bg-white border border-stone-200 text-stone-600 rounded-xl text-sm font-bold hover:bg-stone-100 transition-colors">
                                닫기
                            </button>
                            {modalTab === 'basic' && (
                                <button onClick={saveEdit} className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-bold hover:bg-stone-800 transition-colors flex items-center gap-2">
                                    <Save size={16} />
                                    어드민 권한으로 저장
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
