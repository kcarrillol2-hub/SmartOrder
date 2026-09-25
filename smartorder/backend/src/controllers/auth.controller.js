import { login, register } from '../services/auth.service.js';

export async function registerController(req, res, next) {
  try {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) {
      return res.status(400).json({ success: false, message: 'Nombre, correo y contraseña son obligatorios' });
    }
    const user = await register({ nombre, correo, password });
    res.status(201).json({
      success: true,
      user: { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol }
    });
  } catch (e) { next(e); }
}

export async function loginController(req, res, next) {
  try {
    const result = await login(req.body);
    res.json({ success: true, ...result });
  } catch (e) { next(e); }
}

export function meController(req, res) {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      nombre: req.user.nombre,
      correo: req.user.correo,
      rol: req.user.rol
    }
  });
}
