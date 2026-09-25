import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

export async function register({ nombre, correo, password }) {
  const exists = await prisma.usuario.findUnique({ where: { correo } });
  if (exists) {
    const error = new Error('El correo ya está registrado');
    error.status = 409;
    error.expose = true;
    throw error;
  }

  if (!password || password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    const error = new Error('La contraseña debe tener al menos 8 caracteres, una letra y un número');
    error.status = 400;
    error.expose = true;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.usuario.create({
    data: { nombre, correo, password: passwordHash }
  });
}

export async function login({ correo, password }) {
  const user = await prisma.usuario.findUnique({ where: { correo } });
  if (!user || !user.activo || !(await bcrypt.compare(password, user.password))) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    error.expose = true;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol
    }
  };
}
