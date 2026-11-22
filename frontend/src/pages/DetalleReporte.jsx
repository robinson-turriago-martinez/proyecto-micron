import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Header from '../components/Header'
import MapaPlaceholder from '../components/MapaPlaceholder'
import './Auth.css'

const menu = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/reportes', label: 'Reportes' },
  { to: '/mapa', label: 'Mapa' },
]

function DetalleReporte() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nuevoEstado: '', comentario: '' })
  const [errores, setErrores] = useState({})

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = {}
    if (!form.nuevoEstado) err.nuevoEstado = 'Selecciona un estado'
    if (!form.comentario.trim()) err.comentario = 'Agrega un comentario'
    setErrores(err)
    if (Object.keys(err).length === 0) {
      alert('Estado actualizado correctamente (demo).')
      navigate('/reportes')
    }
  }

  return (
    <Layout subtitulo="Panel Operario" items={menu}>
      <Header titulo="Reporte #RPT-0012" subtitulo="Detalle y gestión del reporte"
        usuario="Carlos Méndez" rol="Operario" iniciales="CM" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Info del reporte */}
        <div className="auth-card">
          <p className="section-title">Información del Reporte</p>
          <div style={{ fontSize: 13, lineHeight: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ color: 'var(--texto-sec)' }}>Estado</span>
              <span className="badge badge-asignado">Asignado</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ color: 'var(--texto-sec)' }}>Prioridad</span><strong>Alta</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ color: 'var(--texto-sec)' }}>Tipo de residuo</span><strong>Orgánico</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ color: 'var(--texto-sec)' }}>Reportado por</span><strong>Robinson Turriago</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--texto-sec)' }}>Dirección</span><strong>Calle 45 con Cra 7</strong>
            </div>
          </div>
          <p className="section-title" style={{ marginTop: 20 }}>Descripción</p>
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
            Acumulación de residuos orgánicos en la esquina del parque central. Se observan bolsas de basura abiertas, generando malos olores y presencia de moscas.
          </p>
          <p className="section-title" style={{ marginTop: 20 }}>Evidencia fotográfica</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {['Foto 1', 'Foto 2', 'Foto 3'].map((f) => (
              <div key={f} style={{ aspectRatio: '1', background: '#F3F4F6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#9CA3AF', border: '1px dashed #D1D5DB' }}>📷 {f}</div>
            ))}
          </div>
        </div>

        {/* Mapa + actualizar estado */}
        <div>
          <div className="auth-card" style={{ marginBottom: 20 }}>
            <p className="section-title">Ubicación</p>
            <MapaPlaceholder altura={180} marcadores={[{ x: 50, y: 50, color: '#EF4444', titulo: 'Ubicación del reporte' }]} etiqueta="Calle 45 con Cra 7" />
            <p style={{ fontSize: 12, color: 'var(--texto-sec)', marginTop: 8 }}>📍 Lat: 4.6097, Lng: -74.0817</p>
          </div>

          <form className="auth-card" onSubmit={handleSubmit} noValidate>
            <p className="section-title">Actualizar estado</p>
            <div className="form-group">
              <label htmlFor="nuevoEstado">Nuevo estado</label>
              <select id="nuevoEstado" name="nuevoEstado" value={form.nuevoEstado} onChange={handleChange} aria-invalid={!!errores.nuevoEstado}>
                <option value="">Selecciona...</option>
                <option>En proceso</option>
                <option>Resuelto</option>
                <option>No procede</option>
              </select>
              {errores.nuevoEstado && <span className="error-text">{errores.nuevoEstado}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="comentario">Comentario</label>
              <textarea id="comentario" name="comentario" rows="3" placeholder="Describe las acciones realizadas..."
                value={form.comentario} onChange={handleChange} aria-invalid={!!errores.comentario} />
              {errores.comentario && <span className="error-text">{errores.comentario}</span>}
            </div>
            <button type="submit" className="btn-full">Actualizar Reporte</button>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default DetalleReporte
