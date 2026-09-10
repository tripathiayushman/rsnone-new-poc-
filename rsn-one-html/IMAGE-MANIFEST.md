# RSN ONE — Image Manifest

Every image slot referenced by the 34 handoff HTML files.

**No photography ships in this folder.** The only real asset present is the logo, extracted from the mocks. Every other row is a *named slot*: the HTML points at it, and the image renders as a labelled dashed box until the real file is dropped in at that exact path and name.

- **60 distinct slots**, **135 `<img>` elements** across 34 screens.
- Sizes are the **rendered** size in the 853×1844 artboard. Supply source files at 2× or 3×.
- A slot used on several screens keeps **one** name — the largest rendered size wins for sourcing.

## About the supplied zip

The `rsn-one-images/` zip that came with the brief holds 31 **web** photographs — beige studio shots of linen, pillows, balms, tabletops. The app mocks use a different, copper/rose Nepal-themed library. Cross-checking every slot below against those 31 filenames found **no reusable match**: the closest by name, `pdp-yak-blanket-01`, is a folded beige blanket where the app screens show a pink one. So the app photography still needs to be supplied.


## Logo

| Slot (file name) | Used on | Rendered size | Aspect | Notes |
|---|---|---|---|---|
| `logo-rsnone-01.png` | 20 screens: C01, C03, C04, C06, C09, C10, C11, C12, C15, C19, C20, C21, C22, C23, C25, C29, C30, C32, C33, C34 | 432×218 | 1.98 | extracted from mock; swap for production SVG; 8 sizes: 432×218, 289×146, 273×138, 240×121, 238×120, 186×94, 168×85, 156×79 |
| `logo-rsnone-dark-01.png` | C02, C07, C13 | 319×161 | 1.98 | dark-ink variant for light ground; extracted from mock; swap for production SVG; 3 sizes: 319×161, 313×158, 168×85 |

## Heroes — full-bleed screen backdrops

| Slot (file name) | Used on | Rendered size | Aspect | Notes |
|---|---|---|---|---|
| `hero-help-support-01.jpg` | C30 | 853×445 | 1.92 | NEW SLOT; blossoms, carved vase and book; left 45% must scrim to near-solid for the title |
| `hero-home-01.jpg` | C03 | 853×432 | 1.97 | full-bleed, left scrim carries headline |
| `hero-limited-drops-01.jpg` | C15 | 853×1844 | 0.46 | NEW SLOT; blossoms + wrapped gifts on marble; left-to-right scrim carries the copy |
| `hero-login-01.jpg` | C20 | 853×1844 | 0.46 | textured vase of blossom, stone bowl and The Kinfolk Home on a plaster ledge; darkened out below y~960 for the form |
| `hero-membership-01.jpg` | C14 | 853×1844 | 0.46 | pale pink linen throw with the physical RSN One card photographed on it; source PNG is 845x1862, authored at 853x1844 (see file note); light placeholder ground so the dark ink type stays readable |
| `hero-membership-join-01.jpg` | C21 | 853×1844 | 0.46 | arched alcove, vase of blossom, RSN One card on a marble plinth; the card is photographed in, not a separate layer |
| `hero-membership-payment-01.jpg` | C22 | 853×1844 | 0.46 | same shoot as C21, different frame (vase, bowl, KINFOLK book); the RSN One card is not in this crop, so a separate slot |
| `hero-membership-welcome-01.jpg` | C23 | 853×1844 | 0.46 | same shoot again: RSN One box upright, falling petals; an opaque espresso panel covers it from y=1220 down |
| `hero-order-confirmation-01.jpg` | C13 | 853×1844 | 0.46 | NEW slot; LIGHT image (blush wall, RSN one gift box, lit candle, blossom vase). All screen copy is dark type laid straight on it with NO scrim, so the top-left third must stay pale. Source mock was only 281x567 - size is scaled, request a full-size export. |
| `hero-store-footer-01.jpg` | C19 | 853×356 | 2.40 | blossom in vase + stone bowl on wood; fades up into the flat background at y=1488 |
| `hero-welcome-01.jpg` | C02 | 853×1844 | 0.46 | pale plaster arch + blossom top, dark table still life (satchel, gift box, RSN one candle, vase) bottom; only image on the screen |

## Products

