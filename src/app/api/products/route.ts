import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const [categories, products] = await Promise.all([
      db.category.findMany({ orderBy: { sortOrder: "asc" } }),
      db.product.findMany({
        include: { category: { select: { slug: true, name: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      categories: categories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        image: c.image,
        sortOrder: c.sortOrder,
      })),
      products: products.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        shortDescription: p.shortDescription,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice,
        images: parseJsonArray(p.images),
        colors: parseJsonArray(p.colors),
        themes: parseJsonArray(p.themes),
        material: p.material,
        dimensions: p.dimensions,
        careInstructions: p.careInstructions,
        room: p.room,
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: p.stock,
        isFeatured: p.isFeatured,
        isBestSeller: p.isBestSeller,
        isNewArrival: p.isNewArrival,
        popularity: p.popularity,
        categorySlug: p.category.slug,
        categoryName: p.category.name,
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json(
      { error: "Unable to load products" },
      { status: 500 }
    );
  }
}
