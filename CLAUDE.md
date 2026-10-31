# CLAUDE.md — Lathifah Sahda portfolio

Personal portfolio for Lathifah Sahda (Thifa), Computer Science graduate (ITS, 2026).
Readers: (1) recruiters who decide in ~60 seconds, (2) technical interviewers who open case studies.
This is a portfolio, not a sales page: no pricing, no FAQ, no "hire me" funnels, no testimonials.

## Hard rules (never break)

1. **Content integrity.** Every number, date, title and claim comes from `content/`. Never invent,
   round up, or "improve" a figure. If something is missing, write `[TBD: what is missing]`.
2. **Caveats travel with numbers.** If a metric in `content/` has `n`, `caveat` or `limitation`
   fields, render them next to the number, never in a hidden tooltip only.
3. **Team work is labelled.** Items with `"team": true` show "Team project" (plus team size if
   given). Never list teammates' names. Never phrase team work as solo work ("I built…" → "We built…").
4. **No phone number, no home address, no teammate names, no internal server names** in visible text
   anywhere. One exception: a team project may link to its repository even when that repository lives
   on a teammate's GitHub account, so the account name may appear in a `links.code` URL. Before adding
   such a link, clone the repository read-only outside this project and check it for secrets and
   internal details (`.env` files, API keys, tokens, passwords, private IPs, internal hostnames,
   WireGuard `PrivateKey`/`Endpoint`, hard-coded company API URLs). If it holds any of those, do not
   link it.
5. **Draft gate.** `npm run build` runs `scripts/check-tbd.mjs` first. The build fails if any
   item that is NOT marked `"draft": true` contains `[TBD`. Draft items are excluded from the build.
   Never disable or weaken this check to get a build through — ask instead.
6. **Content is separate from code.** Adding a project = adding/editing a file in `content/`.
   Components must never hard-code portfolio text (UI labels go in `content/<locale>/ui.json`).
7. **`DESIGN.md` is the visual authority.** Read it before any UI work. Do not copy layouts,
   code-card designs or assets from reference sites; take patterns only.

## Stack

- Next.js (App Router) + TypeScript, `output: "export"`, `trailingSlash: true`, `images.unoptimized: true`
- Tailwind CSS, tokens defined as CSS variables per `DESIGN.md`
- `lenis` for smooth scroll (desktop pointer only), `motion` (Motion for React) for reveals
- Fonts via `next/font/google`: Plus Jakarta Sans, IBM Plex Mono
- Hosting: GitHub Pages from repo `lathifash03.github.io`, deployed by GitHub Actions on push to `main`
  (actions/configure-pages → upload-pages-artifact → deploy-pages). No basePath needed.

## Routes

- `/` English (default), `/id/` Bahasa Indonesia
- `/projects/<slug>/` and `/id/projects/<slug>/` for case studies (generated with `generateStaticParams`)
- `/cv.pdf` static file in `public/`
- **The language gate.** A locale is complete when every file in `content/en/` has a matching file in
  `content/id/`. Only a complete locale is published: its pages carry content, the EN/ID toggle
  appears, and the two locales point at each other with `hreflang`. While ID is incomplete:
  - the toggle slot renders nothing at all — no placeholder, no disabled control;
  - no `hreflang` alternates are emitted;
  - `/id/` and `/id/projects/<slug>/` still exist as files, because `output: export` fails the build
    on an empty `generateStaticParams()`. They call `notFound()`, so each serves Next's not-found
    page with `robots: noindex` — never a half-translated page. The build succeeds; the English site
    ships unaffected.

  So the gate degrades rather than removing routes. Do not "fix" this by hard-coding the ID params
  or by deleting the `notFound()` guards, and keep the matching guard in each `generateMetadata`:
  it runs before the component and would otherwise read missing content files.

## Content files

```
content/<locale>/profile.json      hero (incl. greetings, heroTrace), lanes, education, contact
content/<locale>/ui.json           nav labels, buttons, section titles
content/<locale>/projects.json     every project (research, built, data)
content/<locale>/experience.json   work, research and teaching roles
content/<locale>/leadership.json   organisations, speaking, training, gallery captions
content/<locale>/writing.json      ITS Online + Medium
content/<locale>/case-studies/<slug>.md   long-form pages (frontmatter + markdown)
```

Validate every file with a zod schema at build time; a schema error fails the build. Also:

- `"team"` is a boolean. Do not widen it to a string, a number or a team-size union.
- `"draft": true` on a nested object omits that field only, not the whole item. The component then
  renders the layout without it — never an empty placeholder box.
- `content/<locale>/case-studies/` is the source of truth for case studies. Every `links.caseStudy`
  must resolve to a file there, and the build fails if a case-study file has no project pointing at it.

## Working style

- Work in the phases listed in `PROMPTS.md`. Stop at the end of each phase and report.
- Verify before declaring done: `npm run build`, `npm run lint`, open the site in a browser at 390px,
  768px and 1440px widths. Say plainly which checks you actually ran.
- Prefer CSS for simple effects. Add a dependency only when it clearly earns its place.
- Respect `prefers-reduced-motion` everywhere: all content must be readable with zero animation.
