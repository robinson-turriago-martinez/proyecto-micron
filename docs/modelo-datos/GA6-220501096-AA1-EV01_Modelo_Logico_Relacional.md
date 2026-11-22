# MODELO LÓGICO Y RELACIONAL DE LA BASE DE DATOS

## GA6-220501096-AA1-EV01

### Documento de Sustentación

---

**Aprendiz:** Robinson Turriago  
**Programa de formación:** Análisis y Desarrollo de Software  
**Competencia:** 220501096  
**RAP:** 220501096-02  
**Instructor:** Jorge David Ortiz Rojas  
**Centro de formación:** SENA - Centro Agroindustrial, Regional Quindío  
**Proyecto:** Micron - Sistema Ciudadano de Reporte de Microbasureros Urbanos  
**Fecha:** Septiembre 2026

---

## TABLA DE CONTENIDO

1. Introducción
2. Identificación de entidades
3. Descripción de entidades y atributos
4. Claves primarias y foráneas
5. Relaciones y cardinalidades
6. Reglas de integridad
7. Normalización (hasta 3FN)
8. Modelo entidad-relación conceptual
9. Modelo relacional
10. Matriz de trazabilidad
11. Conclusiones

---

## 1. INTRODUCCIÓN

El presente documento describe el modelo lógico y relacional de la base de datos del sistema **Micron**, una plataforma ciudadana para el reporte y gestión de microbasureros urbanos. El modelo se construye a partir de los requerimientos funcionales y los modelos de dominio definidos en las fases anteriores del proyecto.

El objetivo es representar de forma coherente y normalizada toda la información que el sistema necesita almacenar, garantizando la integridad de los datos, eliminando redundancias y asegurando que cada requerimiento funcional tenga su respaldo en la estructura de datos.

El modelo se compone de **10 entidades** que cubren los 12 requisitos funcionales del sistema, normalizadas hasta la Tercera Forma Normal (3FN).

---

## 2. IDENTIFICACIÓN DE ENTIDADES

A partir de los requerimientos y el modelo de dominio, se identificaron las siguientes entidades:

| # | Entidad | Origen (requerimiento) | Descripción |
|---|---------|------------------------|-------------|
| 1 | ROL | RF.001, RF.002 | Perfiles de usuario del sistema |
| 2 | USUARIO | RF.001, RF.002 | Personas registradas (ciudadanos, operarios, supervisores, administradores) |
| 3 | ZONA | RF.011 | Zonas geográficas del municipio |
| 4 | TIPO_RESIDUO | RF.012 | Categorías de residuos |
| 5 | UBICACION | RF.003, RF.006 | Localización geográfica de los reportes |
| 6 | REPORTE | RF.003, RF.004, RF.005 | Reportes de microbasureros |
| 7 | EVIDENCIA | RF.003, RF.004 | Archivos multimedia asociados a reportes |
| 8 | ASIGNACION | RF.007 | Asignación de reportes a operarios |
| 9 | SEGUIMIENTO | RF.004 | Historial de cambios de estado de un reporte |
| 10 | NOTIFICACION | RF.008, RF.009 | Avisos a usuarios sobre eventos del sistema |

---

## 3. DESCRIPCIÓN DE ENTIDADES Y ATRIBUTOS

### 3.1 ROL

| Atributo | Tipo de dato | Descripción |
|----------|-------------|-------------|
| id_rol | INT (PK) | Identificador único del rol |
| nombre_rol | VARCHAR(30) | Nombre: Ciudadano, Operario, Supervisor, Administrador |
| descripcion | VARCHAR(200) | Descripción de las funciones del rol |

### 3.2 USUARIO

| Atributo | Tipo de dato | Descripción |
|----------|-------------|-------------|
| id_usuario | INT (PK) | Identificador único del usuario |
| nombres | VARCHAR(100) | Nombres del usuario |
| apellidos | VARCHAR(100) | Apellidos del usuario |
| cedula | VARCHAR(20) | Documento de identidad (único) |
| correo | VARCHAR(150) | Correo electrónico (único, login) |
| contrasena | VARCHAR(255) | Contraseña cifrada con bcrypt |
| telefono | VARCHAR(20) | Número de contacto |
| fecha_registro | TIMESTAMP | Fecha de creación de la cuenta |
| id_rol | INT (FK) | Rol asignado |
| id_zona | INT (FK) | Zona asignada (aplica a operarios) |
| estado | VARCHAR(20) | Activo, Inactivo, Pendiente |

