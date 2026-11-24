import Layout from '../../../components/layout/Layout';
import Header from '../../../components/layout/Header';
import Modal from '../../../components/ui/Modal';
import Boton from '../../../components/ui/Boton';
import TablaUsuarios from '../components/TablaUsuarios';
import UsuarioForm from '../components/UsuarioForm';
import { useUsuarios } from '../hooks/useUsuarios';
import '../../../styles/auth.css';
import { PERFILES } from '../../../config/perfiles';

const PERFIL = PERFILES.administrador;

function GestionUsuariosPage() {
  const usuarios = useUsuarios();

  return (
    <Layout subtitulo={PERFIL.panel} items={PERFIL.menu}>
      <Header
        titulo="Gestión de Usuarios"
        subtitulo="Administra cuentas, roles y permisos"
        usuario={PERFIL.usuario}
        rol={PERFIL.rol}
        iniciales={PERFIL.iniciales}
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

      <TablaUsuarios
        usuarios={usuarios.usuariosFiltrados}
        onEditar={usuarios.abrirEditar}
        onAlternarEstado={usuarios.alternarEstado}
        onEliminar={usuarios.eliminar}
      />

      <Modal
        titulo={usuarios.estaEditando ? 'Editar Usuario' : 'Agregar Usuario'}
        abierto={usuarios.modalAbierto}
        onCerrar={usuarios.cerrarModal}
      >
        <UsuarioForm
          formulario={usuarios.formulario}
          errores={usuarios.errores}
          cambiarCampo={usuarios.cambiarCampo}
          estaEditando={usuarios.estaEditando}
          onGuardar={usuarios.guardar}
          onCancelar={usuarios.cerrarModal}
        />
      </Modal>
    </Layout>
  );
}

export default GestionUsuariosPage;
