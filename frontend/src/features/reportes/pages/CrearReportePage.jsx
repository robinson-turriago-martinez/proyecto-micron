import Layout from '../../../components/Layout';
import Header from '../../../components/Header';
import CampoTexto from '../../../components/ui/CampoTexto';
import Boton from '../../../components/ui/Boton';
import { TIPOS_RESIDUO, NIVELES_AFECTACION } from '../../../data/datosPrueba';
import { useCrearReporte } from '../hooks/useCrearReporte';
import '../../../pages/Auth.css';

const MENU = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/crear-reporte', label: 'Nuevo Reporte' },
  { to: '/reportes', label: 'Reportes' },
];

function CrearReportePage() {
  const { formulario, errores, cambiarCampo, enviar, cancelar } = useCrearReporte();

  return (
    <Layout subtitulo="Panel Ciudadano" items={MENU}>
      <Header titulo="Registrar Nuevo Reporte" subtitulo="Reporta un microbasurero en tu zona"
        usuario="Robinson Turriago" rol="Ciudadano" iniciales="RT" />

      <form className="auth-card" style={{ maxWidth: 600 }} onSubmit={enviar} noValidate>
        <CampoTexto id="descripcion" etiqueta="Descripción del problema" componente="textarea" rows="3"
          placeholder="Describe detalladamente el microbasurero observado..."
          value={formulario.descripcion} onChange={cambiarCampo} error={errores.descripcion} />

        <div className="form-row">
          <CampoTexto id="tipoResiduo" etiqueta="Tipo de residuo" componente="select"
            value={formulario.tipoResiduo} onChange={cambiarCampo} error={errores.tipoResiduo}>
            <option value="">Selecciona...</option>
            {TIPOS_RESIDUO.map((tipo) => (<option key={tipo}>{tipo}</option>))}
          </CampoTexto>
          <CampoTexto id="nivelAfectacion" etiqueta="Nivel de afectación" componente="select"
            value={formulario.nivelAfectacion} onChange={cambiarCampo} error={errores.nivelAfectacion}>
            <option value="">Selecciona...</option>
            {NIVELES_AFECTACION.map((nivel) => (<option key={nivel}>{nivel}</option>))}
          </CampoTexto>
        </div>

        <CampoTexto id="direccion" etiqueta="Dirección" placeholder="Ej: Calle 45 con Cra 7"
          value={formulario.direccion} onChange={cambiarCampo} error={errores.direccion} />

        <div className="form-row">
          <CampoTexto id="latitud" etiqueta="Latitud (GPS)" placeholder="4.6097"
            value={formulario.latitud} onChange={cambiarCampo} error={errores.latitud} />
          <CampoTexto id="longitud" etiqueta="Longitud (GPS)" placeholder="-74.0817"
            value={formulario.longitud} onChange={cambiarCampo} error={errores.longitud} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Boton variante="secundario" onClick={cancelar} style={{ flex: 1 }}>Cancelar</Boton>
          <Boton type="submit" style={{ flex: 1 }}>Registrar Reporte</Boton>
        </div>
      </form>
    </Layout>
  );
}

export default CrearReportePage;
