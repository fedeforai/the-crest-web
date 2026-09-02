# Trail Scout Bead Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add enter / presence / reconnaissance motion to the existing ranks trail: a gold bead rides the rope, the solid line stays on narrative progress, the current seal breathes, locked selection is a dashed gaze ring.

**Architecture:** Pure helpers live in `assets/trail-geometry.js` (Node-testable). `assets/trail.js` builds nodes once, wraps the track contents in a `.trail-spine` so bead and line scroll with the seals, and sets pixel `left`/`width` from seal centers. CSS owns 0.7s enter, 0.4s bead travel, breath loop, panel fade, and reduced-motion. Rank COPY strings do not change.

**Tech Stack:** Static HTML/CSS/JS, brand tokens in `assets/tokens.css`, Node built-in test runner (`node --test`). No new libraries.

**Spec:** `docs/superpowers/specs/2026-09-02-trail-scout-bead-design.md`

---

## File map

| File | Role |
|------|------|
| `assets/trail-geometry.js` | Pure helpers: `progressIndex`, `lineFromCenters`, `beadOpacity` |
| `test/trail-geometry.test.js` | Node tests for those helpers |
| `assets/style-guild.css` | Bead, breath, gaze, panel fade, spine, motion timing |
| `assets/trail.js` | Build once, layout, IntersectionObserver enter, click without rebuild |
| `index.html`, `pathways.html`, `en/index.html`, `en/pathways.html`, `fr/index.html`, `fr/pathways.html` | Load `trail-geometry.js` before `trail.js` |
| Out of scope | COPY in `trail.js`, quiz, hero rank-invite, `*-preview.html`, August cordata rings |

Do not restyle seals into rings. Do not add a dashed scout *line* (approach B). Do not stagger-light seals on enter.

---

### Task 1: Geometry helpers (TDD)

**Files:**
- Create: `assets/trail-geometry.js`
- Create: `test/trail-geometry.test.js`

- [ ] **Step 1: Write the failing tests**

Create `test/trail-geometry.test.js`:

```js
var test = require('node:test');
var assert = require('node:assert/strict');
var geo = require('../assets/trail-geometry.js');

var RANKS = [
  { id: 0, state: 'done' },
  { id: 1, state: 'done' },
  { id: 2, state: 'current' },
  { id: 3, state: 'locked' },
  { id: 4, state: 'locked' }
];

test('progressIndex is the current rank id', function () {
  assert.equal(geo.progressIndex(RANKS), 2);
});

test('lineFromCenters spans first seal to current seal', function () {
  var line = geo.lineFromCenters([20, 60, 100, 140, 180], 2);
  assert.equal(line.left, 20);
  assert.equal(line.width, 80);
});

test('beadOpacity is 0.7 only when scouting a locked rank', function () {
  assert.equal(geo.beadOpacity('locked'), 0.7);
  assert.equal(geo.beadOpacity('done'), 1);
  assert.equal(geo.beadOpacity('current'), 1);
});
```

- [ ] **Step 2: Run tests and confirm they fail**

Run:

```bash
node --test test/trail-geometry.test.js
```

Expected: FAIL with `Cannot find module` or `progressIndex is not a function`.

- [ ] **Step 3: Implement helpers**

Create `assets/trail-geometry.js`:

```js
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CrestTrailGeometry = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  function progressIndex(ranks) {
    var i;
    for (i = 0; i < ranks.length; i++) {
      if (ranks[i].state === 'current') return ranks[i].id;
    }
    return 0;
  }

  function lineFromCenters(centers, index) {
    var left = centers[0];
    var right = centers[index];
    return { left: left, width: right - left };
  }

  function beadOpacity(state) {
    return state === 'locked' ? 0.7 : 1;
  }

  return {
    progressIndex: progressIndex,
    lineFromCenters: lineFromCenters,
    beadOpacity: beadOpacity
  };
});
```

- [ ] **Step 4: Run tests and confirm they pass**

Run:

```bash
node --test test/trail-geometry.test.js
```

Expected: `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add assets/trail-geometry.js test/trail-geometry.test.js
git commit -m "$(cat <<'EOF'
test: add trail geometry helpers for scout-bead motion

EOF
)"
```

---

