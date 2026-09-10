# RSN ONE — App Screens, HTML Handoff Spec

This folder converts the 34 PNG design mocks (`rsn-one-design/C01…C34`) into readable HTML,
one file per screen, so the coding team can see **structure** — where the header is, which
box is a card, which thing is a button, and which image goes where — instead of squinting at a PNG.

These files are a **handoff reference**, not production code. No JS, no framework, no build step.
Open any file directly in a browser.

---

## 1. Canvas / scale

The mocks are **853 × 1844 px**, and they are **1×, not 2×**.

This was measured, not assumed. Glyph heights sampled straight out of the PNGs:

| Element | Cap height in mock | Implied font size |
|---|---|---|
| Hero headline "Objects worth *knowing*." | 37px | 52px |
| Screen title "Shop" | 45px | 64px |
| Section heading "New at RSN" | 24px | 34px |
| Hero body "Extraordinary homes." | 11px | 16px |
| Product card name "Copper Vessel" | 11px | 18px |

Read as a 2× phone render those become 26 / 32 / 17 / 8 / 9px — the body copy would be
8px. Read at 1× they are ordinary values. So these were drawn on an **853px-wide canvas**
with phone chrome (status bar, home indicator, 4-tab bar) laid on top.

> **Rule: every measurement in the HTML is the pixel value measured in the mock, 1:1.
> No division.**

Each file renders a fixed **853 × 1844** frame, centred on a dark backdrop. The frame is
`.screen`; it does not stretch. These are literal translations of the mocks, not
responsive pages.

**To preview any screen at phone size**, add `zoom: .5` to `.screen` — that gives the
427px reading. Nothing else needs to change.

### Open question for the design team
853px is a tablet-width canvas wearing phone chrome. Before build, someone needs to
decide whether these are (a) phone screens whose type is simply oversized and should be
re-specced at ~390–430px, or (b) genuinely wider screens. The two-column checkout on
`C11` / `C12` reads as evidence for (b) — it is a comfortable layout at 853px and an
impossible one at 427px. Either way, the HTML here matches the mock exactly; the class
names and structure survive a rescale, only the numbers change.

---

## 2. Design tokens

Sampled directly from the mock pixels. Declared once at the top of every file's `<style>` block.

```css
:root {
  /* — surface — */
  --bg:            #291C19;   /* page + app bar + tab bar (espresso) */
  --surface:       #33241F;   /* raised card / filled input */
  --surface-2:     #3B2A24;   /* card on card, pressed state */
  --line:          rgba(250, 247, 245, 0.14);  /* hairline dividers, input borders */
  --line-strong:   rgba(250, 247, 245, 0.28);  /* outlined button borders */
  --scrim:         rgba(41, 28, 25, 0.72);     /* gradient over hero photography */

  /* — accent (rose) — */
  --rose:          #C97C79;   /* primary button fill */
  --rose-light:    #E4A49D;   /* links, prices, active tab, step markers */
  --rose-pale:     #F0CFC9;   /* icon strokes on dark, chip label */
  --chip-bg:       rgba(219, 146, 138, 0.22);  /* "Member ₹x" chip */

  /* — text — */
  --cream:         #FAF7F5;   /* headings + primary text */
  --muted:         #A99E99;   /* subtitles, meta, inactive labels */
  --muted-dim:     #7C716C;   /* placeholder text, disabled */

  /* — type — */
  --font-serif: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
  --font-sans:  'Inter', 'Poppins', -apple-system, 'Segoe UI', Roboto, sans-serif;

  /* — geometry (mock px, 1:1) — */
  --gutter:  36px;   /* standard left/right page padding */
  --r-card:  16px;
  --r-input: 14px;
  --r-btn:   10px;
  --r-pill:  999px;
}
```

### Fixed chrome heights (measured)

| Band | Height |
|---|---|
| `.statusbar` | 70px |
| `.appbar` (below status bar, hairline at y=173) | 103px |
| `.tabbar` | 88px — **see the note below** |
| `.home-indicator` | 44px (bar 286 × 10, radius 5, centred) |

### Open item — the tab bar height is not determined by the mocks

The tab bar's top hairline lands in a different place on every screen that has one:

