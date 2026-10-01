"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUIStore, type View } from "@/lib/artnest/navigator";
import { useStoreData } from "./store-data";
import { ProductCard } from "./product-card";
import { SectionHeading } from "./section-heading";
import { Hero } from "./hero";
import {
  CategorySection,
  EditorialBanner,
  RoomSection,
  ReviewsSection,
  SmallDetailsSection,
  SocialSection,
  StyleThemesSection,
  WhySection,
} from "./home-sections";

export function HomeView() {
  const { view } = useUIStore();
  const hash = view.name === "home" ? view.hash : undefined;

  // Scroll to requested section when arriving with a hash (e.g. "Categories")
  useEffect(() => {
    if (hash) {
      const t = window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 120);
      return () => window.clearTimeout(t);
    }
  }, [hash]);

  return (
    <main id="main">
      <Hero />
      <CategorySection />
      <FeaturedCollection />
      <BestSellers />
      <EditorialBanner
        image="/images/banner-details.png"
        eyebrow="Artnest BD Editorial"
        title="Small Details. Big Difference."
        description="Discover décor pieces that bring personality to your space — styled here with our editors' favourite picks."
        cta="Shop Collection"
        onClick={() => window.dispatchEvent(new CustomEvent("artnest:shop-featured"))}
      />
      <NewArrivals />
      <RoomSection />
      <WhySection />
      <StyleThemesSection />
      <SmallDetailsSection />
      <ReviewsSection />
      <SocialSection />
    </main>
  );
}

/* --------------------------- Featured Collection --------------------------- */

function FeaturedCollection() {
  const navigate = useUIStore((s) => s.navigate);
  const { products, loading } = useStoreData();
  const featured = products.filter((p) => p.isFeatured).slice(0, 8);

  // Editorial banner CTA scrolls/links to this collection
  useEffect(() => {
    const handler = () => navigate({ name: "shop" });
    window.addEventListener("artnest:shop-featured", handler);
    return () => window.removeEventListener("artnest:shop-featured", handler);
  }, [navigate]);

  return (
    <section className="bg-secondary/60 py-14 lg:py-20" aria-labelledby="collections">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="collections"
          eyebrow="Featured Collection"
          title={
            <>
              Curated for <em className="italic text-clay">Your Space</em>
            </>
          }
          description="Small details can completely transform the feeling of a room. Start with these."
          action={{ label: "Shop all décor", onClick: () => navigate({ name: "shop" }) }}
        />
        <ProductGridSkeleton show={loading} count={8} />
        {!loading && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------- Best Sellers ------------------------------ */

function BestSellers() {
  const navigate = useUIStore((s) => s.navigate);
  const { products, loading } = useStoreData();
  const best = products
    .filter((p) => p.isBestSeller)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20" aria-labelledby="best-sellers">
      <SectionHeading
        id="best-sellers"
        eyebrow="Best Sellers"
        title={
          <>
            Most <em className="italic text-clay">Loved</em>
          </>
        }
        description="The pieces our customers keep coming back for."
        action={{ label: "Shop best sellers", onClick: () => navigate({ name: "shop", sort: "popular" }) }}
      />
      <ProductGridSkeleton show={loading} count={4} />
      {!loading && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {best.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ------------------------------- New Arrivals ------------------------------ */

function NewArrivals() {
  const navigate = useUIStore((s) => s.navigate);
  const { products, loading } = useStoreData();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const arrivals = products
    .filter((p) => p.isNewArrival)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const scrollBy = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 300, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20" aria-labelledby="new-arrivals">
      <SectionHeading
        id="new-arrivals"
        eyebrow="New Arrivals"
        title={
          <>
            Just <em className="italic text-clay">In</em>
          </>
        }
        description="Fresh pieces for your next little home refresh."
        action={{ label: "Shop new arrivals", onClick: () => navigate({ name: "shop", onlyNew: true }) }}
      />
      <ProductGridSkeleton show={loading} count={4} horizontal />
      {!loading && (
        <div className="relative">
          <div
            ref={scrollerRef}
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
            role="list"
            aria-label="New arrivals carousel"
          >
            {arrivals.map((product) => (
              <div
                key={product.id}
                role="listitem"
                className="w-[46vw] shrink-0 snap-start sm:w-[240px] lg:w-[262px]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={() => scrollBy(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-clay hover:text-clay"
              aria-label="Scroll new arrivals left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-clay hover:text-clay"
              aria-label="Scroll new arrivals right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* -------------------------------- Skeleton -------------------------------- */

function ProductGridSkeleton({
  show,
  count,
  horizontal = false,
}: {
  show: boolean;
  count: number;
  horizontal?: boolean;
}) {
  if (!show) return null;
  return (
    <div
      className={
        horizontal
          ? "flex gap-4 overflow-hidden"
          : "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4"
      }
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={horizontal ? "w-[240px] shrink-0" : ""}>
          <div className="aspect-square w-full animate-pulse rounded-xl bg-secondary" />
          <div className="mt-3 h-3 w-1/3 animate-pulse rounded bg-secondary" />
          <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-secondary" />
          <div className="mt-2 h-3 w-1/4 animate-pulse rounded bg-secondary" />
        </div>
      ))}
    </div>
  );
}
