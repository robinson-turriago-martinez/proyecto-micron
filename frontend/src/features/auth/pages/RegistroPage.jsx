import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CampoTexto from '../components/ui/CampoTexto';
import Boton from '../components/ui/Boton';
import './Auth.css';

function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    fechaNacimiento: '',
    correo: '',
    contrasena: '',
  });
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const err = {};
    if (!form.nombres.trim()) err.nombres = 'Campo obligatorio';
    if (!form.apellidos.trim()) err.apellidos = 'Campo obligatorio';
    if (!form.cedula.trim()) err.cedula = 'Campo obligatorio';
    else if (!/^\d+$/.test(form.cedula)) err.cedula = 'Solo números';
    if (!form.fechaNacimiento) err.fechaNacimiento = 'Campo obligatorio';
    if (!form.correo.trim()) err.correo = 'Campo obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) err.correo = 'Correo inválido';
    if (!form.contrasena) err.contrasena = 'Campo obligatorio';
    else if (form.contrasena.length < 8) err.contrasena = 'Mínimo 8 caracteres';
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validar();
    setErrores(err);
    if (Object.keys(err).length === 0) {
      alert('Registro exitoso (demo). Redirigiendo al login.');
      navigate('/login');
    }
  };

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
            <CampoTexto
              id="nombres"
              etiqueta="Nombres"
              placeholder="Tus nombres"
              value={form.nombres}
              onChange={handleChange}
              error={errores.nombres}
            />
            <CampoTexto
              id="apellidos"
              etiqueta="Apellidos"
              placeholder="Tus apellidos"
              value={form.apellidos}
              onChange={handleChange}
              error={errores.apellidos}
            />
          </div>

          <div className="form-row">
            <CampoTexto
              id="cedula"
              etiqueta="Cédula"
              placeholder="Número de cédula"
              value={form.cedula}
              onChange={handleChange}
              error={errores.cedula}
            />
            <CampoTexto
              id="fechaNacimiento"
              etiqueta="Fecha de nacimiento"
              type="date"
              value={form.fechaNacimiento}
              onChange={handleChange}
              error={errores.fechaNacimiento}
            />
          </div>

          <CampoTexto
            id="correo"
            etiqueta="Correo electrónico"
            type="email"
            placeholder="correo@ejemplo.com"
            value={form.correo}
            onChange={handleChange}
            error={errores.correo}
          />

          <CampoTexto
            id="contrasena"
            etiqueta="Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={form.contrasena}
            onChange={handleChange}
            error={errores.contrasena}
          />

          <Boton type="submit" anchoCompleto>
            Registrarse
          </Boton>
        </form>

        <p className="auth-footer">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Registro;
