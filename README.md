# The Best Opticals — Web App

Web-first build. See `../Documents/technical-build-doc.md` for the full plan.

## Stack
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind · Supabase · next-intl (kn/en) · TanStack Query.

> **Note:** Next.js 16 has breaking changes vs older versions. Read `node_modules/next/dist/docs/` before writing Next code (`cookies()`/`headers()`/`params` are async; `middleware`→`proxy`; Turbopack is default).

## Setup

1. `npm install`
2. Create a Supabase project → copy `.env.example` to `.env.local` and fill in the keys.
3. Apply the schema + seed:
   - Supabase Dashboard → SQL Editor → run `supabase/migrations/0001_init.sql`, then `supabase/seed/seed.sql`.
   - (Or with the Supabase CLI: `supabase db push` once linked.)
4. Seed staff roles **after** creating auth users: insert into `shop_staff (profile_id, shop_id, role)` — e.g. one `admin` and one `optician`. (A `profiles` row is created on first sign-in; you can also insert manually.)
5. `npm run dev` → http://localhost:3000

## Long-lead items to start now (not code — see build doc §9b)
- India DLT SMS header/template registration (gates OTP)
- Razorpay account + KYC
- 3D model content pipeline for top 30–50 frames (gates try-on)
- Optometrist pilot agreement (gates Rx handoff)
- GST registration

## Phase status
- **W0 Foundation** — ✅ scaffold, schema+RLS migration, seed, i18n (kn/en), calm home. Build + typecheck green.
- **W1 Catalog (zero-login)** — ✅ product list + URL filters (shape/material/size/colour/price/for), product page with **lens picker** (type → power-band price, admin-set), image CDN transforms + LQIP + skeleton, **guest cart** (localStorage). Build + typecheck green; lens-pricing self-check passes (`npx tsx src/lib/lens.test.ts`). **e2e (browse→cart) is blocked until a live Supabase project exists** — see Setup.
- W2 Prescriptions + accounts (incl. **auth: Sign in / Sign up / Skip-for-now; login only at buy**) · W3 Checkout+orders (+admin: lens price management) · W4 Booking · W5 Rx handoff · W6 Try-on · W7 Polish+PWA.

## Lenses & pricing (admin-only)
Customer picks a lens **type** (Blu-Cut / Polycarbonate / Photogrey / Anti-Glare / Single Vision…); price comes from `lens_prices` bands matched on the strongest |dioptre| of the Rx. Only admin edits `lens_types`/`lens_prices` (W3-admin). `order_items` snapshots the type name + price so past orders survive price edits.

## UI / design system — "Clarity"
Thesis: *blur resolving into focus*. Fonts: Fraunces (display, optical-size axis) · Hanken Grotesk (body) · Space Mono (clinical numbers only). Palette: clinical navy `#10202e` / cool paper `#f2f6f7` / teal / amber. Signature: the anti-reflective lens-coating **sheen** gradient.

**Photo-first (like real eyewear sites).** The hero and catalog use **real studio product photos**, not 3D — this is what Lenskart/Warby actually do and it looks real immediately. A white-background studio shot composites onto the tinted hero panel via `mix-blend: multiply` (no white box).
- **Hero image:** drop a real frame photo at `public/hero/frame.png` — it replaces the vector placeholder (`public/hero/frame.svg`) automatically. See `src/components/HeroPhoto.tsx`.
- **Catalog images:** upload frame photos to the Supabase `catalog` storage bucket and add `product_images` rows; `ProductThumb`/`ProductCard` already render them via CDN transforms (AVIF/WebP + resize + LQIP).
- **3D was removed** — procedural WebGL glasses can't match a product photo, and real-time 3D is the wrong tool for a catalog. If a rotating 3D try-on is wanted later, it belongs in W6 with a real scanned GLB, not procedural geometry.

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npx tsc --noEmit` — typecheck
