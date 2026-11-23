const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PATRON_SOLO_DIGITOS = /^\d+$/;

/**
 * Valida el formato de los campos de un usuario.
 * La unicidad de cédula y correo no se valida aquí: es una regla de negocio del contexto.
 * @param {object} usuario - Datos del formulario.
 * @returns {object} Mensajes de error por campo; vacío si todo es válido.
 */
export function validarUsuario(usuario) {
  const errores = {};
  if (!usuario.nombres.trim()) errores.nombres = 'Campo obligatorio';
  if (!usuario.apellidos.trim()) errores.apellidos = 'Campo obligatorio';

  if (!usuario.cedula.trim()) errores.cedula = 'Campo obligatorio';
  else if (!PATRON_SOLO_DIGITOS.test(usuario.cedula)) errores.cedula = 'Solo números';

  if (!usuario.correo.trim()) errores.correo = 'Campo obligatorio';
  else if (!PATRON_CORREO.test(usuario.correo)) errores.correo = 'Correo inválido';

  if (!usuario.rol) errores.rol = 'Selecciona un rol';
  return errores;
}
