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
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

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
})();

// Mark external links for assistive tech when missing.
(function(){
  document.querySelectorAll('a[target="_blank"]').forEach(function(a){
    var rel = (a.getAttribute('rel') || '').toLowerCase();
    if (rel.indexOf('noopener') === -1 || rel.indexOf('noreferrer') === -1) {
      a.setAttribute('rel', 'noopener noreferrer');
    }
    if (!a.querySelector('.visually-hidden')) {
      var tip = document.createElement('span');
      tip.className = 'visually-hidden';
      tip.textContent = ' (si apre in una nuova scheda)';
      a.appendChild(tip);
    }
  });
})();
