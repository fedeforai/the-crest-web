/* The Crest Guild — GA4 + Consent Mode v2 */
(function () {
  var cfg = window.CREST_CONFIG || {};
  var id = cfg.GA4_MEASUREMENT_ID || '';
  var enabled = id && id.indexOf('XXXXXXXX') === -1;
  var STORAGE_KEY = 'crest_consent_v1';

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  // Consent Mode v2 defaults — denied until opt-in
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });

  var gtagLoaded = false;

  function loadGtag() {
    if (!enabled || gtagLoaded) return;
    gtagLoaded = true;
    window.gtag('js', new Date());
    window.gtag('config', id, {
      anonymize_ip: true,
      language: (document.documentElement.lang || 'it').slice(0, 2).toLowerCase()
    });
    if (typeof window.crestTrack === 'function') {
      window.crestTrack('page_view', {
        language: (document.documentElement.lang || 'it').slice(0, 2).toLowerCase(),
        page_path: location.pathname
      });
    }
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
  }

  function grantAnalytics() {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted'
    });
    loadGtag();
  }

  function denyAnalytics() {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied'
    });
  }

  window.crestTrack = function (eventName, params) {
    var payload = Object.assign({
      language: (document.documentElement.lang || 'it').slice(0, 2).toLowerCase()
    }, params || {});
    if (!enabled) {
      if (typeof console !== 'undefined' && console.debug) {
        console.debug('[crestTrack]', eventName, payload);
      }
      return;
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }
  };

  function readConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function writeConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) { /* ignore */ }
  }

  function clearConsentSpace() {
    document.body.classList.remove('consent-open');
    document.documentElement.style.removeProperty('--consent-offset');
  }

  function syncConsentSpace(banner) {
    if (!banner || banner.hidden || !banner.isConnected) {
      clearConsentSpace();
      return;
    }
    document.body.classList.add('consent-open');
    var rect = banner.getBoundingClientRect();
    var gap = 24;
    var offset = Math.max(96, Math.ceil(window.innerHeight - rect.top + gap));
    document.documentElement.style.setProperty('--consent-offset', offset + 'px');
  }

  function hideBanner(banner) {
    if (banner) {
      banner.hidden = true;
      if (banner._consentRO) {
        banner._consentRO.disconnect();
        banner._consentRO = null;
      }
    }
    clearConsentSpace();
  }

  function watchConsentSpace(banner) {
    function measure() { syncConsentSpace(banner); }
    measure();
    requestAnimationFrame(measure);
    if (typeof ResizeObserver === 'function') {
      var ro = new ResizeObserver(measure);
      ro.observe(banner);
      banner._consentRO = ro;
    }
    window.addEventListener('resize', function onResize() {
      if (!banner.isConnected || banner.hidden) {
        window.removeEventListener('resize', onResize);
        return;
      }
      measure();
    });
  }

  function consentCopy() {
    var lang = (document.documentElement.lang || 'it').slice(0, 2).toLowerCase();
    var packs = {
      it: {
        title: 'Cookie e misurazione',
        body: 'Usiamo Google Analytics per capire come migliorare il sito. Nessuna pubblicità. Puoi accettare o rifiutare: senza consenso non partono cookie di misurazione. ',
        policy: 'Cookie policy',
        accept: 'Accetta',
        reject: 'Rifiuta'
      },
      en: {
        title: 'Cookies and measurement',
        body: 'We use Google Analytics to understand how to improve the site. No ads. You can accept or refuse: without consent, measurement cookies do not run. ',
        policy: 'Cookie policy',
        accept: 'Accept',
        reject: 'Refuse'
      },
      fr: {
        title: 'Cookies et mesure',
        body: 'Nous utilisons Google Analytics pour comprendre comment améliorer le site. Pas de publicité. Vous pouvez accepter ou refuser : sans consentement, aucun cookie de mesure. ',
        policy: 'Politique cookies',
        accept: 'Accepter',
        reject: 'Refuser'
      }
    };
    return packs[lang] || packs.it;
  }

  function buildBanner() {
    var copy = consentCopy();
    var banner = document.createElement('div');
    banner.id = 'consentBanner';
    banner.className = 'consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'consentTitle');
    banner.setAttribute('aria-live', 'polite');

    var title = document.createElement('p');
    title.id = 'consentTitle';
    title.style.color = 'var(--text)';
    title.style.fontWeight = '600';
    title.textContent = copy.title;

    var body = document.createElement('p');
    body.appendChild(document.createTextNode(copy.body));
    var priv = document.createElement('a');
    priv.className = 'text-link';
    var pathParts = (location.pathname || '').split('/').filter(Boolean);
    var assetPrefix = (pathParts[0] === 'en' || pathParts[0] === 'fr') ? '../' : '';
    priv.href = assetPrefix + 'cookies.html';
    priv.textContent = copy.policy;
    body.appendChild(priv);

    var actions = document.createElement('div');
    actions.className = 'consent-actions';

    var accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'btn btn-primary';
    accept.textContent = copy.accept;
    accept.addEventListener('click', function () {
      writeConsent('granted');
      grantAnalytics();
      hideBanner(banner);
    });

    var reject = document.createElement('button');
    reject.type = 'button';
    reject.className = 'btn btn-outline';
    reject.textContent = copy.reject;
    reject.addEventListener('click', function () {
      writeConsent('denied');
      denyAnalytics();
      hideBanner(banner);
    });

    actions.appendChild(accept);
    actions.appendChild(reject);
    banner.appendChild(title);
    banner.appendChild(body);
    banner.appendChild(actions);
    document.body.appendChild(banner);
    watchConsentSpace(banner);
    return banner;
  }

  function initConsent() {
    if (!enabled) return;
    var stored = readConsent();
    if (stored === 'granted') {
      grantAnalytics();
      return;
    }
    if (stored === 'denied') {
      denyAnalytics();
      return;
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', buildBanner);
    } else {
      buildBanner();
    }
  }

  // Cookie settings link in footer — clear choice and show banner again
  document.addEventListener('click', function (e) {
    var settings = e.target.closest('[data-cookie-settings]');
    if (!settings) return;
    e.preventDefault();
    try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* ignore */ }
    denyAnalytics();
    var existing = document.getElementById('consentBanner');
    if (existing) {
      hideBanner(existing);
      existing.remove();
    }
    var banner = buildBanner();
    if (banner && banner.scrollIntoView) banner.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });

  // Outbound + data-track clicks (events only fire meaningfully after grant)
  document.addEventListener('click', function (e) {
    var outbound = e.target.closest('a[href*="frostdesk.ai"], a[href*="vaelmont.co.uk"]');
    if (outbound) {
      window.crestTrack('outbound_click', {
        link_url: outbound.getAttribute('href') || '',
        link_text: (outbound.textContent || '').trim().slice(0, 80)
      });
    }
    var el = e.target.closest('[data-track]');
    if (!el) return;
    var name = el.getAttribute('data-track') || 'cta_click';
    window.crestTrack(name, {
      cta_label: (el.textContent || '').trim().slice(0, 80),
      cta_href: el.getAttribute('href') || ''
    });
  });

  initConsent();
})();
