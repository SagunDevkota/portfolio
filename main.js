/* Sagun Devkota — portfolio interactions
   Progressive enhancement only: the page is fully usable without this file.
   Smooth scrolling is handled in CSS (scroll-behavior + scroll-margin-top). */

(function () {
    'use strict';

    var root = document.documentElement;
    var EMAIL = 'sagundevkota07@gmail.com';

    // Runs immediately (script is in <head>): flag JS and restore a saved theme
    // before first paint. With no saved choice, CSS follows the OS setting.
    root.classList.add('js');

    function getStoredTheme() {
        try { return localStorage.getItem('theme'); } catch (e) { return null; }
    }
    function storeTheme(value) {
        try { localStorage.setItem('theme', value); } catch (e) { /* storage blocked */ }
    }

    var saved = getStoredTheme();
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);

    document.addEventListener('DOMContentLoaded', function () {
        var header = document.getElementById('site-header');
        var navToggle = document.getElementById('nav-toggle');
        var navMenu = document.getElementById('nav-menu');
        var themeToggle = document.getElementById('theme-toggle');
        var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

        // ---- Theme toggle ----
        if (themeToggle) {
            themeToggle.addEventListener('click', function () {
                var current = root.getAttribute('data-theme') ||
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                var next = current === 'dark' ? 'light' : 'dark';
                root.setAttribute('data-theme', next);
                storeTheme(next);
            });
        }

        // ---- Mobile menu ----
        function setMenu(open) {
            header.classList.toggle('is-open', open);
            navToggle.setAttribute('aria-expanded', String(open));
        }
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function () {
                setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
            });
            navLinks.forEach(function (link) {
                link.addEventListener('click', function () { setMenu(false); });
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && header.classList.contains('is-open')) {
                    setMenu(false);
                    navToggle.focus();
                }
            });
            document.addEventListener('click', function (e) {
                if (header.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
            });
        }

        // ---- Header shadow once the page scrolls ----
        var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        // ---- Scroll-triggered reveal ----
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    el.classList.add('is-visible');
                    revealObserver.unobserve(el);
                    // hand control back to each element's own hover transitions
                    setTimeout(function () {
                        el.classList.remove('reveal', 'is-visible');
                        el.style.transitionDelay = '';
                    }, 900);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.reveal').forEach(function (el, i) {
            // tiny stagger inside grids so cards arrive one after another
            el.style.transitionDelay = (i % 3) * 80 + 'ms';
            revealObserver.observe(el);
        });

        // ---- Active nav link ----
        var linkFor = {};
        navLinks.forEach(function (link) { linkFor[link.getAttribute('href').slice(1)] = link; });
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (l) { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
                var link = linkFor[entry.target.id];
                if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'location'); }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        document.querySelectorAll('main section[id]').forEach(function (s) { sectionObserver.observe(s); });
    });

    // ---- Contact form -> pre-filled email ----
    document.addEventListener('DOMContentLoaded', function () {
        var form = document.getElementById('contact-form');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var data = new FormData(form);
            var body = 'Name: ' + data.get('name') + '\nEmail: ' + data.get('email') +
                '\n\nMessage:\n' + data.get('message');
            window.location.href = 'mailto:' + EMAIL +
                '?subject=' + encodeURIComponent(data.get('subject')) +
                '&body=' + encodeURIComponent(body);

            var button = form.querySelector('button[type="submit"]');
            var original = button.textContent;
            button.textContent = 'Opening your email client…';
            setTimeout(function () {
                button.textContent = original;
                form.reset();
            }, 3000);
        });
    });
})();
