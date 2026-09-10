# RSN ONE — Front-end Proof of Concept: Build Plan

Date: 10 Sep 2026
Inputs: `rsn-one-design/` (34 PNG mocks), `rsn-one-html/` (34 structural HTML files + handoff spec + image manifest), `RSN_One_Website_Screen_Flow.docx` (sitemap + 11 journeys).
Output: `rsn-one-poc/` — a runnable, front-end-only React app that walks every journey in the flow document with mock data and persisted client state.

---

## 1. Goal and scope

**Goal.** A clickable, data-driven POC that a stakeholder can open in a browser and walk end to end: launch → sign in → choose a store → browse → add to bag → check out → see the order → track it → request a return → join membership → use the wallet and referrals → manage the account. Every one of the 34 screens is reachable and every arrow in the flow document is a real navigation.

**In scope**
- All 34 screens (C01–C34) as routed React pages, visually faithful to the mocks and built from the handoff HTML.
- A shared design system extracted from the handoff (tokens, type scale, 14 components).
- Client-side state with persistence: auth (mock), store/market, bag, wishlist, orders, membership, wallet, referrals, addresses, payment methods, notifications, recent searches.
- Mock data catalogue: products, houses, worlds (categories), drops, promos, orders, notifications, FAQs, concierge prompts.
- Real interactions everywhere the mock shows a control: add/remove/qty, wishlist toggle, search with results, filters and sort, accordion, stepper, forms with validation, promo code, radio cards, countdown timer, copy-to-clipboard, mark-as-read, mock chat.
- Image pipeline: the 39 supplied photos converted to optimised WebP; the 21 missing slots rendered as designed placeholders that swap to the real file automatically when it lands.

**Out of scope (by design, front-end only)**
- No backend, no real auth, no real payment. Payment forms validate shape only and "succeed".
- No CMS. Copy is transcribed verbatim from the mocks into data files.
- No responsive re-layout below the 853px design canvas (see §3.3 — the design team has not decided this yet).

---

## 2. Audit of the inputs (what was found)

| Item | Finding | Consequence for the POC |
|---|---|---|
| Canvas | Mocks are 853×1844 at 1×, phone chrome on a tablet-width canvas. Handoff spec flags this as an open question. | Build at 853px design width, render inside a device frame scaled with CSS `zoom` (0.5× = 427px phone reading on desktop; fit-to-width below 853px). No numbers are divided; a rescale later is a token change. |
| Tab bar | Hairline position varies 154px across mocks. Handoff picked 88+44px. | Adopt 88px tab bar + 44px home indicator as the single shared value. |
| Tab labels | Uppercase on C03/C04/C25, title case on C06–C12/C17. | One `TabBar` component, uppercase by default, `variant="roman"` where the mock uses title case. Flag for design to unify. |
| Gutter | 25–56px across screens, modal 36px. | `--gutter: 36px` token; per-screen override only where the handoff HTML already does. |
| Fonts | Brand fonts unnamed; handoff uses Playfair Display + Inter from Google Fonts. | Same. Loaded once in `index.html`; system fallbacks declared. |
| Images | 60 slots referenced. 39 supplied, 21 missing. All 40 supplied "`.jpg`" files are actually PNGs at ~2 MB each (≈80 MB total). Two are misnamed duplicates (`rop-ceramic-jar-01.jpg`, `hero-store-footer-01.jp.png`) and one is an unnamed 853×1843 PNG. | Convert all to WebP at 2× rendered size with `sharp` (target ≈ 3–5 MB total). Missing slots: 17 product shots + 4 card/UPI artwork. Ship an `<Img slot>` component that renders a styled placeholder (name on tinted card) until the file exists at the manifest name. |
| Missing product photography | `prod-copper-vessel-01..05`, `prod-brass-kettle`, `prod-beeswax-candle`, `prod-yak-blanket`, `prod-linen-sheets`, `prod-ceramide-cream`, `prod-ceramic-mug`, `prod-gift-box`, `prod-glass-diffuser`, `prod-linen-throw`, `prod-rsn-candle`, `prod-shop-grid-07/08`. | Highest-impact gap: the product card is the most repeated component. `IMAGE-PROMPTS.md` already holds a generation prompt per slot; the team can generate or shoot and drop in — zero code change. |
| Annotations | 53 `ASSUMPTION` and 61 `DEVIATION-RISK` comments in the HTML. | Carried into the React components as comments where the decision matters; a consolidated list is in §9. |
| Flow gaps | The flow doc has no arrow into C16 Concierge except from Home, none into C29/C30 except via Me, and C13 → C25 is implied. C15 Limited Drops mock shows a stray "C10" label (design bug). | Add the obvious contextual entries (Me → Concierge, bell icon → Notifications, "Need help" → Help, Confirmation → Track/Orders). Ignore the stray label. |
| Persona mismatch | C17 Me shows "Maya Kapoor, Founding Member 047"; C26/C27 addresses use "Aanya Sharma"; C12 card placeholder "Ananya Sharma". | Single user record: Maya Kapoor. Addresses keep the mock text but attach to that user. Flag for design. |
| Currency / market | Prices in ₹, but Store Selection offers Nepal vs Global Select and addresses are in Nepal. | Store selection is persisted and changes the Home hero copy and catalogue tag; currency stays ₹ throughout (mock). Flag for product. |

