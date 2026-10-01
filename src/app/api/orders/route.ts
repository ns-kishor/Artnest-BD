import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const FREE_DELIVERY_THRESHOLD = 3000;
const INSIDE_DHAKA_FEE = 70;
const OUTSIDE_DHAKA_FEE = 130;

type IncomingItem = { productId?: unknown; quantity?: unknown; color?: unknown };

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `AN-${stamp}${rand}`;
}

export async function GET(request: NextRequest) {
  const orderNumber = request.nextUrl.searchParams.get("orderNumber");
  if (!orderNumber) {
    return NextResponse.json({ error: "orderNumber is required" }, { status: 400 });
  }
  const order = await db.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const customer = body?.customer ?? {};
    const items = Array.isArray(body?.items) ? (body.items as IncomingItem[]) : [];

    const name = String(customer.name ?? "").trim();
    const phone = String(customer.phone ?? "").trim();
    const email = customer.email ? String(customer.email).trim() : null;
    const address = String(customer.address ?? "").trim();
    const city = String(customer.city ?? "").trim();
    const deliveryArea = String(customer.deliveryArea ?? "").trim();
    const deliveryNote = customer.deliveryNote ? String(customer.deliveryNote).trim() : null;

    if (name.length < 2) {
      return NextResponse.json({ error: "Please provide your full name." }, { status: 400 });
    }
    if (!/^01[3-9]\d{8}$/.test(phone)) {
      return NextResponse.json(
        { error: "Please provide a valid Bangladeshi mobile number (e.g. 01712345678)." },
        { status: 400 }
      );
    }
    if (address.length < 6) {
      return NextResponse.json({ error: "Please provide your full address." }, { status: 400 });
    }
    if (!city) {
      return NextResponse.json({ error: "Please provide your city or area." }, { status: 400 });
    }
    if (deliveryArea !== "inside-dhaka" && deliveryArea !== "outside-dhaka") {
      return NextResponse.json({ error: "Please select a delivery option." }, { status: 400 });
    }
    if (items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    // Resolve products server-side — never trust client prices
    const normalized = items
      .map((item) => ({
        productId: String(item.productId ?? ""),
        quantity: Math.max(1, Math.min(20, Math.floor(Number(item.quantity) || 1))),
        color: item.color ? String(item.color) : null,
      }))
      .filter((i) => i.productId.length > 0);

    const dbProducts = await db.product.findMany({
      where: { id: { in: normalized.map((i) => i.productId) } },
    });

    if (dbProducts.length === 0) {
      return NextResponse.json({ error: "None of the cart items could be found." }, { status: 400 });
    }

    const lines = normalized
      .map((item) => {
        const product = dbProducts.find((p) => p.id === item.productId);
        if (!product) return null;
        const images = JSON.parse(product.images || "[]");
        return {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: Array.isArray(images) && images.length > 0 ? String(images[0]) : null,
          color: item.color,
        };
      })
      .filter((l): l is NonNullable<typeof l> => l !== null);

    if (lines.length === 0) {
      return NextResponse.json({ error: "None of the cart items could be found." }, { status: 400 });
    }

    const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
    const deliveryCharge =
      deliveryArea === "inside-dhaka"
        ? subtotal >= FREE_DELIVERY_THRESHOLD
          ? 0
          : INSIDE_DHAKA_FEE
        : OUTSIDE_DHAKA_FEE;
    const total = subtotal + deliveryCharge;

    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName: name,
        phone,
        email,
        address,
        city,
        deliveryArea,
        deliveryNote,
        subtotal,
        deliveryCharge,
        total,
        status: "confirmed",
        items: {
          create: lines.map((l) => ({
            productId: l.productId,
            name: l.name,
            price: l.price,
            quantity: l.quantity,
            image: l.image,
            color: l.color,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders failed:", error);
    return NextResponse.json(
      { error: "Something went wrong while placing your order. Please try again." },
      { status: 500 }
    );
  }
}
