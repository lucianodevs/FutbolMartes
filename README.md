# Futbol Stats Pro

Aplicación full stack para administrar estadísticas de fútbol amateur con frontend en React + Vite y backend en Node.js + Express + MySQL.

## Estructura

- `frontend/`: interfaz pública y panel administrativo
- `backend/`: API REST, autenticación JWT y lógica de negocio
- `database/schema.sql`: esquema MySQL con datos iniciales

## Requisitos

- Node.js 18 o superior
- MySQL 8 o superior

## Instalación

### 1. Base de datos

1. Crear una base de datos llamada `futbol_stats`.
2. Ejecutar el archivo `database/schema.sql`.

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

## Variables de entorno

Copiar `backend/.env.example` a `backend/.env` y ajustar los valores reales.

## Credenciales de prueba

- Email: `admin@futbol.com`
- Password: `Admin123!`

## Funcionalidades

- Landing pública con estadísticas, filtros, buscador y ranking
- Login administrativo con JWT
- Dashboard privado con sidebar y métricas
- CRUD de jugadores
- Gestión de partidos
- Estadísticas automáticas y panel de resumen
- UI responsive, moderna y minimalista
