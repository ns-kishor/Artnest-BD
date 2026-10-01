"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUIStore, type SortKey } from "@/lib/artnest/navigator";
import { useStoreData } from "./store-data";
import { ProductCard } from "./product-card";
import { formatBDT } from "@/lib/artnest/format";
import {
  ALL_ROOMS,
  ALL_THEMES,
  ROOM_LABELS,
  THEME_LABELS,
  type Product,
} from "@/lib/artnest/types";
import { cn } from "@/lib/utils";

type PriceKey = "all" | "under-500" | "500-1000" | "1000-2000" | "2000-plus";

const PRICE_OPTIONS: { key: PriceKey; label: string; test: (p: Product) => boolean }[] = [
  { key: "all", label: "Any price", test: () => true },
  { key: "under-500", label: `Under ${formatBDT(500)}`, test: (p) => p.price < 500 },
  { key: "500-1000", label: `${formatBDT(500)} – ${formatBDT(1000)}`, test: (p) => p.price >= 500 && p.price <= 1000 },
  { key: "1000-2000", label: `${formatBDT(1000)} – ${formatBDT(2000)}`, test: (p) => p.price > 1000 && p.price <= 2000 },
  { key: "2000-plus", label: `${formatBDT(2000)}+`, test: (p) => p.price > 2000 },
];

interface Filters {
  category: string;
  price: PriceKey;
  room: string;
  theme: string;
  rating: "any" | "4" | "4.5";
  inStock: boolean;
  onlyNew: boolean;
}

const DEFAULT_FILTERS: Filters = {
  category: "all",
  price: "all",
  room: "all",
  theme: "all",
  rating: "any",
  inStock: false,
  onlyNew: false,
};

