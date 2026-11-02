# DESIGN.md — Lathifah Sahda portfolio

## 1. Atmosphere

Quiet, warm-neutral, editorial. Paper-coloured page, black-ink type, lots of air.
It should feel like a well-made printed profile that happens to move — calm, precise, personal.
Motion is smooth and short; it guides the eye, it never makes the reader wait.

The page reads as **white cards laid on paper**: `--paper` is the page, and each major section's
content sits on a white container. Colour is real but held: lane tints fill small areas (lane cards,
tag pills, timeline nodes, metric chips) and two sections — the verify-trace card and Contact — are
solid `--ink`. Everything stays flat: fills and hairlines carry the structure, not shadows.

Not this: dark "developer" themes, gradients, glow, neon, glassmorphism, 3D blobs,
marquees of buzzwords, "No excuses" slogans, sales hooks, stock AI imagery.

## 2. Colour

Neutral base (light mode only for v1):

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#EFEDE8` | page background |
| `--white` | `#FFFFFF` | section containers — the cards the page is made of |
| `--surface` | `#F8F7F4` | cards, raised areas |
| `--surface-2` | `#E5E2DB` | pressed / hover fills, image placeholders |
| `--ink` | `#1F1E1B` | headings, body text, primary button fill |
| `--ink-2` | `#5F5C56` | secondary text, metadata (AA on paper, surface and surface-2) |
| `--line` | `#DAD6CC` | hairlines, borders |
| `--focus` | `#1F1E1B` | 2px focus ring, offset 3px |

Lane colours — one per portfolio lane. Each lane has three values: the base mark, a `tint` used as a
background fill, and a `strong` used for text **on that tint**. Every tint/strong pair is AA on its
own tint, on white and on paper (measured, lowest pair 6.23:1).

| Lane | `--lane-*` (mark) | `--lane-*-tint` (bg) | `--lane-*-strong` (text on tint) |
|---|---|---|---|
| ai — AI & Data (slate blue) | `#5B7083` | `#E6ECF1` | `#2E4A61` |
| sw — Software (sage) | `#6F8467` | `#E9EFE6` | `#3B5A34` |
| wr — Writing & Leadership (terracotta) | `#A8644A` | `#F6E8E1` | `#8A3F22` |

Where each is used:

- **mark** — timeline node, the 2px rule, the active-tab underline (the underline stays `--ink`).
- **tint** — the three lane cards, tag pills, timeline node ring, data-row metric chips, the
  Speaking and Training row cards (always `wr`).
- **strong** — text and numbers sitting on that lane's tint. Never on paper-coloured ground, where
  body text stays `--ink`.

Body text is always `--ink`; `strong` colours label and accent, they never set a paragraph.

Status pill in hero: `--lane-sw-tint` fill, `--lane-sw-strong` text, a `--lane-sw` dot.

Dark ground, used exactly twice — the hero's verify-trace card and the Contact band:

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#1F1E1B` | the dark fill |
| `--paper` | `#EFEDE8` | text on that fill (14.25:1) |
| `--trace-pass` | `#9FCB95` | a gate that passed (9.09:1 on ink) |
| `--trace-fail` | `#E79A7A` | a gate that failed (7.38:1) |
| `--trace-retry` | `#E8C27A` | a retry (9.87:1) |

Portrait tile ground: `#E8C4A0`. It sits behind a cut-out portrait and never behind text.

Accent colours — saturated, and used **only** as a filled chip, a marker or a panel. Never as text
colour, never as a page or section background. A white glyph sits inside a chip; a chip never holds
a word.

| Token | Hex | Role |
|---|---|---|
| `--chip-ai` | `#4C7BD9` | AI & Data icon chip, research index chip |
| `--chip-sw` | `#4F9D69` | Software icon chip, research index chip |
| `--chip-wr` | `#E76A3E` | Writing & Leadership icon chip |
| `--marker` | `#F6DE7A` | highlighter behind the closing phrase, lower 45% of the line |

White on each chip measures **4.08:1** (ai), **3.30:1** (sw) and **3.22:1** (wr). None reaches the
4.5:1 that body text needs, so these three only ever carry a glyph: as a non-text graphic each
clears the 3:1 of WCAG 1.4.11, and the phrase beside it carries the meaning.
Ink on `--marker` is **12.42:1**.

