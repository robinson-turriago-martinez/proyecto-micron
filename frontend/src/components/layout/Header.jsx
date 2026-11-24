import Notificaciones from './Notificaciones';
import './header.css';

/**
 * Componente reutilizable: encabezado de página.
 * Muestra título, subtítulo, campana de notificaciones y datos del usuario.
 */
function Header({
  titulo,
  subtitulo,
  usuario = 'Usuario',
  rol = '',
  iniciales = 'U',
  notificaciones = null,
}) {
  return (
    <header className="page-header">
      <div>
        <h1>{titulo}</h1>
        {subtitulo && <p>{subtitulo}</p>}
      </div>
      <div className="header-user">
        {notificaciones && <Notificaciones items={notificaciones} />}
        <div className="header-user-info">
          <span className="header-user-name">{usuario}</span>
          {rol && <span className="header-user-role">{rol}</span>}
        </div>
        <div className="header-avatar" aria-hidden="true">
          {iniciales}
        </div>
      </div>
    </header>
  );
}

export default Header;
