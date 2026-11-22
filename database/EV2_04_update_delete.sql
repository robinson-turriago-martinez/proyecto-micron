-- ============================================================
-- EVIDENCIA 2 - ARCHIVO 4 de 5: UPDATE y DELETE
-- Operaciones de actualizacion y eliminacion
-- verificando el comportamiento de las restricciones
-- ============================================================

USE micron;

-- ============================================================
-- OPERACIONES UPDATE
-- ============================================================

-- ------------------------------------------------------------
-- UPDATE 1: Cambiar el estado de un reporte a 'En proceso'
-- y registrar la fecha de actualizacion
-- ------------------------------------------------------------
UPDATE reporte
SET estado = 'En proceso',
    fecha_actualizacion = NOW()
WHERE id_reporte = 2;

-- Verificar el cambio
SELECT id_reporte, estado, fecha_actualizacion FROM reporte WHERE id_reporte = 2;

-- ------------------------------------------------------------
-- UPDATE 2: Activar un usuario que estaba pendiente
-- ------------------------------------------------------------
UPDATE usuario
SET estado = 'Activo'
WHERE id_usuario = 7;

-- Verificar
SELECT id_usuario, nombres, estado FROM usuario WHERE id_usuario = 7;

-- ------------------------------------------------------------
-- UPDATE 3: Cambiar la prioridad de un reporte
-- ------------------------------------------------------------
UPDATE reporte
SET prioridad = 'Alta'
WHERE id_reporte = 3;

-- Verificar
SELECT id_reporte, prioridad FROM reporte WHERE id_reporte = 3;

-- ============================================================
-- OPERACIONES DELETE
-- ============================================================

-- ------------------------------------------------------------
-- DELETE 1: Eliminar una notificacion especifica (sin dependencias)
-- Esta operacion debe ejecutarse SIN problemas
-- ------------------------------------------------------------
DELETE FROM notificacion WHERE id_notificacion = 5;

-- Verificar
SELECT COUNT(*) AS notificaciones_restantes FROM notificacion;

-- ------------------------------------------------------------
-- DELETE 2: Eliminar un reporte y ver efecto CASCADE
-- Al eliminar el reporte 4, se deben eliminar automaticamente
-- sus evidencias, asignaciones, seguimientos y notificaciones
-- (por ON DELETE CASCADE)
-- ------------------------------------------------------------

-- Antes de eliminar, contar registros dependientes del reporte 4
SELECT 'evidencias' AS tabla, COUNT(*) AS registros FROM evidencia WHERE id_reporte = 4
UNION ALL SELECT 'asignaciones', COUNT(*) FROM asignacion WHERE id_reporte = 4
UNION ALL SELECT 'seguimientos', COUNT(*) FROM seguimiento WHERE id_reporte = 4;

-- Eliminar el reporte (CASCADE elimina los dependientes)
DELETE FROM reporte WHERE id_reporte = 4;

-- Despues de eliminar, verificar que los dependientes ya no existen
SELECT 'evidencias' AS tabla, COUNT(*) AS registros FROM evidencia WHERE id_reporte = 4
UNION ALL SELECT 'asignaciones', COUNT(*) FROM asignacion WHERE id_reporte = 4
UNION ALL SELECT 'seguimientos', COUNT(*) FROM seguimiento WHERE id_reporte = 4;
-- Resultado esperado: 0 registros en cada tabla (CASCADE funciono)

-- ------------------------------------------------------------
-- DELETE 3: Eliminar una ubicacion liberada
-- (la ubicacion 4 quedo libre al borrar el reporte 4)
-- ------------------------------------------------------------
DELETE FROM ubicacion WHERE id_ubicacion = 4;

-- Verificar
SELECT COUNT(*) AS ubicaciones_restantes FROM ubicacion;
