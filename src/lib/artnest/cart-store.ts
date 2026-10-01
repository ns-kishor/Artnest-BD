"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./types";

interface CartState {
  items: CartItem[];
  wishlist: string[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, color: string | null) => void;
  setQuantity: (productId: string, color: string | null, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
}

function itemKey(productId: string, color: string | null) {
  return `${productId}::${color ?? ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      addItem: (item, quantity = 1) => {
        const key = itemKey(item.productId, item.color);
        const existing = get().items.find(
          (i) => itemKey(i.productId, i.color) === key
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              itemKey(i.productId, i.color) === key
                ? { ...i, quantity: Math.min(i.quantity + quantity, Math.max(i.stock, 1)) }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity }] });
        }
      },
      removeItem: (productId, color) => {
        const key = itemKey(productId, color);
        set({ items: get().items.filter((i) => itemKey(i.productId, i.color) !== key) });
      },
      setQuantity: (productId, color, quantity) => {
        const key = itemKey(productId, color);
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => itemKey(i.productId, i.color) !== key) });
          return;
        }
        set({
          items: get().items.map((i) =>
            itemKey(i.productId, i.color) === key
              ? { ...i, quantity: Math.min(quantity, Math.max(i.stock, 1)) }
              : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      toggleWishlist: (productId) => {
        const list = get().wishlist;
        set({
          wishlist: list.includes(productId)
            ? list.filter((id) => id !== productId)
            : [...list, productId],
        });
      },
    }),
    { name: "artnest-cart-v1" }
  )
);

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
