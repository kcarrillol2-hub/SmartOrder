import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import { createOrder, changeOrderStatus } from '../services/order.service.js';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const where = req.user.rol === 'CLIENTE' ? { usuarioId: req.user.id } : {};
    const orders = await prisma.pedido.findMany({
      where,
      include: { usuario: { select: { id: true, nombre: true, correo: true } }, detalles: { include: { producto: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, orders });
  } catch (e) { next(e); }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await prisma.pedido.findUnique({
      where: { id: Number(req.params.id) },
      include: { usuario: { select: { id: true, nombre: true, correo: true } }, detalles: { include: { producto: true } } }
    });
    if (!order) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    if (req.user.rol === 'CLIENTE' && order.usuarioId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No puede consultar este pedido' });
    }
    res.json({ success: true, order });
  } catch (e) { next(e); }
});

router.post('/', authenticate, authorize('CLIENTE'), async (req, res, next) => {
  try {
    const order = await createOrder(req.user.id, req.body.items);
    res.status(201).json({ success: true, order });
  } catch (e) { next(e); }
});

router.patch('/:id/status', authenticate, authorize('VENDEDOR', 'ADMINISTRADOR'), async (req, res, next) => {
  try {
    const order = await changeOrderStatus(Number(req.params.id), req.body.status, req.user.rol);
    res.json({ success: true, order });
  } catch (e) { next(e); }
});

router.post('/:id/cancel', authenticate, authorize('CLIENTE'), async (req, res, next) => {
  try {
    const existing = await prisma.pedido.findUnique({ where: { id: Number(req.params.id) } });
    if (!existing || existing.usuarioId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }
    const order = await changeOrderStatus(existing.id, 'CANCELADO', 'CLIENTE');
    res.json({ success: true, order });
  } catch (e) { next(e); }
});

export default router;
