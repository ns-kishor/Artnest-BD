"use client";

import { useState } from "react";
import { Facebook, Instagram, Music2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUIStore } from "@/lib/artnest/navigator";
import { useStoreData } from "./store-data";
import { DELIVERY, formatBDT } from "@/lib/artnest/format";

type PolicyKey = "delivery" | "returns" | "privacy" | "terms" | null;

const POLICIES: Record<
  Exclude<PolicyKey, null>,
  { title: string; body: React.ReactNode }
> = {
  delivery: {
    title: "Delivery Information",
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="text-foreground">Inside Dhaka:</strong>{" "}
          {formatBDT(DELIVERY.INSIDE_DHAKA)} — free on orders over{" "}
          {formatBDT(DELIVERY.FREE_THRESHOLD)}. Estimated delivery {DELIVERY.INSIDE_DHAKA_DAYS}.
        </p>
        <p>
          <strong className="text-foreground">Outside Dhaka:</strong>{" "}
          {formatBDT(DELIVERY.OUTSIDE_DHAKA)} flat. Estimated delivery{" "}
          {DELIVERY.OUTSIDE_DHAKA_DAYS}.
        </p>
        <p>
          Every piece is wrapped with care before dispatch. You will receive a
          confirmation call or SMS before delivery.
        </p>
      </div>
    ),
  },
  returns: {
    title: "Return Policy",
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          If a piece arrives damaged or isn&apos;t what you expected, contact us
          within <strong className="text-foreground">7 days</strong> of delivery.
        </p>
        <p>
          Items must be unused and in their original packaging. Refunds or
          replacements are processed after the returned piece reaches us.
        </p>
        <p>Candles and personal-care items can only be returned if unopened.</p>
      </div>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          We only collect what we need to deliver your order — your name, phone
          number and address. We never sell your information.
        </p>
        <p>
          Contact details are used for order updates and support only. You may ask
          us to remove your information at any time.
        </p>
      </div>
    ),
  },
  terms: {
    title: "Terms & Conditions",
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          Product colours may vary slightly depending on your screen and the
          natural materials used. We always describe items honestly.
        </p>
        <p>
          Prices are listed in Bangladeshi Taka and include VAT where applicable.
          Orders are confirmed by phone before dispatch.
        </p>
        <p>By placing an order you agree to our delivery and return policies.</p>
      </div>
    ),
  },
};

export function SiteFooter() {
  const navigate = useUIStore((s) => s.navigate);
  const { categories } = useUIStoreCategories();
  const [policy, setPolicy] = useState<PolicyKey>(null);
  const { theme, setTheme } = useTheme();

  return (
    <footer className="mt-auto bg-espresso text-ivory/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <div className="flex items-baseline gap-1 text-ivory">
              <span className="font-serif text-2xl font-semibold tracking-tight">Artnest</span>
              <span className="rounded bg-clay px-1 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] leading-none text-ivory">
                BD
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/60">
              Beautiful details for the spaces you call home. Thoughtfully curated
              décor and lifestyle pieces, delivered across Bangladesh.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <SocialButton label="Facebook" icon={<Facebook className="h-4 w-4" />} />
              <SocialButton label="Instagram" icon={<Instagram className="h-4 w-4" />} />
              <SocialButton label="TikTok" icon={<Music2 className="h-4 w-4" />} />
            </div>
          </div>

          {/* Shop */}
          <nav aria-label="Shop">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ivory">
              Shop
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <FooterLink onClick={() => navigate({ name: "shop" })}>All Products</FooterLink>
              </li>
              {categories
                .filter((c) => c.slug !== "lifestyle")
                .map((c) => (
                  <li key={c.slug}>
                    <FooterLink onClick={() => navigate({ name: "shop", category: c.slug })}>
                      {c.name}
                    </FooterLink>
                  </li>
                ))}
              <li>
                <FooterLink onClick={() => navigate({ name: "shop", category: "lifestyle" })}>
                  Lifestyle
                </FooterLink>
              </li>
            </ul>
          </nav>

          {/* Customer care */}
          <nav aria-label="Customer care">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ivory">
              Customer Care
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><FooterLink onClick={() => navigate({ name: "contact" })}>Contact Us</FooterLink></li>
              <li><FooterLink onClick={() => setPolicy("delivery")}>Delivery Information</FooterLink></li>
              <li><FooterLink onClick={() => setPolicy("returns")}>Return Policy</FooterLink></li>
              <li><FooterLink onClick={() => setPolicy("privacy")}>Privacy Policy</FooterLink></li>
              <li><FooterLink onClick={() => setPolicy("terms")}>Terms & Conditions</FooterLink></li>
            </ul>
          </nav>

          {/* Follow us */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ivory">
              Follow Us
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><FooterLink onClick={() => {}}>Facebook</FooterLink></li>
              <li><FooterLink onClick={() => {}}>Instagram</FooterLink></li>
              <li><FooterLink onClick={() => {}}>TikTok</FooterLink></li>
            </ul>
            <p className="mt-5 rounded-xl border border-ivory/15 bg-ivory/5 p-3 text-xs leading-relaxed text-ivory/60">
              Cash on Delivery available nationwide.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ivory/10 pt-6 sm:flex-row">
          <p className="text-xs text-ivory/50">
            © 2026 Artnest BD. All rights reserved.
          </p>
          <p className="font-serif text-sm italic text-ivory/60">
            Beautiful Details for Beautiful Spaces.
          </p>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-2 rounded-full border border-ivory/15 px-3.5 py-1.5 text-xs text-ivory/70 transition hover:border-ivory/40 hover:text-ivory"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {theme === "dark" ? "Light" : "Dark"} mode
          </button>
        </div>
      </div>

      <Dialog open={policy !== null} onOpenChange={(open) => !open && setPolicy(null)}>
        <DialogContent className="max-w-lg rounded-2xl">
          {policy && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">{POLICIES[policy].title}</DialogTitle>
              </DialogHeader>
              <div className="max-h-[55vh] overflow-y-auto thin-scrollbar">
                {POLICIES[policy].body}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </footer>
  );
}

function FooterLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="text-left text-ivory/60 transition hover:text-ivory hover:underline underline-offset-4"
    >
      {children}
    </button>
  );
}

function SocialButton({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/15 text-ivory/70 transition hover:border-clay hover:bg-clay hover:text-ivory"
    >
      {icon}
    </button>
  );
}

function useUIStoreCategories() {
  const { categories } = useStoreData();
  return { categories };
}
