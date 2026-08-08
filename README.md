# The Crest Guild — sito web

Sito statico (HTML/CSS/JS). Live: **https://www.thecrestguild.com**  
Host: Vercel (`the-crest-web-sbun`) · DNS: Squarespace.

## Pagine live

- `index.html` — homepage
- `pathways.html` — ranghi, servizi (`#revisione` `#affiancamento` `#maestria`), form candidatura
- `quiz.html` — quiz di posizionamento + gate email
- `about.html` — mission / vision / founder
- `ecosystem.html` — famiglia ArmoFlow

I file `*-preview.html` hanno `noindex` e non sono destinati alla navigazione pubblica.

## Setup lead + analytics

Config: [`assets/config.js`](assets/config.js)

1. **Formspree** — collegato
   - Candidatura: `mbgrdkbz` · Quiz lead: `mjybgozj`
   - Domain restrict: non disponibile sul piano free (ok)
2. **GA4** — attivo: `G-5M9YNQHV9T`
3. **Email footer:** `fed@armoflow.com`

Finché non vedi eventi in Realtime, fai hard refresh sul live e controlla adblock.

Checklist go-live: [`docs/GO-LIVE-CHECKLIST.md`](docs/GO-LIVE-CHECKLIST.md)  
Formspree/GA4: [`docs/SETUP-FORMSPREE-GA4.md`](docs/SETUP-FORMSPREE-GA4.md)  
Vercel/dominio: [`docs/SETUP-VERCEL-DOMAIN.md`](docs/SETUP-VERCEL-DOMAIN.md)

## Script condivisi

- `assets/config.js` — ID pubblici
- `assets/analytics.js` — GA4 + `window.crestTrack`
- `assets/forms.js` — Formspree candidatura + footer contact
- `assets/quiz.js` — quiz + lead gate
- `assets/trail.js` — UI ranghi
- `assets/site.js` — reveal, mobile nav, external links
- `assets/style-guild.css` — design system

## Deploy

Push su `main` → Vercel production su `the-crest-web-sbun`.
