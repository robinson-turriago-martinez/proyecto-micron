import { useNavigate } from 'react-router-dom';
import Boton from '../components/ui/Boton';
import '../styles/auth.css';

/** Página que se muestra cuando la ruta solicitada no existe. */
function NoEncontradaPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">404</h1>
        <p className="auth-subtitle">La página que buscas no existe</p>
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--texto-sec)', fontSize: 14, marginBottom: 20 }}>
            Revisa la dirección o vuelve al inicio.
          </p>
          <Boton anchoCompleto onClick={() => navigate('/login')}>
            Ir al inicio
          </Boton>
        </div>
      </div>
    </div>
  );
}

export default NoEncontradaPage;
