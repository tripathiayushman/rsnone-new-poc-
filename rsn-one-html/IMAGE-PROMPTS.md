# RSN ONE — Image Generation Prompts

One prompt per image slot, written from the pixels of the design mocks. 58 slots.
Generate a file, name it exactly as the heading says, drop it in `rsn-one-images/`,
reload the screen. Nothing in the HTML changes.

`IMAGE-MANIFEST.md` says *what* each slot is and where it goes. This file says how to make it.

---

## Before you start

**The prompts are generator-agnostic.** Plain natural language, no `--ar`, no `::weights`.
Aspect ratio is its own field — set it however your tool wants it. Generate at the pixel
size given (2× the rendered size at minimum), then downscale.

**Generate in this order.** Several slots are the same object or the same shoot at a
different crop, and those have a `**Consistency**` line naming the image they must match.
Make the reference first, then feed it back as an image reference for its dependants:

| Make first | Then match to it |
|---|---|
| `prod-copper-vessel-01` (the anchor product — appears on 9 screens) | `-02`, `-03`, `-04`, and see the note on `-05` |
| `hero-membership-join-01` | `hero-membership-payment-01`, `hero-membership-welcome-01` — one shoot, three crops |
| `promo-quiet-table-01` | `hero-help-support-01` — same still life, different key |
| `promo-wallet-gift-01` | `promo-referral-gift-01` — same box, two angles |
| `world-morning-01` | the other five `world-*` discs — matched set, one ground and one light |

**Nothing generates readable text.** Nine slots have branding or lettering photographed
into them in the mocks — the RSN one crest on the membership card, the candle and cream
labels, a gift-box deboss, a "kinder tomorrow" tag. Every prompt asks for a *blank*
embossed or debossed panel, and the mark gets composited in afterwards. Trying to prompt
the logo will produce garbled type.

**Clear the book.** Four mocks show a real published title with a legible spine. The
prompts specify an unmarked or blind-stamped book and put the title in the negatives.

## The house style, in one paragraph

Every prompt already carries this, but if you write your own: editorial still-life
photography in the Kinfolk / Cereal register — calm, unstyled-looking, expensive, never
advertising or e-commerce packshot. One soft directional daylight source from a window at
frame left or right, long shadows, gentle falloff, no fill flash. Warm espresso, terracotta,
blush rose, cream plaster, aged copper and brass; desaturated, nothing cool, no white
seamless. Surfaces are lime plaster, dark oiled wood, unpolished stone, crumpled linen.
50–85mm, shallow depth of field, subtle 35mm grain, warm cast. Objects are Himalayan and
South Asian artisan pieces. No text, no logos, no people.

## How to read a block

- **Prompt** — paste this into the generator.
- **Negative** — what must not appear.
- **Aspect** — the ratio, plus a minimum pixel size.
- **Composition note** — where the image has to stay quiet because type or a button sits
  on it. Ignoring these is how you get an unreadable headline.
- **Consistency** — this slot must match another image; make that one first.
- **Partial** — the mock cuts this image off at the frame edge, so part of the description
  is inferred. Check it with the designer before generating.

---


# Full-bleed heroes

### `hero-welcome-01.jpg`  — 853×1844 (0.46:1) · C02 Welcome, full-bleed backdrop

**Prompt**
A dark burgundy-brown leather crossbody satchel with a rounded flap, aged brass buckle and a long shoulder strap sits at frame left on a dark oiled-wood table, beside an upright squared gift box in dusty-rose pressed paper board with a faint blind deboss, and a matte aged-copper bottle vase holding leggy plum-blossom branches. A ribbed blush glass candle burns in its jar at lower right beside a pale travertine tray, and a pink mohair throw crumples across the front edge. Behind them a blush lime-plaster wall carries a rounded arch at frame right and long diagonal window shadows. Single soft daylight from frame left, 85mm, eye level, shallow focus, warm desaturated palette, fine 35mm grain.

