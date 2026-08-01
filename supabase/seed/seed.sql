-- TBO seed data (W0): 2 shops, demo products, inventory.
-- Staff/admin rows are seeded by ID after you create those auth users (see README).

insert into shops (id, name, address, maps_url, hours, phone) values
  ('KGF', 'The Best Opticals — KGF', 'Robertsonpet, KGF, Karnataka', 'https://maps.google.com/?q=KGF+opticals', 'Mon–Sat 10:00–20:00', '+91-00000-00000'),
  ('RL_JALAPPA', 'The Best Opticals — RL Jalappa Hospital', 'RL Jalappa Hospital, Kolar, Karnataka', 'https://maps.google.com/?q=RL+Jalappa+Hospital+Kolar', 'Mon–Sat 09:00–19:00', '+91-00000-00001');

insert into products (name, brand, category, gender, price_inr, mrp_inr, frame_shape, material, color, size_class, lens_width_mm, bridge_mm, temple_mm, total_width_mm) values
  ('Classic Rectangle', 'TBO', 'frames', 'unisex', 1200, 1800, 'rectangle', 'acetate', 'black', 'medium', 52, 18, 140, 138),
  ('Round Metal', 'TBO', 'frames', 'unisex', 1500, 2200, 'round', 'metal', 'gold', 'narrow', 48, 20, 145, 132),
  ('Bold Square', 'TBO', 'frames', 'men', 1400, 2000, 'square', 'acetate', 'tortoise', 'wide', 55, 17, 145, 145),
  ('Cat Eye', 'TBO', 'frames', 'women', 1600, 2400, 'cat-eye', 'acetate', 'red', 'medium', 53, 16, 140, 136),
  ('Slim Titanium', 'TBO', 'frames', 'unisex', 1900, 2800, 'rectangle', 'titanium', 'grey', 'medium', 54, 17, 145, 140),
  ('Reading +1.50', 'TBO', 'readers', 'unisex', 600, 900, 'rectangle', 'plastic', 'blue', 'medium', 50, 19, 140, 135);

-- give both shops stock of every product
insert into inventory (shop_id, product_id, qty)
  select s.id, p.id, 10 from shops s cross join products p;

-- ---------- lenses (admin sets real prices later) ----------
-- Vision types: Single Vision / Bifocal / Progressive. Bifocal+Progressive need
-- ADD; Progressive also needs PD.
insert into vision_types (name, description, needs_add, needs_pd, sort) values
  ('Single Vision', 'One correction across the whole lens (distance OR reading)', false, false, 1),
  ('Bifocal', 'Distance + reading in one lens, with a visible line', true, false, 2),
  ('Progressive', 'Distance → intermediate → reading, no line', true, true, 3);

-- Base price per vision type per power band (higher of |SPH| or |CYL|).
-- 0–2.00 | 2.01–4.00 | 4.01–8.00 — price rises with power and vision complexity.
insert into vision_prices (vision_type_id, power_min, power_max, price_inr)
  select vt.id, band.pmin, band.pmax, base.price + band.step
  from vision_types vt
  join (values
    ('Single Vision', 300),
    ('Bifocal', 1200),
    ('Progressive', 2500)
  ) as base(name, price) on base.name = vt.name
  cross join (values
    (0.00, 2.00, 0),
    (2.01, 4.00, 400),
    (4.01, 8.00, 900)
  ) as band(pmin, pmax, step);

-- Coatings/upgrades — flat add-ons on top of the vision base.
insert into lens_coatings (name, description, price_inr, sort) values
  ('Anti-Glare', 'Anti-reflective coating', 300, 1),
  ('Blu-Cut', 'Blue-light filter for screen use', 500, 2),
  ('Polycarbonate', 'Impact-resistant, lighter & thinner', 800, 3),
  ('Photogrey', 'Photochromic — darkens in sunlight', 1200, 4);
