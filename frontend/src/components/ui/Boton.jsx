import './boton.css';

/**
 * Botón reutilizable con variantes visuales.
 * @param {'primario'|'secundario'|'peligro'} variante - Estilo del botón.
 * @param {boolean} anchoCompleto - Ocupa todo el ancho del contenedor.
 */
function Boton({
  variante = 'primario',
  anchoCompleto = false,
  type = 'button',
  children,
  ...resto
}) {
  const clases = ['boton', `boton-${variante}`, anchoCompleto ? 'boton-ancho-completo' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={clases} {...resto}>
      {children}
    </button>
  );
}

export default Boton;
