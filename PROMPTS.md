# PROMPTS.md: prompt bertahap untuk Claude Code

Cara pakai: jalankan satu fase per pesan. Setelah setiap fase, cek hasilnya di browser
(`npm run dev`), baru lanjut. Kalau hasilnya meleset, koreksi di fase itu juga, jangan ditumpuk.

---

## Fase 0: Cek lingkungan (±10 menit)

```
Read CLAUDE.md, DESIGN.md and everything in content/. Do not write code yet.
1. List which plugins/skills are actually available in this session (OMC, Taste Skill / design-taste-frontend,
   anything else). Don't install anything.
2. Summarise the site structure you understood from these files in 10 lines.
3. List anything in CLAUDE.md or DESIGN.md that is ambiguous or contradictory.
Then stop.
```

## Fase 1: Kerangka + deploy kosong (±1–2 jam)

```
Phase 1. Scaffold the project as described in CLAUDE.md:
- Next.js App Router + TypeScript + Tailwind, static export (output "export", trailingSlash, images unoptimized).
- Design tokens from DESIGN.md as CSS variables; fonts Plus Jakarta Sans + IBM Plex Mono via next/font.
- zod schemas for every file in content/ and a typed loader; exclude items with draft: true.
- package.json "build" must run `node scripts/check-tbd.mjs` before `next build`.
- GitHub Actions workflow that builds and deploys to GitHub Pages on push to main.
- A placeholder home page that renders the hero name and statement from content/en/profile.json.
Verify: npm run lint, npm run build (the TBD check is expected to fail — report its list, then run
`next build` alone to confirm the app itself builds). Stop and report.
```

Setelah ini: buat repo `lathifash03.github.io` di GitHub, push, lalu di Settings → Pages pilih
"GitHub Actions". Deploy sekarang walau isinya masih kosong, supaya masalah hosting ketahuan di hari pertama.

## Fase 2: Semua section di halaman utama, tanpa animasi (±4–5 jam)

```
Phase 2. Build every section of the home page in the order of DESIGN.md / the section map:
hero (photo slot, name, statement, status dot, clock, CV + email buttons), three lanes, research
(3 cards), built (cards + screenshot row, static for now), data and analysis, experience timeline,
leadership (roles, speaking, training, gallery slot), writing (ITS Online + Medium), contact.
Sticky top nav with section tabs and scrollspy; mobile menu sheet.
No animation yet except CSS hover states. All text comes from content/en — none hard-coded.
Team items must show the "Team project" label; metrics must show their caveats.
Verify in a real browser at 390px, 768px and 1440px. Fix overflow and spacing problems.
Report what you checked and attach screenshots if your tools allow.
```

## Fase 3: Halaman studi kasus (±2 jam)

```
Phase 3. Generate /projects/<slug>/ pages from content/en/case-studies/*.md (frontmatter + markdown,
tables rendered as styled tables). Layout: back link, title, context line, role, stack tags, body at
68ch, links at the end. Add metadata and Open Graph per page. Verify build and render each page.
```

## Fase 4: Gerak (±3–4 jam)

```
Phase 4. Implement the motion spec in DESIGN.md section 7, items 1–10, and nothing else:
intro overlay, hero entrance, verify-trace card, live clock, Lenis (desktop fine pointer only),
stacked research cards, screenshot belt, timeline line, blur-to-clear leadership, section reveals.
Every effect must be off under prefers-reduced-motion with content fully visible.
The intro must never hide or delay the page content and must be skippable.
Check: no layout shift on load, no horizontal scroll at 390px, smooth 60fps scrolling on desktop.
Report anything you could not verify.
```

## Fase 5: Bahasa Indonesia (±2–3 jam, termasuk menerjemahkan)

```
Phase 5. Translate every remaining file in content/en/ into content/id/ (projects, experience,
leadership, writing, case studies). Keep numbers, names and technical terms identical; use natural
Indonesian, not word-for-word translation. Then enable the /id/ routes and the EN/ID toggle
(toggle keeps the user on the same section/page). Set <html lang> correctly per route.
List any sentence where you were unsure of the meaning.
```

## Fase 6: QA sebelum dikirim (±1 jam)

```
Phase 6. Final QA:
- npm run build passes (including the TBD check) with no warnings you can fix.
- Lighthouse mobile on / and one case study page; report scores, fix the top issues.
- Keyboard-only walkthrough: every link and button reachable, focus visible.
- Every external link opens and is correct; mailto works; /cv.pdf downloads.
- Search the built output for phone numbers, the word "TBD", teammate names and internal server names.
Report results honestly, separating verified checks from assumptions.
```

---

## Setelah web live

- Rapikan README repo yang ditautkan (kg-agent, skripsi, Ruang Topik): satu kalimat tujuan, cara
  menjalankan, hasil utama beserta caveat, dan screenshot. Bawa repo-nya ke chat ini kalau ingin saya bantu.
- Pastikan riwayat git repo kg-agent bersih dari kredensial lama sebelum repo itu dibuat publik.
