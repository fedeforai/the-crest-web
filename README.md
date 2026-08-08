# The Crest Guild — sito web

Sito statico (HTML/CSS/JS) per The Crest Guild. Host tipico: GitHub Pages
(`fedeforai.github.io/the-crest-web`).

## Pagine live

- `index.html` — homepage
- `pathways.html` — ranghi, servizi (`#revisione` `#affiancamento` `#maestria`), form candidatura
- `quiz.html` — quiz di posizionamento + gate email
- `about.html` — mission / vision / founder
- `ecosystem.html` — famiglia ArmoFlow

I file `*-preview.html` hanno `noindex` e non sono destinati alla navigazione pubblica.

## Setup lead + analytics

Config pubblica in [`assets/config.js`](assets/config.js) (nessun secret):

1. **Formspree** (progetto THE CREST) — collegato
   - Candidatura: `mbgrdkbz` → Pathways
   - Quiz lead: `mjybgozj` → Quiz gate email
   - Restrict to Domain: `fedeforai.github.io`
   - **Non** commitare il Deploy Key Formspree
2. **GA4**
   - Incolla il Measurement ID in `GA4_MEASUREMENT_ID` (sostituisci `G-XXXXXXXX`)
   - Eventi: `quiz_start`, `quiz_complete`, `cta_click`, `lead_submit`
3. **Email footer**
   - `CONTACT_EMAIL`: già impostata a `fed@armoflow.com`

Guida dettagliata passo-passo: [`docs/SETUP-FORMSPREE-GA4.md`](docs/SETUP-FORMSPREE-GA4.md)

Finché `GA4_MEASUREMENT_ID` resta `G-XXXXXXXX`, analytics resta disattivato.

## Script condivisi

- `assets/config.js` — ID pubblici
- `assets/analytics.js` — GA4 + `window.crestTrack`
- `assets/forms.js` — Formspree candidatura + footer contact
- `assets/quiz.js` — quiz + lead gate
- `assets/trail.js` — UI ranghi
- `assets/site.js` — reveal, mobile nav, external links
- `assets/style-guild.css` — design system

## Deploy

Hosting ufficiale: **Vercel** + dominio **thecrestguild.com** (DNS su Squarespace).

Guida: [`docs/SETUP-VERCEL-DOMAIN.md`](docs/SETUP-VERCEL-DOMAIN.md)

GitHub Pages (`fedeforai.github.io/the-crest-web`) può restare come mirror o essere disabilitato.

## Accessibilità (baseline Wave 0+1)

Skip-link, `<main>`, landmark nav, focus-visible, contrasti testo alzati,
label sui form, quiz con `radiogroup`/`progressbar`, link esterni con
`noopener noreferrer` + annuncio nuova scheda.