---

## 3. Architecture

### 3.1 Stack

| Choice | Why |
|---|---|
| **Vite 6 + React 19 + TypeScript** | Fast dev loop, zero-config, the coding team's most likely production stack; typed data models make the mock catalogue self-documenting. |
| **react-router-dom v7** | Each screen is a route; the flow document's arrows become `<Link>` / `navigate()` calls. Deep links work for QA ("open C26"). |
| **zustand + persist** | One small store per domain, persisted to `localStorage` so the demo survives refresh. No boilerplate. |
| **Plain CSS with custom properties** | The handoff already is plain CSS + BEM. Keeping it means the coding team can diff the handoff HTML against the component 1:1. No Tailwind, no CSS-in-JS. |
| **No UI library** | The design system is small (14 components) and bespoke. |
| **sharp (dev only)** | One-off image conversion script. |

### 3.2 Folder layout

```
rsn-one-poc/
├── index.html                  fonts + root
├── public/images/              optimised WebP, manifest names (prod-copper-vessel-01.webp …)
├── scripts/                    convert-images.mjs (PNG → WebP), shots.mjs (screenshots), e2e.mjs (flow test)
├── src/
│   ├── main.tsx                router + providers
│   ├── App.tsx                 routes table (34 screens) + guards
│   ├── styles/
│   │   ├── base.css            handoff §1–8 verbatim (tokens, reset, type scale, chrome) + POC additions
│   │   └── membership-shared.css  handoff §9, shared by the six membership screens
│   ├── components/             shared design-system components (§4.3)
│   ├── layout/
│   │   └── DeviceFrame.tsx     853px artboard scaled with zoom, screen-jump + reset controls
│   ├── data/                   typed mock catalogue (§5)
│   ├── store/                  zustand slices (§6)
│   ├── lib/                    money formatting, ids, dates, validation
│   └── screens/                one folder per C-number (§7)
│       ├── C01Splash/
│       ├── …
│       └── C34MemberReferrals/
```

### 3.3 Rendering model (the 853px question)

The app renders into a fixed **853px-wide artboard** (`DeviceFrame`) exactly as the handoff does, so every measured px value is used unchanged. The frame is scaled with CSS `zoom`:

- Desktop (viewport ≥ 900px): default 0.5× → a 427×922 "phone" centred on the espresso backdrop, with a small floating control to switch **0.5× / 0.75× / 1×**.
- Narrow viewport: `zoom = viewportWidth / 853`, so it fills a tablet or phone edge to edge.

The status bar (9:41) and the home indicator are frame chrome, drawn once by `DeviceFrame`, not by each screen. The tab bar is a screen-level slot because some screens don't have one.

When the design team answers the "phone vs tablet" question, the change is confined to `tokens.css` and `DeviceFrame`.

---

## 4. Design system (extracted from the handoff)