| Mock | Hairline y | Bottom chrome |
|---|---|---|
| C04 Shop | 1618 | 226px |
| C17 Me | 1631 | 213px |
| C09 Wishlist | 1637 | 207px |
| C25 Orders | 1672 | 172px |
| C03 Home | 1772 | 72px |

That is a 154px spread for what is meant to be one shared component, so no single value is
"the" correct one. All 34 files use the same 88 + 44 = 132px band (hairline at y=1712),
which sits inside the observed range. On the screens at the extremes the rendered bar will
sit up to ~70px away from where its mock draws it. **Pick a real value with the designer
before build** — it changes only `.tabbar{flex}` and nothing else.

The same caveat applies to tab **labels**: C03/C04/C25 draw them uppercase, C06/C07/C09/C10/
C11/C12/C17 title case. Files matching the second group carry a `.tabbar--roman` modifier.

### Open item — page gutter

`--gutter: 36px` is the modal value, but the mocks measure 25–56px depending on the screen
(and sometimes within one screen: C04's headings sit at 36px while its product grid sits at
25px). Screens that measured clearly different values carry a local `--pad` override with a
comment. These want to collapse to one token in production.

**Fonts are an approximation.** The mocks use an unnamed high-contrast transitional serif
and a neutral geometric sans. `Playfair Display` + `Inter` are the closest free matches and
are loaded from Google Fonts in each file. Swap the two `--font-*` variables when the real
brand fonts are confirmed — nothing else needs to change.

### Type scale

All values are mock px, 1:1.

| Token | Size / line-height | Family | Used for |
|---|---|---|---|
| `.t-display` | 52px / 1.02 | serif | hero headline ("Objects worth *knowing*.") |
| `.t-h1`      | 64px / 1.05 | serif | screen title ("Shop"), PDP product name |
| `.t-title`   | 40px / 1.15 | serif | panel title ("Delivery Details", "Order Summary") |
| `.t-section` | 34px / 1.2  | serif | section heading ("New at RSN") |
| `.t-h3`      | 24px / 1.25 | serif | promo tile title, card heading |
| `.t-card`    | 18px / 1.3  | serif | product name on a card |
| `.t-body-lg` | 22px / 1.45 | sans  | screen subtitle under a title |
| `.t-body`    | 16px / 1.55 | sans  | paragraphs, input text |
| `.t-row`     | 26px / 1.3  | sans  | settings/list row label (Me, Help) |
| `.t-meta`    | 14px / 1.4  | sans  | house name, qty, timestamps |
| `.t-eyebrow` | 13px / 1, `letter-spacing:.16em`, uppercase | sans | button labels, `HOUSE OF LAZIMPAT`, `READ NOW` |
| `.t-price`   | 22px / 1.2  | serif, `--rose-light` | prices |
| `.t-tab`     | 15px / 1, `letter-spacing:.12em`, uppercase | sans | tab bar labels |

Italic serif is used for the pull-quote voice ("*A more thoughtful way to live.*",
"*More than objects, a kinder tomorrow.*") — class `.t-voice`.

---

## 3. Class naming

Plain BEM. Block = the thing, `__` = its part, `--` = its variant. Names say what the
element *is*, never what it looks like.

```
.screen                 the 427px phone frame
.statusbar              iOS status bar (9:41 / signal / wifi / battery)
.appbar                 top bar: logo, search, bag
  .appbar__logo  .appbar__actions  .appbar__badge
.navbar                 back-arrow variant of the top bar
  .navbar__back  .navbar__title
.tabbar                 bottom nav: HOME / SHOP / WISHLIST / ME
  .tab  .tab--active  .tab__icon  .tab__label
.home-indicator         iOS home bar

.section                a titled block of the page
  .section__head  .section__title  .section__link

.btn                    .btn--primary (rose fill) | .btn--outline | .btn--text
.btn--block             full width
.chip                   .chip--member (the "Member ₹21,499" pill)
.field                  .field__label  .field__input  .field__icon  .field--select
.list-row               icon + label + chevron (Me, Help, Settings)
.stepper                checkout progress (Bag → Details → Payment → Review)
  .step  .step--done  .step--current  .step__dot  .step__label

.product-card           .product-card__media / __wish / __title / __house / __price / __stock
.promo-card             the large editorial tiles (The RSN Edit, Global Select…)
.world                  circular category (Morning / Skin / Sleep / Table / Gifts)
.hero                   full-bleed photo + overlaid copy
  .hero__media  .hero__scrim  .hero__title  .hero__body  .hero__cta  .hero__dots
```

