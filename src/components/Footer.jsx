import './Footer.scss';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__logo">
        Fake<span>Store</span>
      </div>
      <p className="footer__copy">© {new Date().getFullYear()} FakeStore — Projeto Marcopolo - Abraham, Gustavo & Murilo</p>
    </footer>
  );
}