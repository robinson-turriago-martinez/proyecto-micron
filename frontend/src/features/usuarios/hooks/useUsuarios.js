import { useState } from 'react';
import { useDatos } from '../../../context/DatosContext';
import { validarUsuario } from '../utils/validarUsuario';

const USUARIO_VACIO = {
  id: null,
  nombres: '',
  apellidos: '',
  cedula: '',
  correo: '',
  rol: '',
  estado: 'Activo',
};

/**
 * Lógica de la gestión de usuarios: búsqueda, modal, formulario y acciones.
 * La página que lo usa solo se ocupa de pintar.
 */
export function useUsuarios() {
  const { usuarios, crearUsuario, actualizarUsuario, eliminarUsuario, alternarEstadoUsuario } =
    useDatos();

  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formulario, setFormulario] = useState(USUARIO_VACIO);
  const [errores, setErrores] = useState({});
  const [estaEditando, setEstaEditando] = useState(false);

  const usuariosFiltrados = usuarios.filter((usuario) =>
    `${usuario.nombres} ${usuario.apellidos} ${usuario.correo} ${usuario.cedula}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const totalActivos = usuarios.filter((usuario) => usuario.estado === 'Activo').length;
  const totalAdministradores = usuarios.filter((usuario) => usuario.rol === 'Administrador').length;

  function abrirCrear() {
    setFormulario(USUARIO_VACIO);
    setEstaEditando(false);
    setErrores({});
    setModalAbierto(true);
  }

  function abrirEditar(usuario) {
    setFormulario(usuario);
    setEstaEditando(true);
    setErrores({});
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
  }

  function cambiarCampo(evento) {
    setFormulario({ ...formulario, [evento.target.name]: evento.target.value });
  }

  function guardar(evento) {
    evento.preventDefault();
    const erroresFormato = validarUsuario(formulario);
    setErrores(erroresFormato);
    if (Object.keys(erroresFormato).length > 0) return;

    const resultado = estaEditando ? actualizarUsuario(formulario) : crearUsuario(formulario);
    if (!resultado.exito) {
      const campo = resultado.mensaje.toLowerCase().includes('cédula') ? 'cedula' : 'correo';
      setErrores({ [campo]: resultado.mensaje });
      return;
    }
    setModalAbierto(false);
  }

  function eliminar(id) {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      eliminarUsuario(id);
    }
  }

  return {
    usuariosFiltrados,
    totalUsuarios: usuarios.length,
    totalActivos,
    totalAdministradores,
    busqueda,
    setBusqueda,
    modalAbierto,
    formulario,
    errores,
    estaEditando,
    abrirCrear,
    abrirEditar,
    cerrarModal,
    cambiarCampo,
    guardar,
    eliminar,
    alternarEstado: alternarEstadoUsuario,
  };
}
