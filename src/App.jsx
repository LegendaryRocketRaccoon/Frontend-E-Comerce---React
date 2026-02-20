import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { getProducts, getCategories, getProductsByCategory, getCart } from './services/api';
import { useAuth } from './contexts/AuthContext';

import Header       from './components/Header';
import Hero         from './components/Hero';
import Filters      from './components/Filters';
import ProductGrid  from './components/ProductGrid';
import ProductModal from './components/ProductModal';
import Footer       from './components/Footer';
import AuthModal    from './components/AuthModal';
import ProductPage  from './pages/ProductPage';
import CartPage     from './pages/CartPage';

import './styles/App.scss';


function HomePage({ onProductClick }) {
  const [products, setProducts]         = useState([]);
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
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
    <>
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
        onProductClick={onProductClick}
      />
    </>
  );
}


export default function App() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [selectedProduct, setSelected] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);


  const refreshCartCount = useCallback(async () => {
    if (!isLoggedIn) { setCartCount(0); return; }
    try {
      const items = await getCart();
      setCartCount(items.reduce((s, i) => s + i.quantity, 0));
    } catch {
      setCartCount(0);
    }
  }, [isLoggedIn]);

  useEffect(() => { refreshCartCount(); }, [refreshCartCount]);


  const handleModalTitleClick = (product) => {
    setSelected(null);
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="app">
      <Header
        onAuthOpen={() => setAuthModalOpen(true)}
        cartCount={cartCount}
      />

      <Routes>
        <Route
          path="/"
          element={<HomePage onProductClick={setSelected} />}
        />
        <Route
          path="/product/:id"
          element={<ProductPage onAddedToCart={refreshCartCount} />}
        />
        <Route
          path="/cart"
          element={<CartPage onCartChange={refreshCartCount} />}
        />
      </Routes>

      <Footer />

      {/* Modal de prévia do produto */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelected(null)}
          onTitleClick={handleModalTitleClick}
        />
      )}

      {/* Modal de login/cadastro */}
      {authModalOpen && (
        <AuthModal onClose={() => setAuthModalOpen(false)} />
      )}
    </div>
  );
}