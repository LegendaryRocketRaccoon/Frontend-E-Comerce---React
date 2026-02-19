import { useState, useEffect } from 'react';
import './Header.scss';

export default function Header({ onSearchOpen }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header__logo">
        Fake<span>Store</span>
      </div>

      <nav className="header__nav">
        <a href="#produtos">Produtos</a>
        <a href="#categorias">Categorias</a>
      </nav>

      <div className="header__actions">
        <button className="header__search-btn" onClick={onSearchOpen} title="Buscar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </header>
  );
}