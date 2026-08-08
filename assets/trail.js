/* The Crest Guild — rank trail UI */
(function(){
  var staticEl = document.getElementById('rankStaticContent');
  if (staticEl) staticEl.style.display = 'none';

  var RANKS = [
    {
      id: 0, tag: "Punto di partenza", label: "In Scuola", state: "done",
      title: "In Scuola", stateLabel: "Fuori dalla Gilda",
      desc: "Lavori solo tramite la scuola sci: clienti, tariffe e calendario decisi da altri. È il punto da cui parte chiunque entri in Gilda.",
      items: ["Nessun cliente proprio", "Tariffa fissata dalla scuola", "Calendario deciso da altri", "Zero rischio, zero indipendenza"]
    },
    {
      id: 1, tag: "Rango I", label: "Base Camp", state: "done",
      title: "Base Camp", stateLabel: "Completato",
      desc: "Ammissione in Gilda. Prima diagnosi onesta: quanto dipendi oggi dalla scuola, che asset hai già, dove puoi davvero iniziare a scalare.",
      items: ["Colloquio d'ingresso in Gilda", "Valutazione asset attuali", "Piano di risalita personalizzato", "Accesso alla community dei maestri"]
    },
    {
      id: 2, tag: "Rango II", label: "Fondamenta", state: "current",
      title: "Fondamenta", stateLabel: "In corso",
      desc: "Costruisci l'infrastruttura che serve per poter dire sì a un cliente diretto: senza questo, l'indipendenza resta solo un'idea.",
      items: ["P.IVA attiva", "Assicurazione professionale", "Sistema di prenotazione tuo", "Listino prezzi personale"]
    },
    {
      id: 3, tag: "Rango III", label: "Cordata", state: "locked",
      title: "Cordata", stateLabel: "Da raggiungere",
      desc: "Legati sulla stessa corda, ma ognuno con la propria linea: lavori ancora con la scuola, ma inizi a prendere clienti diretti in parallelo.",
      items: ["Primi clienti diretti", "Reputazione propria (recensioni, passaparola)", "Gestione doppio canale", "Primi confronti di prezzo reali"]
    },
    {
      id: 4, tag: "Rango IV", label: "Vetta", state: "locked",
      title: "Vetta", stateLabel: "Rango finale",
      desc: "Indipendenza reale: il flusso di clienti diretti basta a reggere l'attività. Da qui puoi anche rientrare in Gilda come mentore.",
      items: ["Flusso diretto sufficiente", "Validazione di un mentore della Gilda", "Possibilità di diventare mentore", "Nome e reputazione indipendenti dalla scuola"]
    }
  ];

  var nodesEl = document.getElementById('trailNodes');
  var detailEl = document.getElementById('trailDetail');
  var fgEl = document.getElementById('trailFg');
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
    requestAnimationFrame(function(){ fgEl.style.width = pct + '%'; });
  }

  function showDetail(id){
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
  }

  showDetail(2);

  var params = new URLSearchParams(window.location.search);
  var intent = params.get('intent');
  if (intent && document.getElementById('intentField')) {
    document.getElementById('intentField').value = intent;
  }
})();
