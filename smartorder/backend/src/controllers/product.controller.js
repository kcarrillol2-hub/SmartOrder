import { prisma } from '../lib/prisma.js';

export async function listProducts(req, res, next) {
  try {
    const { search, categoryId, all } = req.query;
    const where = {};
    if (all !== 'true') where.activo = true;
    if (search) where.nombre = { contains: String(search), mode: 'insensitive' };
    if (categoryId) where.categoriaId = Number(categoryId);
    const products = await prisma.producto.findMany({
      where,
      include: { categoria: true },
      orderBy: { id: 'asc' }
    });
    res.json({ success: true, products });
  } catch (e) { next(e); }
}

export async function createProduct(req, res, next) {
  try {
    const { nombre, descripcion, precio, inventario, categoriaId } = req.body;
    if (!nombre || Number(precio) <= 0 || !Number.isInteger(Number(inventario)) || Number(inventario) < 0) {
      return res.status(400).json({ success: false, message: 'Datos de producto inválidos' });
    }
    const category = await prisma.categoria.findUnique({ where: { id: Number(categoriaId) } });
    if (!category) return res.status(400).json({ success: false, message: 'Categoría inexistente' });

    const product = await prisma.producto.create({
      data: { nombre, descripcion, precio, inventario: Number(inventario), categoriaId: Number(categoriaId) },
      include: { categoria: true }
    });
    res.status(201).json({ success: true, product });
  } catch (e) { next(e); }
}

export async function updateProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion, precio, inventario, categoriaId } = req.body;
    if (precio !== undefined && Number(precio) <= 0) return res.status(400).json({ success: false, message: 'El precio debe ser mayor que cero' });
    if (inventario !== undefined && (!Number.isInteger(Number(inventario)) || Number(inventario) < 0)) return res.status(400).json({ success: false, message: 'El inventario no puede ser negativo' });
    const product = await prisma.producto.update({
      where: { id },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(descripcion !== undefined && { descripcion }),
        ...(precio !== undefined && { precio }),
        ...(inventario !== undefined && { inventario: Number(inventario) }),
        ...(categoriaId !== undefined && { categoriaId: Number(categoriaId) })
      },
      include: { categoria: true }
    });
    res.json({ success: true, product });
  } catch (e) { next(e); }
}

export async function toggleProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const current = await prisma.producto.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    const product = await prisma.producto.update({ where: { id }, data: { activo: !current.activo } });
    res.json({ success: true, product });
  } catch (e) { next(e); }
}
