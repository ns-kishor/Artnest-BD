"use client";

import Image from "next/image";
import { ArrowRight, BadgeCheck, Truck, Undo2, Star } from "lucide-react";
import { useUIStore } from "@/lib/artnest/navigator";
import { useStoreData } from "./store-data";
import { formatBDT } from "@/lib/artnest/format";

export function Hero() {
  const navigate = useUIStore((s) => s.navigate);
  const { products, loading } = useStoreData();

  const chipProduct =
    products.find((p) => p.slug === "terracotta-ceramic-vase") ?? products[0];

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

        {/* Visual */}
        <div className="relative lg:col-span-7">
          <div
            aria-hidden="true"
            className="absolute -right-3 -top-3 hidden h-full w-full rounded-[2rem] border border-clay/25 sm:block"
          />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-secondary shadow-2xl shadow-espresso/10 sm:aspect-[16/10]">
            <Image
              src="/images/hero.png"
              alt="A warm modern living room styled with a beige sofa, terracotta ceramic vases and dried pampas grass"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-espresso/15 via-transparent to-transparent"
            />

            {/* floating product chip */}
            {chipProduct && !loading && (
              <button
                onClick={() => navigate({ name: "product", slug: chipProduct.slug })}
                className="group absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl bg-ivory/95 p-3 text-left shadow-xl backdrop-blur transition hover:bg-ivory sm:right-auto sm:w-72 dark:bg-card/95 dark:hover:bg-card"
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
                    Featured Piece
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
