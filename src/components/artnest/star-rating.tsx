"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  count,
  size = 14,
  className,
}: {
  rating: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      aria-label={`Rated ${rating} out of 5${count !== undefined ? ` from ${count} reviews` : ""}`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={cn(
              i < Math.round(rating)
                ? "fill-bronze text-bronze"
                : "fill-sand-deep text-sand-deep dark:fill-accent dark:text-accent"
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {rating.toFixed(1)}
        {count !== undefined && ` (${count})`}
      </span>
    </div>
  );
}
