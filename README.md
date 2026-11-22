# Micron

Sistema ciudadano de reporte de microbasureros urbanos.

Los ciudadanos reportan acumulaciones ilegales de residuos (con ubicación y evidencia) y los funcionarios gestionan su atención con trazabilidad.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite + React Router |
| Backend | Node.js + Express |
| Base de datos | MySQL (InnoDB, utf8mb4) |

## Estructura

```
proyecto-micron/
├── frontend/      # Aplicación React
├── backend/       # API REST con Node.js + Express
├── database/      # Migraciones, datos semilla y respaldos
├── docs/          # Documentación y evidencias
└── .github/       # Plantilla de pull request
```

## Cómo ejecutar el frontend

```bash
cd frontend
npm install
npm run dev
```

Abre http://localhost:5173/

## Flujo de trabajo

- `main`: versión estable.
- `develop`: rama de integración.
- `feature/MIC-NN-descripcion`: una rama por tarea del backlog.

Los cambios llegan a `develop` mediante pull request con revisión de al menos una persona.

## Convención de commits

`tipo(alcance): descripción`

Tipos: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

Ejemplo: `feat(reportes): agrega formulario de creación de reporte`

## Autor

Robinson Turriago — Análisis y Desarrollo de Software, SENA.