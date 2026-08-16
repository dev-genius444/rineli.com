/* ============================================
   L'Artisan Boulangerie — produtos.js
   Banco de dados de produtos e lógica de listagem/busca
   ============================================ */

// 1. Banco de dados sincronizado com todos os itens do produtos.html
const PRODUTOS = {
  "croissant-amanteigado": {
    nome: "Croissant Amanteigado",
    categoria: "doces",
    preco: "R$ 14,00",
    descricao: "Massa folhada de 27 camadas, manteiga francesa e fermentação de 24h.",
    imagens: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsQr1sWccbuvd-DQKGnfe_bzwk0vQipI538hsKyqZoj9d0FA0p8-XXEju8wEsZjIYcUA2FQBGES36yvV0tZKHJKxF6BCu_xez2ppv1gyx4mF9PwdW0U6SzLMbR7CkOu1Yfx-6Tl4x7TADh3VDv0VJdVPYDKLbC2nRVnB0gvoC95TL_Ag-m2evOWM-7eCjUZyNY6EG3s595D_tNUEWUxd4DOGnXnCo8BSUihP-oWPBlZlh7UK7kruvT"
    ]
  },
  "pao-fermentacao-natural": {
    nome: "Pão de Fermentação Natural",
    categoria: "paes",
    preco: "R$ 22,00",
    descricao: "Levain de cultivo próprio, casca crocante e miolo aerado.",
    imagens: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  "tarte-au-citron": {
    nome: "Tarte au Citron",
    categoria: "doces",
    preco: "R$ 18,00",
    descricao: "Creme de limão siciliano sobre base amanteigada e merengue maçaricado.",
    imagens: [
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  "baguete-tradicional": {
    nome: "Baguete Tradicional",
    categoria: "paes",
    preco: "R$ 12,00",
    descricao: "Receita clássica francesa, casca dourada e crocante por fora.",
    imagens: [
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  "quiche-queijo-ervas": {
    nome: "Quiche de Queijo e Ervas",
    categoria: "salgados",
    preco: "R$ 16,00",
    descricao: "Massa amanteigada com recheio cremoso de queijos e ervas finas.",
    imagens: [
      "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  "cafe-coado-especial": {
    nome: "Café Coado Especial",
    categoria: "bebidas",
    preco: "R$ 9,00",
    descricao: "Grãos torrados na medida, servido fresco a cada pedido.",
    imagens: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  "pao-queijo-artesanal": {
    nome: "Pão de Queijo Artesanal",
    categoria: "paes",
    preco: "R$ 8,00",
    descricao: "Receita mineira tradicional, macio por dentro e levemente crocante por fora.",
    imagens: [
      "https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  "empada-de-frango": {
    nome: "Empada de Frango",
    categoria: "salgados",
    preco: "R$ 11,00",
    descricao: "Massa amanteigada recheada com frango desfiado e temperos da casa.",
    imagens: [
      "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  "suco-natural-laranja": {
    nome: "Suco Natural de Laranja",
    categoria: "bebidas",
    preco: "R$ 10,00",
    descricao: "Laranjas espremidas na hora, sem adição de açúcar.",
    imagens: [
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=1200&q=80"
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initProductFilter();
  initProductCardLinks();
});

/* ---------- Busca + filtro de produtos ---------- */
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
    texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

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

/* ---------- Torna os cards clicáveis para o detalhe ---------- */
function initProductCardLinks() {
  const cards = document.querySelectorAll('.product-card[data-slug]');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      // Impede o clique no botão '+' de redirecionar para a página de detalhes
      if (e.target.closest('.product-card__add')) return;
      
      const slug = card.dataset.slug;
      if (slug) {
        window.location.href = `detalhe.html?produto=${encodeURIComponent(slug)}`;
      }
    });
  });
}