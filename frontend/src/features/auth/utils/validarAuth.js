import { PATRON_CORREO, PATRON_SOLO_DIGITOS } from '../../../utils/patrones';

export const LONGITUD_MINIMA_CONTRASENA_LOGIN = 6;
export const LONGITUD_MINIMA_CONTRASENA_REGISTRO = 8;

/** Valida los campos del inicio de sesión; devuelve un objeto vacío si todo es válido. */
export function validarLogin(formulario) {
  const errores = {};
  if (!formulario.usuario.trim()) errores.usuario = 'Escribe tu usuario';
  if (!formulario.contrasena) errores.contrasena = 'Escribe tu contraseña';
  else if (formulario.contrasena.length < LONGITUD_MINIMA_CONTRASENA_LOGIN) {
    errores.contrasena = `Escribe al menos ${LONGITUD_MINIMA_CONTRASENA_LOGIN} caracteres`;
  }
  return errores;
}

/** Valida el formulario de registro; devuelve un objeto vacío si todo es válido. */
export function validarRegistro(formulario) {
  const errores = {};
  if (!formulario.nombres.trim()) errores.nombres = 'Escribe tus nombres';
  if (!formulario.apellidos.trim()) errores.apellidos = 'Escribe tus apellidos';
  if (!formulario.cedula.trim()) errores.cedula = 'Escribe tu cédula';
  else if (!PATRON_SOLO_DIGITOS.test(formulario.cedula)) {
    errores.cedula = 'Escribe solo números, sin puntos ni espacios';
  }
  if (!formulario.fechaNacimiento) errores.fechaNacimiento = 'Selecciona tu fecha de nacimiento';
  if (!formulario.correo.trim()) errores.correo = 'Escribe tu correo electrónico';
  else if (!PATRON_CORREO.test(formulario.correo)) {
    errores.correo = 'Escribe un correo válido, por ejemplo nombre@dominio.co';
  }
  if (!formulario.contrasena) errores.contrasena = 'Escribe una contraseña';
  else if (formulario.contrasena.length < LONGITUD_MINIMA_CONTRASENA_REGISTRO) {
    errores.contrasena = `Escribe al menos ${LONGITUD_MINIMA_CONTRASENA_REGISTRO} caracteres`;
  }
  return errores;
}
