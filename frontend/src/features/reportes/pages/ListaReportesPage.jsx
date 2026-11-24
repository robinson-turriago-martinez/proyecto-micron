import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import Header from '../../../components/layout/Header';
import Tabla from '../../../components/ui/Tabla';
import Boton from '../../../components/ui/Boton';
import { useDatos } from '../../../context/DatosContext';
import { PERFILES } from '../../../config/perfiles';

const PERFIL = PERFILES.operario;

const claseEstado = {
  Nuevo: 'badge-nuevo',
  Asignado: 'badge-asignado',
  'En proceso': 'badge-proceso',
  Resuelto: 'badge-resuelto',
  'No procede': 'badge-resuelto',
};

function ListaReportesPage() {
  const navigate = useNavigate();
  const { reportes } = useDatos();
  const [filtro, setFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // Definición declarativa de columnas: cada una dice cómo pintar su celda
  const columnas = [
    { clave: 'id', titulo: 'ID', render: (r) => `#${r.id}` },
    { clave: 'ubicacion', titulo: 'Ubicación' },
    { clave: 'tipo', titulo: 'Tipo' },
    { clave: 'prioridad', titulo: 'Prioridad' },
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
          Gestionar
        </Boton>
      ),
    },
  ];

  // Filtro funcional (sin backend)
  const reportesFiltrados = reportes.filter((r) => {
    const coincideEstado = filtro ? r.estado === filtro : true;
    const coincideBusqueda = busqueda
      ? r.id.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
      : true;
    return coincideEstado && coincideBusqueda;
  });

  return (
    <Layout subtitulo={PERFIL.panel} items={PERFIL.menu}>
      <Header
        titulo="Gestión de Reportes"
        subtitulo="Reportes asignados a tu zona"
        usuario={PERFIL.usuario}
        rol={PERFIL.rol}
        iniciales={PERFIL.iniciales}
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por ID o ubicación..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar reportes"
          style={{
            padding: '9px 12px',
            border: '1px solid var(--borde)',
            borderRadius: 8,
            fontSize: 13,
            width: 240,
          }}
        />
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          aria-label="Filtrar por estado"
          style={{
            padding: '9px 12px',
            border: '1px solid var(--borde)',
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          <option value="">Todos los estados</option>
          <option>Nuevo</option>
          <option>Asignado</option>
          <option>En Proceso</option>
          <option>Resuelto</option>
        </select>
      </div>

      <Tabla
        columnas={columnas}
        filas={reportesFiltrados}
        mensajeVacio="No se encontraron reportes"
      />
    </Layout>
  );
}

export default ListaReportesPage;
