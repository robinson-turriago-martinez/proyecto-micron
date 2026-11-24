import './tabla.css';

/**
 * Tabla genérica: recibe columnas y filas y deja a cada columna decidir cómo se pinta.
 * @param {Array<{clave: string, titulo: string, render?: Function}>} columnas - Definición de columnas.
 * @param {Array<object>} filas - Registros a mostrar.
 * @param {string} claveFila - Propiedad única de cada fila, usada como key de React.
 * @param {string} mensajeVacio - Texto cuando no hay filas.
 */
function Tabla({ columnas, filas, claveFila = 'id', mensajeVacio = 'No hay registros' }) {
  return (
    <div className="tabla-contenedor">
      <table>
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.clave}>{columna.titulo}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila[claveFila]}>
              {columnas.map((columna) => (
                <td key={columna.clave}>
                  {columna.render ? columna.render(fila) : fila[columna.clave]}
                </td>
              ))}
            </tr>
          ))}
          {filas.length === 0 && (
            <tr>
              <td colSpan={columnas.length} className="tabla-vacia">
                {mensajeVacio}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Tabla;
