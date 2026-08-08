/* The Crest Guild — placement quiz */
(function () {
  var staticEl = document.getElementById('quizStaticContent');
  if (staticEl) staticEl.style.display = 'none';

  var lang = (document.documentElement.lang || 'it').slice(0, 2).toLowerCase();
  if (lang !== 'en' && lang !== 'fr') lang = 'it';

  var LOCALE = {
    it: {
      ranks: [
        { label: "In Scuola", title: "In Scuola", desc: "Lavori solo tramite la scuola sci: clienti, tariffe e calendario decisi da altri." },
        { label: "Base Camp", title: "Base Camp", desc: "Hai fatto il primo passo, ma le fondamenta per lavorare in proprio non ci sono ancora." },
        { label: "Fondamenta", title: "Fondamenta", desc: "Hai già alcuni pezzi dell'infrastruttura (P.IVA, sistema di prenotazione) ma non tutti." },
        { label: "Cordata", title: "Cordata", desc: "Lavori già in parallelo tra scuola e clienti diretti: sei a metà del guado." },
        { label: "Vetta", title: "Vetta", desc: "I clienti diretti bastano già a reggere l'attività: l'indipendenza è vicina o reale." }
      ],
      questions: [
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
      ],
      ui: {
        questionOf: function (n, tot) { return 'Domanda ' + n + ' di ' + tot; },
        back: '← Indietro',
        next: 'Avanti',
        seeResult: 'Vedi il risultato',
        almostDone: 'Quasi fatto',
        whereSend: 'Dove inviarti il posizionamento?',
        leadSub: 'Lascia l’email per vedere il rango di partenza e ricevere il prossimo passo. Nessuna newsletter automatica in questo passo.',
        doNotFill: 'Non compilare',
        name: 'Nome ',
        optional: '(opzionale)',
        email: 'Email',
        showRank: 'Mostra il mio rango',
        invalidEmail: 'Inserisci un’email valida.',
        thanks: 'Grazie. Ecco il tuo posizionamento.',
        yourResult: 'Il tuo risultato',
        startFrom: 'Parti da: ',
        yourGoal: 'Il tuo obiettivo',
        nextStep: 'Prossimo passo',
        seeDetail: function (rank) { return 'Vedi in dettaglio cosa serve per il rango ' + rank + '.'; },
        applyFrom: function (rank) { return 'Candidati da ' + rank; },
        seeRanks: 'Scopri i Ranghi',
        goalMsg: {
          chiarezza: 'Il prossimo passo è consolidare il rango in cui sei. Niente fretta: prima le fondamenta.',
          indipendenza: 'Il percorso verso Vetta è chiaro. Ogni rango successivo ti toglie un pezzo di dipendenza dalla scuola.',
          mentore: 'Una volta a Vetta, la Gilda ti apre la strada per diventare mentore di chi sale dietro di te.'
        }
      }
    },
    en: {
      ranks: [
        { label: "In School", title: "In School", desc: "You work only through the ski school: clients, rates, and schedule decided by others." },
        { label: "Base Camp", title: "Base Camp", desc: "You've taken the first step, but the foundations for working on your own aren't there yet." },
        { label: "Foundations", title: "Foundations", desc: "You already have some pieces of the infrastructure (business registration, booking system) but not all of them." },
        { label: "Rope Team", title: "Rope Team", desc: "You're already working in parallel between the school and direct clients: you're halfway there." },
        { label: "Summit", title: "Summit", desc: "Direct clients already sustain the business: independence is close or already real." }
      ],
      questions: [
        {
          q: "Do you have an active business registration?",
          options: [
            { label: "No, not yet", points: 0 },
            { label: "Yes, it's active", points: 1 }
          ]
        },
        {
          q: "Do you have your own booking system, separate from the school's?",
          options: [
            { label: "No, I only use the school's", points: 0 },
            { label: "Yes, I have my own (even just WhatsApp/personal calendar)", points: 1 }
          ]
        },
        {
          q: "Have you ever had at least one client book you directly?",
          options: [
            { label: "No, never", points: 0 },
            { label: "Yes, a few times", points: 1 }
          ]
        },
        {
          q: "Would direct clients alone be enough to cover your expenses?",
          options: [
            { label: "No, not at all", points: 0 },
            { label: "Yes, or almost", points: 1 }
          ]
        },
        {
          q: "What do you want to achieve in the next 12 months?",
          goalQuestion: true,
          options: [
            { label: "Get clear on where to start", goal: "chiarezza" },
            { label: "Fully move away from the school model", goal: "indipendenza" },
            { label: "Become a mentor for other instructors", goal: "mentore" }
          ]
        }
      ],
      ui: {
        questionOf: function (n, tot) { return 'Question ' + n + ' of ' + tot; },
        back: '← Back',
        next: 'Next',
        seeResult: 'See your result',
        almostDone: 'Almost done',
        whereSend: 'Where should we send your placement?',
        leadSub: 'Leave your email to see your starting rank and get the next step. No automatic newsletter at this step.',
        doNotFill: 'Do not fill',
        name: 'Name ',
        optional: '(optional)',
        email: 'Email',
        showRank: 'Show my rank',
        invalidEmail: 'Please enter a valid email.',
        thanks: 'Thanks. Here is your placement.',
        yourResult: 'Your result',
        startFrom: "You're starting from: ",
        yourGoal: 'Your goal',
        nextStep: 'Next step',
        seeDetail: function (rank) { return 'See in detail what it takes to reach ' + rank + '.'; },
        applyFrom: function (rank) { return 'Apply from ' + rank; },
        seeRanks: 'See the Ranks',
        goalMsg: {
          chiarezza: "Your next step is consolidating the rank you're at. No rush: foundations first.",
          indipendenza: 'The path to the Summit is clear. Each rank strips away a piece of your dependence on the school.',
          mentore: 'Once at the Summit, the Guild opens the way for you to become a mentor for those climbing behind you.'
        }
      }
    },
    fr: {
      ranks: [
        { label: "À l'École", title: "À l'École", desc: "Vous travaillez uniquement via l'école de ski : clients, tarifs et planning décidés par d'autres." },
        { label: "Camp de Base", title: "Camp de Base", desc: "Vous avez fait le premier pas, mais les fondations pour travailler à votre compte ne sont pas encore là." },
        { label: "Fondations", title: "Fondations", desc: "Vous avez déjà quelques éléments de l'infrastructure (immatriculation, système de réservation) mais pas tous." },
        { label: "Cordée", title: "Cordée", desc: "Vous travaillez déjà en parallèle entre l'école et les clients directs : vous êtes à mi-chemin." },
        { label: "Sommet", title: "Sommet", desc: "Les clients directs suffisent déjà à faire vivre l'activité : l'indépendance est proche ou déjà réelle." }
      ],
      questions: [
        {
          q: "Avez-vous une immatriculation professionnelle active ?",
          options: [
            { label: "Non, pas encore", points: 0 },
            { label: "Oui, elle est active", points: 1 }
          ]
        },
        {
          q: "Avez-vous votre propre système de réservation, distinct de celui de l'école ?",
          options: [
            { label: "Non, j'utilise seulement celui de l'école", points: 0 },
            { label: "Oui, j'ai le mien (même juste WhatsApp/agenda personnel)", points: 1 }
          ]
        },
        {
          q: "Avez-vous déjà eu au moins un client qui vous a réservé directement ?",
          options: [
            { label: "Non, jamais", points: 0 },
            { label: "Oui, quelques fois", points: 1 }
          ]
        },
        {
          q: "Les clients directs, à eux seuls, suffiraient-ils à couvrir vos dépenses ?",
          options: [
            { label: "Non, pas du tout", points: 0 },
            { label: "Oui, ou presque", points: 1 }
          ]
        },
        {
          q: "Que voulez-vous atteindre dans les 12 prochains mois ?",
          goalQuestion: true,
          options: [
            { label: "Comprendre clairement par où commencer", goal: "chiarezza" },
            { label: "Sortir complètement du modèle école", goal: "indipendenza" },
            { label: "Devenir mentor pour d'autres moniteurs", goal: "mentore" }
          ]
        }
      ],
      ui: {
        questionOf: function (n, tot) { return 'Question ' + n + ' sur ' + tot; },
        back: '← Retour',
        next: 'Suivant',
        seeResult: 'Voir le résultat',
        almostDone: 'Presque terminé',
        whereSend: 'Où vous envoyer le positionnement ?',
        leadSub: 'Laissez votre email pour voir votre rang de départ et recevoir la prochaine étape. Pas de newsletter automatique à cette étape.',
        doNotFill: 'Ne pas remplir',
        name: 'Nom ',
        optional: '(facultatif)',
        email: 'Email',
        showRank: 'Afficher mon rang',
        invalidEmail: 'Veuillez entrer un email valide.',
        thanks: 'Merci. Voici votre positionnement.',
        yourResult: 'Votre résultat',
        startFrom: 'Vous partez de : ',
        yourGoal: 'Votre objectif',
        nextStep: 'Prochaine étape',
        seeDetail: function (rank) { return 'Voir en détail ce qu\'il faut pour atteindre le rang ' + rank + '.'; },
        applyFrom: function (rank) { return 'Candidater depuis ' + rank; },
        seeRanks: 'Voir les Rangs',
        goalMsg: {
          chiarezza: 'Votre prochaine étape est de consolider le rang où vous êtes. Pas de précipitation : les fondations d\'abord.',
          indipendenza: 'Le chemin vers le Sommet est clair. Chaque rang suivant vous enlève une part de dépendance à l\'école.',
          mentore: 'Une fois au Sommet, la Guilde vous ouvre la voie pour devenir mentor de ceux qui grimpent derrière vous.'
        }
      }
    }
  };

  var pack = LOCALE[lang];
  var RANKS = pack.ranks;
  var QUESTIONS = pack.questions;
  var UI = pack.ui;

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

    body.appendChild(el('div', { className: 'quiz-step-label', id: 'quizStepLabel', text: UI.questionOf(state.step + 1, total) }));

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
    var back = el('button', { type: 'button', className: 'quiz-back', id: 'qBack', text: UI.back });
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
      text: state.step === total - 1 ? UI.seeResult : UI.next
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
    wrap.appendChild(el('span', { className: 'eyebrow', text: UI.almostDone, style: 'justify-content:center;' }));
    wrap.appendChild(el('h2', { text: UI.whereSend, style: 'margin-top:14px;' }));
    wrap.appendChild(el('p', {
      className: 'result-sub',
      text: UI.leadSub
    }));

    var form = el('form', { className: 'crest-form', id: 'quizLeadForm', novalidate: '', style: 'margin-top:28px;' });
    form.appendChild(el('input', { type: 'hidden', name: '_subject', value: 'Quiz lead The Crest Guild' }));
    form.appendChild(el('input', { type: 'hidden', name: 'rank', value: RANKS[state.startRank].title }));
    form.appendChild(el('input', { type: 'hidden', name: 'goal', value: state.goal || '' }));
    form.appendChild(el('input', { type: 'hidden', name: 'score', value: String(state.score) }));
    form.appendChild(el('input', { type: 'hidden', name: 'language', value: lang }));

    var hp = el('div', { className: 'hp-field', 'aria-hidden': 'true' });
    hp.appendChild(el('label', { htmlFor: 'gotchaQuiz', text: UI.doNotFill }));
    hp.appendChild(el('input', { type: 'text', name: '_gotcha', id: 'gotchaQuiz', tabindex: '-1', autocomplete: 'off' }));
    form.appendChild(hp);

    var nameField = el('div', { className: 'field' });
    var nameLabel = el('label', { htmlFor: 'quizName' });
    nameLabel.appendChild(document.createTextNode(UI.name));
    nameLabel.appendChild(el('span', { className: 'hint', text: UI.optional }));
    nameField.appendChild(nameLabel);
    nameField.appendChild(el('input', { id: 'quizName', name: 'name', type: 'text', autocomplete: 'name' }));
    form.appendChild(nameField);

    var emailField = el('div', { className: 'field' });
    emailField.appendChild(el('label', { htmlFor: 'quizEmail', text: UI.email }));
    emailField.appendChild(el('input', { id: 'quizEmail', name: 'email', type: 'email', autocomplete: 'email', required: '' }));
    form.appendChild(emailField);

    form.appendChild(el('button', { className: 'btn btn-primary', type: 'submit', text: UI.showRank }));
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
        statusEl.textContent = UI.invalidEmail;
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
        successMessage: UI.thanks,
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
    var goalMsg = UI.goalMsg[state.goal] || '';

    setProgress(100);
    clear(body);

    var wrap = el('div', { className: 'quiz-result' });
    wrap.appendChild(el('span', { className: 'eyebrow', text: UI.yourResult, style: 'justify-content:center;' }));
    var title = el('h2', { id: 'quizResultTitle', text: UI.startFrom + RANKS[startRank].title, style: 'margin-top:14px;', tabindex: '-1' });
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
    c1.appendChild(el('span', { className: 'tag', text: UI.yourGoal }));
    c1.appendChild(el('h3', { text: goalMsg, style: 'font-size:18px; margin-top:10px;' }));
    var c2 = el('div', { className: 'card' });
    c2.appendChild(el('span', { className: 'tag', text: UI.nextStep }));
    c2.appendChild(el('h3', {
      text: UI.seeDetail(RANKS[Math.min(startRank + 1, 4)].title),
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
      text: UI.applyFrom(RANKS[startRank].title)
    }));
    actions.appendChild(el('a', {
      className: 'btn btn-outline',
      href: 'pathways.html',
      'data-track': 'cta_click',
      text: UI.seeRanks
    }));
    wrap.appendChild(actions);
    body.appendChild(wrap);
    title.focus();
  }

  renderQuestion();
})();