**Negative** text, lettering, logos, watermarks, brand marks on the box or candle, people, hands, packshot lighting, white seamless, cool grey or blue tones, fill flash, rim light, CGI sheen, high saturation
**Aspect** 0.463:1, portrait (853×1844 — generate 1706×3688 or larger)
**Composition note** The photograph carries the entire screen and every piece of UI sits on it, so the frame splits into three zones. **Top (y 0–900) must stay pale, flat and low-contrast:** the near-white status bar sits y 0–70, "Skip" at x 754–803 / y 112–150, the dark-ink RSN one lockup is centred at x 267–586 / y 132–293, and the headline plus body copy occupy x 64–704 / y 412–880. Nothing but plaster wall and its soft shadow gradients belongs in that block. Push the blossom branch, the arch edge and the lit column entirely to the right of x ≈ 710 above y 900. **Middle (y 900–1490)** is the still life — the satchel left, the gift box centre, the vase right, the candle lower right. **Bottom (y 1490–1844) must fall into deep espresso shadow** (the mock reads roughly #3A2620 there): the primary rose button spans x 100–752 / y 1500–1590, the outlined "Explore as guest" button y 1605–1688, and the three pager dots y 1725–1745. White button text and a 1px rose outline both need that dark, even ground — no specular highlights, no bright throw in that band.
**Note** In the mock the gift box carries an embossed RSN crest and wordmark. Shoot or generate the box blank and composite the lockup in post, or supply the physical box to the shoot — a generator will produce mangled lettering.


---

### `hero-order-confirmation-01.jpg`  — 853×1844 (0.46:1) · C13 Order Confirmation, full-bleed backdrop

**Prompt**
A squared gift box in dusty-rose textured board stands centre on a pale grey-veined marble ledge in front of a blush lime-plaster wall, its face carrying only a soft blind deboss. To its right a ribbed rose-glass candle burns low in its jar, beside a speckled off-white stoneware bottle vase holding airy sprays of small pink blossom, and a small speckled stone dish; two fallen blossoms rest on the marble with the candle reflected in it. A dusty-rose linen throw spills across the lower left corner. Soft daylight rakes from frame left and lays long leafy branch shadows across the wall. 85mm, eye level, shallow focus, warm blush and terracotta palette, fine grain.

**Negative** text, lettering, logos, watermarks, brand marks on the box or candle label, people, hands, packshot lighting, white seamless, cool grey or blue tones, fill flash, rim light, CGI sheen, heavy vignette
**Aspect** 0.463:1, portrait (853×1844 — generate 1706×3688 or larger)
**Source** The mock for this screen was exported at 281×567, roughly a third of every other screen in the set. This description was written from a 4× upscale, so the fine detail is inferred: the candle-label artwork, the exact blossom species, the stone speckle and the marble veining are all read from a handful of pixels. Request a full-size export before matching.
**Composition note** This is the only light screen in the set and it carries **dark ink type with no scrim at all** — legibility depends entirely on the photograph staying pale where the copy lands. **The top 700px must be near-flat blush plaster** at roughly #F0D1C1: dark status bar y 0–70, the dark-ink lockup at x 219–532 / y 149–307, the italic rose voice line at x ≈ 590–800 / y 149–250, the 80px two-line serif headline running almost the full width at x 55–800 / y 383–565, and the order reference at y 637–675. The top of the gift box may not rise above y ≈ 700. **Keep a quiet vertical column at the left edge, x 46–190 down to y ≈ 1100**, for the five-line uppercase eyebrow and its short rule (y 923–1075); the linen throw should enter below that. **Bottom (y 1490–1760):** the rose CTA spans x 52–807 / y 1508–1635 and an underlined text link sits centred at y 1674–1714 — the mock puts the marble ledge's front edge in shadow here so that link reads light.
**DEVIATION-RISK** The mock's "Continue Shopping" link is near-white over the shadowed marble; the HTML sets it in dark ink (`--ink`). Whichever way it is resolved, the bottom 250px of the photo must commit to being clearly light or clearly dark, not mid-tone.


---

### `hero-login-01.jpg`  — 853×1844 (0.46:1) · C20 Login / Signup, full-bleed backdrop under a two-axis scrim

**Prompt**
A bulbous pale terracotta vase, its whole body covered in fine incised botanical relief, stands on a thick raw plaster plinth at frame right, holding tall bare branches of pink blossom. A shallow footed bowl in the same carved clay sits beside it, and both rest on a heavy hardback book laid flat, its cover and thick page block pale and marbled. Behind them a warm rounded archway lets raking daylight in from frame right and throws dappled branch shadows across the plaster; the left half of the frame falls away into deep espresso shadow. 85mm, eye level, shallow focus, warm brown and blush palette, fine 35mm grain.

**Negative** text, lettering on the book spine or cover, logos, watermarks, people, hands, packshot lighting, white seamless, cool grey or blue tones, fill flash, rim light, CGI sheen
**Aspect** 0.463:1, portrait (853×1844 — generate 1706×3688 or larger)
**Composition note** The build lays a two-axis scrim over this photo — about 93% opaque espresso at the left edge falling to 16% at the right, and fully opaque below y ≈ 975 — so **only the top-right quadrant of the image is ever really seen.** Put the whole subject cluster (vase, bowl, book, plinth top) inside roughly x 560–853 / y 640–1080, and keep the lit archway and its shadow play right of x ≈ 620. **The left column, x 62–730, must stay dark and even from y 100 to y 960:** the rose back arrow sits at x 47 / y 112, the cream lockup at x 88–508 / y 172–300, a 104px three-line serif headline at x 62–700 / y 395–680, three lines of body copy at x 62–482 / y 621–790, and the Sign In / Sign Up tabs at y 881–930. No bright highlight, no blossom, no plinth edge may intrude there. **Below y 975 the photograph is effectively invisible** — the login form, the SIGN IN button, the two SSO buttons and the footer line run from y 962 to y 1700 over near-solid #291C19 — so put nothing you care about below y 1000, but keep the plinth face falling smoothly into shadow rather than ending on a hard line.
**Note** The mock's book is a real published title with its name legible on the spine. Generate the cover blank or the lettering illegible; if a real book is wanted on set, clear it.


---

### `hero-membership-01.jpg`  — 853×1844 (0.46:1) · C14 Membership, full-bleed backdrop

**Prompt**
A blush membership card in heavy textured board with softly rounded corners lies at a shallow diagonal on a loosely woven dusty-rose cotton-linen throw, entering from the lower right and running off the frame edge; its face is blank, only a faint deboss catching the light and the board's fibrous grain visible. Behind the card the throw is folded into a soft roll, its slub weave crisp where the light strikes and deepening to warm terracotta brown in the folds below. Above it an out-of-focus blush plaster wall fills the upper half as a flat, even, detail-free field. Single soft daylight from frame left, 85mm, very shallow focus, warm desaturated palette, fine grain.

**Negative** text, lettering, logos, watermarks, people, hands, packshot lighting, white seamless, cool grey or blue tones, fill flash, rim light, CGI sheen, busy pattern in the upper half
**Aspect** 0.463:1, portrait (853×1844 — generate 1706×3688 or larger)
**Source** The supplied mock is 845×1862, not the set's 853×1844; measurements below are the authored 853×1844 values from the build. Re-export at 853×1844.
**Composition note** Like C13 this screen puts **dark ink type straight on the photo with no scrim**, and the copy block is large. **Everything from y 0 to y ≈ 1000 must be a flat, pale, essentially empty blush field** — no weave detail, no fold, no card corner: dark status-bar glyphs at y 0–70, an 88px serif headline on one line at x 68–790 / y 182–292, two lines of 45px body at y 322–436, and then a five-row benefit list on a 125px pitch from y 476 to y 1101, each row a 94px tinted disc at x 68–162 with a label running out to x ≈ 600. The out-of-focus wall does that job in the mock. **The card enters below that:** its measured rectangle is x 105–845 / y 1025–1575 at about −8°, so the top-right corner is the highest point at roughly x 845 / y 1038 and the top-left corner sits far lower at about x 105 / y 1225. Nothing may rise above y ≈ 1000. **The rose CTA spans x 52–793 / y 1620–1760** and lands on the card's lower-left corner and the fabric beside it — keep that band mid-tone and free of specular highlight so white letterspaced caps hold. The darkest fold can occupy the last 80px under the home indicator.
**Note** In the mock the card carries the RSN crest, "RSN one" and GLOBAL FAMILY CLUB debossed into it — the HTML confirms the lockup is photographed into this image rather than being a separate layer. Generate the card blank and composite the lockup in post, or shoot the physical card; do not ask a generator for the lettering.


# Home screen

### `hero-home-01.jpg`  — 853×432 (1.97:1) · C03 Home, hero

**Prompt**
A round cream stoneware vase with a short flared neck and an all-over incised scrollwork relief stands on a stack consisting of a single linen-bound hardcover book laid flat, holding five or six tall bare branches of small pink blossom that fan up and out of the top of the frame. In front of the vase, slightly left, sits a shallow low-footed bowl turned from pale figured wood. Everything rests on a wide unpolished stone console. Behind, a warm plaster room falls soft: a tall bright window at frame right, a low wooden armchair with a linen cushion, heavy curtain at frame left. Single soft directional daylight from the right rakes across the vase and throws long gentle shadows to the left. Warm espresso brown, terracotta, blush rose and cream plaster, desaturated. 85mm, eye level, shallow depth of field, subtle 35mm grain, warm cast.

**Negative** text, logos, watermarks, people, hands, cool blue tones, grey seamless, fill flash, rim light, CGI render, e-commerce packshot
**Aspect** 1.97:1 (generate 2560×1298 or larger)
**Composition note** The left 40% of the frame is dark curtain and shadowed wall and must stay quiet and low-contrast — a large serif headline, three lines of body copy and a button sit there. The vase and blossom must land in the centre-right third; keep the right 12% readable but uncluttered, an italic three-line pull-quote sits over it. A darkening scrim is applied left-to-right in the HTML.

---


---

### `world-morning-01.jpg`  — 118×118 (1:1) · C03 Home, "The Worlds of RSN" disc 1

**Consistency** — one of six matched category discs (`world-morning-01`, `world-skin-01`, `world-sleep-01`, `world-table-01`, `world-gifts-01`, `world-global-select-01`). All six share the same treatment: a single object photographed square-on at near eye level on a seamless warm cream-to-blush lime-plaster ground with a pale plaster wall behind and no visible horizon line detail, one soft directional daylight source from frame left, a soft shadow falling right, the same working distance so every subject occupies roughly the same share of the frame, generous empty ground on all four sides, shallow depth of field, desaturated warm palette, subtle 35mm grain. Shoot them as one session, same lens, same light setup. Vary only the subject.

**Prompt**
A tall hand-thrown stoneware mug with a heavy rounded loop handle at frame right, straight-sided with a faint carved texture in the clay and a matte blush-oatmeal glaze, standing on a pale plaster tabletop. Just behind and to the left, a small pale ceramic creamer sits well out of focus. Warm cream plaster wall behind, no props, nothing else in frame. Single soft directional daylight from frame left, gentle falloff, a soft shadow pooling to the right of the foot. Warm cream, blush rose and terracotta, desaturated, nothing cool. 85mm, near eye level, shallow depth of field, subtle 35mm film grain and a slight warm colour cast.

**Negative** text, logos, watermarks, people, hands, steam, coffee liquid, cool blue tones, grey seamless, hard shadows, CGI render
**Aspect** 1:1 (generate 1024×1024 or larger)
**Composition note** Object centred with even headroom and even margin left and right; this is crop-masked to a 118px circle, so nothing important may sit within the outer 12% of the square.

---


---

### `world-skin-01.jpg`  — 118×118 (1:1) · C03 Home, "The Worlds of RSN" disc 2

**Consistency** — see `world-morning-01`. Same ground, same light from frame left, same distance and lens; only the subject changes.

**Prompt**
A square-shouldered apothecary bottle in pale amber glass with a tall polished brass collar and screw cap, filled with a warm honey-coloured oil, standing upright on a pale plaster tabletop. A plain uncoated paper label wraps the lower half, blank apart from a faint blind-embossed crest — no legible type. Warm cream plaster wall behind, nothing else in frame. Single soft directional daylight from frame left picks a long highlight down the glass and glints on the brass cap, gentle falloff, soft shadow to the right. Warm cream, honey amber, aged brass and blush, desaturated. 85mm, near eye level, shallow depth of field, subtle 35mm film grain and a slight warm colour cast.

**Negative** text, readable type, brand names, logos, watermarks, people, cool blue tones, grey seamless, specular studio highlights, hard shadows, CGI render
**Aspect** 1:1 (generate 1024×1024 or larger)
**Composition note** Bottle centred and upright with even headroom; crop-masked to a 118px circle, so keep the outer 12% of the square empty ground. The label must read as texture at 118px, not as type.

---


---

### `world-sleep-01.jpg`  — 118×118 (1:1) · C03 Home, "The Worlds of RSN" disc 3

**Consistency** — see `world-morning-01`. Same ground, same light from frame left, same distance and lens; only the subject changes.

**Prompt**
Two folded blankets stacked on a pale plaster surface, the upper one a blush-rose waffle-weave in fine cotton and cashmere with a visible rolled fold facing camera and a softly frayed selvedge, the lower one a slightly paler oatmeal weave folded the same way. The fabric shows its texture and a few soft creases, unstyled, as though just taken from the press. Warm cream plaster wall behind, nothing else in frame. Single soft directional daylight from frame left grazes across the weave, gentle falloff into shadow at the right. Blush rose, oatmeal, cream, desaturated. 85mm, near eye level, shallow depth of field, subtle 35mm film grain and a slight warm colour cast.

**Negative** text, logos, labels, watermarks, people, beds, pillows, cool blue tones, grey seamless, hard shadows, CGI render
**Aspect** 1:1 (generate 1024×1024 or larger)
**Composition note** Stack centred, fold edge facing camera, even margin all round; crop-masked to a 118px circle, so keep the outer 12% of the square as empty ground.

---


---

### `world-table-01.jpg`  — 118×118 (1:1) · C03 Home, "The Worlds of RSN" disc 4

**Consistency** — see `world-morning-01`. Same ground, same light from frame left, same distance and lens; only the subject changes.

**Prompt**
Two wide shallow hand-thrown stoneware serving bowls stacked one inside the other, seen just above the rim line so the interior of the upper bowl reads as a soft ellipse. The glaze is a matte speckled clay-brown flecked with iron, the foot ring unglazed and slightly uneven, the lip a touch irregular from the wheel. They sit on a woven linen mat over a pale plaster surface, with a warm cream plaster wall behind, nothing else in frame. Single soft directional daylight from frame left, gentle falloff, soft shadow to the right. Clay brown, cream plaster, terracotta, desaturated. 85mm, a few degrees above eye level, shallow depth of field, subtle 35mm film grain and a slight warm colour cast.

**Negative** text, logos, watermarks, people, food, cutlery, cool blue tones, grey seamless, glossy reflective glaze, hard shadows, CGI render
**Aspect** 1:1 (generate 1024×1024 or larger)
**Composition note** Stack centred with even headroom; crop-masked to a 118px circle, so keep the outer 12% of the square as empty ground.

---


---

### `world-gifts-01.jpg`  — 118×118 (1:1) · C03 Home, "The Worlds of RSN" disc 5

**Consistency** — see `world-morning-01`. Same ground, same light from frame left, same distance and lens; only the subject changes.

**Prompt**
A square lidded gift box covered in textured handmade taupe paper with a visible deckled fibre grain, the lid sitting slightly proud of the base, tied with a wide dusty-rose satin ribbon that runs front to back and is finished in a loose generous bow across the top. The tails of the ribbon fall to the right. It stands on a pale plaster surface against a warm cream plaster wall, nothing else in frame. Single soft directional daylight from frame left catches the sheen of the satin and the tooth of the paper, gentle falloff, soft shadow to the right. Taupe, dusty rose, cream, desaturated. 85mm, three-quarter view at near eye level, shallow depth of field, subtle 35mm film grain and a slight warm colour cast.

**Negative** text, logos, gift tags, watermarks, people, hands, confetti, cool blue tones, grey seamless, glitter, hard shadows, CGI render
**Aspect** 1:1 (generate 1024×1024 or larger)
**Composition note** Box centred with the bow near the top of the frame and even margin left and right; crop-masked to a 118px circle, so keep the outer 12% of the square as empty ground.

---


---

### `world-global-select-01.jpg`  — 118×118 (1:1) · C03 Home, "The Worlds of RSN" disc 6

**Consistency** — the sixth of the matched set (see `world-morning-01`): same warm cream ground, same single soft daylight from frame left, same lens and film character. It is the one deliberate exception on framing — in the mock this subject is shot much closer and fills the disc almost edge to edge, with only a thin crescent of cream ground showing at the left and lower left. Keep the light and palette identical to the other five; change only the distance.

**Prompt**
An antique terrestrial globe filling nearly the whole frame, its gores printed on aged buff paper and varnished to a warm amber, continents drawn in fine dark engraved outline with hatched coastlines and faint graticule lines, the surface craquelured with age. A slim aged-brass meridian ring curves around the left edge of the sphere. Behind it, a narrow crescent of warm cream plaster. Single soft directional daylight from frame left lays a broad soft specular sheen across the upper left of the varnish and falls away into shadow at the lower right. Aged paper buff, espresso brown ink, warm brass, desaturated. 85mm, close, eye level, shallow depth of field, subtle 35mm film grain and a slight warm colour cast.

**Negative** legible place names, modern country borders, text, logos, watermarks, people, plastic globe, chrome or steel stand, cool blue oceans, grey seamless, CGI render
**Aspect** 1:1 (generate 1024×1024 or larger)
**Composition note** The sphere is centred and fills roughly 92% of the square edge to edge; this is crop-masked to a 118px circle, so the globe must be a true circle centred on the frame centre or the mask will clip it off-axis.

---


---

### `promo-rsn-edit-01.jpg`  — 391×190 (2.06:1) · C03 Home, promo grid tile 1 — LIGHT photography

**Prompt**
A stack of two linen-bound books lying flat on a pale plaster ledge at the lower right of the frame, the top volume a soft ecru cloth with a blind-debossed spine, and resting on it a shallow low bowl turned from dark oiled walnut with a visible lathe-cut foot and a warm sheen on its rim. Behind and above, a broad blush-pink limewash wall carries the dappled shadow of a bare branch and its leaves thrown across the upper right corner. Nothing else is in frame; the left half is empty wall. Single soft directional daylight from frame left casts the branch shadow to the right, gentle falloff. Blush rose, cream plaster, warm walnut brown, desaturated and high key. 50mm, eye level, shallow depth of field, subtle 35mm film grain and a slight warm colour cast.

**Negative** text, readable titles on the books, logos, watermarks, people, hands, plants in pots, cool blue tones, grey seamless, hard shadows, CGI render
**Aspect** 2.06:1 (generate 2346×1140 or larger)
**Composition note** LIGHT tile — the HTML lays a light cream-to-transparent scrim from the left and sets dark espresso type over it. The left 55% must stay pale, empty and low-contrast: a serif title, three lines of body copy and a "READ NOW" link sit there. Keep the books and bowl entirely in the right 40% and let the branch shadow occupy only the upper right.

---


---

### `promo-global-select-01.jpg`  — 391×190 (2.06:1) · C03 Home, promo grid tile 2 — DARK photography

**Prompt**
An antique terrestrial globe cradled in a slim aged-brass meridian ring stands at the right of the frame, its gores printed on buff paper varnished amber, continents in fine dark engraved outline. It rests on a low plinth built from a worn leather-covered travelling trunk with a stack of a single sand-coloured cloth-bound portfolio slipped in beneath. The whole scene sits in a dark espresso-brown room, the wall behind unlit and falling to near black at frame left. Single soft directional daylight from the right rakes across the globe and the trunk lid, leaving the left half of the frame in deep shadow. Espresso brown, aged brass, buff paper, terracotta, very desaturated, low key. 50mm, slightly below eye level, shallow depth of field, subtle 35mm film grain and a slight warm colour cast.

**Negative** legible place names, text, logos, watermarks, people, modern maps, chrome, cool blue tones, grey seamless, bright fill light, CGI render
**Aspect** 2.06:1 (generate 2346×1140 or larger)
**Composition note** DARK tile — the only dark card in the 2×2 grid; the HTML lays a dark espresso scrim from the left and sets cream type over it. The left 55% must stay dark, near-empty and low-contrast: a cream serif title, two lines of body copy and a blush "EXPLORE" link sit there. The globe belongs in the right third and may run to the right edge; do not let the trunk stack rise above the vertical midline on the left.

---


---

### `promo-member-advantage-01.jpg`  — 391×190 (2.06:1) · C03 Home, promo grid tile 4 — LIGHT photography

**Prompt**
A membership card in thick blush-pink cotton cardstock with a felt-marked deckle texture, propped upright and tilted a few degrees, standing at the right of the frame in a loose drift of crumpled dusty-rose silk-linen bedding. The card face is blank apart from a fine blind-debossed border and a subtly raised plain panel in its centre — no marks, no type. The cloth falls away in soft folds across the bottom of the frame, brightest at the right; the upper left dissolves into pale out-of-focus blush cloth. Single soft directional daylight from the right skims the card so the deboss reads as shadow, gentle falloff to the left. Blush rose, dusty rose, cream, very desaturated and high key. 85mm, near eye level, very shallow depth of field, subtle 35mm film grain and a slight warm colour cast.

**Negative** text, logos, brand marks, card numbers, chip, magnetic stripe, watermarks, people, hands, cool blue tones, grey seamless, glossy plastic finish, hard shadows, CGI render
**Aspect** 2.06:1 (generate 2346×1140 or larger)
**Composition note** LIGHT tile — the HTML lays a light scrim from the left and sets dark espresso type over it. The left 55% must stay pale, soft and empty: a serif title, two lines of body copy and a "JOIN NOW" link sit there. The card occupies the right 45%, tilted with its top-right corner near the top edge. In the mock the card carries the RSN one crest and wordmark — generate the card blank and composite the logo in artwork afterwards; do not let the generator invent a mark.

---


---

### `drop-brass-urn-01.jpg`  — 194×160 (1.21:1) · C03 Home, "Limited Discoveries" rail card 1

**Prompt**
A rounded hand-beaten copper urn with a full low-shouldered belly and a wide flat lid seated on its mouth, topped by a small dark finial, standing centred on a pale cream plaster shelf. The hammered facets across the body catch the light in a scatter of small soft highlights and the metal has a warm unpolished patina with darker fire-marks low on the belly. Behind it, a plain warm cream plaster wall with a faint horizontal seam. Nothing else in frame. Single soft directional daylight from frame left, long gentle shadow to the right, no fill. Aged copper, warm cream plaster, terracotta, desaturated. 85mm, eye level, shallow depth of field, subtle 35mm film grain and a slight warm colour cast.

**Negative** text, logos, watermarks, people, hands, mirror-polished metal, cool blue tones, grey seamless, hard specular hotspots, CGI render
**Aspect** 1.21:1 (generate 1552×1280 or larger)
**Composition note** Object centred with even margin; a circular wishlist button overlays the top-right corner in the UI, so keep that corner as quiet plaster.
**Partial** — only the top ~39px of the 160px-tall card is visible in the mock (the rail is cut off by the bottom of the frame); all that can actually be seen is the pale plaster wall, the crown of the copper dome and its dark finial. The lower two-thirds of the object, the shelf and the shadow are inferred.

---


---

### `drop-ceramic-jar-01.jpg`  — 194×160 (1.21:1) · C03 Home, "Limited Discoveries" rail card 2

**Prompt**
Two lidded ceramic storage jars on a pale blush plaster shelf: at frame right a tall waisted jar in a copper-brown glossy glaze with a strongly flared trumpet lip and a swelling foot, and at centre a much smaller squat companion jar whose short cylindrical lid finial is all that rises above the shelf line. The glaze pools darker in the throat and lifts to a warm coppery sheen on the shoulders. Behind, a plain pale blush plaster wall, empty. Single soft directional daylight from frame left, gentle falloff, soft shadows to the right. Copper brown, blush plaster, cream, desaturated. 85mm, eye level, shallow depth of field, subtle 35mm film grain and a slight warm colour cast.

**Negative** text, logos, watermarks, people, hands, cool blue tones, grey seamless, hard shadows, CGI render
**Aspect** 1.21:1 (generate 1552×1280 or larger)
**Composition note** The tall jar sits right of centre and the small jar just left of centre; the left 45% is empty blush wall. A circular wishlist button overlays the top-right corner in the UI and in the mock it sits directly over the tall jar's lip — keep that area simple in form.
**Partial** — only the top ~39px of the 160px-tall card is visible in the mock; all that can be seen is the blush wall, the flared lip and neck of the tall jar at the right, and the small lid finial rising at centre. Both bodies, the shelf and the shadows are inferred.

---


---

### `drop-tea-set-01.jpg`  — 194×160 (1.21:1) · C03 Home, "Limited Discoveries" rail card 3

**Prompt**
A polished copper tea service arranged in a row on a sheet of pale handmade paper over a plaster shelf: at centre a rounded low-bellied teapot with a lobed body, a domed lid and a tall slim finial, flanked to its right by two small handleless copper cups and, at the far right, a footed copper bowl with a flaring rim. The metal is warm and softly reflective with visible planishing marks rather than a mirror finish. On the pale wall behind, the blurred shadow of a leafy branch falls across the left half. Single soft directional daylight from frame left, gentle falloff, long soft shadows to the right. Warm copper, blush plaster, cream paper, desaturated. 85mm, eye level, shallow depth of field, subtle 35mm film grain and a slight warm colour cast.

**Negative** text, logos, watermarks, people, hands, tea liquid, steam, mirror-chrome finish, cool blue tones, grey seamless, hard shadows, CGI render
**Aspect** 1.21:1 (generate 1552×1280 or larger)
**Composition note** The group runs across the middle of the frame with the teapot slightly left of centre; keep the top-right corner quiet, a circular wishlist button overlays it in the UI.
**Partial** — only the top ~39px of the 160px-tall card is visible in the mock; all that can be seen is the textured paper ground, the branch shadow at the left, the lid and finial of the teapot, the tops of the two small cups and the rim of the footed bowl. Everything below the shoulders of those vessels is inferred.

---


---

### `drop-stone-bowl-01.jpg`  — 194×160 (1.21:1) · C03 Home, "Limited Discoveries" rail card 4

**Prompt**
A wide shallow bowl carved from a single block of unpolished mottled grey-brown stone, its rim slightly irregular where the chisel left it and its surface flecked with darker mineral grain, sitting centred on a pale blush plaster shelf. A plain pale blush plaster wall behind, nothing else in frame. Single soft directional daylight from frame left grazes the stone so the tool marks read across the rim, gentle falloff into a soft shadow at the right. Grey-brown stone, blush plaster, cream, desaturated. 85mm, a few degrees above eye level, shallow depth of field, subtle 35mm film grain and a slight warm colour cast.

**Negative** text, logos, watermarks, people, hands, polished marble, glossy sealer, cool blue tones, grey seamless, hard shadows, CGI render
**Aspect** 1.21:1 (generate 1552×1280 or larger)
**Composition note** Bowl centred with even margin left and right and generous headroom of empty wall — this card is the last in the rail and is clipped by the right edge of the frame, so the right third of the image may never be seen on this screen. It is reused at 133×90 on C29, so the subject must survive a tighter crop. This card has no wishlist button in the mock.
**Partial** — doubly cut in the mock: only the top ~39px of the 160px-tall card is visible (the rail runs off the bottom of the frame) and only its left ~55% is on screen (it runs off the right edge). All that can actually be seen is blush wall and the upper curve of the stone bowl's rim. The rest is inferred.


# Products & shop

### `prod-beeswax-candle-01.jpg`  — 327×296 (1.10:1) · C09 Wishlist, saved-item card thumbnail

**Prompt**
A single lit column candle poured into a ribbed dusty-rose glass tumbler, the vertical flutes catching light down the whole body, the wax inside a matching muted rose, one wick burning with a small warm flame that throws a soft glow up the inner wall. A plain cream paper label sits square on the front, its border blind-embossed, a small crest debossed at the top and the type left illegible. The vessel stands on crumpled dusty-rose damask cloth against a warm plaster wall. Soft directional daylight from frame left, long falloff into shadow at right. Editorial still-life, Kinfolk register, desaturated warm palette. 85mm, eye-level, slightly above the rim, shallow focus, fine 35mm grain.

**Negative** legible text, brand name, logo, wordmark, barcode, price sticker, multiple candles, white seamless, cool grey, hard flash, glossy e-commerce packshot, CGI, people
**Aspect** 1.10:1 (generate 2560×2320 or larger)
**Composition note** The vessel fills roughly the centre 70% of the frame with even margins; the card crops it square-ish, so keep headroom above the flame and don't let the tumbler touch any edge. Note: the mock draws a legible "RSN one" wordmark on the label — generate the label blank/embossed and let production drop the real lockup in, per the no-visible-branding rule.

---


---

### `prod-brass-kettle-01.jpg`  — 327×296 (1.10:1) · C09 Wishlist, saved-item card thumbnail

**Prompt**
A hand-beaten copper-brass kettle with a squat round-shouldered body, a long tapering S-curved spout that lifts and flares at the tip, a domed press-fit lid with a small turned ball finial, and a swing bail handle of shaped wire with a flattened cast boss at its crown, hinged into two small lugs on the shoulder. The body carries a faint low-relief panel pattern chased into the metal. It stands on a rough cracked pale limestone block; a sprig of pink blossom on a bare branch enters at frame right. Warm blush plaster behind. Soft window daylight from frame left. 85mm, eye-level, three-quarter view, shallow focus, warm cast, film grain.

**Negative** stainless steel, chrome, mirror-bright polish, gas hob, kitchen clutter, steam, text, logo, white background, cool tones, people
**Aspect** 1.10:1 (generate 2560×2320 or larger)
**Composition note** Kettle centred and filling most of the height; spout points left, blossom branch occupies the top-right quadrant. Crops close on all four sides in-app, so leave a little breathing room around the handle arc.

---


---

### `prod-linen-sheets-01.jpg`  — 327×296 (1.10:1) · C09 Wishlist, saved-item card thumbnail

**Prompt**
A stack of three or four washed linen sheets folded loosely and laid one on the other, the top sheet draped so its long fold falls forward off the pile and its hemmed selvedge edge runs across the frame, the woven cloth carrying a faint tone-on-tone damask or paisley figuring visible only in raking light. Everything is dusty rose, slightly deeper in the shadowed folds. The stack rests on a matching rose bedcover of the same figured cloth. Warm plaster wall behind, out of focus. Single soft daylight source from frame left, long gentle shadows between the folds. 85mm, close, slightly above, very shallow depth of field, warm desaturated grade, 35mm grain.

**Negative** crisp hotel-ironed sheets, plastic packaging, ribbon, price tag, text, logo, cool blue-white linen, hard shadows, white seamless, people
**Aspect** 1.10:1 (generate 2560×2320 or larger)
**Composition note** The stack fills the lower two-thirds; the top-left corner stays quiet plaster. Watch the resemblance to `prod-yak-blanket-01` — that one is a heavier felted wool in a warmer brown-rose with a bound hem; this one is finer, flatter, cooler in the rose and reads as woven flax.
**Discrepancy** C09 (327×296) draws this as a *dusty-rose* stack; C04's 393×186 rendering of the same slot is a paler *oatmeal/greige* stack shot straight on. Described here from C09 per instruction — confirm with the designer which colourway is the real product before generating, since one asset serves C04, C06, C09, C10, C11 and C12.

---


---

### `prod-yak-blanket-01.jpg`  — 393×186 (2.11:1) · C04 Shop, All Products grid card

**Prompt**
A folded handwoven yak-wool blanket in a warm brown-rose, thick and softly felted, folded into three or four layers with the topmost length draped over and falling toward frame right, where a plain bound hem and a woven selvedge stripe run down the edge. The nap carries a faint tone-on-tone figured pattern and the odd slub in the yarn. It sits on a lightly rumpled cloth of the same warm rose. Cream plaster behind, thrown well out of focus. Single soft daylight from frame left, long low shadows raking across the folds. Editorial still-life, desaturated warm palette, 85mm, close and slightly above, shallow focus, fine grain.

**Negative** synthetic fleece, tartan or printed pattern, folded-in-plastic retail packaging, tag, text, logo, cool grey, white seamless, hard flash, people
**Aspect** 2.11:1 (generate 2560×1213 or larger)
**Composition note** Wide letterbox card crop — the blanket must read at 393×186, so keep it big in frame and let the folds run left-to-right across the long axis. A wishlist heart outline sits top-right; keep that corner low-contrast.

---


---

### `prod-ceramide-cream-01.jpg`  — 393×186 (2.11:1) · C04 Shop, All Products grid card

**Prompt**
An open cosmetic jar of face cream in matte blush-sand ceramic, wide and low with straight shoulders and a threaded neck, filled to a soft peaked swirl of ivory cream standing proud of the rim. A brushed copper screw lid leans upright against the jar at frame left, its underside catching the light. The jar front carries a shallow debossed rectangular panel with fine spaced-out serif lettering, kept low-contrast. Both sit on a pale veined marble ledge against a blush plaster wall. Soft directional daylight from frame left, one long shadow to the right. 85mm, close, eye-level, shallow focus, warm desaturated grade, subtle grain.

**Negative** glossy plastic, glass pump bottle, cellophane, carton, ingredient list, barcode, cool clinical white, blue tones, hard specular flash, water droplets, people
**Aspect** 2.11:1 (generate 2560×1213 or larger)
**Composition note** Wide card crop; jar centre-right, lid left, marble ledge across the bottom quarter. Top-right corner carries a wishlist heart — keep it quiet. The mock renders a readable "ATELIER SAND / Ceramide Cream" label; generate the panel debossed and blank so the real brand can be applied in post.

---


---

### `prod-shop-grid-07-01.jpg`  — 393×186 (2.11:1) · C04 Shop, All Products grid row 4 (left)

**Prompt**
An unidentified small artisan object photographed as a low horizontal still life: a run of dark rosewood forms — a knotted, hand-carved branch or a row of turned wooden beads — lying along a pale ledge in the lower half of the frame, their tops just breaking the horizon of an unbroken blush lime-plaster wall that fills the upper half. The wood is oiled, deep espresso brown, catching one narrow highlight along its upper edge. Nothing else in frame. Single soft daylight from frame left, gentle falloff, no hard shadow. Editorial still-life, Kinfolk register, desaturated warm palette, 85mm, eye-level, shallow focus, fine 35mm grain.

**Negative** text, logo, price tag, packaging, bright colour, cool grey, white seamless, hard flash, CGI, people
**Aspect** 2.11:1 (generate 2560×1213 or larger)
**Partial** — only the top ~35px of this card is visible in the mock (roughly the top 19%); everything below the cut is inferred. All that can actually be read is a plain blush plaster field with the crowns of several dark carved-wood forms rising into it near the bottom of the visible band.
**Composition note** Keep the upper 40% of the frame as quiet plaster — that is the only part the mock evidences. Positional slot name; rename once the design says what the product is.

---


---

### `prod-shop-grid-08-01.jpg`  — 393×186 (2.11:1) · C04 Shop, All Products grid row 4 (right)

**Prompt**
An unidentified small artisan object photographed as a low horizontal still life: a single hand-carved dark rosewood form centred in frame — reading as the turned knop or finial of a handle, a bulbous knot flanked by two tapering arms — sitting on a pale ledge with its crown rising into a blush lime-plaster wall. A soft blurred vertical element, a pale column or the edge of a doorway, sits far right and out of focus. Oiled espresso-brown wood, one soft highlight along its top. Single directional daylight from frame left, gentle falloff, no hard shadow. Editorial still-life, desaturated warm palette, 85mm, eye-level, shallow focus, fine grain.

**Negative** text, logo, price tag, packaging, bright colour, cool grey, white seamless, hard flash, CGI, people
**Aspect** 2.11:1 (generate 2560×1213 or larger)
**Partial** — only the top ~35px of this card is visible in the mock (roughly the top 19%); everything below the cut is inferred. What can be read is the pale plaster field, one dark carved-wood knop breaking into it dead centre, and a soft out-of-focus pale vertical at the right.
**Composition note** Subject centred on the horizontal axis; upper 40% stays quiet plaster. Positional slot name; rename once the design says what the product is.

---


---

### `world-shop-cat-08-01.jpg`  — 83×83 (1:1) · C04 Shop, category disc row, 8th disc

**Prompt**
A very soft, close, low-detail still life for a small circular crop: a pale blush-plaster field with one warm cylindrical vessel form standing slightly right of centre, its side catching a gentle gradient from light to shade, and a faint horizontal ledge line crossing the middle of the frame behind it. Almost no hard edge anywhere; the whole image reads as tone rather than object. Warm blush and cream plaster, aged copper barely warming the right side. Single soft daylight from frame left. 85mm macro, eye-level, extremely shallow depth of field so everything but the near edge of the vessel falls soft. Warm desaturated grade, fine grain.

**Negative** text, logo, hard edges, busy detail, multiple objects, cool grey, white seamless, high contrast, hard shadow, people
**Aspect** 1:1 (generate 1200×1200 or larger)
**Composition note** This crops to an 83px circle and is clipped by the right frame edge in the mock — only the left half of the disc is on screen. Centre the subject and keep the outer 15% of the square uneventful so the circular mask never cuts anything meaningful.
**Undetermined** — the category this disc labels is not visible in the mock (the label is cut off with it), and the image itself is too soft at 83px to identify the object. Positional slot name; the description above is a faithful read of the pixels, not a product identification.

---


---

### `promo-shop-banner-01.jpg`  — 807×206 (3.92:1) · C04 Shop, "Objects for a more meaningful home." banner

**Prompt**
A wide interior still life in warm espresso brown: a round-bellied stoneware vase in mottled greige, its surface incised all over with a fine scratched linear pattern, holding a loose spray of bare branches carrying small five-petal pink blossoms that arc up and out across the top of the frame. Beside it at left sits a shallow carved stone bowl with a soft-worn rim. Both stand on a single hardcover book lying flat, blank-jacketed, on a rough weathered stone table. The room behind falls into deep blurred brown with a hint of a chair at right. Soft daylight from frame left, long shadow. 85mm, eye-level, shallow focus, warm desaturated grade, film grain.

**Negative** legible book title or spine text, logo, watermark, bright flowers, green foliage, cool grey, white seamless, hard flash, clutter, people
**Aspect** 3.92:1 (generate 3228×824 or larger)
**Composition note** The left ~40% carries a 40px serif headline and an uppercase CTA under a dark espresso scrim, so keep it empty and low-detail. The subject group sits centre. The right ~20% carries the italic pull-quote `Curated / from the world's / finest makers.` set in dark espresso `#33241F` **with no scrim over it** — so that strip must stay genuinely pale and low-contrast. The mock currently draws that strip mid-dark with cream type, which contradicts the HTML; generate it pale and let the dark type win, or ask the designer to settle it. The mock's book spine reads "THE KINFOLK HOME" — generate the book unmarked.

---


---

### `prod-copper-vessel-01.jpg`  — 853×810 (1.05:1) · C24 Drop Detail, full-bleed hero

**Prompt**
A hand-beaten Nepali copper water vessel — a kalash of classic gagri form — with a full spherical belly drawing in to a short waisted neck that flares out into a wide everted rolled lip, standing on a narrow plain foot ring. Three bands of decoration circle the body: chased foliate scrollwork of curling leaves and vine on a punched matte ground across the shoulder, a raised central band bounded by two incised lines and filled with a repeating row of oval medallions, and a second scrolled foliate register over the lower belly. The neck and lip stay mirror-polished rose-gold, the chased areas satin, the recesses darkened with patina. It stands on a rough-hewn pale limestone plinth with chipped fissured edges, against a warm cream-taupe lime-plaster wall. Hard-edged window-mullion shadow and dappled leaf shadow fall across the upper left; dried blossom stems sit far right, soft. Single window daylight from upper left. 85mm, eye-level to a hair above, three-quarter, shallow focus, warm desaturated grade, 35mm grain.

**Negative** text, logo, engraving that reads as letters, brass or gold plating, mirror-bright all over, modern vase shape, handles, spout, flowers inside the vessel, white seamless, cool grey, hard flash, CGI, people
**Aspect** 1.05:1 (generate 2560×2430 or larger)
**Composition note** This is the anchor asset of the whole set — 13 screens and 14 derived sizes, from 853×810 down to 103×96. Frame the vessel centre-right with generous quiet plaster to its left: on C24 a `LIMITED DROP` eyebrow, a two-line 40px serif title, maker and city lines, a price and a member pill all sit over the left 45% under a dark scrim, and the italic pull-quote `Tradition / in every / curve.` sits in the narrow gap between the vessel's rim and the right edge. It must also survive a centred square crop at 140×140 and 103×96, so keep the vessel whole with even headroom and don't let the plinth crowd the bottom. Generate at the largest size and derive every other crop from this one file.
**Reference** Every other angle of this SKU — `-02`, `-03`, `-04`, and the C18 shot registered as `-05` — is matched against this frame. Shoot or generate this one first and use it as the reference image for the rest.

---


---

### `prod-copper-vessel-04.jpg`  — 180×160 (1.12:1) · C24 Drop Detail, gallery thumbnail 4

**Prompt**
The same hand-beaten Nepali copper kalash, seen from further back as a styled in-situ scene: the vessel sits left of centre on a thick rough-hewn pale limestone slab whose chipped front edge runs diagonally across the lower third, and beside it at right stands a tall narrow stoneware bottle vase in matte greige, straight-sided with a short collared neck, holding a spray of dried blossom and berry branches that fan up and out to the right. Behind, a cream lime-plaster wall with a strong hard-edged window-mullion shadow falling in broad diagonal bars across the upper left. Warm daylight from frame left. 50mm, eye-level, shallow focus with the wall soft, desaturated warm grade, film grain.

**Consistency** This is a fourth angle of `prod-copper-vessel-01`. Use `prod-copper-vessel-01.jpg` as the reference image — the vessel must be identical in form, in its three engraved registers, in its polish and patina. What changes here is only the camera and the staging: pull back so the vessel occupies about a third of the frame height, place it left of centre rather than centre-right, add the pale stem vase and dried branches at right, and let the plinth's full slab depth show. Same room, same wall, same light direction.

**Negative** a different vessel shape, plain or unengraved body, brass, fresh flowers, colour blossoms, text, logo, white seamless, cool grey, hard flash, people
**Aspect** 1.12:1 (generate 1800×1600 or larger)
**Composition note** Renders at only 180×160 in a four-up thumbnail strip with 8px radius corners — keep the vessel large enough to be recognisable at that size and don't let the branches cross it.

---


---

### `prod-copper-vessel-05.jpg`  — 321×297 (1.08:1) · C18 Order Tracking, order line-item thumbnail

**Prompt**
A hand-raised copper vessel with a full round belly that tapers up into a slender waisted neck and opens into a wide flared mouth finished with a thin rolled rim, standing on a small flat base. The entire body is covered in dense planished hammer facets — small overlapping dimples that scatter the light into soft irregular highlights — with no engraving, no bands and no applied ornament anywhere. Warm rose-gold copper, satin rather than mirror. It sits on a pale grey-veined marble tabletop whose front edge runs diagonally across the lower right; a sprig of tiny dried cream blossoms leans in at lower left. Blush plaster behind, darkening to the right. Soft daylight from frame left. 85mm, eye-level, shallow focus, warm grade, fine grain.

**Consistency** Registered as a fifth angle of `prod-copper-vessel-01`, but it is **not** the same object as drawn. See the discrepancy below before using `-01` as a reference.

**Negative** engraved bands, chased foliate scrollwork, oval medallions, brass, mirror polish, text, logo, white seamless, cool grey, hard flash, people
**Aspect** 1.08:1 (generate 2400×2222 or larger)
**Composition note** Renders at 321×297 with 8px corners beside the order title; vessel centred with even headroom, marble edge kept out of the corners.
**Discrepancy** — C18 is the only screen in the set that draws this SKU as a **plain hammered** vessel. Every other screen showing "Copper Vessel / House of Lazimpat" (C03, C04, C06, C07, C09, C10, C11, C12, C24, C25, C26, C32, C33) shows the **engraved** vessel of `prod-copper-vessel-01` with its three decorated registers. The neck is also taller and more sharply waisted here, and the surround is polished marble rather than rough limestone. Two readings: either C18 is a mock error and this slot should be retired in favour of a crop of `-01`, or the House of Lazimpat line has both a plain and an engraved vessel and C18 is showing the wrong one on the same order. Prompt above describes what C18 actually draws. Resolve with the designer before generating — if it is an error, this asset should not be produced at all.

---


---

### `prod-ceramic-mug-01.jpg`  — 205×161 (1.27:1) · C25 Orders, order-card thumbnail

**Prompt**
A tall hand-thrown stoneware mug in a soft blush-clay glaze, straight-sided with a gentle taper in to a narrow foot, a plain unglazed lip and a thick pulled loop handle at right that stands well clear of the body. The surface is matte and finely pitted with the speckle of the clay body, throwing rings faintly visible. Behind it and to the left, out of focus, sits a smaller lidded jar or creamer in the same glaze with a small knop on the lid. Both stand on a pale veined marble ledge with a rumpled oatmeal cloth entering at lower left. Blush plaster wall behind. Soft daylight from frame left, one long shadow right. 85mm, eye-level, shallow focus, warm desaturated grade, grain.

**Negative** printed slogan, monogram, logo, glossy white porcelain, coffee or liquid inside, spoon, steam, cool grey, white seamless, hard flash, people
**Aspect** 1.27:1 (generate 2050×1610 or larger)
**Composition note** Small thumbnail — the mug should fill most of the height with the handle fully inside the frame; the secondary jar stays soft and secondary. Renders at 205×161 with 8px corners.

---


---

### `promo-thoughtful-living-01.jpg`  — 790×185 (4.27:1) · C25 Orders, "Thoughtful living, delivered worldwide." banner

**Prompt**
A wide, high-key still life in blush and dusty rose: at frame right a square gift box wrapped in textured dusty-rose paper, its lid sitting slightly proud, tied with a wide satin ribbon in the same rose that crosses the lid and is finished in a full loose bow with two long tails falling down the front. Just left of it sits a shallow footed stone bowl in warm greige, its outside carved with a faint incised leaf pattern, the rim catching the light. Both stand on a rough weathered stone ledge that runs across the bottom of the frame. The whole left two-thirds is an unbroken pale blush lime-plaster wall. Soft daylight from frame left. 85mm, eye-level, shallow focus, warm desaturated grade, fine grain.

**Negative** legible gift tag, card, text, logo, ribbon in a contrasting colour, bright red or gold wrapping, confetti, cool grey, white seamless, hard flash, people
**Aspect** 4.27:1 (generate 3160×740 or larger)
**Composition note** A cream scrim runs left-to-right (opaque at 0%, gone by 62%) and dark espresso serif copy plus a "Explore new arrivals" link sit on the left, so the left 60% must stay pale, empty plaster with nothing crossing it. The objects live entirely in the right third. Related shoot: the ribboned box also appears as `promo-wallet-gift-01` (C33), `promo-referral-gift-01` (C34) and possibly `prod-gift-box-01` (C29) — shoot them together so the box, paper and ribbon match; the carved bowl is the same object as in `promo-quiet-table-01`.


# Membership, drops & stores

### `hero-limited-drops-01.jpg`  — 853×1844 (0.46:1) · C15 Limited Drops, full-bleed background photograph

**Prompt**
An editorial still life of wrapped gifts on a pink-brown breccia marble ledge: a large square box in dark espresso embossed paper tied with a wide blush satin ribbon and a loose four-loop bow, and beside it a smaller box in blush floral-printed paper with pink blossom sprigs tucked under its ribbon. A glossy cream ceramic bottle vase stands behind holding branches of pink almond blossom; crumpled dusty-rose linen spills across the marble at right; one fallen blossom rests on the polished stone. Soft directional daylight from frame right throws a long diffuse shadow onto the warm plaster wall. Shot at eye level, 85mm, shallow focus on the ribbon, background soft. Desaturated terracotta and blush palette, fine 35mm grain, warm cast.

**Negative** text, logos, watermarks, brand names on paper or ribbon, people, hands, cool blue tones, white seamless, hard flash, glitter, confetti, CGI gloss, price tags
**Aspect** 0.46:1 (generate 1706×3688 or larger)
**Composition note** The left 55% of the frame is under a heavy left-to-right scrim (90% → 6%) carrying the eyebrow, a 95px "Limited Discoveries" headline, body copy and an italic voice line down to about y=1120 — keep that column plain wall and shadow, no objects, no high-contrast edges. All the props live right of centre in the middle third. A near-opaque pale card panel covers x=20–833 from y=1292 to y=1743, so the bottom 30% of the picture is never seen — put nothing that matters there, but keep the marble and linen running through it so the visible top edge of the panel does not cut an object in half.
**Partial** — the lower 451px band of the image is hidden behind the "The Autumn Drop" panel in the mock; content there is inferred.


---

### `hero-membership-join-01.jpg`  — 853×1844 (0.46:1) · C21 Membership Join, full-bleed background photograph

**Prompt**
An arched plaster alcove in warm terracotta limewash, sunlight raking in from frame left and printing a soft dappled shadow of blossom branches across the curve of the arch. On a stepped travertine plinth with fossil-like veining stands a squarish blush-pink rigid presentation box, its paper blind-embossed all over with a fine botanical relief and a deeper debossed crest and wordmark on the face, tilted a few degrees and catching the light along its top edge. A shallow cream stoneware bowl with incised line decoration sits beside it; at the right edge a tall ovoid ceramic vase in the same carved cream-blush ware holds pink blossom. Eye level, 85mm, shallow focus on the box, film grain.

**Negative** text, watermarks, people, hands, cool grey light, white seamless, hard flash, plastic sheen, e-commerce packshot look, drop shadows, logos other than the blind-embossed cartouche
**Aspect** 0.46:1 (generate 1706×3688 or larger)
**Composition note** Only the top ~760px of this image is ever visible: from y=700 a vertical gradient takes the page to flat espresso and it is fully opaque by about y=995, and the benefits grid sits on the flat colour below that. So everything — arch, plinth, box, bowl, vase — must be composed inside the top 41% of the tall frame, with the plinth edge landing around y=690 so the fade reads as the table falling into shadow. A 100° scrim runs 90% at the left edge to 10% at the right; the left 45% carries the back arrow, the RSN one lockup and a three-line 68px headline, so keep that column as unbroken plaster in shadow. Generate the box with an empty blind-embossed cartouche and composite the RSN One crest and wordmark in post — no generator will render the mark cleanly at this size.
**Consistency** — C21, C22 and C23 are one shoot, three crops. Build a single set: terracotta limewash arch, stepped travertine plinth, carved cream-blush stoneware vase and shallow bowl, the blush embossed RSN One box, dusty-rose linen, pink blossom branches, one window at frame left. Generate `hero-membership-join-01` first and use it as the reference image for `hero-membership-payment-01` and `hero-membership-welcome-01`; the wall, the stone, the ware and the light direction must be identical across all three, only the camera position and what is in frame change.
**Partial** — the lower ~1080px of the image is covered by the espresso fade in the mock; content there is inferred.


---

### `hero-membership-payment-01.jpg`  — 853×1844 (0.46:1) · C22 Membership Payment, full-bleed background photograph

**Prompt**
The same terracotta limewash wall, now with a hard shaft of afternoon sun falling between two plaster piers and a lace of blossom shadow scattered across the lit panel. On a travertine ledge sits a cloth-bound hardback book laid flat, its spine turned to camera and blind-stamped with faint illegible lettering; a shallow cream stoneware bowl with incised decoration rests on top of it, and beside them a tall ovoid ceramic vase in the same carved cream-blush ware holds long branches of pink almond blossom that reach up out of the frame. Eye level, 85mm, shallow focus on the vase, warm desaturated palette, soft 35mm grain.

**Negative** text, readable book title, publisher marks, watermarks, people, hands, cool grey light, white seamless, hard flash, CGI gloss, price tags
**Aspect** 0.46:1 (generate 1706×3688 or larger)
**Composition note** As on C21, only the top ~760px is visible — the page fades to flat espresso from y=700 and is opaque by about y=958, with the payment-method list sitting on the flat colour. Put the ledge line at roughly y=690. The 100° scrim runs 88% at the left edge to 6% at the right; the left 45% holds the back arrow, the lockup and a two-line "Complete your membership." headline, so keep it plain shadowed plaster. The RSN One box is deliberately absent from this frame — do not include it. The mock's book reads "THE KINFOLK HOME"; that is real third-party cover text, so generate it with the spine lettering blurred to an illegible blind stamp rather than reproducing the title.
**Consistency** — second frame of the C21/C22/C23 shoot. Use `hero-membership-join-01.jpg` as the reference image. Same wall, same travertine, same carved cream-blush vase and bowl, same window at frame left. What changes: the camera has moved right and slightly back so the arch is out of frame and a sunlit pier fills the upper right; the box is gone, the book is added under the bowl.
**Partial** — the lower ~1080px of the image is covered by the espresso fade in the mock; content there is inferred.


---

### `hero-membership-welcome-01.jpg`  — 853×1844 (0.46:1) · C23 Membership Confirmation, full-bleed background photograph

**Prompt**
A blush-pink rigid gift box stands upright on a stepped travertine ledge, its paper blind-embossed all over with a fine botanical relief and a debossed crest and wordmark centred on the face, one edge catching a warm rim of daylight. A shallow cream stoneware bowl with incised decoration sits to its left on a fall of dusty-rose linen; a carved cream-blush ceramic vase of pink blossom stands to its right. Three small blossom heads rest on the stone in front of the box and loose petals drift through the air. The espresso plaster wall behind carries a soft blurred shadow of foliage. Eye level, 85mm, shallow focus on the embossed face, film grain.

**Negative** text, watermarks, people, hands, cool grey light, white seamless, hard flash, glitter, motion blur streaks, CGI gloss, logos other than the blind-embossed cartouche
**Aspect** 0.46:1 (generate 1706×3688 or larger)
**Composition note** This one runs the full 853×1844 with only a gentle top-weighted scrim (62% → 10%), so the whole frame is seen. The box occupies a measured rectangle of x=253–590, y=675–1215 — left of centre, its base landing just above the hard panel seam at y=1220, below which an almost-opaque espresso plate covers the rest of the frame. Above the box, from y=0 to about y=640, centred type sits on the wall: the lockup, a 110px rose tick disc and an 84px two-line "Welcome to RSN One!" headline — keep that band as even, low-contrast plaster with nothing but the soft foliage shadow. A five-line pull-quote sits over the photograph to the right of the box at roughly x=640–800, y=730–870, with no scrim of its own, so keep the vase and petals in that zone dark and unbusy. Composite the RSN One crest and wordmark onto the box in post.
**Consistency** — third frame of the C21/C22/C23 shoot. Use `hero-membership-join-01.jpg` as the reference image; the box must be the identical object, same paper, same emboss, same blush. What changes: the camera has moved closer and lower and the box is stood on its end rather than tilted flat, the arch is out of frame, the linen and falling petals are added.


---

### `promo-store-nepal-01.jpg`  — 770×407 (1.89:1) · C19 Store Selection, "RSNOne Nepal" card

**Prompt**
A traditional Newar temple in the Kathmandu valley photographed in late afternoon: a tiered pagoda roof with deeply carved timber eave boards and angled struts, a row of dark carved wooden columns and lattice-framed niches beneath it, and a broad stone plinth of worn carved steps in the foreground. A leafy tree stands at the left of the building and a snow-capped Himalayan ridge rises pale behind it through warm haze. Three-quarter view from slightly below, the roofline running diagonally across the upper right. Soft low sun, long shadows in the carving. Desaturated terracotta, sepia and dusty rose; muted green in the tree; 50mm, fine film grain.

**Negative** text, signage, prayer flags with lettering, watermarks, people, tourists, vehicles, power lines, saturated blue sky, HDR, cool tones
**Aspect** 1.89:1 (generate 2310×1221 or larger)
**Composition note** A 90° scrim runs 95% opaque at the left edge and clears to zero by 66% across, so the left 45% of the card is effectively flat espresso — put nothing there but haze and sky; the temple, tree and mountain all belong in the right 55%. A four-line pale rose eyebrow ("LOCAL / ROOTS. / TIMELESS / BEAUTY.") is set flush right in the top-right corner over the unscrimmed photograph, so keep the top-right ~180×140px area to soft haze or plain roof shadow rather than fine carving detail. The card has a 1px rose border and rounded corners; keep a little air at all four edges. Same architectural vocabulary as `house-lazimpat-01` but a different building and a different frame — match the carving style and the sepia grade so the two read as one place.


---

### `promo-store-global-01.jpg`  — 770×417 (1.85:1) · C19 Store Selection, "RSNOne Global Select" card

**Prompt**
An antique-style terrestrial globe on a slim brass meridian and turned wooden foot, its gores drawn as fine engraved coastlines and stippled continents on an aged parchment-tan sphere, standing on a short stack of two cloth-bound hardback books laid flat on a stone shelf. A shallow carved stone bowl sits behind and to the left, half in shadow, and a blurred plaster pillar and dried stems recede in the background. Warm directional daylight from frame right rakes across the sphere and drops a soft shadow to the left. Slightly below eye level, 85mm, shallow focus holding the globe's near face, background falling soft. Desaturated tan, copper and espresso; 35mm grain.

**Negative** text, readable book titles, country labels or place names on the globe, watermarks, people, hands, cool blue oceans, bright primary colours, glossy studio highlights, white seamless
**Aspect** 1.85:1 (generate 2310×1251 or larger)
**Composition note** Same 90° scrim as the Nepal card — 95% at the left edge, clear by 66% across — so the left 45% must be quiet plaster and shadow behind the headline, body copy and rose CTA; the globe sits in the right third. A three-line pale rose eyebrow ("A MORE / THOUGHTFUL / WAY TO LIVE.") is set flush right in the top-right corner over open photograph, so keep that corner soft and low-contrast. The mock's lower book reads "THE KINFOLK HOME" on its spine — generate the spines as blind-stamped and illegible rather than reproducing a real title. Note the globe overlaps the subject of `promo-global-select-01` on C03, but this is a wide 770px card crop, not the 391×190 tile; it is a separate exposure, not the same file.


---

### `hero-store-footer-01.jpg`  — 853×356 (2.40:1) · C19 Store Selection, still-life band at the foot of the screen

**Prompt**
A quiet tabletop still life shot straight on against a dark espresso plaster wall: at the far left a round-bellied unglazed terracotta vase holding a spray of pink cosmos-like blossom on slender stems, its flowers leaning in toward the centre, and at the far right a footed stone bowl with a pale speckled rim catching the last of the light. Between them the wall is empty. A dark oiled wood tabletop runs across the lower third of the frame, its grain just visible where the light grazes it. Single soft daylight source from frame left, deep falloff into shadow. 85mm, shallow focus, warm desaturated rose and espresso, 35mm grain.

**Negative** text, logos, watermarks, people, hands, extra props in the middle of the frame, cool grey tones, hard flash, white seamless, bright highlights
**Aspect** 2.40:1 (generate 2560×1068 or larger)
**Composition note** This band is the bottom 356px of the screen and a vertical scrim sits over it — 92% opaque at the top edge, easing to 45% at 22%, 30% at 60% and back to 55% at the bottom — so the picture has to fade up into flat espresso along its own top edge. The centre of the band carries a 40×2 rose rule and a two-line centred italic voice line at roughly y=70–172 within the crop, and the iOS home indicator sits centred at the very bottom: keep the middle third of the frame empty dark wall, with the vase hard against the left edge and the bowl hard against the right, both allowed to bleed off. Above this band the mock has no photographic texture at all, so nothing needs to extend upward.


---

### `house-lazimpat-01.jpg`  — 853×862 (0.99:1) · C08 House Profile, hero; also C03 Home as a 391×190 promo tile

**Prompt**
A Newar temple above the Kathmandu valley at golden hour, photographed from below at a three-quarter angle: a tiered pagoda roof with a curved upswept corner finial and a dense fringe of carved timber eave brackets, beneath it a facade of dark carved wooden columns, foliate lintels and arched lattice niches, and a stone plinth of broad worn steps flanked by small carved guardian lions. A leafy tree fills the left middle ground, and beyond it the hazy valley falls away with distant temple spires and rooftops dissolving into warm smog. Soft raking sun from frame right, warm sepia sky with no sun disc. 50mm, deep-ish focus on the carving, background soft; desaturated terracotta and copper, 35mm grain.

**Negative** text, signage, watermarks, people, monkeys, motorbikes, power lines, satellite dishes, saturated blue sky, HDR halos, cool tones, tourist crowds
**Aspect** 0.99:1 (generate 2048×2069 or larger)
**Composition note** One source image serves two crops, so shoot it to survive both. At full size on C08 it fills 853×862 with a cream panel rising over it from y=832 and 36px rounded top corners, and app chrome over the photograph at the top: the status bar across y=0–70 and a back arrow at x≈52–100, y≈100–138 with a wishlist heart mirrored at the right — keep the top ~150px as open hazy sky in both upper corners, cream-coloured icons need to sit on it. On C03 the same file is cropped to a 391×190 tile (2.06:1) taken across the middle of the frame, under a pale left-to-right scrim (86% → 8%) with dark ink copy over the left half — so the temple facade must stay readable inside a horizontal centre band, and the left of that band should be the soft tree and valley haze, not carving detail. Keep the whole composition off-centre right so both crops land the building in the same place.


# Everything else

### `prod-copper-vessel-02.jpg` — 853×715 (1.19:1) · C07 Product Detail, gallery slide 2; also C24 Drop Detail thumbnail 2 at 180×160

**Prompt**
A tight macro of the engraved belly of a hand-beaten Nepali copper water vessel, the curved shoulder filling the whole frame so the object reads as a copper horizon: the repoussé band of chased relief — overlapping lotus-petal cartouches and figurative panels worked over a finely punched matte ground — runs edge to edge, the hammered planes catching light in soft elongated highlights along the upper left curve and rolling down into warm shadow at the lower right. The blurred cream plaster wall shows only at the far left edge. Single soft directional daylight from a window at frame left, long gentle falloff, no fill. Warm espresso, terracotta and aged copper, desaturated. 85mm macro, very shallow depth of field, focus on the relief nearest camera, subtle 35mm grain and a warm cast.

**Consistency** Second angle of `prod-copper-vessel-01.jpg` (the C24 Drop Detail hero). Use that file as the reference image — same vessel, same patina, same engraving. Nothing changes but the camera: move from the full eye-level three-quarter of `-01` to a close macro on the engraved belly, cropping the rim, foot and plinth entirely out of frame.
**Negative** text, logos, watermarks, people, hands, price stickers, e-commerce packshot lighting, white seamless, rim light, fill flash, cool tones, CGI, plastic sheen, duplicate vessels
**Aspect** 1.19:1 (generate 2560×2145 or larger)
**Composition note** The vessel's curve should fill roughly 90% of the frame with a sliver of soft background at the left. Also crops to a 180×160 thumbnail on C24, so keep the most legible passage of engraving near the centre.
**Source** Not drawn in the C07 carousel — slide 1 is the only slide rendered and the three dots imply the rest. It *is* drawn as thumbnail 2 of the four-up rail at the bottom of C24-DropDetail, and this prompt is written from those pixels, not inferred.

---


---

### `prod-copper-vessel-03.jpg` — 853×715 (1.19:1) · C07 Product Detail, gallery slide 3; also C24 Drop Detail thumbnail 3 at 180×160

**Prompt**
A hand-beaten Nepali copper water vessel seen from above and slightly to the front, angled so the camera looks down into its open mouth: the wide flared rim rolls over in a thick polished collar, the dark unlit interior falls away to near-black, and below it the stepped neck and the first engraved band of chased lotus and figure work curve out to the shoulder, which runs off the bottom corners of the frame. Hammer facets scatter warm highlights across the rim. A blurred cream plaster ground sits behind the shoulder. Single soft directional daylight from a window at frame left, long shadows, gentle falloff. Warm espresso, terracotta, aged copper, desaturated. 85mm, shallow depth of field, focus on the rim, subtle 35mm grain.

**Consistency** Third angle of `prod-copper-vessel-01.jpg` (the C24 Drop Detail hero). Use that file as the reference image — identical vessel, patina and engraving to `-01` and `-02`. Only the camera changes: raise it to a high three-quarter looking down into the mouth, cropping out the foot and plinth.
**Negative** text, logos, watermarks, people, hands, water or liquid inside the vessel, e-commerce packshot lighting, white seamless, rim light, fill flash, cool tones, CGI, duplicate vessels
**Aspect** 1.19:1 (generate 2560×2145 or larger)
**Composition note** Rim centred with a little headroom; the dark mouth is the darkest value in the frame and should stay clean, since this also crops to a 180×160 thumbnail on C24.
**Source** Not drawn in the C07 carousel; drawn as thumbnail 3 of the C24-DropDetail rail, and written from those pixels.

---


---

### `promo-thoughtful-pieces-01.jpg` — 302×317 (0.95:1) · C11 Checkout Details, right-rail editorial tile

**Prompt**
A square rigid gift box in blush embossed paper, lid on, photographed slightly above eye level from the front right, wrapped in a wide dusty-rose satin ribbon tied in a full bow on the lid at the upper right with one long tail spilling down the front of the box and pooling on the cloth below. A large square cream card tag hangs from the bow against the right side of the box, printed in a dark serif with a small mark beneath it. A branch of dusty-rose blossom leans in from the top right corner. The box rests on crumpled dusty-rose linen. Blush plaster wall behind. Single soft daylight from frame left, long shadow to the right, gentle falloff. Warm blush and rose monochrome, desaturated. 85mm, shallow depth of field, focus on the bow and tag, subtle 35mm grain.

**Negative** logos, watermarks, people, hands, brand names on the box, e-commerce packshot lighting, white seamless, rim light, fill flash, cool tones, hard specular highlights, CGI
**Aspect** 0.95:1 (generate 1810×1900 or larger)
**Composition note** The left 45% of the frame must stay quiet, low-contrast blush wall and cloth — four lines of dark italic serif ("Thoughtful pieces. Brighter days.") plus a rule sit there with no scrim. Keep the box, bow and tag entirely in the right 55%.
**Note on the tag copy** The mock's tag reads "For a kinder tomorrow." Image generators will not render that legibly. Either shoot/composite the tag with real type, or generate the tag blank and set the words as live type in the layout.

---


---

### `promo-kinder-tomorrow-01.jpg` — 302×317 (0.95:1) · C12 Checkout Payments, right-rail editorial tile

**Prompt**
A round-bellied hand-thrown stone vase with a short flared neck, its mottled cream-and-rose speckled glaze catching the light, standing at the right of frame on a dark oiled wood ledge and holding a tall airy spray of dusty-rose blossom branches that fan up and out to the right, several stems reaching the top edge. A length of crumpled dusty-rose linen is draped across the ledge at the lower left, its ribbed weave catching a low raking light. Behind, a blush lime-plaster wall carries soft diagonal window shadows falling from the upper left. Single soft directional daylight from frame left, long shadows, gentle falloff. Warm blush, rose and cream plaster, desaturated. 85mm, shallow depth of field, focus on the vase, blossoms falling soft. Subtle 35mm grain, warm cast.

**Negative** text, logos, watermarks, people, hands, e-commerce packshot lighting, white seamless, rim light, fill flash, cool tones, glossy ceramic, CGI
**Aspect** 0.95:1 (generate 1810×1900 or larger)
**Composition note** The left 50% must stay quiet plaster wall — four lines of dark italic serif ("More than objects, a kinder tomorrow.") and a rule sit directly on it with no scrim. Keep the vase and the base of the blossoms in the right half; only fine outer stems may cross into the upper-left quadrant.

---


---

### `avatar-maya-kapoor-01.jpg` — 194×194 (1:1, circular crop) · C17 Me, profile header; also expected on C33 / C34

**Prompt**
A head-and-shoulders portrait of a South Asian woman in her early thirties, facing camera straight on at eye level with a warm, easy closed-eyed-corners smile showing her teeth. Shoulder-length dark brown hair, softly waved and parted a little off centre, falling in front of the shoulders. Warm brown eyes, dark defined brows, minimal makeup, small gold stud earrings. She wears a plain off-white linen tunic with a narrow notched neckline. The background is a smooth warm greige plaster wall falling gently out of focus. Soft even daylight from a window at frame left, a light shadow under the jaw, no fill flash and no rim light. Warm cream, taupe and soft brown, desaturated. 85mm, shallow depth of field, focus on the eyes, subtle 35mm grain.

**Negative** text, logos, watermarks, harsh studio lighting, ring-light catchlight, white seamless, corporate headshot backdrop, heavy retouching, cool tones, sunglasses, hats, busy background, other people
**Aspect** 1:1 (generate 1024×1024 or larger)
**Composition note** Head centred with even headroom and the shoulders reaching the bottom edge; this crops to a 194px circle with a 1px cream ring, so keep the hair and shoulders inside a centred circular safe area and leave the corners disposable.
**People note** This is the one slot in the set that shows a person, and it is a fictional member persona ("Maya Kapoor, Founding Member 047"), so a generated face is fine here. If a real photograph is substituted, it needs a signed model release covering commercial in-product use before it ships.

---


---

### `promo-card-visa-01.jpg` — 226×128 (1.77:1) · C28 Payment Methods, saved-card row (marked Default)

**Not a photograph — do not generate.** The mock draws a card-shaped tile with a rose-to-copper gradient and a faint RSN arc motif, with the official Visa mark knocked out in white at the upper left. Build the tile in the design system; the only thing to source is the mark.

**Where the asset comes from** The Visa Brand Center (`usa.visa.com/run-your-business/small-business-tools/payment-technology/visa-brand-guidelines.html`) — download the Visa Brand Mark as vector (EPS/SVG). Use the white/reverse variant on this dark tile. Visa's guidelines set a minimum reproduction width and clear space equal to the height of the "V"; do not recolour, outline or stretch it.
**Size needed** Tile 226×128 at 1×; supply the tile artwork at 3× (678×384). The mark itself sits at roughly 96px wide within the 226px tile, so ship the SVG and let it scale.
**Licensing note** Network marks are trademarks; use is permitted only to indicate accepted payment methods and must follow each network's guidelines.

---


---

### `promo-card-mastercard-01.jpg` — 226×128 (1.77:1) · C28 Payment Methods, saved-card row

**Not a photograph — do not generate.** Same tile construction as the Visa row: rose-to-copper gradient card shape with the faint RSN arc, with the Mastercard interlocking-circles symbol at the left. The mock shows the symbol only — red and amber circles, no wordmark.

**Where the asset comes from** Mastercard Brand Center (`brand.mastercard.com`) — download the Mastercard Symbol as vector (SVG/EPS). Use the standard two-colour symbol; the guidelines forbid recolouring the circles and require clear space of one circle-radius on all sides. If a wordmark is ever added it must be the horizontal lockup, not typed text.
**Size needed** Tile 226×128 at 1×, artwork at 3× (678×384). Symbol roughly 62px wide inside the 226px tile.
**Licensing note** As above — trademark use, guidelines-bound.

---


---

### `promo-card-amex-01.jpg` — 226×128 (1.77:1) · C28 Payment Methods, saved-card row

**Not a photograph — do not generate.** Same tile construction; the mock places a two-line "AMERICAN EXPRESS" wordmark in white at the upper left.

**Where the asset comes from** American Express Merchant Brand Center (`amexmerchantbrandcenter.com`) — download the Blue Box logo as vector. **Flag for the designer:** the mock shows the wordmark knocked out in white with no blue box, which is a deviation from Amex's guidelines — the Blue Box logo is normally required and the wordmark is not licensed to stand alone. Either use the Blue Box logo on this tile or confirm the exception with Amex.
**Size needed** Tile 226×128 at 1×, artwork at 3× (678×384). Wordmark roughly 108px wide inside the 226px tile; a Blue Box logo would sit nearer 64px square.
**Licensing note** As above — trademark use, guidelines-bound.

---


---

### `promo-upi-01.jpg` — 170×85 (2:1) · C28 Payment Methods, UPI row

**Not a photograph — do not generate.** The mock shows a tinted rose panel with the official UPI mark centred: the italic "UPI" wordmark in white with the orange-white-green tricolour arrow device to its right.

**Where the asset comes from** NPCI (National Payments Corporation of India) — the UPI brand assets and guidelines at `npci.org.in/what-we-do/upi/product-overview` / the NPCI brand toolkit. Download the vector UPI logo; use the reverse (white wordmark) variant on this tinted panel and keep the tricolour arrow at its specified colours.
**Size needed** Panel 170×85 at 1×; supply artwork at 3× (510×255). Mark roughly 118px wide inside the 170px panel.
**Licensing note** UPI is an NPCI trademark; use requires following NPCI's brand guidelines and, for merchants, their acceptance-mark rules.

---


---

### `prod-carved-vase-01.jpg` — 133×90 (1.48:1) · C29 Notifications, "New arrivals are here" row thumbnail

**Prompt**
A round-bellied hand-thrown terracotta vase with a short waisted neck and a heavy rolled rim, standing just right of centre, its whole body covered in shallow incised relief — loose interlocking glyph-like figures and scrollwork carved into the unglazed clay. Behind it and to the left, out of focus, a small cream ceramic pitcher holds a loose bunch of dried cream blossom. Both sit on a pale stone ledge. A soft cream plaster wall falls away behind. Single soft directional daylight from a window at frame left, the light grazing across the carving so the relief reads, long gentle shadow to the right. Warm terracotta, cream plaster and dusty rose, desaturated. 85mm, shallow depth of field, focus on the carved belly. Subtle 35mm film grain.

**Negative** text, logos, watermarks, people, hands, glossy glaze, e-commerce packshot lighting, white seamless, rim light, fill flash, cool tones, CGI
**Aspect** 1.48:1 (generate 1596×1080 or larger)
**Composition note** Renders as a 133×90 rounded thumbnail — the vase must be the dominant, immediately legible shape, occupying roughly the centre two-thirds; the pitcher and dried blossom are a soft secondary at the left edge and may be clipped.

---


---

### `prod-gift-box-01.jpg` — 133×90 (1.48:1) · C29 Notifications, "Your order has been delivered" row thumbnail

**Prompt**
A square lidded gift box in blush textured paper, photographed slightly above eye level from the front left so the lid and two sides show, tied with a wide dusty-rose satin ribbon that crosses the lid and is finished in a loose double bow at the back of the lid, its loops standing up and catching the light, with a long ribbon tail falling down the front left face and onto the surface below. The box sits on a pale stone ledge. A soft blush plaster wall falls away behind. Single soft directional daylight from a window at frame left, long shadow to the right, gentle falloff. Warm blush, rose and cream, desaturated. 85mm, shallow depth of field, focus on the bow and the front lid edge. Subtle 35mm grain, warm cast.

**Negative** text, logos, watermarks, brand names on the box, people, hands, e-commerce packshot lighting, white seamless, rim light, fill flash, cool tones, glitter, CGI
**Aspect** 1.48:1 (generate 1596×1080 or larger)
**Composition note** Renders as a 133×90 rounded thumbnail; the box should fill roughly 75% of the frame width, centred, with the bow near the top edge and a little breathing room all round.
**Related** The manifest flags this as possibly the same object as `promo-wallet-gift-01` / `promo-referral-gift-01`. It is a similar box and ribbon, but this frame is unbranded, shot from the front *left*, and the bow sits toward the back of the lid rather than in a cross-wrap — worth confirming with the designer whether one shoot can serve all three.

---


---

### `prod-glass-diffuser-01.jpg` — 133×90 (1.48:1) · C29 Notifications, "Your wallet has been updated" row thumbnail

**Prompt**
A squat rectangular reed-diffuser bottle in rose-tinted glass with softly rounded corners and a short neck, capped with a heavy fluted brushed-brass collar, standing centred on a pale stone ledge. A plain cream paper label with a fine dark serif mark is wrapped across the lower two thirds of the front face. The glass carries warm internal reflections and a soft caustic on the stone. A blush plaster wall falls away behind. Single soft directional daylight from a window at frame left, long shadow to the right, gentle falloff. Warm blush, rose, cream and aged brass, desaturated. 85mm, shallow depth of field, focus on the label and cap. Subtle 35mm grain.

**Negative** legible text, logos, watermarks, people, hands, reeds or sticks in the bottle, e-commerce packshot lighting, white seamless, rim light, fill flash, cool tones, hard specular blowouts, CGI
**Aspect** 1.48:1 (generate 1596×1080 or larger)
**Composition note** Renders as a 133×90 rounded thumbnail — bottle centred and upright with even headroom; the brass cap must clear the top edge. The label lettering is illegible at this size in the mock and should be left as an implied mark, not real type.

---


---

### `hero-help-support-01.jpg` — 853×445 (1.92:1) · C30 Help & Support, full-bleed header behind the title

**Prompt**
A still life at the right of frame: a round hand-thrown vase in pale carved stoneware, its body covered in shallow incised glyph-like relief, holding a tall spray of dusty-rose blossom branches that fan up and out to the right; a shallow dark carved bowl with the same incised linework sits in front of it and slightly left. Both stand on a stacked hardback book laid flat on a dark oiled wood ledge. Behind them a blush lime-plaster wall carries the soft blurred shadow of a branch cast from an unseen window at the upper right, and the wall darkens steadily toward frame left until it falls to deep espresso. Single soft directional daylight from frame right, long shadows, gentle falloff, no fill. Warm espresso, blush, terracotta and cream plaster, desaturated. 85mm, shallow depth of field, focus on the vase. Subtle 35mm grain.

**Consistency** Same objects and the same set-up as `promo-quiet-table-01.jpg` — carved vase, carved bowl, stacked book, wood ledge. Treat them as one shoot. This frame is the dark-key, taller crop with the still life pushed to the right; `promo-quiet-table-01` is the pale-key wide banner from the same table.
**Negative** legible text on the book spine, logos, watermarks, people, hands, e-commerce packshot lighting, white seamless, rim light, fill flash, cool tones, CGI
**Aspect** 1.92:1 (generate 2560×1335 or larger)
**Composition note** The left 55% must fall to a near-solid dark espresso — the logo, "Help & Support", a serif deck line and two lines of body copy all sit there in cream with only a light scrim. Keep every object in the right 45%, and let the wall gradient do the work so the scrim is barely needed.
**Note on the book** The mock's book spine reads "THE KINFOLK HOME", a real published title. Replace with an unbranded book or a blank cloth-bound spine unless the rights are cleared.

---


---

### `promo-quiet-table-01.jpg` — 764×188 (4.06:1) · C30 Help & Support "Still need help?" banner — **and reused unchanged on C29 Notifications, C33 Member Wallet and C34 Member Referrals**

**Prompt**
A wide, pale, quiet still life: at the right, a round hand-thrown vase in cream carved stoneware, its body covered in shallow incised glyph-like relief, holds a loose spray of dusty-rose dried blossom that reaches the top edge; in front of it and to the left sits a shallow dark carved bowl with the same incised linework. Both stand on a stacked hardback book laid flat on a pale veined stone ledge that runs off the bottom right corner. Behind them a warm blush lime-plaster wall fills the whole left half of the frame, empty but for the soft blurred shadows of a branch drifting across it from an unseen window. Single soft directional daylight from frame right, long soft shadows, gentle falloff. Warm blush, cream plaster and dusty rose, desaturated, high key. 85mm, shallow depth of field, focus on the bowl rim. Subtle 35mm grain.

**Consistency** Same shoot, same objects and same ledge as `hero-help-support-01.jpg` (C30 header). Use that file as reference; only the crop, the framing and the exposure key change — this one is wide, pale and reads as a light banner.
**Negative** legible text on the book spine, logos, watermarks, people, hands, e-commerce packshot lighting, white seamless, rim light, fill flash, cool tones, CGI
**Aspect** 4.06:1 (generate 3100×764 or larger)
**Composition note** This one asset serves four screens at four different crops — 779×162, 773×178, 772×170 and 764×188 (aspect 4.06 to 4.81). Generate at the *tallest* of those, 4.06:1, and keep the objects vertically centred with headroom top and bottom so the wider crops trim only the top and bottom edges. In every use the left 55% must stay pale, empty plaster: a dark serif headline, a body line and — on C30 — a solid rose "CHAT WITH US" button all sit directly on it with no scrim. Nothing but wall shadow may enter that zone.
**Note on the book** As with `hero-help-support-01`, the spine reads "THE KINFOLK HOME" in the mock — replace with an unbranded book.

---


---

### `prod-linen-throw-01.jpg` — 136×90 (1.51:1) · C33 Member Wallet, "Used at Checkout" transaction thumbnail

**Prompt**
A close macro of a folded throw in dusty rose, three soft folds stacked one above the other and running diagonally across the frame, the top fold rolling toward camera with a rounded selvedge edge. The cloth has a brushed, lightly napped surface with a subtle tone-on-tone damask pattern raised in the weave, and a fine ribbed border along the upper fold. The fabric fills almost the entire frame; only a narrow strip of blurred blush plaster wall shows at the top left. Single soft directional daylight from a window at frame left, raking across the folds so the nap and pattern read, deep soft shadows in the creases. Warm dusty rose and blush, desaturated. 85mm macro, shallow depth of field, focus on the top fold. Subtle 35mm grain.

**Negative** text, logos, watermarks, labels or care tags, people, hands, e-commerce packshot lighting, white seamless, rim light, fill flash, cool tones, cold grey shadows, CGI
**Aspect** 1.51:1 (generate 1632×1080 or larger)
**Composition note** Renders as a 136×90 rounded thumbnail — at that size only the stacked-folds silhouette survives, so keep the fold lines strong, roughly horizontal and evenly spaced across the frame.
**Related** Visually close to `prod-yak-blanket-01` (a folded pink blanket on C03/C04/C25/C29). This crop is tighter and the pattern reads as a fine damask rather than the yak blanket's larger paisley — confirm with the designer that two separate assets are intended.

---


---

### `prod-rsn-candle-01.jpg` — 136×90 (1.51:1) · C33 Member Wallet, "Reward Credit" transaction thumbnail

**Prompt**
A wide, squat candle in a deep oxblood-tinted glass vessel with a heavily reeded, fluted outer wall, the flutes running vertically and picking up warm vertical highlights. A single lit wick burns at the centre, its small flame throwing a warm glow up the inside of the glass. A cream rectangular paper label with a fine dark serif mark is wrapped across the middle of the vessel. The candle stands on crumpled dusty-rose linen, a blush plaster wall falling dark and soft behind. Single soft directional daylight from frame left plus the candle's own warm light, long gentle shadow to the right, no fill. Deep oxblood, terracotta, blush and cream, desaturated, low key. 85mm, shallow depth of field, focus on the label and the flame. Subtle 35mm grain.

**Negative** legible text, watermarks, people, hands, multiple wicks, wax drips, e-commerce packshot lighting, white seamless, rim light, fill flash, cool tones, CGI
**Aspect** 1.51:1 (generate 1632×1080 or larger)
**Composition note** Renders as a 136×90 rounded thumbnail; the vessel should fill roughly 70% of the frame width, centred, with the flame clear of the top edge.
**How this differs from `prod-beeswax-candle-01`** Same product family, deliberately a different shot. `prod-beeswax-candle-01` (C03/C04/C06/C09/C11/C12/C25/C29) is a *tall, narrow* reeded tumbler in pale blush glass, shot high key against a light blush ground. This one is *wide and squat* — noticeably wider than it is tall — in much deeper oxblood glass, shot low key with heavier shadow and a tighter crop. Keep both distinctions visible: proportion and glass tint.
**Note on the label** The label in the mock carries the RSN one lockup. Do not ask a generator to draw it — generate the label blank and composite the production logo asset onto it, or shoot it.

---


---

### `promo-wallet-gift-01.jpg` — 433×243 (1.78:1) · C33 Member Wallet, image half of the Available Balance card

**Prompt**
A square lidded gift box in blush embossed paper with a fine botanical texture pressed into it, sitting on the rough sawn edge of a travertine plinth at the right of frame, photographed from slightly above and to the front left so the lid and two faces show. A wide dusty-rose satin ribbon is cross-wrapped over the lid and tied in a neat, generous bow on top, one long tail falling down the left face of the box and off the plinth. Behind, a blush lime-plaster wall dissolves into soft dappled leaf shadow. The left third of the frame is empty, quiet wall. Single soft directional daylight from frame right, long shadows, gentle falloff, no fill. Warm blush, rose, espresso and pale stone, desaturated. 85mm, shallow depth of field, focus on the bow. Subtle 35mm grain.

**Consistency** Same object and the same shoot as `promo-referral-gift-01.jpg` (C34) — identical box, paper texture, ribbon and travertine ledge; use whichever is generated first as the reference for the other. This frame is the tighter one, angled from the front left so the box's branded face turns away from camera and no lockup is visible; the C34 frame is wider and more frontal.
**Negative** text, watermarks, people, hands, visible brand names or lockups in this frame, e-commerce packshot lighting, white seamless, rim light, fill flash, cool tones, glitter, CGI
**Aspect** 1.78:1 (generate 2598×1458 or larger)
**Composition note** The image is masked to fade out toward the left under the balance copy — "Available Balance", a large ₹ figure and two lines of body text sit over the left half. Keep the box and bow entirely in the right 55% and leave the left third as flat, low-contrast wall that can dissolve to nothing.

---


---

### `promo-referral-gift-01.jpg` — 772×263 (2.94:1) · C34 Member Referrals, "A more thoughtful circle" banner

**Prompt**
A square lidded gift box in blush embossed paper with a fine botanical texture pressed into it, standing on a pale veined marble ledge just right of centre, photographed close to eye level and almost frontally so the full front face reads, with a soft debossed emblem pressed into the paper at its centre. A wide dusty-rose satin ribbon is cross-wrapped over the lid and tied in a full bow on top, its cut tails hanging down the front face. At the right edge, a small clear glass bud vase holds a loose cloud of cream dried gypsophila. Behind, a warm blush lime-plaster wall fills the left half of the frame, empty but for soft blurred branch shadows. Single soft directional daylight from frame right, long soft shadows, gentle falloff. Warm blush, rose, cream and pale stone, desaturated, high key. 85mm, shallow depth of field, focus on the box face. Subtle 35mm grain.

**Consistency** Same object and the same shoot as `promo-wallet-gift-01.jpg` (C33) — identical box, paper texture, ribbon and stone ledge. Only the framing changes: this one is wider, higher key and near-frontal, showing the box's branded front face and adding the glass vase of dried gypsophila at the right; the C33 frame is tighter, angled from the front left, with the branded face turned away and no flowers.
**Negative** legible text, watermarks, people, hands, e-commerce packshot lighting, white seamless, rim light, fill flash, cool tones, glitter, CGI
**Aspect** 2.94:1 (generate 3088×1052 or larger)
**Composition note** The left 50% must stay pale, empty plaster — a two-line serif headline with an italic phrase and three lines of body copy sit directly on it with no scrim. Nothing but wall shadow may enter that zone.
**Note on the emblem** The box face in the mock carries a debossed RSN one lockup. Generate the deboss as a blank or abstract impression and composite the production logo, or shoot it with a real branded box — do not ask a generator to render the wordmark.
