import React from 'react';
import { useEffect, useState } from 'react';
import api from '../services/api.js';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      const { data } = await api.get('/inventory');
      setItems(data.inventory);
    } catch (e) { setError(e.response?.data?.message || 'Error'); }
  }

  useEffect(() => { load(); }, []);

  async function update(id, inventario) {
    try {
      await api.patch(`/inventory/${id}`, { inventario: Number(inventario) });
      load();
    } catch (e) { setError(e.response?.data?.message || 'No se pudo actualizar'); }
  }

  return (
    <>
      <h1>Inventario</h1>
      {error && <div className="alert error">{error}</div>}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Producto</th><th>Inventario</th><th>Acción</th></tr></thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td><input type="number" min="0" defaultValue={p.inventario} id={`inv-${p.id}`} /></td>
                <td><button onClick={() => update(p.id, document.getElementById(`inv-${p.id}`).value)}>Guardar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