A chip that carries a **word** — the research card's `01 / 03` index — uses the text-safe shade of
the same hue instead, where white clears AA outright:

| Token | Hex | White on it |
|---|---|---|
| `--chip-ai-text` | `#3B6FD5` | 4.75:1 |
| `--chip-sw-text` | `#418257` | 4.61:1 |
| `--chip-wr-text` | `#CE491A` | 4.57:1 |

`--chip-wr` is `#E76A3E` rather than a lighter orange because white on `#E97850` measures 2.89:1 —
below the 3:1 floor. It is the same hue, 4% darker in lightness.

Research panel grounds — one flat colour per card, declared in content (`panel`), with the diagram
drawn on top. Measured: `--ink` 13.26 / 13.08 / 13.88, `--ink-2` 5.30 / 5.23 / 5.55 and
`--lane-ai-strong` 7.36 / 7.26 / 7.71, so every label a diagram draws on a panel clears AA.

| Project | Panel |
|---|---|
| kg-agent | `#DCE6F7` |
| narrative-to-procedural | `#E6E1F7` |
| ruang-topik | `#F7E9CC` |

## 3. Typography

- Display — the hero name, section titles, card titles, the lanes statement, the contact headline:
  **Bricolage Grotesque** (500, 600), loaded as a variable font with its optical-size axis, so the
  large sizes get the tighter display cut and the small ones stay open.
- Body and UI — paragraphs, buttons, tabs, links, labels: **Instrument Sans** (400, 500, 600).
- Metadata, indices, numbers with units, code: **IBM Plex Mono** 400.
- Never more than these three families. No weight 700+.

Display is applied by the `font-display` utility on the element, not inherited from a wrapper, so
it is always visible in the markup which type is display and which is body.

| Role | Family | Size | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| Hero name | display | `clamp(3.25rem, 9vw, 7.5rem)` | 600 | 0.95 | -0.03em |
| Hero statement | body | `clamp(1.375rem, 2.6vw, 2.25rem)` | 400 | 1.25 | -0.01em |
| Section title | display | `clamp(2rem, 5vw, 3.75rem)` | 500 | 1.05 | -0.02em |
| Card title | display | `clamp(1.5rem, 3vw, 2.5rem)` | 500 | 1.1 | -0.015em |
| Contact headline | display | `clamp(2rem, 3.6vw, 3.25rem)` | 500 | 1.1 | -0.02em |
| Body | body | `1.0625rem` | 400 | 1.65 | 0 |
| Small / meta (mono) | mono | `0.8125rem` | 400 | 1.4 | 0.02em |

Bricolage Grotesque runs wider than the typeface it replaced, so the hero name's tracking does the
work of keeping it on two lines at 1440 and the section titles keep their clamp. Every heading was
re-checked for new wraps at 390, 768 and 1440 after the switch.

Section eyebrows are mono, sentence case, preceded by the section index in the form `01 / Research`.
The main sections are numbered 01 Research, 02 Built, 03 Data, 04 Experience, 05 Leadership,
06 Writing, 07 Contact. The hero and the three-lanes section carry no number. Card indices inside a
section (`01 / 03`) are a separate counter.
Sentence case everywhere. No ALL CAPS headlines.

## 4. Components

- **Section container.** Every numbered section's content sits on a white container: `--white`,
  radius 28px, 1px `--line`, padding 48px desktop / 24px mobile. `--paper` shows as the gap between
  them. The section's index and title sit **above** the container, on paper, so the page reads as a
  run of labelled cards. Contact is the exception: its container is `--ink` (see below).
