/* The Crest Guild — GA4 wrapper */
(function () {
  var cfg = window.CREST_CONFIG || {};
  var id = cfg.GA4_MEASUREMENT_ID || '';
  var enabled = id && id.indexOf('XXXXXXXX') === -1;

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

  if (!enabled) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true });

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (!el) return;
    var name = el.getAttribute('data-track') || 'cta_click';
    window.crestTrack(name, {
      cta_label: (el.textContent || '').trim().slice(0, 80),
      cta_href: el.getAttribute('href') || ''
    });
  });
})();