### 4.1 Tokens (`tokens.css`)
Surface `--bg #291C19`, `--surface #33241F`, `--surface-2 #3B2A24`, `--line`, `--line-strong`, `--scrim`; accent `--rose #C97C79`, `--rose-light #E4A49D`, `--rose-pale #F0CFC9`, `--chip-bg`; text `--cream #FAF7F5`, `--muted #A99E99`, `--muted-dim #7C716C`; light-ground variants for C13/C14/C15/C31 (`--ink #3B2A24`, `--blush #F0DED7`); geometry `--gutter 36`, radii 16/14/10/999; chrome heights 70/103/88/44.

### 4.2 Type scale (`type.css`)
`.t-display 52`, `.t-h1 64`, `.t-title 40`, `.t-section 34`, `.t-h3 24`, `.t-card 18`, `.t-body-lg 22`, `.t-body 16`, `.t-row 26`, `.t-meta 14`, `.t-eyebrow 13 caps`, `.t-price 22 serif rose`, `.t-voice italic 19`, `.t-tab 15 caps`. Serif = Playfair Display, sans = Inter.

### 4.3 Components (`src/components/`)

| Component | Props (key) | Used on |
|---|---|---|
| `AppBar` | `bagCount`, `variant: logo\|back`, `title`, `right` | most screens |
| `NavBar` | `title`, `onBack`, `action` | C05, C08, C18, C26–C34 |
| `TabBar` | `active`, `variant: caps\|roman` | 20 screens |
| `SectionHead` | `title`, `link`, `to` | C03, C04, C06, C25, C29, C33, C34 |
| `Button` | `variant: primary\|outline\|text`, `block`, `icon` | everywhere |
| `Chip` | `variant: member\|filter\|status`, `active` | product cards, C04, C25 |
| `Field` | `label`, `icon`, `type`, `select`, `error` | C05, C11, C12, C20, C31, C32 |
| `ListRow` | `icon`, `label`, `meta`, `to` | C17, C30, C28 |
| `Stepper` | `steps`, `current` | C11, C12 |
| `ProductCard` | `product`, `size: rail\|grid\|wide`, `showStock` | C03, C04, C06, C09, C15 |
| `PromoCard` | `promo`, `light` | C03, C04, C19, C25, C29, C30, C33, C34 |
| `World` | `world`, `size` | C03, C04, C06 |
| `Hero` | `image`, `scrim`, `children` | C03, C14, C15, C20–C23, C30 |
| `Accordion` | `items` | C07, C24, C30 |
| `RadioCard` | `options`, `value`, `onChange` | C11, C12, C22, C32 |
| `Img` | `slot`, `w`, `h`, `alt` | every image; placeholder fallback |
| `Icon` | `name` | 30 inline SVG icons from the handoff |
| `Timeline` | `stages`, `current` | C18, C26 |
| `EmptyState` | `title`, `body`, `cta` | C09, C10, C25, C29 when empty |

---

## 5. Mock data model (`src/data/`)

```ts
Product  { id, slug, name, house: HouseId, price, memberPrice, stock: 'in'|'low'|'out',
           worlds: WorldId[], images: Slot[], blurb, story, materials, origin,
           verification, delivery, isNew, isDrop }
House    { id, name, city, country, blurb, story, image }
World    { id, name, image }                       // Morning, Skin, Sleep, Table, Gifts, Global Select
Drop     { id, title, blurb, endsAt, remaining, productIds, hero }
Promo    { id, title, text, cta, to, image, light }
Order    { id ('RSN10234'), placedAt, status, items: {productId, qty, price}[], address, payment,
           subtotal, memberDiscount, shipping, total, timeline: Stage[] }
Notification { id, group: 'today'|'week'|'earlier', title, body, when, read, image? }
Address  { id, label, name, line1, line2, city, state, postal, country, phone, isDefault }
PaymentMethod { id, kind: 'card'|'upi', brand, last4, expiry, upiId, isDefault }
WalletTx { id, kind, ref, date, amount }
Referral { id, name, joinedAt, reward }
Faq      { id, topic, q, a }
```

Catalogue seeded from the mocks: 8 products (Copper Vessel, Brass Kettle, Beeswax Candle, Yak Blanket, Ceramide Cream, Linen Sheets, Ceramic Mug, Carved Vase), 5 houses (Lazimpat, Lahori, Atelier Sand, Chyangra, Suján), 6 worlds, 1 drop (The Autumn Drop), 5 orders (RSN10234, 10223, 10232, 10231, 10230), 8 notifications, 4 addresses, 3 cards + 1 UPI, 3 wallet transactions, 2 referrals, 6 help topics.

