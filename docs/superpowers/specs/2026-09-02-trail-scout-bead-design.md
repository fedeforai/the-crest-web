# Trail scout bead — design

**Date:** 2026-09-02  
**Status:** approved, awaiting implementation plan  
**Scope:** Motion for the existing ranks trail (home `#metodo` / `pathways`, IT/EN/FR). Keep current seals, copy, and gold progress line. Add a living scout bead.

**Does not replace** `2026-08-08-trail-cordata-design.md`. That spec restyles seals into rings and a dashed/solid rope. This spec is motion-only on today’s chrome. Do not implement rings or dual-rope from the August spec.

## Problem

The trail is almost static. On load, `.trail-line-fg` animates width once from done-count. On click, `showDetail` destroys and rebuilds every node, so CSS transitions never run. The gold line does not follow selection. The current rank has no presence. The panel swaps with no transition.

## Goal

One motion idea across three moments: **enter, presence, reconnaissance**. A gold bead rides the rope. The solid line is always narrative progress (it does not lie). Looking at a locked rank is scouting, not claiming.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Sequence | Full story: enter + presence + click (D) |
| Character | Living — someone climbs (C) |
| Locked click | Scout, do not conquer (C) |
| Approach | Scout bead on current chrome (A) |
| Halo | Stays on narrative `is-current`, never follows gaze |
| Panel | Short fade in parallel with the bead (~200ms), does not wait for arrival |
| Graphics | Keep crest seals, labels, tags, detail copy |

## Choreography

### 1. Enter (~0.7s, once)

When the trail is ready and visible (existing `.is-ready`; prefer viewport so off-screen home trail does not play in the footer):

1. Solid gold line draws to **narrative progress** (from first node through `is-current`, inclusive).
2. Bead appears at the first node and rides that draw to `is-current`.
3. After arrival, the breath halo on `is-current` starts.

Do not stagger-light the seals. They already show `is-done` / `is-current` / `is-locked`.

### 2. Presence (idle loop)

- Thin gold ring around the `is-current` seal (Fondamenta in the illustrative story).
- Slow scale/opacity breath (~2.4–2.8s). No game-like glow.
- Bead rests on `is-current` until the visitor clicks.

### 3. Reconnaissance (~0.4s)

Click a **locked** node:

- Solid line **does not move**.
- Bead travels to that node, opacity ~0.7.
- Dashed ring on the selected locked seal (“gaze”).
- Breath halo stays on `is-current`.
- Detail panel content swaps with a ~200ms opacity fade, in parallel (does not wait for the bead).

Click a **done** or **current** node:

- Bead travels on the solid line at full opacity (walking conquered ground, not scouting).
- No dashed gaze ring; keep the existing gold outline on `aria-selected`.
- Line still unchanged.
- Same panel fade.

Click back to `is-current`: bead returns, dashed gaze ring gone.

Rapid clicks: cancel in-flight bead motion; go to the latest `selectedIndex`. No animation queue.

## Visual pieces

| Piece | Role | Notes |
|-------|------|--------|
| Crest seals | Rank buttons | Unchanged SVG and copy |
| `.trail-line-fg` | Narrative progress | Width from `progressIndex` only |
| Bead `#trailBead` | Actor | `aria-hidden`. Not clickable. Full opacity on solid line, ~0.7 when scouting |
| Breath halo | “You are here” in the story | CSS on `.trail-node.is-current .trail-seal`, not on selection |
| Gaze ring | Looking at a locked rank | Dashed ring on `.trail-node.is-locked[aria-selected="true"]` |
| Selection outline | Keyboard/a11y | Done/current selected: existing solid outline. Locked selected: dashed gaze ring only. Keyboard always adds `:focus-visible` outline so focus is never color-only |

Hover: no extra rope tension. The bead is the only traveler.

Light theme: same pieces, existing gold-on-parchment tokens.

## Data

JS holds three values. Rank COPY and narrative `state` (`done` / `current` / `locked`) stay as they are.

| Name | Meaning | Drives |
|------|---------|--------|
| `progressIndex` | Index of the rank with `state === "current"` | Line width, breath halo (via existing `is-current` class) |
| `selectedIndex` | Rank being inspected | Bead target, `aria-selected`, gaze ring, panel content |
| `beadX` | Horizontal position as % of the node row | Bead `left` or `transform`, aligned to seal centers |

Line width formula: distance from first seal center to `progressIndex` seal center, not “done count / (n-1)”. That way the line meets the current node, not a midpoint between done and next.

Initial `selectedIndex` = `progressIndex` (today: Fondamenta / id 2).

## Architecture

### DOM

Build the five `.trail-node` buttons **once**. `showDetail` must not `clear(nodesEl)`.

Add `#trailBead` inside `.trail-track` (sibling of the lines and `#trailNodes`). Halo and gaze are CSS, not extra markup, unless a dedicated span is simpler for reduced-motion hooks.

### Motion implementation

CSS owns timing:

- Enter: `width` on `.trail-line-fg` and bead position, `cubic-bezier(0.22, 1, 0.36, 1)` ~0.7s.
- Click: bead position ~0.4s, same easing.
- Breath: infinite keyframes on current seal, disabled under reduced motion.
- Panel: set opacity to 0, swap inner HTML, fade opacity to 1 over ~200ms. Reduced motion: instant swap.

JS sets custom properties (e.g. `--bead-x`, `--line-pct`) from seal positions. Recalculate on resize and on mobile horizontal scroll of `.trail-track` so the bead stays on the selected seal center.

### Files

**In:** `assets/trail.js`, `assets/style-guild.css`. Markup IDs already on `index.html`, `pathways.html`, and `en/` `fr/` mirrors if they share `trail.js`.

**Out:** rank COPY strings, quiz seals, hero rank-invite, `*-preview.html`, August cordata ring restyle.

### No-JS

Existing static rank block remains the fallback. Bead/halo/gaze require JS.

## Accessibility

- Keep `tablist` / `tab` / `tabpanel`, `aria-selected`, `aria-controls`, `aria-labelledby`.
- Bead, breath, and dashed gaze are `aria-hidden` (or purely decorative CSS).
- Rank name stays in the button (`label` + `rank-tag`).
- Locked vs open is not color-only: opacity, dashed gaze, and panel `stateLabel`.
- Keyboard: existing focus on tabs; selection updates panel and bead (instant if reduced motion).
- `prefers-reduced-motion: reduce`: line at final width, bead at selected seal, no breath, no panel fade, gaze ring still shown (it is state, not motion).

## Edge cases

- Mobile overflowing track: bead coordinates are relative to the nodes row, not the viewport.
- Theme toggle: no replay of enter; keep current bead/line state.
- Locale pages: same behavior; COPY already in `trail.js`.

## Test plan

- Home and Pathways, IT plus one of EN/FR.
- Desktop: enter, click a done rank, click Vetta (scout), return to Fondamenta.
- Mobile: swipe/scroll the track, click; bead stays on the seal.
- Light theme.
- `prefers-reduced-motion: reduce`.
- Keyboard: visible focus, panel matches selected tab.
- Rapid clicks: bead ends on the last selected rank.

## Success

A visitor can see three things without reading copy: **how far the guild story has come** (solid line + breath), **who is moving** (bead), **what they are only looking at** (bead off the solid line + dashed ring).
