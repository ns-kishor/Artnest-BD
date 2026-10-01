const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  const [categories, products, reviews] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      include: { category: { select: { slug: true, name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.findMany({
      include: { product: { select: { slug: true, name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const output = {
    categories,
    products,
    reviews,
  };

  const targetPath = path.join(__dirname, "..", "src", "lib", "mock-store-data.json");
  fs.writeFileSync(targetPath, JSON.stringify(output, null, 2), "utf8");
  console.log(`Successfully exported data to ${targetPath}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
