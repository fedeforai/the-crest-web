# Quality merge checklist (2 minutes)

Preview URL from the PR, not localhost. Network on (fonts + GA4).

## Scores (mobile + desktop, 5 marketing pages)

- [ ] Performance ≥95
- [ ] Accessibility 100
- [ ] Best Practices 100
- [ ] SEO 100

Pages: `/` `/pathways` `/quiz` `/about` `/ecosystem` and `/en/` `/fr/` equivalents.

## Contrast / outline / chrome

- [ ] No heading-order skip (h1→h2→h3, footer h2 is fine)
- [ ] `.eyebrow` on trail-detail (dark) ≥4.5:1
- [ ] Light theme body and dim2 on elevated ≥4.5:1
- [ ] Quiz: cookie bar does not cover Avanti / Suivant / Next (test with empty `localStorage` key `crest_consent_v1`)
- [ ] Header CTA: Pathways = Candidati/Apply/Candidater; other pages = Entra/Join/Rejoindre

## Motion

- [ ] Home intro once per tab session; Salta / Escape works on desktop
- [ ] Fast scroll: reveal sections visible (no stuck opacity 0)

## Forms (once per PR that touches forms.js / quiz.js)

- [ ] Pathways `#candidati` success + error (Formspree)
- [ ] Quiz email gate success + invalid email
- [ ] Console: zero errors on the 5 pages