---

## 6. State (`src/store/`, zustand + persist)

| Slice | State | Actions |
|---|---|---|
| `session` | `user`, `isAuthed`, `isGuest`, `store: 'nepal'\|'global'\|null`, `hasSeenWelcome` | `signIn`, `signUp`, `continueAsGuest`, `signOut`, `selectStore` |
| `bag` | `items: {productId, qty}[]`, `giftNote`, `promo` | `add`, `remove`, `setQty`, `applyPromo`, `clear` |
| `wishlist` | `ids[]` | `toggle`, `moveToBag`, `remove` |
| `checkout` | `address`, `deliveryMethod`, `note`, `payment` | `setAddress`, `setDelivery`, `setPayment`, `placeOrder → Order` |
| `orders` | `orders[]` (seeded + created) | `place`, `requestReturn`, `byId` |
| `membership` | `isMember`, `memberSince`, `memberNo`, `wallet: {balance, refunds, rewards, tx[]}`, `referrals` | `join`, `addFunds`, `credit`, `debit`, `copyInviteLink` |
| `account` | `addresses[]`, `paymentMethods[]` | CRUD, `setDefault` |
| `notifications` | `items[]` | `markRead`, `markAllRead` |
| `search` | `recent[]` | `push`, `clear` |
| `ui` | `zoom` | `setZoom` |

**Derived rules**
- `price(product)` = `memberPrice` when `membership.isMember`, else `price`; product cards always show both, as the mock does.
- Bag "₹X away from Member privileges" banner: threshold ₹100,000 minus subtotal (mock shows ₹47,001 on a ₹52,999 bag).
- Promo `RSN10` = 10% off; anything else shows an inline error.
- `placeOrder` creates `RSN-1xxxx`, clears the bag, adds a "Your order is confirmed" notification, routes to C13.
- `join` sets `isMember`, credits ₹2,000 welcome bonus to the wallet, adds a notification, routes to C23.
- `requestReturn` sets order status to `Return requested`, adds a notification.

---

## 7. Screen → route → interaction map

