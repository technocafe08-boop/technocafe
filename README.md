# Techno Cafe

Single-page site + admin panel (React + Vite + TS + Tailwind).

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

1. **Firebase** — create a project at console.firebase.google.com, add a Web app, enable
   **Firestore Database** (start in production mode), and paste the SDK config values in.
2. **Cloudinary** — create a free account at cloudinary.com, go to Settings > Upload >
   Upload presets, add a new preset set to **Unsigned**, and paste the cloud name + preset
   name in. Unsigned presets are safe to use from the browser — that's what they're for.

Then:

```bash
npm run dev
```

## Admin panel

Visit `/admin`. Default password: `technocafe123` — change it under **Settings** as soon as
you log in the first time. The panel manages:

- **Games** — name, price/hr, category, play mode, cover photo (upload + crop), trailer link
- **Categories** — game categories and play modes
- **Food Menu** — categories (with emoji), optional sub-categories, and items with prices
- **Gallery** — unlimited photos, each cropped to a consistent 4:5 portrait shape on upload
- **Settings** — WhatsApp number used across the site, admin password

All data lives in Firestore and updates the live site instantly (no redeploy needed).
Photos upload straight to Cloudinary and only the resulting URL is stored in Firestore.

### Firestore security rules

Since there's no real auth, lock writes down with rules like this (Firestore console >
Rules) — reads stay public so the site can load data, and you can tighten writes further
later with real Firebase Auth if you want:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if true; // tighten this once you add real auth
    }
  }
}
```

## Build

```bash
npm run build
```
