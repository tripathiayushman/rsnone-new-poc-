# RSN ONE — front-end proof of concept

A clickable, front-end-only build of the 34-screen RSN One app, ported 1:1 from the design
handoff (`../rsn-one-html`) and wired to mock data and persisted client state so every
journey in `../RSN_One_Website_Screen_Flow.docx` can be walked end to end.

No backend. No real auth or payment. Everything lives in the browser (`localStorage`).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

| Script | What it does |
|---|---|
| `npm run build` | type-check + production build into `dist/` (static, host anywhere) |
| `npm run typecheck` | `tsc -b` only |
| `npm run images` | re-convert `../rsn-one-html/rsn-one-images/*` → `public/images/*.webp` and regenerate `src/data/imageIndex.ts` (run after dropping in new photography) |
| `npm run shots` | screenshot every screen into `_shots/` for side-by-side checks against `../rsn-one-html/_compare/` (needs the dev server running and a Playwright Chromium on the machine) |

## How it is put together

| Layer | Where | Notes |
|---|---|---|
| Artboard + zoom | `src/layout/DeviceFrame.tsx` | The app renders at the handoff's 853px width and is scaled with CSS `zoom` (0.5× / 0.75× / 1× on desktop, fit-to-width on small screens). The bottom bar also has a "jump to screen" list and **Reset demo**. |
| Design system | `src/styles/base.css` (handoff sections 1–8, verbatim) · `src/styles/membership-shared.css` | Tokens, type scale, chrome. Every value is mock px, undivided. |
| Shared components | `src/components/` | `Chrome.tsx` (StatusBar, AppBar, TabBar, NavBar, SectionHead, EmptyState), `Img.tsx` (slot → file, with stand-ins), `Icon.tsx`, `ProductCard.tsx` |
| Screens | `src/screens/CXX*/` | One folder per handoff screen: `CXX.tsx` + `CXX.css` (the handoff's "SCREEN:" CSS, scoped under `.cXX`). |
| Routes | `src/App.tsx`, `src/screens/registry.ts` | Guards: shopping needs a chosen store (C19); account/checkout/member routes need sign-in (C20). |
| Mock data | `src/data/catalogue.ts`, `src/data/seed.ts`, `src/data/types.ts` | 16 products, 6 houses, 6 worlds, 1 drop, 5 seed orders, 8 notifications, 4 addresses, 4 payment methods, wallet, referrals, help. |
| State | `src/store/useStore.ts` | zustand + `persist`. Bag, wishlist, checkout draft, orders, membership, wallet, addresses, payment methods, notifications, recent searches, zoom. |

Porting rules for a new or changed screen are in `CONVENTIONS.md`. The full plan, audit and
open questions are in `../PLAN.md`.

## Demo script

1. Open `/` → splash → Welcome → **Get Started** → sign in with any email → choose **Nepal** → Home.
2. Tap **Copper Vessel** → **Add to bag** → **Save to wishlist** → **House of Lazimpat** → back.
3. Search → "linen" → results → add Linen Sheets.
4. Bag → qty + → promo `RSN10` → **Checkout** → address → Express → **Continue** → UPI → **Pay Now** → Confirmation → **Track Order**.
5. Me → Orders → your new order is at the top → open a delivered order → **Request Return** → submit.
6. Me → Membership → **Become a Member** → Join → Pay → Welcome → Wallet shows the ₹2,000 bonus → Referrals → **Copy**.
7. Back in Shop the bag now applies member prices.
8. Me → Addresses → Add → Save; Payment methods → set default; Notifications → mark all read; Help → Chat → Concierge.
9. Refresh: everything persists. **Reset demo** in the bottom bar clears it.

Promo codes that work: `RSN10` (10 %), `WELCOME` (5 %).

## Photography

39 of the 60 slots in `../rsn-one-html/IMAGE-MANIFEST.md` were supplied (as PNGs mislabelled
`.jpg`, ~80 MB). They are converted to WebP (~4 MB) by `npm run images`. The 21 missing slots
(17 product shots + 4 card artworks) borrow the closest supplied photo — see `STANDIN` in
`src/lib/images.ts`; those `<img>`s carry `data-standin="true"`. Drop the real file into
`../rsn-one-html/rsn-one-images/` under the manifest name and re-run `npm run images`.

## Releases (CI)

Every push to `main` runs `.github/workflows/release.yml`:

1. **Web** — `npm ci`, type check, `npm run build` (history routing, for hosting) and
   `npm run build:embedded` (hash routing + relative paths, for the mobile shell), zipped.
2. **Android** — `rsn-one-mobile/` is an Expo app that shows the embedded web build in a
   full-screen WebView. CI runs `expo prebuild`, copies `dist-embedded` into the Android
   assets (`scripts/embed-web.mjs`), and builds a release APK with Gradle (debug-signed, so
   it installs anywhere with "unknown sources" on).
3. **Release** — a GitHub Release `v1.0.<run number>` with the APK and the web zip attached.

Nothing needs an Expo account: the APK is built on the GitHub runner. To also produce an
iOS build you would add EAS Build (`eas build -p ios`) with an `EXPO_TOKEN` secret and an
Apple signing profile.

Local equivalents: `npm run build:embedded` here, then in `../rsn-one-mobile`
`npm run build:android` (needs Android SDK + Java 17), or `EXPO_PUBLIC_WEB_URL=http://<your-ip>:5173 npx expo start`
to point the shell at the dev server on a device.
