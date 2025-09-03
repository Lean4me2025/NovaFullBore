# NOVA + NAVI — Full Build (Audio + 50 Traits + OOH Brain)

This repo is ready for Vercel and includes a bundled OOH dataset plus an updater that refreshes it when BLS is available.

## Deploy on Vercel
- Framework Preset: **Other**
- Build Command: **npm run build**
- Output Directory: **public**

## Pages
- `/` — NOVA intro with audio (autoplay + overlay fallback)
- `/traits.html` — 50 trait selection
- `/results.html` — matches careers from `public/data/ooh.json`
- `/navi.html` — handoff to NAVI
- `/test.html` — audio quick test

## Data Strategy
- Bundled fallback: `public/data/ooh.json` ensures NOVA always works offline.
- Update script: `scripts/fetch_ooh.js` runs at build and attempts to fetch BLS OOH XML and overwrite `ooh.json` with the latest.
- If fetch fails, NOVA **keeps** the bundled fallback — she never goes empty-headed.

## Local Dev
```
npm install
npm run build   # (optional) refresh ooh.json from BLS if you have internet
# then serve the "public" folder with any static server
```
