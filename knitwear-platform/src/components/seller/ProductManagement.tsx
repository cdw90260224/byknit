'use client';

import React, { useState, useRef } from 'react';
import { 
    Plus, 
    Search, 
    Filter, 
    Edit, 
    EyeOff, 
    Eye, 
    Trash2, 
    X,
    Package,
    Layers,
    DollarSign,
    Check,
    Upload,
    Download,
    AlertCircle,
    List,
    FileText
} from 'lucide-react';

interface PhysicalProduct {
    id: number;
    name: string;
    category: string;
    price: number;
    discountPrice?: number;
    status: 'selling' | 'hidden' | 'soldout';
    options: { name: string; stock: number }[];
    imageUrl: string;
}

type ProductSubTab = 'list' | 'register' | 'bulk';

export function ProductManagement({ locale }: { locale: string }) {
    // Initial mock physical products
    const [products, setProducts] = useState<PhysicalProduct[]>([
        { 
            id: 1, 
            name: '파스텔 소프트 코튼 털실 (50g)', 
            category: 'yarn', 
            price: 4500, 
            discountPrice: 3800, 
            status: 'selling',
            options: [
                { name: '밀크화이트 / 얇음', stock: 120 },
                { name: '베이비블루 / 얇음', stock: 45 },
                { name: '소프트베이지 / 보통', stock: 80 }
            ],
            imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=200&auto=format&fit=crop'
        },
        { 
            id: 2, 
            name: '유기농 내추럴 메리노 울', 
            category: 'yarn', 
            price: 8900, 
            status: 'selling',
            options: [
                { name: '오트밀 베이지 / 보통', stock: 15 },
                { name: '차콜 그레이 / 굵음', stock: 0 },
                { name: '소프트 세이지 / 보통', stock: 35 }
            ],
            imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc085ff8?q=80&w=200&auto=format&fit=crop'
        },
        { 
            id: 3, 
            name: '카본 대바늘 35cm 5종 풀패키지', 
            category: 'needle', 
            price: 24000, 
            discountPrice: 21500, 
            status: 'soldout',
            options: [
                { name: '3mm ~ 5mm 패키지', stock: 0 }
            ],
            imageUrl: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=200&auto=format&fit=crop'
        },
        { 
            id: 4, 
            name: '비건 레더 가죽 라벨 (10개입)', 
            category: 'notions', 
            price: 3500, 
            status: 'hidden',
            options: [
                { name: '브라운 레더', stock: 30 },
                { name: '클래식 블랙', stock: 10 }
            ],
            imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=200&auto=format&fit=crop'
        }
    ]);

    // Sub-tab state
    const [activeSubTab, setActiveSubTab] = useState<ProductSubTab>('list');

    // Search and filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Single product registration form states
    const [regName, setRegName] = useState('');
    const [regCategory, setRegCategory] = useState('yarn');
    const [regPrice, setRegPrice] = useState('');
    const [regDiscountPrice, setRegDiscountPrice] = useState('');
    const [regImageUrl, setRegImageUrl] = useState('');
    const [regOptions, setRegOptions] = useState<{ name: string; stock: number }[]>([
        { name: '기본 옵션', stock: 50 }
    ]);

    // File input ref for bulk upload
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Edit modal states (for quick edit of options/prices)
    const [editingProduct, setEditingProduct] = useState<PhysicalProduct | null>(null);

    // Categories mapping
    const categories = {
        all: locale === 'ko' ? '전체' : 'All',
        yarn: locale === 'ko' ? '털실' : 'Yarn',
        needle: locale === 'ko' ? '바늘' : 'Needles',
        notions: locale === 'ko' ? '부자재' : 'Notions',
        etc: locale === 'ko' ? '기타 소품' : 'Others'
    };

    // Add option to registration form
    const handleAddRegOption = () => {
        setRegOptions([...regOptions, { name: '', stock: 10 }]);
    };

    // Remove option from registration form
    const handleRemoveRegOption = (index: number) => {
        setRegOptions(regOptions.filter((_, i) => i !== index));
    };

    const handleRegOptionChange = (index: number, field: 'name' | 'stock', value: string | number) => {
        const updated = [...regOptions];
        if (field === 'name') {
            updated[index].name = value as string;
        } else {
            updated[index].stock = Number(value);
        }
        setRegOptions(updated);
    };

    // Save registered product
    const handleRegisterProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (!regName.trim() || !regPrice) {
            alert(locale === 'ko' ? '상품명과 판매가를 입력해 주세요.' : 'Please enter product name and price.');
            return;
        }

        const newProd: PhysicalProduct = {
            id: Date.now(),
            name: regName,
            category: regCategory,
            price: Number(regPrice),
            discountPrice: regDiscountPrice ? Number(regDiscountPrice) : undefined,
            status: 'selling',
            options: regOptions.filter(opt => opt.name.trim() !== ''),
            imageUrl: regImageUrl.trim() || 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=200'
        };

        setProducts([newProd, ...products]);

        // Reset form
        setRegName('');
        setRegCategory('yarn');
        setRegPrice('');
        setRegDiscountPrice('');
        setRegImageUrl('');
        setRegOptions([{ name: '기본 옵션', stock: 50 }]);

        alert(locale === 'ko' ? '신규 상품이 성공적으로 등록되었습니다.' : 'Product registered successfully.');
        setActiveSubTab('list'); // Switch back to list
    };

    // Bulk registration via CSV
    const handleBulkUploadCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (!text) return;

            const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            if (lines.length <= 1) {
                alert(locale === 'ko' ? '등록할 데이터가 없습니다.' : 'No data in CSV.');
                return;
            }

            const newUploadedProds: PhysicalProduct[] = [];
            
            // Loop skip header
            for (let i = 1; i < lines.length; i++) {
                // simple split by comma
                const cols = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
                if (cols.length < 3) continue;

                const name = cols[0];
                const category = cols[1] || 'yarn';
                const price = Number(cols[2]) || 0;
                const discountPrice = cols[3] ? Number(cols[3]) : undefined;
                const optionsRaw = cols[4] || ''; // e.g. "레드:50|블루:30"
                const imageUrl = cols[5] || 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=200';

                // Parse options
                const options = optionsRaw.split('|').map(optStr => {
                    const parts = optStr.split(':');
                    return {
                        name: parts[0] || '기본 옵션',
                        stock: Number(parts[1]) || 0
                    };
                }).filter(o => o.name.trim() !== '');

                newUploadedProds.push({
                    id: Date.now() + i,
                    name,
                    category,
                    price,
                    discountPrice,
                    status: 'selling',
                    options,
                    imageUrl
                });
            }

            setProducts([...newUploadedProds, ...products]);
            alert(locale === 'ko' 
                ? `총 ${newUploadedProds.length}개의 상품이 일괄 등록되었습니다.` 
                : `${newUploadedProds.length} products uploaded successfully.`);
            setActiveSubTab('list');
        };

        reader.readAsText(file, 'UTF-8');
        e.target.value = ''; // Reset file input
    };

    // Download CSV template
    const handleDownloadTemplate = () => {
        const headers = '\ufeff상품명,카테고리(yarn/needle/notions/etc),판매가,할인가,옵션리스트(옵션명1:재고1|옵션명2:재고2),이미지URL\n';
        const sampleRow = '"소프트 아크릴 실","yarn",4500,3900,"화이트:100|핑크:80|옐로우:50","https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=200"\n';
        const blob = new Blob([headers + sampleRow], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'byknit_product_bulk_template.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Change selling status
    const handleStatusChange = (id: number, status: 'selling' | 'hidden' | 'soldout') => {
        setProducts(products.map(p => p.id === id ? { ...p, status } : p));
    };

    // Filter products for inquiry tab
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toString().includes(searchQuery);
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6 text-stone-700 animate-fadeIn font-sans">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-black text-stone-850">
                    {locale === 'ko' ? '상품 관리' : 'Product Console'}
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                    {locale === 'ko' 
                        ? '실물 상품의 등록, 수정, 일괄 업로드 및 진열 상태를 관리합니다.' 
                        : 'Register, edit, batch upload, and manage selling status of physical goods.'}
                </p>
            </div>

            {/* Custom Sub-tab Switcher */}
            <div className="flex border-b border-stone-200">
                <button
                    onClick={() => setActiveSubTab('list')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                        activeSubTab === 'list'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                >
                    <List size={16} />
                    <span>{locale === 'ko' ? '상품조회 및 수정' : 'Inquiry & Modify'}</span>
                </button>
                <button
                    onClick={() => setActiveSubTab('register')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                        activeSubTab === 'register'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                >
                    <Plus size={16} />
                    <span>{locale === 'ko' ? '상품등록' : 'Register Product'}</span>
                </button>
                <button
                    onClick={() => setActiveSubTab('bulk')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                        activeSubTab === 'bulk'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                >
                    <Upload size={16} />
                    <span>{locale === 'ko' ? '상품일괄등록' : 'Bulk Upload'}</span>
                </button>
            </div>

            {/* ---------------- 1. 상품조회 및 수정 탭 ---------------- */}
            {activeSubTab === 'list' && (
                <div className="space-y-6">
                    {/* Filters Toolbar */}
                    <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-soft flex flex-col md:flex-row items-center gap-4 justify-between">
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            {Object.entries(categories).map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedCategory(key)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                        selectedCategory === key 
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-soft' 
                                            : 'bg-stone-50 border-stone-100 hover:bg-stone-100 text-stone-600'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full md:w-72">
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input 
                                type="text" 
                                placeholder={locale === 'ko' ? '상품명, 상품 코드 검색...' : 'Search product name, ID...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-3 py-2 bg-stone-50 border-0 rounded-xl text-xs outline-none focus:bg-stone-100 text-stone-600 w-full font-bold"
                            />
                        </div>
                    </div>

                    {/* Products Grid Table */}
                    <div className="bg-white rounded-3xl border border-stone-150 shadow-soft overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-xs min-w-[900px]">
                                <thead>
                                    <tr className="bg-stone-100 text-stone-600 font-bold border-b border-stone-200">
                                        <th className="p-3.5 border-r border-stone-200 text-center w-20">{locale === 'ko' ? '이미지' : 'Image'}</th>
                                        <th className="p-3.5 border-r border-stone-200">{locale === 'ko' ? '상품명' : 'Product'}</th>
                                        <th className="p-3.5 border-r border-stone-200 w-28">{locale === 'ko' ? '카테고리' : 'Category'}</th>
                                        <th className="p-3.5 border-r border-stone-200 text-right w-36">{locale === 'ko' ? '판매가 (할인가)' : 'Price'}</th>
                                        <th className="p-3.5 border-r border-stone-200 w-52">{locale === 'ko' ? '옵션 및 재고수량' : 'Options & Stocks'}</th>
                                        <th className="p-3.5 border-r border-stone-200 text-center w-28">{locale === 'ko' ? '판매 상태' : 'Status'}</th>
                                        <th className="p-3.5 text-center w-28">{locale === 'ko' ? '관리' : 'Action'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-200 font-semibold text-stone-700">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((p) => {
                                            const totalStock = p.options.reduce((sum, opt) => sum + opt.stock, 0);

                                            return (
                                                <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                                                    {/* Image */}
                                                    <td className="p-3.5 border-r border-stone-200 text-center">
                                                        <img 
                                                            src={p.imageUrl} 
                                                            alt={p.name}
                                                            className="w-10 h-10 object-cover rounded-xl mx-auto border border-stone-100"
                                                        />
                                                    </td>

                                                    {/* Name & ID */}
                                                    <td className="p-3.5 border-r border-stone-200 space-y-1">
                                                        <div className="font-bold text-stone-800 text-sm">{p.name}</div>
                                                        <div className="text-[10px] text-stone-400 font-medium">코드: {p.id}</div>
                                                    </td>

                                                    {/* Category */}
                                                    <td className="p-3.5 border-r border-stone-200">
                                                        <span className="px-2.5 py-1 bg-stone-50 border border-stone-100 rounded-full text-[10px] text-stone-600 font-bold">
                                                            {categories[p.category as keyof typeof categories] || p.category}
                                                        </span>
                                                    </td>

                                                    {/* Price */}
                                                    <td className="p-3.5 border-r border-stone-200 text-right space-y-0.5">
                                                        {p.discountPrice ? (
                                                            <>
                                                                <div className="text-stone-300 line-through text-[10px]">₩{p.price.toLocaleString()}</div>
                                                                <div className="text-blue-600 font-black text-xs">₩{p.discountPrice.toLocaleString()}</div>
                                                            </>
                                                        ) : (
                                                            <div className="font-black text-xs">₩{p.price.toLocaleString()}</div>
                                                        )}
                                                    </td>

                                                    {/* Options */}
                                                    <td className="p-3.5 border-r border-stone-200 text-xs space-y-1 text-stone-500">
                                                        <div className="font-bold text-stone-700 text-[10px] mb-1">
                                                            총 옵션 {p.options.length}개 / 총 재고 {totalStock}개
                                                        </div>
                                                        {p.options.slice(0, 2).map((opt, i) => (
                                                            <div key={i} className="flex justify-between text-[10px]">
                                                                <span className="truncate max-w-[120px]">{opt.name}</span>
                                                                <span className={opt.stock <= 5 ? 'text-rose-500 font-black' : 'font-bold'}>
                                                                    {opt.stock}개
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {p.options.length > 2 && (
                                                            <div className="text-[9px] text-stone-400 font-medium">...외 {p.options.length - 2}개 옵션 더 있음</div>
                                                        )}
                                                    </td>

                                                    {/* Status Selector */}
                                                    <td className="p-3.5 border-r border-stone-200 text-center">
                                                        <select
                                                            value={p.status}
                                                            onChange={(e) => handleStatusChange(p.id, e.target.value as any)}
                                                            className={`bg-white border border-stone-300 rounded-lg p-1.5 text-[10px] font-black outline-none ${
                                                                p.status === 'selling' 
                                                                    ? 'text-emerald-600'
                                                                    : p.status === 'hidden'
                                                                    ? 'text-stone-400'
                                                                    : 'text-rose-500'
                                                            }`}
                                                        >
                                                            <option value="selling">{locale === 'ko' ? '판매 중' : 'Selling'}</option>
                                                            <option value="soldout">{locale === 'ko' ? '일시 품절' : 'Sold Out'}</option>
                                                            <option value="hidden">{locale === 'ko' ? '숨김' : 'Hidden'}</option>
                                                        </select>
                                                    </td>

                                                    {/* Action */}
                                                    <td className="p-3.5 text-center">
                                                        <button 
                                                            onClick={() => setEditingProduct(p)}
                                                            className="p-2 text-stone-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all inline-block"
                                                            title="수정"
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="p-20 text-center text-stone-400 font-bold">
                                                {locale === 'ko' ? '검색 조건에 맞는 상품이 없습니다.' : 'No products found.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- 2. 상품 등록 탭 ---------------- */}
            {activeSubTab === 'register' && (
                <form onSubmit={handleRegisterProduct} className="bg-white p-6 md:p-8 rounded-3xl border border-stone-150 shadow-soft space-y-6">
                    <div className="border-b border-stone-100 pb-3 flex items-center gap-2 text-stone-800">
                        <Package className="text-[#8FBC8F]" />
                        <span className="text-lg font-bold">{locale === 'ko' ? '신규 실물 상품 등록' : 'Register New Physical Product'}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-stone-500 mb-1.5">{locale === 'ko' ? '상품명 *' : 'Product Name *'}</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder={locale === 'ko' ? '예: 소프트 내추럴 울 털실 100g' : 'Enter product name'}
                                    value={regName}
                                    onChange={(e) => setRegName(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 text-stone-700 font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-stone-500 mb-1.5">{locale === 'ko' ? '카테고리 *' : 'Category *'}</label>
                                    <select 
                                        value={regCategory}
                                        onChange={(e) => setRegCategory(e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 text-stone-700 font-bold"
                                    >
                                        <option value="yarn">{locale === 'ko' ? '털실 (Yarn)' : 'Yarn'}</option>
                                        <option value="needle">{locale === 'ko' ? '바늘 (Needles)' : 'Needles'}</option>
                                        <option value="notions">{locale === 'ko' ? '부자재 (Notions)' : 'Notions'}</option>
                                        <option value="etc">{locale === 'ko' ? '기타 (Others)' : 'Others'}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-stone-500 mb-1.5">{locale === 'ko' ? '대표 이미지 URL' : 'Image URL'}</label>
                                    <input 
                                        type="text" 
                                        placeholder="https://..."
                                        value={regImageUrl}
                                        onChange={(e) => setRegImageUrl(e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 text-stone-700 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-stone-500 mb-1.5">{locale === 'ko' ? '판매가 (원) *' : 'Selling Price *'}</label>
                                    <input 
                                        type="number" 
                                        required
                                        placeholder="4500"
                                        value={regPrice}
                                        onChange={(e) => setRegPrice(e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 text-stone-700 font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-stone-500 mb-1.5">{locale === 'ko' ? '할인가 (원) - 선택' : 'Discount Price'}</label>
                                    <input 
                                        type="number" 
                                        placeholder="3900"
                                        value={regDiscountPrice}
                                        onChange={(e) => setRegDiscountPrice(e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 text-stone-700 font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Dynamic Options Setup */}
                        <div className="space-y-4 border-t md:border-t-0 md:border-l border-stone-100 pt-6 md:pt-0 md:pl-6">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black text-stone-500 block">{locale === 'ko' ? '옵션 품목 구성 *' : 'Options & Inventory *'}</label>
                                <button 
                                    type="button"
                                    onClick={handleAddRegOption}
                                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"
                                >
                                    <Plus size={10} />
                                    <span>{locale === 'ko' ? '옵션 추가' : 'Add Option'}</span>
                                </button>
                            </div>

                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                {regOptions.map((opt, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input 
                                            type="text" 
                                            required
                                            placeholder={locale === 'ko' ? '옵션명 (예: 아이보리 / 보통)' : 'Option Name'}
                                            value={opt.name}
                                            onChange={(e) => handleRegOptionChange(index, 'name', e.target.value)}
                                            className="flex-1 bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white text-stone-700 font-bold"
                                        />
                                        <input 
                                            type="number" 
                                            required
                                            placeholder={locale === 'ko' ? '재고수량' : 'Stock'}
                                            value={opt.stock}
                                            onChange={(e) => handleRegOptionChange(index, 'stock', Number(e.target.value))}
                                            className="w-24 bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white text-stone-700 font-bold"
                                        />
                                        {regOptions.length > 1 && (
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveRegOption(index)}
                                                className="p-2.5 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-stone-100 pt-5 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setActiveSubTab('list')}
                            className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-2xl text-xs font-bold transition-all"
                        >
                            {locale === 'ko' ? '취소' : 'Cancel'}
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black transition-all shadow-soft flex items-center gap-1.5"
                        >
                            <Check size={14} />
                            <span>{locale === 'ko' ? '상품 등록하기' : 'Register Product'}</span>
                        </button>
                    </div>
                </form>
            )}

            {/* ---------------- 3. 상품 일괄 등록 탭 ---------------- */}
            {activeSubTab === 'bulk' && (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-150 shadow-soft space-y-6">
                    <div className="border-b border-stone-100 pb-3 flex items-center gap-2 text-stone-850">
                        <Upload className="text-[#8FBC8F]" />
                        <span className="text-lg font-bold">{locale === 'ko' ? '상품 일괄등록 (CSV 업로드)' : 'Bulk Product Registration'}</span>
                    </div>

                    {/* Instruction Box */}
                    <div className="bg-stone-50 border border-stone-150 p-5 rounded-2xl flex gap-3 text-stone-500">
                        <AlertCircle className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
                        <div className="text-xs space-y-2">
                            <span className="font-bold text-stone-750 block">일괄등록 작성 방법 및 유의사항</span>
                            <p>1. 하단의 <b>[일괄등록 양식 템플릿]</b>을 다운로드합니다.</p>
                            <p>2. Excel이나 구글 스프레드시트에서 규격에 맞게 내용을 채웁니다. (카테고리는 <b>yarn / needle / notions / etc</b> 중 지정)</p>
                            <p>3. 여러 옵션은 옵션명 뒤에 콜론(:)과 재고를 적고 세로파이프(|)로 구분하여 기입합니다. (예: <code className="bg-stone-150 px-1 py-0.5 rounded font-mono font-bold">빨간실:50|파란실:30</code>)</p>
                            <p>4. 작성 완료된 파일을 CSV 파일 형식으로 내보낸 뒤 아래 업로드 영역에 등록합니다.</p>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-8 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
                        <button
                            onClick={handleDownloadTemplate}
                            className="px-5 py-3 bg-white border border-stone-200 text-stone-700 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-inner-soft hover:bg-stone-50"
                        >
                            <Download size={14} className="text-[#8FBC8F]" />
                            <span>{locale === 'ko' ? '일괄등록 템플릿 다운로드' : 'Download CSV Template'}</span>
                        </button>

                        <input 
                            type="file" 
                            accept=".csv"
                            ref={fileInputRef}
                            onChange={handleBulkUploadCSV}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 py-3 bg-[#E8F0E8] text-[#556B2F] hover:bg-[#8FBC8F] hover:text-white rounded-2xl text-xs font-black transition-all flex items-center gap-2"
                        >
                            <Upload size={14} />
                            <span>{locale === 'ko' ? 'CSV 파일 선택 및 업로드' : 'Select CSV & Upload'}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Quick Edit Modal (for options & prices change) */}
            {editingProduct && (
                <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-100 overflow-hidden animate-zoomIn flex flex-col">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                            <h2 className="text-lg font-bold text-stone-850 flex items-center gap-2">
                                <Package size={18} className="text-blue-500" />
                                <span>{locale === 'ko' ? '상품 기본정보 수정' : 'Edit Product'}</span>
                            </h2>
                            <button 
                                onClick={() => setEditingProduct(null)}
                                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-black text-stone-500 mb-1.5">{locale === 'ko' ? '상품명' : 'Product Name'}</label>
                                <input 
                                    type="text" 
                                    value={editingProduct.name}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs outline-none focus:bg-white text-stone-700 font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-stone-500 mb-1.5">{locale === 'ko' ? '판매가 (원)' : 'Price'}</label>
                                    <input 
                                        type="number" 
                                        value={editingProduct.price}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs outline-none focus:bg-white text-stone-700 font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-stone-500 mb-1.5">{locale === 'ko' ? '할인가 (원)' : 'Discount Price'}</label>
                                    <input 
                                        type="number" 
                                        value={editingProduct.discountPrice || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, discountPrice: e.target.value ? Number(e.target.value) : undefined })}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs outline-none focus:bg-white text-stone-700 font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-stone-50/50 border-t border-stone-100 flex items-center justify-end gap-2">
                            <button
                                onClick={() => setEditingProduct(null)}
                                className="px-4 py-2.5 bg-white border border-stone-200 text-stone-600 rounded-xl text-xs font-bold transition-all"
                            >
                                {locale === 'ko' ? '닫기' : 'Close'}
                            </button>
                            <button
                                onClick={() => {
                                    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
                                    setEditingProduct(null);
                                    alert(locale === 'ko' ? '상품 수정이 완료되었습니다.' : 'Product updated successfully.');
                                }}
                                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
                            >
                                {locale === 'ko' ? '저장' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
