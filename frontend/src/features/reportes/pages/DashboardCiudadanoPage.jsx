import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout';
import Header from '../../../components/Header';
import Tabla from '../../../components/ui/Tabla';
import Boton from '../../../components/ui/Boton';
import { useDatos } from '../../../context/DatosContext';
import { ESTADOS_CERRADOS } from '../../../data/datosPrueba';

const menu = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/crear-reporte', label: 'Nuevo Reporte' },
  { to: '/reportes', label: 'Reportes' },
  { to: '/mapa', label: 'Mapa' },
];

const claseEstado = {
  Nuevo: 'badge-nuevo',
  Asignado: 'badge-asignado',
  'En proceso': 'badge-proceso',
  Resuelto: 'badge-resuelto',
  'No procede': 'badge-resuelto',
};

// Identificador del ciudadano en sesión. Se reemplaza por el usuario autenticado en MIC-01c.
const USUARIO_SESION_ID = 4;

function DashboardCiudadanoPage() {
  const navigate = useNavigate();
  const { reportes, notificaciones } = useDatos();

  const misReportes = reportes.filter((reporte) => reporte.usuarioId === USUARIO_SESION_ID);
  const resueltos = misReportes.filter((reporte) =>
    ESTADOS_CERRADOS.includes(reporte.estado)
  ).length;
  const enProceso = misReportes.filter((reporte) => reporte.estado === 'En proceso').length;
  const pendientes = misReportes.length - resueltos - enProceso;

  const columnas = [
    { clave: 'id', titulo: 'ID', render: (r) => `#${r.id}` },
    { clave: 'ubicacion', titulo: 'Ubicación' },
    { clave: 'tipoResiduo', titulo: 'Tipo' },
    { clave: 'fecha', titulo: 'Fecha' },
    {
      clave: 'estado',
      titulo: 'Estado',
      render: (r) => <span className={`badge ${claseEstado[r.estado]}`}>{r.estado}</span>,
    },
    {
      clave: 'accion',
      titulo: 'Acción',
      render: (r) => (
        <Boton variante="secundario" onClick={() => navigate(`/reporte/${r.id}`)}>
          Ver
        </Boton>
      ),
    },
  ];

  return (
    <Layout subtitulo="Panel Ciudadano" items={menu}>
      <Header
        titulo="Bienvenido, Robinson"
        subtitulo="Resumen de tus reportes"
        usuario="Robinson Turriago"
        rol="Ciudadano"
        iniciales="RT"
        notificaciones={notificaciones}
      />

      <div className="stats-grid">
        <div className="stat-card">
          <p className="label">Total Reportes</p>
          <p className="value azul">{misReportes.length}</p>
        </div>
        <div className="stat-card">
          <p className="label">En Proceso</p>
          <p className="value naranja">{enProceso}</p>
        </div>
        <div className="stat-card">
          <p className="label">Cerrados</p>
          <p className="value verde">{resueltos}</p>
        </div>
        <div className="stat-card">
          <p className="label">Pendientes</p>
          <p className="value rojo">{pendientes}</p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <p className="section-title" style={{ margin: 0 }}>
          Mis reportes recientes
        </p>
        <Boton onClick={() => navigate('/crear-reporte')}>+ Nuevo Reporte</Boton>
      </div>

      <Tabla columnas={columnas} filas={misReportes} mensajeVacio="Aún no has creado reportes" />
    </Layout>
  );
}

export default DashboardCiudadanoPage;
