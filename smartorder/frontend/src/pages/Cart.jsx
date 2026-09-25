import React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('smartorder_cart') || '[]'));
  const [message, setMessage] = useState('');

  const subtotal = useMemo(() => items.reduce((sum, x) => sum + Number(x.product.precio) * x.quantity, 0), [items]);
  const rate = subtotal >= 2000 ? 0.15 : subtotal >= 1000 ? 0.10 : subtotal >= 500 ? 0.05 : 0;
  const discount = subtotal * rate;
  const total = subtotal - discount;

  function save(next) {
    setItems(next);
    localStorage.setItem('smartorder_cart', JSON.stringify(next));
  }

  async function createOrder() {
    setMessage('');
    try {
      await api.post('/orders', { items: items.map(x => ({ productId: x.productId, quantity: x.quantity })) });
      localStorage.removeItem('smartorder_cart');
      setItems([]);
      navigate('/orders');
    } catch (e) {
      setMessage(e.response?.data?.message || 'No fue posible crear el pedido');
    }
  }

  return (
    <>
      <h1>Carrito</h1>
      {message && <div className="alert error">{message}</div>}
      {items.length === 0 ? <div className="card">El carrito está vacío.</div> : (
        <>
          {items.map(item => (
            <div className="card row between" key={item.productId}>
              <div>
                <strong>{item.product.nombre}</strong>
                <p>Q {Number(item.product.precio).toFixed(2)} × {item.quantity}</p>
              </div>
              <div>
                <input type="number" min="1" value={item.quantity} onChange={e => {
                  const q = Number(e.target.value);
                  save(items.map(x => x.productId === item.productId ? {...x, quantity:q} : x));
                }} />
                <button onClick={() => save(items.filter(x => x.productId !== item.productId))}>Eliminar</button>
              </div>
            </div>
          ))}
          <div className="card summary">
            <p>Subtotal: <strong>Q {subtotal.toFixed(2)}</strong></p>
            <p>Descuento: <strong>{(rate * 100).toFixed(0)}%</strong> (Q {discount.toFixed(2)})</p>
            <h2>Total: Q {total.toFixed(2)}</h2>
            <button className="primary" onClick={createOrder}>Crear pedido</button>
          </div>
        </>
      )}
    </>
  );
}
