"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUIStore } from "@/lib/artnest/navigator";
import { useStoreData } from "./store-data";
import { formatBDT } from "@/lib/artnest/format";
import { THEME_LABELS } from "@/lib/artnest/types";

export function SearchOverlay() {
  const searchOpen = useUIStore((s) => s.searchOpen);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const navigate = useUIStore((s) => s.navigate);
  const { products, categories } = useStoreData();
  const [query, setQuery] = useState("");

  const close = () => {
    setQuery("");
    setSearchOpen(false);
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.themes.some((t) => t.includes(q))
      )
      .slice(0, 8);
  }, [query, products]);

  const trending = useMemo(
    () =>
      [...products]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 4),
    [products]
  );

  const openProduct = (slug: string) => {
    close();
    navigate({ name: "product", slug });
  };

  return (
    <Dialog open={searchOpen} onOpenChange={(open) => (open ? setSearchOpen(true) : close())}>
      <DialogContent className="top-[12%] max-w-xl translate-y-0 gap-0 rounded-2xl p-0">
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search décor, vases, wall art..."
            className="h-9 w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            aria-label="Search products"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 thin-scrollbar">
          {query.trim() === "" ? (
            <div className="p-3">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Browse Categories
              </p>
              <div className="mb-5 flex flex-wrap gap-2">
                {categories.slice(0, 6).map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => {
                      close();
                      navigate({ name: "shop", category: c.slug });
                    }}
                    className="rounded-full border border-border px-3.5 py-1.5 text-sm text-foreground transition hover:border-clay hover:text-clay"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Trending Now
              </p>
              <div className="grid grid-cols-1 gap-1">
                {trending.map((p) => (
                  <SearchRow key={p.id} product={p} onSelect={openProduct} />
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 gap-1">
              {results.map((p) => (
                <SearchRow key={p.id} product={p} onSelect={openProduct} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="font-serif text-lg">No pieces found for “{query}”</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try “vase”, “wall”, “candle” or browse the shop.
              </p>
            </div>
          )}
        </div>

        {query.trim() !== "" && results.length > 0 && (
          <button
            onClick={() => {
              close();
              navigate({ name: "shop" });
            }}
            className="border-t border-border py-3 text-center text-sm font-medium text-foreground transition hover:text-clay"
          >
            View all products
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SearchRow({
  product,
  onSelect,
}: {
  product: ReturnType<typeof useStoreData>["products"][number];
  onSelect: (slug: string) => void;
}) {
  const themeLabel = product.themes[0]
    ? THEME_LABELS[product.themes[0]] ?? product.themes[0]
    : null;
  return (
    <button
      onClick={() => onSelect(product.slug)}
      className="flex items-center gap-3 rounded-xl p-2 text-left transition hover:bg-accent"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-secondary">
        <Image
          src={product.images[0] ?? "/images/cat-lifestyle.png"}
          alt=""
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
        <p className="text-xs text-muted-foreground">
          {product.categoryName}
          {themeLabel ? ` • ${themeLabel}` : ""}
        </p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-foreground">
        {formatBDT(product.price)}
      </span>
    </button>
  );
}
