# Artnest BD — Project Worklog

Project: Artnest BD home décor e-commerce (Next.js 16, single-page app under `/`, Prisma SQLite, Zustand, shadcn/ui).

Agents must read this file before starting and append their section after finishing.

---
Task ID: 0
Agent: orchestrator (main)
Task: Setup, planning and coordination for Artnest BD e-commerce build

Work Log:
- Inspected project: Next.js 16 + Tailwind 4 + shadcn/ui (full kit present) + Prisma/SQLite + Zustand + sonner.
- Dev server already running on port 3000.
- Defined image manifest (37 PNG images) stored under /public/images/** — naming is the contract for the seed script:
  hero.png; cat-wall-decor, cat-table-decor, cat-vases-plants, cat-living-room, cat-bedroom, cat-desk-workspace, cat-lifestyle (.png); room-dining, room-entryway, room-balcony (.png); products prod-01..prod-18 (.png); banner-details, banner-refresh, corner-before, corner-after (.png); theme-minimal, theme-cozy, theme-natural, theme-elegant (.png).
- Plan: Task 1-a images (subagent) ∥ Task 1-b schema+seed (main) → Task 2 APIs → Task 2-b..f frontend → Task 3 verification.

Stage Summary:
- Architecture decided: single `/` route, state-based views (home/shop/product/cart/checkout/confirmation/wishlist/about/contact), Zustand cart+wishlist+navigation with localStorage persistence, one-shot data fetch from /api/products + /api/reviews via React context.
- Palette: warm ivory #FAF6EF / sand #F0E9DC / espresso charcoal #2A241E / terracotta accent #B5623B; fonts Playfair Display (headings) + DM Sans (body).

---
Task ID: 1-a
Agent: general-purpose (image generation)
Task: Generate 37 AI images for Artnest BD

Work Log:
- Read worklog.md (Task 0 manifest contract). Verified environment: bun 1.3.14 + z-ai-web-dev-sdk 0.0.18 installed. Created /public/images with subfolders products/, rooms/, themes/.
- Wrote scripts/generate-images.mjs: full 37-entry MANIFEST (prompts verbatim with INTERIOR/PRODUCT style suffixes), skips existing files >20KB (idempotent), concurrency pool of 3, up to 3 attempts per image with 2s backoff (adaptive ~10s backoff on HTTP 429), atomic tmp+rename writes, per-entry OK/FAILED summary table, exit code 1 if anything is missing.
- Hit two API constraints and fixed them in the script: (1) the API rejects sizes whose width/height are not multiples of 32 (error 1214) so 1440x720 was invalid — normalizeSize() maps it to 1472x736 (identical 2:1 aspect) for hero/banner-details/banner-refresh; (2) transient HTTP 429 rate limiting — handled by retry backoff. Also found this sandbox kills background processes when the shell call ends, so the script was run in foreground passes instead of via nohup/setsid.
- Pass 1 (~10 min): 32/37 images done (~60-70s per image at concurrency 3). Pass 2 (idempotent re-run, skipped the 32 done): generated remaining 5 (rooms/room-entryway, themes/theme-minimal, theme-cozy, theme-natural, theme-elegant) -> 37/37, exit 0.
- Verified: du -sh images = 3.9M; products 1.7M, rooms 384K, themes 460K; 12 root + 18 products + 3 rooms + 4 themes = 37 files, all >20KB (smallest prod-04 46KB, largest room-balcony 172KB), no .tmp leftovers.

Stage Summary:
- 37/37 images generated successfully; zero persistent failures. All files saved under /home/z/my-project/public/images/: root (hero, 8 cat-*, banner-details, banner-refresh, corner-before/after), products/prod-01..18, rooms/room-dining|entryway|balcony, themes/theme-minimal|cozy|natural|elegant.
- Note for downstream tasks: the API returns JPEG bytes even for .png filenames (magic bytes ffd8); filenames kept exactly per the Task 0 contract — browsers and next/image decode by content, so they render fine as-is.
- The 3 wide images are 1472x736 instead of 1440x720 (API multiple-of-32 constraint, same 2:1 ratio) — layout code should treat hero/banners as aspect-ratio ~2:1 with object-cover.
- scripts/generate-images.mjs is idempotent and re-runnable: `cd /home/z/my-project && bun scripts/generate-images.mjs` will skip all existing files and exit 0.

---
Task ID: 1-b / 2-a..2-f / 3
Agent: orchestrator (main)
Task: Database, APIs, complete frontend build, and browser verification for Artnest BD

Work Log:
- Task 1-b: Wrote prisma/schema.prisma (Category, Product, Review, Order, OrderItem, ContactMessage — JSON-string arrays for SQLite), ran db:push, wrote prisma/seed.ts and seeded 7 categories / 18 products / 12 reviews with full copy.
- Task 2-a: API routes — GET /api/products (categories+products, parsed JSON fields), GET /api/reviews (all reviews + isFeatured), POST+GET /api/orders (server-side price resolution, BD phone validation, delivery fees: inside Dhaka ৳70/free over ৳3,000, outside ৳130), POST /api/contact.
- Task 2-b: globals.css warm palette (ivory/sand/clay/espresso + dark mode), Playfair Display + DM Sans via next/font, zustand cart store (persisted), navigator store with history sync, StoreDataProvider context (one-shot fetch of /api/products + /api/reviews).
- Task 2-c: Announcement bar, sticky shrink header, mobile Sheet menu, search overlay (live results), cart drawer, footer with policy dialogs + dark-mode toggle, account "coming soon" dialog.
- Task 2-d: Home — hero (floating product chip), featured categories, "Curated for Your Space" (8 featured), "Most Loved" best sellers, editorial banner, "Just In" scroll carousel with arrows, Shop by Room, Why Artnest BD, Style Your Space (6 moods), "It's the Small Details" before/after + Shop the Look, reviews, social gallery.
- Task 2-e: Shop view (category/price/room/style/rating/stock filters, 5 sort modes, active chips, mobile filter sheet, skeletons); Product view (gallery + thumbs, colour variants, qty stepper, Add to Cart/Buy Now, accordions, product reviews, related items).
- Task 2-f: Checkout (validated form, delivery radio, COD + disabled bKash, sticky summary), confirmation (fetches order by number), wishlist, about, contact views.
- Task 3 verification (Agent Browser): fixed 4 react-hooks/set-state-in-effect lint errors (useSyncExternalStore mounted hook, keyed remounts, close-path state resets); fixed missing useState import in product-view; restarted dev server with clean .next to resolve stale-CSS (custom @theme tokens absent); fixed room image paths (/images/rooms/...) in home-sections + seed and reseeded.
- E2E verified: homepage all sections, product page, add-to-cart (badge+toast), cart drawer, checkout form → POST /api/orders → DB row (AN-PE2WHKDZ2 ৳1,220) → confirmation page; search "vase"; shop filter "Vases & Plants" (4 pieces); contact form → DB row; wishlist add + badge; dark mode; mobile 390px (menu, grids, sticky footer); footer sticks on short pages and pushes naturally on long ones.

Stage Summary:
- Single-route SPA at `/` with 8 state-driven views; 37 AI-generated brand images under /public/images; Prisma SQLite seeded; 4 API routes; lint clean; all golden paths browser-verified end-to-end.
- Key decisions: client-side catalog from one API fetch for instant filtering; server-authoritative order totals; guest checkout; localStorage-persisted cart/wishlist; theme via next-themes (warm dark palette included).

---
Task ID: 4
Agent: orchestrator (main)
Task: Add login/sign-up page, verify product details page, animated hero product series with owner-uploaded photos (all in Wall Décor category)

Work Log:
- Copied the 10 owner-uploaded product photos from /upload to /public/images/products/ under descriptive names (rattan-blossom-wall-set.jpg, mini-led-table-lamp.jpg, sunset-blossom-pearl-vase.jpg, nature-canvas-triptych.jpg, hanging-coco-basket.jpg, bloom-rope-wall-mirror.jpg, amber-glow-lamp.jpg, jute-flower-placemat-set.jpg, rattan-ring-planter-pink.jpg, rattan-ring-planter-cascade.jpg).
- Prisma: added User model (name, unique email, optional BD phone, scrypt passwordHash), db:push.
- Created prisma/upload-products.ts as single source of truth for the 10 signature products (all category=wall-decor); seed.ts now spreads it; wrote scripts/seed-uploads.ts (idempotent upsert, non-destructive) and ran it — DB now 28 products, 13 in Wall Décor; Wall Décor category card image now uses the real store photo.
- Auth backend: src/lib/auth.ts (scrypt hash/verify, HMAC-signed stateless session token, cookie options, validators) + API routes POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me (httpOnly cookie "artnest_session", 30-day TTL).
- Client: src/lib/artnest/auth-store.ts (zustand: user/status/refresh/login/register/logout). ArtnestApp refreshes session on mount.
- New "account" view in navigator + src/components/artnest/auth-view.tsx: split layout (brand panel with bloom-rope-mirror photo + trust bullets) with Sign In / Create Account tabs, icon inputs, show/hide password, per-field + server error alerts, forgot-password toast, continue-as-guest; logged-in profile panel (avatar, contact, member-since, wishlist/shop CTAs, sign out). Deleted account-dialog.tsx ("coming soon" dialog) and accountOpen state; header now navigates to the account view and shows an avatar DropdownMenu (My Account / Wishlist / Sign Out) when signed in; mobile menu shows dynamic account label + sign out.
- Hero rewritten: static hero image replaced by an auto-advancing series of the 10 uploaded products (crossfade 1.1s + slow Ken Burns via transitions, 4.2s autoplay, pause on hover/focus/hidden tab, prefers-reduced-motion respected and disables autoplay+zoom). Vertical dot indicators, desktop prev/next arrows, and a floating product chip synced to the active slide (name, price, 1-of-10 counter, click → product page); sr-only live region announces slides.
- Fixed react-hooks/set-state-in-effect lint error in hero via useSyncExternalStore for reduced-motion detection; restarted dev server (stale Prisma client lacked User model).
- Removed 2 throwaway test accounts from DB after E2E testing.

Stage Summary:
- E2E verified with Agent Browser (desktop 1280px + mobile 390px): hero cycles uploaded product photos with chip/dots in sync (slides 1→4→6 observed); chip click opens the full product details page (breadcrumb, −22% badge, rating, stock, ৳899/৳1,150 + Save ৳251, colour, accordions, related); Add to Cart → toast + badge; register → welcome toast + avatar dropdown; profile panel; sign out; sign in again; session restored after reload via cookie; shop Wall Décor filter = 13 pieces incl. all 10 uploaded products; category card uses real store photo; Curated/Just In sections feature new products; footer natural on short + long pages; lint clean; 0 server 500/404s in dev.log.
- Auth architecture is extensible: stateless HMAC session tokens, scrypt password hashing, no new dependencies; future password reset / social login can plug into /api/auth.
