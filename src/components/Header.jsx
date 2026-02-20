import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.scss';

export default function Header({ onAuthOpen, cartCount = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header__logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        Fake<span>Store</span>
      </div>

      <nav className="header__nav">
        <a href="/#produtos">Produtos</a>
        <a href="/#categorias">Categorias</a>
      </nav>

      <div className="header__actions">
        <button className="header__icon-btn" onClick={() => navigate('/cart')} title="Carrinho">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {cartCount > 0 && <span className="header__badge">{cartCount}</span>}
        </button>

        {isLoggedIn ? (
          <div className="header__user-menu">
            <button
              className="header__icon-btn header__icon-btn--user"
              onClick={() => setUserMenuOpen(v => !v)}
            >
              <span className="header__avatar">{user.name[0].toUpperCase()}</span>
            </button>
            {userMenuOpen && (
              <div className="header__dropdown">
                <p className="header__dropdown-name">{user.name}</p>
                <p className="header__dropdown-email">{user.email}</p>
                <hr />
                <button onClick={() => { navigate('/cart'); setUserMenuOpen(false); }}>Meu carrinho</button>
                <button onClick={handleSignOut}>Sair</button>
              </div>
            )}
          </div>
        ) : (
          <button className="header__login-btn" onClick={onAuthOpen}>Entrar</button>
        )}
      </div>
    </header>
  );
}