### Task 2: Load geometry on trail pages

**Files:**
- Modify: `index.html` (script near `assets/trail.js`)
- Modify: `pathways.html` (same)
- Modify: `en/index.html`, `en/pathways.html` (`../assets/`)
- Modify: `fr/index.html`, `fr/pathways.html` (`../assets/`)

- [ ] **Step 1: Insert the script tag before trail.js**

In `index.html` and `pathways.html`, replace:

```html
<script src="assets/trail.js"></script>
```

with:

```html
<script src="assets/trail-geometry.js"></script>
<script src="assets/trail.js"></script>
```

In `en/index.html`, `en/pathways.html`, `fr/index.html`, `fr/pathways.html`, replace:

```html
<script src="../assets/trail.js"></script>
```

with:

```html
<script src="../assets/trail-geometry.js"></script>
<script src="../assets/trail.js"></script>
```

Do not touch `*-preview.html`.

- [ ] **Step 2: Confirm six pages load both scripts**

Run:

```bash
rg -n "trail-geometry\\.js" index.html pathways.html en/index.html en/pathways.html fr/index.html fr/pathways.html
```

Expected: one match per file, on the line immediately before `trail.js`.

- [ ] **Step 3: Commit**

```bash
git add index.html pathways.html en/index.html en/pathways.html fr/index.html fr/pathways.html
git commit -m "$(cat <<'EOF'
chore: load trail geometry helper before trail.js

EOF
)"
```

---

### Task 3: CSS — bead, breath, gaze, spine, panel

**Files:**
- Modify: `assets/style-guild.css` (block starting at `.trail`, ~lines 242–415)

- [ ] **Step 1: Replace the trail motion-related rules**

Keep existing seal colors, labels, detail panel chrome, and light-theme text/seal rules. Apply these surgical edits.

**3a.** After `.trail-track{ ... }` add spine + bead. Change `.trail-line-fg` default width to `0` and gold line to use `--color-gold` (token already aliases `--summit-blue` to gold; keep `var(--summit-blue)` if you prefer zero palette drift). Enable 0.7s width/left only when `.is-motion` is present.

Replace:

```css
.trail-track{
  position:relative;
  padding:0 10px;
  margin-bottom:8px;
  min-height:118px;
}
.trail-line-bg, .trail-line-fg{
  position:absolute; left:10px; right:10px; top:23px;
  height:1px;
}
.trail-line-bg{ background:var(--border); }
.trail-line-fg{
  background:var(--summit-blue);
  width:50%;
  transition:none;
}
html.js .trail.is-ready .trail-line-fg{
  transition:width .5s cubic-bezier(0.16,1,0.3,1);
}
.trail-nodes{
  position:relative; z-index:2;
  display:flex; justify-content:space-between;
}
```

with:

```css
.trail-track{
  position:relative;
  padding:0 10px;
  margin-bottom:8px;
  min-height:118px;
}
.trail-spine{
  position:relative;
  min-height:118px;
}
.trail-line-bg, .trail-line-fg{
  position:absolute; left:0; right:0; top:23px;
  height:1px;
}
.trail-line-bg{ background:var(--border); }
.trail-line-fg{
  background:var(--summit-blue);
  width:0;
  right:auto;
  transition:none;
}
.trail-bead{
  position:absolute;
  top:18px;
  left:0;
  width:11px;
  height:11px;
  margin-left:-5px;
  border-radius:50%;
  background:var(--summit-blue);
  z-index:3;
  pointer-events:none;
  opacity:0;
  box-shadow:0 0 8px color-mix(in srgb, var(--summit-blue) 55%, transparent);
  transition:none;
}
html.js .trail.is-ready .trail-bead{ opacity:1; }
html.js .trail.is-motion .trail-line-fg{
  transition:left .7s cubic-bezier(0.22,1,0.36,1), width .7s cubic-bezier(0.22,1,0.36,1);
}
html.js .trail.is-motion .trail-bead{
  transition:left .7s cubic-bezier(0.22,1,0.36,1), opacity .3s ease;
}
html.js .trail.is-motion.is-clicking .trail-line-fg{
  transition:none;
}
html.js .trail.is-motion.is-clicking .trail-bead{
  transition:left .4s cubic-bezier(0.22,1,0.36,1), opacity .3s ease;
}
.trail-nodes{
  position:relative; z-index:2;
  display:flex; justify-content:space-between;
}
```

