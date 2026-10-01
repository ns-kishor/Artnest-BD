"use client";

import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Gem,
  Headset,
  Images,
  Instagram,
  BadgePercent,
  MoveRight,
  Plus,
  Star,
} from "lucide-react";
import { useUIStore } from "@/lib/artnest/navigator";
import { useStoreData } from "./store-data";
import { SectionHeading } from "./section-heading";
import { formatBDT } from "@/lib/artnest/format";
import { THEME_LABELS, type Product } from "@/lib/artnest/types";

/* --------------------------------- Sections -------------------------------- */

export function CategorySection() {
  const navigate = useUIStore((s) => s.navigate);
  const { categories } = useStoreData();
  const main = categories.filter((c) => c.slug !== "lifestyle");

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20" aria-labelledby="categories">
      <SectionHeading
        id="categories"
        eyebrow="Browse the Shop"
        title={
          <>
            Featured <em className="italic text-clay">Categories</em>
          </>
        }
        description="From walls to tabletops — find the pieces that make a space feel finished."
        action={{ label: "View all products", onClick: () => navigate({ name: "shop" }) }}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {main.map((c) => (
          <button
            key={c.slug}
            onClick={() => navigate({ name: "shop", category: c.slug })}
            className="group text-left focus-visible:outline-none"
            aria-label={`Shop ${c.name}`}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
              {c.image && (
                <Image
                  src={c.image}
                  alt={`${c.name} — ${c.tagline ?? "home décor"}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-espresso/10 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-3.5">
                <h3 className="font-serif text-[15px] leading-tight text-ivory sm:text-base">
                  {c.name}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-ivory/75">
                  {c.tagline}
                </p>
              </div>
              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ivory/90 text-espresso opacity-0 shadow transition-opacity duration-300 group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- Editorial Banner ----------------------------- */

export function EditorialBanner({
  image,
  eyebrow,
  title,
  description,
  cta,
  onClick,
  align = "center",
}: {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  align?: "center" | "left";
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
      <div className="relative overflow-hidden rounded-[2rem]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-espresso/50" />
        <div
          className={`relative flex min-h-[320px] flex-col justify-center gap-4 p-8 sm:min-h-[380px] sm:p-14 ${
            align === "center" ? "items-center text-center" : "items-start"
          }`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ivory/80">
            {eyebrow}
          </p>
          <h2 className="max-w-2xl font-serif text-3xl leading-tight text-ivory sm:text-4xl lg:text-5xl text-balance">
            {title}
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-ivory/80 sm:text-base">
            {description}
          </p>
          <button
            onClick={onClick}
            className="group mt-2 inline-flex h-12 items-center gap-2 rounded-full bg-ivory px-7 text-sm font-semibold text-espresso shadow-lg transition hover:bg-sand focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-espresso"
          >
            {cta}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Shop by Room ------------------------------ */

const ROOMS: { slug: string; name: string; image: string; line: string }[] = [
  { slug: "living-room", name: "Living Room", image: "/images/cat-living-room.png", line: "Add character to the heart of your home." },
  { slug: "bedroom", name: "Bedroom", image: "/images/cat-bedroom.png", line: "Calm corners for restful nights." },
  { slug: "dining", name: "Dining Area", image: "/images/rooms/room-dining.png", line: "Set a table worth gathering around." },
  { slug: "workspace", name: "Workspace", image: "/images/cat-desk-workspace.png", line: "A desk that makes you want to sit down." },
  { slug: "entryway", name: "Entryway", image: "/images/rooms/room-entryway.png", line: "A warm first hello, every day." },
  { slug: "balcony", name: "Balcony", image: "/images/rooms/room-balcony.png", line: "Your small piece of the outdoors." },
];

export function RoomSection() {
  const navigate = useUIStore((s) => s.navigate);

  return (
    <section className="bg-secondary/60 py-14 lg:py-20" aria-labelledby="rooms">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="rooms"
          eyebrow="Shop by Room"
          title={
            <>
              Décor for <em className="italic text-clay">Every Room</em>
            </>
          }
          description="Start with the space you're styling — we'll show you what belongs there."
          centered
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROOMS.map((room) => (
            <button
              key={room.slug}
              onClick={() => navigate({ name: "shop", room: room.slug })}
              className="group relative aspect-[16/10] overflow-hidden rounded-2xl text-left focus-visible:outline-none"
              aria-label={`Explore ${room.name} décor`}
            >
              <Image
                src={room.image}
                alt={`${room.name} interior styled with Artnest BD décor`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/20 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                <div>
                  <h3 className="font-serif text-xl text-ivory sm:text-2xl">{room.name}</h3>
                  <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-ivory/75 sm:text-sm">
                    {room.line}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-ivory/95 px-3.5 py-2 text-xs font-semibold text-espresso opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Explore
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Why Artnest ------------------------------ */

const WHY_ITEMS = [
  {
    icon: Gem,
    title: "Thoughtfully Selected",
    text: "Décor chosen with attention to style and everyday usability.",
  },
  {
    icon: Images,
    title: "Beautifully Presented",
    text: "Careful photography and honest product details, always.",
  },
  {
    icon: BadgePercent,
    title: "Affordable Style",
    text: "Aesthetic pieces at prices that let you refresh often.",
  },
  {
    icon: Headset,
    title: "Customer Support",
    text: "Friendly help before and after every order.",
  },
];

export function WhySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20" aria-labelledby="why-us">
      <SectionHeading
        id="why-us"
        eyebrow="Why Artnest BD"
        title={
          <>
            Shopping that feels <em className="italic text-clay">considered</em>
          </>
        }
        centered
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WHY_ITEMS.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border/70 bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-espresso/5"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <item.icon className="h-5 w-5 text-clay" aria-hidden="true" />
            </div>
            <h3 className="font-serif text-lg">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------- Style Your Space ---------------------------- */

export function StyleThemesSection() {
  const navigate = useUIStore((s) => s.navigate);

  const cards = [
    { theme: "minimal", image: "/images/themes/theme-minimal.png" },
    { theme: "cozy", image: "/images/themes/theme-cozy.png" },
    { theme: "natural", image: "/images/themes/theme-natural.png" },
    { theme: "elegant", image: "/images/themes/theme-elegant.png" },
    { theme: "modern", image: "/images/cat-desk-workspace.png" },
    { theme: "artistic", image: "/images/cat-wall-decor.png" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20" aria-labelledby="style-your-space">
      <SectionHeading
        id="style-your-space"
        eyebrow="Style Your Space"
        title={
          <>
            Shop by the feeling you want to{" "}
            <em className="italic text-clay">create</em>
          </>
        }
        description="Pick a mood and we'll curate the collection — minimal calm, cozy evenings, natural textures or quiet elegance."
        action={{
          label: "View everything",
          onClick: () => navigate({ name: "shop" }),
        }}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map(({ theme, image }) => (
          <button
            key={theme}
            onClick={() => navigate({ name: "shop", theme })}
            className="group text-left focus-visible:outline-none"
            aria-label={`Shop ${THEME_LABELS[theme]} style`}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-secondary">
              <Image
                src={image}
                alt={`${THEME_LABELS[theme]} interior mood`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-espresso/25 transition-colors group-hover:bg-espresso/40" />
              <span className="absolute inset-x-3 bottom-3 rounded-full bg-ivory/95 py-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-espresso backdrop-blur transition group-hover:bg-ivory">
                {THEME_LABELS[theme] ?? theme}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- It's the Small Details ----------------------- */

export function SmallDetailsSection() {
  const navigate = useUIStore((s) => s.navigate);
  const { products } = useStoreData();

  const lookSlugs = [
    "terracotta-ceramic-vase",
    "framed-line-art-set",
    "abstract-ceramic-showpiece",
    "woven-seagrass-basket",
  ];
  const lookProducts = lookSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20" aria-labelledby="small-details">
      <SectionHeading
        id="small-details"
        eyebrow="It's the Small Details"
        title={
          <>
            One corner. <em className="italic text-clay">Completely different.</em>
          </>
        }
        description="The same empty corner — styled with a vase, a plant, a piece of wall art and a little light. That's the whole philosophy."
        centered
      />

      <div className="mx-auto grid max-w-4xl items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
        <figure className="relative">
          <span className="absolute left-3 top-3 z-10 rounded-full bg-ivory/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-espresso shadow">
            Before
          </span>
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image
              src="/images/corner-before.png"
              alt="An empty, plain corner of a room with beige walls"
              fill
              sizes="(max-width: 640px) 100vw, 380px"
              className="object-cover"
            />
          </div>
        </figure>

        <div className="flex items-center justify-center" aria-hidden="true">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-clay text-ivory shadow-lg shadow-clay/30">
            <MoveRight className="hidden h-5 w-5 sm:block" />
            <ArrowRight className="h-5 w-5 sm:hidden" />
          </div>
        </div>

        <figure className="relative">
          <span className="absolute left-3 top-3 z-10 rounded-full bg-clay px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory shadow">
            After
          </span>
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image
              src="/images/corner-after.png"
              alt="The same corner styled with a side table, terracotta vase, pampas grass, plant and framed wall art"
              fill
              sizes="(max-width: 640px) 100vw, 380px"
              className="object-cover"
            />
          </div>
        </figure>
      </div>

      {/* Shop the look */}
      {lookProducts.length > 0 && (
        <div className="mx-auto mt-8 max-w-4xl">
          <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Shop This Look
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {lookProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate({ name: "product", slug: p.slug })}
                className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-2.5 text-left transition hover:border-clay/40 hover:shadow-md"
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-secondary">
                  <Image src={p.images[0]} alt="" fill sizes="44px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium leading-tight text-foreground">
                    {p.name}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-clay">
                    {formatBDT(p.price)}
                  </p>
                </div>
                <Plus
                  className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-clay"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate({ name: "shop" })}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-espresso px-8 text-sm font-semibold text-ivory shadow-lg shadow-espresso/20 transition hover:bg-espresso/90"
            >
              Shop the Look
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ----------------------------- Customer Reviews --------------------------- */

export function ReviewsSection() {
  const navigate = useUIStore((s) => s.navigate);
  const { reviews } = useStoreData();
  const featured = reviews.filter((r) => r.isFeatured).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="bg-secondary/60 py-14 lg:py-20" aria-labelledby="reviews">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="reviews"
          eyebrow="Customer Reviews"
          title={
            <>
              Loved in <em className="italic text-clay">Real Homes</em>
            </>
          }
          description="Words from customers across Bangladesh who let us into their spaces."
          centered
        />
        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((review) => (
            <figure
              key={review.id}
              className="flex flex-col rounded-2xl border border-border/70 bg-card p-6"
            >
              <div className="flex items-center gap-1" aria-label={`Rated ${review.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={i < review.rating ? "h-4 w-4 fill-bronze text-bronze" : "h-4 w-4 fill-sand-deep text-sand-deep dark:fill-accent dark:text-accent"} aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground">
                “{review.comment}”
              </blockquote>
              <figcaption className="mt-5 border-t border-border/70 pt-4">
                <p className="text-sm font-semibold text-foreground">
                  {review.customerName}
                  {review.location && (
                    <span className="ml-1.5 font-normal text-muted-foreground">
                      — {review.location}
                    </span>
                  )}
                </p>
                {review.productName && review.productSlug && (
                  <button
                    onClick={() => navigate({ name: "product", slug: review.productSlug! })}
                    className="mt-1 text-xs text-clay underline-offset-4 hover:underline"
                  >
                    on {review.productName}
                  </button>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Social Showcase ----------------------------- */

const SOCIAL_IMAGES = [
  "/images/banner-details.png",
  "/images/rooms/room-dining.png",
  "/images/corner-after.png",
  "/images/themes/theme-cozy.png",
  "/images/cat-vases-plants.png",
  "/images/rooms/room-balcony.png",
];

export function SocialSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20" aria-labelledby="social">
      <SectionHeading
        id="social"
        eyebrow="See More From Artnest BD"
        title={
          <>
            Styled by <em className="italic text-clay">you</em>, shared by us
          </>
        }
        description="Product styling, home setups and new arrivals — follow along on social media."
        centered
      />
      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
        {SOCIAL_IMAGES.map((src, i) => (
          <a
            key={src + i}
            href="#"
            onClick={(e) => e.preventDefault()}
            className="group relative aspect-square overflow-hidden rounded-xl bg-secondary"
            aria-label="Artnest BD on Instagram"
          >
            <Image
              src={src}
              alt="Artnest BD styled interior from social media"
              fill
              sizes="(max-width: 640px) 33vw, 17vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-espresso/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Instagram className="h-6 w-6 text-ivory" aria-hidden="true" />
            </span>
          </a>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {["Facebook", "Instagram", "TikTok"].map((name) => (
          <span
            key={name}
            className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground"
          >
            @artnestbd • {name}
          </span>
        ))}
      </div>
    </section>
  );
}
