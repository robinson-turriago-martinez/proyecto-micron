# DISEÑO E IMPLEMENTACIÓN INICIAL DEL FRONTEND

## GA6-220501096-AA3/AA4-EV01 — Documento de Validación

---

**Aprendiz:** Robinson Turriago  
**Programa de formación:** Análisis y Desarrollo de Software  
**Competencia:** 220501096 | **RAP:** 220501096-03  
**Instructor:** Jorge David Ortiz Rojas  
**Centro de formación:** SENA - Centro Agroindustrial, Regional Quindío  
**Proyecto:** Micron - Sistema de Reporte de Microbasureros  
**Tecnología:** React 18 + Vite + React Router  
**Fecha:** Octubre 2026

---

## TABLA DE CONTENIDO

1. Introducción
2. Tecnologías y estructura del proyecto
3. Cómo ejecutar el proyecto
4. Páginas implementadas
5. Componentes reutilizables
6. Navegación (React Router)
7. Formularios y validaciones
8. Diseño responsivo y accesibilidad
9. Comparación: prototipo vs. implementación
10. Ajustes realizados y justificación
11. Conclusiones

---

## 1. INTRODUCCIÓN

Este documento valida la primera versión funcional del frontend del sistema **Micron**, desarrollada en React a partir de los prototipos y el diseño de interfaz definidos en las fases anteriores. En esta etapa, la interfaz es navegable y está preparada para consumir la estructura de datos, pero aún no se conecta a servicios ni a la base de datos (los datos mostrados son de ejemplo).

El objetivo es demostrar la coherencia entre la implementación y el prototipo aprobado, documentando qué corresponde exactamente y qué se ajustó, con su respectiva justificación.

---

## 2. TECNOLOGÍAS Y ESTRUCTURA DEL PROYECTO

### Tecnologías utilizadas

| Tecnología | Uso |
|------------|-----|
| React 18 | Librería de interfaz basada en componentes |
| Vite | Herramienta de construcción y servidor de desarrollo |
| React Router 6 | Navegación entre vistas (SPA) |
| CSS | Estilos con variables (paleta Micron) y media queries |

### Estructura de carpetas

```
micron-frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                  (punto de entrada)
    ├── App.jsx                   (definición de rutas)
    ├── index.css                 (estilos globales + accesibilidad)
    ├── components/               (componentes reutilizables)
    │   ├── Sidebar.jsx / .css
    │   ├── Header.jsx / .css
    │   ├── Layout.jsx / .css
    │   ├── MapaPlaceholder.jsx / .css
    │   └── Notificaciones.jsx / .css
    └── pages/                    (vistas/páginas)
        ├── Login.jsx
        ├── Registro.jsx
        ├── ErrorPage.jsx
        ├── DashboardCiudadano.jsx
        ├── CrearReporte.jsx
        ├── ListaReportes.jsx
        ├── DetalleReporte.jsx
        ├── MapaMonitoreo.jsx
        ├── DashboardSupervision.jsx
        ├── GestionUsuarios.jsx
        └── Auth.css              (estilos compartidos de formularios)
```

---

## 3. CÓMO EJECUTAR EL PROYECTO

```bash
# 1. Entrar a la carpeta del proyecto
cd micron-frontend

# 2. Instalar dependencias (solo la primera vez)
npm install

# 3. Arrancar el servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
http://localhost:5173/
```

Para generar la versión de producción: `npm run build`

---

## 4. PÁGINAS IMPLEMENTADAS

| # | Página | Ruta | Requisito | Rol |
|---|--------|------|-----------|-----|
| 1 | Login | `/login` | RF.001 | Todos |
| 2 | Registro | `/registro` | RF.001 | Todos |
| 3 | Pantalla de Error | `/error` | — | Todos |
| 4 | Dashboard Ciudadano | `/dashboard` | RF.005, RF.008 | Ciudadano |
| 5 | Crear Reporte | `/crear-reporte` | RF.003 | Ciudadano |
| 6 | Lista de Reportes | `/reportes` | RF.004, RF.007 | Operario |
| 7 | Detalle del Reporte | `/detalle-reporte` | RF.004 | Operario |
| 8 | Mapa de Monitoreo | `/mapa` | RF.006 | Todos |
| 9 | Dashboard Supervisión | `/supervision` | RF.010 | Supervisor |
| 10 | Gestión de Usuarios | `/usuarios` | RF.002 | Administrador |

---

## 5. COMPONENTES REUTILIZABLES

