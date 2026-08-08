/* The Crest Guild — Formspree helpers */
(function () {
  function endpoint(formId) {
    if (!formId || formId.indexOf('REPLACE_') === 0) return null;
    return 'https://formspree.io/f/' + formId;
  }

  function setStatus(el, type, message) {
    if (!el) return;
    el.hidden = !message;
    el.className = 'form-status' + (type ? ' is-' + type : '');
    while (el.firstChild) el.removeChild(el.firstChild);
    if (type === 'success') {
      var badge = document.createElement('span');
      badge.className = 'state state-active';
      badge.textContent = 'Inviato';
      el.appendChild(badge);
      el.appendChild(document.createTextNode(' ' + (message || '')));
    } else {
      el.textContent = message || '';
    }
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  }

  function serialize(form) {
    var data = new FormData(form);
    var obj = {};
    data.forEach(function (value, key) {
      obj[key] = value;
    });
    return obj;
  }

  window.crestSubmitFormspree = function (opts) {
    var form = opts.form;
    var formId = opts.formId;
    var statusEl = opts.statusEl;
    var submitBtn = opts.submitBtn;
    var onSuccess = opts.onSuccess;
    var trackName = opts.trackName || 'lead_submit';
    var trackParams = opts.trackParams || {};

    var url = endpoint(formId);
    if (!url) {
      setStatus(
        statusEl,
        'error',
        'Form non configurato: inserisci il Form ID Formspree in assets/config.js.'
      );
      return Promise.resolve(false);
    }

    var gotcha = form.querySelector('[name="_gotcha"]');
    if (gotcha && gotcha.value) {
      return Promise.resolve(true);
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
    }
    setStatus(statusEl, 'pending', 'Invio in corso…');

    return fetch(url, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('submit_failed');
        if (typeof window.crestTrack === 'function') {
          window.crestTrack(trackName, trackParams);
        }
        setStatus(statusEl, 'success', opts.successMessage || 'Richiesta inviata. Ti rispondiamo entro 48 ore.');
        if (onSuccess) onSuccess(serialize(form));
        return true;
      })
      .catch(function () {
        setStatus(
          statusEl,
          'error',
          'Invio non riuscito. Riprova tra poco o scrivici di nuovo.'
        );
        return false;
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
        }
      });
  };

  window.crestInitCandidaturaForm = function () {
    var form = document.getElementById('candidaturaForm');
    if (!form) return;

    var cfg = window.CREST_CONFIG || {};
    var statusEl = document.getElementById('candidaturaStatus');
    var submitBtn = form.querySelector('[type="submit"]');

    var params = new URLSearchParams(window.location.search);
    var rank = params.get('rank');
    var intent = params.get('intent');
    var rankField = form.querySelector('[name="rank"]');
    var intentField = form.querySelector('[name="intent"]');
    if (rank && rankField) rankField.value = rank;
    if (intent && intentField) intentField.value = intent;
    if (rank) {
      var rankSelect = form.querySelector('[name="situazione"]');
      if (rankSelect) {
        var match = null;
        Array.prototype.forEach.call(rankSelect.options, function (o) {
          if (o.value === rank || o.value.toLowerCase() === String(rank).toLowerCase()) match = o.value;
        });
        if (match) rankSelect.value = match;
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('[name="email"]');
      if (email && !email.checkValidity()) {
        email.setAttribute('aria-invalid', 'true');
        setStatus(statusEl, 'error', 'Inserisci un’email valida.');
        email.focus();
        return;
      }
      if (email) email.removeAttribute('aria-invalid');

      window.crestSubmitFormspree({
        form: form,
        formId: cfg.FORMSPREE_CANDIDATURA,
        statusEl: statusEl,
        submitBtn: submitBtn,
        trackName: 'lead_submit',
        trackParams: { form_name: 'candidatura' },
        successMessage: 'Candidatura inviata. Ti rispondiamo entro 48 ore lavorative.',
        onSuccess: function () {
          form.reset();
          if (rank && rankField) rankField.value = rank;
          if (intent && intentField) intentField.value = intent;
        }
      });
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    window.crestInitCandidaturaForm();

    var contact = document.getElementById('footerContact');
    if (contact) {
      var cfg = window.CREST_CONFIG || {};
      if (cfg.CONTACT_EMAIL) {
        contact.href = 'mailto:' + cfg.CONTACT_EMAIL;
        contact.textContent = cfg.CONTACT_EMAIL;
      } else {
        contact.href = 'pathways.html#candidati';
        contact.textContent = 'Candidati via form';
      }
    }
  });
})();
