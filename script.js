/* ============================================
   L'Artisan Boulangerie — script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initScrollSpy();
  initOrderForm();

  // Inicializa o efeito Apple de troca de frames (via canvas)
  initAppleScrollFrames();
});

/* ---------- Menu mobile (hambúrguer) ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const toggleIcon = document.getElementById('navToggleIcon');
  const menu = document.getElementById('navMobile');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = !menu.hidden;
    menu.hidden = isOpen;
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggleIcon.textContent = isOpen ? 'menu' : 'close';
  });

  menu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggleIcon.textContent = 'menu';
    });
  });
}

/* ---------- Scroll suave ---------- */
function initSmoothScroll() {
  const headerOffset = () => {
    const header = document.querySelector('.site-header');
    return header ? header.offsetHeight : 0;
  };

  const scrollToTarget = (hash) => {
    const target = document.querySelector(hash);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset() - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(hash);
      history.pushState(null, '', hash);
    });
  });

  document.querySelectorAll('[data-scroll-to]').forEach((btn) => {
    btn.addEventListener('click', () => {
      scrollToTarget(btn.getAttribute('data-scroll-to'));
    });
  });
}

/* ---------- ScrollSpy ---------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-desktop .nav-link, .nav-mobile .nav-link');
  const bottomLinks = document.querySelectorAll('[data-bottom-nav]');

  if (!sections.length) return;

  const setActive = (id) => {
    desktopLinks.forEach((link) => {
      link.classList.toggle('nav-link--active', link.getAttribute('href') === `#${id}`);
    });
    bottomLinks.forEach((link) => {
      link.classList.toggle('bottom-nav__item--active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Formulário de encomendas ---------- */
function initOrderForm() {
  const form = document.getElementById('orderForm');
  const feedback = document.getElementById('orderFeedback');
  if (!form || !feedback) return;

  document.querySelectorAll('.product-card__add').forEach((btn) => {
    btn.addEventListener('click', () => {
      const productSelect = document.getElementById('orderProduct');
      const productName = btn.getAttribute('data-product');
      if (productSelect && productName) {
        productSelect.value = productName;
      }
      const target = document.getElementById('encomendas');
      if (target) {
        const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  const dateInput = document.getElementById('orderDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    feedback.textContent = `Obrigado, ${data.name.split(' ')[0]}! Recebemos sua encomenda e entraremos em contato em breve.`;
    feedback.classList.add('form-feedback--visible', 'form-feedback--success');
    form.reset();

    setTimeout(() => {
      feedback.classList.remove('form-feedback--visible', 'form-feedback--success');
    }, 6000);
  });
}

/* ---------- Efeito Apple Scroll: Animação de Sequência de Frames (via canvas) ----------
   Mesma técnica usada no projeto do salão: pré-carrega os frames como objetos
   Image() na memória e desenha cada um em um <canvas> com drawImage(), evitando
   o overhead de decode/paint que ocorre ao trocar o src de uma <img> a cada frame. */
function initAppleScrollFrames() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Configuração das seções e quantidade total de frames extraídos.
  // IMPORTANTE: ajuste totalFrames para o número EXATO de arquivos que você
  // realmente tem em cada pasta (frame_0001.png até frame_00XX.png).
// Configuração das seções e quantidade total de frames extraídos.
  // IMPORTANTE: ajuste totalFrames para o número EXATO de arquivos que você
  // realmente tem em cada pasta (frame_0001.png até frame_00XX.png).
  const configs = [
    {
      sectionId: 'destaques-cuca',
      canvasId: 'canvas-cuca',
      folderPath: './frame-cuca',
      totalFrames: 300, // Ajuste para a quantidade exata de frames da cuca
      prefix: 'frame_',
      extension: '.png'
    },
    {
      sectionId: 'destaques-pizza',
      canvasId: 'canvas-pizza',
      folderPath: './frame-pizza',
      totalFrames: 300,
      prefix: 'frame_',
      extension: '.png'
    },
    {
      sectionId: 'destaques-bolo',
      canvasId: 'canvas-bolo',
      folderPath: './frame-bolo',
      totalFrames: 300,
      prefix: 'frame_',
      extension: '.png'
    }
  ];

  configs.forEach((config) => {
    const section = document.getElementById(config.sectionId);
    const canvas = document.getElementById(config.canvasId);
    if (!section || !canvas) return;

    const ctx = canvas.getContext('2d');
    const caption = section.querySelector('.scroll-reveal__caption');

    const getFramePath = (index) => {
      const paddedIndex = String(index).padStart(4, '0');
      return `${config.folderPath}/${config.prefix}${paddedIndex}${config.extension}`;
    };

    // Pré-carregamento dos frames para eliminar atrasos na rolagem
    const images = [];
    let carregadas = 0;
    let imagensProntas = false;

    for (let i = 1; i <= config.totalFrames; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        carregadas++;
        if (carregadas === config.totalFrames) {
          imagensProntas = true;
        }
      };
      images.push(img);
    }

    let currentFrameIndex = 1;

    const renderFrame = (index) => {
      const img = images[index - 1];
      if (img && img.complete && img.naturalWidth > 0) {
        // Desenha usando o tamanho lógico (CSS) do canvas — o contexto já
        // está escalado pelo devicePixelRatio via setTransform.
        const cssWidth = canvas.clientWidth;
        const cssHeight = canvas.clientHeight;
        ctx.clearRect(0, 0, cssWidth, cssHeight);
        ctx.drawImage(img, 0, 0, cssWidth, cssHeight);
      }
    };

    // Ajusta o canvas para a resolução real da tela (nítido em qualquer dispositivo)
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderFrame(currentFrameIndex);
    };

    let ticking = false;

    const updateFrame = () => {
      const rect = section.getBoundingClientRect();
      const totalScrollableHeight = section.offsetHeight - window.innerHeight;

      if (totalScrollableHeight <= 0) {
        ticking = false;
        return;
      }

      let progress = -rect.top / totalScrollableHeight;
      progress = Math.min(Math.max(progress, 0), 1);

      const frameIndex = Math.min(
        config.totalFrames,
        Math.max(1, Math.floor(progress * (config.totalFrames - 1)) + 1)
      );
      currentFrameIndex = frameIndex;

      if (imagensProntas || (images[frameIndex - 1] && images[frameIndex - 1].complete)) {
        requestAnimationFrame(() => renderFrame(currentFrameIndex));
      }

      // Opacidade dinâmica da legenda/texto
      if (caption) {
        const opacity = progress < 0.1 ? progress / 0.1 : progress > 0.9 ? (1 - progress) / 0.1 : 1;
        caption.style.opacity = String(Math.max(0, Math.min(1, opacity)));
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateFrame);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateCanvasSize);

    updateCanvasSize();
    updateFrame();
  });
}