# Trail cordata restyle — design

**Date:** 2026-08-08  
**Status:** approved for planning  
**Scope:** Restyle the ranks trail (`#metodo` / pathways) from “product timeline + identical shields” to a **cordata (rope + rings)** metaphor, with clearer graphics and short motion — **without changing the five ranks or their copy**.

## Problem

The current trail reads as a generic UI timeline: five identical crest seals, a flat progress bar, and a detail card that updates with little feedback. Hierarchy between done / current / locked is weak; the alpine “cordata” idea in the brand copy is not visible in the component.

## Goal

Visitors should feel **a rope team advancing toward Vetta**: rings on a tensed rope, the current rank as the climber guiding the next step, and the detail panel responding clearly to selection. Content (titles, tags, state labels, descriptions, checklist items) stays identical.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Pain | Graphics + dynamics together (D) |
| Depth | Remake metaphor, keep ranks + copy (C) |
| Metaphor | Cordata — linear nodes + dashed/solid rope; current = “guida il passo” (B) |
| Approach | Corda + anelli (approach 2) |
| Detail panel | Keep glass/card chrome; content unchanged; short transition only |

## Visual design

### Rope (track)

- Horizontal rope behind/through the nodes.
- **Completed span** (from start through selected/current progress): solid gold (`--color-gold`) line.
- **Remaining span**: dashed gold at reduced opacity.
- Replaces (or restyles) today’s `.trail-line-bg` / `.trail-line-fg` product bar so it reads as rope, not a progress meter widget.

### Rings (nodes)

Replace identical shield seals with **rings** (circular nodes):

| State | Look |
|-------|------|
| `done` | Closed ring — gold border, filled/slate interior |
| `current` | Larger ring, gold border, soft gold halo (“guides the step”) |
| `locked` | Empty ring, dashed/muted border, lower opacity |

Labels under nodes: keep existing `label` + `rank-tag` text from `trail.js` COPY. No new marketing copy required; optional tiny “guida” on current is **out** unless it can be CSS-only aria-hidden decoration — default: **no extra label**, rely on size/halo + panel badge.

### Detail panel

- Same structure: eyebrow/tag, `h3` title, `.state` badge, description, two-column checklist.
- Same glass-style container.
- No content or badge text changes (state colors still follow a11y pattern: parchment label + colored dot).

## Motion / dynamics

1. **Enter:** solid rope draws to the illustrative progress point (~0.6–0.8s) once when the trail is shown.
2. **Click node:** solid rope animates to the newly selected step (~0.35s); ring states update (selected node gets current visual treatment for the session selection — see note below).
3. **Hover:** light tension cue on the rope segment toward that node (opacity/thickness), no layout shift.
4. **Current ring:** soft halo pulse (slow loop); disabled under `prefers-reduced-motion: reduce`.
5. **Panel:** on rank change, short fade (and optional ~12px horizontal nudge), ~250ms total; reduced-motion → instant swap.

**Selection vs narrative state:** Rank data still has narrative `state` (`done` / `current` / `locked`) for the illustrative “Fondamenta in corso” story. Selection (`aria-selected`) can enlarge/outline the focused ring and drive the panel without rewriting COPY. Rope fill should follow **selected index** (how far along the cordata the visitor is inspecting), while narrative `is-done` / `is-current` / `is-locked` classes continue to reflect the story states from data.

## Technical scope

**In**
- `assets/style-guild.css` — restyle `.trail`, `.trail-track`, lines, `.trail-node`, `.trail-seal` → ring styles, detail panel transition classes, reduced-motion.
- `assets/trail.js` — swap shield SVG for ring markup (or empty ring styled in CSS); set rope progress from selected id; add panel transition class hooks; **do not edit COPY strings**.
- Pages already wiring the trail (`index.html`, `pathways.html`, and localized mirrors if they share the same `trail.js` / markup IDs).

**Out**
- Changing rank names, descriptions, checklist items, or narrative states in COPY
- Hero rank-invite card
- `*-preview.html`
- Unrelated dirty working-tree work (theme/lang, etc.)

## Accessibility

- Keep tablist / tab / tabpanel roles and keyboard behavior.
- Rings must not rely on color alone: size + border style (solid vs dashed) + labels.
- Decorative rope can be `aria-hidden`; names remain in buttons.
- Honor `prefers-reduced-motion`.
- `#rankStaticContent` remains the no-JS fallback (unchanged content).

## Acceptance

- [ ] Trail reads as rope + rings, not identical crest seals on a flat UI bar
- [ ] Done / current / locked visually distinct without reading only color
- [ ] Click updates panel + rope position with short motion
- [ ] Copy and five ranks unchanged
- [ ] Desktop + mobile (horizontal scroll) usable
- [ ] Reduced-motion: no pulse / no draw; content still correct

## Markup direction (illustrative)

```html
<button class="trail-node is-current" role="tab" …>
  <span class="trail-ring" aria-hidden="true"></span>
  <span class="label">Fondamenta</span>
  <span class="rank-tag">Rango II</span>
</button>
```

Rope: keep `#trailFg` / bg elements but style as solid vs dashed segments, or one dashed track + fg solid width driven by JS (current pattern), restyled to feel like rope.
