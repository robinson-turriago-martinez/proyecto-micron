import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { DatosProvider, useDatos } from './DatosContext';

const usarDatos = () => renderHook(() => useDatos(), { wrapper: DatosProvider });

const usuarioNuevo = {
  nombres: 'Ana',
  apellidos: 'Gómez',
  cedula: '999000111',
  correo: 'ana.gomez@correo.com',
  rol: 'Ciudadano',
  estado: 'Activo',
};

describe('usuarios: regla de unicidad', () => {
  it('crea un usuario con cédula y correo nuevos', () => {
    const { result } = usarDatos();
    const antes = result.current.usuarios.length;

    let respuesta;
    act(() => {
      respuesta = result.current.crearUsuario(usuarioNuevo);
    });

    expect(respuesta.exito).toBe(true);
    expect(result.current.usuarios.length).toBe(antes + 1);
  });

  it('rechaza una cédula que ya existe', () => {
    const { result } = usarDatos();
    const antes = result.current.usuarios.length;

    let respuesta;
    act(() => {
      respuesta = result.current.crearUsuario({ ...usuarioNuevo, cedula: '1023456789' });
    });

    expect(respuesta.exito).toBe(false);
    expect(respuesta.mensaje).toMatch(/cédula/i);
    expect(result.current.usuarios.length).toBe(antes);
  });

  it('rechaza un correo que ya existe', () => {
    const { result } = usarDatos();

    let respuesta;
    act(() => {
      respuesta = result.current.crearUsuario({ ...usuarioNuevo, correo: 'jorge.ortiz@micron.gov.co' });
    });

    expect(respuesta.exito).toBe(false);
    expect(respuesta.mensaje).toMatch(/correo/i);
  });

  it('permite editar un usuario conservando su propia cédula', () => {
    const { result } = usarDatos();
    const existente = result.current.usuarios[0];

    let respuesta;
    act(() => {
      respuesta = result.current.actualizarUsuario({ ...existente, nombres: 'Jorge Luis' });
    });

    expect(respuesta.exito).toBe(true);
    expect(result.current.usuarios[0].nombres).toBe('Jorge Luis');
  });
});

describe('reportes: regla de reporte cerrado', () => {
  it('crea un reporte nuevo en estado Nuevo', () => {
    const { result } = usarDatos();

    let creado;
    act(() => {
      creado = result.current.crearReporte({
        descripcion: 'Basura acumulada en la esquina',
        tipoResiduo: 'Mixto',
        nivelAfectacion: 'Alto',
        ubicacion: 'Calle 1 con Cra 2',
      });
    });

    expect(creado.estado).toBe('Nuevo');
    expect(result.current.reportes[0].id).toBe(creado.id);
  });

  it('cambia el estado de un reporte abierto', () => {
    const { result } = usarDatos();

    let respuesta;
    act(() => {
      respuesta = result.current.cambiarEstadoReporte(12, 'En proceso');
    });

    expect(respuesta.exito).toBe(true);
    expect(result.current.reportes.find((r) => r.id === 12).estado).toBe('En proceso');
  });

  it('rechaza cambiar el estado de un reporte Resuelto', () => {
    const { result } = usarDatos();

    let respuesta;
    act(() => {
      respuesta = result.current.cambiarEstadoReporte(9, 'Nuevo');
    });

    expect(respuesta.exito).toBe(false);
    expect(result.current.reportes.find((r) => r.id === 9).estado).toBe('Resuelto');
  });

  it('informa cuando el reporte no existe', () => {
    const { result } = usarDatos();

    let respuesta;
    act(() => {
      respuesta = result.current.cambiarEstadoReporte(9999, 'Resuelto');
    });

    expect(respuesta.exito).toBe(false);
  });
});
