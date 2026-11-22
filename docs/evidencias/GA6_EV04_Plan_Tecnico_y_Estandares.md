# PLAN TÉCNICO Y ESTÁNDARES DE CONSTRUCCIÓN

## Proyecto Micron — Sistema Ciudadano de Reporte de Microbasureros Urbanos

---

**Aprendiz:** Robinson Turriago  
**Programa de formación:** Análisis y Desarrollo de Software  
**Competencia:** 220501096  
**Instructor:** Jorge David Ortiz Rojas  
**Centro de formación:** SENA - Centro Agroindustrial, Regional Quindío  
**Fecha:** Octubre 2026

---

# 1. INTRODUCCIÓN Y ALCANCE

Este documento define el plan técnico y los estándares de construcción del sistema **Micron**, sobre el cual se codificarán los módulos. Su propósito es establecer una base común y clara para que el desarrollo del frontend y el backend se realice de forma ordenada, consistente, segura y mantenible.

El alcance cubre: la estructura técnica y la organización de carpetas del frontend y del backend, las convenciones de nomenclatura, los estándares de codificación y el procedimiento de revisión de código, la estrategia de ramas y la convención de commits, el backlog priorizado y los riesgos técnicos con sus medidas de mitigación.

## 1.1 Contexto del proyecto

Micron es un sistema web que permite a los ciudadanos reportar microbasureros (acumulaciones ilegales de residuos) en espacios públicos, y a los funcionarios (operarios, supervisores y administradores) gestionar dichos reportes. Lo usan cuatro perfiles: ciudadanos (reportan), operarios (atienden), supervisores (monitorean y asignan) y administradores (gestionan usuarios y configuración).

El sistema **NO** gestiona la recolección física de residuos ni el pago de servicios de aseo; tampoco realiza rutas logísticas automáticas de los camiones. Su foco es la comunicación ciudadano-institución y la trazabilidad de los reportes.

## 1.2 Requerimientos funcionales considerados

| ID | Requerimiento funcional | Descripción | Tablas involucradas |
|----|------------------------|-------------|---------------------|
| RF-01 | Registro y autenticación | Permite a los usuarios registrarse e iniciar sesión en el sistema | usuario, rol |
| RF-02 | Gestión de usuarios | El administrador crea, edita, elimina usuarios y asigna roles | usuario, rol |
| RF-03 | Registro de reporte | El ciudadano crea un reporte con descripción, tipo, ubicación y evidencia | reporte, ubicacion, evidencia, tipo_residuo |
| RF-04 | Gestión de reportes | El operario cambia el estado del reporte y registra seguimiento | reporte, seguimiento, asignacion |
| RF-05 | Mapa de microbasureros | Visualiza todos los reportes georreferenciados con filtros | reporte, ubicacion, zona |

## 1.3 Reglas de negocio con impacto técnico

- **Regla 1:** Un reporte en estado "Resuelto" o "No procede" no puede ser editado ni cambiar de estado.
- **Regla 2:** La cédula y el correo de un usuario son únicos; no pueden existir dos usuarios con el mismo valor.
- **Regla 3:** Un reporte solo puede ser asignado a un operario cuyo rol sea "Operario".
- **Regla 4:** Las coordenadas de una ubicación deben ser válidas: latitud entre -90 y 90, longitud entre -180 y 180.
- **Regla 5:** Todo cambio de estado de un reporte debe quedar registrado en el historial de seguimiento, indicando quién lo hizo y cuándo.

---

# 2. ESTRUCTURA TÉCNICA DEL PROYECTO

## 2.1 Arquitectura general

El sistema se organiza en tres capas que se comunican de forma unidireccional. El **frontend (React)** corre en el navegador y nunca accede directamente a la base de datos: toda comunicación pasa por el **backend (Node.js + Express)** mediante una API REST con formato JSON sobre HTTPS. El backend es el único que accede a **MySQL** usando un pool de conexiones.

