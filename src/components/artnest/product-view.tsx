"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Minus,
  Plus,
  Heart,
  ShoppingBag,
  Truck,
  Undo2,
  ShieldCheck,
  ChevronRight,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useUIStore } from "@/lib/artnest/navigator";
import { useCartStore } from "@/lib/artnest/cart-store";
import { useStoreData } from "./store-data";
import { discountPercent, formatBDT, DELIVERY } from "@/lib/artnest/format";
import { StarRating } from "./star-rating";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

export function ProductView({ slug }: { slug: string }) {
  const navigate = useUIStore((s) => s.navigate);
  const { productBySlug, reviews, loading, relatedProducts, productsByCategory } = useStoreData();
  const addItem = useCartStore((s) => s.addItem);
  const wishlist = useCartStore((s) => s.wishlist);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);

  const product = productBySlug(slug);
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [colorOverride, setColorOverride] = useState<string | null>(null);
  const color = colorOverride ?? product?.colors[0] ?? null;

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6" id="main">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-secondary" />
          <div className="space-y-4">
            <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-secondary" />
            <div className="h-4 w-40 animate-pulse rounded bg-secondary" />
            <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
            <div className="h-24 w-full animate-pulse rounded bg-secondary" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-24 text-center sm:px-6" id="main">
        <p className="font-serif text-3xl">We couldn&apos;t find that piece</p>
        <p className="mt-3 text-muted-foreground">It may have been moved or renamed.</p>
        <button
          onClick={() => navigate({ name: "shop" })}
          className="mt-8 h-12 rounded-full bg-espresso px-8 text-sm font-semibold text-ivory transition hover:bg-espresso/90"
        >
          Back to the Shop
        </button>
      </main>
    );
  }

  const discount = discountPercent(product.price, product.comparePrice);
  const wishlisted = wishlist.includes(product.id);
  const productReviews = reviews.filter((r) => r.productSlug === product.slug);
  const related = relatedProducts(product, 4);
  const siblings = productsByCategory(product.categorySlug);

  const addToCart = (redirect?: "checkout") => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0] ?? "/images/cat-lifestyle.png",
        color,
        stock: product.stock,
      },
      quantity
    );
    if (redirect === "checkout") {
      navigate({ name: "checkout" });
    } else {
      toast.success(`${product.name} added to cart`, {
        description: `${quantity} × ${formatBDT(product.price)}`,
        action: { label: "View Cart", onClick: () => useUIStore.getState().setCartOpen(true) },
      });
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6" id="main">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <button onClick={() => navigate({ name: "home" })} className="hover:text-foreground">
          Home
        </button>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <button onClick={() => navigate({ name: "shop" })} className="hover:text-foreground">
          Shop
        </button>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <button
          onClick={() => navigate({ name: "shop", category: product.categorySlug })}
          className="hover:text-foreground"
        >
          {product.categoryName}
        </button>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-secondary">
            <Image
              src={product.images[imageIndex] ?? product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-opacity duration-300"
            />
            {discount !== null && (
              <span className="absolute left-4 top-4 rounded-full bg-clay px-3 py-1.5 text-xs font-semibold text-ivory shadow">
                −{discount}% Today
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={cn(
                "absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/90 text-espresso shadow backdrop-blur transition hover:bg-ivory",
                wishlisted && "text-clay"
              )}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wishlisted}
            >
              <Heart className={cn("h-5 w-5", wishlisted && "fill-clay")} />
            </button>
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3" role="tablist" aria-label="Product images">
              {product.images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setImageIndex(i)}
                  role="tab"
                  aria-selected={i === imageIndex}
                  aria-label={`Show image ${i + 1}`}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition",
                    i === imageIndex ? "border-clay" : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            {product.categoryName}
          </p>
          <h1 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl text-balance">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <StarRating rating={product.rating} count={product.reviewCount} size={16} />
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                product.stock > 0 ? "bg-secondary text-secondary-foreground" : "bg-destructive/10 text-destructive"
              )}
            >
              {product.stock > 0 ? `In stock — ${product.stock} left` : "Out of stock"}
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-semibold tracking-tight">{formatBDT(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatBDT(product.comparePrice)}
                </span>
                <span className="rounded-full bg-clay/10 px-2.5 py-1 text-xs font-semibold text-clay">
                  Save {formatBDT(product.comparePrice - product.price)}
                </span>
              </>
            )}
          </div>

          <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Colour — <span className="text-foreground">{color}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColorOverride(c)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition",
                      color === c
                        ? "border-espresso bg-espresso text-ivory"
                        : "border-border text-foreground/75 hover:border-clay hover:text-clay"
                    )}
                    aria-pressed={color === c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + CTAs */}
          <div className="mt-7 flex flex-wrap items-stretch gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-12 w-11 items-center justify-center rounded-l-full text-muted-foreground transition hover:text-foreground disabled:opacity-40"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="flex h-12 w-11 items-center justify-center rounded-r-full text-muted-foreground transition hover:text-foreground"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => addToCart()}
              disabled={product.stock === 0}
              className="flex h-12 min-w-[180px] flex-1 items-center justify-center gap-2 rounded-full bg-espresso px-6 text-sm font-semibold text-ivory transition hover:bg-espresso/90 disabled:opacity-50 sm:flex-none"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Add to Cart
            </button>
            <button
              onClick={() => addToCart("checkout")}
              disabled={product.stock === 0}
              className="flex h-12 min-w-[140px] flex-1 items-center justify-center gap-2 rounded-full border border-clay bg-clay/5 px-6 text-sm font-semibold text-clay transition hover:bg-clay hover:text-ivory disabled:opacity-50 sm:flex-none"
            >
              <Zap className="h-4 w-4" aria-hidden="true" />
              Buy Now
            </button>
          </div>

          {/* Trust row */}
          <div className="mt-7 grid grid-cols-1 gap-3 rounded-2xl border border-border/70 bg-card p-4 sm:grid-cols-3">
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <Truck className="h-4 w-4 shrink-0 text-clay" aria-hidden="true" />
              Cash on Delivery available
            </div>
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <Undo2 className="h-4 w-4 shrink-0 text-clay" aria-hidden="true" />
              7-day easy returns
            </div>
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-clay" aria-hidden="true" />
              Wrapped with care
            </div>
          </div>

          {/* Details accordion */}
          <Accordion type="multiple" defaultValue={["details"]} className="mt-8">
            <AccordionItem value="details">
              <AccordionTrigger className="font-serif text-base">Product Details</AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                {product.description}
              </AccordionContent>
            </AccordionItem>
            {product.dimensions && (
              <AccordionItem value="dimensions">
                <AccordionTrigger className="font-serif text-base">Dimensions</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {product.dimensions}
                </AccordionContent>
              </AccordionItem>
            )}
            {product.material && (
              <AccordionItem value="material">
                <AccordionTrigger className="font-serif text-base">Material</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {product.material}
                </AccordionContent>
              </AccordionItem>
            )}
            {product.careInstructions && (
              <AccordionItem value="care">
                <AccordionTrigger className="font-serif text-base">Care Instructions</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {product.careInstructions}
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="delivery">
              <AccordionTrigger className="font-serif text-base">Delivery Information</AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                Inside Dhaka {formatBDT(DELIVERY.INSIDE_DHAKA)} (free over{" "}
                {formatBDT(DELIVERY.FREE_THRESHOLD)}) — delivered in{" "}
                {DELIVERY.INSIDE_DHAKA_DAYS}. Outside Dhaka{" "}
                {formatBDT(DELIVERY.OUTSIDE_DHAKA)} — delivered in{" "}
                {DELIVERY.OUTSIDE_DHAKA_DAYS}. Cash on Delivery available
                nationwide.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger className="font-serif text-base">Return Policy</AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                Changed your mind, or the piece arrived damaged? Contact us within
                7 days of delivery. Items must be unused and in original
                packaging; we arrange the return and refund or replace promptly.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Reviews */}
      {productReviews.length > 0 && (
        <section className="mt-16 border-t border-border pt-12" aria-labelledby="product-reviews">
          <h2 id="product-reviews" className="font-serif text-2xl sm:text-3xl">
            What customers say
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {productReviews.map((r) => (
              <figure key={r.id} className="rounded-2xl border border-border/70 bg-card p-6">
                <StarRating rating={r.rating} />
                <blockquote className="mt-3 text-[15px] leading-relaxed">
                  “{r.comment}”
                </blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{r.customerName}</span>
                  {r.location && ` — ${r.location}`}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-12" aria-labelledby="related">
          <div className="mb-8 flex items-end justify-between">
            <h2 id="related" className="font-serif text-2xl sm:text-3xl">
              You may also like
            </h2>
            {siblings.length > 1 && (
              <button
                onClick={() => navigate({ name: "shop", category: product.categorySlug })}
                className="text-sm font-medium text-clay underline-offset-4 hover:underline"
              >
                All {product.categoryName}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
