/* ============================================================
   Год в подвале
   ============================================================ */
(function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ============================================================
   Бургер-меню
   ============================================================ */
(function () {
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (!burger || !nav) return;

  function closeMenu() {
    burger.classList.remove('is-open');
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
    document.body.classList.remove('nav-open');
  }

  burger.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    document.body.classList.toggle('nav-open', isOpen);
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeMenu();
  });
})();

/* ============================================================
   Тень шапки при скролле
   ============================================================ */
(function () {
  var header = document.getElementById('header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================================================
   Плавное появление блоков (scroll-reveal)
   ============================================================ */
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  items.forEach(function (el) { observer.observe(el); });
})();

/* ============================================================
   Лёгкий "прожектор" на карточках услуг
   ============================================================ */
(function () {
  var cards = document.querySelectorAll('.card');
  if (!cards.length) return;
  if (window.matchMedia('(hover: none)').matches) return;

  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
  });
})();

/* ============================================================
   Модалка контактов
   ============================================================ */
(function () {
  var modal = document.getElementById('contactModal');
  if (!modal) return;

  var triggers = document.querySelectorAll('.js-contact');
  if (!triggers.length) return;

  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-open');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-open');
  }

  triggers.forEach(function (t) {
    t.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  modal.querySelectorAll('[data-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
})();

/* ============================================================
   Карусель скриншотов
   ============================================================ */
(function () {
  var carousels = document.querySelectorAll('[data-shots]');
  if (!carousels.length) return;

  carousels.forEach(function (root) {
    var viewport = root.querySelector('[data-shots-viewport]');
    if (!viewport) return;

    var shots = Array.prototype.slice.call(viewport.querySelectorAll('.shot'));
    if (!shots.length) return;

    var dotsBox = root.querySelector('[data-shots-dots]');
    var prevBtn = root.querySelector('[data-shots-prev]');
    var nextBtn = root.querySelector('[data-shots-next]');

    // Создаём точки
    var dots = [];
    if (dotsBox) {
      shots.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'shots__dot';
        dot.setAttribute('aria-label', 'Перейти к скриншоту ' + (i + 1));
        dot.addEventListener('click', function () {
          scrollToIndex(i);
        });
        dotsBox.appendChild(dot);
        dots.push(dot);
      });
    }

    function getStep() {
      if (shots.length < 2) return 0;
      return shots[1].offsetLeft - shots[0].offsetLeft;
    }

    function scrollToIndex(i) {
      var step = getStep();
      if (!step) return;
      var maxScroll = viewport.scrollWidth - viewport.clientWidth;
      var target = Math.min(i * step, maxScroll);
      if (target < 0) target = 0;
      viewport.scrollTo({ left: target, behavior: 'smooth' });
    }

    function currentIndex() {
      var step = getStep();
      if (!step) return 0;
      return Math.round(viewport.scrollLeft / step);
    }

    function updateUI() {
      var maxScroll = viewport.scrollWidth - viewport.clientWidth;
      var hasOverflow = maxScroll > 4;

      root.classList.toggle('shots--has-overflow', hasOverflow);

      if (prevBtn) prevBtn.disabled = viewport.scrollLeft <= 4;
      if (nextBtn) nextBtn.disabled = viewport.scrollLeft >= maxScroll - 4;

      var idx = currentIndex();
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === idx);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        var step = getStep();
        if (!step) return;
        var idx = Math.max(0, Math.round(viewport.scrollLeft / step) - 1);
        scrollToIndex(idx);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var step = getStep();
        if (!step) return;
        var idx = Math.round(viewport.scrollLeft / step) + 1;
        var maxIdx = shots.length - 1;
        if (idx > maxIdx) idx = maxIdx;
        scrollToIndex(idx);
      });
    }

    var raf = null;
    viewport.addEventListener('scroll', function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        updateUI();
        raf = null;
      });
    }, { passive: true });

    window.addEventListener('resize', updateUI);

    // Первичная отрисовка (после загрузки шрифтов/картинок)
    requestAnimationFrame(updateUI);
    window.addEventListener('load', updateUI);
  });
})();

/* ============================================================
   Лайтбокс — увеличение скриншота
   ============================================================ */
(function () {
  var lb = document.getElementById('lightbox');
  if (!lb) return;

  var img = lb.querySelector('.lightbox__img');

  function open(src, alt) {
    if (!src) return;
    img.src = src;
    img.alt = alt || '';
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-open');
  }

  function close() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-open');
    // Небольшая задержка, чтобы не «мигало» при закрытии
    setTimeout(function () {
      if (!lb.classList.contains('is-open')) img.src = '';
    }, 250);
  }

  document.addEventListener('click', function (e) {
    var shot = e.target.closest('[data-lightbox]');
    if (shot) {
      e.preventDefault();
      var innerImg = shot.querySelector('img');
      open(shot.getAttribute('data-lightbox'), innerImg ? innerImg.alt : '');
      return;
    }

    if (e.target.closest('[data-lightbox-close]') || e.target === lb) {
      close();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lb.classList.contains('is-open')) close();
  });
})();