```
┌─────────────────────────────────────────────┐
│  CLIENTE — React + Vite                      │
│  Componentes · Hooks · Rutas                 │
└──────────────────┬──────────────────────────┘
                   │  HTTPS / JSON (API REST)
┌──────────────────▼──────────────────────────┐
│  SERVIDOR — Node.js + Express                │
│  routes → middlewares → controller →         │
│           service → repository               │
└──────────────────┬──────────────────────────┘
                   │  mysql2/promise
┌──────────────────▼──────────────────────────┐
│  DATOS — MySQL (InnoDB, utf8mb4)             │
└──────────────────────────────────────────────┘
```

### Responsabilidad de cada capa del backend

| Capa | Qué hace | Qué tiene prohibido hacer |
|------|----------|---------------------------|
| Routes | Declara rutas, método HTTP y middlewares aplicados | Contener lógica o acceder a datos |
| Middlewares | Autenticación, autorización, validación de entrada, manejo de errores | Consultar reglas de negocio |
| Controller | Leer la petición, invocar el servicio y construir la respuesta | Ejecutar SQL o calcular reglas |
| Service | Aplicar las reglas de negocio y coordinar transacciones | Conocer objetos req/res de Express |
| Repository | Ejecutar consultas SQL parametrizadas y devolver resultados | Decidir reglas o validar permisos |