**3b.** Make `.trail-seal` `position:relative`. Add breath on current, gaze on locked+selected, split the existing selected outline.

Replace:

```css
.trail-seal{
  width:46px; height:46px; border-radius:50%;
  border:0.5px solid var(--border);
  background:var(--canvas);
  display:flex; align-items:center; justify-content:center;
  transition:border-color .2s ease, background .2s ease;
}
```

with:

```css
.trail-seal{
  width:46px; height:46px; border-radius:50%;
  border:0.5px solid var(--border);
  background:var(--canvas);
  display:flex; align-items:center; justify-content:center;
  position:relative;
  transition:border-color .2s ease, background .2s ease;
}
.trail-node.is-current .trail-seal::before{
  content:'';
  position:absolute;
  inset:-5px;
  border-radius:50%;
  border:1px solid color-mix(in srgb, var(--color-gold) 70%, transparent);
  pointer-events:none;
  opacity:0;
}
html.js .trail.is-ready .trail-node.is-current .trail-seal::before{
  opacity:.75;
  animation:trail-breath 2.6s ease-in-out infinite;
}
@keyframes trail-breath{
  0%,100%{ transform:scale(1); opacity:.4; }
  50%{ transform:scale(1.12); opacity:.9; }
}
.trail-node.is-locked[aria-selected="true"] .trail-seal::after{
  content:'';
  position:absolute;
  inset:-5px;
  border-radius:50%;
  border:1px dashed color-mix(in srgb, var(--color-gold) 65%, transparent);
  pointer-events:none;
}
```

Replace:

```css
.trail-node[aria-selected="true"] .trail-seal{ box-shadow:none; outline:1px solid var(--color-gold); outline-offset:3px; }
```

with:

```css
.trail-node[aria-selected="true"]:not(.is-locked) .trail-seal{
  box-shadow:none; outline:1px solid var(--color-gold); outline-offset:3px;
}
.trail-node.is-locked[aria-selected="true"] .trail-seal{
  outline:none;
}
```

Keyboard focus stays on the global `button:focus-visible` rule (~line 1459). Do not remove that.

**3c.** Panel fade (JS sets opacity; CSS times it):

After `.trail-detail{ ... }` opening block, add:

```css
html.js .trail.is-motion .trail-detail{
  transition:opacity .2s ease;
}
```

**3d.** Mobile: spine grows with nodes; bead/line stay inside it. In the existing `@media (max-width:760px)` trail block, add/replace:

```css
  .trail-spine{ min-height:108px; width:max-content; min-width:100%; }
  .trail-bead{ top:25px; }
  .trail-line-bg, .trail-line-fg{
    display:block;
    left:0; right:auto; top:30px;
  }
```

Keep the existing `.trail-track` overflow-x, node width, and detail stacking rules.

**3e.** Reduced motion: global `*{ transition:none !important; }` already kills line/bead/panel transitions. Kill the breath animation. After the `@keyframes trail-breath` block add:

```css
@media (prefers-reduced-motion: reduce){
  .trail-node.is-current .trail-seal::before{
    animation:none;
    opacity:.75;
    transform:none;
  }
}
```

Light theme: bead/line already use `--summit-blue`, which is `--color-gold-on-parchment` under `html[data-theme="light"]`. Keep the existing light-theme trail overrides.

- [ ] **Step 2: Commit**

```bash
git add assets/style-guild.css
git commit -m "$(cat <<'EOF'
style: add trail bead, breath halo, and locked gaze ring

EOF
)"
```

---

### Task 4: trail.js — build once, layout, enter, click

**Files:**
- Modify: `assets/trail.js` from `var nodesEl` to end of IIFE (do **not** edit the `COPY` object)

- [ ] **Step 1: Replace the runtime below `var RANKS`**

Delete everything from `var nodesEl = document.getElementById('trailNodes');` through the closing `})();` and replace with:

```js
  var RANKS = COPY[lang].ranks;
  var geo = typeof CrestTrailGeometry !== 'undefined' ? CrestTrailGeometry : null;
  var nodesEl = document.getElementById('trailNodes');
  var detailEl = document.getElementById('trailDetail');
  var fgEl = document.getElementById('trailFg');
  var trailRoot = nodesEl && nodesEl.closest('.trail');
  var trackEl = nodesEl && nodesEl.closest('.trail-track');
  if (!nodesEl || !detailEl || !fgEl || !trackEl || !geo) return;

  var progressIndex = geo.progressIndex(RANKS);
  var selectedIndex = progressIndex;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nodesBuilt = false;
  var beadEl = null;
  var enterPlayed = false;

  function makeShield(){
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 20 23');
    svg.setAttribute('aria-hidden', 'true');
    var p1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p1.setAttribute('class', 'seal-shield');
    p1.setAttribute('d', 'M10 1L18 4.2V10.5C18 15.5 14.7 19.7 10 21.5C5.3 19.7 2 15.5 2 10.5V4.2L10 1Z');
    p1.setAttribute('stroke-width', '1.3');
    var p2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p2.setAttribute('class', 'seal-mark');
    p2.setAttribute('d', 'M10 5.5V16.5M6.5 9H13.5');
    p2.setAttribute('stroke-width', '1.1');
    svg.appendChild(p1); svg.appendChild(p2);
    return svg;
  }

  function clear(el){ while (el.firstChild) el.removeChild(el.firstChild); }

  function el(tag, attrs, children){
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function(k){
      if (k === 'className') node.className = attrs[k];
      else if (k === 'text') node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function(c){ if (c) node.appendChild(c); });
    return node;
  }

  function ensureSpine(){
    if (trackEl.querySelector('.trail-spine')) return trackEl.querySelector('.trail-spine');
    var spine = el('div', { className: 'trail-spine' });
    var bg = trackEl.querySelector('.trail-line-bg');
    trackEl.insertBefore(spine, bg || nodesEl);
    if (bg) spine.appendChild(bg);
    spine.appendChild(fgEl);
    spine.appendChild(nodesEl);
    return spine;
  }

  function ensureBead(spine){
    if (beadEl) return beadEl;
    beadEl = el('span', {
      id: 'trailBead',
      className: 'trail-bead',
      'aria-hidden': 'true'
    });
    spine.appendChild(beadEl);
    return beadEl;
  }

  function buildNodes(){
    if (nodesBuilt) return;
    RANKS.forEach(function(r){
      var btn = el('button', {
        type: 'button',
        className: 'trail-node is-' + r.state,
        role: 'tab',
        'aria-selected': 'false',
        'aria-controls': 'trailDetail',
        id: 'trail-tab-' + r.id
      });
      var seal = el('span', { className: 'trail-seal' });
      seal.appendChild(makeShield());
      btn.appendChild(seal);
      btn.appendChild(el('span', { className: 'label', text: r.label }));
      btn.appendChild(el('span', { className: 'rank-tag', text: r.tag }));
      btn.addEventListener('click', function(){ showDetail(r.id); });
      nodesEl.appendChild(btn);
    });
    nodesBuilt = true;
  }

  function sealCenters(){
    var spine = trackEl.querySelector('.trail-spine');
    var spineRect = spine.getBoundingClientRect();
    var buttons = nodesEl.querySelectorAll('.trail-node');
    var centers = [];
    buttons.forEach(function(btn){
      var seal = btn.querySelector('.trail-seal');
      var r = seal.getBoundingClientRect();
      centers.push((r.left + r.width / 2) - spineRect.left);
    });
    return centers;
  }

  function layoutLineAndBead(beadIndex, lineIndex){
    var centers = sealCenters();
    if (centers.length < 2) return;
    var line = geo.lineFromCenters(centers, lineIndex);
    fgEl.style.right = 'auto';
    fgEl.style.left = line.left + 'px';
    fgEl.style.width = line.width + 'px';
    beadEl.style.left = centers[beadIndex] + 'px';
    if (enterPlayed) {
      var rank = RANKS.find(function(x){ return x.id === beadIndex; });
      beadEl.style.opacity = String(geo.beadOpacity(rank.state));
    }
  }

  function setSelected(id){
    selectedIndex = id;
    var buttons = nodesEl.querySelectorAll('.trail-node');
    buttons.forEach(function(btn, i){
      btn.setAttribute('aria-selected', String(i === id));
    });
  }

  function fillDetail(id){
    var r = RANKS.find(function(x){ return x.id === id; });
    clear(detailEl);
    detailEl.setAttribute('aria-labelledby', 'trail-tab-' + id);
    var head = el('div', { className: 'trail-detail-head' });
    var left = el('div');
    left.appendChild(el('span', { className: 'eyebrow', text: r.tag }));
    left.appendChild(el('h3', { text: r.title }));
    head.appendChild(left);
    head.appendChild(el('span', { className: 'state state-active', text: r.stateLabel }));
    detailEl.appendChild(head);
    detailEl.appendChild(el('p', { className: 'desc', text: r.desc }));
    var ul = el('ul');
    r.items.forEach(function(i){ ul.appendChild(el('li', { text: i })); });
    detailEl.appendChild(ul);
  }

  function showDetail(id, options){
    options = options || {};
    setSelected(id);
    if (trailRoot && options.scroll !== false) trailRoot.classList.add('is-clicking');
    layoutLineAndBead(id, progressIndex);

    if (reduced || options.scroll === false) {
      detailEl.style.opacity = '1';
      fillDetail(id);
    } else {
      detailEl.style.opacity = '0';
      fillDetail(id);
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          detailEl.style.opacity = '1';
        });
      });
    }

    if (options.scroll === false) return;
    var activeBtn = document.getElementById('trail-tab-' + id);
    if (activeBtn && typeof activeBtn.scrollIntoView === 'function') {
      try {
        activeBtn.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
      } catch (e) {
        activeBtn.scrollIntoView(false);
      }
    }
  }

  function playEnter(){
    if (enterPlayed) return;
    enterPlayed = true;
    layoutLineAndBead(0, 0);
    if (trailRoot) trailRoot.classList.add('is-ready');
    if (reduced) {
      layoutLineAndBead(progressIndex, progressIndex);
      return;
    }
    trailRoot.classList.add('is-motion');
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        layoutLineAndBead(progressIndex, progressIndex);
      });
    });
  }

  var spine = ensureSpine();
  ensureBead(spine);
  buildNodes();
  showDetail(progressIndex, { scroll: false });
  layoutLineAndBead(0, 0);

  if (reduced || !('IntersectionObserver' in window)) {
    playEnter();
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          playEnter();
          io.disconnect();
        }
      });
    }, { threshold: 0.2 });
    io.observe(trailRoot);
  }

  var resizeTimer = null;
  function relayout(){
    layoutLineAndBead(selectedIndex, progressIndex);
  }
  window.addEventListener('resize', function(){
    if (resizeTimer) clearTimeout(resizeTimer);
    if (trailRoot) trailRoot.classList.remove('is-motion');
    relayout();
    resizeTimer = setTimeout(function(){
      if (!reduced && enterPlayed && trailRoot) trailRoot.classList.add('is-motion');
    }, 150);
  });
  trackEl.addEventListener('scroll', relayout, { passive: true });

  var params = new URLSearchParams(window.location.search);
  var intent = params.get('intent');
  if (intent && document.getElementById('intentField')) {
    document.getElementById('intentField').value = intent;
  }
})();
```

