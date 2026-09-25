import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/', authenticate, authorize('VENDEDOR', 'ADMINISTRADOR'), async (_req, res, next) => {
  try {
    const products = await prisma.producto.findMany({
      include: { categoria: true },
      orderBy: { inventario: 'asc' }
    });
    res.json({ success: true, inventory: products });
  } catch (e) { next(e); }
});

router.get('/:productId', authenticate, authorize('VENDEDOR', 'ADMINISTRADOR'), async (req, res, next) => {
  try {
    const product = await prisma.producto.findUnique({ where: { id: Number(req.params.productId) } });
    if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    res.json({ success: true, product });
  } catch (e) { next(e); }
});

router.patch('/:productId', authenticate, authorize('VENDEDOR', 'ADMINISTRADOR'), async (req, res, next) => {
  try {
    const quantity = Number(req.body.inventario);
    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({ success: false, message: 'El inventario debe ser un entero >= 0' });
    }
    const product = await prisma.producto.update({
      where: { id: Number(req.params.productId) },
      data: { inventario: quantity }
    });
    res.json({ success: true, product });
  } catch (e) { next(e); }
});

export default router;
