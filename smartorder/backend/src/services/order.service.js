import { prisma } from '../lib/prisma.js';

export function getDiscountRate(subtotal) {
  const value = Number(subtotal);
  if (value >= 2000) return 0.15;
  if (value >= 1000) return 0.10;
  if (value >= 500) return 0.05;
  return 0;
}

export const transitions = {
  PENDIENTE: ['CONFIRMADO', 'CANCELADO', 'RECHAZADO'],
  CONFIRMADO: ['EN_PREPARACION'],
  EN_PREPARACION: ['ENVIADO'],
  ENVIADO: ['ENTREGADO'],
  ENTREGADO: [],
  CANCELADO: [],
  RECHAZADO: []
};

export async function createOrder(userId, items) {
  if (!Array.isArray(items) || items.length === 0) {
    const e = new Error('El pedido debe contener al menos un producto');
    e.status = 400; e.expose = true; throw e;
  }

  const unique = new Map();
  for (const item of items) {
    const productId = Number(item.productId);
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      const e = new Error('La cantidad debe ser un entero mayor o igual a 1');
      e.status = 400; e.expose = true; throw e;
    }
    unique.set(productId, (unique.get(productId) || 0) + quantity);
  }

  return prisma.$transaction(async (tx) => {
    let subtotal = 0;
    const details = [];

    for (const [productId, quantity] of unique) {
      const product = await tx.producto.findUnique({ where: { id: productId } });
      if (!product || !product.activo) {
        const e = new Error(`Producto ${productId} no disponible`);
        e.status = 400; e.expose = true; throw e;
      }
      if (quantity > product.inventario) {
        const e = new Error(`Inventario insuficiente para ${product.nombre}`);
        e.status = 409; e.expose = true; throw e;
      }

      const lineSubtotal = Number(product.precio) * quantity;
      subtotal += lineSubtotal;
      details.push({ product, quantity, lineSubtotal });
    }

    const rate = getDiscountRate(subtotal);
    const discount = subtotal * rate;
    const total = subtotal - discount;
    const number = `SO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = await tx.pedido.create({
      data: {
        numeroPedido: number,
        usuarioId: userId,
        subtotal: subtotal.toFixed(2),
        porcentajeDescuento: (rate * 100).toFixed(2),
        descuento: discount.toFixed(2),
        total: total.toFixed(2),
        detalles: {
          create: details.map(({ product, quantity, lineSubtotal }) => ({
            productoId: product.id,
            cantidad: quantity,
            precioUnitario: product.precio,
            subtotal: lineSubtotal.toFixed(2)
          }))
        }
      },
      include: { detalles: { include: { producto: true } } }
    });

    return order;
  });
}

export async function changeOrderStatus(orderId, newStatus, actorRole) {
  const order = await prisma.pedido.findUnique({ where: { id: orderId } });
  if (!order) {
    const e = new Error('Pedido no encontrado');
    e.status = 404; e.expose = true; throw e;
  }

  if (!transitions[order.estado]?.includes(newStatus)) {
    const e = new Error(`Transición no permitida: ${order.estado} -> ${newStatus}`);
    e.status = 400; e.expose = true; throw e;
  }

  if (newStatus === 'CANCELADO' && actorRole !== 'CLIENTE') {
    const e = new Error('Solo el cliente puede cancelar su pedido');
    e.status = 403; e.expose = true; throw e;
  }

  if (newStatus === 'CONFIRMADO' || newStatus === 'RECHAZADO') {
    if (!['VENDEDOR', 'ADMINISTRADOR'].includes(actorRole)) {
      const e = new Error('Permisos insuficientes para procesar el pedido');
      e.status = 403; e.expose = true; throw e;
    }
  }

  if (newStatus === 'CONFIRMADO') {
    return prisma.$transaction(async (tx) => {
      const current = await tx.pedido.findUnique({
        where: { id: orderId },
        include: { detalles: true }
      });
      if (!current) throw new Error('Pedido no encontrado');

      for (const detail of current.detalles) {
        const updated = await tx.producto.updateMany({
          where: {
            id: detail.productoId,
            activo: true,
            inventario: { gte: detail.cantidad }
          },
          data: { inventario: { decrement: detail.cantidad } }
        });
        if (updated.count !== 1) {
          const e = new Error('Inventario insuficiente al confirmar el pedido');
          e.status = 409; e.expose = true; throw e;
        }
      }

      return tx.pedido.update({
        where: { id: orderId },
        data: { estado: newStatus },
        include: { detalles: { include: { producto: true } } }
      });
    });
  }

  return prisma.pedido.update({
    where: { id: orderId },
    data: { estado: newStatus },
    include: { detalles: { include: { producto: true } } }
  });
}