| ID | Screen | Route | Nav in | Interactions built |
|---|---|---|---|---|
| C01 | Splash | `/` | app launch | auto-advance 1.8s → C02 (or → C03 if authed + store chosen) |
| C02 | Welcome | `/welcome` | C01 | Get Started → C20; Explore as Guest → C19; Skip → C19 |
| C20 | Login / Signup | `/login` | C02, guards | Sign In / Sign Up tabs; email+password validation; Apple/Google mock; Skip → guest |
| C19 | Store Selection | `/store` | C20, C02 | Choose Nepal / Global → persisted → C03 |
| C03 | Home | `/home` | hub | hero carousel (3 slides, dots); rails; worlds → C04 filtered; promos → C08/C14/C15; bag badge live; search icon → C05 |
| C04 | Shop | `/shop` | tab | world filter chips; Sort by (Featured/Price ↑↓/New); grid; Filter sheet (house, stock); wishlist heart |
| C05 | Search | `/search` | icon | recent searches (persisted), trending chips, submit → C06 |
| C06 | Search Results | `/search/results?q=` | C05 | live filter of catalogue by name/house/world; Clear all; result count |
| C07 | Product Detail | `/product/:id` | cards | image carousel (dots), Add to bag (badge +1, toast), Save to wishlist (toggle), 6 accordions, house link → C08 |
| C08 | House Profile | `/house/:id` | C03, C07 | Explore the house → C06 filtered by house |
| C09 | Wishlist | `/wishlist` | tab | Move to Bag, Remove, Share (copy link), empty state |
| C10 | Bag | `/bag` | badge, tab | qty stepper, remove, gift note, totals, member-privileges banner, Checkout → C11 (guest → C20 first) |
| C11 | Checkout Details | `/checkout/details` | C10 | stepper (2/4); address form or "Use saved address" picker; delivery radio; note; order summary; promo code; Continue → C12 |
| C12 | Checkout Payments | `/checkout/payment` | C11 | stepper (3/4); payment radio (Card/UPI/Net Banking/Wallets/EMI); card fields with masking; Pay Now → order placed → C13 |
| C13 | Order Confirmation | `/order/confirmation/:id` | C12 | Track Order → C18; Continue Shopping → C03 |
| C14 | Membership | `/membership` | C03, C17 | benefits; Become a Member → C21; if already member → shows Wallet/Referrals CTAs |
| C21 | Membership Join | `/membership/join` | C14 | benefits list; Join Now → C22; Learn more → C14 |
| C22 | Membership Payment | `/membership/payment` | C21 | payment radio; T&C checkbox gates Pay ₹5,999 → C23 |
| C23 | Membership Confirmation | `/membership/welcome` | C22 | What's next links → C04/C15/C06; Explore Now → C03 |
| C33 | Member Wallet | `/member/wallet` | C17, C23 | balance, breakdown, transactions, Add Funds (mock +), View Usage |
| C34 | Member Referrals | `/member/referrals` | C17, C33 | Copy invite link (clipboard + toast), stats, recent referrals |
| C15 | Limited Drops | `/drops` | C03 | hero, Explore Drop → C24 |
| C24 | Drop Detail | `/drops/:id` | C15 | live countdown, thumbnails, accordions, Add to Cart → bag |
| C16 | RSN Concierge | `/concierge` | C03, C17 | prompt chips fill the field; Send → canned reply thread (mock chat) |
| C17 | Me | `/me` | tab | avatar/name/member no.; 8 rows → routes; Sign out |
| C25 | Orders | `/orders` | C17, C13 | status filter chips; order rows → C26; promo tile → C04 |
| C26 | Order Detail | `/orders/:id` | C25 | timeline, Track Package → C18, Change address → C27, View Invoice (mock), Need help → C30, Request return → C32 |
| C18 | Order Tracking | `/orders/:id/track` | C26, C13 | 7-stage vertical timeline from order state |
| C32 | Return Request | `/orders/:id/return` | C26 | reason radio, photo slots (mock), notes with 0/500 counter, Submit → status updated → C26 |
| C27 | Address Management | `/addresses` | C17, C11, C26 | list, Edit → C31, Add New → C31, set default, delete |
| C31 | Add / Edit Address | `/addresses/new`, `/addresses/:id` | C27 | full form with validation, default toggle, Save → C27 |
| C28 | Payment Methods | `/payments` | C17, C12 | cards + UPI list, set default, remove, Add (mock form) |
| C29 | Notifications | `/notifications` | C17, bell | grouped list, unread dot, Mark all as read, tap → contextual route |
| C30 | Help & Support | `/help` | C17, C26 | search filters topics, topic → FAQ accordion, Chat → C16, mailto/tel links |

Route guards: `/checkout/*`, `/me`, `/orders/*`, `/member/*`, `/addresses/*`, `/payments`, `/notifications` require `isAuthed` (guest is redirected to C20 with `returnTo`). `/home` and below require `store` (redirect to C19).

---

## 8. Build phases

| Phase | Deliverable | Done when |
|---|---|---|
| **0. Plan** | this document | reviewed |
| **1. Scaffold** | Vite+React+TS project, router, zustand, folder layout, fonts, lint/typecheck scripts | `npm run dev` shows an empty DeviceFrame |
| **2. Image pipeline** | `scripts/convert-images.mjs`; `public/images/*.webp`; `Img` component with placeholder | all 39 supplied slots render; 21 missing slots show placeholders |
| **3. Design system** | tokens/base/type CSS; 19 components; a hidden `/__kitchen-sink` route rendering all of them | matches handoff HTML side by side |
| **4. Data + store** | typed catalogue; 10 store slices with persist; `lib/money` etc. | unit-level sanity via kitchen-sink |
| **5. Screens — Entry & Core** | C01, C02, C20, C19, C03, C17 | journey 1 + 9 walkable |
| **6. Screens — Discover** | C04, C05, C06, C07, C08, C09 | journeys 2, 3 walkable |
| **7. Screens — Buy** | C10, C11, C12, C13 | journey 4 end-to-end creates an order |
| **8. Screens — Post-purchase** | C25, C26, C18, C32 | journeys 6, 7 |
| **9. Screens — Membership** | C14, C21, C22, C23, C33, C34, C15, C24, C16 | journeys 5, 8, 11 |
| **10. Screens — Account** | C27, C31, C28, C29, C30 | journey 10 |
| **11. Verify** | typecheck + production build; every route visited; every flow arrow clicked; screenshot per screen next to its mock | `VERIFICATION.md` with the checklist ticked |
| **12. Handoff** | `README.md` (run, demo script, where things live), open-questions list | team can run it in 2 commands |

