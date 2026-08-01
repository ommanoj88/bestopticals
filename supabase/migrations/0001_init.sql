-- TBO — Phase W0 schema + RLS
-- Postgres (Supabase). Health data (prescriptions) is protected by RLS + staff cross-read policies.

-- ---------- enums ----------
create type staff_role      as enum ('customer','staff','optician','admin');
create type rx_source       as enum ('hospital_verified','in_shop','self_upload_ocr','manual');
create type order_status     as enum ('PLACED','RX_VERIFIED','LENS_CUT','QC','READY_PICKUP','OUT_FOR_DELIVERY','DONE','REMAKE','CANCELLED');
create type payment_method   as enum ('online','cod');
create type fulfillment_kind as enum ('pickup','delivery');
create type service_kind     as enum ('eye_test','fitting','adjustment','repair');

-- ---------- core ----------
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  name          text,
  phone         text,
  preferred_lang text not null default 'en',   -- 'en' | 'kn'
  created_at    timestamptz not null default now()
);

create table shops (
  id       text primary key,                    -- 'KGF', 'RL_JALAPPA'
  name     text not null,
  address  text,
  maps_url text,
  hours    text,
  phone    text
);

create table shop_staff (
  profile_id uuid references profiles(id) on delete cascade,
  shop_id    text references shops(id) on delete cascade,
  role       staff_role not null default 'staff',
  primary key (profile_id, shop_id)
);

-- helper: is the caller staff/optician/admin at a given shop?
create or replace function is_staff_at(target_shop text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from shop_staff s
    where s.profile_id = auth.uid()
      and s.shop_id = target_shop
      and s.role in ('staff','optician','admin')
  );
$$;

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from shop_staff s where s.profile_id = auth.uid() and s.role = 'admin');
$$;

-- ---------- catalog ----------
create table products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  brand       text,
  category    text,                              -- frames|sunglasses|contacts|readers|accessory
  gender      text,
  price_inr   integer not null,                  -- selling price, paise-free rupees
  mrp_inr     integer,
  tax_rate    numeric(4,2) not null default 0.18, -- GST
  frame_shape text,
  material    text,
  color       text,
  size_class  text,                              -- narrow|medium|wide
  lens_width_mm  numeric(5,2),
  bridge_mm      numeric(5,2),
  temple_mm      numeric(5,2),
  total_width_mm numeric(5,2),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid references products(id) on delete cascade,
  storage_key text not null,
  sort        integer not null default 0,
  is_hero     boolean not null default false,
  lqip        text                                -- base64 blur placeholder
);

create table product_3d_models (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid references products(id) on delete cascade,
  glb_key       text,
  usdz_key      text,
  scale_verified boolean not null default false
);

