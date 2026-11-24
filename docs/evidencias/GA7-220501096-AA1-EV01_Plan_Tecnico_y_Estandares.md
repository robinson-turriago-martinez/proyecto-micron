# PLAN TÉCNICO Y ESTÁNDARES DE CONSTRUCCIÓN

## Proyecto Micron — Sistema Ciudadano de Reporte de Microbasureros Urbanos

---

**Aprendiz:** Robinson Turriago  
**Programa de formación:** Análisis y Desarrollo de Software  
**Código de evidencia:** GA7-220501096-AA1-EV01  
**RAP:** 220501096-01  
**Instructor:** Jorge David Ortiz Rojas  
**Centro de formación:** SENA - Centro Agroindustrial, Regional Quindío  
**Periodo:** 12/10/26 - 25/10/26

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
│   ├── api/                       # fase backend (MIC-01b en adelante): httpClient.js, *.api.js
│   ├── components/
│   │   ├── ui/                    # piezas reutilizables: Boton, CampoTexto, Tabla, Modal, MapaPlaceholder
│   │   └── layout/                # Header, Sidebar, Layout, Notificaciones
│   ├── config/perfiles.js         # menú y datos de cabecera por rol
│   ├── context/DatosContext.jsx   # estado global con datos de prueba (reemplaza a api/ hasta el backend)
│   ├── data/datosPrueba.js        # datos de prueba, separados de los componentes
│   ├── features/                  # una carpeta por tema del negocio
│   │   ├── auth/pages/            # RF-01: LoginPage, RegistroPage
│   │   ├── usuarios/              # RF-02: components/, hooks/, pages/, utils/
│   │   ├── reportes/              # RF-03 y RF-04: components/, hooks/, pages/, utils/
│   │   └── mapa/pages/            # RF-05: MapaMonitoreoPage
│   ├── pages/                     # páginas transversales: ErrorPage, NoEncontradaPage
│   ├── routes/AppRouter.jsx       # todas las rutas en un solo lugar
│   ├── styles/auth.css            # estilos compartidos de formularios y tarjetas
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── public/
├── .env.example
├── .eslintrc.json
└── vite.config.js
```

- Un componente dentro de `features/` no se importa desde otra feature. Si se necesita en dos, se promueve a `components/ui/`.
- Ninguna página invoca axios directamente: siempre a través de `src/api/` cuando el backend exista. Mientras tanto, los datos llegan desde `DatosContext` y `data/datosPrueba.js`, y se reemplazarán sin tocar las páginas.
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

### .eslintrc.json (frontend)
```json
{
  "root": true,
  "env": { "browser": true, "es2022": true, "node": true },
  "parserOptions": { "ecmaVersion": "latest", "sourceType": "module", "ecmaFeatures": { "jsx": true } },
  "settings": { "react": { "version": "18.3" } },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "react/prop-types": "off",
    "no-unused-vars": "error",
    "eqeqeq": "error",
    "prefer-const": "error",
    "no-var": "error",
    "no-console": ["error", { "allow": ["warn", "error"] }]
  }
}
```
Comandos del frontend: ``npm run lint``, ``npm run format`` y ``npm run format:check``. El fin de línea LF se fuerza con ``.gitattributes``.
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

**Alcance en este proyecto.** Micron lo desarrolla una sola persona, por lo que hasta que se sume otro integrante la revisión por pares se reemplaza por tres controles: la autorrevisión con la lista de la sección 5.3 diligenciada en cada pull request, la verificación automática (lint, pruebas y build) y la revisión del instructor al entregar. Los pull requests integrados hasta la versión 1.1 de este documento se aprobaron así. Cuando haya un segundo integrante rige la regla completa.

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

Herramienta utilizada: **GitHub Projects** (ver sección 6.4).

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

Cada historia lleva criterios de aceptación verificables y una estimación en puntos de historia (escala 1, 2, 3, 5, 8). Los IDs `MIC-NN` se usan igual en el tablero, en los nombres de rama y en los mensajes de commit.

| ID | Historia de usuario | RF | Prioridad | Puntos |
|----|---------------------|-----|-----------|--------|
| MIC-01 | Como usuario quiero registrarme e iniciar sesión para acceder al sistema | RF-01 | Must | 5 |
| MIC-02 | Como administrador quiero gestionar usuarios y roles | RF-02 | Must | 5 |
| MIC-03 | Como ciudadano quiero crear un reporte con ubicación y evidencia | RF-03 | Must | 8 |
| MIC-04 | Como operario quiero cambiar el estado de un reporte y dejar seguimiento | RF-04 | Must | 5 |
| MIC-05 | Como usuario quiero ver los reportes en un mapa con filtros | RF-05 | Should | 5 |
| MIC-06 | Como ciudadano quiero recibir notificaciones del avance de mi reporte | RF-08 | Should | 3 |
| MIC-07 | Como supervisor quiero un dashboard con estadísticas por zona | RF-10 | Could | 3 |
| MIC-08 | Como usuario quiero exportar reportes a PDF | — | Won't | — |

### Criterios de aceptación por historia

| ID | Criterios de aceptación |
|----|-------------------------|
| MIC-01 | 1) Con credenciales válidas se inicia sesión y se redirige según el rol. 2) Con credenciales inválidas se muestra un error y no se inicia sesión. 3) No se aceptan cédula ni correo ya registrados. 4) La contraseña se guarda con hash bcrypt. |
| MIC-02 | 1) Solo el administrador accede al módulo. 2) Se puede crear, editar, inhabilitar y eliminar un usuario. 3) Se puede asignar uno de los cuatro roles. |
| MIC-03 | 1) El formulario valida campos obligatorios y longitud mínima de la descripción. 2) Se guarda la ubicación con coordenadas válidas. 3) El reporte nace en estado «Nuevo». |
| MIC-04 | 1) Un reporte «Resuelto» o «No procede» no se puede modificar. 2) Cada cambio de estado crea un registro de seguimiento con usuario y fecha. |
| MIC-05 | 1) El mapa muestra los reportes con color según su estado. 2) Los filtros por estado actualizan los marcadores mostrados. |
| MIC-06 | 1) Al cambiar el estado se genera una notificación para el ciudadano. 2) Las no leídas se distinguen de las leídas. |
| MIC-07 | 1) Se muestra el total de reportes por zona. 2) Solo supervisor y administrador acceden. |
| MIC-08 | Fuera del alcance de esta versión. Queda registrada para versiones posteriores. |

### Desglose en tareas técnicas

Las historias se dividen en tareas que se pueden completar en una rama. Cada tarea se identifica con el ID de la historia y un sufijo.

| Tarea | Descripción | Capa |
|-------|-------------|------|
| MIC-01a | Migración y tabla `usuarios` y `roles` | Base de datos |
| MIC-01b | Endpoints `POST /auth/registro` y `POST /auth/login` con bcrypt y JWT | Backend |
| MIC-01c | Conectar Login y Registro a la API con validaciones | Frontend |
| MIC-02a | CRUD de usuarios en `/api/v1/usuarios` con middleware `autorizar` | Backend |
| MIC-02b | Conectar la pantalla de gestión de usuarios a la API | Frontend |
| MIC-03a | Endpoint `POST /reportes` con validación de coordenadas | Backend |
| MIC-03b | Conectar el formulario de creación de reporte a la API | Frontend |
| MIC-04a | Servicio de cambio de estado con regla de reporte cerrado | Backend |
| MIC-04b | Registro automático en `seguimientos` | Backend |
| MIC-04c | Pantalla de detalle conectada al cambio de estado | Frontend |
| MIC-05a | Endpoint `GET /mapa/reportes` con filtros | Backend |
| MIC-05b | Conectar el mapa a la API | Frontend |

## 6.4 Tablero en GitHub Projects

El tablero se mantiene en **GitHub Projects**, dentro del mismo repositorio, para que cada tarea quede enlazada con sus ramas, commits y pull requests. Enlace al tablero: https://github.com/users/robinson-turriago-martinez/projects/1

Las columnas del tablero son las definidas en la sección 6.1.

---
# 7. ESTRATEGIA DE RAMAS Y CONVENCIÓN DE COMMITS

## 7.1 Estrategia de ramas

Se usa un flujo simplificado basado en Git Flow, adecuado para un equipo pequeño.

| Rama | Propósito | Quién escribe en ella | Se integra en |
|------|-----------|----------------------|---------------|
| `main` | Versión estable y entregable | Solo por pull request desde `develop` | — |
| `develop` | Integración del trabajo en curso | Solo por pull request desde ramas de trabajo | `main` |
| `feature/MIC-NN-descripcion` | Una historia o tarea del backlog | El autor de la tarea | `develop` |
| `fix/MIC-NN-descripcion` | Corrección de un defecto | El autor de la corrección | `develop` |
| `hotfix/descripcion` | Corrección urgente sobre `main` | El autor, con revisión inmediata | `main` y `develop` |

Reglas:

- Nadie hace commit directamente en `main` ni en `develop`.
- El nombre de la rama lleva el ID de la tarea del backlog y una descripción en kebab-case: `feature/MIC-01b-login-api`.
- Una rama se elimina después de integrarse.
- Antes de abrir un pull request, la rama de trabajo se actualiza con los últimos cambios de `develop`.

## 7.2 Convención de mensajes de commit

Formato: `tipo(alcance): descripción en infinitivo o presente`, en minúscula, sin punto final y de máximo 72 caracteres. Si hace falta explicar más, se agrega un cuerpo separado por una línea en blanco.

| Tipo | Cuándo se usa |
|------|---------------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de un defecto |
| `docs` | Cambios solo en documentación |
| `refactor` | Cambio de código sin alterar el comportamiento |
| `test` | Agregar o corregir pruebas |
| `chore` | Tareas de mantenimiento: configuración, dependencias |
| `style` | Formato sin cambio de lógica |

El alcance es el módulo afectado: `auth`, `usuarios`, `reportes`, `mapa`, `db`, `docs`.

Ejemplos correctos:

```
feat(auth): agrega endpoint de inicio de sesión (MIC-01b)
fix(reportes): impide editar un reporte resuelto (MIC-04a)
docs(readme): agrega pasos de instalación
chore(db): agrega migración de la tabla usuarios (MIC-01a)
```

Ejemplos rechazados: `cambios`, `arreglé cosas`, `WIP`, `Update file.js`.

---

# 8. RIESGOS TÉCNICOS Y MEDIDAS DE MITIGACIÓN

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| Inconsistencia de datos entre frontend y backend | Alto | Media | Validación en ambas capas y contratos de API documentados |
| Fugas de credenciales en el repositorio | Alto | Baja | Uso de `.env` y `.gitignore`; criterio de bloqueo en revisión |
| Inyección SQL | Alto | Baja | Consultas siempre parametrizadas con `?` |
| Pérdida de datos por eliminación accidental | Medio | Baja | Respaldos periódicos con mysqldump; confirmación antes de eliminar |
| Conflictos de integración entre ramas | Medio | Media | Ramas cortas, actualizar desde `develop` antes del PR y resolver conflictos de inmediato |
| Retraso por dependencia del backend aún no construido | Medio | Alta | Mantener el frontend con datos de prueba hasta que cada endpoint esté listo |
| Deuda técnica por falta de estándares | Medio | Media | Este plan técnico y la revisión de código obligatoria |

---

# 9. CONTROL DE VERSIONES DEL DOCUMENTO

| Versión | Fecha | Descripción del cambio | Autor | Aprobado por |
|---------|-------|------------------------|-------|--------------|
| 1.0 | 10/10/26 | Emisión inicial del plan técnico y los estándares de construcción | Robinson Turriago | Instructor_01 |
| 1.1 | 23/11/26 | Alinea el plan con el código: estructura real del frontend, configuración de ESLint del frontend, nota sobre la revisión en equipo unitario y nombre de archivo GA7 | Robinson Turriago | Pendiente |

---
