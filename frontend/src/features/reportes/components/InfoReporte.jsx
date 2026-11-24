import '../../../styles/auth.css';

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

/** Tarjeta con los datos del reporte. */
function InfoReporte({ reporte, autor }) {
  return (
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
  );
}

export default InfoReporte;
