import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'

function Registro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombres: '', apellidos: '', cedula: '', fechaNacimiento: '', correo: '', contrasena: '',
  })
  const [errores, setErrores] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validar = () => {
    const err = {}
    if (!form.nombres.trim()) err.nombres = 'Campo obligatorio'
    if (!form.apellidos.trim()) err.apellidos = 'Campo obligatorio'
    if (!form.cedula.trim()) err.cedula = 'Campo obligatorio'
    else if (!/^\d+$/.test(form.cedula)) err.cedula = 'Solo números'
    if (!form.fechaNacimiento) err.fechaNacimiento = 'Campo obligatorio'
    if (!form.correo.trim()) err.correo = 'Campo obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) err.correo = 'Correo inválido'
    if (!form.contrasena) err.contrasena = 'Campo obligatorio'
    else if (form.contrasena.length < 8) err.contrasena = 'Mínimo 8 caracteres'
    return err
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validar()
    setErrores(err)
    if (Object.keys(err).length === 0) {
      alert('Registro exitoso (demo). Redirigiendo al login.')
      navigate('/login')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
            <path d="M13 3v6l2-2 2 2V3h2a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1h8zm-2 8H7v2h4v-2zm4 4H7v2h8v-2z" />
          </svg>
        </div>
        <h1 className="auth-title">Micron</h1>
        <p className="auth-subtitle">Crea tu cuenta</p>

        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombres">Nombres</label>
              <input id="nombres" name="nombres" type="text" placeholder="Tus nombres"
                value={form.nombres} onChange={handleChange} aria-invalid={!!errores.nombres} />
              {errores.nombres && <span className="error-text">{errores.nombres}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="apellidos">Apellidos</label>
              <input id="apellidos" name="apellidos" type="text" placeholder="Tus apellidos"
                value={form.apellidos} onChange={handleChange} aria-invalid={!!errores.apellidos} />
              {errores.apellidos && <span className="error-text">{errores.apellidos}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cedula">Cédula</label>
              <input id="cedula" name="cedula" type="text" placeholder="Número de cédula"
                value={form.cedula} onChange={handleChange} aria-invalid={!!errores.cedula} />
              {errores.cedula && <span className="error-text">{errores.cedula}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
              <input id="fechaNacimiento" name="fechaNacimiento" type="date"
                value={form.fechaNacimiento} onChange={handleChange} aria-invalid={!!errores.fechaNacimiento} />
              {errores.fechaNacimiento && <span className="error-text">{errores.fechaNacimiento}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input id="correo" name="correo" type="email" placeholder="correo@ejemplo.com"
              value={form.correo} onChange={handleChange} aria-invalid={!!errores.correo} />
            {errores.correo && <span className="error-text">{errores.correo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input id="contrasena" name="contrasena" type="password" placeholder="Mínimo 8 caracteres"
              value={form.contrasena} onChange={handleChange} aria-invalid={!!errores.contrasena} />
            {errores.contrasena && <span className="error-text">{errores.contrasena}</span>}
          </div>

          <button type="submit" className="btn-full">Registrarse</button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}

export default Registro
