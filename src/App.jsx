import { useState, useEffect, useCallback } from 'react';
import { getProducts, getCategories, getProductsByCategory } from './services/api';
import Header from './components/Header';
import Hero from './components/Hero';
import Filters from './components/Filters';
import ProductGrid from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import Footer from './components/Footer';
import './styles/App.scss';

export default function App() {
  const [products, setProducts]         = useState([]);
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedProduct, setSelected]  = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSort, setActiveSort]     = useState('');
  const [search, setSearch]             = useState('');


  useEffect(() => {
    getCategories()
      .then(data => setCategories(data.items ?? data))
      .catch(console.error);
  }, []);


  useEffect(() => {
    setLoading(true);
    const fetch = activeCategory
      ? getProductsByCategory(activeCategory, { sort: activeSort })
      : getProducts({ search, sort: activeSort });

    fetch
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory, activeSort, search]);

  const handleSearch = useCallback((val) => {
    setSearch(val);
    setActiveCategory(null);
  }, []);

  const handleCategory = useCallback((id) => {
    setActiveCategory(id);
    setSearch('');
  }, []);

  return (
    <div className="app">
      <Header onSearchOpen={() => document.querySelector('.filters__search input')?.focus()} />

      <Hero totalProducts={products.length} totalCategories={categories.length} />

      <Filters
        categories={categories}
        onSearch={handleSearch}
        onCategory={handleCategory}
        onSort={setActiveSort}
        activeCategory={activeCategory}
        activeSort={activeSort}
      />

      <ProductGrid
        products={products}
        loading={loading}
        onProductClick={setSelected}
      />

      <Footer />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}