- **Hero.** Not a container — it sits directly on paper, and holds:
  - **Status pill**, top right of the hero block (above the name on mobile): `--lane-sw-tint` fill,
    `--lane-sw-strong` mono text, a 8px `--lane-sw` dot, pill radius, 1px `--lane-sw-strong` at 20%.
  - **Portrait tile**, left of the name, inline with it: 144px desktop / 96px mobile, radius 24px,
    `#E8C4A0` ground, 3px `--white` border, `rotate(-5deg)`, soft shadow, holding
    `portrait-cutout.png` (transparent PNG, no frame of its own). It never shrinks in its flex row.
  - **The hero stack**, in the right column, two layers deep:
    - *back* — a photo card, radius 24px, `rotate(-4deg)`, about 70% of the column width, its
      `object-position` set on the subject;
    - *front* — the verify-trace card, `rotate(2deg)`, overlapping the photo's lower-left corner.

    Below 1024px they stop overlapping and stack: photo card, then trace card.
  - **Social buttons**, under the CTAs: 44px circles, 1px `--line`, ink glyph, hover fills
    `--surface-2`. GitHub, LinkedIn, Medium, email. The Jakarta clock sits to their right,
    separated by a 1px `--line` hairline (the hairline drops below 640px and the clock wraps).
  - **Verify-trace card**: see §7.3.
- **Top nav (sticky):** name left; section tabs right (Work · Experience · Leadership · Writing · Contact);
  EN/ID toggle at far right. Background `--paper` at 85% at rest; once scrolled it goes solid
  `--paper` and gains a 1px `--line` bottom border, because a dark section passing under a
  translucent bar drops the inactive tabs below AA.
  Active tab = ink text + 2px underline in `--ink` — every tab, never a lane colour.
  The Work tab is active from the three-lanes section through the end of the Data section; in the hero
  no tab is active.
  Mobile (<768px): name + a "Menu" text button opening a full-width sheet with the same links.
- **Buttons:** pill, height 48px, padding 0 24px. Primary = `--ink` fill, `--paper` text.
  Secondary = transparent, 1px `--line` border, ink text. Arrow icon nudges 3px on hover.
- **Tags:** pill, `--lane-*-tint` fill, `--lane-*-strong` text, no border, mono 12px.
- **Lanes section** — a statement, then tabs.
  - *Statement*: one sentence at section-title size, from `profile.lanesStatement` in content as
    ordered segments. A segment tagged with a lane id is preceded by an **icon chip** — a 0.8em
    rounded square in that lane's `--chip-*`, tilted a few degrees, holding a white glyph, marked
    `aria-hidden`. A segment tagged `hl` is drawn with the **marker**: a `--marker` band across the
    lower 45% of its line, painted as a background so descenders stay readable. Words are never
    recoloured; the chip and the marker carry the colour.
  - *Tabs*: the three lanes as a row of bordered cells. The selected tab takes its lane tint and its
    summary appears below. A real `role="tablist"` with `aria-selected` and roving tabindex: arrow
    keys move between tabs, Home and End jump to the ends, and the panel is labelled by its tab.
    AI & Data is selected first, and the panel renders server-side so the summary is present
    without script.
- **Device frames** (Built section). Screenshots are framed in CSS, never in a photographic mockup:
  - *Phone* — for projects whose screenshot is a phone screen: max-width 240px, radius 36px, 10px
    `--ink` bezel, a 56×5px `--ink`-at-30% speaker notch centred at the top of the screen.
  - *Browser* — for web projects: radius 16px, 1px `--line`, a 36px `--surface-2` title bar holding
    three 10px dots (`--line`) and a rounded `--white` address strip.
  The frame is chosen per project by a `frame` field in content (`phone` | `browser`), never guessed
  from the image.
- **Speaking / Training row card** (Leadership): the list is body size, not meta. Each item is a row
  card on `--lane-wr-tint`, radius 16px, padding 20px, with an optional mono year on the left
  (`--lane-wr-strong`), the title in `--ink` at `1.0625rem`, and its detail in `--ink-2` underneath.
  Two columns from 1024px.
- **Project card (research):** white, radius 24px, 1px `--line`, padding 40px desktop / 24px mobile.
  Its **visual panel** is a flat colour from content (`panel`), with the diagram drawn on top, and
  its **index** (`01 / 03`) is a small chip in that lane's `--chip-*-text` with white digits, ahead
  of the year — the text-safe shade, because this chip carries a word. It is the card's only
  saturated mark.
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
- **Metric chip** (Data rows): the metric's number in a `--lane-*-tint` pill with
  `--lane-*-strong` mono text; the label and caveat stay beside it in `--ink` / `--ink-2`. The chip
  is a fill, not a border, and never replaces the caveat.
