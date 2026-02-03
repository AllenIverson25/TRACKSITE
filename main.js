/**
 * Main site JS: preloader, scroll reveal, back-to-top.
 * No console errors; minimal and performant.
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  /* ---------- Preloader ---------- */
  function initPreloader() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    function hidePreloader() {
      preloader.classList.add('hidden');
      setTimeout(function () {
        preloader.style.display = 'none';
      }, 500);
    }

    if (document.readyState === 'complete') {
      hidePreloader();
    } else {
      window.addEventListener('load', hidePreloader);
      // Fallback: hide after 3s if load event doesn’t fire
      setTimeout(hidePreloader, 3000);
    }
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { rootMargin: '0px 0px -50px 0px', threshold: 0.01 }
    );

    els.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Scroll progress bar ---------- */
  function initScrollProgress() {
    var progress = document.getElementById('scrollProgress');
    var bar = document.getElementById('scrollProgressBar');
    if (!progress || !bar) return;

    function updateProgress() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (y > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  ready(function () {
    initPreloader();
    initReveal();
    initScrollProgress();
    initBackToTop();
  });
})();