create table inventory (
  shop_id    text references shops(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  qty        integer not null default 0 check (qty >= 0),
  primary key (shop_id, product_id)
);

-- ---------- lenses (admin-priced) ----------
-- Lens price has TWO independent dimensions the customer chooses:
--   1. VISION TYPE  — Single Vision | Bifocal | Progressive. Drives the BASE
--      price, banded by power. Bifocal + Progressive need an ADD power;
--      Progressive also needs PD (pupillary distance) to fit.
--   2. COATING      — Blu-Cut, Polycarbonate, Photogrey, Anti-Glare... add-ons
--      on top of the base. Optional, multiple.
-- Power band = higher of |SPH| or |CYL| across the Rx (both eyes). Admin sets
-- every price. See src/lib/lens.ts for the matching logic.

create table vision_types (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,                     -- 'Single Vision' | 'Bifocal' | 'Progressive'
  description text,
  needs_add   boolean not null default false,    -- bifocal + progressive require ADD power
  needs_pd    boolean not null default false,    -- progressive requires PD
  sort        integer not null default 0,
  active      boolean not null default true
);

-- Base price per vision type per power band (inclusive, absolute dioptre).
create table vision_prices (
  id             uuid primary key default gen_random_uuid(),
  vision_type_id uuid not null references vision_types(id) on delete cascade,
  power_min      numeric(5,2) not null default 0,
  power_max      numeric(5,2) not null,
  price_inr      integer not null,
  active         boolean not null default true,
  unique (vision_type_id, power_min, power_max)
);

-- Coatings/upgrades — a flat add-on price on top of the vision base.
create table lens_coatings (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,                     -- 'Blu-Cut', 'Polycarbonate', 'Photogrey', 'Anti-Glare'
  description text,
  price_inr   integer not null default 0,        -- add-on price
  sort        integer not null default 0,
  active      boolean not null default true
);

-- ---------- prescriptions (health data) ----------
create table prescriptions (
  id             uuid primary key default gen_random_uuid(),
  owner_profile_id uuid not null references profiles(id) on delete cascade,
  subject_name   text,                            -- family profiles: whose eyes
  od_sph numeric(5,2), od_cyl numeric(5,2), od_axis integer, od_add numeric(4,2), od_prism numeric(4,2), od_base text,
  os_sph numeric(5,2), os_cyl numeric(5,2), os_axis integer, os_add numeric(4,2), os_prism numeric(4,2), os_base text,
  distance_pd numeric(4,1), near_pd numeric(4,1), mono_pd_l numeric(4,1), mono_pd_r numeric(4,1),
  prescribed_by text,
  issued_at   date,
  source      rx_source not null default 'manual',
  verified_by_optician boolean not null default false,
  verified_at timestamptz,
  rx_photo_key text,                              -- private bucket; signed-URL only
  consent_at  timestamptz not null default now(), -- DPDP consent
  created_at  timestamptz not null default now()
);

create table rx_handoff_codes (
  id              uuid primary key default gen_random_uuid(),
  prescription_id uuid not null references prescriptions(id) on delete cascade,
  expires_at      timestamptz not null,
  otp_hash        text not null,                  -- OTP delivered out-of-band, never in QR
  failed_attempts integer not null default 0,
  locked_at       timestamptz,
  claimed_at      timestamptz
);

-- ---------- orders ----------
create table orders (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid not null references profiles(id) on delete cascade,
  shop_id          text references shops(id),
  status           order_status not null default 'PLACED',
  subtotal_inr     integer not null default 0,
  tax_inr          integer not null default 0,
  total_inr        integer not null default 0,
  idempotency_key  text unique,
  razorpay_order_id   text unique,
  razorpay_payment_id text,
  paid_at          timestamptz,                    -- COD: stays null until delivery
  payment_method   payment_method not null default 'online',
  fulfillment      fulfillment_kind not null default 'pickup',
  created_at       timestamptz not null default now()
);

create table order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references orders(id) on delete cascade,
  product_id     uuid references products(id),
  prescription_id uuid references prescriptions(id),
  vision_type_id   uuid references vision_types(id),
  vision_type_name text,                          -- snapshot: survives rename/delete
  lens_power       numeric(5,2),                  -- band-matching power at order time
  vision_price_inr integer not null default 0,    -- snapshot: base price (survives edits)
  coatings_json    jsonb,                          -- snapshot: [{name, price_inr}] chosen add-ons
  coatings_price_inr integer not null default 0,  -- snapshot: sum of coating add-ons
  unit_price_inr integer not null,                -- frame price snapshot
  tax_inr        integer not null default 0,
  line_total_inr integer not null                 -- (frame + vision base + coatings) incl. tax
);

create table order_status_events (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references orders(id) on delete cascade,
  from_status      order_status,
  to_status        order_status not null,
  actor_profile_id uuid references profiles(id),
  at               timestamptz not null default now()
);

create table processed_webhook_events (
  event_id     text primary key,                  -- Razorpay event id; dedupe
  processed_at timestamptz not null default now()
);

-- ---------- booking ----------
create table slots (
  id         uuid primary key default gen_random_uuid(),
  shop_id    text not null references shops(id) on delete cascade,
  service_type service_kind not null,
  slot_start timestamptz not null,
  slot_end   timestamptz not null
);

