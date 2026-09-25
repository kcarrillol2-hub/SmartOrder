import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { listProducts, createProduct, updateProduct, toggleProduct } from '../controllers/product.controller.js';

const router = Router();
router.get('/', listProducts);
router.post('/', authenticate, authorize('ADMINISTRADOR'), createProduct);
router.put('/:id', authenticate, authorize('ADMINISTRADOR'), updateProduct);
router.patch('/:id/status', authenticate, authorize('ADMINISTRADOR'), toggleProduct);
export default router;