| Componente | Función | Reutilizado en |
|------------|---------|----------------|
| `Sidebar` | Menú de navegación lateral configurable por rol | Todas las páginas internas |
| `Header` | Encabezado con título, usuario y notificaciones | Todas las páginas internas |
| `Layout` | Estructura sidebar + área de contenido | Todas las páginas internas |
| `MapaPlaceholder` | Representación visual del mapa con marcadores | Mapa de Monitoreo, Detalle |
| `Notificaciones` | Campana con badge y panel desplegable | Header (Dashboard Ciudadano) |

Además, se definieron clases CSS reutilizables para: tarjetas de estadísticas (`stat-card`), tablas (`table-card`), badges de estado (`badge-nuevo`, `badge-proceso`, etc.) y botones (`btn-primary`, `btn-outline`).

---

## 6. NAVEGACIÓN (REACT ROUTER)

La navegación se implementó con **React Router 6**, definiendo todas las rutas en `App.jsx`. El flujo sigue el mapa de navegación aprobado:

```
Login → (valida) → Dashboard Ciudadano
Login → Registro → (vuelve a) Login
Login → Error → (vuelve a) Login

Dashboard → Crear Reporte → (vuelve a) Dashboard
Dashboard → Detalle Reporte
Dashboard / Reportes / Supervisión → Mapa

Reportes → Detalle → (actualiza y vuelve a) Reportes
Supervisión → Usuarios / Reportes / Mapa
```

La navegación se realiza mediante:
- `<NavLink>` en el sidebar (resalta la opción activa)
- `useNavigate()` para redirecciones tras acciones (login, envío de formularios)
- `<Link>` para enlaces entre páginas de autenticación

---

## 7. FORMULARIOS Y VALIDACIONES

Todos los formularios son **controlados** (el estado de React maneja los valores con `useState`).

### Login (`/login`)
| Campo | Validación |
|-------|-----------|
| Usuario | Obligatorio |
| Contraseña | Obligatorio, mínimo 6 caracteres |

### Registro (`/registro`)
| Campo | Validación |
|-------|-----------|
| Nombres | Obligatorio |
| Apellidos | Obligatorio |
| Cédula | Obligatorio, solo números |
| Fecha de nacimiento | Obligatorio |
| Correo | Obligatorio, formato de email válido |
| Contraseña | Obligatorio, mínimo 8 caracteres |

### Crear Reporte (`/crear-reporte`)
| Campo | Validación |
|-------|-----------|
| Descripción | Obligatorio, mínimo 10 caracteres |
| Tipo de residuo | Obligatorio (select) |
| Nivel de afectación | Obligatorio (select) |
| Dirección | Obligatorio |

### Detalle - Actualizar estado (`/detalle-reporte`)
| Campo | Validación |
|-------|-----------|
| Nuevo estado | Obligatorio (select) |
| Comentario | Obligatorio |

Los errores se muestran debajo de cada campo con texto rojo y se marca el atributo `aria-invalid` para accesibilidad.

---

## 8. DISEÑO RESPONSIVO Y ACCESIBILIDAD

### Diseño responsivo
- **Media queries** en 768px y 480px.
- En pantallas pequeñas, el sidebar pasa de vertical (lateral) a horizontal (arriba).
- Las cuadrículas de estadísticas (`stats-grid`) pasan de 4 columnas a 2 y luego a 1 columna.
- Los formularios de dos columnas (`form-row`) pasan a una sola columna.
- Las tablas tienen scroll horizontal en móvil (`overflow-x: auto`).

