import CampoTexto from '../../../components/ui/CampoTexto';
import Boton from '../../../components/ui/Boton';
import Modal from '../../../components/ui/Modal';
import { ESTADOS_REPORTE } from '../../../data/datosPrueba';

/** Formulario para cambiar el estado de un reporte, con confirmación al cerrarlo. */
function CambioEstadoForm({
  estaCerrado,
  formulario,
  errores,
  confirmando,
  cambiarCampo,
  onEnviar,
  onConfirmar,
  onCancelarConfirmacion,
}) {
  return (
    <>
      <form className="auth-card" onSubmit={onEnviar} noValidate>
        <p className="section-title">Actualizar estado</p>
        {estaCerrado ? (
          <p role="status" style={{ fontSize: 13, color: 'var(--texto-sec)' }}>
            Este reporte está cerrado y ya no admite cambios.
          </p>
        ) : (
          <>
            <CampoTexto
              id="nuevoEstado"
              obligatorio
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
              obligatorio
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
      <Modal
        titulo="Confirmar cierre del reporte"
        abierto={confirmando}
        onCerrar={onCancelarConfirmacion}
      >
        <p>
          El estado «{formulario.nuevoEstado}» cierra el reporte y ya no admitirá cambios. ¿Deseas
          continuar?
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <Boton variante="secundario" onClick={onCancelarConfirmacion} style={{ flex: 1 }}>
            Cancelar
          </Boton>
          <Boton onClick={onConfirmar} style={{ flex: 1 }}>
            Confirmar cierre
          </Boton>
        </div>
      </Modal>
    </>
  );
}

export default CambioEstadoForm;
