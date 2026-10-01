"use client";

import Image from "next/image";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/artnest/types";
import { discountPercent, formatBDT } from "@/lib/artnest/format";
import { useCartStore } from "@/lib/artnest/cart-store";
import { useUIStore } from "@/lib/artnest/navigator";
import { StarRating } from "./star-rating";
import { QuickViewDialog } from "./quick-view-dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const wishlist = useCartStore((s) => s.wishlist);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);
  const navigate = useUIStore((s) => s.navigate);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const wishlisted = wishlist.includes(product.id);
  const discount = discountPercent(product.price, product.comparePrice);
  const firstImage = product.images[0] ?? "/images/cat-lifestyle.png";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: firstImage,
      color: product.colors[0] ?? null,
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart`, {
      description: formatBDT(product.price),
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.success(wishlisted ? "Removed from wishlist" : "Saved to wishlist", {
      description: product.name,
    });
  };

  const openProduct = () => navigate({ name: "product", slug: product.slug });

  return (
    <article
      className={cn("group flex flex-col", className)}
      aria-label={product.name}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/60 bg-secondary">
        <button
          onClick={openProduct}
          className="absolute inset-0 h-full w-full cursor-pointer"
          aria-label={`View ${product.name}`}
        />
        <Image
          src={firstImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount !== null && (
            <span className="rounded-full bg-clay px-2.5 py-1 text-[11px] font-semibold text-ivory shadow-sm">
              −{discount}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="rounded-full bg-ivory/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-espresso shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-espresso shadow-sm backdrop-blur transition hover:bg-ivory focus-visible:ring-2 focus-visible:ring-ring md:opacity-0 md:group-hover:opacity-100"
        >
          <Heart
            className={cn("h-4 w-4 transition", wishlisted && "fill-clay text-clay")}
          />
        </button>

        {/* Hover actions */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden translate-y-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:flex">
          <button
            onClick={handleAddToCart}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-espresso text-sm font-medium text-ivory shadow-lg transition hover:bg-espresso/90"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Add to Cart
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewOpen(true);
            }}
            aria-label={`Quick view ${product.name}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory/95 text-espresso shadow-lg transition hover:bg-ivory"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 pt-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {product.categoryName}
        </p>
        <button
          onClick={openProduct}
          className="text-left text-[15px] font-medium leading-snug text-foreground hover:text-clay"
        >
          {product.name}
        </button>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-[15px] font-semibold text-foreground">
            {formatBDT(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatBDT(product.comparePrice)}
            </span>
          )}
        </div>
        {/* Mobile add-to-cart */}
        <button
          onClick={handleAddToCart}
          className="mt-2 flex h-10 items-center justify-center gap-2 rounded-full border border-espresso/20 bg-ivory text-sm font-medium text-espresso transition hover:bg-espresso hover:text-ivory md:hidden"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Add to Cart
        </button>
      </div>

      <QuickViewDialog
        product={product}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </article>
  );
}
