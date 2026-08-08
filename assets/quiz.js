/* The Crest Guild — placement quiz */
(function () {
  var staticEl = document.getElementById('quizStaticContent');
  if (staticEl) staticEl.style.display = 'none';

  var RANKS = [
    { label: "In Scuola", title: "In Scuola", desc: "Lavori solo tramite la scuola sci: clienti, tariffe e calendario decisi da altri." },
    { label: "Base Camp", title: "Base Camp", desc: "Hai fatto il primo passo, ma le fondamenta per lavorare in proprio non ci sono ancora." },
    { label: "Fondamenta", title: "Fondamenta", desc: "Hai già alcuni pezzi dell'infrastruttura (P.IVA, sistema di prenotazione) ma non tutti." },
    { label: "Cordata", title: "Cordata", desc: "Lavori già in parallelo tra scuola e clienti diretti: sei a metà del guado." },
    { label: "Vetta", title: "Vetta", desc: "I clienti diretti bastano già a reggere l'attività: l'indipendenza è vicina o reale." }
  ];

  var QUESTIONS = [
    {
      q: "Hai la P.IVA attiva?",
      options: [
        { label: "No, non ancora", points: 0 },
        { label: "Sì, è attiva", points: 1 }
      ]
    },
    {
      q: "Hai un sistema di prenotazione tuo, separato da quello della scuola?",
      options: [
        { label: "No, uso solo quello della scuola", points: 0 },
        { label: "Sì, ne ho uno mio (anche solo WhatsApp/calendario personale)", points: 1 }
      ]
    },
    {
      q: "Hai già avuto almeno un cliente che ti ha prenotato direttamente?",
      options: [
        { label: "No, mai", points: 0 },
        { label: "Sì, qualche volta", points: 1 }
      ]
    },
    {
      q: "I clienti diretti, da soli, basterebbero a coprire le tue spese?",
      options: [
        { label: "No, per niente", points: 0 },
        { label: "Sì, o quasi", points: 1 }
      ]
    },
    {
      q: "Cosa vuoi ottenere nei prossimi 12 mesi?",
      goalQuestion: true,
      options: [
        { label: "Capire chiaramente da dove partire", goal: "chiarezza" },
        { label: "Uscire completamente dal modello scuola", goal: "indipendenza" },
        { label: "Diventare mentore per altri maestri", goal: "mentore" }
      ]
    }
  ];

  var state = { step: 0, score: 0, goal: null, answers: [], startRank: 0, trackedStart: false };
  var body = document.getElementById('quizBody');
  var progress = document.getElementById('quizProgress');
  var progressBar = document.getElementById('quizProgressBar');
  if (!body || !progress || !progressBar) return;

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'className') node.className = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k === 'htmlFor') node.htmlFor = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (typeof c === 'string') node.appendChild(document.createTextNode(c));
      else if (c) node.appendChild(c);
    });
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function shieldSvg() {
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
    svg.appendChild(p1);
    svg.appendChild(p2);
    return svg;
  }

  function setProgress(pct) {
    progress.style.width = pct + '%';
    progressBar.setAttribute('aria-valuenow', String(Math.round(pct)));
  }

  function renderQuestion() {
    if (!state.trackedStart) {
      state.trackedStart = true;
      if (window.crestTrack) window.crestTrack('quiz_start', {});
    }

    var total = QUESTIONS.length;
    setProgress((state.step / total) * 100);
    var qd = QUESTIONS[state.step];
    var selected = state.answers[state.step];
    clear(body);

    body.appendChild(el('div', { className: 'quiz-step-label', id: 'quizStepLabel', text: 'Domanda ' + (state.step + 1) + ' di ' + total }));

    var qWrap = el('div', { className: 'quiz-question' });
    qWrap.appendChild(el('h2', { id: 'quizQuestionTitle', text: qd.q }));
    var opts = el('div', { className: 'quiz-options', role: 'radiogroup', 'aria-labelledby': 'quizQuestionTitle' });
    qd.options.forEach(function (opt, i) {
      var isSel = selected === i;
      var btn = el('button', {
        type: 'button',
        className: 'quiz-option' + (isSel ? ' is-selected' : ''),
        role: 'radio',
        'aria-checked': String(isSel),
        'data-i': String(i)
      }, [el('span', { text: opt.label }), el('span', { className: 'dot', 'aria-hidden': 'true' })]);
      btn.addEventListener('click', function () {
        state.answers[state.step] = i;
        renderQuestion();
      });
      opts.appendChild(btn);
    });
    qWrap.appendChild(opts);
    body.appendChild(qWrap);

    var nav = el('div', { className: 'quiz-nav' });
    var back = el('button', { type: 'button', className: 'quiz-back', id: 'qBack', text: '← Indietro' });
    if (state.step === 0) back.disabled = true;
    back.addEventListener('click', function () {
      if (state.step > 0) {
        state.step--;
        renderQuestion();
      }
    });
    var next = el('button', {
      type: 'button',
      className: 'quiz-next' + (selected !== undefined ? ' is-ready' : ''),
      id: 'qNext',
      text: state.step === total - 1 ? 'Vedi il risultato' : 'Avanti'
    });
    if (selected === undefined) next.disabled = true;
    next.addEventListener('click', function () {
      if (state.answers[state.step] === undefined) return;
      if (state.step === total - 1) prepareResult();
      else {
        state.step++;
        renderQuestion();
      }
    });
    nav.appendChild(back);
    nav.appendChild(next);
    body.appendChild(nav);
  }

  function prepareResult() {
    var score = 0;
    var goal = null;
    QUESTIONS.forEach(function (qd, idx) {
      var ans = qd.options[state.answers[idx]];
      if (qd.goalQuestion) goal = ans.goal;
      else score += ans.points;
    });
    state.score = score;
    state.goal = goal;
    state.startRank = Math.min(score, 4);
    if (window.crestTrack) {
      window.crestTrack('quiz_complete', {
        rank: RANKS[state.startRank].title,
        goal: goal || '',
        score: score
      });
    }
    renderLeadGate();
  }

  function renderLeadGate() {
    setProgress(95);
    clear(body);
    var wrap = el('div', { className: 'quiz-result' });
    wrap.appendChild(el('span', { className: 'eyebrow', text: 'Quasi fatto', style: 'justify-content:center;' }));
    wrap.appendChild(el('h2', { text: 'Dove inviarti il posizionamento?', style: 'margin-top:14px;' }));
    wrap.appendChild(el('p', {
      className: 'result-sub',
      text: 'Lascia l’email per vedere il rango di partenza e ricevere il prossimo passo. Nessuna newsletter automatica in questo passo.'
    }));

    var form = el('form', { className: 'crest-form', id: 'quizLeadForm', novalidate: '', style: 'margin-top:28px;' });
    form.appendChild(el('input', { type: 'hidden', name: '_subject', value: 'Quiz lead The Crest Guild' }));
    form.appendChild(el('input', { type: 'hidden', name: 'rank', value: RANKS[state.startRank].title }));
    form.appendChild(el('input', { type: 'hidden', name: 'goal', value: state.goal || '' }));
    form.appendChild(el('input', { type: 'hidden', name: 'score', value: String(state.score) }));

    var hp = el('div', { className: 'hp-field', 'aria-hidden': 'true' });
    hp.appendChild(el('label', { htmlFor: 'gotchaQuiz', text: 'Non compilare' }));
    hp.appendChild(el('input', { type: 'text', name: '_gotcha', id: 'gotchaQuiz', tabindex: '-1', autocomplete: 'off' }));
    form.appendChild(hp);

    var nameField = el('div', { className: 'field' });
    var nameLabel = el('label', { htmlFor: 'quizName' });
    nameLabel.appendChild(document.createTextNode('Nome '));
    nameLabel.appendChild(el('span', { className: 'hint', text: '(opzionale)' }));
    nameField.appendChild(nameLabel);
    nameField.appendChild(el('input', { id: 'quizName', name: 'name', type: 'text', autocomplete: 'name' }));
    form.appendChild(nameField);

    var emailField = el('div', { className: 'field' });
    emailField.appendChild(el('label', { htmlFor: 'quizEmail', text: 'Email' }));
    emailField.appendChild(el('input', { id: 'quizEmail', name: 'email', type: 'email', autocomplete: 'email', required: '' }));
    form.appendChild(emailField);

    form.appendChild(el('button', { className: 'btn btn-primary', type: 'submit', text: 'Mostra il mio rango' }));
    var statusEl = el('div', { className: 'form-status', id: 'quizLeadStatus', hidden: '', 'aria-live': 'polite' });
    form.appendChild(statusEl);
    wrap.appendChild(form);
    body.appendChild(wrap);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('[name="email"]');
      if (!email.checkValidity()) {
        email.setAttribute('aria-invalid', 'true');
        statusEl.hidden = false;
        statusEl.className = 'form-status is-error';
        statusEl.textContent = 'Inserisci un’email valida.';
        email.focus();
        return;
      }
      email.removeAttribute('aria-invalid');
      var cfg = window.CREST_CONFIG || {};
      var submitBtn = form.querySelector('[type="submit"]');
      window.crestSubmitFormspree({
        form: form,
        formId: cfg.FORMSPREE_QUIZ_LEAD,
        statusEl: statusEl,
        submitBtn: submitBtn,
        trackName: 'lead_submit',
        trackParams: { form_name: 'quiz-lead', rank: RANKS[state.startRank].title },
        successMessage: 'Grazie — ecco il tuo posizionamento.',
        onSuccess: function () { showResult(); }
      }).then(function (ok) {
        if (!ok && cfg.FORMSPREE_QUIZ_LEAD && String(cfg.FORMSPREE_QUIZ_LEAD).indexOf('REPLACE_') === 0) {
          showResult();
        }
      });
    });
    document.getElementById('quizEmail').focus();
  }

  function showResult() {
    var startRank = state.startRank;
    var goalMsg = {
      chiarezza: 'Il tuo prossimo passo è consolidare il rango in cui sei — niente fretta, prima le fondamenta.',
      indipendenza: 'Il percorso verso Vetta è chiaro: ogni rango successivo ti toglie un pezzo di dipendenza dalla scuola.',
      mentore: 'Una volta a Vetta, la Gilda ti apre la strada per diventare mentore di chi sale dietro di te.'
    }[state.goal] || '';

    setProgress(100);
    clear(body);

    var wrap = el('div', { className: 'quiz-result' });
    wrap.appendChild(el('span', { className: 'eyebrow', text: 'Il tuo risultato', style: 'justify-content:center;' }));
    var title = el('h2', { id: 'quizResultTitle', text: 'Parti da: ' + RANKS[startRank].title, style: 'margin-top:14px;', tabindex: '-1' });
    wrap.appendChild(title);
    wrap.appendChild(el('p', { className: 'result-sub', text: RANKS[startRank].desc }));

    var seals = el('div', { className: 'result-seals', 'aria-hidden': 'true' });
    RANKS.forEach(function (r, i) {
      var cls = i < startRank ? 'is-done' : i === startRank ? 'is-current' : 'is-locked';
      var col = el('div', { style: 'text-align:center;' });
      var seal = el('span', { className: 'trail-seal ' + cls, style: 'margin:0 auto;' });
      seal.appendChild(shieldSvg());
      col.appendChild(seal);
      col.appendChild(el('div', { text: r.label, style: 'font-size:10.5px; color:var(--text-dim2); margin-top:8px; font-weight:600;' }));
      seals.appendChild(col);
    });
    wrap.appendChild(seals);

    var cards = el('div', { className: 'quiz-result-cards' });
    var c1 = el('div', { className: 'card' });
    c1.appendChild(el('span', { className: 'tag', text: 'Il tuo obiettivo' }));
    c1.appendChild(el('h3', { text: goalMsg, style: 'font-size:18px; margin-top:10px;' }));
    var c2 = el('div', { className: 'card' });
    c2.appendChild(el('span', { className: 'tag', text: 'Prossimo passo' }));
    c2.appendChild(el('h3', {
      text: 'Vedi in dettaglio cosa serve per il rango ' + RANKS[Math.min(startRank + 1, 4)].title + '.',
      style: 'font-size:18px; margin-top:10px;'
    }));
    cards.appendChild(c1);
    cards.appendChild(c2);
    wrap.appendChild(cards);

    var applyHref = 'pathways.html?rank=' + encodeURIComponent(RANKS[startRank].title) + '#candidati';
    var actions = el('div', { className: 'hero-actions', style: 'justify-content:center; margin-top:8px;' });
    actions.appendChild(el('a', {
      className: 'btn btn-primary',
      href: applyHref,
      'data-track': 'cta_click',
      text: 'Candidati da ' + RANKS[startRank].title
    }));
    actions.appendChild(el('a', {
      className: 'btn btn-outline',
      href: 'pathways.html',
      'data-track': 'cta_click',
      text: 'Scopri i Ranghi'
    }));
    wrap.appendChild(actions);
    body.appendChild(wrap);
    title.focus();
  }

  renderQuestion();
})();
