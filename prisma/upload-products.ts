/**
 * Artnest BD signature pieces — photographed in-store and uploaded by the owner.
 * All of these products belong to the "Wall Décor" category.
 * Shared by prisma/seed.ts (full reseed) and scripts/seed-uploads.ts (idempotent upsert).
 */

export const UPLOAD_CATEGORY_IMAGE = "/images/products/rattan-blossom-wall-set.jpg";

export interface UploadProduct {
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
}

export const uploadProducts: UploadProduct[] = [
  {
    slug: "rattan-blossom-wall-set",
    name: "Handwoven Rattan Blossom Wall Set — 3 Pieces",
    shortDescription:
      "Three scalloped rattan blossoms, handwoven in warm cane — an instant focal wall.",
    description:
      "Our signature set of three flower-shaped wall pieces, each petal handwoven from natural cane around a rattan centre. Hang them clustered like a blooming branch above a console or sofa — the warm honey tones catch evening light beautifully and bring instant character to plain walls.",
    price: 899,
    comparePrice: 1150,
    images: ["/images/products/rattan-blossom-wall-set.jpg"],
    colors: ["Natural Brown"],
    themes: ["natural", "warm", "cozy"],
    material: "Handwoven natural rattan (cane)",
    dimensions: "Large 40 cm • Medium 33 cm • Small 27 cm diameter",
    careInstructions:
      "Dust with a soft dry cloth. Keep away from damp walls and direct rain.",
    room: "living-room",
    rating: 4.9,
    reviewCount: 26,
    stock: 15,
    isFeatured: true,
    isBestSeller: true,
    popularity: 95,
    category: "wall-decor",
    ageDays: 12,
  },
  {
    slug: "mini-led-table-lamp",
    name: "Mini LED Table Lamp",
    shortDescription:
      "A pocket-sized glow lamp in pastel shades — sweet for bedside tables and study desks.",
    description:
      "A tiny lamp with a big personality. The frosted pastel shade diffuses a soft warm glow — perfect for bedtime reading, dorm desks or as a thoughtful little gift. Battery operated, so it goes wherever the evening takes you.",
    price: 150,
    images: ["/images/products/mini-led-table-lamp.jpg"],
    colors: ["Pastel Blue", "Pastel Pink", "Warm Amber", "Mint Green"],
    themes: ["cozy", "modern", "warm"],
    material: "Frosted ABS diffuser, warm LED, battery operated",
    dimensions: "Height 12 cm × base 8 cm",
    careInstructions:
      "Wipe with a dry cloth. Remove batteries if unused for long periods.",
    room: "bedroom",
    rating: 4.7,
    reviewCount: 41,
    stock: 60,
    isBestSeller: true,
    isNewArrival: true,
    popularity: 93,
    category: "wall-decor",
    ageDays: 8,
  },
  {
    slug: "sunset-blossom-pearl-vase",
    name: "Sunset Blossom in Pearl Vase",
    shortDescription:
      "Fiery orange blossoms arranged in a pearl-textured vase — sunshine that never fades.",
    description:
      "A hand-arranged bouquet of sunset-orange blossoms set in our pearl-beaded ceramic vase. The petals gradate from tangerine to golden yellow, bringing a burst of warmth to consoles, side tables and office desks — with zero watering required.",
    price: 450,
    comparePrice: 590,
    images: ["/images/products/sunset-blossom-pearl-vase.jpg"],
    colors: ["Orange / Yellow"],
    themes: ["warm", "cozy", "artistic"],
    material: "Silk-touch artificial flowers, pearl-beaded ceramic vase",
    dimensions: "Overall height approx. 28 cm",
    careInstructions:
      "Dust lightly with a dry brush. Keep out of direct sunlight to preserve colour.",
    room: "living-room",
    rating: 4.8,
    reviewCount: 18,
    stock: 24,
    isFeatured: true,
    isNewArrival: true,
    popularity: 74,
    category: "wall-decor",
    ageDays: 5,
  },
  {
    slug: "nature-canvas-triptych",
    name: "Nature Canvas Painting — Set of 3",
    shortDescription:
      "Three vivid landscape canvases — meadow, river and mountain — for a fresh gallery wall.",
    description:
      "A trio of saturated landscape prints — a butterfly meadow, a tranquil river homestead and a misty mountain pavilion. Board-mounted and ready to hang in any arrangement; try a triangle composition like our studio shot for an easy designer look.",
    price: 1250,
    comparePrice: 1600,
    images: ["/images/products/nature-canvas-triptych.jpg"],
    colors: ["Green / Blue"],
    themes: ["natural", "artistic", "modern"],
    material: "Textured canvas on rigid board, ready to hang",
    dimensions: "Each panel 20 × 30 cm",
    careInstructions: "Dust with a dry cloth. Avoid hanging in direct sunlight.",
    room: "living-room",
    rating: 4.9,
    reviewCount: 23,
    stock: 10,
    isFeatured: true,
    popularity: 88,
    category: "wall-decor",
    ageDays: 15,
  },
  {
    slug: "hanging-coco-basket",
    name: "Hanging Coco Basket with Blooms",
    shortDescription:
      "A handwoven coir basket with pink lily blooms — cottage charm for any wall.",
    description:
      "Woven from natural coconut coir fibre and finished with a braided hanger, this teardrop basket comes styled with pink lily blooms and greenery. Lovely beside doorways, on balcony walls or clustered at different heights for a garden feel indoors.",
    price: 550,
    images: ["/images/products/hanging-coco-basket.jpg"],
    colors: ["Natural / Pink"],
    themes: ["natural", "cozy", "warm"],
    material: "Coconut coir rope, artificial lily and greenery",
    dimensions: "Basket approx. 18 cm; total drop with hanger approx. 55 cm",
    careInstructions:
      "Dust gently. Fluff flowers occasionally; keep away from rain.",
    room: "balcony",
    rating: 4.7,
    reviewCount: 14,
    stock: 20,
    isNewArrival: true,
    popularity: 66,
    category: "wall-decor",
    ageDays: 9,
  },
  {
    slug: "bloom-rope-wall-mirror",
    name: "Bloom Rope Wall Mirror",
    shortDescription:
      "A round mirror framed in deep-green rope and bright blooms — jewellery for your walls.",
    description:
      "Our most photographed piece. A circular mirror is framed with meticulously wrapped forest-green cotton rope, edged in wooden beads and crowned with a garden of vivid fabric blooms. It reflects light, adds colour and turns any blank wall into a statement.",
    price: 1450,
    comparePrice: 1850,
    images: ["/images/products/bloom-rope-wall-mirror.jpg"],
    colors: ["Green / Multicolour"],
    themes: ["cozy", "artistic", "warm"],
    material:
      "Cotton rope on wood base, wooden beads, fabric flowers, glass mirror",
    dimensions: "Outer diameter approx. 45 cm; mirror 30 cm",
    careInstructions: "Clean mirror with a soft damp cloth; dust flowers lightly.",
    room: "bedroom",
    rating: 5.0,
    reviewCount: 19,
    stock: 8,
    isFeatured: true,
    isBestSeller: true,
    popularity: 91,
    category: "wall-decor",
    ageDays: 20,
  },
  {
    slug: "amber-glow-lamp",
    name: "Amber Glow Pattern Lamp",
    shortDescription:
      "A honey-amber mini lamp that casts rosette light patterns across your room.",
    description:
      "Switch it on and watch the wall bloom — the faceted amber shade throws a constellation of petal-shaped light onto tables and walls. USB-rechargeable and mesmerising at night; a warm, forgiving glow for bedrooms, nurseries and cosy corners.",
    price: 350,
    images: ["/images/products/amber-glow-lamp.jpg"],
    colors: ["Amber"],
    themes: ["warm", "cozy", "artistic"],
    material: "Faceted acrylic shade, warm LED, USB rechargeable",
    dimensions: "Height 14 cm × base 8 cm",
    careInstructions: "Wipe with a dry cloth. Charge fully before first use.",
    room: "bedroom",
    rating: 4.8,
    reviewCount: 33,
    stock: 35,
    isBestSeller: true,
    isNewArrival: true,
    popularity: 87,
    category: "wall-decor",
    ageDays: 11,
  },
  {
    slug: "jute-flower-placemat-set",
    name: "Jute Flower Placemats — Set of 3",
    shortDescription:
      "Hand-braided jute mats in a scalloped flower shape — rustic warmth for the dining table.",
    description:
      "Braided by hand from golden jute and finished with a scalloped petal edge, these placemats layer texture under everyday plates and teacups. Set of three; wipe-clean and naturally heat resistant for kettles and serving dishes.",
    price: 450,
    comparePrice: 560,
    images: ["/images/products/jute-flower-placemat-set.jpg"],
    colors: ["Golden Jute"],
    themes: ["natural", "warm", "minimal"],
    material: "Hand-braided natural jute rope",
    dimensions: "Each mat approx. 38 cm diameter",
    careInstructions:
      "Wipe with a barely damp cloth and dry flat. Do not machine wash.",
    room: "dining",
    rating: 4.6,
    reviewCount: 12,
    stock: 28,
    isNewArrival: true,
    popularity: 59,
    category: "wall-decor",
    ageDays: 7,
  },
  {
    slug: "rattan-ring-planter-pink",
    name: "Rattan Ring Wall Planter — Pink Bloom",
    shortDescription:
      "A suspended cane ring holding a woven pot of pink star blooms — softness for bare walls.",
    description:
      "A hand-bent cane hoop cradles a woven planter filled with blush-pink star flowers. Hang it where the light is kind — hallway walls, above desks or on the balcony — for a floating-garden effect that is light, airy and utterly charming.",
    price: 650,
    images: ["/images/products/rattan-ring-planter-pink.jpg"],
    colors: ["Natural Cane / Pink"],
    themes: ["natural", "cozy", "warm"],
    material: "Natural cane ring, woven rattan pot, artificial flowers",
    dimensions: "Hoop diameter approx. 40 cm; total height approx. 65 cm",
    careInstructions:
      "Dust with a dry cloth. Keep indoors or in covered outdoor spaces.",
    room: "balcony",
    rating: 4.8,
    reviewCount: 16,
    stock: 18,
    isNewArrival: true,
    popularity: 71,
    category: "wall-decor",
    ageDays: 4,
  },
  {
    slug: "rattan-ring-planter-cascade",
    name: "Rattan Ring Wall Planter — Cascading Green",
    shortDescription:
      "A cane hoop planter with trailing jade vines — a waterfall of green for your walls.",
    description:
      "The statement companion to our Pink Bloom ring: a suspended cane hoop holding a woven basket overflowing with trailing jade vines. The greenery cascades 60 cm below the ring, softening doorways, accent walls and balcony corners with living colour.",
    price: 750,
    comparePrice: 950,
    images: ["/images/products/rattan-ring-planter-cascade.jpg"],
    colors: ["Natural Cane / Green"],
    themes: ["natural", "modern", "minimal"],
    material: "Natural cane ring, woven rattan pot, artificial trailing vines",
    dimensions: "Hoop diameter approx. 40 cm; vines trail approx. 60 cm",
    careInstructions: "Dust with a dry cloth or cool hairdryer. Keep away from water.",
    room: "balcony",
    rating: 4.9,
    reviewCount: 21,
    stock: 16,
    isFeatured: true,
    isNewArrival: true,
    popularity: 79,
    category: "wall-decor",
    ageDays: 4,
  },
];
