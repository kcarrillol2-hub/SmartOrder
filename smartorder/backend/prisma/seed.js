import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const passwordHash = (password) => bcrypt.hash(password, 10);

async function main() {
  const admin = await prisma.usuario.upsert({
    where: { correo: 'admin@smartorder.local' },
    update: {},
    create: {
      nombre: 'Administrador',
      correo: 'admin@smartorder.local',
      password: await passwordHash('Admin1234'),
      rol: Role.ADMINISTRADOR
    }
  });

  await prisma.usuario.upsert({
    where: { correo: 'vendedor@smartorder.local' },
    update: {},
    create: {
      nombre: 'Vendedor Principal',
      correo: 'vendedor@smartorder.local',
      password: await passwordHash('Vendedor123'),
      rol: Role.VENDEDOR
    }
  });

  const cliente = await prisma.usuario.upsert({
    where: { correo: 'cliente@smartorder.local' },
    update: {},
    create: {
      nombre: 'Cliente Demo',
      correo: 'cliente@smartorder.local',
      password: await passwordHash('Cliente123'),
      rol: Role.CLIENTE
    }
  });

  const categoryNames = ['Electrónica', 'Hogar', 'Oficina', 'Accesorios'];
  const categories = {};
  for (const nombre of categoryNames) {
    categories[nombre] = await prisma.categoria.upsert({
      where: { nombre },
      update: {},
      create: { nombre, descripcion: `Categoría ${nombre}` }
    });
  }

  const products = [
    ['Monitor 24"', 499.99, 10, 'Electrónica'],
    ['Teclado mecánico', 500.00, 20, 'Electrónica'],
    ['Mouse inalámbrico', 250.00, 30, 'Accesorios'],
    ['Audífonos', 999.99, 8, 'Accesorios'],
    ['Webcam HD', 1000.00, 12, 'Electrónica'],
    ['Silla de oficina', 1500.00, 5, 'Oficina'],
    ['Escritorio', 1999.99, 4, 'Oficina'],
    ['Laptop empresarial', 2000.00, 3, 'Electrónica'],
    ['Lámpara LED', 350.00, 15, 'Hogar'],
    ['Organizador de escritorio', 125.00, 25, 'Oficina']
  ];

  for (const [nombre, precio, inventario, categoria] of products) {
    const existing = await prisma.producto.findFirst({ where: { nombre } });
    if (!existing) {
      await prisma.producto.create({
        data: {
          nombre,
          precio,
          inventario,
          categoriaId: categories[categoria].id
        }
      });
    }
  }

  console.log('Seed completado.');
  console.log({ admin: admin.correo, cliente: cliente.correo });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
