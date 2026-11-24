import { createContext, useContext, useState } from 'react';
import {
  usuariosPrueba,
  reportesPrueba,
  notificacionesPrueba,
  ESTADOS_CERRADOS,
} from '../data/datosPrueba';

const DatosContext = createContext(null);

/**
 * Proveedor del estado compartido de la aplicación (usuarios, reportes y notificaciones).
 * Mantiene los datos en memoria hasta que exista el backend.
 */
export function DatosProvider({ children }) {
  const [usuarios, setUsuarios] = useState(usuariosPrueba);
  const [reportes, setReportes] = useState(reportesPrueba);
  const [notificaciones] = useState(notificacionesPrueba);

  /**
   * Crea un usuario nuevo.
   * @param {object} datos - Campos del usuario sin id.
   * @returns {{ exito: boolean, mensaje?: string }}
   */
  function crearUsuario(datos) {
    // Regla de negocio 2: la cédula y el correo son únicos
    if (usuarios.some((usuario) => usuario.cedula === datos.cedula)) {
      return { exito: false, mensaje: 'La cédula ya existe' };
    }
    if (usuarios.some((usuario) => usuario.correo === datos.correo)) {
      return { exito: false, mensaje: 'El correo ya existe' };
    }
    const nuevoId = Math.max(0, ...usuarios.map((usuario) => usuario.id)) + 1;
    setUsuarios([...usuarios, { ...datos, id: nuevoId }]);
    return { exito: true };
  }

  function actualizarUsuario(datos) {
    const duplicaCedula = usuarios.some((u) => u.cedula === datos.cedula && u.id !== datos.id);
    const duplicaCorreo = usuarios.some((u) => u.correo === datos.correo && u.id !== datos.id);
    if (duplicaCedula) return { exito: false, mensaje: 'La cédula ya existe' };
    if (duplicaCorreo) return { exito: false, mensaje: 'El correo ya existe' };
    setUsuarios(usuarios.map((usuario) => (usuario.id === datos.id ? datos : usuario)));
    return { exito: true };
  }

  function eliminarUsuario(id) {
    setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
  }

  function alternarEstadoUsuario(id) {
    setUsuarios(
      usuarios.map((usuario) =>
        usuario.id === id
          ? { ...usuario, estado: usuario.estado === 'Activo' ? 'Inactivo' : 'Activo' }
          : usuario
      )
    );
  }

  /**
   * Crea un reporte nuevo en estado «Nuevo».
   * @param {object} datos - Campos del formulario de reporte.
   */
  function crearReporte(datos) {
    const nuevoId = Math.max(0, ...reportes.map((reporte) => reporte.id)) + 1;
    const hoy = new Date().toLocaleDateString('es-CO');
    const nuevo = {
      ...datos,
      id: nuevoId,
      estado: 'Nuevo',
      prioridad: 'Media',
      fecha: hoy,
      usuarioId: 4,
    };
    setReportes([nuevo, ...reportes]);
    return nuevo;
  }

  /**
   * Cambia el estado de un reporte.
   * @returns {{ exito: boolean, mensaje?: string }}
   */
  function cambiarEstadoReporte(id, nuevoEstado) {
    const reporte = reportes.find((item) => item.id === id);
    if (!reporte) return { exito: false, mensaje: 'Reporte no encontrado' };

    // Regla de negocio 1: un reporte cerrado no se modifica, para conservar la trazabilidad
    if (ESTADOS_CERRADOS.includes(reporte.estado)) {
      return { exito: false, mensaje: 'No se puede modificar un reporte cerrado' };
    }
    setReportes(reportes.map((item) => (item.id === id ? { ...item, estado: nuevoEstado } : item)));
    return { exito: true };
  }

  const valor = {
    usuarios,
    reportes,
    notificaciones,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    alternarEstadoUsuario,
    crearReporte,
    cambiarEstadoReporte,
  };

  return <DatosContext.Provider value={valor}>{children}</DatosContext.Provider>;
}

/** Acceso al estado compartido; falla con un mensaje claro si falta el proveedor. */
export function useDatos() {
  const contexto = useContext(DatosContext);
  if (!contexto) {
    throw new Error('useDatos debe usarse dentro de un DatosProvider');
  }
  return contexto;
}
