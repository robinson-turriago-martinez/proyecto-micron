import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Registro from './pages/Registro'
import ErrorPage from './pages/ErrorPage'
import DashboardCiudadanoPage from './features/reportes/pages/DashboardCiudadanoPage'
import CrearReportePage from './features/reportes/pages/CrearReportePage'
import ListaReportesPage from './features/reportes/pages/ListaReportesPage'
import DetalleReportePage from './features/reportes/pages/DetalleReportePage'
import MapaMonitoreo from './pages/MapaMonitoreo'
import DashboardSupervision from './pages/DashboardSupervision'
import GestionUsuariosPage from './features/usuarios/pages/GestionUsuariosPage'
import NoEncontradaPage from './pages/NoEncontradaPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/dashboard" element={<DashboardCiudadanoPage />} />
      <Route path="/crear-reporte" element={<CrearReportePage />} />
      <Route path="/reportes" element={<ListaReportesPage />} />
      <Route path="/reporte/:id" element={<DetalleReportePage />} />
      <Route path="/mapa" element={<MapaMonitoreo />} />
      <Route path="/supervision" element={<DashboardSupervision />} />
      <Route path="/usuarios" element={<GestionUsuariosPage />} />
      <Route path="*" element={<NoEncontradaPage />} />
    </Routes>
  )
}

export default App
