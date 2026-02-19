const BASE_URL = 'http://localhost:3000';

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

export const getProducts = (params = {}) => {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.sort)   qs.set('sort', params.sort);
  const query = qs.toString() ? `?${qs}` : '';
  return request(`/products${query}`);
};

export const getProduct = (id) => request(`/products/${id}`);

export const getCategories = () => request(`/categories`);

export const getProductsByCategory = (categoryId, params = {}) => {
  const qs = new URLSearchParams();
  if (params.sort) qs.set('sort', params.sort);
  const query = qs.toString() ? `?${qs}` : '';
  return request(`/products/category/${categoryId}${query}`);
};