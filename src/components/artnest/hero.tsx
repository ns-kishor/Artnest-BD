"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Truck,
  Undo2,
  Star,
} from "lucide-react";
import { useUIStore } from "@/lib/artnest/navigator";
import { useStoreData } from "./store-data";
import { formatBDT } from "@/lib/artnest/format";
import { cn } from "@/lib/utils";

/**
 * The owner's own store photography — every piece belongs to the
 * Wall Décor category. They appear one after another in the hero.
 */
const HERO_SLIDES: { slug: string; image: string; alt: string }[] = [
  {
    slug: "rattan-blossom-wall-set",
    image: "/images/products/rattan-blossom-wall-set.jpg",
    alt: "Handwoven rattan blossom wall set in three sizes hanging on a warm sunlit wall",
  },
  {
    slug: "bloom-rope-wall-mirror",
    image: "/images/products/bloom-rope-wall-mirror.jpg",
    alt: "Round mirror framed in deep green rope with bright fabric blooms and wooden beads",
  },
  {
    slug: "nature-canvas-triptych",
    image: "/images/products/nature-canvas-triptych.jpg",
    alt: "Three vivid nature landscape canvas paintings arranged in a triangle on a wall",
  },
  {
    slug: "rattan-ring-planter-pink",
    image: "/images/products/rattan-ring-planter-pink.jpg",
    alt: "Suspended cane ring planter holding a woven pot of pink star blooms",
  },
  {
    slug: "amber-glow-lamp",
    image: "/images/products/amber-glow-lamp.jpg",
    alt: "Amber mini lamp casting rosette light patterns across a table at night",
  },
  {
    slug: "hanging-coco-basket",
    image: "/images/products/hanging-coco-basket.jpg",
    alt: "Handwoven coir hanging basket styled with pink lily blooms and greenery",
  },
  {
    slug: "sunset-blossom-pearl-vase",
    image: "/images/products/sunset-blossom-pearl-vase.jpg",
    alt: "Fiery orange sunset blossoms arranged in a pearl-beaded vase",
  },
  {
    slug: "rattan-ring-planter-cascade",
    image: "/images/products/rattan-ring-planter-cascade.jpg",
    alt: "Cane ring wall planter with trailing jade vines cascading down a wall",
  },
  {
    slug: "mini-led-table-lamp",
    image: "/images/products/mini-led-table-lamp.jpg",
    alt: "Pastel mini LED table lamps glowing beside colourful tulip stems",
  },
  {
    slug: "jute-flower-placemat-set",
    image: "/images/products/jute-flower-placemat-set.jpg",
    alt: "Hand-braided jute flower-shaped placemats styled with rose vines",
  },
];

const AUTOPLAY_MS = 4200;

