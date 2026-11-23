import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import Header from '../components/Header'
import MapaPlaceholder from '../components/MapaPlaceholder'
import CampoTexto from '../components/ui/CampoTexto'
import Boton from '../components/ui/Boton'
import { useDatos } from '../context/DatosContext'
import { ESTADOS_REPORTE, ESTADOS_CERRADOS } from '../data/datosPrueba'
import './Auth.css'

const menu = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/reportes', label: 'Reportes' },
  { to: '/mapa', label: 'Mapa' },
]

const claseEstado = {
  Nuevo: 'badge-nuevo',
  Asignado: 'badge-asignado',
  'En proceso': 'badge-proceso',
  Resuelto: 'badge-resuelto',
  'No procede': 'badge-resuelto',
}

function DetalleReporte() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { reportes, usuarios, cambiarEstadoReporte } = useDatos()
  const [form, setForm] = useState({ nuevoEstado: '', comentario: '' })
  const [errores, setErrores] = useState({})

  const reporte = reportes.find((item) => item.id === Number(id))

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  if (!reporte) {
    return (
      <Layout subtitulo="Panel Operario" items={menu}>
        <Header titulo="Reporte no encontrado" subtitulo="El reporte solicitado no existe"
          usuario="Carlos Méndez" rol="Operario" iniciales="CM" />
        <Boton variante="secundario" onClick={() => navigate('/reportes')}>Volver a reportes</Boton>
      </Layout>
    )
  }

  const autor = usuarios.find((usuario) => usuario.id === reporte.usuarioId)
  const esCerrado = ESTADOS_CERRADOS.includes(reporte.estado)

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = {}
    if (!form.nuevoEstado) err.nuevoEstado = 'Selecciona un estado'
    if (!form.comentario.trim()) err.comentario = 'Agrega un comentario'
    setErrores(err)
    if (Object.keys(err).length > 0) return

    const resultado = cambiarEstadoReporte(reporte.id, form.nuevoEstado)
    if (!resultado.exito) {
      setErrores({ nuevoEstado: resultado.mensaje })
      return
    }
    navigate('/reportes')
  }

  const fila = (etiqueta, valor) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6' }}>
      <span style={{ color: 'var(--texto-sec)' }}>{etiqueta}</span>
      <strong>{valor}</strong>
    </div>
  )

  return (
    <Layout subtitulo="Panel Operario" items={menu}>
      <Header titulo={`Reporte #${reporte.id}`} subtitulo="Detalle y gestión del reporte"
        usuario="Carlos Méndez" rol="Operario" iniciales="CM" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <div className="auth-card">
          <p className="section-title">Información del Reporte</p>
          <div style={{ fontSize: 13, lineHeight: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ color: 'var(--texto-sec)' }}>Estado</span>
              <span className={`badge ${claseEstado[reporte.estado]}`}>{reporte.estado}</span>
            </div>
            {fila('Prioridad', reporte.prioridad)}
            {fila('Tipo de residuo', reporte.tipoResiduo)}
            {fila('Reportado por', autor ? `${autor.nombres} ${autor.apellidos}` : 'Desconocido')}
            {fila('Dirección', reporte.ubicacion)}
          </div>
          <p className="section-title" style={{ marginTop: 20 }}>Descripción</p>
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{reporte.descripcion}</p>
        </div>

        <div>
          <div className="auth-card" style={{ marginBottom: 20 }}>
            <p className="section-title">Ubicación</p>
            <MapaPlaceholder altura={180} marcadores={[{ x: 50, y: 50, color: '#EF4444', titulo: 'Ubicación del reporte' }]} etiqueta={reporte.ubicacion} />
          </div>

          <form className="auth-card" onSubmit={handleSubmit} noValidate>
            <p className="section-title">Actualizar estado</p>
            {esCerrado ? (
              <p role="status" style={{ fontSize: 13, color: 'var(--texto-sec)' }}>
                Este reporte está cerrado y ya no admite cambios.
              </p>
            ) : (
              <>
                <CampoTexto id="nuevoEstado" etiqueta="Nuevo estado" componente="select"
                  value={form.nuevoEstado} onChange={handleChange} error={errores.nuevoEstado}>
                  <option value="">Selecciona...</option>
                  {ESTADOS_REPORTE.filter((estado) => estado !== 'Nuevo').map((estado) => (
                    <option key={estado}>{estado}</option>
                  ))}
                </CampoTexto>
                <CampoTexto id="comentario" etiqueta="Comentario" componente="textarea" rows="3"
                  placeholder="Describe las acciones realizadas..."
                  value={form.comentario} onChange={handleChange} error={errores.comentario} />
                <Boton type="submit" anchoCompleto>Actualizar Reporte</Boton>
              </>
            )}
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default DetalleReporte
