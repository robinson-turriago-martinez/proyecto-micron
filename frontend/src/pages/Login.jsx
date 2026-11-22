import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'

function Login() {
  const navigate = useNavigate()
  // Formulario controlado
  const [form, setForm] = useState({ usuario: '', contrasena: '' })
  const [errores, setErrores] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Validaciones basicas
  const validar = () => {
    const err = {}
    if (!form.usuario.trim()) err.usuario = 'El usuario es obligatorio'
    if (!form.contrasena) err.contrasena = 'La contraseña es obligatoria'
    else if (form.contrasena.length < 6) err.contrasena = 'Mínimo 6 caracteres'
    return err
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validar()
    setErrores(err)
    if (Object.keys(err).length === 0) {
      // Sin backend: simulamos ingreso exitoso y vamos al dashboard
      navigate('/dashboard')
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
        <p className="auth-subtitle">Bienvenido de vuelta</p>

        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              placeholder="Ingresa tu usuario"
              value={form.usuario}
              onChange={handleChange}
              aria-invalid={!!errores.usuario}
            />
            {errores.usuario && <span className="error-text">{errores.usuario}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={form.contrasena}
              onChange={handleChange}
              aria-invalid={!!errores.contrasena}
            />
            {errores.contrasena && <span className="error-text">{errores.contrasena}</span>}
          </div>

          <button type="submit" className="btn-full">Iniciar Sesión</button>
        </form>

        <p className="auth-footer">
          ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
        <p className="auth-footer">
          <Link to="/error">Ver pantalla de error (demo)</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