| Slot (file name) | Used on | Rendered size | Aspect | Notes |
|---|---|---|---|---|
| `prod-beeswax-candle-01.jpg` | 8 screens: C03, C04, C06, C09, C11, C12, C25, C29 | 393×186 | 1.10 | also C04 C11 C12; 7 sizes: 393×186, 385×232, 327×296, 205×161, 194×160, 133×90, 103×96 |
| `prod-brass-kettle-01.jpg` | C03, C04, C06, C09, C25, C29 | 393×186 | 1.10 | also C04 C06 C12; 6 sizes: 393×186, 385×232, 327×296, 205×161, 194×160, 133×90 |
| `prod-carved-vase-01.jpg` | C29 | 133×90 | 1.48 | NEW SLOT; carved vase with dried blossoms |
| `prod-ceramic-mug-01.jpg` | C25 | 205×161 | 1.27 | NEW slot registered here |
| `prod-ceramide-cream-01.jpg` | C04 | 393×186 | 2.11 | NEW SLOT; Ceramide Cream, Atelier Sand |
| `prod-copper-vessel-01.jpg` | 13 screens: C03, C04, C06, C07, C09, C10, C11, C12, C24, C25, C26, C32, C33 | 853×715 | 1.05 | also C04 C06 C07 C11 C12 C25 C26 C32 C33; 14 sizes: 853×715, 853×810, 393×186, 385×232, 327×296, 323×292, 248×216, 205×161, 194×160, 180×160, 172×162, 140×140, 136×90, 103×96 |
| `prod-copper-vessel-02.jpg` | C07, C24 | 853×715 | 1.19 | NEW SLOT; second angle - not drawn in the mock, inferred from the 3 carousel dots; 2 sizes: 853×715, 180×160 |
| `prod-copper-vessel-03.jpg` | C07, C24 | 853×715 | 1.19 | NEW SLOT; third angle - not drawn in the mock, inferred from the 3 carousel dots; 2 sizes: 853×715, 180×160 |
| `prod-copper-vessel-04.jpg` | C24 | 180×160 | 1.12 | NEW SLOT; fourth angle, styled in situ beside a stem vase |
| `prod-copper-vessel-05.jpg` | C18 | 321×297 | 1.08 | NEW SLOT - plain hammered vessel, a different shot from the engraved prod-copper-vessel-01/-02/-03/-04 used on C03, C07, C24, C25, C26 for the same SKU |
| `prod-gift-box-01.jpg` | C29 | 133×90 | 1.48 | NEW SLOT; wrapped gift box with ribbon |
| `prod-glass-diffuser-01.jpg` | C29 | 133×90 | 1.48 | NEW SLOT; glass bottle with gold cap |
| `prod-linen-sheets-01.jpg` | C04, C06, C09, C10, C11, C12 | 393×186 | 1.10 | NEW SLOT; Linen Sheets, House of Sujan - also on C06; 5 sizes: 393×186, 385×232, 327×296, 323×292, 103×96 |
| `prod-linen-throw-01.jpg` | C33 | 136×90 | 1.51 | NEW — folded pink linen throw |
| `prod-rsn-candle-01.jpg` | C33 | 136×90 | 1.51 | NEW — dark red RSN-branded pillar candle in glass; NOT prod-beeswax-candle-01 |
| `prod-shop-grid-07-01.jpg` | C04 | 393×186 | 2.11 | NEW SLOT; card cut off by frame bottom, product not identifiable - positional name, rename when design shows it |
| `prod-shop-grid-08-01.jpg` | C04 | 393×186 | 2.11 | NEW SLOT; card cut off by frame bottom, product not identifiable - positional name, rename when design shows it |
| `prod-yak-blanket-01.jpg` | C03, C04, C25, C29 | 393×186 | 2.11 | also C04 C09; 4 sizes: 393×186, 205×161, 194×160, 133×90 |

## Category discs

| Slot (file name) | Used on | Rendered size | Aspect | Notes |
|---|---|---|---|---|
| `world-gifts-01.jpg` | C03, C04, C06 | 118×118 | 1.00 | circular crop; also C04 C06; 3 sizes: 118×118, 106×106, 83×83 |
| `world-global-select-01.jpg` | C03, C04, C06, C29 | 133×90 | 1.00 | circular crop; also C04 C06 C15; 4 sizes: 133×90, 118×118, 106×106, 83×83 |
| `world-morning-01.jpg` | C03, C04, C06 | 118×118 | 1.00 | circular crop; also C04 C06; 3 sizes: 118×118, 106×106, 83×83 |
| `world-shop-cat-08-01.jpg` | C04 | 83×83 | 1.00 | NEW SLOT; 8th disc clipped by right frame edge, category unknown - positional name, rename when design shows it |
| `world-skin-01.jpg` | C03, C04, C06 | 118×118 | 1.00 | circular crop; also C04 C06; 3 sizes: 118×118, 106×106, 83×83 |
| `world-sleep-01.jpg` | C03, C04, C06 | 118×118 | 1.00 | circular crop; also C04 C06; 3 sizes: 118×118, 106×106, 83×83 |
| `world-table-01.jpg` | C03, C04, C06 | 118×118 | 1.00 | circular crop; also C04 C06; 3 sizes: 118×118, 106×106, 83×83 |

