import './ProductCard.scss';

export default function ProductCard({ product, onClick }) {
  const price = typeof product.price === 'number'
    ? product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : '—';

  const avg = product.rating?.avg?.toFixed(1) ?? '—';
  const categoryName = product.category?.name ?? '';

  return (
    <article className="card" onClick={() => onClick(product)}>
      <div className="card__img">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.title} loading="lazy" />
        ) : (
          <div className="card__img--placeholder">📦</div>
        )}
        <div className="card__overlay"><span>Ver detalhes</span></div>
        {categoryName && (
          <span className="card__category">{categoryName}</span>
        )}
      </div>

      <div className="card__body">
        <h3 className="card__title">{product.title}</h3>
        <div className="card__footer">
          <span className="card__price">{price}</span>
          <div className="card__rating">
            <svg viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {avg}
          </div>
        </div>
      </div>
    </article>
  );
}