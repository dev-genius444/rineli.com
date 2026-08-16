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

  // Busca + filtro por categoria na página de produtos
  initProductFilter();

  // Torna os cards de produto clicáveis (leva pra detalhe.html)
  initProductCardLinks();

  // Popula a página detalhe.html com o produto clicado
  initProductDetail();
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
   Pré-carrega os frames como objetos Image() na memória e desenha cada um em
   um <canvas> com drawImage(), evitando o overhead de decode/paint que ocorre
   ao trocar o src de uma <img> a cada frame.

   Otimizações de velocidade:
   1) Só a 1ª seção começa a carregar de cara; as demais só começam a baixar
      quando estão perto de entrar na tela (IntersectionObserver).
   2) Concorrência limitada (poucos downloads simultâneos por seção) em vez
      de disparar as 300 requisições de uma vez.
   3) O frame 1 tem prioridade alta e aparece como fundo CSS instantâneo. */
function initAppleScrollFrames() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Configuração das seções e quantidade total de frames extraídos.
  // IMPORTANTE: ajuste totalFrames para o número EXATO de arquivos que você
  // realmente tem em cada pasta (frame_0001.png até frame_00XX.png).
  const configs = [
    {
      sectionId: 'destaques-cuca',
      canvasId: 'canvas-cuca',
      folderPath: './frame-cuca',
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
    },
    {
      sectionId: 'destaques-pizza',
      canvasId: 'canvas-pizza',
      folderPath: './frame-pizza',
      totalFrames: 300,
      prefix: 'frame_',
      extension: '.png'
    }
  ];

  // Quantos frames podem baixar ao mesmo tempo por seção. Baixar as 300
  // imagens de uma vez só faz elas brigarem por banda — em lotes, os
  // frames iniciais (que o usuário vê primeiro) ficam prontos muito antes.
  const CONCORRENCIA = 8;

  configs.forEach((config, configIndex) => {
    const section = document.getElementById(config.sectionId);
    const canvas = document.getElementById(config.canvasId);
    if (!section || !canvas) return;

    const ctx = canvas.getContext('2d');
    const caption = section.querySelector('.scroll-reveal__caption');

    const getFramePath = (index) => {
      const paddedIndex = String(index).padStart(4, '0');
      return `${config.folderPath}/${config.prefix}${paddedIndex}${config.extension}`;
    };

    // Mostra o frame 1 como fundo CSS imediatamente — o navegador busca essa
    // imagem isolada e com prioridade alta, então aparece bem antes do
    // restante. Some visualmente assim que o canvas desenha por cima.
    canvas.style.backgroundImage = `url('${getFramePath(1)}')`;
    canvas.style.backgroundSize = 'cover';
    canvas.style.backgroundPosition = 'center';

    const images = new Array(config.totalFrames);
    let carregadas = 0;
    let imagensProntas = false;
    let currentFrameIndex = 1;
    let carregamentoIniciado = false;

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

    const carregarFrame = (i) => new Promise((resolve) => {
      const img = new Image();
      if (i === 1) img.fetchPriority = 'high';
      img.decoding = 'async';
      img.onload = img.onerror = () => {
        carregadas++;
        if (carregadas === config.totalFrames) imagensProntas = true;
        // Assim que o frame que está visível no momento termina de carregar,
        // desenha na hora — não espera as outras 299 imagens.
        if (i === currentFrameIndex) renderFrame(currentFrameIndex);
        resolve();
      };
      img.src = getFramePath(i);
      images[i - 1] = img;
    });

    // Fila com concorrência limitada: só CONCORRENCIA downloads simultâneos,
    // em vez de disparar as 300 requisições de uma vez.
    const carregarTodosFrames = () => {
      if (carregamentoIniciado) return;
      carregamentoIniciado = true;

      let proximo = 1;
      const worker = async () => {
        while (proximo <= config.totalFrames) {
          const i = proximo++;
          await carregarFrame(i);
        }
      };
      Array.from({ length: CONCORRENCIA }, worker);
    };

    // A 1ª seção (a que aparece primeiro na página) começa a carregar assim
    // que o DOM está pronto. As demais só começam quando estão prestes a
    // entrar na tela — evita competir por banda com frames que o usuário
    // ainda nem vai ver tão cedo.
    if (configIndex === 0) {
      carregarTodosFrames();
    } else {
      const preloadObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            carregarTodosFrames();
            preloadObserver.disconnect();
          }
        });
      }, { rootMargin: '100% 0px 100% 0px' });
      preloadObserver.observe(section);
    }

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
      } else if (!carregamentoIniciado) {
        // Scroll rápido demais chegou nessa seção antes do IntersectionObserver
        // disparar — força o início do carregamento na hora.
        carregarTodosFrames();
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

/* ---------- Busca + filtro de produtos (produtos.html) ----------
   Só roda se os elementos existirem na página, então não afeta o index.html
   nem outras páginas do site. */
function initProductFilter() {
  const searchInput = document.getElementById('productSearch');
  const filterBar = document.getElementById('productFilters');
  const grid = document.getElementById('productGrid');
  const emptyMessage = document.getElementById('productEmpty');

  if (!searchInput || !filterBar || !grid) return;

  const cards = Array.from(grid.querySelectorAll('.product-card'));
  const chips = Array.from(filterBar.querySelectorAll('.product-filters__chip'));

  let categoriaAtiva = 'todos';
  let termoBusca = '';

  const normalizar = (texto) =>
    texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // remove acentos pra busca funcionar com ou sem acento

  const aplicarFiltro = () => {
    let visiveis = 0;

    cards.forEach((card) => {
      const categoria = card.dataset.category || '';
      const nome = normalizar(card.dataset.name || card.querySelector('.product-card__name')?.textContent || '');
      const buscaNormalizada = normalizar(termoBusca.trim());

      const bateCategoria = categoriaAtiva === 'todos' || categoria === categoriaAtiva;
      const bateBusca = buscaNormalizada === '' || nome.includes(buscaNormalizada);

      const visivel = bateCategoria && bateBusca;
      card.hidden = !visivel;
      if (visivel) visiveis++;
    });

    if (emptyMessage) {
      emptyMessage.hidden = visiveis !== 0;
    }
  };

  searchInput.addEventListener('input', (e) => {
    termoBusca = e.target.value;
    aplicarFiltro();
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('product-filters__chip--active'));
      chip.classList.add('product-filters__chip--active');
      categoriaAtiva = chip.dataset.filter;
      aplicarFiltro();
    });
  });
}

