import Layout from '../../../components/Layout';
import Header from '../../../components/Header';
import Modal from '../../../components/Modal';
import Tabla from '../../../components/ui/Tabla';
import Boton from '../../../components/ui/Boton';
import CampoTexto from '../../../components/ui/CampoTexto';
import { ROLES } from '../../../data/datosPrueba';
import { useUsuarios } from '../hooks/useUsuarios';
import '../../../pages/Auth.css';

const MENU = [
  { to: '/supervision', label: 'Dashboard' },
  { to: '/reportes', label: 'Reportes' },
  { to: '/mapa', label: 'Mapa' },
  { to: '/usuarios', label: 'Usuarios' },
];

const COLORES_ROL = {
  Administrador: { fondo: '#EDE9FE', texto: '#6D28D9' },
  Supervisor: { fondo: '#DBEAFE', texto: '#1D4ED8' },
  Operario: { fondo: '#D1FAE5', texto: '#065F46' },
  Ciudadano: { fondo: '#FEF3C7', texto: '#B45309' },
};

const obtenerIniciales = (usuario) =>
  `${usuario.nombres[0] || ''}${usuario.apellidos[0] || ''}`.toUpperCase();

function GestionUsuariosPage() {
  const usuarios = useUsuarios();

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
            onClick={() => usuarios.abrirEditar(u)}
            aria-label={`Editar a ${u.nombres}`}
          >
            Editar
          </Boton>
          <Boton
            variante="secundario"
            onClick={() => usuarios.alternarEstado(u.id)}
            aria-label={`${u.estado === 'Activo' ? 'Inhabilitar' : 'Activar'} a ${u.nombres}`}
          >
            {u.estado === 'Activo' ? 'Inhabilitar' : 'Activar'}
          </Boton>
          <Boton
            variante="peligro"
            onClick={() => usuarios.eliminar(u.id)}
            aria-label={`Eliminar a ${u.nombres}`}
          >
            Eliminar
          </Boton>
        </div>
      ),
    },
  ];

  const { formulario, errores, cambiarCampo } = usuarios;

  return (
    <Layout subtitulo="Administración" items={MENU}>
      <Header
        titulo="Gestión de Usuarios"
        subtitulo="Administra cuentas, roles y permisos"
        usuario="Admin Principal"
        rol="Administrador"
        iniciales="AP"
      />

      <div className="stats-grid">
        <div className="stat-card">
          <p className="label">Usuarios totales</p>
          <p className="value azul">{usuarios.totalUsuarios}</p>
        </div>
        <div className="stat-card">
          <p className="label">Activos</p>
          <p className="value verde">{usuarios.totalActivos}</p>
        </div>
        <div className="stat-card">
          <p className="label">Administradores</p>
          <p className="value" style={{ color: '#6D28D9' }}>
            {usuarios.totalAdministradores}
          </p>
        </div>
        <div className="stat-card">
          <p className="label">Inactivos</p>
          <p className="value rojo">{usuarios.totalUsuarios - usuarios.totalActivos}</p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <input
          type="text"
          placeholder="Buscar usuario..."
          aria-label="Buscar usuario"
          value={usuarios.busqueda}
          onChange={(e) => usuarios.setBusqueda(e.target.value)}
          style={{
            padding: '9px 12px',
            border: '1px solid var(--borde)',
            borderRadius: 8,
            fontSize: 13,
            width: 240,
          }}
        />
        <Boton onClick={usuarios.abrirCrear}>+ Agregar Usuario</Boton>
      </div>

      <Tabla
        columnas={columnas}
        filas={usuarios.usuariosFiltrados}
        mensajeVacio="No se encontraron usuarios"
      />

      <Modal
        titulo={usuarios.estaEditando ? 'Editar Usuario' : 'Agregar Usuario'}
        abierto={usuarios.modalAbierto}
        onCerrar={usuarios.cerrarModal}
      >
        <form onSubmit={usuarios.guardar} noValidate>
          <div className="form-row">
            <CampoTexto
              id="nombres"
              etiqueta="Nombres"
              value={formulario.nombres}
              onChange={cambiarCampo}
              error={errores.nombres}
            />
            <CampoTexto
              id="apellidos"
              etiqueta="Apellidos"
              value={formulario.apellidos}
              onChange={cambiarCampo}
              error={errores.apellidos}
            />
          </div>
          <CampoTexto
            id="cedula"
            etiqueta="Cédula"
            value={formulario.cedula}
            onChange={cambiarCampo}
            error={errores.cedula}
          />
          <CampoTexto
            id="correo"
            etiqueta="Correo electrónico"
            type="email"
            value={formulario.correo}
            onChange={cambiarCampo}
            error={errores.correo}
          />
          <div className="form-row">
            <CampoTexto
              id="rol"
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
            <Boton variante="secundario" onClick={usuarios.cerrarModal} style={{ flex: 1 }}>
              Cancelar
            </Boton>
            <Boton type="submit" style={{ flex: 1 }}>
              {usuarios.estaEditando ? 'Guardar cambios' : 'Crear usuario'}
            </Boton>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

export default GestionUsuariosPage;
