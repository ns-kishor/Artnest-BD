"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  EyeOff,
  Heart,
  Loader2,
  LogOut,
  Lock,
  Mail,
  Phone,
  ShoppingBag,
  Sparkles,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUIStore } from "@/lib/artnest/navigator";
import { useAuthStore } from "@/lib/artnest/auth-store";
import { cn } from "@/lib/utils";

const inputClasses =
  "h-12 w-full rounded-xl border border-border bg-background pl-11 pr-11 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-clay focus-visible:ring-2 focus-visible:ring-ring/40";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs font-medium text-destructive" role="alert">
      {message}
    </p>
  );
}

export function AccountView() {
  const navigate = useUIStore((s) => s.navigate);
  const { user, status, login, register, logout } = useAuthStore();

  if (status === "loading") {
    return (
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6" id="main">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          <div className="hidden animate-pulse rounded-3xl bg-secondary lg:block" />
          <div className="h-[430px] animate-pulse rounded-3xl bg-secondary" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6" id="main">
      <div className="mx-auto grid max-w-5xl items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Brand panel */}
        <aside
          aria-hidden="true"
          className="relative hidden overflow-hidden rounded-3xl bg-secondary lg:block"
        >
          <Image
            src="/images/products/bloom-rope-wall-mirror.jpg"
            alt=""
            fill
            sizes="40vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/35 to-espresso/10" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-ivory">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-ivory/85">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Artnest BD
            </p>
            <p className="mt-3 font-serif text-3xl leading-snug">
              Become part of
              <br />
              the nest.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-ivory/90">
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                Faster checkout with saved details
              </li>
              <li className="flex items-center gap-2">
                <Heart className="h-4 w-4 shrink-0" aria-hidden="true" />
                A wishlist that follows every device
              </li>
              <li className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
                First look at new arrivals
              </li>
            </ul>
          </div>
        </aside>

        {/* Form / profile panel */}
        <section
          className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm sm:p-10"
          aria-labelledby="account-heading"
        >
          {user ? (
            <ProfilePanel />
          ) : (
            <>
              <h1 id="account-heading" className="font-serif text-3xl text-balance">
                Welcome to Artnest
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Sign in to your account, or create one in under a minute.
                Shopping as a guest is always welcome too.
              </p>

              <Tabs defaultValue="signin" className="mt-7">
                <TabsList className="grid h-11 w-full grid-cols-2 rounded-full bg-secondary p-1">
                  <TabsTrigger
                    value="signin"
                    className="rounded-full text-sm font-medium data-[state=active]:bg-ivory data-[state=active]:text-espresso dark:data-[state=active]:bg-card"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="rounded-full text-sm font-medium data-[state=active]:bg-ivory data-[state=active]:text-espresso dark:data-[state=active]:bg-card"
                  >
                    Create Account
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="signin" className="mt-6">
                  <SignInForm
                    onSubmit={async (email, password) => {
                      const signedIn = await login(email, password);
                      toast.success(`Welcome back, ${signedIn.name.split(" ")[0]}!`);
                      navigate({ name: "home" });
                    }}
                  />
                </TabsContent>
                <TabsContent value="signup" className="mt-6">
                  <SignUpForm
                    onSubmit={async (input) => {
                      const created = await register(input);
                      toast.success(
                        `Welcome to Artnest, ${created.name.split(" ")[0]}! Your account is ready.`
                      );
                      navigate({ name: "home" });
                    }}
                  />
                </TabsContent>
              </Tabs>

              <div className="mt-6 border-t border-border/70 pt-5 text-center">
                <button
                  onClick={() => navigate({ name: "home" })}
                  className="text-sm font-medium text-clay underline-offset-4 hover:underline"
                >
                  Continue as guest
                  <ArrowRight className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

/* ------------------------------- Sign in ------------------------------- */

function SignInForm({
  onSubmit,
}: {
  onSubmit: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors: typeof fieldErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (!password) {
      errors.password = "Enter your password.";
    }
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setPending(true);
    try {
      await onSubmit(email.trim(), password);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {formError}
        </div>
      )}

      <div>
        <label htmlFor="signin-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="signin-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
            aria-invalid={Boolean(fieldErrors.email)}
          />
        </div>
        <FieldError message={fieldErrors.email} />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="signin-password" className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Password
          </label>
          <button
            type="button"
            onClick={() =>
              toast.info("Password reset is on its way.", {
                description: "For now, message us on Facebook or WhatsApp and we'll help you recover your account.",
              })
            }
            className="text-xs font-medium text-clay underline-offset-4 hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClasses}
            aria-invalid={Boolean(fieldErrors.password)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <FieldError message={fieldErrors.password} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-espresso text-sm font-semibold text-ivory shadow-lg shadow-espresso/20 transition hover:bg-espresso/90 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

/* ------------------------------ Sign up ------------------------------- */

function SignUpForm({
  onSubmit,
}: {
  onSubmit: (input: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string | undefined> = {};
    if (name.trim().length < 2) errors.name = "Tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    const cleanPhone = phone.trim();
    if (cleanPhone && !/^01[3-9]\d{8}$/.test(cleanPhone)) {
      errors.phone = "Bangladeshi mobile only, e.g. 01712345678 — or leave it empty.";
    }
    if (password.length < 6) errors.password = "At least 6 characters, please.";
    if (confirm !== password) errors.confirm = "Passwords don't match.";
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setPending(true);
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        phone: cleanPhone || undefined,
        password,
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {formError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="signup-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Full Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
              aria-invalid={Boolean(fieldErrors.name)}
            />
          </div>
          <FieldError message={fieldErrors.name} />
        </div>
        <div>
          <label htmlFor="signup-phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Phone <span className="font-normal normal-case tracking-normal">(optional)</span>
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="signup-phone"
              type="tel"
              autoComplete="tel"
              placeholder="01712 345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClasses}
              aria-invalid={Boolean(fieldErrors.phone)}
            />
          </div>
          <FieldError message={fieldErrors.phone} />
        </div>
      </div>

      <div>
        <label htmlFor="signup-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
            aria-invalid={Boolean(fieldErrors.email)}
          />
        </div>
        <FieldError message={fieldErrors.email} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="signup-password" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(inputClasses, "pr-11")}
              aria-invalid={Boolean(fieldErrors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <FieldError message={fieldErrors.password} />
        </div>
        <div>
          <label htmlFor="signup-confirm" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="signup-confirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repeat password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClasses}
              aria-invalid={Boolean(fieldErrors.confirm)}
            />
          </div>
          <FieldError message={fieldErrors.confirm} />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-clay text-sm font-semibold text-ivory shadow-lg shadow-clay/25 transition hover:bg-clay/90 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {pending ? "Creating account…" : "Create My Account"}
      </button>
      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        By creating an account you agree to our friendly terms — your details stay
        private and are only used for your orders.
      </p>
    </form>
  );
}

/* ------------------------------ Profile -------------------------------- */

function ProfilePanel() {
  const navigate = useUIStore((s) => s.navigate);
  const { user, logout } = useAuthStore();

  if (!user) return null;
  const initial = user.name.trim().charAt(0).toUpperCase() || "A";
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex h-full flex-col">
      <h1 id="account-heading" className="font-serif text-3xl">
        My Account
      </h1>

      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-border/70 bg-secondary/50 p-4">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-clay font-serif text-xl text-ivory"
          aria-hidden="true"
        >
          {initial}
        </span>
        <div className="min-w-0">
          <p className="truncate font-serif text-lg">{user.name}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          {user.phone && (
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" aria-hidden="true" />
              {user.phone}
            </p>
          )}
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border border-border/70 p-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Member Since
          </dt>
          <dd className="mt-1 font-medium">{memberSince}</dd>
        </div>
        <div className="rounded-2xl border border-border/70 p-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Checkout
          </dt>
          <dd className="mt-1 font-medium">Cash on Delivery</dd>
        </div>
      </dl>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => navigate({ name: "wishlist" })}
          className="flex h-12 items-center justify-center gap-2 rounded-full border border-espresso/25 text-sm font-semibold text-espresso transition hover:border-espresso hover:bg-espresso hover:text-ivory dark:border-ivory/30 dark:text-ivory dark:hover:bg-ivory dark:hover:text-espresso"
        >
          <Heart className="h-4 w-4" aria-hidden="true" />
          My Wishlist
        </button>
        <button
          onClick={() => navigate({ name: "shop" })}
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-espresso text-sm font-semibold text-ivory transition hover:bg-espresso/90"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Continue Shopping
        </button>
      </div>

      <div className="mt-auto pt-8">
        <button
          onClick={async () => {
            await logout();
            toast.success("Signed out. See you soon!");
          }}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold text-muted-foreground transition hover:border-destructive/40 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
