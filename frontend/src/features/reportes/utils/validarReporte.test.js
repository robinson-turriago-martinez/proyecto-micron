import { describe, it, expect } from 'vitest';
import { validarReporte, esCoordenadaValida } from './validarReporte';

const valido = {
  descripcion: 'Basura acumulada en la esquina',
  tipoResiduo: 'Mixto',
  nivelAfectacion: 'Alto',
  direccion: 'Calle 1 con Cra 2',
  latitud: '',
  longitud: '',
};

describe('esCoordenadaValida', () => {
  it('acepta un texto vacío porque las coordenadas son opcionales', () => {
    expect(esCoordenadaValida('', -90, 90)).toBe(true);
    expect(esCoordenadaValida('   ', -90, 90)).toBe(true);
  });

  it('acepta valores dentro del rango, incluidos los límites', () => {
    expect(esCoordenadaValida('4.6097', -90, 90)).toBe(true);
    expect(esCoordenadaValida('-90', -90, 90)).toBe(true);
    expect(esCoordenadaValida('90', -90, 90)).toBe(true);
  });

  it('rechaza valores fuera del rango', () => {
    expect(esCoordenadaValida('90.0001', -90, 90)).toBe(false);
    expect(esCoordenadaValida('-181', -180, 180)).toBe(false);
  });

  it('rechaza texto que no es un número', () => {
    expect(esCoordenadaValida('abc', -90, 90)).toBe(false);
    expect(esCoordenadaValida('NaN', -90, 90)).toBe(false);
    expect(esCoordenadaValida('Infinity', -90, 90)).toBe(false);
  });
});

describe('validarReporte', () => {
  it('no reporta errores con un reporte válido', () => {
    expect(validarReporte(valido)).toEqual({});
  });

  it('exige los campos obligatorios', () => {
    const errores = validarReporte({ ...valido, descripcion: '', tipoResiduo: '', nivelAfectacion: '', direccion: '' });
    expect(Object.keys(errores)).toEqual(['descripcion', 'tipoResiduo', 'nivelAfectacion', 'direccion']);
  });

  it('exige una descripción de al menos 10 caracteres', () => {
    expect(validarReporte({ ...valido, descripcion: 'corta' }).descripcion).toMatch(/Mínimo 10/);
  });

  it('no cuenta los espacios al medir la descripción', () => {
    expect(validarReporte({ ...valido, descripcion: '   corta   ' }).descripcion).toMatch(/Mínimo 10/);
  });

  it('rechaza una latitud fuera de rango (regla de negocio 4)', () => {
    expect(validarReporte({ ...valido, latitud: '200' }).latitud).toBe('Debe estar entre -90 y 90');
  });

  it('rechaza una longitud fuera de rango (regla de negocio 4)', () => {
    expect(validarReporte({ ...valido, longitud: '-200' }).longitud).toBe('Debe estar entre -180 y 180');
  });
});
