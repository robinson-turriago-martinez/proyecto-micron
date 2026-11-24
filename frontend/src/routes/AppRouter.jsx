import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import RegistroPage from '../features/auth/pages/RegistroPage';
import ErrorPage from '../pages/ErrorPage';
import NoEncontradaPage from '../pages/NoEncontradaPage';
import DashboardCiudadanoPage from '../features/reportes/pages/DashboardCiudadanoPage';
import CrearReportePage from '../features/reportes/pages/CrearReportePage';
import ListaReportesPage from '../features/reportes/pages/ListaReportesPage';
import DetalleReportePage from '../features/reportes/pages/DetalleReportePage';
import DashboardSupervisionPage from '../features/reportes/pages/DashboardSupervisionPage';
import MapaMonitoreoPage from '../features/mapa/pages/MapaMonitoreoPage';
import GestionUsuariosPage from '../features/usuarios/pages/GestionUsuariosPage';

/** Único lugar donde se declaran las rutas de la aplicación. */
function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/dashboard" element={<DashboardCiudadanoPage />} />
      <Route path="/crear-reporte" element={<CrearReportePage />} />
      <Route path="/reportes" element={<ListaReportesPage />} />
      <Route path="/reporte/:id" element={<DetalleReportePage />} />
      <Route path="/mapa" element={<MapaMonitoreoPage />} />
      <Route path="/supervision" element={<DashboardSupervisionPage />} />
      <Route path="/usuarios" element={<GestionUsuariosPage />} />
      <Route path="*" element={<NoEncontradaPage />} />
    </Routes>
  );
}

export default AppRouter;
