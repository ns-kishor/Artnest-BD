"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CheckCircle2, Package, Phone, MapPin, Truck } from "lucide-react";
import { useUIStore } from "@/lib/artnest/navigator";
import { formatBDT, estimatedDeliveryFor } from "@/lib/artnest/format";
import type { Order } from "@/lib/artnest/types";

export function ConfirmationView({ orderNumber }: { orderNumber: string }) {
  const navigate = useUIStore((s) => s.navigate);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(
          `/api/orders?orderNumber=${encodeURIComponent(orderNumber)}`
        );
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) throw new Error(json?.error ?? "Order not found");
        setOrder(json.order as Order);
        setError(null);
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Order not found");
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-24 sm:px-6" id="main">
        <div className="mx-auto max-w-md animate-pulse space-y-4">
          <div className="h-16 w-16 rounded-full bg-secondary" />
          <div className="h-8 w-2/3 rounded bg-secondary" />
          <div className="h-24 w-full rounded bg-secondary" />
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-24 text-center sm:px-6" id="main">
        <p className="font-serif text-3xl">We couldn&apos;t find that order</p>
        <p className="mt-3 text-muted-foreground">
          {error ?? "Something went wrong."}
        </p>
        <button
          onClick={() => navigate({ name: "shop" })}
          className="mt-8 h-12 rounded-full bg-espresso px-8 text-sm font-semibold text-ivory transition hover:bg-espresso/90"
        >
          Continue Shopping
        </button>
      </main>
    );
  }

  const estimated = estimatedDeliveryFor(order.deliveryArea);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6" id="main">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-clay/10">
          <CheckCircle2 className="h-10 w-10 text-clay" aria-hidden="true" />
        </div>
        <h1 className="mt-6 font-serif text-4xl sm:text-5xl">Order Confirmed</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Thank you for choosing Artnest BD. Your order has been received — we
          will call you shortly to confirm delivery.
        </p>
        <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm">
          <Package className="h-4 w-4 text-clay" aria-hidden="true" />
          Order ID: <span className="font-mono font-semibold tracking-wide">{order.orderNumber}</span>
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-border/70 bg-card p-6 sm:p-8">
        {/* Items */}
        <h2 className="font-serif text-xl">Your Pieces</h2>
        <ul className="mt-4 space-y-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Qty {item.quantity}
                  {item.color ? ` · ${item.color}` : ""}
                </p>
              </div>
              <span className="text-sm font-semibold">
                {formatBDT(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatBDT(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Charge</span>
            <span>{order.deliveryCharge === 0 ? "Free" : formatBDT(order.deliveryCharge)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
            <span>Total (Cash on Delivery)</span>
            <span>{formatBDT(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card p-5">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-clay" aria-hidden="true" />
            Delivering To
          </p>
          <p className="mt-3 text-sm font-medium">{order.customerName}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {order.address}
            <br />
            {order.city}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {order.phone}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card p-5">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Truck className="h-3.5 w-3.5 text-clay" aria-hidden="true" />
            Estimated Delivery
          </p>
          <p className="mt-3 font-serif text-2xl">{estimated}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {order.deliveryArea === "inside-dhaka" ? "Inside Dhaka" : "Outside Dhaka"} ·
            Cash on Delivery. You&apos;ll receive a confirmation SMS before arrival.
          </p>
        </div>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => navigate({ name: "home" })}
          className="inline-flex h-12 items-center rounded-full bg-espresso px-8 text-sm font-semibold text-ivory shadow-lg shadow-espresso/20 transition hover:bg-espresso/90"
        >
          Continue Shopping
        </button>
        <p className="mt-4 font-serif text-sm italic text-muted-foreground">
          Beautiful details for beautiful spaces.
        </p>
      </div>
    </main>
  );
}
