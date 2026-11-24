# Micron

Sistema ciudadano de reporte de microbasureros urbanos.

Los ciudadanos reportan acumulaciones ilegales de residuos (con ubicación y evidencia) y los funcionarios gestionan su atención con trazabilidad.

## Estado del proyecto

| Capa | Estado |
|------|--------|
| Base de datos (MySQL) | Modelo y scripts listos |
| Frontend (React) | Interfaz navegable con datos de prueba |
| Backend (Node.js + Express) | En planeación; ver el backlog |

El avance se sigue en el [tablero del proyecto](https://github.com/users/robinson-turriago-martinez/projects/1).

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + React Router |
| Backend | Node.js + Express |
| Base de datos | MySQL 8 (InnoDB, utf8mb4) |

## Requisitos previos

| Herramienta | Versión mínima | Para qué |
|-------------|----------------|----------|
| Node.js | 18 o superior | Ejecutar el frontend y el backend |
| npm | 9 o superior | Instalar dependencias (viene con Node.js) |
| MySQL Server | 8.0 | Base de datos |
| Git | 2.30 o superior | Control de versiones |

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/robinson-turriago-martinez/proyecto-micron.git
cd proyecto-micron
git switch develop
```

### 2. Crear la base de datos

Con MySQL en ejecución, desde la raíz del proyecto:

```bash
mysql -u root -p < database/migrations/EV2_01_ddl_micron.sql
mysql -u root -p micron < database/seeds/EV2_02_dml_insert.sql
```

El primer script crea la base `micron` con sus 10 tablas. El segundo carga datos de prueba.

### 3. Ejecutar el frontend

```bash
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173/

### 4. Backend

Aún no está implementado. Las tareas están en el tablero (MIC-01b, MIC-02a, MIC-03a, MIC-04a, MIC-05a).

## Estructura

```
proyecto-micron/
├── frontend/      # Aplicación React
├── backend/       # API REST con Node.js + Express
├── database/      # Migraciones, datos semilla y scripts SQL
├── docs/          # Documentación y evidencias
│   ├── backlog/       # Backlog en CSV
│   ├── evidencias/    # Plan técnico y documentos de cada evidencia
│   └── modelo-datos/  # Modelo entidad-relación y relacional
└── .github/       # Plantilla de pull request
```

## Flujo de trabajo

| Rama | Propósito |
|------|-----------|
| `main` | Versión estable y entregable |
| `develop` | Integración del trabajo en curso |
| `feature/MIC-NN-descripcion` | Una historia o tarea del backlog |
| `fix/MIC-NN-descripcion` | Corrección de un defecto |
| `docs/MIC-NN-descripcion` | Cambios de documentación |

Nadie hace commit directo en `main` ni en `develop`. Los cambios llegan por pull request con la plantilla de `.github/`.

## Convención de commits

`tipo(alcance): descripción`

Tipos: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`.

Ejemplo: `feat(reportes): agrega formulario de creación de reporte (MIC-03b)`

El plan técnico completo está en [docs/evidencias/GA7-220501096-AA1-EV01_Plan_Tecnico_y_Estandares.md](docs/evidencias/GA7-220501096-AA1-EV01_Plan_Tecnico_y_Estandares.md).

## Autor

Robinson Turriago Martinez, Análisis y Desarrollo de Software, SENA Centro Agroindustrial, Regional Quindío.