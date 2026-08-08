# The Crest Guild — sito web (v0)

Prima bozza statica (HTML/CSS puro, nessuna build), pensata come punto di
partenza per il repo `the-crest-web`, che al momento è vuoto.

## Cosa c'è

- `index.html` — homepage
- `pathways.html` — pagina "I Ranghi" (equivalente della pagina `/pathways`
  di Season One usata come riferimento: stessa logica di progressione a
  tappe e di card di servizio, contenuti e identità visiva propri)
- `assets/style.css` — tutto lo stile, con design tokens in `:root`
  (colori, font, spaziature) facili da modificare in un punto solo

## Identità visiva scelta

- **Colori**: ink navy `#0B1220`, oro antico `#C7A24B`, pergamena `#F1EBDA`,
  verde foresta `#2F4538`, cremisi `#8B2E2E` (accento raro)
- **Font**: Fraunces (titoli, serif con carattere), Work Sans (testo),
  IBM Plex Mono (etichette/eyebrow, in stile "sigillo")
- **Motivo ricorrente**: uno scudo/crest disegnato in SVG, usato nell'header
  e come filigrana nell'hero — nessuna risorsa esterna o IP di terzi

Tutti i contenuti (nomi dei ranghi, testi, quote) sono **placeholder** da
sostituire con i contenuti reali della Gilda: settore preciso, tono di voce,
nomi effettivi dei servizi, email/contatti reali.

## Come portarlo nel repo GitHub

Il repo `fedeforai/the-crest-web` risulta vuoto, quindi puoi fare push diretto:

```bash
git clone https://github.com/fedeforai/the-crest-web.git
cp -r /percorso/di/questi/file/* the-crest-web/
cd the-crest-web
git add .
git commit -m "Prima bozza sito The Crest Guild"
git push origin main
```

## Deploy veloce (facoltativo)

Essendo HTML statico puro, si pubblica su Vercel/Netlify/GitHub Pages senza
alcun build step: basta puntare la root del repo.

## Prossimi passi consigliati

1. Contenuti reali: cosa fa esattamente la Gilda, per chi, nomi definitivi
   dei ranghi/servizi, prezzi se pubblici
2. Pagina "Chi siamo" / founder
3. Form di contatto funzionante (oggi i CTA puntano a `mailto:`)
4. Eventuale passaggio a Next.js se serve CMS, blog o area riservata membri
