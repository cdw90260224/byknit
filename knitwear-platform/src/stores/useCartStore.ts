import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: string;
    title: { ko?: string; en?: string } | string;
    priceKrw: number;
    image: string;
    designerName?: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    _hasHydrated: boolean;

    addItem: (item: CartItem) => boolean; // returns true if newly added, false if already in cart
    removeItem: (id: string) => void;
    clearCart: () => void;
    toggleCart: () => void;
    setIsOpen: (isOpen: boolean) => void;
    setHasHydrated: (state: boolean) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            _hasHydrated: false,

            addItem: (item: CartItem) => {
                const currentItems = get().items;
                const exists = currentItems.some((i) => i.id === item.id);
                if (exists) {
                    return false;
                }
                set({ items: [...currentItems, item], isOpen: true });
                return true;
            },

            removeItem: (id: string) => {
                set({ items: get().items.filter((item) => item.id !== id) });
            },

            clearCart: () => {
                set({ items: [] });
            },

            toggleCart: () => {
                set((state) => ({ isOpen: !state.isOpen }));
            },

            setIsOpen: (isOpen: boolean) => {
                set({ isOpen });
            },

            setHasHydrated: (state: boolean) => {
                set({ _hasHydrated: state });
            },
        }),
        {
            name: 'knitwear-cart-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
