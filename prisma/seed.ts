import { PrismaClient } from "@prisma/client";
import { uploadProducts } from "./upload-products";

const db = new PrismaClient();

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();

function daysAgo(n: number) {
  return new Date(now - n * DAY);
}

async function main() {
  console.log("Clearing existing data...");
  await db.review.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();

  console.log("Seeding categories...");
  const categories = await Promise.all(
    [
      {
        slug: "wall-decor",
        name: "Wall Décor",
        tagline: "Art & accents for empty walls",
        image: "/images/products/rattan-blossom-wall-set.jpg",
        sortOrder: 1,
      },
      {
        slug: "table-decor",
        name: "Table Décor",
        tagline: "Objects that style every surface",
        image: "/images/cat-table-decor.png",
        sortOrder: 2,
      },
      {
        slug: "vases-plants",
        name: "Vases & Plants",
        tagline: "Vases, planters & everlasting greens",
        image: "/images/cat-vases-plants.png",
        sortOrder: 3,
      },
      {
        slug: "living-room",
        name: "Living Room",
        tagline: "Décor for the heart of your home",
        image: "/images/cat-living-room.png",
        sortOrder: 4,
      },
      {
        slug: "bedroom",
        name: "Bedroom",
        tagline: "Calm pieces for restful corners",
        image: "/images/cat-bedroom.png",
        sortOrder: 5,
      },
      {
        slug: "desk-workspace",
        name: "Desk & Workspace",
        tagline: "Beautiful, functional desk accents",
        image: "/images/cat-desk-workspace.png",
        sortOrder: 6,
      },
      {
        slug: "lifestyle",
        name: "Lifestyle",
        tagline: "Everyday accessories with charm",
        image: "/images/cat-lifestyle.png",
        sortOrder: 7,
      },
    ].map((c) => db.category.create({ data: c }))
  );

  const cat = (slug: string) => {
    const found = categories.find((c) => c.slug === slug);
    if (!found) throw new Error(`Category ${slug} not found`);
    return found.id;
  };

  console.log("Seeding products...");

  type SeedProduct = {
    slug: string;
    name: string;
    shortDescription: string;
    description: string;
    price: number;
    comparePrice?: number;
    images: string[];
    colors: string[];
    themes: string[];
    material: string;
    dimensions: string;
    careInstructions: string;
    room: string;
    rating: number;
    reviewCount: number;
    stock: number;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    popularity: number;
    category: string;
    ageDays: number;
  };

  const products: SeedProduct[] = [
    {
      slug: "framed-line-art-set",
      name: "Framed Line Art — Set of 3",
      shortDescription:
        "A trio of one-line drawings in slim wooden frames to compose a calm gallery wall.",
      description:
        "Three finely drawn one-line studies — a face, a botanical stem and an abstract curve — presented in slim natural wood frames. Hang them together as a set above a console or sofa, or spread them across a hallway for a quiet, gallery-like rhythm.",
      price: 1450,
      comparePrice: 1800,
      images: ["/images/products/prod-01.png", "/images/cat-wall-decor.png", "/images/corner-after.png"],
      colors: ["Natural Wood", "Ivory"],
      themes: ["minimal", "modern", "artistic"],
      material: "Engineered wood frames, glass front, art paper prints",
      dimensions: "Each frame 21 × 30 cm (A4)",
      careInstructions: "Wipe frames with a dry cloth. Keep away from direct sunlight to prevent fading.",
      room: "living-room",
      rating: 4.8,
      reviewCount: 34,
      stock: 18,
      isFeatured: true,
      isBestSeller: true,
      popularity: 92,
      category: "wall-decor",
      ageDays: 38,
    },
    {
      slug: "macrame-wall-hanging",
      name: "Macramé Wall Hanging",
      shortDescription:
        "Handwoven cotton cords on a wooden dowel — soft texture for bedrooms and entryways.",
      description:
        "Hand-knotted from soft cotton cord, this macramé piece brings gentle bohemian texture to any wall. The natural fringe moves subtly with the air, adding warmth above beds, dressers or entry consoles.",
      price: 950,
      images: ["/images/products/prod-02.png", "/images/cat-wall-decor.png", "/images/rooms/room-entryway.png"],
      colors: ["Cream"],
      themes: ["natural", "cozy", "artistic"],
      material: "100% cotton cord, natural wooden dowel",
      dimensions: "45 cm wide × 70 cm long",
      careInstructions: "Shake gently to remove dust. Comb fringe softly. Spot clean with a damp cloth.",
      room: "bedroom",
      rating: 4.7,
      reviewCount: 21,
      stock: 22,
      isNewArrival: true,
      popularity: 61,
      category: "wall-decor",
      ageDays: 6,
    },
    {
      slug: "round-oak-wall-mirror",
      name: "Round Oak Wall Mirror",
      shortDescription:
        "A round mirror framed in warm oak — opens up entryways and doubles the light.",
      description:
        "A clean circular mirror in a warm oak-toned frame. Perfect above entryway consoles or vanities, it reflects light and space, making smaller rooms feel open and considered.",
      price: 2200,
      comparePrice: 2600,
      images: ["/images/products/prod-03.png", "/images/rooms/room-entryway.png", "/images/cat-wall-decor.png"],
      colors: ["Natural Oak"],
      themes: ["minimal", "elegant", "modern"],
      material: "Solid oak-finish wood frame, glass mirror",
      dimensions: "Diameter 50 cm",
      careInstructions: "Clean glass with a soft damp cloth. Avoid hanging in humid bathrooms.",
      room: "entryway",
      rating: 4.9,
      reviewCount: 27,
      stock: 12,
      isFeatured: true,
      popularity: 88,
      category: "wall-decor",
      ageDays: 30,
    },
    {
      slug: "abstract-ceramic-showpiece",
      name: "Abstract Ceramic Showpiece",
      shortDescription:
        "A sculptural matte-glazed form that anchors coffee tables and shelves.",
      description:
        "An organic, sculptural form finished in a soft matte glaze. On its own it reads as quiet art; paired with books or a tray it becomes the anchor of a styled tablescape.",
      price: 850,
      images: ["/images/products/prod-04.png", "/images/cat-table-decor.png", "/images/corner-after.png"],
      colors: ["Off-White", "Charcoal"],
      themes: ["minimal", "modern", "artistic"],
      material: "Ceramic with matte glaze",
      dimensions: "H 24 cm × W 12 cm",
      careInstructions: "Dust with a dry cloth. Not dishwasher safe.",
      room: "living-room",
      rating: 4.6,
      reviewCount: 19,
      stock: 26,
      isFeatured: true,
      popularity: 74,
      category: "table-decor",
      ageDays: 26,
    },
    {
      slug: "brass-candle-holder-pair",
      name: "Brass Candle Holder — Pair",
      shortDescription:
        "Antique-finish brass holders for taper candles. Warm light, instantly.",
      description:
        "A pair of candlestick holders in a warm antique brass finish. Set the table for dinner or line them along a mantel — within minutes the room settles into a softer, golden mood.",
      price: 1350,
      comparePrice: 1550,
      images: ["/images/products/prod-05.png", "/images/banner-details.png", "/images/cat-table-decor.png"],
      colors: ["Antique Brass"],
      themes: ["elegant", "warm", "cozy"],
      material: "Solid brass with antique finish",
      dimensions: "H 18 cm and H 14 cm (pair)",
      careInstructions: "Wipe with a soft dry cloth. Polish occasionally with lemon and salt if desired.",
      room: "dining",
      rating: 4.8,
      reviewCount: 41,
      stock: 20,
      isFeatured: true,
      isBestSeller: true,
      popularity: 95,
      category: "table-decor",
      ageDays: 33,
    },
    {
      slug: "walnut-decorative-tray",
      name: "Walnut Decorative Tray",
      shortDescription:
        "A carved-handle tray in rich walnut to corral candles, remotes and keys.",
      description:
        "Turned from rich walnut-finish wood with carved side handles, this tray makes small things look intentional. Use it on the coffee table for candles, on the console for keys, or as a table centerpiece base.",
      price: 780,
      comparePrice: 950,
      images: ["/images/products/prod-06.png", "/images/cat-table-decor.png", "/images/banner-details.png"],
      colors: ["Walnut"],
      themes: ["natural", "warm", "minimal"],
      material: "Wood with walnut finish",
      dimensions: "Diameter 32 cm",
      careInstructions: "Wipe clean with a dry cloth. Keep away from water and heat.",
      room: "living-room",
      rating: 4.7,
      reviewCount: 16,
      stock: 24,
      isNewArrival: true,
      popularity: 58,
      category: "table-decor",
      ageDays: 9,
    },
    {
      slug: "terracotta-ceramic-vase",
      name: "Terracotta Ceramic Vase",
      shortDescription:
        "Our signature vase — a rounded belly and narrow neck in raw terracotta clay.",
      description:
        "The vase that started the studio. Thrown in raw terracotta with a rounded belly and narrow neck, it flatters dried stems, pampas or a single bold branch. Beautiful with or without flowers.",
      price: 1150,
      images: ["/images/products/prod-07.png", "/images/cat-vases-plants.png", "/images/corner-after.png"],
      colors: ["Terracotta", "Ivory"],
      themes: ["warm", "natural", "minimal"],
      material: "Unglazed terracotta ceramic",
      dimensions: "H 26 cm × D 14 cm",
      careInstructions: "Wipe with a dry cloth. Use a liner or dried stems to avoid water marks.",
      room: "living-room",
      rating: 4.9,
      reviewCount: 58,
      stock: 30,
      isFeatured: true,
      isBestSeller: true,
      popularity: 98,
      category: "vases-plants",
      ageDays: 35,
    },
    {
      slug: "ribbed-glass-vase",
      name: "Ribbed Glass Vase",
      shortDescription:
        "Fluted clear glass that bends light beautifully around fresh stems.",
      description:
        "Vertical flutes catch the light and softly distort the stems inside — a small optical trick that makes even supermarket flowers look styled. Lovely on dining tables and vanities.",
      price: 980,
      comparePrice: 1200,
      images: ["/images/products/prod-08.png", "/images/theme-elegant.png", "/images/cat-vases-plants.png"],
      colors: ["Clear"],
      themes: ["elegant", "modern", "minimal"],
      material: "Thick fluted glass",
      dimensions: "H 22 cm × D 11 cm",
      careInstructions: "Hand wash with mild soap. Avoid sudden temperature changes.",
      room: "dining",
      rating: 4.6,
      reviewCount: 23,
      stock: 28,
      isNewArrival: true,
      popularity: 66,
      category: "vases-plants",
      ageDays: 5,
    },
    {
      slug: "artificial-monstera-pot",
      name: "Artificial Monstera in Pot",
      shortDescription:
        "A lush monstera that stays perfect forever — potted in matte ceramic.",
      description:
        "All of the tropical calm, none of the watering. A full, realistically veined monstera sits in a matte beige ceramic pot, ready to soften empty corners from day one.",
      price: 1650,
      comparePrice: 1900,
      images: ["/images/products/prod-09.png", "/images/cat-vases-plants.png", "/images/banner-refresh.png"],
      colors: ["Green / Beige"],
      themes: ["natural", "modern", "cozy"],
      material: "Fabric and plastic foliage, ceramic pot",
      dimensions: "H 75 cm including pot",
      careInstructions: "Dust leaves monthly with a dry or slightly damp cloth. Keep out of direct harsh sun.",
      room: "living-room",
      rating: 4.8,
      reviewCount: 47,
      stock: 15,
      isFeatured: true,
      isBestSeller: true,
      popularity: 90,
      category: "vases-plants",
      ageDays: 28,
    },
    {
      slug: "dried-pampas-vase",
      name: "Dried Pampas in Ceramic Vase",
      shortDescription:
        "Fluffy dried pampas plumes arranged in a round ceramic vase — styled and ready.",
      description:
        "A ready-made arrangement of soft pampas plumes in warm cream and beige, set in a round ceramic vase. No styling needed — simply place it where the room needs a little softness.",
      price: 1290,
      images: ["/images/products/prod-10.png", "/images/theme-minimal.png", "/images/cat-vases-plants.png"],
      colors: ["Cream", "Beige"],
      themes: ["natural", "minimal", "warm"],
      material: "Natural dried pampas grass, ceramic vase",
      dimensions: "H 55 cm total arrangement",
      careInstructions: "Do not water. Keep away from moisture. Shake gently outdoors to refresh the plumes.",
      room: "bedroom",
      rating: 4.7,
      reviewCount: 31,
      stock: 17,
      isNewArrival: true,
      popularity: 70,
      category: "vases-plants",
      ageDays: 4,
    },
    {
      slug: "textured-cushion-cover-set",
      name: "Textured Cushion Cover — Set of 2",
      shortDescription:
        "Bouclé and linen-finish covers in beige and terracotta. The fastest room refresh.",
      description:
        "One beige bouclé, one terracotta linen-finish cover — the pairing that works with almost any sofa. Hidden zippers and quality stitching make them feel far more expensive than they are.",
      price: 890,
      comparePrice: 1100,
      images: ["/images/products/prod-11.png", "/images/cat-living-room.png", "/images/theme-cozy.png"],
      colors: ["Beige / Terracotta"],
      themes: ["cozy", "warm", "natural"],
      material: "Bouclé and cotton-linen blend covers (inserts not included)",
      dimensions: "45 × 45 cm (2 covers)",
      careInstructions: "Hand wash or gentle machine cycle in cold water. Do not bleach.",
      room: "living-room",
      rating: 4.8,
      reviewCount: 52,
      stock: 35,
      isFeatured: true,
      isBestSeller: true,
      popularity: 94,
      category: "living-room",
      ageDays: 31,
    },
    {
      slug: "woven-seagrass-basket",
      name: "Woven Seagrass Basket",
      shortDescription:
        "A sturdy seagrass basket for throws, plants or tidy-looking storage.",
      description:
        "Hand-woven seagrass with firm handles and a sturdy base. Use it to hold throws beside the sofa, to dress up a nursery plant, or to make open storage finally look deliberate.",
      price: 1050,
      images: ["/images/products/prod-12.png", "/images/cat-lifestyle.png", "/images/theme-natural.png"],
      colors: ["Natural"],
      themes: ["natural", "cozy", "warm"],
      material: "Hand-woven seagrass",
      dimensions: "H 30 cm × D 35 cm",
      careInstructions: "Wipe with a dry cloth. Air occasionally. Keep away from damp walls.",
      room: "living-room",
      rating: 4.7,
      reviewCount: 24,
      stock: 19,
      popularity: 63,
      category: "lifestyle",
      ageDays: 22,
    },
    {
      slug: "bedside-table-lamp",
      name: "Bedside Table Lamp",
      shortDescription:
        "A warm-glow lamp with a linen shade and turned wooden base.",
      description:
        "A softly glowing bedside lamp with a linen drum shade and turned wooden base. The warm bulb tone makes late-evening scrolling gentler and bedrooms feel like hotels.",
      price: 2350,
      comparePrice: 2800,
      images: ["/images/products/prod-13.png", "/images/cat-bedroom.png", "/images/theme-cozy.png"],
      colors: ["Natural Wood / Ivory"],
      themes: ["cozy", "warm", "elegant"],
      material: "Linen shade, wooden base, standard E27 holder",
      dimensions: "H 42 cm × Shade D 25 cm",
      careInstructions: "Dust shade with a soft brush. Use bulbs up to 40W. Wipe base dry.",
      room: "bedroom",
      rating: 4.9,
      reviewCount: 38,
      stock: 10,
      isFeatured: true,
      isBestSeller: true,
      popularity: 89,
      category: "bedroom",
      ageDays: 29,
    },
    {
      slug: "scented-candle-ceramic-jar",
      name: "Scented Candle — Ceramic Jar",
      shortDescription:
        "Slow-burning soy candle in a ribbed jar — sandalwood, amber and vanilla.",
      description:
        "Hand-poured soy wax in a ribbed ceramic jar with a wooden lid. Notes of sandalwood, amber and vanilla fill a room gently rather than loudly. When it's done, the jar keeps shelf life as a brush pot.",
      price: 690,
      images: ["/images/products/prod-14.png", "/images/cat-lifestyle.png", "/images/theme-cozy.png"],
      colors: ["Cream"],
      themes: ["cozy", "warm", "elegant"],
      material: "Soy wax, cotton wick, ceramic jar",
      dimensions: "180 g — approx. 35 hours burn time",
      careInstructions: "Trim wick to 5 mm before each burn. Never leave a burning candle unattended.",
      room: "bedroom",
      rating: 4.8,
      reviewCount: 63,
      stock: 40,
      isBestSeller: true,
      isNewArrival: true,
      popularity: 96,
      category: "lifestyle",
      ageDays: 7,
    },
    {
      slug: "wooden-desk-organizer",
      name: "Wooden Desk Organizer",
      shortDescription:
        "Compartments for pens, notes and devices — a tidy desk in five minutes.",
      description:
        "A warm wooden organizer with slots for pens, a bay for your phone and room for notes. It turns desk clutter into a neat little cityscape you won't mind staring at all day.",
      price: 1150,
      comparePrice: 1350,
      images: ["/images/products/prod-15.png", "/images/cat-desk-workspace.png", "/images/theme-minimal.png"],
      colors: ["Natural Wood"],
      themes: ["minimal", "natural", "modern"],
      material: "Solid pine wood",
      dimensions: "24 × 12 × 10 cm",
      careInstructions: "Wipe with a dry cloth. Avoid liquid contact.",
      room: "workspace",
      rating: 4.6,
      reviewCount: 14,
      stock: 21,
      isNewArrival: true,
      popularity: 55,
      category: "desk-workspace",
      ageDays: 3,
    },
    {
      slug: "ceramic-pen-holder",
      name: "Ceramic Pen Holder",
      shortDescription:
        "A speckled-glaze ceramic cup for pens, brushes or a single stem.",
      description:
        "A satisfyingly weighty ceramic cup with a speckled beige glaze. Pens today, brushes tomorrow, a single dried stem on Sunday — it earns its spot on any desk.",
      price: 450,
      images: ["/images/products/prod-16.png", "/images/cat-desk-workspace.png", "/images/theme-minimal.png"],
      colors: ["Speckled Beige"],
      themes: ["minimal", "natural"],
      material: "Glazed stoneware",
      dimensions: "H 10 cm × D 8 cm",
      careInstructions: "Rinse with water. Not dishwasher safe.",
      room: "workspace",
      rating: 4.5,
      reviewCount: 11,
      stock: 33,
      popularity: 48,
      category: "desk-workspace",
      ageDays: 18,
    },
    {
      slug: "gallery-photo-frame-set",
      name: "Gallery Photo Frame Set",
      shortDescription:
        "Five wooden frames in mixed sizes to build your own gallery wall.",
      description:
        "Five frames in complementary wood tones and mixed sizes, ready to compose into a gallery wall. Lay the arrangement on the floor first, then hang — your wall, your story.",
      price: 1750,
      comparePrice: 2100,
      images: ["/images/products/prod-17.png", "/images/cat-wall-decor.png", "/images/cat-lifestyle.png"],
      colors: ["Mixed Wood"],
      themes: ["modern", "minimal", "artistic"],
      material: "Wood frames, glass fronts, A4 and 15 × 20 cm sizes",
      dimensions: "Set of 5 — 2 × A4, 2 × 15×20 cm, 1 × 20×20 cm",
      careInstructions: "Wipe with a dry cloth. Hang on appropriate wall anchors.",
      room: "living-room",
      rating: 4.7,
      reviewCount: 18,
      stock: 14,
      isNewArrival: true,
      popularity: 60,
      category: "lifestyle",
      ageDays: 2,
    },
    {
      slug: "ceramic-coaster-set",
      name: "Ceramic Coaster Set",
      shortDescription:
        "Four speckled ceramic coasters with a stand — small detail, big polish.",
      description:
        "Four speckled stoneware coasters with a matching stand. They protect the table and quietly make tea time feel like an occasion.",
      price: 560,
      images: ["/images/products/prod-18.png", "/images/banner-details.png", "/images/cat-lifestyle.png"],
      colors: ["Speckled Beige"],
      themes: ["elegant", "minimal", "warm"],
      material: "Glazed stoneware with cork base",
      dimensions: "Each coaster D 10 cm",
      careInstructions: "Wipe clean. Not dishwasher safe.",
      room: "dining",
      rating: 4.6,
      reviewCount: 13,
      stock: 29,
      popularity: 50,
      category: "lifestyle",
      ageDays: 15,
    },
    ...uploadProducts,
  ];

  for (const p of products) {
    await db.product.create({
      data: {
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
        categoryId: cat(p.category),
        createdAt: daysAgo(p.ageDays),
      },
    });
  }

  const pid = (slug: string) =>
    db.product.findUnique({ where: { slug } }).then((p) => {
      if (!p) throw new Error(`Product ${slug} not found`);
      return p.id;
    });

  console.log("Seeding reviews...");
  const reviews = [
    {
      productId: null,
      customerName: "Nusrat Jahan",
      location: "Dhanmondi, Dhaka",
      rating: 5,
      comment:
        "The terracotta vase looks even better in my living room than in the photos. Really happy with the purchase.",
      isFeatured: true,
    },
    {
      productId: null,
      customerName: "Tanvir Ahmed",
      location: "Chattogram",
      rating: 5,
      comment:
        "Beautifully packed and delivered on time. The brass candle holders made my dining table feel complete.",
      isFeatured: true,
    },
    {
      productId: null,
      customerName: "Farhana Rahman",
      location: "Uttara, Dhaka",
      rating: 5,
      comment:
        "The cushion covers are so soft and the colours are exactly as shown. My sofa finally feels finished.",
      isFeatured: true,
    },
    {
      productId: null,
      customerName: "Rafiul Islam",
      location: "Sylhet",
      rating: 5,
      comment:
        "Ordered twice already. Everything feels curated, not mass-produced. Artnest just gets home décor right.",
      isFeatured: true,
    },
    {
      productId: null,
      customerName: "Sadia Karim",
      location: "Bogura",
      rating: 4,
      comment:
        "The bedside lamp gives the warmest glow. Delivery outside Dhaka took five days, as promised.",
      isFeatured: true,
    },
    {
      productId: null,
      customerName: "Arif Hossain",
      location: "Mirpur, Dhaka",
      rating: 5,
      comment:
        "The monstera looks surprisingly real — guests always ask whether it's natural. Very satisfied.",
      isFeatured: true,
    },
    {
      productId: await pid("terracotta-ceramic-vase"),
      customerName: "Mahin Chowdhury",
      location: "Banani, Dhaka",
      rating: 5,
      comment: "Great weight and finish. The narrow neck holds pampas perfectly.",
      isFeatured: false,
    },
    {
      productId: await pid("textured-cushion-cover-set"),
      customerName: "Ishrat Sultana",
      location: "Khulna",
      rating: 5,
      comment: "Stitching is neat and the bouclé is genuinely soft. Ordering another set.",
      isFeatured: false,
    },
    {
      productId: await pid("brass-candle-holder-pair"),
      customerName: "Rezaul Karim",
      location: "Gulshan, Dhaka",
      rating: 5,
      comment: "Solid brass, not the hollow kind. Dinner lighting has never looked better.",
      isFeatured: false,
    },
    {
      productId: await pid("artificial-monstera-pot"),
      customerName: "Nabila Noor",
      location: "Rajshahi",
      rating: 4,
      comment: "Very realistic. Slightly smaller than I imagined but the pot is lovely.",
      isFeatured: false,
    },
    {
      productId: await pid("bedside-table-lamp"),
      customerName: "Shafin Rahman",
      location: "Mohakhali, Dhaka",
      rating: 5,
      comment: "Warm glow exactly as described. My bedroom feels like a boutique hotel now.",
      isFeatured: false,
    },
    {
      productId: await pid("framed-line-art-set"),
      customerName: "Tasnim Alam",
      location: "Bashundhara, Dhaka",
      rating: 5,
      comment: "Hung the set above our console — instant gallery wall. Frames feel sturdy.",
      isFeatured: false,
    },
  ];

  for (const r of reviews) {
    await db.review.create({ data: r });
  }

  const counts = {
    categories: await db.category.count(),
    products: await db.product.count(),
    reviews: await db.review.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
