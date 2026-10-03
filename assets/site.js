(function () {
  var THEME_KEY = 'portfolio-theme';
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/c155f7f2379f05a899bf63a14b9e7168';

  function readTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.warn('Theme preference could not be saved', error);
    }
  }

  function currentTheme() {
    var chosen = document.documentElement.getAttribute('data-theme');
    if (chosen) return chosen;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setupThemeToggle() {
    try {
      var toggle = document.getElementById('theme-toggle');
      if (!toggle) return;
      var label = function () {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
      };
      label();
      toggle.addEventListener('click', function () {
        try {
          var next = currentTheme() === 'dark' ? 'light' : 'dark';
          toggle.classList.add('is-turning');
          window.setTimeout(function () { toggle.classList.remove('is-turning'); }, 450);
          document.documentElement.setAttribute('data-theme', next);
          saveTheme(next);
          label();
        } catch (error) {
          console.error('Theme switch failed', error);
        }
      });
    } catch (error) {
      console.error('Theme toggle setup failed', error);
    }
  }

  function setupContactForm() {
    try {
      var form = document.getElementById('contact-form');
      if (!form) return;
      var status = document.getElementById('contact-form-status');
      var button = form.querySelector('button[type="submit"]');

      var setStatus = function (text, state) {
        status.textContent = text;
        status.className = 'form-status ' + (state || '');
      };

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var field = function (name) {
          return form.elements[name].value.trim();
        };
        var payload = {
          name: field('name'),
          email: field('email'),
          subject: field('subject'),
          message: field('message'),
          _subject: 'Portfolio contact: ' + field('subject'),
          _template: 'table',
          _captcha: 'false'
        };

        button.disabled = true;
        button.textContent = 'Sending…';
        setStatus('', '');

        fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(function (response) {
            return response.json().then(function (data) {
              if (!response.ok || data.success === 'false' || data.success === false) {
                throw new Error(data.message || 'Request failed');
              }
              return data;
            });
          })
          .then(function () {
            setStatus('Message sent. I’ll reply by email.', 'success');
            form.reset();
          })
          .catch(function (error) {
            console.error('Contact form error', error);
            setStatus('The message was not sent. Check your connection and try again, or email rifatrabbi024@gmail.com.', 'error');
          })
          .then(function () {
            button.disabled = false;
            button.textContent = 'Send message';
          });
      });
    } catch (error) {
      console.error('Contact form setup failed', error);
    }
  }

  function setupYear() {
    try {
      var year = document.getElementById('year');
      if (year) year.textContent = String(new Date().getFullYear());
    } catch (error) {
      console.error('Year update failed', error);
    }
  }

  function prefersMotion() {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function setupReveal() {
    try {
      var groups = [
        '.section-head',
        '.group-title',
        '.group-note',
        '.products > .product',
        '.client-work > article',
        '.packages > li',
        '.timeline > li',
        '.about-photo',
        '.skills > div',
        '.contact-lines > li',
        '.contact-form'
      ];
      var targets = [];
      groups.forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (element, index) {
          element.classList.add('reveal');
          element.style.setProperty('--stagger', String(index % 6));
          targets.push(element);
        });
      });
      if (!('IntersectionObserver' in window)) {
        targets.forEach(function (element) { element.classList.add('is-visible'); });
        return;
      }
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      targets.forEach(function (element) { observer.observe(element); });
    } catch (error) {
      document.documentElement.classList.remove('js');
      console.error('Reveal setup failed', error);
    }
  }

  function setupCounters() {
    try {
      if (!prefersMotion()) return;
      document.querySelectorAll('[data-count]').forEach(function (element) {
        var target = Number(element.getAttribute('data-count'));
        var suffix = element.getAttribute('data-suffix') || '';
        var duration = 1100;
        var start = null;
        element.textContent = '0' + suffix;
        var step = function (timestamp) {
          try {
            if (start === null) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) window.requestAnimationFrame(step);
          } catch (error) {
            element.textContent = target + suffix;
          }
        };
        window.setTimeout(function () { window.requestAnimationFrame(step); }, 600);
        window.setTimeout(function () { element.textContent = target + suffix; }, 600 + duration + 400);
      });
    } catch (error) {
      console.error('Counter setup failed', error);
    }
  }

  var stored = readTheme();
  if (prefersMotion()) {
    document.documentElement.classList.add('js');
  }
  if (stored === 'light' || stored === 'dark') {
    document.documentElement.setAttribute('data-theme', stored);
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupThemeToggle();
    setupContactForm();
    setupYear();
    setupReveal();
    setupCounters();
  });
})();
