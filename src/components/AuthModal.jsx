import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { login, register } from '../services/api';
import './AuthModal.scss';

export default function AuthModal({ onClose }) {
  const { signIn } = useAuth();
  const [mode, setMode]     = useState('login');
  const [form, setForm]     = useState({ name: '', email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let data;
      if (mode === 'login') {
        data = await login(form.email, form.password);
      } else {
        if (!form.name.trim()) { setError('Nome é obrigatório.'); return; }
        data = await register(form.name, form.email, form.password);
      }
      signIn(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal">
      <div className="auth-modal__backdrop" onClick={onClose} />
      <div className="auth-modal__box">
        <button className="auth-modal__close" onClick={onClose} aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="auth-modal__tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>
            Entrar
          </button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); }}>
            Cadastrar
          </button>
        </div>

        <form className="auth-modal__form" onSubmit={submit}>
          {mode === 'register' && (
            <div className="auth-modal__field">
              <label>Nome</label>
              <input type="text" value={form.name} onChange={update('name')} placeholder="Seu nome" required />
            </div>
          )}
          <div className="auth-modal__field">
            <label>E-mail</label>
            <input type="email" value={form.email} onChange={update('email')} placeholder="email@exemplo.com" required />
          </div>
          <div className="auth-modal__field">
            <label>Senha</label>
            <input type="password" value={form.password} onChange={update('password')} placeholder="••••••••" required minLength={6} />
          </div>

          {error && <p className="auth-modal__error">{error}</p>}

          <button className="auth-modal__submit" type="submit" disabled={loading}>
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  );
}