import { Router } from 'express';
import { registerController, loginController, meController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', (_req, res) => res.status(204).send());
router.get('/me', authenticate, meController);

export default router;
