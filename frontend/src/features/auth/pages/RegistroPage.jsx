import { Link } from 'react-router-dom';
import CampoTexto from '../../../components/ui/CampoTexto';
import Boton from '../../../components/ui/Boton';
import MarcaMicron from '../../../components/ui/MarcaMicron';
import { useRegistro } from '../hooks/useRegistro';
import '../../../styles/auth.css';

function RegistroPage() {
  const { formulario, errores, registrado, cambiarCampo, enviar, irAlLogin } = useRegistro();

  if (registrado) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <MarcaMicron subtitulo="Cuenta creada" />
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <p role="status" style={{ marginBottom: 20 }}>
              Tu cuenta se creó correctamente. Ya puedes iniciar sesión.
            </p>
            <Boton anchoCompleto onClick={irAlLogin}>
              Ir a iniciar sesión
            </Boton>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="auth-container">
      <div className="auth-box">
        <MarcaMicron subtitulo="Crea tu cuenta" />

        <form className="auth-card" onSubmit={enviar} noValidate>
          <div className="form-row">
            <CampoTexto
              id="nombres"
              obligatorio
              etiqueta="Nombres"
              placeholder="Tus nombres"
              value={formulario.nombres}
              onChange={cambiarCampo}
              error={errores.nombres}
            />
            <CampoTexto
              id="apellidos"
              obligatorio
              etiqueta="Apellidos"
              placeholder="Tus apellidos"
              value={formulario.apellidos}
              onChange={cambiarCampo}
              error={errores.apellidos}
            />
          </div>

          <div className="form-row">
            <CampoTexto
              id="cedula"
              obligatorio
              etiqueta="Cédula"
              placeholder="Número de cédula"
              value={formulario.cedula}
              onChange={cambiarCampo}
              error={errores.cedula}
            />
            <CampoTexto
              id="fechaNacimiento"
              obligatorio
              etiqueta="Fecha de nacimiento"
              type="date"
              value={formulario.fechaNacimiento}
              onChange={cambiarCampo}
              error={errores.fechaNacimiento}
            />
          </div>

          <CampoTexto
            id="correo"
            obligatorio
            etiqueta="Correo electrónico"
            type="email"
            placeholder="correo@ejemplo.com"
            value={formulario.correo}
            onChange={cambiarCampo}
            error={errores.correo}
          />

          <CampoTexto
            id="contrasena"
            obligatorio
            etiqueta="Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={formulario.contrasena}
            onChange={cambiarCampo}
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

export default RegistroPage;
