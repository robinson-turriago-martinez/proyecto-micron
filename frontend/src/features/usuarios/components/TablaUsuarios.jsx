import Tabla from '../../../components/ui/Tabla';
import Boton from '../../../components/ui/Boton';

const COLORES_ROL = {
  Administrador: { fondo: '#EDE9FE', texto: '#6D28D9' },
  Supervisor: { fondo: '#DBEAFE', texto: '#1D4ED8' },
  Operario: { fondo: '#D1FAE5', texto: '#065F46' },
  Ciudadano: { fondo: '#FEF3C7', texto: '#B45309' },
};

const obtenerIniciales = (usuario) =>
  `${usuario.nombres[0] || ''}${usuario.apellidos[0] || ''}`.toUpperCase();

/** Tabla de usuarios con sus acciones; la lógica llega por props. */
function TablaUsuarios({ usuarios, onEditar, onAlternarEstado, onEliminar }) {
  const columnas = [
    {
      clave: 'usuario',
      titulo: 'Usuario',
      render: (u) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            aria-hidden="true"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
              background: COLORES_ROL[u.rol]?.texto || '#6B7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {obtenerIniciales(u)}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>
              {u.nombres} {u.apellidos}
            </div>
            <div style={{ fontSize: 12, color: 'var(--texto-sec)' }}>{u.correo}</div>
          </div>
        </div>
      ),
    },
    { clave: 'cedula', titulo: 'Cédula' },
    {
      clave: 'rol',
      titulo: 'Rol',
      render: (u) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            background: COLORES_ROL[u.rol]?.fondo,
            color: COLORES_ROL[u.rol]?.texto,
          }}
        >
          {u.rol}
        </span>
      ),
    },
    {
      clave: 'estado',
      titulo: 'Estado',
      render: (u) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: u.estado === 'Activo' ? 'var(--verde)' : 'var(--rojo)',
            }}
          />
          {u.estado}
        </span>
      ),
    },
    {
      clave: 'acciones',
      titulo: 'Acciones',
      render: (u) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Boton
            variante="secundario"
            onClick={() => onEditar(u)}
            aria-label={`Editar a ${u.nombres}`}
          >
            Editar
          </Boton>
          <Boton
            variante="secundario"
            onClick={() => onAlternarEstado(u.id)}
            aria-label={`${u.estado === 'Activo' ? 'Inhabilitar' : 'Activar'} a ${u.nombres}`}
          >
            {u.estado === 'Activo' ? 'Inhabilitar' : 'Activar'}
          </Boton>
          <Boton
            variante="peligro"
            onClick={() => onEliminar(u.id)}
            aria-label={`Eliminar a ${u.nombres}`}
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  return <Tabla columnas={columnas} filas={usuarios} mensajeVacio="No se encontraron usuarios" />;
}

export default TablaUsuarios;
