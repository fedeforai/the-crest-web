# Hero Rank Invite Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the cryptic hero-right “5 ranks / Roman seals” glass card on `index.html` with a quiz-first rank invite card that communicates path + CTA clearly.

**Architecture:** Static markup swap inside existing `.glass-card` plus new CSS block (`.rank-invite*`) in `style-guild.css`. Keep glass chrome and hero layout; remove unused `.glass-stat-head` / `.mini-ladder` production CSS. No JS changes.

**Tech Stack:** Static HTML, `assets/style-guild.css`, existing brand tokens (`--color-gold`, `--text-on-onyx`, Cormorant/Inter).

**Spec:** `docs/superpowers/specs/2026-08-08-hero-rank-invite-design.md`  
**Mockup reference:** `docs/superpowers/mockups/2026-08-08-hero-rank-invite.html`

---

## File map

| File | Role |
|------|------|
| `index.html` | Replace `.hero-v2-side` > `.glass-card` inner markup |
| `assets/style-guild.css` | Add `.rank-invite` styles; delete unused `.glass-stat-head` / `.mini-ladder` / `.ml-*` |
| Out of scope | `*-preview.html`, quiz/trail JS, token hex, left hero CTAs |

---

### Task 1: Replace hero side markup

**Files:**
- Modify: `index.html` (block ~143–168)

- [ ] **Step 1: Confirm current block still matches**

Run:

```bash
rg -n "glass-stat-head|mini-ladder|ml-seal" index.html
```

Expected: matches only inside `.hero-v2-side` glass card.

- [ ] **Step 2: Replace glass-card contents**

Replace the entire inner content of:

```html
<div class="hero-v2-side opacity-0 animate-fade-up" style="animation-delay:0.95s;">
  <div class="glass-card">
    …old content…
  </div>
</div>
```

with:

```html
      <div class="hero-v2-side opacity-0 animate-fade-up" style="animation-delay:0.95s;">
        <div class="glass-card rank-invite">
          <span class="eyebrow">Percorso a 5 ranghi</span>
          <h2 class="rank-invite-title">Scopri il tuo rango</h2>
          <p class="rank-invite-lede">Due minuti per capire dove sei oggi — e cosa ti manca per la Vetta.</p>

          <div class="rank-poles" aria-hidden="true">
            <div class="rank-pole">
              <div class="rank-pole-name"><span class="rank-dot"></span>In Scuola</div>
              <div class="rank-pole-micro">partenza</div>
            </div>
            <div class="rank-track"><i></i></div>
            <div class="rank-pole rank-pole-end">
              <div class="rank-pole-name"><span class="rank-dot is-filled"></span>Vetta</div>
              <div class="rank-pole-micro">obiettivo</div>
            </div>
          </div>

          <p class="rank-names">In Scuola · Base Camp · Fondamenta · Cordata · Vetta</p>
          <a class="btn-hero btn-hero-primary rank-invite-cta" href="quiz.html" data-track="cta_click">Fai il quiz</a>
        </div>
      </div>
```

Notes:
- Poles are decorative (`aria-hidden`) because title, lede, and `.rank-names` already convey the path (avoids duplicate SR noise).
- Use `h2` for the card title (hero already has one `h1` on the left).

- [ ] **Step 3: Verify old markup gone and new markup present**

Run:

```bash
rg -n "glass-stat-head|ml-seal|Scopri il tuo rango con il quiz" index.html
rg -n "rank-invite|Scopri il tuo rango|Fai il quiz" index.html
```

Expected: first command → no matches (or only unrelated). Second → matches in hero side.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
Hero: replace rank widget with quiz-first invite markup

EOF
)"
```

---

### Task 2: Add rank-invite CSS and remove dead hero-widget CSS

**Files:**
- Modify: `assets/style-guild.css` (~lines 387–408 for removals; insert new block after `.glass-card`)

- [ ] **Step 1: Delete unused production rules**

Remove these rules from `assets/style-guild.css` (they only served the old hero widget; `card-cta` stays — still used elsewhere):

```css
.glass-stat-head{ … }
.glass-stat-head .icon{ … }
.glass-stat-head .icon svg{ … }
.glass-stat-head .num{ … }
.glass-stat-head .cap{ … }

