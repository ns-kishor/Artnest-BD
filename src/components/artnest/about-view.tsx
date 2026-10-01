"use client";

import Image from "next/image";
import { ArrowRight, Gem, HeartHandshake, Home, Leaf, PenTool, Sun } from "lucide-react";
import { useUIStore } from "@/lib/artnest/navigator";
import { SectionHeading } from "./section-heading";

const VALUES = [
  { icon: Home, title: "Home Aesthetics", text: "Spaces that feel as good as they look." },
  { icon: PenTool, title: "Thoughtful Decoration", text: "Every piece earns its place." },
  { icon: Gem, title: "Affordable Style", text: "Good design shouldn't be a luxury." },
  { icon: Sun, title: "Modern Living", text: "Décor for real, everyday homes." },
  { icon: HeartHandshake, title: "Personal Expression", text: "Your space, your story." },
  { icon: Leaf, title: "Better-Looking Spaces", text: "Small changes, visible joy." },
];

export function AboutView() {
  const navigate = useUIStore((s) => s.navigate);

  return (
    <main id="main">
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:pt-16">
        <div>
          <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-clay">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-clay" />
            About Artnest BD
          </p>
          <h1 className="font-serif text-4xl leading-[1.12] sm:text-5xl text-balance">
            Beautiful Spaces Begin With{" "}
            <em className="italic text-clay">Thoughtful Details</em>.
          </h1>
          <div className="mt-6 max-w-lg space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              Artnest BD exists for one simple reason: we believe every home in
              Bangladesh can look and feel beautiful — without needing a
              designer, a renovation, or an unreasonable budget.
            </p>
            <p>
              We curate décor and lifestyle pieces that are aesthetic, useful and
              honestly described. A vase that flatters dried stems. A candle that
              softens an evening. A frame that finally makes a wall feel
              finished.
            </p>
            <p>
              That&apos;s it. Small details, chosen with care, for the spaces you
              call home.
            </p>
          </div>
          <button
            onClick={() => navigate({ name: "shop" })}
            className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-espresso px-7 text-sm font-semibold text-ivory shadow-lg shadow-espresso/20 transition hover:bg-espresso/90"
          >
            Explore the Collection
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </div>
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -left-3 -top-3 hidden h-full w-full rounded-[2rem] border border-clay/25 sm:block"
          />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-secondary shadow-2xl shadow-espresso/10">
            <Image
              src="/images/banner-refresh.png"
              alt="A bright living room corner refreshed with plants and terracotta vases"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary/60 py-14 lg:py-20" aria-labelledby="values">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            id="values"
            eyebrow="What We Care About"
            title={
              <>
                The ideas behind <em className="italic text-clay">everything we stock</em>
              </>
            }
            centered
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <v.icon className="h-5 w-5 text-clay" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-lg">{v.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-24">
        <blockquote>
          <p className="font-serif text-2xl leading-relaxed text-foreground sm:text-3xl">
            “We don&apos;t sell decorations. We help people{" "}
            <em className="italic text-clay">fall back in love with their homes</em>,
            one small detail at a time.”
          </p>
        </blockquote>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          The Artnest BD Team
        </p>
        <button
          onClick={() => navigate({ name: "contact" })}
          className="mt-8 inline-flex h-11 items-center rounded-full border border-espresso/25 px-6 text-sm font-semibold text-espresso transition hover:bg-espresso hover:text-ivory dark:border-ivory/30 dark:text-ivory dark:hover:bg-ivory dark:hover:text-espresso"
        >
          Get in Touch
        </button>
      </section>
    </main>
  );
}
