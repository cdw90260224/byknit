'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    Edit, 
    Package, 
    Check, 
    Upload, 
    Download, 
    AlertCircle, 
    List,
    X,
    FolderTree,
    Folder,
    Info,
    HelpCircle,
    Copy,
    Trash2,
    Megaphone,
    Truck,
    Settings,
    Calendar,
    Eye,
    PlusCircle
} from 'lucide-react';

interface PhysicalProduct {
    id: number;
    name: string;
    mainCategory: string;
    subCategory: string;
    price: number;
    discountPrice?: number;
    status: 'selling' | 'hidden' | 'soldout';
    options: { name: string; stock: number }[];
    imageUrl: string;
    shippingMethod: 'courier' | 'direct' | 'pickup';
    shippingFeeType: 'free' | 'conditional' | 'paid';
    bundleGroupId: number;
    basicShippingFee: number;
    freeShippingThreshold?: number;
    returnShippingFee: number;
    exchangeShippingFee: number;
    deliveryType: 'immediate' | 'custom' | 'reserve';
    customDeliveryDays?: number;
    discountType: 'none' | 'won' | 'percent';
    discountValue: number;
    subImages: string[];
    detailBlocks: { type: 'text' | 'image' | 'notice' | 'guide'; content: string }[];
    optionType: 'simple' | 'combination';
    optionMatrix: { id: string; name: string; priceDiff: number; stock: number; isSoldOut: boolean }[];
}

interface Announcement {
    id: number;
    category: 'general' | 'event' | 'shipping';
    status: 'display' | 'stop';
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    regDate: string;
}

interface BundleGroup {
    id: number;
    name: string;
    calcMethod: 'min' | 'max' | 'item';
    carrier: string;
    regionType: '2' | '3';
    region2Fee: number;
    region3Fee: number;
    isDefault: boolean;
    useYn: 'Y' | 'N';
    regDate: string;
    editDate: string;
}

export type ProductSubTab = 'list' | 'register' | 'bulk' | 'catalog' | 'related' | 'announcements' | 'shipping';

