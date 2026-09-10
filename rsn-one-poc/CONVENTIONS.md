# Porting a screen from `rsn-one-html/CXX-*.html` into this app

Read this whole file before touching a screen. The goal is **pixel-faithful ports that are
wired to real state**, not re-designs.

## 0. What already exists (do not recreate)

| Thing | Where | Notes |
|---|---|---|
| Tokens, reset, type scale, statusbar/appbar/section/btn/chip/tabbar CSS | `src/styles/base.css` | Sections 1–8 of every handoff file, verbatim. Section 9 = POC additions. **Never copy these rules into a screen CSS.** |
| Membership shared block (`.hero-shot .brandmark .navbar .benefit-* .tier-card .data-row .promo-banner`) | `src/styles/membership-shared.css` | Import it in C14/C21/C22/C23/C33/C34 only. |
| `<StatusBar/> <HomeIndicator/> <AppBar/> <TabBar/> <NavBar/> <SectionHead/> <EmptyState/>` | `src/components/Chrome.tsx` | AppBar renders logo + search + bag badge (live count). TabBar renders tab bar **and** home indicator inside a sticky `.tabwrap`; `variant="roman"` for title-case labels; `active="home|shop|wishlist|me"`. |
| `<Img slot="prod-copper-vessel-01" …/>` | `src/components/Img.tsx` | **Every photo goes through this.** Pass the manifest slot name (no path, no extension). Missing slots fall back to stand-ins automatically. `<Logo dark/>` for the lockup. |
| `<Icon name="…" size={..}/>` | `src/components/Icon.tsx` | ~50 icons redrawn from the handoff. For a one-off icon, paste the handoff `<svg>` inline (convert attributes to JSX: `stroke-width` → `strokeWidth`, `class` → `className`). |
| `<ProductCard product={p}/>` | `src/components/ProductCard.tsx` | The C03 card. Override sizes per screen in that screen's CSS. |
| Data | `src/data/catalogue.ts` (products, houses, worlds, drops, promos, search) · `src/data/seed.ts` (user, orders, notifications, addresses, payments, wallet, referrals, help, concierge) · `src/data/types.ts` | Never hardcode a product/price/order in a screen — read it from data or the store. |
| Store | `src/store/useStore.ts` | zustand + localStorage. `useStore(s => s.bag)`, actions like `addToBag`, `toggleWishlist`, `placeOrder`, `joinMembership`, `requestReturn`, `addAddress`, `markAllRead`, `showToast`. Helpers: `bagTotals(s)`, `priceFor(p, isMember)`, `useBagCount()`, `useUnreadCount()`, `useIsWishlisted(id)`, `orderStatusLabel(o)`. |
| Helpers | `src/lib/money.ts` `inr(25199)` → `₹25,199` · `src/lib/dates.ts` `fmtDate/fmtDay/fmtDateTime/fmtLong/fmtAgo` |
| Routes | `src/App.tsx` + `src/screens/registry.ts` | Already wired. Your screen's file name and default export are fixed — just replace the stub's contents. |
| Reference port | `src/screens/C03Home/` | Copy this pattern. |

## 1. File layout per screen

```
src/screens/C11CheckoutDetails/
  C11CheckoutDetails.tsx   default export, root element <div className="screen c11">
  C11CheckoutDetails.css   the handoff's "SCREEN:" CSS block, wrapped in `.c11 { … }`
```

- Root element: `<div className="screen c11">` (add `screen--light` / `screen--photo` if the handoff root has it).
- CSS: copy everything **below** the `/* === SCREEN: … === */` banner in the handoff `<style>`, verbatim, and wrap it in `.cXX { … }` (native CSS nesting — Vite compiles it). Do not rename classes. Delete only rules that duplicate base.css. If the handoff declares a local `--pad`/`--gutter-*` override on `.screen`, keep it on `.cXX`.
- Import the CSS at the top of the TSX: `import './C11CheckoutDetails.css';`

## 2. Markup rules

1. Transcribe the handoff `<body>` markup into JSX **section by section, in order**, keeping every class name. Convert `class`→`className`, `for`→`htmlFor`, `stroke-width`→`strokeWidth`, `stroke-linecap`→`strokeLinecap`, `stroke-linejoin`→`strokeLinejoin`, `fill-rule`→`fillRule`, `tabindex`→`tabIndex`, self-close `<img>`/`<input>`/`<br>`, and turn HTML entities into characters (`&#8377;`→`₹`, `&rsquo;`→`’`, `&amp;`→`&`, `&nbsp;`→`{' '}`).
2. Replace the status bar block with `<StatusBar />`, the home indicator with nothing if you use `<TabBar />` (it includes it) or `<HomeIndicator />` on screens without a tab bar. Replace the standard logo app bar with `<AppBar />` (plus `back` prop for the C15/C24/C29/C30 variant) **only if the handoff markup is the standard one**; keep bespoke top bars (C07 pdp-topbar, C11/C12 checkout-bar, C17 profile, C21+ navbar) as inline JSX.
3. Replace each `<img src="rsn-one-images/xxx.jpg">` with `<Img slot="xxx" …same class/width/height/alt… />`.
4. Replace hardcoded content with data: map over `PRODUCTS` / `useStore(s => s.bag)` / `SEED_*` etc. Keep the mock's copy for headings and body text.
5. Every `<a href="CXX-….html">` becomes a `<Link to="/route">` (routes in `src/screens/registry.ts`). Every `<button>` does something (store action, navigate, local state). Nothing is inert.
6. Forms: controlled inputs, simple validation (required, email shape, 6-digit pincode, 16-digit card, MM/YY), inline error under the field using `.field--error` + `.field__error`, primary CTA disabled until valid where the mock implies it.
7. Empty states: if a list can be empty (bag, wishlist, orders, notifications, results), render `<EmptyState title body cta to />` instead of the list.
8. Keep the handoff's `<!-- ASSUMPTION -->` / `<!-- DEVIATION-RISK -->` notes as `{/* … */}` JSX comments where they affect what you built.
9. No new dependencies. No inline `style` except for truly dynamic values (widths from data, progress %).
10. Toasts: `useStore(s => s.showToast)('Copied')` — don't build your own.

## 3. Behaviour to wire (per PLAN.md §7)

Each agent prompt lists the interactions for its screens. Use the store; do not add local copies of shared state.

## 4. Done means

- `npm run typecheck` passes with zero errors in your files.
- The screen renders at `/route` with no console errors, and visually matches `rsn-one-html/_compare/CXX-*.jpg` (left = mock) at 0.5× zoom.
- All links/buttons on the screen go somewhere or change state.
- You did **not** edit `base.css`, `Chrome.tsx`, `useStore.ts`, `App.tsx` or another agent's screen. If you need a store action that doesn't exist, add it to `useStore.ts` **only** by appending (never rewrite existing actions) and mention it in your report.