- **Timeline entry:** year range in mono on the left column, role + org + 2–3 bullets right, lane-coloured
  node on a 1px vertical rule. The node is a `--lane-*` dot inside a 20px `--lane-*-tint` ring, so
  the lane reads as colour rather than as a 10px speck.
- **Contact band:** the closing section is one solid `--ink` container (radius 28px), `--paper` text,
  `--white` headings. Buttons invert: primary becomes `--paper` fill with `--ink` text, secondary a
  1px `--paper`-at-30% border with `--paper` text. It is the only dark section besides the trace card.
- **Start-a-message card** (inside the Contact band): a white card, radius 24px, carrying one short
  line and three option pills. Each pill is a `mailto:` with a prefilled subject, so it opens the
  reader's own mail client — there is no form and no backend, and nothing is ever posted anywhere.
  Line and pill labels come from content.
- **Images:** real screenshots and photos only. Radius 16px. Blur or crop anything showing internal
  company data. Every image needs alt text.

## 5. Layout

- Max content width 1200px, side gutter 24px mobile / 48px desktop. Body text max 68ch.
- Section padding: 128px top/bottom desktop, 80px mobile.
- 12-column grid ≥1024px; single column below 768px. Asymmetry is welcome: titles may sit in
  columns 1–7 with text in 8–12.
- No horizontal page scroll at any width (390px is the reference phone).

## 6. Depth

Flat. Containers separate by fill (`--white` on `--paper`, or a lane tint) + 1px `--line`. Two
shadows exist in the whole system and no others:

- stacked research cards: `0 24px 48px -24px rgb(31 30 27 / 0.18)`;
- the hero portrait tile: `0 8px 20px -8px rgb(31 30 27 / 0.28)` — it is a tilted object resting on
  the page, and the shadow is what makes the tilt read.

No gradients, no glow, no blur behind panels.

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
2. **Hero entrance.** Status pill, portrait tile + name, statement, buttons, socials rise 16px +
   fade, staggered 80ms.
3. **Verify-trace card** (hero, front of the stack). A dark `--ink` card, radius 24px,
   `rotate(2deg)`, in mono, showing the lines of `profile.heroTrace` in file order. A header line
   above the rule reads `kg-agent · example run`. Each line shows its own threshold as content
   wrote it (`faithfulness 0.82 ≥ 0.7`), its text in `--paper`, its status mark in `--trace-pass` /
   `--trace-fail` / `--trace-retry`; the card never adds, edits or reorders line text.
   `ui.labels.illustration` sits small **under** the card, on paper, always visible, never a
   tooltip.

   The lines **type in**: 22ms per character, a 180ms pause between lines, each line's status mark
   fading in only once that line finishes, and a caret blinking at the end of the last line. It runs
   once, after the intro has cleared. Each line's duration and delay are computed from its own
   character count and written into the element, so the stylesheet needs no per-line rule. Under
   `prefers-reduced-motion` the whole card is simply there, complete, with no caret. The rotation is
   layout, not movement, so it stays either way.
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
11. **Marker sweep** (Lanes statement). The `--marker` band behind the closing phrase grows from
    0 to full width in 700ms when the statement is revealed, left to right. It is a
    `background-size` transition on the phrase, so the words never move. The start state lives
    inside `prefers-reduced-motion: no-preference` **and** `html[data-js]`: with either missing the
    band is simply drawn at full width, never absent.
12. **Tab change** (Lanes tabs). The selected cell's tint and the panel's text swap with no
    animation beyond the standard 200ms colour transition. Changing tabs never moves the layout:
    the panel's height is governed by its longest summary, so the page does not jump.

## 8. Responsive

Breakpoints: 640 / 768 / 1024 / 1280. Touch targets ≥44px. Below 768px: single column, nav sheet,
cards unstacked, belt becomes swipe, hero visual stacks under the text.

## 9. Accessibility and performance

Semantic landmarks, one `h1` per page, visible focus rings, AA contrast for all text. A lane colour
may set text only as `--lane-*-strong` on its own tint, on white or on paper — every such pair is
measured in §2 and clears 4.5:1; the base `--lane-*` marks stay non-text. Icon-only buttons carry an
accessible name that contains any visible text (WCAG 2.5.3) and a ≥44px target.
Images lazy-loaded with explicit width/height.
Target Lighthouse ≥90 on performance and accessibility on mobile.
