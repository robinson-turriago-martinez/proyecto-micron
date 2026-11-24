import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDatos } from '../../../context/DatosContext';
import { ESTADOS_CERRADOS } from '../../../data/datosPrueba';

const FORMULARIO_VACIO = { nuevoEstado: '', comentario: '' };

/** Lógica de la página de detalle: busca el reporte por id y gestiona el cambio de estado. */
export function useDetalleReporte() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { reportes, usuarios, cambiarEstadoReporte } = useDatos();
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [errores, setErrores] = useState({});
  const [confirmando, setConfirmando] = useState(false);

  const reporte = reportes.find((item) => item.id === Number(id));
  const autor = reporte ? usuarios.find((usuario) => usuario.id === reporte.usuarioId) : undefined;
  const estaCerrado = reporte ? ESTADOS_CERRADOS.includes(reporte.estado) : false;

  function cambiarCampo(evento) {
    setFormulario({ ...formulario, [evento.target.name]: evento.target.value });
  }

  function enviar(evento) {
    evento.preventDefault();
    const erroresValidacion = {};
    if (!formulario.nuevoEstado) erroresValidacion.nuevoEstado = 'Selecciona un estado';
    if (!formulario.comentario.trim()) erroresValidacion.comentario = 'Agrega un comentario';
    setErrores(erroresValidacion);
    if (Object.keys(erroresValidacion).length > 0) return;

    // Cerrar un reporte es irreversible (regla de negocio 1): se pide confirmación antes de aplicarlo.
    if (ESTADOS_CERRADOS.includes(formulario.nuevoEstado)) {
      setConfirmando(true);
      return;
    }
    aplicarCambio();
  }

  function aplicarCambio() {
    setConfirmando(false);
    const resultado = cambiarEstadoReporte(reporte.id, formulario.nuevoEstado);
    if (!resultado.exito) {
      setErrores({ nuevoEstado: resultado.mensaje });
      return;
    }
    navigate('/reportes');
  }

  function cancelarConfirmacion() {
    setConfirmando(false);
  }
  function volver() {
    navigate('/reportes');
  }

  return {
    reporte,
    autor,
    estaCerrado,
    formulario,
    errores,
    confirmando,
    cambiarCampo,
    enviar,
    aplicarCambio,
    cancelarConfirmacion,
    volver,
  };
}
