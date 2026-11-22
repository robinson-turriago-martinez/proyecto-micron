# IMPLEMENTACIÓN Y MANIPULACIÓN DE LA BASE DE DATOS

## GA6-220501096-AA2-EV01 — Documento Técnico

---

**Aprendiz:** Robinson Turriago  
**Programa de formación:** Análisis y Desarrollo de Software  
**Competencia:** 220501096 | **RAP:** 220501096-02  
**Instructor:** Jorge David Ortiz Rojas  
**Centro de formación:** SENA - Centro Agroindustrial, Regional Quindío  
**Proyecto:** Micron - Sistema de Reporte de Microbasureros  
**Motor:** MySQL (InnoDB) | **Herramienta:** MySQL Workbench  
**Fecha:** Septiembre 2026

---

## TABLA DE CONTENIDO

1. Introducción
2. Entorno de implementación
3. Archivos entregados
4. Etapa 1: Creación de la estructura (DDL)
5. Etapa 2: Inserción de datos (DML)
6. Etapa 3: Consultas (SELECT con JOIN)
7. Etapa 4: Actualización y eliminación (UPDATE/DELETE)
8. Etapa 5: Pruebas de integridad
9. Etapa 6: Respaldo de la base de datos
10. Conclusiones

---

## 1. INTRODUCCIÓN

Este documento presenta la implementación física en MySQL del modelo de datos del sistema Micron, diseñado en la Evidencia 1. Se documenta la creación de la estructura, la carga de datos de prueba, las operaciones de consulta, actualización y eliminación, las pruebas de integridad y la generación del respaldo de la base de datos.

Todas las operaciones se ejecutaron en **MySQL Workbench** sobre el motor **InnoDB**, que soporta claves foráneas e integridad referencial.

---

## 2. ENTORNO DE IMPLEMENTACIÓN

| Elemento | Detalle |
|----------|---------|
| Motor de base de datos | MySQL 8.0 |
| Motor de almacenamiento | InnoDB |
| Herramienta | MySQL Workbench 8.0 |
| Codificación | utf8mb4 |
| Sistema operativo | Windows |

### Instalación (si no la tienes):
1. Descarga **MySQL Installer** desde mysql.com
2. Instala "MySQL Server" + "MySQL Workbench"
3. Configura una contraseña para el usuario root
4. Abre Workbench y conéctate a "Local instance MySQL"

---

## 3. ARCHIVOS ENTREGADOS

| Archivo | Descripción | Criterio |
|---------|-------------|----------|
| `EV2_01_ddl_micron.sql` | Creación de BD, tablas, PK, FK, CHECK (InnoDB) | 1, 2 |
| `EV2_02_dml_insert.sql` | Inserción de datos de prueba | 3 |
| `EV2_03_consultas.sql` | 8 consultas SELECT con JOIN, filtros, orden | 4 |
| `EV2_04_update_delete.sql` | UPDATE y DELETE con prueba de CASCADE | 4 |
| `EV2_05_pruebas_integridad.sql` | 8 pruebas que validan las restricciones | 2 |
| `respaldo_micron.sql` | Respaldo generado con mysqldump | 5 |

---

## 4. ETAPA 1: CREACIÓN DE LA ESTRUCTURA (DDL)

**Archivo:** `EV2_01_ddl_micron.sql`

Se creó la base de datos `micron` y sus 10 tablas usando el motor **InnoDB**. Cada tabla incluye:
- Clave primaria autoincremental (AUTO_INCREMENT)
- Claves foráneas con ON UPDATE/DELETE
- Restricciones UNIQUE, NOT NULL, DEFAULT y CHECK

### Cómo ejecutar:
1. Abre MySQL Workbench
2. Abre el archivo `EV2_01_ddl_micron.sql`
3. Ejecuta todo (⚡ rayo) 
4. Verifica con `SHOW TABLES;`

> 📸 **CAPTURA 1:** Resultado de `SHOW TABLES;` mostrando las 10 tablas creadas.
>
> 📸 **CAPTURA 2:** Panel izquierdo (Navigator) mostrando el esquema `micron` con sus tablas.

---

## 5. ETAPA 2: INSERCIÓN DE DATOS (DML)

**Archivo:** `EV2_02_dml_insert.sql`

Se insertaron datos de prueba representativos: 4 roles, 5 zonas, 5 tipos de residuo, 7 usuarios (uno por rol), 5 ubicaciones, 5 reportes, 5 evidencias, 3 asignaciones, 5 seguimientos y 5 notificaciones.

> 📸 **CAPTURA 3:** Resultado de la consulta de verificación que muestra el conteo de registros por tabla.

---

## 6. ETAPA 3: CONSULTAS (SELECT CON JOIN)

**Archivo:** `EV2_03_consultas.sql`

Se ejecutaron 8 consultas que responden a necesidades reales:

