(function () {
  var MODE_KEY = 'portfolio-theme';
  var ACCENT_KEY = 'portfolio-accent';
  var MODES = ['light', 'dark', 'system'];
  var ACCENTS = ['ocean', 'violet', 'emerald', 'sunset', 'rose'];
  var TYPED_WORDS = ['AI products', 'LLM gateways', 'serverless systems', 'full-stack apps', 'developer tools'];
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/c155f7f2379f05a899bf63a14b9e7168';
  var root = document.documentElement;

  function readSetting(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function saveSetting(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Setting could not be saved', error);
    }
  }

  function prefersMotion() {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function systemIsDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function currentMode() {
    var stored = readSetting(MODE_KEY);
    return MODES.indexOf(stored) === -1 ? 'system' : stored;
  }

  function effectiveTheme() {
    var chosen = root.getAttribute('data-theme');
    if (chosen) return chosen;
    return systemIsDark() ? 'dark' : 'light';
  }

  function applyMode(mode) {
    try {
      if (mode === 'system') {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', mode);
      }
    } catch (error) {
      console.error('Mode change failed', error);
    }
  }

  function applyAccent(accent) {
    try {
      if (!accent || accent === 'ocean' || ACCENTS.indexOf(accent) === -1) {
        root.removeAttribute('data-accent');
      } else {
        root.setAttribute('data-accent', accent);
      }
    } catch (error) {
      console.error('Colour change failed', error);
    }
  }

  function withTransition(origin, change) {
    try {
      if (!document.startViewTransition || !prefersMotion() || !origin) {
        change();
        return;
      }
      var bounds = origin.getBoundingClientRect();
      var centerX = bounds.left + bounds.width / 2;
      var centerY = bounds.top + bounds.height / 2;
      var radius = Math.hypot(Math.max(centerX, window.innerWidth - centerX), Math.max(centerY, window.innerHeight - centerY));
      var transition = document.startViewTransition(change);
      transition.ready.then(function () {
        root.animate(
          { clipPath: ['circle(0px at ' + centerX + 'px ' + centerY + 'px)', 'circle(' + radius + 'px at ' + centerX + 'px ' + centerY + 'px)'] },
          { duration: 650, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(function (error) {
        console.warn('Theme transition skipped', error);
      });
    } catch (error) {
      console.error('Theme transition failed', error);
      change();
    }
  }

  function syncThemeControls() {
    try {
      var mode = currentMode();
      var accent = readSetting(ACCENT_KEY) || 'ocean';
      document.querySelectorAll('[data-mode]').forEach(function (button) {
        button.setAttribute('aria-checked', String(button.getAttribute('data-mode') === mode));
      });
      document.querySelectorAll('.swatches [data-accent]').forEach(function (button) {
        button.setAttribute('aria-checked', String(button.getAttribute('data-accent') === accent));
      });
      var toggle = document.getElementById('theme-toggle');
      if (toggle) {
        var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
        toggle.setAttribute('aria-label', 'Switch to ' + next + ' mode');
      }
      var themeColor = getComputedStyle(root).getPropertyValue('--paper').trim();
      document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
        meta.setAttribute('content', themeColor);
      });
    } catch (error) {
      console.error('Theme controls could not be updated', error);
    }
  }

  function setupThemeControls() {
    try {
      var toggle = document.getElementById('theme-toggle');
      var menuButton = document.getElementById('theme-button');
      var panel = document.getElementById('theme-panel');

      toggle.addEventListener('click', function () {
        try {
          var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
          toggle.classList.add('is-turning');
          window.setTimeout(function () { toggle.classList.remove('is-turning'); }, 450);
          withTransition(toggle, function () {
            applyMode(next);
            saveSetting(MODE_KEY, next);
            syncThemeControls();
          });
        } catch (error) {
          console.error('Mode toggle failed', error);
        }
      });

      var closePanel = function () {
        panel.hidden = true;
        menuButton.setAttribute('aria-expanded', 'false');
      };

      menuButton.addEventListener('click', function (event) {
        try {
          event.stopPropagation();
          var opening = panel.hidden;
          panel.hidden = !opening;
          menuButton.setAttribute('aria-expanded', String(opening));
          if (opening) {
            var checked = panel.querySelector('[aria-checked="true"]');
            if (checked) checked.focus();
          }
        } catch (error) {
          console.error('Theme panel failed to open', error);
        }
      });

      panel.addEventListener('click', function (event) {
        try {
          event.stopPropagation();
          var modeButton = event.target.closest('[data-mode]');
          var accentButton = event.target.closest('.swatches [data-accent]');
          if (modeButton) {
            var mode = modeButton.getAttribute('data-mode');
            withTransition(modeButton, function () {
              applyMode(mode);
              saveSetting(MODE_KEY, mode);
              syncThemeControls();
            });
          }
          if (accentButton) {
            var accent = accentButton.getAttribute('data-accent');
            withTransition(accentButton, function () {
              applyAccent(accent);
              saveSetting(ACCENT_KEY, accent);
              syncThemeControls();
            });
          }
        } catch (error) {
          console.error('Theme choice failed', error);
        }
      });

      document.addEventListener('click', function () {
        if (!panel.hidden) closePanel();
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !panel.hidden) {
          closePanel();
          menuButton.focus();
        }
      });

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncThemeControls);
      syncThemeControls();
    } catch (error) {
      console.error('Theme controls setup failed', error);
    }
  }

  function setupMobileMenu() {
    try {
      var button = document.getElementById('menu-button');
      var menu = document.getElementById('mobile-menu');
      if (!button || !menu) return;
      var setOpen = function (open) {
        menu.hidden = !open;
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      };
      button.addEventListener('click', function (event) {
        try {
          event.stopPropagation();
          setOpen(menu.hidden);
        } catch (error) {
          console.error('Menu toggle failed', error);
        }
      });
      menu.addEventListener('click', function (event) {
        if (event.target.closest('a')) setOpen(false);
      });
      document.addEventListener('click', function () {
        if (!menu.hidden) setOpen(false);
      });
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !menu.hidden) {
          setOpen(false);
          button.focus();
        }
      });
    } catch (error) {
      console.error('Menu setup failed', error);
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
        '.publication',
        '.about-photo',
        '.skills > div',
        '.highlights > li',
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
      root.classList.remove('js');
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

  function setupTyped() {
    try {
      var target = document.getElementById('typed');
      if (!target || !prefersMotion()) return;
      var wordIndex = 0;
      var letterCount = TYPED_WORDS[0].length;
      var deleting = false;
      var tick = function () {
        try {
          var word = TYPED_WORDS[wordIndex];
          var delay = deleting ? 45 : 85;
          if (!deleting && letterCount === word.length) {
            deleting = true;
            delay = 1800;
          } else if (deleting && letterCount === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % TYPED_WORDS.length;
            delay = 300;
          } else {
            letterCount += deleting ? -1 : 1;
          }
          target.textContent = TYPED_WORDS[wordIndex].slice(0, letterCount);
          window.setTimeout(tick, delay);
        } catch (error) {
          target.textContent = TYPED_WORDS[0];
        }
      };
      window.setTimeout(tick, 2200);
    } catch (error) {
      console.error('Typed text setup failed', error);
    }
  }

  function setupScrollEffects() {
    try {
      var header = document.querySelector('.site-header');
      var bar = document.querySelector('.scroll-progress');
      var pending = false;
      var update = function () {
        try {
          pending = false;
          var scrollable = root.scrollHeight - window.innerHeight;
          var progress = scrollable > 0 ? window.scrollY / scrollable : 0;
          if (bar) bar.style.setProperty('--progress', progress.toFixed(4));
          if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
        } catch (error) {
          console.error('Scroll update failed', error);
        }
      };
      window.addEventListener('scroll', function () {
        if (!pending) {
          pending = true;
          window.requestAnimationFrame(update);
        }
      }, { passive: true });
      update();
    } catch (error) {
      console.error('Scroll effects setup failed', error);
    }
  }

  function setupPointerEffects() {
    try {
      if (!prefersMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

      var board = document.querySelector('.board');
      if (board) {
        board.addEventListener('pointermove', function (event) {
          try {
            var bounds = board.getBoundingClientRect();
            board.style.setProperty('--spot-x', (event.clientX - bounds.left) + 'px');
            board.style.setProperty('--spot-y', (event.clientY - bounds.top) + 'px');
          } catch (error) {
            console.error('Spotlight update failed', error);
          }
        });
      }

      document.querySelectorAll('.product-media').forEach(function (media) {
        media.addEventListener('pointermove', function (event) {
          try {
            var bounds = media.getBoundingClientRect();
            var horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
            var vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
            media.classList.add('is-tilting');
            media.style.setProperty('--tilt-y', (horizontal * 8).toFixed(2) + 'deg');
            media.style.setProperty('--tilt-x', (vertical * -8).toFixed(2) + 'deg');
          } catch (error) {
            console.error('Tilt update failed', error);
          }
        });
        media.addEventListener('pointerleave', function () {
          media.classList.remove('is-tilting');
        });
      });
    } catch (error) {
      console.error('Pointer effects setup failed', error);
    }
  }

  applyMode(currentMode());
  applyAccent(readSetting(ACCENT_KEY));
  if (prefersMotion()) {
    root.classList.add('js');
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupThemeControls();
    setupMobileMenu();
    setupContactForm();
    setupYear();
    setupReveal();
    setupCounters();
    setupTyped();
    setupScrollEffects();
    setupPointerEffects();
  });
})();
