import { NavLink } from 'react-router-dom'
import './Sidebar.css'

/**
 * Componente reutilizable: barra lateral de navegación.
 * Recibe el subtítulo (panel segun rol) y los items del menu.
 */
function Sidebar({ subtitulo = 'Panel', items = [] }) {
  return (
    <aside className="sidebar" aria-label="Menú de navegación principal">
      <div className="sidebar-logo">
        <div className="sidebar-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <div>
          <h3>Micron</h3>
          <p>{subtitulo}</p>
        </div>
      </div>
      <nav>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
