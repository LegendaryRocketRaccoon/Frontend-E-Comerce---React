import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, updateCart, removeFromCart, clearCart } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './_cartPage.scss';

export default function CartPage({ onCartChange }) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await getCart();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return; }
    load();
  }, [isLoggedIn]);

  const handleQty = async (productId, qty) => {
    if (qty < 1) return handleRemove(productId);
    await updateCart(productId, qty);
    setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity: qty } : i));
    onCartChange?.();
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    setItems(prev => prev.filter(i => i.productId !== productId));
    onCartChange?.();
  };

  const handleClear = async () => {
    await clearCart();
    setItems([]);
    onCartChange?.();
  };

  const total = items.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0);

  if (!isLoggedIn) return (
    <div className="cart-page cart-page--empty">
      <h1>Meu Carrinho</h1>
      <p>Faça login para ver seu carrinho.</p>
      <button onClick={() => navigate('/')}>Voltar à loja</button>
    </div>
  );

  if (loading) return (
    <div className="cart-page cart-page--loading">
      <div className="cart-page__skeleton" />
    </div>
  );

  return (
    <div className="cart-page">
      <div className="cart-page__header">
        <button className="cart-page__back" onClick={() => navigate(-1)}>← Voltar</button>
        <h1 className="cart-page__title">Meu Carrinho</h1>
        {items.length > 0 && (
          <button className="cart-page__clear" onClick={handleClear}>Limpar carrinho</button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="cart-page--empty">
          <span>🛒</span>
          <p>Seu carrinho está vazio.</p>
          <button onClick={() => navigate('/')}>Ver produtos</button>
        </div>
      ) : (
        <div className="cart-page__layout">
          <ul className="cart-page__list">
            {items.map(item => {
              const p = item.product;
              const price = p?.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? '—';
              const subtotal = ((p?.price ?? 0) * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

              return (
                <li key={item.productId} className="cart-item">
                  <div className="cart-item__img" onClick={() => navigate(`/product/${item.productId}`)}>
                    {p?.imageUrl
                      ? <img src={p.imageUrl} alt={p.title} />
                      : <span>📦</span>
                    }
                  </div>
                  <div className="cart-item__info">
                    <p className="cart-item__name" onClick={() => navigate(`/product/${item.productId}`)}>
                      {p?.title ?? 'Produto removido'}
                    </p>
                    <p className="cart-item__price">{price} cada</p>
                  </div>
                  <div className="cart-item__qty">
                    <button onClick={() => handleQty(item.productId, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQty(item.productId, item.quantity + 1)}>+</button>
                  </div>
                  <p className="cart-item__subtotal">{subtotal}</p>
                  <button className="cart-item__remove" onClick={() => handleRemove(item.productId)} aria-label="Remover">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="cart-page__summary">
            <h2>Resumo</h2>
            <div className="cart-page__summary-row">
              <span>{items.reduce((s, i) => s + i.quantity, 0)} item(s)</span>
              <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <hr />
            <div className="cart-page__summary-total">
              <span>Total</span>
              <strong>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
            </div>
            <button className="cart-page__checkout">Finalizar compra</button>
          </div>
        </div>
      )}
    </div>
  );
}