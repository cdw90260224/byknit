'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';

export function CartIcon() {
    const { items, toggleCart, _hasHydrated } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const itemCount = mounted && _hasHydrated ? items.length : 0;

    return (
        <button
            onClick={toggleCart}
            className="p-2 rounded-full text-brown-600 hover:text-rose-500 hover:bg-rose-50/50 transition-all relative group flex items-center justify-center"
            title="Shopping Cart"
        >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in duration-200 border-2 border-white shadow-soft">
                    {itemCount > 9 ? '9+' : itemCount}
                </span>
            )}
        </button>
    );
}
