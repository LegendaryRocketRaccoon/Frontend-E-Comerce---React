import ProductCard from './ProductCard';
import './ProductGrid.scss';

function SkeletonCard() {
  return (
    <div className="skeleton">
      <div className="skeleton__img" />
      <div className="skeleton__body">
        <div className="skeleton__line skeleton__line--full" />
        <div className="skeleton__line skeleton__line--short" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, loading, onProductClick }) {
  if (loading) {
    return (
      <section className="grid-section">
        <div className="grid-section__loading">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </section>
    );
  }

  return (
    <section className="grid-section">
      <div className="grid-section__header">
        <h2 className="grid-section__title">Produtos</h2>
        <span className="grid-section__count">{products.length} item{products.length !== 1 ? 's' : ''}</span>
      </div>

      {products.length === 0 ? (
        <div className="grid-section__empty">
          <span>🔍</span>
          <p>Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="grid-section__grid">
          {products.map(p => (
            <ProductCard key={p._id} product={p} onClick={onProductClick} />
          ))}
        </div>
      )}
    </section>
  );
}