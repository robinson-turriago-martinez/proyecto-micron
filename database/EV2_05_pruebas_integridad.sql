-- ============================================================
-- EVIDENCIA 2 - ARCHIVO 5 de 5: PRUEBAS DE INTEGRIDAD
-- Pruebas que demuestran que las restricciones ACTUAN
-- (Estas consultas DEBEN FALLAR a proposito - captura el error)
-- ============================================================

USE micron;

-- ============================================================
-- PRUEBA 1: INTEGRIDAD DE DOMINIO (CHECK)
-- Intentar insertar un reporte con estado invalido
-- RESULTADO ESPERADO: ERROR - viola chk_reporte_estado
-- ============================================================
-- Descomentar para probar (fallara):
INSERT INTO reporte (descripcion, estado, prioridad, id_usuario, id_ubicacion, id_tipo_residuo)
VALUES ('Prueba estado invalido', 'Terminado', 'Media', 5, 5, 1);
-- ERROR esperado: Check constraint 'chk_reporte_estado' is violated.


-- ============================================================
-- PRUEBA 2: INTEGRIDAD DE DOMINIO (CHECK)
-- Intentar insertar una prioridad invalida
-- RESULTADO ESPERADO: ERROR - viola chk_reporte_prioridad
-- ============================================================
INSERT INTO reporte (descripcion, estado, prioridad, id_usuario, id_ubicacion, id_tipo_residuo)
VALUES ('Prueba prioridad invalida', 'Nuevo', 'Urgente', 5, 5, 1);
-- ERROR esperado: Check constraint 'chk_reporte_prioridad' is violated.


-- ============================================================
-- PRUEBA 3: INTEGRIDAD REFERENCIAL (FK)
-- Intentar crear un reporte con un usuario que NO existe
-- RESULTADO ESPERADO: ERROR - viola fk_reporte_usuario
-- ============================================================
INSERT INTO reporte (descripcion, estado, prioridad, id_usuario, id_ubicacion, id_tipo_residuo)
VALUES ('Prueba usuario inexistente', 'Nuevo', 'Media', 999, 5, 1);
-- ERROR esperado: Cannot add or update a child row: a foreign key constraint fails.


-- ============================================================
-- PRUEBA 4: INTEGRIDAD DE ENTIDAD (UNIQUE)
-- Intentar insertar un usuario con una cedula que ya existe
-- RESULTADO ESPERADO: ERROR - viola uq_usuario_cedula
-- ============================================================
INSERT INTO usuario (nombres, apellidos, cedula, correo, contrasena, id_rol, estado)
VALUES ('Duplicado', 'Prueba', '1000000005', 'nuevo@correo.com', 'hash', 1, 'Activo');
-- ERROR esperado: Duplicate entry '1000000005' for key 'uq_usuario_cedula'.


-- ============================================================
-- PRUEBA 5: INTEGRIDAD DE ENTIDAD (UNIQUE correo)
-- Intentar insertar un correo duplicado
-- RESULTADO ESPERADO: ERROR - viola uq_usuario_correo
-- ============================================================
INSERT INTO usuario (nombres, apellidos, cedula, correo, contrasena, id_rol, estado)
VALUES ('Otro', 'Usuario', '2000000001', 'robinson.turriago@gmail.com', 'hash', 1, 'Activo');
-- ERROR esperado: Duplicate entry 'robinson.turriago@gmail.com' for key 'uq_usuario_correo'.


-- ============================================================
-- PRUEBA 6: NOT NULL
-- Intentar insertar un usuario sin correo (campo obligatorio)
-- RESULTADO ESPERADO: ERROR - el campo correo no puede ser NULL
-- ============================================================
INSERT INTO usuario (nombres, apellidos, cedula, contrasena, id_rol, estado)
VALUES ('Sin', 'Correo', '3000000001', 'hash', 1, 'Activo');
-- ERROR esperado: Field 'correo' doesn't have a default value.


-- ============================================================
-- PRUEBA 7: INTEGRIDAD REFERENCIAL - DELETE RESTRICT
-- Intentar eliminar un rol que esta en uso por usuarios
-- RESULTADO ESPERADO: ERROR - no se puede eliminar (RESTRICT)
-- ============================================================
DELETE FROM rol WHERE id_rol = 1;
-- ERROR esperado: Cannot delete or update a parent row: a foreign key constraint fails.


-- ============================================================
-- PRUEBA 8: CHECK de coordenadas
-- Intentar insertar una latitud fuera de rango (-90 a 90)
-- RESULTADO ESPERADO: ERROR - viola chk_latitud
-- ============================================================
INSERT INTO ubicacion (direccion, barrio, latitud, longitud, id_zona)
VALUES ('Prueba', 'Barrio X', 200.0, -74.0, 1);
-- ERROR esperado: Check constraint 'chk_latitud' is violated.


-- ============================================================
-- RESUMEN DE PRUEBAS
-- ============================================================
-- Si todas las pruebas anteriores generaron el ERROR esperado,
-- significa que las restricciones de integridad estan funcionando
-- correctamente:
--   - Integridad de dominio: CHECK (pruebas 1, 2, 8)
--   - Integridad referencial: FK (pruebas 3, 7)
--   - Integridad de entidad: UNIQUE (pruebas 4, 5)
--   - NOT NULL (prueba 6)
-- ============================================================
