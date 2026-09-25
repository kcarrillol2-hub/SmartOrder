import React from 'react';
import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  async function load() {
    try {
      const { data } = await api.get('/products', { params: { search } });
      setProducts(data.products);
    } catch (e) { setError(e.response?.data?.message || 'Error cargando productos'); }
  }

  useEffect(() => { load(); }, []);

  async function add(product) {
    const current = JSON.parse(localStorage.getItem('smartorder_cart') || '[]');
    const existing = current.find(x => x.productId === product.id);
    if (existing) existing.quantity += 1;
    else current.push({ productId: product.id, quantity: 1, product });
    localStorage.setItem('smartorder_cart', JSON.stringify(current));
    alert('Producto agregado al carrito');
  }

  return (
    <>
      <div className="row between">
        <h1>Productos</h1>
        <div>
          <input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} />
          <button onClick={load}>Buscar</button>
        </div>
      </div>
      {error && <div className="alert error">{error}</div>}
      <div className="grid">
        {products.map(p => (
          <article className="card" key={p.id}>
            <h3>{p.nombre}</h3>
            <p>{p.descripcion || 'Sin descripción'}</p>
            <strong>Q {Number(p.precio).toFixed(2)}</strong>
            <p>Inventario: {p.inventario}</p>
            {user?.rol === 'CLIENTE' && <button className="primary" disabled={!p.inventario} onClick={() => add(p)}>Agregar</button>}
          </article>
        ))}
      </div>
    </>
  );
}