### 3.3 ZONA

| Atributo | Tipo de dato | Descripción |
|----------|-------------|-------------|
| id_zona | INT (PK) | Identificador único de la zona |
| nombre_zona | VARCHAR(100) | Nombre de la zona geográfica |
| descripcion | VARCHAR(200) | Descripción de la zona |

### 3.4 TIPO_RESIDUO

| Atributo | Tipo de dato | Descripción |
|----------|-------------|-------------|
| id_tipo_residuo | INT (PK) | Identificador único |
| nombre | VARCHAR(50) | Plástico, Orgánico, Escombros, Mixto, Peligroso |
| descripcion | VARCHAR(200) | Descripción de la categoría |

### 3.5 UBICACION

| Atributo | Tipo de dato | Descripción |
|----------|-------------|-------------|
| id_ubicacion | INT (PK) | Identificador único |
| direccion | VARCHAR(200) | Dirección textual |
| barrio | VARCHAR(100) | Barrio donde se ubica |
| latitud | DECIMAL(10,7) | Coordenada GPS de latitud |
| longitud | DECIMAL(10,7) | Coordenada GPS de longitud |
| id_zona | INT (FK) | Zona a la que pertenece |

### 3.6 REPORTE

| Atributo | Tipo de dato | Descripción |
|----------|-------------|-------------|
| id_reporte | INT (PK) | Identificador único del reporte |
| fecha_creacion | TIMESTAMP | Fecha de creación |
| descripcion | TEXT | Descripción del microbasurero |
| estado | VARCHAR(20) | Nuevo, Asignado, En proceso, Resuelto, No procede |
| prioridad | VARCHAR(10) | Alta, Media, Baja |
| nivel_afectacion | VARCHAR(10) | Alto, Medio, Bajo |
| fecha_actualizacion | TIMESTAMP | Última modificación |
| id_usuario | INT (FK) | Ciudadano que reporta |
| id_ubicacion | INT (FK) | Ubicación asociada (única) |
| id_tipo_residuo | INT (FK) | Tipo de residuo |

### 3.7 EVIDENCIA

| Atributo | Tipo de dato | Descripción |
|----------|-------------|-------------|
| id_evidencia | INT (PK) | Identificador único |
| tipo_archivo | VARCHAR(20) | Tipo MIME del archivo |
| url_archivo | VARCHAR(500) | Ruta de almacenamiento |
| fecha_carga | TIMESTAMP | Fecha de carga |
| id_reporte | INT (FK) | Reporte asociado |

### 3.8 ASIGNACION

| Atributo | Tipo de dato | Descripción |
|----------|-------------|-------------|
| id_asignacion | INT (PK) | Identificador único |
| fecha_asignacion | TIMESTAMP | Fecha de asignación |
| comentario | TEXT | Observaciones de la asignación |
| id_reporte | INT (FK) | Reporte asignado |
| id_operario | INT (FK) | Operario asignado |
| id_supervisor | INT (FK) | Supervisor que asigna |

### 3.9 SEGUIMIENTO

| Atributo | Tipo de dato | Descripción |
|----------|-------------|-------------|
| id_seguimiento | INT (PK) | Identificador único |
| fecha | TIMESTAMP | Fecha del cambio |
| estado_anterior | VARCHAR(20) | Estado previo |
| estado_nuevo | VARCHAR(20) | Estado nuevo |
| comentario | TEXT | Observaciones del cambio |
| id_reporte | INT (FK) | Reporte afectado |
| id_usuario | INT (FK) | Usuario que realizó el cambio |

### 3.10 NOTIFICACION

| Atributo | Tipo de dato | Descripción |
|----------|-------------|-------------|
| id_notificacion | INT (PK) | Identificador único |
| mensaje | VARCHAR(300) | Texto de la notificación |
| fecha_envio | TIMESTAMP | Fecha de envío |
| leida | BOOLEAN | Indicador de lectura |
| id_usuario | INT (FK) | Destinatario |
| id_reporte | INT (FK) | Reporte relacionado |

