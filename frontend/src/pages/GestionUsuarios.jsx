import { useState } from 'react'
import Layout from '../components/Layout'
import Header from '../components/Header'
import Modal from '../components/Modal'
import { useDatos } from '../context/DatosContext'
import { ROLES } from '../data/datosPrueba'
import './Auth.css'

const menu = [
  { to: '/supervision', label: 'Dashboard' },
  { to: '/reportes', label: 'Reportes' },
  { to: '/mapa', label: 'Mapa' },
  { to: '/usuarios', label: 'Usuarios' },
]

const coloresRol = {
  Administrador: { bg: '#EDE9FE', color: '#6D28D9' },
  Supervisor: { bg: '#DBEAFE', color: '#1D4ED8' },
  Operario: { bg: '#D1FAE5', color: '#065F46' },
  Ciudadano: { bg: '#FEF3C7', color: '#B45309' },
}

const formVacio = { id: null, nombres: '', apellidos: '', cedula: '', correo: '', rol: '', estado: 'Activo' }

function GestionUsuarios() {
  const { usuarios, crearUsuario, actualizarUsuario, eliminarUsuario, alternarEstadoUsuario } = useDatos()
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [form, setForm] = useState(formVacio)
  const [errores, setErrores] = useState({})
  const [editando, setEditando] = useState(false)

  const iniciales = (u) => `${u.nombres[0] || ''}${u.apellidos[0] || ''}`.toUpperCase()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Abrir modal para CREAR
  const abrirCrear = () => {
    setForm(formVacio)
    setEditando(false)
    setErrores({})
    setModalAbierto(true)
  }

  // Abrir modal para EDITAR
  const abrirEditar = (usuario) => {
    setForm(usuario)
    setEditando(true)
    setErrores({})
    setModalAbierto(true)
  }

  // Validaciones
  const validar = () => {
    const err = {}
    if (!form.nombres.trim()) err.nombres = 'Campo obligatorio'
    if (!form.apellidos.trim()) err.apellidos = 'Campo obligatorio'
    if (!form.cedula.trim()) err.cedula = 'Campo obligatorio'
    else if (!/^\d+$/.test(form.cedula)) err.cedula = 'Solo números'
    if (!form.correo.trim()) err.correo = 'Campo obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) err.correo = 'Correo inválido'
    if (!form.rol) err.rol = 'Selecciona un rol'
    return err
  }

  // Guardar (crear o editar): la regla de unicidad vive en el contexto
  const handleGuardar = (e) => {
    e.preventDefault()
    const err = validar()
    setErrores(err)
    if (Object.keys(err).length > 0) return

    const resultado = editando ? actualizarUsuario(form) : crearUsuario(form)
    if (!resultado.exito) {
      const campo = resultado.mensaje.toLowerCase().includes('cédula') ? 'cedula' : 'correo'
      setErrores({ [campo]: resultado.mensaje })
      return
    }
    setModalAbierto(false)
  }
  // Eliminar usuario
  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      eliminarUsuario(id)
    }
  }

  // Inhabilitar / Activar usuario
  const toggleEstado = (id) => alternarEstadoUsuario(id)
  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.nombres} ${u.apellidos} ${u.correo} ${u.cedula}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  const totalActivos = usuarios.filter((u) => u.estado === 'Activo').length
  const totalAdmins = usuarios.filter((u) => u.rol === 'Administrador').length

  return (
    <Layout subtitulo="Administración" items={menu}>
      <Header titulo="Gestión de Usuarios" subtitulo="Administra cuentas, roles y permisos"
        usuario="Admin Principal" rol="Administrador" iniciales="AP" />

      <div className="stats-grid">
        <div className="stat-card"><p className="label">Usuarios totales</p><p className="value azul">{usuarios.length}</p></div>
        <div className="stat-card"><p className="label">Activos</p><p className="value verde">{totalActivos}</p></div>
        <div className="stat-card"><p className="label">Administradores</p><p className="value" style={{ color: '#6D28D9' }}>{totalAdmins}</p></div>
        <div className="stat-card"><p className="label">Inactivos</p><p className="value rojo">{usuarios.length - totalActivos}</p></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
        <input type="text" placeholder="Buscar usuario..." aria-label="Buscar usuario"
          value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          style={{ padding: '9px 12px', border: '1px solid var(--borde)', borderRadius: 8, fontSize: 13, width: 240 }} />
        <button className="btn btn-primary" onClick={abrirCrear}>+ Agregar Usuario</button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr><th>Usuario</th><th>Cédula</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: coloresRol[u.rol]?.color || '#6B7280', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }} aria-hidden="true">{iniciales(u)}</div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{u.nombres} {u.apellidos}</div>
                      <div style={{ fontSize: 12, color: 'var(--texto-sec)' }}>{u.correo}</div>
                    </div>
                  </div>
                </td>
                <td>{u.cedula}</td>
                <td><span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: coloresRol[u.rol]?.bg, color: coloresRol[u.rol]?.color }}>{u.rol}</span></td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: u.estado === 'Activo' ? 'var(--verde)' : 'var(--rojo)' }}></span>
                    {u.estado}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: 12 }}
                      onClick={() => abrirEditar(u)} aria-label={`Editar a ${u.nombres}`}>Editar</button>
                    <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: 12, color: u.estado === 'Activo' ? '#B45309' : '#065F46' }}
                      onClick={() => toggleEstado(u.id)} aria-label={`${u.estado === 'Activo' ? 'Inhabilitar' : 'Activar'} a ${u.nombres}`}>
                      {u.estado === 'Activo' ? 'Inhabilitar' : 'Activar'}
                    </button>
                    <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: 12, color: 'var(--rojo)', borderColor: '#FECACA' }}
                      onClick={() => handleEliminar(u.id)} aria-label={`Eliminar a ${u.nombres}`}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
            {usuariosFiltrados.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--texto-sec)' }}>No se encontraron usuarios</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Crear / Editar */}
      <Modal titulo={editando ? 'Editar Usuario' : 'Agregar Usuario'} abierto={modalAbierto} onCerrar={() => setModalAbierto(false)}>
        <form onSubmit={handleGuardar} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="m-nombres">Nombres</label>
              <input id="m-nombres" name="nombres" value={form.nombres} onChange={handleChange} aria-invalid={!!errores.nombres} />
              {errores.nombres && <span className="error-text">{errores.nombres}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="m-apellidos">Apellidos</label>
              <input id="m-apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} aria-invalid={!!errores.apellidos} />
              {errores.apellidos && <span className="error-text">{errores.apellidos}</span>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="m-cedula">Cédula</label>
            <input id="m-cedula" name="cedula" value={form.cedula} onChange={handleChange} aria-invalid={!!errores.cedula} />
            {errores.cedula && <span className="error-text">{errores.cedula}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="m-correo">Correo electrónico</label>
            <input id="m-correo" name="correo" type="email" value={form.correo} onChange={handleChange} aria-invalid={!!errores.correo} />
            {errores.correo && <span className="error-text">{errores.correo}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="m-rol">Rol</label>
              <select id="m-rol" name="rol" value={form.rol} onChange={handleChange} aria-invalid={!!errores.rol}>
                <option value="">Selecciona...</option>
                {ROLES.map((rol) => (<option key={rol}>{rol}</option>))}
              </select>
              {errores.rol && <span className="error-text">{errores.rol}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="m-estado">Estado</label>
              <select id="m-estado" name="estado" value={form.estado} onChange={handleChange}>
                <option>Activo</option>
                <option>Inactivo</option>
                <option>Pendiente</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setModalAbierto(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editando ? 'Guardar cambios' : 'Crear usuario'}</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}

export default GestionUsuarios