### Accesibilidad
| Criterio | Implementación |
|----------|----------------|
| Etiquetas en formularios | Todos los inputs tienen `<label htmlFor>` asociado |
| Navegación por teclado | Foco visible (`:focus-visible`) en todos los elementos interactivos |
| Contraste | Texto oscuro (#1F2937) sobre fondos claros, cumple ratio 4.5:1 |
| Textos alternativos | Íconos con `aria-hidden`, imágenes con roles descriptivos |
| Estados accesibles | `aria-invalid` en campos con error, `aria-expanded` en el panel de notificaciones |
| Etiquetas ARIA | `aria-label` en botones de ícono y en la barra de navegación |

---

## 9. COMPARACIÓN: PROTOTIPO VS. IMPLEMENTACIÓN

| Elemento del prototipo | Implementación en React | ¿Corresponde? |
|------------------------|-------------------------|---------------|
| Login (logo, usuario, contraseña, botón) | Página Login con formulario controlado | ✅ Fiel |
| Registro (nombres, apellidos, cédula, fecha) | Página Registro con todos los campos | ✅ Fiel |
| Pantalla de error (ícono, causas, botón) | Página ErrorPage | ✅ Fiel |
| Dashboard con stats y tabla de reportes | DashboardCiudadano con 4 stats y tabla | ✅ Fiel |
| Crear reporte (descripción, tipo, nivel, ubicación) | CrearReporte con validaciones | ✅ Fiel (ver ajuste 1) |
| Mapa de incidencias (filtros + marcadores) | MapaMonitoreo con MapaPlaceholder | ✅ Fiel (ver ajuste 2) |
| Lista de reportes (tabla con filtros) | ListaReportes con búsqueda y filtros | ✅ Fiel |
| Detalle del reporte (info + fotos + mapa) | DetalleReporte completo | ✅ Fiel |
| Dashboard supervisión (stats + zonas) | DashboardSupervision | ✅ Fiel |
| Gestión de usuarios (stats + tabla) | GestionUsuarios con roles y estados | ✅ Fiel |
| Paleta de colores (azul, blanco, gris) | Variables CSS (--azul #2563EB, etc.) | ✅ Fiel |

---

## 10. AJUSTES REALIZADOS Y JUSTIFICACIÓN

| # | Ajuste | Justificación |
|---|--------|---------------|
| 1 | El formulario de Crear Reporte muestra campos de latitud/longitud en lugar del botón "usar mi ubicación actual" del prototipo | En esta fase no hay conexión a la API de geolocalización del navegador; se dejan campos de texto preparados para integrarse después |
| 2 | El mapa se representa con un **placeholder visual** (cuadrícula + marcadores) en vez de un mapa real de Leaflet/OpenStreetMap | Se acordó mantener la versión liviana sin dependencias externas en esta etapa; la estructura queda lista para integrar un mapa real en la fase de conexión a servicios |
| 3 | Las fotos de evidencia se muestran como placeholders (📷 Foto 1, 2, 3) | Aún no hay backend ni almacenamiento de archivos; se representa el espacio donde irán las imágenes reales |
| 4 | Los datos de reportes, usuarios y estadísticas son de ejemplo (hardcoded) | La evidencia especifica que en esta etapa la interfaz aún no se conecta a servicios; los datos simulan la estructura real de la base de datos |
| 5 | El login redirige directamente al dashboard sin validar credenciales reales | No hay autenticación backend en esta fase; se valida solo el formato de los campos |

Todos los ajustes mantienen la **coherencia visual y estructural** con el prototipo y dejan la interfaz preparada para la siguiente fase (conexión con los servicios).

---

## 11. CONCLUSIONES

1. **Implementación completa de vistas:** Se implementaron las 10 páginas principales previstas en el prototipo como componentes de React, con navegación coherente mediante React Router.

2. **Componentes reutilizables:** Se construyeron 5 componentes reutilizables (Sidebar, Header, Layout, MapaPlaceholder, Notificaciones) que garantizan consistencia visual y facilitan el mantenimiento del código.

3. **Formularios validados:** Los formularios principales son controlados e incluyen validaciones de obligatoriedad, formato (correo, cédula) y longitud (contraseña, descripción), cumpliendo los requerimientos.

4. **Responsivo y accesible:** La interfaz se adapta a distintos tamaños de pantalla mediante media queries e incorpora criterios de accesibilidad (etiquetas, contraste, navegación por teclado, atributos ARIA).

5. **Coherencia con el prototipo:** La implementación es fiel al prototipo aprobado; los ajustes realizados se justifican por la ausencia de backend en esta fase y dejan la estructura preparada para la integración con los servicios.

6. **Alineación con los artefactos previos:** Los campos de los formularios y las vistas corresponden con el modelo de datos (entidades Usuario, Reporte, Ubicación, etc.) y los 12 requisitos funcionales definidos en las fases anteriores.

---

## ANEXO: EVIDENCIAS VISUALES SUGERIDAS

Captura las siguientes pantallas en `http://localhost:5173/` para el entregable de evidencias:

1. Login (con validación de error al enviar vacío)
2. Registro (todos los campos)
3. Dashboard Ciudadano (con panel de notificaciones abierto)
4. Crear Reporte (con validaciones visibles)
5. Lista de Reportes (con filtro aplicado)
6. Detalle del Reporte
7. Mapa de Monitoreo (con marcadores)
8. Dashboard Supervisión
9. Gestión de Usuarios
10. Vista responsiva (ventana angosta / móvil)
