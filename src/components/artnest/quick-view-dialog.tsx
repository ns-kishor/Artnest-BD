"use client";

import Image from "next/image";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Product } from "@/lib/artnest/types";
import { discountPercent, formatBDT } from "@/lib/artnest/format";
import { useCartStore } from "@/lib/artnest/cart-store";
import { useUIStore } from "@/lib/artnest/navigator";
import { StarRating } from "./star-rating";
import { cn } from "@/lib/utils";

export function QuickViewDialog({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const wishlist = useCartStore((s) => s.wishlist);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const navigate = useUIStore((s) => s.navigate);

  const wishlisted = wishlist.includes(product.id);
  const discount = discountPercent(product.price, product.comparePrice);

  const addToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "/images/cat-lifestyle.png",
      color: product.colors[0] ?? null,
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden rounded-2xl p-0">
        <div className="grid sm:grid-cols-2">
          <div className="relative aspect-square bg-secondary">
            <Image
              src={product.images[0] ?? "/images/cat-lifestyle.png"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 320px"
              className="object-cover"
            />
            {discount !== null && (
              <span className="absolute left-3 top-3 rounded-full bg-clay px-2.5 py-1 text-[11px] font-semibold text-ivory">
                −{discount}%
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 p-5 sm:p-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {product.categoryName}
            </p>
            <DialogTitle asChild>
              <h3 className="font-serif text-2xl leading-snug">{product.name}</h3>
            </DialogTitle>
            <StarRating rating={product.rating} count={product.reviewCount} />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.shortDescription}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold">{formatBDT(product.price)}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatBDT(product.comparePrice)}
                </span>
              )}
            </div>
            <div className="mt-auto flex flex-col gap-2 pt-2">
              <button
                onClick={addToCart}
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-espresso text-sm font-medium text-ivory transition hover:bg-espresso/90"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Add to Cart
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    toggleWishlist(product.id);
                    toast.success(wishlisted ? "Removed from wishlist" : "Saved to wishlist");
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition hover:border-clay hover:text-clay"
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={cn("h-4 w-4", wishlisted && "fill-clay text-clay")} />
                </button>
                <button
                  onClick={() => {
                    onOpenChange(false);
                    navigate({ name: "product", slug: product.slug });
                  }}
                  className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-border text-sm font-medium text-foreground transition hover:border-clay hover:text-clay"
                >
                  Full Details
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
