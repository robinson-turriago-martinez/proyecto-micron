import './MapaPlaceholder.css'

/**
 * Componente reutilizable: representación visual de un mapa (placeholder).
 * No usa librerías externas. Muestra marcadores de ejemplo con colores por estado.
 */
function MapaPlaceholder({ altura = 300, marcadores = [], etiqueta = 'Mapa de ubicación' }) {
  return (
    <div className="mapa-placeholder" style={{ height: altura }} role="img" aria-label={etiqueta}>
      <div className="mapa-grid" aria-hidden="true"></div>
      <span className="mapa-etiqueta">🗺️ {etiqueta}</span>
      {marcadores.map((m, i) => (
        <span
          key={i}
          className="mapa-marcador"
          style={{ left: `${m.x}%`, top: `${m.y}%`, background: m.color }}
          title={m.titulo}
          aria-hidden="true"
        ></span>
      ))}
    </div>
  )
}

export default MapaPlaceholder
