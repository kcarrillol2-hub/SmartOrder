# Arquitectura

SmartOrder utiliza una arquitectura cliente-servidor.

Frontend:
React + Vite

Backend:
Node.js + Express

Persistencia:
PostgreSQL + Prisma

Autenticación:
JWT + bcrypt

Flujo:

Usuario -> React -> REST API -> Servicios -> Prisma -> PostgreSQL
