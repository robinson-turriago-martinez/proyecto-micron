import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Registro from './pages/Registro'
import ErrorPage from './pages/ErrorPage'
import DashboardCiudadano from './pages/DashboardCiudadano'
import CrearReporte from './pages/CrearReporte'
import ListaReportes from './pages/ListaReportes'
import DetalleReporte from './pages/DetalleReporte'
import MapaMonitoreo from './pages/MapaMonitoreo'
import DashboardSupervision from './pages/DashboardSupervision'
import GestionUsuariosPage from './features/usuarios/pages/GestionUsuariosPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/dashboard" element={<DashboardCiudadano />} />
      <Route path="/crear-reporte" element={<CrearReporte />} />
      <Route path="/reportes" element={<ListaReportes />} />
      <Route path="/reporte/:id" element={<DetalleReporte />} />
      <Route path="/mapa" element={<MapaMonitoreo />} />
      <Route path="/supervision" element={<DashboardSupervision />} />
      <Route path="/usuarios" element={<GestionUsuariosPage />} />
    </Routes>
  )
}

export default App
