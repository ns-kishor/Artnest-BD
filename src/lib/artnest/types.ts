export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  image: string | null;
  sortOrder: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  colors: string[];
  themes: string[];
  material: string | null;
  dimensions: string | null;
  careInstructions: string | null;
  room: string | null;
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  popularity: number;
  categorySlug: string;
  categoryName: string;
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  location: string | null;
  rating: number;
  comment: string;
  isFeatured: boolean;
  productName: string | null;
  productSlug: string | null;
}

export type DeliveryArea = "inside-dhaka" | "outside-dhaka";

export interface OrderLine {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
  color: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  deliveryArea: DeliveryArea | string;
  deliveryNote: string | null;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: string;
  items: OrderLine[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string | null;
  stock: number;
}

export const THEME_LABELS: Record<string, string> = {
  minimal: "Minimal",
  cozy: "Cozy",
  natural: "Natural",
  elegant: "Elegant",
  modern: "Modern",
  warm: "Warm",
  artistic: "Artistic",
};

export const ROOM_LABELS: Record<string, string> = {
  "living-room": "Living Room",
  bedroom: "Bedroom",
  dining: "Dining Area",
  workspace: "Workspace",
  entryway: "Entryway",
  balcony: "Balcony",
};

export const ALL_ROOMS = Object.keys(ROOM_LABELS);
export const ALL_THEMES = Object.keys(THEME_LABELS);
