"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUIStore } from "@/lib/artnest/navigator";
import { Button } from "@/components/ui/button";
import { UserRound, Heart, ShoppingBag } from "lucide-react";

export function AccountDialog() {
  const accountOpen = useUIStore((s) => s.accountOpen);
  const setAccountOpen = useUIStore((s) => s.setAccountOpen);
  const navigate = useUIStore((s) => s.navigate);

  return (
    <Dialog open={accountOpen} onOpenChange={setAccountOpen}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <UserRound className="h-6 w-6 text-clay" aria-hidden="true" />
          </div>
          <DialogTitle className="text-center font-serif text-2xl">
            Accounts are coming soon
          </DialogTitle>
          <DialogDescription className="text-center leading-relaxed">
            For now, you can shop and check out as a guest — it&apos;s quick and
            you won&apos;t miss anything. Your wishlist is saved on this device.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="outline"
            className="rounded-full h-11"
            onClick={() => {
              setAccountOpen(false);
              navigate({ name: "wishlist" });
            }}
          >
            <Heart className="h-4 w-4" aria-hidden="true" />
            My Wishlist
          </Button>
          <Button className="rounded-full h-11 bg-espresso hover:bg-espresso/90" onClick={() => setAccountOpen(false)}>
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Continue as Guest
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
