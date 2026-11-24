import { useState } from 'react';
import './Notificaciones.css';

/**
 * Componente reutilizable: campana de notificaciones con panel desplegable.
 * RF.008 y RF.009 - avisos a los usuarios.
 */
function Notificaciones({ items = [] }) {
  const [abierto, setAbierto] = useState(false);
  const noLeidas = items.filter((n) => !n.leida).length;

  return (
    <div className="notif-wrapper">
      <button
        className="notif-boton"
        onClick={() => setAbierto(!abierto)}
        aria-label={`Notificaciones, ${noLeidas} sin leer`}
        aria-expanded={abierto}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#6B7280">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
        {noLeidas > 0 && <span className="notif-badge">{noLeidas}</span>}
      </button>

      {abierto && (
        <div className="notif-panel" role="menu">
          <div className="notif-panel-header">Notificaciones</div>
          {items.length === 0 && <p className="notif-vacio">No tienes notificaciones</p>}
          {items.map((n, i) => (
            <div key={i} className={`notif-item ${n.leida ? 'leida' : ''}`} role="menuitem">
              <span
                className="notif-dot"
                style={{ background: n.leida ? '#D1D5DB' : 'var(--azul)' }}
              ></span>
              <div>
                <p className="notif-mensaje">{n.mensaje}</p>
                <p className="notif-tiempo">{n.tiempo}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notificaciones;