---

## 4. CLAVES PRIMARIAS Y FORÁNEAS

### Claves primarias (PK)

| Entidad | Clave primaria |
|---------|----------------|
| ROL | id_rol |
| USUARIO | id_usuario |
| ZONA | id_zona |
| TIPO_RESIDUO | id_tipo_residuo |
| UBICACION | id_ubicacion |
| REPORTE | id_reporte |
| EVIDENCIA | id_evidencia |
| ASIGNACION | id_asignacion |
| SEGUIMIENTO | id_seguimiento |
| NOTIFICACION | id_notificacion |

### Claves foráneas (FK)

| Entidad | Clave foránea | Referencia |
|---------|---------------|------------|
| USUARIO | id_rol | ROL(id_rol) |
| USUARIO | id_zona | ZONA(id_zona) |
| UBICACION | id_zona | ZONA(id_zona) |
| REPORTE | id_usuario | USUARIO(id_usuario) |
| REPORTE | id_ubicacion | UBICACION(id_ubicacion) |
| REPORTE | id_tipo_residuo | TIPO_RESIDUO(id_tipo_residuo) |
| EVIDENCIA | id_reporte | REPORTE(id_reporte) |
| ASIGNACION | id_reporte | REPORTE(id_reporte) |
| ASIGNACION | id_operario | USUARIO(id_usuario) |
| ASIGNACION | id_supervisor | USUARIO(id_usuario) |
| SEGUIMIENTO | id_reporte | REPORTE(id_reporte) |
| SEGUIMIENTO | id_usuario | USUARIO(id_usuario) |
| NOTIFICACION | id_usuario | USUARIO(id_usuario) |
| NOTIFICACION | id_reporte | REPORTE(id_reporte) |

---

## 5. RELACIONES Y CARDINALIDADES

| Relación | Entidades | Cardinalidad | Descripción |
|----------|-----------|--------------|-------------|
| tiene | ROL → USUARIO | 1:N | Un rol lo tienen muchos usuarios |
| asignado a | ZONA → USUARIO | 1:N | Una zona tiene muchos operarios |
| contiene | ZONA → UBICACION | 1:N | Una zona contiene muchas ubicaciones |
| crea | USUARIO → REPORTE | 1:N | Un ciudadano crea muchos reportes |
| localiza | UBICACION → REPORTE | 1:1 | Cada reporte tiene una ubicación única |
| clasifica | TIPO_RESIDUO → REPORTE | 1:N | Un tipo clasifica muchos reportes |
| tiene | REPORTE → EVIDENCIA | 1:N | Un reporte tiene muchas evidencias |
| recibe | REPORTE → ASIGNACION | 1:N | Un reporte puede tener asignaciones |
| atiende | USUARIO → ASIGNACION | 1:N | Un operario atiende muchas asignaciones |
| registra | REPORTE → SEGUIMIENTO | 1:N | Un reporte tiene muchos seguimientos |
| realiza | USUARIO → SEGUIMIENTO | 1:N | Un usuario realiza muchos seguimientos |
| recibe | USUARIO → NOTIFICACION | 1:N | Un usuario recibe muchas notificaciones |
| genera | REPORTE → NOTIFICACION | 1:N | Un reporte genera notificaciones |

---

## 6. REGLAS DE INTEGRIDAD

### 6.1 Integridad de entidad

- Toda entidad tiene una clave primaria autoincremental única y no nula.
- No se permiten valores nulos en las claves primarias.

### 6.2 Integridad referencial

- Toda clave foránea debe referenciar un valor existente en la tabla relacionada.
- **ON DELETE RESTRICT:** No se puede eliminar un usuario, zona o tipo de residuo si tiene reportes asociados.
- **ON DELETE CASCADE:** Al eliminar un reporte, se eliminan sus evidencias, seguimientos y asignaciones asociadas.
- **ON UPDATE CASCADE:** Si cambia una clave primaria referenciada, se actualizan las claves foráneas.

### 6.3 Integridad de dominio

