import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const categories = await prisma.categoria.findMany({ where: { activo: true }, orderBy: { nombre: 'asc' } });
    res.json({ success: true, categories });
  } catch (e) { next(e); }
});

router.post('/', authenticate, authorize('ADMINISTRADOR'), async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre?.trim()) return res.status(400).json({ success: false, message: 'El nombre es obligatorio' });
    const category = await prisma.categoria.create({ data: { nombre: nombre.trim(), descripcion } });
    res.status(201).json({ success: true, category });
  } catch (e) { next(e); }
});

router.put('/:id', authenticate, authorize('ADMINISTRADOR'), async (req, res, next) => {
  try {
    const category = await prisma.categoria.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.json({ success: true, category });
  } catch (e) { next(e); }
});

router.delete('/:id', authenticate, authorize('ADMINISTRADOR'), async (req, res, next) => {
  try {
    await prisma.categoria.update({ where: { id: Number(req.params.id) }, data: { activo: false } });
    res.status(204).send();
  } catch (e) { next(e); }
});

export default router;
