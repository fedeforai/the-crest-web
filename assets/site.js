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

  function close(){
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('intro-lock');
  }
  function open(){
    panel.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('intro-lock');
  }

  toggle.addEventListener('click', function(){
    var isOpen = panel.classList.contains('is-open');
    if (isOpen) close(); else open();
  });
  panel.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', close);
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') close();
  });
})();
