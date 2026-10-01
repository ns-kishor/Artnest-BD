"use client";

import { Sparkles } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-espresso text-ivory">
      <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[11px] font-medium tracking-[0.08em] sm:text-xs">
        <Sparkles className="hidden h-3.5 w-3.5 text-clay sm:block" aria-hidden="true" />
        <span className="hidden sm:inline">Thoughtful Details for Beautiful Spaces</span>
        <span className="hidden sm:inline text-ivory/40" aria-hidden="true">•</span>
        <span>
          Free delivery inside Dhaka on orders over ৳3,000
        </span>
      </p>
    </div>
  );
}
