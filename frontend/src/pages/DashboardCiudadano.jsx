import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Header from '../components/Header'

const menu = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/crear-reporte', label: 'Nuevo Reporte' },
  { to: '/reportes', label: 'Reportes' },
  { to: '/mapa', label: 'Mapa' },
]

// Datos de ejemplo (sin backend)
const misReportes = [
  { id: 'RPT-0012', ubicacion: 'Calle 45 con Cra 7', tipo: 'Orgánico', fecha: '15/07/2026', estado: 'Nuevo', clase: 'badge-nuevo' },
  { id: 'RPT-0011', ubicacion: 'Av. Boyacá con Calle 80', tipo: 'Escombros', fecha: '12/07/2026', estado: 'En Proceso', clase: 'badge-proceso' },
  { id: 'RPT-0009', ubicacion: 'Carrera 15 #32-10', tipo: 'Plástico', fecha: '08/07/2026', estado: 'Resuelto', clase: 'badge-resuelto' },
]

// Notificaciones de ejemplo (RF.008)
const notificaciones = [
  { mensaje: 'Tu reporte #RPT-0009 fue marcado como Resuelto', tiempo: 'Hace 2 horas', leida: false },
  { mensaje: 'Tu reporte #RPT-0011 fue asignado a un operario', tiempo: 'Hace 1 día', leida: false },
  { mensaje: 'Se recibió tu reporte #RPT-0012 correctamente', tiempo: 'Hace 2 días', leida: true },
]

function DashboardCiudadano() {
  const navigate = useNavigate()
  return (
    <Layout subtitulo="Panel Ciudadano" items={menu}>
      <Header titulo="Bienvenido, Robinson" subtitulo="Resumen de tus reportes"
        usuario="Robinson Turriago" rol="Ciudadano" iniciales="RT" notificaciones={notificaciones} />

      <div className="stats-grid">
        <div className="stat-card"><p className="label">Total Reportes</p><p className="value azul">12</p></div>
        <div className="stat-card"><p className="label">En Proceso</p><p className="value naranja">4</p></div>
        <div className="stat-card"><p className="label">Resueltos</p><p className="value verde">7</p></div>
        <div className="stat-card"><p className="label">Pendientes</p><p className="value rojo">1</p></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <p className="section-title" style={{ margin: 0 }}>Mis reportes recientes</p>
        <button className="btn btn-primary" onClick={() => navigate('/crear-reporte')}>+ Nuevo Reporte</button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr><th>ID</th><th>Ubicación</th><th>Tipo</th><th>Fecha</th><th>Estado</th><th>Acción</th></tr>
          </thead>
          <tbody>
            {misReportes.map((r) => (
              <tr key={r.id}>
                <td>#{r.id}</td>
                <td>{r.ubicacion}</td>
                <td>{r.tipo}</td>
                <td>{r.fecha}</td>
                <td><span className={`badge ${r.clase}`}>{r.estado}</span></td>
                <td>
                  <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: 12 }}
                    onClick={() => navigate('/detalle-reporte')}>Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default DashboardCiudadano
