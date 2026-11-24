import { Link } from 'react-router-dom';
import CampoTexto from '../../../components/ui/CampoTexto';
import Boton from '../../../components/ui/Boton';
import MarcaMicron from '../../../components/ui/MarcaMicron';
import { useLogin } from '../hooks/useLogin';
import '../../../styles/auth.css';

function LoginPage() {
  const { formulario, errores, cambiarCampo, enviar } = useLogin();

  return (
    <div className="auth-container">
      <div className="auth-box">
        <MarcaMicron subtitulo="Bienvenido de vuelta" />

        <form className="auth-card" onSubmit={enviar} noValidate>
          <CampoTexto
            id="usuario"
            obligatorio
            etiqueta="Usuario"
            placeholder="Ingresa tu usuario"
            value={formulario.usuario}
            onChange={cambiarCampo}
            error={errores.usuario}
          />
          <CampoTexto
            id="contrasena"
            obligatorio
            etiqueta="Contraseña"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={formulario.contrasena}
            onChange={cambiarCampo}
            error={errores.contrasena}
          />
          <Boton type="submit" anchoCompleto>
            Iniciar Sesión
          </Boton>
        </form>

        <p className="auth-footer">
          ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
        <p className="auth-footer">
          <Link to="/error">Ver pantalla de error (demo)</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
