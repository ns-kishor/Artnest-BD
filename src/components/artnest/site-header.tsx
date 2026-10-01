"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { useUIStore, type View } from "@/lib/artnest/navigator";
import { useCartStore, cartCount } from "@/lib/artnest/cart-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};
/** false during SSR and the hydration render, true afterwards — no effect needed */
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const NAV_LINKS: { label: string; view: View; hash?: string }[] = [
  { label: "Home", view: { name: "home" } },
  { label: "Shop", view: { name: "shop" } },
  { label: "Categories", view: { name: "home", hash: "categories" } },
  { label: "New Arrivals", view: { name: "shop", onlyNew: true, sort: "newest" } },
  { label: "Collections", view: { name: "home", hash: "collections" } },
  { label: "About", view: { name: "about" } },
  { label: "Contact", view: { name: "contact" } },
];

export function Logo({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn("flex items-baseline gap-1 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm", className)}
      aria-label="Artnest BD — go to homepage"
    >
      <span className="font-serif text-[22px] font-semibold leading-none tracking-tight sm:text-2xl">
        Artnest
      </span>
      <span className="rounded bg-clay px-1 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] leading-none text-ivory">
        BD
      </span>
    </button>
  );
}

export function SiteHeader() {
  const navigate = useUIStore((s) => s.navigate);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const setAccountOpen = useUIStore((s) => s.setAccountOpen);
  const mobileMenuOpen = useUIStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);

  const items = useCartStore((s) => s.items);
  const wishlist = useCartStore((s) => s.wishlist);
  const mounted = useMounted();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const count = mounted ? cartCount(items) : 0;
  const wishCount = mounted ? wishlist.length : 0;

  const go = (link: { view: View }) => navigate(link.view);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur-md transition-all duration-300",
        scrolled ? "border-border shadow-[0_8px_30px_-18px_rgba(43,36,30,0.35)]" : "border-transparent"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-all duration-300 sm:px-6",
          scrolled ? "h-14" : "h-16 lg:h-[76px]"
        )}
      >
        {/* Left — mobile menu + logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-accent lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo onClick={() => navigate({ name: "home" })} />
        </div>

        {/* Center — desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => go(link)}
              className="group relative text-sm font-medium text-foreground/75 transition hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-clay transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Right — actions */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-accent"
            aria-label="Search products"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigate({ name: "wishlist" })}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-accent"
            aria-label={`Wishlist${wishCount ? `, ${wishCount} items` : ""}`}
          >
            <Heart className="h-5 w-5" />
            {wishCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-bold text-ivory">
                {wishCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setAccountOpen(true)}
            className="hidden h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-accent lg:flex"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-accent"
            aria-label={`Cart${count ? `, ${count} items` : " is empty"}`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-bold text-ivory">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="border-b border-border p-5 text-left">
            <SheetTitle asChild>
              <div>
                <Logo onClick={() => navigate({ name: "home" })} />
                <p className="mt-2 text-xs text-muted-foreground">
                  Beautiful details for beautiful spaces
                </p>
              </div>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col p-3" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.view)}
                className="rounded-lg px-3 py-3 text-left font-serif text-lg text-foreground transition hover:bg-accent"
              >
                {link.label}
              </button>
            ))}
            <div className="my-3 h-px bg-border" />
            <button
              onClick={() => navigate({ name: "wishlist" })}
              className="rounded-lg px-3 py-3 text-left text-sm font-medium text-foreground transition hover:bg-accent"
            >
              Wishlist {wishCount > 0 && `(${wishCount})`}
            </button>
            <button
              onClick={() => setAccountOpen(true)}
              className="rounded-lg px-3 py-3 text-left text-sm font-medium text-foreground transition hover:bg-accent"
            >
              Account
            </button>
            <p className="px-3 pt-4 text-xs leading-relaxed text-muted-foreground">
              Cash on Delivery available nationwide.
              <br />
              Free delivery inside Dhaka over ৳3,000.
            </p>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