| Campo | Restricción |
|-------|-------------|
| usuario.estado | CHECK IN ('Activo', 'Inactivo', 'Pendiente') |
| usuario.correo | UNIQUE + formato de correo válido |
| usuario.cedula | UNIQUE |
| reporte.estado | CHECK IN ('Nuevo', 'Asignado', 'En proceso', 'Resuelto', 'No procede') |
| reporte.prioridad | CHECK IN ('Alta', 'Media', 'Baja') |
| reporte.nivel_afectacion | CHECK IN ('Alto', 'Medio', 'Bajo') |
| ubicacion.latitud | DECIMAL entre -90 y 90 |
| ubicacion.longitud | DECIMAL entre -180 y 180 |
| notificacion.leida | BOOLEAN (true/false) |

---

## 7. NORMALIZACIÓN (HASTA 3FN)

### 7.1 Primera Forma Normal (1FN)

✅ **Cumplida.** Todos los atributos son atómicos (indivisibles) y cada tabla tiene clave primaria.

- **Decisión:** Se separó el "tipo de residuo" y la "zona" en tablas independientes, en lugar de guardarlos como texto repetido en REPORTE. Esto elimina valores multivaluados y repetición.

### 7.2 Segunda Forma Normal (2FN)

✅ **Cumplida.** Todas las tablas tienen clave primaria simple (no compuesta), por lo que no existen dependencias parciales. Todos los atributos no clave dependen completamente de la clave primaria.

- **Decisión:** La entidad ASIGNACION se creó como tabla independiente en lugar de añadir campos de operario directamente en REPORTE, evitando que atributos de la asignación dependan parcialmente del reporte.

### 7.3 Tercera Forma Normal (3FN)

✅ **Cumplida.** No existen dependencias transitivas (ningún atributo no clave depende de otro atributo no clave).

- **Decisión clave 1:** El ROL se extrajo a una tabla propia. Antes, el rol era un texto en USUARIO; ahora, al tener id_rol como FK, se evita que la "descripción del rol" dependa transitivamente del usuario.
- **Decisión clave 2:** La ZONA se separó porque la descripción de la zona no debe depender del usuario ni de la ubicación, sino de la zona misma.
- **Decisión clave 3:** El TIPO_RESIDUO se separó para que su descripción no se repita en cada reporte.
- **Decisión clave 4:** El SEGUIMIENTO se extrajo como tabla independiente para registrar el historial de cambios sin duplicar información en REPORTE.

### 7.4 Resumen de normalización

| Forma Normal | Estado | Justificación principal |
|--------------|--------|------------------------|
| 1FN | ✅ Cumple | Atributos atómicos, PK definidas |
| 2FN | ✅ Cumple | PK simples, sin dependencias parciales |
| 3FN | ✅ Cumple | Separación de ROL, ZONA, TIPO_RESIDUO y SEGUIMIENTO elimina dependencias transitivas |

---

## 8. MODELO ENTIDAD-RELACIÓN CONCEPTUAL

*(Ver imagen: modelo_ER_relacional_micron.html)*

El modelo conceptual presenta las 10 entidades con sus relaciones y cardinalidades, mostrando cómo se conectan los usuarios, reportes, ubicaciones, evidencias y el flujo de gestión (asignación, seguimiento, notificación).

---

## 9. MODELO RELACIONAL

*(Ver imagen: modelo_ER_relacional_micron.html — incluye atributos con PK/FK)*

El modelo relacional resultante se expresa a continuación en notación textual:

```
ROL (id_rol, nombre_rol, descripcion)
ZONA (id_zona, nombre_zona, descripcion)
TIPO_RESIDUO (id_tipo_residuo, nombre, descripcion)
USUARIO (id_usuario, nombres, apellidos, cedula, correo, contrasena, 
         telefono, fecha_registro, id_rol*, id_zona*, estado)
UBICACION (id_ubicacion, direccion, barrio, latitud, longitud, id_zona*)
REPORTE (id_reporte, fecha_creacion, descripcion, estado, prioridad, 
         nivel_afectacion, fecha_actualizacion, id_usuario*, 
         id_ubicacion*, id_tipo_residuo*)
EVIDENCIA (id_evidencia, tipo_archivo, url_archivo, fecha_carga, id_reporte*)
ASIGNACION (id_asignacion, fecha_asignacion, comentario, id_reporte*, 
            id_operario*, id_supervisor*)
SEGUIMIENTO (id_seguimiento, fecha, estado_anterior, estado_nuevo, 
             comentario, id_reporte*, id_usuario*)
NOTIFICACION (id_notificacion, mensaje, fecha_envio, leida, 
              id_usuario*, id_reporte*)

Nota: Subrayado = PK, * = FK
```

