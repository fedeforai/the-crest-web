# Setup Formspree + GA4 — The Crest Guild

Guida operativa per collegare lead capture e analytics al sito statico
(`https://www.thecrestguild.com`).

Config da aggiornare: [`assets/config.js`](../assets/config.js)

---

## 1. Formspree — crea i 2 form

Apri il progetto **THE CREST** su [formspree.io](https://formspree.io).

### Impostazioni progetto (una volta)

1. Vai su **Project settings**
2. **Restrict to Domain:** sul piano free spesso **non è modificabile** — ok.
   I form funzionano comunque da `www.thecrestguild.com`. Quando passerai di piano,
   imposta `thecrestguild.com` / `www.thecrestguild.com`.
3. **Non** mettere il Deploy Key nel codice / README / chat

### Form A — `candidatura`

| Campo | Valore |
|--------|--------|
| Nome form | `candidatura` |
| Uso | Pagina Pathways → sezione “Candidati” |
| Endpoint | `https://formspree.io/f/{FORM_ID}` |

**Campi che invia il sito**

| `name` HTML | Tipo | Obbligatorio | Note |
|-------------|------|--------------|------|
| `name` | text | sì | Nome |
| `email` | email | sì | Reply-to automatico se abilitato in Formspree |
| `situazione` | select | sì | In Scuola / Base Camp / Fondamenta / Cordata / Vetta / Non so |
| `message` | textarea | no | Messaggio libero |
| `rank` | hidden | no | Prefill da quiz (`?rank=`) |
| `intent` | hidden | no | `revisione` / `affiancamento` / `maestria` |
| `_subject` | hidden | — | Oggetto mail: `Candidatura The Crest Guild` |
| `_gotcha` | honeypot | — | Anti-spam (non mostrato) |

**Consigli Formspree**

- Notifications → email a `fed@armoflow.com`
- Abilita reCAPTCHA / spam filtering se disponibile sul piano
- Copia il **Form ID** pubblico (stringa tipo `xyzabcde`, non il Project ID numerico)

### Form B — `quiz-lead`

| Campo | Valore |
|--------|--------|
| Nome form | `quiz-lead` |
| Uso | Gate email dopo le 5 domande del quiz |
| Endpoint | `https://formspree.io/f/{FORM_ID}` |

**Campi che invia il sito**

| `name` HTML | Tipo | Obbligatorio | Note |
|-------------|------|--------------|------|
| `email` | email | sì | |
| `name` | text | no | |
| `rank` | hidden | sì | Es. `Fondamenta` |
| `goal` | hidden | sì | `chiarezza` / `indipendenza` / `mentore` |
| `score` | hidden | sì | 0–4 |
| `_subject` | hidden | — | `Quiz lead The Crest Guild` |
| `_gotcha` | honeypot | — | Anti-spam |

**Consigli**

- Notifications → stessa inbox `fed@armoflow.com`
- Eventualmente tag/label diverso da `candidatura` per filtrare in inbox

### Form ID già in produzione

| Form | Form ID | Endpoint |
|------|---------|----------|
| candidatura | `mbgrdkbz` | `https://formspree.io/f/mbgrdkbz` |
| quiz-lead | `mjybgozj` | `https://formspree.io/f/mjybgozj` |

### Checklist Formspree

- [ ] Form `candidatura` creato
- [ ] Form `quiz-lead` creato
- [ ] Domain restrict = `fedeforai.github.io`
- [ ] Notifiche a `fed@armoflow.com`
- [ ] Form ID A e Form ID B copiati

---

## 2. Attaccare i form al progetto

Apri [`assets/config.js`](../assets/config.js) e sostituisci i placeholder:

```js
window.CREST_CONFIG = {
  FORMSPREE_CANDIDATURA: 'INCOLLA_QUI_ID_CANDIDATURA',  // era REPLACE_CANDIDATURA
  FORMSPREE_QUIZ_LEAD: 'INCOLLA_QUI_ID_QUIZ_LEAD',      // era REPLACE_QUIZ_LEAD
  GA4_MEASUREMENT_ID: 'G-5M9YNQHV9T',
  CONTACT_EMAIL: 'fed@armoflow.com'
};
```

**Cosa fa il codice già presente**

| File | Ruolo |
|------|--------|
| `assets/forms.js` | Submit candidatura → `FORMSPREE_CANDIDATURA` |
| `assets/quiz.js` | Gate email quiz → `FORMSPREE_QUIZ_LEAD` |
| `pathways.html` | Form `#candidaturaForm` |
| `quiz.html` | Form generato a runtime dopo le domande |

**Test locale / Pages**

1. Commit + push (o apri i file via server locale)
2. Vai su `pathways.html#candidati` → invia una candidatura di prova
3. Controlla inbox Formspree + email `fed@armoflow.com`
4. Completa il quiz → lascia email → verifica submission `quiz-lead`
5. Se vedi *“Form non configurato…”* = ID ancora `REPLACE_*`

**Nota:** finché gli ID sono placeholder, il quiz mostra comunque il risultato dopo il tentativo di submit (fallback di sviluppo). Con ID reali, il risultato appare solo dopo submit OK.

---

## 3. GA4 — passo passo

### A. Crea property

1. Vai su [Google Analytics](https://analytics.google.com)
2. **Admin** (ingranaggio) → **Create property**
3. Nome: `The Crest Guild` (o simile)
4. Time zone: `Italy`, currency: `EUR`
5. Crea anche un **Data stream** → **Web**
6. URL sito: `https://fedeforai.github.io/the-crest-web`
7. Nome stream: `Crest Guild Pages`
8. Copia il **Measurement ID** (`G-5M9YNQHV9T` in produzione)

### B. Collega al sito

In `assets/config.js`:

```js
GA4_MEASUREMENT_ID: 'G-5M9YNQHV9T',
```

Salva, commit, push. Il file `assets/analytics.js` carica gtag solo se l’ID **non** contiene `XXXXXXXX`.

### C. Eventi già tracciati dal sito

| Evento | Quando |
|--------|--------|
| `page_view` | Automatico GA4 |
| `quiz_start` | Prima domanda quiz |
| `quiz_complete` | Fine domande (params: `rank`, `goal`, `score`) |
| `cta_click` | Click su elementi `data-track` |
| `lead_submit` | Submit Formspree OK (`form_name`: `candidatura` o `quiz-lead`) |

### D. Verifica

1. Apri il sito in una finestra / profilo senza adblock aggressivo
2. GA4 → **Admin** → Data stream → **DebugView**  
   oppure estensione [Google Analytics Debugger](https://chrome.google.com/webstore)
3. Naviga home → quiz → completa → submit email
4. Dovresti vedere `quiz_start`, `quiz_complete`, `lead_submit`

### E. (Consigliato) Conversioni

In GA4 → **Admin** → **Events** → marca come conversion:

- `lead_submit`
- (opzionale) `quiz_complete`

---

## 4. Email footer

Già impostata (o da confermare) in config:

```js
CONTACT_EMAIL: 'fed@armoflow.com'
```

Il footer su tutte le pagine live mostra quel mailto. Se lasciassi stringa vuota, il link andrebbe al form candidatura.

---

## 5. Ordine consigliato (15–20 min)

1. Formspree: 2 form + domain + notifiche a `fed@armoflow.com`
2. Incolla i 2 Form ID in `config.js`
3. Test candidatura + quiz lead
4. Crea GA4 + stream → incolla `G-…` in `config.js`
5. Push su `main` → verifica su GitHub Pages + DebugView

Quando hai i 2 Form ID e il `G-…`, incollali qui in chat e li inserisco io in `config.js` + push se vuoi.
