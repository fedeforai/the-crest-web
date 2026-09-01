// The Crest Guild — shared site behaviours
// Reveal-on-scroll: elements with class="reveal" fade/slide up into view.
(function(){
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px 15% 0px' });

  els.forEach(function(el){ io.observe(el); });
})();

// Mobile nav: hamburger toggle opens a full-screen link panel.
(function(){
  var toggle = document.getElementById('navToggle');
  var panel = document.getElementById('mobileNav');
  if (!toggle || !panel) return;

  var lastFocus = null;

  function close(){
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('intro-lock');
    if (lastFocus) lastFocus.focus();
  }
  function open(){
    lastFocus = document.activeElement;
    panel.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('intro-lock');
    var first = panel.querySelector('a');
    if (first) first.focus();
  }

  toggle.addEventListener('click', function(){
    var isOpen = panel.classList.contains('is-open');
    if (isOpen) close(); else open();
  });
  panel.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', close);
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && panel.classList.contains('is-open')) close();
  });
  // Prevent background scroll when menu is open (iOS-friendly)
  var scrollY = 0;
  var mo = new MutationObserver(function(){
    if (panel.classList.contains('is-open')) {
      scrollY = window.scrollY || 0;
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + scrollY + 'px';
      document.body.style.left = '0';
      document.body.style.right = '0';
    } else if (document.body.style.position === 'fixed') {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      window.scrollTo(0, scrollY);
    }
  });
  mo.observe(panel, { attributes:true, attributeFilter:['class'] });
})();

// Mark external links for assistive tech when missing.
(function(){
  var lang = (document.documentElement.lang || 'it').slice(0, 2).toLowerCase();
  var tipText = {
    it: ' (si apre in una nuova scheda)',
    en: ' (opens in a new tab)',
    fr: ' (s’ouvre dans un nouvel onglet)'
  }[lang] || ' (si apre in una nuova scheda)';

  document.querySelectorAll('a[target="_blank"]').forEach(function(a){
    var rel = (a.getAttribute('rel') || '').toLowerCase();
    if (rel.indexOf('noopener') === -1 || rel.indexOf('noreferrer') === -1) {
      a.setAttribute('rel', 'noopener noreferrer');
    }
    if (!a.querySelector('.visually-hidden')) {
      var tip = document.createElement('span');
      tip.className = 'visually-hidden';
      tip.textContent = tipText;
      a.appendChild(tip);
    }
  });
})();

// Theme toggle: dark default, preference in localStorage.
(function(){
  var KEY = 'crest_theme';

  function currentTheme(){
    var t = document.documentElement.getAttribute('data-theme');
    return t === 'light' ? 'light' : 'dark';
  }

  function setTheme(theme){
    var next = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
    document.querySelectorAll('[data-theme-toggle]').forEach(function(btn){
      var isLight = next === 'light';
      btn.setAttribute('aria-pressed', String(isLight));
      var label = {
        it: isLight ? 'Passa al tema scuro' : 'Passa al tema chiaro',
        en: isLight ? 'Switch to dark theme' : 'Switch to light theme',
        fr: isLight ? 'Passer au thème sombre' : 'Passer au thème clair'
      };
      var lang = (document.documentElement.lang || 'it').slice(0, 2).toLowerCase();
      btn.setAttribute('aria-label', label[lang] || label.it);
    });
  }

  if (!document.documentElement.getAttribute('data-theme')) {
    setTheme('dark');
  } else {
    setTheme(currentTheme());
  }

  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    setTheme(currentTheme() === 'light' ? 'dark' : 'light');
  });
})();
