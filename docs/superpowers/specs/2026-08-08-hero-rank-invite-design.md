# Hero rank invite card — design

**Date:** 2026-08-08  
**Status:** approved for planning  
**Scope:** replace the right-hand hero glass card on `index.html` so it communicates a clear quiz-first invitation, not an abstract “5 ranks” widget.

## Problem

Current `.hero-v2-side` glass card shows a large “5”, Roman seals (`0 I II III IV`), and a dense name chain. Visitors do not understand what it means or what to do next. It fails the “one job” test for the hero aside.

## Goal

The card must answer: **“Where am I on this path — and how do I find out?”** Primary action: take the quiz. Secondary context: school → summit path with five named ranks (no Roman numerals).

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Job of the card | Quiz-first personal invite (option D) |
| Path visual | “You start here → Vetta” poles (option C) |
| Rank list | Two poles + thin secondary line of 5 names (no Romans) |
| Title | **Scopri il tuo rango** |
| Approach | Quiz-first card (approach 1) |
| Container | Keep existing `.glass-card` chrome |

## Content hierarchy (top → bottom)

1. **Eyebrow:** `Percorso a 5 ranghi`
2. **Title:** `Scopri il tuo rango`
3. **Support:** `Due minuti per capire dove sei oggi — e cosa ti manca per la Vetta.`
4. **Poles visual:**
   - Left: gold dot + **In Scuola** + micro-label `partenza`
   - Center: horizontal track / draw line
   - Right: **Vetta** + micro-label `obiettivo`
5. **Secondary names:** `In Scuola · Base Camp · Fondamenta · Cordata · Vetta` (~11–12px, dim)
6. **CTA:** `Fai il quiz` → `quiz.html` with `data-track="cta_click"`

### Remove

- Giant `5` numeral and shield icon block (`.glass-stat-head`)
- Roman seal row (`.mini-ladder` / `.ml-seal`)
- Old caption with arrow chain and old card-cta wording (“Scopri il tuo rango con il quiz”)

## Visual / motion

- Tokens only: `--text-on-onyx` / parchment for body; `--color-gold` accents on onyx; dim text for name row. No gold-as-text on parchment.
- CTA: full-width control using existing hero primary / reinforced card-cta patterns (readable label + optional `→`).
- Motion: keep aside fade-up; one-shot track draw (~0.6s) on enter; CTA hover = gold border per design system.
- `prefers-reduced-motion: reduce` → no track draw; static poles still visible.
- Meaning not color-only: poles and CTA are explicit text.

## Technical scope

**In**
- `index.html` — replace markup inside `.hero-v2-side` > `.glass-card`
- `assets/style-guild.css` — add `.rank-invite` (or equivalent) styles for poles, names, CTA; delete unused `.glass-stat-head` / `.mini-ladder` / `.ml-*` rules if nothing else references them in production CSS

**Out**
- `pathways.html`, quiz logic, `trail.js`
- `*-preview.html`
- Brand token hex changes
- Left hero copy / primary CTAs (unless a one-line CTA label sync is needed for consistency — default: leave left CTAs as-is)

## Acceptance

- [ ] At a glance, card communicates “find your rank via quiz”
- [ ] Five rank names readable without Romans
- [ ] CTA works and tracks `cta_click`
- [ ] Desktop + mobile hero layout intact
- [ ] Contrast AA for small text on onyx; reduced-motion respected

## Markup sketch

```html
<div class="glass-card rank-invite">
  <span class="eyebrow">Percorso a 5 ranghi</span>
  <h2 class="rank-invite-title">Scopri il tuo rango</h2>
  <p class="rank-invite-lede">Due minuti per capire dove sei oggi — e cosa ti manca per la Vetta.</p>
  <div class="rank-poles" aria-hidden="true">…</div>
  <p class="rank-names">In Scuola · Base Camp · Fondamenta · Cordata · Vetta</p>
  <a class="btn-hero btn-hero-primary rank-invite-cta" href="quiz.html" data-track="cta_click">Fai il quiz</a>
</div>
```

Poles may use `aria-hidden="true"` if the title/lede/names already convey the path; otherwise expose a short `aria-label` on the poles region. Prefer one clear accessible story, not duplicate noise.
