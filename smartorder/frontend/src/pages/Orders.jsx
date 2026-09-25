import React from 'react';
import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const nextStates = {
  PENDIENTE: ['CONFIRMADO', 'RECHAZADO'],
  CONFIRMADO: ['EN_PREPARACION'],
  EN_PREPARACION: ['ENVIADO'],
  ENVIADO: ['ENTREGADO']
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      const { data } = await api.get('/orders');
      setOrders(data.orders);
    } catch (e) { setError(e.response?.data?.message || 'Error cargando pedidos'); }
  }

  useEffect(() => { load(); }, []);

  async function changeStatus(id, status) {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      load();
    } catch (e) { setError(e.response?.data?.message || 'No fue posible cambiar el estado'); }
  }

  async function cancel(id) {
    try {
      await api.post(`/orders/${id}/cancel`);
      load();
    } catch (e) { setError(e.response?.data?.message || 'No fue posible cancelar'); }
  }

  return (
    <>
      <h1>Pedidos</h1>
      {error && <div className="alert error">{error}</div>}
      {orders.map(order => (
        <article className="card" key={order.id}>
          <div className="row between">
            <div>
              <h3>{order.numeroPedido}</h3>
              <p>Estado: <span className="badge">{order.estado}</span></p>
              <p>Total: Q {Number(order.total).toFixed(2)}</p>
            </div>
            <div>
              {user.rol === 'CLIENTE' && order.estado === 'PENDIENTE' && <button onClick={() => cancel(order.id)}>Cancelar</button>}
              {(user.rol === 'VENDEDOR' || user.rol === 'ADMINISTRADOR') &&
                (nextStates[order.estado] || []).map(s => (
                  <button key={s} onClick={() => changeStatus(order.id, s)}>{s}</button>
                ))}
            </div>
          </div>
          <ul>
            {order.detalles.map(d => <li key={d.id}>{d.producto.nombre} — {d.cantidad} × Q {Number(d.precioUnitario).toFixed(2)}</li>)}
          </ul>
        </article>
      ))}
    </>
  );
}
