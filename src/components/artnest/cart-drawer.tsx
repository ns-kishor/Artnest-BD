"use client";

import Image from "next/image";
import { Heart, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUIStore } from "@/lib/artnest/navigator";
import { useCartStore, cartSubtotal } from "@/lib/artnest/cart-store";
import { formatBDT, DELIVERY } from "@/lib/artnest/format";

export function CartDrawer() {
  const cartOpen = useUIStore((s) => s.cartOpen);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const navigate = useUIStore((s) => s.navigate);

  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);

  const subtotal = cartSubtotal(items);

  const proceedToCheckout = () => {
    setCartOpen(false);
    navigate({ name: "checkout" });
  };

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border p-5">
          <SheetTitle className="font-serif text-xl">
            Your Cart
            {items.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {items.reduce((n, i) => n + i.quantity, 0)} item
                {items.reduce((n, i) => n + i.quantity, 0) > 1 ? "s" : ""}
              </span>
            )}
          </SheetTitle>
          <button
            onClick={() => setCartOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-foreground"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
            </div>
            <div>
              <p className="font-serif text-xl">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Beautiful things are waiting for you.
              </p>
            </div>
            <button
              onClick={() => {
                setCartOpen(false);
                navigate({ name: "shop" });
              }}
              className="h-11 rounded-full bg-espresso px-6 text-sm font-medium text-ivory transition hover:bg-espresso/90"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 thin-scrollbar">
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li
                    key={`${item.productId}::${item.color ?? ""}`}
                    className="flex gap-3 rounded-xl border border-border/70 bg-card p-3"
                  >
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        navigate({ name: "product", slug: item.slug });
                      }}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary"
                      aria-label={`View ${item.name}`}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <button
                          onClick={() => {
                            setCartOpen(false);
                            navigate({ name: "product", slug: item.slug });
                          }}
                          className="truncate text-left text-sm font-medium text-foreground hover:text-clay"
                        >
                          {item.name}
                        </button>
                        <button
                          onClick={() => {
                            removeItem(item.productId, item.color);
                            toast.success("Removed from cart", { description: item.name });
                          }}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-destructive"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {item.color && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.color}</p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-border">
                          <button
                            onClick={() =>
                              setQuantity(item.productId, item.color, item.quantity - 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground disabled:opacity-40"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              setQuantity(item.productId, item.color, item.quantity + 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              toggleWishlist(item.productId);
                              removeItem(item.productId, item.color);
                              toast.success("Moved to wishlist", { description: item.name });
                            }}
                            className="text-muted-foreground transition hover:text-clay"
                            aria-label={`Move ${item.name} to wishlist`}
                          >
                            <Heart className="h-4 w-4" />
                          </button>
                          <span className="text-sm font-semibold">
                            {formatBDT(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border bg-card p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">{formatBDT(subtotal)}</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Delivery calculated at checkout — free inside Dhaka on orders over{" "}
                {formatBDT(DELIVERY.FREE_THRESHOLD)}.
              </p>
              <button
                onClick={proceedToCheckout}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-espresso text-sm font-semibold tracking-wide text-ivory transition hover:bg-espresso/90"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-2 flex h-10 w-full items-center justify-center text-sm text-muted-foreground transition hover:text-foreground"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
