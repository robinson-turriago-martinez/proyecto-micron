import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DatosProvider } from '../../../context/DatosContext';
import { useRegistro } from './useRegistro';
import { validarLogin, validarRegistro } from '../utils/validarAuth';

const envoltorio = ({ children }) => (
  <MemoryRouter>
    <DatosProvider>{children}</DatosProvider>
  </MemoryRouter>
);

const evento = (name, value) => ({ target: { name, value } });

const registroValido = {
  nombres: 'Ana',
  apellidos: 'Gómez',
  cedula: '1094000111',
  fechaNacimiento: '2000-05-10',
  correo: 'ana.gomez@correo.co',
  contrasena: 'segura123',
};

function llenar(result, datos) {
  Object.entries(datos).forEach(([campo, valor]) => {
    act(() => result.current.cambiarCampo(evento(campo, valor)));
  });
}

describe('validarLogin', () => {
  it('exige usuario y contraseña', () => {
    expect(Object.keys(validarLogin({ usuario: '', contrasena: '' }))).toEqual([
      'usuario',
      'contrasena',
    ]);
  });

  it('rechaza contraseñas cortas', () => {
    expect(validarLogin({ usuario: 'ana', contrasena: '123' }).contrasena).toBe(
      'Escribe al menos 6 caracteres'
    );
  });
});

describe('validarRegistro', () => {
  it('acepta un registro válido', () => {
    expect(validarRegistro(registroValido)).toEqual({});
  });

  it('rechaza cédula con letras y correo sin dominio', () => {
    const errores = validarRegistro({ ...registroValido, cedula: '12ab', correo: 'ana@' });
    expect(errores.cedula).toBeDefined();
    expect(errores.correo).toBeDefined();
  });
});

describe('useRegistro', () => {
  it('registra un ciudadano nuevo y muestra la confirmación', () => {
    const { result } = renderHook(() => useRegistro(), { wrapper: envoltorio });
    llenar(result, registroValido);
    act(() => result.current.enviar({ preventDefault() {} }));
    expect(result.current.registrado).toBe(true);
  });

  it('no registra una cédula existente y conserva lo escrito', () => {
    const { result } = renderHook(() => useRegistro(), { wrapper: envoltorio });
    llenar(result, { ...registroValido, cedula: '1023456789' });
    act(() => result.current.enviar({ preventDefault() {} }));
    expect(result.current.registrado).toBe(false);
    expect(result.current.errores.cedula).toMatch(/ya existe/);
    expect(result.current.formulario.nombres).toBe('Ana');
  });
});