Phases 5–10 are independent once 1–4 exist and are built in parallel.

---

## 9. Open questions for the design / product team

1. **Canvas.** Phone at 427px with oversized type, or genuinely 853px-wide (tablet/web)? Two-column checkout (C11/C12) only works at 853.
2. **Tab bar height and label case.** Pick one; the POC uses 88px + uppercase, `roman` variant where the mock differs.
3. **Product photography.** 17 product slots missing, including the hero product (Copper Vessel) on 13 screens. Prompts exist in `IMAGE-PROMPTS.md`.
4. **Persona.** Maya Kapoor (C17) vs Aanya Sharma (C26/C27) vs Ananya Sharma (C12 placeholder).
5. **Market and currency.** Nepal store with ₹ prices and Nepali addresses; is Global Select in a different currency?
6. **C15 stray "C10" label** on the Limited Drops mock — design artefact.
7. **Membership threshold.** Bag banner implies ₹100,000 spend unlocks "early access to Member privileges" while C21 sells membership for ₹5,999/year. Which is it?
8. **Order IDs.** `RSN-10482` (C13/C18) vs `#RSN10234` (C25/C26) — one format.
9. **Track vs Detail.** C18 shows a 7-stage flow, C26 a 4-stage one for the same idea. The POC derives both from one timeline.
10. **Brand fonts.** Playfair Display + Inter are stand-ins.

---

## 10. Demo script (acceptance walk-through)

1. Open `/` → splash → Welcome → **Get Started** → sign in with any email → choose **Nepal** → Home.
2. Home: swipe hero, tap **Copper Vessel** → PDP → **Add to bag** (badge 1) → **Save to wishlist** → **House of Lazimpat** → house profile → back.
3. Search icon → type "linen" → results → add Linen Sheets to bag.
4. Bag (badge 2) → qty +1 → promo `RSN10` → **Checkout** → address form (or saved) → Express → **Continue** → UPI → **Pay Now** → Confirmation → **Track Order**.
5. Me → Orders → new order at top → detail → **Request return** → reason → submit → status updated; notification bell shows unread.
6. Me → Membership → **Become a Member** → Join → pay → Welcome → Wallet shows ₹2,000 bonus → Referrals → **Copy** link.
7. Back on Shop: member prices now apply in the bag total.
8. Me → Addresses → Add → save → default; Payment methods → set default; Notifications → mark all read; Help → search "return" → Chat → Concierge.
9. Refresh the browser: everything persists. Sign out: state clears.

---

## 11. Status (10 Sep 2026)

| Phase | Status |
|---|---|
| 0 Plan | done — this document |
| 1 Scaffold | done — `rsn-one-poc/` (Vite 6, React 19, TS, react-router 7, zustand) |
| 2 Image pipeline | done — 42 files → 4 MB WebP, `npm run images`, stand-ins for 21 missing slots |
| 3 Design system | done — `base.css` (handoff §1–8 verbatim), `membership-shared.css`, 8 shared components, 50 icons |
| 4 Data + store | done — 16 products, 6 houses, 6 worlds, 1 drop, 5 orders, 8 notifications, 4 addresses, 4 payment methods, wallet, referrals, help, concierge; 30 store actions with persistence |
| 5–10 Screens | done — all 34 screens ported 1:1 and wired (see `rsn-one-poc/VERIFICATION.md` for deviations) |
| 11 Verify | done — typecheck 0 errors, build OK, 34/34 routes render clean, 30/30 e2e steps pass |
| 12 Handoff | done — `rsn-one-poc/README.md` (run + demo script), `CONVENTIONS.md`, `VERIFICATION.md` |

Run: `cd rsn-one-poc && npm install && npm run dev` → http://localhost:5173
