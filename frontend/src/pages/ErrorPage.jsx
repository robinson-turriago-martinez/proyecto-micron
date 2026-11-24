import { useNavigate } from 'react-router-dom';
import './Auth.css';

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
            <path d="M13 3v6l2-2 2 2V3h2a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1h8zm-2 8H7v2h4v-2zm4 4H7v2h8v-2z" />
          </svg>
        </div>
        <h1 className="auth-title">Micron</h1>
        <p className="auth-subtitle">Ha ocurrido un problema</p>

        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              background: '#FEE2E2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" width="40" height="40" fill="#DC2626">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <h2 style={{ color: '#DC2626', fontSize: 20, marginBottom: 10 }}>
            Error de autenticación
          </h2>
          <p style={{ color: 'var(--texto-sec)', fontSize: 14, marginBottom: 20 }}>
            No hemos podido verificar tus credenciales. Por favor, revisa tu información e intenta
            nuevamente.
          </p>
          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 10,
              padding: 14,
              marginBottom: 24,
              textAlign: 'left',
            }}
          >
            <p style={{ fontSize: 13, color: '#991B1B', fontWeight: 600, marginBottom: 6 }}>
              Posibles causas:
            </p>
            <ul style={{ fontSize: 13, color: '#991B1B', paddingLeft: 18 }}>
              <li>Usuario o contraseña incorrectos</li>
              <li>La cuenta puede estar bloqueada</li>
              <li>Tu sesión ha expirado</li>
            </ul>
          </div>
          <button className="btn-full" onClick={() => navigate('/login')}>
            Intentar de nuevo
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
