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
    window.gtag('config', id, { anonymize_ip: true });
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
    var payload = params || {};
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

  function hideBanner(banner) {
    if (banner) banner.hidden = true;
  }

  function buildBanner() {
    var banner = document.createElement('div');
    banner.id = 'consentBanner';
    banner.className = 'consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'consentTitle');
    banner.setAttribute('aria-live', 'polite');

    var title = document.createElement('p');
    title.id = 'consentTitle';
    title.style.color = 'var(--ivory)';
    title.style.fontWeight = '600';
    title.style.marginBottom = '8px';
    title.textContent = 'Cookie e misurazione';

    var body = document.createElement('p');
    body.appendChild(document.createTextNode(
      'Usiamo Google Analytics per capire come migliorare il sito. Nessuna pubblicità. Puoi accettare o rifiutare: senza consenso non partono cookie di misurazione. '
    ));
    var priv = document.createElement('a');
    priv.className = 'text-link';
    priv.href = 'privacy.html';
    priv.textContent = 'Privacy policy';
    body.appendChild(priv);

    var actions = document.createElement('div');
    actions.className = 'consent-actions';

    var accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'btn btn-primary';
    accept.textContent = 'Accetta';
    accept.addEventListener('click', function () {
      writeConsent('granted');
      grantAnalytics();
      hideBanner(banner);
    });

    var reject = document.createElement('button');
    reject.type = 'button';
    reject.className = 'btn btn-outline';
    reject.textContent = 'Rifiuta';
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
