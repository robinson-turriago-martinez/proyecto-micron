-- ============================================================
-- EVIDENCIA 2 - IMPLEMENTACIÓN DE BASE DE DATOS
-- GA6-220501096-AA2-EV01
-- Proyecto: Micron - Sistema de Reporte de Microbasureros
-- Motor: MySQL (InnoDB)
-- Herramienta: MySQL Workbench
-- ARCHIVO 1 de 5: DDL (Creación de estructura)
-- ============================================================

-- ------------------------------------------------------------
-- 1. CREACIÓN DE LA BASE DE DATOS
-- ------------------------------------------------------------
DROP DATABASE IF EXISTS micron;
CREATE DATABASE micron
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE micron;

-- ------------------------------------------------------------
-- 2. TABLA: rol
-- ------------------------------------------------------------
CREATE TABLE rol (
    id_rol        INT             NOT NULL AUTO_INCREMENT,
    nombre_rol    VARCHAR(30)     NOT NULL,
    descripcion   VARCHAR(200),
    PRIMARY KEY (id_rol),
    UNIQUE KEY uq_rol_nombre (nombre_rol),
    CONSTRAINT chk_rol_nombre CHECK (nombre_rol IN ('Ciudadano','Operario','Supervisor','Administrador'))
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 3. TABLA: zona
-- ------------------------------------------------------------
CREATE TABLE zona (
    id_zona       INT             NOT NULL AUTO_INCREMENT,
    nombre_zona   VARCHAR(100)    NOT NULL,
    descripcion   VARCHAR(200),
    PRIMARY KEY (id_zona)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 4. TABLA: tipo_residuo
-- ------------------------------------------------------------
CREATE TABLE tipo_residuo (
    id_tipo_residuo INT           NOT NULL AUTO_INCREMENT,
    nombre          VARCHAR(50)   NOT NULL,
    descripcion     VARCHAR(200),
    PRIMARY KEY (id_tipo_residuo),
    UNIQUE KEY uq_tipo_nombre (nombre)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 5. TABLA: usuario
-- ------------------------------------------------------------
CREATE TABLE usuario (
    id_usuario      INT             NOT NULL AUTO_INCREMENT,
    nombres         VARCHAR(100)    NOT NULL,
    apellidos       VARCHAR(100)    NOT NULL,
    cedula          VARCHAR(20)     NOT NULL,
    correo          VARCHAR(150)    NOT NULL,
    contrasena      VARCHAR(255)    NOT NULL,
    telefono        VARCHAR(20),
    fecha_registro  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_rol          INT             NOT NULL,
    id_zona         INT             NULL,
    estado          VARCHAR(20)     NOT NULL DEFAULT 'Pendiente',
    PRIMARY KEY (id_usuario),
    UNIQUE KEY uq_usuario_cedula (cedula),
    UNIQUE KEY uq_usuario_correo (correo),
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_usuario_zona FOREIGN KEY (id_zona) REFERENCES zona(id_zona)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT chk_usuario_estado CHECK (estado IN ('Activo','Inactivo','Pendiente'))
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 6. TABLA: ubicacion
-- ------------------------------------------------------------
CREATE TABLE ubicacion (
    id_ubicacion  INT               NOT NULL AUTO_INCREMENT,
    direccion     VARCHAR(200)      NOT NULL,
    barrio        VARCHAR(100)      NOT NULL,
    latitud       DECIMAL(10,7)     NOT NULL,
    longitud      DECIMAL(10,7)     NOT NULL,
    id_zona       INT               NOT NULL,
    PRIMARY KEY (id_ubicacion),
    CONSTRAINT fk_ubicacion_zona FOREIGN KEY (id_zona) REFERENCES zona(id_zona)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_latitud CHECK (latitud BETWEEN -90 AND 90),
    CONSTRAINT chk_longitud CHECK (longitud BETWEEN -180 AND 180)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 7. TABLA: reporte
-- ------------------------------------------------------------
CREATE TABLE reporte (
    id_reporte           INT            NOT NULL AUTO_INCREMENT,
    fecha_creacion       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descripcion          TEXT           NOT NULL,
    estado               VARCHAR(20)    NOT NULL DEFAULT 'Nuevo',
    prioridad            VARCHAR(10)    NOT NULL DEFAULT 'Media',
    nivel_afectacion     VARCHAR(10)    NULL,
    fecha_actualizacion  DATETIME       NULL,
    id_usuario           INT            NOT NULL,
    id_ubicacion         INT            NOT NULL,
    id_tipo_residuo      INT            NOT NULL,
    PRIMARY KEY (id_reporte),
    UNIQUE KEY uq_reporte_ubicacion (id_ubicacion),
    CONSTRAINT fk_reporte_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_reporte_ubicacion FOREIGN KEY (id_ubicacion) REFERENCES ubicacion(id_ubicacion)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_reporte_tipo FOREIGN KEY (id_tipo_residuo) REFERENCES tipo_residuo(id_tipo_residuo)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT chk_reporte_estado CHECK (estado IN ('Nuevo','Asignado','En proceso','Resuelto','No procede')),
    CONSTRAINT chk_reporte_prioridad CHECK (prioridad IN ('Alta','Media','Baja')),
    CONSTRAINT chk_reporte_nivel CHECK (nivel_afectacion IN ('Alto','Medio','Bajo'))
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 8. TABLA: evidencia
-- ------------------------------------------------------------
CREATE TABLE evidencia (
    id_evidencia   INT             NOT NULL AUTO_INCREMENT,
    tipo_archivo   VARCHAR(20)     NOT NULL,
    url_archivo    VARCHAR(500)    NOT NULL,
    fecha_carga    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_reporte     INT             NOT NULL,
    PRIMARY KEY (id_evidencia),
    CONSTRAINT fk_evidencia_reporte FOREIGN KEY (id_reporte) REFERENCES reporte(id_reporte)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 9. TABLA: asignacion
-- ------------------------------------------------------------
CREATE TABLE asignacion (
    id_asignacion     INT           NOT NULL AUTO_INCREMENT,
    fecha_asignacion  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    comentario        TEXT,
    id_reporte        INT           NOT NULL,
    id_operario       INT           NOT NULL,
    id_supervisor     INT           NULL,
    PRIMARY KEY (id_asignacion),
    CONSTRAINT fk_asignacion_reporte FOREIGN KEY (id_reporte) REFERENCES reporte(id_reporte)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_asignacion_operario FOREIGN KEY (id_operario) REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_asignacion_supervisor FOREIGN KEY (id_supervisor) REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 10. TABLA: seguimiento
-- ------------------------------------------------------------
CREATE TABLE seguimiento (
    id_seguimiento   INT           NOT NULL AUTO_INCREMENT,
    fecha            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado_anterior  VARCHAR(20),
    estado_nuevo     VARCHAR(20)   NOT NULL,
    comentario       TEXT,
    id_reporte       INT           NOT NULL,
    id_usuario       INT           NOT NULL,
    PRIMARY KEY (id_seguimiento),
    CONSTRAINT fk_seguimiento_reporte FOREIGN KEY (id_reporte) REFERENCES reporte(id_reporte)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_seguimiento_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 11. TABLA: notificacion
-- ------------------------------------------------------------
CREATE TABLE notificacion (
    id_notificacion  INT           NOT NULL AUTO_INCREMENT,
    mensaje          VARCHAR(300)  NOT NULL,
    fecha_envio      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    leida            TINYINT(1)    NOT NULL DEFAULT 0,
    id_usuario       INT           NOT NULL,
    id_reporte       INT           NULL,
    PRIMARY KEY (id_notificacion),
    CONSTRAINT fk_notificacion_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_notificacion_reporte FOREIGN KEY (id_reporte) REFERENCES reporte(id_reporte)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 12. ÍNDICES PARA RENDIMIENTO
-- ------------------------------------------------------------
CREATE INDEX idx_usuario_rol ON usuario(id_rol);
CREATE INDEX idx_usuario_zona ON usuario(id_zona);
CREATE INDEX idx_reporte_estado ON reporte(estado);
CREATE INDEX idx_reporte_usuario ON reporte(id_usuario);
CREATE INDEX idx_reporte_tipo ON reporte(id_tipo_residuo);
CREATE INDEX idx_ubicacion_zona ON ubicacion(id_zona);
CREATE INDEX idx_evidencia_reporte ON evidencia(id_reporte);
CREATE INDEX idx_asignacion_operario ON asignacion(id_operario);
CREATE INDEX idx_seguimiento_reporte ON seguimiento(id_reporte);
CREATE INDEX idx_notificacion_usuario ON notificacion(id_usuario);

-- ------------------------------------------------------------
-- 13. VERIFICAR LA ESTRUCTURA CREADA
-- ------------------------------------------------------------
SHOW TABLES;
-- DESCRIBE usuario;   -- Para ver la estructura de cada tabla
