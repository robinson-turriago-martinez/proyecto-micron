import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Header from '../components/Header'
import CampoTexto from '../components/ui/CampoTexto'
import Boton from '../components/ui/Boton'
import { useDatos } from '../context/DatosContext'
import { TIPOS_RESIDUO, NIVELES_AFECTACION } from '../data/datosPrueba'
import './Auth.css'

const menu = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/crear-reporte', label: 'Nuevo Reporte' },
  { to: '/reportes', label: 'Reportes' },
]

const formVacio = {
  descripcion: '', tipoResiduo: '', nivelAfectacion: '', direccion: '', latitud: '', longitud: '',
}

/** Indica si un texto es un número dentro del rango dado. Las coordenadas son opcionales. */
function esCoordenadaValida(texto, minimo, maximo) {
  if (texto.trim() === '') return true
  const numero = Number(texto)
  return Number.isFinite(numero) && numero >= minimo && numero <= maximo
}

function CrearReporte() {
  const navigate = useNavigate()
  const { crearReporte } = useDatos()
  const [form, setForm] = useState(formVacio)
  const [errores, setErrores] = useState({})

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validar = () => {
    const err = {}
    if (!form.descripcion.trim()) err.descripcion = 'Describe el problema'
    else if (form.descripcion.trim().length < 10) err.descripcion = 'Mínimo 10 caracteres'
    if (!form.tipoResiduo) err.tipoResiduo = 'Selecciona un tipo'
    if (!form.nivelAfectacion) err.nivelAfectacion = 'Selecciona el nivel'
    if (!form.direccion.trim()) err.direccion = 'La dirección es obligatoria'
    // Regla de negocio 4: las coordenadas deben ser geográficamente válidas
    if (!esCoordenadaValida(form.latitud, -90, 90)) err.latitud = 'Debe estar entre -90 y 90'
    if (!esCoordenadaValida(form.longitud, -180, 180)) err.longitud = 'Debe estar entre -180 y 180'
    return err
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validar()
    setErrores(err)
    if (Object.keys(err).length > 0) return

    const nuevo = crearReporte({
      descripcion: form.descripcion.trim(),
      tipoResiduo: form.tipoResiduo,
      nivelAfectacion: form.nivelAfectacion,
      ubicacion: form.direccion.trim(),
    })
    navigate(`/reporte/${nuevo.id}`)
  }

  return (
    <Layout subtitulo="Panel Ciudadano" items={menu}>
      <Header titulo="Registrar Nuevo Reporte" subtitulo="Reporta un microbasurero en tu zona"
        usuario="Robinson Turriago" rol="Ciudadano" iniciales="RT" />

      <form className="auth-card" style={{ maxWidth: 600 }} onSubmit={handleSubmit} noValidate>
        <CampoTexto id="descripcion" etiqueta="Descripción del problema" componente="textarea" rows="3"
          placeholder="Describe detalladamente el microbasurero observado..."
          value={form.descripcion} onChange={handleChange} error={errores.descripcion} />

        <div className="form-row">
          <CampoTexto id="tipoResiduo" etiqueta="Tipo de residuo" componente="select"
            value={form.tipoResiduo} onChange={handleChange} error={errores.tipoResiduo}>
            <option value="">Selecciona...</option>
            {TIPOS_RESIDUO.map((tipo) => (<option key={tipo}>{tipo}</option>))}
          </CampoTexto>
          <CampoTexto id="nivelAfectacion" etiqueta="Nivel de afectación" componente="select"
            value={form.nivelAfectacion} onChange={handleChange} error={errores.nivelAfectacion}>
            <option value="">Selecciona...</option>
            {NIVELES_AFECTACION.map((nivel) => (<option key={nivel}>{nivel}</option>))}
          </CampoTexto>
        </div>

        <CampoTexto id="direccion" etiqueta="Dirección" placeholder="Ej: Calle 45 con Cra 7"
          value={form.direccion} onChange={handleChange} error={errores.direccion} />

        <div className="form-row">
          <CampoTexto id="latitud" etiqueta="Latitud (GPS)" placeholder="4.6097"
            value={form.latitud} onChange={handleChange} error={errores.latitud} />
          <CampoTexto id="longitud" etiqueta="Longitud (GPS)" placeholder="-74.0817"
            value={form.longitud} onChange={handleChange} error={errores.longitud} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Boton variante="secundario" onClick={() => navigate('/dashboard')} style={{ flex: 1 }}>Cancelar</Boton>
          <Boton type="submit" style={{ flex: 1 }}>Registrar Reporte</Boton>
        </div>
      </form>
    </Layout>
  )
}

export default CrearReporte