## Promotional / editorial tiles

| Slot (file name) | Used on | Rendered size | Aspect | Notes |
|---|---|---|---|---|
| `promo-card-amex-01.jpg` | C28 | 226×128 | 1.77 | American Express artwork |
| `promo-card-mastercard-01.jpg` | C28 | 226×128 | 1.77 | Mastercard artwork |
| `promo-card-visa-01.jpg` | C28 | 226×128 | 1.77 | Visa card artwork; row marked Default |
| `promo-global-select-01.jpg` | C03 | 391×190 | 2.06 | dark photo, cream type |
| `promo-kinder-tomorrow-01.jpg` | C12 | 302×317 | 0.95 | NEW slot; light image (blossom in a stone vase), carries dark italic overlay copy "More than objects, a kinder tomorrow." |
| `promo-member-advantage-01.jpg` | C03 | 391×190 | 2.06 | light photo, membership card in frame |
| `promo-quiet-table-01.jpg` | C29, C30, C33, C34 | 779×162 | 4.06 | NEW SLOT; bowl + carved vase on pale ground; same asset as the C30 "Still need help?" banner; 4 sizes: 779×162, 773×178, 772×170, 764×188 |
| `promo-referral-gift-01.jpg` | C34 | 772×263 | 2.94 | NEW — ribboned RSN one gift box with dried blossom; same shoot as promo-wallet-gift-01 (C33), different angle and crop |
| `promo-rsn-edit-01.jpg` | C03 | 391×190 | 2.06 | light photo, dark type over left scrim |
| `promo-shop-banner-01.jpg` | C04 | 807×206 | 3.92 | NEW SLOT; "Objects for a more meaningful home." Right third must stay pale - the pull-quote sits on it with no scrim |
| `promo-store-global-01.jpg` | C19 | 770×417 | 1.85 | globe on a stack of books; subject overlaps promo-global-select-01 on C03 but this is a wide card crop, not the 391x190 tile |
| `promo-store-nepal-01.jpg` | C19 | 770×407 | 1.89 | carved Nepali temple with Himalaya behind; left 45% covered by scrim |
| `promo-thoughtful-living-01.jpg` | C25 | 790×185 | 4.27 | NEW slot; light photography, gift box + bowl; dark type sits on a left-to-right cream scrim |
| `promo-thoughtful-pieces-01.jpg` | C11 | 302×317 | 0.95 | NEW slot; light image, carries dark italic overlay copy "Thoughtful pieces. Brighter days."; gift box with a tag reading "For a kinder tomorrow." |
| `promo-upi-01.jpg` | C28 | 170×85 | 2.00 | UPI mark on a tinted panel |
| `promo-wallet-gift-01.jpg` | C33 | 433×243 | 1.78 | NEW — ribboned gift box on a marble ledge, masked to fade out under the balance copy. Same object and shoot as promo-referral-gift-01 (C34) and possibly prod-gift-box-01 (C29); confirm with the designer whether one asset can serve all three |

## Houses & makers

| Slot (file name) | Used on | Rendered size | Aspect | Notes |
|---|---|---|---|---|
| `house-lazimpat-01.jpg` | C03, C08 | 853×862 | 0.99 | light photo; also C08; 2 sizes: 853×862, 391×190 |

## Limited drops

| Slot (file name) | Used on | Rendered size | Aspect | Notes |
|---|---|---|---|---|
| `drop-brass-urn-01.jpg` | C03 | 194×160 | 1.21 | cut off by frame bottom in the mock |
| `drop-ceramic-jar-01.jpg` | C03 | 194×160 | 1.21 | cut off by frame bottom in the mock |
| `drop-stone-bowl-01.jpg` | C03, C29 | 194×160 | 1.21 | half off the right edge; also C24; 2 sizes: 194×160, 133×90 |
| `drop-tea-set-01.jpg` | C03 | 194×160 | 1.21 | cut off by frame bottom in the mock |

## People

| Slot (file name) | Used on | Rendered size | Aspect | Notes |
|---|---|---|---|---|
| `avatar-maya-kapoor-01.jpg` | C17 | 194×194 | 1.00 | circular crop; NEW slot registered here; also expected on C33/C34 |

## Slots by screen

