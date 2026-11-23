import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatos } from '../../../context/DatosContext';
import { validarReporte } from '../utils/validarReporte';

const REPORTE_VACIO = {
  descripcion: '',
  tipoResiduo: '',
  nivelAfectacion: '',
  direccion: '',
  latitud: '',
  longitud: '',
};

/** Lógica del formulario de creación de reportes. */
export function useCrearReporte() {
  const navigate = useNavigate();
  const { crearReporte } = useDatos();
  const [formulario, setFormulario] = useState(REPORTE_VACIO);
  const [errores, setErrores] = useState({});

  function cambiarCampo(evento) {
    setFormulario({ ...formulario, [evento.target.name]: evento.target.value });
  }

  function enviar(evento) {
    evento.preventDefault();
    const erroresValidacion = validarReporte(formulario);
    setErrores(erroresValidacion);
    if (Object.keys(erroresValidacion).length > 0) return;

    const nuevo = crearReporte({
      descripcion: formulario.descripcion.trim(),
      tipoResiduo: formulario.tipoResiduo,
      nivelAfectacion: formulario.nivelAfectacion,
      ubicacion: formulario.direccion.trim(),
    });
    navigate(`/reporte/${nuevo.id}`);
  }

  function cancelar() {
    navigate('/dashboard');
  }

  return { formulario, errores, cambiarCampo, enviar, cancelar };
}
