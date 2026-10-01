/**
 * Idempotent upsert of the owner-uploaded "signature" products (all Wall Décor)
 * into the live database — does NOT touch existing products, orders or reviews.
 * Run: bun scripts/seed-uploads.ts
 */
import { PrismaClient } from "@prisma/client";
import { uploadProducts, UPLOAD_CATEGORY_IMAGE } from "../prisma/upload-products";

const db = new PrismaClient();
const DAY = 24 * 60 * 60 * 1000;

async function main() {
  let created = 0;
  let updated = 0;

  for (const p of uploadProducts) {
    const category = await db.category.findUnique({ where: { slug: p.category } });
    if (!category) throw new Error(`Category ${p.category} not found`);

    const data = {
      slug: p.slug,
      name: p.name,
      shortDescription: p.shortDescription,
      description: p.description,
      price: p.price,
      comparePrice: p.comparePrice ?? null,
      images: JSON.stringify(p.images),
      colors: JSON.stringify(p.colors),
      themes: JSON.stringify(p.themes),
      material: p.material,
      dimensions: p.dimensions,
      careInstructions: p.careInstructions,
      room: p.room,
      rating: p.rating,
      reviewCount: p.reviewCount,
      stock: p.stock,
      isFeatured: p.isFeatured ?? false,
      isBestSeller: p.isBestSeller ?? false,
      isNewArrival: p.isNewArrival ?? false,
      popularity: p.popularity,
      categoryId: category.id,
    };

    const existing = await db.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await db.product.update({ where: { slug: p.slug }, data });
      updated++;
    } else {
      await db.product.create({ data: { ...data, createdAt: new Date(Date.now() - p.ageDays * DAY) } });
      created++;
    }
    console.log(`✓ ${p.slug} (${existing ? "updated" : "created"})`);
  }

  // Point the Wall Décor category card at the real store photography
  await db.category.update({
    where: { slug: "wall-decor" },
    data: { image: UPLOAD_CATEGORY_IMAGE },
  });
  console.log(`✓ wall-decor category image → ${UPLOAD_CATEGORY_IMAGE}`);

  const counts = {
    products: await db.product.count(),
    wallDecor: await db.product.count({ where: { category: { slug: "wall-decor" } } }),
  };
  console.log("Done:", { created, updated, ...counts });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