export function ProductManagement({ 
    locale,
    activeSubTab,
    setActiveSubTab
}: { 
    locale: string;
    activeSubTab: ProductSubTab;
    setActiveSubTab: (tab: ProductSubTab) => void;
}) {
    // 2-Level Category Map Definition
    const categoryMap: Record<string, { label: string; sub: Record<string, string> }> = {
        yarn: {
            label: locale === 'ko' ? '털실 / 실' : 'Yarn',
            sub: {
                wool: locale === 'ko' ? '울 / 메리노울' : 'Wool & Merino',
                cashmere: locale === 'ko' ? '캐시미어 / 모헤어 / 알파카' : 'Cashmere & Mohair',
                cotton: locale === 'ko' ? '코튼 / 린넨 / 튜브사' : 'Cotton & Linen',
                silk: locale === 'ko' ? '실크 / 대나무 / 레이온' : 'Silk & Bamboo',
                acrylic: locale === 'ko' ? '아크릴 / 폴리 / 혼방사' : 'Acrylic & Blends',
                fabric: locale === 'ko' ? '패브릭얀 / 자이언트얀' : 'Fabric & Giant',
                special: locale === 'ko' ? '특수사 / 반짝이 / 인형실' : 'Special & Glitter'
            }
        },
        needle: {
            label: locale === 'ko' ? '뜨개 바늘' : 'Needles',
            sub: {
                interchangeable: locale === 'ko' ? '조립식 대바늘' : 'Interchangeable Needles',
                circular: locale === 'ko' ? '줄바늘 / 장바늘' : 'Circular & Straight',
                crochet: locale === 'ko' ? '일반 코바늘' : 'Crochet Hooks',
                special_needles: locale === 'ko' ? '특수 바늘 (돗바늘 등)' : 'Special Needles',
                sets: locale === 'ko' ? '바늘 세트' : 'Needle Sets',
                parts: locale === 'ko' ? '바늘 부속 부품' : 'Needle Parts & Cables'
            }
        },
        notions: {
            label: locale === 'ko' ? '부자재 / 도구' : 'Notions & Tools',
            sub: {
                closure: locale === 'ko' ? '단추 / 지퍼 / 프레임' : 'Closure & Frames',
                label: locale === 'ko' ? '라벨 / 와펜 / 자수' : 'Labels & Patches',
                strap: locale === 'ko' ? '가방 체인 / 핸들 / 바닥' : 'Straps & Handles',
                stitch_helper: locale === 'ko' ? '뜨개 보조 도구 (단수링)' : 'Stitch Helper',
                measure_tools: locale === 'ko' ? '가공 / 제도 도구 (줄자)' : 'Measurement & Blocking',
                fillers: locale === 'ko' ? '충전재 / 와이어 / 솜' : 'Stuffing & Wires',
                gift: locale === 'ko' ? '포장 소품' : 'Packaging & Gift'
            }
        },
        finished: {
            label: locale === 'ko' ? '완성품' : 'Finished Knitwear',
            sub: {
                women_clothing: locale === 'ko' ? '여성 의류' : 'Women Clothing',
                men_clothing: locale === 'ko' ? '남성 의류' : 'Men Clothing',
                kids_baby: locale === 'ko' ? '키즈 / 베이비' : 'Kids & Baby',
                accessories: locale === 'ko' ? '패션 잡화 (모자/장갑)' : 'Accessories',
                bags: locale === 'ko' ? '뜨개 가방 / 파우치' : 'Knit Bags',
                home_decor: locale === 'ko' ? '인테리어 / 홈데코' : 'Home & Living',
                keyrings_dolls: locale === 'ko' ? '키링 / 인형 / 장식' : 'Keyrings & Dolls'
            }
        },
        package: {
            label: locale === 'ko' ? 'DIY 패키지' : 'DIY Kits',
            sub: {
                clothing_kit: locale === 'ko' ? '의류 패키지' : 'Clothing Kits',
                bag_kit: locale === 'ko' ? '가방 패키지' : 'Bag Kits',
                props_kit: locale === 'ko' ? '소품 패키지' : 'Props Kits',
                doll_kit: locale === 'ko' ? '인형 / 키링 패키지' : 'Doll & Keyring Kits',
                beginner_kit: locale === 'ko' ? '초보자 / 이지니팅 패키지' : 'Beginner Easy Kits'
            }
        }
    };

    // Major Korean Shipping Carriers
    const carriers = [
        'CJ대한통운',
        '우체국택배',
        '한진택배',
        '롯데택배',
        '로젠택배',
        '경동택배',
        'GS25편의점택배',
        'CU편의점택배'
    ];

    // State Hooks
    const [products, setProducts] = useState<PhysicalProduct[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [bundleGroups, setBundleGroups] = useState<BundleGroup[]>([]);
    
    // Checkbox selection in product list
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMainCategory, setFilterMainCategory] = useState('all');
    const [filterSubCategory, setFilterSubCategory] = useState('all');

    // Single product registration form states
    const [regName, setRegName] = useState('');
    const [regMainCategory, setRegMainCategory] = useState('yarn');
    const [regSubCategory, setRegSubCategory] = useState('wool');
    const [regPrice, setRegPrice] = useState('');
    const [regDiscountPrice, setRegDiscountPrice] = useState('');
    const [regImageUrl, setRegImageUrl] = useState('');
    const [regShippingMethod, setRegShippingMethod] = useState<'courier' | 'direct' | 'pickup'>('courier');
    const [regShippingFeeType, setRegShippingFeeType] = useState<'free' | 'conditional' | 'paid'>('conditional');
    const [regBundleGroupId, setRegBundleGroupId] = useState<number>(0);
    const [regBasicShippingFee, setRegBasicShippingFee] = useState('3000');
    const [regFreeShippingThreshold, setRegFreeShippingThreshold] = useState('50000');
    const [regReturnShippingFee, setRegReturnShippingFee] = useState('3000');
    const [regExchangeShippingFee, setRegExchangeShippingFee] = useState('6000');
    
    // Smartstore-style fields
    const [regDeliveryType, setRegDeliveryType] = useState<'immediate' | 'custom' | 'reserve'>('immediate');
    const [regCustomDeliveryDays, setRegCustomDeliveryDays] = useState('3');
    const [regDiscountType, setRegDiscountType] = useState<'none' | 'won' | 'percent'>('none');
    const [regDiscountValue, setRegDiscountValue] = useState('0');
    const [regSubImages, setRegSubImages] = useState<string[]>([]);
    const [regDetailBlocks, setRegDetailBlocks] = useState<{ type: 'text' | 'image' | 'notice' | 'guide'; content: string }[]>([
        { type: 'text', content: '부드러운 감촉의 프리미엄 원사 제품입니다. 상세 설명을 입력해 보세요.' }
    ]);
    const [regOptionType, setRegOptionType] = useState<'simple' | 'combination'>('simple');
    const [regOptionNames, setRegOptionNames] = useState<string[]>(['색상']);
    const [regOptionValues, setRegOptionValues] = useState<string[]>(['화이트, 차콜']);
    const [regOptionMatrix, setRegOptionMatrix] = useState<{ id: string; name: string; priceDiff: number; stock: number; isSoldOut: boolean }[]>([]);
    
    const [regOptions, setRegOptions] = useState<{ name: string; stock: number }[]>([
        { name: '기본 옵션', stock: 50 }
    ]);

    // Bulk upload file ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Edit Product modal
    const [editingProduct, setEditingProduct] = useState<PhysicalProduct | null>(null);

    // Announcement Form & Modal states
    const [isAnnoModalOpen, setIsAnnoModalOpen] = useState(false);
    const [editingAnno, setEditingAnno] = useState<Announcement | null>(null);
    const [annoTitle, setAnnoTitle] = useState('');
    const [annoContent, setAnnoContent] = useState('');
    const [annoCategory, setAnnoCategory] = useState<'general' | 'event' | 'shipping'>('general');
    const [annoStatus, setAnnoStatus] = useState<'display' | 'stop'>('display');
    const [annoStartDate, setAnnoStartDate] = useState('2026-07-29');
    const [annoEndDate, setAnnoEndDate] = useState('2026-08-29');
    const [annoSearchTitle, setAnnoSearchTitle] = useState('');
    const [annoSearchCategory, setAnnoSearchCategory] = useState('all');
    const [annoSearchStatus, setAnnoSearchStatus] = useState('all');

    // Shipping Bundle Group Form & Modal states
    const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);
    const [editingBundle, setEditingBundle] = useState<BundleGroup | null>(null);
    const [bundleName, setBundleName] = useState('');
    const [bundleCalcMethod, setBundleCalcMethod] = useState<'min' | 'max' | 'item'>('min');
    const [bundleCarrier, setBundleCarrier] = useState('CJ대한통운');
    const [bundleRegionType, setBundleRegionType] = useState<'2' | '3'>('3');
    const [bundleRegion2Fee, setBundleRegion2Fee] = useState('3000');
    const [bundleRegion3Fee, setBundleRegion3Fee] = useState('5000');
    const [bundleUseYn, setBundleUseYn] = useState<'Y' | 'N'>('Y');
    const [bundleSearchName, setBundleSearchName] = useState('');

    // Load items from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // 1. Load Products
            const savedProds = localStorage.getItem('byknit_seller_products');
            if (savedProds) {
                try { setProducts(JSON.parse(savedProds)); } catch (e) {}
            } else {
                const initialProds: PhysicalProduct[] = [
                    { id: 10001, name: '파스텔 소프트 코튼 튜브사 (50g)', mainCategory: 'yarn', subCategory: 'cotton', price: 4500, discountPrice: 3800, status: 'selling', options: [{ name: '밀크화이트 / 얇음', stock: 120 }, { name: '소프트베이지 / 보통', stock: 80 }], imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=200', shippingMethod: 'courier', shippingFeeType: 'conditional', bundleGroupId: 53798328, basicShippingFee: 3000, freeShippingThreshold: 50000, returnShippingFee: 3000, exchangeShippingFee: 6000, deliveryType: 'immediate', customDeliveryDays: 0, discountType: 'won', discountValue: 700, subImages: ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=150'], detailBlocks: [{ type: 'text', content: '부드러운 촉감의 프리미엄 코튼 튜브사입니다. 초보자용 가방 및 티코스터 제작에 최적화되어 있습니다.' }, { type: 'guide', content: '미온수 손세탁 권장, 그늘 건조' }], optionType: 'simple', optionMatrix: [] },
                    { id: 10002, name: '유기농 파인 메리노 울 털실', mainCategory: 'yarn', subCategory: 'wool', price: 8900, status: 'selling', options: [{ name: '오트밀 베이지', stock: 15 }, { name: '차콜 그레이', stock: 0 }], imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc085ff8?q=80&w=200', shippingMethod: 'courier', shippingFeeType: 'conditional', bundleGroupId: 53798328, basicShippingFee: 3000, freeShippingThreshold: 50000, returnShippingFee: 3000, exchangeShippingFee: 6000, deliveryType: 'custom', customDeliveryDays: 3, discountType: 'none', discountValue: 0, subImages: [], detailBlocks: [{ type: 'text', content: '호주산 최고급 파인 메리노 울 100% 실입니다.' }], optionType: 'simple', optionMatrix: [] },
                    { id: 10003, name: '클래식 조립식 대바늘 세트 (11종)', mainCategory: 'needle', subCategory: 'interchangeable', price: 120000, discountPrice: 105000, status: 'selling', options: [{ name: '밤부 목재 팁 세트', stock: 12 }], imageUrl: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=200', shippingMethod: 'courier', shippingFeeType: 'free', bundleGroupId: 53798328, basicShippingFee: 0, freeShippingThreshold: undefined, returnShippingFee: 3000, exchangeShippingFee: 6000, deliveryType: 'immediate', customDeliveryDays: 0, discountType: 'won', discountValue: 15000, subImages: [], detailBlocks: [{ type: 'text', content: '대바늘 입문자부터 숙련자까지 사용할 수 있는 11종 세트입니다.' }], optionType: 'simple', optionMatrix: [] }
                ];
                setProducts(initialProds);
                localStorage.setItem('byknit_seller_products', JSON.stringify(initialProds));
            }

            // 2. Load Announcements
            const savedAnnos = localStorage.getItem('byknit_announcements');
            if (savedAnnos) {
                try { setAnnouncements(JSON.parse(savedAnnos)); } catch (e) {}
            } else {
                const initialAnnos: Announcement[] = [
                    { id: 5002231919, category: 'general', status: 'stop', title: '휴무일 안내 (추석 연휴 배송 및 CS 휴무 안내)', content: '안녕하세요. byKnit입니다. 추석 명절 연휴 기간 택배 배송 마감 및 재개 스케줄 관련하여 공지해 드립니다.', startDate: '2026-07-01', endDate: '2026-07-03', regDate: '2025-09-12' }
                ];
                setAnnouncements(initialAnnos);
                localStorage.setItem('byknit_announcements', JSON.stringify(initialAnnos));
            }

            // 3. Load Bundle Groups
            const savedBundles = localStorage.getItem('byknit_bundle_groups');
            if (savedBundles) {
                try {
                    const parsed = JSON.parse(savedBundles);
                    setBundleGroups(parsed);
                    if (parsed.length > 0) setRegBundleGroupId(parsed[0].id);
                } catch (e) {}
            } else {
                const initialBundles: BundleGroup[] = [
                    { id: 53798328, name: '기본 배송비 묶음그룹', calcMethod: 'min', carrier: 'CJ대한통운', regionType: '3', region2Fee: 3000, region3Fee: 5000, isDefault: true, useYn: 'Y', regDate: '2023-03-10', editDate: '-' }
                ];
                setBundleGroups(initialBundles);
                setRegBundleGroupId(initialBundles[0].id);
                localStorage.setItem('byknit_bundle_groups', JSON.stringify(initialBundles));
            }
        }
    }, []);

    // Sync helpers
    const saveProducts = (list: PhysicalProduct[]) => {
        setProducts(list);
        localStorage.setItem('byknit_seller_products', JSON.stringify(list));
    };

    const saveAnnouncements = (list: Announcement[]) => {
        setAnnouncements(list);
        localStorage.setItem('byknit_announcements', JSON.stringify(list));
    };

    const saveBundleGroups = (list: BundleGroup[]) => {
        setBundleGroups(list);
        localStorage.setItem('byknit_bundle_groups', JSON.stringify(list));
    };

    // Main category triggers subcategory resetting
    const handleRegMainCategoryChange = (mainCat: string) => {
        setRegMainCategory(mainCat);
        const subCats = Object.keys(categoryMap[mainCat].sub);
        setRegSubCategory(subCats[0]);
    };

    const handleAddRegOption = () => {
        setRegOptions([...regOptions, { name: '', stock: 10 }]);
    };

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

    // Cartesian product for Combination Options
    const handleApplyOptionMatrix = () => {
        const validNames = regOptionNames.filter(n => n.trim() !== '');
        const parsedValues = regOptionValues.map(v => v.split(',').map(item => item.trim()).filter(item => item !== ''));

        if (validNames.length === 0 || parsedValues.some(arr => arr.length === 0)) {
            alert(locale === 'ko' ? '옵션명과 옵션값을 모두 입력해 주세요.' : 'Please enter option names and values.');
            return;
        }

        // Cartesian product
        const cartesian = (arrays: string[][]): string[][] => {
            return arrays.reduce<string[][]>((a, b) => {
                return a.flatMap(d => b.map(e => [d, e].flat() as string[]));
            }, [[]]);
        };

        const combos = cartesian(parsedValues);
        const matrix = combos.map((combo, idx) => {
            const name = combo.join(' / ');
            return {
                id: `OPT-${Date.now()}-${idx}`,
                name,
                priceDiff: 0,
                stock: 100,
                isSoldOut: false
            };
        });

        setRegOptionMatrix(matrix);
        alert(locale === 'ko' ? `총 ${matrix.length}개의 옵션 품목 조합이 생성되었습니다. 아래 표에서 가격과 재고를 기입하세요.` : `${matrix.length} options generated.`);
    };

    // Blog-style block detail editor helpers
    const handleAddDetailBlock = (type: 'text' | 'image' | 'notice' | 'guide') => {
        const defaultContent = 
            type === 'text' ? '본문 내용을 입력하세요.' :
            type === 'image' ? 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600' :
            type === 'notice' ? '필독: 배송이 지연될 경우 알림 드립니다.' :
            '물세탁 금지, 중성세제 사용';
        setRegDetailBlocks([...regDetailBlocks, { type, content: defaultContent }]);
    };

    const handleRemoveDetailBlock = (index: number) => {
        setRegDetailBlocks(regDetailBlocks.filter((_, i) => i !== index));
    };

    const handleUpdateDetailBlock = (index: number, content: string) => {
        const updated = [...regDetailBlocks];
        updated[index].content = content;
        setRegDetailBlocks(updated);
    };

    // Save product
    const handleRegisterProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (!regName.trim() || !regPrice) {
            alert(locale === 'ko' ? '상품명과 판매가를 입력해 주세요.' : 'Please enter product name.');
            return;
        }

        // Calculate discount price if any
        let calculatedDiscountPrice: number | undefined = undefined;
        const basePrice = Number(regPrice);
        if (regDiscountType === 'won') {
            calculatedDiscountPrice = basePrice - Number(regDiscountValue);
        } else if (regDiscountType === 'percent') {
            calculatedDiscountPrice = basePrice - (basePrice * Number(regDiscountValue) / 100);
        }

        const newProd: PhysicalProduct = {
            id: Date.now(),
            name: regName,
            mainCategory: regMainCategory,
            subCategory: regSubCategory,
            price: basePrice,
            discountPrice: calculatedDiscountPrice,
            status: 'selling',
            options: regOptionType === 'simple' 
                ? regOptions.filter(opt => opt.name.trim() !== '')
                : regOptionMatrix.map(o => ({ name: o.name, stock: o.stock })),
            imageUrl: regImageUrl.trim() || 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=200',
            shippingMethod: regShippingMethod,
            shippingFeeType: regShippingFeeType,
            bundleGroupId: regBundleGroupId || 53798328,
            basicShippingFee: regShippingFeeType === 'free' ? 0 : Number(regBasicShippingFee),
            freeShippingThreshold: regShippingFeeType === 'conditional' ? Number(regFreeShippingThreshold) : undefined,
            returnShippingFee: Number(regReturnShippingFee),
            exchangeShippingFee: Number(regExchangeShippingFee),
            deliveryType: regDeliveryType,
            customDeliveryDays: regDeliveryType === 'custom' ? Number(regCustomDeliveryDays) : undefined,
            discountType: regDiscountType,
            discountValue: Number(regDiscountValue),
            subImages: regSubImages,
            detailBlocks: regDetailBlocks,
            optionType: regOptionType,
            optionMatrix: regOptionMatrix
        };

        saveProducts([newProd, ...products]);

        // Reset Form
        setRegName('');
        setRegMainCategory('yarn');
        setRegSubCategory('wool');
        setRegPrice('');
        setRegDiscountPrice('');
        setRegImageUrl('');
        setRegShippingMethod('courier');
        setRegShippingFeeType('conditional');
        setRegBasicShippingFee('3000');
        setRegFreeShippingThreshold('50000');
        setRegReturnShippingFee('3000');
        setRegExchangeShippingFee('6000');
        setRegDeliveryType('immediate');
        setRegCustomDeliveryDays('3');
        setRegDiscountType('none');
        setRegDiscountValue('0');
        setRegSubImages([]);
        setRegDetailBlocks([{ type: 'text', content: '부드러운 감촉의 프리미엄 원사 제품입니다.' }]);
        setRegOptionType('simple');
        setRegOptionNames(['색상']);
        setRegOptionValues(['화이트, 차콜']);
        setRegOptionMatrix([]);
        setRegOptions([{ name: '기본 옵션', stock: 50 }]);

        alert(locale === 'ko' ? '신규 상품이 등록되었습니다.' : 'Product registered successfully.');
        setActiveSubTab('list');
    };

    // Clone/Copy product row
    const handleCloneProduct = (product: PhysicalProduct) => {
        const cloned: PhysicalProduct = {
            ...product,
            id: Date.now(),
            name: `${product.name} - 복사본`,
            status: 'hidden' // Copy starts as hidden (판매준지/숨김)
        };
        saveProducts([cloned, ...products]);
        setEditingProduct(cloned); // Immediately open edit modal for the cloned product
        alert(locale === 'ko' ? '상품 정보가 복사되어 수정 화면으로 바로 연동됩니다.' : 'Product information cloned. Redirecting to edit screen.');
    };

    // Bulk deletion & state changes
    const handleBulkDelete = () => {
        if (selectedProductIds.length === 0) {
            alert(locale === 'ko' ? '선택된 상품이 없습니다.' : 'No products selected.');
            return;
        }
        if (confirm(locale === 'ko' ? `선택하신 ${selectedProductIds.length}개의 상품을 정말 삭제하시겠습니까?` : `Are you sure you want to delete ${selectedProductIds.length} products?`)) {
            const updated = products.filter(p => !selectedProductIds.includes(p.id));
            saveProducts(updated);
            setSelectedProductIds([]);
        }
    };

    const handleBulkStatusChange = (status: 'selling' | 'soldout' | 'hidden') => {
        if (selectedProductIds.length === 0) {
            alert(locale === 'ko' ? '선택된 상품이 없습니다.' : 'No products selected.');
            return;
        }
        const updated = products.map(p => selectedProductIds.includes(p.id) ? { ...p, status } : p);
        saveProducts(updated);
        setSelectedProductIds([]);
        alert(locale === 'ko' ? '선택하신 상품들의 전시 상태가 일괄 변경되었습니다.' : 'Selected products status changed.');
    };

    const handleStatusChange = (id: number, status: 'selling' | 'hidden' | 'soldout') => {
        const updated = products.map(p => p.id === id ? { ...p, status } : p);
        saveProducts(updated);
    };

    const handleDeleteProduct = (id: number) => {
        if (confirm(locale === 'ko' ? '정말로 이 상품을 삭제하시겠습니까?' : 'Delete this product?')) {
            const updated = products.filter(p => p.id !== id);
            saveProducts(updated);
        }
    };

    const handleFilterMainCatChange = (val: string) => {
        setFilterMainCategory(val);
        setFilterSubCategory('all');
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toString().includes(searchQuery);
        const matchesMain = filterMainCategory === 'all' || p.mainCategory === filterMainCategory;
        const matchesSub = filterSubCategory === 'all' || p.subCategory === filterSubCategory;
        return matchesSearch && matchesMain && matchesSub;
    });

    // Toggle select all
    const handleSelectAllProducts = (checked: boolean) => {
        if (checked) {
            setSelectedProductIds(filteredProducts.map(p => p.id));
        } else {
            setSelectedProductIds([]);
        }
    };

    const handleSelectProduct = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedProductIds([...selectedProductIds, id]);
        } else {
            setSelectedProductIds(selectedProductIds.filter(pid => pid !== id));
        }
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
            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
                if (cols.length < 3) continue;

                const name = cols[0];
                const mainCategoryInput = cols[1] || 'yarn';
                const subCategoryInput = cols[2] || 'wool';
                const price = Number(cols[3]) || 0;
                const discountPrice = cols[4] ? Number(cols[4]) : undefined;
                const optionsRaw = cols[5] || '';
                const imageUrl = cols[6] || 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=200';

                const mainCat = categoryMap[mainCategoryInput] ? mainCategoryInput : 'yarn';
                const subCat = categoryMap[mainCat].sub[subCategoryInput] ? subCategoryInput : Object.keys(categoryMap[mainCat].sub)[0];

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
                    mainCategory: mainCat,
                    subCategory: subCat,
                    price,
                    discountPrice,
                    status: 'selling',
                    options: options.length > 0 ? options : [{ name: '기본 옵션', stock: 100 }],
                    imageUrl,
                    shippingMethod: 'courier',
                    shippingFeeType: 'conditional',
                    bundleGroupId: bundleGroups[0]?.id || 53798328,
                    basicShippingFee: 3000,
                    freeShippingThreshold: 50000,
                    returnShippingFee: 3000,
                    exchangeShippingFee: 6000,
                    deliveryType: 'immediate',
                    discountType: discountPrice ? 'won' : 'none',
                    discountValue: discountPrice ? price - discountPrice : 0,
                    subImages: [],
                    detailBlocks: [{ type: 'text', content: '부드러운 감촉의 프리미엄 원사 제품입니다.' }],
                    optionType: 'simple',
                    optionMatrix: []
                });
            }

            saveProducts([...newUploadedProds, ...products]);
            alert(locale === 'ko' ? `총 ${newUploadedProds.length}개의 상품이 일괄 등록되었습니다.` : `${newUploadedProds.length} products uploaded.`);
            setActiveSubTab('list');
        };

        reader.readAsText(file, 'UTF-8');
        e.target.value = '';
    };

    // Download CSV template with 2-level categories instruction
    const handleDownloadTemplate = () => {
        const headers = '\ufeff상품명,대분류(yarn/needle/notions/finished/package),중분류,판매가,할인가,옵션리스트(옵션명1:재고1|옵션명2:재고2),이미지URL\n';
        const sampleRow1 = '"파스텔 소프트 울 털실","yarn","wool",8900,7900,"화이트:100|핑크:80|베이지:50","https://images.unsplash.com/photo-1584992236310-6edddc085ff8"\n';
        const sampleRow2 = '"여성 캐시미어 루즈핏 가디건","finished","women_clothing",139000,129000,"크림:10|그레이:5","https://images.unsplash.com/photo-1574169208507-84376144848b"\n';
        const blob = new Blob([headers + sampleRow1 + sampleRow2], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'byknit_product_bulk_template.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Product Announcement Handlers
    const handleOpenAnnoModal = (anno?: Announcement) => {
        if (anno) {
            setEditingAnno(anno);
            setAnnoTitle(anno.title);
            setAnnoContent(anno.content);
            setAnnoCategory(anno.category);
            setAnnoStatus(anno.status);
            setAnnoStartDate(anno.startDate);
            setAnnoEndDate(anno.endDate);
        } else {
            setEditingAnno(null);
            setAnnoTitle('');
            setAnnoContent('');
            setAnnoCategory('general');
            setAnnoStatus('display');
            setAnnoStartDate('2026-07-29');
            setAnnoEndDate('2026-08-29');
        }
        setIsAnnoModalOpen(true);
    };

    const handleSaveAnnouncement = (e: React.FormEvent) => {
        e.preventDefault();
        if (!annoTitle.trim()) return;

        if (editingAnno) {
            // Edit
            const updated = announcements.map(a => a.id === editingAnno.id ? {
                ...a,
                title: annoTitle,
                content: annoContent,
                category: annoCategory,
                status: annoStatus,
                startDate: annoStartDate,
                endDate: annoEndDate
            } : a);
            saveAnnouncements(updated);
            alert('공지사항이 수정되었습니다.');
        } else {
            // Add
            const newAnno: Announcement = {
                id: Date.now(),
                category: annoCategory,
                status: annoStatus,
                title: annoTitle,
                content: annoContent,
                startDate: annoStartDate,
                endDate: annoEndDate,
                regDate: new Date().toISOString().split('T')[0]
            };
            saveAnnouncements([newAnno, ...announcements]);
            alert('새 공지사항이 성공적으로 등록되었습니다.');
        }
        setIsAnnoModalOpen(false);
    };

    const handleDeleteAnno = (id: number) => {
        if (confirm('이 공지사항을 삭제하시겠습니까?')) {
            saveAnnouncements(announcements.filter(a => a.id !== id));
        }
    };

    const filteredAnnouncements = announcements.filter(a => {
        const matchesTitle = a.title.toLowerCase().includes(annoSearchTitle.toLowerCase());
        const matchesCategory = annoSearchCategory === 'all' || a.category === annoSearchCategory;
        const matchesStatus = annoSearchStatus === 'all' || a.status === annoSearchStatus;
        return matchesTitle && matchesCategory && matchesStatus;
    });

    // Shipping Bundle Group Handlers
    const handleOpenBundleModal = (bundle?: BundleGroup) => {
        if (bundle) {
            setEditingBundle(bundle);
            setBundleName(bundle.name);
            setBundleCalcMethod(bundle.calcMethod);
            setBundleCarrier(bundle.carrier);
            setBundleRegionType(bundle.regionType);
            setBundleRegion2Fee(bundle.region2Fee.toString());
            setBundleRegion3Fee(bundle.region3Fee.toString());
            setBundleUseYn(bundle.useYn);
        } else {
            setEditingBundle(null);
            setBundleName('');
            setBundleCalcMethod('min');
            setBundleCarrier('CJ대한통운');
            setBundleRegionType('3');
            setBundleRegion2Fee('3000');
            setBundleRegion3Fee('5000');
            setBundleUseYn('Y');
        }
        setIsBundleModalOpen(true);
    };

    const handleSaveBundleGroup = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bundleName.trim()) return;

        if (editingBundle) {
            const updated = bundleGroups.map(b => b.id === editingBundle.id ? {
                ...b,
                name: bundleName,
                calcMethod: bundleCalcMethod,
                carrier: bundleCarrier,
                regionType: bundleRegionType,
                region2Fee: Number(bundleRegion2Fee),
                region3Fee: Number(bundleRegion3Fee),
                useYn: bundleUseYn,
                editDate: new Date().toISOString().split('T')[0]
            } : b);
            saveBundleGroups(updated);
            alert('배송비 묶음그룹 설정이 저장되었습니다.');
        } else {
            const newBundle: BundleGroup = {
                id: Date.now(),
                name: bundleName,
                calcMethod: bundleCalcMethod,
                carrier: bundleCarrier,
                regionType: bundleRegionType,
                region2Fee: Number(bundleRegion2Fee),
                region3Fee: Number(bundleRegion3Fee),
                isDefault: false,
                useYn: bundleUseYn,
                regDate: new Date().toISOString().split('T')[0],
                editDate: '-'
            };
            saveBundleGroups([...bundleGroups, newBundle]);
            alert('신규 배송비 묶음그룹이 추가되었습니다.');
        }
        setIsBundleModalOpen(false);
    };

    const handleDeleteBundle = (id: number) => {
        const bundle = bundleGroups.find(b => b.id === id);
        if (bundle?.isDefault) {
            alert('기본 배송비 묶음그룹은 삭제할 수 없습니다.');
            return;
        }
        if (confirm('이 배송비 묶음그룹을 삭제하시겠습니까?')) {
            saveBundleGroups(bundleGroups.filter(b => b.id !== id));
        }
    };

    const filteredBundleGroups = bundleGroups.filter(b => {
        return b.name.toLowerCase().includes(bundleSearchName.toLowerCase());
    });

    return (
        <div className="space-y-6 text-stone-700 animate-fadeIn font-sans">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900">
                        {locale === 'ko' ? '상품 관리' : 'Product Console'}
                    </h1>
                    <p className="text-stone-500 text-base mt-1">
                        {locale === 'ko' 
                            ? '실물 상품 등록 및 수정, 2단계 분류 검색, 공지사항 지정 및 택배 배송비 묶음그룹을 스마트스토어 실무 격자 구조로 관리합니다.' 
                            : 'Configure 2-level categories, announcements, shipping bundles, and product options.'}
                    </p>
                </div>
            </div>

            {/* 1. Universal 상세 필터 (Only visible when list tab is active) */}
            {activeSubTab === 'list' && (
                <div className="bg-white p-6 rounded-3xl border border-stone-150 shadow-soft space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2 text-stone-900 border-b border-stone-50 pb-2.5">
                        <FolderTree size={16} className="text-blue-500" />
                        <span className="text-sm font-bold">{locale === 'ko' ? '상세 필터' : 'Detailed Filter'}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Main Category Select */}
                        <div className="space-y-1">
                            <label className="text-[10.5px] font-bold text-stone-700 block">{locale === 'ko' ? '대분류 선택' : 'Large Category'}</label>
                            <select
                                value={filterMainCategory}
                                onChange={(e) => handleFilterMainCatChange(e.target.value)}
                                className="w-full bg-stone-50 border border-stone-250 rounded-xl px-3 py-2 text-sm font-bold text-stone-850 outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="all">{locale === 'ko' ? '전체 대분류' : 'All Large Categories'}</option>
                                {Object.entries(categoryMap).map(([key, data]) => (
                                    <option key={key} value={key}>{data.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sub Category Select (Dependent) */}
                        <div className="space-y-1">
                            <label className="text-[10.5px] font-bold text-stone-700 block">{locale === 'ko' ? '중분류 선택' : 'Medium Category'}</label>
                            <select
                                value={filterSubCategory}
                                onChange={(e) => setFilterSubCategory(e.target.value)}
                                disabled={filterMainCategory === 'all'}
                                className={`w-full border rounded-xl px-3 py-2 text-sm font-bold outline-none ${
                                    filterMainCategory === 'all'
                                        ? 'bg-stone-100 text-stone-400 border-stone-200'
                                        : 'bg-stone-50 border-stone-250 focus:bg-white text-stone-850 focus:ring-1 focus:ring-blue-500'
                                }`}
                            >
                                <option value="all">{locale === 'ko' ? '전체 중분류' : 'All Medium Categories'}</option>
                                {filterMainCategory !== 'all' && 
                                    Object.entries(categoryMap[filterMainCategory].sub).map(([key, val]) => (
                                        <option key={key} value={key}>{val}</option>
                                    ))
                                }
                            </select>
                        </div>

                        {/* Text Search */}
                        <div className="space-y-1">
                            <label className="text-[10.5px] font-bold text-stone-700 block">{locale === 'ko' ? '상품명 및 코드 검색' : 'Search Term'}</label>
                            <div className="relative">
                                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input 
                                    type="text" 
                                    placeholder={locale === 'ko' ? '상품명 또는 코드를 입력해 주세요.' : 'Search product name/code...'}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 pr-3 py-2 bg-stone-50 border border-stone-250 rounded-xl text-sm outline-none focus:bg-white text-stone-850 font-bold w-full focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}



            {/* ---------------- 1. 상품조회 및 수정 탭 ---------------- */}
            {activeSubTab === 'list' && (
                <div className="space-y-6 animate-fadeIn">
                    
                    {/* Naver Smartstore Summary Counter Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                        <div className="bg-white p-3.5 rounded-2xl border border-stone-150 shadow-soft text-center space-y-1">
                            <span className="text-xs text-stone-400 font-bold block">전체 상품</span>
                            <span className="text-base font-bold text-stone-900">{products.length}건</span>
                        </div>
                        <div className="bg-white p-3.5 rounded-2xl border border-stone-150 shadow-soft text-center space-y-1">
                            <span className="text-xs text-stone-400 font-bold block">판매대기</span>
                            <span className="text-base font-bold text-stone-400">0건</span>
                        </div>
                        <div className="bg-white p-3.5 rounded-2xl border border-stone-150 shadow-soft text-center space-y-1 bg-emerald-50/20 border-emerald-100">
                            <span className="text-xs text-emerald-600/80 font-bold block">판매중</span>
                            <span className="text-base font-bold text-emerald-600">{products.filter(p => p.status === 'selling').length}건</span>
                        </div>
                        <div className="bg-white p-3.5 rounded-2xl border border-stone-150 shadow-soft text-center space-y-1 bg-rose-50/20 border-rose-100">
                            <span className="text-xs text-rose-500/85 font-bold block">품절</span>
                            <span className="text-base font-bold text-rose-500">{products.filter(p => p.status === 'soldout').length}건</span>
                        </div>
                        <div className="bg-white p-3.5 rounded-2xl border border-stone-150 shadow-soft text-center space-y-1">
                            <span className="text-xs text-stone-400 font-bold block">승인대기</span>
                            <span className="text-base font-bold text-stone-400">0건</span>
                        </div>
                        <div className="bg-white p-3.5 rounded-2xl border border-stone-150 shadow-soft text-center space-y-1">
                            <span className="text-xs text-stone-400 font-bold block">판매중지(숨김)</span>
                            <span className="text-base font-bold text-stone-600">{products.filter(p => p.status === 'hidden').length}건</span>
                        </div>
                    </div>

                    {/* Bulk Actions Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-150 shadow-soft">
                        <span className="text-sm font-bold text-stone-500 pl-2">
                            선택된 상품: <span className="text-blue-600 font-bold">{selectedProductIds.length}</span>개
                        </span>
                        
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                                onClick={() => handleBulkStatusChange('selling')}
                                className="px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg text-xs font-bold transition-all"
                            >
                                판매중 전환
                            </button>
                            <button
                                onClick={() => handleBulkStatusChange('soldout')}
                                className="px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg text-xs font-bold transition-all"
                            >
                                품절 처리
                            </button>
                            <button
                                onClick={() => handleBulkStatusChange('hidden')}
                                className="px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg text-xs font-bold transition-all"
                            >
                                숨김(판매중지) 처리
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                            >
                                <Trash2 size={10} />
                                <span>선택 삭제</span>
                            </button>
                        </div>
                    </div>

                    {/* Product Listing Table */}
                    <div className="bg-white rounded-3xl border border-stone-150 shadow-soft overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm min-w-[1050px]">
                                <thead>
                                    <tr className="bg-stone-100 text-stone-600 font-bold border-b border-stone-200">
                                        <th className="p-3.5 text-center w-12 border-r border-stone-200">
                                            <input 
                                                type="checkbox"
                                                checked={filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length}
                                                onChange={(e) => handleSelectAllProducts(e.target.checked)}
                                                className="rounded text-blue-600 focus:ring-blue-500"
                                            />
                                        </th>
                                        <th className="p-3.5 border-r border-stone-200 text-center w-20">{locale === 'ko' ? '이미지' : 'Image'}</th>
                                        <th className="p-3.5 border-r border-stone-200">{locale === 'ko' ? '상품명 및 코드' : 'Product & ID'}</th>
                                        <th className="p-3.5 border-r border-stone-200 w-44">{locale === 'ko' ? '카테고리 상세 경로' : 'Category Path'}</th>
                                        <th className="p-3.5 border-r border-stone-200 w-36">{locale === 'ko' ? '택배 및 배송 정보' : 'Shipping Info'}</th>
                                        <th className="p-3.5 border-r border-stone-200 text-right w-28">{locale === 'ko' ? '판매가 (할인가)' : 'Price'}</th>
                                        <th className="p-3.5 border-r border-stone-200 w-40">{locale === 'ko' ? '옵션 및 재고현황' : 'Options & Stocks'}</th>
                                        <th className="p-3.5 border-r border-stone-200 text-center w-24">{locale === 'ko' ? '판매상태' : 'Status'}</th>
                                        <th className="p-3.5 text-center w-28">{locale === 'ko' ? '기능' : 'Actions'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-200 font-semibold text-stone-700">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((p) => {
                                            const totalStock = p.options.reduce((sum, opt) => sum + opt.stock, 0);
                                            const mainLabel = categoryMap[p.mainCategory]?.label || p.mainCategory;
                                            const subLabel = categoryMap[p.mainCategory]?.sub[p.subCategory] || p.subCategory;
                                            const linkedBundle = bundleGroups.find(b => b.id === p.bundleGroupId);

                                            return (
                                                <tr key={p.id} className={`hover:bg-stone-50/50 transition-colors ${selectedProductIds.includes(p.id) ? 'bg-blue-50/10' : ''}`}>
                                                    {/* Checkbox */}
                                                    <td className="p-3.5 text-center border-r border-stone-200">
                                                        <input 
                                                            type="checkbox"
                                                            checked={selectedProductIds.includes(p.id)}
                                                            onChange={(e) => handleSelectProduct(p.id, e.target.checked)}
                                                            className="rounded text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </td>

                                                    {/* Image */}
                                                    <td className="p-3.5 border-r border-stone-200 text-center">
                                                        <img 
                                                            src={p.imageUrl} 
                                                            alt={p.name}
                                                            className="w-10 h-10 object-cover rounded-xl mx-auto border border-stone-100 shadow-inner-soft"
                                                        />
                                                    </td>

                                                    {/* Name & ID */}
                                                    <td className="p-3.5 border-r border-stone-200 space-y-1">
                                                        <div className="font-bold text-stone-900 text-base leading-snug">{p.name}</div>
                                                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                                            <span className="text-xs text-stone-400 font-mono">ID: {p.id}</span>
                                                            {(!p.deliveryType || p.deliveryType === 'immediate') && (
                                                                <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold rounded">바로배송</span>
                                                            )}
                                                            {p.deliveryType === 'custom' && (
                                                                <span className="px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded">주문제작 ({p.customDeliveryDays || 3}일)</span>
                                                            )}
                                                            {p.deliveryType === 'reserve' && (
                                                                <span className="px-1.5 py-0.5 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold rounded">예약발송</span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Category Path */}
                                                    <td className="p-3.5 border-r border-stone-200">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="inline-flex max-w-fit items-center px-2 py-0.5 bg-stone-50 border border-stone-150 text-xs font-bold text-stone-500 rounded-md">
                                                                {mainLabel}
                                                            </span>
                                                            <span className="text-sm text-stone-850 font-bold pl-1">
                                                                ↳ {subLabel}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Shipping details */}
                                                    <td className="p-3.5 border-r border-stone-200 space-y-1.5 text-xs">
                                                        <div className="flex items-center gap-1 text-stone-800">
                                                            <Truck size={10} className="text-[#8FBC8F]" />
                                                            <span className="font-bold">
                                                                {p.shippingMethod === 'courier' && '택배/포장배송'}
                                                                {p.shippingMethod === 'direct' && '직접배송(퀵)'}
                                                                {p.shippingMethod === 'pickup' && '매장 직접수령'}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-stone-450 font-semibold leading-relaxed">
                                                            {p.shippingFeeType === 'free' && '무료배송'}
                                                            {p.shippingFeeType === 'paid' && `기본 ₩${(p.basicShippingFee || 0).toLocaleString()}`}
                                                            {p.shippingFeeType === 'conditional' && (
                                                                <>
                                                                    <span>기본 ₩${(p.basicShippingFee || 0).toLocaleString()}</span>
                                                                    <span className="block text-[8px] text-[#A0522D] font-bold">
                                                                        (₩${(p.freeShippingThreshold || 0).toLocaleString()} 이상 무료)
                                                                    </span>
                                                                </>
                                                            )}
                                                            <span className="block text-[8px] text-stone-400 mt-0.5">
                                                                반품 ₩${(p.returnShippingFee || 0).toLocaleString()} / 교환 ₩${(p.exchangeShippingFee || 0).toLocaleString()}
                                                            </span>
                                                            {linkedBundle && (
                                                                <span className="block font-bold text-blue-600 mt-0.5">
                                                                    ({linkedBundle.name} - {linkedBundle.carrier})
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Price */}
                                                    <td className="p-3.5 border-r border-stone-200 text-right space-y-0.5">
                                                        {p.discountPrice ? (
                                                            <>
                                                                <div className="text-stone-300 line-through text-xs">₩{p.price.toLocaleString()}</div>
                                                                <div className="text-blue-600 font-bold text-sm">₩{p.discountPrice.toLocaleString()}</div>
                                                            </>
                                                        ) : (
                                                            <div className="font-bold text-sm text-stone-900">₩{p.price.toLocaleString()}</div>
                                                        )}
                                                    </td>

                                                    {/* Options */}
                                                    <td className="p-3.5 border-r border-stone-200 text-sm space-y-1 text-stone-500">
                                                        <div className="font-bold text-stone-700 text-xs mb-1 flex items-center justify-between">
                                                            <span>옵션: {p.options.length}개</span>
                                                            <span className={`px-1.5 py-0.5 rounded text-xs ${
                                                                totalStock <= 10 
                                                                    ? 'bg-rose-50 text-rose-500 border border-rose-100 font-bold animate-pulse' 
                                                                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold'
                                                            }`}>
                                                                재고: {totalStock}개 {totalStock <= 10 && '품절임박'}
                                                            </span>
                                                        </div>
                                                        {p.options.slice(0, 2).map((opt, i) => (
                                                            <div key={i} className="flex justify-between text-xs bg-stone-50/50 p-1 rounded border border-stone-100/50">
                                                                <span className="truncate max-w-[125px] font-medium">{opt.name}</span>
                                                                <span className={opt.stock <= 5 ? 'text-rose-500 font-bold' : 'font-bold text-stone-600'}>
                                                                    {opt.stock}개
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </td>

                                                    {/* Status Selector */}
                                                    <td className="p-3.5 border-r border-stone-200 text-center">
                                                        <select
                                                            value={p.status}
                                                            onChange={(e) => handleStatusChange(p.id, e.target.value as any)}
                                                            className={`bg-white border border-stone-300 rounded-lg p-1.5 text-xs font-bold outline-none cursor-pointer ${
                                                                p.status === 'selling' 
                                                                    ? 'text-emerald-600 border-emerald-200 bg-emerald-50/10'
                                                                    : p.status === 'hidden'
                                                                    ? 'text-stone-400 border-stone-200 bg-stone-50/35'
                                                                    : 'text-rose-500 border-rose-200 bg-rose-50/10'
                                                            }`}
                                                        >
                                                            <option value="selling">{locale === 'ko' ? '판매 중' : 'Selling'}</option>
                                                            <option value="soldout">{locale === 'ko' ? '품절' : 'Sold Out'}</option>
                                                            <option value="hidden">{locale === 'ko' ? '숨김' : 'Hidden'}</option>
                                                        </select>
                                                    </td>

                                                    {/* Action Buttons: Copy, Edit, Delete */}
                                                    <td className="p-3.5 text-center flex items-center justify-center gap-1.5">
                                                        <button 
                                                            onClick={() => handleCloneProduct(p)}
                                                            className="px-2 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold rounded-lg flex items-center gap-0.5 hover:bg-emerald-100 transition-colors"
                                                            title="복사"
                                                        >
                                                            <Copy size={10} />
                                                            <span>복사</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => setEditingProduct(p)}
                                                            className="p-1.5 text-stone-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                            title="수정"
                                                        >
                                                            <Edit size={12} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteProduct(p.id)}
                                                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                            title="삭제"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={9} className="p-20 text-center text-stone-400 font-bold">
                                                {locale === 'ko' ? '검색 필터 조건에 부합하는 상품이 없습니다.' : 'No products match search criteria.'}
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
                <form onSubmit={handleRegisterProduct} className="bg-stone-50/20 p-6 md:p-8 rounded-3xl border border-stone-150 shadow-soft space-y-8 animate-fadeIn">
                    <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <PlusCircle className="text-emerald-600" size={22} />
                            <div>
                                <span className="text-lg font-bold text-stone-900">{locale === 'ko' ? '스마트스토어형 상품 등록 에디터' : 'Smartstore Product Editor'}</span>
                                <span className="block text-xs text-stone-400 font-bold mt-0.5">네이버 스마트스토어 실무 규격에 최적화된 상품 세부 설정</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setActiveSubTab('list')}
                            className="px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 rounded-xl text-sm font-bold transition-all shadow-xs"
                        >
                            목록으로 돌아가기
                        </button>
                    </div>

                    {/* Section 1: 카테고리 & 상품명 */}
                    <div className="bg-white p-6 rounded-2xl border border-stone-150 shadow-soft space-y-5">
                        <span className="text-sm font-bold text-stone-900 border-l-4 border-emerald-600 pl-2 block">
                            SECTION 1. 카테고리 및 상품명 설정
                        </span>
                        
                        {/* Category search & select */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">대분류 카테고리 *</label>
                                <select 
                                    value={regMainCategory}
                                    onChange={(e) => handleRegMainCategoryChange(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-sm outline-none focus:bg-white text-stone-700 font-bold"
                                >
                                    {Object.entries(categoryMap).map(([key, data]) => (
                                        <option key={key} value={key}>{data.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">중분류 카테고리 *</label>
                                <select 
                                    value={regSubCategory}
                                    onChange={(e) => setRegSubCategory(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-sm outline-none focus:bg-white text-stone-700 font-bold"
                                >
                                    {Object.entries(categoryMap[regMainCategory].sub).map(([key, val]) => (
                                        <option key={key} value={key}>{val}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">카테고리명 빠른 검색/매칭</label>
                                <input 
                                    type="text" 
                                    placeholder="예: 울, 면, 세트, 완성품"
                                    onChange={(e) => {
                                        const query = e.target.value.trim().toLowerCase();
                                        if (!query) return;
                                        // Match large/medium
                                        for (const [largeKey, largeVal] of Object.entries(categoryMap)) {
                                            if (largeVal.label.toLowerCase().includes(query)) {
                                                handleRegMainCategoryChange(largeKey);
                                                break;
                                            }
                                            for (const [subKey, subVal] of Object.entries(largeVal.sub)) {
                                                if (subVal.toLowerCase().includes(query)) {
                                                    setRegMainCategory(largeKey);
                                                    setRegSubCategory(subKey);
                                                    break;
                                                }
                                            }
                                        }
                                    }}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 text-stone-700 font-bold"
                                />
                            </div>
                        </div>

                        {/* Title with letter count */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-xs font-bold text-stone-700">상품명 (검색 키워드 정합성 가이드) *</label>
                                <span className={`text-xs font-mono font-bold ${regName.length > 100 ? 'text-rose-500 font-bold animate-pulse' : 'text-stone-400'}`}>
                                    {regName.length}/100자
                                </span>
                            </div>
                            <input 
                                type="text" 
                                required
                                maxLength={100}
                                placeholder="브랜드명 + 핵심속성 + 상품 키워드 조합을 권장합니다. (예: 바이니트 천연 유기농 메리노 울 털실)"
                                value={regName}
                                onChange={(e) => setRegName(e.target.value)}
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 text-stone-850 font-bold"
                            />
                            {regName.length > 80 && (
                                <span className="text-xs text-amber-600 font-bold mt-1 block">
                                    ※ 상품명이 80자를 초과하면 스마트스토어 검색 노출 패널티가 발생할 수 있습니다.
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Section 2: 판매가 & 즉시할인 계산기 */}
                    <div className="bg-white p-6 rounded-2xl border border-stone-150 shadow-soft space-y-5">
                        <span className="text-sm font-bold text-stone-900 border-l-4 border-emerald-600 pl-2 block">
                            SECTION 2. 판매가 및 즉시할인 설정
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">기본 판매가 (정가, 원) *</label>
                                <input 
                                    type="number" 
                                    required
                                    placeholder="10000"
                                    value={regPrice}
                                    onChange={(e) => setRegPrice(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm outline-none focus:bg-white text-stone-800 font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">할인 유형 설정</label>
                                <select 
                                    value={regDiscountType}
                                    onChange={(e) => {
                                        setRegDiscountType(e.target.value as any);
                                        setRegDiscountValue('0');
                                    }}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm outline-none focus:bg-white text-stone-700 font-bold"
                                >
                                    <option value="none">할인 설정 없음</option>
                                    <option value="won">정액 할인 (원)</option>
                                    <option value="percent">정율 할인 (%)</option>
                                </select>
                            </div>
                            {regDiscountType !== 'none' && (
                                <div className="animate-fadeIn">
                                    <label className="block text-xs font-bold text-stone-700 mb-1">
                                        {regDiscountType === 'won' ? '할인 금액 (원)' : '할인 비율 (%)'} *
                                    </label>
                                    <input 
                                        type="number" 
                                        required
                                        placeholder={regDiscountType === 'won' ? '1000' : '10'}
                                        value={regDiscountValue}
                                        onChange={(e) => setRegDiscountValue(e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm outline-none focus:bg-white text-stone-850 font-bold"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Real-time calculated final price */}
                        {Number(regPrice) > 0 && regDiscountType !== 'none' && (
                            <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between text-sm font-bold text-emerald-800 animate-fadeIn">
                                <span>할인 적용 최종 소비자 결제액:</span>
                                <span className="text-base font-bold text-emerald-600">
                                    ₩{(
                                        regDiscountType === 'won'
                                            ? Math.max(0, Number(regPrice) - Number(regDiscountValue))
                                            : Math.max(0, Number(regPrice) - (Number(regPrice) * Number(regDiscountValue) / 100))
                                    ).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Section 3: 대표 및 추가 이미지 */}
                    <div className="bg-white p-6 rounded-2xl border border-stone-150 shadow-soft space-y-5">
                        <span className="text-sm font-bold text-stone-900 border-l-4 border-emerald-600 pl-2 block">
                            SECTION 3. 대표 이미지 및 썸네일 갤러리
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">대표 썸네일 이미지 파일 업로드 *</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setRegImageUrl(reader.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-sm outline-none text-stone-700 font-bold file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#E8F0E8] file:text-[#556B2F] hover:file:bg-[#D0E0D0] cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">추가 썸네일 이미지 파일 다중 업로드</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        const newUrls: string[] = [];
                                        files.forEach(file => {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                newUrls.push(reader.result as string);
                                                if (newUrls.length === files.length) {
                                                    setRegSubImages(prev => [...prev, ...newUrls]);
                                                }
                                            };
                                            reader.readAsDataURL(file);
                                        });
                                    }}
                                    className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-sm outline-none text-stone-700 font-bold file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Thumbnail Previews */}
                        {(regImageUrl || regSubImages.length > 0) && (
                            <div className="space-y-2">
                                <span className="text-xs font-bold text-stone-400 block">썸네일 이미지 미리보기</span>
                                <div className="flex gap-2 flex-wrap">
                                    {regImageUrl && (
                                        <div className="relative group rounded-xl border border-stone-200 overflow-hidden bg-stone-50 w-16 h-16 shadow-soft">
                                            <img src={regImageUrl} alt="Main" className="w-full h-full object-cover" />
                                            <span className="absolute bottom-0 inset-x-0 bg-stone-900/60 text-white text-[8px] font-bold text-center py-0.5">대표</span>
                                        </div>
                                    )}
                                    {regSubImages.map((img, i) => (
                                        <div key={i} className="relative rounded-xl border border-stone-200 overflow-hidden bg-stone-50 w-16 h-16 shadow-soft">
                                            <img src={img} alt={`Sub ${i}`} className="w-full h-full object-cover" />
                                            <span className="absolute bottom-0 inset-x-0 bg-stone-700/60 text-white text-[8px] font-bold text-center py-0.5">추가 {i+1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 4: 발송유형 & 택배배송 정보 */}
                    <div className="bg-white p-6 rounded-2xl border border-stone-150 shadow-soft space-y-5">
                        <span className="text-sm font-bold text-stone-900 border-l-4 border-emerald-600 pl-2 block">
                            SECTION 4. 발송 속성 (바로 배송 vs 주문 제작) 및 배송 조건
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-stone-50 p-4 rounded-2xl border border-stone-150">
                            {/* Delivery Options */}
                            <div className="space-y-4">
                                <span className="text-sm font-bold text-stone-800 block">발송 희망일 / 제작 유형</span>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['immediate', 'custom', 'reserve'] as const).map(dt => (
                                        <button
                                            key={dt}
                                            type="button"
                                            onClick={() => setRegDeliveryType(dt)}
                                            className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                                                regDeliveryType === dt
                                                    ? 'bg-emerald-600 border-emerald-700 text-white shadow-soft'
                                                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                            }`}
                                        >
                                            {dt === 'immediate' && '바로 배송'}
                                            {dt === 'custom' && '주문 제작'}
                                            {dt === 'reserve' && '예약 발송'}
                                        </button>
                                    ))}
                                </div>

                                {regDeliveryType === 'custom' && (
                                    <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1.5 animate-fadeIn">
                                        <label className="block text-xs font-bold text-stone-700">핸드메이드 주문 제작 기간 설정 (영업일 기준)</label>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number"
                                                value={regCustomDeliveryDays}
                                                onChange={(e) => setRegCustomDeliveryDays(e.target.value)}
                                                className="w-16 bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-sm font-bold text-center"
                                            />
                                            <span className="text-sm font-bold text-stone-600">일 이내에 제작 완료 후 발송</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Shipping Details */}
                            <div className="space-y-4">
                                <span className="text-sm font-bold text-stone-800 block">택배 배송비 상세 조건</span>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-0.5">배송 수단</label>
                                        <select
                                            value={regShippingMethod}
                                            onChange={(e) => setRegShippingMethod(e.target.value as any)}
                                            className="w-full bg-white border border-stone-200 rounded-lg p-1.5 font-bold"
                                        >
                                            <option value="courier">택배/포장배송</option>
                                            <option value="direct">직접배송(화물/퀵)</option>
                                            <option value="pickup">매장 방문수령</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-0.5">배송비 구분</label>
                                        <select
                                            value={regShippingFeeType}
                                            onChange={(e) => setRegShippingFeeType(e.target.value as any)}
                                            className="w-full bg-white border border-stone-200 rounded-lg p-1.5 font-bold"
                                        >
                                            <option value="free">무료배송</option>
                                            <option value="conditional">조건부 무료</option>
                                            <option value="paid">유료배송</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CS Fees & Shipping bundle */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                            {regShippingFeeType !== 'free' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">기본 배송비 (원)</label>
                                        <input 
                                            type="number"
                                            value={regBasicShippingFee}
                                            onChange={(e) => setRegBasicShippingFee(e.target.value)}
                                            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold outline-none"
                                        />
                                    </div>
                                    {regShippingFeeType === 'conditional' && (
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">무료 조건 금액 (원)</label>
                                            <input 
                                                type="number"
                                                value={regFreeShippingThreshold}
                                                onChange={(e) => setRegFreeShippingThreshold(e.target.value)}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold outline-none"
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">반품 배송비 (편도, 원)</label>
                                <input 
                                    type="number"
                                    value={regReturnShippingFee}
                                    onChange={(e) => setRegReturnShippingFee(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">교환 배송비 (왕복, 원)</label>
                                <input 
                                    type="number"
                                    value={regExchangeShippingFee}
                                    onChange={(e) => setRegExchangeShippingFee(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1">연동할 배송비 묶음그룹</label>
                            <select
                                value={regBundleGroupId}
                                onChange={(e) => setRegBundleGroupId(Number(e.target.value))}
                                className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-sm font-bold text-stone-700"
                            >
                                {bundleGroups.map(bg => (
                                    <option key={bg.id} value={bg.id}>
                                        {bg.name} (택배사: {bg.carrier} / {bg.regionType}권역배송)
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Section 5: 스마트스토어형 옵션 설정 */}
                    <div className="bg-white p-6 rounded-2xl border border-stone-150 shadow-soft space-y-5">
                        <span className="text-sm font-bold text-stone-900 border-l-4 border-emerald-600 pl-2 block">
                            SECTION 5. 옵션 설정 (단일형 / 조합형 Matrix 생성기)
                        </span>

                        <div className="flex gap-4 border-b border-stone-100 pb-3">
                            <label className="flex items-center gap-1.5 text-sm font-bold text-stone-700 cursor-pointer">
                                <input 
                                    type="radio" 
                                    checked={regOptionType === 'simple'} 
                                    onChange={() => setRegOptionType('simple')} 
                                    className="text-emerald-600 focus:ring-emerald-500" 
                                />
                                <span>단일형 옵션 (옵션 수동 개별 기입)</span>
                            </label>
                            <label className="flex items-center gap-1.5 text-sm font-bold text-stone-700 cursor-pointer">
                                <input 
                                    type="radio" 
                                    checked={regOptionType === 'combination'} 
                                    onChange={() => setRegOptionType('combination')} 
                                    className="text-emerald-600 focus:ring-emerald-500" 
                                />
                                <span>조합형 옵션 (옵션 목록 자동 생성 엔진)</span>
                            </label>
                        </div>

                        {regOptionType === 'simple' ? (
                            /* Simple manual options */
                            <div className="space-y-4 animate-fadeIn">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-stone-400">수동 기입형 옵션 및 재고</span>
                                    <button
                                        type="button"
                                        onClick={handleAddRegOption}
                                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-750 text-xs font-bold rounded-lg transition-all"
                                    >
                                        + 옵션 추가
                                    </button>
                                </div>
                                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                    {regOptions.map((opt, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input 
                                                type="text" 
                                                required
                                                placeholder="옵션 규격명 (예: 밤부목재 10mm / 보통)"
                                                value={opt.name}
                                                onChange={(e) => handleRegOptionChange(index, 'name', e.target.value)}
                                                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-sm font-bold outline-none text-stone-700 focus:bg-white"
                                            />
                                            <input 
                                                type="number" 
                                                required
                                                placeholder="재고수량"
                                                value={opt.stock}
                                                onChange={(e) => handleRegOptionChange(index, 'stock', Number(e.target.value))}
                                                className="w-24 bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-sm font-bold outline-none text-stone-700 focus:bg-white"
                                            />
                                            {regOptions.length > 1 && (
                                                <button 
                                                    type="button"
                                                    onClick={() => handleRemoveRegOption(index)}
                                                    className="p-2 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Smartstore combination option matrix generator */
                            <div className="space-y-5 animate-fadeIn">
                                <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-3">
                                    <span className="text-sm font-bold text-stone-700 block">스마트스토어 옵션 생성 정보 기입</span>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-semibold">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">옵션명 (예: 색상, 사이즈)</label>
                                            <input 
                                                type="text"
                                                value={regOptionNames.join(',')}
                                                onChange={(e) => setRegOptionNames(e.target.value.split(',').map(n => n.trim()))}
                                                className="w-full bg-white border border-stone-200 rounded-lg p-2 outline-none font-bold"
                                                placeholder="예: 색상,사이즈"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-1">옵션값 (쉼표로 나열, 옵션수와 1:1 대응하여 기입)</label>
                                            <input 
                                                type="text"
                                                value={regOptionValues.join(' | ')}
                                                onChange={(e) => setRegOptionValues(e.target.value.split('|').map(v => v.trim()))}
                                                className="w-full bg-white border border-stone-200 rounded-lg p-2 outline-none font-bold text-stone-700"
                                                placeholder="예: 블랙,화이트 | S,M"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleApplyOptionMatrix}
                                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-soft"
                                    >
                                        [옵션 목록 적용] 스마트스토어 조합형 행 자동 생성
                                    </button>
                                </div>

                                {/* Matrix rendering */}
                                {regOptionMatrix.length > 0 && (
                                    <div className="border border-stone-200 rounded-xl overflow-hidden animate-fadeIn">
                                        <table className="w-full text-left border-collapse text-sm">
                                            <thead>
                                                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-500">
                                                    <th className="p-2.5">옵션 조합명</th>
                                                    <th className="p-2.5 w-32">옵션가 변동 (+/-원)</th>
                                                    <th className="p-2.5 w-24">재고수량</th>
                                                    <th className="p-2.5 text-center w-20">품절처리</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-stone-150 text-stone-700 font-bold">
                                                {regOptionMatrix.map((item, idx) => (
                                                    <tr key={item.id} className="hover:bg-stone-50/50">
                                                        <td className="p-2.5 font-bold text-stone-800">{item.name}</td>
                                                        <td className="p-2.5">
                                                            <input 
                                                                type="number"
                                                                value={item.priceDiff}
                                                                onChange={(e) => {
                                                                    const updated = [...regOptionMatrix];
                                                                    updated[idx].priceDiff = Number(e.target.value);
                                                                    setRegOptionMatrix(updated);
                                                                }}
                                                                className="w-full bg-stone-50 border border-stone-200 rounded p-1 outline-none text-center font-bold"
                                                            />
                                                        </td>
                                                        <td className="p-2.5">
                                                            <input 
                                                                type="number"
                                                                value={item.stock}
                                                                onChange={(e) => {
                                                                    const updated = [...regOptionMatrix];
                                                                    updated[idx].stock = Number(e.target.value);
                                                                    setRegOptionMatrix(updated);
                                                                }}
                                                                className="w-full bg-stone-50 border border-stone-200 rounded p-1 outline-none text-center font-bold"
                                                            />
                                                        </td>
                                                        <td className="p-2.5 text-center">
                                                            <input 
                                                                type="checkbox"
                                                                checked={item.isSoldOut}
                                                                onChange={(e) => {
                                                                    const updated = [...regOptionMatrix];
                                                                    updated[idx].isSoldOut = e.target.checked;
                                                                    if (e.target.checked) updated[idx].stock = 0;
                                                                    setRegOptionMatrix(updated);
                                                                }}
                                                                className="rounded text-rose-500 focus:ring-rose-400"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Section 6: 블로그형 상세페이지 에디터 (스마트에디터 ONE) */}
                    <div className="bg-white p-6 rounded-2xl border border-stone-150 shadow-soft space-y-5">
                        <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                            <span className="text-sm font-bold text-stone-900 border-l-4 border-emerald-600 pl-2 block">
                                SECTION 6. 스마트에디터 ONE (상세페이지 블록 편집기)
                            </span>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => handleAddDetailBlock('text')}
                                    className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg border border-stone-200"
                                >
                                    + 글 단락
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAddDetailBlock('image')}
                                    className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg border border-stone-200"
                                >
                                    + 사진 추가
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAddDetailBlock('notice')}
                                    className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg border border-stone-200"
                                >
                                    + 강조공지
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAddDetailBlock('guide')}
                                    className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg border border-stone-200"
                                >
                                    + 세탁가이드
                                </button>
                            </div>
                        </div>

                        {/* Block list */}
                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 bg-stone-50/50 p-4 rounded-xl border border-stone-150">
                            {regDetailBlocks.map((block, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs relative group animate-fadeIn space-y-2">
                                    <div className="flex justify-between items-center text-xs font-bold uppercase text-emerald-700">
                                        <span>
                                            {block.type === 'text' && '✍️ 글 단락 블록'}
                                            {block.type === 'image' && '🖼️ 사진 갤러리 블록'}
                                            {block.type === 'notice' && '🚨 중요 배송 필독공지 블록'}
                                            {block.type === 'guide' && '🧼 세탁 및 취급 주의 가이드 블록'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDetailBlock(idx)}
                                            className="text-stone-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>

                                    {block.type === 'text' ? (
                                        <textarea
                                            value={block.content}
                                            onChange={(e) => handleUpdateDetailBlock(idx, e.target.value)}
                                            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm font-bold outline-none text-stone-750 resize-none focus:bg-white"
                                            rows={2}
                                        />
                                    ) : block.type === 'image' ? (
                                        <div className="space-y-2">
                                            <input 
                                                type="text"
                                                value={block.content}
                                                onChange={(e) => handleUpdateDetailBlock(idx, e.target.value)}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs font-mono outline-none"
                                                placeholder="이미지 URL 입력..."
                                            />
                                            {block.content && (
                                                <img src={block.content} alt="Preview" className="max-h-24 object-cover rounded-lg border border-stone-100 shadow-xs" />
                                            )}
                                        </div>
                                    ) : (
                                        <input 
                                            type="text"
                                            value={block.content}
                                            onChange={(e) => handleUpdateDetailBlock(idx, e.target.value)}
                                            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm font-bold outline-none text-stone-700 focus:bg-white"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-stone-100 pt-5 flex items-center justify-end gap-3 bg-white p-4 rounded-b-3xl">
                        <button
                            type="button"
                            onClick={() => setActiveSubTab('list')}
                            className="px-5 py-3 bg-stone-150 hover:bg-stone-200 text-stone-600 rounded-2xl text-sm font-bold transition-all"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-bold transition-all shadow-soft flex items-center gap-1.5"
                        >
                            <Check size={14} />
                            <span>스마트스토어 양식으로 상품 등록 완료</span>
                        </button>
                    </div>
                </form>
            )}

            {/* ---------------- 3. 상품 일괄 등록 탭 ---------------- */}
            {activeSubTab === 'bulk' && (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-150 shadow-soft space-y-6 animate-fadeIn">
                    <div className="border-b border-stone-100 pb-3 flex items-center gap-2 text-stone-900">
                        <Upload className="text-blue-500" />
                        <span className="text-lg font-bold">{locale === 'ko' ? '상품 일괄 등록 (CSV 2단계 카테고리 지원)' : 'Bulk Product Registration (CSV)'}</span>
                    </div>

                    <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl flex gap-3 text-stone-700">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="text-sm space-y-2 leading-relaxed text-stone-600">
                            <span className="font-bold text-stone-850 block text-base">일괄 등록 가이드 및 대분류/중분류 코드 안내</span>
                            <p>1. 하단의 **[일괄등록 양식 템플릿 다운로드]**를 눌러 가이드가 포함된 CSV 양식을 내려받습니다.</p>
                            <p>2. 대분류는 반드시 아래 영문 식별 ID 중 하나를 입력합니다:
                                <code className="bg-white px-1.5 py-0.5 rounded border border-stone-200 ml-1 font-mono font-bold text-blue-600">yarn</code>, 
                                <code className="bg-white px-1.5 py-0.5 rounded border border-stone-200 ml-1 font-mono font-bold text-blue-600">needle</code>, 
                                <code className="bg-white px-1.5 py-0.5 rounded border border-stone-200 ml-1 font-mono font-bold text-blue-600">notions</code>, 
                                <code className="bg-white px-1.5 py-0.5 rounded border border-stone-200 ml-1 font-mono font-bold text-blue-600">finished</code>, 
                                <code className="bg-white px-1.5 py-0.5 rounded border border-stone-200 ml-1 font-mono font-bold text-blue-600">package</code>
                            </p>
                        </div>
                    </div>

                    {/* Visual Template Structure Guide */}
                    <div className="space-y-3">
                        <span className="text-sm font-bold text-stone-850 flex items-center gap-1.5 pl-1">
                            <FolderTree size={14} className="text-blue-500" />
                            <span>일괄 등록 CSV 템플릿 열람 및 구조 가이드 (틀 미리보기)</span>
                        </span>
                        
                        <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-soft">
                            <table className="w-full text-left text-sm border-collapse bg-white">
                                <thead>
                                    <tr className="bg-stone-50 text-stone-700 text-xs font-bold border-b border-stone-200 uppercase tracking-wider">
                                        <th className="p-3 w-16">열 순서</th>
                                        <th className="p-3 w-28">열 이름 (헤더)</th>
                                        <th className="p-3 w-20">필수여부</th>
                                        <th className="p-3">허용값 및 설명</th>
                                        <th className="p-3">작성 예시</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-150 font-bold text-stone-700">
                                    <tr className="hover:bg-stone-50/50">
                                        <td className="p-3 text-stone-400 font-mono">1</td>
                                        <td className="p-3 text-stone-900 font-bold">상품명</td>
                                        <td className="p-3"><span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded text-xs">필수</span></td>
                                        <td className="p-3">텍스트 (100자 이하)</td>
                                        <td className="p-3 text-stone-500 font-medium">파스텔 소프트 울 털실</td>
                                    </tr>
                                    <tr className="hover:bg-stone-50/50">
                                        <td className="p-3 text-stone-400 font-mono">2</td>
                                        <td className="p-3 text-stone-900 font-bold">대분류</td>
                                        <td className="p-3"><span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded text-xs">필수</span></td>
                                        <td className="p-3 text-xs font-mono text-blue-600">yarn | needle | notions | finished | package</td>
                                        <td className="p-3 text-stone-500 font-medium">yarn</td>
                                    </tr>
                                    <tr className="hover:bg-stone-50/50">
                                        <td className="p-3 text-stone-400 font-mono">3</td>
                                        <td className="p-3 text-stone-900 font-bold">중분류</td>
                                        <td className="p-3"><span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded text-xs">필수</span></td>
                                        <td className="p-3">선택한 대분류의 하위 중분류 코드를 기입</td>
                                        <td className="p-3 text-stone-500 font-medium">wool</td>
                                    </tr>
                                    <tr className="hover:bg-stone-50/50">
                                        <td className="p-3 text-stone-400 font-mono">4</td>
                                        <td className="p-3 text-stone-900 font-bold">판매가</td>
                                        <td className="p-3"><span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded text-xs">필수</span></td>
                                        <td className="p-3">숫자 기입 (소수점 제외 정가 원화)</td>
                                        <td className="p-3 text-stone-500 font-medium">8900</td>
                                    </tr>
                                    <tr className="hover:bg-stone-50/50">
                                        <td className="p-3 text-stone-400 font-mono">5</td>
                                        <td className="p-3 text-stone-900 font-bold">할인가</td>
                                        <td className="p-3"><span className="px-1.5 py-0.5 bg-stone-50 text-stone-500 rounded text-xs">선택</span></td>
                                        <td className="p-3">기본 할인가 입력 (없으면 공란 가능)</td>
                                        <td className="p-3 text-stone-500 font-medium">7900</td>
                                    </tr>
                                    <tr className="hover:bg-stone-50/50">
                                        <td className="p-3 text-stone-400 font-mono">6</td>
                                        <td className="p-3 text-stone-900 font-bold">옵션리스트</td>
                                        <td className="p-3"><span className="px-1.5 py-0.5 bg-stone-50 text-stone-500 rounded text-xs">선택</span></td>
                                        <td className="p-3">규격명:재고 형태 기입, 파이프(|)로 구분하여 나열</td>
                                        <td className="p-3 text-stone-500 font-medium">화이트:100|핑크:80|베이지:50</td>
                                    </tr>
                                    <tr className="hover:bg-stone-50/50">
                                        <td className="p-3 text-stone-400 font-mono">7</td>
                                        <td className="p-3 text-stone-900 font-bold">이미지URL</td>
                                        <td className="p-3"><span className="px-1.5 py-0.5 bg-stone-50 text-stone-500 rounded text-xs">선택</span></td>
                                        <td className="p-3">대표 썸네일 이미지 파일 주소 URL</td>
                                        <td className="p-3 text-xs text-blue-600 font-mono truncate max-w-xs">https://images.unsplash.com/...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-8 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
                        <button
                            onClick={handleDownloadTemplate}
                            className="px-5 py-3 bg-white border border-stone-200 text-stone-700 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-inner-soft hover:bg-stone-50"
                        >
                            <Download size={14} className="text-blue-500" />
                            <span>{locale === 'ko' ? '일괄등록 템플릿 양식 다운로드' : 'Download CSV Template'}</span>
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
                            className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-soft"
                        >
                            <Upload size={14} />
                            <span>{locale === 'ko' ? 'CSV 파일 선택하여 일괄 등록' : 'Select CSV & Upload'}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* ---------------- 4. 상품 공지사항 관리 탭 ---------------- */}
            {activeSubTab === 'announcements' && (
                <div className="space-y-6 animate-fadeIn">
                    
                    {/* Search & Action bar */}
                    <div className="bg-white p-6 rounded-3xl border border-stone-150 shadow-soft space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-50 pb-2.5">
                            <span className="text-sm font-bold text-stone-900">공지사항 상세 검색</span>
                            <button
                                onClick={() => handleOpenAnnoModal()}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-1 shadow-soft"
                            >
                                <PlusCircle size={14} />
                                <span>새 상품 공지사항 등록</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold text-stone-700 block mb-1">제목 검색</label>
                                <input 
                                    type="text"
                                    placeholder="공지 제목 검색..."
                                    value={annoSearchTitle}
                                    onChange={(e) => setAnnoSearchTitle(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:bg-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-700 block mb-1">분류</label>
                                <select
                                    value={annoSearchCategory}
                                    onChange={(e) => setAnnoSearchCategory(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:bg-white"
                                >
                                    <option value="all">전체 분류</option>
                                    <option value="general">일반</option>
                                    <option value="event">이벤트</option>
                                    <option value="shipping">배송공지</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-700 block mb-1">전시 상태</label>
                                <select
                                    value={annoSearchStatus}
                                    onChange={(e) => setAnnoSearchStatus(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:bg-white"
                                >
                                    <option value="all">전체 상태</option>
                                    <option value="display">전시중</option>
                                    <option value="stop">전시중지</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Announcement Listing Grid Table */}
                    <div className="bg-white rounded-3xl border border-stone-150 shadow-soft overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm min-w-[900px]">
                                <thead>
                                    <tr className="bg-stone-100 text-stone-600 font-bold border-b border-stone-200">
                                        <th className="p-3.5 border-r border-stone-200 w-16 text-center">수정</th>
                                        <th className="p-3.5 border-r border-stone-200 w-28 text-center">번호</th>
                                        <th className="p-3.5 border-r border-stone-200 w-24 text-center">분류</th>
                                        <th className="p-3.5 border-r border-stone-200 w-24 text-center">전시상태</th>
                                        <th className="p-3.5 border-r border-stone-200">공지 제목</th>
                                        <th className="p-3.5 border-r border-stone-200 w-32 text-center">전시 시작일</th>
                                        <th className="p-3.5 border-r border-stone-200 w-32 text-center">전시 종료일</th>
                                        <th className="p-3.5 border-r border-stone-200 w-28 text-center">등록일</th>
                                        <th className="p-3.5 text-center w-20">삭제</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-200 font-semibold text-stone-700">
                                    {filteredAnnouncements.length > 0 ? (
                                        filteredAnnouncements.map((a) => (
                                            <tr key={a.id} className="hover:bg-stone-50/50 transition-colors">
                                                <td className="p-3.5 border-r border-stone-200 text-center">
                                                    <button
                                                        onClick={() => handleOpenAnnoModal(a)}
                                                        className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-bold"
                                                    >
                                                        수정
                                                    </button>
                                                </td>
                                                <td className="p-3.5 border-r border-stone-200 text-center text-stone-500 font-mono">{a.id}</td>
                                                <td className="p-3.5 border-r border-stone-200 text-center">
                                                    <span className="px-2 py-0.5 bg-stone-50 border border-stone-150 text-xs text-stone-600 rounded">
                                                        {a.category === 'general' && '일반'}
                                                        {a.category === 'event' && '이벤트'}
                                                        {a.category === 'shipping' && '배송공지'}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 border-r border-stone-200 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-xs ${
                                                        a.status === 'display' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-stone-100 text-stone-400 border border-stone-200'
                                                    }`}>
                                                        {a.status === 'display' ? '전시중' : '전시중지'}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 border-r border-stone-200 font-bold text-stone-850 truncate max-w-sm pl-4">
                                                    {a.title}
                                                </td>
                                                <td className="p-3.5 border-r border-stone-200 text-center text-stone-500">{a.startDate}</td>
                                                <td className="p-3.5 border-r border-stone-200 text-center text-stone-500">{a.endDate}</td>
                                                <td className="p-3.5 border-r border-stone-200 text-center text-stone-400">{a.regDate}</td>
                                                <td className="p-3.5 text-center">
                                                    <button
                                                        onClick={() => handleDeleteAnno(a.id)}
                                                        className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded text-xs font-bold"
                                                    >
                                                        삭제
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={9} className="p-20 text-center text-stone-400 font-bold">등록된 공지사항이 없습니다.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- 5. 배송비 묶음그룹 관리 탭 ---------------- */}
            {activeSubTab === 'shipping' && (
                <div className="space-y-6 animate-fadeIn">
                    
                    {/* Search & Actions Bar */}
                    <div className="bg-white p-6 rounded-3xl border border-stone-150 shadow-soft space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-50 pb-2.5">
                            <span className="text-sm font-bold text-stone-900">배송비 묶음그룹 조회</span>
                            <button
                                onClick={() => handleOpenBundleModal()}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-1 shadow-soft"
                            >
                                <PlusCircle size={14} />
                                <span>+ 묶음그룹 추가</span>
                            </button>
                        </div>

                        <div className="max-w-md">
                            <label className="text-xs font-bold text-stone-700 block mb-1">배송비 묶음그룹명</label>
                            <div className="relative">
                                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input 
                                    type="text"
                                    placeholder="묶음그룹명 검색..."
                                    value={bundleSearchName}
                                    onChange={(e) => setBundleSearchName(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-2 text-sm font-bold outline-none focus:bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bundle Group Table Grid */}
                    <div className="bg-white rounded-3xl border border-stone-150 shadow-soft overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm min-w-[950px]">
                                <thead>
                                    <tr className="bg-stone-100 text-stone-600 font-bold border-b border-stone-200">
                                        <th className="p-3.5 border-r border-stone-200 w-16 text-center">수정</th>
                                        <th className="p-3.5 border-r border-stone-200 w-28 text-center">그룹번호</th>
                                        <th className="p-3.5 border-r border-stone-200">그룹명</th>
                                        <th className="p-3.5 border-r border-stone-200 w-24 text-center">계산방식</th>
                                        <th className="p-3.5 border-r border-stone-200 w-32 text-center">계약 택배사</th>
                                        <th className="p-3.5 border-r border-stone-200 w-24 text-center">권역구분</th>
                                        <th className="p-3.5 border-r border-stone-200 w-28 text-right">제주 추가배송비</th>
                                        <th className="p-3.5 border-r border-stone-200 w-28 text-right">도서산간 추가배송비</th>
                                        <th className="p-3.5 border-r border-stone-200 w-20 text-center">사용여부</th>
                                        <th className="p-3.5 border-r border-stone-200 w-28 text-center">등록일</th>
                                        <th className="p-3.5 border-r border-stone-200 w-28 text-center">수정일</th>
                                        <th className="p-3.5 text-center w-20">삭제</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-200 font-semibold text-stone-700">
                                    {filteredBundleGroups.length > 0 ? (
                                        filteredBundleGroups.map((b) => (
                                            <tr key={b.id} className="hover:bg-stone-50/50 transition-colors">
                                                <td className="p-3.5 border-r border-stone-200 text-center">
                                                    <button
                                                        onClick={() => handleOpenBundleModal(b)}
                                                        className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-bold"
                                                    >
                                                        수정
                                                    </button>
                                                </td>
                                                <td className="p-3.5 border-r border-stone-200 text-center text-stone-500 font-mono">{b.id}</td>
                                                <td className="p-3.5 border-r border-stone-200 font-bold text-stone-850 pl-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <span>{b.name}</span>
                                                        {b.isDefault && (
                                                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 text-[8px] font-bold rounded-md">
                                                                기본
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3.5 border-r border-stone-200 text-center">
                                                    {b.calcMethod === 'min' && '최소부과'}
                                                    {b.calcMethod === 'max' && '최대부과'}
                                                    {b.calcMethod === 'item' && '개별부과'}
                                                </td>
                                                <td className="p-3.5 border-r border-stone-200 text-center font-bold text-stone-800">
                                                    {b.carrier}
                                                </td>
                                                <td className="p-3.5 border-r border-stone-200 text-center font-bold text-stone-500">
                                                    {b.regionType}권역
                                                </td>
                                                <td className="p-3.5 border-r border-stone-200 text-right text-stone-600 pr-4">₩{b.region2Fee.toLocaleString()}</td>
                                                <td className="p-3.5 border-r border-stone-200 text-right text-stone-600 pr-4">
                                                    {b.regionType === '3' ? `₩${b.region3Fee.toLocaleString()}` : '-'}
                                                </td>
                                                <td className="p-3.5 border-r border-stone-200 text-center">
                                                    <span className={`px-1.5 py-0.5 rounded text-xs ${
                                                        b.useYn === 'Y' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-stone-50 text-stone-400 border border-stone-150'
                                                    }`}>
                                                        {b.useYn === 'Y' ? '사용' : '미사용'}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 border-r border-stone-200 text-center text-stone-400">{b.regDate}</td>
                                                <td className="p-3.5 border-r border-stone-200 text-center text-stone-400">{b.editDate}</td>
                                                <td className="p-3.5 text-center">
                                                    <button
                                                        onClick={() => handleDeleteBundle(b.id)}
                                                        disabled={b.isDefault}
                                                        className={`px-2.5 py-1 rounded text-xs font-bold ${
                                                            b.isDefault ? 'bg-stone-100 text-stone-300 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600 text-white'
                                                        }`}
                                                    >
                                                        삭제
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={12} className="p-20 text-center text-stone-400 font-bold">등록된 배송비 묶음그룹이 없습니다.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- 6. 카탈로그 가격관리 탭 ---------------- */}
            {activeSubTab === 'catalog' && (
                <div className="space-y-6 animate-fadeIn">
                    {/* Summary Counters */}
                    <div className="bg-white p-6 rounded-3xl border border-stone-150 shadow-soft space-y-4">
                        <div className="flex items-start gap-3 bg-blue-50/20 p-4.5 rounded-2xl border border-blue-100/50 text-blue-800 text-sm">
                            <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <span className="font-bold text-base block">카탈로그 매칭 가격비교 안내</span>
                                <p className="text-stone-600 font-medium">카탈로그 페이지에 판매자의 뜨개 상품을 매칭하여 최저가 경쟁을 진행할 수 있습니다. 매칭 시 노출 지수가 대폭 상승합니다.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                            <div className="bg-stone-50 p-4 rounded-2xl text-center">
                                <span className="text-xs text-stone-400 font-bold block">카탈로그 매칭 완료</span>
                                <span className="text-base font-bold text-stone-850">0건</span>
                            </div>
                            <div className="bg-stone-50 p-4 rounded-2xl text-center">
                                <span className="text-xs text-stone-400 font-bold block">매칭 대기중</span>
                                <span className="text-base font-bold text-stone-850">0건</span>
                            </div>
                            <div className="bg-stone-50 p-4 rounded-2xl text-center">
                                <span className="text-xs text-stone-400 font-bold block">최저가 단독 노출</span>
                                <span className="text-base font-bold text-stone-850">0건</span>
                            </div>
                            <div className="bg-stone-50 p-4 rounded-2xl text-center">
                                <span className="text-xs text-stone-400 font-bold block">최저가보다 높은 상품</span>
                                <span className="text-base font-bold text-stone-850">0건</span>
                            </div>
                        </div>
                    </div>

                    {/* Filter bar */}
                    <div className="bg-white p-6 rounded-3xl border border-stone-150 shadow-soft space-y-4">
                        <span className="text-sm font-bold text-stone-900 border-b border-stone-50 pb-2 block">카탈로그 가격비교 매칭 검색</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold text-stone-700 block mb-1">카탈로그명 / 상품번호</label>
                                <input 
                                    type="text" 
                                    placeholder="검색어 기입..."
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold outline-none cursor-not-allowed"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-700 block mb-1">매칭 여부</label>
                                <select className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold outline-none cursor-not-allowed" disabled>
                                    <option>전체</option>
                                    <option>매칭 완료</option>
                                    <option>매칭 대기</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button type="button" className="w-full py-2 bg-stone-100 text-stone-400 rounded-xl text-sm font-bold cursor-not-allowed" disabled>
                                    검색 (매칭 데이터 없음)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Empty Table */}
                    <div className="bg-white rounded-3xl border border-stone-150 shadow-soft p-20 text-center space-y-3">
                        <HelpCircle size={40} className="text-stone-300 mx-auto animate-pulse" />
                        <p className="text-stone-400 font-bold text-base">카탈로그 매칭 가격비교 데이터가 존재하지 않습니다.</p>
                        <button 
                            type="button" 
                            onClick={() => alert('본사 카탈로그 가격비교 연동 및 매칭 신청이 정상 접수되었습니다.')}
                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-soft"
                        >
                            신규 카탈로그 매칭 요청 신청
                        </button>
                    </div>
                </div>
            )}

            {/* ---------------- 7. 연관상품 관리 탭 ---------------- */}
            {activeSubTab === 'related' && (
                <div className="space-y-6 animate-fadeIn">
                    {/* Filter bar */}
                    <div className="bg-white p-6 rounded-3xl border border-stone-150 shadow-soft space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-50 pb-2.5">
                            <span className="text-sm font-bold text-stone-900">연관상품 (코디/추천) 조회</span>
                            <button
                                type="button"
                                onClick={() => alert('연관 상품(코디/세트) 코디네이션 등록 기능이 정상 요청되었습니다.')}
                                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-soft flex items-center gap-1"
                            >
                                <Plus size={12} />
                                <span>연관 코디/추천상품 등록</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold text-stone-700 block mb-1">대표 상품명 / 연관 ID</label>
                                <input 
                                    type="text" 
                                    placeholder="대표 상품명 입력..."
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold outline-none cursor-not-allowed"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-stone-700 block mb-1">연관상품 유형</label>
                                <select className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm font-bold outline-none cursor-not-allowed" disabled>
                                    <option>전체 유형</option>
                                    <option>코디 상품 (함께 연출)</option>
                                    <option>함께 사면 좋은 상품 (추천)</option>
                                    <option>유사한 상품</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button type="button" className="w-full py-2 bg-stone-100 text-stone-400 rounded-xl text-sm font-bold cursor-not-allowed" disabled>
                                    조회 (등록 내역 없음)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Empty Table */}
                    <div className="bg-white rounded-3xl border border-stone-150 shadow-soft p-20 text-center space-y-3">
                        <FolderTree size={40} className="text-stone-300 mx-auto" />
                        <p className="text-stone-400 font-bold text-base">연관 코디/함께 사면 좋은 추천 상품 데이터가 존재하지 않습니다.</p>
                        <p className="text-sm text-stone-400">상단의 [연관 코디/추천상품 등록] 단추를 통해 털실과 바늘 등을 매칭할 수 있습니다.</p>
                    </div>
                </div>
            )}

            {/* ---------------- QUICK EDIT MODAL (Products) ---------------- */}
            {editingProduct && (
                <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-150 overflow-hidden animate-zoomIn flex flex-col">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                                <Package size={18} className="text-blue-500" />
                                <span>{locale === 'ko' ? '상품 정밀 정보 수정' : 'Edit Product Details'}</span>
                            </h2>
                            <button onClick={() => setEditingProduct(null)} className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto pr-2">
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">{locale === 'ko' ? '상품명 *' : 'Product Name *'}</label>
                                <input 
                                    type="text" 
                                    value={editingProduct.name}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm outline-none focus:bg-white text-stone-750 font-bold"
                                />
                            </div>

                            {/* 2-Level Category select */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1.5">{locale === 'ko' ? '대분류 카테고리' : 'Large Category'}</label>
                                    <select 
                                        value={editingProduct.mainCategory}
                                        onChange={(e) => {
                                            const newMain = e.target.value;
                                            const subCats = Object.keys(categoryMap[newMain].sub);
                                            setEditingProduct({
                                                ...editingProduct,
                                                mainCategory: newMain,
                                                subCategory: subCats[0]
                                            });
                                        }}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm outline-none focus:bg-white text-stone-750 font-bold"
                                    >
                                        {Object.entries(categoryMap).map(([key, data]) => (
                                            <option key={key} value={key}>{data.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-stone-700 mb-1.5">{locale === 'ko' ? '중분류 카테고리' : 'Medium Category'}</label>
                                    <select 
                                        value={editingProduct.subCategory}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, subCategory: e.target.value })}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm outline-none focus:bg-white text-stone-750 font-bold"
                                    >
                                        {Object.entries(categoryMap[editingProduct.mainCategory].sub).map(([key, val]) => (
                                            <option key={key} value={key}>{val}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Pricing & Discount */}
                            <div className="bg-stone-50 p-4 rounded-xl border border-stone-150 space-y-3">
                                <span className="text-sm font-bold text-stone-600 block">가격 및 할인 정보 설정</span>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-0.5">기본 판매가 (원) *</label>
                                        <input 
                                            type="number" 
                                            value={editingProduct.price}
                                            onChange={(e) => {
                                                const basePrice = Number(e.target.value);
                                                let disc = editingProduct.discountPrice;
                                                if (editingProduct.discountType === 'won') {
                                                    disc = basePrice - (editingProduct.discountValue || 0);
                                                } else if (editingProduct.discountType === 'percent') {
                                                    disc = basePrice - (basePrice * (editingProduct.discountValue || 0) / 100);
                                                }
                                                setEditingProduct({ ...editingProduct, price: basePrice, discountPrice: disc });
                                            }}
                                            className="w-full bg-white border border-stone-200 rounded p-1.5 font-bold outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-0.5">할인 방식</label>
                                        <select
                                            value={editingProduct.discountType || 'none'}
                                            onChange={(e) => {
                                                const type = e.target.value as any;
                                                let val = editingProduct.discountValue || 0;
                                                let disc: number | undefined = undefined;
                                                if (type === 'won') {
                                                    disc = editingProduct.price - val;
                                                } else if (type === 'percent') {
                                                    disc = editingProduct.price - (editingProduct.price * val / 100);
                                                }
                                                setEditingProduct({ ...editingProduct, discountType: type, discountPrice: disc });
                                            }}
                                            className="w-full bg-white border border-stone-200 rounded p-1.5 font-bold outline-none"
                                        >
                                            <option value="none">할인 없음</option>
                                            <option value="won">정액 할인 (원)</option>
                                            <option value="percent">정율 할인 (%)</option>
                                        </select>
                                    </div>
                                </div>
                                {editingProduct.discountType && editingProduct.discountType !== 'none' && (
                                    <div className="grid grid-cols-2 gap-3 text-sm animate-fadeIn">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-0.5">
                                                {editingProduct.discountType === 'won' ? '할인액 (원)' : '할인율 (%)'}
                                            </label>
                                            <input 
                                                type="number"
                                                value={editingProduct.discountValue || 0}
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    let disc = editingProduct.discountPrice;
                                                    if (editingProduct.discountType === 'won') {
                                                        disc = editingProduct.price - val;
                                                    } else if (editingProduct.discountType === 'percent') {
                                                        disc = editingProduct.price - (editingProduct.price * val / 100);
                                                    }
                                                    setEditingProduct({ ...editingProduct, discountValue: val, discountPrice: disc });
                                                }}
                                                className="w-full bg-white border border-stone-200 rounded p-1.5 font-bold outline-none"
                                            />
                                        </div>
                                        <div className="flex items-end pb-1.5 text-xs text-emerald-700 font-bold">
                                            최종 판매가: ₩{(editingProduct.discountPrice || editingProduct.price).toLocaleString()}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Delivery Attributes in Edit modal */}
                            <div className="bg-stone-50 p-4 rounded-xl border border-stone-150 space-y-3">
                                <span className="text-sm font-bold text-stone-600 block">발송 및 제작 속성 설정</span>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-0.5">발송 유형</label>
                                        <select
                                            value={editingProduct.deliveryType || 'immediate'}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, deliveryType: e.target.value as any })}
                                            className="w-full bg-white border border-stone-200 rounded p-1.5 font-bold"
                                        >
                                            <option value="immediate">바로 배송</option>
                                            <option value="custom">주문 제작</option>
                                            <option value="reserve">예약 발송</option>
                                        </select>
                                    </div>
                                    {editingProduct.deliveryType === 'custom' && (
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-0.5">제작 완료 기간 (일)</label>
                                            <input 
                                                type="number"
                                                value={editingProduct.customDeliveryDays || 3}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, customDeliveryDays: Number(e.target.value) })}
                                                className="w-full bg-white border border-stone-200 rounded p-1.5 font-bold outline-none text-center"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Options and Inventory Editor in Edit Modal */}
                            <div className="bg-stone-50 p-4 rounded-xl border border-stone-150 space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-stone-600">옵션 및 재고 수량 편집</span>
                                    {(!editingProduct.optionType || editingProduct.optionType === 'simple') && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const opts = [...(editingProduct.options || [])];
                                                opts.push({ name: '새 옵션', stock: 10 });
                                                setEditingProduct({ ...editingProduct, options: opts });
                                            }}
                                            className="px-2 py-0.5 bg-stone-200 text-stone-700 font-bold rounded text-xs"
                                        >
                                            + 옵션 규격 추가
                                        </button>
                                    )}
                                </div>

                                {editingProduct.optionType === 'combination' && editingProduct.optionMatrix && editingProduct.optionMatrix.length > 0 ? (
                                    <div className="border border-stone-200 rounded overflow-hidden max-h-40 overflow-y-auto">
                                        <table className="w-full text-xs border-collapse bg-white">
                                            <thead>
                                                <tr className="bg-stone-100 text-stone-500 text-[8px] font-bold border-b border-stone-200">
                                                    <th className="p-1.5 text-left">조합옵션명</th>
                                                    <th className="p-1.5 w-16 text-center">재고</th>
                                                    <th className="p-1.5 w-20 text-center">옵션가</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-stone-150 font-bold">
                                                {editingProduct.optionMatrix.map((item, idx) => (
                                                    <tr key={item.id || idx}>
                                                        <td className="p-1.5 truncate max-w-[120px]">{item.name}</td>
                                                        <td className="p-1.5">
                                                            <input
                                                                type="number"
                                                                value={item.stock}
                                                                onChange={(e) => {
                                                                    const matrix = [...(editingProduct.optionMatrix || [])];
                                                                    matrix[idx].stock = Number(e.target.value);
                                                                    const newOptions = matrix.map(m => ({ name: m.name, stock: m.stock }));
                                                                    setEditingProduct({
                                                                        ...editingProduct,
                                                                        optionMatrix: matrix,
                                                                        options: newOptions
                                                                    });
                                                                }}
                                                                className="w-full text-center border rounded border-stone-200 p-0.5 font-bold animate-fadeIn bg-stone-50 focus:bg-white"
                                                            />
                                                        </td>
                                                        <td className="p-1.5">
                                                            <input
                                                                type="number"
                                                                value={item.priceDiff}
                                                                onChange={(e) => {
                                                                    const matrix = [...(editingProduct.optionMatrix || [])];
                                                                    matrix[idx].priceDiff = Number(e.target.value);
                                                                    setEditingProduct({
                                                                        ...editingProduct,
                                                                        optionMatrix: matrix
                                                                    });
                                                                }}
                                                                className="w-full text-center border rounded border-stone-200 p-0.5 font-bold animate-fadeIn bg-stone-50 focus:bg-white"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                        {editingProduct.options.map((opt, index) => (
                                            <div key={index} className="flex gap-2 items-center">
                                                <input 
                                                    type="text"
                                                    value={opt.name}
                                                    onChange={(e) => {
                                                        const opts = [...editingProduct.options];
                                                        opts[index].name = e.target.value;
                                                        setEditingProduct({ ...editingProduct, options: opts });
                                                    }}
                                                    className="flex-1 bg-white border border-stone-200 rounded p-1 text-sm font-bold"
                                                />
                                                <input 
                                                    type="number"
                                                    value={opt.stock}
                                                    onChange={(e) => {
                                                        const opts = [...editingProduct.options];
                                                        opts[index].stock = Number(e.target.value);
                                                        setEditingProduct({ ...editingProduct, options: opts });
                                                    }}
                                                    className="w-16 bg-white border border-stone-200 rounded p-1 text-sm font-bold text-center"
                                                />
                                                {editingProduct.options.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const opts = editingProduct.options.filter((_, i) => i !== index);
                                                            setEditingProduct({ ...editingProduct, options: opts });
                                                        }}
                                                        className="text-stone-400 hover:text-rose-500 font-bold p-1"
                                                    >
                                                        삭제
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Shipping edits in Quick edit */}
                            <div className="bg-stone-50 p-4 rounded-xl space-y-3 border border-stone-150 text-sm">
                                <span className="text-sm font-bold text-stone-600 block">배송 설정 변경</span>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-0.5">배송방법</label>
                                        <select
                                            value={editingProduct.shippingMethod}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, shippingMethod: e.target.value as any })}
                                            className="w-full bg-white border border-stone-200 rounded p-1.5 text-sm font-bold"
                                        >
                                            <option value="courier">택배/포장배송</option>
                                            <option value="direct">직접배송</option>
                                            <option value="pickup">매장방문</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-0.5">배송비유형</label>
                                        <select
                                            value={editingProduct.shippingFeeType}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, shippingFeeType: e.target.value as any })}
                                            className="w-full bg-white border border-stone-200 rounded p-1.5 text-sm font-bold"
                                        >
                                            <option value="free">무료</option>
                                            <option value="conditional">조건부 무료</option>
                                            <option value="paid">유료배송</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Dynamic Basic Shipping Fee & Free Shipping Threshold input fields for editing */}
                                {editingProduct.shippingFeeType !== 'free' && (
                                    <div className="grid grid-cols-2 gap-3 animate-fadeIn">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-700 mb-0.5">기본 배송비 (원)</label>
                                            <input 
                                                type="number"
                                                value={editingProduct.basicShippingFee || ''}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, basicShippingFee: Number(e.target.value) })}
                                                className="w-full bg-white border border-stone-200 rounded p-1.5 text-sm font-bold outline-none"
                                            />
                                        </div>
                                        {editingProduct.shippingFeeType === 'conditional' && (
                                            <div>
                                                <label className="block text-xs font-bold text-stone-700 mb-0.5">무료 조건 금액 (원)</label>
                                                <input 
                                                    type="number"
                                                    value={editingProduct.freeShippingThreshold || ''}
                                                    onChange={(e) => setEditingProduct({ ...editingProduct, freeShippingThreshold: Number(e.target.value) })}
                                                    className="w-full bg-white border border-stone-200 rounded p-1.5 text-sm font-bold outline-none"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* CS shipping fees */}
                                <div className="grid grid-cols-2 gap-3 border-t border-stone-100 pt-2">
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-0.5">반품 배송비 (편도, 원)</label>
                                        <input 
                                            type="number"
                                            value={editingProduct.returnShippingFee || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, returnShippingFee: Number(e.target.value) })}
                                            className="w-full bg-white border border-stone-200 rounded p-1.5 text-sm font-bold outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-0.5">교환 배송비 (왕복, 원)</label>
                                        <input 
                                            type="number"
                                            value={editingProduct.exchangeShippingFee || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, exchangeShippingFee: Number(e.target.value) })}
                                            className="w-full bg-white border border-stone-200 rounded p-1.5 text-sm font-bold outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-700 mb-0.5">배송비 묶음그룹</label>
                                    <select
                                        value={editingProduct.bundleGroupId}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, bundleGroupId: Number(e.target.value) })}
                                        className="w-full bg-white border border-stone-200 rounded p-1.5 text-sm font-bold"
                                    >
                                        {bundleGroups.map(bg => (
                                            <option key={bg.id} value={bg.id}>{bg.name} ({bg.carrier})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-stone-50/50 border-t border-stone-100 flex items-center justify-end gap-2">
                            <button onClick={() => setEditingProduct(null)} className="px-4 py-2.5 bg-white border border-stone-200 text-stone-600 rounded-xl text-sm font-bold">
                                {locale === 'ko' ? '취소' : 'Cancel'}
                            </button>
                            <button
                                onClick={() => {
                                    const updated = products.map(p => p.id === editingProduct.id ? editingProduct : p);
                                    saveProducts(updated);
                                    setEditingProduct(null);
                                    alert('상품 정보 변경이 완료되었습니다.');
                                }}
                                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-soft"
                            >
                                {locale === 'ko' ? '저장하기' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- ANNOUNCEMENT DIALOG MODAL ---------------- */}
            {isAnnoModalOpen && (
                <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <form onSubmit={handleSaveAnnouncement} className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-150 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                                <Megaphone size={16} className="text-blue-500" />
                                <span>{editingAnno ? '상품 공지사항 수정' : '신규 상품 공지사항 등록'}</span>
                            </h2>
                            <button type="button" onClick={() => setIsAnnoModalOpen(false)} className="p-2 text-stone-400 hover:text-stone-600 rounded-xl">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-stone-700 mb-1">공지 분류 *</label>
                                    <select
                                        value={annoCategory}
                                        onChange={(e) => setAnnoCategory(e.target.value as any)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-stone-700 outline-none"
                                    >
                                        <option value="general">일반</option>
                                        <option value="event">이벤트</option>
                                        <option value="shipping">배송공지</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-stone-700 mb-1">전시 여부 *</label>
                                    <select
                                        value={annoStatus}
                                        onChange={(e) => setAnnoStatus(e.target.value as any)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-stone-700 outline-none"
                                    >
                                        <option value="display">전시중</option>
                                        <option value="stop">전시중지</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-stone-700 mb-1">공지 제목 *</label>
                                <input 
                                    type="text"
                                    required
                                    placeholder="예: 설 연휴 기간 택배 배송 마감 스케줄 안내"
                                    value={annoTitle}
                                    onChange={(e) => setAnnoTitle(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-stone-700 outline-none focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-stone-700 mb-1">공지 상세 내용 *</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="공지사항 세부 내용을 기입해 주세요."
                                    value={annoContent}
                                    onChange={(e) => setAnnoContent(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-stone-700 outline-none focus:bg-white leading-relaxed"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-stone-700 mb-1">노출 시작일 *</label>
                                    <input 
                                        type="date"
                                        required
                                        value={annoStartDate}
                                        onChange={(e) => setAnnoStartDate(e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-stone-700 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-stone-700 mb-1">노출 종료일 *</label>
                                    <input 
                                        type="date"
                                        required
                                        value={annoEndDate}
                                        onChange={(e) => setAnnoEndDate(e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-stone-700 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-stone-50/50 border-t border-stone-100 flex items-center justify-end gap-2">
                            <button type="button" onClick={() => setIsAnnoModalOpen(false)} className="px-4 py-2.5 bg-white border border-stone-200 text-stone-600 rounded-xl font-bold">
                                취소
                            </button>
                            <button type="submit" className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-soft">
                                저장 완료
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ---------------- SHIPPING BUNDLE GROUP DIALOG MODAL ---------------- */}
            {isBundleModalOpen && (
                <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <form onSubmit={handleSaveBundleGroup} className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-150 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                                <Truck size={16} className="text-blue-500" />
                                <span>{editingBundle ? '배송비 묶음그룹 설정 수정' : '배송비 묶음그룹 추가'}</span>
                            </h2>
                            <button type="button" onClick={() => setIsBundleModalOpen(false)} className="p-2 text-stone-400 hover:text-stone-600 rounded-xl">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 text-sm">
                            <div>
                                <label className="block font-bold text-stone-700 mb-1">묶음그룹명 *</label>
                                <input 
                                    type="text"
                                    required
                                    placeholder="예: 기본 배송비 묶음그룹, 도서용 바늘 배송 그룹"
                                    value={bundleName}
                                    onChange={(e) => setBundleName(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-stone-700 outline-none focus:bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-stone-700 mb-1">계산방식 *</label>
                                    <select
                                        value={bundleCalcMethod}
                                        onChange={(e) => setBundleCalcMethod(e.target.value as any)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-stone-700 outline-none"
                                    >
                                        <option value="min">최소부과 (가장 저렴한 배송비 적용)</option>
                                        <option value="max">최대부과 (가장 비싼 배송비 적용)</option>
                                        <option value="item">개별부과 (수량별 개별 배송비 부과)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-stone-700 mb-1">계약 택배사 연동 *</label>
                                    <select
                                        value={bundleCarrier}
                                        onChange={(e) => setBundleCarrier(e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-stone-700 outline-none border-l-4 border-l-blue-500"
                                    >
                                        {carriers.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-stone-700 mb-1">배송비 권역구분 *</label>
                                    <select
                                        value={bundleRegionType}
                                        onChange={(e) => setBundleRegionType(e.target.value as any)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-stone-700 outline-none"
                                    >
                                        <option value="2">2권역 (제주 추가)</option>
                                        <option value="3">3권역 (제주 / 도서산간 추가)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-stone-700 mb-1">사용 여부 *</label>
                                    <select
                                        value={bundleUseYn}
                                        onChange={(e) => setBundleUseYn(e.target.value as any)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-stone-700 outline-none"
                                    >
                                        <option value="Y">사용</option>
                                        <option value="N">미사용</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-3">
                                <div>
                                    <label className="block font-bold text-stone-700 mb-1">제주 추가 배송비 (원) *</label>
                                    <input 
                                        type="number"
                                        required
                                        value={bundleRegion2Fee}
                                        onChange={(e) => setBundleRegion2Fee(e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-stone-700 outline-none focus:bg-white"
                                    />
                                </div>
                                {bundleRegionType === '3' && (
                                    <div>
                                        <label className="block font-bold text-stone-700 mb-1">도서산간 추가 배송비 (원) *</label>
                                        <input 
                                            type="number"
                                            required
                                            value={bundleRegion3Fee}
                                            onChange={(e) => setBundleRegion3Fee(e.target.value)}
                                            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-bold text-stone-700 outline-none focus:bg-white"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-stone-50/50 border-t border-stone-100 flex items-center justify-end gap-2">
                            <button type="button" onClick={() => setIsBundleModalOpen(false)} className="px-4 py-2.5 bg-white border border-stone-200 text-stone-600 rounded-xl font-bold">
                                취소
                            </button>
                            <button type="submit" className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-soft">
                                저장 완료
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
