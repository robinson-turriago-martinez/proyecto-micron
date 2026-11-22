import Layout from '../components/Layout'
import Header from '../components/Header'

const menu = [
  { to: '/supervision', label: 'Dashboard' },
  { to: '/reportes', label: 'Reportes' },
  { to: '/mapa', label: 'Mapa' },
  { to: '/usuarios', label: 'Usuarios' },
]

const zonas = [
  { nombre: 'Zona Norte - Centro', reportes: 28, pct: 90, color: 'var(--rojo)' },
  { nombre: 'Zona Sur - Kennedy', reportes: 22, pct: 70, color: 'var(--naranja)' },
  { nombre: 'Zona Occidente', reportes: 18, pct: 58, color: 'var(--naranja)' },
  { nombre: 'Zona Oriente', reportes: 10, pct: 32, color: 'var(--verde)' },
]

function DashboardSupervision() {
  return (
    <Layout subtitulo="Panel Supervisor" items={menu}>
      <Header titulo="Dashboard de Supervisión" subtitulo="Resumen general del municipio"
        usuario="Jorge Ortiz" rol="Supervisor" iniciales="JO" />

      <div className="stats-grid">
        <div className="stat-card"><p className="label">Reportes Activos</p><p className="value azul">84</p></div>
        <div className="stat-card"><p className="label">Resueltos este mes</p><p className="value verde">42</p></div>
        <div className="stat-card"><p className="label">Tiempo promedio</p><p className="value naranja">3.2 días</p></div>
        <div className="stat-card"><p className="label">Zonas Críticas</p><p className="value rojo">5</p></div>
      </div>

      <p className="section-title">Zonas con más reportes</p>
      <div className="table-card" style={{ padding: 20 }}>
        {zonas.map((z) => (
          <div key={z.nombre} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
              <span>{z.nombre}</span>
              <strong>{z.reportes} reportes</strong>
            </div>
            <div style={{ height: 8, background: 'var(--borde)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${z.pct}%`, background: z.color, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default DashboardSupervision