const reducedMotionSubscribe = (onChange: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    reducedMotionSubscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

export function Hero() {
  const navigate = useUIStore((s) => s.navigate);
  const { products, loading } = useStoreData();
  const reduced = usePrefersReducedMotion();

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const productBySlug = useMemo(() => {
    const map = new Map<string, (typeof products)[number]>();
    for (const p of products) map.set(p.slug, p);
    return map;
  }, [products]);

  // Auto-advance: one product after another
  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, reduced]);

  const goTo = (i: number) => setIndex((i + HERO_SLIDES.length) % HERO_SLIDES.length);

  const chipProduct = productBySlug.get(HERO_SLIDES[index].slug);

  const scrollToCollections = () => {
    document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      {/* decorative shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-secondary blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-secondary/70 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-14 lg:pb-20 lg:pt-16">
        {/* Copy */}
        <div className="lg:col-span-5">
          <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-clay">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-clay" />
            Home • Decor • Lifestyle
          </p>
          <h1
            id="hero-heading"
            className="font-serif text-[2.6rem] leading-[1.08] sm:text-5xl lg:text-[3.6rem] xl:text-6xl text-balance"
          >
            Make Space for{" "}
            <em className="italic text-clay">Beautiful</em> Things.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Discover thoughtfully selected décor and lifestyle pieces designed to
            bring warmth, character and beauty into your everyday spaces.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate({ name: "shop" })}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-espresso px-7 text-sm font-semibold text-ivory shadow-lg shadow-espresso/20 transition hover:bg-espresso/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Shop Décor
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>
            <button
              onClick={scrollToCollections}
              className="inline-flex h-12 items-center rounded-full border border-espresso/25 bg-transparent px-7 text-sm font-semibold text-espresso transition hover:border-espresso hover:bg-espresso hover:text-ivory dark:border-ivory/30 dark:text-ivory dark:hover:bg-ivory dark:hover:text-espresso focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Explore Collection
            </button>
          </div>

          <ul className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-bronze text-bronze" aria-hidden="true" />
              Loved by homes across Bangladesh
            </li>
            <li className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5" aria-hidden="true" />
              Nationwide delivery
            </li>
            <li className="flex items-center gap-1.5">
              <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
              7-day easy returns
            </li>
            <li className="flex items-center gap-1.5">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Cash on Delivery
            </li>
          </ul>
        </div>

        {/* Visual — product series, one after another */}
        <div className="relative lg:col-span-7">
          <div
            aria-hidden="true"
            className="absolute -right-3 -top-3 hidden h-full w-full rounded-[2rem] border border-clay/25 sm:block"
          />
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-secondary shadow-2xl shadow-espresso/10 sm:aspect-[16/10]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {HERO_SLIDES.map((slide, i) => {
              const active = i === index;
              return (
                <div
                  key={slide.slug}
                  aria-hidden={!active}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-[1100ms] ease-out",
                    active ? "z-10 opacity-100" : "z-0 opacity-0"
                  )}
                >
                  {/* slow Ken Burns drift via transitions — no snap on exit */}
                  <div
                    className={cn(
                      "absolute inset-0 transition-transform ease-out",
                      active && !reduced
                        ? "scale-[1.12] duration-[6200ms]"
                        : "scale-100 duration-[1300ms]"
                    )}
                  >
                    <Image
                      src={slide.image}
                      alt={active ? slide.alt : ""}
                      fill
                      priority={i === 0}
                      loading={i === 0 ? undefined : "eager"}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              );
            })}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-espresso/25 via-transparent to-transparent"
            />

            {/* prev / next */}
            <button
              onClick={() => goTo(index - 1)}
              className="absolute left-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/85 text-espresso shadow-md backdrop-blur transition hover:bg-ivory focus-visible:ring-2 focus-visible:ring-ring sm:flex"
              aria-label="Previous product"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => goTo(index + 1)}
              className="absolute right-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/85 text-espresso shadow-md backdrop-blur transition hover:bg-ivory focus-visible:ring-2 focus-visible:ring-ring sm:flex"
              aria-label="Next product"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* slide indicators */}
            <div
              className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-1.5"
              role="tablist"
              aria-label="Hero products"
            >
              {HERO_SLIDES.map((slide, i) => (
                <button
                  key={`dot-${slide.slug}`}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show product ${i + 1} of ${HERO_SLIDES.length}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    "w-2 rounded-full shadow-sm transition-all duration-300",
                    i === index
                      ? "h-6 bg-ivory"
                      : "h-2 bg-ivory/55 hover:bg-ivory/90"
                  )}
                />
              ))}
            </div>

            {/* floating product chip — follows the active slide */}
            <p className="sr-only" aria-live="polite">
              {`Showing product ${index + 1} of ${HERO_SLIDES.length}${
                chipProduct ? `: ${chipProduct.name}` : ""
              }`}
            </p>
            {chipProduct && !loading && (
              <button
                onClick={() => navigate({ name: "product", slug: chipProduct.slug })}
                className="group absolute bottom-4 left-4 right-4 z-20 flex items-center gap-3 rounded-2xl bg-ivory/95 p-3 text-left shadow-xl backdrop-blur transition hover:bg-ivory sm:right-auto sm:w-80 dark:bg-card/95 dark:hover:bg-card"
                aria-label={`Shop ${chipProduct.name}`}
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-secondary">
                  <Image
                    src={chipProduct.images[0]}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-clay">
                    Handpicked • {index + 1} of {HERO_SLIDES.length}
                  </p>
                  <p className="truncate text-sm font-medium text-foreground">
                    {chipProduct.name}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-foreground">
                  {formatBDT(chipProduct.price)}
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
