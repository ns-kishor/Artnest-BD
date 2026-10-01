"use client";

import { useEffect } from "react";
import { initHistorySync, useUIStore } from "@/lib/artnest/navigator";
import { useAuthStore } from "@/lib/artnest/auth-store";
import { StoreDataProvider } from "./store-data";
import { AnnouncementBar } from "./announcement-bar";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { CartDrawer } from "./cart-drawer";
import { SearchOverlay } from "./search-overlay";
import { HomeView } from "./home-view";
import { ShopView } from "./shop-view";
import { ProductView } from "./product-view";
import { CheckoutView } from "./checkout-view";
import { ConfirmationView } from "./confirmation-view";
import { WishlistView } from "./wishlist-view";
import { AboutView } from "./about-view";
import { ContactView } from "./contact-view";
import { AccountView } from "./auth-view";

export function ArtnestApp() {
  const view = useUIStore((s) => s.view);
  const refreshAuth = useAuthStore((s) => s.refresh);

  // Browser back/forward support
  useEffect(() => initHistorySync(), []);

  // Restore signed-in user from the session cookie
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // Scroll to top on view change (home with hash handles its own scrolling)
  useEffect(() => {
    const hasHash = view.name === "home" && Boolean(view.hash);
    if (!hasHash) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [view]);

  return (
    <StoreDataProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-espresso focus:px-4 focus:py-2 focus:text-sm focus:text-ivory"
        >
          Skip to content
        </a>
        <AnnouncementBar />
        <SiteHeader />
        <div className="flex-1">
          <ViewSwitch view={view} />
        </div>
        <SiteFooter />
        <CartDrawer />
        <SearchOverlay />
      </div>
    </StoreDataProvider>
  );
}

function ViewSwitch({ view }: { view: ReturnType<typeof useUIStore.getState>["view"] }) {
  switch (view.name) {
    case "shop":
      return <ShopView key={JSON.stringify(view)} />;
    case "product":
      return <ProductView key={view.slug} slug={view.slug} />;
    case "checkout":
      return <CheckoutView />;
    case "confirmation":
      return <ConfirmationView key={view.orderNumber} orderNumber={view.orderNumber} />;
    case "wishlist":
      return <WishlistView />;
    case "about":
      return <AboutView />;
    case "contact":
      return <ContactView />;
    case "account":
      return <AccountView />;
    case "home":
    default:
      return <HomeView />;
  }
}
