# Running The Best Opticals locally — one command

Clone, then run **one** command. It installs anything missing, creates and seeds
the database, and starts the web app, the mobile app, and the backend together.

```bash
python run.py
```

That's it. On a fresh machine the script will:

1. Check `node`, `npm`, `docker` — on Windows it installs missing ones with `winget`.
2. Start Docker Desktop if it isn't running.
3. Start local Supabase and **create + seed the database** on first run.
4. Point the web app and the mobile app at this PC (mobile uses your Wi-Fi/LAN IP).
5. Launch **web** (http://localhost:3000) and **mobile** (Expo QR) at once.

Everything lives in one branch: the web app at the repo root, the Expo app in `mobile/`.

## Requirements
- Python 3.9+ (`python --version`) — the only thing you install by hand.
- Docker Desktop must be allowed to run. First launch downloads images (a few minutes, one-time).

## Using it
- **Web:** open http://localhost:3000
- **Mobile:** install **Expo Go** on your phone and scan the QR in the terminal. The
  app is served over a **tunnel**, so the QR works even behind a firewall. Keep the phone
  on the **same Wi-Fi** as the PC though — that's how it reaches the local database.
- **Stop:** `Ctrl+C` stops web + mobile. Supabase keeps running — `npx supabase stop` to shut it down.

## Flags
- `python run.py --reset` — wipe and recreate the database (re-runs migrations + seed).
- `python run.py --selfcheck` — run the script's internal tests.

## Windows note
The first time Expo/Node opens port 8081, Windows shows a **firewall prompt** — click **Allow**
so your phone can reach the dev server. (On macOS, allow incoming connections for `node` if asked.)
