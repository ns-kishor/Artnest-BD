"use client";

import { useState } from "react";
import { Facebook, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function ContactView() {
  const [form, setForm] = useState({ name: "", contact: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((err) => ({ ...err, [key]: "" }));
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Please tell us your name.";
    if (form.contact.trim().length < 5)
      next.contact = "A phone number or email helps us reply.";
    if (form.subject.trim().length < 2) next.subject = "Please add a subject.";
    if (form.message.trim().length < 10)
      next.message = "Please write a slightly longer message.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Could not send your message.");
      setSent(true);
      setForm({ name: "", contact: "", subject: "", message: "" });
      toast.success("Message sent — we'll get back to you soon.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send your message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6" id="main">
      <header className="mx-auto max-w-2xl text-center">
        <p className="mb-3 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-clay">
          <span aria-hidden="true" className="inline-block h-px w-6 bg-clay" />
          Contact Us
          <span aria-hidden="true" className="inline-block h-px w-6 bg-clay" />
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl">Say Hello</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Questions about an order, a product, or styling advice? We&apos;re
          happy to help.
        </p>
      </header>

      <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[380px_1fr]">
        {/* Info cards */}
        <div className="space-y-4">
          <InfoCard icon={<Phone className="h-4 w-4" />} title="Phone / WhatsApp">
            +880 1712-345678
            <br />
            Sat–Thu, 10am–8pm
          </InfoCard>
          <InfoCard icon={<Mail className="h-4 w-4" />} title="Email">
            hello@artnestbd.com
          </InfoCard>
          <InfoCard icon={<Facebook className="h-4 w-4" />} title="Facebook">
            facebook.com/artnestbd
          </InfoCard>
          <InfoCard icon={<MapPin className="h-4 w-4" />} title="Studio">
            House 12, Road 5, Dhanmondi,
            <br />
            Dhaka 1205, Bangladesh
          </InfoCard>
        </div>

        {/* Form */}
        <form
          onSubmit={submit}
          className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8"
          noValidate
        >
          <h2 className="font-serif text-2xl">Send a Message</h2>
          {sent && (
            <p
              role="status"
              className="mt-4 rounded-xl border border-clay/30 bg-clay/5 px-4 py-3 text-sm text-clay"
            >
              Thank you! Your message has been received — we usually reply within
              a day.
            </p>
          )}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-sm font-medium">Name <span className="text-clay" aria-hidden="true">*</span></Label>
              <input
                className={cn(inputClass, errors.name && "border-destructive")}
                value={form.name}
                onChange={set("name")}
                placeholder="Your name"
                aria-label="Name"
              />
              {errors.name && <p className="mt-1.5 text-xs text-destructive" role="alert">{errors.name}</p>}
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium">Phone / Email <span className="text-clay" aria-hidden="true">*</span></Label>
              <input
                className={cn(inputClass, errors.contact && "border-destructive")}
                value={form.contact}
                onChange={set("contact")}
                placeholder="How can we reach you?"
                aria-label="Phone or email"
              />
              {errors.contact && <p className="mt-1.5 text-xs text-destructive" role="alert">{errors.contact}</p>}
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-1.5 block text-sm font-medium">Subject <span className="text-clay" aria-hidden="true">*</span></Label>
              <input
                className={cn(inputClass, errors.subject && "border-destructive")}
                value={form.subject}
                onChange={set("subject")}
                placeholder="e.g. Question about an order"
                aria-label="Subject"
              />
              {errors.subject && <p className="mt-1.5 text-xs text-destructive" role="alert">{errors.subject}</p>}
            </div>
            <div className="sm:col-span-2">
              <Label className="mb-1.5 block text-sm font-medium">Message <span className="text-clay" aria-hidden="true">*</span></Label>
              <Textarea
                className={cn("min-h-[120px] rounded-xl bg-card", errors.message && "border-destructive")}
                value={form.message}
                onChange={set("message")}
                placeholder="Tell us what's on your mind…"
                aria-label="Message"
              />
              {errors.message && <p className="mt-1.5 text-xs text-destructive" role="alert">{errors.message}</p>}
            </div>
          </div>
          <button
            type="submit"
            disabled={sending}
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-espresso px-8 text-sm font-semibold text-ivory shadow-lg shadow-espresso/20 transition hover:bg-espresso/90 disabled:opacity-60"
          >
            {sending ? (
              <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/40 border-t-ivory" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
            {sending ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-clay">
        {icon}
      </div>
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground">{children}</p>
      </div>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-clay focus:ring-2 focus:ring-clay/20";
