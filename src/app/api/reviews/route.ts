import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reviews = await db.review.findMany({
      orderBy: { createdAt: "asc" },
      include: { product: { select: { name: true, slug: true } } },
    });

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r.id,
        customerName: r.customerName,
        location: r.location,
        rating: r.rating,
        comment: r.comment,
        isFeatured: r.isFeatured,
        productName: r.product?.name ?? null,
        productSlug: r.product?.slug ?? null,
      })),
    });
  } catch (error) {
    console.error("GET /api/reviews failed:", error);
    return NextResponse.json(
      { error: "Unable to load reviews" },
      { status: 500 }
    );
  }
}
