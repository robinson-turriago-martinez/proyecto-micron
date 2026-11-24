import Sidebar from './Sidebar';
import './layout.css';

/**
 * Componente reutilizable: estructura de página con sidebar + contenido.
 */
function Layout({ subtitulo, items, children }) {
  return (
    <div className="layout">
      <Sidebar subtitulo={subtitulo} items={items} />
      <main className="layout-content">{children}</main>
    </div>
  );
}

export default Layout;
