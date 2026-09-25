# API SmartOrder

Base URL: `http://localhost:3000/api`

La autenticación utiliza:

`Authorization: Bearer <token>`

Endpoints principales:

- POST /auth/register
- POST /auth/login
- GET /auth/me
- GET /products
- POST /products
- PUT /products/:id
- PATCH /products/:id/status
- GET /categories
- POST /categories
- PUT /categories/:id
- DELETE /categories/:id
- GET /orders
- GET /orders/:id
- POST /orders
- PATCH /orders/:id/status
- POST /orders/:id/cancel
- GET /inventory
- PATCH /inventory/:productId
- GET /users
- PATCH /users/:id/status
