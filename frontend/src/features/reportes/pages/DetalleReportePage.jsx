import Layout from '../../../components/Layout';
import Header from '../../../components/Header';
import MapaPlaceholder from '../../../components/MapaPlaceholder';
import CampoTexto from '../../../components/ui/CampoTexto';
import Boton from '../../../components/ui/Boton';
import { ESTADOS_REPORTE } from '../../../data/datosPrueba';
import { useDetalleReporte } from '../hooks/useDetalleReporte';
import '../../../pages/Auth.css';

const MENU = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/reportes', label: 'Reportes' },
  { to: '/mapa', label: 'Mapa' },
];

const CLASE_ESTADO = {
  Nuevo: 'badge-nuevo',
  Asignado: 'badge-asignado',
  'En proceso': 'badge-proceso',
  Resuelto: 'badge-resuelto',
  'No procede': 'badge-resuelto',
};

function FilaDato({ etiqueta, valor }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid #F3F4F6',
      }}
    >
      <span style={{ color: 'var(--texto-sec)' }}>{etiqueta}</span>
      <strong>{valor}</strong>
    </div>
  );
}

function DetalleReportePage() {
  const { reporte, autor, estaCerrado, formulario, errores, cambiarCampo, enviar, volver } =
    useDetalleReporte();

  if (!reporte) {
    return (
      <Layout subtitulo="Panel Operario" items={MENU}>
        <Header
          titulo="Reporte no encontrado"
          subtitulo="El reporte solicitado no existe"
          usuario="Carlos Méndez"
          rol="Operario"
          iniciales="CM"
        />
        <Boton variante="secundario" onClick={volver}>
          Volver a reportes
        </Boton>
      </Layout>
    );
  }

  return (
    <Layout subtitulo="Panel Operario" items={MENU}>
      <Header
        titulo={`Reporte #${reporte.id}`}
        subtitulo="Detalle y gestión del reporte"
        usuario="Carlos Méndez"
        rol="Operario"
        iniciales="CM"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}
      >
        <div className="auth-card">
          <p className="section-title">Información del Reporte</p>
          <div style={{ fontSize: 13, lineHeight: 2 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              <span style={{ color: 'var(--texto-sec)' }}>Estado</span>
              <span className={`badge ${CLASE_ESTADO[reporte.estado]}`}>{reporte.estado}</span>
            </div>
            <FilaDato etiqueta="Prioridad" valor={reporte.prioridad} />
            <FilaDato etiqueta="Tipo de residuo" valor={reporte.tipoResiduo} />
            <FilaDato
              etiqueta="Reportado por"
              valor={autor ? `${autor.nombres} ${autor.apellidos}` : 'Desconocido'}
            />
            <FilaDato etiqueta="Dirección" valor={reporte.ubicacion} />
          </div>
          <p className="section-title" style={{ marginTop: 20 }}>
            Descripción
          </p>
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{reporte.descripcion}</p>
        </div>

        <div>
          <div className="auth-card" style={{ marginBottom: 20 }}>
            <p className="section-title">Ubicación</p>
            <MapaPlaceholder
              altura={180}
              etiqueta={reporte.ubicacion}
              marcadores={[{ x: 50, y: 50, color: '#EF4444', titulo: 'Ubicación del reporte' }]}
            />
          </div>

          <form className="auth-card" onSubmit={enviar} noValidate>
            <p className="section-title">Actualizar estado</p>
            {estaCerrado ? (
              <p role="status" style={{ fontSize: 13, color: 'var(--texto-sec)' }}>
                Este reporte está cerrado y ya no admite cambios.
              </p>
            ) : (
              <>
                <CampoTexto
                  id="nuevoEstado"
                  etiqueta="Nuevo estado"
                  componente="select"
                  value={formulario.nuevoEstado}
                  onChange={cambiarCampo}
                  error={errores.nuevoEstado}
                >
                  <option value="">Selecciona...</option>
                  {ESTADOS_REPORTE.filter((estado) => estado !== 'Nuevo').map((estado) => (
                    <option key={estado}>{estado}</option>
                  ))}
                </CampoTexto>
                <CampoTexto
                  id="comentario"
                  etiqueta="Comentario"
                  componente="textarea"
                  rows="3"
                  placeholder="Describe las acciones realizadas..."
                  value={formulario.comentario}
                  onChange={cambiarCampo}
                  error={errores.comentario}
                />
                <Boton type="submit" anchoCompleto>
                  Actualizar Reporte
                </Boton>
              </>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default DetalleReportePage;
