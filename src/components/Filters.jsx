import { useState, useEffect, useCallback } from 'react';
import './Filters.scss';

export default function Filters({ categories, onSearch, onCategory, onSort, activeCategory, activeSort }) {
  const [searchValue, setSearchValue] = useState('');


  useEffect(() => {
    const t = setTimeout(() => onSearch(searchValue), 350);
    return () => clearTimeout(t);
  }, [searchValue, onSearch]);

  return (
    <div className="filters" id="produtos">
      <div className="filters__inner">

        {/* Search */}
        <div className="filters__search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="filters__categories" id="categorias">
          <button
            className={`filters__cat-btn ${!activeCategory ? 'active' : ''}`}
            onClick={() => onCategory(null)}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              className={`filters__cat-btn ${activeCategory === cat._id ? 'active' : ''}`}
              onClick={() => onCategory(cat._id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="filters__sort">
          <label>Ordenar</label>
          <select value={activeSort} onChange={e => onSort(e.target.value)}>
            <option value="">Padrão</option>
            <option value="price_asc">Preço: menor</option>
            <option value="price_desc">Preço: maior</option>
            <option value="title_asc">Nome: A–Z</option>
            <option value="title_desc">Nome: Z–A</option>
          </select>
        </div>

      </div>
    </div>
  );
}