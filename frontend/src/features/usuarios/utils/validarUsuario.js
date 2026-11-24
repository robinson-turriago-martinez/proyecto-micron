import { PATRON_CORREO, PATRON_SOLO_DIGITOS } from '../../../utils/patrones';

/**
 * Valida el formato de los campos de un usuario.
 * La unicidad de cédula y correo no se valida aquí: es una regla de negocio del contexto.
 * @param {object} usuario - Datos del formulario.
 * @returns {object} Mensajes de error por campo; vacío si todo es válido.
 */
export function validarUsuario(usuario) {
  const errores = {};
  if (!usuario.nombres.trim()) errores.nombres = 'Escribe los nombres';
  if (!usuario.apellidos.trim()) errores.apellidos = 'Escribe los apellidos';
  if (!usuario.cedula.trim()) errores.cedula = 'Escribe la cédula';
  else if (!PATRON_SOLO_DIGITOS.test(usuario.cedula)) {
    errores.cedula = 'Escribe solo números, sin puntos ni espacios';
  }
  if (!usuario.correo.trim()) errores.correo = 'Escribe el correo electrónico';
  else if (!PATRON_CORREO.test(usuario.correo)) {
    errores.correo = 'Escribe un correo válido, por ejemplo nombre@dominio.co';
  }
  if (!usuario.rol) errores.rol = 'Selecciona un rol';
  return errores;
}
