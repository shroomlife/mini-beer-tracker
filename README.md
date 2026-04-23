# 🍺🤏 Mini Beer Tracker

> Crowdsourced Mini-Heineken-Späti-Tracker für Berlin — mit Geolocation,
> Gamification und ohne Google-Maps-API-Key.

[![Docker Image](https://img.shields.io/badge/GHCR-mini--beer--tracker-006B3F?logo=docker&logoColor=white)](https://github.com/shroomlife/mini-beer-tracker/pkgs/container/mini-beer-tracker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Built with Nuxt 4](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Runtime: Bun](https://img.shields.io/badge/Bun-runtime-000000?logo=bun&logoColor=white)](https://bun.com)

Die kleinen 0,15-l-Heinekens gibt's leider nicht überall. In Berlin laufen wir
mit meiner Frau gerne die Spätis ab — und wenn wir mal einen erwischen, der
sie führt, wäre es nice, das irgendwo zu merken. Genau dafür ist diese PWA.

## ✨ Features

### Kartografie
- 🗺️ **Leaflet + OpenStreetMap** als In-App-Map. Kein Google-Maps-API-Key,
  kein Billing, Offline-Tile-Caching via Workbox.
- 📱 **Progressive Web App** — iOS/Android: „Zum Home-Screen hinzufügen" →
  standalone-App, Offline-Support.
- 📍 **"In Google Maps öffnen"** öffnet die native Google-Maps-App mit
  Turn-by-Turn-Navigation (URL-Scheme, keyless).

### Crowdsourcing + Probabilistik
- 🍺 **"HIER GIBTS MINI BIER!"**-Button mit High-Accuracy-Geolocation → OSM
  Nominatim Reverse-Geocoding → Spot gespeichert.
- ✅ **"Noch da!"**-Bestätigung für bestehende Spots (Frische-Bump).
- 🕵️ **"War nicht da"**-Report: Spot wird nicht gelöscht, aber Confidence sinkt.
- 📊 **Bayesian Confidence-Score** pro Spot mit Laplace-Smoothing und
  Recency-Bias — je mehr Reports, desto präziser die Wahrscheinlichkeit.
- 🎯 **Auto-Dedupe**: gleicher Name im Umkreis von ~25 m wird als
  Bestätigung gewertet statt Duplikat.

### Gamification
- 🏆 **XP + Level-System**: Neue Spots geben 50 XP, Bestätigungen 10 XP,
  Not-Found-Reports 5 XP.
- 🏅 **Rangtitel** vom „Späti-Neuling" bis zur „Ewigen Mini-Gottheit".
- 🎉 **Level-Up-Celebration** (Full-Screen) + **XP-Toasts** + **Haptic Feedback**
  via Vibration API + **Emoji-Konfetti**-Regen bei neuen Spots.

### Security + Auth
- 🔐 **Email-Login** mit **Argon2id** (via Bun's nativem `Bun.password`).
- 🍪 **Session-Cookies** (HttpOnly, SameSite=Lax) über `nuxt-auth-utils`.
- 👤 Jeder Spot ist an den Finder gekoppelt.

## 🧱 Tech-Stack

| Layer      | Tech                                             |
|------------|--------------------------------------------------|
| Runtime    | [Bun](https://bun.com) 1.3                       |
| Framework  | [Nuxt 4](https://nuxt.com) + TypeScript (SSR)    |
| UI         | Vue 3 + [Tailwind CSS v4](https://tailwindcss.com) |
| State      | Pinia / `useState`                               |
| Map        | [Leaflet](https://leafletjs.com) + OpenStreetMap |
| Geocoding  | OSM Nominatim (server-side proxy)                |
| DB         | SQLite via [Prisma 6](https://prisma.io)         |
| Auth       | [`nuxt-auth-utils`](https://github.com/atinux/nuxt-auth-utils) + Argon2id |
| PWA        | `@vite-pwa/nuxt` + Workbox                       |
| CI         | GitHub Actions → GHCR Multi-arch Image           |

## 🚀 Deployment (empfohlen)

**Self-Host in 60 Sekunden**, via vorgebautes Image aus GHCR:

```yaml
# docker-compose.yml auf deinem Server
services:
  mini-beer-tracker:
    image: ghcr.io/shroomlife/mini-beer-tracker:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file: .env
    volumes:
      - mini-beer-data:/data

volumes:
  mini-beer-data:
```

```env
# .env daneben
DATABASE_URL=file:/data/mini-beer.db
NUXT_SESSION_PASSWORD=<min-32-char-random-secret>
NUXT_NOMINATIM_USER_AGENT=MiniBeerTracker/1.0 (you@example.com)
```

```bash
docker compose up -d
# → http://<server>:3000
```

Siehe auch [`docker-compose.prod.yml`](./docker-compose.prod.yml) mit Healthcheck.

## 👨‍💻 Lokale Entwicklung

```bash
bun install
cp .env.example .env
# NUXT_SESSION_PASSWORD generieren:
bun -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
bunx prisma db push
bun run dev
# → http://localhost:3000
```

## 🗂️ Datenmodell

```prisma
model User {
  id, email (unique), passwordHash, displayName?, xp, createdAt, updatedAt
  spots: Spot[]
  reports: SpotReport[]
}

model Spot {
  id, name, address, lat, lon, accuracyM?, priceCents?, vibe?
  confirmCount, notFoundCount, confirmedAt, lastNotFoundAt?
  createdBy: User?
  reports: SpotReport[]
}

model SpotReport {
  id, kind ('found' | 'not_found'), createdAt
  spot: Spot, user: User?
}
```

## 🌐 API

| Methode | Endpoint                          | Beschreibung                                  |
|---------|-----------------------------------|-----------------------------------------------|
| `GET`   | `/api/spots?lat=&lon=`           | Alle Spots, optional nach Distanz sortiert    |
| `POST`  | `/api/spots`                      | Neuer Spot (oder Confirm bei Duplicate)       |
| `POST`  | `/api/spots/:id/confirm`          | „Noch da!" — Frische + `found`-Report         |
| `POST`  | `/api/spots/:id/not-found`        | „War nicht da" — `not_found`-Report           |
| `DELETE`| `/api/spots/:id`                  | Spot löschen (nur eigener)                    |
| `GET`   | `/api/geocode?lat=&lon=`          | Reverse-Geocoding via Nominatim               |
| `POST`  | `/api/auth/register`              | Email + Passwort → Session                    |
| `POST`  | `/api/auth/login`                 | Login                                         |
| `POST`  | `/api/auth/logout`                | Session clearen                               |
| `GET`   | `/api/auth/me`                    | Current User inkl. XP/Level/Rank              |

Jede mutierende Spot-Route gibt `{ spot, xp: { gained, totalXp, leveledUp, ... } }` zurück.

## 🔐 Privacy

- Standort wird **nur auf Knopfdruck** abgefragt und ausschließlich zum
  Speichern des Späti-Spots verwendet.
- Keine Analytics, kein Tracking, keine externen APIs außer
  OSM-Tiles/Nominatim (public, ohne Keys).
- Passwörter werden mit **Argon2id** gehasht (Bun native, 64 MiB, 3 Rounds).

## 🤝 Contributing

PRs willkommen — insbesondere: andere Städte-Presets, weitere Badges/Ränge,
Offline-Queue für Spots ohne Netz, Freunde-System, Preis-Heatmap.

## 📜 Lizenz

[MIT](./LICENSE) — have fun and drink responsibly 🍻
