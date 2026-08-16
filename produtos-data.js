/* ============================================
   L'Artisan Boulangerie — produtos-data.js
   Fonte única dos produtos: usada em produtos.html
   (listagem) e detalhe.html (página de detalhe).

   Cada produto tem um array "imagens" — a primeira é a
   foto principal, as demais aparecem na galeria que
   desliza pro lado na página de detalhe.

   IMPORTANTE: troque as imagens de exemplo pelas fotos
   reais do seu produto (idealmente 2 a 4 fotos por item).
   ============================================ */

const PRODUTOS = {
  "croissant-amanteigado": {
    nome: "Croissant Amanteigado",
    categoria: "doces",
    preco: "R$ 14,00",
    descricao: "Massa folhada de 27 camadas, manteiga francesa e fermentação de 24h. Crocante por fora, macio e amanteigado por dentro — assado fresco todas as manhãs.",
    imagens: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsQr1sWccbuvd-DQKGnfe_bzwk0vQipI538hsKyqZoj9d0FA0p8-XXEju8wEsZjIYcUA2FQBGES36yvV0tZKHJKxF6BCu_xez2ppv1gyx4mF9PwdW0U6SzLMbR7CkOu1Yfx-6Tl4x7TADh3VDv0VJdVPYDKLbC2nRVnB0gvoC95TL_Ag-m2evOWM-7eCjUZyNY6EG3s595D_tNUEWUxd4DOGnXnCo8BSUihP-oWPBlZlh7UK7kruvT",
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  "pao-fermentacao-natural": {
    nome: "Pão de Fermentação Natural",
    categoria: "paes",
    preco: "R$ 22,00",
    descricao: "Levain de cultivo próprio, casca crocante e miolo aerado. Fermentação lenta de 48h para um sabor mais profundo e melhor digestão.",
    imagens: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1585932032676-1b32bff2b9ea?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  "tarte-au-citron": {
    nome: "Tarte au Citron",
    categoria: "doces",
    preco: "R$ 18,00",
    descricao: "Creme de limão siciliano sobre base amanteigada e merengue maçaricado na hora. Equilíbrio perfeito entre doce e cítrico.",
    imagens: [
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  "baguete-tradicional": {
    nome: "Baguete Tradicional",
    categoria: "paes",
    preco: "R$ 12,00",
    descricao: "Receita clássica francesa, casca dourada e crocante por fora, miolo macio por dentro. Assada em forno de pedra.",
    imagens: [
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  "quiche-queijo-ervas": {
    nome: "Quiche de Queijo e Ervas",
    categoria: "salgados",
    preco: "R$ 16,00",
    descricao: "Massa amanteigada com recheio cremoso de queijos e ervas finas. Perfeita pra um almoço leve ou lanche da tarde.",
    imagens: [
      "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  "cafe-coado-especial": {
    nome: "Café Coado Especial",
    categoria: "bebidas",
    preco: "R$ 9,00",
    descricao: "Grãos torrados na medida, servido fresco a cada pedido. Método de coado lento pra realçar as notas do café.",
    imagens: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  "pao-queijo-artesanal": {
    nome: "Pão de Queijo Artesanal",
    categoria: "paes",
    preco: "R$ 8,00",
    descricao: "Receita mineira tradicional, macio por dentro e levemente crocante por fora. Feito com queijo de verdade, sem atalhos.",
    imagens: [
      "https://images.unsplash.com/photo-1585932032676-1b32bff2b9ea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  "empada-de-frango": {
    nome: "Empada de Frango",
    categoria: "salgados",
    preco: "R$ 11,00",
    descricao: "Massa amanteigada recheada com frango desfiado e temperos da casa. Assada até dourar por igual.",
    imagens: [
      "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  "suco-natural-laranja": {
    nome: "Suco Natural de Laranja",
    categoria: "bebidas",
    preco: "R$ 10,00",
    descricao: "Laranjas espremidas na hora, sem adição de açúcar. Refrescante e cheio de vitamina C.",
    imagens: [
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
    ]
  }
};