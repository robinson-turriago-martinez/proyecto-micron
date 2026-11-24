/**
 * Perfiles de sesión de prueba: menú lateral y datos de cabecera por rol.
 * Se reemplazarán por los datos del usuario autenticado cuando exista el backend (MIC-01b).
 */
const MENU_SUPERVISION = [
  { to: '/supervision', label: 'Dashboard' },
  { to: '/reportes', label: 'Reportes' },
  { to: '/mapa', label: 'Mapa' },
  { to: '/usuarios', label: 'Usuarios' },
];

export const PERFILES = {
  ciudadano: {
    panel: 'Panel Ciudadano',
    usuario: 'Robinson Turriago',
    rol: 'Ciudadano',
    iniciales: 'RT',
    menu: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/crear-reporte', label: 'Nuevo Reporte' },
      { to: '/reportes', label: 'Reportes' },
      { to: '/mapa', label: 'Mapa' },
    ],
  },
  operario: {
    panel: 'Panel Operario',
    usuario: 'Carlos Méndez',
    rol: 'Operario',
    iniciales: 'CM',
    menu: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/reportes', label: 'Reportes' },
      { to: '/mapa', label: 'Mapa' },
    ],
  },
  supervisor: {
    panel: 'Panel Supervisor',
    usuario: 'Jorge Ortiz',
    rol: 'Supervisor',
    iniciales: 'JO',
    menu: MENU_SUPERVISION,
  },
  administrador: {
    panel: 'Administración',
    usuario: 'Admin Principal',
    rol: 'Administrador',
    iniciales: 'AP',
    menu: MENU_SUPERVISION,
  },
};
