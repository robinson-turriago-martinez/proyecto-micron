import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Header from '../components/Header'
import './Auth.css'

const menu = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/crear-reporte', label: 'Nuevo Reporte' },
  { to: '/reportes', label: 'Reportes' },
]

function CrearReporte() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    descripcion: '', tipoResiduo: '', nivelAfectacion: '', direccion: '', latitud: '', longitud: '',
  })
  const [errores, setErrores] = useState({})

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validar = () => {
    const err = {}
    if (!form.descripcion.trim()) err.descripcion = 'Describe el problema'
    else if (form.descripcion.length < 10) err.descripcion = 'Mínimo 10 caracteres'
    if (!form.tipoResiduo) err.tipoResiduo = 'Selecciona un tipo'
    if (!form.nivelAfectacion) err.nivelAfectacion = 'Selecciona el nivel'
    if (!form.direccion.trim()) err.direccion = 'La dirección es obligatoria'
    return err
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validar()
    setErrores(err)
    if (Object.keys(err).length === 0) {
      alert('Reporte registrado correctamente (demo).')
      navigate('/dashboard')
    }
  }

  return (
    <Layout subtitulo="Panel Ciudadano" items={menu}>
      <Header titulo="Registrar Nuevo Reporte" subtitulo="Reporta un microbasurero en tu zona"
        usuario="Robinson Turriago" rol="Ciudadano" iniciales="RT" />

      <form className="auth-card" style={{ maxWidth: 600 }} onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción del problema</label>
          <textarea id="descripcion" name="descripcion" rows="3"
            placeholder="Describe detalladamente el microbasurero observado..."
            value={form.descripcion} onChange={handleChange} aria-invalid={!!errores.descripcion} />
          {errores.descripcion && <span className="error-text">{errores.descripcion}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tipoResiduo">Tipo de residuo</label>
            <select id="tipoResiduo" name="tipoResiduo" value={form.tipoResiduo} onChange={handleChange} aria-invalid={!!errores.tipoResiduo}>
              <option value="">Selecciona...</option>
              <option>Plástico</option>
              <option>Orgánico</option>
              <option>Escombros</option>
              <option>Mixto</option>
              <option>Peligroso</option>
            </select>
            {errores.tipoResiduo && <span className="error-text">{errores.tipoResiduo}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="nivelAfectacion">Nivel de afectación</label>
            <select id="nivelAfectacion" name="nivelAfectacion" value={form.nivelAfectacion} onChange={handleChange} aria-invalid={!!errores.nivelAfectacion}>
              <option value="">Selecciona...</option>
              <option>Bajo</option>
              <option>Medio</option>
              <option>Alto</option>
            </select>
            {errores.nivelAfectacion && <span className="error-text">{errores.nivelAfectacion}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input id="direccion" name="direccion" type="text" placeholder="Ej: Calle 45 con Cra 7"
            value={form.direccion} onChange={handleChange} aria-invalid={!!errores.direccion} />
          {errores.direccion && <span className="error-text">{errores.direccion}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="latitud">Latitud (GPS)</label>
            <input id="latitud" name="latitud" type="text" placeholder="4.6097" value={form.latitud} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="longitud">Longitud (GPS)</label>
            <input id="longitud" name="longitud" type="text" placeholder="-74.0817" value={form.longitud} onChange={handleChange} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate('/dashboard')}>Cancelar</button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Registrar Reporte</button>
        </div>
      </form>
    </Layout>
  )
}

export default CrearReporte
