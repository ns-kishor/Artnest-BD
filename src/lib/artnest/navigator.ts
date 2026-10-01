"use client";

import { create } from "zustand";

export type SortKey = "featured" | "newest" | "popular" | "price-asc" | "price-desc";

export type View =
  | { name: "home"; hash?: string }
  | {
      name: "shop";
      category?: string;
      room?: string;
      theme?: string;
      sort?: SortKey;
      onlyNew?: boolean;
    }
  | { name: "product"; slug: string }
  | { name: "checkout" }
  | { name: "confirmation"; orderNumber: string }
  | { name: "wishlist" }
  | { name: "about" }
  | { name: "contact" };

interface UIState {
  view: View;
  cartOpen: boolean;
  searchOpen: boolean;
  accountOpen: boolean;
  mobileMenuOpen: boolean;
  navigate: (view: View, viaHistory?: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setAccountOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

const HISTORY_KEY = "artnest-view";

export const useUIStore = create<UIState>((set, get) => ({
  view: { name: "home" },
  cartOpen: false,
  searchOpen: false,
  accountOpen: false,
  mobileMenuOpen: false,
  navigate: (view, viaHistory = false) => {
    set({
      view,
      cartOpen: false,
      searchOpen: false,
      accountOpen: false,
      mobileMenuOpen: false,
    });
    if (!viaHistory && typeof window !== "undefined") {
      try {
        window.history.pushState({ [HISTORY_KEY]: view }, "");
      } catch {
        /* history unavailable — state navigation still works */
      }
    }
  },
  setCartOpen: (open) => set({ cartOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setAccountOpen: (open) => set({ accountOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
}));

/** Wire browser back/forward buttons to view navigation. Call once on mount. */
export function initHistorySync() {
  if (typeof window === "undefined") return () => {};
  const initial = getInitialView();
  try {
    window.history.replaceState({ [HISTORY_KEY]: initial }, "");
  } catch {
    /* ignore */
  }
  const onPopState = (event: PopStateEvent) => {
    const view = (event.state as Record<string, unknown> | null)?.[HISTORY_KEY] as
      | View
      | undefined;
    useUIStore.getState().navigate(view ?? { name: "home" }, true);
  };
  window.addEventListener("popstate", onPopState);
  return () => window.removeEventListener("popstate", onPopState);
}

function getInitialView(): View {
  const state = useUIStore.getState().view;
  return state;
}
