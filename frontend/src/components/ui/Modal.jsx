import './modal.css';

/**
 * Componente reutilizable: ventana modal.
 * Se cierra con el botón X, con la tecla Escape o al hacer clic en el fondo.
 */
function Modal({ titulo, abierto, onCerrar, children }) {
  if (!abierto) return null;

  return (
    <div className="modal-overlay" onClick={onCerrar} role="presentation">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
      >
        <div className="modal-header">
          <h2>{titulo}</h2>
          <button className="modal-close" onClick={onCerrar} aria-label="Cerrar">
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
