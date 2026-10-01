"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ChevronRight,
  Banknote,
  Smartphone,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUIStore } from "@/lib/artnest/navigator";
import { useCartStore, cartSubtotal } from "@/lib/artnest/cart-store";
import { formatBDT, deliveryChargeFor, DELIVERY } from "@/lib/artnest/format";
import type { DeliveryArea } from "@/lib/artnest/types";
import { cn } from "@/lib/utils";

interface FormState {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  deliveryNote: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  deliveryNote: "",
};

export function CheckoutView() {
  const navigate = useUIStore((s) => s.navigate);

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deliveryArea, setDeliveryArea] = useState<DeliveryArea>("inside-dhaka");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [placing, setPlacing] = useState(false);

  const subtotal = cartSubtotal(items);
  const deliveryCharge = deliveryChargeFor(deliveryArea, subtotal);
  const total = subtotal + deliveryCharge;

  const summaryItems = useMemo(() => items, [items]);

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!/^01[3-9]\d{8}$/.test(form.phone.trim()))
      next.phone = "Enter a valid mobile number, e.g. 01712345678.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim()))
      next.email = "That email doesn't look right.";
    if (form.address.trim().length < 6)
      next.address = "Please enter your full address.";
    if (!form.city.trim()) next.city = "Please enter your city or area.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeOrder = async () => {
    if (items.length === 0) return;
    if (!validate()) {
      toast.error("Please check the highlighted fields.");
      return;
    }
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim() || null,
            address: form.address.trim(),
            city: form.city.trim(),
            deliveryArea,
            deliveryNote: form.deliveryNote.trim() || null,
          },
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            color: i.color,
          })),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error ?? "Could not place your order.");
      }
      clearCart();
      toast.success("Order placed — thank you!");
      navigate({ name: "confirmation", orderNumber: json.order.orderNumber });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not place your order.");
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <main
        className="mx-auto flex max-w-2xl flex-col items-center px-4 pb-24 pt-24 text-center sm:px-6"
        id="main"
      >
        <p className="font-serif text-3xl">Your cart is empty</p>
        <p className="mt-3 max-w-md text-muted-foreground">
          Add a few beautiful things first — then we&apos;ll get them safely to
          your door.
        </p>
        <button
          onClick={() => navigate({ name: "shop" })}
          className="mt-8 h-12 rounded-full bg-espresso px-8 text-sm font-semibold text-ivory transition hover:bg-espresso/90"
        >
          Browse the Shop
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6" id="main">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-xs text-muted-foreground">
        <button onClick={() => navigate({ name: "shop" })} className="hover:text-foreground">
          Shop
        </button>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span className="text-foreground">Checkout</span>
      </nav>

      <h1 className="font-serif text-4xl">Checkout</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Guest checkout — no account needed. We&apos;ll confirm your order by phone.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Form */}
        <div className="space-y-8">
          <section aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="font-serif text-xl">
              Customer Information
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" required error={errors.name}>
                <input
                  className={inputClass(!!errors.name)}
                  value={form.name}
                  onChange={set("name")}
                  placeholder="e.g. Nusrat Jahan"
                  autoComplete="name"
                />
              </Field>
              <Field label="Phone Number" required error={errors.phone} hint="e.g. 01712345678">
                <input
                  className={inputClass(!!errors.phone)}
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="01XXXXXXXXX"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </Field>
              <Field label="Email (optional)" error={errors.email} className="sm:col-span-2">
                <input
                  className={inputClass(!!errors.email)}
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                />
              </Field>
              <Field label="Full Address" required error={errors.address} className="sm:col-span-2">
                <Textarea
                  className={cn("min-h-[84px] rounded-xl bg-card", errors.address && "border-destructive")}
                  value={form.address}
                  onChange={set("address")}
                  placeholder="House, road, flat, landmarks…"
                  autoComplete="street-address"
                />
              </Field>
              <Field label="City / Area" required error={errors.city}>
                <input
                  className={inputClass(!!errors.city)}
                  value={form.city}
                  onChange={set("city")}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  autoComplete="address-level2"
                />
              </Field>
              <Field label="Delivery Note (optional)">
                <input
                  className={inputClass(false)}
                  value={form.deliveryNote}
                  onChange={set("deliveryNote")}
                  placeholder="e.g. Call before delivery"
                />
              </Field>
            </div>
          </section>

          <section aria-labelledby="delivery-heading">
            <h2 id="delivery-heading" className="font-serif text-xl">
              Delivery Options
            </h2>
            <RadioGroup
              value={deliveryArea}
              onValueChange={(v) => setDeliveryArea(v as DeliveryArea)}
              className="mt-4 grid gap-3 sm:grid-cols-2"
            >
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition",
                  deliveryArea === "inside-dhaka"
                    ? "border-clay bg-clay/5"
                    : "border-border bg-card hover:border-clay/40"
                )}
              >
                <RadioGroupItem value="inside-dhaka" className="mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Inside Dhaka</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatBDT(DELIVERY.INSIDE_DHAKA)} — free over{" "}
                    {formatBDT(DELIVERY.FREE_THRESHOLD)} · {DELIVERY.INSIDE_DHAKA_DAYS}
                  </p>
                </div>
              </label>
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition",
                  deliveryArea === "outside-dhaka"
                    ? "border-clay bg-clay/5"
                    : "border-border bg-card hover:border-clay/40"
                )}
              >
                <RadioGroupItem value="outside-dhaka" className="mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Outside Dhaka</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatBDT(DELIVERY.OUTSIDE_DHAKA)} flat · {DELIVERY.OUTSIDE_DHAKA_DAYS}
                  </p>
                </div>
              </label>
            </RadioGroup>
          </section>

          <section aria-labelledby="payment-heading">
            <h2 id="payment-heading" className="font-serif text-xl">
              Payment
            </h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 rounded-2xl border border-clay bg-clay/5 p-4">
                <Banknote className="mt-0.5 h-5 w-5 text-clay" aria-hidden="true" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Cash on Delivery</p>
                    <span className="rounded-full bg-clay px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ivory">
                      Selected
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Pay in cash when your order arrives at your door.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-dashed border-border p-4 opacity-60">
                <Smartphone className="mt-0.5 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-muted-foreground">bKash</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Coming soon — online payment will be supported shortly.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside aria-label="Order summary">
          <div className="sticky top-24 rounded-2xl border border-border/70 bg-card p-6">
            <h2 className="font-serif text-xl">Order Summary</h2>
            <ul className="mt-5 max-h-64 space-y-4 overflow-y-auto pr-1 thin-scrollbar">
              {summaryItems.map((item) => (
                <li key={`${item.productId}::${item.color ?? ""}`} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-espresso px-1 text-[10px] font-bold text-ivory">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    {item.color && (
                      <p className="text-xs text-muted-foreground">{item.color}</p>
                    )}
                  </div>
                  <span className="text-sm font-semibold">
                    {formatBDT(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Charge</span>
                <span>{deliveryCharge === 0 ? "Free" : formatBDT(deliveryCharge)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                <span>Total</span>
                <span>{formatBDT(total)}</span>
              </div>
            </div>
            <button
              onClick={placeOrder}
              disabled={placing}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-espresso text-sm font-semibold text-ivory shadow-lg shadow-espresso/20 transition hover:bg-espresso/90 disabled:opacity-60"
            >
              {placing ? (
                <>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/40 border-t-ivory"
                  />
                  Placing Order…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  Place Order — {formatBDT(total)}
                </>
              )}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-clay" aria-hidden="true" />
              Pay cash on delivery · 7-day returns · Support by phone
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "h-11 w-full rounded-xl border bg-card px-3.5 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-clay focus:ring-2 focus:ring-clay/20",
    hasError ? "border-destructive" : "border-border"
  );
}

function Field({
  label,
  required,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-sm font-medium text-foreground/90">
        {label}
        {required && <span className="ml-0.5 text-clay" aria-hidden="true">*</span>}
      </Label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-destructive" role="alert">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
