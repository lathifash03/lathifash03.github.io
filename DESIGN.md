# DESIGN.md — Lathifah Sahda portfolio

## 1. Atmosphere

Quiet, warm-neutral, editorial. Paper-coloured page, black-ink type, lots of air.
It should feel like a well-made printed profile that happens to move — calm, precise, personal.
Motion is smooth and short; it guides the eye, it never makes the reader wait.

Not this: dark "developer" themes, gradients, glow, neon, glassmorphism, 3D blobs,
marquees of buzzwords, "No excuses" slogans, sales hooks, stock AI imagery.

## 2. Colour

Neutral base (light mode only for v1):

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#EFEDE8` | page background |
| `--surface` | `#F8F7F4` | cards, raised areas |
| `--surface-2` | `#E5E2DB` | pressed / hover fills, image placeholders |
| `--ink` | `#1F1E1B` | headings, body text, primary button fill |
| `--ink-2` | `#5F5C56` | secondary text, metadata (AA on paper, surface and surface-2) |
| `--line` | `#DAD6CC` | hairlines, borders |
| `--focus` | `#1F1E1B` | 2px focus ring, offset 3px |

Ornament colours — one per portfolio lane. Used ONLY for small marks: dots, a 2px rule, a tag
outline, a timeline node, the active-tab underline. Never for backgrounds, never for body text.

| Token | Hex | Lane |
|---|---|---|
| `--lane-ai` | `#5B7083` | AI & Data (slate blue) |
| `--lane-sw` | `#6F8467` | Software (sage) |
| `--lane-wr` | `#A8644A` | Writing & Leadership (terracotta) |

Status dot in hero ("Open to internships"): `--lane-sw`.

## 3. Typography

- Display and UI: **Plus Jakarta Sans** (weights 400, 500, 600). Body text also Plus Jakarta Sans.
- Metadata, indices, numbers with units, code: **IBM Plex Mono** 400.
- Never more than these two families. No weight 700+.

| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Hero name | `clamp(3.25rem, 9vw, 7.5rem)` | 600 | 0.95 | -0.03em |
| Hero statement | `clamp(1.375rem, 2.6vw, 2.25rem)` | 400 | 1.25 | -0.01em |
| Section title | `clamp(2rem, 5vw, 3.75rem)` | 500 | 1.05 | -0.02em |
| Card title | `clamp(1.5rem, 3vw, 2.5rem)` | 500 | 1.1 | -0.015em |
| Body | `1.0625rem` | 400 | 1.65 | 0 |
| Small / meta (mono) | `0.8125rem` | 400 | 1.4 | 0.02em |

Section eyebrows are mono, sentence case, preceded by the section index in the form `01 / Research`.
The main sections are numbered 01 Research, 02 Built, 03 Data, 04 Experience, 05 Leadership,
06 Writing, 07 Contact. The hero and the three-lanes section carry no number. Card indices inside a
section (`01 / 03`) are a separate counter.
Sentence case everywhere. No ALL CAPS headlines.

## 4. Components

- **Top nav (sticky):** name left; section tabs right (Work · Experience · Leadership · Writing · Contact);
  EN/ID toggle at far right. Background `--paper` at 85% with 1px `--line` bottom border once scrolled.
  Active tab = ink text + 2px underline in `--ink` — every tab, never a lane colour.
  The Work tab is active from the three-lanes section through the end of the Data section; in the hero
  no tab is active.
  Mobile (<768px): name + a "Menu" text button opening a full-width sheet with the same links.
- **Buttons:** pill, height 48px, padding 0 24px. Primary = `--ink` fill, `--paper` text.
  Secondary = transparent, 1px `--line` border, ink text. Arrow icon nudges 3px on hover.
- **Tags:** pill, 1px border in lane colour, ink text, mono 12px.
- **Project card (research):** `--surface`, radius 24px, 1px `--line`, padding 40px desktop / 24px mobile.
  Two columns ≥1024px: text left (index `01 / 03`, year, title, 2-line summary, 1–3 key figures with
  caveats, tags, buttons), visual right (diagram or screenshot, radius 16px, `--surface-2` behind).
  A card whose visual is missing becomes single column, text only — never an empty placeholder box.
- **Project card (built):** compact. Optional 16:10 image on top, then title, context line, team label,
  summary, tags, links. Same `--surface`, radius 24px, 1px `--line`; padding 24px. Two-column grid from
  768px. No image → text only, same card.
