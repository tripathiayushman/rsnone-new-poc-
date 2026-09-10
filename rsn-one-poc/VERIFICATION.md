# Verification — RSN One POC (10 Sep 2026)

## Automated checks

| Check | Command | Result |
|---|---|---|
| Type check | `npm run typecheck` | 0 errors |
| Production build | `npm run build` | OK (one 500 kB chunk-size warning; expected for a single-bundle POC) |
| Every route renders | `npm run shots` | 34/34 screens, 0 console errors, 0 page errors, no unexpected redirects |
| Demo journey | `npm run e2e` | 30/30 steps, 0 browser errors |

The screenshot pass writes `_shots/CXX.png` at 853px for side-by-side comparison with
`../rsn-one-html/_compare/CXX-*.jpg`. Every screen was compared by eye during the build.

## What the e2e walk proves

Splash → Welcome → sign-in validation → sign in → store selection → Home → PDP add-to-bag
(badge updates) → wishlist → house profile → search "linen" → second add-to-bag → bag qty →
checkout details with saved address + Express + promo `RSN10` → UPI → order placed (bag
cleared, order persisted with promo and shipping, notification pushed) → tracking timeline →
orders list → return request on a delivered order (status updated) → membership join via UPI
(member flag, ₹2,000 wallet bonus) → wallet top-up → referral link copied → member pricing in
the bag → new address saved → payment default changed → notifications marked read → help
search + concierge reply → state survives reload → sign-out resets.

## Bug found and fixed during verification

- **C12 Checkout Payments** bounced to `/bag` after Pay Now: `placeOrder()` empties the bag
  synchronously and the screen's empty-bag guard rendered a `<Navigate>` before the confirmation
  navigation ran. Fixed with a `placing` ref that stands the guard down once payment starts.
  (The membership payment screen had the same race and was fixed by its author the same way.)

## Deviations from the mocks (deliberate)

| Screen | Deviation | Why |
|---|---|---|
| C03 Home | Hero rotates through 3 slides; "Limited Discoveries" cards show full card content | Mock shows one frame; rail is cut off by the frame in the mock |
| C04 Shop | Grid is the full 16-product catalogue; the two unidentifiable cut-off cards and the 8th clipped disc are omitted | Data-driven grid |
| C08 House Profile | Added "Objects from {house}" rail below the mock content | Gives the profile a way into the catalogue |
| C10 Bag | Delivery line reads the chosen method (₹199 if Express is already selected) | Total is never contradicted |
| C13 Confirmation | Added "N pieces · total · ETA" line under the order number | Confirmation carries the order facts |
| C15 Limited Drops | Stray "C10" label in the mock dropped | Design artefact |
| C17 Me | Added a "Sign out" row; subtitle reads "Member" until membership is joined | Demo needs a reset path; member number is state-driven |
| C18 / C25 / C26 | Order IDs shown as stored (`RSN10234`); C13 alone shows the hyphenated `RSN-10234` | Mock uses both formats — flagged in PLAN.md §9 |
| C22 Membership Payment | T&C checkbox pre-ticked | Matches the mock; handoff flags it as a legal risk |
| C24 Drop Detail | Title rendered "Handcrafted / Copper Vessel" | Mock reads that way; catalogue name is "Copper Vessel" |
| C25 Orders | 4th tab labelled "Orders" | Matches the mock; differs from every other screen |
| C26 Order Detail | Added "Request Return" button (delivered orders) and "Return requested — under review" line | Flow doc needs C26 → C32 |
| C28 Payment Methods | Card artwork drawn in CSS | The four card/UPI image slots were not supplied |
| C29 Notifications | Search/bag icons hidden, back arrow rose | Matches the mock's bespoke bar |
| C30 Help | Topic titles forced to one line | Mock shows one line; real Playfair metrics wrap |
| C31 Add Address | Added a "Label" chip row (Home / Office / Other) | The list screen needs a label per address |
| C33 Wallet | Non-members see a "Join RSN One to unlock your wallet" bar | Screen is reachable before joining |

## Stand-in photography

21 manifest slots had no file. They borrow the closest supplied photo (map in
`src/lib/images.ts`, `data-standin="true"` on the `<img>`). Most visible: the Copper Vessel
(13 screens) uses the brass-urn drop photo. Replace by dropping the real file into
`../rsn-one-html/rsn-one-images/` under the manifest name and running `npm run images`.

## Not covered

- No responsive layout below the 853px artboard (design decision pending — PLAN.md §9.1).
- No unit tests; verification is type-level + the two browser scripts above.
- Fonts load from Google Fonts; offline demos fall back to Georgia / system sans.
