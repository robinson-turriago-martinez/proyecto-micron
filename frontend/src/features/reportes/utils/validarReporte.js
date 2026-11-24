const LONGITUD_MINIMA_DESCRIPCION = 10;

/**
 * Indica si un texto es un número dentro del rango dado.
 * Las coordenadas son opcionales: un texto vacío se considera válido.
 */
export function esCoordenadaValida(texto, minimo, maximo) {
  if (texto.trim() === '') return true;
  const numero = Number(texto);
  return Number.isFinite(numero) && numero >= minimo && numero <= maximo;
}

/**
 * Valida el formulario de creación de un reporte.
 * @param {object} reporte - Datos del formulario.
 * @returns {object} Mensajes de error por campo; vacío si todo es válido.
 */
export function validarReporte(reporte) {
  const errores = {};

  if (!reporte.descripcion.trim()) errores.descripcion = 'Describe el problema';
  else if (reporte.descripcion.trim().length < LONGITUD_MINIMA_DESCRIPCION) {
    errores.descripcion = `Mínimo ${LONGITUD_MINIMA_DESCRIPCION} caracteres`;
  }

  if (!reporte.tipoResiduo) errores.tipoResiduo = 'Selecciona un tipo';
  if (!reporte.nivelAfectacion) errores.nivelAfectacion = 'Selecciona el nivel';
  if (!reporte.direccion.trim()) errores.direccion = 'La dirección es obligatoria';

  // Regla de negocio 4: las coordenadas deben ser geográficamente válidas
  if (!esCoordenadaValida(reporte.latitud, -90, 90)) errores.latitud = 'Debe estar entre -90 y 90';
  if (!esCoordenadaValida(reporte.longitud, -180, 180))
    errores.longitud = 'Debe estar entre -180 y 180';

  return errores;
}
