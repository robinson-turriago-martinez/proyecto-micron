-- ============================================================
-- EVIDENCIA 2 - ARCHIVO 2 de 5: DML (Inserción de datos)
-- Datos de prueba representativos
-- ============================================================

USE micron;

-- ------------------------------------------------------------
-- CATÁLOGOS: rol, zona, tipo_residuo
-- ------------------------------------------------------------
INSERT INTO rol (nombre_rol, descripcion) VALUES
('Ciudadano', 'Usuario que reporta microbasureros'),
('Operario', 'Personal de aseo que atiende reportes'),
('Supervisor', 'Monitorea estadisticas y asigna casos'),
('Administrador', 'Gestiona usuarios, zonas y configuracion');

INSERT INTO zona (nombre_zona, descripcion) VALUES
('Zona Norte', 'Sector norte del municipio'),
('Zona Sur', 'Sector sur del municipio'),
('Zona Centro', 'Sector centrico'),
('Zona Occidente', 'Sector occidental'),
('Zona Oriente', 'Sector oriental');

INSERT INTO tipo_residuo (nombre, descripcion) VALUES
('Plastico', 'Residuos plasticos reciclables'),
('Organico', 'Residuos biodegradables'),
('Escombros', 'Material de construccion y demolicion'),
('Mixto', 'Combinacion de varios tipos'),
('Peligroso', 'Residuos toxicos o de riesgo');

-- ------------------------------------------------------------
-- USUARIOS (uno por cada rol + varios ciudadanos y operarios)
-- ------------------------------------------------------------
INSERT INTO usuario (nombres, apellidos, cedula, correo, contrasena, telefono, id_rol, id_zona, estado) VALUES
('Admin', 'Principal', '1000000001', 'admin@micron.gov.co', '$2a$10$hashadmin', '3001112233', 4, NULL, 'Activo'),
('Jorge', 'Ortiz', '1000000002', 'jorge.ortiz@micron.gov.co', '$2a$10$hashsuper', '3002223344', 3, 1, 'Activo'),
('Carlos', 'Mendez', '1000000003', 'carlos.mendez@micron.gov.co', '$2a$10$hashop1', '3003334455', 2, 1, 'Activo'),
('Laura', 'Pineda', '1000000004', 'laura.pineda@micron.gov.co', '$2a$10$hashop2', '3004445566', 2, 2, 'Activo'),
('Robinson', 'Turriago', '1000000005', 'robinson.turriago@gmail.com', '$2a$10$hashciu1', '3005556677', 1, NULL, 'Activo'),
('Maria', 'Gonzalez', '1000000006', 'maria.gonzalez@outlook.com', '$2a$10$hashciu2', '3006667788', 1, NULL, 'Activo'),
('Pedro', 'Ramirez', '1000000007', 'pedro.ramirez@gmail.com', '$2a$10$hashciu3', '3007778899', 1, NULL, 'Pendiente');

-- ------------------------------------------------------------
-- UBICACIONES
-- ------------------------------------------------------------
INSERT INTO ubicacion (direccion, barrio, latitud, longitud, id_zona) VALUES
('Calle 45 con Cra 7', 'Centro', 4.6097100, -74.0817500, 3),
('Av. Boyaca con Calle 80', 'Las Ferias', 4.6900000, -74.0900000, 1),
('Carrera 30 #15-22', 'Kennedy', 4.6300000, -74.1500000, 2),
('Calle 72 con Cra 11', 'Chapinero', 4.6580000, -74.0620000, 4),
('Transversal 5 #98-12', 'Usaquen', 4.7100000, -74.0300000, 5);

-- ------------------------------------------------------------
-- REPORTES (creados por ciudadanos)
-- ------------------------------------------------------------
INSERT INTO reporte (descripcion, estado, prioridad, nivel_afectacion, id_usuario, id_ubicacion, id_tipo_residuo) VALUES
('Acumulacion de residuos organicos en la esquina del parque', 'Nuevo', 'Alta', 'Alto', 5, 1, 2),
('Escombros de construccion abandonados en la via', 'Asignado', 'Alta', 'Alto', 5, 2, 3),
('Bolsas de plastico dispersas cerca al colegio', 'En proceso', 'Media', 'Medio', 6, 3, 1),
('Residuos mixtos en lote baldio', 'Resuelto', 'Baja', 'Bajo', 6, 4, 4),
('Material peligroso cerca a la quebrada', 'Nuevo', 'Alta', 'Alto', 5, 5, 5);

-- ------------------------------------------------------------
-- EVIDENCIAS
-- ------------------------------------------------------------
INSERT INTO evidencia (tipo_archivo, url_archivo, id_reporte) VALUES
('image/jpg', '/uploads/rep1_foto1.jpg', 1),
('image/jpg', '/uploads/rep1_foto2.jpg', 1),
('image/png', '/uploads/rep2_foto1.png', 2),
('image/jpg', '/uploads/rep3_foto1.jpg', 3),
('image/jpg', '/uploads/rep4_foto1.jpg', 4);

-- ------------------------------------------------------------
-- ASIGNACIONES (supervisor asigna reportes a operarios)
-- ------------------------------------------------------------
INSERT INTO asignacion (comentario, id_reporte, id_operario, id_supervisor) VALUES
('Asignado por cercania de zona', 2, 3, 2),
('Prioridad media, atender esta semana', 3, 4, 2),
('Resuelto satisfactoriamente', 4, 4, 2);

-- ------------------------------------------------------------
-- SEGUIMIENTO (historial de cambios de estado)
-- ------------------------------------------------------------
INSERT INTO seguimiento (estado_anterior, estado_nuevo, comentario, id_reporte, id_usuario) VALUES
('Nuevo', 'Asignado', 'Reporte asignado a operario', 2, 2),
('Nuevo', 'Asignado', 'Asignacion automatica', 3, 2),
('Asignado', 'En proceso', 'Operario en sitio', 3, 4),
('Asignado', 'En proceso', 'Iniciando limpieza', 4, 4),
('En proceso', 'Resuelto', 'Limpieza completada', 4, 4);

-- ------------------------------------------------------------
-- NOTIFICACIONES
-- ------------------------------------------------------------
INSERT INTO notificacion (mensaje, leida, id_usuario, id_reporte) VALUES
('Tu reporte #1 fue recibido correctamente', 1, 5, 1),
('Tu reporte #2 fue asignado a un operario', 0, 5, 2),
('Tu reporte #4 fue marcado como Resuelto', 0, 6, 4),
('Se te asigno un nuevo reporte #2', 1, 3, 2),
('Se te asigno un nuevo reporte #3', 0, 4, 3);

-- ------------------------------------------------------------
-- VERIFICAR INSERCIONES
-- ------------------------------------------------------------
SELECT 'rol' AS tabla, COUNT(*) AS registros FROM rol
UNION ALL SELECT 'zona', COUNT(*) FROM zona
UNION ALL SELECT 'tipo_residuo', COUNT(*) FROM tipo_residuo
UNION ALL SELECT 'usuario', COUNT(*) FROM usuario
UNION ALL SELECT 'ubicacion', COUNT(*) FROM ubicacion
UNION ALL SELECT 'reporte', COUNT(*) FROM reporte
UNION ALL SELECT 'evidencia', COUNT(*) FROM evidencia
UNION ALL SELECT 'asignacion', COUNT(*) FROM asignacion
UNION ALL SELECT 'seguimiento', COUNT(*) FROM seguimiento
UNION ALL SELECT 'notificacion', COUNT(*) FROM notificacion;
