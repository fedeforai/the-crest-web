# Go-live checklist — thecrestguild.com

Sito live: **https://www.thecrestguild.com**  
Progetto Vercel da tenere: **`the-crest-web-sbun`** (team frostdesk)

Formspree già nel codice: candidatura `mbgrdkbz`, quiz-lead `mjybgozj`.  
GA4: ancora da creare (incolla il `G-…` in chat).

---

## 1. Formspree (tu — 2 min)

1. Apri https://formspree.io → progetto **THE CREST** → **Project settings**
2. **Restrict to Domain:** `thecrestguild.com`  
   (se il campo accetta un solo host, usa `thecrestguild.com`; il sito fa redirect apex→www, ma i form partono da `www` — se i submit falliscono, prova `www.thecrestguild.com` o chiedi a Formspree supporto multi-domain)
3. Notifiche → `fed@armoflow.com`
4. Test da **https://www.thecrestguild.com/pathways#candidati** (una candidatura)
5. Test quiz → email gate su **https://www.thecrestguild.com/quiz**
6. Controlla inbox Formspree + email

Segna fatto: [ ]

---

## 2. GA4 (tu — 10 min) → poi passa l’ID a Cursor

1. https://analytics.google.com → **Admin** → **Create property**
2. Nome `The Crest Guild` · Italy · EUR
3. Stream **Web** · URL `https://www.thecrestguild.com`
4. Copia **Measurement ID** `G-…`
5. **Incollalo in chat Cursor** (io lo metto in `assets/config.js` e pusho)

Dopo il redeploy Vercel:
- **Admin → Events** → marca `lead_submit` come **key event**
- Apri il sito e controlla **Reports → Realtime** (o DebugView)

Segna fatto: [ ] property creata · [ ] `G-…` inviato in chat

---

## 3. Vercel cleanup (tu — 3 min)

In https://vercel.com/frostdesk:

| Progetto | Azione |
|----------|--------|
| `the-crest-web-sbun` | **TENERE** (ha `thecrestguild.com` + `www`) |
| `the-crest-web` | Archivia o elimina |
| `the-crest-web-zfv6` | Archivia o elimina |

Segna fatto: [ ]

---

## 4. Io (Cursor) — dopo il tuo `G-…`

- Scrivo `GA4_MEASUREMENT_ID` in `assets/config.js`
- Commit + push `main` → redeploy automatico
- Smoke check che gtag si carichi sul live
