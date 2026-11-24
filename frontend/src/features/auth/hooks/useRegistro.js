import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatos } from '../../../context/DatosContext';
import { validarRegistro } from '../utils/validarAuth';

const FORMULARIO_VACIO = {
  nombres: '',
  apellidos: '',
  cedula: '',
  fechaNacimiento: '',
  correo: '',
  contrasena: '',
};

/**
 * Lógica del registro. La unicidad de cédula y correo la decide el contexto (regla de negocio);
 * la contraseña no se guarda en los datos de prueba.
 */
export function useRegistro() {
  const navigate = useNavigate();
  const { crearUsuario } = useDatos();
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [errores, setErrores] = useState({});
  const [registrado, setRegistrado] = useState(false);

  function cambiarCampo(evento) {
    setFormulario({ ...formulario, [evento.target.name]: evento.target.value });
  }

  function enviar(evento) {
    evento.preventDefault();
    const erroresValidacion = validarRegistro(formulario);
    setErrores(erroresValidacion);
    if (Object.keys(erroresValidacion).length > 0) return;

    const { nombres, apellidos, cedula, correo } = formulario;
    const resultado = crearUsuario({
      nombres,
      apellidos,
      cedula,
      correo,
      rol: 'Ciudadano',
      estado: 'Activo',
    });
    if (!resultado.exito) {
      const campo = resultado.mensaje.includes('cédula') ? 'cedula' : 'correo';
      setErrores({ [campo]: `${resultado.mensaje}. Usa otro dato o inicia sesión.` });
      return;
    }
    setRegistrado(true);
  }

  function irAlLogin() {
    navigate('/login');
  }

  return { formulario, errores, registrado, cambiarCampo, enviar, irAlLogin };
}