const SORT_LABELS: Record<SortKey, string> = {
  featured: "Featured",
  newest: "Newest",
  popular: "Most Popular",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

export function ShopView() {
  const view = useUIStore((s) => s.view);
  const { products, categories, loading } = useStoreData();

  // The parent keys this component by the shop view params, so it remounts
  // (and re-initializes) whenever navigation passes new presets.
  const [filters, setFilters] = useState<Filters>(() => ({
    ...DEFAULT_FILTERS,
    category: view.name === "shop" ? (view.category ?? "all") : "all",
    room: view.name === "shop" ? (view.room ?? "all") : "all",
    theme: view.name === "shop" ? (view.theme ?? "all") : "all",
    onlyNew: view.name === "shop" ? Boolean(view.onlyNew) : false,
  }));
  const [sort, setSort] = useState<SortKey>(() =>
    view.name === "shop" && view.sort ? view.sort : "featured"
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];

    if (filters.category !== "all") {
      list = list.filter((p) => p.categorySlug === filters.category);
    }
    const priceTest = PRICE_OPTIONS.find((o) => o.key === filters.price)?.test;
    if (priceTest) list = list.filter(priceTest);
    if (filters.room !== "all") {
      list = list.filter((p) => p.room === filters.room);
    }
    if (filters.theme !== "all") {
      list = list.filter((p) => p.themes.includes(filters.theme));
    }
    if (filters.rating !== "any") {
      list = list.filter((p) => p.rating >= Number(filters.rating));
    }
    if (filters.inStock) {
      list = list.filter((p) => p.stock > 0);
    }
    if (filters.onlyNew) {
      list = list.filter((p) => p.isNewArrival);
    }

    switch (sort) {
      case "newest":
        list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        break;
      case "popular":
        list.sort((a, b) => b.popularity - a.popularity);
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        list.sort(
          (a, b) =>
            Number(b.isFeatured) - Number(a.isFeatured) || b.popularity - a.popularity
        );
    }
    return list;
  }, [products, filters, sort]);

  const activeChips: { label: string; clear: () => void }[] = [];
  if (filters.category !== "all") {
    const name = categories.find((c) => c.slug === filters.category)?.name;
    activeChips.push({
      label: name ?? filters.category,
      clear: () => setFilters((f) => ({ ...f, category: "all" })),
    });
  }
  if (filters.price !== "all") {
    const label = PRICE_OPTIONS.find((o) => o.key === filters.price)?.label;
    if (label) activeChips.push({ label, clear: () => setFilters((f) => ({ ...f, price: "all" })) });
  }
  if (filters.room !== "all") {
    activeChips.push({
      label: ROOM_LABELS[filters.room] ?? filters.room,
      clear: () => setFilters((f) => ({ ...f, room: "all" })),
    });
  }
  if (filters.theme !== "all") {
    activeChips.push({
      label: THEME_LABELS[filters.theme] ?? filters.theme,
      clear: () => setFilters((f) => ({ ...f, theme: "all" })),
    });
  }
  if (filters.rating !== "any") {
    activeChips.push({
      label: `${filters.rating}★ & up`,
      clear: () => setFilters((f) => ({ ...f, rating: "any" })),
    });
  }
  if (filters.inStock) {
    activeChips.push({ label: "In stock", clear: () => setFilters((f) => ({ ...f, inStock: false })) });
  }
  if (filters.onlyNew) {
    activeChips.push({ label: "New arrivals", clear: () => setFilters((f) => ({ ...f, onlyNew: false })) });
  }

  const hasActiveFilters =
    activeChips.length > 0;

  const filterPanel = (
    <FilterPanel
      filters={filters}
      setFilters={setFilters}
      categories={categories}
      productCount={products.length}
    />
  );

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6" id="main">
      {/* Header */}
      <header className="mx-auto max-w-2xl text-center">
        <p className="mb-3 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-clay">
          <span aria-hidden="true" className="inline-block h-px w-6 bg-clay" />
          The Collection
          <span aria-hidden="true" className="inline-block h-px w-6 bg-clay" />
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl">Shop All Décor</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Explore decorative pieces and lifestyle essentials designed to add
          character to your space.
        </p>
      </header>

      {/* Toolbar */}
      <div className="mt-10 flex items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="relative flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium transition hover:border-clay hover:text-clay lg:hidden"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-clay text-[10px] font-bold text-ivory">
                {activeChips.length}
              </span>
            )}
          </button>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {loading ? "Loading pieces…" : `${filtered.length} piece${filtered.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:inline">Sort by</span>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="h-10 w-[180px] rounded-full border-border bg-card text-sm" aria-label="Sort products">
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {SORT_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active chips */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {activeChips.map((chip, i) => (
            <button
              key={i}
              onClick={chip.clear}
              className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-accent"
            >
              {chip.label}
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          ))}
          <button
            onClick={() => {
              setFilters(DEFAULT_FILTERS);
              setSort("featured");
            }}
            className="text-xs font-medium text-clay underline-offset-4 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Content */}
      <div className="mt-8 flex gap-8">
        <aside className="hidden w-60 shrink-0 lg:block" aria-label="Product filters">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 thin-scrollbar">
            {filterPanel}
          </div>
        </aside>

        <div className="flex-1">
          {!loading && filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
              <p className="font-serif text-2xl">No pieces match those filters</p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Try removing a filter or two — beautiful things are waiting just
                outside this combination.
              </p>
              <button
                onClick={() => {
                  setFilters(DEFAULT_FILTERS);
                  setSort("featured");
                }}
                className="mt-6 h-11 rounded-full bg-espresso px-6 text-sm font-medium text-ivory transition hover:bg-espresso/90"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
              {(loading ? Array.from({ length: 8 }) : filtered).map((p, i) =>
                loading ? (
                  <div key={`skeleton-${i}`} aria-hidden="true">
                    <div className="aspect-square w-full animate-pulse rounded-xl bg-secondary" />
                    <div className="mt-3 h-3 w-1/3 animate-pulse rounded bg-secondary" />
                    <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-secondary" />
                  </div>
                ) : (
                  <ProductCard key={(p as Product).id} product={p as Product} />
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="flex w-80 flex-col gap-0 overflow-y-auto p-0 thin-scrollbar">
          <SheetHeader className="border-b border-border p-5">
            <SheetTitle className="font-serif text-xl">Filters</SheetTitle>
          </SheetHeader>
          <div className="flex-1 p-5">{filterPanel}</div>
          <div className="border-t border-border p-4">
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="h-11 w-full rounded-full bg-espresso text-sm font-semibold text-ivory transition hover:bg-espresso/90"
            >
              Show {filtered.length} piece{filtered.length === 1 ? "" : "s"}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}

/* ------------------------------ Filter panel ------------------------------- */

function FilterPanel({
  filters,
  setFilters,
  categories,
  productCount,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  categories: ReturnType<typeof useStoreData>["categories"];
  productCount: number;
}) {
  return (
    <div className="space-y-6">
      <FilterGroup title="Category">
        <div className="space-y-1.5">
          <FilterRadio
            label={`All products (${productCount})`}
            checked={filters.category === "all"}
            onChange={() => setFilters((f) => ({ ...f, category: "all" }))}
          />
          {categories.map((c) => (
            <FilterRadio
              key={c.slug}
              label={c.name}
              checked={filters.category === c.slug}
              onChange={() => setFilters((f) => ({ ...f, category: c.slug }))}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="space-y-1.5">
          {PRICE_OPTIONS.map((o) => (
            <FilterRadio
              key={o.key}
              label={o.label}
              checked={filters.price === o.key}
              onChange={() => setFilters((f) => ({ ...f, price: o.key }))}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Room">
        <div className="space-y-1.5">
          <FilterRadio
            label="Any room"
            checked={filters.room === "all"}
            onChange={() => setFilters((f) => ({ ...f, room: "all" }))}
          />
          {ALL_ROOMS.map((room) => (
            <FilterRadio
              key={room}
              label={ROOM_LABELS[room]}
              checked={filters.room === room}
              onChange={() => setFilters((f) => ({ ...f, room }))}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Style">
        <div className="flex flex-wrap gap-2">
          <ThemeChip
            label="Any"
            checked={filters.theme === "all"}
            onChange={() => setFilters((f) => ({ ...f, theme: "all" }))}
          />
          {ALL_THEMES.map((t) => (
            <ThemeChip
              key={t}
              label={THEME_LABELS[t] ?? t}
              checked={filters.theme === t}
              onChange={() => setFilters((f) => ({ ...f, theme: t }))}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Rating">
        <div className="space-y-1.5">
          {[
            { key: "any" as const, label: "Any rating" },
            { key: "4" as const, label: "4.0 ★ & up" },
            { key: "4.5" as const, label: "4.5 ★ & up" },
          ].map((o) => (
            <FilterRadio
              key={o.key}
              label={o.label}
              checked={filters.rating === o.key}
              onChange={() => setFilters((f) => ({ ...f, rating: o.key }))}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Availability">
        <div className="flex items-center justify-between">
          <Label htmlFor="in-stock" className="text-sm text-foreground/85">
            In stock only
          </Label>
          <Switch
            id="in-stock"
            checked={filters.inStock}
            onCheckedChange={(v) => setFilters((f) => ({ ...f, inStock: v }))}
          />
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FilterRadio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition",
        checked ? "bg-accent font-medium text-foreground" : "text-foreground/80 hover:bg-accent/60"
      )}
      role="radio"
      aria-checked={checked}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
          checked ? "border-clay" : "border-muted-foreground/50"
        )}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-clay" />}
      </span>
      {label}
    </button>
  );
}

function ThemeChip({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
        checked
          ? "border-espresso bg-espresso text-ivory"
          : "border-border text-foreground/75 hover:border-clay hover:text-clay"
      )}
      role="checkbox"
      aria-checked={checked}
    >
      {label}
    </button>
  );
}
