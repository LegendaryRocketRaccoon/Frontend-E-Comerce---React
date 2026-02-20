import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, getReviews, postReview, addToCart } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './_productPage.scss';

function StarRating({ value, onChange, readOnly = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className={`stars ${readOnly ? 'stars--readonly' : 'stars--interactive'}`}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`stars__btn ${n <= (hover || value) ? 'filled' : ''}`}
          onMouseEnter={() => !readOnly && setHover(n)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => !readOnly && onChange && onChange(n)}
          disabled={readOnly}
          aria-label={`${n} estrelas`}
        >★</button>
      ))}
    </div>
  );
}

export default function ProductPage({ onAddedToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [product, setProduct]   = useState(null);
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);

  const [myRating, setMyRating]   = useState(0);
  const [myComment, setMyComment] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  const [addingCart, setAddingCart] = useState(false);
  const [cartMsg, setCartMsg]       = useState('');
  const [qty, setQty]               = useState(1);

  useEffect(() => {
    setLoading(true);
    Promise.all([getProduct(id), getReviews(id)])
      .then(([prod, revs]) => { setProduct(prod); setReviews(revs); })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddCart = async () => {
    if (!isLoggedIn) { setCartMsg('Faça login para adicionar ao carrinho.'); return; }
    setAddingCart(true);
    setCartMsg('');
    try {
      await addToCart(id, qty);
      setCartMsg('Adicionado ao carrinho.');
      onAddedToCart?.();
      setTimeout(() => setCartMsg(''), 3000);
    } catch (err) {
      setCartMsg(err.message);
    } finally {
      setAddingCart(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!myRating) { setReviewMsg('Selecione uma nota.'); return; }
    setReviewing(true);
    setReviewMsg('');
    try {
      const updated = await postReview(id, myRating, myComment);
      setReviewMsg('Avaliação salva.');

      const [prod, revs] = await Promise.all([getProduct(id), getReviews(id)]);
      setProduct(prod);
      setReviews(revs);
      setTimeout(() => setReviewMsg(''), 3000);
    } catch (err) {
      setReviewMsg(err.message);
    } finally {
      setReviewing(false);
    }
  };

  if (loading) return (
    <div className="product-page product-page--loading">
      <div className="product-page__skeleton" />
    </div>
  );

  if (!product) return null;

  const price = product.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? '—';
  const avg   = product.rating?.avg?.toFixed(1) ?? '0.0';
  const total = product.rating?.total ?? 0;

  return (
    <div className="product-page">
      <button className="product-page__back" onClick={() => navigate(-1)}>
        ← Voltar
      </button>

      <div className="product-page__main">
        {/* Image */}
        <div className="product-page__img">
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.title} />
            : <div className="product-page__img-placeholder">📦</div>
          }
        </div>

        {/* Info */}
        <div className="product-page__info">
          {product.category?.name && (
            <p className="product-page__category">{product.category.name}</p>
          )}
          <h1 className="product-page__title">{product.title}</h1>

          <div className="product-page__rating">
            <StarRating value={Math.round(product.rating?.avg ?? 0)} readOnly />
            <span>{avg} <em>({total} avaliações)</em></span>
          </div>

          <p className="product-page__price">{price}</p>

          <p className="product-page__desc">{product.description}</p>

          <div className="product-page__cart-row">
            <div className="product-page__qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <button
              className="product-page__add-btn"
              onClick={handleAddCart}
              disabled={addingCart}
            >
              {addingCart ? 'Adicionando...' : 'Adicionar ao carrinho'}
            </button>
          </div>
          {cartMsg && <p className={`product-page__msg ${cartMsg.includes('.') ? 'success' : 'error'}`}>{cartMsg}</p>}
        </div>
      </div>

      {/* Reviews */}
      <section className="product-page__reviews">
        <h2 className="product-page__reviews-title">Avaliações</h2>

        {/* Write review */}
        {isLoggedIn ? (
          <form className="product-page__review-form" onSubmit={handleReview}>
            <p className="product-page__review-form-label">Sua avaliação</p>
            <StarRating value={myRating} onChange={setMyRating} />
            <textarea
              value={myComment}
              onChange={e => setMyComment(e.target.value)}
              placeholder="Escreva um comentário (opcional)..."
              rows={3}
            />
            {reviewMsg && <p className={`product-page__msg ${reviewMsg.includes('.') ? 'success' : 'error'}`}>{reviewMsg}</p>}
            <button type="submit" disabled={reviewing}>
              {reviewing ? 'Salvando...' : 'Enviar avaliação'}
            </button>
          </form>
        ) : (
          <p className="product-page__review-login">
            <span>Faça login para avaliar este produto.</span>
          </p>
        )}

        {/* List */}
        {reviews.length === 0 ? (
          <p className="product-page__no-reviews">Nenhuma avaliação ainda. Seja o primeiro.</p>
        ) : (
          <ul className="product-page__review-list">
            {reviews.map(r => (
              <li key={r._id} className="product-page__review-item">
                <div className="product-page__review-header">
                  <span className="product-page__review-user">{r.user?.name ?? 'Usuário'}</span>
                  <StarRating value={r.rating} readOnly />
                  <span className="product-page__review-date">
                    {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {r.comment && <p className="product-page__review-comment">{r.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}