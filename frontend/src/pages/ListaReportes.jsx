import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Header from '../components/Header'
import Tabla from '../components/ui/Tabla'
import Boton from '../components/ui/Boton'

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

  // Definición declarativa de columnas: cada una dice cómo pintar su celda
  const columnas = [
    { clave: 'id', titulo: 'ID', render: (r) => `#${r.id}` },
    { clave: 'ubicacion', titulo: 'Ubicación' },
    { clave: 'tipo', titulo: 'Tipo' },
    { clave: 'prioridad', titulo: 'Prioridad' },
    { clave: 'fecha', titulo: 'Fecha' },
    { clave: 'estado', titulo: 'Estado', render: (r) => <span className={`badge ${r.clase}`}>{r.estado}</span> },
    {
      clave: 'accion',
      titulo: 'Acción',
      render: () => (
        <Boton variante="secundario" onClick={() => navigate('/detalle-reporte')}>Gestionar</Boton>
      ),
    },
  ]

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

      <Tabla
        columnas={columnas}
        filas={reportesFiltrados}
        mensajeVacio="No se encontraron reportes"
      />
    </Layout>
  )
}

export default ListaReportes