| Screen | Images |
|---|---|
| C01-Splash | `logo-rsnone-01` |
| C02-Welcome | `hero-welcome-01`, `logo-rsnone-dark-01` |
| C03-Home | `drop-brass-urn-01`, `drop-ceramic-jar-01`, `drop-stone-bowl-01`, `drop-tea-set-01`, `hero-home-01`, `house-lazimpat-01`, `logo-rsnone-01`, `prod-beeswax-candle-01`, `prod-brass-kettle-01`, `prod-copper-vessel-01`, `prod-yak-blanket-01`, `promo-global-select-01`, `promo-member-advantage-01`, `promo-rsn-edit-01`, `world-gifts-01`, `world-global-select-01`, `world-morning-01`, `world-skin-01`, `world-sleep-01`, `world-table-01` |
| C04-Shop | `logo-rsnone-01`, `prod-beeswax-candle-01`, `prod-brass-kettle-01`, `prod-ceramide-cream-01`, `prod-copper-vessel-01`, `prod-linen-sheets-01`, `prod-shop-grid-07-01`, `prod-shop-grid-08-01`, `prod-yak-blanket-01`, `promo-shop-banner-01`, `world-gifts-01`, `world-global-select-01`, `world-morning-01`, `world-shop-cat-08-01`, `world-skin-01`, `world-sleep-01`, `world-table-01` |
| C05-Search | _none_ |
| C06-SearchResults | `logo-rsnone-01`, `prod-beeswax-candle-01`, `prod-brass-kettle-01`, `prod-copper-vessel-01`, `prod-linen-sheets-01`, `world-gifts-01`, `world-global-select-01`, `world-morning-01`, `world-skin-01`, `world-sleep-01`, `world-table-01` |
| C07-ProductDetail | `logo-rsnone-dark-01`, `prod-copper-vessel-01`, `prod-copper-vessel-02`, `prod-copper-vessel-03` |
| C08-HouseProfile | `house-lazimpat-01` |
| C09-Wishlist | `logo-rsnone-01`, `prod-beeswax-candle-01`, `prod-brass-kettle-01`, `prod-copper-vessel-01`, `prod-linen-sheets-01` |
| C10-Bag | `logo-rsnone-01`, `prod-copper-vessel-01`, `prod-linen-sheets-01` |
| C11-CheckoutDetails | `logo-rsnone-01`, `prod-beeswax-candle-01`, `prod-copper-vessel-01`, `prod-linen-sheets-01`, `promo-thoughtful-pieces-01` |
| C12-CheckoutPayments | `logo-rsnone-01`, `prod-beeswax-candle-01`, `prod-copper-vessel-01`, `prod-linen-sheets-01`, `promo-kinder-tomorrow-01` |
| C13-OrderConfirmation | `hero-order-confirmation-01`, `logo-rsnone-dark-01` |
| C14-Membership | `hero-membership-01` |
| C15-LimitedDrops | `hero-limited-drops-01`, `logo-rsnone-01` |
| C16-RSNConcierge | _none_ |
| C17-Me | `avatar-maya-kapoor-01` |
| C18-OrderTracking | `prod-copper-vessel-05` |
| C19-StoreSelection | `hero-store-footer-01`, `logo-rsnone-01`, `promo-store-global-01`, `promo-store-nepal-01` |
| C20-LoginSignup | `hero-login-01`, `logo-rsnone-01` |
| C21-MembershipJoin | `hero-membership-join-01`, `logo-rsnone-01` |
| C22-MembershipPayment | `hero-membership-payment-01`, `logo-rsnone-01` |
| C23-MembershipConfirmation | `hero-membership-welcome-01`, `logo-rsnone-01` |
| C24-DropDetail | `prod-copper-vessel-01`, `prod-copper-vessel-02`, `prod-copper-vessel-03`, `prod-copper-vessel-04` |
| C25-Orders | `logo-rsnone-01`, `prod-beeswax-candle-01`, `prod-brass-kettle-01`, `prod-ceramic-mug-01`, `prod-copper-vessel-01`, `prod-yak-blanket-01`, `promo-thoughtful-living-01` |
| C26-OrderDetail | `prod-copper-vessel-01` |
| C27-AddressManagement | _none_ |
| C28-PaymentMethods | `promo-card-amex-01`, `promo-card-mastercard-01`, `promo-card-visa-01`, `promo-upi-01` |
| C29-Notifications | `drop-stone-bowl-01`, `logo-rsnone-01`, `prod-beeswax-candle-01`, `prod-brass-kettle-01`, `prod-carved-vase-01`, `prod-gift-box-01`, `prod-glass-diffuser-01`, `prod-yak-blanket-01`, `promo-quiet-table-01`, `world-global-select-01` |
| C30-HelpSupport | `hero-help-support-01`, `logo-rsnone-01`, `promo-quiet-table-01` |
| C31-AddEditAddress | _none_ |
| C32-ReturnRequest | `logo-rsnone-01`, `prod-copper-vessel-01` |
| C33-MemberWallet | `logo-rsnone-01`, `prod-copper-vessel-01`, `prod-linen-throw-01`, `prod-rsn-candle-01`, `promo-quiet-table-01`, `promo-wallet-gift-01` |
| C34-MemberReferrals | `logo-rsnone-01`, `promo-quiet-table-01`, `promo-referral-gift-01` |
