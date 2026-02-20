const BASE_URL = 'http://localhost:3000';


export function getAccessToken()  { return localStorage.getItem('accessToken'); }
export function getRefreshToken() { return localStorage.getItem('refreshToken'); }

function saveTokens({ accessToken, refreshToken }) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

export function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}


async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (refreshRes.ok) {
        const tokens = await refreshRes.json();
        saveTokens(tokens);
        headers['Authorization'] = `Bearer ${tokens.accessToken}`;
        res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
      } else {
        clearTokens();
        window.dispatchEvent(new Event('auth:logout'));
        throw new Error('Sessão expirada.');
      }
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erro ${res.status}`);
  }
  return res.json();
}


export async function register(name, email, password) {
  const data = await request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
  saveTokens(data);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}
export async function login(email, password) {
  const data = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  saveTokens(data);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}
export async function logout() {
  const refreshToken = getRefreshToken();
  await fetch(`${BASE_URL}/auth/logout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }) }).catch(() => {});
  clearTokens();
}


export const getProducts = (params = {}) => {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.sort)   qs.set('sort', params.sort);
  return request(`/products${qs.toString() ? '?' + qs : ''}`);
};
export const getProduct              = (id)          => request(`/products/${id}`);
export const getProductsByCategory   = (catId, p={}) => {
  const qs = new URLSearchParams();
  if (p.sort) qs.set('sort', p.sort);
  return request(`/products/category/${catId}${qs.toString() ? '?' + qs : ''}`);
};
export const getCategories = () => request('/categories');


export const getCart        = ()                    => request('/cart');
export const addToCart      = (productId, qty=1)    => request('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity: qty }) });
export const updateCart     = (productId, quantity) => request(`/cart/${productId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) });
export const removeFromCart = (productId)           => request(`/cart/${productId}`, { method: 'DELETE' });
export const clearCart      = ()                    => request('/cart', { method: 'DELETE' });


export const getReviews   = (productId)              => request(`/reviews/${productId}`);
export const postReview   = (productId, rating, comment) => request(`/reviews/${productId}`, { method: 'POST', body: JSON.stringify({ rating, comment }) });
export const deleteReview = (productId)              => request(`/reviews/${productId}`, { method: 'DELETE' });