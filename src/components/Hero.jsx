import './Hero.scss';

export default function Hero({ totalProducts, totalCategories }) {
  return (
    <section className="hero">
      <div className="hero__bg" />

      <div className="hero__content">
        <p className="hero__eyebrow">Nova coleção disponível</p>
        <h1 className="hero__title">
          Descubra
          <span>o melhor</span>
        </h1>
        <p className="hero__desc">
          Livros, HQs, acessórios gamer e colecionáveis reunidos em um só lugar.
          Encontre o que você procura com facilidade.
        </p>
        <a href="#produtos" className="hero__cta">
          Ver produtos
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>

      {totalProducts > 0 && (
        <div className="hero__stats">
          <div className="hero__stat">
            <strong>{totalProducts}</strong>
            <span>Produtos</span>
          </div>
          <div className="hero__stat">
            <strong>{totalCategories}</strong>
            <span>Categorias</span>
          </div>
        </div>
      )}

      <div className="hero__scroll">Scroll</div>
    </section>
  );
}