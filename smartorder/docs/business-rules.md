# Reglas de negocio

1. El correo del usuario es único.
2. La contraseña debe tener al menos 8 caracteres, una letra y un número.
3. Solo productos activos pueden venderse.
4. La cantidad solicitada debe ser >= 1.
5. La cantidad solicitada no puede superar el inventario.
6. El precio debe ser > 0.
7. Descuentos: <500=0%, 500-999.99=5%, 1000-1999.99=10%, >=2000=15%.
8. Un pedido no puede estar vacío.
9. La confirmación actualiza inventario de forma transaccional.
10. Solo PENDIENTE puede cancelarse por el cliente.
11. Las transiciones de estado son controladas.
