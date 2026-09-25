# SmartOrder

Sistema web de gestión de ventas, pedidos e inventario para un proyecto académico de Aseguramiento de la Calidad.

## Arquitectura

- Frontend: React + Vite
- Backend: Node.js + Express
- ORM: Prisma
- Base de datos: PostgreSQL
- Autenticación: JWT + bcrypt

## Requisitos

- Node.js 20+
- PostgreSQL 15+
- npm

## Estructura

```text
smartorder/
├── backend/
├── frontend/
├── docs/
└── README.md
```

## Configuración rápida

### Backend

```bash
cd backend
npm install
copy .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

En Linux/macOS sustituye `copy` por `cp`.

Backend: `http://localhost:3000`

### Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## Usuarios de demostración

- Administrador: `admin@smartorder.local` / `Admin1234`
- Vendedor: `vendedor@smartorder.local` / `Vendedor123`
- Cliente: `cliente@smartorder.local` / `Cliente123`

Estas credenciales son únicamente para desarrollo académico.

## Reglas críticas

- Cantidad >= 1
- Inventario >= 0
- Precio > 0
- Correo único
- Descuentos: <500 = 0%, 500-999.99 = 5%, 1000-1999.99 = 10%, >=2000 = 15%
- Solo pedidos PENDIENTES pueden cancelarse por el cliente
- Transiciones válidas:
  - PENDIENTE -> CONFIRMADO/CANCELADO/RECHAZADO
  - CONFIRMADO -> EN_PREPARACION
  - EN_PREPARACION -> ENVIADO
  - ENVIADO -> ENTREGADO

## API

Prefijo: `/api`

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /products`
- `POST /products`
- `PUT /products/:id`
- `PATCH /products/:id/status`
- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`
- `GET /orders`
- `GET /orders/:id`
- `POST /orders`
- `PATCH /orders/:id/status`
- `POST /orders/:id/cancel`
- `GET /inventory`
- `PATCH /inventory/:productId`
- `GET /users`
- `PATCH /users/:id/status`

## Nota de calidad

Este proyecto se ha estructurado para facilitar pruebas de:
- partición de equivalencia;
- valores límite;
- tablas de decisión;
- transición de estados.
