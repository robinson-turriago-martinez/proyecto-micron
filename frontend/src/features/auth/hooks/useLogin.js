import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validarLogin } from '../utils/validarAuth';

const FORMULARIO_VACIO = { usuario: '', contrasena: '' };

/** Lógica del inicio de sesión. Sin backend, un formulario válido lleva al dashboard. */
export function useLogin() {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [errores, setErrores] = useState({});

  function cambiarCampo(evento) {
    setFormulario({ ...formulario, [evento.target.name]: evento.target.value });
  }

  function enviar(evento) {
    evento.preventDefault();
    const erroresValidacion = validarLogin(formulario);
    setErrores(erroresValidacion);
    if (Object.keys(erroresValidacion).length > 0) return;
    navigate('/dashboard');
  }

  return { formulario, errores, cambiarCampo, enviar };
}
