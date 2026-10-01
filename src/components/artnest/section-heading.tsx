"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  centered = false,
  className,
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  action?: { label: string; onClick: () => void };
  centered?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "mb-8 flex flex-col gap-4 sm:mb-10",
        centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn(centered ? "max-w-2xl" : "max-w-2xl")}>
        {eyebrow && (
          <p className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-clay">
            <span className={cn("inline-block h-px w-6 bg-clay", centered && "hidden sm:inline-block")} />
            {eyebrow}
            {centered && <span className="hidden sm:inline-block h-px w-6 bg-clay" />}
          </p>
        )}
        <h2 className="font-serif text-3xl leading-tight sm:text-4xl text-balance">{title}</h2>
        {description && (
          <p className={cn("mt-3 text-[15px] leading-relaxed text-muted-foreground", centered && "mx-auto")}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground underline-offset-4 hover:text-clay hover:underline"
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
