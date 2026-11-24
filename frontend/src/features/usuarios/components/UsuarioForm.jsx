import CampoTexto from '../../../components/ui/CampoTexto';
import Boton from '../../../components/ui/Boton';
import { ROLES } from '../../../data/datosPrueba';

/** Formulario de alta y edición de usuarios; el estado vive en el hook que lo usa. */
function UsuarioForm({ formulario, errores, cambiarCampo, estaEditando, onGuardar, onCancelar }) {
  return (
    <form onSubmit={onGuardar} noValidate>
      <div className="form-row">
        <CampoTexto
          id="nombres"
          obligatorio
          etiqueta="Nombres"
          value={formulario.nombres}
          onChange={cambiarCampo}
          error={errores.nombres}
        />
        <CampoTexto
          id="apellidos"
          obligatorio
          etiqueta="Apellidos"
          value={formulario.apellidos}
          onChange={cambiarCampo}
          error={errores.apellidos}
        />
      </div>
      <CampoTexto
        id="cedula"
        obligatorio
        etiqueta="Cédula"
        value={formulario.cedula}
        onChange={cambiarCampo}
        error={errores.cedula}
      />
      <CampoTexto
        id="correo"
        obligatorio
        etiqueta="Correo electrónico"
        type="email"
        value={formulario.correo}
        onChange={cambiarCampo}
        error={errores.correo}
      />
      <div className="form-row">
        <CampoTexto
          id="rol"
          obligatorio
          etiqueta="Rol"
          componente="select"
          value={formulario.rol}
          onChange={cambiarCampo}
          error={errores.rol}
        >
          <option value="">Selecciona...</option>
          {ROLES.map((rol) => (
            <option key={rol}>{rol}</option>
          ))}
        </CampoTexto>
        <CampoTexto
          id="estado"
          etiqueta="Estado"
          componente="select"
          value={formulario.estado}
          onChange={cambiarCampo}
        >
          <option>Activo</option>
          <option>Inactivo</option>
          <option>Pendiente</option>
        </CampoTexto>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <Boton variante="secundario" onClick={onCancelar} style={{ flex: 1 }}>
          Cancelar
        </Boton>
        <Boton type="submit" style={{ flex: 1 }}>
          {estaEditando ? 'Guardar cambios' : 'Crear usuario'}
        </Boton>
      </div>
    </form>
  );
}

export default UsuarioForm;
