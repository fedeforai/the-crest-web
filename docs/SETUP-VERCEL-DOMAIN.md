# Deploy Vercel + dominio thecrestguild.com (Squarespace)

Il sito è HTML statico. Hosting target: **Vercel**. DNS del dominio: **Squarespace**.

## Panoramica

```text
GitHub (fedeforai/the-crest-web)
        │
        ▼  (Git integration o vercel deploy)
     Vercel project
        │
        ▼  DNS
  thecrestguild.com  ← Squarespace Domains
```

GA4 e Formspree domain-restrict vanno aggiornati **dopo** che il dominio punta a Vercel.

---

## Parte A — Cosa faccio io / cosa fai tu

| Step | Chi |
|------|-----|
| Commit + push del sito aggiornato su GitHub | Io (se me lo chiedi) o tu |
| Login Vercel + crea progetto collegato al repo | **Tu** (browser / CLI) |
| Aggiungi dominio `thecrestguild.com` in Vercel | **Tu** |
| Imposta DNS su Squarespace come dice Vercel | **Tu** |
| Aggiorna Formspree Restrict Domain | **Tu** |
| Incolla GA4 `G-…` in `assets/config.js` | Io quando me lo dai |

CLI locale: al momento `vercel whoami` fallisce (token scaduto) → serve `vercel login`.

---

## Parte B — Vercel (progetto)

### Opzione consigliata: GitHub → Vercel (auto-deploy)

1. Vai su https://vercel.com e accedi (account **fedeforai** / ArmoFlow).
2. **Add New… → Project**.
3. Importa `fedeforai/the-crest-web` (autorizza GitHub se chiesto).
4. Framework Preset: **Other** (sito statico).
5. Root Directory: `.` (default).
6. Build Command: lascia **vuoto**.
7. Output Directory: lascia **vuoto** (serve i file dalla root).
8. **Deploy**.

Otterrai un URL tipo `the-crest-web-….vercel.app`. Verifica che home/quiz/pathways funzionino.

### Opzione CLI (dopo `vercel login`)

```bash
cd the-crest-web
vercel login
vercel link          # crea/collega progetto
vercel --prod
```

Nel repo c’è già [`vercel.json`](../vercel.json) con `cleanUrls` (es. `/quiz` oltre a `/quiz.html`).

---

## Parte C — Dominio Squarespace → Vercel

1. In Vercel: Project → **Settings → Domains**.
2. Aggiungi:
   - `thecrestguild.com`
   - `www.thecrestguild.com` (consigliato; redirect www→apex o viceversa come preferisci)
3. Vercel mostra i record DNS richiesti. Di solito (verifica sempre la UI Vercel):

| Tipo | Host | Valore |
|------|------|--------|
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

4. Su **Squarespace Domains** → il dominio → **DNS settings** / **DNS records**:
   - Rimuovi record Squarespace in conflitto su `@` / `www` (parking, vecchi CNAME).
   - Aggiungi i record che Vercel ti indica **esattamente**.
5. Attendi propagazione (spesso 5–30 min, a volte fino a 48h).
6. In Vercel lo stato dominio passa a **Valid** + HTTPS automatico.

**Attenzione Squarespace:** se il dominio è “connected to a Squarespace site”, potresti doverlo **disconnect** dal sito website e usarlo solo come DNS/registrar, altrimenti Squarespace tiene i record.

---

## Parte D — Dopo il go-live

### Formspree
Project settings → **Restrict to Domain**:
- `thecrestguild.com`
- (opzionale anche `www.thecrestguild.com` se Formspree lo richiede separato)

I Form ID restano `mbgrdkbz` (candidatura) e `mjybgozj` (quiz-lead).

### GA4
Quando crei lo stream Web, URL:
`https://thecrestguild.com`

Poi passa il `G-…` e lo mettiamo in `assets/config.js`.

### GitHub Pages
Puoi lasciare Pages attivo come mirror, oppure disabilitarlo in Settings → Pages per evitare due URL pubblici. Host ufficiale = Vercel + `thecrestguild.com`.

---

## Checklist

- [ ] Codice Wave 0+1 pushato su `main`
- [ ] Progetto Vercel collegato al repo
- [ ] Preview `*.vercel.app` OK
- [ ] Domini aggiunti in Vercel
- [ ] DNS Squarespace aggiornato
- [ ] HTTPS Valid su `thecrestguild.com`
- [ ] Formspree domain restrict aggiornato
- [ ] GA4 creato con URL corretto + ID in config

Quando hai fatto login Vercel (o mi dici “committa e pusha”), il passo successivo è push + collegamento dominio.


---

## Stato attuale (go-live)

- Dominio live: https://www.thecrestguild.com (apex → www)
- Progetto Vercel ufficiale: **`the-crest-web-sbun`** (team frostdesk)
- Progetti duplicati da archiviare: `the-crest-web`, `the-crest-web-zfv6`
- Checklist operativa: [`GO-LIVE-CHECKLIST.md`](GO-LIVE-CHECKLIST.md)