El modelo editable completo está disponible en el archivo `modelo_micron.dbml` para importar en dbdiagram.io. La implementación física del modelo se realizará en MySQL (motor InnoDB) en la Evidencia 2.

---

## 10. MATRIZ DE TRAZABILIDAD REQUERIMIENTO - ESTRUCTURA DE DATOS

| Requisito | Descripción | Entidades que lo soportan | Atributos clave |
|-----------|-------------|---------------------------|-----------------|
| RF.001 | Registro y autenticación | USUARIO, ROL | correo, contrasena, cedula, id_rol |
| RF.002 | Gestión de usuarios | USUARIO, ROL | id_usuario, id_rol, estado |
| RF.003 | Registro de reporte | REPORTE, UBICACION, EVIDENCIA, TIPO_RESIDUO | descripcion, latitud, longitud, url_archivo |
| RF.004 | Gestión de reportes | REPORTE, SEGUIMIENTO, EVIDENCIA | estado, fecha_actualizacion, estado_nuevo |
| RF.005 | Historial de reportes | REPORTE, SEGUIMIENTO | fecha_creacion, estado, fecha |
| RF.006 | Mapa de microbasureros | UBICACION, REPORTE, ZONA | latitud, longitud, estado, id_zona |
| RF.007 | Asignación de reportes | ASIGNACION, USUARIO, ZONA | id_operario, id_supervisor, id_zona |
| RF.008 | Notificaciones a ciudadanos | NOTIFICACION, USUARIO | mensaje, id_usuario, leida |
| RF.009 | Notificación a operarios | NOTIFICACION, USUARIO | mensaje, id_usuario, id_reporte |
| RF.010 | Dashboard de supervisión | REPORTE, ZONA, ASIGNACION | estado, prioridad, id_zona |
| RF.011 | Configuración de zonas | ZONA, USUARIO | nombre_zona, id_zona |
| RF.012 | Clasificación de residuos | TIPO_RESIDUO, REPORTE | nombre, id_tipo_residuo |

---

## 11. CONCLUSIONES

1. **Modelo completo y trazable:** El modelo de 10 entidades cubre la totalidad de los 12 requisitos funcionales del sistema, garantizando que toda la información necesaria tiene su respaldo en la estructura de datos, como lo evidencia la matriz de trazabilidad.

2. **Normalización rigurosa:** La aplicación de la Tercera Forma Normal, mediante la separación de ROL, ZONA, TIPO_RESIDUO y SEGUIMIENTO, elimina redundancias y dependencias transitivas, mejorando la integridad y mantenibilidad de la base de datos.

3. **Integridad garantizada:** Las reglas de integridad de entidad, referencial y de dominio aseguran que los datos sean consistentes, válidos y confiables a lo largo del tiempo.

4. **Coherencia entre modelos:** El modelo entidad-relación conceptual y el modelo relacional son consistentes entre sí, representando las mismas entidades, relaciones y cardinalidades.

5. **Base sólida para implementación:** Este modelo constituye la base directa para la creación física de la base de datos (script SQL) y el desarrollo de la aplicación, cumpliendo con los estándares de calidad de diseño de bases de datos.

---

## REFERENCIAS

Date, C. J. (2004). *Introducción a los Sistemas de Bases de Datos* (7ma ed.). Pearson Educación.

Elmasri, R., & Navathe, S. (2016). *Fundamentos de Sistemas de Bases de Datos* (7ma ed.). Pearson.

Silberschatz, A., Korth, H., & Sudarshan, S. (2019). *Database System Concepts* (7th ed.). McGraw-Hill.
