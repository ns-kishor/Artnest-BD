"use client";

import { Heart, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { useUIStore } from "@/lib/artnest/navigator";
import { useCartStore } from "@/lib/artnest/cart-store";
import { useStoreData } from "./store-data";
import { ProductCard } from "./product-card";
import { formatBDT } from "@/lib/artnest/format";
import type { Product } from "@/lib/artnest/types";

export function WishlistView() {
  const navigate = useUIStore((s) => s.navigate);
  const wishlist = useCartStore((s) => s.wishlist);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const addItem = useCartStore((s) => s.addItem);
  const { products, loading } = useStoreData();

  const saved = products.filter((p) => wishlist.includes(p.id));

  const moveToCart = (product: Product) => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "/images/cat-lifestyle.png",
      color: product.colors[0] ?? null,
      stock: product.stock,
    });
    toggleWishlist(product.id);
    toast.success("Moved to cart", { description: product.name });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6" id="main">
      <header className="mx-auto max-w-2xl text-center">
        <p className="mb-3 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-clay">
          <span aria-hidden="true" className="inline-block h-px w-6 bg-clay" />
          Saved Pieces
          <span aria-hidden="true" className="inline-block h-px w-6 bg-clay" />
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl">Your Wishlist</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Beautiful things you&apos;re thinking about. Saved on this device, ready
          whenever you are.
        </p>
      </header>

      {loading ? (
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-square w-full animate-pulse rounded-xl bg-secondary" />
              <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-secondary" />
            </div>
          ))}
        </div>
      ) : saved.length === 0 ? (
        <div className="mx-auto mt-14 flex max-w-md flex-col items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Heart className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
          </div>
          <p className="mt-5 font-serif text-2xl">Nothing saved yet</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Tap the heart on any piece to keep it here for later.
          </p>
          <button
            onClick={() => navigate({ name: "shop" })}
            className="mt-7 h-12 rounded-full bg-espresso px-8 text-sm font-semibold text-ivory transition hover:bg-espresso/90"
          >
            Discover Décor
          </button>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {saved.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => moveToCart(product)}
                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-espresso text-xs font-medium text-ivory transition hover:bg-espresso/90"
                >
                  <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                  Move to Cart
                </button>
                <button
                  onClick={() => {
                    toggleWishlist(product.id);
                    toast.success("Removed from wishlist", { description: product.name });
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-destructive hover:text-destructive"
                  aria-label={`Remove ${product.name} from wishlist`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1.5 text-center text-xs text-muted-foreground">
                {formatBDT(product.price)}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
