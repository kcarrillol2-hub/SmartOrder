import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/', authenticate, authorize('ADMINISTRADOR'), async (_req, res, next) => {
  try {
    const users = await prisma.usuario.findMany({
      select: { id: true, nombre: true, correo: true, rol: true, activo: true, createdAt: true },
      orderBy: { id: 'asc' }
    });
    res.json({ success: true, users });
  } catch (e) { next(e); }
});

router.patch('/:id/status', authenticate, authorize('ADMINISTRADOR'), async (req, res, next) => {
  try {
    const user = await prisma.usuario.update({
      where: { id: Number(req.params.id) },
      data: { activo: Boolean(req.body.activo) },
      select: { id: true, nombre: true, correo: true, rol: true, activo: true }
    });
    res.json({ success: true, user });
  } catch (e) { next(e); }
});

export default router;
