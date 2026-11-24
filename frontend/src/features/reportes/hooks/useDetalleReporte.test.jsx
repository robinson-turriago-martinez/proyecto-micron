import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DatosProvider } from '../../../context/DatosContext';
import { useDetalleReporte } from './useDetalleReporte';

const envoltorio = ({ children }) => (
  <MemoryRouter initialEntries={['/reporte/12']}>
    <DatosProvider>
      <Routes>
        <Route path="/reporte/:id" element={children} />
        <Route path="/reportes" element={<p>lista</p>} />
      </Routes>
    </DatosProvider>
  </MemoryRouter>
);

const evento = (name, value) => ({ target: { name, value } });

function llenar(result, nuevoEstado) {
  act(() => result.current.cambiarCampo(evento('nuevoEstado', nuevoEstado)));
  act(() => result.current.cambiarCampo(evento('comentario', 'Se atendió el punto')));
}

describe('useDetalleReporte: confirmación de cierre', () => {
  it('pide confirmación antes de cerrar el reporte y no cambia el estado todavía', () => {
    const { result } = renderHook(() => useDetalleReporte(), { wrapper: envoltorio });
    llenar(result, 'Resuelto');
    act(() => result.current.enviar({ preventDefault() {} }));
    expect(result.current.confirmando).toBe(true);
    expect(result.current.reporte.estado).toBe('Nuevo');
  });

  it('cancelar la confirmación conserva el formulario y el estado', () => {
    const { result } = renderHook(() => useDetalleReporte(), { wrapper: envoltorio });
    llenar(result, 'No procede');
    act(() => result.current.enviar({ preventDefault() {} }));
    act(() => result.current.cancelarConfirmacion());
    expect(result.current.confirmando).toBe(false);
    expect(result.current.formulario.comentario).toBe('Se atendió el punto');
    expect(result.current.reporte.estado).toBe('Nuevo');
  });

  it('un estado que no cierra el reporte no pide confirmación', () => {
    const { result } = renderHook(() => useDetalleReporte(), { wrapper: envoltorio });
    llenar(result, 'En proceso');
    act(() => result.current.enviar({ preventDefault() {} }));
    expect(result.current.confirmando).toBe(false);
  });
});
