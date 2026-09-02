/* The Crest Guild — rank trail UI */
(function(){
  var lang = (document.documentElement.lang || 'it').slice(0, 2).toLowerCase();
  if (lang !== 'en' && lang !== 'fr') lang = 'it';

  var COPY = {
    it: {
      ranks: [
        {
          id: 0, tag: "Punto di partenza", label: "In Scuola", state: "done",
          title: "In Scuola", stateLabel: "Fuori dalla Gilda",
          desc: "Lavori solo tramite la scuola sci: clienti, tariffe e calendario decisi da altri. È da qui che parte chiunque entri in Gilda.",
          items: ["Nessun cliente proprio", "Tariffa fissata dalla scuola", "Calendario deciso da altri", "Zero rischio, zero indipendenza"]
        },
        {
          id: 1, tag: "Rango I", label: "Base Camp", state: "done",
          title: "Base Camp", stateLabel: "Completato",
          desc: "Ammissione in Gilda. Prima diagnosi onesta: quanto dipendi oggi dalla scuola, che asset hai già, dove puoi davvero iniziare a salire.",
          items: ["Colloquio d'ingresso in Gilda", "Valutazione asset attuali", "Piano di risalita personalizzato", "Accesso alla community dei maestri"]
        },
        {
          id: 2, tag: "Rango II", label: "Fondamenta", state: "current",
          title: "Fondamenta", stateLabel: "In corso",
          desc: "Metti in piedi l'infrastruttura per poter dire sì a un cliente diretto. Senza questo, l'indipendenza resta solo un'idea.",
          items: ["P.IVA attiva", "Assicurazione professionale", "Sistema di prenotazione tuo", "Listino prezzi personale"]
        },
        {
          id: 3, tag: "Rango III", label: "Cordata", state: "locked",
          title: "Cordata", stateLabel: "Da raggiungere",
          desc: "Lavori ancora con la scuola, ma inizi a prendere clienti diretti in parallelo. Stessa corda, linee diverse.",
          items: ["Primi clienti diretti", "Reputazione propria (recensioni, passaparola)", "Gestione doppio canale", "Primi confronti di prezzo reali"]
        },
        {
          id: 4, tag: "Rango IV", label: "Vetta", state: "locked",
          title: "Vetta", stateLabel: "Rango finale",
          desc: "I clienti diretti bastano a reggere l'attività. Da qui puoi anche rientrare in Gilda come mentore.",
          items: ["Flusso diretto sufficiente", "Validazione di un mentore della Gilda", "Possibilità di diventare mentore", "Nome e reputazione indipendenti dalla scuola"]
        }
      ]
    },
    en: {
      ranks: [
        {
          id: 0, tag: "Starting point", label: "In School", state: "done",
          title: "In School", stateLabel: "Outside the Guild",
          desc: "You work only through the ski school: clients, rates, and schedule decided by someone else. This is where everyone who joins the Guild starts.",
          items: ["No clients of your own", "Rate set by the school", "Schedule decided by others", "Zero risk, zero independence"]
        },
        {
          id: 1, tag: "Rank I", label: "Base Camp", state: "done",
          title: "Base Camp", stateLabel: "Completed",
          desc: "Admission to the Guild. First honest assessment: how much you depend on the school today, what assets you already have, where you can realistically start climbing.",
          items: ["Guild entry interview", "Assessment of current assets", "Personalised progression plan", "Access to the instructor community"]
        },
        {
          id: 2, tag: "Rank II", label: "Foundations", state: "current",
          title: "Foundations", stateLabel: "In progress",
          desc: "You put in place the infrastructure to say yes to a direct client. Without it, independence stays just an idea.",
          items: ["Active business registration", "Professional insurance", "Your own booking system", "Your own price list"]
        },
        {
          id: 3, tag: "Rank III", label: "Rope Team", state: "locked",
          title: "Rope Team", stateLabel: "Still to reach",
          desc: "You still work with the school, but start taking direct clients in parallel. Same rope, different lines.",
          items: ["First direct clients", "Your own reputation (reviews, word of mouth)", "Managing two channels", "First real pricing comparisons"]
        },
        {
          id: 4, tag: "Rank IV", label: "Summit", state: "locked",
          title: "Summit", stateLabel: "Final rank",
          desc: "Direct clients are enough to sustain the business. From here you can also come back to the Guild as a mentor.",
          items: ["Sufficient direct flow", "Validation from a Guild mentor", "Possibility of becoming a mentor", "Name and reputation independent of the school"]
        }
      ]
    },
    fr: {
      ranks: [
        {
          id: 0, tag: "Point de départ", label: "À l'École", state: "done",
          title: "À l'École", stateLabel: "Hors de la Guilde",
          desc: "Vous travaillez uniquement via l'école de ski : clients, tarifs et planning décidés par d'autres. C'est le point de départ de quiconque rejoint la Guilde.",
          items: ["Aucun client propre", "Tarif fixé par l'école", "Planning décidé par d'autres", "Zéro risque, zéro indépendance"]
        },
        {
          id: 1, tag: "Rang I", label: "Camp de Base", state: "done",
          title: "Camp de Base", stateLabel: "Terminé",
          desc: "Admission dans la Guilde. Premier bilan honnête : à quel point vous dépendez de l'école aujourd'hui, quels atouts vous avez déjà, où vous pouvez réellement commencer à grimper.",
          items: ["Entretien d'entrée dans la Guilde", "Évaluation des atouts actuels", "Plan de progression personnalisé", "Accès à la communauté des moniteurs"]
        },
        {
          id: 2, tag: "Rang II", label: "Fondations", state: "current",
          title: "Fondations", stateLabel: "En cours",
          desc: "Vous mettez en place l'infrastructure pour pouvoir dire oui à un client direct. Sans cela, l'indépendance reste une simple idée.",
          items: ["Immatriculation active", "Assurance professionnelle", "Votre propre système de réservation", "Votre propre grille tarifaire"]
        },
        {
          id: 3, tag: "Rang III", label: "Cordée", state: "locked",
          title: "Cordée", stateLabel: "À atteindre",
          desc: "Vous travaillez encore avec l'école, mais commencez à prendre des clients directs en parallèle. Même corde, voies différentes.",
          items: ["Premiers clients directs", "Votre propre réputation (avis, bouche-à-oreille)", "Gestion de deux canaux", "Premières comparaisons de prix réelles"]
        },
        {
          id: 4, tag: "Rang IV", label: "Sommet", state: "locked",
          title: "Sommet", stateLabel: "Rang final",
          desc: "Les clients directs suffisent à faire vivre l'activité. À partir d'ici, vous pouvez aussi revenir dans la Guilde comme mentor.",
          items: ["Flux direct suffisant", "Validation d'un mentor de la Guilde", "Possibilité de devenir mentor", "Nom et réputation indépendants de l'école"]
        }
      ]
    }
  };

  var RANKS = COPY[lang].ranks;

  var nodesEl = document.getElementById('trailNodes');
  var detailEl = document.getElementById('trailDetail');
  var fgEl = document.getElementById('trailFg');
  var trailRoot = nodesEl && nodesEl.closest('.trail');
  if (!nodesEl || !detailEl || !fgEl) return;

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

  function render(activeId){
    clear(nodesEl);
    RANKS.forEach(function(r){
      var btn = el('button', {
        type: 'button',
        className: 'trail-node is-' + r.state,
        role: 'tab',
        'aria-selected': String(r.id === activeId),
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

    var doneCount = RANKS.filter(function(r){ return r.state === 'done'; }).length;
    var pct = (doneCount / (RANKS.length - 1)) * 100;
    fgEl.style.width = pct + '%';
  }

  function showDetail(id, options){
    options = options || {};
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
    render(id);

    if (options.scroll === false) return;

    var activeBtn = document.getElementById('trail-tab-' + id);
    if (activeBtn && typeof activeBtn.scrollIntoView === 'function') {
      try {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } catch (e) {
        activeBtn.scrollIntoView(false);
      }
    }
  }

  showDetail(2, { scroll: false });
  if (trailRoot) trailRoot.classList.add('is-ready');

  var params = new URLSearchParams(window.location.search);
  var intent = params.get('intent');
  if (intent && document.getElementById('intentField')) {
    document.getElementById('intentField').value = intent;
  }
})();