Keep the `COPY` object and `var lang = ...` / `var RANKS = COPY[lang].ranks;` exactly as they are today. The snippet above repeats `var RANKS` — when pasting, leave a **single** `var RANKS = COPY[lang].ranks;` then continue from `var geo`.

- [ ] **Step 2: Confirm COPY was not edited**

Run:

```bash
git diff -U0 assets/trail.js | rg -n "Punto di partenza|Starting point|Point de départ|Nessun cliente|No clients|Aucun client" || true
```

Expected: no COPY strings in the diff (helpers/runtime only).

- [ ] **Step 3: Re-run geometry tests**

```bash
node --test test/trail-geometry.test.js
```

Expected: `3 passed`.

- [ ] **Step 4: Commit**

```bash
git add assets/trail.js
git commit -m "$(cat <<'EOF'
feat: animate trail with scout bead without rebuilding nodes

EOF
)"
```

---

### Task 5: Browser verification

**Files:** none unless a bugfix is required.

Serve the site the same way this repo is usually previewed (local static server or `npx serve`). Do not use `*-preview.html`.

- [ ] **Step 1: Pathways desktop (IT)**

Open `/pathways.html`.

- Wait until the trail is in view: gold line draws from In Scuola to Fondamenta (~0.7s); bead rides with it; then Fondamenta breathes.
- Click **In Scuola**: bead travels back on the solid line at full opacity; no dashed ring; panel fades to In Scuola copy; line stays at Fondamenta.
- Click **Vetta**: bead goes forward at ~70% opacity; dashed ring on Vetta; breath stays on Fondamenta; line does not grow; panel shows Vetta.
- Click **Fondamenta**: bead returns, dashed ring gone.
- Click Vetta then Cordata quickly: bead ends on Cordata, no queued hops.

