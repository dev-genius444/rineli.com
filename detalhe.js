/* ============================================
   L'Artisan Boulangerie — detalhe.js
   Lógica da página de detalhes do produto
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Configura botão de voltar
  const backBtn = document.getElementById('detailBackButton');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (document.referrer.includes('produtos.html')) {
        window.history.back();
      } else {
        window.location.href = 'produtos.html';
      }
    });
  }

  // Pega o parâmetro slug da URL (?produto=nome-do-slug)
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('produto');

  // Verifica se a variável global PRODUTOS existe (vinda do produtos.js)
  if (typeof PRODUTOS === 'undefined' || !slug || !PRODUTOS[slug]) {
    const mainName = document.getElementById('detailName');
    if (mainName) mainName.textContent = "Produto não encontrado.";
    return;
  }

  const produto = PRODUTOS[slug];

  // Renderiza textos informativos
  const tagEl = document.getElementById('detailTag');
  const nameEl = document.getElementById('detailName');
  const priceEl = document.getElementById('detailPrice');
  const descEl = document.getElementById('detailDesc');
  const actionPriceEl = document.getElementById('detailActionPrice');
  const addBtn = document.getElementById('detailAddButton');

  if (tagEl) tagEl.textContent = produto.categoria;
  if (nameEl) nameEl.textContent = produto.nome;
  if (priceEl) priceEl.textContent = produto.preco;
  if (descEl) descEl.textContent = produto.descricao;
  if (actionPriceEl) actionPriceEl.textContent = produto.preco;

  // Redireciona ação para o WhatsApp com o produto selecionado
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const msg = encodeURIComponent(`Olá! Gostaria de encomendar: ${produto.nome}`);
      window.open(`https://wa.me/556599943679?text=${msg}`, '_blank');
    });
  }

  // Renderiza a Imagem Principal
  const mainImageEl = document.getElementById('detailMainImage');
  const galleryEl = document.getElementById('detailGallery');

  if (mainImageEl && produto.imagens && produto.imagens.length > 0) {
    // Aplica a imagem e ajusta as propriedades CSS inline para garantir visibilidade
    mainImageEl.style.backgroundImage = `url('${produto.imagens[0]}')`;
    mainImageEl.style.backgroundSize = 'cover';
    mainImageEl.style.backgroundPosition = 'center';
    mainImageEl.style.width = '100%';
    
    // Garante que o contêiner tenha altura visível caso o detalhe.css não tenha definido
    if (!mainImageEl.clientHeight || mainImageEl.clientHeight === 0) {
      mainImageEl.style.minHeight = '300px';
    }
  }

  // Renderiza a Galeria caso existam 2 ou mais imagens
  if (galleryEl && produto.imagens && produto.imagens.length > 1) {
    galleryEl.style.display = 'flex';
    galleryEl.innerHTML = '';

    produto.imagens.forEach((imgUrl, index) => {
      const thumb = document.createElement('div');
      thumb.className = `detail-gallery__item ${index === 0 ? 'detail-gallery__item--active' : ''}`;
      thumb.style.backgroundImage = `url('${imgUrl}')`;
      thumb.style.backgroundSize = 'cover';
      thumb.style.backgroundPosition = 'center';

      thumb.addEventListener('click', () => {
        if (mainImageEl) mainImageEl.style.backgroundImage = `url('${imgUrl}')`;
        const activeItems = galleryEl.querySelectorAll('.detail-gallery__item--active');
        activeItems.forEach(item => item.classList.remove('detail-gallery__item--active'));
        thumb.classList.add('detail-gallery__item--active');
      });

      galleryEl.appendChild(thumb);
    });
  } else if (galleryEl) {
    galleryEl.style.display = 'none';
  }
});