## 2.2 Organización de carpetas del backend (Node.js)

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js        # conexión (pool) a MySQL
│   │   └── env.js             # lectura de variables de entorno
│   ├── modules/               # un módulo por tema del negocio
│   │   ├── auth/              # RF-01
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   └── auth.service.js
│   │   ├── usuarios/          # RF-02
│   │   │   ├── usuario.routes.js
│   │   │   ├── usuario.controller.js
│   │   │   ├── usuario.service.js
│   │   │   └── usuario.repository.js
│   │   ├── reportes/          # RF-03 y RF-04
│   │   │   ├── reporte.routes.js
│   │   │   ├── reporte.controller.js
│   │   │   ├── reporte.service.js
│   │   │   └── reporte.repository.js
│   │   └── mapa/              # RF-05
│   │       ├── mapa.routes.js
│   │       ├── mapa.controller.js
│   │       └── mapa.service.js
│   ├── shared/
│   │   └── errors/AppError.js
│   ├── app.js                 # configura Express
│   └── server.js              # levanta el servidor
├── tests/
├── .env.example
├── .eslintrc.json
├── .prettierrc
└── package.json
```

### Reglas de la estructura

- Cada carpeta bajo `src/modules/` representa un módulo del sistema y expone únicamente su archivo de rutas.
- El código compartido entre módulos vive en `src/shared/`; si algo se usa en un solo módulo, no se mueve allí.
- Ningún archivo fuera de `src/config/database.js` crea conexiones a MySQL.
- `src/app.js` configura Express y `src/server.js` lo levanta, para poder probar la aplicación sin abrir un puerto.

## 2.3 Organización de carpetas del frontend (React)

```
frontend/
├── src/
│   ├── api/
│   │   ├── httpClient.js      # configuración de axios
│   │   ├── usuario.api.js
│   │   └── reporte.api.js
│   ├── components/
│   │   ├── ui/                # piezas reutilizables
│   │   │   ├── Boton.jsx
│   │   │   ├── CampoTexto.jsx
│   │   │   └── Tabla.jsx
│   │   └── layout/
│   │       ├── BarraLateral.jsx
│   │       └── Encabezado.jsx
│   ├── features/              # una carpeta por tema del negocio
│   │   ├── auth/              # RF-01
│   │   ├── usuarios/          # RF-02
│   │   │   ├── components/UsuarioForm.jsx
│   │   │   ├── hooks/useUsuarios.js
│   │   │   └── pages/ListaUsuariosPage.jsx
│   │   ├── reportes/          # RF-03 y RF-04
│   │   └── mapa/              # RF-05
│   ├── context/AuthContext.jsx    # usuario en sesión
│   ├── routes/AppRouter.jsx       # todas las rutas en un solo lugar
│   ├── utils/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── .env.example
└── vite.config.js
```

- Un componente dentro de `features/` no se importa desde otra feature. Si se necesita en dos, se promueve a `components/ui/`.
- Ninguna página invoca axios directamente: siempre a través de `src/api/`.
- Las rutas se declaran en un único archivo, `src/routes/AppRouter.jsx`.

---

# 3. CONVENCIONES DE NOMENCLATURA

## 3.1 Archivos y carpetas

| Elemento | Convención | Ejemplo correcto | Ejemplo incorrecto |
|----------|-----------|------------------|--------------------|
| Carpeta | kebab-case, minúscula | `tipo-residuo/` | `TipoResiduo/` |
| Componente React | PascalCase + .jsx | `ReporteForm.jsx` | `reporteform.jsx` |
| Página React | PascalCase + Page.jsx | `ListaReportesPage.jsx` | `lista_reportes.jsx` |
| Hook de React | use + PascalCase + .js | `useReportes.js` | `reportesHook.js` |
| Archivo de backend | entidad.capa.js | `reporte.service.js` | `serviceReporte.js` |
| Archivo de utilidad | camelCase + .js | `formatearFecha.js` | `FormatearFecha.js` |
| Migración SQL | AAAAMMDDHHMM_accion.sql | `202610121030_crear_reportes.sql` | `tabla.sql` |
| Hoja de estilos | kebab-case + .css | `reporte-form.css` | `ReporteForm.CSS` |

## 3.2 Componentes, funciones y variables

| Elemento | Convención | Ejemplo correcto | Ejemplo incorrecto |
|----------|-----------|------------------|--------------------|
| Variable | camelCase, sustantivo | `totalReportes` | `TotalReportes / tr` |
| Constante global | UPPER_SNAKE_CASE | `ESTADO_RESUELTO` | `estadoResuelto` |
| Función | camelCase, verbo + sustantivo | `obtenerReportePorId()` | `reporte() / Obtener()` |
| Componente React | PascalCase, sustantivo | `ReporteForm` | `reporteForm` |
| Propiedad de componente | camelCase | `onGuardarReporte` | `OnGuardar / guardar_reporte` |
| Clase | PascalCase | `AppError` | `appError` |
| Booleano | es / tiene / puede + concepto | `esReporteResuelto` | `resuelto / flag` |
| Arreglo o lista | sustantivo en plural | `reportes` | `listaReporte / arrReporte` |

### Reglas semánticas de nombres

- Las funciones empiezan por verbo en infinitivo: obtener, crear, actualizar, calcular, validar.
- Las variables booleanas llevan prefijo es, tiene, puede o debe.
- Las colecciones van en plural y los elementos en singular.
- Se escribe el dominio en español y las palabras técnicas en inglés, sin mezclarlas dentro de un mismo identificador.
- Se prohíben abreviaturas no estandarizadas (usr, tmp1) y nombres de una sola letra fuera de índices de bucle.

## 3.3 Base de datos MySQL

| Elemento | Convención | Ejemplo correcto | Ejemplo incorrecto |
|----------|-----------|------------------|--------------------|
| Tabla | snake_case, plural (o singular consistente) | `reportes` / `reporte` | `Reportes` |
| Columna | snake_case, singular | `fecha_creacion` | `FechaCreacion` |
| Llave primaria | id | `id` | `idReporte / pk_reporte` |
| Llave foránea | entidad_id | `usuario_id` | `idUsuario / fkUsuario` |
| Índice | idx_tabla_columna | `idx_reportes_usuario_id` | `indice1` |
| Columna numérica exacta | DECIMAL(p,e) | `latitud DECIMAL(10,7)` | `latitud FLOAT` |
| Columna booleana | TINYINT(1) con prefijo es_ | `es_activo` | `activo INT` |
| Fechas de control | created_at / updated_at | `created_at DATETIME` | `fechaCreacion` |

### DDL real de una tabla principal (reporte)

`src/database/migrations/202610121030_crear_reportes.sql`

```sql
CREATE TABLE reportes (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  descripcion       TEXT          NOT NULL,
  estado            VARCHAR(20)   NOT NULL DEFAULT 'Nuevo',
  prioridad         VARCHAR(10)   NOT NULL DEFAULT 'Media',
  nivel_afectacion  VARCHAR(10),
  usuario_id        INT           NOT NULL,
  ubicacion_id      INT           NOT NULL UNIQUE,
  tipo_residuo_id   INT           NOT NULL,
  created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME,
  CONSTRAINT fk_reportes_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  CONSTRAINT fk_reportes_ubicacion
    FOREIGN KEY (ubicacion_id) REFERENCES ubicaciones(id),
  CONSTRAINT fk_reportes_tipo_residuo
    FOREIGN KEY (tipo_residuo_id) REFERENCES tipos_residuo(id),
  CONSTRAINT chk_reporte_estado
    CHECK (estado IN ('Nuevo','Asignado','En proceso','Resuelto','No procede'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_reportes_estado ON reportes(estado);
CREATE INDEX idx_reportes_usuario_id ON reportes(usuario_id);
```

## 3.4 Endpoints de la API REST

La API se versiona bajo el prefijo `/api/v1`. Los recursos se nombran con sustantivos en plural y kebab-case; las acciones que no son CRUD se expresan como subrecursos, nunca como verbos en la raíz.

| Método | Endpoint | Acción | Código de éxito |
|--------|----------|--------|-----------------|
| POST | /api/v1/auth/login | Iniciar sesión (RF-01) | 200 |
| POST | /api/v1/auth/registro | Registrar usuario (RF-01) | 201 |
| GET | /api/v1/usuarios | Listar usuarios con filtros (RF-02) | 200 |
| POST | /api/v1/usuarios | Crear usuario (RF-02) | 201 |
| PUT | /api/v1/usuarios/:id | Actualizar usuario (RF-02) | 200 |
| DELETE | /api/v1/usuarios/:id | Eliminar usuario (RF-02) | 204 |
| GET | /api/v1/reportes | Listar reportes con filtros (RF-04) | 200 |
| GET | /api/v1/reportes/:id | Consultar un reporte (RF-04) | 200 |
| POST | /api/v1/reportes | Crear reporte (RF-03) | 201 |
| PUT | /api/v1/reportes/:id | Actualizar reporte (RF-04) | 200 |
| POST | /api/v1/reportes/:id/seguimientos | Cambiar estado (acción no CRUD) (RF-04) | 201 |
| GET | /api/v1/mapa/reportes | Reportes georreferenciados (RF-05) | 200 |

Nombres rechazados: `/api/getReportes`, `/api/v1/Reporte/1`, `/api/v1/reportes/eliminar/1`. El verbo lo aporta el método HTTP, no la URL.

---

# 4. ESTÁNDARES DE CODIFICACIÓN

## 4.1 Formato del código

El formato no se discute en revisión: lo impone la herramienta. Se usa **Prettier** para el formato y **ESLint** para las reglas de calidad, con la misma configuración en frontend y backend.

| Regla | Valor | Motivo |
|-------|-------|--------|
| Indentación | 2 espacios, sin tabuladores | Consistencia entre editores y diffs legibles |
| Longitud máxima de línea | 100 caracteres | Permite revisión lado a lado |
| Comillas | Simples en JS, dobles en JSX | Convención dominante del ecosistema |
| Punto y coma | Obligatorio | Elimina ambigüedad de inserción automática |
| Coma final | Sí, en multilínea | Diffs más limpios al agregar elementos |
| Declaración de variables | const por defecto; let solo si se reasigna; var prohibido | Evita reasignaciones accidentales |
| Igualdad | === y !== siempre | Evita coerción implícita de tipos |
| Asincronía | async/await; callbacks anidados prohibidos | Legibilidad y manejo uniforme de errores |
| Codificación de archivos | UTF-8, fin de línea LF | Evita conflictos entre Windows y Linux |

### .prettierrc
```json
{
  "semi": true,
  "singleQuote": true,
  "jsxSingleQuote": false,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### .eslintrc.json (backend)
```json
{
  "env": { "node": true, "es2022": true },
  "extends": ["eslint:recommended"],
  "rules": {
    "no-unused-vars": "error",
    "eqeqeq": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

## 4.2 Comentarios y documentación en código

Un comentario explica **por qué** el código hace algo, no **qué** hace. Si el comentario describe literalmente la línea siguiente, se elimina el comentario y se mejora el nombre.

```javascript
// MAL: el comentario repite lo que ya dice el código
// suma 1 al contador
contador = contador + 1;

// BIEN: el comentario explica una decisión que el código no muestra
// Un reporte resuelto no se reabre: se fuerza el estado para auditoría
const estadoFinal = 'Resuelto';
```

### Documentación de una función con JSDoc
```javascript
/**
 * Cambia el estado de un reporte y registra el seguimiento.
 * @param {number} reporteId - Identificador del reporte.
 * @param {string} nuevoEstado - Estado destino validado.
 * @returns {Promise<object>} El reporte actualizado.
 */
function actualizarEstadoReporte(reporteId, nuevoEstado) {
  // ...
}
```

- Se prohíbe dejar código comentado en el repositorio: para eso existe el historial de Git.
- Las marcas `// TODO:` y `// FIXME:` deben incluir el identificador de la tarea del backlog, por ejemplo `// TODO (MIC-18): soportar paginación`.

## 4.3 Manejo de errores

El manejo de errores es centralizado: en lugar de que cada controlador arme su propia respuesta de error, se usa una clase de error propia y un único middleware que la traduce a respuesta HTTP.

### src/shared/errors/AppError.js
```javascript
// Error "esperado" de la aplicación: lo lanzamos nosotros a propósito
// cuando una regla de negocio no se cumple.
class AppError extends Error {
  constructor(mensaje, estadoHttp = 400) {
    super(mensaje);               // guarda el texto del error
    this.estadoHttp = estadoHttp; // ej. 400, 404, 409
  }
}

module.exports = AppError;
```

### Códigos de estado HTTP admitidos

| Código | Significado | Cuándo se usa en este proyecto |
|--------|-------------|--------------------------------|
| 200 | OK | Consulta o actualización exitosa que devuelve contenido |
| 201 | Created | Creación exitosa de un reporte o usuario |
| 204 | No Content | Eliminación de un usuario sin cuerpo de respuesta |
| 400 | Bad Request | Datos inválidos o regla de negocio incumplida (estado no permitido) |
| 401 | Unauthorized | Token ausente, inválido o expirado |
| 403 | Forbidden | Autenticado pero sin el rol requerido (ej. ciudadano intentando asignar) |
| 404 | Not Found | El reporte o usuario solicitado no existe |
| 409 | Conflict | Intento de registrar una cédula o correo que ya existe |
| 500 | Internal Server Error | Fallo no previsto; nunca se expone el stack al cliente |

### Manejo de errores en el frontend

```javascript
// src/api/httpClient.js
import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

export default httpClient;
```

## 4.4 Reglas de codificación propias del dominio

### Regla 1 — Un reporte resuelto no se puede modificar
Esta regla existe porque un reporte cerrado representa un hecho ya atendido; permitir su edición rompería la trazabilidad y la auditoría. Si se incumple, se perdería la confianza en el historial del sistema.

`src/modules/reportes/reporte.service.js`
```javascript
async function actualizarReporte(reporteId, datos) {
  const reporte = await reporteRepository.obtenerPorId(reporteId);
  if (!reporte) throw new AppError('Reporte no encontrado', 404);

  // Regla de negocio: un reporte resuelto o no procede queda bloqueado
  if (reporte.estado === 'Resuelto' || reporte.estado === 'No procede') {
    throw new AppError('No se puede modificar un reporte cerrado', 400);
  }
  return reporteRepository.actualizar(reporteId, datos);
}
```

### Regla 2 — La cédula y el correo de usuario son únicos
Evita cuentas duplicadas de una misma persona. Si se incumple, podrían crearse identidades duplicadas y romper la integridad.

`src/modules/usuarios/usuario.service.js`
```javascript
async function crearUsuario(datos) {
  const existe = await usuarioRepository.buscarPorCedulaOCorreo(
    datos.cedula,
    datos.correo
  );
  if (existe) {
    throw new AppError('La cédula o el correo ya están registrados', 409);
  }
  return usuarioRepository.crear(datos);
}
```

### Regla 3 — Las coordenadas deben estar en rango válido
Evita ubicaciones imposibles en el mapa. Si se incumple, los marcadores aparecerían fuera del planeta.

`src/modules/reportes/reporte.service.js`
```javascript
function validarCoordenadas(latitud, longitud) {
  const esLatitudValida = latitud >= -90 && latitud <= 90;
  const esLongitudValida = longitud >= -180 && longitud <= 180;
  if (!esLatitudValida || !esLongitudValida) {
    throw new AppError('Coordenadas geográficas inválidas', 400);
  }
}
```

## 4.5 Seguridad mínima exigida

| Control | Implementación obligatoria |
|---------|----------------------------|
| Consultas SQL | Siempre parametrizadas con marcadores `?`. Se prohíbe concatenar cadenas para construir SQL. |
| Contraseñas | Hash con bcrypt, factor de costo 10 o superior. Nunca en texto plano. |
| Autenticación | JWT firmado con secreto en variable de entorno, expiración máxima de 8 horas. |
| Autorización | Middleware `autorizar(...roles)` en toda ruta que modifique datos. |
| Validación de entrada | Validación por endpoint; se rechaza todo campo no declarado. |
| Cabeceras HTTP | helmet habilitado en Express y CORS restringido al origen del frontend. |
| Registro de auditoría | Todo cambio de estado de un reporte se registra en la tabla `seguimientos` con el usuario y la fecha. |

---

# 5. PROCEDIMIENTO DE REVISIÓN DE CÓDIGO

Ningún cambio llega a la rama de integración sin revisión de al menos una persona distinta de quien lo escribió. La revisión es sobre el código, no sobre la persona.

## 5.1 Flujo de la revisión

| N° | Etapa | Acción | Responsable |
|----|-------|--------|-------------|
| 1 | Preparación | El autor ejecuta lint, formato y pruebas en local antes de abrir el pull request | Autor |
| 2 | Apertura del PR | Se abre contra develop usando la plantilla, describiendo qué cambia, por qué y cómo probarlo | Autor |
| 3 | Verificación | Se ejecutan lint y pruebas sobre la rama; si fallan, el PR no se revisa | Automatizado |
| 4 | Revisión por pares | El revisor aplica la lista de verificación dentro de las 24 horas siguientes | Revisor |
| 5 | Corrección | El autor atiende cada comentario; responde o corrige, nunca lo deja sin respuesta | Autor |
| 6 | Integración | Con una aprobación y sin comentarios abiertos se integra y se elimina la rama | Revisor |

## 5.2 Plantilla de pull request

`.github/pull_request_template.md`
```markdown
## Descripción
Qué cambia y por qué. Enlazar la tarea del backlog: MIC-NN

## Tipo de cambio
- [ ] Nueva funcionalidad   - [ ] Corrección de defecto
- [ ] Refactorización       - [ ] Documentación

## Cómo se probó
Pasos concretos para reproducir la verificación.

## Lista de verificación del autor
- [ ] Cumple las convenciones de nomenclatura del plan técnico
- [ ] Sin código comentado ni console.log de depuración
- [ ] Errores manejados con AppError
- [ ] Consultas SQL parametrizadas
- [ ] Sin secretos ni credenciales en el código
```

## 5.3 Lista de verificación del revisor

| Dimensión | Qué verifica el revisor |
|-----------|-------------------------|
| Corrección funcional | El cambio hace lo que describe el PR y cubre los criterios de aceptación |
| Reglas de negocio | Las reglas de la sección 4.4 se cumplen en el código |
| Estructura | El archivo está en la carpeta correcta y respeta la separación de capas |
| Nomenclatura | Nombres conformes a la sección 3 |
| Manejo de errores | Errores lanzados como AppError; sin respuestas construidas a mano |
| Seguridad | SQL parametrizado, autorización aplicada, sin secretos expuestos |
| Legibilidad | Funciones cortas y con una sola responsabilidad; anidamiento máximo de tres niveles |
| Pruebas | Existen pruebas para la lógica nueva y al menos un caso de error |

## 5.4 Criterios de bloqueo

Un pull request se rechaza, sin negociación, si presenta cualquiera de estas condiciones:

- Credenciales, tokens o cadenas de conexión escritas en el código fuente.
- Consultas SQL construidas por concatenación de cadenas.
- Ausencia de control de autorización en una ruta que modifica datos.
- Incumplimiento de la regla de dominio: permitir editar un reporte resuelto.
- Archivos de dependencias (node_modules) o archivos .env incluidos en el commit.

---

# 6. BACKLOG Y TABLERO DE TAREAS PRIORIZADO

## 6.1 Configuración del tablero

Herramienta utilizada: **Trello**. Enlace al tablero: [URL del tablero].

| Columna | Límite WIP | Criterio de entrada | Criterio de salida |
|---------|-----------|---------------------|--------------------|
| Backlog | — | Tarea redactada como historia de usuario con criterios de aceptación | Priorizada y estimada |
| Por hacer | 10 | Seleccionada para el sprint y cumple la Definición de Listo | Asignada a una persona |
| En progreso | 2 por persona | Existe una rama creada con el ID de la tarea | Código terminado y autoverificado |
| En revisión | 4 | Pull request abierto con la plantilla diligenciada | Aprobado por un revisor |
| En pruebas | 4 | Integrado en develop y desplegado en pruebas | Criterios de aceptación verificados |
| Terminado | — | Cumple íntegramente la Definición de Terminado | — |

## 6.2 Criterios de priorización

La priorización combina MoSCoW con el valor funcional y la dependencia técnica. Ante igualdad de prioridad, se ejecuta primero la tarea que desbloquea más trabajo pendiente.

| Prioridad | Significado | Regla de asignación |
|-----------|-------------|--------------------|
| Must (M) | Imprescindible para que el sistema funcione | Sin esto no hay producto entregable |
| Should (S) | Importante, pero el sistema opera sin ello | Se planifica tras completar todos los Must |
| Could (C) | Deseable; mejora la experiencia | Solo si sobra capacidad en el sprint |
| Won't (W) | Fuera del alcance de esta versión | Queda registrada para versiones posteriores |

## 6.3 Backlog priorizado del proyecto Micron

| ID | Historia de usuario | RF | Prioridad |
|----|---------------------|-----|-----------|
| MIC-01 | Como usuario quiero registrarme e iniciar sesión para acceder al sistema | RF-01 | Must |
| MIC-02 | Como administrador quiero gestionar usuarios y roles | RF-02 | Must |
| MIC-03 | Como ciudadano quiero crear un reporte con ubicación y evidencia | RF-03 | Must |
| MIC-04 | Como operario quiero cambiar el estado de un reporte y dejar seguimiento | RF-04 | Must |
| MIC-05 | Como usuario quiero ver los reportes en un mapa con filtros | RF-05 | Should |
| MIC-06 | Como ciudadano quiero recibir notificaciones del avance de mi reporte | RF-08 | Should |
| MIC-07 | Como supervisor quiero un dashboard con estadísticas por zona | RF-10 | Could |
| MIC-08 | Como usuario quiero exportar reportes a PDF | — | Won't |

---

# 7. CONTROL DE VERSIONES DEL DOCUMENTO

| Versión | Fecha | Descripción del cambio | Autor | Aprobado por |
|---------|-------|------------------------|-------|--------------|
| 1.0 | 10/10/26 | Emisión inicial del plan técnico y los estándares de construcción | Robinson Turriago | Instructor_01 |

---

## ANEXO: RIESGOS TÉCNICOS Y MITIGACIÓN

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| Inconsistencia de datos entre frontend y backend | Alto | Media | Validación en ambas capas y contratos de API documentados |
| Fugas de credenciales en el repositorio | Alto | Baja | Uso de .env y .gitignore; criterio de bloqueo en revisión |
| Inyección SQL | Alto | Baja | Consultas siempre parametrizadas con `?` |
| Pérdida de datos por eliminación accidental | Medio | Baja | Respaldos periódicos con mysqldump; confirmación antes de eliminar |
| Deuda técnica por falta de estándares | Medio | Media | Este plan técnico + revisión de código obligatoria |
