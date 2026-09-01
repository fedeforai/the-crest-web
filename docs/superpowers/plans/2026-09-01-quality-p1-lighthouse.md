# Quality Phase 1 — Isolated Lighthouse Fixes

> **For agentic workers:** Execute with executing-plans. Phase 1 only. Do not start Phase 2 (copy/structure) in this branch.

**Goal:** Close the six measured defects so Accessibilità and Best Practices can reach 100, and the quiz CTA is never covered by the cookie banner.

**Architecture:** Token/CSS/markup patches only. No visual identity change (palette, type, motion language stay). Same fixes on IT + EN + FR production pages. Preview HTML (`*-preview.html`) is out of scope.

**Tech Stack:** Static HTML/CSS/JS, Vercel from git.

**Spec:** user quality plan “Da baseline solido a 95+ verificato” (2026-09-01).

---

## File map

| File | Change |
|------|--------|
| `assets/tokens.css` | Remove Google Fonts `@import`; bump dark `--text-on-dark-dim2` / `--text-dim2` mix 58% → 64% |
| `assets/style-guild.css` | Toast consent banner + `--consent-offset`; heading selectors; crest height auto already |
| `assets/analytics.js` | `consent-open` body class + measured `--consent-offset` |
| `index.html`, `en/index.html`, `fr/index.html` | Font links; intro `sessionStorage`; headings; img 28×37 |
| Other production `*.html` (5 pages × 3 locales + legal) | Font links; footer `h5`→`h2`; img 28×37; page heading levels |

---

### Task 1: Cookie banner — toast + reserved space

- Compact bottom-left toast on desktop; full-width compact bar on small screens.
- When visible: `body.consent-open` and `--consent-offset` from measured banner box.
- Clear offset on accept/reject/hide.

### Task 2: `.eyebrow` contrast on elevated surface

- `#a29f98` on `#3a3833` is 4.43:1. Neutral-400 is worse (3.93:1).
- Bump dark dim2 mix to 64% (~4.9:1) — slight lighten, same token family.

### Task 3: Sequential headings

- Footer `h5` → `h2` (visual size via existing footer CSS).
- Home outcome `h4` → `h3`.
- Pathways giant-row `h4` → `h3`.
- About mission/vision `h3` → `h2`; value-card `h4` → `h3`.
- Quiz noscript/static `h3` → `h2`.

### Task 4: Crest aspect-ratio

- `crest-mark-dark.png` is 655×867. Markup `28×34` (0.82) → `28×37` (0.76).
- CSS already `height:auto` on `.brand-crest`.

### Task 5: Google Fonts out of nested `@import`

- `preconnect` + stylesheet `<link>` in `<head>` of every production page that loads `style-guild.css`.
- Delete `@import` from `tokens.css`.

### Task 6: Intro once per session

- `sessionStorage` key `crest_intro_seen` on IT/EN/FR home.
- Skip replay if seen, reduced-motion, or narrow (existing skip).

---

## Out of this branch

Phases 2–5: `docs/superpowers/plans/2026-09-01-quality-p2-p5.md`. Live Lighthouse on a Vercel preview (not localhost) is the merge gate.