Every non-obvious block carries an HTML comment naming it in plain words, e.g.

```html
<!-- SECTION: "New at RSN" — horizontal scroller, 4 product cards, card 165×… -->
```

---

## 4. Image slots — the important part

**No image files are shipped in this folder.** The zip that was supplied
(`rsn-one-images/`, 31 files) is the *web* photography set — beige studio shots of linen,
pillows, balms. The app mocks use a different, copper/rose Nepal-themed library that was
not supplied. Only a handful of slots overlap.

So every image in these files points at a **named slot** under `rsn-one-images/`:

```html
<img class="product-card__media"
     src="rsn-one-images/prod-copper-vessel-01.jpg"
     alt="Copper Vessel, House of Lazimpat"
     width="165" height="185">
```

Images will render broken until the real files are dropped in at those exact names.
That is expected. **`IMAGE-MANIFEST.md` in this folder lists every slot** — filename,
which screen and section it belongs to, rendered size, aspect ratio, and whether a file
from the supplied zip matches it.

### Slot naming convention

`rsn-one-images/<category>-<subject>-<nn>.jpg`

| Prefix | Meaning | Example |
|---|---|---|
| `hero-`   | full-bleed screen hero | `hero-home-01.jpg` |
| `prod-`   | product shot (card, PDP, bag line) | `prod-copper-vessel-01.jpg` |
| `world-`  | circular category thumbnail | `world-morning-01.jpg` |
| `promo-`  | editorial / marketing tile | `promo-rsn-edit-01.jpg` |
| `house-`  | maker / house imagery | `house-lazimpat-01.jpg` |
| `drop-`   | limited drop imagery | `drop-winter-brass-01.jpg` |
| `story-`  | in-article / narrative photo | `story-nepal-workshop-01.jpg` |
| `avatar-` | person | `avatar-maya-kapoor-01.jpg` |

Multiple angles of the same product increment the number: `prod-copper-vessel-01/-02/-03`.
The same slot reused on several screens keeps **one** name — do not duplicate.

Sizes on every `<img>` are the **rendered** CSS size. Supply source files at 2× or 3× that.

---

## 5. Rules every file follows

1. One screen per file, named `CXX-ScreenName.html` to match the mock exactly.
2. All CSS lives in a single `<style>` block in `<head>`. No external stylesheet, no JS.
3. **Everything visible in the mock is in the HTML** — status bar, app bar, every card,
   chip, divider, placeholder, icon, badge, tab bar, home indicator. Nothing summarised away.
4. Icons are inline `<svg>` with `stroke="currentColor"`, so they inherit colour. They are
   redrawn approximations, not the real icon set — swap for the production icons.
5. Text is transcribed **verbatim** from the mock, including prices, ₹ symbols and casing.
6. Interactive things are real elements: `<button>`, `<a>`, `<input>`, `<select>` — so the
   team can see what is meant to be tappable. They have no behaviour.
7. Anything ambiguous in the mock is marked `<!-- ASSUMPTION: … -->`.
   Anything that looks like a design bug is marked `<!-- DEVIATION-RISK: … -->`.
8. Scrollers that run off the edge of the mock use `overflow-x:auto` and include a
   partially-visible next item, matching the mock.
9. Because no image files ship, every `<img>` carries the `.slot` treatment — a dashed
   outline and a small centred filename — so a missing image reads as a labelled box
   rather than a broken-icon mess. Delete the `.slot` rules once the real files land.

```css
/* placeholder styling for not-yet-supplied images — delete when images exist */
img{background:var(--surface-2); border:1px dashed var(--line);
    font-family:var(--font-sans); font-size:11px; color:var(--muted-dim);
    text-align:center; overflow:hidden;}
```

---

## 6. Files

```
rsn-one-html/
├── RSN-HANDOFF-SPEC.md      ← this file
├── IMAGE-MANIFEST.md        ← every image slot, per screen
├── index.html               ← contact sheet: links to all 34 screens
├── C01-Splash.html
├── C02-Welcome.html
│   …
└── C34-MemberReferrals.html
```