create table bookings (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on delete cascade,
  shop_id     text not null references shops(id),
  slot_id     uuid not null unique references slots(id),  -- UNIQUE = no double-book
  service_type service_kind not null,
  optician_name text,
  status      text not null default 'booked',
  created_at  timestamptz not null default now()
);

-- ============ RLS ============
alter table profiles            enable row level security;
alter table prescriptions       enable row level security;
alter table orders              enable row level security;
alter table order_items         enable row level security;
alter table bookings            enable row level security;
alter table shop_staff          enable row level security;

-- catalog + shops + slots are public-readable (browse without login)
alter table products        enable row level security;
alter table product_images  enable row level security;
alter table product_3d_models enable row level security;
alter table shops           enable row level security;
alter table slots           enable row level security;
alter table inventory       enable row level security;
alter table lens_coatings   enable row level security;
alter table vision_types    enable row level security;
alter table vision_prices   enable row level security;

create policy "catalog public read" on products        for select using (active);
create policy "images public read"  on product_images  for select using (true);
create policy "models public read"  on product_3d_models for select using (true);
create policy "shops public read"   on shops           for select using (true);
create policy "slots public read"   on slots           for select using (true);
create policy "inventory public read" on inventory     for select using (true);
create policy "vision types public read"  on vision_types  for select using (active);
create policy "vision prices public read" on vision_prices for select using (active);
create policy "coatings public read"      on lens_coatings for select using (active);

-- profiles: own row
create policy "own profile" on profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

-- shop_staff: a user can see their own staff rows
create policy "own staff rows" on shop_staff
  for select using (profile_id = auth.uid());

-- prescriptions: owner full access; staff SELECT only when linked to an order at their shop
create policy "rx owner" on prescriptions
  for all using (owner_profile_id = auth.uid()) with check (owner_profile_id = auth.uid());

create policy "rx staff read via order" on prescriptions
  for select using (
    exists (
      select 1 from order_items oi
      join orders o on o.id = oi.order_id
      where oi.prescription_id = prescriptions.id
        and is_staff_at(o.shop_id)
    )
  );

-- orders: owner; staff read at their shop; admin can update status
create policy "order owner" on orders
  for select using (profile_id = auth.uid());
create policy "order owner insert" on orders
  for insert with check (profile_id = auth.uid());
create policy "order staff read" on orders
  for select using (is_staff_at(shop_id));
create policy "order admin update" on orders
  for update using (is_admin()) with check (is_admin());

create policy "order items owner read" on order_items
  for select using (exists (select 1 from orders o where o.id = order_id and o.profile_id = auth.uid()));
create policy "order items staff read" on order_items
  for select using (exists (select 1 from orders o where o.id = order_id and is_staff_at(o.shop_id)));

-- bookings: owner; staff read at their shop
create policy "booking owner" on bookings
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy "booking staff read" on bookings
  for select using (is_staff_at(shop_id));

-- NOTE: writes to catalog/inventory/slots/order-status happen via server (service role),
-- which bypasses RLS; those endpoints re-verify caller role in code.

-- ============ GRANTS ============
-- RLS filters rows WITHIN granted privileges — it does not grant access.
-- Without these, anon/authenticated get "permission denied" before RLS runs.
grant usage on schema public to anon, authenticated;

-- anon (zero-login browse): read the public catalog only.
grant select on products, product_images, product_3d_models,
                 shops, slots, inventory, vision_types, vision_prices, lens_coatings
  to anon;

-- authenticated: read catalog + full DML on their own data — RLS scopes rows to the caller.
grant select on products, product_images, product_3d_models,
                 shops, slots, inventory, vision_types, vision_prices, lens_coatings
  to authenticated;
grant select, insert, update, delete on
  profiles, prescriptions, rx_handoff_codes, orders, order_items,
  order_status_events, bookings, shop_staff
  to authenticated;
