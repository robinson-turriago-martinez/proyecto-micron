import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { DatosProvider } from '../../../context/DatosContext';
import { useUsuarios } from './useUsuarios';
import { validarUsuario } from '../utils/validarUsuario';

const usarUsuarios = () => renderHook(() => useUsuarios(), { wrapper: DatosProvider });

const evento = (name, value) => ({ target: { name, value } });

function llenarFormulario(result, datos) {
  Object.entries(datos).forEach(([campo, valor]) => {
    act(() => result.current.cambiarCampo(evento(campo, valor)));
  });
}

describe('validarUsuario', () => {
  const valido = { nombres: 'Ana', apellidos: 'Gómez', cedula: '123', correo: 'a@b.co', rol: 'Ciudadano' };

  it('no reporta errores con datos válidos', () => {
    expect(validarUsuario(valido)).toEqual({});
  });

  it('exige los campos obligatorios', () => {
    const errores = validarUsuario({ nombres: '', apellidos: '', cedula: '', correo: '', rol: '' });
    expect(Object.keys(errores)).toEqual(['nombres', 'apellidos', 'cedula', 'correo', 'rol']);
  });

  it('rechaza una cédula con letras', () => {
    expect(validarUsuario({ ...valido, cedula: '12ab' }).cedula).toBe('Solo números');
  });

  it('rechaza un correo mal formado', () => {
    expect(validarUsuario({ ...valido, correo: 'sin-arroba' }).correo).toBe('Correo inválido');
  });
});

describe('useUsuarios', () => {
  it('filtra usuarios por el texto de búsqueda', () => {
    const { result } = usarUsuarios();
    act(() => result.current.setBusqueda('laura'));
    expect(result.current.usuariosFiltrados).toHaveLength(1);
    expect(result.current.usuariosFiltrados[0].nombres).toBe('Laura');
  });

  it('abre el modal en modo creación con el formulario vacío', () => {
    const { result } = usarUsuarios();
    act(() => result.current.abrirCrear());
    expect(result.current.modalAbierto).toBe(true);
    expect(result.current.estaEditando).toBe(false);
    expect(result.current.formulario.nombres).toBe('');
  });

  it('crea un usuario válido y cierra el modal', () => {
    const { result } = usarUsuarios();
    const antes = result.current.totalUsuarios;
    act(() => result.current.abrirCrear());
    llenarFormulario(result, {
      nombres: 'Ana', apellidos: 'Gómez', cedula: '777888999',
      correo: 'ana@correo.com', rol: 'Ciudadano',
    });
    act(() => result.current.guardar({ preventDefault() {} }));
    expect(result.current.totalUsuarios).toBe(antes + 1);
    expect(result.current.modalAbierto).toBe(false);
  });

  it('muestra el error de unicidad en el campo cédula y no cierra el modal', () => {
    const { result } = usarUsuarios();
    act(() => result.current.abrirCrear());
    llenarFormulario(result, {
      nombres: 'Ana', apellidos: 'Gómez', cedula: '1023456789',
      correo: 'nuevo@correo.com', rol: 'Ciudadano',
    });
    act(() => result.current.guardar({ preventDefault() {} }));
    expect(result.current.errores.cedula).toMatch(/cédula/i);
    expect(result.current.modalAbierto).toBe(true);
  });

  it('no guarda si el formato es inválido', () => {
    const { result } = usarUsuarios();
    const antes = result.current.totalUsuarios;
    act(() => result.current.abrirCrear());
    act(() => result.current.guardar({ preventDefault() {} }));
    expect(result.current.totalUsuarios).toBe(antes);
    expect(result.current.errores.nombres).toBe('Campo obligatorio');
  });
});
