import type { DeliveryArea } from "./types";

export const DELIVERY = {
  INSIDE_DHAKA: 70,
  OUTSIDE_DHAKA: 130,
  FREE_THRESHOLD: 3000,
  INSIDE_DHAKA_DAYS: "2–4 days",
  OUTSIDE_DHAKA_DAYS: "4–7 days",
} as const;

export function formatBDT(amount: number): string {
  return `৳${new Intl.NumberFormat("en-IN").format(Math.round(amount))}`;
}

export function deliveryChargeFor(area: DeliveryArea | string, subtotal: number): number {
  if (area === "inside-dhaka") {
    return subtotal >= DELIVERY.FREE_THRESHOLD ? 0 : DELIVERY.INSIDE_DHAKA;
  }
  return DELIVERY.OUTSIDE_DHAKA;
}

export function estimatedDeliveryFor(area: DeliveryArea | string): string {
  return area === "inside-dhaka" ? DELIVERY.INSIDE_DHAKA_DAYS : DELIVERY.OUTSIDE_DHAKA_DAYS;
}

export function discountPercent(price: number, comparePrice: number | null): number | null {
  if (!comparePrice || comparePrice <= price) return null;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}