- **Data row (Data and analysis):** bordered rows, not cards: 1px `--line` between rows, no fill. Each
  row holds title, context, its metric inline with the metric's caveat, tags and links. A row with a
  gallery shows it as two thumbnails.
- **Metric figure:** number in Plex Mono 2rem, label below in `--ink-2`, caveat line below that
  (`n = 20`, `3 runs`…). Always show the caveat.
- **Timeline entry:** year range in mono on the left column, role + org + 2–3 bullets right, lane-coloured
  node on a 1px vertical rule.
- **Images:** real screenshots and photos only. Radius 16px. Blur or crop anything showing internal
  company data. Every image needs alt text.

## 5. Layout

- Max content width 1200px, side gutter 24px mobile / 48px desktop. Body text max 68ch.
- Section padding: 128px top/bottom desktop, 80px mobile.
- 12-column grid ≥1024px; single column below 768px. Asymmetry is welcome: titles may sit in
  columns 1–7 with text in 8–12.
- No horizontal page scroll at any width (390px is the reference phone).

## 6. Depth

Flat. Cards separate by `--surface` + 1px `--line`. One soft shadow only on stacked research cards:
`0 24px 48px -24px rgb(31 30 27 / 0.18)`. No other shadows.

## 7. Motion spec (complete list — add nothing else without asking)

Global: easing `cubic-bezier(0.22, 1, 0.36, 1)`; durations 200ms (hover), 500ms (reveals).
`prefers-reduced-motion: reduce` → all of the below are off and content is shown in its final state.
Scroll-scrubbed effects clamp at their end state: an element is fully clear once it is fully in view or
the page is scrolled to the end — nothing stays blurred or dimmed at the bottom of the page.

1. **Intro overlay.** Cycles the greetings in `profile.greetings`, in file order, ~220ms each, above a
   32×6 dot grid that fills left to right; then the overlay slides up (500ms). The whole intro,
   slide included, fits in 1.5s. Each greeting is rendered with its own `lang`, and with `dir="rtl"`
   when the content marks it right-to-left. Skippable by any click, key, wheel or touch. Shown once per
   session (`sessionStorage`, wrapped in try/catch). The page is fully rendered underneath (overlay is
   `aria-hidden`, content is not hidden), so it never delays reading or SEO.
2. **Hero entrance.** Photo, name, statement, buttons rise 16px + fade, staggered 80ms.
3. **Verify-trace card** (hero, right column ≥1024px; below the text on mobile). A small `--surface`
   card in mono showing the lines of `profile.heroTrace` in file order, appearing one by one. Each
   line's `status` picks its mark and tone; the card never adds, edits or reorders line text. Captioned
   with `ui.labels.illustration`, always visible, never a tooltip. Plays once.
4. **Live clock.** `profile.location.label` + HH:MM:SS in `profile.location.timezone`, seconds in
   `--ink-2`. Accessible name: `ui.labels.clock`.
5. **Smooth scroll.** Lenis, desktop fine-pointer only; native scroll on touch devices. Nav clicks
   scroll with an offset equal to the nav height. Scrollspy via IntersectionObserver.
6. **Stacked research cards.** Each card `position: sticky` with top offsets 96/112/128px; as the next
   card arrives, the previous scales to 0.96 and dims to 70% brightness. Mobile: plain vertical list.
7. **Screenshot belt** (Built section). A horizontal row of project screenshots drifting slowly
   (40s loop), pauses on hover/focus. Mobile: native swipe with scroll-snap, no auto-drift.
8. **Timeline line** (Experience). The vertical rule draws downward with scroll progress.
9. **Blur-to-clear** (Leadership). Each entry starts at `filter: blur(8px)`, opacity 0.25 and resolves
   to sharp as it reaches 60% viewport height. Scrubbed by scroll, not timed.
10. **Section reveals** elsewhere: 16px rise + fade once, on entering viewport.

## 8. Responsive

Breakpoints: 640 / 768 / 1024 / 1280. Touch targets ≥44px. Below 768px: single column, nav sheet,
cards unstacked, belt becomes swipe, hero visual stacks under the text.

## 9. Accessibility and performance

Semantic landmarks, one `h1` per page, visible focus rings, AA contrast for all text
(lane colours are never used for text). Images lazy-loaded with explicit width/height.
Target Lighthouse ≥90 on performance and accessibility on mobile.
