#!/usr/bin/env python3
"""Apply IT tone chrome and generate en/ + fr/ marketing pages."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = ["index.html", "pathways.html", "about.html", "ecosystem.html", "quiz.html"]

THEME_SCRIPT = """<script>
(function(){try{var t=localStorage.getItem('crest_theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme','dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();
</script>
"""

HREFLANG = {
    "index.html": ("/", "/en/index.html", "/fr/index.html", "/index.html"),
    "pathways.html": ("/pathways.html", "/en/pathways.html", "/fr/pathways.html", "/pathways.html"),
    "about.html": ("/about.html", "/en/about.html", "/fr/about.html", "/about.html"),
    "ecosystem.html": ("/ecosystem.html", "/en/ecosystem.html", "/fr/ecosystem.html", "/ecosystem.html"),
    "quiz.html": ("/quiz.html", "/en/quiz.html", "/fr/quiz.html", "/quiz.html"),
}

# Canonical preferred paths (some pages used extensionless)
CANON = {
    "index.html": "https://www.thecrestguild.com/",
    "pathways.html": "https://www.thecrestguild.com/pathways",
    "about.html": "https://www.thecrestguild.com/about",
    "ecosystem.html": "https://www.thecrestguild.com/ecosystem",
    "quiz.html": "https://www.thecrestguild.com/quiz",
}


def hreflang_block(page: str) -> str:
    it, en, fr, xd = HREFLANG[page]
    base = "https://www.thecrestguild.com"
    return "\n".join(
        [
            f'<link rel="alternate" hreflang="it" href="{base}{it if page != "index.html" else "/"}">',
            f'<link rel="alternate" hreflang="en" href="{base}{en}">',
            f'<link rel="alternate" hreflang="fr" href="{base}{fr}">',
            f'<link rel="alternate" hreflang="x-default" href="{base}/">',
        ]
    )


def ensure_theme_script(html: str) -> str:
    if "crest_theme" in html:
        return html
    return html.replace(
        '<link rel="stylesheet" href="assets/style-guild.css">',
        THEME_SCRIPT + '<link rel="stylesheet" href="assets/style-guild.css">',
    ).replace(
        '<link rel="stylesheet" href="../assets/style-guild.css">',
        THEME_SCRIPT + '<link rel="stylesheet" href="../assets/style-guild.css">',
    )


def ensure_hreflang(html: str, page: str) -> str:
    if 'hreflang="en"' in html:
        return html
    block = hreflang_block(page)
    # insert after canonical if present
    m = re.search(r'<link rel="canonical"[^>]*>', html)
    if m:
        return html[: m.end()] + "\n" + block + html[m.end() :]
    return html.replace("</title>", "</title>\n" + block, 1)


def dual_crests(html: str, asset_prefix: str) -> str:
    white = f'{asset_prefix}img/crest-mark-white.png'
    dark = f'{asset_prefix}img/crest-mark-dark.png'
    # brand crest single -> dual
    html = re.sub(
        rf'<img class="brand-crest" src="{re.escape(asset_prefix)}img/crest-mark-white\.png"([^>]*)>',
        rf'<img class="brand-crest theme-dark-only" src="{white}"\1>'
        rf'\n      <img class="brand-crest theme-light-only" src="{dark}"\1>',
        html,
    )
    # footer brand single white
    html = re.sub(
        rf'(<div class="foot-brand">\s*)<img src="{re.escape(asset_prefix)}img/crest-mark-white\.png" alt="">',
        rf'\1<img class="theme-dark-only" src="{white}" alt="">\n          <img class="theme-light-only" src="{dark}" alt="">',
        html,
    )
    # eco self mark
    html = html.replace(
        f'<span class="mark"><img src="{asset_prefix}img/crest-mark-white.png" alt=""></span>',
        f'<span class="mark"><img class="theme-dark-only" src="{white}" alt=""><img class="theme-light-only" src="{dark}" alt=""></span>',
    )
    return html


def inject_nav_controls(html: str, page: str, lang: str, asset_prefix: str) -> str:
    """Replace nav-right + mobile-nav chrome with lang + theme controls."""
    # language hrefs relative to page location
    if lang == "it":
        links = {
            "it": page,
            "en": f"en/{page}",
            "fr": f"fr/{page}",
        }
        legal_prefix = ""
    else:
        links = {
            "it": f"../{page}",
            "en": page if lang == "en" else f"../en/{page}",
            "fr": page if lang == "fr" else f"../fr/{page}",
        }
        if lang == "en":
            links["fr"] = f"../fr/{page}"
        if lang == "fr":
            links["en"] = f"../en/{page}"
        legal_prefix = "../"

    def lang_switch(current: str, extra_class: str = "") -> str:
        cls = f'lang-switch {extra_class}'.strip()
        parts = []
        for code, href in (("it", links["it"]), ("en", links["en"]), ("fr", links["fr"])):
            cur = ' aria-current="true"' if code == current else ""
            parts.append(f'<a href="{href}"{cur} lang="{code}" hreflang="{code}">{code.upper()}</a>')
        return f'<div class="{cls}" role="navigation" aria-label="Language">\n        ' + "\n        ".join(parts) + "\n      </div>"

    theme_labels = {
        "it": ("Cambia tema chiaro o scuro", "Tema chiaro / scuro"),
        "en": ("Toggle light or dark theme", "Light / dark theme"),
        "fr": ("Basculer thème clair ou sombre", "Thème clair / sombre"),
    }
    aria, mobile_txt = theme_labels[lang]

    theme_btn = (
        f'<button type="button" class="theme-toggle" data-theme-toggle aria-label="{aria}" title="Theme">\n'
        f'        <span class="theme-toggle-sun" aria-hidden="true">☀</span>\n'
        f'        <span class="theme-toggle-moon" aria-hidden="true">☾</span>\n'
        f'      </button>'
    )
    theme_btn_mobile = (
        f'<button type="button" class="theme-toggle mn-theme" data-theme-toggle aria-label="{aria}">{mobile_txt}</button>'
    )

    # Replace or insert desktop lang switch + theme toggle
    html = re.sub(
        r'<div class="lang-switch"[^>]*>.*?</div>\s*',
        "",
        html,
        flags=re.S,
    )
    html = re.sub(
        r'<button type="button" class="theme-toggle"[^>]*>.*?</button>\s*',
        "",
        html,
        flags=re.S,
    )
    html = re.sub(
        r'(<div class="nav-right">\s*)',
        rf'\1{lang_switch(lang)}\n      {theme_btn}\n      ',
        html,
        count=1,
    )

    # Mobile: strip old, insert before mn-cta
    html = re.sub(r'<div class="lang-switch mn-lang"[^>]*>.*?</div>\s*', "", html, flags=re.S)
    html = re.sub(
        r'<button type="button" class="theme-toggle mn-theme"[^>]*>.*?</button>\s*',
        "",
        html,
        flags=re.S,
    )
    html = re.sub(
        r'(<a class="mn-cta"[^>]*>)',
        rf'{lang_switch(lang, "mn-lang")}\n  {theme_btn_mobile}\n  \1',
        html,
        count=1,
    )

    # Fix legal links for nested langs
    if lang != "it":
        for legal in ("privacy.html", "terms.html", "cookies.html", "security.html"):
            html = html.replace(f'href="{legal}"', f'href="{legal_prefix}{legal}"')
        # cookie policy in banner is JS; forms.js etc already ../assets

    return html


IT_REPLACEMENTS = [
    ("The Crest Guild — ", "The Crest Guild · "),
    ("The Crest Guild — ArmoFlow Ltd", "The Crest Guild · ArmoFlow Ltd"),
    ("© 2026 The Crest Guild — ArmoFlow Ltd", "© 2026 The Crest Guild · ArmoFlow Ltd"),
    ("© 2026 The Crest Guild · ArmoFlow Ltd", "© 2026 The Crest Guild · ArmoFlow Ltd"),
    (
        "Il percorso per maestri di sci che vogliono passare\n          dalla scuola all'indipendenza, un rango alla volta.",
        "Per maestri di sci che vogliono uscire dal solo\n          modello scuola, un rango alla volta.",
    ),
    (
        "Il percorso per maestri di sci che vogliono passare\n          dalla scuola all'indipendenza, un rango alla volta.",
        "Per maestri di sci che vogliono uscire dal solo\n          modello scuola, un rango alla volta.",
    ),
]

# Page-specific IT tone patches (applied if substring present)
IT_PAGE_PATCHES = {
    "pathways.html": [
        (
            "Non è una gara di velocità. <span class=\"accent\">È una gara di solidità</span> —\n      <span class=\"dim\">ogni rango che salti torna a chiederti il conto più avanti.</span>",
            "Non è una gara di velocità. <span class=\"accent\">È una gara di solidità</span>:\n      <span class=\"dim\">ogni rango che salti ti torna indietro più avanti.</span>",
        ),
        (
            "Per i primi ranghi bastano criteri oggettivi, verificabili da soli. Per l'ultimo\n        passo — diventare mentore — serve anche una validazione tra pari.",
            "Nei primi ranghi bastano criteri oggettivi che puoi verificare da solo. Per l'ultimo\n        passo, diventare mentore, serve anche una validazione tra pari.",
        ),
        (
            "Per il rango \"Vetta\" serve la conferma di un mentore della Gilda: il\n            rischio, a quel livello, è l'autoproclamazione.",
            "Per la Vetta serve la conferma di un mentore della Gilda. A quel livello\n            il rischio è dichiararsi da soli.",
        ),
        (
            "Scegli il punto d'ingresso più onesto rispetto alla tua situazione attuale —\n        non il più ambizioso.",
            "Scegli l'ingresso più onesto rispetto a oggi, non quello che suona più ambizioso.",
        ),
        (
            "Per chi vuole capire, prima di investire tempo o budget, dove il\n          proprio profilo e i propri processi perdono valore.",
            "Per capire, prima di mettere tempo o soldi, dove profilo e processi perdono valore.",
        ),
        (
            "Per chi ha già chiaro cosa serve e vuole aiuto concreto per\n          trasformarlo in sistemi, messaggi e processi funzionanti.",
            "Per chi sa già cosa serve e vuole aiuto concreto a trasformarlo in sistemi, messaggi e processi che reggono.",
        ),
        (
            "Per chi vuole più struttura, direzione professionale e\n          autonomia nel lungo periodo, non solo una soluzione tattica.",
            "Per chi vuole struttura e direzione nel tempo, non solo una pezza tattica.",
        ),
        (
            "Non vendiamo posti a listino pubblico. Valutiamo dove sei oggi e ti\n        indichiamo il rango e la via d'ingresso più onesti.",
            "Non vendiamo posti a listino pubblico. Guardiamo dove sei oggi e ti\n        indichiamo rango e via d'ingresso più onesti.",
        ),
        (
            "Lavori solo tramite la scuola sci: clienti, tariffe e calendario decisi da altri. È il punto da cui parte chiunque entri in Gilda.",
            "Lavori solo tramite la scuola sci: clienti, tariffe e calendario decisi da altri. È da qui che parte chiunque entri in Gilda.",
        ),
        (
            "Ammissione in Gilda. Prima diagnosi onesta: quanto dipendi oggi dalla scuola, che asset hai già, dove puoi davvero iniziare a scalare.",
            "Ammissione in Gilda. Prima diagnosi onesta: quanto dipendi oggi dalla scuola, che asset hai già, dove puoi davvero iniziare a salire.",
        ),
        (
            "Costruisci l'infrastruttura che serve per poter dire sì a un cliente diretto: senza questo, l'indipendenza resta solo un'idea.",
            "Metti in piedi l'infrastruttura per poter dire sì a un cliente diretto. Senza questo, l'indipendenza resta solo un'idea.",
        ),
        (
            "Legati sulla stessa corda, ma ognuno con la propria linea: lavori ancora con la scuola, ma inizi a prendere clienti diretti in parallelo.",
            "Lavori ancora con la scuola, ma inizi a prendere clienti diretti in parallelo. Stessa corda, linee diverse.",
        ),
        (
            "Indipendenza reale: il flusso di clienti diretti basta a reggere l'attività. Da qui puoi anche rientrare in Gilda come mentore.",
            "I clienti diretti bastano a reggere l'attività. Da qui puoi anche rientrare in Gilda come mentore.",
        ),
    ],
    "about.html": [
        (
            "The Crest Guild esiste per colmare un vuoto preciso: la parte\n      di business che nessuna scuola sci e nessun corso tecnico insegna.",
            "The Crest Guild colma un vuoto preciso: la parte di business che\n      nessuna scuola sci e nessun corso tecnico insegna.",
        ),
        (
            "Aiutiamo i maestri di sci a costruire un'attività organizzata e\n          autonoma — sostituendo il caos operativo con sistemi che funzionano.",
            "Aiutiamo i maestri di sci a costruire un'attività ordinata e\n          autonoma. Meno caos operativo, più sistemi che tengono.",
        ),
        (
            "Non uno strumento generico. Non promettiamo automazione totale —\n          promettiamo controllo: sai sempre a che punto sei e cosa fare dopo.",
            "Non siamo uno strumento generico. Non promettiamo automazione totale.\n          Promettiamo controllo: sai dove sei e cosa fare dopo.",
        ),
        (
            "Il mondo che vogliamo creare",
            "Il mondo che vogliamo aiutare a creare",
        ),
        (
            "Un futuro in cui ogni maestro di sci indipendente ha gli stessi\n          sistemi operativi di una grande organizzazione — senza doversene\n          occupare in prima persona.",
            "Un futuro in cui ogni maestro indipendente ha sistemi operativi\n          all'altezza di un'organizzazione grande, senza doverli gestire da\n          solo tutto il giorno.",
        ),
        (
            "La mission sistema il presente, un rango alla volta. La vision\n          punta al lungo periodo: sistemi enterprise per chi lavora da solo.",
            "La mission sistema il presente, un rango alla volta. La vision\n          guarda al lungo periodo: sistemi seri per chi lavora da solo.",
        ),
        (
            "<span class=\"dim\">Non è mancanza di talento — è mancanza di sistema.</span>",
            "<span class=\"dim\">Non manca il talento. Manca il sistema.</span>",
        ),
        (
            "Tre strade diverse nello stesso settore — artigianato, business,\n        montagna. Non un team marketing generico: persone che il problema\n        lo hanno vissuto prima di costruirci sopra un prodotto.",
            "Tre strade diverse nello stesso settore: artigianato, business,\n        montagna. Non un team marketing generico. Persone che il problema\n        lo hanno vissuto prima di costruirci un prodotto.",
        ),
        (
            "Che si tratti di un contenuto o di come rispondiamo a un membro,\n        questi cinque non sono in discussione.",
            "Su un contenuto o su come rispondiamo a un membro, questi cinque restano fermi.",
        ),
        (
            "Sistemi semplici che fanno cose complesse. Riduciamo il rumore,\n          non lo aggiungiamo.",
            "Sistemi semplici che fanno cose complesse. Togliamo rumore, non ne aggiungiamo.",
        ),
        (
            "Funziona quando conta. Promesse mantenute, nessuna sorpresa sulle\n          scadenze.",
            "Funziona quando conta. Promesse tenute, niente sorprese sulle scadenze.",
        ),
        (
            "Far parte della Gilda ti fa apparire più professionale. Il\n          percorso eleva, non sostituisce.",
            "Far parte della Gilda ti fa apparire più professionale. Il percorso alza lo standard, non lo sostituisce.",
        ),
        (
            "Non dipendi da noi per ogni piccola cosa. Funziona anche senza\n          supervisione.",
            "Non dipendi da noi per ogni dettaglio. Funziona anche senza supervisione.",
        ),
        (
            "Niente è lasciato al caso — dai criteri di rango ai contenuti di\n          ogni tappa.",
            "Niente lasciato al caso, dai criteri di rango ai contenuti di ogni tappa.",
        ),
        (
            "Due minuti di quiz; l’email serve solo per consegnarti il risultato.",
            "Due minuti di quiz. L'email serve solo per consegnarti il risultato.",
        ),
    ],
    "ecosystem.html": [
        (
            "ArmoFlow Ltd costruisce sistemi operativi digitali per attività\n      basate sui servizi. Tre prodotti, stesso target — il professionista\n      indipendente del settore sci/outdoor — pensati per lavorare insieme lungo\n      tutto il ciclo di vita del servizio.",
            "ArmoFlow Ltd costruisce sistemi operativi digitali per attività di\n      servizio. Tre prodotti, stesso pubblico: il professionista indipendente\n      nello sci e outdoor. Pensati per lavorare insieme lungo tutto il ciclo del servizio.",
        ),
        (
            "AI booking per maestri di sci. Unisce WhatsApp e Gmail in\n          un'unica inbox, suggerisce risposte con l'AI e gestisce automaticamente\n          le prenotazioni a partire dalle conversazioni.",
            "Prenotazioni con AI per maestri di sci. Unisce WhatsApp e Gmail in\n          un'unica inbox, suggerisce risposte e gestisce le prenotazioni dalle conversazioni.",
        ),
        (
            "Struttura la tua professione, costruisci il tuo sistema.\n          Aiuta i maestri a diventare autonomi, coerenti e professionali, con\n          percorsi su misura sia per chi inizia che per chi ha più esperienza.",
            "Struttura la professione e costruisci il tuo sistema.\n          Percorsi su misura per chi inizia e per chi ha già esperienza.",
        ),
        (
            "Il tuo cliente, organizzato. La sua vacanza, curata. Gestione\n          concierge: raccoglie esperienze, pagamenti e recensioni per ogni\n          cliente in un unico posto.",
            "Il tuo cliente organizzato, la sua vacanza curata. Concierge:\n          esperienze, pagamenti e recensioni in un unico posto.",
        ),
        (
            "L'unico passaggio esplicitamente consigliato: la Gilda ti forma,\n      FrostDesk è lo strumento operativo con cui lavori ogni giorno da indipendente.",
            "Il passaggio che consigliamo: la Gilda ti forma, FrostDesk è lo\n      strumento con cui lavori ogni giorno da indipendente.",
        ),
        (
            "Tre prodotti, <span class=\"accent\">una sola persona da servire</span> —\n      <span class=\"dim\">il maestro di sci che vuole smettere di dipendere da qualcun altro.</span>",
            "Tre prodotti, <span class=\"accent\">una sola persona da servire</span>:\n      <span class=\"dim\">il maestro di sci che vuole smettere di dipendere da qualcun altro.</span>",
        ),
        (
            "La società che possiede e sviluppa tutti e tre i prodotti. Il nome\n        \"ArmoFlow\" compare nel sito istituzionale, nei materiali corporate e\n        nelle comunicazioni ufficiali — non sostituisce mai il nome del singolo\n        prodotto quando parli con un maestro o un cliente.",
            "La società che possiede e sviluppa i tre prodotti. \"ArmoFlow\" compare\n        sul sito istituzionale e nelle comunicazioni ufficiali. Non sostituisce\n        mai il nome del prodotto quando parli con un maestro o un cliente.",
        ),
        (
            "Usato su contratti, fatture e ogni comunicazione ufficiale.\n          Software operativo per attività di servizio moderne.",
            "Usato su contratti, fatture e comunicazioni ufficiali.\n          Software operativo per attività di servizio moderne.",
        ),
        (
            "Ogni prodotto ha un tono diverso perché risolve un\n          problema diverso: FrostDesk è operativo, la Gilda è educativa,\n          Vaelmont è premium e orientato al cliente finale.",
            "Ogni prodotto ha un tono diverso perché risolve un problema diverso.\n          FrostDesk è operativo, la Gilda è educativa, Vaelmont è premium e rivolto al cliente finale.",
        ),
        (
            "Entri in Gilda per costruire le fondamenta. Una volta\n          pronto, FrostDesk è lo strumento che ti fa gestire clienti diretti\n          senza tornare al caos.",
            "Entri in Gilda per le fondamenta. Quando sei pronto, FrostDesk ti\n          fa gestire i clienti diretti senza tornare al caos.",
        ),
        (
            "Prima la struttura, poi lo strumento. È in quest'ordine che funziona meglio.",
            "Prima la struttura, poi lo strumento. In quest'ordine funziona meglio.",
        ),
    ],
    "quiz.html": [
        (
            "Due minuti, nessuna registrazione alle domande",
            "Due minuti. Nessuna registrazione alle domande.",
        ),
    ],
}


def apply_it_tone(html: str, page: str) -> str:
    for a, b in IT_REPLACEMENTS:
        html = html.replace(a, b)
    for a, b in IT_PAGE_PATCHES.get(page, []):
        html = html.replace(a, b)
    # generic em dash cleanup in visible copy (careful with comments)
    return html


def retarget_assets(html: str) -> str:
    html = html.replace('href="assets/', 'href="../assets/')
    html = html.replace('src="assets/', 'src="../assets/')
    html = html.replace("url('assets/", "url('../assets/")
    return html


# Shared EN/FR chrome labels
NAV = {
    "en": {
        "home": "Home",
        "ranks": "The Ranks",
        "quiz": "Quiz",
        "about": "About Us",
        "eco": "Ecosystem",
        "join": "Join the Guild",
        "apply": "Apply",
        "skip": "Skip to content",
        "nav": "Main",
        "menu": "Open menu",
        "foot_blurb": "For ski instructors who want to move beyond the school-only model, one rank at a time.",
        "path": "Path",
        "eco_af": "ArmoFlow Ecosystem",
        "connected": "How the products connect",
        "legal": "Legal",
        "apply_form": "Apply via the form",
        "cookies": "Cookie preferences",
        "eco_strip": "The Crest Guild is a product of the ArmoFlow family",
        "copyright": "© 2026 The Crest Guild · ArmoFlow Ltd",
        "locale": "en_GB",
        "lang": "en",
    },
    "fr": {
        "home": "Accueil",
        "ranks": "Les Rangs",
        "quiz": "Quiz",
        "about": "À propos",
        "eco": "Écosystème",
        "join": "Rejoindre la Guilde",
        "apply": "Candidater",
        "skip": "Aller au contenu",
        "nav": "Principale",
        "menu": "Ouvrir le menu",
        "foot_blurb": "Pour les moniteurs de ski qui veulent sortir du seul modèle école, un rang à la fois.",
        "path": "Parcours",
        "eco_af": "Écosystème ArmoFlow",
        "connected": "Comment les produits sont liés",
        "legal": "Mentions légales",
        "apply_form": "Candidater via le formulaire",
        "cookies": "Préférences cookies",
        "eco_strip": "The Crest Guild est un produit de la famille ArmoFlow",
        "copyright": "© 2026 The Crest Guild · ArmoFlow Ltd",
        "locale": "fr_FR",
        "lang": "fr",
    },
}


def translate_chrome(html: str, lang: str) -> str:
    n = NAV[lang]
    html = html.replace('<html lang="it">', f'<html lang="{n["lang"]}">')
    html = html.replace('content="it_IT"', f'content="{n["locale"]}"')
    html = html.replace('aria-label="Principale"', f'aria-label="{n["nav"]}"')
    html = html.replace("Vai al contenuto", n["skip"])
    html = html.replace('aria-label="Apri menu"', f'aria-label="{n["menu"]}"')
    # nav labels (order matters for longer first)
    replacements = [
        (">I Ranghi<", f'>{n["ranks"]}<'),
        (">Chi Siamo<", f'>{n["about"]}<'),
        (">Ecosystem<", f'>{n["eco"]}<'),
        (">Home<", f'>{n["home"]}<'),
        (">Quiz<", f'>{n["quiz"]}<'),
        (">Entra nella Gilda<", f'>{n["join"]}<'),
        (">Candidati<", f'>{n["apply"]}<'),
        (">Percorso<", f'>{n["path"]}<'),
        (">Ecosystem ArmoFlow<", f'>{n["eco_af"]}<'),
        (">Come sono collegati i prodotti<", f'>{n["connected"]}<'),
        (">Legal<", f'>{n["legal"]}<'),
        (">Candidati via form<", f'>{n["apply_form"]}<'),
        (">Preferenze cookie<", f'>{n["cookies"]}<'),
        (
            "Per maestri di sci che vogliono uscire dal solo\n          modello scuola, un rango alla volta.",
            n["foot_blurb"].replace(" one rank", "\n          one rank") if lang == "en" else n["foot_blurb"].replace(" un rang", "\n          un rang"),
        ),
        (
            '<b>The Crest Guild</b> è un prodotto della famiglia ArmoFlow',
            f'<b>The Crest Guild</b> {n["eco_strip"].split("The Crest Guild ",1)[-1]}' if False else None,
        ),
    ]
    # eco strip full replace
    html = html.replace(
        "<b>The Crest Guild</b> è un prodotto della famiglia ArmoFlow",
        f"<b>The Crest Guild</b> { 'is a product of the ArmoFlow family' if lang=='en' else 'est un produit de la famille ArmoFlow' }",
    )
    html = html.replace("© 2026 The Crest Guild · ArmoFlow Ltd", n["copyright"])
    for a, b in replacements:
        if b is None:
            continue
        html = html.replace(a, b)
    return html


# Large content maps per page for EN and FR (tone-aligned)
CONTENT = {
    "index.html": {
        "en": {
            "title": "The Crest Guild · From ski instructor to independent, one rank at a time",
            "desc": "A 5-rank path for ski instructors: from the ski school to independence, with concrete checklists, a placement quiz, and Guild mentorship.",
            "og_title": "The Crest Guild · From ski instructor to independent",
            "body_swaps": [
                ("Per maestri di sci che vogliono lavorare in proprio", "For ski instructors who want to work for themselves"),
                ("Lavora per i tuoi clienti,<br>non solo per la <span class=\"accent\">scuola</span>.", "Work for your clients,<br>not just for the <span class=\"accent\">ski school</span>."),
                ("Cinque tappe concrete: dalla prima P.IVA al primo cliente che\n          torna da te, non dalla scuola.", "Five concrete stages: from registering your own business to the first client who\n          comes back to you, not to the school."),
                ("Fai il quiz per capire dove sei oggi. Poi sali di rango con una\n          checklist chiara. Per l'ultimo rango serve il via libera di un mentore\n          della Gilda.", "Take the quiz to see where you stand today. Then move up the ranks with a\n          clear checklist. The final rank needs a green light from a Guild mentor."),
                ("Scopri da che rango parti", "Find your starting rank"),
                ("Vedi i 5 ranghi", "See the 5 ranks"),
                ("Percorso autogestito · Validazione in Gilda per il rango finale", "Self-paced path · Guild validation for the final rank"),
                ("Percorso a 5 ranghi", "A 5-rank path"),
                ("Scopri il tuo rango", "Find your rank"),
                ("Due minuti per capire dove sei oggi e cosa ti manca per la Vetta.", "Two minutes to see where you stand today and what you still need for the Summit."),
                ("In Scuola", "In School"),
                ("partenza", "start"),
                ("obiettivo", "goal"),
                ("Vetta", "Summit"),
                ("In Scuola · Base Camp · Fondamenta · Cordata · Vetta", "In School · Base Camp · Foundations · Rope Team · Summit"),
                ("Fai il quiz", "Take the quiz"),
                ("Il percorso nella Gilda", "The path in the Guild"),
                ("Da scuola sci a indipendente, un rango alla volta", "From ski school to independent, one rank at a time"),
                ("Non è un catalogo di corsi. Ogni rango certifica qualcosa di reale che hai\n        messo in piedi, non quanto tempo sei rimasto in Gilda.", "It is not a course catalogue. Each rank certifies something real you have\n        built, not how long you stayed in the Guild."),
                ("Punto di partenza", "Starting point"),
                ("Fuori dalla Gilda", "Outside the Guild"),
                ("Lavori solo tramite la scuola sci: clienti, tariffe e calendario decisi da altri. È da qui che parte chiunque entri in Gilda.", "You work only through the ski school: clients, rates, and schedule decided by someone else. This is where everyone who joins the Guild starts."),
                ("Nessun cliente proprio", "No clients of your own"),
                ("Tariffa fissata dalla scuola", "Rate set by the school"),
                ("Calendario deciso da altri", "Schedule decided by others"),
                ("Zero rischio, zero indipendenza", "Zero risk, zero independence"),
                ("Rango I", "Rank I"),
                ("Completato", "Completed"),
                ("Ammissione in Gilda. Prima diagnosi onesta: quanto dipendi oggi dalla scuola, che asset hai già, dove puoi davvero iniziare a salire.", "Admission to the Guild. First honest assessment: how much you depend on the school today, what assets you already have, where you can realistically start climbing."),
                ("Colloquio d'ingresso in Gilda", "Guild entry interview"),
                ("Valutazione asset attuali", "Assessment of current assets"),
                ("Piano di risalita personalizzato", "Personalised progression plan"),
                ("Accesso alla community dei maestri", "Access to the instructor community"),
                ("Rango II", "Rank II"),
                ("Fondamenta", "Foundations"),
                ("In corso", "In progress"),
                ("Metti in piedi l'infrastruttura per poter dire sì a un cliente diretto. Senza questo, l'indipendenza resta solo un'idea.", "You put in place the infrastructure to say yes to a direct client. Without it, independence stays just an idea."),
                ("P.IVA attiva", "Active business registration"),
                ("Assicurazione professionale", "Professional insurance"),
                ("Sistema di prenotazione tuo", "Your own booking system"),
                ("Listino prezzi personale", "Your own price list"),
                ("Rango III", "Rank III"),
                ("Cordata", "Rope Team"),
                ("Da raggiungere", "Still to reach"),
                ("Lavori ancora con la scuola, ma inizi a prendere clienti diretti in parallelo. Stessa corda, linee diverse.", "You still work with the school, but start taking direct clients in parallel. Same rope, different lines."),
                ("Primi clienti diretti", "First direct clients"),
                ("Reputazione propria (recensioni, passaparola)", "Your own reputation (reviews, word of mouth)"),
                ("Gestione doppio canale", "Managing two channels"),
                ("Primi confronti di prezzo reali", "First real pricing comparisons"),
                ("Rango IV", "Rank IV"),
                ("Rango finale", "Final rank"),
                ("I clienti diretti bastano a reggere l'attività. Da qui puoi anche rientrare in Gilda come mentore.", "Direct clients are enough to sustain the business. From here you can also come back to the Guild as a mentor."),
                ("Flusso diretto sufficiente", "Sufficient direct flow"),
                ("Validazione di un mentore della Gilda", "Validation from a Guild mentor"),
                ("Possibilità di diventare mentore", "Possibility of becoming a mentor"),
                ("Nome e reputazione indipendenti dalla scuola", "Name and reputation independent of the school"),
                ("Le vie della Gilda", "The Guild's paths"),
                ("Tre modi per entrare, a seconda di dove sei", "Three ways in, depending on where you are"),
                ("Scegli l'ingresso più onesto rispetto a oggi, non quello che suona più ambizioso.", "Choose the entry point that is most honest about today, not the one that sounds most ambitious."),
                ("Diagnosi", "Diagnosis"),
                ("Revisione Indipendente", "Independent Review"),
                ("Per capire, prima di mettere tempo o soldi, dove profilo e\n          processi perdono valore.", "To understand, before putting time or money in, where your profile and\n          processes are losing value."),
                ("Punti di forza reali", "Real strengths"),
                ("Lacune commerciali", "Business gaps"),
                ("3 priorità pratiche", "3 practical priorities"),
                ("Prossimo passo consigliato", "Recommended next step"),
                ("Richiedi una revisione", "Request a review"),
                ("Attuazione", "Implementation"),
                ("Affiancamento Operativo", "Operational Support"),
                ("Per chi sa già cosa serve e vuole aiuto concreto a\n          trasformarlo in sistemi, messaggi e processi che reggono.", "For those who already know what is needed and want concrete help turning it\n          into systems, messaging, and processes that hold."),
                ("Setup del profilo/offerta", "Profile/offer setup"),
                ("Messaggi e materiali cliente", "Client messaging and materials"),
                ("Percorso di acquisizione", "Client acquisition path"),
                ("Follow-up strutturato", "Structured follow-up"),
                ("Richiedi affiancamento", "Request support"),
                ("Sviluppo", "Development"),
                ("Percorso di Maestria", "Mastery Path"),
                ("Per chi vuole struttura e direzione nel tempo, non solo\n          una pezza tattica.", "For those who want structure and direction over time, not just a tactical patch."),
                ("Fiducia professionale", "Professional confidence"),
                ("Direzione di carriera", "Career direction"),
                ("Preparazione strategica", "Strategic preparation"),
                ("Verso il lavoro indipendente", "Toward independent work"),
                ("Candidati al percorso", "Apply for this path"),
                ("Prima cohort", "First cohort"),
                ("Non abbiamo ancora membri da citare, e preferiamo dirtelo chiaro invece\n      di inventarli. Le candidature aprono adesso: chi entra ora costruisce il\n      percorso con noi.", "We do not have members to quote yet, and we would rather say so plainly than invent them. Applications are opening now: whoever joins at this stage helps build the path with us."),
                ("The Crest Guild, prima apertura candidature", "The Crest Guild, first round of applications"),
                ("Un esito tipico", "A typical outcome"),
                ("Prima solo scuola. Dopo, le fondamenta.", "Before: school only. After: the foundations."),
                ("Esempio illustrativo, non un caso reale", "Illustrative example, not a real case"),
                ("Prima", "Before"),
                ("Calendario e tariffe solo scuola. Nessun cliente proprio. Zero infrastruttura commerciale.", "Schedule and rates from the school only. No clients of your own. Zero business infrastructure."),
                ("Dopo Fondamenta", "After Foundations"),
                ("P.IVA, assicurazione, listino personale e un canale di prenotazione tuo. Pronti per i primi clienti diretti.", "Business registration, insurance, your own price list, and a booking channel of your own. Ready for your first direct clients."),
                ("Prossimo passo", "Next step"),
                ("Non sai da dove iniziare?", "Not sure where to start?"),
                ("Fai il quiz (2 minuti) oppure candidati. Ti indichiamo il\n      rango più adatto e si parte da lì.", "Take the quiz (2 minutes) or apply. We will point you to the right rank and go from there."),
                ("Fai il quiz di posizionamento", "Take the positioning quiz"),
                ("Oppure candidati alla Gilda", "Or apply to the Guild"),
                ("Ranghi della Gilda", "Guild ranks"),
            ],
        },
        "fr": {
            "title": "The Crest Guild · De moniteur de ski à indépendant, un rang à la fois",
            "desc": "Parcours à 5 rangs pour moniteurs de ski : de l'école à l'indépendance, avec checklists concrètes, quiz et mentorat dans la Guilde.",
            "og_title": "The Crest Guild · De moniteur de ski à indépendant",
            "body_swaps": [
                ("Per maestri di sci che vogliono lavorare in proprio", "Pour les moniteurs de ski qui veulent travailler à leur compte"),
                ("Lavora per i tuoi clienti,<br>non solo per la <span class=\"accent\">scuola</span>.", "Travaillez pour vos clients,<br>pas seulement pour l'<span class=\"accent\">école</span>."),
                ("Cinque tappe concrete: dalla prima P.IVA al primo cliente che\n          torna da te, non dalla scuola.", "Cinq étapes concrètes : de votre première immatriculation au premier client qui\n          revient vers vous, pas vers l'école."),
                ("Fai il quiz per capire dove sei oggi. Poi sali di rango con una\n          checklist chiara. Per l'ultimo rango serve il via libera di un mentore\n          della Gilda.", "Faites le quiz pour voir où vous en êtes. Puis montez de rang avec une\n          checklist claire. Pour le dernier rang, il faut le feu vert d'un mentor de la Guilde."),
                ("Scopri da che rango parti", "Découvrez votre rang de départ"),
                ("Vedi i 5 ranghi", "Voir les 5 rangs"),
                ("Percorso autogestito · Validazione in Gilda per il rango finale", "Parcours autonome · Validation de la Guilde pour le rang final"),
                ("Percorso a 5 ranghi", "Parcours à 5 rangs"),
                ("Scopri il tuo rango", "Découvrez votre rang"),
                ("Due minuti per capire dove sei oggi e cosa ti manca per la Vetta.", "Deux minutes pour voir où vous en êtes et ce qu'il vous manque pour le Sommet."),
                ("In Scuola", "À l'École"),
                ("partenza", "départ"),
                ("obiettivo", "objectif"),
                ("Vetta", "Sommet"),
                ("In Scuola · Base Camp · Fondamenta · Cordata · Vetta", "À l'École · Camp de Base · Fondations · Cordée · Sommet"),
                ("Fai il quiz", "Faire le quiz"),
                ("Il percorso nella Gilda", "Le parcours dans la Guilde"),
                ("Da scuola sci a indipendente, un rango alla volta", "De l'école de ski à l'indépendance, un rang à la fois"),
                ("Non è un catalogo di corsi. Ogni rango certifica qualcosa di reale che hai\n        messo in piedi, non quanto tempo sei rimasto in Gilda.", "Ce n'est pas un catalogue de cours. Chaque rang atteste quelque chose de réel que vous avez\n        mis en place, pas le temps passé dans la Guilde."),
                ("Punto di partenza", "Point de départ"),
                ("Fuori dalla Gilda", "Hors de la Guilde"),
                ("Lavori solo tramite la scuola sci: clienti, tariffe e calendario decisi da altri. È da qui che parte chiunque entri in Gilda.", "Vous travaillez uniquement via l'école de ski : clients, tarifs et planning décidés par d'autres. C'est le point de départ de quiconque rejoint la Guilde."),
                ("Nessun cliente proprio", "Aucun client propre"),
                ("Tariffa fissata dalla scuola", "Tarif fixé par l'école"),
                ("Calendario deciso da altri", "Planning décidé par d'autres"),
                ("Zero rischio, zero indipendenza", "Zéro risque, zéro indépendance"),
                ("Rango I", "Rang I"),
                ("Base Camp", "Camp de Base"),
                ("Completato", "Terminé"),
                ("Ammissione in Gilda. Prima diagnosi onesta: quanto dipendi oggi dalla scuola, che asset hai già, dove puoi davvero iniziare a salire.", "Admission dans la Guilde. Premier bilan honnête : à quel point vous dépendez de l'école aujourd'hui, quels atouts vous avez déjà, où vous pouvez réellement commencer à grimper."),
                ("Colloquio d'ingresso in Gilda", "Entretien d'entrée dans la Guilde"),
                ("Valutazione asset attuali", "Évaluation des atouts actuels"),
                ("Piano di risalita personalizzato", "Plan de progression personnalisé"),
                ("Accesso alla community dei maestri", "Accès à la communauté des moniteurs"),
                ("Rango II", "Rang II"),
                ("Fondamenta", "Fondations"),
                ("In corso", "En cours"),
                ("Metti in piedi l'infrastruttura per poter dire sì a un cliente diretto. Senza questo, l'indipendenza resta solo un'idea.", "Vous mettez en place l'infrastructure pour pouvoir dire oui à un client direct. Sans cela, l'indépendance reste une simple idée."),
                ("P.IVA attiva", "Immatriculation active"),
                ("Assicurazione professionale", "Assurance professionnelle"),
                ("Sistema di prenotazione tuo", "Votre propre système de réservation"),
                ("Listino prezzi personale", "Votre propre grille tarifaire"),
                ("Rango III", "Rang III"),
                ("Cordata", "Cordée"),
                ("Da raggiungere", "À atteindre"),
                ("Lavori ancora con la scuola, ma inizi a prendere clienti diretti in parallelo. Stessa corda, linee diverse.", "Vous travaillez encore avec l'école, mais commencez à prendre des clients directs en parallèle. Même corde, voies différentes."),
                ("Primi clienti diretti", "Premiers clients directs"),
                ("Reputazione propria (recensioni, passaparola)", "Votre propre réputation (avis, bouche-à-oreille)"),
                ("Gestione doppio canale", "Gestion de deux canaux"),
                ("Primi confronti di prezzo reali", "Premières comparaisons de prix réelles"),
                ("Rango IV", "Rang IV"),
                ("Rango finale", "Rang final"),
                ("I clienti diretti bastano a reggere l'attività. Da qui puoi anche rientrare in Gilda come mentore.", "Les clients directs suffisent à faire vivre l'activité. À partir d'ici, vous pouvez aussi revenir dans la Guilde comme mentor."),
                ("Flusso diretto sufficiente", "Flux direct suffisant"),
                ("Validazione di un mentore della Gilda", "Validation d'un mentor de la Guilde"),
                ("Possibilità di diventare mentore", "Possibilité de devenir mentor"),
                ("Nome e reputazione indipendenti dalla scuola", "Nom et réputation indépendants de l'école"),
                ("Le vie della Gilda", "Les voies de la Guilde"),
                ("Tre modi per entrare, a seconda di dove sei", "Trois façons d'entrer, selon où vous en êtes"),
                ("Scegli l'ingresso più onesto rispetto a oggi, non quello che suona più ambizioso.", "Choisissez l'entrée la plus honnête par rapport à aujourd'hui, pas celle qui sonne le plus ambitieuse."),
                ("Diagnosi", "Diagnostic"),
                ("Revisione Indipendente", "Bilan Indépendant"),
                ("Per capire, prima di mettere tempo o soldi, dove profilo e\n          processi perdono valore.", "Pour comprendre, avant d'y mettre du temps ou de l'argent, où profil et\n          processus perdent de la valeur."),
                ("Punti di forza reali", "Points forts réels"),
                ("Lacune commerciali", "Lacunes commerciales"),
                ("3 priorità pratiche", "3 priorités pratiques"),
                ("Prossimo passo consigliato", "Prochaine étape recommandée"),
                ("Richiedi una revisione", "Demander un bilan"),
                ("Attuazione", "Mise en œuvre"),
                ("Affiancamento Operativo", "Accompagnement Opérationnel"),
                ("Per chi sa già cosa serve e vuole aiuto concreto a\n          trasformarlo in sistemi, messaggi e processi che reggono.", "Pour ceux qui savent déjà ce qu'il faut et veulent une aide concrète pour le transformer en systèmes, messages et processus qui tiennent."),
                ("Setup del profilo/offerta", "Configuration du profil et de l'offre"),
                ("Messaggi e materiali cliente", "Messages et supports client"),
                ("Percorso di acquisizione", "Parcours d'acquisition"),
                ("Follow-up strutturato", "Suivi structuré"),
                ("Richiedi affiancamento", "Demander un accompagnement"),
                ("Sviluppo", "Développement"),
                ("Percorso di Maestria", "Parcours de Maîtrise"),
                ("Per chi vuole struttura e direzione nel tempo, non solo\n          una pezza tattica.", "Pour ceux qui veulent structure et direction dans le temps, pas seulement un correctif tactique."),
                ("Fiducia professionale", "Confiance professionnelle"),
                ("Direzione di carriera", "Orientation de carrière"),
                ("Preparazione strategica", "Préparation stratégique"),
                ("Verso il lavoro indipendente", "Vers le travail indépendant"),
                ("Candidati al percorso", "Candidater à ce parcours"),
                ("Prima cohort", "Première cohorte"),
                ("Non abbiamo ancora membri da citare, e preferiamo dirtelo chiaro invece\n      di inventarli. Le candidature aprono adesso: chi entra ora costruisce il\n      percorso con noi.", "Nous n'avons pas encore de membres à citer, et nous préférons le dire clairement plutôt que d'en inventer. Les candidatures ouvrent maintenant : qui rejoint maintenant construit le parcours avec nous."),
                ("The Crest Guild, prima apertura candidature", "The Crest Guild, première ouverture des candidatures"),
                ("Un esito tipico", "Un résultat typique"),
                ("Prima solo scuola. Dopo, le fondamenta.", "Avant : uniquement l'école. Après : les fondations."),
                ("Esempio illustrativo, non un caso reale", "Exemple illustratif, pas un cas réel"),
                ("Prima", "Avant"),
                ("Calendario e tariffe solo scuola. Nessun cliente proprio. Zero infrastruttura commerciale.", "Planning et tarifs uniquement de l'école. Aucun client propre. Zéro infrastructure commerciale."),
                ("Dopo Fondamenta", "Après les Fondations"),
                ("P.IVA, assicurazione, listino personale e un canale di prenotazione tuo. Pronti per i primi clienti diretti.", "Immatriculation, assurance, votre propre grille tarifaire et un canal de réservation à vous. Prêts pour vos premiers clients directs."),
                ("Prossimo passo", "Prochaine étape"),
                ("Non sai da dove iniziare?", "Vous ne savez pas par où commencer ?"),
                ("Fai il quiz (2 minuti) oppure candidati. Ti indichiamo il\n      rango più adatto e si parte da lì.", "Faites le quiz (2 minutes) ou candidatez. Nous vous indiquerons le rang le plus adapté, et on avance à partir de là."),
                ("Fai il quiz di posizionamento", "Faire le quiz de positionnement"),
                ("Oppure candidati alla Gilda", "Ou candidater à la Guilde"),
                ("Ranghi della Gilda", "Rangs de la Guilde"),
            ],
        },
    },
}


def swap_title_meta(html: str, title: str, desc: str, og_title: str | None = None) -> str:
    html = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", html, count=1, flags=re.S)
    html = re.sub(
        r'<meta name="description" content="[^"]*">',
        f'<meta name="description" content="{desc}">',
        html,
        count=1,
    )
    ot = og_title or title
    html = re.sub(
        r'<meta property="og:title" content="[^"]*">',
        f'<meta property="og:title" content="{ot}">',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta property="og:description" content="[^"]*">',
        f'<meta property="og:description" content="{desc}">',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta name="twitter:title" content="[^"]*">',
        f'<meta name="twitter:title" content="{ot}">',
        html,
        count=1,
    )
    html = re.sub(
        r'<meta name="twitter:description" content="[^"]*">',
        f'<meta name="twitter:description" content="{desc}">',
        html,
        count=1,
    )
    return html


def process_it_page(page: str) -> str:
    path = ROOT / page
    html = path.read_text(encoding="utf-8")
    html = apply_it_tone(html, page)
    html = ensure_theme_script(html)
    html = ensure_hreflang(html, page)
    html = dual_crests(html, "assets/")
    html = inject_nav_controls(html, page, "it", "assets/")
    # fix copyright em dash leftovers
    html = html.replace("The Crest Guild — ArmoFlow", "The Crest Guild · ArmoFlow")
    path.write_text(html, encoding="utf-8")
    return html


def build_locale_page(page: str, lang: str, it_html: str) -> None:
    html = it_html
    html = retarget_assets(html)
    # rewrite lang switcher targets for nested folder
    html = inject_nav_controls(html, page, lang, "../assets/")
    html = dual_crests(html, "../assets/")
    html = translate_chrome(html, lang)

    # canonical + og url for locale
    slug = "" if page == "index.html" else page.replace(".html", "")
    if page == "index.html":
        canon = f"https://www.thecrestguild.com/{lang}/index.html"
        ogurl = canon
    else:
        canon = f"https://www.thecrestguild.com/{lang}/{page}"
        ogurl = canon
    html = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{canon}">', html)
    html = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{ogurl}">', html)

    # content packs where available
    pack = CONTENT.get(page, {}).get(lang)
    if pack:
        html = swap_title_meta(html, pack["title"], pack["desc"], pack.get("og_title"))
        # apply longer strings first
        swaps = sorted(pack["body_swaps"], key=lambda x: len(x[0]), reverse=True)
        for a, b in swaps:
            html = html.replace(a, b)

    # Fix internal language folder links already relative (same folder) — good
    # Fix IT-only leftover em dashes
    html = html.replace(" — ", ": ")
    html = html.replace("— ", "")
    html = html.replace(" —", "")

    out = ROOT / lang / page
    out.write_text(html, encoding="utf-8")
    print("wrote", out)


def main() -> None:
    for page in PAGES:
        it_html = process_it_page(page)
        print("updated IT", page)
        for lang in ("en", "fr"):
            build_locale_page(page, lang, it_html)

    # sitemap
    urls = []
    for page in PAGES:
        it_loc = "https://www.thecrestguild.com/" if page == "index.html" else f"https://www.thecrestguild.com/{page.replace('.html','')}"
        en_loc = f"https://www.thecrestguild.com/en/{page}"
        fr_loc = f"https://www.thecrestguild.com/fr/{page}"
        # use .html for localized; IT keeps existing extensionless pattern for non-index
        if page == "index.html":
            it_href = "https://www.thecrestguild.com/"
            en_href = "https://www.thecrestguild.com/en/index.html"
            fr_href = "https://www.thecrestguild.com/fr/index.html"
        else:
            it_href = f"https://www.thecrestguild.com/{page}"
            en_href = en_loc
            fr_href = fr_loc
            it_loc = it_href
        block = f"""  <url>
    <loc>{it_loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>{"1.0" if page=="index.html" else "0.8"}</priority>
    <xhtml:link rel="alternate" hreflang="it" href="{it_href}"/>
    <xhtml:link rel="alternate" hreflang="en" href="{en_href}"/>
    <xhtml:link rel="alternate" hreflang="fr" href="{fr_href}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.thecrestguild.com/"/>
  </url>
  <url>
    <loc>{en_href}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="it" href="{it_href}"/>
    <xhtml:link rel="alternate" hreflang="en" href="{en_href}"/>
    <xhtml:link rel="alternate" hreflang="fr" href="{fr_href}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.thecrestguild.com/"/>
  </url>
  <url>
    <loc>{fr_href}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="it" href="{it_href}"/>
    <xhtml:link rel="alternate" hreflang="en" href="{en_href}"/>
    <xhtml:link rel="alternate" hreflang="fr" href="{fr_href}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.thecrestguild.com/"/>
  </url>"""
        urls.append(block)

    legal = """  <url><loc>https://www.thecrestguild.com/privacy</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://www.thecrestguild.com/terms</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://www.thecrestguild.com/cookies</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://www.thecrestguild.com/security</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://www.thecrestguild.com/legal</loc><changefreq>yearly</changefreq><priority>0.2</priority></url>"""

    sitemap = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        + "\n".join(urls)
        + "\n"
        + legal
        + "\n</urlset>\n"
    )
    (ROOT / "sitemap.xml").write_text(sitemap, encoding="utf-8")
    print("updated sitemap.xml")


if __name__ == "__main__":
    main()
