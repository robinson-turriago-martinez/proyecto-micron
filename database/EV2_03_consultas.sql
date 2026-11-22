-- ============================================================
-- EVIDENCIA 2 - ARCHIVO 3 de 5: CONSULTAS (SELECT con JOIN)
-- Consultas que responden a necesidades reales del sistema
-- ============================================================

USE micron;

-- ------------------------------------------------------------
-- CONSULTA 1: Listar todos los reportes con su ciudadano, 
-- ubicacion y tipo de residuo (JOIN de 4 tablas)
-- Necesidad: Vista general de reportes (RF.006, RF.010)
-- ------------------------------------------------------------
SELECT 
    r.id_reporte,
    CONCAT(u.nombres, ' ', u.apellidos) AS ciudadano,
    r.descripcion,
    t.nombre AS tipo_residuo,
    ub.direccion,
    ub.barrio,
    z.nombre_zona,
    r.estado,
    r.prioridad,
    r.fecha_creacion
FROM reporte r
INNER JOIN usuario u ON r.id_usuario = u.id_usuario
INNER JOIN tipo_residuo t ON r.id_tipo_residuo = t.id_tipo_residuo
INNER JOIN ubicacion ub ON r.id_ubicacion = ub.id_ubicacion
INNER JOIN zona z ON ub.id_zona = z.id_zona
ORDER BY r.fecha_creacion DESC;

-- ------------------------------------------------------------
-- CONSULTA 2: Reportes en estado 'Nuevo' o 'Asignado' 
-- con prioridad Alta (filtro + ordenamiento)
-- Necesidad: Priorizar atencion (RF.007)
-- ------------------------------------------------------------
SELECT 
    r.id_reporte,
    r.descripcion,
    r.estado,
    r.prioridad,
    ub.barrio
FROM reporte r
INNER JOIN ubicacion ub ON r.id_ubicacion = ub.id_ubicacion
WHERE r.prioridad = 'Alta' 
  AND r.estado IN ('Nuevo', 'Asignado')
ORDER BY r.fecha_creacion ASC;

-- ------------------------------------------------------------
-- CONSULTA 3: Reportes asignados a cada operario 
-- (JOIN con asignacion)
-- Necesidad: Ver carga de trabajo de operarios (RF.007)
-- ------------------------------------------------------------
SELECT 
    CONCAT(op.nombres, ' ', op.apellidos) AS operario,
    z.nombre_zona,
    COUNT(a.id_asignacion) AS total_asignaciones,
    r.estado
FROM asignacion a
INNER JOIN usuario op ON a.id_operario = op.id_usuario
INNER JOIN reporte r ON a.id_reporte = r.id_reporte
LEFT JOIN zona z ON op.id_zona = z.id_zona
GROUP BY op.id_usuario, r.estado
ORDER BY total_asignaciones DESC;

-- ------------------------------------------------------------
-- CONSULTA 4: Historial de seguimiento de un reporte especifico
-- Necesidad: Trazabilidad del reporte (RF.005)
-- ------------------------------------------------------------
SELECT 
    s.fecha,
    s.estado_anterior,
    s.estado_nuevo,
    s.comentario,
    CONCAT(u.nombres, ' ', u.apellidos) AS responsable
FROM seguimiento s
INNER JOIN usuario u ON s.id_usuario = u.id_usuario
WHERE s.id_reporte = 4
ORDER BY s.fecha ASC;

-- ------------------------------------------------------------
-- CONSULTA 5: Cantidad de reportes por tipo de residuo
-- Necesidad: Estadisticas del dashboard (RF.010)
-- ------------------------------------------------------------
SELECT 
    t.nombre AS tipo_residuo,
    COUNT(r.id_reporte) AS cantidad_reportes
FROM tipo_residuo t
LEFT JOIN reporte r ON t.id_tipo_residuo = r.id_tipo_residuo
GROUP BY t.id_tipo_residuo
ORDER BY cantidad_reportes DESC;

-- ------------------------------------------------------------
-- CONSULTA 6: Reportes por zona con conteo de estados
-- Necesidad: Identificar zonas criticas (RF.010)
-- ------------------------------------------------------------
SELECT 
    z.nombre_zona,
    COUNT(r.id_reporte) AS total_reportes,
    SUM(CASE WHEN r.estado = 'Resuelto' THEN 1 ELSE 0 END) AS resueltos,
    SUM(CASE WHEN r.estado != 'Resuelto' THEN 1 ELSE 0 END) AS pendientes
FROM zona z
LEFT JOIN ubicacion ub ON z.id_zona = ub.id_zona
LEFT JOIN reporte r ON ub.id_ubicacion = r.id_ubicacion
GROUP BY z.id_zona
ORDER BY total_reportes DESC;

-- ------------------------------------------------------------
-- CONSULTA 7: Notificaciones no leidas de un usuario
-- Necesidad: Bandeja de notificaciones (RF.008)
-- ------------------------------------------------------------
SELECT 
    n.mensaje,
    n.fecha_envio,
    r.descripcion AS reporte_relacionado
FROM notificacion n
LEFT JOIN reporte r ON n.id_reporte = r.id_reporte
WHERE n.id_usuario = 5 AND n.leida = 0
ORDER BY n.fecha_envio DESC;

-- ------------------------------------------------------------
-- CONSULTA 8: Usuarios con su rol (JOIN) filtrados por activos
-- Necesidad: Gestion de usuarios (RF.002)
-- ------------------------------------------------------------
SELECT 
    CONCAT(u.nombres, ' ', u.apellidos) AS nombre_completo,
    u.correo,
    rol.nombre_rol,
    u.estado
FROM usuario u
INNER JOIN rol ON u.id_rol = rol.id_rol
WHERE u.estado = 'Activo'
ORDER BY rol.nombre_rol, u.apellidos;
