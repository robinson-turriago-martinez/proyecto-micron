import { useState } from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import MapaPlaceholder from '../components/MapaPlaceholder';

const menu = [
  { to: '/supervision', label: 'Dashboard' },
  { to: '/reportes', label: 'Reportes' },
  { to: '/mapa', label: 'Mapa' },
  { to: '/usuarios', label: 'Usuarios' },
];

const marcadores = [
  { x: 30, y: 25, color: '#2563EB', titulo: 'Reporte nuevo' },
  { x: 55, y: 40, color: '#F59E0B', titulo: 'Reporte asignado' },
  { x: 45, y: 60, color: '#10B981', titulo: 'Reporte resuelto' },
  { x: 70, y: 30, color: '#2563EB', titulo: 'Reporte nuevo' },
  { x: 25, y: 70, color: '#EF4444', titulo: 'Prioridad alta' },
];

function MapaMonitoreo() {
  const [filtros, setFiltros] = useState({ nuevo: true, asignado: true, resuelto: true });

  const toggle = (key) => setFiltros({ ...filtros, [key]: !filtros[key] });

  return (
    <Layout subtitulo="Panel Supervisor" items={menu}>
      <Header
        titulo="Mapa de Incidencias"
        subtitulo="Gestión de puntos críticos"
        usuario="Jorge Ortiz"
        rol="Supervisor"
        iniciales="JO"
      />

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* Panel de filtros */}
        <div
          style={{
            flex: '0 0 220px',
            background: 'white',
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <p className="section-title">Filtros</p>
          <fieldset style={{ border: 'none', marginBottom: 16 }}>
            <legend style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Estado</legend>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                marginBottom: 6,
              }}
            >
              <input type="checkbox" checked={filtros.nuevo} onChange={() => toggle('nuevo')} />
              <span
                style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563EB' }}
              ></span>{' '}
              Nuevo
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                marginBottom: 6,
              }}
            >
              <input
                type="checkbox"
                checked={filtros.asignado}
                onChange={() => toggle('asignado')}
              />
              <span
                style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }}
              ></span>{' '}
              Asignado
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <input
                type="checkbox"
                checked={filtros.resuelto}
                onChange={() => toggle('resuelto')}
              />
              <span
                style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }}
              ></span>{' '}
              Resuelto
            </label>
          </fieldset>
          <div style={{ borderTop: '1px solid var(--borde)', paddingTop: 12 }}>
            <p style={{ fontSize: 12, color: 'var(--texto-sec)', marginBottom: 4 }}>Resumen</p>
            <p style={{ fontSize: 13 }}>🔵 Nuevos: 24</p>
            <p style={{ fontSize: 13 }}>🟠 Asignados: 18</p>
            <p style={{ fontSize: 13 }}>🟢 Resueltos: 42</p>
          </div>
        </div>

        {/* Mapa */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <MapaPlaceholder
            altura={420}
            marcadores={marcadores}
            etiqueta="Mapa de microbasureros - 84 puntos activos"
          />
        </div>
      </div>
    </Layout>
  );
}

export default MapaMonitoreo;
