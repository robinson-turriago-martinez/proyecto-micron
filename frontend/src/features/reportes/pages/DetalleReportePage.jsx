import Layout from '../../../components/layout/Layout';
import Header from '../../../components/layout/Header';
import MapaPlaceholder from '../../../components/ui/MapaPlaceholder';
import InfoReporte from '../components/InfoReporte';
import CambioEstadoForm from '../components/CambioEstadoForm';
import Boton from '../../../components/ui/Boton';
import { useDetalleReporte } from '../hooks/useDetalleReporte';
import '../../../styles/auth.css';
import { PERFILES } from '../../../config/perfiles';

const PERFIL = PERFILES.operario;

function DetalleReportePage() {
  const {
    reporte,
    autor,
    estaCerrado,
    formulario,
    errores,
    cambiarCampo,
    enviar,
    volver,
    confirmando,
    aplicarCambio,
    cancelarConfirmacion,
  } = useDetalleReporte();

  if (!reporte) {
    return (
      <Layout subtitulo={PERFIL.panel} items={PERFIL.menu}>
        <Header
          titulo="Reporte no encontrado"
          subtitulo="El reporte solicitado no existe"
          usuario={PERFIL.usuario}
          rol={PERFIL.rol}
          iniciales={PERFIL.iniciales}
        />
        <Boton variante="secundario" onClick={volver}>
          Volver a reportes
        </Boton>
      </Layout>
    );
  }

  return (
    <Layout subtitulo={PERFIL.panel} items={PERFIL.menu}>
      <Header
        titulo={`Reporte #${reporte.id}`}
        subtitulo="Detalle y gestión del reporte"
        usuario={PERFIL.usuario}
        rol={PERFIL.rol}
        iniciales={PERFIL.iniciales}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}
      >
        <InfoReporte reporte={reporte} autor={autor} />

        <div>
          <div className="auth-card" style={{ marginBottom: 20 }}>
            <p className="section-title">Ubicación</p>
            <MapaPlaceholder
              altura={180}
              etiqueta={reporte.ubicacion}
              marcadores={[{ x: 50, y: 50, color: '#EF4444', titulo: 'Ubicación del reporte' }]}
            />
          </div>

          <CambioEstadoForm
            estaCerrado={estaCerrado}
            formulario={formulario}
            errores={errores}
            confirmando={confirmando}
            cambiarCampo={cambiarCampo}
            onEnviar={enviar}
            onConfirmar={aplicarCambio}
            onCancelarConfirmacion={cancelarConfirmacion}
          />
        </div>
      </div>
    </Layout>
  );
}

export default DetalleReportePage;