.mini-ladder{ … }
.ml-row{ … }
.ml-seal{ … }
.ml-caption{ … }
```

Keep `.glass-card` and `.hero-v2-*` layout rules.

- [ ] **Step 2: Insert rank-invite styles after `.glass-card` block**

```css
/* ---------- hero rank invite (quiz-first) ---------- */
.rank-invite .eyebrow{ margin-bottom:10px; }
.rank-invite-title{
  font-family:var(--font-display);
  font-size:clamp(1.6rem, 2.4vw, 2rem);
  font-weight:600;
  line-height:1.15;
  margin:0 0 10px;
  color:var(--color-parchment);
}
.rank-invite-lede{
  margin:0 0 22px;
  font-size:14px;
  line-height:1.55;
  color:var(--text-dim);
}
.rank-poles{
  display:grid;
  grid-template-columns:1fr auto 1fr;
  align-items:center;
  gap:10px;
  margin-bottom:14px;
}
.rank-pole{ display:flex; flex-direction:column; gap:4px; min-width:0; }
.rank-pole-end{ text-align:right; align-items:flex-end; }
.rank-pole-name{
  display:flex; align-items:center; gap:8px;
  font-size:14px; font-weight:600; color:var(--color-parchment);
}
.rank-pole-end .rank-pole-name{ flex-direction:row-reverse; }
.rank-dot{
  width:8px; height:8px; border-radius:50%;
  background:var(--color-gold); flex:none;
}
.rank-dot.is-filled{
  box-shadow:0 0 0 3px color-mix(in srgb, var(--color-gold) 22%, transparent);
}
.rank-pole-micro{
  font-size:10px; letter-spacing:0.1em; text-transform:uppercase;
  color:var(--text-dim2); padding-left:16px;
}
.rank-pole-end .rank-pole-micro{ padding-left:0; padding-right:16px; }
.rank-track{
  width:48px; height:2px; position:relative;
  background:color-mix(in srgb, var(--color-gold) 20%, transparent);
  overflow:hidden; border-radius:1px;
}
.rank-track i{
  display:block; height:100%; width:100%;
  background:var(--color-gold);
  transform-origin:left center;
  animation:rank-track-draw 0.7s ease-out both;
}
@keyframes rank-track-draw{
  from{ transform:scaleX(0); }
  to{ transform:scaleX(1); }
}
@media (prefers-reduced-motion: reduce){
  .rank-track i{ animation:none; }
}
.rank-names{
  margin:0 0 22px;
  font-size:11px; line-height:1.6; color:var(--text-dim2);
}
.rank-invite-cta{
  width:100%;
  justify-content:center;
  text-align:center;
}
```

- [ ] **Step 3: Sanity-check CSS selectors exist only as intended**

Run:

```bash
rg -n "glass-stat-head|mini-ladder|ml-seal|rank-invite|rank-track-draw" assets/style-guild.css
```

Expected: no `glass-stat-head` / `mini-ladder` / `ml-seal`; yes `rank-invite` and `rank-track-draw`.

- [ ] **Step 4: Commit**

```bash
git add assets/style-guild.css
git commit -m "$(cat <<'EOF'
Style: rank-invite card CSS; drop unused hero seal widget

EOF
)"
```

---

### Task 3: Visual + a11y verification

**Files:** none (verify only)

- [ ] **Step 1: Open local homepage**

Run:

```bash
open /Users/federiconovello/Desktop/the-crest-web/index.html
```

Check hero right card:
- Title “Scopri il tuo rango”
- Poles In Scuola / Vetta with micro-labels
- Thin name row of 5 ranks
- CTA “Fai il quiz” links to `quiz.html`
- No giant “5”, no Roman seals

- [ ] **Step 2: Resize / mobile check**

Narrow viewport (~390px): card stacks under hero copy, full width, CTA still tappable, names wrap without overflow.

- [ ] **Step 3: Contrast spot-check (same method as prior a11y audit)**

Run:

```bash
python3 << 'PY'
def rel_lum(hex):
    h = hex.lstrip('#')
    r,g,b = [int(h[i:i+2],16)/255 for i in (0,2,4)]
    def f(c):
        return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055)**2.4
    R,G,B = f(r),f(g),f(b)
    return 0.2126*R + 0.7152*G + 0.0722*B

def contrast(a,b):
    L1, L2 = rel_lum(a), rel_lum(b)
    hi, lo = max(L1,L2), min(L1,L2)
    return (hi+0.05)/(lo+0.05)

pairs = [
  ('title parchment on onyx', '#F3EFE6', '#0B0B0C', 4.5),
  ('gold accent on onyx', '#C6A15B', '#0B0B0C', 3.0),
]
for name, fg, bg, need in pairs:
    r = contrast(fg, bg)
    print(f'{name}: {r:.2f}  need>={need}  {"PASS" if r>=need else "FAIL"}')
PY
```

Expected: both PASS.

- [ ] **Step 4: Optional push (only if user asked)**

Do not push unless explicitly requested. If requested:

```bash
git push origin main
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Quiz-first title + lede + CTA | Task 1 |
| Poles In Scuola → Vetta + micros | Task 1–2 |
| Secondary 5 names, no Romans | Task 1 |
| Keep glass-card chrome | Task 1–2 |
| Track draw + reduced-motion | Task 2 |
| Remove old widget markup/CSS | Task 1–2 |
| Desktop/mobile + contrast verify | Task 3 |
| Out of scope previews/quiz JS | — (not touched) |
