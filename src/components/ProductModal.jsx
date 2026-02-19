import { useEffect } from 'react';
import './ProductModal.scss';

export default function ProductModal({ product, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const price = typeof product.price === 'number'
    ? product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : '—';

  const avg  = product.rating?.avg?.toFixed(1) ?? '0.0';
  const total = product.rating?.total ?? 0;
  const categoryName = product.category?.name ?? '';

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__backdrop" onClick={onClose} />

      <div className="modal__box">
        {/* Image */}
        <div className="modal__img">
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.title} />
            : <div className="modal__img--placeholder">📦</div>
          }
        </div>

        {/* Info */}
        <div className="modal__info">
          {categoryName && <p className="modal__category">{categoryName}</p>}

          <h2 className="modal__title">{product.title}</h2>

          <p className="modal__price">{price}</p>

          <div className="modal__rating">
            <svg viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <strong>{avg}</strong>
            <span>/ 5 · {total} avaliações</span>
          </div>

          <div className="modal__divider" />

          <p className="modal__desc">
            {product.description || 'Sem descrição disponível.'}
          </p>
        </div>

        {/* Close */}
        <button className="modal__close" onClick={onClose} aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}