- [ ] **Step 2: Home (IT)**

Open `/index.html`. Scroll to `#metodo`. Enter must **not** have already finished in the footer before the trail is visible. Line + bead play when the section intersects.

- [ ] **Step 3: One locale**

Open `/en/pathways.html` or `/fr/pathways.html`. Same motion; English/French COPY in the panel.

- [ ] **Step 4: Mobile width (~390px)**

Narrow the viewport. Horizontal-scroll the track. Bead stays on the selected seal (it must scroll with the spine, not stick to the viewport). Tap Vetta; dashed gaze visible.

- [ ] **Step 5: Light theme**

Toggle theme. No second enter animation. Bead/line still gold-on-parchment tokens. Breath still on Fondamenta.

- [ ] **Step 6: Reduced motion**

Emulate `prefers-reduced-motion: reduce`. Reload. Line and bead already at Fondamenta; no breath loop; panel swaps instantly; gaze ring still appears on locked selection.

- [ ] **Step 7: Keyboard**

Tab to a rank button. `:focus-visible` outline present. Enter/Space activates (native button). Panel matches the selected tab.

- [ ] **Step 8: No-JS sanity**

Disable JS or open the static rank block above the trail. It remains visible. Bead is absent. That is correct.

If any step fails, fix in `assets/trail.js` / `assets/style-guild.css` only, then re-run the failing step. Commit the fix:

```bash
git add assets/trail.js assets/style-guild.css
git commit -m "$(cat <<'EOF'
fix: keep trail bead aligned with seals on scroll and reduced motion

EOF
)"
```

(Adjust the message to the actual bug.)

---

## Spec coverage

| Spec requirement | Task |
|------------------|------|
| Enter 0.7s line + bead to current, once, on viewport | 3 + 4 `playEnter` / IO |
| Breath halo on `is-current` only | 3 `::before` |
| Locked click: line still, bead 0.7, dashed gaze, panel fade parallel | 3 + 4 `showDetail` |
| Done/current click: bead full opacity, solid outline, no gaze | 3 + 4 |
| Rapid clicks: last index wins (CSS transition to latest left, no queue) | 4 `layoutLineAndBead` |
| Nodes built once | 4 `buildNodes` |
| Line from first seal center to current seal center | 1 `lineFromCenters` + 4 layout |
| `#trailBead` in track/spine, aria-hidden | 4 `ensureBead` |
| Reduced motion | 3 animation none + 4 skip motion class |
| Mobile bead vs nodes row | 3 spine + 4 scroll listener |
| Theme toggle no replay | 4 `enterPlayed` |
| COPY unchanged | 4 step 2 |
| Out: quiz, hero, preview, rings | file map |
| Home + pathways IT + locale, keyboard | 5 |

---

## Notes for the implementer

- `html.js` is already set by the inline head script. Motion transitions are gated on `html.js .trail.is-motion`.
- After enter, add `.is-clicking` on first `showDetail` without `scroll: false` so bead travel is 0.4s instead of 0.7s. Initial `showDetail(progressIndex, { scroll: false })` must not add `.is-clicking`.
- Do not set inline `beadEl.style.opacity` until `enterPlayed` is true, or CSS `opacity:0` until `.is-ready` loses to the inline style and the bead shows too early.
- Global reduced-motion already sets `transition:none !important` on all elements; still add `is-motion` only when motion is allowed so enter can run for everyone else.
- Do not implement the August cordata ring restyle.
