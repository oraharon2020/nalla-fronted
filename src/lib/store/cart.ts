import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  price: string;
  quantity: number;
  image?: {
    sourceUrl: string;
    altText?: string;
  };
  variation?: {
    id: string;
    name: string;
    attributes: { name: string; value: string }[];
  };
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  isHydrated: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getCheckoutUrl: () => string;
  setHydrated: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isHydrated: false,

      setHydrated: () => set({ isHydrated: true }),

      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => 
          i.id === item.id && 
          i.variation?.id === item.variation?.id
        );

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id && i.variation?.id === item.variation?.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
        get().openCart();
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
          return total + price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getCheckoutUrl: () => {
        const items = get().items;
        if (items.length === 0) return 'https://bellano.co.il/checkout';
        
        // For single item - simple add-to-cart URL
        if (items.length === 1) {
          const item = items[0];
          const productId = item.variation?.id 
            ? parseInt(item.variation.id.replace('variation-', ''))
            : item.databaseId;
          return `https://bellano.co.il/?add-to-cart=${productId}&quantity=${item.quantity}`;
        }
        
        // For multiple items - add first item, the rest will be handled by a special page
        // This is a WooCommerce limitation
        const firstItem = items[0];
        const firstProductId = firstItem.variation?.id 
          ? parseInt(firstItem.variation.id.replace('variation-', ''))
          : firstItem.databaseId;
        
        // Encode remaining items
        const remainingItems = items.slice(1).map(item => ({
          id: item.variation?.id 
            ? parseInt(item.variation.id.replace('variation-', ''))
            : item.databaseId,
          qty: item.quantity
        }));
        
        const baseUrl = `https://bellano.co.il/?add-to-cart=${firstProductId}&quantity=${firstItem.quantity}`;
        
        if (remainingItems.length > 0) {
          return `${baseUrl}&bellano_more=${encodeURIComponent(JSON.stringify(remainingItems))}`;
        }
        
        return baseUrl;
      },
    }),
    {
      name: 'bellano-cart',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
      partialize: (state) => ({ items: state.items }), // Don't persist isOpen or isHydrated
    }
  )
);
