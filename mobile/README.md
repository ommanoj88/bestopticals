# The Best Opticals — Mobile (iOS + Android)

One React Native (Expo, TypeScript) codebase → **both** the iOS App Store and
Google Play. Shares the **same Supabase backend** as the web app.

## Stack
Expo SDK 57 · React Native · TypeScript · React Navigation (native-stack) ·
Supabase JS (AsyncStorage-backed session) · shared catalog + lens data model.

## What's built (parity with web W1)
- **Home** — Swiss/brutalist storefront: focus-lens headline, category grid,
  shop-by-shape, honest-pricing pledge, ticker.
- **Shop** — live product grid from Supabase (`listProducts`, filter by
  category/shape), 2-column cards with % OFF + "+ lens from".
- **Product** — frame details + **vision-type lens picker** (from the same
  `vision_types`/`vision_prices` tables), "from" pricing, add to cart.
- **Cart** — guest cart (AsyncStorage), "Sign in to buy" deferred (matches web).

## Config
Supabase URL + anon key live in `app.json` → `expo.extra`. They currently point
at the **local** Supabase (`http://127.0.0.1:54321`). For a real build, swap to
your hosted Supabase project's URL + anon key. Only the anon key ships in the
client — RLS enforces access; the service role never ships.

> **Local note:** a phone/emulator can't reach `127.0.0.1` on your Mac. For
> device testing against local Supabase, set `supabaseUrl` to your Mac's LAN IP
> (e.g. `http://192.168.1.x:54321`) or point at the hosted project.

## Run it
```bash
cd TBO/mobile
npm install
npx expo start          # then press i (iOS sim), a (Android emulator), or scan the QR in Expo Go
```
- **iOS simulator** needs Xcode; **Android emulator** needs Android Studio.
- Easiest on a real phone: install **Expo Go**, run `npx expo start`, scan the QR.

## Verify (no devices needed)
```bash
npx tsc --noEmit                       # types
npx expo export --platform all -d dist # bundles iOS + Android (Metro)
```
Both are green in CI-style checks.

## Ship to the stores (needs your accounts)
Uses EAS (Expo Application Services):
```bash
npm i -g eas-cli
eas login
eas build --platform ios       # → App Store (needs Apple Developer account, $99/yr)
eas build --platform android   # → Play Store (needs Google Play account, $25 once)
eas submit -p ios              # upload to App Store Connect
eas submit -p android          # upload to Play Console
```
Bundle IDs are set in `app.json`: `com.thebestopticals.app` (both platforms).
Replace the placeholder icons in `assets/` before submitting.

## Next (post-parity)
Auth (phone OTP via Supabase), checkout + Razorpay, prescription capture,
push notifications for "order ready", virtual try-on (ARKit/ARCore).
