/* ============================================
   L'Artisan Boulangerie — script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initScrollSpy();
  initOrderForm();
  
  // Inicializa o efeito Apple de troca de frames
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

/* ---------- Efeito Apple Scroll: Animação de Sequência de Frames ---------- */
function initAppleScrollFrames() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Configuração das seções e quantidade total de frames extraídos
  const configs = [
    {
      sectionId: 'destaques-pizza',
      folderPath: './frame-pizza',
      totalFrames: 300, // Ajuste para a quantidade exata de frames salvos
      prefix: 'frame_',
      extension: '.png'
    },
    {
      sectionId: 'destaques-bolo',
      folderPath: './frame-bolo',
      totalFrames: 300, // Ajuste para a quantidade exata de frames salvos
      prefix: 'frame_',
      extension: '.png'
    }
  ];

  configs.forEach((config) => {
    const section = document.getElementById(config.sectionId);
    if (!section) return;

    const imgElement = section.querySelector('.scroll-reveal__img');
    const caption = section.querySelector('.scroll-reveal__caption');
    if (!imgElement) return;

    // Array para armazenar as imagens pré-carregadas na memória RAM
    const preloadedImages = [];

    // Função para formatar o número do arquivo com zeros à esquerda (ex: frame_0001.png)
    const getFramePath = (index) => {
      const paddedIndex = String(index).padStart(4, '0');
      return `${config.folderPath}/${config.prefix}${paddedIndex}${config.extension}`;
    };

    // Pré-carregamento dos 300 frames para eliminar atrasos na rolagem
    for (let i = 1; i <= config.totalFrames; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      preloadedImages.push(img);
    }

    let ticking = false;

    function updateFrame() {
      const rect = section.getBoundingClientRect();
      const totalScrollableHeight = section.offsetHeight - window.innerHeight;

      if (totalScrollableHeight <= 0) return;

      // Calcula o progresso do scroll de 0.0 a 1.0 dentro da seção
      let progress = -rect.top / totalScrollableHeight;
      progress = Math.min(Math.max(progress, 0), 1);

      // Mapeia o progresso do scroll para o índice do frame (1 até totalFrames)
      const frameIndex = Math.floor(progress * (config.totalFrames - 1)) + 1;

      // Atualiza a imagem exibida na tela
      imgElement.src = getFramePath(frameIndex);

      // Opacidade dinâmica da legenda/texto
      if (caption) {
        const opacity = progress < 0.1 ? progress / 0.1 : progress > 0.9 ? (1 - progress) / 0.1 : 1;
        caption.style.opacity = String(Math.max(0, Math.min(1, opacity)));
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateFrame);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateFrame();
  });
}