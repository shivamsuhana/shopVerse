import { create } from 'zustand';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// Helper: compute subtotal from items
export function computeSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

// Helper: compute tax (18% GST)
export function computeTax(items: CartItem[]): number {
  return Math.round(computeSubtotal(items) * 0.18);
}

// Helper: compute total
export function computeTotal(items: CartItem[]): number {
  return computeSubtotal(items) + computeTax(items);
}

// Helper: compute item count
export function computeItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

// Load initial items from localStorage
function loadCartItems(): CartItem[] {
  try {
    const raw = localStorage.getItem('cart_items');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCartItems(items: CartItem[]) {
  localStorage.setItem('cart_items', JSON.stringify(items));
}

export const useCartStore = create<CartState>((set) => ({
  items: loadCartItems(),

  addItem: (product: Product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find(item => item.product.id === product.id);
      let newItems: CartItem[];

      if (existing) {
        newItems = state.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity }];
      }

      saveCartItems(newItems);
      return { items: newItems };
    });
  },

  removeItem: (productId: string) => {
    set((state) => {
      const newItems = state.items.filter(item => item.product.id !== productId);
      saveCartItems(newItems);
      return { items: newItems };
    });
  },

  updateQuantity: (productId: string, quantity: number) => {
    set((state) => {
      if (quantity <= 0) {
        const newItems = state.items.filter(item => item.product.id !== productId);
        saveCartItems(newItems);
        return { items: newItems };
      }
      const newItems = state.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      saveCartItems(newItems);
      return { items: newItems };
    });
  },

  clearCart: () => {
    localStorage.removeItem('cart_items');
    set({ items: [] });
  },
}));
