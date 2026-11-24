// Datos de prueba que replican la forma de las tablas de MySQL (database/migrations).
// Se reemplazan por llamadas a la API cuando el backend esté disponible (MIC-01b en adelante).

export const ESTADOS_REPORTE = ['Nuevo', 'Asignado', 'En proceso', 'Resuelto', 'No procede'];

// Un reporte en estos estados queda cerrado y no admite cambios (regla de negocio 1).
export const ESTADOS_CERRADOS = ['Resuelto', 'No procede'];

export const TIPOS_RESIDUO = ['Plástico', 'Orgánico', 'Escombros', 'Mixto', 'Peligroso'];

// Orden de menor a mayor gravedad; la interfaz lo usa para ordenar y filtrar.
export const NIVELES_AFECTACION = ['Bajo', 'Medio', 'Alto'];

export const ROLES = ['Ciudadano', 'Operario', 'Supervisor', 'Administrador'];

export const usuariosPrueba = [
  {
    id: 1,
    nombres: 'Jorge',
    apellidos: 'Ortiz',
    cedula: '1023456789',
    correo: 'jorge.ortiz@micron.gov.co',
    rol: 'Administrador',
    estado: 'Activo',
  },
  {
    id: 2,
    nombres: 'Carlos',
    apellidos: 'Méndez',
    cedula: '1098765432',
    correo: 'carlos.mendez@micron.gov.co',
    rol: 'Supervisor',
    estado: 'Activo',
  },
  {
    id: 3,
    nombres: 'Laura',
    apellidos: 'Pineda',
    cedula: '1045678901',
    correo: 'laura.pineda@micron.gov.co',
    rol: 'Operario',
    estado: 'Activo',
  },
  {
    id: 4,
    nombres: 'Robinson',
    apellidos: 'Turriago',
    cedula: '1012345678',
    correo: 'robinson.turriago@gmail.com',
    rol: 'Ciudadano',
    estado: 'Activo',
  },
];

export const reportesPrueba = [
  {
    id: 12,
    descripcion: 'Acumulación de residuos orgánicos en la esquina del parque',
    ubicacion: 'Calle 45 con Cra 7',
    tipoResiduo: 'Orgánico',
    prioridad: 'Alta',
    nivelAfectacion: 'Alto',
    estado: 'Nuevo',
    fecha: '15/07/2026',
    usuarioId: 4,
  },
  {
    id: 11,
    descripcion: 'Escombros abandonados sobre la vía',
    ubicacion: 'Av. Boyacá con Calle 80',
    tipoResiduo: 'Escombros',
    prioridad: 'Alta',
    nivelAfectacion: 'Alto',
    estado: 'Asignado',
    fecha: '12/07/2026',
    usuarioId: 4,
  },
  {
    id: 10,
    descripcion: 'Bolsas plásticas dispersas cerca al colegio',
    ubicacion: 'Carrera 30 #15-22',
    tipoResiduo: 'Plástico',
    prioridad: 'Media',
    nivelAfectacion: 'Medio',
    estado: 'En proceso',
    fecha: '10/07/2026',
    usuarioId: 4,
  },
  {
    id: 9,
    descripcion: 'Residuos mixtos en lote baldío',
    ubicacion: 'Carrera 15 #32-10',
    tipoResiduo: 'Mixto',
    prioridad: 'Baja',
    nivelAfectacion: 'Bajo',
    estado: 'Resuelto',
    fecha: '08/07/2026',
    usuarioId: 4,
  },
];

export const notificacionesPrueba = [
  {
    id: 1,
    mensaje: 'Tu reporte #9 fue marcado como Resuelto',
    tiempo: 'Hace 2 horas',
    leida: false,
  },
  {
    id: 2,
    mensaje: 'Tu reporte #11 fue asignado a un operario',
    tiempo: 'Hace 1 día',
    leida: false,
  },
  { id: 3, mensaje: 'Se recibió tu reporte #12 correctamente', tiempo: 'Hace 2 días', leida: true },
];
