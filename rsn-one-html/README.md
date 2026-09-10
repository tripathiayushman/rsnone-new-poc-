# RSN ONE — app screens as HTML

34 design mocks converted to structural HTML so the coding team can read them.

**Start here:** open `index.html` — a contact sheet linking every screen.

| File | What it is |
|---|---|
| `index.html` | Contact sheet, all 34 screens, grouped by flow |
| `RSN-HANDOFF-SPEC.md` | Tokens, type scale, class names, canvas, open questions |
| `IMAGE-MANIFEST.md` | Every image slot: name, screen, size, aspect |
| `IMAGE-PROMPTS.md` | A generation prompt for each of the 58 photographs |
| `CXX-ScreenName.html` | One screen each, self-contained, no JS, no build step |
| `rsn-one-images/` | Where the photography goes — see the README inside |
| `_compare/` | Mock vs. render, side by side, for checking the conversion |
| `_render/`, `_thumbs/` | Generated screenshots (used by the contact sheet) |
| `_manifest/` | Per-screen source data for `IMAGE-MANIFEST.md` |

Each screen is one file at **853 × 1844, 1:1 with its mock**. All CSS sits in a single
`<style>` block; tokens and shared components (status bar, app bar, section header,
buttons, chips, tab bar) are identical across all 34, so a change to one is a change to
all. To preview a screen at phone size, add `zoom:.5` to `.screen`.

Images are **named slots**, not files — see `IMAGE-MANIFEST.md`. Judgement calls are
marked in the HTML as `<!-- ASSUMPTION: … -->`, and things that look like design bugs as
`<!-- DEVIATION-RISK: … -->`. Search for those two strings to review them all.
