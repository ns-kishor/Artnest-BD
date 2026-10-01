"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Category, Product, Review } from "@/lib/artnest/types";

interface StoreData {
  loading: boolean;
  error: string | null;
  products: Product[];
  categories: Category[];
  reviews: Review[];
  productBySlug: (slug: string) => Product | undefined;
  productsByCategory: (categorySlug: string) => Product[];
  relatedProducts: (product: Product, limit?: number) => Product[];
}

const StoreDataContext = createContext<StoreData | null>(null);

export function StoreDataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [productsRes, reviewsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/reviews"),
        ]);
        if (!productsRes.ok || !reviewsRes.ok) {
          throw new Error("Could not reach the store service");
        }
        const productsJson = await productsRes.json();
        const reviewsJson = await reviewsRes.json();
        if (cancelled) return;
        setProducts(productsJson.products ?? []);
        setCategories(productsJson.categories ?? []);
        setReviews(reviewsJson.reviews ?? []);
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Something went wrong");
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const productBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products]
  );

  const productsByCategory = useCallback(
    (categorySlug: string) =>
      products.filter((p) => p.categorySlug === categorySlug),
    [products]
  );

  const relatedProducts = useCallback(
    (product: Product, limit = 4) =>
      products
        .filter(
          (p) =>
            p.id !== product.id &&
            (p.categorySlug === product.categorySlug ||
              p.themes.some((t) => product.themes.includes(t)))
        )
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, limit),
    [products]
  );

  const value = useMemo<StoreData>(
    () => ({
      loading,
      error,
      products,
      categories,
      reviews,
      productBySlug,
      productsByCategory,
      relatedProducts,
    }),
    [loading, error, products, categories, reviews, productBySlug, productsByCategory, relatedProducts]
  );

  return <StoreDataContext.Provider value={value}>{children}</StoreDataContext.Provider>;
}

export function useStoreData(): StoreData {
  const ctx = useContext(StoreDataContext);
  if (!ctx) throw new Error("useStoreData must be used within StoreDataProvider");
  return ctx;
}