/* ---------- Cards de produto clicáveis (produtos.html → detalhe.html) ----------
   Cada card tem data-slug apontando pra uma chave em PRODUTOS (produtos-data.js).
   Clicar em qualquer parte do card (exceto o botão "+") leva pra detalhe.html. */
function initProductCardLinks() {
  const cards = document.querySelectorAll('.product-card[data-slug]');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      // Não navega se o clique foi no botão de adicionar
      if (e.target.closest('.product-card__add')) return;

      const slug = card.dataset.slug;
      if (slug) {
        window.location.href = `detalhe.html?produto=${encodeURIComponent(slug)}`;
      }
    });
  });
}

/* ---------- Página de detalhe do produto (detalhe.html) ----------
   Lê o produto pela URL (?produto=slug), busca os dados em PRODUTOS
   (definido em produtos-data.js) e monta a imagem principal + a galeria
   que desliza pro lado com as fotos restantes. */
function initProductDetail() {
  const mainImage = document.getElementById('detailMainImage');
  const gallery = document.getElementById('detailGallery');
  if (!mainImage || !gallery) return; // não é a página de detalhe

  if (typeof PRODUTOS === 'undefined') {
    console.error('produtos-data.js não foi carregado antes de script.js');
    return;
  }

  const nameEl = document.getElementById('detailName');
  const priceEl = document.getElementById('detailPrice');
  const actionPriceEl = document.getElementById('detailActionPrice');
  const tagEl = document.getElementById('detailTag');
  const descEl = document.getElementById('detailDesc');
  const backBtn = document.getElementById('detailBackButton');
  const addBtn = document.getElementById('detailAddButton');

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('produto');
  const produto = slug ? PRODUTOS[slug] : null;

  if (!produto) {
    if (nameEl) nameEl.textContent = 'Produto não encontrado';
    if (descEl) descEl.textContent = 'Volte para a lista de produtos e escolha um item.';
    return;
  }

  const rotulosCategoria = {
    paes: 'Pão',
    doces: 'Doce',
    salgados: 'Salgado',
    bebidas: 'Bebida'
  };

  const setImagemPrincipal = (url) => {
    mainImage.style.backgroundImage = `url('${url}')`;
  };

  // Preenche as informações de texto
  document.title = `${produto.nome} — L'Artisan Boulangerie`;
  if (nameEl) nameEl.textContent = produto.nome;
  if (priceEl) priceEl.textContent = produto.preco;
  if (actionPriceEl) actionPriceEl.textContent = produto.preco;
  if (tagEl) tagEl.textContent = rotulosCategoria[produto.categoria] || produto.categoria;
  if (descEl) descEl.textContent = produto.descricao;

  // Imagem principal = primeira da lista
  setImagemPrincipal(produto.imagens[0]);

  // Monta a galeria que desliza pro lado — clicar numa miniatura troca a
  // imagem principal e destaca a miniatura selecionada.
  gallery.innerHTML = '';
  produto.imagens.forEach((url, index) => {
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'detail-gallery__thumb' + (index === 0 ? ' detail-gallery__thumb--active' : '');
    thumb.style.backgroundImage = `url('${url}')`;
    thumb.setAttribute('aria-label', `Ver foto ${index + 1} de ${produto.imagens.length}`);

    thumb.addEventListener('click', () => {
      setImagemPrincipal(url);
      gallery.querySelectorAll('.detail-gallery__thumb').forEach((t) => {
        t.classList.remove('detail-gallery__thumb--active');
      });
      thumb.classList.add('detail-gallery__thumb--active');
    });

    gallery.appendChild(thumb);
  });

  // Botão "voltar" — volta pra página anterior (geralmente produtos.html)
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'produtos.html';
      }
    });
  }

  // Botão "Fazer Encomenda" — leva pra encomendas.html com o produto preenchido
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      window.location.href = `encomendas.html?produto=${encodeURIComponent(produto.nome)}`;
    });
  }
}