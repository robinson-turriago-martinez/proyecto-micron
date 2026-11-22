import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Header from '../components/Header'

const menu = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/reportes', label: 'Reportes' },
  { to: '/mapa', label: 'Mapa' },
  { to: '/supervision', label: 'Supervisión' },
]

const datos = [
  { id: 'RPT-0012', ubicacion: 'Calle 45 con Cra 7', tipo: 'Orgánico', prioridad: 'Alta', fecha: '15/07/2026', estado: 'Nuevo', clase: 'badge-nuevo' },
  { id: 'RPT-0011', ubicacion: 'Av. Boyacá con Calle 80', tipo: 'Escombros', prioridad: 'Alta', fecha: '12/07/2026', estado: 'Asignado', clase: 'badge-asignado' },
  { id: 'RPT-0010', ubicacion: 'Carrera 30 #15-22', tipo: 'Plástico', prioridad: 'Media', fecha: '10/07/2026', estado: 'En Proceso', clase: 'badge-proceso' },
  { id: 'RPT-0008', ubicacion: 'Calle 72 con Cra 11', tipo: 'Mixto', prioridad: 'Baja', fecha: '05/07/2026', estado: 'Resuelto', clase: 'badge-resuelto' },
]

function ListaReportes() {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState('')
  const [busqueda, setBusqueda] = useState('')

  // Filtro funcional (sin backend)
  const reportesFiltrados = datos.filter((r) => {
    const coincideEstado = filtro ? r.estado === filtro : true
    const coincideBusqueda = busqueda
      ? r.id.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
      : true
    return coincideEstado && coincideBusqueda
  })

  return (
    <Layout subtitulo="Panel Operario" items={menu}>
      <Header titulo="Gestión de Reportes" subtitulo="Reportes asignados a tu zona"
        usuario="Carlos Méndez" rol="Operario - Zona Norte" iniciales="CM" />

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por ID o ubicación..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar reportes"
          style={{ padding: '9px 12px', border: '1px solid var(--borde)', borderRadius: 8, fontSize: 13, width: 240 }}
        />
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)} aria-label="Filtrar por estado"
          style={{ padding: '9px 12px', border: '1px solid var(--borde)', borderRadius: 8, fontSize: 13 }}>
          <option value="">Todos los estados</option>
          <option>Nuevo</option>
          <option>Asignado</option>
          <option>En Proceso</option>
          <option>Resuelto</option>
        </select>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr><th>ID</th><th>Ubicación</th><th>Tipo</th><th>Prioridad</th><th>Fecha</th><th>Estado</th><th>Acción</th></tr>
          </thead>
          <tbody>
            {reportesFiltrados.map((r) => (
              <tr key={r.id}>
                <td>#{r.id}</td>
                <td>{r.ubicacion}</td>
                <td>{r.tipo}</td>
                <td>{r.prioridad}</td>
                <td>{r.fecha}</td>
                <td><span className={`badge ${r.clase}`}>{r.estado}</span></td>
                <td>
                  <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: 12 }}
                    onClick={() => navigate('/detalle-reporte')}>Gestionar</button>
                </td>
              </tr>
            ))}
            {reportesFiltrados.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--texto-sec)' }}>No se encontraron reportes</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default ListaReportes