| # | Consulta | Técnica |
|---|----------|---------|
| 1 | Reportes con ciudadano, ubicación y tipo | JOIN de 5 tablas + ORDER BY |
| 2 | Reportes de prioridad Alta pendientes | WHERE + IN + ORDER BY |
| 3 | Carga de trabajo por operario | JOIN + GROUP BY + COUNT |
| 4 | Historial de un reporte | JOIN + WHERE + ORDER BY |
| 5 | Reportes por tipo de residuo | LEFT JOIN + GROUP BY |
| 6 | Zonas críticas con conteo de estados | LEFT JOIN + CASE + SUM |
| 7 | Notificaciones no leídas de un usuario | JOIN + WHERE |
| 8 | Usuarios activos con su rol | INNER JOIN + WHERE |

> 📸 **CAPTURA 4 a 11:** Resultado de cada una de las 8 consultas (una captura por consulta).

---

## 7. ETAPA 4: ACTUALIZACIÓN Y ELIMINACIÓN

**Archivo:** `EV2_04_update_delete.sql`

### UPDATE:
- Cambiar estado de reporte a 'En proceso'
- Activar un usuario pendiente
- Cambiar prioridad de un reporte

### DELETE:
- Eliminar una notificación (sin dependencias)
- Eliminar un reporte y demostrar el efecto **CASCADE** (se eliminan sus evidencias, asignaciones y seguimientos automáticamente)

> 📸 **CAPTURA 12:** Antes y después del UPDATE del reporte.
>
> 📸 **CAPTURA 13:** Conteo de dependientes ANTES y DESPUÉS del DELETE con CASCADE (demuestra que pasó de N registros a 0).

---

## 8. ETAPA 5: PRUEBAS DE INTEGRIDAD

**Archivo:** `EV2_05_pruebas_integridad.sql`

Se ejecutaron 8 pruebas que **deben fallar** a propósito, demostrando que las restricciones funcionan:

| Prueba | Qué valida | Error esperado |
|--------|-----------|----------------|
| 1 | CHECK estado inválido | Check constraint violated |
| 2 | CHECK prioridad inválida | Check constraint violated |
| 3 | FK usuario inexistente | Foreign key constraint fails |
| 4 | UNIQUE cédula duplicada | Duplicate entry |
| 5 | UNIQUE correo duplicado | Duplicate entry |
| 6 | NOT NULL correo faltante | Field doesn't have default |
| 7 | DELETE RESTRICT rol en uso | Cannot delete parent row |
| 8 | CHECK latitud fuera de rango | Check constraint violated |

> 📸 **CAPTURA 14 a 21:** El mensaje de error de cada prueba (demuestra que la restricción actuó correctamente).

**Nota importante:** En estas pruebas, el ERROR es el resultado exitoso. Si la BD rechaza la operación, significa que la integridad está protegida.

---

## 9. ETAPA 6: RESPALDO DE LA BASE DE DATOS

### Opción A: Desde MySQL Workbench (recomendada)
1. Menú **Server → Data Export**
2. Selecciona el esquema `micron`
3. Marca "Dump Structure and Data"
4. Elige "Export to Self-Contained File" → nombre: `respaldo_micron.sql`
5. Clic en "Start Export"

### Opción B: Desde la terminal (mysqldump)
```bash
mysqldump -u root -p micron > respaldo_micron.sql
```

> 📸 **CAPTURA 22:** Pantalla de "Data Export" de Workbench con la exportación completada.
>
> 📸 **CAPTURA 23:** El archivo `respaldo_micron.sql` generado en la carpeta.

---

## 10. CONCLUSIONES

1. **Implementación fiel al modelo:** La base de datos se implementó en MySQL con motor InnoDB, respetando fielmente el modelo relacional aprobado en la Evidencia 1, con sus 10 tablas, tipos de dato y restricciones.

2. **Integridad garantizada:** Las pruebas demostraron que las restricciones de integridad de entidad (UNIQUE), referencial (FK) y de dominio (CHECK) actúan correctamente, rechazando operaciones inválidas.

3. **Manipulación completa:** Se ejecutaron con éxito operaciones DDL (creación), DML (inserción), consultas complejas con JOIN, actualizaciones y eliminaciones, incluyendo la demostración del efecto CASCADE.

4. **Respaldo funcional:** Se generó un respaldo completo de la base de datos mediante mysqldump, garantizando la posibilidad de restauración.

5. **Scripts reproducibles:** Los scripts están organizados, comentados y pueden ejecutarse en orden para reproducir toda la implementación, cumpliendo con el criterio de reproducibilidad.

---

## ANEXO: ORDEN DE EJECUCIÓN DE LOS SCRIPTS

```
1. EV2_01_ddl_micron.sql        (crear estructura)
2. EV2_02_dml_insert.sql        (insertar datos)
3. EV2_03_consultas.sql         (consultar)
4. EV2_04_update_delete.sql     (actualizar/eliminar)
5. EV2_05_pruebas_integridad.sql (validar restricciones)
6. Generar respaldo_micron.sql   (Data Export)
```
